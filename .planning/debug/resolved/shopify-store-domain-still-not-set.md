---
status: resolved
trigger: "Runtime Error — [Shopify] SHOPIFY_STORE_DOMAIN is not set. Add it to .env.local. — persists even though both .env and .env.local exist with correct values."
created: 2026-04-03T00:00:00Z
updated: 2026-04-03T00:01:00Z
---

## Current Focus

hypothesis: CONFIRMED - lib/index.ts top-level env check runs in client bundle context where non-NEXT_PUBLIC_ vars are undefined
test: trace import chain: cartContext.tsx (use client) -> cartMutation.ts -> lib/index.ts (top-level throw)
expecting: fix by moving shopifyFetch to a server-only context (Route Handler / Server Action) so client bundle never imports lib/index.ts
next_action: DONE - fix applied and verified

## Symptoms

expected: App starts, Shopify Storefront API connects successfully
actual: Runtime Error thrown by lib/index.ts — "[Shopify] SHOPIFY_STORE_DOMAIN is not set. Add it to .env.local."
errors: "[Shopify] SHOPIFY_STORE_DOMAIN is not set. Add it to .env.local."
reproduction: Starting dev server or loading any page that imports lib/index.ts
started: Previously fixed by creating .env.local (resolved session exists). Error has returned despite .env.local being present with correct values.

## Eliminated

- hypothesis: .env.local has encoding/BOM issues
  evidence: xxd hex dump shows clean UTF-8, no BOM, Unix line endings (0x0a). cat -e shows $ at end of each line (standard)
  timestamp: 2026-04-03T00:01:00Z

- hypothesis: .env.local is in wrong directory or has wrong permissions
  evidence: ls -la shows file at project root with correct 104 bytes, readable permissions (-rw-------)
  timestamp: 2026-04-03T00:01:00Z

- hypothesis: next.config.ts overrides or blocks env loading
  evidence: next.config.ts only configures images.remotePatterns - no env configuration at all
  timestamp: 2026-04-03T00:01:00Z

## Evidence

- timestamp: 2026-04-03T00:01:00Z
  checked: .env.local raw bytes via xxd
  found: Clean UTF-8, no BOM (no EF BB BF prefix), Unix line endings (0x0a), no trailing spaces
  implication: File encoding is not the problem

- timestamp: 2026-04-03T00:01:00Z
  checked: lib/index.ts lines 3-14
  found: process.env.SHOPIFY_STORE_DOMAIN is read and checked at MODULE LOAD TIME (top-level, not inside a function). Throws immediately if falsy.
  implication: Any import of this module in a client bundle context will throw

- timestamp: 2026-04-03T00:01:00Z
  checked: lib/cartMutation.ts line 1
  found: `import { shopifyFetch } from './index';` - cartMutation imports from lib/index.ts
  implication: lib/index.ts top-level code runs whenever cartMutation.ts is imported

- timestamp: 2026-04-03T00:01:00Z
  checked: lib/cartContext.tsx line 1
  found: `"use client"` directive. Imports createCart, addToCart, updateCart, removeFromCart, getCart from "@/lib/cartMutation"
  implication: cartContext.tsx is a client component that imports cartMutation.ts, which imports lib/index.ts. The ENTIRE chain runs in the client bundle.

- timestamp: 2026-04-03T00:01:00Z
  checked: Next.js static-env.js (installed next@16.0.10)
  found: getNextPublicEnvironmentVariables() only exposes NEXT_PUBLIC_* vars to client bundle. SHOPIFY_STORE_DOMAIN has no NEXT_PUBLIC_ prefix.
  implication: In the client bundle, process.env.SHOPIFY_STORE_DOMAIN is undefined, triggering the throw in lib/index.ts

- timestamp: 2026-04-03T00:01:00Z
  checked: Import graph for lib/index.ts
  found: Three importers: app/page.tsx (server), app/collections/[handle]/page.tsx (server), components/ProductDetail.tsx (server). All server-side imports are fine. But cartContext.tsx (client) -> cartMutation.ts -> lib/index.ts is the broken path.
  implication: The client bundle includes lib/index.ts, which throws because SHOPIFY_STORE_DOMAIN is undefined client-side

## Resolution

root_cause: lib/cartContext.tsx is a "use client" component that imports lib/cartMutation.ts, which imports lib/index.ts. lib/index.ts has a top-level (module-scope) env check that throws if SHOPIFY_STORE_DOMAIN is falsy. In the client bundle, Next.js only exposes NEXT_PUBLIC_* environment variables — server-only vars like SHOPIFY_STORE_DOMAIN are undefined. This causes the throw every time the client bundle loads, regardless of what's in .env.local.
fix: Created app/api/cart/route.ts (server Route Handler) that handles all cart mutations. Rewrote lib/cartContext.tsx to call fetch('/api/cart') instead of importing lib/cartMutation.ts directly. The only remaining import from cartMutation in cartContext is `import type` which TypeScript erases at compile time - zero runtime code. lib/index.ts and its top-level env check now never reach the client bundle.
verification: Verified via import graph analysis - remaining importers of lib/index.ts are all server-side (app/page.tsx, app/collections/[handle]/page.tsx, components/ProductDetail.tsx, app/api/cart/route.ts). No client component imports lib/index.ts or lib/cartMutation.ts at the value level.
files_changed:
  - app/api/cart/route.ts (created - server Route Handler for all cart operations)
  - lib/cartContext.tsx (rewritten - uses fetch('/api/cart') instead of direct cartMutation imports)
