# Raw — Shopify Storefront

## What This Is

A Next.js App Router storefront connected to Shopify via the Storefront API. Server components fetch product/collection data; client components handle cart state via React Context persisted to localStorage. The store is functional but has accumulated known bugs, tech debt, security gaps, and missing UX scaffolding that need to be resolved.

## Core Value

Customers can browse products and complete purchases without friction — the cart must always work.

## Requirements

### Validated

- ✓ Product listing on homepage (12 products) — existing
- ✓ Collection pages with product grid — existing
- ✓ Product detail page with variant selection — existing
- ✓ Cart (add, update, remove, persist via localStorage) — existing
- ✓ Slide-over cart drawer — existing
- ✓ Hero component with rotating featured products — existing
- ✓ Navbar with scroll-aware transparency — existing
- ✓ Shopify Storefront API integration (GraphQL) — existing
- ✓ TypeScript throughout — existing

### Active

- [ ] Remove unused dependencies (@apollo/server, @shopify/shopify-api)
- [ ] Fix "use server" misuse in cartMutation.ts
- [ ] Add startup env var validation (fail fast on missing tokens)
- [ ] Extract Shopify API version to constant
- [ ] Extract price formatter to lib/utils.ts (dedup)
- [ ] Delete empty lib/query.ts stub
- [ ] Fix ESLint suppression on cartContext.tsx hooks (useCallback)
- [ ] Standardize on pnpm (remove package-lock.json)
- [ ] Quick Add button: add first variant to cart on click
- [ ] Description accordion: real toggle, expanded by default
- [ ] Size Guide: modal with size chart on click
- [ ] Newsletter form: show success message on submit
- [ ] Privacy Policy / Terms: real links (not <span>)
- [ ] Wire SearchBar component to navbar search button
- [ ] Create stub pages: FAQ, Shipping, Contact, Size Guide, About
- [ ] Fix Sale nav link href
- [ ] Error boundaries per section (inline fallback)
- [ ] loading.tsx for /product/[handle] and /collections/[handle] (skeleton screens)
- [ ] not-found.tsx for custom 404
- [ ] Standardize cart line limits (first:100 across all operations)
- [ ] Add revalidation to shopifyFetch (next: { revalidate: 3600 })

### Out of Scope

- User authentication / accounts — not a Storefront API concern in v1
- Real newsletter integration (Klaviyo, Mailchimp) — deferred; success message ships first
- Search with results — SearchBar wired to open; full search is a future phase
- Tests — no test infrastructure exists; deferred to a dedicated testing phase
- Real sale collection — depends on Shopify catalogue; fix is a nav link update only

## Context

- Stack: Next.js 15 App Router, TypeScript, Tailwind CSS, Framer Motion, Radix UI
- Backend: Shopify Storefront API 2024-01 (GraphQL over fetch, no SDK)
- Deployment target: Vercel
- Cart persistence: localStorage (cartId stored, hydrated on mount)
- No user auth — public storefront only
- Codebase map exists at `.planning/codebase/`

## Constraints

- **Tech Stack**: Next.js App Router + Shopify Storefront API — no SDK swap, no backend changes
- **No Tests Yet**: Test infrastructure doesn't exist; fixes must not require it
- **Shopify Dependency**: Sale collection, size guide data, and real page content depend on Shopify catalogue configuration

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Quick Add adds first variant | Fastest UX; no selector needed for simple products | — Pending |
| Description accordion expanded by default | Content visible; toggle adds collapse option | — Pending |
| Size Guide opens modal | No external page needed; generic measurements table | — Pending |
| Newsletter shows success message (no integration) | Ships honest UX without backend dependency | — Pending |
| Footer pages get stub routes | Links must work; placeholder > 404 | — Pending |
| SearchBar wired to navbar button | Component already exists; wire it in | — Pending |
| Error boundaries inline per section | Isolated failures; rest of page stays functional | — Pending |
| Loading states: skeleton screens | Matches layout shape; better perceived performance | — Pending |
| Standardize on pnpm | pnpm-lock.yaml present; remove npm lockfile | — Pending |

---
*Last updated: 2026-04-02 after initialization*
