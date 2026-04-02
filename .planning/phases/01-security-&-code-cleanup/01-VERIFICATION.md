---
phase: 01-security-&-code-cleanup
verified: 2026-04-02T16:00:00Z
status: passed
score: 7/7 must-haves verified
gaps: []
---

# Phase 1: Security & Code Cleanup — Verification Report

**Phase Goal:** Remove dead weight, fix structural issues, and harden the codebase before touching UI.
**Verified:** 2026-04-02
**Status:** PASSED
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| #  | Truth                                                                 | Status     | Evidence                                                                                       |
|----|-----------------------------------------------------------------------|------------|------------------------------------------------------------------------------------------------|
| 1  | `tsc --noEmit` exits with code 0 (no TypeScript errors)              | VERIFIED   | `/opt/homebrew/bin/node ./node_modules/typescript/bin/tsc --noEmit` → exit code 0, no output  |
| 2  | App throws a descriptive error on startup if env vars are missing     | VERIFIED   | `lib/index.ts` lines 6–15: top-level throw with message naming var and `.env.local`            |
| 3  | API version is a single named constant; no inline version strings     | VERIFIED   | `SHOPIFY_API_VERSION = "2024-01"` at line 17; only one `graphql.json` URL in entire lib/      |
| 4  | `lib/cartMutation.ts` has no "use server" directive                   | VERIFIED   | grep returned no match; file opens with `import { shopifyFetch } from './index'`               |
| 5  | `lib/utils.ts` exports `formatPrice`; both page files import from it  | VERIFIED   | `utils.ts` line 8 exports it; `app/page.tsx:4` and `app/collections/[handle]/page.tsx:3` import it |
| 6  | `lib/query.ts` is deleted                                             | VERIFIED   | `ls lib/query.ts` → file not found                                                             |
| 7  | Only `pnpm-lock.yaml` exists; `package-lock.json` is gone            | VERIFIED   | `pnpm-lock.yaml` present; `package-lock.json` absent                                           |

**Score:** 7/7 truths verified

---

## Required Artifacts

| Artifact                                    | Expected                                      | Status     | Details                                                          |
|---------------------------------------------|-----------------------------------------------|------------|------------------------------------------------------------------|
| `lib/index.ts`                              | Env guards + named API version constant       | VERIFIED   | Guards at lines 6–15; `SHOPIFY_API_VERSION` at line 17          |
| `lib/cartMutation.ts`                       | No "use server"; imports `shopifyFetch`       | VERIFIED   | First line is `import { shopifyFetch } from './index'`          |
| `lib/utils.ts`                              | Exports `formatPrice`                         | VERIFIED   | 11 lines; exports `cn` and `formatPrice`                        |
| `lib/query.ts`                              | Must not exist                                | VERIFIED   | Deleted; no filesystem entry                                    |
| `pnpm-lock.yaml`                            | Must exist                                    | VERIFIED   | Present at repo root                                            |
| `package-lock.json`                         | Must not exist                                | VERIFIED   | Absent from repo root                                           |
| `app/page.tsx`                              | Imports `formatPrice` from `@/lib/utils`      | VERIFIED   | Line 4: `import { formatPrice } from "@/lib/utils"`             |
| `app/collections/[handle]/page.tsx`         | Imports `formatPrice` from `@/lib/utils`      | VERIFIED   | Line 3: `import { formatPrice } from "@/lib/utils"`             |

---

## Key Link Verification

| From                          | To                                    | Via                          | Status   | Details                                                                          |
|-------------------------------|---------------------------------------|------------------------------|----------|----------------------------------------------------------------------------------|
| `lib/index.ts`                | process.env vars                      | top-level throw              | WIRED    | Guards fire at module-eval time before any function runs                        |
| `lib/index.ts`                | Shopify API URL                       | `SHOPIFY_API_VERSION` const  | WIRED    | Template literal `${SHOPIFY_API_VERSION}` in the single fetch call              |
| `lib/cartMutation.ts`         | `lib/index.ts`                        | `import { shopifyFetch }`    | WIRED    | Direct import; no "use server" boundary                                          |
| `lib/cartContext.tsx`         | `lib/cartMutation.ts`                 | named imports                | WIRED    | Imports `createCart`, `addToCart`, `updateCart`, `removeFromCart`, `getCart`    |
| `app/page.tsx`                | `lib/utils.ts`                        | `import { formatPrice }`     | WIRED    | Calls `formatPrice(product.priceRange.minVariantPrice.amount)` at line 157      |
| `app/collections/.../page.tsx`| `lib/utils.ts`                        | `import { formatPrice }`     | WIRED    | Calls `formatPrice(product.priceRange.minVariantPrice.amount)` at line 94       |

---

## Build Verification

The Next.js `next build` CLI could not be invoked directly because the Homebrew Node.js v25 is incompatible with the `next@16.0.10` CLI shebang. TypeScript compilation was verified as a proxy:

```
/opt/homebrew/bin/node ./node_modules/typescript/bin/tsc --noEmit
EXIT_CODE: 0
```

Zero errors. All source files, including `lib/index.ts`, `lib/cartMutation.ts`, `lib/utils.ts`, `lib/cartContext.tsx`, `app/page.tsx`, `app/collections/[handle]/page.tsx`, and `components/ProductDetailClient.tsx` pass strict TypeScript compilation.

The inability to run `next build` end-to-end is an environment constraint (Node version mismatch with Next's CLI wrapper), not a code defect.

---

## Anti-Patterns Found

No blockers. Notable observations only:

| File                  | Pattern                                         | Severity | Impact                                                                                    |
|-----------------------|-------------------------------------------------|----------|-------------------------------------------------------------------------------------------|
| `lib/index.ts`        | `token as string` type assertion at line 92     | Info     | Safe — `token` is provably non-null by the guard 8 lines above; not a suppression        |
| `lib/cartContext.tsx` | `console.error` in three catch blocks           | Info     | Appropriate for a cart context; errors are surfaced rather than swallowed                 |
| `package.json`        | `@shopify/storefront-api-client` still listed   | Warning  | Package remains in dependencies but is not imported anywhere in the codebase. Not removed by this phase. Does not block build. |
| `package.json`        | `graphql` still listed                          | Warning  | Same — listed but not imported. Not removed by this phase. Does not block build.         |

The two unused packages (`@shopify/storefront-api-client`, `graphql`) are pre-existing dead weight not targeted by this phase. TypeScript does not flag unused packages. They do not affect runtime correctness but are candidates for removal in a future cleanup pass.

---

## Human Verification Required

None. All must-haves are structurally verifiable without running the application.

---

## Summary

All 7 must-haves pass verification against the actual codebase. The phase goal — harden the codebase before touching UI — is achieved:

- **Env hardening:** Module-level guards in `lib/index.ts` throw descriptive `Error` instances at import time if either required env var is absent.
- **API version hygiene:** Single named constant `SHOPIFY_API_VERSION`; one URL construction site.
- **Client-safe cart mutations:** `lib/cartMutation.ts` has no `"use server"` directive and is safely importable from client components.
- **Shared price formatter:** `formatPrice` lives only in `lib/utils.ts`; both page files import it; no duplicate implementations exist.
- **Dead file removed:** `lib/query.ts` deleted.
- **Lock file hygiene:** Only `pnpm-lock.yaml` present.
- **TypeScript clean:** `tsc --noEmit` exits 0.

---

_Verified: 2026-04-02T16:00:00Z_
_Verifier: Claude (gsd-verifier)_
