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
  *"builder prune"*) exit 0 ;;
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
  # nice and ionice: record the call, drop their own options, then exec the
  # command that follows so the build still reaches the docker stub. ionice
  # does not exist on Git Bash, so without a stub the build prefix would go
  # unexercised on a developer machine.
  cat > "$FIXTURE/bin/nice" <<'STUB'
#!/usr/bin/env bash
echo "$(basename "$0") $*" >> "$FIXTURE/calls.log"
while [ "$#" -gt 0 ]; do
  case "$1" in
    -n) shift 2 ;;
    -*) shift ;;
    *)  break ;;
  esac
done
exec "$@"
STUB
  cp "$FIXTURE/bin/nice" "$FIXTURE/bin/ionice"
  chmod +x "$FIXTURE/bin/docker" "$FIXTURE/bin/curl" \
           "$FIXTURE/bin/nice" "$FIXTURE/bin/ionice"
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
  AUTODEPLOY_SENTINEL_FILE="$FIXTURE/unbuilt" \
  AUTODEPLOY_HEALTH_TIMEOUT=2 \
  bash "$SCRIPT"
}

assert_log_contains() {
  grep -q "$1" "$FIXTURE/deploy.log" 2>/dev/null
}

assert_calls_lack() {
  ! grep -q "$1" "$FIXTURE/calls.log" 2>/dev/null
}

# Forget every call recorded so far, so a later run can be asserted on alone.
reset_calls() {
  : > "$FIXTURE/calls.log"
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

# Both compose calls pin the env file by name rather than treating it as
# opaque filler: without .env.root, docker-compose.yml falls back to HOST_PORT
# 8160, the port owned by the out-of-scope ktdoctor project, and the swap would
# try to bind it after having already stopped the root container.
test_upstream_change_deploys() {
  local name="upstream change pulls, builds, swaps, and health checks"
  setup_fixture
  make_stubs
  add_upstream_commit "new work from github"
  run_deploy
  local up_line curl_line
  up_line="$(grep -n "up -d" "$FIXTURE/calls.log" | head -1 | cut -d: -f1)"
  curl_line="$(grep -n "curl" "$FIXTURE/calls.log" | head -1 | cut -d: -f1)"
  if grep -q "^docker compose -p ktdoctor-root --env-file .env.root build$" "$FIXTURE/calls.log" \
    && grep -q "^docker compose -p ktdoctor-root --env-file .env.root up -d$" "$FIXTURE/calls.log" \
    && grep -q "^nice -n 10 ionice -c3 docker compose " "$FIXTURE/calls.log" \
    && grep -q "curl" "$FIXTURE/calls.log" \
    && grep -q "image prune" "$FIXTURE/calls.log" \
    && grep -q "builder prune" "$FIXTURE/calls.log" \
    && assert_log_contains "deployed" \
    && [ -n "$up_line" ] && [ -n "$curl_line" ] && [ "$up_line" -lt "$curl_line" ]; then
    ok "$name"
  else
    bad "$name" "expected a niced build and an up -d both against --env-file .env.root, curl, both prunes, a deployed log line, and the swap before the health check"
  fi
  teardown_fixture
}

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

# The reason the pull failed has to reach the log before `git merge --abort`
# erases the evidence, and every physical line of it has to carry its own
# timestamp and prefix or `grep -E ERROR|WARN` hides all but the first.
test_pull_failure_logs_the_reason() {
  local name="pull failure logs the git reason, one prefixed line at a time"
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
  local unprefixed
  unprefixed="$(grep -cv "  \(ok\|info\|WARN\|ERROR\|FATAL\) " "$FIXTURE/deploy.log")"
  if assert_log_contains "pull failed" \
    && assert_log_contains "ERROR  .*onflict" \
    && [ "$unprefixed" -eq 0 ]; then
    ok "$name"
  else
    bad "$name" "expected the git conflict message logged under an ERROR prefix, with no unprefixed log lines"
  fi
  teardown_fixture
}

# Regression guard: the box's ambient git config may have pull.rebase=true,
# in which case a conflicting pull rebases instead of merging, and
# `git merge --abort` is a silent no-op against an in-progress rebase. This
# proves the abort works under that config too, not just the default.
test_merge_conflict_aborts_cleanly_under_rebase_config() {
  local name="merge conflict aborts cleanly even when pull.rebase is true"
  setup_fixture
  make_stubs
  (
    cd "$FIXTURE/repo" || exit 1
    git config pull.rebase true
  )
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
    && [ ! -f "$FIXTURE/repo/.git/MERGE_HEAD" ] \
    && [ ! -d "$FIXTURE/repo/.git/rebase-merge" ] \
    && [ ! -d "$FIXTURE/repo/.git/rebase-apply" ]; then
    ok "$name"
  else
    bad "$name" "expected a pull failure log line, no docker calls, and a clean tree with no rebase leftovers under pull.rebase=true"
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

test_swap_failure_reports_and_skips_the_health_check() {
  local name="container swap failure is reported and no health check runs"
  setup_fixture
  make_stubs
  add_upstream_commit "work whose container will not start"
  export STUB_DOCKER_UP_EXIT=1
  run_deploy
  unset STUB_DOCKER_UP_EXIT
  if assert_log_contains "container swap failed" \
    && grep -q "up -d" "$FIXTURE/calls.log" \
    && assert_calls_lack curl \
    && ! assert_log_contains "deployed" \
    && [ -f "$FIXTURE/unbuilt" ]; then
    ok "$name"
  else
    bad "$name" "expected a swap failure log line, no health check, no deployed line, and a recorded unbuilt HEAD"
  fi
  teardown_fixture
}

# The pull runs before the build, so a failed build leaves HEAD advanced while
# the container stays on the old commit. Every later run then sees nothing new
# upstream. Reporting that as `ok  up to date` would hide a stale public site
# behind a clean log for as long as nobody pushes again.
test_failed_build_is_reported_as_behind_not_up_to_date() {
  local name="a HEAD whose build failed is reported as behind, not up to date"
  setup_fixture
  make_stubs
  add_upstream_commit "work that will fail to build"
  export STUB_DOCKER_BUILD_EXIT=1
  run_deploy
  unset STUB_DOCKER_BUILD_EXIT
  reset_calls
  run_deploy
  if assert_log_contains "has never been built, container is behind" \
    && ! assert_log_contains "up to date" \
    && assert_calls_lack docker; then
    ok "$name"
  else
    bad "$name" "expected a behind warning instead of an up-to-date line, and no docker calls on the second run"
  fi
  teardown_fixture
}

# The marker file is asserted directly as well as through the log. A successful
# deploy always advances HEAD past the commit that failed, so the log line
# would read `ok  up to date` even if the marker were left behind forever; only
# the file itself proves the state is actually cleared rather than accumulating.
test_successful_deploy_clears_the_behind_warning() {
  local name="a later successful deploy clears the behind warning"
  setup_fixture
  make_stubs
  add_upstream_commit "work that will fail to build"
  export STUB_DOCKER_BUILD_EXIT=1
  run_deploy
  unset STUB_DOCKER_BUILD_EXIT
  add_upstream_commit "the fix" "fixed upstream"
  run_deploy
  reset_calls
  run_deploy
  if assert_log_contains "ok     up to date" \
    && ! assert_log_contains "has never been built" \
    && assert_calls_lack docker \
    && [ ! -f "$FIXTURE/unbuilt" ]; then
    ok "$name"
  else
    bad "$name" "expected a plain up-to-date line and no unbuilt marker left on disk after a successful deploy"
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
    && grep -q "up -d" "$FIXTURE/calls.log" \
    && assert_calls_lack "down"; then
    ok "$name"
  else
    bad "$name" "expected a health warning after a completed swap, with no rollback"
  fi
  teardown_fixture
}

test_no_upstream_change_does_nothing
test_local_only_commits_do_not_trigger_deploy
test_upstream_change_deploys
test_fetch_failure_does_not_deploy
test_merge_conflict_aborts_cleanly
test_pull_failure_logs_the_reason
test_merge_conflict_aborts_cleanly_under_rebase_config
test_build_failure_does_not_swap
test_swap_failure_reports_and_skips_the_health_check
test_failed_build_is_reported_as_behind_not_up_to_date
test_successful_deploy_clears_the_behind_warning
test_health_failure_warns_but_does_not_roll_back

printf '\n%s passed, %s failed\n' "$PASS" "$FAIL"
[ "$FAIL" -eq 0 ]
