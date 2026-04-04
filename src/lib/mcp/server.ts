/**
 * MCP Server implementation for cool-blog.
 * Provides article CRUD operations via Model Context Protocol.
 * Uses simple JSON-RPC over HTTP without the complex transport layer.
 */

import type { Implementation } from '@modelcontextprotocol/sdk/types.js';
import { createArticle, listArticles, getArticle, deleteArticle, updateArticleStatus } from './db.js';

// Server info
const serverInfo: Implementation = {
  name: 'cool-blog',
  version: '1.0.0',
};

// Tool handlers
async function handleCreateArticle(params: {
  title: string;
  body: string;
  date?: string;
  tags?: string[];
  excerpt?: string;
  image?: string;
  status?: 'draft' | 'published';
}) {
  try {
    const { title, body, date, tags, excerpt, image, status = 'draft' } = params;
    const article = await createArticle({ title, body, date, tags, excerpt, image, status });
    return { success: true, message: 'Article created successfully', article };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, message: `Failed to create article: ${message}` };
  }
}

async function handleListArticles(params: {
  status?: 'draft' | 'published';
  limit?: number;
  offset?: number;
  order_by?: 'date_DESC' | 'date_ASC';
}) {
  try {
    const { status, limit = 20, offset = 0, order_by = 'date_DESC' } = params;
    const articles = await listArticles({ status, limit, offset, order_by });
    return { success: true, message: 'Articles retrieved successfully', articles, meta: { total: articles.length, limit, offset, order_by } };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, message: `Failed to list articles: ${message}`, articles: [] };
  }
}

async function handleGetArticle(params: { slug: string }) {
  try {
    const { slug } = params;
    const article = await getArticle(slug);
    if (!article) {
      return { success: false, message: `Article not found: ${slug}`, article: null };
    }
    return { success: true, message: 'Article retrieved successfully', article };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, message: `Failed to get article: ${message}`, article: null };
  }
}

async function handleDeleteArticle(params: { slug: string }) {
  try {
    const { slug } = params;
    const deleted = await deleteArticle(slug);
    if (!deleted) {
      return { success: false, message: `Article not found or already deleted: ${slug}` };
    }
    return { success: true, message: `Article "${slug}" deleted successfully` };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, message: `Failed to delete article: ${message}` };
  }
}

async function handleUpdateArticle(params: {
  slug: string;
  status?: 'draft' | 'published';
  title?: string;
  body?: string;
}) {
  try {
    const { slug, status } = params;
    if (status) {
      const updated = await updateArticleStatus(slug, status);
      if (!updated) {
        return { success: false, message: `Article not found: ${slug}`, article: null };
      }
      return { success: true, message: `Article "${slug}" status updated to "${status}"`, article: updated };
    }
    const article = await getArticle(slug);
    if (!article) {
      return { success: false, message: `Article not found: ${slug}`, article: null };
    }
    return { success: true, message: 'No updates provided', article };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, message: `Failed to update article: ${message}` };
  }
}

// Tool definitions for list
const tools = {
  create_article: {
    name: 'create_article',
    title: 'Create Article',
    description: 'Create a new blog article with title, body, and optional metadata',
    inputSchema: {
      type: 'object' as const,
      properties: {
        title: { type: 'string' as const, description: 'Title of the article' },
        body: { type: 'string' as const, description: 'Body content of the article' },
        date: { type: 'string' as const, description: 'Publication date (ISO 8601)' },
        tags: { type: 'array' as const, items: { type: 'string' as const }, description: 'Tags for the article' },
        excerpt: { type: 'string' as const, description: 'Short excerpt' },
        image: { type: 'string' as const, description: 'Optional image URL' },
        status: { type: 'string' as const, enum: ['draft', 'published'], description: 'Article status' },
      },
      required: ['title', 'body'],
    },
  },
  list_articles: {
    name: 'list_articles',
    title: 'List Articles',
    description: 'List blog articles with optional filtering, pagination, and ordering',
    inputSchema: {
      type: 'object' as const,
      properties: {
        status: { type: 'string' as const, enum: ['draft', 'published'], description: 'Filter by status' },
        limit: { type: 'number' as const, description: 'Number of articles to return' },
        offset: { type: 'number' as const, description: 'Number of articles to skip' },
        order_by: { type: 'string' as const, enum: ['date_DESC', 'date_ASC'], description: 'Order by date' },
      },
    },
  },
  get_article: {
    name: 'get_article',
    title: 'Get Article',
    description: 'Retrieve a single blog article by its slug',
    inputSchema: {
      type: 'object' as const,
      properties: {
        slug: { type: 'string' as const, description: 'The article slug' },
      },
      required: ['slug'],
    },
  },
  delete_article: {
    name: 'delete_article',
    title: 'Delete Article',
    description: 'Soft-delete a blog article by setting its deleted_at timestamp',
    inputSchema: {
      type: 'object' as const,
      properties: {
        slug: { type: 'string' as const, description: 'The article slug to delete' },
      },
      required: ['slug'],
    },
  },
  update_article: {
    name: 'update_article',
    title: 'Update Article',
    description: 'Update an article status from draft to published (or vice versa)',
    inputSchema: {
      type: 'object' as const,
      properties: {
        slug: { type: 'string' as const, description: 'The article slug' },
        status: { type: 'string' as const, enum: ['draft', 'published'], description: 'New status' },
        title: { type: 'string' as const, description: 'New title' },
        body: { type: 'string' as const, description: 'New body' },
      },
      required: ['slug'],
    },
  },
};

// Tool handlers map
const toolHandlers: Record<string, (params: unknown) => Promise<unknown>> = {
  create_article: handleCreateArticle,
  list_articles: handleListArticles,
  get_article: handleGetArticle,
  delete_article: handleDeleteArticle,
  update_article: handleUpdateArticle,
};

// Simple MCP Server class
export class McpServer {
  private info: Implementation;

  constructor(info: Implementation) {
    this.info = info;
  }

  // Handle JSON-RPC request
  async handleRequest(request: { jsonrpc?: string; method?: string; params?: unknown; id?: unknown }) {
    const { method, params, id } = request || {};

    if (method === 'initialize') {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          serverInfo: this.info,
        },
      };
    }

    if (method === 'tools/list') {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          tools: Object.values(tools),
        },
      };
    }

    if (method === 'tools/call') {
      const { name, arguments: args } = (params as { name?: string; arguments?: unknown }) || {};
      if (!name || !toolHandlers[name]) {
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Tool not found: ${name}` },
        };
      }
      try {
        const result = await toolHandlers[name](args as object);
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
          },
        };
      } catch (error) {
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32000, message: String(error) },
        };
      }
    }

    return {
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: `Method not found: ${method}` },
    };
  }
}

export const mcpServer = new McpServer(serverInfo);