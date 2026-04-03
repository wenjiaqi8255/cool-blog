---
phase: 4
slug: seo-launch
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-30
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — artifact verification via grep/check |
| **Config file** | N/A |
| **Quick run command** | `grep -r "og:image" src/pages/` |
| **Full suite command** | `npm run build && grep -l "og:" dist/ -r` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After plan completion:** Run full build and grep for meta tags
- **Before `/gsd:verify-work`:** Full build must produce valid outputs
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 04-01 | 1 | SEO-01 | grep | `grep -r "og:image" src/layouts/` | ✅ | ⬜ pending |
| 04-01-02 | 04-01 | 1 | SEO-01 | grep | `grep "twitter:card" src/layouts/BaseLayout.astro` | ✅ | ⬜ pending |
| 04-01-03 | 04-01 | 1 | SEO-01 | grep | `grep "og:title" src/layouts/BaseLayout.astro` | ✅ | ⬜ pending |
| 04-01-04 | 04-01 | 1 | SEO-01 | grep | `grep "og:type" src/layouts/BaseLayout.astro` | ✅ | ⬜ pending |
| 04-02-01 | 04-02 | 2 | SEO-02 | file | `test -f src/pages/rss.xml.js` | ✅ | ⬜ pending |
| 04-02-02 | 04-02 | 2 | SEO-02 | build | `grep -l "rss" dist/` | ⬜ pending |
| 04-03-01 | 04-03 | 2 | SEO-03 | config | `grep "sitemap" astro.config.mjs` | ✅ | ⬜ pending |
| 04-03-02 | 04-03 | 2 | SEO-03 | file | `test -f public/robots.txt` | ⬜ pending |
| 04-04-01 | 04-04 | 3 | SEO-01 | file | `test -f src/pages/og/[slug].png.ts` | ⬜ pending |
| 04-04-02 | 04-04 | 3 | SEO-01 | file | `test -f src/pages/og/default.png.ts` | ⬜ pending |
| 04-04-03 | 04-04 | 3 | SEO-01 | build | `grep -r "og:image" dist/` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] None — artifact verification (no test framework needed)
- [ ] Verify `npm run build` works and generates dist/ with proper files

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Open Graph preview renders correctly | SEO-01 | Visual verification | Open https://opengraph.xyz/ and paste article URL |
| Twitter Card preview renders | SEO-01 | Visual verification | Use https://cards-dev.twitter.com/validator |
| RSS feed valid XML | SEO-02 | XML validation | Visit /rss.xml and validate |
| Sitemap valid XML | SEO-03 | XML validation | Visit /sitemap-0.xml and validate |
| Robots.txt accessible | SEO-03 | HTTP check | Visit /robots.txt |

---

## Validation Sign-Off

- [ ] All tasks have verify via build/grep or Wave 0 dependencies
- [ ] Sampling continuity: build runs after each plan
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending / approved 2026-03-30