# Roadmap: Raw — Shopify Storefront

**Created:** 2026-04-02
**Milestone:** v1 — Fix & Stabilize

---

## Phase 1: Security & Code Cleanup

**Goal:** Remove dead weight, fix structural issues, and harden the codebase before touching UI.

**Requirements:** SEC-01, SEC-02, DEP-01, DEP-02, DEP-03, QUAL-01, QUAL-02, QUAL-03, QUAL-04

**Success Criteria:**
1. `npm run build` succeeds with no TypeScript errors after dep removal
2. App throws a descriptive error on startup if env vars are missing (not silent undefined)
3. API version is defined once as a constant; no inline string
4. `lib/cartMutation.ts` has no "use server" directive; imports work from client context
5. `lib/utils.ts` exports `formatPrice`; both page files import from it (no duplicate fmt)
6. `lib/query.ts` is deleted
7. Only `pnpm-lock.yaml` exists; `package-lock.json` is gone

**Plans:** 2 plans

Plans:
- [x] 01-01-PLAN.md — Remove unused deps + establish pnpm lockfile + env guard + API version constant
- [x] 01-02-PLAN.md — Fix "use server" misuse + extract formatPrice + delete empty file + fix useCallback

---

## Phase 2: Bug Fixes

**Goal:** Every interactive element in the UI does what users expect when they click it.

**Requirements:** BUG-01, BUG-02, BUG-03, BUG-04, BUG-05, BUG-06

**Success Criteria:**
1. Hovering a product card and clicking Quick Add adds the first variant to cart — cart drawer opens
2. Clicking the Description button on a product page toggles content visibility; starts expanded
3. Clicking Size Guide on a product page opens a modal with a measurements table
4. Submitting the newsletter form shows a success message; no page reload
5. Privacy Policy and Terms of Service in the footer navigate somewhere (link, not span)
6. Clicking the navbar search icon opens the SearchBar input

**Plans:**
1. Quick Add functionality + SearchBar wire-up
2. Description accordion + Size Guide modal + newsletter success + privacy/terms links

---

## Phase 3: Content & Navigation

**Goal:** No dead links. Every footer link and nav item goes somewhere real.

**Requirements:** NAV-01, NAV-02

**Success Criteria:**
1. Clicking FAQ, Shipping, Contact, Size Guide, or About in the footer renders a page (not 404)
2. Sale nav link does not point to /collections/all

**Plans:**
1. Scaffold stub pages (FAQ, Shipping, Contact, Size Guide, About) + fix Sale nav link

---

## Phase 4: Resilience & Performance

**Goal:** The app degrades gracefully on errors, shows meaningful loading states, and doesn't hammer the Shopify API on every request.

**Requirements:** UX-01, UX-02, UX-03, UX-04, UX-05

**Success Criteria:**
1. A deliberate render error in a product section shows an inline fallback — rest of page stays functional
2. Navigating to a product or collection page shows skeleton cards while data loads
3. Navigating to a non-existent route renders a custom 404 page (not Next.js default)
4. Cart createCart uses first:100 (consistent with other cart operations)
5. shopifyFetch passes next: { revalidate: 3600 }; repeated requests within 1 hour are served from cache

**Plans:**
1. Error boundaries (inline per section) + not-found.tsx + cart line limit fix
2. Skeleton loading states for product and collection routes + shopifyFetch caching

---

## Phase Summary

| # | Phase | Goal | Requirements | Plans |
|---|-------|------|--------------|-------|
| 1 | Security & Code Cleanup | Remove dead weight, fix structure | SEC-01/02, DEP-01/02/03, QUAL-01/02/03/04 | 2 |
| 2 | Bug Fixes | Every UI element works as expected | BUG-01 through BUG-06 | 2 |
| 3 | Content & Navigation | No dead links | NAV-01, NAV-02 | 1 |
| 4 | Resilience & Performance | Graceful degradation + caching | UX-01 through UX-05 | 2 |

**Total:** 4 phases | 7 plans | 22 v1 requirements | All mapped ✓

---
*Roadmap created: 2026-04-02*
