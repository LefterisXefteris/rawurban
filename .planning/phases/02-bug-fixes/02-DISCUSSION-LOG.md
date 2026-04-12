# Phase 2: Bug Fixes - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-12
**Phase:** 02-bug-fixes
**Areas discussed:** Quick Add Behavior, Product Detail Interactions, Feedback States, Consistency Rules for Upgrade-Only UI

---

## Quick Add Behavior

### Q1: On product cards, what should "Quick Add" click do exactly?

| Option | Description | Selected |
|--------|-------------|----------|
| Separate CTA behavior | Clicking Quick Add adds first variant to cart and keeps user on current page; clicking elsewhere on card still opens product page. | ✓ |
| Card-level add behavior | Clicking the whole card (while hovered) adds to cart instead of navigating. | |
| Navigate-first behavior | Quick Add opens product page with first variant preselected (no direct add). | |

**User's choice:** Separate CTA behavior
**Notes:** Preserve existing card navigation while adding direct commerce action.

### Q2: After Quick Add succeeds, what feedback should we show?

| Option | Description | Selected |
|--------|-------------|----------|
| Inline success + cart drawer open | Quick Add label switches to success and cart drawer opens automatically. | ✓ |
| Inline success only | Show success state without opening cart drawer. | |
| Cart-only feedback | Open cart drawer without changing Quick Add label. | |

**User's choice:** Inline success + cart drawer open
**Notes:** Confirmation should be immediate and visible both inline and in bag context.

### Q3: Where should the Quick Add action be available?

| Option | Description | Selected |
|--------|-------------|----------|
| Desktop + Mobile | Hover reveal on desktop and tappable Quick Add on mobile cards. | ✓ |
| Desktop only | Keep hover behavior only; no mobile Quick Add. | |
| Desktop hover + mobile long-press | Keep mobile visually cleaner but action hidden behind gesture. | |

**User's choice:** Desktop + Mobile
**Notes:** Quick Add should remain frictionless across devices.

### Q4: If the default/first variant is out of stock, what should happen?

| Option | Description | Selected |
|--------|-------------|----------|
| Add first available variant automatically | Skip unavailable default and add first in-stock variant. | ✓ |
| Open product page for selection | Redirect user to pick variant manually. | |
| Disable with sold-out state | Show sold-out and prevent quick add attempt. | |

**User's choice:** Add first available variant automatically
**Notes:** User prefers preserving speed of purchase flow over manual resolution.

---

## Product Detail Interactions

### Q1: How should the Description section behave by default?

| Option | Description | Selected |
|--------|-------------|----------|
| Expanded by default, user can collapse | Product information is immediately visible but still controllable. | ✓ |
| Collapsed by default | User expands only when needed. | |
| Always expanded, no toggle | Fully static section. | |

**User's choice:** Expanded by default, user can collapse
**Notes:** Matches product-first premium detail presentation.

### Q2: Description icon/animation tone?

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal + subtle | Small plus/minus (or chevron) with smooth short transition. | ✓ |
| Stronger motion cue | More visible icon rotation and expansion animation. | |
| No animation | Instant state change only. | |

**User's choice:** Minimal + subtle
**Notes:** Maintain elegant feel with restrained interaction cues.

### Q3: Where should Size Guide appear?

| Option | Description | Selected |
|--------|-------------|----------|
| Centered modal overlay | Focused dialog with dim backdrop and standard close patterns. | ✓ |
| Right-side drawer | Slide-in panel matching cart style. | |
| Full-screen sheet | Mobile-first immersive layer on all breakpoints. | |

**User's choice:** Centered modal overlay
**Notes:** Keeps behavior conventional and clear for sizing content.

### Q4: Size Guide content for Phase 2?

| Option | Description | Selected |
|--------|-------------|----------|
| Simple static measurements table | S/M/L/XL style table with basic measurements. | ✓ |
| Table + how-to-measure section | Adds extra instructional content in same phase. | |
| Placeholder only | Defers useful content to later phase. | |

**User's choice:** Simple static measurements table
**Notes:** Prioritizes practical utility without scope expansion.

---

## Feedback States

### Q1: Newsletter success feedback pattern?

| Option | Description | Selected |
|--------|-------------|----------|
| Inline success state in-place | Replace form area with a clean success confirmation. | ✓ |
| Toast-only success | Keep form visible, show temporary toast. | |
| Inline + toast | Double feedback mechanism. | |

**User's choice:** Inline success state in-place
**Notes:** Inline confirmation aligns with calm, premium interaction style.

### Q2: Should users submit another email immediately?

| Option | Description | Selected |
|--------|-------------|----------|
| Show success briefly then restore form | Auto-return form after ~3-5 seconds. | ✓ |
| Keep success until refresh/navigation | Persistent terminal state. | |
| Success + explicit resubscribe action | Manual reset path. | |

**User's choice:** Show success briefly then restore form
**Notes:** Confirmation should be clear but not block follow-up action.

### Q3: Navbar Search icon behavior in Phase 2?

| Option | Description | Selected |
|--------|-------------|----------|
| Lightweight search overlay/dropdown | Immediate visible response without full search system. | ✓ |
| Inline navbar search field | Expand/search directly in navbar row. | |
| Full-page search modal | Heavyweight temporary solution. | |

**User's choice:** Lightweight search overlay/dropdown
**Notes:** Good interim UX before full search infrastructure ships.

### Q4: Pre-results behavior for search?

| Option | Description | Selected |
|--------|-------------|----------|
| Guided placeholder | Show suggestions + note that full search is next phase. | ✓ |
| Minimal empty state | Input + close only. | |
| Redirect to collections | Submit sends users to collections page. | |

**User's choice:** Guided placeholder
**Notes:** Better perceived completeness while staying honest about scope.

---

## Consistency Rules for Upgrade-Only UI

### Q1: How strict should style preservation be?

| Option | Description | Selected |
|--------|-------------|----------|
| Strict preserve | Keep typography families, palette, and layout structure unchanged. | ✓ |
| Preserve mostly | Allow minor typography/spacing refinements. | |
| Moderate refresh allowed | Permit visible visual updates. | |

**User's choice:** Strict preserve
**Notes:** Non-negotiable: evolve behavior, not visual identity.

### Q2: Motion policy for this phase?

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle motion only | 150-250ms functional transitions only. | ✓ |
| Mixed motion | Mostly subtle with selective expressive moments. | |
| Motion-minimal | Almost no transitions. | |

**User's choice:** Subtle motion only
**Notes:** Motion should support clarity, not draw attention.

### Q3: Copy/tone policy for new UI messages?

| Option | Description | Selected |
|--------|-------------|----------|
| Short, premium, low-noise | Concise and calm language without playful tone. | ✓ |
| Friendly/conversational | Warmer, chatty wording. | |
| Utility-only terse | Strictly functional system text. | |

**User's choice:** Short, premium, low-noise
**Notes:** Keeps brand voice aligned across success and helper messages.

---

## the agent's Discretion

- Exact microcopy phrasing that preserves selected tone.
- Exact motion values/easing within the approved subtle range.
- Responsive implementation details for mobile Quick Add and search overlay without visual drift.

## Deferred Ideas

- Broader UI redesign/retheme beyond interaction upgrades.
