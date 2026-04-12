---
phase: 02-bug-fixes
reviewed: 2026-04-12T09:15:24Z
depth: standard
files_reviewed: 15
files_reviewed_list:
  - app/page.tsx
  - app/collections/[handle]/page.tsx
  - lib/index.ts
  - components/cards/ProductCard.tsx
  - components/footer/NewsletterSignup.tsx
  - app/privacy-policy/page.tsx
  - app/terms-of-service/page.tsx
  - package.json
  - pnpm-lock.yaml
  - components/ProductDetail.tsx
  - components/ProductActions.tsx
  - components/product/DescriptionAccordion.tsx
  - components/product/SizeGuideModal.tsx
  - components/navbar/page.tsx
  - components/navbar/SearchBar.tsx
findings:
  critical: 0
  warning: 2
  info: 0
  total: 2
status: issues
---

# Phase 2: Advisory Code Review

**Reviewed:** 2026-04-12T09:15:24Z  
**Depth:** standard  
**Files Reviewed:** 15  
**Status:** issues

## Summary

The scoped files lint clean and `pnpm build` passes. The new product-card, legal-page, modal, accordion, and navbar work is generally aligned with the plan, but there are two behavior issues worth fixing before treating Phase 2 as fully stable.

## Warnings

### WR-01: Flat variant picker does not actually change the selected variant

**File:** `components/ProductActions.tsx:84-97`  
**Issue:** The new fallback path for products without structured size/color options renders a flat option list, but clicking one of those options only writes `selectedSize` with `v.title` at `components/ProductActions.tsx:245-247`. `selectedVariant` is still derived from `selectedOptions` and otherwise falls back to `variants[0]`, so the UI can highlight one option while `Add to Bag` still submits the first variant.

**Fix:** Track the chosen flat variant explicitly and prefer it when `!hasOptions`.

```tsx
const [selectedFlatVariantId, setSelectedFlatVariantId] = useState<string | null>(null);

const selectedVariant =
  !hasOptions && variants.length > 1
    ? variants.find((variant) => variant.id === selectedFlatVariantId) ?? variants[0]
    : variants.find(/* existing option matching */) ?? variants[0];
```

### WR-02: Quick Add can show success even when the cart mutation failed

**File:** `components/cards/ProductCard.tsx:55-57`  
**Issue:** `handleQuickAdd()` assumes `await addItem(...)` rejects on failure, then sets the CTA to `Added to Bag`. In the current cart context, `addItem()` catches its own errors and only logs them, so this button can show a success state even when nothing was added.

**Fix:** Make `addItem()` surface failure to callers, or return a boolean/result object and gate the success state on that outcome instead of any resolved promise.

```tsx
const added = await addItem(quickAddVariant.id);
setState(added ? "added" : "idle");
```

---

_Reviewed: 2026-04-12T09:15:24Z_  
_Reviewer: Codex (gsd-code-reviewer)_  
_Depth: standard_
