---
phase: 02
slug: content-system
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest + Testing Library |
| **Config file** | vitest.config.ts (exists in project) |
| **Quick run command** | `npm run test:unit` |
| **Full suite command** | `npm run test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test:unit`
- **After every plan wave:** Run `npm run test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | ART-03 | unit | `npm run test:unit` | ✅ | ⬜ pending |
| 02-01-02 | 01 | 1 | ART-03 | unit | `npm run test:unit` | ✅ | ⬜ pending |
| 02-02-01 | 02 | 1 | ART-01 | unit | `npm run test:unit` | ✅ | ⬜ pending |
| 02-02-02 | 02 | 1 | ART-02 | unit | `npm run test:unit` | ✅ | ⬜ pending |
| 02-02-03 | 02 | 1 | ART-02 | unit | `npm run test:unit` | ✅ | ⬜ pending |
| 02-03-01 | 03 | 1 | ART-04 | unit | `npm run test:unit` | ✅ | ⬜ pending |
| 02-04-01 | 04 | 1 | ART-05 | unit | `npm run test:unit` | ✅ | ⬜ pending |
| 02-04-02 | 04 | 1 | ART-05 | unit | `npm run test:unit` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/tests/unit/articles/` — tests for ArticleCard, ArticleList, TagFilter, SearchInput components
- [ ] `src/tests/unit/content/` — tests for Content Collection schema validation
- [ ] `src/tests/setup.ts` — article-specific fixtures if needed
- [ ] `src/tests/unit/content/schema.test.ts` — Zod schema validation tests (ART-03)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Code blocks render with correct dark theme (#111) | ART-04 | Visual rendering check | Navigate to article with code → verify dark background, syntax colors, copy button visible |
| Search results feel responsive | ART-05 | UX feedback | Type query → results appear within 200ms |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
