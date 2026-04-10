/**
 * Environment Debug Endpoint
 * No authentication required - for debugging only
 * REMOVE IN PRODUCTION!
 */

import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
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
    node_env: process.env.NODE_ENV,
  };

  return new Response(JSON.stringify(envInfo, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
};
