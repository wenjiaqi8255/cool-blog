---
phase: 8
slug: astro-integration
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-31
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/tests/unit/articles/` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~30 seconds |

**Note:** Phase 8 primarily involves Astro components and API pages. Testing is mainly integration/manual verification. Unit tests for `src/lib/articles.ts` (database queries) can be added.

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/tests/unit/` (quick)
- **After every plan wave:** Run `npx vitest run` (full)
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 08-01-01 | 01 | 1 | ASTRO-01, ASTRO-05, ASTRO-06 | integration | Manual: test query functions | N/A | ⬜ pending |
| 08-01-02 | 01 | 1 | ASTRO-01, ASTRO-02 | component | Manual: verify ArticleCard renders | N/A | ⬜ pending |
| 08-02-01 | 02 | 2 | ASTRO-02 | page | Manual: verify /articles loads | N/A | ⬜ pending |
| 08-02-02 | 02 | 2 | ASTRO-03, ASTRO-04 | page | Manual: verify article detail renders | N/A | ⬜ pending |
| 08-02-03 | 02 | 2 | ASTRO-01 | page | Manual: verify 404 page | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] Existing test infrastructure covers all phase requirements
- [x] Vitest configured (`vitest.config.ts`)
- [x] `src/tests/unit/` directory exists with existing tests

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Article list page renders articles from database | ASTRO-01, ASTRO-02 | Astro pages require server-side rendering | Run `npm run dev`, visit `/articles`, verify articles appear |
| Article detail page renders Markdown with syntax highlighting | ASTRO-03 | Requires Shiki rendering | Visit `/articles/[slug]`, verify code blocks highlighted |
| 404 page displays for non-existent articles | ASTRO-01 | Manual verification | Visit `/articles/non-existent-slug`, verify 404 page |
| Database-only mode (no content collection fallback) | ASTRO-04 | Legacy code removal verification | Verify `/articles` only shows DB articles, not Markdown files |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-03-31