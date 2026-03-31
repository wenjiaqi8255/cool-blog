# Phase 6: MCP Server Development - Research

**Researched:** 2026-03-31
**Domain:** Model Context Protocol (MCP) server implementation with HTTP transport
**Confidence:** MEDIUM

## Summary

This phase implements an MCP server that enables Claude to manage blog articles via CRUD operations. The MCP TypeScript SDK (`@modelcontextprotocol/server`) provides the server framework with Zod-based input validation. Key decisions from Phase 5 context are locked: HTTP+Streamable transport, API key authentication, Drizzle ORM for database operations, and Cloudflare Pages deployment.

**Primary recommendation:** Use `@modelcontextprotocol/server` with `@modelcontextprotocol/node` for Streamable HTTP transport. Deploy to Cloudflare Pages Functions at `/api/mcp` and test SSE compatibility - switch to Cloudflare Worker if Pages doesn't support streaming.

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Transport**: HTTP + SSE (Streamable HTTP), endpoint `/api/mcp`
- **Authentication**: API Key via `Authorization: Bearer <API_KEY>`, env var `MCP_API_KEY`
- **Tools**: create_article, list_articles, get_article, delete_article (soft delete)
- **Deployment**: Cloudflare Pages Functions primary, Worker fallback
- **Slug**: Auto-generated from title with transliteration for Chinese

### Claude's Discretion
- Exact slug generation algorithm (transliteration for Chinese characters)
- Zod schema field validation rules
- Pagination default values
- Error message formatting

### Deferred Ideas (OUT OF SCOPE)
- Article updates (edit_article) — v1.2
- OAuth2 for Claude mobile — future when API key not supported
- Scheduled publishing — manual publish sufficient for MVP
- Hard delete option — not needed for single-author blog
- Article restore — deferred to v1.2

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| MCP-01 | Claude can create new article via `create_article(metadata, body)` tool | MCP SDK tool registration with Zod schema |
| MCP-02 | Claude can list articles via `list_articles(status?)` tool | MCP SDK tool registration with Zod schema |
| MCP-03 | Claude can retrieve article via `get_article(slug)` tool | MCP SDK tool registration with Zod schema |
| MCP-04 | Claude can soft-delete article via `delete_article(slug)` tool | MCP SDK tool + Drizzle update with deleted_at |
| MCP-05 | MCP server authenticates requests (OAuth2/JWT or API key) | API Key via Bearer token - locked decision |
| MCP-06 | All MCP tools validate input via Zod schemas | MCP SDK built-in Zod support |
| MCP-07 | MCP server uses Drizzle ORM for database operations | Existing `src/db/` setup |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@modelcontextprotocol/server` | latest (verify on install) | MCP server framework | Official SDK, handles protocol, transport, tool registration |
| `zod` | `^4.3.6` (in package.json) | Input validation | MCP SDK requirement, already in project |
| `drizzle-orm` | `^0.45.2` (in package.json) | Database operations | Already configured in project |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@modelcontextprotocol/node` | latest | Streamable HTTP transport for Node.js | For Cloudflare Pages deployment |
| `slugify` or custom | — | URL-safe slug generation | For Chinese character transliteration |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@modelcontextprotocol/server` | Build custom MCP server from protocol spec | Official SDK handles protocol complexity |
| API Key auth | OAuth2 | Locked to API Key per CONTEXT.md |

**Installation:**
```bash
npm install @modelcontextprotocol/server @modelcontextprotocol/node zod
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── pages/api/
│   └── mcp.ts              # MCP server endpoint
├── lib/
│   ├── mcp/
│   │   ├── tools.ts        # Tool definitions
│   │   └── server.ts       # MCP server setup
│   └── slugify.ts          # Slug generation utility
```

### Pattern 1: MCP Server with Streamable HTTP
**What:** MCP server using Streamable HTTP transport for mobile-compatible requests
**When to use:** When MCP server needs HTTP transport (not stdio)
**Example:**
```typescript
// Source: MCP TypeScript SDK documentation
import { McpServer } from '@modelcontextprotocol/server';
import { NodeHttpTransport } from '@modelcontextprotocol/node';
import { z } from 'zod';

const server = new McpServer({ name: 'cool-blog', version: '1.0.0' });

server.registerTool('create_article', {
  title: 'Create Article',
  description: 'Create a new blog article',
  inputSchema: z.object({
    title: z.string().min(1),
    body: z.string().min(1),
    // ... other fields
  })
}, async (params) => {
  // Tool implementation
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

// Set up HTTP transport
const transport = new NodeHttpTransport();
server.run(transport);
```

### Pattern 2: API Key Authentication Middleware
**What:** Bearer token validation on MCP requests
**When to use:** For all MCP endpoints
**Example:**
```typescript
// Check Authorization header before processing MCP request
const authHeader = request.headers.get('Authorization');
if (!authHeader?.startsWith('Bearer ')) {
  return new Response('Unauthorized', { status: 401 });
}
const token = authHeader.slice(7);
if (token !== process.env.MCP_API_KEY) {
  return new Response('Invalid API key', { status: 403 });
}
```

### Pattern 3: Slug Generation with Chinese Support
**What:** Generate URL-safe slugs with transliteration
**When to use:** Creating articles from titles
**Algorithm:** Lowercase, replace spaces with hyphens, transliterate non-ASCII characters
```typescript
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s-]/g, '') // Remove non-word chars except spaces/hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens
    .trim();
}
```

### Anti-Patterns to Avoid
- **Building custom MCP protocol**: Use official SDK - it handles message parsing, tool discovery, and response formatting
- **Storing API keys in code**: Always use environment variables (`MCP_API_KEY`)
- **Hard delete for articles**: Soft delete preserves audit trail (per Phase 5 decision)

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| MCP protocol handling | Raw WebSocket/HTTP message handling | `@modelcontextprotocol/server` | Protocol is complex; official SDK handles versioning, message formats |
| Input validation | Custom validation logic | Zod schemas | MCP SDK integrates with Zod; handles type inference |
| Database queries | Raw SQL strings | Drizzle ORM | Already in project; parameterized queries prevent injection |

## Common Pitfalls

### Pitfall 1: Cloudflare Pages SSE Compatibility
**What goes wrong:** MCP Streamable HTTP transport may not work on Cloudflare Pages Functions
**Why it happens:** Cloudflare Pages Functions have different runtime constraints than standard Node.js
**How to avoid:** Test early; be prepared to switch to Cloudflare Worker deployment
**Warning signs:** Request hangs, connection drops, streaming errors in deployment logs

### Pitfall 2: MCP SDK Version Compatibility
**What goes wrong:** SDK APIs change between versions
**Why it happens:** MCP is still evolving; breaking changes possible
**How to avoid:** Pin to specific version after initial testing; review changelog before updates
**Warning signs:** TypeScript errors, runtime errors about missing methods

### Pitfall 3: API Key Not Set in Production
**What goes wrong:** MCP server rejects all requests in production
**Why it happens:** Environment variable `MCP_API_KEY` not configured in Cloudflare Pages
**How to avoid:** Add to Cloudflare Pages environment variables; validate at startup
**Warning signs:** All MCP tools return authentication errors

### Pitfall 4: Slug Collision
**What goes wrong:** Duplicate slugs cause database constraint violation
**Why it happens:** Two articles with similar titles generate identical slugs
**How to avoid:** Add suffix to slug on collision (e.g., `-1`, `-2`); handle unique constraint error gracefully
**Warning signs:** Database error on create_article with message about duplicate key

## Code Examples

### Tool Definition with Zod Schema
```typescript
// Source: MCP TypeScript SDK docs
import { z } from 'zod';

const createArticleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
  date: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  excerpt: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
});
```

### Drizzle ORM Query for List Articles
```typescript
// Source: Project existing code pattern
import { eq, desc, isNull } from 'drizzle-orm';
import { articles, ArticleStatus } from '../db/schema';

async function listArticles(options: {
  status?: 'draft' | 'published';
  limit?: number;
  offset?: number;
  orderBy?: 'date_DESC' | 'date_ASC';
}) {
  const { status, limit = 20, offset = 0, orderBy = 'date_DESC' } = options;

  return db.query.articles.findMany({
    where: and(
      isNull(articles.deleted_at), // Exclude soft-deleted
      status ? eq(articles.status, status) : undefined
    ),
    orderBy: orderBy === 'date_ASC'
      ? [asc(articles.date)]
      : [desc(articles.date)],
    limit,
    offset,
  });
}
```

### Soft Delete Implementation
```typescript
// Source: Project schema and Phase 5 decisions
import { eq } from 'drizzle-orm';
import { articles } from '../db/schema';

async function softDeleteArticle(slug: string) {
  const result = await db
    .update(articles)
    .set({ deleted_at: new Date() })
    .where(eq(articles.slug, slug))
    .returning();

  return result[0];
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| stdio-only MCP | Streamable HTTP (SSE-like) | 2024-2025 | Enables mobile/clients without local process |
| Custom JSON-RPC | Official MCP SDK | 2024 | Standardized protocol handling |
| Basic auth | OAuth2/API Key | Ongoing | SDK provides auth helpers |

**Deprecated/outdated:**
- **stdio transport**: Not suitable for remote/mobile deployment
- **Custom MCP implementations**: Official SDK is now stable enough

## Open Questions

1. **Cloudflare Pages SSE Support**
   - What we know: Cloudflare Workers support Streams API for streaming responses; unclear if Pages Functions support the same streaming patterns MCP Streamable HTTP requires
   - What's unclear: Whether `@modelcontextprotocol/node` works on Cloudflare Pages runtime
   - Recommendation: Test early in implementation; plan to switch to Worker if needed

2. **Slug Generation for Chinese Characters**
   - What we know: Need to transliterate Chinese to URL-safe ASCII
   - What's unclear: Which algorithm produces best results (simpler slug vs comprehensive transliteration)
   - Recommendation: Start with simple ASCII conversion; refine based on actual article titles

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest (in package.json `^3.0.0`) |
| Config file | vitest.config.ts (if exists) |
| Quick run command | `npm run test:unit` |
| Full suite command | `npm run test` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| MCP-01 | create_article tool works | unit/integration | `npm run test:unit -- --run mcp` | Need to create |
| MCP-02 | list_articles tool works | unit/integration | `npm run test:unit -- --run mcp` | Need to create |
| MCP-03 | get_article tool works | unit/integration | `npm run test:unit -- --run mcp` | Need to create |
| MCP-04 | delete_article soft-deletes | unit/integration | `npm run test:unit -- --run mcp` | Need to create |
| MCP-05 | API key auth rejects invalid | unit | `npm run test:unit -- --run auth` | Need to create |
| MCP-06 | Zod validation rejects invalid input | unit | `npm run test:unit -- --run validation` | Need to create |
| MCP-07 | Database operations use Drizzle | integration | `npm run test:unit -- --run db` | Need to create |

### Sampling Rate
- **Per task commit:** `npm run test:unit`
- **Per wave merge:** `npm run test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/mcp/` - MCP tool tests
- [ ] `tests/mcp/tools.test.ts` - Tool registration and execution tests
- [ ] `tests/mcp/auth.test.ts` - Authentication tests
- [ ] `tests/mcp/validation.test.ts` - Zod schema validation tests

## Sources

### Primary (HIGH confidence)
- [MCP TypeScript SDK GitHub](https://github.com/modelcontextprotocol/typescript-sdk) - Official SDK, tool registration API, transport options
- [MCP Server Concepts](https://modelcontextprotocol.io/docs/learn/server-concepts) - Tools, resources, prompts architecture
- [MCP Build Server Tutorial](https://modelcontextprotocol.io/docs/develop/build-server) - Getting started guide

### Secondary (MEDIUM confidence)
- [Cloudflare Workers Streams API](https://developers.cloudflare.com/workers/runtime-apis/streams/) - Streaming support in Workers/Pages
- [Project existing code](src/db/schema.ts, src/db/index.ts) - Drizzle ORM setup, article schema

### Tertiary (LOW confidence)
- [WebSearch: MCP SSE Cloudflare Pages] - Not verified; needs implementation testing

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - MCP SDK is official and well-documented
- Architecture: MEDIUM - Cloudflare Pages SSE compatibility uncertain
- Pitfalls: MEDIUM - Cloudflare deployment may need Worker fallback

**Research date:** 2026-03-31
**Valid until:** 2026-05-01 (30 days for stable SDK)
