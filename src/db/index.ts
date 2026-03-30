import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Mock DB for development without credentials
const mockDb = {
  insert: () => ({
    values: () => ({
      returning: () => Promise.resolve([{ id: 1, email: 'mock@example.com' }])
    })
  })
};

// Real DB with env var access via Cloudflare platform proxy
let dbInstance: ReturnType<typeof drizzle> | null = null;

function initDb() {
  if (dbInstance) return dbInstance;

  const url = process.env.DATABASE_URL;
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