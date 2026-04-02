---
phase: 01-security-&-code-cleanup
plan: 01
subsystem: api
tags: [shopify, pnpm, environment-variables, typescript, dependency-cleanup]

# Dependency graph
requires: []
provides:
  - Cleaned package.json with only used production dependencies
  - pnpm as the sole lockfile/package manager (pnpm-lock.yaml only)
  - Fail-fast module-level env-var guards for SHOPIFY_STORE_DOMAIN and STOREFRONT_ACCESS_TOKEN
  - Named SHOPIFY_API_VERSION constant replacing inline hardcoded string
affects:
  - 01-02 (code cleanup continues in same phase)
  - All future phases (lib/index.ts is the Shopify API gateway used everywhere)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Fail-fast env guard: throw at module-eval time before any request can be made"
    - "Named API version constant: single definition, referenced via template literal"

key-files:
  created: []
  modified:
    - lib/index.ts
    - package.json
    - pnpm-lock.yaml

key-decisions:
  - "Use pnpm exclusively as package manager; deleted package-lock.json"
  - "Guards placed at module evaluation time (top-level), not inside functions, so error surfaces on first import"
  - "Used 'token as string' instead of 'token!' to eliminate non-null assertion after guard proves token is truthy"

patterns-established:
  - "Env guard pattern: check env var at module top-level, throw descriptive Error with .env.local instructions"
  - "Version constant pattern: define once as named const, reference in template literals"

# Metrics
duration: 2min
completed: 2026-04-02
---

# Phase 1 Plan 01: Dependency Cleanup & Env Hardening Summary

**Removed @apollo/server and @shopify/shopify-api (zero-import dead weight), migrated to pnpm-only lockfile, and hardened lib/index.ts with module-level env guards and a named SHOPIFY_API_VERSION constant**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-02T15:04:20Z
- **Completed:** 2026-04-02T15:05:58Z
- **Tasks:** 2
- **Files modified:** 3 (package.json, pnpm-lock.yaml, lib/index.ts) + deleted package-lock.json

## Accomplishments

- Removed @apollo/server and @shopify/shopify-api from production dependencies (no code imports existed)
- Deleted npm package-lock.json; pnpm-lock.yaml is now the sole lockfile
- Added module-level fail-fast guards: missing env vars throw descriptive errors on first import
- Extracted `SHOPIFY_API_VERSION = "2024-01"` constant; URL template literal now references it
- Eliminated `token!` non-null assertion (replaced with `token as string` — safe because guard above proves it's truthy)
- Build passes with zero TypeScript errors after all changes

## Task Commits

Each task was committed atomically:

1. **Task 1: Remove unused deps and establish pnpm as sole package manager** - `b051a35` (chore)
2. **Task 2: Add env-var guards and extract API version constant in lib/index.ts** - `592e7be` (feat)

**Plan metadata:** _(docs commit follows)_

## Files Created/Modified

- `lib/index.ts` - Added module-level env guards, SHOPIFY_API_VERSION constant, updated URL template, removed token! assertion
- `package.json` - Removed @apollo/server and @shopify/shopify-api from dependencies
- `pnpm-lock.yaml` - Updated to reflect removed packages
- `package-lock.json` - Deleted (npm lockfile, replaced by pnpm-lock.yaml)

## Decisions Made

- **pnpm as sole package manager:** Existing pnpm-lock.yaml established pnpm as the intent; removing package-lock.json makes this unambiguous
- **Guards at module evaluation time:** Placed at top level (not inside shopifyFetch) so the error surfaces on first import regardless of Next.js lifecycle stage (build, dev, server start)
- **`token as string` not `token!`:** The preceding guard proves `token` is truthy at runtime; `as string` communicates the same intent to TypeScript without a non-null assertion operator

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- pnpm was not in the default shell PATH used by the agent. Found at `/opt/homebrew/bin/pnpm` via PATH expansion. Resolved immediately — no plan change needed.

## User Setup Required

None - no external service configuration required. Env vars (SHOPIFY_STORE_DOMAIN, STOREFRONT_ACCESS_TOKEN) must already be set in `.env.local` for the app to run; the guards added in this plan will surface helpful errors if they are missing.

## Next Phase Readiness

- lib/index.ts is clean, secure, and type-safe — ready for any further refactoring in plan 01-02
- No import errors or missing-module risks from removed packages (confirmed by successful build)
- No blockers for phase 2 (Bug Fixes)

---
*Phase: 01-security-&-code-cleanup*
*Completed: 2026-04-02*
