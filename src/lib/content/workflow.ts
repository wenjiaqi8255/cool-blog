/**
 * Content workflow module.
 * Integrates parser, validator, and slug generation.
 */

import { parseMarkdown, type ParsedArticle } from './parser';
import { articleSchema, validateArticle } from './validator';
import { generateSlug } from '../mcp/slugify';

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
