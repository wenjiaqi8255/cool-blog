/**
 * MCP Server API endpoint.
 * Provides article CRUD operations via Model Context Protocol with API key authentication.
 */

import type { APIRoute } from 'astro';
import { mcpServer } from '../lib/mcp/server';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp';
import { IncomingMessage, ServerResponse } from 'http';

// Create transport instance for MCP server
const transport = new StreamableHTTPServerTransport();

// Connect MCP server to transport
mcpServer.connect(transport).catch((err) => {
  console.error('Failed to connect MCP server to transport:', err);
});

// Store transport for request handling
let mcpTransport: StreamableHTTPServerTransport | null = null;

async function getTransport(): Promise<StreamableHTTPServerTransport> {
  if (!mcpTransport) {
    mcpTransport = new StreamableHTTPServerTransport();
    await mcpServer.connect(mcpTransport);
  }
  return mcpTransport;
}

/**
 * Validate API key from Authorization header.
 * Returns null if invalid, the token if valid.
 */
function validateApiKey(authHeader: string | null): string | null {
  if (!authHeader) {
    return null;
  }

  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7);
  const apiKey = process.env.MCP_API_KEY;

  // If no API key is configured, reject all requests
  if (!apiKey) {
    console.error('MCP_API_KEY is not configured');
    return null;
  }

  return token === apiKey ? token : null;
}

/**
 * Convert Astro Request to Node.js IncomingMessage
 */
function createIncomingMessage(request: Request): IncomingMessage {
  const url = new URL(request.url);
  const method = request.method;

  // @ts-expect-error - Node.js http module types
  const req = new (require('http').IncomingMessage)(null);

  req.method = method;
  req.url = url.pathname + url.search;
  req.headers = Object.fromEntries(request.headers.entries());

  // Handle body for POST requests
  if (method === 'POST') {
    // The body will be read and set separately
  }

  return req;
}

/**
 * Create a mock ServerResponse that captures the response
 */
function createServerResponse(): { res: ServerResponse; promise: Promise<{ status: number; headers: Record<string, string>; body: string }> } {
  let resolvePromise: (value: { status: number; headers: Record<string, string>; body: string }) => void;
  let rejectPromise: (reason: Error) => void;

  const promise = new Promise<{ status: number; headers: Record<string, string>; body: string }>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });

  const headers: Record<string, string> = {};
  let statusCode = 200;
  let body = '';

  const res = {
    statusCode: 200,
    getHeader(name: string): string | undefined {
      return headers[name.toLowerCase()];
    },
    setHeader(name: string, value: string | number | string[]) {
      headers[name.toLowerCase()] = String(value);
    },
    removeHeader(name: string) {
      delete headers[name.toLowerCase()];
    },
    write(chunk: string, encoding?: string, callback?: (err?: Error) => void) {
      if (typeof chunk === 'string') {
        body += chunk;
      }
      callback?.();
      return true;
    },
    end(chunk?: string, encoding?: string, callback?: (err?: Error) => void) {
      if (chunk) {
        body += chunk;
      }
      resolvePromise({ status: statusCode, headers, body });
      callback?.();
    },
    on(event: string, handler: (...args: unknown[]) => void) {
      // No-op for compatibility
    },
    emit(event: string, ...args: unknown[]) {
      // No-op for compatibility
    },
  };

  // Override statusCode setter
  Object.defineProperty(res, 'statusCode', {
    get: () => statusCode,
    set: (value: number) => {
      statusCode = value;
    },
    configurable: true,
  });

  return { res: res as unknown as ServerResponse, promise };
}

export const GET: APIRoute = async ({ request }) => {
  // Validate API key (MCP-05)
  const authHeader = request.headers.get('Authorization');
  const validToken = validateApiKey(authHeader);

  if (!authHeader) {
    return new Response('Unauthorized: Missing Authorization header', {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!validToken) {
    return new Response('Invalid API key', {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const transport = await getTransport();
    const { res, promise } = createServerResponse();

    // Read body for GET requests (MCP protocol may include body)
    let parsedBody: unknown = undefined;
    try {
      const bodyText = await request.text();
      if (bodyText) {
        parsedBody = JSON.parse(bodyText);
      }
    } catch {
      // Ignore body parse errors for GET
    }

    // Create mock IncomingMessage
    const url = new URL(request.url);
    // @ts-expect-error - Creating minimal Node.js request mock
    const req: IncomingMessage = {
      method: 'GET',
      url: url.pathname + url.search,
      headers: Object.fromEntries(request.headers.entries()),
    } as IncomingMessage;

    // Handle the request through MCP transport
    await transport.handleRequest(req, res, parsedBody);

    // Wait for response and return
    const result = await promise;

    return new Response(result.body, {
      status: result.status,
      headers: result.headers,
    });
  } catch (error) {
    console.error('MCP GET error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  // Validate API key (MCP-05)
  const authHeader = request.headers.get('Authorization');
  const validToken = validateApiKey(authHeader);

  if (!authHeader) {
    return new Response('Unauthorized: Missing Authorization header', {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!validToken) {
    return new Response('Invalid API key', {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const transport = await getTransport();
    const { res, promise } = createServerResponse();

    // Parse request body
    let parsedBody: unknown = undefined;
    try {
      const bodyText = await request.text();
      if (bodyText) {
        parsedBody = JSON.parse(bodyText);
      }
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create mock IncomingMessage
    const url = new URL(request.url);
    // @ts-expect-error - Creating minimal Node.js request mock
    const req: IncomingMessage = {
      method: 'POST',
      url: url.pathname + url.search,
      headers: Object.fromEntries(request.headers.entries()),
    } as IncomingMessage;

    // Handle the request through MCP transport
    await transport.handleRequest(req, res, parsedBody);

    // Wait for response and return
    const result = await promise;

    return new Response(result.body, {
      status: result.status,
      headers: result.headers,
    });
  } catch (error) {
    console.error('MCP POST error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};