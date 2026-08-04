#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Living-docs check — keeps docs/ai-skills/ in sync with the real structure.
#
# Fails when:
#   1. a workspace package or app is never mentioned in docs/ai-skills/
#   2. a required docs file is missing
#
# Run it locally with `bash scripts/check-ai-docs.sh`; CI runs it on every PR.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

DOCS_DIR="docs/ai-skills"
REQUIRED_DOCS=(
  "$DOCS_DIR/README.md"
  "$DOCS_DIR/architecture.md"
  "$DOCS_DIR/conventions.md"
  "$DOCS_DIR/data-access.md"
  "$DOCS_DIR/add-module.md"
)

fail=0

for doc in "${REQUIRED_DOCS[@]}"; do
  if [[ ! -f "$doc" ]]; then
    echo "✗ missing required doc: $doc"
    fail=1
  fi
done

if [[ $fail -eq 1 ]]; then
  exit 1
fi

for dir in packages/* apps/*; do
  [[ -d "$dir" ]] || continue
  name=$(basename "$dir")
  if ! grep -rq "$name" "$DOCS_DIR"; then
    echo "✗ '$dir' is never mentioned in $DOCS_DIR — update the docs (see $DOCS_DIR/add-module.md checklist)"
    fail=1
  fi
done

if [[ $fail -eq 1 ]]; then
  exit 1
fi

echo "✓ docs/ai-skills is in sync with the workspace structure"
