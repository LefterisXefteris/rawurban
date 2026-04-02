# Project State

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-04-02)

**Core value:** Customers can browse products and complete purchases without friction — the cart must always work.
**Current focus:** Phase 1 — Security & Code Cleanup

## Phase Status

| Phase | Name | Status | Plans |
|-------|------|--------|-------|
| 1 | Security & Code Cleanup | ◑ In Progress | 1/2 |
| 2 | Bug Fixes | ○ Pending | 0/2 |
| 3 | Content & Navigation | ○ Pending | 0/1 |
| 4 | Resilience & Performance | ○ Pending | 0/2 |

## Current Position

Phase: 1 of 4 (Security & Code Cleanup)
Plan: 1 of 2 complete
Status: In progress — plan 01-01 complete, plan 01-02 pending
Last activity: 2026-04-02 - Completed 01-01-PLAN.md (dependency cleanup & env hardening)

## Progress

Progress: █░░░░░░░░░ 14% (1/7 plans complete)

## Accumulated Decisions

| Decision | Phase | Rationale |
|----------|-------|-----------|
| pnpm as sole package manager | 01-01 | Removed package-lock.json; pnpm-lock.yaml is the canonical lockfile |
| Env guards at module evaluation time | 01-01 | Error surfaces on first import, regardless of Next.js lifecycle stage |
| `token as string` instead of `token!` | 01-01 | Guard above proves token is truthy; eliminates non-null assertion operator |
| Named SHOPIFY_API_VERSION constant | 01-01 | Single definition prevents drift; referenced via template literal in shopifyFetch URL |

## Blockers & Concerns

None currently.

## Session Continuity

Last session: 2026-04-02T15:05:58Z
Stopped at: Completed 01-01-PLAN.md
Resume file: None

---
*State initialized: 2026-04-02*
*Last updated: 2026-04-02*
