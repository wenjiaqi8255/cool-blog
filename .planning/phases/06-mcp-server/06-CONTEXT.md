# Phase 6: MCP Server Development - Context

**Gathered:** 2026-03-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Claude can create, list, retrieve, and soft-delete articles via MCP tools. This phase delivers:
- MCP server with HTTP + SSE transport for mobile workflow
- Article CRUD tools using Drizzle ORM
- API key authentication
- Integration with Cloudflare Pages

This does NOT include: Content workflow (Phase 7), Astro integration (Phase 8), or article updates.

</domain>

<decisions>
## Implementation Decisions

### Transport
- **Protocol**: HTTP + SSE (Streamable HTTP)
- **Endpoint**: `/api/mcp`
- **Enables**: Mobile workflow (Claude on phone)
- **Fallback**: Can switch to Cloudflare Worker if Pages doesn't support SSE

### Authentication
- **Method**: API Key
- **Header**: `Authorization: Bearer <API_KEY>`
- **Key source**: Environment variable `MCP_API_KEY`
- **Validation**: Check on every MCP request

### Tool: create_article
- **Parameters** (minimal):
  - `title` (required): Article title
  - `body` (required): Full Markdown content
  - `date` (optional): Publication date, defaults to now
  - `tags` (optional): String array
  - `excerpt` (optional): Short description
  - `status` (optional): 'draft' | 'published', defaults to 'draft'
- **Slug**: Auto-generated from title (URL-safe, transliteration for Chinese)

### Tool: list_articles
- **Parameters**:
  - `status` (optional): 'draft' | 'published' filter
  - `limit` (optional): Max results, default 20
  - `offset` (optional): Pagination offset
  - `order_by` (optional): 'date_DESC' | 'date_ASC', default date_DESC
- **Returns**: Array of articles with metadata

### Tool: get_article
- **Parameters**:
  - `slug` (required): URL-safe identifier
- **Returns**: Full article including body

### Tool: delete_article
- **Behavior**: Soft delete (sets `deleted_at` timestamp)
- **Reversible**: Can be restored (not in Phase 6, deferred to v1.2)
- **Audit**: Preserves data for audit trail (from Phase 5)

### Deployment
- **Primary**: Cloudflare Pages Functions
- **Endpoint**: `/api/mcp`
- **Test first**: If SSE doesn't work on Pages, switch to Cloudflare Worker
- **No separate service**: Uses existing Cloudflare Pages deployment

### Error Handling
- Return clear error messages for failures (from ERR requirements)
- Validate inputs via Zod schemas (MCP-06)
- Handle slug collisions gracefully

### Claude's Discretion
- Exact slug generation algorithm (transliteration for Chinese characters)
- Zod schema field validation rules
- Pagination default values
- Error message formatting

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` §MCP Server — MCP-01 through MCP-07
- `.planning/PROJECT.md` — Constraints: Neon Postgres, Drizzle ORM, mobile-first workflow
- `.planning/STATE.md` — Research flags about HTTP transport for Claude mobile

### Existing Code
- `src/db/schema.ts` — Articles table schema with Drizzle ORM
- `src/db/index.ts` — Database connection pattern
- `src/pages/api/subscribe.ts` — API route pattern with Zod validation

### Phase 5 Context
- `.planning/phases/05-database-schema-notion-migration/05-CONTEXT.md` — Articles schema details

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Drizzle ORM**: Already set up in `src/db/` with schema defined
- **Zod validation**: Used in API routes like `src/pages/api/subscribe.ts`
- **API route pattern**: Follow existing pattern in `src/pages/api/`

### Established Patterns
- **Database**: Neon HTTP connection via `drizzle-orm/neon-http`
- **Lazy init**: `src/db/index.ts` has proxy pattern for lazy initialization
- **Error handling**: Return `{ success: boolean, data?: T, error?: string }`

### Integration Points
- **New file**: `src/pages/api/mcp.ts` for MCP server
- **Environment**: Add `MCP_API_KEY` to environment variables
- **Schema**: Reuse `src/db/schema.ts` articles table

</code_context>

<specifics>
## Specific Ideas

- User wants mobile workflow — ability to publish from phone via Claude
- Cloudflare Pages deployment — uncertain if SSE works, prepared to switch to Worker
- Chinese characters in titles — need transliteration for slug generation
- Soft delete preserves audit trail — decided in Phase 5

</specifics>

<deferred>
## Deferred Ideas

- Article updates (edit_article) — v1.2
- OAuth2 for Claude mobile — future when API key not supported
- Scheduled publishing — manual publish sufficient for MVP
- Hard delete option — not needed for single-author blog
- Article restore — deferred to v1.2

</deferred>

---

*Phase: 06-mcp-server*
*Context gathered: 2026-03-31*
