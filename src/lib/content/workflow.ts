/**
 * Content workflow module.
 * Integrates parser, validator, and slug generation.
 */

import { parseMarkdown, type ParsedArticle } from './parser';
import { articleSchema, validateArticle } from './validator';
import { generateSlug } from '../mcp/slugify';
import { createArticle, updateArticleStatus, listDrafts as dbListDrafts, deleteArticle, getArticle } from '../mcp/db';

/**
 * Processed article result with all metadata.
 */
interface ProcessedArticle {
  meta: {
    title: string;
    date?: string;
    tags?: string[];
    excerpt?: string;
  };
  body: string;
  slug: string;
}

/**
 * Process Markdown with full workflow: parse, validate, slug generation.
 *
 * @param rawMarkdown - Raw Markdown string with YAML frontmatter
 * @returns Result with processed data or error message
 *
 * @example
 * const result = processMarkdown(markdownContent);
 * if (result.success) {
 *   console.log(result.data.slug);
 * }
 */
export function processMarkdown(rawMarkdown: string): {
  success: boolean;
  data?: ProcessedArticle;
  error?: string;
} {
  // Step 1: Parse Markdown
  const parseResult = parseMarkdown(rawMarkdown);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error
    };
  }

  const parsedData: ParsedArticle = parseResult.data as ParsedArticle;

  // Step 2: Validate with article schema
  const validationInput = {
    title: parsedData.meta.title,
    date: parsedData.meta.date,
    tags: parsedData.meta.tags,
    excerpt: parsedData.meta.excerpt,
    body: parsedData.body
  };

  const validationResult = validateArticle(validationInput);
  if (!validationResult.valid) {
    return {
      success: false,
      error: validationResult.errors?.join('; ')
    };
  }

  // Step 3: Generate slug from title
  const slug = generateSlug(parsedData.meta.title);

  return {
    success: true,
    data: {
      meta: parsedData.meta,
      body: parsedData.body,
      slug
    }
  };
}

/**
 * Generate a formatted preview of an article for display in Claude chat.
 * Shows all metadata and full body content.
 *
 * @param meta - Article metadata
 * @param body - Article body content
 * @param slug - Article slug
 * @returns Formatted preview string
 */
export function generatePreview(
  meta: ProcessedArticle['meta'],
  body: string,
  slug: string
): string {
  const tags = meta.tags?.join(', ') || 'none';
  const date = meta.date || new Date().toISOString().split('T')[0];
  const excerpt = meta.excerpt || body.slice(0, 200) + '...';

  return `
# ${meta.title}

**Date:** ${date}
**Tags:** ${tags}
**Slug:** ${slug}
**Status:** Preview (not yet saved)

---

## Excerpt
${excerpt}

---

## Body
${body}
`.trim();
}

/**
 * Publish a new article to the database.
 *
 * @param meta - Article metadata
 * @param body - Article body content
 * @param status - Article status (draft or published)
 * @returns Result with article or error
 */
export async function publishArticle(
  meta: ProcessedArticle['meta'],
  body: string,
  status: 'draft' | 'published' = 'draft'
): Promise<{ success: boolean; article?: unknown; error?: string }> {
  try {
    const article = await createArticle({
      title: meta.title,
      body,
      date: meta.date,
      tags: meta.tags,
      excerpt: meta.excerpt,
      status,
    });

    return {
      success: true,
      article,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Publish a draft article (change status from draft to published).
 *
 * @param slug - Article slug
 * @returns Result with article or error
 */
export async function publishDraft(
  slug: string
): Promise<{ success: boolean; article?: unknown; error?: string }> {
  try {
    const article = await updateArticleStatus(slug, 'published');

    if (!article) {
      return {
        success: false,
        error: `Article not found: ${slug}`,
      };
    }

    return {
      success: true,
      article,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * List all draft articles.
 *
 * @returns Result with drafts array or error
 */
export async function listDrafts(): Promise<{ success: boolean; drafts?: unknown[]; error?: string }> {
  try {
    const drafts = await dbListDrafts();
    return {
      success: true,
      drafts,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Failed to list drafts: ${message}`,
    };
  }
}

/**
 * Save an article as a draft.
 *
 * @param meta - Article metadata
 * @param body - Article body content
 * @returns Result with article or error
 */
export async function saveDraft(
  meta: ProcessedArticle['meta'],
  body: string
): Promise<{ success: boolean; article?: unknown; error?: string }> {
  try {
    // Validate inputs
    if (!meta.title || typeof meta.title !== 'string') {
      return {
        success: false,
        error: 'Missing or invalid frontmatter: title is required',
      };
    }

    if (!body || typeof body !== 'string') {
      return {
        success: false,
        error: 'Invalid Markdown format: body content is required',
      };
    }

    const article = await createArticle({
      title: meta.title,
      body,
      date: meta.date,
      tags: meta.tags,
      excerpt: meta.excerpt,
      status: 'draft',
    });

    return {
      success: true,
      article,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Failed to save article: ${message}`,
    };
  }
}

/**
 * Discard (soft-delete) an article.
 *
 * @param slug - Article slug to discard
 * @returns Result with success or error
 */
export async function discardArticle(
  slug: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const deleted = await deleteArticle(slug);

    if (!deleted) {
      return {
        success: false,
        error: `Article not found: ${slug}`,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Failed to discard article: ${message}`,
    };
  }
}
