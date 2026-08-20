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

test_no_upstream_change_does_nothing
test_local_only_commits_do_not_trigger_deploy
test_upstream_change_deploys

printf '\n%s passed, %s failed\n' "$PASS" "$FAIL"
[ "$FAIL" -eq 0 ]
