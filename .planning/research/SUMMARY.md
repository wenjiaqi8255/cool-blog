# Project Research Summary

**Project:** Cool Blog (Technical Blog/Portfolio with Bento Grid Layout)
**Domain:** Developer-centric blog content management with MCP-powered automation
**Researched:** 2026-03-27 (v1.0), 2026-03-30 (v1.1 additions)
**Confidence:** HIGH

---

## Executive Summary

This is a production Astro blog (v1.0 already shipped) adding MCP-powered content management for a mobile-first publishing workflow. The core innovation is enabling developers to write articles on mobile via Claude, have AI extract metadata automatically, preview the rendered content, and publish directly to Neon Postgres - no Git, no desktop dependency.

**Recommended approach:** Extend the existing Astro 6.1.1 + React 19 + Neon Postgres + Cloudflare Pages stack with three new packages: `@notionhq/client` for one-time migration, `gray-matter` for frontmatter parsing, and `@modelcontextprotocol/sdk` for the MCP server. Use Drizzle ORM (already installed) for database operations. The MCP server runs as a separate Node.js process, authenticating via OAuth2/JWT, and stores articles in a new `articles` table alongside the existing `subscribers` table.

**Key risks:** MCP server security (36% of AI agent skills have flaws per Snyk), XSS via AI-generated markdown (45% susceptible per OWASP), and Notion migration data loss. Mitigation requires: mandatory authentication, content sanitization with DOMPurify, parameterized queries via Drizzle, staged migration batches, and rollback planning.

---

## Key Findings

### Recommended Stack

**v1.0 (Shipped & Validated):** Astro 6.1.1 + React 19 + TypeScript + Tailwind CSS 4.2 + Neon Postgres + Drizzle ORM, deployed to Cloudflare Pages.

**v1.1 Additions (Content Management):**
- `@notionhq/client` (2.2.x) - Official Notion API client for one-time migration
- `gray-matter` (4.0.x) - Battle-tested YAML frontmatter parser (2M+ weekly downloads)
- `@modelcontextprotocol/sdk` (1.0.x) - Official MCP TypeScript SDK with Zod integration

**Core technologies:**
- **Astro 6.1.1:** Static site generator with SSR capability - Best-in-class content collections, island architecture, excellent Cloudflare support
- **React 19:** Interactive components - Required for client-side interactivity (search, newsletter form)
- **Neon Postgres:** Serverless database - Edge-compatible, generous free tier, pooled connections essential
- **Drizzle ORM 0.45.x:** TypeScript ORM - Edge-native, tree-shakeable, parameterized queries prevent SQL injection
- **Tailwind CSS 4.2:** Styling - Official Bento Grid components, new Vite plugin architecture

### Expected Features

**Must have (table stakes):**
- Database schema for articles - Must store title, date, tags, excerpt, body, slug, status
- MCP server with article creation tool - Single tool: `create_article(metadata, body)` writes to Neon
- Metadata extraction via Claude - Prompt engineering to extract structured metadata from raw Markdown
- Preview generation - Render article with extracted metadata using existing article components
- Confirm/reject workflow - User reviews preview, confirms to publish or rejects to edit
- Error handling - Clear messages for missing fields, invalid Markdown, database errors

**Should have (competitive):**
- AI-assisted metadata extraction - Claude extracts title, date, tags, excerpt from raw Markdown automatically
- MCP server integration - Enables publishing from any Claude instance (mobile, desktop, API)
- Notion one-time migration - Import existing content from Notion database in single operation
- Preview + confirm workflow - Show extracted metadata and rendered preview before committing
- Zero-SQL content management - No direct database manipulation required

**Defer (v2+):**
- Article update workflow - Edit existing articles via same workflow
- Draft management - Save drafts to database, list drafts, publish draft
- Scheduled publishing - Set `published_at` date for future release
- Image upload to CDN - Integrate with Cloudinary for image management

### Architecture Approach

The architecture follows Astro's islands pattern: static content renders as zero-JS HTML, while only interactive elements (newsletter form, search/filter) hydrate as React islands. The v1.1 MCP server runs as a separate Node.js process, authenticating via OAuth2/JWT, and stores articles in a new `articles` table.

**Major components:**
1. **MCP Server** - Accepts article content from Claude, validates via Zod, stores in Neon via Drizzle
2. **Articles Table** - New Postgres table with slug, title, content, tags, draft status, timestamps
3. **Notion Migration Script** - One-time import using `@notionhq/client`, runs locally, outputs to database
4. **Preview Workflow** - Reuses existing ArticleContent component for rendering preview

### Critical Pitfalls

1. **MCP Server SQL Injection** - LLMs generate unpredictable input. Prevention: Never trust LLM input, use Drizzle parameterized queries, Zod schema validation, principle of least privilege.

2. **XSS via AI-Generated Markdown** - 45% of AI-generated content susceptible to XSS (OWASP LLM02). Prevention: Sanitize all markdown with DOMPurify, disable inline HTML/SVG, implement CSP headers.

3. **Notion Migration Data Loss** - Rate limiting causes incomplete migration, synced blocks create duplicates. Prevention: Pre-migration audit, staged batches of 10-20 articles with delays, checksum validation.

4. **Metadata Extraction Failure** - YAML syntax errors cause parsing failures. Prevention: Explicit prompt structure, validation step before database insert, fallback to manual input.

5. **MCP Authentication Failure** - 492 MCP servers found with zero authentication (2026 research). Prevention: Never deploy without OAuth2/JWT auth, all secrets via environment variables.

---

## Implications for Roadmap

Based on research, suggested phase structure for v1.1:

### Phase 1: Database Schema & Notion Migration
**Rationale:** Foundation must exist before MCP server or content workflow. Migration is independent and can run early.
**Delivers:** Articles table in Neon Postgres, one-time Notion import script
**Addresses:** Database schema, Notion migration data loss (with staged batches, backup)
**Avoids:** Breaking v1.0 newsletter functionality (additive-only changes)

### Phase 2: MCP Server Development & Security
**Rationale:** Core infrastructure for mobile publishing workflow. Security must be built in from day 1.
**Delivers:** MCP server with `create_article` tool, OAuth2/JWT authentication, Zod validation, rate limiting
**Uses:** `@modelcontextprotocol/sdk`, existing Drizzle ORM, existing Neon connection
**Implements:** Parameterized queries, input validation, audit logging
**Avoids:** SQL injection, authentication failure, shadow MCP servers

### Phase 3: Content Workflow & Metadata Extraction
**Rationale:** User-facing workflow depends on MCP server being functional.
**Delivers:** Metadata extraction prompts, preview generation (reuse ArticleContent component), confirm/reject UI, content sanitization
**Uses:** `gray-matter` for frontmatter parsing, existing article rendering components
**Implements:** XSS prevention via DOMPurify, CSP headers
**Avoids:** Metadata extraction failure, XSS via AI-generated content

### Phase 4: Mobile Workflow & Integration Testing
**Rationale:** End-to-end mobile publishing depends on all previous phases.
**Delivers:** Idempotency keys, retry strategies, full regression test of v1.0 features, mobile workflow validation
**Avoids:** Network interruption, partial submissions, breaking existing newsletter

### Phase Ordering Rationale

- **Database first** because MCP server and content workflow both require the articles table schema
- **MCP server second** because it provides the core infrastructure for mobile publishing
- **Content workflow third** because it depends on MCP server being functional
- **Mobile workflow last** because it validates the complete end-to-end flow

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2:** MCP HTTP transport specifics - official SDK docs focus on stdio; HTTP transport for Claude mobile requires additional research
- **Phase 3:** Claude mobile OAuth2 flow - how Claude mobile app authenticates with custom MCP servers

Phases with standard patterns (skip research-phase):
- **Phase 1:** Well-documented Drizzle migrations and Notion API
- **Phase 4:** Standard idempotency and retry patterns

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All v1.0 packages shipped and validated; v1.1 additions are official SDKs with comprehensive docs |
| Features | HIGH | Based on official docs, established tools (gray-matter 2M+ downloads), industry CMS patterns |
| Architecture | HIGH | Official Astro/Neon/Cloudflare docs, MCP SDK reference implementations available |
| Pitfalls | MEDIUM | WebSearch-based research, cross-verified with multiple sources (OWASP, Snyk, CVE databases) |

**Overall confidence:** HIGH

### Gaps to Address

- **MCP HTTP transport specifics:** Official SDK docs focus on stdio; HTTP transport for Claude mobile requires additional research during Phase 2 implementation
- **Claude mobile OAuth2 flow:** How Claude mobile app authenticates with custom MCP servers - may need Claude Desktop documentation review
- **Astro live collections with database:** Mixed collection types (file-based + database) has known issues (GitHub #14088) - choose single approach during Phase 3

---

## Sources

### Primary (HIGH confidence)
- [Astro Documentation](https://docs.astro.build) - Core framework, content collections, Cloudflare adapter
- [Neon Documentation](https://neon.com/docs) - Serverless driver, connection pooling, cold start handling
- [Drizzle ORM Docs](https://orm.drizzle.team/docs) - Neon integration patterns
- [Model Context Protocol](https://modelcontextprotocol.io/) - Official MCP documentation, SDK reference
- [Notion JavaScript SDK](https://github.com/makenotion/notion-sdk-js) - Official GitHub repository
- [gray-matter (NPM)](https://www.npmjs.com/package/gray-matter) - 2M+ weekly downloads

### Secondary (MEDIUM confidence)
- [OWASP MCP Top 10](https://genai.owasp.org/) - Authentication, tool poisoning risks
- [OWASP LLM02: Insecure Output Handling](https://genai.owasp.org/llmrisk2023-24/llm02-insecure-output-handling/) - XSS statistics
- [Snyk Research](https://snyk.io) - 36% AI agent skills contain flaws
- [Xebia: MCP Development Best Practices](https://tech.xebia.ms/2025-07-28-MCP-Development-Best-Practices.html) - Security patterns
- [Medium: Astro Build Optimization](https://medium.com/@mohdkhan.mk99/how-we-cut-astro-build-time-from-30-minutes-to-5-minutes-83-faster-115349727060) - Build time strategies

- [Notion Help: Common Errors](https://www.notion.com/help/notion-error-messages) - Rate limiting errors
- [Whalesync Blog: Export Notion to Markdown](https://www.whalesync.com/blog/how-to-export-notion-pages-to-markdown) - Migration tutorial

- [devmio: Idempotent API Design](https://devm.io/php/making-apis-idempotent-by-design) - Retry strategies

### Tertiary (LOW confidence)
- [Reddit: Notion Duplicate Pages](https://www.reddit.com/r/Notion/comments/17r906h/) - Synced blocks issue (unverified)

---
*Research completed: 2026-03-30*
*Ready for roadmap: yes*
