# Phase 2: Bug Fixes - Context

**Gathered:** 2026-04-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Ensure all currently shipped UI interactions in Phase 2 behave correctly and predictably (Quick Add, product detail toggles/modal, newsletter success, footer legal links, navbar search trigger) while preserving the existing elegant visual identity. This phase upgrades behavior and feedback quality; it does not redesign the UI system.

</domain>

<decisions>
## Implementation Decisions

### Quick Add Behavior
- **D-01:** Quick Add remains a separate CTA on product cards. Clicking Quick Add adds to cart; clicking the rest of the card still navigates to product detail.
- **D-02:** On successful Quick Add, show inline success feedback ("Added to Bag") and automatically open the cart drawer.
- **D-03:** Quick Add should be available on both desktop and mobile (desktop hover reveal can remain; mobile must have a tappable Quick Add affordance).
- **D-04:** If the first/default variant is out of stock, automatically add the first available in-stock variant.

### Product Detail Interactions
- **D-05:** Description section starts expanded by default and can be collapsed.
- **D-06:** Description interaction tone must stay minimal, with subtle animation only (small icon motion, smooth short transition).
- **D-07:** Size Guide opens as a centered modal overlay (not a drawer).
- **D-08:** Size Guide modal content for this phase is a simple static measurements table.

### Feedback States
- **D-09:** Newsletter form submit success is shown inline in place of the form area.
- **D-10:** Newsletter success state shows briefly (about 3-5 seconds), then restores the form.
- **D-11:** Navbar search icon opens a lightweight search overlay/dropdown.
- **D-12:** Until full search ships, search overlay shows guided suggestions and a clear note that full results are a future phase.

### Upgrade Guardrails
- **D-13:** Preserve current UI style strictly for this phase: typography families, core palette, and major layout structure remain unchanged.
- **D-14:** Motion policy is subtle and functional only (target 150-250ms, ease-out style transitions, no decorative animation).
- **D-15:** New microcopy tone is short, premium, and low-noise.

### the agent's Discretion
- Exact easing curves and timing values within the approved subtle range.
- Exact wording variants for success/helper copy, as long as tone remains premium and concise.
- Precise responsive presentation details for mobile Quick Add and search overlay, while preserving existing visual language.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase contract
- `.planning/ROADMAP.md` — Phase 2 goal, mapped requirements, and success criteria for bug fixes.
- `.planning/REQUIREMENTS.md` — BUG-01 through BUG-06 acceptance requirements.
- `.planning/PROJECT.md` — Core value and constraints; confirms this is an upgrade/stabilization milestone.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/addToCart.tsx` (`AddToCartButton`) — existing add-to-cart state machine and labels can back Quick Add feedback patterns.
- `components/Cart.tsx` + `components/ui/sheet.tsx` — established cart drawer behavior for post-add confirmation.
- `components/ProductActions.tsx` — current Size Guide trigger location and variant selection context.
- `components/navbar/page.tsx` — existing search icon trigger point and navbar interaction logic.
- `app/page.tsx` and `app/collections/[handle]/page.tsx` — existing product card Quick Add UI affordance to wire with behavior.

### Established Patterns
- Visual system is sharp, minimal, premium (uppercase tracking, monochrome palette, subtle transitions).
- Interactive confirmations already use short-lived state transitions (e.g., add-to-cart "added" state) and can be mirrored.
- Cart/cart-open state is centralized via `useCart` context and is already user-visible in navbar + drawer.

### Integration Points
- Product card Quick Add wiring in `app/page.tsx` and `app/collections/[handle]/page.tsx`.
- Description accordion + Size Guide modal interactions in `components/ProductDetail.tsx` and `components/ProductActions.tsx`.
- Newsletter submit behavior and legal links in `app/page.tsx` footer.
- Search trigger/open state in `components/navbar/page.tsx`, with current unused search component path `components/laoyout/SearchBar.tsx` as a potential starter.

</code_context>

<specifics>
## Specific Ideas

- "The UI now is nice and elegant" is a non-negotiable design anchor.
- "Do not eliminate the current UI, upgrade it" is the implementation philosophy for this phase.
- Quick Add should feel frictionless and confident: immediate add flow with visible confirmation and cart visibility.

</specifics>

<deferred>
## Deferred Ideas

- Broader visual redesign/retheme is deferred to a future phase. This phase focuses on behavior and interaction polish only.

</deferred>

---

*Phase: 02-bug-fixes*
*Context gathered: 2026-04-12*
