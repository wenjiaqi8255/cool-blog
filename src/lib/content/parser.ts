/**
 * Content parser module.
 * Parses Markdown with YAML frontmatter using gray-matter.
 */

import matter from 'gray-matter';

/**
 * Parsed article metadata from frontmatter.
 */
export interface ParsedArticleMeta {
  title: string;
  date?: string;
  tags?: string[];
  excerpt?: string;
}

/**
 * Full parsed article result.
 */
export interface ParsedArticle {
  meta: ParsedArticleMeta;
  body: string;
}

/**
 * Parse result with success/error handling.
 */
interface ParseResult {
  success: boolean;
  data?: ParsedArticle;
  error?: string;
}

/**
 * Parse Markdown with YAML frontmatter.
 *
 * @param rawMarkdown - Raw Markdown string with optional frontmatter
 * @returns ParseResult with parsed data or error message
 *
 * @example
 * const result = parseMarkdown(`---
 * title: My Article
 * ---
 * # Content`);
 */
/**
 * Convert a value to string, handling Date objects.
 */
function toStringValue(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (value instanceof Date) {
    return value.toISOString().split('T')[0];
  }
  return String(value);
}

export function parseMarkdown(rawMarkdown: string): ParseResult {
  // Parse with gray-matter
  const parsed = matter(rawMarkdown);

  // Check if frontmatter exists
  const data = parsed.data as Record<string, unknown>;

  // Validate title is present
  const title = data.title;
  if (!title || (typeof title === 'string' && title.trim() === '')) {
    return {
      success: false,
      error: 'Missing or invalid frontmatter: title is required'
    };
  }

  return {
    success: true,
    data: {
      meta: {
        title: title as string,
        date: toStringValue(data.date),
        tags: data.tags as string[] | undefined,
        excerpt: data.excerpt as string | undefined
      },
      body: parsed.content
    }
  };
}
