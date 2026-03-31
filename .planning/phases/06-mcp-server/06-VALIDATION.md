---
phase: 6
slug: mcp-server
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-31
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (^3.0.0 in package.json) |
| **Config file** | vitest.config.ts |
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
| 6-01-01 | 01 | 1 | MCP-01 | unit | `npm run test:unit` | ⬜ W0 | ⬜ pending |
| 6-01-02 | 01 | 1 | MCP-02 | unit | `npm run test:unit` | ⬜ W0 | ⬜ pending |
| 6-01-03 | 01 | 1 | MCP-03 | unit | `npm run test:unit` | ⬜ W0 | ⬜ pending |
| 6-02-01 | 02 | 1 | MCP-04 | unit | `npm run test:unit` | ⬜ W0 | ⬜ pending |
| 6-02-02 | 02 | 1 | MCP-05 | unit | `npm run test:unit` | ⬜ W0 | ⬜ pending |
| 6-02-03 | 02 | 1 | MCP-06 | unit | `npm run test:unit` | ⬜ W0 | ⬜ pending |
| 6-02-04 | 02 | 1 | MCP-07 | integration | `npm run test` | ⬜ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/mcp/` — MCP tool tests directory
- [ ] `tests/mcp/tools.test.ts` — Tool registration and execution tests
- [ ] `tests/mcp/auth.test.ts` — Authentication tests
- [ ] `tests/mcp/validation.test.ts` — Zod schema validation tests

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| SSE transport works on Cloudflare Pages | MCP-01 | Requires deployment to verify | Deploy to preview, test with MCP inspector |
| Chinese character slug generation | MCP-01 | Edge case requiring sample data | Test with titles containing Chinese chars |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
