# Architecture

**Analysis Date:** 2026-04-02

## Pattern Overview

**Overall:** Next.js App Router storefront with Shopify Storefront API backend

**Key Characteristics:**
- Server Components fetch data directly from Shopify GraphQL; Client Components handle interactivity
- Cart state is managed globally via React Context (`CartProvider`) persisted to `localStorage`
- No custom API routes — all data fetching hits the Shopify Storefront API directly from server-side code
- Server/Client boundary is explicit: server components do data fetching, client components own UI state

## Layers

**Data Access Layer:**
- Purpose: All Shopify GraphQL queries and mutations
- Location: `lib/index.ts`, `lib/cartMutation.ts`
- Contains: `shopifyFetch` generic fetch wrapper, typed query functions (`getProducts`, `getCollection`, `getProductByHandle`), cart mutation functions (`createCart`, `addToCart`, `updateCart`, `removeFromCart`, `getCart`)
- Depends on: Shopify Storefront API (`SHOPIFY_STORE_DOMAIN`, `STOREFRONT_ACCESS_TOKEN` env vars)
- Used by: Server Components (`app/page.tsx`, `app/collections/[handle]/page.tsx`, `components/ProductDetail.tsx`), Cart Context (`lib/cartContext.tsx`)

**State Layer:**
- Purpose: Client-side cart state management
- Location: `lib/cartContext.tsx`
- Contains: `CartProvider` React context provider, `useCart` hook, `localStorage` cart persistence
- Depends on: `lib/cartMutation.ts` for all Shopify cart operations
- Used by: `components/Cart.tsx`, `components/ProductActions.tsx`, `components/addToCart.tsx`, `app/layout.tsx`

**Page Layer (Server Components):**
- Purpose: Route-level data fetching and page assembly
- Location: `app/page.tsx`, `app/collections/[handle]/page.tsx`, `app/product/[handle]/page.tsx`
- Contains: Async page components that call `lib/index.ts` functions and compose UI
- Depends on: `lib/index.ts`, UI components from `components/`
- Used by: Next.js router

**Component Layer:**
- Purpose: Reusable UI and interactive client-side behavior
- Location: `components/`
- Contains: Feature components (`Cart`, `ProductDetail`, `ProductDetailClient`, `ProductActions`, `ProductGallery`, `hero`), layout components (`navbar/page.tsx`), primitives (`components/ui/`)
- Depends on: `lib/cartContext.tsx`, `lib/utils.ts`, `components/ui/`
- Used by: Page Layer

## Data Flow

**Product Listing (Home / Collection):**

1. Next.js renders `app/page.tsx` or `app/collections/[handle]/page.tsx` on the server
2. Page calls `getProducts()` or `getCollection(handle)` from `lib/index.ts`
3. `shopifyFetch` sends GraphQL query to `https://{domain}/api/2024-01/graphql.json`
4. Shopify returns JSON; typed data passed as props to Client Components or rendered inline
5. Browser receives fully rendered HTML with product cards

**Product Detail:**

1. `app/product/[handle]/page.tsx` renders server component `ProductDetail`
2. `ProductDetail` calls `getProductByHandle(handle)` — fetches variants, images, options
3. `ProductDetail` passes `images`, `variants`, `options` to `ProductDetailClient` (Client Component)
4. `ProductDetailClient` manages `activeIndex` state shared between `ProductGallery` and `ProductActions`

**Add to Cart:**

1. User selects variant via `ProductActions` (client), clicks Add to Cart
2. `ProductActions` calls `addItem(merchandiseId)` from `useCart()`
3. `CartProvider.addItem` checks `localStorage` for existing `cartId`
4. If no cart: calls `createCart()` via `lib/cartMutation.ts` (`"use server"`) → stores new `cartId` in `localStorage`
5. If cart exists: calls `addToCart(cartId, lines)` — on error (expired cart) falls back to `createCart()`
6. Updated `Cart` object set in React state; `cartOpen` set to `true`
7. `Cart` component renders updated slide-over sheet

**Cart Hydration on Mount:**

1. `CartProvider` `useEffect` reads `cartId` from `localStorage`
2. Calls `getCart(cartId)` from `lib/cartMutation.ts`
3. Validates cart (non-empty lines must have positive prices)
4. Sets cart state or clears stale `cartId` if invalid/expired

**State Management:**
- Cart state lives in `CartContext` (`lib/cartContext.tsx`) — global, client-side
- Product/collection data is fetched server-side per request (no client-side caching layer)
- Gallery active image index: local `useState` in `ProductDetailClient`
- Navbar scroll/transparency: local `useState` + `framer-motion` `useScroll` in `components/navbar/page.tsx`

## Key Abstractions

**`shopifyFetch<T>`:**
- Purpose: Generic typed wrapper for all Shopify Storefront API GraphQL calls
- Examples: `lib/index.ts` (line 70), `lib/cartMutation.ts`
- Pattern: Accepts query string + variables, returns `ShopifyResponse<T>` with `data` and optional `errors`

**`Product` type:**
- Purpose: Canonical product shape used across data layer and UI
- Examples: `lib/index.ts` (exported at line 123)
- Pattern: Shopify GraphQL connection pattern (`edges[].node`) normalized to flat arrays at query boundary

**`Cart` / `CartLine` types:**
- Purpose: Typed cart state mirroring Shopify Cart API shape
- Examples: `lib/cartMutation.ts` (lines 15–52)
- Pattern: Exported and consumed by `lib/cartContext.tsx` and `components/Cart.tsx`

**`CartProvider` / `useCart`:**
- Purpose: Provides cart state and actions to all client components
- Examples: `lib/cartContext.tsx`
- Pattern: React Context with fallback no-op values for SSR safety

**Server/Client Component Split:**
- Purpose: Co-locate data fetching with server, interactivity with client
- Pattern: Server component fetches → passes serializable props → client component owns state
- Example: `components/ProductDetail.tsx` (server) → `components/ProductDetailClient.tsx` (client)

## Entry Points

**Root Layout:**
- Location: `app/layout.tsx`
- Triggers: Every page render
- Responsibilities: Wraps entire app in `CartProvider`, loads fonts, sets metadata

**Home Page:**
- Location: `app/page.tsx`
- Triggers: GET `/`
- Responsibilities: Fetches 12 products, renders hero, editorial tiles, product grid, footer

**Collection Page:**
- Location: `app/collections/[handle]/page.tsx`
- Triggers: GET `/collections/[handle]`
- Responsibilities: Fetches collection by handle, renders product grid or 404

**Product Page:**
- Location: `app/product/[handle]/page.tsx`
- Triggers: GET `/product/[handle]`
- Responsibilities: Passes handle to `ProductDetail` server component for data fetch + render

## Error Handling

**Strategy:** Throw on Shopify API errors; use Next.js `notFound()` for missing resources

**Patterns:**
- `shopifyFetch` returns raw response — callers check `errors` array and throw
- `getCollection` returns `null` for missing collections; page calls `notFound()`
- Cart operations catch errors and log to `console.error`; cart expiry triggers silent re-creation
- `isValidCart` guard in `CartProvider` clears corrupted/completed carts silently

## Cross-Cutting Concerns

**Logging:** `console.error` only; no structured logging framework
**Validation:** Runtime type safety via TypeScript; `isValidCart` for cart integrity; no form validation library
**Authentication:** No user auth; Shopify Storefront API uses public `STOREFRONT_ACCESS_TOKEN`

---

*Architecture analysis: 2026-04-02*
