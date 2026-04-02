---
phase: 01-security-&-code-cleanup
plan: 02
subsystem: api
tags: [shopify, typescript, react-hooks, useCallback, code-cleanup, cart, utils]

# Dependency graph
requires:
  - phase: 01-01
    provides: Cleaned lib/index.ts with env guards and SHOPIFY_API_VERSION constant
provides:
  - lib/cartMutation.ts as a plain TypeScript module (no "use server" directive)
  - formatPrice(amount: string): string exported from lib/utils.ts
  - Both page files import formatPrice from @/lib/utils (no local fmt duplicates)
  - lib/query.ts deleted (empty file, no references)
  - lib/cartContext.tsx with properly-wired useCallback hooks, no eslint-disable suppressions
affects:
  - 02-bug-fixes (cart context is fully correct, no React hooks violations)
  - All future phases (lib/utils.ts is now the shared utility module)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Shared formatter pattern: price formatting in lib/utils.ts, imported by all pages"
    - "useCallback with stable deps: wrap inner helpers in useCallback([]) then list them in downstream hook deps"

key-files:
  created: []
  modified:
    - lib/cartMutation.ts
    - lib/utils.ts
    - app/page.tsx
    - app/collections/[handle]/page.tsx
    - lib/cartContext.tsx

key-decisions:
  - "formatPrice placed in lib/utils.ts (not lib/index.ts) to keep Shopify API gateway separate from pure utility functions"
  - "removeItemImpl wrapped in useCallback([]) because setLoading/setCart are stable state setters and removeFromCart is a stable module-level import"
  - "Empty dep array on removeItemImpl is semantically correct, not a suppression — no captured unstable values"

patterns-established:
  - "Utility pattern: shared pure functions go in lib/utils.ts alongside cn()"
  - "useCallback chain pattern: inner helpers wrapped first with stable deps, outer hooks list inner helpers as deps"

# Metrics
duration: 8min
completed: 2026-04-02
---

# Phase 1 Plan 02: "use server" Removal, formatPrice Extraction & useCallback Fix Summary

**Removed "use server" misuse from cartMutation.ts, extracted duplicated price formatter to lib/utils.ts, deleted empty lib/query.ts, and replaced ESLint hook suppressions with properly-wired useCallback dependency chains**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-04-02T15:07:32Z
- **Completed:** 2026-04-02T15:15:20Z
- **Tasks:** 2
- **Files modified:** 5 (cartMutation.ts, utils.ts, page.tsx, [handle]/page.tsx, cartContext.tsx) + deleted lib/query.ts

## Accomplishments

- Removed "use server" from lib/cartMutation.ts — the file only imports shopifyFetch (no next/headers or server-only packages); marking it as a Server Action was semantically incorrect and would expose cart mutations as publicly-callable HTTP endpoints
- Extracted `formatPrice(amount: string): string` into lib/utils.ts; both app/page.tsx and app/collections/[handle]/page.tsx now import it instead of defining a local `const fmt` arrow function
- Deleted the empty lib/query.ts file (1-line placeholder with no content or references)
- Fixed React hooks violation in lib/cartContext.tsx: `removeItemImpl` is now a `useCallback([])` (stable), and both `updateItem` and `removeItem` correctly declare `[removeItemImpl]` as their dependency — the two `eslint-disable-line react-hooks/exhaustive-deps` comments are gone

## Task Commits

Each task was committed atomically:

1. **Task 1: Remove "use server", extract formatPrice, delete query.ts** - `badc7e5` (refactor)
2. **Task 2: Fix useCallback ESLint suppressions in cartContext.tsx** - `6f41eb9` (fix)

**Plan metadata:** _(docs commit follows)_

## Files Created/Modified

- `lib/cartMutation.ts` - Removed "use server" directive from line 1; now a plain TypeScript module
- `lib/utils.ts` - Added `formatPrice(amount: string): string` export after existing `cn()` function
- `app/page.tsx` - Removed local `const fmt` arrow function; added `import { formatPrice } from "@/lib/utils"`; replaced all `fmt(` calls with `formatPrice(`
- `app/collections/[handle]/page.tsx` - Same as above: removed `const fmt`, imported formatPrice, replaced usages
- `lib/cartContext.tsx` - Wrapped `removeItemImpl` in `useCallback([])`, moved it before `updateItem`, updated `updateItem` deps to `[removeItemImpl]`, updated `removeItem` deps to `[removeItemImpl]`, deleted both eslint-disable comments
- `lib/query.ts` - Deleted (empty file, no imports anywhere in codebase)

## Decisions Made

- **formatPrice in lib/utils.ts not lib/index.ts:** lib/index.ts is the Shopify API gateway (shopifyFetch, getProducts, getCollection). Pure formatting utilities belong in lib/utils.ts to maintain clean separation between API concerns and UI helpers.
- **removeItemImpl wrapped in useCallback([]):** setLoading and setCart are React state setter functions (stable reference guaranteed by React). removeFromCart is a module-level import (stable). Empty dependency array is semantically accurate — not a workaround.
- **removeItemImpl moved before updateItem:** Required so updateItem can reference it in the dependency array. JavaScript function declarations are hoisted but const declarations are not; useCallback returns a value, so order matters.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

- `npx` was not available in the default shell PATH. Located Node.js at `/opt/homebrew/bin`. Resolved by exporting PATH inline; no plan change needed.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- lib/cartMutation.ts is a clean plain TypeScript module, safe to import from both client and server contexts
- lib/utils.ts now has two exports (cn, formatPrice) — ready to be the home for future shared utilities
- lib/cartContext.tsx has correct React hooks semantics — ready for feature work in Phase 2 Bug Fixes
- No TypeScript errors (npx tsc --noEmit passes), no ESLint exhaustive-deps warnings, build succeeds
- No blockers for Phase 2

---
*Phase: 01-security-&-code-cleanup*
*Completed: 2026-04-02*
