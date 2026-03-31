# Requirements: Cool Blog v1.1 — Content Management & Automation

**Defined:** 2026-03-30
**Core Value:** Visual impact meets content depth — now with mobile-first publishing via Claude

## v1.1 Requirements

Requirements for content management milestone. Each maps to roadmap phases.

### Notion Migration

- [x] **MIGR-01**: User can connect to Notion export folder (CSV + Markdown files) via NOTION_EXPORT_PATH
- [x] **MIGR-02**: System parses pre-exported Markdown files and converts to article body format
- [ ] **MIGR-03**: System extracts metadata from Notion properties (Title, Date, Tags)
- [ ] **MIGR-04**: System imports all published articles into Neon Postgres
- [ ] **MIGR-05**: User receives migration summary (article count, success/errors)

### MCP Server

- [ ] **MCP-01**: Claude can create new article via `create_article(metadata, body)` tool
- [ ] **MCP-02**: Claude can list articles via `list_articles(status?)` tool
- [ ] **MCP-03**: Claude can retrieve article via `get_article(slug)` tool
- [ ] **MCP-04**: Claude can soft-delete article via `delete_article(slug)` tool (adds `deleted_at` field)
- [x] **MCP-05**: MCP server authenticates requests (OAuth2/JWT or API key)
- [x] **MCP-06**: All MCP tools validate input via Zod schemas
- [ ] **MCP-07**: MCP server uses Drizzle ORM for database operations (parameterized queries)

### Content Workflow

- [ ] **WORK-01**: Claude extracts metadata (title, date, tags, excerpt) from raw Markdown
- [ ] **WORK-02**: Claude generates URL-safe slug from title
- [ ] **WORK-03**: User sees preview of rendered article before publishing
- [ ] **WORK-04**: User confirms or rejects article before database write
- [ ] **WORK-05**: User can save article as draft (status: 'draft')
- [ ] **WORK-06**: User can publish draft article (status: 'published')
- [ ] **WORK-07**: System validates required fields (title, date, body) before publish

### Database

- [x] **DATA-01**: Database has `articles` table with: id, title, slug, date, tags, excerpt, body, status, deleted_at, created_at, updated_at
- [x] **DATA-02**: Slugs are unique across all articles
- [x] **DATA-03**: Soft deletes use `deleted_at` timestamp (NULL = visible, non-NULL = hidden)
- [x] **DATA-04**: Article status is enum: 'draft' | 'published'
- [x] **DATA-05**: Tags stored as array in database
- [x] **DATA-06**: Migration does not affect existing `subscribers` table

### Astro Integration

- [ ] **ASTRO-01**: Blog displays articles from Neon Postgres database
- [ ] **ASTRO-02**: Article list page shows all published (non-deleted) articles
- [ ] **ASTRO-03**: Individual article page renders Markdown body with syntax highlighting
- [ ] **ASTRO-04**: Existing Markdown file articles are NOT displayed (database-only mode)
- [ ] **ASTRO-05**: Article queries filter out soft-deleted articles (WHERE deleted_at IS NULL)
- [ ] **ASTRO-06**: Article queries filter by status (WHERE status = 'published' for public pages)

### Error Handling

- [ ] **ERR-01**: System returns clear error when title extraction fails
- [ ] **ERR-02**: System returns clear error when slug collision detected
- [ ] **ERR-03**: System returns clear error when database write fails
- [ ] **ERR-04**: System returns clear error when Notion API rate-limited
- [ ] **ERR-05**: System validates Markdown format before processing

## v1.2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Article Editing

- **EDIT-01**: Claude can update existing article via `update_article(slug, metadata?, body?)` tool
- **EDIT-02**: User can edit article metadata (title, tags, excerpt)
- **EDIT-03**: User can edit article body content
- **EDIT-04**: System preserves original creation date on update

### Advanced Features

- **ADV-01**: Bulk operations for article import/export
- **ADV-02**: Article version history tracking
- **ADV-03**: Scheduled publishing (set `published_at` future date)
- **ADV-04**: Full-text search across article body
- **ADV-05**: Article analytics (view count, reading time)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Real-time collaborative editing | CRDT complexity overkill for single-author blog |
| Rich text editor | Markdown-only is acceptable for developer blog |
| Admin dashboard UI | MCP server provides natural language interface |
| Image upload system | Images stay in Git repository (v1.0 approach) |
| Multi-author support | Single-author blog aligned with newsletter-only auth |
| OAuth user login | No user accounts needed - newsletter-only model |
| Article export to Git | Database-only mode selected |
| Hybrid DB + Git files | Database-only mode selected |
| Scheduled publishing | Manual publish sufficient for MVP |
| Comments system | Deferred to v2 (third-party service integration) |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DATA-01 | Phase 5 | Complete |
| DATA-02 | Phase 5 | Complete |
| DATA-03 | Phase 5 | Complete |
| DATA-04 | Phase 5 | Complete |
| DATA-05 | Phase 5 | Complete |
| DATA-06 | Phase 5 | Complete |
| MIGR-01 | Phase 5 | Complete |
| MIGR-02 | Phase 5 | Complete |
| MIGR-03 | Phase 5 | Complete |
| MIGR-04 | Phase 5 | Complete |
| MIGR-05 | Phase 5 | Complete |
| ERR-04 | Phase 5 | Pending |
| MCP-01 | Phase 6 | Pending |
| MCP-02 | Phase 6 | Pending |
| MCP-03 | Phase 6 | Pending |
| MCP-04 | Phase 6 | Pending |
| MCP-05 | Phase 6 | Complete |
| MCP-06 | Phase 6 | Complete |
| MCP-07 | Phase 6 | Pending |
| WORK-01 | Phase 7 | Pending |
| WORK-02 | Phase 7 | Pending |
| WORK-03 | Phase 7 | Pending |
| WORK-04 | Phase 7 | Pending |
| WORK-05 | Phase 7 | Pending |
| WORK-06 | Phase 7 | Pending |
| WORK-07 | Phase 7 | Pending |
| ERR-01 | Phase 7 | Pending |
| ERR-02 | Phase 7 | Pending |
| ERR-03 | Phase 7 | Pending |
| ERR-05 | Phase 7 | Pending |
| ASTRO-01 | Phase 8 | Pending |
| ASTRO-02 | Phase 8 | Pending |
| ASTRO-03 | Phase 8 | Pending |
| ASTRO-04 | Phase 8 | Pending |
| ASTRO-05 | Phase 8 | Pending |
| ASTRO-06 | Phase 8 | Pending |

**Coverage:**
- v1.1 requirements: 36 total
- Mapped to phases: 36
- Unmapped: 0 ✓

---

*Requirements defined: 2026-03-30*
*Last updated: 2026-03-30 after roadmap creation*
