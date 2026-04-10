/**
 * MCP Server API endpoint.
 * Provides article CRUD operations via Model Context Protocol with API key authentication.
 * Uses simple JSON-RPC over HTTP.
 */

import type { APIRoute } from 'astro';
import { mcpServer } from '../../lib/mcp/server.js';

// Use process.env to read at runtime (not build time).
// import.meta.env gets statically replaced by Vite during build,
// which bakes in the build-time value instead of reading the runtime env.
const getApiKey = (): string | undefined => {
  return process.env.MCP_API_KEY;
};

/**
 * Validate API key from Authorization header.
 */
function validateApiKey(authHeader: string | null): string | null {
  if (!authHeader) return null;
  if (!authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  const apiKey = getApiKey();
  console.log('[MCP DEBUG] token:', token.substring(0, 10) + '...', 'apiKey exists:', Boolean(apiKey), 'apiKey prefix:', apiKey?.substring(0, 10));
  if (!apiKey) {
    console.error('MCP_API_KEY is not configured');
    return null;
  }
  console.log('[MCP DEBUG] match:', token === apiKey, 'token len:', token.length, 'apiKey len:', apiKey.length);
  return token === apiKey ? token : null;
}

export const GET: APIRoute = async ({ request }) => {
  // Debug endpoint - check env vars without auth
  const url = new URL(request.url);
  if (url.searchParams.has('_debug')) {
    const envInfo = {
      timestamp: new Date().toISOString(),
      mcp_api_key: {
        exists: Boolean(process.env.MCP_API_KEY),
        type: typeof process.env.MCP_API_KEY,
        length: process.env.MCP_API_KEY?.length || 0,
        prefix: process.env.MCP_API_KEY?.substring(0, 10) || 'N/A',
        is_empty_string: process.env.MCP_API_KEY === '',
        is_undefined: process.env.MCP_API_KEY === undefined,
      },
      database_url: {
        exists: Boolean(process.env.DATABASE_URL),
        length: process.env.DATABASE_URL?.length || 0,
        prefix: process.env.DATABASE_URL?.substring(0, 50) || 'N/A',
      },
      all_env_keys: Object.keys(process.env)
        .filter(k => k.includes('MCP') || k.includes('KEY') || k.includes('DATABASE'))
        .sort()
        .map(k => ({
          key: k,
          exists: Boolean(process.env[k]),
          length: process.env[k]?.length || 0,
        })),
    };
    return new Response(JSON.stringify(envInfo, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const validToken = validateApiKey(authHeader);
  if (!validToken) {
    return new Response(JSON.stringify({ error: 'Invalid API key' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(request.url);
    const bodyText = await request.text();
    let requestBody = undefined;
    if (bodyText) {
      try {
        requestBody = JSON.parse(bodyText);
      } catch {}
    }

    // Build JSON-RPC request from query params
    const rpcRequest = {
      jsonrpc: '2.0',
      method: url.searchParams.get('method') || 'tools/list',
      params: requestBody?.params || {},
      id: 1,
    };

    const result = await mcpServer.handleRequest(rpcRequest);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('MCP GET error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const validToken = validateApiKey(authHeader);
  if (!validToken) {
    return new Response(JSON.stringify({ error: 'Invalid API key' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const bodyText = await request.text();
    let requestBody;
    try {
      requestBody = JSON.parse(bodyText);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await mcpServer.handleRequest(requestBody);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('MCP POST error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};