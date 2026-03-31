/**
 * Content validator module.
 * Zod validation schemas for article content.
 */

import { z } from 'zod';

/**
 * Frontmatter schema - validates metadata from YAML frontmatter.
 */
export const frontmatterSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format').optional(),
  tags: z.array(z.string()).optional(),
  excerpt: z.string().optional()
});

/**
 * Article schema - validates full article including body.
 */
export const articleSchema = frontmatterSchema.extend({
  body: z.string().min(100, 'Body must be at least 100 characters')
});

/**
 * Validation result interface.
 */
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

/**
 * Validate article data using the article schema.
 *
 * @param data - The article data to validate
 * @returns ValidationResult with valid flag and optional error messages
 *
 * @example
 * const result = validateArticle({ title: 'My Article', body: '...' });
 * if (!result.valid) {
 *   console.log(result.errors);
 * }
 */
export function validateArticle(data: unknown): ValidationResult {
  const result = articleSchema.safeParse(data);

  if (result.success) {
    return { valid: true };
  }

  // Extract flat error messages
  const errors = result.error.issues.map(issue => issue.message);

  return { valid: false, errors };
}
