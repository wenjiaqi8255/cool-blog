# Roadmap: Cool Blog — Bento Grid Portfolio

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (shipped 2026-03-30)
- ✅ **v1.1 Content Management & Automation** — Phases 5-8 complete (2026-03-31)
- 🔄 **v1.2 UI/UX Polish and Content Management** — Phase 9 in progress

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

<details>
<summary>✅ v1.0 MVP (Phases 1-4) - SHIPPED 2026-03-30</summary>

### Phase 1: Foundation & Bento Grid
**Goal**: Project scaffolding with responsive Bento Grid layout
**Plans**: 3 plans (complete)

Plans:
- [x] 01-01: Astro project setup with Tailwind CSS v4
- [x] 01-02: Bento Grid layout with light/dark card variants
- [x] 01-03: Tab navigation between Portfolio and Articles

### Phase 2: Content System
**Goal**: Markdown-based article system with syntax highlighting
**Plans**: 2 plans (complete)

Plans:
- [x] 02-01: Article content collections with Shiki highlighting
- [x] 02-02: Article list page with search/filter functionality

### Phase 3: Newsletter & Backend
**Goal**: Email subscription stored in Neon Postgres
**Plans**: 3 plans (complete)

Plans:
- [x] 03-01: Neon Postgres database with Drizzle ORM
- [x] 03-02: Newsletter subscription API endpoint
- [x] 03-03: Resend email confirmation integration

### Phase 4: SEO & Launch
**Goal**: Search engine optimization and Cloudflare deployment
**Plans**: 2 plans (complete)

Plans:
- [x] 04-01: Open Graph images, RSS feed, sitemap.xml
- [x] 04-02: Cloudflare Pages deployment with custom domain

</details>

### ✅ v1.1 Content Management & Automation (Phase 5-6 Complete)

**Milestone Goal:** Streamline blog content workflow with automated publishing via MCP server and one-time Notion migration

- [x] **Phase 5: Database Schema & Notion Migration** - Articles table foundation and one-time content import
- [x] **Phase 6: MCP Server Development** - Claude-accessible article management tools (COMPLETE)
- [x] **Phase 7: Content Workflow** - Metadata extraction, preview, and publishing workflow (completed 2026-03-31)
- [x] **Phase 8: Astro Integration** - Database-driven article rendering (completed 2026-03-31)

## Phase Details

### Phase 5: Database Schema & Notion Migration
**Goal**: Articles table in Neon Postgres with one-time Notion import complete
**Depends on**: Phase 4 (v1.0 foundation)
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04, DATA-05, DATA-06, MIGR-01, MIGR-02, MIGR-03, MIGR-04, MIGR-05, ERR-04
**Success Criteria** (what must be TRUE):
  1. Database has `articles` table with all required columns (id, title, slug, date, tags, excerpt, body, status, deleted_at, created_at, updated_at)
  2. User can connect to Notion database and import all published articles
  3. Migration script produces summary showing article count and any errors
  4. Existing `subscribers` table remains unchanged
  5. System handles Notion API rate limits gracefully
**Plans**: 2 plans

Plans:
- [x] 05-01: Database schema (articles table with Drizzle ORM)
- [x] 05-02: Notion migration script with staged batches

### Phase 6: MCP Server Development
**Goal**: Claude can create, list, retrieve, and soft-delete articles via MCP tools
**Depends on**: Phase 5
**Requirements**: MCP-01, MCP-02, MCP-03, MCP-04, MCP-05, MCP-06, MCP-07
**Success Criteria** (what must be TRUE):
  1. Claude can create a new article with metadata and body via `create_article` tool
  2. Claude can list all articles (optionally filtered by status) via `list_articles` tool
  3. Claude can retrieve a specific article by slug via `get_article` tool
  4. Claude can soft-delete an article via `delete_article` tool
  5. All MCP requests require authentication and validate input via Zod schemas
**Plans**: 2 plans

Plans:
- [x] 06-01: MCP server setup with authentication
- [x] 06-02: Article CRUD tools with Drizzle ORM

### Phase 7: Content Workflow
**Goal**: User can submit Markdown, preview rendered article, and publish to database
**Depends on**: Phase 6
**Requirements**: WORK-01, WORK-02, WORK-03, WORK-04, WORK-05, WORK-06, WORK-07, ERR-01, ERR-02, ERR-03, ERR-05
**Success Criteria** (what must be TRUE):
  1. Claude extracts title, date, tags, and excerpt from raw Markdown automatically
  2. User sees a preview of the rendered article before committing
  3. User can confirm to publish or reject to discard
  4. User can save article as draft for later publishing
  5. System validates required fields and returns clear error messages for failures
**Plans**: 3 plans

Plans:
- [x] 07-01-PLAN.md — Metadata extraction and slug generation (COMPLETE)
- [x] 07-02-PLAN.md — Preview and confirm/reject workflow (COMPLETE)
- [x] 07-03-PLAN.md — Draft management and error handling (COMPLETE)

### Phase 8: Astro Integration
**Goal**: Blog displays articles from Neon Postgres with proper filtering
**Depends on**: Phase 7
**Requirements**: ASTRO-01, ASTRO-02, ASTRO-03, ASTRO-04, ASTRO-05, ASTRO-06
**Success Criteria** (what must be TRUE):
  1. Article list page shows all published, non-deleted articles from database
  2. Individual article page renders Markdown body with syntax highlighting
  3. Existing Markdown file articles are no longer displayed (database-only mode)
  4. Soft-deleted articles are excluded from all public pages
  5. Draft articles are excluded from public pages
**Plans**: 8 plans

Plans:
- [x] 08-01-PLAN.md — Database query layer and ArticleCard adaptation (COMPLETE)
- [x] 08-02-PLAN.md — Article list and detail pages with 404 handling (COMPLETE)

## Progress

**Execution Order:**
Phases execute in numeric order: 5 → 6 → 7 → 8

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation & Bento Grid | v1.0 | 3/3 | Complete | 2026-03-30 |
| 2. Content System | v1.0 | 2/2 | Complete | 2026-03-30 |
| 3. Newsletter & Backend | v1.0 | 3/3 | Complete | 2026-03-30 |
| 4. SEO & Launch | v1.0 | 2/2 | Complete | 2026-03-30 |
| 5. Database Schema & Notion Migration | v1.1 | 2/2 | Complete | 2026-03-31 |
| 6. MCP Server Development | v1.1 | 2/2 | Complete | 2026-03-31 |
| 7. Content Workflow | v1.1 | 3/3 | Complete | 2026-03-31 |
| 8. Astro Integration | v1.1 | Complete    | 2026-03-31 | 2026-03-31 |

### Phase 9: UI/UX Polish and Content Management

**Goal**: Polish UI styling, fix layout issues, implement variable-driven content management, and enhance interactions
**Depends on**: Phase 8
**Requirements**:
  - UI-01: Header with frosted glass (毛玻璃) effect
  - UI-02: Code block styling (gray background, black text)
  - UI-03: Image display in article content
  - UI-04: Tag styling with capsule shape and border
  - UI-05: Articles page margin and spacing consistency
  - UI-06: Variable-driven content management (titles, descriptions)
  - UI-07: Portfolio data sourced from Articles database
  - UI-08: Tab selection state (black background, white text)
  - UI-09: Portfolio detail modal instead of page navigation
  - UI-10: Modular Portfolio component with parameters (image, size, etc.)
  - UI-11: Photo-based card variant with parameter control
**Success Criteria** (what must be TRUE):
  1. Header displays frosted glass effect on scroll
  2. Code blocks have gray background with black text (readable)
  3. Images display correctly in article content
  4. Tags appear as capsules with borders
  5. Articles page has proper margins and consistent left alignment
  6. Page titles and descriptions are variable-driven (config file)
  7. Portfolio shows selected articles from database
  8. Selected tab clearly indicates active state (black/white)
  9. Portfolio details open in modal (no page navigation)
  10. Portfolio component is modular with configurable parameters
  11. Photo cards available as optional variant
**Plans**: 6 plans

**Wave Structure:**
- Wave 0: Test infrastructure setup
- Wave 1: UI styling (09-01, 09-02) — depends on 09-00
- Wave 2: Content management system (09-03) — depends on 09-00, 09-01, 09-02
- Wave 3: Portfolio components + interaction enhancements (09-04) — depends on 09-00, 09-01, 09-02, 09-03
- Wave 4: Homepage integration (09-05) — depends on 09-00, 09-04

Plans:
- [ ] 09-00: Test infrastructure setup (Wave 0)
- [ ] 09-01: UI styling fixes (header, code blocks, images, tags)
- [ ] 09-02: Layout and spacing improvements (margins, alignment)
- [ ] 09-03: Variable-driven content management system
- [ ] 09-04: Interaction enhancements (tabs, modal, modular portfolio) (Wave 3)
- [ ] 09-05: Photo card feature implementation

---

*Roadmap created: 2026-03-27*
*Last updated: 2026-03-31 (Phase 9 revised with test infrastructure)*
*Granularity: coarse*