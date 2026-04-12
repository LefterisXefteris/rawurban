---
phase: 02-bug-fixes
plan: 01
subsystem: ui
tags: [nextjs, react, shopify, cart, footer]
requires:
  - phase: 01-security-code-cleanup
    provides: Shopify fetch cleanup and shared price formatting utilities
provides:
  - Shared client product cards with quick-add cart actions on home and collection grids
  - Client-only newsletter success state with timed reset in the footer
  - Internal privacy-policy and terms-of-service routes wired from footer links
affects: [product-grid, cart, footer, legal-pages]
tech-stack:
  added: []
  patterns:
    - Server-rendered pages passing Shopify product data into small client interaction leaves
    - Hardcoded internal legal routes instead of inert footer text
key-files:
  created:
    - components/cards/ProductCard.tsx
    - components/footer/NewsletterSignup.tsx
    - app/privacy-policy/page.tsx
    - app/terms-of-service/page.tsx
  modified:
    - app/page.tsx
    - app/collections/[handle]/page.tsx
    - lib/index.ts
key-decisions:
  - "Quick Add stays in a dedicated client ProductCard so home and collection pages remain server-rendered."
  - "Footer legal links ship with real App Router pages in the same plan to avoid clickable 404s."
patterns-established:
  - "Client card islands can consume trusted Shopify variant data from server queries and call useCart directly."
  - "Footer-only interaction upgrades should preserve the existing monochrome styling and typography."
requirements-completed: [BUG-01, BUG-04, BUG-05]
duration: 3 min
completed: 2026-04-12
---

# Phase 02 Plan 01: Product Cards and Footer Fixes Summary

**Reusable quick-add product cards, timed newsletter success feedback, and live legal routes for the storefront footer**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-12T09:05:52Z
- **Completed:** 2026-04-12T09:09:33Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Replaced the dead product-card Quick Add bars with a shared client `ProductCard` that chooses a valid in-stock variant and uses the existing cart context flow.
- Extended Shopify list queries so home and collection grids receive the variant IDs and inventory needed for cart mutations without extra requests.
- Replaced the footer newsletter placeholder with a client success-state swap and turned both legal footer items into working internal routes.

## Task Commits

Each task was committed atomically:

1. **Task 1: Build reusable Quick Add product cards for home and collection grids** - `e117100` (fix)
2. **Task 2: Replace footer placeholders with newsletter success state and live legal routes** - `30da0eb` (fix)

## Files Created/Modified
- `components/cards/ProductCard.tsx` - Client card island with sibling product links and quick-add button states.
- `lib/index.ts` - Product and collection list queries now include variant IDs, titles, availability, and selected options.
- `app/page.tsx` - Home grid now renders `ProductCard`; footer uses `NewsletterSignup` and hardcoded legal links.
- `app/collections/[handle]/page.tsx` - Collection grid now renders `ProductCard`.
- `components/footer/NewsletterSignup.tsx` - Timed client-only success state for the footer form.
- `app/privacy-policy/page.tsx` - New legal route with branded static privacy copy.
- `app/terms-of-service/page.tsx` - New legal route with branded static terms copy.

## Decisions Made
- Kept both product-listing pages server-rendered and moved only the interaction into a client leaf component.
- Used hardcoded `/privacy-policy` and `/terms-of-service` destinations to satisfy the legal-link threat mitigation without introducing external navigation.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- `pnpm lint` still fails repo-wide because of unrelated pre-existing problems in `.codex/get-shit-done/bin/*.cjs` and `components/ProductGallery.tsx`. To verify this plan safely, I also ran scoped ESLint on the files changed by each task; those checks passed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Plan `02-02` can build on the same server-page plus client-leaf pattern for product-page interactions and navbar search.
- Production build passes, and the new legal routes are part of the compiled app.
- Repo-wide lint remains noisy until the unrelated `.codex` and `components/ProductGallery.tsx` issues are addressed.

## Self-Check: PASSED
- Summary file exists at `.planning/phases/02-bug-fixes/02-bug-fixes-01-SUMMARY.md`.
- Task commits `e117100` and `30da0eb` are present in git history.
