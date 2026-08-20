# Lightsail Auto-Deploy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A cron-polled shell script on the Lightsail box that redeploys www.ktdoctor.com automatically whenever new commits appear on `origin/main`, without exposing the box to GitHub or storing any credential.

**Architecture:** One bash script, run every two minutes by cron as the `ubuntu` user. It fetches, decides whether upstream has work it has not merged, then pulls, builds, and swaps the container. Every pre-swap failure exits without touching the running container, so the live site stays on the previous version. All behaviour is driven by environment variables with production defaults, which is what makes the script testable on a developer machine against a throwaway git fixture and stubbed `docker`/`curl`.

**Tech Stack:** bash, git, Docker Compose v2, cron. No new runtime dependencies. Tests are a plain bash script, not vitest, because the unit under test is a shell script.

**Spec:** `docs/superpowers/specs/2026-08-20-lightsail-autodeploy-design.md`

## Global Constraints

- Never use the em dash (`—`) in code, comments, copy, or log strings. Project style rule from `CLAUDE.md`.
- The script must run under both GNU bash on Ubuntu (production) and Git Bash on Windows (developer machine, for the tests). `flock` does not exist on Git Bash, so the lock must be bypassable.
- The script must never leave the git checkout in a conflicted merge state. A stuck merge breaks every subsequent run.
- The script must never swap the container after a failed build. The previous version staying live is the required failure mode.
- Change detection must use `git merge-base --is-ancestor origin/main HEAD`, not a SHA equality check. Server `main` is permanently ahead of `origin/main` because of the local-only commit `d2e21e5`, so equality would be false forever and would rebuild on every tick.
- Production values, all overridable by environment variable: repo `~/ktdoctor`, branch `main`, Compose project `ktdoctor-root`, env file `.env.root`, health URL `http://localhost:8161/`, health timeout 30 seconds, prune filter `until=72h`, log `~/logs/ktdoctor-deploy.log`.
- Do not touch the `ktdoctor` Compose project (port 8160, the legacy `/ktdoctor/` subpath), nginx, or any of the other seven applications on the box.

## File Structure

| File | Responsibility |
|---|---|
| `deploy/lightsail-autodeploy.sh` | The deploy script. Canonical, version-controlled copy. |
| `deploy/lightsail-autodeploy.test.sh` | Bash test suite. Builds a temp git fixture, stubs `docker` and `curl` on `PATH`, asserts on the log and the recorded calls. |
| `deploy/README.md` | Installation runbook: how to install onto the box, the cron entry, staged manual verification, how to read the logs, how to roll back. |
| `.dockerignore` | Modified. Add `deploy` so the script is not copied into the application image, where it has no purpose. |

---

### Task 1: Test harness and the no-op path

The script's most important behaviour is doing nothing. It runs 720 times a day and should deploy on almost none of them. Getting change detection wrong means rebuilding a production box every two minutes forever, so it is built and tested first, on its own.

**Files:**
- Create: `deploy/lightsail-autodeploy.sh`
- Create: `deploy/lightsail-autodeploy.test.sh`
- Modify: `.dockerignore`

**Interfaces:**
- Consumes: nothing.
- Produces: the script at `deploy/lightsail-autodeploy.sh`, configured entirely through these environment variables, which every later task and the test suite rely on by these exact names: `AUTODEPLOY_REPO_DIR`, `AUTODEPLOY_BRANCH`, `AUTODEPLOY_PROJECT`, `AUTODEPLOY_ENV_FILE`, `AUTODEPLOY_LOG_FILE`, `AUTODEPLOY_BUILD_LOG`, `AUTODEPLOY_LOCK_FILE`, `AUTODEPLOY_HEALTH_URL`, `AUTODEPLOY_HEALTH_TIMEOUT`, `AUTODEPLOY_PRUNE_UNTIL`, `AUTODEPLOY_LOCKED`. Also produces the test-suite helper functions `setup_fixture`, `teardown_fixture`, `make_stubs`, `add_upstream_commit`, `run_deploy`, `assert_log_contains`, `assert_calls_lack`, used by Tasks 2 and 3.

- [ ] **Step 1: Write the failing test**

Create `deploy/lightsail-autodeploy.test.sh`:

```bash
#!/usr/bin/env bash
# Tests for lightsail-autodeploy.sh
# Run: bash deploy/lightsail-autodeploy.test.sh
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT="$SCRIPT_DIR/lightsail-autodeploy.sh"

PASS=0
FAIL=0

ok()   { printf 'ok   %s\n' "$1"; PASS=$((PASS + 1)); }
bad()  { printf 'FAIL %s\n     %s\n' "$1" "$2"; FAIL=$((FAIL + 1)); }

# Build a throwaway origin plus a working clone that stands in for ~/ktdoctor.
setup_fixture() {
  FIXTURE="$(mktemp -d)"
  export FIXTURE
  git init -q --bare -b main "$FIXTURE/origin.git"
  git clone -q "$FIXTURE/origin.git" "$FIXTURE/repo" 2>/dev/null
  (
    cd "$FIXTURE/repo" || exit 1
    git config user.email test@example.com
    git config user.name test
    git config pull.rebase false
    echo one > file.txt
    git add -A
    git commit -qm one
    git branch -M main
    git push -qu origin main
  )
}

teardown_fixture() {
  [ -n "${FIXTURE:-}" ] && rm -rf "$FIXTURE"
}

# Fake docker and curl that record every call and honour injected exit codes.
make_stubs() {
  mkdir -p "$FIXTURE/bin"
  cat > "$FIXTURE/bin/docker" <<'STUB'
#!/usr/bin/env bash
echo "docker $*" >> "$FIXTURE/calls.log"
case "$*" in
  *build*)  exit "${STUB_DOCKER_BUILD_EXIT:-0}" ;;
  *"up -d"*) exit "${STUB_DOCKER_UP_EXIT:-0}" ;;
esac
exit 0
STUB
  cat > "$FIXTURE/bin/curl" <<'STUB'
#!/usr/bin/env bash
echo "curl $*" >> "$FIXTURE/calls.log"
exit "${STUB_CURL_EXIT:-0}"
STUB
  chmod +x "$FIXTURE/bin/docker" "$FIXTURE/bin/curl"
  : > "$FIXTURE/calls.log"
}

# Push a new commit to origin from a separate clone, simulating a GitHub push.
add_upstream_commit() {
  local message="$1"
  local content="${2:-upstream}"
  local work="$FIXTURE/upstream-work"
  rm -rf "$work"
  git clone -q "$FIXTURE/origin.git" "$work"
  (
    cd "$work" || exit 1
    git config user.email test@example.com
    git config user.name test
    echo "$content" > file.txt
    git add -A
    git commit -qm "$message"
    git push -q origin main
  )
}

run_deploy() {
  PATH="$FIXTURE/bin:$PATH" \
  AUTODEPLOY_LOCKED=1 \
  AUTODEPLOY_REPO_DIR="$FIXTURE/repo" \
  AUTODEPLOY_LOG_FILE="$FIXTURE/deploy.log" \
  AUTODEPLOY_BUILD_LOG="$FIXTURE/build.log" \
  AUTODEPLOY_HEALTH_TIMEOUT=2 \
  bash "$SCRIPT"
}

assert_log_contains() {
  grep -q "$1" "$FIXTURE/deploy.log" 2>/dev/null
}

assert_calls_lack() {
  ! grep -q "$1" "$FIXTURE/calls.log" 2>/dev/null
}

# ---------------------------------------------------------------------------

test_no_upstream_change_does_nothing() {
  local name="no upstream change does nothing"
  setup_fixture
  make_stubs
  run_deploy
  if assert_log_contains "up to date" && assert_calls_lack docker; then
    ok "$name"
  else
    bad "$name" "expected an up-to-date log line and no docker calls"
  fi
  teardown_fixture
}

# Regression guard for the real box: server main carries local-only commits
# (d2e21e5), so it is permanently ahead of origin/main. A SHA equality check
# would treat that as "changed" on every single run and rebuild forever.
test_local_only_commits_do_not_trigger_deploy() {
  local name="local-only commits ahead of origin do not trigger a deploy"
  setup_fixture
  make_stubs
  (
    cd "$FIXTURE/repo" || exit 1
    echo local-only > local.txt
    git add -A
    git commit -qm "local only, never pushed"
  )
  run_deploy
  if assert_log_contains "up to date" && assert_calls_lack docker; then
    ok "$name"
  else
    bad "$name" "expected an up-to-date log line and no docker calls"
  fi
  teardown_fixture
}

test_no_upstream_change_does_nothing
test_local_only_commits_do_not_trigger_deploy

printf '\n%s passed, %s failed\n' "$PASS" "$FAIL"
[ "$FAIL" -eq 0 ]
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `bash deploy/lightsail-autodeploy.test.sh`

Expected: both tests FAIL. The script does not exist yet, so `bash "$SCRIPT"` errors and no log file is written.

- [ ] **Step 3: Write the minimal implementation**

Create `deploy/lightsail-autodeploy.sh`:

```bash
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
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `bash deploy/lightsail-autodeploy.test.sh`

Expected: `2 passed, 0 failed`.

- [ ] **Step 5: Keep the script out of the application image**

Add `deploy` to `.dockerignore`, on its own line after `docs`. The Dockerfile does `COPY . .`, and the deploy tooling has no reason to exist inside the runtime image.

- [ ] **Step 6: Commit**

```bash
git add deploy/lightsail-autodeploy.sh deploy/lightsail-autodeploy.test.sh .dockerignore
git commit -m "feat: add auto-deploy script with upstream change detection"
```

---

### Task 2: The deploy path

**Files:**
- Modify: `deploy/lightsail-autodeploy.sh`
- Modify: `deploy/lightsail-autodeploy.test.sh`

**Interfaces:**
- Consumes: the environment variables and test helpers produced by Task 1.
- Produces: the shell function `health_ok`, which polls `$HEALTH_URL` until it returns success or `$HEALTH_TIMEOUT` seconds elapse, returning 0 or 1. Task 3 asserts on its failure branch.

- [ ] **Step 1: Write the failing test**

Add to `deploy/lightsail-autodeploy.test.sh`, immediately before the block of test invocations at the bottom:

```bash
test_upstream_change_deploys() {
  local name="upstream change pulls, builds, swaps, and health checks"
  setup_fixture
  make_stubs
  add_upstream_commit "new work from github"
  run_deploy
  if grep -q "docker compose -p ktdoctor-root .* build" "$FIXTURE/calls.log" \
    && grep -q "up -d" "$FIXTURE/calls.log" \
    && grep -q "curl" "$FIXTURE/calls.log" \
    && grep -q "image prune" "$FIXTURE/calls.log" \
    && assert_log_contains "deployed"; then
    ok "$name"
  else
    bad "$name" "expected build, up -d, curl, prune, and a deployed log line"
  fi
  teardown_fixture
}
```

Then add its invocation alongside the existing two:

```bash
test_upstream_change_deploys
```

- [ ] **Step 2: Run the tests to verify the new one fails**

Run: `bash deploy/lightsail-autodeploy.test.sh`

Expected: `2 passed, 1 failed`. The script logs "new commits upstream" then exits without doing anything, so no docker calls are recorded.

- [ ] **Step 3: Write the minimal implementation**

Append to `deploy/lightsail-autodeploy.sh`, after the existing `log "info   new commits upstream, deploying"` line:

```bash
# Poll until the new container answers, or give up. This runs after the swap
# and reports; it is not a gate.
health_ok() {
  local deadline=$(( SECONDS + HEALTH_TIMEOUT ))
  while [ "$SECONDS" -lt "$deadline" ]; do
    if curl -sf -o /dev/null "$HEALTH_URL"; then
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
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `bash deploy/lightsail-autodeploy.test.sh`

Expected: `3 passed, 0 failed`.

- [ ] **Step 5: Commit**

```bash
git add deploy/lightsail-autodeploy.sh deploy/lightsail-autodeploy.test.sh
git commit -m "feat: pull, build, swap, and health check on upstream change"
```

---

### Task 3: Failure paths

Task 2 wired the happy path with no guards, so a failed build would still swap the container. This task adds the guards, driven by tests for each way a deploy can go wrong.

**Files:**
- Modify: `deploy/lightsail-autodeploy.sh`
- Modify: `deploy/lightsail-autodeploy.test.sh`

**Interfaces:**
- Consumes: `health_ok` from Task 2, and the test helpers from Task 1.
- Produces: no new interfaces. This task only adds guard clauses.

- [ ] **Step 1: Write the failing tests**

Add to `deploy/lightsail-autodeploy.test.sh`, before the block of test invocations:

```bash
test_fetch_failure_does_not_deploy() {
  local name="fetch failure logs and does not deploy"
  setup_fixture
  make_stubs
  (
    cd "$FIXTURE/repo" || exit 1
    git remote set-url origin "$FIXTURE/does-not-exist.git"
  )
  run_deploy
  if assert_log_contains "fetch failed" && assert_calls_lack docker; then
    ok "$name"
  else
    bad "$name" "expected a fetch failure log line and no docker calls"
  fi
  teardown_fixture
}

# The most important failure test. A checkout left mid-merge would fail every
# subsequent run and need hand repair on the production box.
test_merge_conflict_aborts_cleanly() {
  local name="merge conflict aborts the merge and leaves the tree clean"
  setup_fixture
  make_stubs
  add_upstream_commit "upstream edit" "upstream version"
  (
    cd "$FIXTURE/repo" || exit 1
    echo "local version" > file.txt
    git add -A
    git commit -qm "conflicting local edit"
  )
  run_deploy
  local dirty
  dirty="$(cd "$FIXTURE/repo" && git status --porcelain)"
  if assert_log_contains "pull failed" \
    && assert_calls_lack docker \
    && [ -z "$dirty" ] \
    && [ ! -f "$FIXTURE/repo/.git/MERGE_HEAD" ]; then
    ok "$name"
  else
    bad "$name" "expected a pull failure log line, no docker calls, and a clean tree"
  fi
  teardown_fixture
}

test_build_failure_does_not_swap() {
  local name="build failure leaves the running container alone"
  setup_fixture
  make_stubs
  add_upstream_commit "work that will fail to build"
  export STUB_DOCKER_BUILD_EXIT=1
  run_deploy
  unset STUB_DOCKER_BUILD_EXIT
  if assert_log_contains "build failed" \
    && grep -q "build" "$FIXTURE/calls.log" \
    && assert_calls_lack "up -d"; then
    ok "$name"
  else
    bad "$name" "expected a build failure log line and no container swap"
  fi
  teardown_fixture
}

test_health_failure_warns_but_does_not_roll_back() {
  local name="health check failure warns after the swap"
  setup_fixture
  make_stubs
  add_upstream_commit "work that starts unhealthy"
  export STUB_CURL_EXIT=1
  run_deploy
  unset STUB_CURL_EXIT
  if assert_log_contains "health check failed" \
    && grep -q "up -d" "$FIXTURE/calls.log"; then
    ok "$name"
  else
    bad "$name" "expected a health warning after a completed swap"
  fi
  teardown_fixture
}
```

Then add their invocations alongside the existing three:

```bash
test_fetch_failure_does_not_deploy
test_merge_conflict_aborts_cleanly
test_build_failure_does_not_swap
test_health_failure_warns_but_does_not_roll_back
```

- [ ] **Step 2: Run the tests to verify the new ones fail**

Run: `bash deploy/lightsail-autodeploy.test.sh`

Expected: `4 passed, 3 failed`. The health warning test already passes, because Task 2 wrote that branch. The other three fail: the unguarded script continues past a failed fetch, leaves a conflicted merge in place, and swaps the container after a failed build.

- [ ] **Step 3: Write the minimal implementation**

In `deploy/lightsail-autodeploy.sh`, replace the bare `git fetch` line:

```bash
git fetch origin "$BRANCH" --quiet
```

with:

```bash
if ! git fetch origin "$BRANCH" --quiet 2> /dev/null; then
  log "ERROR  fetch failed, retrying next tick"
  exit 1
fi
```

Replace the bare `git pull` line:

```bash
git pull --no-edit origin "$BRANCH" --quiet
```

with:

```bash
if ! git pull --no-edit origin "$BRANCH" --quiet; then
  log "ERROR  pull failed, aborting merge, site left on previous version"
  git merge --abort > /dev/null 2>&1
  exit 1
fi
```

Replace the bare build line:

```bash
docker compose -p "$PROJECT" --env-file "$ENV_FILE" build > "$BUILD_LOG" 2>&1
```

with:

```bash
if ! docker compose -p "$PROJECT" --env-file "$ENV_FILE" build > "$BUILD_LOG" 2>&1; then
  log "ERROR  build failed, site left on previous version, see $BUILD_LOG"
  exit 1
fi
```

Replace the bare swap line:

```bash
docker compose -p "$PROJECT" --env-file "$ENV_FILE" up -d >> "$BUILD_LOG" 2>&1
```

with:

```bash
if ! docker compose -p "$PROJECT" --env-file "$ENV_FILE" up -d >> "$BUILD_LOG" 2>&1; then
  log "ERROR  container swap failed, see $BUILD_LOG"
  exit 1
fi
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `bash deploy/lightsail-autodeploy.test.sh`

Expected: `7 passed, 0 failed`.

- [ ] **Step 5: Commit**

```bash
git add deploy/lightsail-autodeploy.sh deploy/lightsail-autodeploy.test.sh
git commit -m "feat: fail safe on fetch, merge, build, and swap errors"
```

---

### Task 4: Installation runbook

The script is finished and tested. This task writes the document that gets it onto the box. There is no automated test; the verification is following the runbook on the production host, which is the staged sequence the spec requires.

**Files:**
- Create: `deploy/README.md`

**Interfaces:**
- Consumes: the finished script from Task 3.
- Produces: no code interfaces.

- [ ] **Step 1: Write the runbook**

Create `deploy/README.md`:

````markdown
# Automatic deployment to Lightsail

`lightsail-autodeploy.sh` redeploys www.ktdoctor.com whenever new commits
appear on `origin/main`. Cron runs it every two minutes on the Lightsail box
at `3.19.170.142` as the `ubuntu` user.

Design rationale lives in
`docs/superpowers/specs/2026-08-20-lightsail-autodeploy-design.md`.

## What it does

Fetches `origin/main`. If everything upstream is already merged, it logs one
line and exits. Otherwise it pulls, builds, swaps the container, health checks
it, and prunes unreferenced images older than 72 hours.

Every failure before the swap exits without touching the running container, so
a broken commit leaves the site on the previous version rather than breaking
it.

## Install

The script runs from `~/bin`, deliberately outside the checkout, so that a
deploy which updates the script cannot rewrite the file mid-run. That means
installation is a copy, and updating the script later means copying again.

```bash
mkdir -p ~/bin ~/logs
cp ~/ktdoctor/deploy/lightsail-autodeploy.sh ~/bin/ktdoctor-autodeploy.sh
chmod +x ~/bin/ktdoctor-autodeploy.sh
```

## Verify before enabling cron

Run these in order. Do not add the cron entry until all four behave as
described.

**1. No new commits.** Should log one up-to-date line, build nothing, and
restart nothing.

```bash
~/bin/ktdoctor-autodeploy.sh
tail -3 ~/logs/ktdoctor-deploy.log
docker compose -p ktdoctor-root ps
```

The container's uptime must be unchanged.

**2. A real new commit.** Push a trivial change to `main` from your machine,
then:

```bash
~/bin/ktdoctor-autodeploy.sh
tail -3 ~/logs/ktdoctor-deploy.log
curl -sI https://www.ktdoctor.com/ | head -1
```

Expect a `deployed <sha>` line and a `200`.

**3. Nothing new again.** Immediately re-run. It must log up-to-date and do
nothing, which confirms change detection settles after a deploy rather than
looping.

```bash
~/bin/ktdoctor-autodeploy.sh
tail -2 ~/logs/ktdoctor-deploy.log
```

**4. The lock.** Start a run, and while it is building, start a second in
another PuTTY window. The second must exit immediately without building.

## Enable cron

```bash
crontab -e
```

Add:

```
*/2 * * * * $HOME/bin/ktdoctor-autodeploy.sh
```

This is `ubuntu`'s crontab. The nginx certificate reload entry lives in
`root`'s crontab, so the two do not interact.

Confirm it is live, then push a trivial commit and watch it deploy unattended:

```bash
crontab -l
tail -f ~/logs/ktdoctor-deploy.log
```

## Reading the logs

```bash
tail -20 ~/logs/ktdoctor-deploy.log        # one line per run
grep -E 'ERROR|WARN' ~/logs/ktdoctor-deploy.log   # only the interesting ones
cat ~/logs/ktdoctor-deploy-build.log       # full output of the last build
```

The build log is truncated on every deploy, so it always holds the most
recent build and nothing older.

## Roll back a bad deploy

Automatic deployment has no approval gate, so a commit that builds cleanly but
is wrong will reach production within two minutes. To roll back, first stop
cron from immediately redeploying it:

```bash
crontab -e     # comment out the ktdoctor-autodeploy line
cd ~/ktdoctor
git reset --hard <last-good-sha>
docker compose -p ktdoctor-root --env-file .env.root build
docker compose -p ktdoctor-root --env-file .env.root up -d
```

Then fix the problem on `main`, and re-enable cron. Do not reset past
`d2e21e5`, the `package-lock.json` fix that exists only on this box.

## Disable temporarily

```bash
crontab -e     # comment out the line
```

## Tests

The script has a bash test suite that runs on a developer machine against a
throwaway git fixture with stubbed `docker` and `curl`. It never touches a real
host.

```bash
bash deploy/lightsail-autodeploy.test.sh
```
````

- [ ] **Step 2: Verify the runbook is self-consistent**

Read it against `deploy/lightsail-autodeploy.sh` and confirm every path,
filename, project name, and environment variable named in the runbook matches
the script exactly: `~/bin/ktdoctor-autodeploy.sh`, `~/logs/ktdoctor-deploy.log`,
`~/logs/ktdoctor-deploy-build.log`, project `ktdoctor-root`, env file `.env.root`.

- [ ] **Step 3: Run the full test suite one final time**

Run: `bash deploy/lightsail-autodeploy.test.sh`

Expected: `7 passed, 0 failed`.

- [ ] **Step 4: Commit**

```bash
git add deploy/README.md
git commit -m "docs: add Lightsail auto-deploy installation runbook"
```

---

## After the plan

Everything above is repo work and changes nothing on the box. Installation is a
separate, human-driven step: follow `deploy/README.md` on the Lightsail host,
work through the four verification steps, and only then add the cron entry.

One decision is still open and should be settled before cron is enabled: once
this is live, any push to `main` is a production release. Committing directly
to `main` stops being a low-stakes act, so a feature-branch workflow with a
deliberate merge to `main` may be the better fit.
