# Codebase Structure

**Analysis Date:** 2026-04-02

## Directory Layout

```
raw/                          # Project root
├── app/                      # Next.js App Router pages and layouts
│   ├── layout.tsx            # Root layout — CartProvider, fonts, metadata
│   ├── page.tsx              # Home page (server component)
│   ├── globals.css           # Global styles, Tailwind base, custom animations
│   ├── loading.tsx           # Global loading UI
│   ├── favicon.ico
│   ├── collections/
│   │   └── [handle]/
│   │       └── page.tsx      # Collection listing page
│   ├── product/
│   │   └── [handle]/
│   │       └── page.tsx      # Product detail page
│   └── routes/               # Empty directory (unused placeholder)
├── components/               # Reusable UI components
│   ├── Cart.tsx              # Slide-over cart sheet (client)
│   ├── ProductDetail.tsx     # Product detail server component (data fetch + layout)
│   ├── ProductDetailClient.tsx # Product detail client component (shared gallery/actions state)
│   ├── ProductActions.tsx    # Variant selector + add-to-cart (client)
│   ├── ProductGallery.tsx    # Image gallery with thumbnails (client)
│   ├── addToCart.tsx         # Standalone add-to-cart button component
│   ├── hero.tsx              # Homepage hero with cycling product images (client)
│   ├── logo.tsx              # Brand logo component
│   ├── navbar/
│   │   └── page.tsx          # Adaptive navbar with scroll behavior (client)
│   ├── laoyout/              # Misspelled directory (legacy)
│   │   └── SearchBar.tsx     # Unused search bar component
│   └── ui/                   # shadcn/ui primitive components
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── separator.tsx
│       └── sheet.tsx         # Slide-over sheet (used by Cart)
├── lib/                      # Shared logic, data access, state
│   ├── index.ts              # Shopify Storefront API client + product/collection queries
│   ├── cartMutation.ts       # Shopify cart GraphQL mutations and queries
│   ├── cartContext.tsx       # Cart React Context, CartProvider, useCart hook
│   ├── utils.ts              # `cn` utility (clsx + tailwind-merge)
│   └── query.ts              # Empty file (unused placeholder)
├── public/                   # Static assets
│   └── llms.txt
├── .env                      # Environment variables (gitignored)
├── next.config.ts            # Next.js config — Shopify CDN image patterns, formats
├── tsconfig.json             # TypeScript config — strict mode, `@/*` path alias
├── components.json           # shadcn/ui config
├── package.json
├── postcss.config.mjs
└── eslint.config.mjs
```

## Directory Purposes

**`app/`:**
- Purpose: All Next.js App Router routes and the root layout
- Contains: Server components (pages), one client component per route where needed, global CSS
- Key files: `app/layout.tsx` (root), `app/page.tsx` (home), `app/collections/[handle]/page.tsx`, `app/product/[handle]/page.tsx`

**`components/`:**
- Purpose: Feature and layout UI components
- Contains: Both server and client components; file-level `"use client"` directive marks client components
- Key files: `components/ProductDetail.tsx` (server/client split boundary), `components/Cart.tsx`, `components/navbar/page.tsx`

**`components/ui/`:**
- Purpose: Low-level primitive components from shadcn/ui
- Contains: Unstyled-base components (Button, Badge, Card, Input, Separator, Sheet)
- Key files: `components/ui/sheet.tsx` (used by cart slide-over)

**`components/navbar/`:**
- Purpose: Navbar component (placed in subdirectory as `page.tsx`)
- Note: Named `page.tsx` inside a `navbar/` folder — this is not a route; it is imported as `@/components/navbar/page`

**`components/laoyout/`:**
- Purpose: Legacy/unused directory (misspelled "layout")
- Contains: `SearchBar.tsx` — not imported anywhere in active code

**`lib/`:**
- Purpose: All non-UI shared code — data access, state, utilities
- Contains: Shopify API client, cart mutations, React Context, utility functions
- Key files: `lib/index.ts` (queries), `lib/cartMutation.ts` (mutations), `lib/cartContext.tsx` (state)

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root layout wrapping entire app
- `app/page.tsx`: Home page — main marketing + product listing page
- `app/collections/[handle]/page.tsx`: Dynamic collection listing
- `app/product/[handle]/page.tsx`: Dynamic product detail

**Configuration:**
- `next.config.ts`: Image remote patterns for `cdn.shopify.com`, AVIF/WebP formats
- `tsconfig.json`: Path alias `@/*` maps to project root
- `.env`: `SHOPIFY_STORE_DOMAIN`, `STOREFRONT_ACCESS_TOKEN`
- `components.json`: shadcn/ui registry config

**Core Logic:**
- `lib/index.ts`: `shopifyFetch`, `getProducts`, `getCollection`, `getProductByHandle`
- `lib/cartMutation.ts`: `createCart`, `getCart`, `addToCart`, `updateCart`, `removeFromCart`
- `lib/cartContext.tsx`: `CartProvider`, `useCart`

**UI Primitives:**
- `components/ui/sheet.tsx`: Slide-over panel (used for cart drawer)
- `components/ui/button.tsx`: Base button with variant support
- `lib/utils.ts`: `cn(...)` for conditional Tailwind class merging

## Naming Conventions

**Files:**
- PascalCase for React components: `ProductDetail.tsx`, `Cart.tsx`, `ProductActions.tsx`
- camelCase for non-component modules: `cartMutation.ts`, `cartContext.tsx`, `utils.ts`
- Navbar placed as `components/navbar/page.tsx` — follows a subdirectory/page pattern but is NOT a route

**Directories:**
- lowercase for route segments: `collections/`, `product/`
- lowercase for grouping: `components/ui/`, `components/navbar/`
- Dynamic route segments use Next.js bracket syntax: `[handle]`

**Types:**
- PascalCase type aliases: `Product`, `Cart`, `CartLine`, `CartContextType`
- Inline where used in single files; exported from `lib/index.ts` and `lib/cartMutation.ts` for cross-file use

## Where to Add New Code

**New Page/Route:**
- Create `app/[route-name]/page.tsx` for a static route
- Create `app/[route-name]/[param]/page.tsx` for dynamic routes
- Use `async` server component; call data functions from `lib/index.ts`

**New Data Query (Shopify):**
- Add query function to `lib/index.ts`
- Follow pattern: call `shopifyFetch<TypedResponse>(query, variables)`, check `errors`, return normalized data

**New Cart Mutation:**
- Add to `lib/cartMutation.ts` with `"use server"` directive
- Use `shopifyFetch` from `lib/index.ts`
- Expose via `CartContext` in `lib/cartContext.tsx` if UI-facing

**New Feature Component:**
- Place in `components/[ComponentName].tsx`
- Add `"use client"` at top if the component uses hooks or browser APIs
- Import and use `useCart()` for cart interactions

**New UI Primitive:**
- Add to `components/ui/` following shadcn/ui patterns
- Install via shadcn CLI or manually following existing file structure

**New Shared Utility:**
- Add to `lib/utils.ts` for pure functions
- For typed Shopify-specific helpers, add to `lib/index.ts`

## Special Directories

**`.planning/`:**
- Purpose: GSD planning and codebase analysis documents
- Generated: No (human/AI authored)
- Committed: Yes

**`.next/`:**
- Purpose: Next.js build output and cache
- Generated: Yes
- Committed: No (gitignored)

**`components/laoyout/`:**
- Purpose: Misspelled directory containing unused `SearchBar.tsx`
- Generated: No
- Committed: Yes — contains dead code, candidate for cleanup

**`app/routes/`:**
- Purpose: Empty placeholder directory
- Generated: No
- Committed: Yes — contains nothing, can be removed

---

*Structure analysis: 2026-04-02*
