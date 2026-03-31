---
phase: 7
slug: content-workflow
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-31
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` (exists from Phase 5) |
| **Quick run command** | `npx vitest run --reporter=dot` |
| **Full suite command** | `npx vitest run --coverage` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=dot`
- **After every plan wave:** Run `npx vitest run --coverage`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 07-01-01 | 01 | 1 | WORK-01 | unit | `npx vitest run src/lib/content-parser.test.ts` | ⚠️ W0 | ⬜ pending |
| 07-01-02 | 01 | 1 | WORK-02 | unit | `npx vitest run src/lib/slug-generator.test.ts` | ⚠️ W0 | ⬜ pending |
| 07-02-01 | 02 | 1 | WORK-03 | integration | `npx vitest run src/app/api/articles/preview.test.ts` | ⚠️ W0 | ⬜ pending |
| 07-02-02 | 02 | 1 | WORK-04 | integration | `npx vitest run src/app/api/articles/publish.test.ts` | ⚠️ W0 | ⬜ pending |
| 07-03-01 | 03 | 2 | WORK-05 | integration | `npx vitest run src/app/api/articles/drafts.test.ts` | ⚠️ W0 | ⬜ pending |
| 07-03-02 | 03 | 2 | WORK-06 | integration | `npx vitest run src/app/api/articles/publish-draft.test.ts` | ⚠️ W0 | ⬜ pending |
| 07-03-03 | 03 | 2 | ERR-01, ERR-02, ERR-03, ERR-05 | unit | `npx vitest run src/lib/validation.test.ts` | ⚠️ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/content-parser.test.ts` — stubs for WORK-01 (frontmatter extraction)
- [ ] `tests/slug-generator.test.ts` — stubs for WORK-02 (slug generation, reuse from Phase 6)
- [ ] `tests/preview.test.ts` — stubs for WORK-03 (preview endpoint)
- [ ] `tests/publish.test.ts` — stubs for WORK-04 (publish endpoint)
- [ ] `tests/drafts.test.ts` — stubs for WORK-05 (draft list/manage)
- [ ] `tests/publish-draft.test.ts` — stubs for WORK-06 (publish draft)
- [ ] `tests/validation.test.ts` — stubs for ERR-01, ERR-02, ERR-03, ERR-05

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| User sees preview in Claude chat | WORK-03 | CLI interaction, not API | Manual: Send Markdown to Claude, verify preview output |
| User confirms to publish | WORK-04 | Human decision | Manual: User types "publish" in Claude |
| User discards article | WORK-04 | Human decision | Manual: User types "discard" in Claude |
| User saves as draft | WORK-05 | Human decision | Manual: User types "save as draft" in Claude |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending