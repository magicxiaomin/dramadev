#!/usr/bin/env bash
set -euo pipefail

MODE="local"
if [[ "${1:-}" == "--ci" ]]; then
  MODE="ci"
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if ! command -v pnpm >/dev/null 2>&1; then
  corepack enable
fi

if [[ "$MODE" == "ci" ]]; then
  pnpm install --frozen-lockfile
elif [[ ! -d node_modules ]]; then
  pnpm install --frozen-lockfile
fi

node .github/scripts/review-gate-checks.mjs
pnpm check:banned-deps
pnpm test:unit
pnpm lint
pnpm build

printf '\nDramaDev P0 acceptance smoke passed (%s).\n' "$MODE"
