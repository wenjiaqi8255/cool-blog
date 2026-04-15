import { drizzle } from 'drizzle-orm/neon-http';
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

// Real DB with env var access
let dbInstance: ReturnType<typeof drizzle> | null = null;

function initDb() {
  if (dbInstance) return dbInstance;

  // Use import.meta.env for Vite dev server (loads .env.local)
  // Fallback to process.env for production runtime env vars
  // import.meta.env gets statically replaced during build, so production
  // will use process.env.DATABASE_URL at runtime
  const url = import.meta.env?.DATABASE_URL || process.env.DATABASE_URL;

  console.log('[DB] DATABASE_URL value:', url ? 'SET (' + url.substring(0, 30) + '...)' : 'NOT SET');

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
