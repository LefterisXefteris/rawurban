# Phase 01: Security & Code Cleanup - Research

**Researched:** 2026-04-02
**Domain:** Next.js 14 App Router — dependency hygiene, env validation, directive misuse, React hooks correctness
**Confidence:** HIGH (all findings verified against official docs or direct codebase inspection)

---

## Summary

This phase is a focused cleanup with no new features. Every requirement maps directly to a specific file or line
in the existing codebase. No third-party library is needed beyond what is already installed.

The two biggest risks are the `"use server"` directive on `lib/cartMutation.ts` and the missing env-var guard
in `lib/index.ts`. The directive risk is already partially mitigated because `cartContext.tsx` (a client
component) imports from `cartMutation.ts` successfully in the current build — but only because Next.js still
resolves the import at the module level. The directive is semantically wrong: it marks every exported function
as a Server Action (publicly callable HTTP endpoint), which is not the intent for shared cart utilities. Removing
it is the correct fix.

The env validation is a pure addition to `lib/index.ts`: throw a descriptive `Error` at module evaluation time
when either variable is absent. No new library is required because the variables are server-only and the plain
`process.env` check is sufficient for this scope.

**Primary recommendation:** Execute all eight changes as mechanical edits to existing files. No new
dependencies required. Verify with `npm run build` after each logical group.

---

## Standard Stack

No new libraries are needed. All work uses the existing project setup.

### Existing tools relevant to this phase
| Tool | Current Version | Role in this phase |
|------|----------------|-------------------|
| pnpm | already in lock | Sole package manager after `package-lock.json` removal |
| TypeScript | ^5 | Build verification after changes |
| ESLint (eslint-config-next) | 16.0.10 | Replaces suppressed rules with correct code |
| Next.js | 16.0.10 | Governs `"use server"` semantics and env var access |

### Packages to remove from `package.json`
| Package | Current Version | Evidence of non-use |
|---------|----------------|---------------------|
| `@apollo/server` | ^5.2.0 | Zero imports in `app/`, `components/`, `lib/` |
| `@shopify/shopify-api` | ^12.2.0 | Zero imports in `app/`, `components/`, `lib/` |

**Removal command:**
```bash
pnpm remove @apollo/server @shopify/shopify-api
```

### Lockfile migration
`package-lock.json` already exists alongside `pnpm-lock.yaml` because both package managers have been run on
the repo. Only `pnpm-lock.yaml` should be committed.

```bash
rm package-lock.json
```

No `pnpm import` is needed — `pnpm-lock.yaml` already exists and is current.

---

## Architecture Patterns

### ENV validation — module-level guard in lib/index.ts

**What:** Throw at module evaluation time (top of file, outside any function) so the error surfaces on the first
import regardless of which Next.js lifecycle triggered it (dev, build, start).

**When to use:** Any server-only module that reads `process.env` directly.

**Pattern:**
```typescript
// lib/index.ts — add at top, before any fetch calls
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.STOREFRONT_ACCESS_TOKEN;

if (!domain) {
  throw new Error(
    "[Shopify] SHOPIFY_STORE_DOMAIN environment variable is missing. " +
    "Add it to your .env.local file."
  );
}
if (!token) {
  throw new Error(
    "[Shopify] STOREFRONT_ACCESS_TOKEN environment variable is missing. " +
    "Add it to your .env.local file."
  );
}
```

After the guard, the variables can be safely narrowed:
```typescript
const domain = process.env.SHOPIFY_STORE_DOMAIN as string;
const token = process.env.STOREFRONT_ACCESS_TOKEN as string;
```

This avoids using `token!` (non-null assertion) which silently passes undefined to the `fetch` call.

### API version constant — lib/index.ts

**What:** Extract the hardcoded `"2024-01"` string that appears in the Shopify API URL into a named constant.

**Current code (lib/index.ts line ~78):**
```typescript
const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
```

**Fixed pattern:**
```typescript
const SHOPIFY_API_VERSION = "2024-01";

// ... inside shopifyFetch:
const response = await fetch(`https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
```

Place the constant immediately after the env guard block, before the type definitions.

### Removing "use server" from lib/cartMutation.ts

**What the directive does:** `"use server"` at the top of a file marks every exported async function as a Server
Action — a publicly accessible HTTP endpoint that Next.js registers with a cryptographic ID. This is the correct
pattern for form actions, but wrong for shared data-fetching utilities called directly from a client context
module.

**Why it compiles today but is wrong:** `cartContext.tsx` (`"use client"`) imports from `cartMutation.ts`.
Next.js allows importing Server Actions into client components, so the import resolves. But the effect is that
`createCart`, `addToCart`, etc. become network-routed Server Actions rather than plain async functions — which
is not what the code intends.

**Fix:** Delete the first line (`"use server";`) from `lib/cartMutation.ts`. The file becomes a plain TypeScript
module that exports async functions. No other changes required — `shopifyFetch` from `lib/index.ts` runs
server-side via the App Router's RSC model when called from server components, and on the client it calls the
Shopify Storefront API directly over HTTP (which is intentional and already works, since the Storefront API
token is designed for public client-side use).

Source: https://nextjs.org/docs/app/api-reference/directives/use-server (verified 2026-04-02)

### Price formatter — lib/utils.ts

**Current duplication:**
- `app/page.tsx` line 6: `const fmt = (amount: string) => \`£${parseFloat(amount).toFixed(2)}\``
- `app/collections/[handle]/page.tsx` line 5: identical `const fmt = ...`

**Fix:** Add `formatPrice` to `lib/utils.ts`:
```typescript
// lib/utils.ts — append after existing cn() function
export function formatPrice(amount: string): string {
  return `£${parseFloat(amount).toFixed(2)}`;
}
```

Then in both page files, remove the local `fmt` arrow function and replace the import:
```typescript
import { formatPrice } from "@/lib/utils";
// Usage: formatPrice(product.priceRange.minVariantPrice.amount)
```

### Deleting lib/query.ts

The file is 0 bytes and has zero imports anywhere in the codebase. Delete it:
```bash
rm lib/query.ts
```

Verify no imports remain:
```bash
grep -r "from.*query" app/ components/ lib/
```

### Fixing useCallback ESLint suppressions in lib/cartContext.tsx

**The problem:** Two `useCallback` hooks suppress `react-hooks/exhaustive-deps` because they call
`removeItemImpl`, which is a plain `async function` (not stable across renders). ESLint correctly flags it as a
missing dependency.

**Root cause:** `removeItemImpl` is declared as a regular function inside the component body. Every render
creates a new function reference, making it an unstable dependency. Adding it to the dependency array would
cause every render to replace the callbacks — defeating the purpose of `useCallback`.

**Correct fix — wrap `removeItemImpl` in `useCallback`:**
```typescript
const removeItemImpl = useCallback(async (cartId: string, lineId: string) => {
  setLoading(true);
  try {
    const updated = await removeFromCart(cartId, [lineId]);
    setCart(updated);
  } catch (err) {
    console.error("[Cart] removeItem error:", err);
  } finally {
    setLoading(false);
  }
}, []); // setLoading, setCart, removeFromCart are all stable references
```

Once `removeItemImpl` is a `useCallback`, both `updateItem` and `removeItem` can list it as a dependency:
```typescript
const updateItem = useCallback(async (lineId: string, quantity: number) => {
  const cartId = localStorage.getItem("cartId");
  if (!cartId) return;
  if (quantity <= 0) {
    return removeItemImpl(cartId, lineId);
  }
  setLoading(true);
  try {
    const updated = await updateCart(cartId, [{ id: lineId, quantity }]);
    setCart(updated);
  } catch (err) {
    console.error("[Cart] updateItem error:", err);
  } finally {
    setLoading(false);
  }
}, [removeItemImpl]); // no eslint-disable needed

const removeItem = useCallback(async (lineId: string) => {
  const cartId = localStorage.getItem("cartId");
  if (!cartId) return;
  await removeItemImpl(cartId, lineId);
}, [removeItemImpl]); // no eslint-disable needed
```

Remove both `// eslint-disable-line react-hooks/exhaustive-deps` comments.

Source: https://react.dev/reference/eslint-plugin-react-hooks/lints/exhaustive-deps (verified 2026-04-02)

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Env var validation | Custom schema parser, Zod, t3-env | Plain `if (!process.env.X) throw new Error(...)` | This scope has exactly two vars; a schema library adds overhead with no benefit |
| Price formatting | New i18n library | Add to existing `lib/utils.ts` | `Intl.NumberFormat` is an option for multi-currency; current GBP-only format is fine for this phase |
| Lockfile migration | Manual rewrite | `rm package-lock.json` | pnpm-lock.yaml already exists and is correct |

**Key insight:** Every fix in this phase is a subtraction or a small addition of a few lines. No new abstractions
are needed.

---

## Common Pitfalls

### Pitfall 1: Removing "use server" breaks the app if cartMutation calls server-only APIs
**What goes wrong:** If `cartMutation.ts` ever used `next/headers`, `cookies()`, or other server-only imports,
removing `"use server"` would move those calls to the client bundle and throw.
**Why it happens:** `"use server"` also signals to the bundler to keep the module server-side.
**How to avoid:** Audit `cartMutation.ts` imports before removing the directive. The current file only imports
`shopifyFetch` from `lib/index.ts`, which uses the standard `fetch` API — fully client-safe.
**Warning signs:** TypeScript errors about `server-only` imports after the change.

### Pitfall 2: pnpm remove regenerates lockfile inconsistently if node_modules is npm-installed
**What goes wrong:** If `node_modules` was installed by npm (using `package-lock.json`), running `pnpm remove`
may install into a pnpm-managed tree that conflicts with existing npm artifacts.
**How to avoid:** Run `rm -rf node_modules && pnpm install` before `pnpm remove @apollo/server @shopify/shopify-api`
if the current `node_modules` was installed by npm.
**Warning signs:** pnpm outputs warnings about incompatible lockfile or module resolution errors during removal.

### Pitfall 3: TypeScript strict mode flags the non-null assertion on `token!`
**What goes wrong:** After adding the env guard and switching `token!` to `token as string`, a subsequent
TypeScript change that removes the guard would silently reintroduce the unsafe assertion.
**How to avoid:** Use `as string` only after the guard block, and add a comment referencing the guard.

### Pitfall 4: formatPrice signature mismatch
**What goes wrong:** Both page files call `fmt(product.priceRange.minVariantPrice.amount)` where `amount` is
`string`. The new `formatPrice` function must accept `string`, not `number`.
**How to avoid:** Signature `formatPrice(amount: string): string` matches the Shopify API response type.

### Pitfall 5: useCallback dependency change causes extra renders
**What goes wrong:** Making `removeItemImpl` a `useCallback` and adding it to the `updateItem`/`removeItem`
dependency arrays could cause unnecessary re-renders if `removeItemImpl`'s own deps change.
**Why it won't happen here:** `removeItemImpl`'s deps are `setLoading` and `setCart` (React state setters,
guaranteed stable by React) and `removeFromCart` (a module-level import, stable). The dependency array `[]` is
correct.

---

## Code Examples

### Env guard with API version constant (lib/index.ts)
```typescript
// Source: official Next.js env docs + direct codebase analysis
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.STOREFRONT_ACCESS_TOKEN;

if (!domain) {
  throw new Error(
    "[Shopify] SHOPIFY_STORE_DOMAIN is not set. Add it to .env.local."
  );
}
if (!token) {
  throw new Error(
    "[Shopify] STOREFRONT_ACCESS_TOKEN is not set. Add it to .env.local."
  );
}

const SHOPIFY_API_VERSION = "2024-01";

// ... later in shopifyFetch:
const response = await fetch(`https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": token,
  },
  body: JSON.stringify({ query, variables }),
});
```

### formatPrice utility (lib/utils.ts)
```typescript
// Source: direct codebase analysis of both page files
export function formatPrice(amount: string): string {
  return `£${parseFloat(amount).toFixed(2)}`;
}
```

### useCallback with stable removeItemImpl (lib/cartContext.tsx)
```typescript
// Source: react.dev/reference/eslint-plugin-react-hooks/lints/exhaustive-deps
const removeItemImpl = useCallback(async (cartId: string, lineId: string) => {
  setLoading(true);
  try {
    const updated = await removeFromCart(cartId, [lineId]);
    setCart(updated);
  } catch (err) {
    console.error("[Cart] removeItem error:", err);
  } finally {
    setLoading(false);
  }
}, []);

const updateItem = useCallback(async (lineId: string, quantity: number) => {
  const cartId = localStorage.getItem("cartId");
  if (!cartId) return;
  if (quantity <= 0) return removeItemImpl(cartId, lineId);
  setLoading(true);
  try {
    const updated = await updateCart(cartId, [{ id: lineId, quantity }]);
    setCart(updated);
  } catch (err) {
    console.error("[Cart] updateItem error:", err);
  } finally {
    setLoading(false);
  }
}, [removeItemImpl]);

const removeItem = useCallback(async (lineId: string) => {
  const cartId = localStorage.getItem("cartId");
  if (!cartId) return;
  await removeItemImpl(cartId, lineId);
}, [removeItemImpl]);
```

---

## State of the Art

| Old Approach | Current Approach | Impact for This Phase |
|---|---|---|
| `"use server"` on shared utility files | `"use server"` only on Server Action files (form mutations) | Remove directive from `cartMutation.ts` |
| Both npm and pnpm lockfiles coexisting | Single lockfile per project | Delete `package-lock.json` |
| Inline formatter functions per file | Shared `lib/utils.ts` | Extract `formatPrice` |
| `eslint-disable` on hooks rules | Proper `useCallback` dependency chains | Wrap `removeItemImpl` in `useCallback` |

---

## Open Questions

1. **Shopify API version**
   - What we know: The hardcoded version is `"2024-01"`. The current codebase works with it.
   - What's unclear: Whether the project should be upgraded to a newer Storefront API version (e.g., `"2025-01"`).
   - Recommendation: Keep `"2024-01"` for this phase. The extraction to a constant is the goal; the version bump
     is a separate concern outside this phase's scope.

2. **`lib/index.ts` file naming**
   - What we know: The file is named `index.ts` but the comment at line 1 says `// lib/shopify.ts`. This is
     a cosmetic inconsistency.
   - What's unclear: Whether the file should be renamed to `shopify.ts` to match the comment.
   - Recommendation: Out of scope for this phase (renaming requires updating all imports). Flag for a future
     refactor phase.

3. **Currency hardcoding in formatPrice**
   - What we know: The current `fmt` uses a hardcoded `£` symbol. Shopify returns `currencyCode` in the price
     object.
   - What's unclear: Whether the store will ever operate in multiple currencies.
   - Recommendation: Keep `£` hardcode for now. `formatPrice` signature accepts only `amount: string` matching
     current call sites. Multi-currency support is out of scope.

---

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection (`lib/cartMutation.ts`, `lib/cartContext.tsx`, `lib/index.ts`, `lib/query.ts`,
  `lib/utils.ts`, `app/page.tsx`, `app/collections/[handle]/page.tsx`, `package.json`) — all findings
  derived from reading the actual files
- https://nextjs.org/docs/app/api-reference/directives/use-server — `"use server"` semantics, verified
  2026-04-02 (docs version 16.2.2)
- https://react.dev/reference/eslint-plugin-react-hooks/lints/exhaustive-deps — `useCallback` dependency
  fix pattern

### Secondary (MEDIUM confidence)
- https://shramko.dev/blog/pnpm — pnpm migration steps; consistent with pnpm official docs
- https://jenssegers.com/simple-next-js-environment-variable-validation — lightweight env validation pattern

### Tertiary (LOW confidence — not used for any prescriptive guidance)
- https://blog.stackademic.com/next-js-14-environment-variables-validation-using-zod-6e1dd95c3406 — Zod
  pattern; not recommended for this scope (overkill for two vars)

---

## Metadata

**Confidence breakdown:**
- Standard stack (what to remove): HIGH — verified by grep across all source files; zero imports found
- Architecture (env guard, API version, price formatter): HIGH — exact file locations and line patterns identified
- "use server" fix: HIGH — official Next.js docs confirm semantics; import audit shows no server-only deps
- useCallback fix: HIGH — React official docs confirm pattern; actual code reviewed line by line
- Lockfile migration: HIGH — `pnpm-lock.yaml` already exists; `package-lock.json` is the only artifact to remove

**Research date:** 2026-04-02
**Valid until:** 2026-05-02 (stable APIs; no fast-moving dependencies)
