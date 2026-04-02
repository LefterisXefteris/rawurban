# Technology Stack

**Analysis Date:** 2026-04-02

## Languages

**Primary:**
- TypeScript 5.x - All application code in `app/`, `components/`, `lib/`

**Secondary:**
- CSS - Global styles in `app/globals.css`

## Runtime

**Environment:**
- Node.js (LTS, darwin arm64 detected via `@next/swc-darwin-arm64`)

**Package Manager:**
- npm (primary) — `package-lock.json` present
- pnpm (secondary) — `pnpm-lock.yaml` also present
- Lockfile: Both present; npm used for installs

## Frameworks

**Core:**
- Next.js 16.0.10 - Full-stack React framework; App Router with RSC (React Server Components) and Server Actions

**UI:**
- React 19.2.1 - UI rendering
- React DOM 19.2.1 - DOM rendering

**Animation:**
- Framer Motion 12.29.2 - Component animations, used in `components/hero.tsx` and other UI components

**Build/Dev:**
- `@next/swc-darwin-arm64` 16.1.7 - SWC compiler for macOS ARM64
- TypeScript - Compiled via Next.js pipeline (no separate `tsc` build step)
- PostCSS `^8.5.6` with `@tailwindcss/postcss ^4.1.18` - CSS processing

## Key Dependencies

**Critical:**
- `@shopify/storefront-api-client ^1.0.9` - Shopify Storefront API client (installed but raw fetch used directly in `lib/index.ts`)
- `@shopify/shopify-api ^12.2.0` - Shopify Admin API SDK (installed, not actively called in current source)
- `@apollo/server ^5.2.0` - Apollo GraphQL server (installed, not actively used in current source)
- `graphql ^16.12.0` - GraphQL runtime

**UI & Styling:**
- Tailwind CSS `^4.1.18` - Utility-first CSS framework (v4 config via CSS file, not `tailwind.config.js`)
- shadcn/ui - Component system configured via `components.json`; style: "default", base color: "slate"
- `@radix-ui/react-separator ^1.1.8` - Radix UI separator primitive
- `@radix-ui/react-slot ^1.2.4` - Radix UI slot primitive
- `class-variance-authority ^0.7.1` - CVA for component variants
- `clsx ^2.1.1` - Conditional class names
- `tailwind-merge ^3.4.0` - Tailwind class merging (used in `lib/utils.ts`)
- `lucide-react ^0.563.0` - Icon library

## Configuration

**Environment:**
- Configured via `.env` file at project root
- Required variables:
  - `SHOPIFY_STORE_DOMAIN` — Shopify store hostname (e.g. `rawurban-3.myshopify.com`)
  - `STOREFRONT_ACCESS_TOKEN` — Public Shopify Storefront API token

**TypeScript:**
- Config: `tsconfig.json`
- Target: ES2017
- Strict mode enabled
- Path alias: `@/*` maps to project root `./`
- Module resolution: `bundler`

**Build:**
- `next.config.ts` — Enables remote image patterns for `cdn.shopify.com`, avif/webp formats, 24h minimum cache TTL
- `postcss.config.mjs` — PostCSS with `@tailwindcss/postcss` plugin

**Linting:**
- ESLint 9 with `eslint-config-next` (core-web-vitals + typescript rules)
- Config: `eslint.config.mjs`

**UI Component System:**
- shadcn/ui config: `components.json`
- RSC enabled, TSX enabled
- Component alias: `@/components`
- Utils alias: `@/lib/utils`
- Fonts loaded from Google Fonts CDN: Bebas Neue, Barlow, Cormorant Garamond

## Platform Requirements

**Development:**
- macOS ARM64 (M-series chip) — inferred from `@next/swc-darwin-arm64` dev dependency
- Node.js LTS
- npm or pnpm

**Production:**
- Deployment target: Not explicitly specified (no Vercel/Docker config detected)
- Next.js standard build output (`next build` / `next start`)

---

*Stack analysis: 2026-04-02*
