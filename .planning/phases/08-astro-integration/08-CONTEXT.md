# Phase 8: Astro Integration - Context

**Gathered:** 2026-03-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Blog displays articles from Neon Postgres with proper filtering. This phase delivers:
- Article list page shows all published, non-deleted articles from database
- Individual article page renders Markdown body with syntax highlighting
- Soft-deleted and draft articles excluded from public pages
- Existing Markdown file articles NOT displayed (database-only mode)

This does NOT include: Notion migration (Phase 5), MCP server (Phase 6), or content workflow (Phase 7).

</domain>

<decisions>
## Implementation Decisions

### Data Fetching
- **Strategy**: SSR per request — fetch on each request
- **Rationale**: Always fresh, handles edits immediately, good for blogs with frequent updates
- **Query filter**: `WHERE status = 'published' AND deleted_at IS NULL`
- **Implementation**: Server-side query with Drizzle ORM in Astro pages

### URL Structure
- **Pattern**: `/articles/[slug]` — at root of blog section
- **Article list**: `/articles` — main articles page
- **Individual**: `/articles/my-article-name`

### Markdown Rendering
- **Library**: Astro's built-in markdown (unified API)
- **Shiki**: Already configured for syntax highlighting
- **Features**: GitHub Flavored Markdown support, frontmatter parsing
- **Configuration**: Reuse existing Astro config patterns

### Card Metadata
- **Fields per card**: Title, date, excerpt, tags
- **Date format**: Localized date string (e.g., "March 31, 2026")
- **Excerpt**: First 150 characters from database field
- **Tags**: Display as pills/tags below excerpt

### Database Query
- **List query**: `SELECT * FROM articles WHERE status = 'published' AND deleted_at IS NULL ORDER BY date DESC`
- **Get query**: `SELECT * FROM articles WHERE slug = $1 AND status = 'published' AND deleted_at IS NULL`
- **Error handling**: 404 page if article not found or filtered out

### Routing
- **Pages**:
  - `/articles` — article list (server-rendered)
  - `/articles/[slug]` — individual article (server-rendered)

### Filtering
- **Status filter**: Always filter for `status = 'published'`
- **Soft delete filter**: Always filter for `deleted_at IS NULL`
- **No additional filters**: Search/filter deferred to future phase

### Transition
- **Database-only mode**: Existing Markdown files in `src/content/` will NOT be displayed
- **Astro config**: Remove or disable content collections for articles

### Claude's Discretion
- Exact database query implementation (use Drizzle patterns from Phase 5-6)
- Date formatting library (date-fns, native Intl, or custom)
- Tag display component design
- Excerpt truncation logic
- 404 page styling

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` §Astro Integration — ASTRO-01 through ASTRO-06
- `.planning/PROJECT.md` — v1.1 milestone goals, database-only mode

### Prior Context
- `.planning/phases/05-database-schema-notion-migration/05-CONTEXT.md` — Database schema, Drizzle ORM patterns
- `.planning/phases/06-mcp-server/06-CONTEXT.md` — MCP server, article tools
- `.planning/phases/07-content-workflow/07-CONTEXT.md` — Publishing workflow

### Existing Code
- `src/db/schema.ts` — Articles table schema (from Phase 5)
- `src/db/index.ts` — Database connection (Neon HTTP)
- `src/lib/content/parser.ts` — Existing markdown parsing
- `src/pages/` — Existing page routes

### Database Decisions (from Phase 5)
- Soft delete via `deleted_at` timestamp (NULL = visible)
- Status enum: 'draft' | 'published'
- Tags stored as text array

</canonical_refs>

<codebase_context>
## Existing Code Insights

### Reusable Assets
- **Drizzle ORM**: Already configured in `src/db/`
- **Database schema**: Articles table exists from Phase 5
- **MCP tools**: `list_articles`, `get_article` patterns available
- **Shiki**: Already used for syntax highlighting in v1.0

### Established Patterns
- **API response**: `{ success: boolean, data?: T, error?: string }`
- **Database**: Neon HTTP connection via `drizzle-orm/neon-http`
- **SSR**: Currently used for subscribe API

### Integration Points
- **Database query**: New queries in Astro pages (`src/pages/articles/`)
- **Card component**: Reuse or extend existing card components
- **Article rendering**: New page route `/articles/[slug]`

</codebase_context>

<specifics>
## Specific Ideas

- SSR per request chosen for freshness - edits appear immediately
- URL pattern `/articles/[slug]` maintains blog section clarity
- Database-only mode - old Markdown files in `src/content/` won't display
- Tags displayed as clickable filter (future phase)

</specifics>

<deferred>
## Deferred Ideas

- Search functionality — deferred to v1.2
- Tag filtering — deferred to v1.2
- Article analytics (view count) — deferred to v1.2
- Article updates/editing — v1.2
- Scheduled publishing — v1.2

</deferred>

---

*Phase: 08-astro-integration*
*Context gathered: 2026-03-31*