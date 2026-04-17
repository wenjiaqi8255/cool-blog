import { drizzle } from 'drizzle-orm/neon-http';
import { getSecret } from 'astro:env/server';
import * as schema from './schema';

// Mock DB for development without credentials
const mockDb = {
  select: () => ({
    from: () => ({
      where: () => ({
        orderBy: () => Promise.resolve([])
      })
    }),
    _forArticles: (table: unknown) => ({
      where: () => ({
        orderBy: () => Promise.resolve([])
      })
    })
  }),
  insert: () => ({
    values: () => ({
      returning: () => Promise.resolve([{ id: 1, email: 'mock@example.com' }])
    })
  })
};

let dbInstance: ReturnType<typeof drizzle> | null = null;

function getDatabaseUrl(): string | undefined {
  // Astro v6 official API — reads from Workers env on Cloudflare,
  // from process.env on Node.js, and from .env files in dev.
  const url = getSecret('DATABASE_URL');
  if (url) return url;

  // Fallback for environments where Astro's env system isn't fully wired
  if (typeof process !== 'undefined' && process.env?.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  return undefined;
}

function initDb() {
  if (dbInstance) return dbInstance;

  const url = getDatabaseUrl();

  console.log('[DB] DATABASE_URL:', url ? 'configured' : 'NOT SET');

  if (!url) {
    console.warn('[DB] DATABASE_URL not set - using mock mode');
    return mockDb as unknown as ReturnType<typeof drizzle>;
  }

  dbInstance = drizzle(url, { schema });
  console.log('[DB] Connected to Neon');
  return dbInstance;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    const realDb = initDb();
    return (realDb as Record<string | symbol, unknown>)[prop];
  }
});

export { schema };
