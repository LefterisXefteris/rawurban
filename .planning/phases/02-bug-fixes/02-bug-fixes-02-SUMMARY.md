---
phase: 02-bug-fixes
plan: 02
subsystem: ui
tags: [nextjs, react, radix-ui, framer-motion, accessibility]
requires: []
provides:
  - product description accordion with initial-open client state
  - centered size guide modal with static fit table
  - navbar search overlay with focused input and internal collection suggestions
affects: [phase-03-content-navigation, phase-04-resilience-performance]
tech-stack:
  added: [@radix-ui/react-dialog]
  patterns:
    - small client interaction leaves inside server-rendered shells
    - route-scoped navbar overlay state with hardcoded internal links
key-files:
  created:
    - components/product/DescriptionAccordion.tsx
    - components/product/SizeGuideModal.tsx
    - components/navbar/SearchBar.tsx
  modified:
    - components/ProductDetail.tsx
    - components/ProductActions.tsx
    - components/navbar/page.tsx
    - package.json
    - pnpm-lock.yaml
key-decisions:
  - "Keep the product page server-rendered and move only the description block into a client accordion leaf."
  - "Use Radix Dialog for the Size Guide modal so escape, overlay-click close, and focus management come from the primitive."
  - "Keep navbar search state local and restrict suggestions to hardcoded internal collection links until full search ships."
patterns-established:
  - "Interactive product-page upgrades stay in small client leaves instead of expanding the full page into client mode."
  - "Navbar overlays can be route-scoped local state with focus-on-open behavior and no query-driven redirects."
requirements-completed: [BUG-02, BUG-03, BUG-06]
duration: 4 min
completed: 2026-04-12
---

# Phase 2 Plan 2: Product Detail and Navbar Interaction Summary

**Description toggling, size-guide modal behavior, and navbar search guidance now ship as accessible client leaves inside the existing storefront shells.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-12T09:06:30Z
- **Completed:** 2026-04-12T09:10:46Z
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments

- Replaced the static product description block with an initially-open accordion that renders Shopify description text as plain JSX.
- Added a centered Radix dialog for the Size Guide with a hardcoded fit table and standard close behavior.
- Wired the navbar search icon to a focused overlay with premium helper copy and internal collection suggestions.

## Task Commits

Each task was committed atomically:

1. **Task 1: Convert the product description into an initially-open accordion** - `f0e092c` (`fix`)
2. **Task 2: Add a centered Size Guide modal with a static measurement table** - `e0f4887` (`fix`)
3. **Task 3: Wire the navbar search icon to a guided search overlay** - `8eac1b9` (`fix`)

**Plan metadata:** pending final docs commit

## Files Created/Modified

- `components/product/DescriptionAccordion.tsx` - client accordion leaf with initial-open state, deterministic content id, and subtle toggle motion.
- `components/ProductDetail.tsx` - swaps the static description markup for the new accordion while preserving the server-rendered shell.
- `components/product/SizeGuideModal.tsx` - Radix dialog modal with a centered panel, close control, and static measurement table.
- `components/ProductActions.tsx` - replaces the inert Size Guide button with the modal trigger in the existing size-row header.
- `components/navbar/SearchBar.tsx` - focused dropdown overlay with helper copy and three hardcoded internal suggestion links.
- `components/navbar/page.tsx` - owns local search state, exposes `aria-expanded`, and scopes the overlay to the current route/navbar state.
- `package.json` - adds `@radix-ui/react-dialog`.
- `pnpm-lock.yaml` - locks the Radix dialog dependency graph.

## Decisions Made

- Kept all three fixes as narrow client leaves to preserve the current server/client storefront architecture.
- Used static fit-table content for the Size Guide to stay inside the phase boundary and avoid introducing product-metafield dependencies.
- Treated the navbar search affordance as guided navigation only, with no form submission or result routing until the later search phase.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- `pnpm lint` fails in the current worktree because of pre-existing ESLint errors in `.codex/get-shit-done/bin/**/*.cjs` and an existing hook-rule error in `components/ProductGallery.tsx`.
- To keep the plan moving without touching unrelated files, each task was additionally checked with targeted ESLint on the files changed in that task.
- `pnpm build` passed after the plan changes.

## Authentication Gates

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Product detail and navbar shells now expose the expected interaction points for manual UAT.
- Full-plan linting still needs a separate cleanup pass for the existing `.codex` CommonJS files and `components/ProductGallery.tsx`.

## Known Stubs

None - the deferred full-search copy in the navbar overlay is intentional and matches the plan boundary.

## Self-Check: PASSED

- Summary file exists at `.planning/phases/02-bug-fixes/02-bug-fixes-02-SUMMARY.md`.
- Task commits `f0e092c`, `e0f4887`, and `8eac1b9` exist in git history.
