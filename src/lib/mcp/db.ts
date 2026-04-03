/**
 * Database operations for MCP server article CRUD.
 * Uses Drizzle ORM for all database queries.
 */

import { db, schema } from '../../db';
import { eq, desc, asc, isNull, and } from 'drizzle-orm';
import { generateSlug } from './slugify.js';

// Types
interface CreateArticleInput {
  title: string;
  body: string;
  date?: string;
  tags?: string[];
  excerpt?: string;
  image?: string;
  status?: string;
}

interface ListArticlesOptions {
  status?: string;
  limit?: number;
  offset?: number;
  order_by?: 'date_DESC' | 'date_ASC';
}

type Article = typeof schema.articles.$inferSelect;

/**
 * Create a new article in the database.
 * Generates slug from title, handles collision with numeric suffixes.
 */
export async function createArticle(data: CreateArticleInput): Promise<Article> {
  const { title, body, date, tags, excerpt, image, status = 'draft' } = data;

  // Generate initial slug
  let slug = generateSlug(title);
  let slugSuffix = 0;
  let finalSlug = slug;

  // Check for slug collision and append suffix if needed
  while (true) {
    const existing = await db.query.articles.findFirst({
      where: and(
        eq(schema.articles.slug, finalSlug),
        isNull(schema.articles.deleted_at)
      )
    });

    if (!existing) break;

    slugSuffix++;
    finalSlug = `${slug}-${slugSuffix}`;
  }

  // Parse date or use current timestamp
  const articleDate = date ? new Date(date) : new Date();

  // Insert article
  const [article] = await db.insert(schema.articles).values({
    title,
    slug: finalSlug,
    body,
    date: articleDate,
    tags: tags || null,
    excerpt: excerpt || null,
    image: image || null,
    status,
  }).returning();

  return article;
}

/**
 * List articles with filtering, pagination, and ordering.
 * Excludes soft-deleted articles (where deleted_at is not null).
 */
export async function listArticles(options: ListArticlesOptions): Promise<Article[]> {
  const { status, limit = 20, offset = 0, order_by = 'date_DESC' } = options;

  // Build conditions: must not be deleted
  const conditions = [isNull(schema.articles.deleted_at)];

  // Add status filter if provided
  if (status) {
    conditions.push(eq(schema.articles.status, status));
  }

  // Build order clause
  const orderBy = order_by === 'date_ASC'
    ? asc(schema.articles.date)
    : desc(schema.articles.date);

  const articles = await db.query.articles.findMany({
    where: and(...conditions),
    orderBy: [orderBy],
    limit,
    offset,
  });

  return articles;
}

/**
 * Get a single article by slug.
 * Returns null if not found or soft-deleted.
 */
export async function getArticle(slug: string): Promise<Article | null> {
  const article = await db.query.articles.findFirst({
    where: and(
      eq(schema.articles.slug, slug),
      isNull(schema.articles.deleted_at)
    )
  });

  return article || null;
}

/**
 * Soft-delete an article by setting deleted_at timestamp.
 * Returns true if article was deleted, false if not found.
 */
export async function deleteArticle(slug: string): Promise<boolean> {
  // Find the article (must not be already deleted)
  const existing = await db.query.articles.findFirst({
    where: and(
      eq(schema.articles.slug, slug),
      isNull(schema.articles.deleted_at)
    )
  });

  if (!existing) {
    return false;
  }

  // Soft delete: set deleted_at to now
  await db.update(schema.articles)
    .set({ deleted_at: new Date() })
    .where(eq(schema.articles.slug, slug));

  return true;
}

/**
 * Update article status (draft <-> published).
 * Returns updated article or null if not found or already soft-deleted.
 */
export async function updateArticleStatus(
  slug: string,
  status: 'draft' | 'published'
): Promise<Article | null> {
  // Find the article (must not be soft-deleted)
  const existing = await db.query.articles.findFirst({
    where: and(
      eq(schema.articles.slug, slug),
      isNull(schema.articles.deleted_at)
    )
  });

  if (!existing) {
    return null;
  }

  // Update status
  const [updated] = await db.update(schema.articles)
    .set({ status })
    .where(eq(schema.articles.slug, slug))
    .returning();

  return updated;
}

/**
 * List all draft articles.
 * Convenience wrapper around listArticles with status filter.
 */
export async function listDrafts(): Promise<Article[]> {
  return listArticles({ status: 'draft', order_by: 'date_DESC' });
}