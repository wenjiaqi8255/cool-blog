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
  if (!apiKey) {
    console.error('MCP_API_KEY is not configured');
    return null;
  }
  return token === apiKey ? token : null;
}

export const GET: APIRoute = async ({ request }) => {
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