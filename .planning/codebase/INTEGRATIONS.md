# External Integrations

**Analysis Date:** 2026-04-02

## APIs & External Services

**E-Commerce Platform:**
- Shopify Storefront API — Product catalog, collections, cart management, checkout
  - SDK/Client: `@shopify/storefront-api-client ^1.0.9` (installed but not invoked; raw `fetch` used instead)
  - Secondary SDK: `@shopify/shopify-api ^12.2.0` (installed, not actively called in current source)
  - Auth: `STOREFRONT_ACCESS_TOKEN` env var (passed as `X-Shopify-Storefront-Access-Token` header)
  - Endpoint: `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`
  - API Version: `2024-01`
  - Implementation: `lib/index.ts` (queries), `lib/cartMutation.ts` (mutations, Server Actions)

**Shopify Operations Implemented:**
- `getProducts(first)` — Fetch product list with price and featured image
- `getCollection(handle, first)` — Fetch collection with up to 48 products
- `getProductByHandle(handle)` — Fetch full product with variants, images, options
- `createCart(lines)` — Create new Shopify cart
- `getCart(cartId)` — Retrieve existing cart by ID
- `addToCart(cartId, lines)` — Add line items to cart
- `updateCart(cartId, lines)` — Update line item quantities
- `removeFromCart(cartId, lineIds)` — Remove line items from cart

**Checkout:**
- Shopify-hosted checkout — Cart contains `checkoutUrl` returned from Shopify; no custom checkout implementation

## Data Storage

**Databases:**
- None — No database layer detected. All product/cart data is fetched from Shopify API at runtime.

**File Storage:**
- Static assets: `public/` directory (local only)
- Images: Served from `cdn.shopify.com` (remote patterns configured in `next.config.ts`)

**Caching:**
- Next.js default fetch caching
- Image cache: 24-hour minimum TTL via `next.config.ts` `minimumCacheTTL`
- Cart persistence: Browser `localStorage` (key: `cartId`) — stores Shopify cart GID between sessions

## Authentication & Identity

**Auth Provider:**
- None — No user authentication implemented. No login, sessions, or JWT detected.
- Shopify Storefront API uses public access token only (no customer account login flows)

## Monitoring & Observability

**Error Tracking:**
- None — No Sentry, Datadog, or similar SDK detected.

**Logs:**
- `console.error` used in cart context (`lib/cartContext.tsx`) and Shopify fetch layer (`lib/index.ts`) for error reporting only

## CI/CD & Deployment

**Hosting:**
- Not configured — No `vercel.json`, `Dockerfile`, or deployment manifests detected.

**CI Pipeline:**
- None detected — No `.github/workflows/`, `.gitlab-ci.yml`, or similar.

## Environment Configuration

**Required env vars (`.env` at project root):**
- `SHOPIFY_STORE_DOMAIN` — Shopify store domain, e.g. `rawurban-3.myshopify.com`
- `STOREFRONT_ACCESS_TOKEN` — Public Shopify Storefront API access token

**Secrets location:**
- `.env` file at project root (contains live credentials — should not be committed)

## Fonts

**Google Fonts CDN:**
- Loaded in `app/layout.tsx` via `<link>` tags
- Families: Bebas Neue, Barlow (300–700 + italic), Cormorant Garamond (300–700 + italic)
- Preconnect hints to `fonts.googleapis.com` and `fonts.gstatic.com`

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

---

*Integration audit: 2026-04-02*
