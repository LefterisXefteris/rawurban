# Project State

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-04-02)

**Core value:** Customers can browse products and complete purchases without friction — the cart must always work.
**Current focus:** Phase 1 — Security & Code Cleanup

## Phase Status

| Phase | Name | Status | Plans |
|-------|------|--------|-------|
| 1 | Security & Code Cleanup | ✓ Complete | 2/2 |
| 2 | Bug Fixes | ○ Pending | 0/2 |
| 3 | Content & Navigation | ○ Pending | 0/1 |
| 4 | Resilience & Performance | ○ Pending | 0/2 |

## Current Position

Phase: 1 of 4 (Security & Code Cleanup)
Plan: 2 of 2 complete
Status: Phase 1 complete — ready for Phase 2 Bug Fixes
Last activity: 2026-04-02 - Completed 01-02-PLAN.md (code cleanup & hooks fix)

## Progress

Progress: ██░░░░░░░░ 29% (2/7 plans complete)

## Accumulated Decisions

| Decision | Phase | Rationale |
|----------|-------|-----------|
| pnpm as sole package manager | 01-01 | Removed package-lock.json; pnpm-lock.yaml is the canonical lockfile |
| Env guards at module evaluation time | 01-01 | Error surfaces on first import, regardless of Next.js lifecycle stage |
| `token as string` instead of `token!` | 01-01 | Guard above proves token is truthy; eliminates non-null assertion operator |
| Named SHOPIFY_API_VERSION constant | 01-01 | Single definition prevents drift; referenced via template literal in shopifyFetch URL |
| formatPrice in lib/utils.ts not lib/index.ts | 01-02 | lib/index.ts is the Shopify API gateway; pure UI formatting utilities belong in lib/utils.ts |
| removeItemImpl wrapped in useCallback([]) | 01-02 | setLoading/setCart are stable React state setters; removeFromCart is a stable module-level import; empty dep array is semantically correct |

## Blockers & Concerns

None currently.

## Session Continuity

Last session: 2026-04-02T15:15:20Z
Stopped at: Completed 01-02-PLAN.md (Phase 1 fully complete)
Resume file: None

---
*State initialized: 2026-04-02*
*Last updated: 2026-04-02*
