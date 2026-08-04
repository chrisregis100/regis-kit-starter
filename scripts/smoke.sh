#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Smoke test — boots the built web server and asserts the core routes respond.
#
# Prerequisites:
#   - `pnpm turbo run build` has produced apps/web/.output
#   - env vars (DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL) are set
#     and point at a migrated database
#
# Usage: ./scripts/smoke.sh [port]
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

PORT="${1:-3100}"
BASE="http://localhost:${PORT}"
SERVER_PID=""

cleanup() {
  if [[ -n "$SERVER_PID" ]] && kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

echo "→ starting server on :${PORT}"
(cd apps/web && PORT="$PORT" node .output/server/index.mjs > /tmp/smoke-server.log 2>&1) &
SERVER_PID=$!

for _ in $(seq 1 30); do
  if curl -sf -o /dev/null "$BASE/"; then break; fi
  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    echo "✗ server exited early:"; cat /tmp/smoke-server.log; exit 1
  fi
  sleep 1
done

assert_status() {
  local path="$1" expected="$2" label="$3"
  local actual
  actual=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$path")
  if [[ "$actual" != "$expected" ]]; then
    echo "✗ $label: expected $expected, got $actual ($path)"
    exit 1
  fi
  echo "✓ $label ($path → $actual)"
}

assert_redirect() {
  local path="$1" expected_location="$2" label="$3"
  local location
  location=$(curl -s -o /dev/null -w "%{redirect_url}" "$BASE$path")
  if [[ "$location" != *"$expected_location"* ]]; then
    echo "✗ $label: expected redirect to $expected_location, got '$location'"
    exit 1
  fi
  echo "✓ $label ($path → $location)"
}

assert_status "/"                200 "landing page"
assert_status "/login"           200 "login page"
assert_status "/signup"          200 "signup page"
assert_status "/forgot-password" 200 "forgot-password page"
assert_status "/dashboard"       307 "anonymous dashboard is blocked"
assert_redirect "/dashboard" "/login" "anonymous dashboard redirects to login"
assert_status "/onboarding"      307 "anonymous onboarding is blocked"

echo "✓ smoke test passed"
