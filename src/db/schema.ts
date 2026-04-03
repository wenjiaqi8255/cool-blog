import { pgTable, text, timestamp, boolean, serial } from 'drizzle-orm/pg-core';

export const subscribers = pgTable('subscribers', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(), // UNIQUE constraint for duplicate prevention
  subscribedAt: timestamp('subscribed_at').defaultNow().notNull(),
  confirmed: boolean('confirmed').notNull().default(true),
  confirmationSentAt: timestamp('confirmation_sent_at'),
  confirmationToken: text('confirmation_token'),
});

// Article status enum values (Postgres doesn't have native enum in Drizzle, use text with constraint)
export const ArticleStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published'
} as const;

export type ArticleStatusType = typeof ArticleStatus[keyof typeof ArticleStatus];

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(), // URL-safe identifier, unique constraint
  date: timestamp('date').notNull(), // Publication date
  tags: text('tags').array(), // PostgreSQL array type for tags
  excerpt: text('excerpt'), // Short description for article cards
  body: text('body').notNull(), // Full Markdown content
  image: text('image'), // Optional image URL for portfolio cards
  status: text('status').notNull().default(ArticleStatus.DRAFT), // 'draft' | 'published'
  deleted_at: timestamp('deleted_at'), // Soft delete (NULL = visible, non-NULL = hidden)
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
