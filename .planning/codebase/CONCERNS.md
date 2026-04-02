# Codebase Concerns

**Analysis Date:** 2026-04-02

## Security Considerations

**Storefront Access Token committed to repository:**
- Risk: The Shopify Storefront Access Token (`STOREFRONT_ACCESS_TOKEN`) and store domain (`SHOPIFY_STORE_DOMAIN`) are stored in plaintext in `.env` at the project root. Although `.gitignore` excludes `.env*`, the token is currently exposed in the working tree and could be committed accidentally or has already been visible to anyone with filesystem access.
- Files: `.env`
- Current mitigation: `.gitignore` has `.env*` pattern, but the file exists unprotected on disk and the token is already present in the git working tree.
- Recommendations: Rotate the Storefront Access Token immediately if this repo is ever pushed to a remote. Use environment variable injection via the deployment platform (Vercel env vars, etc.) rather than committing a local `.env`.

**Non-assertion on env vars at startup:**
- Risk: `lib/index.ts` reads `process.env.SHOPIFY_STORE_DOMAIN` and `process.env.STOREFRONT_ACCESS_TOKEN` into module-level `const` variables with no validation. If either is missing, the app silently sends requests with `undefined` interpolated into the URL and a `!`-asserted `undefined` token.
- Files: `lib/index.ts` (lines 3–4, 79)
- Current mitigation: TypeScript non-null assertion `token!` suppresses compile errors but does not prevent a runtime `undefined` value.
- Recommendations: Add startup validation that throws a descriptive error if required env vars are absent, rather than failing silently mid-request.

**Shopify API version is hardcoded:**
- Risk: The Storefront API version `2024-01` is hardcoded in `lib/index.ts` line 74. Shopify deprecates older API versions. When `2024-01` is sunset, all API calls will fail.
- Files: `lib/index.ts` (line 74)
- Recommendations: Extract the API version to a constant or env var so it can be updated in one place.

---

## Tech Debt

**Duplicate price formatting function:**
- Issue: A `fmt` helper (`£${parseFloat(amount).toFixed(2)}`) is defined inline at the top of both `app/page.tsx` (line 7) and `app/collections/[handle]/page.tsx` (line 7). This is copy-paste duplication; a change to currency symbol or formatting needs to be made in two places.
- Files: `app/page.tsx`, `app/collections/[handle]/page.tsx`
- Impact: Any future multi-currency or locale-aware formatting work must touch multiple files.
- Fix approach: Extract to `lib/utils.ts` (already imported by cart components) as `formatGBP` and import from both pages.

**`"use server"` directive on a file that only exports plain async functions:**
- Issue: `lib/cartMutation.ts` carries the `"use server"` directive at line 1, but its functions (`createCart`, `addToCart`, etc.) are imported and called from a client-side context (`lib/cartContext.tsx`). Next.js Server Actions require `"use server"` only on functions invoked as form actions or via `action=` props, not general utilities called from a client context module.
- Files: `lib/cartMutation.ts` (line 1), `lib/cartContext.tsx`
- Impact: The `"use server"` boundary may cause unexpected serialisation errors or double network hops. In Next.js 16 this can cause the functions to be treated as Server Actions that should only be callable via the Next.js RPC layer, not directly from the client.
- Fix approach: Remove `"use server"` from `cartMutation.ts` and let it be a shared utility module, or move all cart mutation calls into genuine Route Handlers (`app/api/cart/route.ts`).

**`lib/query.ts` is empty:**
- Issue: `lib/query.ts` exists as a file with only 1 line (empty). This is a leftover stub or placeholder.
- Files: `lib/query.ts`
- Impact: Low; adds confusion for developers who expect it to contain something.
- Fix approach: Remove the file or populate it with its intended contents.

**Unused component `components/laoyout/SearchBar.tsx` (typo in directory name):**
- Issue: `components/laoyout/SearchBar.tsx` (note: `laoyout` is a misspelling of `layout`) contains a fully functional `Searchbar` component that is never imported anywhere. The navbar has a Search button icon (`components/navbar/page.tsx` line 141) that does nothing on click—it has no `onClick` handler and no search overlay is rendered.
- Files: `components/laoyout/SearchBar.tsx`, `components/navbar/page.tsx` (line 139–143)
- Impact: The Search button in the navbar is a dead UI element. Users who click it get no response.
- Fix approach: Either wire the `Searchbar` component to the navbar search button, or remove both the dead button and the orphaned file.

**Footer links to non-existent pages:**
- Issue: `app/page.tsx` footer contains links to `/pages/faq`, `/pages/shipping`, `/pages/contact`, `/pages/size-guide`, and `/pages/about` (line 204). None of these routes exist in the `app/` directory. Clicking them produces a 404.
- Files: `app/page.tsx` (lines 254–265, 204)
- Impact: Users clicking FAQ, Shipping, Contact, or Size Guide in the footer get a 404 error.
- Fix approach: Create the missing page files under `app/pages/[slug]/` or remove the links until the pages exist.

**"Sale" nav link points to `/collections/all` instead of a sale collection:**
- Issue: In `components/navbar/page.tsx` (line 28), the "Sale" nav link has `href: "/collections/all"`. This means it navigates to the main catalogue, not a dedicated sale collection.
- Files: `components/navbar/page.tsx` (line 28)
- Impact: The "HOT" badge on the Sale link misleads users; clicking Sale shows every product.
- Fix approach: Change href to `/collections/sale` once a sale collection is created in Shopify.

**`eslint-disable-line` suppressions on React hooks rules:**
- Issue: `lib/cartContext.tsx` has two `// eslint-disable-line react-hooks/exhaustive-deps` comments (lines 129, 148) to suppress missing dependency warnings for `updateItem` and `removeItem`. The suppressed callbacks rely on `removeItemImpl`, which is a plain function defined in the component body (not a `useCallback`), introducing a stale-closure risk if the function body ever references state.
- Files: `lib/cartContext.tsx` (lines 129, 148)
- Impact: Low currently, but will cause subtle bugs if `removeItemImpl` is refactored to read state.
- Fix approach: Convert `removeItemImpl` to a `useCallback` and include it as a dependency, removing the suppressions.

**Multiple lockfiles present:**
- Issue: Both `package-lock.json` and `pnpm-lock.yaml` exist at the project root. This means the project has been installed with both npm and pnpm, leading to potential dependency resolution inconsistencies depending on which lockfile is used.
- Files: `package-lock.json`, `pnpm-lock.yaml`
- Impact: CI or collaborators using `npm install` vs `pnpm install` may get different dependency trees.
- Fix approach: Choose one package manager (likely pnpm given `pnpm-lock.yaml`), delete the other lockfile, and document the choice in README.

**`@apollo/server` is an unused dependency:**
- Issue: `package.json` lists `@apollo/server: ^5.2.0` as a production dependency. There are no GraphQL server files (`resolvers`, `typeDefs`, Apollo Server instantiation) anywhere in the codebase. All Shopify queries are made via plain `fetch` in `lib/index.ts`.
- Files: `package.json`
- Impact: Adds ~2MB+ to the production bundle unnecessarily.
- Fix approach: Remove `@apollo/server` from dependencies.

**`@shopify/shopify-api` is an unused dependency:**
- Issue: `package.json` lists `@shopify/shopify-api: ^12.2.0` as a dependency, but it is never imported anywhere. All Shopify communication goes through the custom `shopifyFetch` function in `lib/index.ts`.
- Files: `package.json`
- Impact: Adds significant bundle weight; `@shopify/shopify-api` is a large server-side SDK designed for private admin API usage.
- Fix approach: Remove from dependencies.

---

## Known Bugs

**"Quick Add" button on product cards has no functionality:**
- Symptoms: Hovering a product card on `app/page.tsx` and `app/collections/[handle]/page.tsx` reveals a "Quick Add" slide-up bar, but clicking it does nothing — it has no `onClick` handler and does not open the cart or trigger `addItem`.
- Files: `app/page.tsx` (line 148), `app/collections/[handle]/page.tsx` (line 84)
- Trigger: Hover any product card and click the "Quick Add" bar.
- Workaround: Users must navigate to the product detail page to add to cart.

**"Size Guide" button on product page is non-functional:**
- Symptoms: `components/ProductActions.tsx` (line 202) renders a "Size Guide" button with no `onClick` handler. Clicking it does nothing.
- Files: `components/ProductActions.tsx` (line 202)
- Trigger: Click "Size Guide" on any product page.
- Workaround: None.

**"Description" accordion toggle on product page has no state:**
- Symptoms: `components/ProductDetail.tsx` (line 44) renders a `<button>` labelled "Description" with a "+" icon, but there is no `useState` controlling visibility. The description text is always visible; the button is cosmetic only.
- Files: `components/ProductDetail.tsx` (lines 44–52)
- Trigger: Click "Description" button — nothing collapses or expands.
- Workaround: None (description is always shown).

**Newsletter form has no submission handler:**
- Symptoms: The newsletter `<form>` in `app/page.tsx` footer (lines 277–290) has no `onSubmit` handler, no API endpoint, and no action attribute. Submitting causes a page reload with no data sent.
- Files: `app/page.tsx` (lines 277–290)
- Trigger: Submit the newsletter form.
- Workaround: None.

**Privacy Policy and Terms of Service footer items are `<span>` not `<Link>`:**
- Symptoms: In `app/page.tsx` (lines 297–303), the Privacy Policy and Terms of Service items are rendered as `<span cursor-pointer>` elements, not `<Link>` or `<a>` tags. They have no `href` and navigating to them is impossible.
- Files: `app/page.tsx` (lines 297–303)
- Trigger: Click Privacy Policy or Terms of Service in the footer.
- Workaround: None.

---

## Performance Bottlenecks

**Homepage fetches products on every request with no caching:**
- Problem: `app/page.tsx` calls `getProducts(12)` on every request. `lib/index.ts` uses plain `fetch` with no `cache` option, `next.revalidate`, or `unstable_cache`. Next.js 16 defaults to `no-store` for dynamic routes unless cache is explicitly configured.
- Files: `app/page.tsx`, `lib/index.ts` (line 74)
- Cause: Missing `next: { revalidate: N }` option on the `fetch` call.
- Improvement path: Add `next: { revalidate: 3600 }` (or appropriate TTL) to the `fetch` call in `shopifyFetch`, or wrap data-fetching functions with `unstable_cache`.

**Hero cycles images using `setInterval` without cleanup guard on rapid unmount:**
- Problem: `components/hero.tsx` starts a 5-second `setInterval` whenever `products.length > 1`. Although there is a cleanup `return () => clearInterval(t)`, the dependency array uses `products.length` (not the array reference), which is fine for most cases but the `idx` state is closed over via the updater function — this pattern is correct. However, an additional `framer-motion` `useScroll` subscription is created on every Hero mount with no teardown beyond React's built-in cleanup. For a long-lived SPA session this is low risk but worth monitoring if Hero is ever conditionally rendered.
- Files: `components/hero.tsx` (lines 22–26)
- Cause: Acceptable currently; low priority.

**Cart lines hard-capped at 10 on `createCart`, 50 on other operations:**
- Problem: `lib/cartMutation.ts` creates a cart with `lines(first: 10)` (line 69), but `addToCart`, `updateCart`, `removeFromCart`, and `getCart` all use `lines(first: 50)`. After a `createCart` call the returned cart object only reflects the first 10 lines; subsequent `addToCart` responses correctly return 50.
- Files: `lib/cartMutation.ts` (line 69)
- Cause: Inconsistent pagination limits across mutations.
- Improvement path: Standardise to `lines(first: 100)` across all cart operations, or implement cursor-based pagination for carts with many items.

---

## Fragile Areas

**`ProductActions` variant-matching only handles "Color"/"Colour" and "Size" option names:**
- Files: `components/ProductActions.tsx` (lines 55–60), `components/ProductDetailClient.tsx`
- Why fragile: The helpers `isColorOption` and `isSizeOption` match exact lowercase option names. Any Shopify product using option names like "Shade", "Material", or "Style" will fall through to the generic "flat variant list" fallback UI, which sets `selectedSize` to a variant title string (not a real size option value), breaking variant selection state.
- Safe modification: When adding products with non-standard option names, expect the option selectors to be absent and a fallback variant list to render.
- Test coverage: None.

**Color swatch fallback renders 2-letter abbreviation for unrecognised colors:**
- Files: `components/ProductActions.tsx` (lines 47–53, 176–179)
- Why fragile: `colorForValue` only recognises ~25 hardcoded color names. Any Shopify colour option not in `COLOR_MAP` (e.g. "Rust", "Forest", "Cobalt", "Off-White") renders a tiny 2-character abbreviation swatch with no background, making the UI look broken.
- Safe modification: New product color variants should use names from `COLOR_MAP`, or the map must be extended.
- Test coverage: None.

**`useCart` returns a no-op object when called outside `CartProvider`:**
- Files: `lib/cartContext.tsx` (lines 160–174)
- Why fragile: Rather than throwing an error when the context is null (the standard pattern for required contexts), `useCart` silently returns no-op functions. If a component accidentally renders outside `CartProvider`, add-to-cart and other operations will silently do nothing, making bugs hard to diagnose.
- Safe modification: This pattern is intentional for SSR safety, but any new pages added without `CartProvider` in the tree will appear to work while cart is permanently broken.
- Test coverage: None.

---

## Missing Critical Features

**No error boundaries anywhere in the component tree:**
- Problem: There are no React Error Boundaries in the app. If a component throws during render (e.g., a malformed Shopify response), the entire page goes blank.
- Blocks: Graceful degradation, production stability.

**No loading state for product pages:**
- Problem: `app/product/[handle]/page.tsx` and `app/collections/[handle]/page.tsx` are async server components that fetch data. There is a top-level `app/loading.tsx` file (exists but contents not reviewed), but there is no `loading.tsx` inside `app/product/` or `app/collections/`. Navigating to a product or collection page shows a blank screen until data resolves.
- Files: `app/product/[handle]/`, `app/collections/[handle]/`

**No `not-found.tsx` for product pages:**
- Problem: `app/collections/[handle]/page.tsx` calls `notFound()` when a collection is not found. `app/product/[handle]/page.tsx` renders a generic inline "Product not found" paragraph instead of using `notFound()`. There is no `not-found.tsx` file in the project to customise the 404 experience.
- Files: `app/product/[handle]/page.tsx` (line 8–15), `app/collections/[handle]/page.tsx` (line 17)

---

## Test Coverage Gaps

**No tests exist:**
- What's not tested: The entire codebase — cart operations, Shopify data fetching, variant selection logic, price formatting, component rendering.
- Files: All files in `lib/`, `components/`, `app/`
- Risk: Any refactor of cart mutation logic, variant matching, or price formatting could silently break without detection.
- Priority: High — especially `lib/cartMutation.ts`, `lib/cartContext.tsx`, and `components/ProductActions.tsx` which contain non-trivial business logic.

---

*Concerns audit: 2026-04-02*
