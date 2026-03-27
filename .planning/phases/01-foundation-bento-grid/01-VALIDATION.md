---
phase: 1
slug: foundation-bento-grid
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-27
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (unit) + Playwright (e2e) |
| **Config file** | `vitest.config.ts`, `playwright.config.ts` — Wave 0 creates |
| **Quick run command** | `npm run test:unit` |
| **Full suite command** | `npm run test` |
| **Estimated runtime** | ~15 seconds (unit), ~45 seconds (full) |

---

## Sampling Rate

- **After every task commit:** Run `npm run test:unit`
- **After every plan wave:** Run `npm run test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | DEPLOY-01 | unit | `npm run test:unit astro-config.test.ts` | ❌ W0 | ⬜ pending |
| 01-01-02 | 01 | 1 | DEPLOY-02 | unit | `npm run test:unit cloudflare-adapter.test.ts` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | PORT-01, PORT-02 | unit | `npm run test:unit BentoCard.test.tsx` | ❌ W0 | ⬜ pending |
| 01-02-02 | 02 | 1 | PORT-03 | unit | `npm run test:unit card-variants.test.tsx` | ❌ W0 | ⬜ pending |
| 01-02-03 | 02 | 1 | PORT-04 | unit | `npm run test:unit image-hover.test.tsx` | ❌ W0 | ⬜ pending |
| 01-03-01 | 03 | 2 | RESP-01 | e2e | `npx playwright test responsive-grid.spec.ts` | ❌ W0 | ⬜ pending |
| 01-03-02 | 03 | 2 | RESP-02 | e2e | `npx playwright test touch-targets.spec.ts` | ❌ W0 | ⬜ pending |
| 01-04-01 | 04 | 2 | PORT-05 | unit | `npm run test:unit TabNavigation.test.tsx` | ❌ W0 | ⬜ pending |
| 01-05-01 | 05 | 3 | DEPLOY-03 | integration | `npm run test:integration deploy.test.ts` | ❌ W0 | ⬜ pending |
| 01-05-02 | 05 | 3 | DEPLOY-04 | integration | `npm run test:integration cloudflare-pages.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — Vitest configuration with React Testing Library
- [ ] `playwright.config.ts` — Playwright e2e configuration
- [ ] `src/tests/setup.ts` — Test setup with Astro/React testing utilities
- [ ] `package.json` test scripts — Add `test:unit`, `test:e2e`, `test` commands
- [ ] `@testing-library/react` — Install React testing utilities
- [ ] `@playwright/test` — Install Playwright for e2e testing

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual hover effects | PORT-03 | Animation timing subjective | Hover cards manually, verify 4px arrow nudge and #F0F0F0 background shift |
| Image grayscale transition | PORT-04 | Animation visual quality | Hover image cards, verify smooth grayscale(100%) → grayscale(0%) + scale(1.02) |
| Touch responsiveness | RESP-02 | Device-specific interaction | Test on mobile device or Chrome DevTools mobile emulation, verify 44px tap targets |

*If none: "All phase behaviors have automated verification."*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
