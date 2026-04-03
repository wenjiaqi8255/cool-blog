import type { APIRoute } from 'astro';
import { incrementVisitorCount, isRedisConfigured } from '../../lib/visitor-counter';

export const POST: APIRoute = async () => {
  // Check if Redis is configured
  if (!isRedisConfigured()) {
    return new Response(JSON.stringify({ success: false, error: 'Redis not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const count = await incrementVisitorCount();
    return new Response(JSON.stringify({ success: true, count }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Failed to track visit:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
