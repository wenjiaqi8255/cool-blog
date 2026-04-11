#!/usr/bin/env node
/**
 * MCP STDIO Wrapper for cool-blog HTTP endpoint.
 * Bridges Claude Desktop (stdio) to cool-blog MCP server (HTTP).
 *
 * Usage:
 *   npx tsx src/mcp-stdio-wrapper.ts
 *
 * Environment variables:
 *   MCP_SERVER_URL: HTTP endpoint URL (default: https://blog.wenjiaqi.top/api/mcp)
 *   MCP_API_KEY: API key for authentication (required)
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// Configuration from environment
const MCP_URL = process.env.MCP_SERVER_URL || 'https://blog.wenjiaqi.top/api/mcp';
const MCP_API_KEY = process.env.MCP_API_KEY;

if (!MCP_API_KEY) {
  console.error('Error: MCP_API_KEY environment variable is required');
  process.exit(1);
}

/**
 * HTTP MCP Client that communicates with remote HTTP endpoint
 */
class HttpMcpClient {
  private url: string;
  private headers: { [key: string]: string };

  constructor(url: string, apiKey: string) {
    this.url = url;
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };
  }

  /**
   * Send JSON-RPC request to HTTP endpoint
   */
  async sendRequest(method: string, params?: Record<string, unknown>): Promise<unknown> {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'Unknown error');
    }

    return data.result;
  }

  /**
   * List available tools
   */
  async listTools(): Promise<{ tools: Array<{ name: string; description: string; inputSchema: unknown }> }> {
    const result = await this.sendRequest('tools/list', {});
    return result as { tools: Array<{ name: string; description: string; inputSchema: unknown }> };
  }

  /**
   * Call a tool
   */
  async callTool(name: string, args?: Record<string, unknown>): Promise<{ content: Array<{ type: string; text: string }>; isError?: boolean }> {
    const result = await this.sendRequest('tools/call', {
      name,
      arguments: args || {},
    });
    return result as { content: Array<{ type: string; text: string }>; isError?: boolean };
  }
}

/**
 * Main function
 */
async function main() {
  if (!MCP_API_KEY) {
    throw new Error('MCP_API_KEY is required');
  }
  const httpClient = new HttpMcpClient(MCP_URL, MCP_API_KEY);

  // List tools
  const toolsResult = await httpClient.listTools();
  console.error(`[cool-blog-wrapper] Available tools: ${toolsResult.tools.map((t: any) => t.name).join(', ')}`);

  // Create MCP server for stdio communication
  const server = new Server(
    {
      name: 'cool-blog-stdio-wrapper',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Handle tools/list
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: toolsResult.tools
    };
  });

  // Handle tools/call
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    if (!args) {
      throw new Error('Arguments are required');
    }
    const result = await httpClient.callTool(name, args);
    return result as { content: Array<{ type: string; text: string }>; isError?: boolean };
  });

  // Connect to stdio
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('[cool-blog-wrapper] STDIO wrapper server running');
}

main().catch((error) => {
  console.error('[cool-blog-wrapper] Fatal error:', error);
  process.exit(1);
});
