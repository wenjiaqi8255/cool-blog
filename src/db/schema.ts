import { pgTable, text, timestamp, boolean, serial } from 'drizzle-orm/pg-core';

export const subscribers = pgTable('subscribers', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(), // UNIQUE constraint for duplicate prevention
  subscribedAt: timestamp('subscribed_at').defaultNow().notNull(),
  confirmed: boolean('confirmed').notNull().default(true),
  confirmationSentAt: timestamp('confirmation_sent_at'),
  confirmationToken: text('confirmation_token'),
});
