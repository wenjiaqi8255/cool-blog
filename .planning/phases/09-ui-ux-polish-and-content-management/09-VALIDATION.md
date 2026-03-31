---
phase: 09
slug: ui-ux-polish-and-content-management
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-31
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest |
| **Config file** | vitest.config.ts (to be created if missing) |
| **Quick run command** | `npm run test -- --run` |
| **Full suite command** | `npm run test -- --run --coverage` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Manual browser testing
- **After every plan wave:** Run `npm run test -- --run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 09-01-01 | 01 | 1 | UI-01 | Manual | Visual inspection | N/A | ⬜ pending |
| 09-01-02 | 01 | 1 | UI-02 | Manual | Inspect code block | N/A | ⬜ pending |
| 09-01-03 | 01 | 1 | UI-03 | Manual | Load article with images | N/A | ⬜ pending |
| 09-01-04 | 01 | 1 | UI-04 | Manual | Inspect article tags | N/A | ⬜ pending |
| 09-02-01 | 02 | 1 | UI-05 | Manual | Visual inspection | N/A | ⬜ pending |
| 09-03-01 | 03 | 2 | UI-06 | Unit | `vitest run src/config/content.test.ts` | ❌ W0 | ⬜ pending |
| 09-04-01 | 04 | 2 | UI-07 | Integration | Query portfolio articles | N/A | ⬜ pending |
| 09-04-02 | 04 | 2 | UI-08 | Manual | Click tabs | N/A | ⬜ pending |
| 09-04-03 | 04 | 2 | UI-09 | Manual | Click portfolio card | ❌ W0 | ⬜ pending |
| 09-04-04 | 04 | 2 | UI-10 | Unit | `vitest run src/components/portfolio/PortfolioCard.test.ts` | ❌ W0 | ⬜ pending |
| 09-05-01 | 05 | 2 | UI-11 | Manual | Render photo variant | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — Vitest configuration (if not present)
- [ ] `src/config/content.test.ts` — Stubs for UI-06 (config file validation)
- [ ] `src/components/interactive/PortfolioModal.test.tsx` — Stubs for UI-09 (modal behavior)
- [ ] `src/components/portfolio/PortfolioCard.test.tsx` — Stubs for UI-10, UI-11 (component props)

*Wave 0 creates test stubs so automated tests can verify component behavior.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Header frosted glass effect | UI-01 | Visual effect depends on scroll position | Scroll down, verify backdrop-blur + semi-transparent bg |
| Code block styling | UI-02 | Text color contrast requires visual inspection | Load article with code block, verify gray bg + black text |
| Image display | UI-03 | Layout/rendering depends on content | Load article with images, verify responsive sizing |
| Tag capsule styling | UI-04 | Border and shape require visual check | Inspect article tags, verify capsule + border |
| Articles page margins | UI-05 | Layout consistency is visual | Inspect articles page, verify margins and alignment |
| Tab active state | UI-08 | Color transition and state require interaction | Click tabs, verify black bg + white text on active |
| Portfolio modal | UI-09 | Modal overlay and animation are visual | Click portfolio card, verify modal opens |
| Photo card variant | UI-11 | Variant rendering is visual | Render portfolio with photo variant prop |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
