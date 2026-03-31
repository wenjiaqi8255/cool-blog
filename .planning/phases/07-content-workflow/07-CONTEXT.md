# Phase 7: Content Workflow - Context

**Gathered:** 2026-03-31
**Status:** Ready for planning

<domain>
## Phase Boundary

User submits Markdown → Claude extracts metadata → User previews → User confirms to publish or discards. This phase delivers:
- Metadata extraction from Markdown frontmatter
- Preview display in Claude chat (Markdown text)
- Confirm/discard workflow with draft option
- Validation with clear error messages

This does NOT include: Astro integration (Phase 8), article updates, or rich media uploads.

</domain>

<decisions>
## Implementation Decisions

### Metadata Extraction
- **Method**: Frontmatter extraction (YAML block at top of Markdown)
- **Fields**: Minimal set — title, date, tags, excerpt
- **Missing frontmatter**: Fail and ask user to fix before proceeding

### Preview Workflow
- **Delivery**: Show in Claude chat as Markdown text
- **Content**: Full frontmatter + full body (complete view)
- **Confirmation**: Explicit confirm ("publish" or "confirm") required from user

### Publishing Flow
- **On confirm**: Publish directly (status: published) via MCP create_article
- **On reject**: Prompt user if they want to save as draft before discarding

### Validation Rules
- **title**: Required, non-empty
- **body**: Required, > 100 characters
- **date**: Valid date format (ISO or YYYY-MM-DD)
- **Tags**: Optional, string array if provided
- **Excerpt**: Optional

### Claude's Discretion
- Exact frontmatter parsing library (gray-matter, remark-frontmatter, or custom regex)
- Slug generation algorithm (inherited from Phase 6)
- Draft listing and management workflow
- Error message formatting

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` §Content Workflow — WORK-01 through WORK-07, ERR requirements
- `.planning/PROJECT.md` — v1.1 milestone goals: mobile workflow, MCP server

### Existing Code
- `src/db/schema.ts` — Articles table schema with Drizzle ORM (from Phase 5)
- Phase 6 MCP tools: `create_article`, `list_articles`, `get_article` (from Phase 6)

### Phase 6 Context
- `.planning/phases/06-mcp-server/06-CONTEXT.md` — MCP tool definitions, slug generation

</canonical_refs>

<codebase_context>
## Existing Code Insights

### Reusable Assets
- **Drizzle ORM**: Already set up in `src/db/`
- **MCP Server**: Phase 6 implemented create_article tool
- **Zod validation**: Used in existing API routes

### Integration Points
- **MCP tool**: Reuse `create_article` from Phase 6 (status: published parameter)
- **Article listing**: Can use `list_articles` to show existing drafts

### Established Patterns
- **API response**: `{ success: boolean, data?: T, error?: string }`
- **Database**: Neon HTTP connection

</codebase_context>

<specifics>
## Specific Ideas

- Preview should show Markdown text (not JSON) — user wants to verify in Claude chat
- Full content preview (not summary) — complete view before publishing
- Mobile workflow: user writes on phone, sends to Claude, Claude processes

</specifics>

<deferred>
## Deferred Ideas

- Article updates (edit existing articles) — v1.2
- Rich media uploads during publish — handled via Git, not this workflow
- Scheduled publishing — manual publish sufficient for MVP

</deferred>

---

*Phase: 07-content-workflow*
*Context gathered: 2026-03-31*
