# Coding Conventions

**Analysis Date:** 2026-04-02

## Naming Patterns

**Files:**
- React components: PascalCase `.tsx` — `ProductDetail.tsx`, `ProductGallery.tsx`, `ProductDetailClient.tsx`
- Hooks/context: camelCase `.tsx` — `cartContext.tsx`
- Utility/service modules: camelCase `.ts` — `cartMutation.ts`, `index.ts`, `utils.ts`
- Next.js pages: `page.tsx` within route directories — `app/page.tsx`, `components/navbar/page.tsx`
- shadcn/ui components: lowercase kebab in `components/ui/` — `sheet.tsx`, `badge.tsx`, `button.tsx`

**Functions:**
- React components: PascalCase named exports — `export function ProductActions(...)`, `export function Cart(...)`
- Async data fetchers: camelCase, verb-prefixed — `getProducts`, `getCollection`, `getProductByHandle`
- Mutation helpers: camelCase, verb-prefixed — `createCart`, `addToCart`, `updateCart`, `removeFromCart`
- Context hooks: `use` prefix — `useCart()`
- Local helper functions: camelCase descriptive — `parsePrice`, `gbp`, `colorForValue`, `isSizeAvailable`, `isColorAvailable`

**Variables:**
- camelCase throughout — `cartId`, `selectedVariant`, `heroProducts`
- Boolean state flags: descriptive — `cartOpen`, `mobileOpen`, `scrolled`, `hydrating`, `loading`
- State setter naming: `set` + PascalCase noun — `setCart`, `setCartOpen`, `setSelectedSize`

**Types:**
- PascalCase `type` aliases — `Product`, `Cart`, `CartLine`, `CartContextType`, `State`
- Generic wrappers: descriptive suffix — `ShopifyResponse<T>`, `ProductsQuery`, `CollectionQuery`
- Prop types: inlined as object literals in function signature, not separately named
- Union string literals for state: `type State = "idle" | "loading" | "added"` in `components/addToCart.tsx`

## Code Style

**Formatting:**
- No Prettier config detected — formatting is done manually/by editor
- Consistent 2-space indentation
- Single quotes in `.tsx` client components (`'use client'`), double quotes in TypeScript modules
- Trailing commas used in multi-line arrays and objects

**Linting:**
- ESLint 9 with `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Config: `eslint.config.mjs`
- Deliberate eslint-disable comments used sparingly: `// eslint-disable-line react-hooks/exhaustive-deps` in `lib/cartContext.tsx`
- TypeScript strict mode enabled (`"strict": true` in `tsconfig.json`)

## Import Organization

**Order (observed pattern):**
1. React/Next.js framework imports (`"react"`, `"next/image"`, `"next/link"`)
2. Third-party library imports (`framer-motion`, `lucide-react`)
3. Internal absolute path imports using `@/` alias (`@/components/...`, `@/lib/...`)
4. Relative imports for sibling components (`"./ProductActions"`, `"../Cart"`)

**Path Aliases:**
- `@/*` maps to project root `./` — configured in `tsconfig.json`
- Used for all cross-directory imports: `@/lib/cartContext`, `@/components/navbar/page`, `@/lib/utils`

## Error Handling

**Patterns:**
- Server-side data fetchers throw on API errors: `throw new Error(errors[0].message)` in `lib/index.ts`
- Client-side cart operations catch and log: `console.error("[Cart] addItem error:", err)` in `lib/cartContext.tsx`
- Shopify `userErrors` checked after every mutation: `if (data.cartCreate.userErrors?.length) throw new Error(...)` in `lib/cartMutation.ts`
- Both HTTP-level errors (`errors`) and application-level errors (`userErrors`) checked separately
- Next.js `notFound()` used for missing collection pages: `app/collections/[handle]/page.tsx`
- Null/undefined guarded via optional chaining: `product?.featuredImage?.url`, `cart?.lines.edges`
- Stale cart IDs handled by `clearStoredCart()` in `lib/cartContext.tsx` — catch block falls back to creating a new cart

## Logging

**Approach:** `console.error` for caught errors only
- Tagged with context prefix: `"[Cart] addItem error:"`, `"Shopify errors:"`
- No logging framework — raw `console.error`
- No `console.log` or `console.warn` present in production paths

## Comments

**When to Comment:**
- Section dividers using ASCII art `// ─── SECTION NAME ───` inside JSX and `// ── Section ──` in TS files
- Inline comments for non-obvious logic: `// Cart expired — create a fresh one`, `// Shopify shouldn't return qty 0, but guard anyway`
- JSDoc used on public utility functions in `lib/cartMutation.ts` — `@param`, `@returns` with Shopify API links
- No comments on obvious code

**Section dividers in JSX:**
```tsx
{/* ─── HERO ─── */}
{/* ── Hydration skeleton ── */}
```

## React Patterns

**Server vs Client components:**
- `"use client"` directive on components needing browser APIs or interactivity: `Cart.tsx`, `hero.tsx`, `ProductActions.tsx`, `navbar/page.tsx`, `ProductDetailClient.tsx`
- `"use server"` on cart mutation module: `lib/cartMutation.ts`
- Page components default to Server Components unless they require client state
- Pattern: Server component fetches data, passes to `*Client` component — `ProductDetail.tsx` → `ProductDetailClient.tsx`

**Props:**
- Destructured inline in function signature: `export function Cart({ isDark = true }: { isDark?: boolean })`
- Default prop values set in destructuring: `isDark = true`, `first = 10`
- Optional props use `?:` — `onColorChange?: (color: string) => void`

**State management:**
- React Context for shared cart state: `lib/cartContext.tsx`
- `useCallback` for stable references on context-exposed functions: `addItem`, `updateItem`, `removeItem`
- Local `useState` for UI-only state: `mobileOpen`, `scrolled`, `activeIndex`
- `useRef` for tracking previous values without re-renders: `prevIdx` in `ProductGallery.tsx`

## CSS / Styling

**Approach:** Tailwind CSS v4 utility-first throughout, no CSS modules
- `cn()` utility from `lib/utils.ts` used to merge conditional classes: `cn("base-class", isDark ? "..." : "...")`
- Class arrays joined with `.join(" ")` as an alternative to `cn()` for simpler conditional lists
- Arbitrary values used extensively: `text-[11px]`, `tracking-[0.25em]`, `h-[18px]`
- Theme tokens defined in `app/globals.css` under `@theme` — matches shadcn/ui variable convention
- Custom fonts: Bebas Neue (`font-display`), Barlow (`font-sans`), Cormorant Garamond (`font-serif`)
- Border radius set to `0rem` globally — sharp, no rounding unless explicitly specified

## Module Design

**Exports:**
- Named exports only — no default exports for components (except Next.js page files which require `export default`)
- Type exports via `export type { Product }` in `lib/index.ts`
- Barrel files: not used — each file imports directly from source

**Library utilities:**
- `lib/utils.ts` — exports only `cn()` helper
- `lib/index.ts` — Shopify Storefront API queries (named `lib/shopify.ts` in its own comment header)
- `lib/cartMutation.ts` — Shopify cart mutations + type exports

---

*Convention analysis: 2026-04-02*
