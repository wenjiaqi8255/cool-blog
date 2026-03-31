/**
 * MCP Server implementation for cool-blog.
 * Provides article CRUD operations via Model Context Protocol.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server';
import { z } from 'zod';
import type { Implementation } from '@modelcontextprotocol/sdk/types.js';
import { generateSlug } from './slugify.js';

// Server info
const serverInfo: Implementation = {
  name: 'cool-blog',
  version: '1.0.0',
};

// Create MCP server instance
export const mcpServer = new McpServer(serverInfo);

// Zod schemas for tool input validation (MCP-06)
const createArticleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
  date: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  excerpt: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
});

const listArticlesSchema = z.object({
  status: z.enum(['draft', 'published']).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
  order_by: z.enum(['date_DESC', 'date_ASC']).optional(),
});

const getArticleSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
});

const deleteArticleSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
});

// Tool handlers - will be connected to database in Plan 2
// For now, these are placeholders that return informative messages
async function handleCreateArticle(params: z.infer<typeof createArticleSchema>) {
  const { title, body, date, tags, excerpt, status = 'draft' } = params;
  const slug = generateSlug(title);

  // TODO: Connect to database in Plan 2
  // const article = await createArticle({ title, slug, body, date, tags, excerpt, status });

  return {
    success: true,
    message: 'Article created (database connection pending - Plan 2)',
    article: {
      title,
      slug,
      body: body.substring(0, 100) + (body.length > 100 ? '...' : ''),
      date: date || new Date().toISOString(),
      tags: tags || [],
      excerpt: excerpt || '',
      status,
    },
  };
}

async function handleListArticles(params: z.infer<typeof listArticlesSchema>) {
  const { status, limit = 20, offset = 0, order_by = 'date_DESC' } = params;

  // TODO: Connect to database in Plan 2
  // const articles = await listArticles({ status, limit, offset, orderBy: order_by });

  return {
    success: true,
    message: 'Articles retrieved (database connection pending - Plan 2)',
    articles: [],
    meta: {
      total: 0,
      limit,
      offset,
      order_by,
    },
  };
}

async function handleGetArticle(params: z.infer<typeof getArticleSchema>) {
  const { slug } = params;

  // TODO: Connect to database in Plan 2
  // const article = await getArticleBySlug(slug);

  return {
    success: true,
    message: 'Article retrieved (database connection pending - Plan 2)',
    article: null,
  };
}

async function handleDeleteArticle(params: z.infer<typeof deleteArticleSchema>) {
  const { slug } = params;

  // TODO: Connect to database in Plan 2
  // const article = await softDeleteArticle(slug);

  return {
    success: true,
    message: `Article "${slug}" deleted (database connection pending - Plan 2)`,
  };
}

// Register all 4 tools with Zod validation schemas (MCP-01 to MCP-04, MCP-06)
mcpServer.registerTool(
  'create_article',
  {
    title: 'Create Article',
    description: 'Create a new blog article with title, body, and optional metadata',
    inputSchema: createArticleSchema,
  },
  async (params) => {
    const result = await handleCreateArticle(params);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }
);

mcpServer.registerTool(
  'list_articles',
  {
    title: 'List Articles',
    description: 'List blog articles with optional filtering, pagination, and ordering',
    inputSchema: listArticlesSchema,
  },
  async (params) => {
    const result = await handleListArticles(params);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }
);

mcpServer.registerTool(
  'get_article',
  {
    title: 'Get Article',
    description: 'Retrieve a single blog article by its slug',
    inputSchema: getArticleSchema,
  },
  async (params) => {
    const result = await handleGetArticle(params);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }
);

mcpServer.registerTool(
  'delete_article',
  {
    title: 'Delete Article',
    description: 'Soft-delete a blog article by setting its deleted_at timestamp',
    inputSchema: deleteArticleSchema,
  },
  async (params) => {
    const result = await handleDeleteArticle(params);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }
);

/**
 * Create and return the MCP server instance.
 * Used by the API endpoint to run the server with HTTP transport.
 */
export function createMcpServer() {
  return mcpServer;
}