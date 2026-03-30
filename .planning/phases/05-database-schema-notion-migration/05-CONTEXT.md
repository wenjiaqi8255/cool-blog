# Phase 5: Database Schema & Notion Migration - Context

**Gathered:** 2026-03-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Articles table in Neon Postgres with one-time Notion import complete. This phase delivers:
- Database schema for `articles` table with all required columns
- Migration script to import 57 Notion articles into the database
- Existing `subscribers` table remains unchanged

This does NOT include: MCP server (Phase 6), publishing workflow (Phase 7), or Astro integration (Phase 8).

</domain>

<decisions>
## Implementation Decisions

### Articles Table Schema
- **Table name**: `articles`
- **Columns** (from REQUIREMENTS.md DATA-01):
  - `id` - serial primary key
  - `title` - text, not null
  - `slug` - text, unique, not null (URL-safe identifier)
  - `date` - timestamp, not null (publication date)
  - `tags` - text array (PostgreSQL array type)
  - `excerpt` - text (short description for article cards)
  - `body` - text, not null (full Markdown content)
  - `status` - enum: 'draft' | 'published'
  - `deleted_at` - timestamp, nullable (soft delete)
  - `created_at` - timestamp, default now()
  - `updated_at` - timestamp, default now()
- **Unique constraint**: `slug` must be unique across all articles
- **Indexes**: created for `slug`, `status`, `date` for common query patterns

### Notion Export Structure (Source Data)
- **Location**: `/Users/wenjiaqi/Downloads/BLOG-notion/`
- **CSV file**: Contains metadata (Name, Created, Tags, Tech_Tag, 状态)
- **Markdown files**: 57 articles, one `.md` file per article
- **File naming**: `{title} {notion_id}.md`
- **Frontmatter format** (inside markdown):
  ```
  # {title}
  Created: {date in Chinese format: 2024年6月30日 00:59}
  Tags: {category: Log/Thinking/Project/Resource}
  Tech_Tag: {technology: Python/React_Native/etc.}
  状态: {Published/Draft/Ready}
  ```
- **Images**: Relative paths in markdown body (e.g., `![image.png](folder/image.png)`)

### Tag Strategy
- **Merge Tags + Tech_Tag** into single `tags` array
- Both fields contain valuable categorization (not just technical)
- Examples: ['Log', 'Frontend', 'React_Native'], ['Thinking', 'ML'], ['Project']
- All tags preserved during migration

### Status Mapping
- **Published** → `published`
- **Draft** → `draft`
- **Ready** → `draft` (treat as draft, review before publishing)

### Excerpt Generation
- Auto-generate from first 150 characters of body content
- Strip Markdown formatting for clean text
- Store in `excerpt` column

### Image Handling
- **Existing images**: Copy to `public/images/articles/{slug}/` folder in Git repo
- **Markdown paths**: Rewrite to `/images/articles/{slug}/{filename}`
- **New images (Phase 6-7)**: Upload to Git repo via MCP + git commit
- Images stay as static files (not in database)

### Migration Script Design
- **Input**: Notion export folder path
- **Process**:
  1. Read CSV for metadata
  2. For each article, read corresponding `.md` file
  3. Parse frontmatter, extract title/date/tags/status
  4. Generate slug from title (URL-safe)
  5. Generate excerpt from body
  6. Rewrite image paths in body
  7. Insert into database
- **Batch processing**: Process in batches of 10 to handle rate limits gracefully
- **Error handling**: Log errors, continue processing, show summary at end
- **Output**: Summary showing:
  - Total articles processed
  - Successfully imported count
  - Failed count with reasons
  - Images copied count

### Claude's Discretion
- Exact Drizzle ORM column definitions and types
- Slug generation algorithm (transliteration for Chinese characters)
- Date parsing for Chinese format (2024年6月30日 00:59)
- Exact batch size and retry logic
- Error logging format and detail level

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` §Database — DATA-01 through DATA-06, MIGR-01 through MIGR-05, ERR-04
- `.planning/PROJECT.md` — Constraints: Neon Postgres, Drizzle ORM, database-only mode

### Existing Codebase
- `src/db/schema.ts` — Existing `subscribers` table schema (reference for Drizzle patterns)
- `src/db/index.ts` — Database connection and initialization pattern
- `src/content/articles/hello-world.md` — Example of current markdown frontmatter format

### Source Data
- `/Users/wenjiaqi/Downloads/BLOG-notion/BLOG 8e31fdff877c4d7caef28277beed03cf_all.csv` — Notion metadata export
- `/Users/wenjiaqi/Downloads/BLOG-notion/BLOG/` — 57 markdown article files

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Drizzle ORM setup**: `src/db/index.ts` has lazy initialization pattern with mock fallback
- **Schema patterns**: `src/db/schema.ts` uses `pgTable`, `serial`, `text`, `timestamp`, `boolean` from drizzle-orm/pg-core
- **API patterns**: `src/pages/api/subscribe.ts` shows Zod validation and error handling

### Established Patterns
- **Database connection**: Neon HTTP connection via `drizzle-orm/neon-http`
- **Schema export**: Single `schema.ts` file, exported and used in db init
- **Validation**: Zod for input validation in API routes

### Integration Points
- **Schema extension**: Add `articles` table to existing `schema.ts`
- **Migration script**: New script in `scripts/migrate-notion.ts` or similar
- **Images folder**: Create `public/images/articles/` structure

</code_context>

<specifics>
## Specific Ideas

- User has 57 articles in Notion export ready for migration
- Chinese characters in titles need slug-friendly transliteration
- Images already exist in export — copy to Git repo, not database
- Database-only mode means existing Markdown files in `src/content/` will not be displayed after Phase 8

</specifics>

<deferred>
## Deferred Ideas

- MCP server for article CRUD operations — Phase 6
- Publishing workflow with preview — Phase 7
- Astro database integration — Phase 8
- Article editing capability — v1.2

</deferred>

---

*Phase: 05-database-schema-notion-migration*
*Context gathered: 2026-03-31*
