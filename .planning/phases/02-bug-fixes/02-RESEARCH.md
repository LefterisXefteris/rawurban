# Phase 2: Bug Fixes - Research

**Researched:** 2026-04-12
**Domain:** Next.js 16 App Router storefront interaction fixes on a Shopify-backed UI [VERIFIED: codebase grep] [VERIFIED: package.json]
**Confidence:** MEDIUM

<user_constraints>
## User Constraints (from CONTEXT.md)

Copied verbatim from `.planning/phases/02-bug-fixes/02-CONTEXT.md`. [VERIFIED: .planning/phases/02-bug-fixes/02-CONTEXT.md]

### Locked Decisions
- **D-01:** Quick Add remains a separate CTA on product cards. Clicking Quick Add adds to cart; clicking the rest of the card still navigates to product detail.
- **D-02:** On successful Quick Add, show inline success feedback ("Added to Bag") and automatically open the cart drawer.
- **D-03:** Quick Add should be available on both desktop and mobile (desktop hover reveal can remain; mobile must have a tappable Quick Add affordance).
- **D-04:** If the first/default variant is out of stock, automatically add the first available in-stock variant.
- **D-05:** Description section starts expanded by default and can be collapsed.
- **D-06:** Description interaction tone must stay minimal, with subtle animation only (small icon motion, smooth short transition).
- **D-07:** Size Guide opens as a centered modal overlay (not a drawer).
- **D-08:** Size Guide modal content for this phase is a simple static measurements table.
- **D-09:** Newsletter form submit success is shown inline in place of the form area.
- **D-10:** Newsletter success state shows briefly (about 3-5 seconds), then restores the form.
- **D-11:** Navbar search icon opens a lightweight search overlay/dropdown.
- **D-12:** Until full search ships, search overlay shows guided suggestions and a clear note that full results are a future phase.
- **D-13:** Preserve current UI style strictly for this phase: typography families, core palette, and major layout structure remain unchanged.
- **D-14:** Motion policy is subtle and functional only (target 150-250ms, ease-out style transitions, no decorative animation).
- **D-15:** New microcopy tone is short, premium, and low-noise.

### Claude's Discretion
- Exact easing curves and timing values within the approved subtle range.
- Exact wording variants for success/helper copy, as long as tone remains premium and concise.
- Precise responsive presentation details for mobile Quick Add and search overlay, while preserving existing visual language.

### Deferred Ideas (OUT OF SCOPE)
- Broader visual redesign/retheme is deferred to a future phase. This phase focuses on behavior and interaction polish only.
</user_constraints>

<phase_requirements>
## Phase Requirements

Requirement descriptions are copied from `.planning/REQUIREMENTS.md`. [VERIFIED: .planning/REQUIREMENTS.md]

| ID | Description | Research Support |
|----|-------------|------------------|
| BUG-01 | Quick Add button on product cards adds the first/default variant to cart | Add a small client `ProductCard` island, extend list queries to include variant IDs and availability, and reuse `useCart` so cart open behavior stays centralized. [VERIFIED: codebase grep] |
| BUG-02 | Description accordion on product page toggles open/closed (expanded by default) | Keep the product page server-rendered and move only the description block into a client accordion/toggle with initial open state. [VERIFIED: codebase grep] |
| BUG-03 | Size Guide button opens a modal with a generic size chart | Use an accessible dialog primitive for the centered modal and keep content static for this phase. [CITED: https://www.radix-ui.com/primitives/docs/components/dialog] [VERIFIED: .planning/phases/02-bug-fixes/02-CONTEXT.md] |
| BUG-04 | Newsletter form shows a success message on submit (no page reload) | Use client `onSubmit`, call `preventDefault()`, show inline success for 3-5 seconds, then restore the form. [CITED: https://react.dev/reference/react-dom/components/common] [VERIFIED: .planning/phases/02-bug-fixes/02-CONTEXT.md] |
| BUG-05 | Privacy Policy and Terms of Service render as clickable links | Replace footer spans with `Link` components and choose/create valid routes in the same phase to avoid shipping click-through 404s. [VERIFIED: codebase grep] |
| BUG-06 | Navbar search button opens the SearchBar component | Keep search overlay state local to `Navbar`, restyle the existing `SearchBar` implementation to match the current UI, and auto-focus the input on open. [VERIFIED: codebase grep] |
</phase_requirements>

## Summary

This phase should be planned as a set of small client-side interaction islands inside an otherwise server-rendered Next.js App Router storefront. `app/page.tsx`, `app/collections/[handle]/page.tsx`, and `components/ProductDetail.tsx` are server components today, while interaction state already lives in isolated client components like `Navbar`, `ProductActions`, `AddToCartButton`, and `CartProvider`. [VERIFIED: codebase grep] [VERIFIED: package.json]

The biggest implementation constraint is data shape, not animation. Home and collection product-card queries currently do not fetch any variant IDs or inventory data, so BUG-01 cannot be solved only with click handlers; the list queries must return enough variant data to select the default or first in-stock variant. `useCart.addItem()` already opens the cart drawer after a successful add, so Quick Add should route through that existing path instead of inventing parallel cart state. [VERIFIED: codebase grep]

The only interaction in this phase that should add a new dependency is the Size Guide modal. A centered modal needs portal rendering, escape-to-close, focus trapping, and focus return to the trigger; Radix Dialog is the current standard low-level primitive for that and fits this repo's existing Radix-style component usage better than a custom overlay. [CITED: https://react.dev/reference/react-dom/createPortal] [CITED: https://www.radix-ui.com/primitives/docs/components/dialog] [VERIFIED: package.json]

**Primary recommendation:** Keep pages server-rendered, add small client leaf components for each bug, extend collection/home product queries for variant data, and use `@radix-ui/react-dialog` for Size Guide instead of hand-rolling modal behavior. [VERIFIED: codebase grep] [VERIFIED: npm registry]

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | `16.0.10` installed, `16.2.3` current as of 2026-04-08 [VERIFIED: package.json] [VERIFIED: npm registry] | App Router pages, `Link`, client/server component split | The repo already uses Next App Router, and `Link` is the official navigation primitive with current support for `onNavigate` when navigation control is needed. [VERIFIED: codebase grep] [CITED: https://nextjs.org/docs/app/api-reference/components/link] |
| `react` / `react-dom` | `19.2.1` installed, `19.2.5` current as of 2026-04-08 [VERIFIED: package.json] [VERIFIED: npm registry] | Client state, event handlers, refs, portals | All interaction fixes in this phase are simple React state/event problems, and React still provides the canonical `onSubmit`, `onToggle`, and `createPortal` primitives. [VERIFIED: package.json] [CITED: https://react.dev/reference/react-dom/components/common] [CITED: https://react.dev/reference/react-dom/createPortal] |
| Existing cart stack (`CartProvider`, `useCart`, `AddToCartButton`) | In-repo utilities, no new version [VERIFIED: codebase grep] | Cart mutations, drawer open state, add-to-bag feedback | `useCart.addItem()` already sets `cartOpen` to `true`, so reusing this stack preserves cart behavior and avoids duplicate mutation logic. [VERIFIED: codebase grep] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@radix-ui/react-dialog` | Not installed; `1.1.15` current as of 2025-08-13 [VERIFIED: package.json] [VERIFIED: npm registry] | Accessible centered modal for BUG-03 | Use for the Size Guide modal because it supplies portal rendering, focus trapping, controlled/uncontrolled state, and escape handling out of the box. [CITED: https://www.radix-ui.com/primitives/docs/components/dialog] |
| `framer-motion` | `12.29.2` installed, `12.38.0` current as of 2026-03-17 [VERIFIED: package.json] [VERIFIED: npm registry] | Subtle open/close motion already used in `Navbar`, `Hero`, and `Sheet` | Use only where existing motion language already exists, such as a short fade/slide on search overlay or modal content. Keep duration in the approved subtle range. [VERIFIED: codebase grep] [VERIFIED: .planning/phases/02-bug-fixes/02-CONTEXT.md] |
| `lucide-react` | `0.563.0` installed, `1.8.0` current as of 2026-04-09 [VERIFIED: package.json] [VERIFIED: npm registry] | Existing icon set for close, search, chevron, helper icons | Reuse current icons instead of adding a second icon library. [VERIFIED: package.json] [VERIFIED: codebase grep] |
| `@shopify/storefront-api-client` | `1.0.9` installed, `1.0.10` current as of 2026-03-11 [VERIFIED: package.json] [VERIFIED: npm registry] | Backing store for product list/detail data | No new Shopify client work is needed, but BUG-01 requires extending existing Storefront queries to include variant IDs and availability on product cards. [VERIFIED: codebase grep] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@radix-ui/react-dialog` | Native `<dialog>` with custom styling and event plumbing | Native `<dialog>` avoids a dependency, but this repo would still need focus-return, inert background behavior, and consistent cross-browser interaction testing. Radix already packages those behaviors. [CITED: https://www.radix-ui.com/primitives/docs/components/dialog] [ASSUMED] |
| Client leaf `ProductCard` component | Convert whole home/collection pages to client components | Making full pages client would pull data fetching and large render trees into client mode for a small interaction bug, which is unnecessary given the existing server/client split. [VERIFIED: codebase grep] |
| Local search overlay state in `Navbar` | Global provider for search UI | No other part of the app consumes search state today, so a provider would add structure without solving a current coordination problem. [VERIFIED: codebase grep] |

**Installation:**
```bash
pnpm add @radix-ui/react-dialog
```

**Version verification:** Current recommended package versions were confirmed with `npm view <package> version` and `npm view <package> time --json` on 2026-04-12. [VERIFIED: npm registry]

## Architecture Patterns

### Recommended Project Structure

```text
app/
├── page.tsx                         # Server-rendered home page keeps data fetching
├── collections/[handle]/page.tsx   # Server-rendered collection page keeps data fetching
└── product/[handle]/page.tsx        # Server-rendered product shell

components/
├── cards/ProductCard.tsx           # New client island for BUG-01 quick add
├── product/DescriptionToggle.tsx   # New client toggle for BUG-02
├── product/SizeGuideModal.tsx      # New client modal for BUG-03
├── navbar/SearchOverlay.tsx        # New client overlay used by Navbar for BUG-06
└── newsletter/NewsletterSignup.tsx # New client form wrapper for BUG-04
```

This structure keeps data fetching where it already lives and isolates interactivity to small client components that receive serializable props. [VERIFIED: codebase grep]

### Pattern 1: Server Page + Client Interaction Leaf

**What:** Keep list/detail pages as server components and pass only the data needed for each interaction into a client child. [VERIFIED: codebase grep]

**When to use:** Use this for Quick Add, newsletter success state, description toggle, and navbar search, because each feature needs client state but does not justify converting the whole page to client mode. [VERIFIED: codebase grep]

**Example:**
```tsx
// Source: repo pattern + Next App Router docs
// Verified by app/page.tsx, app/collections/[handle]/page.tsx, app/layout.tsx
import { getProducts } from "@/lib/index";
import { ProductCard } from "@/components/cards/ProductCard";

export default async function Home() {
  const products = await getProducts(12);

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}
```

### Pattern 2: Separate Hit Targets for Card Navigation and Quick Add

**What:** Render the card link and the Quick Add button as siblings inside a containing `article`, not as a button-like element inside a wrapping anchor. [CITED: https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element]

**When to use:** Use this anywhere a full card is clickable but a secondary CTA must perform a different action. [CITED: https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element]

**Example:**
```tsx
// Source: HTML anchor content model + existing useCart pattern
"use client";

import Link from "next/link";
import { useCart } from "@/lib/cartContext";

export function ProductCard({ product }: { product: CardProduct }) {
  const { addItem } = useCart();

  return (
    <article className="group relative">
      <Link href={`/product/${product.handle}`} className="block">
        {/* image + copy */}
      </Link>

      <button
        type="button"
        onClick={() => product.firstAvailableVariantId && addItem(product.firstAvailableVariantId)}
        className="absolute bottom-0 left-0 right-0"
      >
        Quick Add
      </button>
    </article>
  );
}
```

### Pattern 3: Controlled, Portal-Backed Modal for Size Guide

**What:** Use a controlled dialog root plus trigger/content components for the Size Guide modal. [CITED: https://www.radix-ui.com/primitives/docs/components/dialog]

**When to use:** Use this for BUG-03 because the requirement explicitly calls for a centered modal overlay and the interaction needs escape-to-close, outside-click close, focus trapping, and focus return. [VERIFIED: .planning/phases/02-bug-fixes/02-CONTEXT.md] [CITED: https://www.radix-ui.com/primitives/docs/components/dialog]

**Example:**
```tsx
// Source: Radix Dialog docs + repo's premium monochrome UI direction
"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export function SizeGuideModal() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="text-[11px] underline underline-offset-4 text-zinc-500">
          Size Guide
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[min(92vw,680px)] -translate-x-1/2 -translate-y-1/2 bg-white p-6">
          <Dialog.Title className="text-[11px] font-bold uppercase tracking-[0.2em]">
            Size Guide
          </Dialog.Title>

          <button aria-label="Close" className="absolute right-4 top-4">
            <X className="h-4 w-4" />
          </button>

          {/* static measurements table */}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

### Pattern 4: Client-Only Form Success Without Reload

**What:** Handle newsletter submission with a client `onSubmit`, call `preventDefault()`, swap the form for a success message, then reset after a timeout. [CITED: https://react.dev/reference/react-dom/components/common] [VERIFIED: .planning/phases/02-bug-fixes/02-CONTEXT.md]

**When to use:** Use this for BUG-04 because real newsletter backend work is explicitly deferred out of scope. [VERIFIED: .planning/REQUIREMENTS.md]

**Example:**
```tsx
// Source: React form events + Phase 2 context
"use client";

import { useEffect, useState } from "react";

export function NewsletterSignup() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!submitted) return;
    const timer = window.setTimeout(() => setSubmitted(false), 4000);
    return () => window.clearTimeout(timer);
  }, [submitted]);

  if (submitted) {
    return <p className="text-sm text-zinc-400">You’re in. Early access unlocked.</p>;
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
      className="flex flex-col gap-3"
    >
      <input type="email" required placeholder="Your email address" />
      <button type="submit">Subscribe</button>
    </form>
  );
}
```

### Anti-Patterns to Avoid

- **Quick Add inside the wrapping `Link`:** The HTML standard forbids interactive descendants inside anchors, and this structure makes click handling ambiguous. Use separate siblings instead. [CITED: https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element]
- **Whole-page `use client` conversion:** This phase fixes six isolated interactions; it does not justify moving data fetching out of existing server pages. [VERIFIED: codebase grep]
- **Hand-rolled modal focus management:** Do not recreate escape handling, focus trap, or focus return with ad hoc `div` overlays. [CITED: https://www.radix-ui.com/primitives/docs/components/dialog]
- **Footer links that point to nowhere:** Replacing a `span` with `Link` is not enough if the destination route still 404s. [VERIFIED: codebase grep] [ASSUMED]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Centered modal dialog | Custom `div` overlay with manual keydown/focus code | `@radix-ui/react-dialog` | Radix already covers modal/non-modal modes, focus trap, screen-reader announcements, escape close, and portal rendering. [CITED: https://www.radix-ui.com/primitives/docs/components/dialog] |
| Cart-open side effects after Quick Add | Second cart store or duplicate mutation helper | Existing `useCart.addItem()` | `addItem()` already creates/adds lines and opens the drawer via `setCartOpen(true)`. [VERIFIED: codebase grep] |
| Newsletter success flow | Fake network request layer or server action for v1 | Client-only state swap with timeout | Requirements explicitly defer real newsletter integration, so a local success state is the intended v1 behavior. [VERIFIED: .planning/REQUIREMENTS.md] |
| Search results backend | Shopify search integration or `/search` page | Local overlay with suggestions and future-phase note | The phase contract says full search ships later, so only the trigger/open behavior belongs here. [VERIFIED: .planning/phases/02-bug-fixes/02-CONTEXT.md] |

**Key insight:** The deceptively complex part of this phase is not styling; it is avoiding structural regressions while inserting interactivity into server-rendered UI. Reuse the cart path, keep state local, and import a real dialog primitive for the one feature that needs one. [VERIFIED: codebase grep] [CITED: https://www.radix-ui.com/primitives/docs/components/dialog]

## Common Pitfalls

### Pitfall 1: Shipping Quick Add Without Variant Data

**What goes wrong:** The button renders and clicks, but there is no merchandise ID available on home or collection cards, so nothing valid can be added to cart. [VERIFIED: codebase grep]

**Why it happens:** `getProducts()` and `getCollection()` only return product-level fields like `id`, `title`, `handle`, `priceRange`, and `featuredImage`; they do not fetch `variants`. [VERIFIED: codebase grep]

**How to avoid:** Extend both list queries to return at least variant `id`, `quantityAvailable`, and enough ordering to compute "default or first in-stock variant" on the server or in the client card leaf. Reuse the richer variant shape already queried by `getProductByHandle()`. [VERIFIED: codebase grep]

**Warning signs:** Quick Add appears clickable but silently does nothing, logs undefined merchandise IDs, or always opens the cart empty. [VERIFIED: codebase grep] [ASSUMED]

### Pitfall 2: Fixing Click Behavior While Keeping Invalid Markup

**What goes wrong:** Developers try `stopPropagation()` or `preventDefault()` inside a button nested under the card `Link`, but edge cases remain on keyboard interaction and semantics stay invalid. [CITED: https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element] [ASSUMED]

**Why it happens:** The current card layout uses the full card as a `Link`, and Quick Add is visually presented inside that hit target. [VERIFIED: codebase grep]

**How to avoid:** Split the card into an `article` with a `Link` for navigation and a sibling `button` for Quick Add. [CITED: https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element]

**Warning signs:** Keyboard tab order feels wrong, space/enter activates the wrong target, or nested interactive warnings appear during review. [CITED: https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element] [ASSUMED]

### Pitfall 3: Building a Modal That Looks Right but Behaves Wrong

**What goes wrong:** The Size Guide visually opens, but focus is lost, `Esc` does nothing, or screen readers lack a title/description announcement. [CITED: https://www.radix-ui.com/primitives/docs/components/dialog]

**Why it happens:** This repo has a custom `Sheet` but no existing modal/dialog primitive, so it is tempting to clone the sheet pattern for the centered modal. [VERIFIED: codebase grep]

**How to avoid:** Use Radix Dialog and wrap it in a small local component styled to match the existing monochrome UI. [CITED: https://www.radix-ui.com/primitives/docs/components/dialog]

**Warning signs:** Focus stays on the page behind the modal, the close button is the only keyboard-accessible element, or closing the modal does not return focus to the trigger. [CITED: https://www.radix-ui.com/primitives/docs/components/dialog]

### Pitfall 4: Conflating "Clickable Link" With "Valid Destination"

**What goes wrong:** BUG-05 passes visually because the footer text becomes a `Link`, but the new link still routes to a missing page. [VERIFIED: codebase grep]

**Why it happens:** No privacy, terms, or legal routes exist in `app/` today. [VERIFIED: codebase grep]

**How to avoid:** Decide during planning whether Phase 2 should also add minimal `/privacy-policy` and `/terms-of-service` pages, or whether the product owner accepts temporary placeholder destinations. [VERIFIED: codebase grep] [ASSUMED]

**Warning signs:** Clicking the new links triggers Next.js 404 behavior. [VERIFIED: codebase grep] [ASSUMED]

## Code Examples

Verified patterns adapted to this repo:

### Product Card Quick Add Leaf

Use a small client component to preserve server data fetching while enabling cart mutation and inline success state. [VERIFIED: codebase grep]

```tsx
// Source: app/page.tsx, app/collections/[handle]/page.tsx, lib/cartContext.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cartContext";

type CardProduct = {
  handle: string;
  title: string;
  firstAvailableVariantId?: string;
};

export function ProductCard({ product }: { product: CardProduct }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <article className="group relative">
      <Link href={`/product/${product.handle}`} className="block">
        <h3>{product.title}</h3>
      </Link>

      <button
        type="button"
        disabled={!product.firstAvailableVariantId}
        onClick={async () => {
          if (!product.firstAvailableVariantId) return;
          await addItem(product.firstAvailableVariantId);
          setAdded(true);
          window.setTimeout(() => setAdded(false), 2500);
        }}
      >
        {added ? "Added to Bag" : "Quick Add"}
      </button>
    </article>
  );
}
```

### Minimal Description Toggle

Use a focused local client wrapper instead of converting `ProductDetail` to a client component. [VERIFIED: codebase grep]

```tsx
// Source: components/ProductDetail.tsx + React event/state model
"use client";

import { useState } from "react";

export function DescriptionToggle({ description }: { description: string }) {
  const [open, setOpen] = useState(true);

  return (
    <section className="border-t border-zinc-100 pt-8">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em]"
      >
        Description
        <span className={open ? "rotate-45 transition-transform" : "transition-transform"}>+</span>
      </button>

      {open && <p className="mt-4 text-sm text-zinc-500 leading-relaxed">{description}</p>}
    </section>
  );
}
```

### Search Overlay With Auto-Focus

The search trigger already lives in `Navbar`, so keep the open state there and focus the input when the overlay appears. [VERIFIED: codebase grep] [ASSUMED]

```tsx
// Source: components/navbar/page.tsx + existing SearchBar path
"use client";

import { useEffect, useRef } from "react";

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="absolute right-4 top-full mt-3 w-[min(92vw,32rem)] bg-white border border-zinc-200 p-4 shadow-2xl">
      <input ref={inputRef} type="search" placeholder="Search for products" className="w-full" />
      <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
        Full search lands in a future phase.
      </p>
      <button type="button" onClick={onClose} className="sr-only">
        Close search
      </button>
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Full-card anchor containing a secondary CTA | Separate link and button hit targets | Current HTML Living Standard, last updated 2026-04-07 [CITED: https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element] | Prevents invalid interactive nesting and makes keyboard/click behavior predictable. |
| In-place modal markup under local stacking context | Portal-backed dialog content | Current React docs and Radix Dialog guidance checked on 2026-04-12 [CITED: https://react.dev/reference/react-dom/createPortal] [CITED: https://www.radix-ui.com/primitives/docs/components/dialog] | Makes centered overlay rendering and accessibility behavior reliable. |
| Dead placeholder search form disconnected from navbar | Navbar-owned lightweight overlay/dropdown with static suggestions | Project decision captured 2026-04-12 [VERIFIED: .planning/phases/02-bug-fixes/02-CONTEXT.md] | Delivers BUG-06 without pulling full search into this phase. |

**Deprecated/outdated:**
- `components/laoyout/SearchBar.tsx` is only a starter artifact right now; its export casing, generic category dropdown, and blue button styling do not match the current premium storefront UI. Treat it as raw material, not as shippable UI. [VERIFIED: codebase grep]
- The current product-card Quick Add bars in `app/page.tsx` and `app/collections/[handle]/page.tsx` are presentation-only and should be considered obsolete once the shared client card component exists. [VERIFIED: codebase grep]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | BUG-05 should be planned to avoid 404 destinations, not merely to replace spans with clickable links. [ASSUMED] | Summary, Common Pitfalls, Open Questions | If the user only expects clickable text, the plan could add unnecessary route work. If the user expects valid destinations and the plan ignores it, BUG-05 will ship half-fixed. |
| A2 | A small client `ProductCard` extraction is acceptable in this phase even though the roadmap names work by feature rather than by component refactor. [ASSUMED] | Architecture Patterns | If the team wants zero structural reshaping, the plan must duplicate Quick Add logic across two pages instead. |

## Open Questions

1. **What should Privacy Policy and Terms of Service point to in Phase 2?** [VERIFIED: codebase grep]
   What we know: The footer currently renders them as non-link spans, and no privacy/terms/legal routes exist under `app/`. [VERIFIED: codebase grep]
   What's unclear: Whether BUG-05 is satisfied by clickable placeholders or requires real destinations in this same phase. [ASSUMED]
   Recommendation: Lock this before planning. If the answer is "real destination," add minimal policy pages in Phase 2 so the links do not 404. [ASSUMED]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js app, lint/build, possible package install | ✓ [VERIFIED: local CLI probe] | `v24.11.1` [VERIFIED: local CLI probe] | — |
| `pnpm` | Canonical package manager for this repo | ✓ [VERIFIED: local CLI probe] | `10.23.0` [VERIFIED: local CLI probe] | `npm` exists, but repo policy says `pnpm` is canonical. [VERIFIED: .planning/STATE.md] [VERIFIED: local CLI probe] |
| `npm` | Version verification against registry | ✓ [VERIFIED: local CLI probe] | `11.6.2` [VERIFIED: local CLI probe] | — |

**Missing dependencies with no fallback:**
- None for planning. `@radix-ui/react-dialog` would be installed during implementation if the modal recommendation is accepted. [VERIFIED: npm registry]

**Missing dependencies with fallback:**
- `@radix-ui/react-dialog` is not currently installed. Fallback is native `<dialog>`, but that increases accessibility and behavior risk. [VERIFIED: package.json] [ASSUMED]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected. [VERIFIED: codebase grep] |
| Config file | None detected. [VERIFIED: codebase grep] |
| Quick run command | `pnpm lint` [VERIFIED: package.json] |
| Full suite command | `pnpm lint && pnpm build` [VERIFIED: package.json] |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| BUG-01 | Quick Add adds first/default or first in-stock variant and opens cart drawer | manual browser/UAT in this phase; future component/e2e coverage [VERIFIED: .planning/REQUIREMENTS.md] | `pnpm lint && pnpm build` for regression smoke only [VERIFIED: package.json] | ❌ Wave 0 |
| BUG-02 | Description starts expanded and toggles open/closed | manual browser/UAT in this phase [VERIFIED: .planning/REQUIREMENTS.md] | `pnpm lint && pnpm build` [VERIFIED: package.json] | ❌ Wave 0 |
| BUG-03 | Size Guide opens centered modal with static table | manual browser/UAT in this phase [VERIFIED: .planning/REQUIREMENTS.md] | `pnpm lint && pnpm build` [VERIFIED: package.json] | ❌ Wave 0 |
| BUG-04 | Newsletter submit shows inline success and avoids page reload | manual browser/UAT in this phase [VERIFIED: .planning/REQUIREMENTS.md] | `pnpm lint && pnpm build` [VERIFIED: package.json] | ❌ Wave 0 |
| BUG-05 | Footer legal text renders as links | manual browser/UAT in this phase [VERIFIED: .planning/REQUIREMENTS.md] | `pnpm lint && pnpm build` [VERIFIED: package.json] | ❌ Wave 0 |
| BUG-06 | Navbar search opens the search UI and focuses input | manual browser/UAT in this phase [VERIFIED: .planning/REQUIREMENTS.md] | `pnpm lint && pnpm build` [VERIFIED: package.json] | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `pnpm lint` [VERIFIED: package.json]
- **Per wave merge:** `pnpm build` [VERIFIED: package.json]
- **Phase gate:** `pnpm lint && pnpm build`, plus manual UAT for all six success criteria because no automated interaction harness exists and test infrastructure is deferred in v1 requirements. [VERIFIED: package.json] [VERIFIED: .planning/REQUIREMENTS.md]

### Wave 0 Gaps

- No test framework or test files exist today. [VERIFIED: codebase grep]
- The v1 requirements explicitly defer test-suite work to v2, so adding Playwright or Vitest in Phase 2 would be scope expansion rather than a requirement. [VERIFIED: .planning/REQUIREMENTS.md]
- If the planner wants automated coverage anyway, the best fit is a minimal browser-level smoke harness for BUG-01 through BUG-06 because these are user interactions across server and client boundaries. [ASSUMED]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no [VERIFIED: codebase grep] | No authentication surface is touched by this phase. [VERIFIED: codebase grep] |
| V3 Session Management | no [VERIFIED: codebase grep] | No session/token handling is introduced by these UI bug fixes. [VERIFIED: codebase grep] |
| V4 Access Control | no [VERIFIED: codebase grep] | No protected routes or privilege checks are involved. [VERIFIED: codebase grep] |
| V5 Input Validation | yes [VERIFIED: codebase grep] | Keep newsletter input typed as `email`, keep search/newsletter copy rendered as plain JSX text, and avoid HTML injection shortcuts. [VERIFIED: codebase grep] |
| V6 Cryptography | no [VERIFIED: codebase grep] | No crypto requirements are introduced in this phase. [VERIFIED: codebase grep] |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS through search or newsletter helper copy if future code injects raw HTML | Tampering | Keep all user-visible helper/success text as literal JSX strings; no `dangerouslySetInnerHTML` usage exists today and none is needed here. [VERIFIED: codebase grep] |
| Open redirect or broken navigation via ad hoc external legal links | Spoofing | Use internal `Link` routes controlled by the app for BUG-05 unless the user explicitly supplies external policy URLs. [VERIFIED: codebase grep] [ASSUMED] |
| Client-side overposting of newsletter data in a future backend integration | Information Disclosure | For this phase, do not add a real network request; only local success state is required. [VERIFIED: .planning/REQUIREMENTS.md] |

## Sources

### Primary (HIGH confidence)

- Codebase inspection via `rg`, `sed`, and route scans on 2026-04-12. Topics checked: product card structure, navbar state, cart state, detail-page description block, route availability, and test/config presence. [VERIFIED: codebase grep]
- npm registry via `npm view`. Topics checked: current versions and publish dates for `next`, `react`, `framer-motion`, `@radix-ui/react-dialog`, `@shopify/storefront-api-client`, and `lucide-react`. [VERIFIED: npm registry]
- WHATWG HTML Living Standard: https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element . Topic checked: anchor content model forbidding interactive descendants. [CITED: https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element]
- Next.js Link docs: https://nextjs.org/docs/app/api-reference/components/link . Topics checked: `Link` as the navigation primitive and `onNavigate` behavior. [CITED: https://nextjs.org/docs/app/api-reference/components/link]
- React common DOM component docs: https://react.dev/reference/react-dom/components/common . Topics checked: `onSubmit` and `onToggle` events. [CITED: https://react.dev/reference/react-dom/components/common]
- React `createPortal` docs: https://react.dev/reference/react-dom/createPortal . Topic checked: portal rendering for modal/overlay UI. [CITED: https://react.dev/reference/react-dom/createPortal]
- Radix Dialog docs: https://www.radix-ui.com/primitives/docs/components/dialog . Topics checked: modal features, accessibility behavior, installation, portal anatomy, and controlled state. [CITED: https://www.radix-ui.com/primitives/docs/components/dialog]

### Secondary (MEDIUM confidence)

- None.

### Tertiary (LOW confidence)

- None.

## Metadata

**Confidence breakdown:**
- Standard stack: MEDIUM - Current package versions and official docs are verified, but the decision to add `@radix-ui/react-dialog` is a recommendation rather than an existing repo convention. [VERIFIED: npm registry] [CITED: https://www.radix-ui.com/primitives/docs/components/dialog]
- Architecture: HIGH - The current server/client split, cart state path, missing variant fields, and missing legal routes are directly visible in the codebase. [VERIFIED: codebase grep]
- Pitfalls: HIGH - The main pitfalls are confirmed by code inspection plus current HTML/React/Radix documentation. [VERIFIED: codebase grep] [CITED: https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element] [CITED: https://www.radix-ui.com/primitives/docs/components/dialog]

**Research date:** 2026-04-12
**Valid until:** 2026-05-12
