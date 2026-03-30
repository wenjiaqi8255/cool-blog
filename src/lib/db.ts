import { db, schema } from '../db';
import { eq } from 'drizzle-orm';

export const DUPLICATE_ERROR = 'DUPLICATE_EMAIL';

export async function createSubscriber(email: string): Promise<{ id: number; email: string }> {
  try {
    const [subscriber] = await db.insert(schema.subscribers).values({
      email,
      confirmed: true,
      confirmationSentAt: new Date(),
    }).returning({ id: schema.subscribers.id, email: schema.subscribers.email });
    return subscriber;
  } catch (error: unknown) {
    // Handle duplicate key violation at DB level
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('duplicate key') || message.includes('unique constraint')) {
      throw new Error(DUPLICATE_ERROR);
    }
    throw error;
  }
}
