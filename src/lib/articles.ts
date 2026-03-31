import { db } from '../db';
import { articles } from '../db/schema';
import { eq, and, isNull, isNotNull, desc } from 'drizzle-orm';

/**
 * Article interface matching database schema
 */
export interface Article {
  id: number;
  title: string;
  slug: string;
  date: Date;
  tags: string[] | null;
  excerpt: string | null;
  body: string;
  status: 'draft' | 'published';
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Returns all published, non-deleted articles sorted by date descending
 */
export async function listPublishedArticles(): Promise<Article[]> {
  const result = await db
    .select()
    .from(articles)
    .where(
      and(
        eq(articles.status, 'published'),
        isNull(articles.deleted_at)
      )
    )
    .orderBy(desc(articles.date));

  return result;
}

/**
 * Returns a single published article by slug, or undefined if not found
 */
export async function getPublishedArticleBySlug(slug: string): Promise<Article | undefined> {
  const result = await db
    .select()
    .from(articles)
    .where(
      and(
        eq(articles.slug, slug),
        eq(articles.status, 'published'),
        isNull(articles.deleted_at)
      )
    )
    .limit(1);

  return result[0];
}