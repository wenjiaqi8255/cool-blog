import { Redis } from '@upstash/redis';

const COUNTER_KEY = 'visitor_count';
const CACHE_TTL = 60; // Cache for 60 seconds

// Lazy-initialize Redis client only when configured
let redis: Redis | null = null;

function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  if (!redis) {
    redis = new Redis({ url, token });
  }

  return redis;
}

/**
 * Check if Redis is configured
 */
export function isRedisConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

/**
 * Increment visitor count
 * Call this on each page load
 */
export async function incrementVisitorCount(): Promise<number> {
  const client = getRedisClient();

  if (!client) {
    console.warn('Redis not configured, skipping visitor count increment');
    return 0;
  }

  try {
    const count = await client.incr(COUNTER_KEY);
    return count;
  } catch (error) {
    console.error('Failed to increment visitor count:', error);
    return 0;
  }
}

/**
 * Get current visitor count
 */
export async function getVisitorCount(): Promise<number> {
  const client = getRedisClient();

  if (!client) {
    return 0;
  }

  try {
    const count = await client.get<number>(COUNTER_KEY);
    return count ?? 0;
  } catch (error) {
    console.error('Failed to get visitor count:', error);
    return 0;
  }
}

// In-memory cache for server-side rendering
let cachedCount: number | null = null;
let cacheExpiry: number = 0;

/**
 * Get visitor count with caching
 * Returns cached value if available, otherwise fetches from Redis
 */
export async function getVisitorCountCached(): Promise<number> {
  const now = Date.now();

  // Return cached value if still valid
  if (cachedCount !== null && now < cacheExpiry) {
    return cachedCount;
  }

  const count = await getVisitorCount();
  cachedCount = count;
  cacheExpiry = now + CACHE_TTL * 1000;

  return count;
}

/**
 * Clear the cache (useful for testing)
 */
export function clearCache(): void {
  cachedCount = null;
  cacheExpiry = 0;
}
