---
phase: 3
slug: newsletter-backend
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-29
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 3.0.0 (unit) + Playwright 1.50.0 (E2E) |
| **Config file** | `vitest.config.ts`, `playwright.config.ts` (exist) |
| **Quick run command** | `npm run test:unit` |
| **Full suite command** | `npm run test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test:unit`
- **After every plan wave:** Run `npm run test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | NEWS-02 | unit | `vitest run src/tests/unit/lib/db.test.ts` | Will be created | ⬜ pending |
| 03-02-01 | 02 | 1 | NEWS-01 | unit | `vitest run src/tests/unit/components/SubscribeModal.test.tsx` | Will be updated | ⬜ pending |
| 03-02-02 | 02 | 1 | NEWS-03 | e2e | `playwright test src/tests/e2e/newsletter.spec.ts` | Will be created | ⬜ pending |
| 03-04-01 | 04 | 2 | NEWS-04 | unit | `vitest run src/tests/unit/lib/email.test.ts` | Will be created | ⬜ pending |

*Status: ⬜ pending / ✅ green / ❌ red / ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/tests/unit/lib/db.test.ts` — unit tests for subscriber repository (duplicate prevention, schema)
- [ ] `src/tests/unit/lib/email.test.ts` — unit tests for Resend email sending (mock Resend client)
- [ ] `src/tests/unit/components/SubscribeModal.test.tsx` — unit tests for form validation and API integration
- [ ] `src/tests/e2e/newsletter.spec.ts` — E2E test for full subscription flow

*Wave 0 tests stub/mock external dependencies (Neon, Resend) to avoid requiring live credentials during development.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| End-to-end subscribe to Neon Postgres | NEWS-02 | Requires live `DATABASE_URL` + `RESEND_API_KEY` env vars | `wrangler pages dev` → open modal → subscribe → check Neon console |
| Real email delivery to inbox | NEWS-03, NEWS-04 | Requires real Resend API key + domain verification | Check inbox for confirmation email after subscription |

*All automated tests use mocked/stubbed external services. Manual verification required for live integration.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending