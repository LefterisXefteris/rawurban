# Requirements: Raw — Shopify Storefront

**Defined:** 2026-04-02
**Core Value:** Customers can browse products and complete purchases without friction — the cart must always work.

## v1 Requirements

### Security & Dependencies

- [x] **SEC-01**: App fails fast with a descriptive error if SHOPIFY_STORE_DOMAIN or STOREFRONT_ACCESS_TOKEN env vars are missing at startup
- [x] **SEC-02**: Shopify API version extracted to a named constant (not hardcoded inline)
- [x] **DEP-01**: @apollo/server removed from production dependencies
- [x] **DEP-02**: @shopify/shopify-api removed from production dependencies
- [x] **DEP-03**: package-lock.json removed; pnpm established as sole package manager

### Code Quality

- [x] **QUAL-01**: "use server" directive removed from lib/cartMutation.ts; file works as a shared utility
- [x] **QUAL-02**: Price formatter extracted to lib/utils.ts and imported by app/page.tsx and app/collections/[handle]/page.tsx
- [x] **QUAL-03**: Empty lib/query.ts file deleted
- [x] **QUAL-04**: cartContext.tsx ESLint suppressions replaced with proper useCallback dependencies

### Bug Fixes

- [x] **BUG-01**: Quick Add button on product cards adds the first/default variant to cart
- [x] **BUG-02**: Description accordion on product page toggles open/closed (expanded by default)
- [x] **BUG-03**: Size Guide button opens a modal with a generic size chart
- [x] **BUG-04**: Newsletter form shows a success message on submit (no page reload)
- [x] **BUG-05**: Privacy Policy and Terms of Service render as clickable links
- [x] **BUG-06**: Navbar search button opens the SearchBar component

### Content & Navigation

- [ ] **NAV-01**: Footer links (FAQ, Shipping, Contact, Size Guide, About) navigate to real stub pages (no 404)
- [ ] **NAV-02**: Sale nav link href updated (no longer points to /collections/all)

### Resilience & UX

- [ ] **UX-01**: Each major page section has an inline error boundary with a "Something went wrong" fallback
- [ ] **UX-02**: /product/[handle] and /collections/[handle] routes have skeleton loading states
- [ ] **UX-03**: Custom not-found.tsx renders for 404 routes
- [ ] **UX-04**: Cart mutations use consistent first:100 line limit across all operations
- [ ] **UX-05**: shopifyFetch uses next: { revalidate: 3600 } to avoid per-request API calls

## v2 Requirements

### Testing

- **TEST-01**: Cart mutation functions have integration tests
- **TEST-02**: Variant selection logic has unit tests
- **TEST-03**: Price formatting utility has unit tests
- **TEST-04**: Component rendering tests for ProductActions

### Real Integrations

- **INT-01**: Newsletter form integrates with email service (Klaviyo / Mailchimp)
- **INT-02**: Full product search with results page
- **INT-03**: Real size guide data per product from Shopify metafields

### Content Pages

- **PAGE-01**: FAQ page with real content
- **PAGE-02**: Shipping page with real content
- **PAGE-03**: Contact page with form
- **PAGE-04**: About page with brand story

## Out of Scope

| Feature | Reason |
|---------|--------|
| User authentication | Storefront API is public; accounts require Admin API |
| Real newsletter backend | Deferred; success message ships first |
| Full search with results | SearchBar wire-up ships; search results are v2 |
| Test suite | No infra exists; dedicated phase deferred to v2 |
| Real sale collection | Depends on Shopify catalogue; only nav link fix in v1 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SEC-01 | Phase 1 | Complete |
| SEC-02 | Phase 1 | Complete |
| DEP-01 | Phase 1 | Complete |
| DEP-02 | Phase 1 | Complete |
| DEP-03 | Phase 1 | Complete |
| QUAL-01 | Phase 1 | Complete |
| QUAL-02 | Phase 1 | Complete |
| QUAL-03 | Phase 1 | Complete |
| QUAL-04 | Phase 1 | Complete |
| BUG-01 | Phase 2 | Complete |
| BUG-02 | Phase 2 | Complete |
| BUG-03 | Phase 2 | Complete |
| BUG-04 | Phase 2 | Complete |
| BUG-05 | Phase 2 | Complete |
| BUG-06 | Phase 2 | Complete |
| NAV-01 | Phase 3 | Pending |
| NAV-02 | Phase 3 | Pending |
| UX-01 | Phase 4 | Pending |
| UX-02 | Phase 4 | Pending |
| UX-03 | Phase 4 | Pending |
| UX-04 | Phase 4 | Pending |
| UX-05 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 22 total
- Mapped to phases: 22
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-02*
*Last updated: 2026-04-02 after initialization*
