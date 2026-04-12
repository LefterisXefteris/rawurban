---
phase: 2
slug: bug-fixes
status: ready
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-12
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none (interaction test infra deferred to v2) |
| **Config file** | none — Wave 0 installs not in scope for this phase |
| **Quick run command** | `pnpm lint` |
| **Full suite command** | `pnpm lint && pnpm build` |
| **Estimated runtime** | ~45-120 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm lint`
- **After every plan wave:** Run `pnpm build`
- **Before `/gsd-verify-work`:** `pnpm lint && pnpm build` plus manual UAT for BUG-01..BUG-06
- **Max feedback latency:** 120 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | BUG-01 | T-02-01 / T-02-04 | Quick Add derives variant IDs from trusted query data and routes adds through existing cart context path | manual + smoke | `pnpm lint` | ✅ | ⬜ pending |
| 02-01-02 | 01 | 1 | BUG-04, BUG-05 | T-02-02 / T-02-03 | Newsletter success uses static local-state copy; legal links are hardcoded internal routes only | manual + smoke | `pnpm lint` | ✅ | ⬜ pending |
| 02-02-01 | 02 | 1 | BUG-02 | T-02-05 | Description toggle only changes visibility state and renders plain JSX text | manual + smoke | `pnpm lint` | ✅ | ⬜ pending |
| 02-02-02 | 02 | 1 | BUG-03 | T-02-06 | Size Guide modal uses controlled dialog behavior with static measurements content | manual + smoke | `pnpm lint` | ✅ | ⬜ pending |
| 02-02-03 | 02 | 1 | BUG-06 | T-02-07 / T-02-08 | Search overlay suggestions remain internal links with bounded local UI state only | manual + smoke | `pnpm lint` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- Existing infrastructure covers all phase requirements.
- No new test framework installation in this phase (explicitly deferred by v1 requirements).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Product card Quick Add + cart drawer open | BUG-01 | No component/e2e harness exists in v1 | In browser, click Quick Add on home and collection cards; confirm item added and drawer opens with updated quantity |
| Description expanded by default and toggle works | BUG-02 | UI interaction only | Open product page; verify description visible on load; click toggle to collapse and expand |
| Size Guide centered modal behavior | BUG-03 | Modal UX/accessibility behavior requires browser validation | Open size guide; verify centered overlay, keyboard escape closes, focus returns to trigger |
| Newsletter inline success without reload | BUG-04 | Form behavior is client-only interaction | Submit footer newsletter form; verify no page reload, inline success visible 3-5s, form returns |
| Privacy/Terms links clickable and navigate | BUG-05 | Route targets are UX-level acceptance | Click both links; confirm they navigate to intended non-broken destinations |
| Navbar search icon opens SearchBar input | BUG-06 | Overlay/input interaction requires browser check | Click search icon; verify overlay/input appears and input is focused |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or explicit manual coverage
- [ ] Sampling continuity: no 3 consecutive tasks without command verification
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-04-12
