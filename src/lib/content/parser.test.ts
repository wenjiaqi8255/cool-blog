/**
 * Tests for content parser module.
 */

import { describe, it, expect } from 'vitest';
import { parseMarkdown, type ParsedArticle } from './parser';

describe('parseMarkdown', () => {
  it('should parse valid Markdown with frontmatter', () => {
    const markdown = `---
title: My Test Article
date: 2026-03-31
tags: ['test', 'example']
excerpt: This is a test article
---
# Content here`;

    const result = parseMarkdown(markdown);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.meta.title).toBe('My Test Article');
      expect(result.data.meta.date).toBe('2026-03-31');
      expect(result.data.meta.tags).toEqual(['test', 'example']);
      expect(result.data.meta.excerpt).toBe('This is a test article');
      expect(result.data.body).toBe('# Content here');
    }
  });

  it('should return error when title is missing', () => {
    const markdown = `---
date: 2026-03-31
---
# Content`;

    const result = parseMarkdown(markdown);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('title');
    }
  });

  it('should return error when title is empty', () => {
    const markdown = `---
title: ""
date: 2026-03-31
---
# Content`;

    const result = parseMarkdown(markdown);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('title');
    }
  });

  it('should return error when no frontmatter block', () => {
    const markdown = `# Just content
No frontmatter here`;

    const result = parseMarkdown(markdown);

    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const markdown = `---
title: Minimal Article
---
# Content`;

    const result = parseMarkdown(markdown);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.meta.title).toBe('Minimal Article');
      expect(result.data.meta.date).toBeUndefined();
      expect(result.data.meta.tags).toBeUndefined();
      expect(result.data.meta.excerpt).toBeUndefined();
      expect(result.data.body).toBe('# Content');
    }
  });
});
