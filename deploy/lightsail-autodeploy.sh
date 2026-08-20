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
# Under $HOME, not /tmp: this box is shared, and a lock file another uid owns
# with restrictive permissions would make flock fail before log() even exists,
# stopping every deploy with no log line to say why.
LOCK_FILE="${AUTODEPLOY_LOCK_FILE:-$HOME/.ktdoctor-autodeploy.lock}"
# Records the HEAD of a deploy whose build or swap failed, so later runs can
# say the container is behind instead of reporting "up to date" forever.
SENTINEL_FILE="${AUTODEPLOY_SENTINEL_FILE:-$HOME/.ktdoctor-autodeploy-unbuilt}"
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

# Captured git output is often several physical lines (an SSH auth failure is
# three or four, a merge conflict three). Log them one at a time so every line
# carries a timestamp and a prefix, and none can hide from the runbook's
# `grep -E 'ERROR|WARN'`.
log_lines() {
  local prefix="$1" text="$2" line
  while IFS= read -r line; do
    [ -n "$line" ] && log "${prefix}${line}"
  done <<< "$text"
}

# Both prunes are best effort and run last on every path that reached docker,
# including the failure paths: a run of failing builds still leaves layers and
# build cache behind, and filling this box's root filesystem would stop writes
# for every other application on it.
prune_docker() {
  # Unreferenced images older than the window. Cannot touch an image any
  # running container depends on.
  docker image prune -f --filter "until=$PRUNE_UNTIL" > /dev/null 2>&1
  # BuildKit's cache is not touched by `image prune` and grows by GB per
  # deploy. Host-wide like the image prune, but cache is regenerable.
  docker builder prune -f --filter "until=$PRUNE_UNTIL" > /dev/null 2>&1
}

cd "$REPO_DIR" || {
  log "FATAL  repo not found at $REPO_DIR"
  exit 1
}

if ! FETCH_ERR="$(git fetch origin "$BRANCH" --quiet 2>&1 >/dev/null)"; then
  log "ERROR  fetch failed, retrying next tick"
  log_lines "ERROR  " "$FETCH_ERR"
  exit 1
fi

# Has upstream produced anything not already merged here? Asked this way, and
# not as a SHA comparison, because this checkout carries local-only commits
# and is therefore permanently ahead of origin.
if git merge-base --is-ancestor "origin/$BRANCH" HEAD; then
  # Nothing new upstream, but a previous run may have pulled this HEAD and
  # then failed to build or swap it. Not retrying is deliberate, a commit that
  # failed once will fail again; reporting it as "ok" is not.
  if [ -f "$SENTINEL_FILE" ] && [ "$(cat "$SENTINEL_FILE" 2>/dev/null)" = "$(git rev-parse HEAD)" ]; then
    log "WARN   HEAD $(git rev-parse --short HEAD) has never been built, container is behind"
  else
    log "ok     up to date"
  fi
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

# Record that this HEAD is checked out but not running, so a later tick reports
# the gap rather than "up to date".
mark_unbuilt() {
  git rev-parse HEAD > "$SENTINEL_FILE" 2>/dev/null
}

# Combined output, not stderr alone as the fetch above uses: git reports a
# merge conflict ("CONFLICT (content): ...") on stdout, and that is the most
# likely way this line fails. Capturing stderr only would log an empty reason.
# Nothing is printed on a successful --quiet pull, so nothing is lost.
if ! PULL_ERR="$(git pull --no-edit --no-rebase origin "$BRANCH" --quiet 2>&1)"; then
  log "ERROR  pull failed, site left on previous version"
  # Log the reason before cleaning up: the abort erases the evidence.
  log_lines "ERROR  " "$PULL_ERR"
  # Best effort, and a no-op when the pull failed before any merge began.
  git merge --abort > /dev/null 2>&1
  exit 1
fi

# `nice`/`ionice` so an unattended build yields CPU and disk IO to the other
# applications on this box. Neither bounds memory, see deploy/README.md. Both
# are Linux only, so each is used only where it exists (Git Bash has neither).
BUILD_PREFIX=()
command -v nice   > /dev/null 2>&1 && BUILD_PREFIX+=(nice -n 10)
command -v ionice > /dev/null 2>&1 && BUILD_PREFIX+=(ionice -c3)

# Build output goes to its own file, truncated each run, so the deploy log
# stays readable and the last build is always available for debugging.
if ! "${BUILD_PREFIX[@]}" docker compose -p "$PROJECT" --env-file "$ENV_FILE" build > "$BUILD_LOG" 2>&1; then
  log "ERROR  build failed, site left on previous version, see $BUILD_LOG"
  mark_unbuilt
  prune_docker
  exit 1
fi

if ! docker compose -p "$PROJECT" --env-file "$ENV_FILE" up -d >> "$BUILD_LOG" 2>&1; then
  log "ERROR  container swap failed, see $BUILD_LOG"
  mark_unbuilt
  prune_docker
  exit 1
fi

# The container now runs this HEAD. The health check below reports, it does not
# gate, so the gap the sentinel tracks is closed either way.
rm -f "$SENTINEL_FILE"

SHA="$(git rev-parse --short HEAD)"

if health_ok; then
  log "ok     deployed $SHA"
else
  log "WARN   deployed $SHA but health check failed at $HEALTH_URL"
fi

prune_docker

exit 0
