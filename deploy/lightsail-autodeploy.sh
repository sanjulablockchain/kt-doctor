#!/usr/bin/env bash
# Automatic deployment for the kt-doctor site on the Lightsail box.
#
# This is the canonical, version-controlled copy. The copy cron actually runs
# is installed at ~/bin/ktdoctor-autodeploy.sh, outside the checkout, so that
# a deploy which updates this file cannot rewrite the running script mid-run.
# See deploy/README.md for installation.
set -uo pipefail

REPO_DIR="${AUTODEPLOY_REPO_DIR:-$HOME/ktdoctor}"
BRANCH="${AUTODEPLOY_BRANCH:-main}"
PROJECT="${AUTODEPLOY_PROJECT:-ktdoctor-root}"
ENV_FILE="${AUTODEPLOY_ENV_FILE:-.env.root}"
LOG_FILE="${AUTODEPLOY_LOG_FILE:-$HOME/logs/ktdoctor-deploy.log}"
BUILD_LOG="${AUTODEPLOY_BUILD_LOG:-$HOME/logs/ktdoctor-deploy-build.log}"
LOCK_FILE="${AUTODEPLOY_LOCK_FILE:-/tmp/ktdoctor-autodeploy.lock}"
HEALTH_URL="${AUTODEPLOY_HEALTH_URL:-http://localhost:8161/}"
HEALTH_TIMEOUT="${AUTODEPLOY_HEALTH_TIMEOUT:-30}"
PRUNE_UNTIL="${AUTODEPLOY_PRUNE_UNTIL:-72h}"

# Re-exec under an exclusive lock so a slow build cannot overlap the next cron
# tick. A run that cannot take the lock exits quietly, which is correct: the
# run already holding it is doing the same work. flock is Linux only, so the
# test suite sets AUTODEPLOY_LOCKED to skip this.
if [ -z "${AUTODEPLOY_LOCKED:-}" ] && command -v flock > /dev/null 2>&1; then
  exec env AUTODEPLOY_LOCKED=1 flock -n "$LOCK_FILE" "$0" "$@"
fi

mkdir -p "$(dirname "$LOG_FILE")" "$(dirname "$BUILD_LOG")"

log() {
  printf '%s  %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$*" >> "$LOG_FILE"
}

cd "$REPO_DIR" || {
  log "FATAL  repo not found at $REPO_DIR"
  exit 1
}

git fetch origin "$BRANCH" --quiet

# Has upstream produced anything not already merged here? Asked this way, and
# not as a SHA comparison, because this checkout carries local-only commits
# and is therefore permanently ahead of origin.
if git merge-base --is-ancestor "origin/$BRANCH" HEAD; then
  log "ok     up to date"
  exit 0
fi

log "info   new commits upstream, deploying"

# Poll until the new container answers, or give up. This runs after the swap
# and reports; it is not a gate.
health_ok() {
  local deadline=$(( SECONDS + HEALTH_TIMEOUT ))
  while [ "$SECONDS" -lt "$deadline" ]; do
    if curl -sf --max-time 5 -o /dev/null "$HEALTH_URL"; then
      return 0
    fi
    sleep 2
  done
  return 1
}

git pull --no-edit origin "$BRANCH" --quiet

# Build output goes to its own file, truncated each run, so the deploy log
# stays readable and the last build is always available for debugging.
docker compose -p "$PROJECT" --env-file "$ENV_FILE" build > "$BUILD_LOG" 2>&1

docker compose -p "$PROJECT" --env-file "$ENV_FILE" up -d >> "$BUILD_LOG" 2>&1

SHA="$(git rev-parse --short HEAD)"

if health_ok; then
  log "ok     deployed $SHA"
else
  log "WARN   deployed $SHA but health check failed at $HEALTH_URL"
fi

# Unreferenced images older than the window. Cannot touch an image any
# running container depends on.
docker image prune -f --filter "until=$PRUNE_UNTIL" > /dev/null 2>&1

exit 0
