/**
 * MCP Server implementation for cool-blog.
 * Provides article CRUD operations via Model Context Protocol.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server';
import { z } from 'zod';
import type { Implementation } from '@modelcontextprotocol/sdk/types.js';
import { createArticle, listArticles, getArticle, deleteArticle } from './db.js';

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

// Tool handlers - connected to database
async function handleCreateArticle(params: z.infer<typeof createArticleSchema>) {
  try {
    const { title, body, date, tags, excerpt, status = 'draft' } = params;

    const article = await createArticle({ title, body, date, tags, excerpt, status });

    return {
      success: true,
      message: 'Article created successfully',
      article,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Failed to create article: ${message}`,
    };
  }
}

async function handleListArticles(params: z.infer<typeof listArticlesSchema>) {
  try {
    const { status, limit = 20, offset = 0, order_by = 'date_DESC' } = params;

    const articles = await listArticles({ status, limit, offset, order_by });

    return {
      success: true,
      message: 'Articles retrieved successfully',
      articles,
      meta: {
        total: articles.length,
        limit,
        offset,
        order_by,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Failed to list articles: ${message}`,
      articles: [],
    };
  }
}

async function handleGetArticle(params: z.infer<typeof getArticleSchema>) {
  try {
    const { slug } = params;

    const article = await getArticle(slug);

    if (!article) {
      return {
        success: false,
        message: `Article not found: ${slug}`,
        article: null,
      };
    }

    return {
      success: true,
      message: 'Article retrieved successfully',
      article,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Failed to get article: ${message}`,
      article: null,
    };
  }
}

async function handleDeleteArticle(params: z.infer<typeof deleteArticleSchema>) {
  try {
    const { slug } = params;

    const deleted = await deleteArticle(slug);

    if (!deleted) {
      return {
        success: false,
        message: `Article not found or already deleted: ${slug}`,
      };
    }

    return {
      success: true,
      message: `Article "${slug}" deleted successfully`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Failed to delete article: ${message}`,
    };
  }
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