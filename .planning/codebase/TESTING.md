# Testing Patterns

**Analysis Date:** 2026-04-02

## Test Framework

**Runner:** None detected

No test framework is installed in this project. `package.json` contains no test runner (`jest`, `vitest`, `playwright`, `cypress`, etc.) in either `dependencies` or `devDependencies`. No test configuration files (`jest.config.*`, `vitest.config.*`) are present.

**Assertion Library:** Not applicable

**Run Commands:**
```bash
# No test commands configured in package.json scripts
# Available scripts are:
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Test File Organization

**Location:** No test files exist in the codebase

**Naming:** No convention established — no `*.test.*` or `*.spec.*` files found

**Structure:** Not applicable

## Test Structure

No tests are written. No patterns to document.

## Mocking

**Framework:** None

No mocking utilities are installed or used.

## Fixtures and Factories

**Test Data:** None

No fixture files or factory helpers exist.

## Coverage

**Requirements:** None enforced — no coverage tool configured

**View Coverage:**
```bash
# Not available — no test runner installed
```

## Test Types

**Unit Tests:** Not present

**Integration Tests:** Not present

**E2E Tests:** Not present

## What Should Be Tested (Gap Analysis)

The following areas have zero test coverage and carry production risk:

**`lib/index.ts` — Shopify data fetchers:**
- `getProducts`, `getCollection`, `getProductByHandle` make live HTTP calls with no unit test doubles
- Error path (Shopify `errors` array) is untested
- Null return from `getCollection` / `getProductByHandle` is untested

**`lib/cartMutation.ts` — Cart mutations:**
- All five exported functions (`createCart`, `addToCart`, `updateCart`, `removeFromCart`, `getCart`) are untested
- `userErrors` and HTTP `errors` both throw but are not verified

**`lib/cartContext.tsx` — Cart context logic:**
- `isValidCart()` helper has no tests — guards against corrupted cart data
- `clearStoredCart()` / localStorage interaction untested
- `addItem` fallback path (expired cart → create new) is complex and untested

**`components/ProductActions.tsx` — Variant selection logic:**
- `colorForValue()`, `isSizeAvailable()`, `isColorAvailable()` are pure functions and ideal for unit tests
- Variant matching logic (`selectedVariant` derivation) untested

## Recommended Setup (if adding tests)

For this Next.js + TypeScript stack, the standard approach is:

```bash
# Install Vitest (preferred for Vite-adjacent Next.js setups) or Jest
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom

# Or Jest:
pnpm add -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom ts-jest
```

**Suggested test file locations:**
- Co-locate unit tests: `lib/index.test.ts`, `lib/cartContext.test.tsx`
- Component tests: `components/ProductActions.test.tsx`
- Integration tests: `__tests__/` at project root

**Shopify API mocking pattern to use:**
```typescript
// Mock shopifyFetch for unit tests
vi.mock('@/lib/index', () => ({
  shopifyFetch: vi.fn().mockResolvedValue({ data: mockData, errors: undefined }),
}))
```

---

*Testing analysis: 2026-04-02*
