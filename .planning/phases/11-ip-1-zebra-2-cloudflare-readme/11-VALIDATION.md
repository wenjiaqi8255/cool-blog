---
phase: 11
slug: ip-1-zebra-2-cloudflare-readme
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-12
---

# Phase 11 — Validation Strategy

> Per-phase validation contract for multi-region deployment with dual-platform support.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Direct task-level verification (grep, test, shell commands) |
| **Config file** | None |
| **Quick run command** | `npm run build && DEPLOY_PLATFORM=cloudflare npm run build` |
| **Full suite command** | `npm run build && DEPLOY_PLATFORM=cloudflare npm run build` |
| **Estimated runtime** | ~30 seconds |

**Note:** Wave 0 test infrastructure is not required because all verification happens via direct commands in each task's `<verify>` element.

---

## Sampling Rate

- **After every task commit:** Run `npm run build` with both `DEPLOY_PLATFORM` values
- **After every plan wave:** Deploy to test environments and verify routing
- **Before `/gsd:verify-work`:** Both platforms must build successfully
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 11-01-01 | 01 | 1 | Dual-platform builds | integration | `DEPLOY_PLATFORM=node npm run build && DEPLOY_PLATFORM=cloudflare npm run build` | ✅ | ⬜ pending |
| 11-01-02 | 01 | 1 | Secure build wrapper | security | `node build.js` with both env vars | ✅ | ⬜ pending |
| 11-02-01 | 02 | 1 | Astro config conditional | unit | `grep -q "DEPLOY_PLATFORM" astro.config.mjs` | ✅ | ⬜ pending |
| 11-02-02 | 02 | 1 | Environment variable docs | documentation | `grep -q "DEPLOY_PLATFORM" README.md` | ✅ | ⬜ pending |
| 11-03-01 | 03 | 2 | Aliyun DNS CNAME records | manual | Aliyun DNS console verification | ❌ | ⬜ pending |
| 11-03-02 | 03 | 2 | Cloudflare SaaS setup | manual | Cloudflare dashboard verification | ❌ | ⬜ pending |
| 11-04-01 | 04 | 2 | README deployment sections | documentation | `grep -A 10 "## Deployment" README.md` | ✅ | ⬜ pending |
| 11-04-02 | 04 | 2 | DEPLOYMENT.md creation | documentation | `test -f DEPLOYMENT.md` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] **Not Required** — All verification handled by task-level `<verify>` commands
- [x] Existing infrastructure covers all build verification needs
- [x] No separate test framework needed for this phase

**Rationale:** Phase 11 focuses on deployment configuration and documentation. All implementation tasks (11-01 through 11-04) have automated verification via grep/test commands. Infrastructure tasks (11-05) are appropriately manual-only (external console operations). No Wave 0 test infrastructure is required.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Aliyun DNS routing | REQ-11-03 | Requires external DNS console access | 1. Login to Aliyun DNS console 2. Verify 境内/境外/默认 CNAME records 3. Test with itdog.cn from domestic IP |
| Cloudflare SaaS custom hostname | REQ-11-03 | Requires Cloudflare dashboard access | 1. Login to Cloudflare 2. Verify custom hostname added 3. Check SSL status 4. Test with `curl -v --resolve` from international IP |
| Zeabur deployment | REQ-11-01 | Requires Zeabur platform access | 1. Push to Zeabur 2. Verify `DEPLOY_PLATFORM=node` 3. Check SSR pages render correctly |
| Cloudflare Pages deployment | REQ-11-01 | Requires Cloudflare Pages access | 1. Push to Cloudflare 2. Verify `DEPLOY_PLATFORM=cloudflare` in env vars 3. Check Workers route correctly |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or manual verification instructions
- [x] Sampling continuity: automated verification for all code changes (11-01 through 11-04, 11-06)
- [x] Manual-only tasks appropriately justified (11-05 infrastructure setup requires external console access)
- [x] Wave 0 covers all MISSING references (none required for this phase)
- [x] No watch-mode flags
- [x] Feedback latency < 60s (build commands ~30s)
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-04-12

---

*Phase: 11-ip-1-zebra-2-cloudflare-readme*
*Validation strategy created: 2026-04-12*
