/**
 * Tests for content validator module.
 */

import { describe, it, expect } from 'vitest';
import { frontmatterSchema, articleSchema, validateArticle } from './validator';

describe('frontmatterSchema', () => {
  it('should validate valid frontmatter', () => {
    const valid = {
      title: 'My Article',
      date: '2026-03-31',
      tags: ['test', 'example'],
      excerpt: 'A short summary'
    };

    const result = frontmatterSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('should reject empty title', () => {
    const invalid = {
      title: '',
      date: '2026-03-31'
    };

    const result = frontmatterSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject missing title', () => {
    const invalid = {
      date: '2026-03-31'
    };

    const result = frontmatterSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should accept optional date', () => {
    const valid = {
      title: 'My Article'
    };

    const result = frontmatterSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('should accept optional tags', () => {
    const valid = {
      title: 'My Article',
      tags: ['tag1', 'tag2']
    };

    const result = frontmatterSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('should reject invalid date format', () => {
    const invalid = {
      title: 'My Article',
      date: 'not-a-date'
    };

    const result = frontmatterSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe('articleSchema', () => {
  it('should validate full article with body', () => {
    const valid = {
      title: 'My Article',
      date: '2026-03-31',
      body: '# Content here\n\nThis is the article body with enough content to pass validation. It needs to be at least 100 characters long to meet the minimum requirement.'
    };

    const result = articleSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('should reject body less than 100 characters', () => {
    const invalid = {
      title: 'My Article',
      body: 'Short body'
    };

    const result = articleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues[0];
      expect(error.message).toContain('100');
    }
  });
});

describe('validateArticle', () => {
  it('should return valid true for valid article', () => {
    const valid = {
      title: 'My Article',
      body: '# Content\n\nThis is the article body with enough characters to pass the minimum length requirement. It needs to be at least one hundred characters to satisfy validation.'
    };

    const result = validateArticle(valid);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('should return errors for invalid article', () => {
    const invalid = {
      title: '',
      body: 'short'
    };

    const result = validateArticle(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.length).toBeGreaterThan(0);
  });

  it('should return flat error messages', () => {
    const invalid = {
      title: '',
      body: 'short'
    };

    const result = validateArticle(invalid);
    expect(result.valid).toBe(false);
    if (result.errors) {
      // All errors should be strings
      result.errors.forEach(error => {
        expect(typeof error).toBe('string');
      });
    }
  });
});
