/**
 * Tests for content workflow integration.
 */

import { describe, it, expect } from 'vitest';
import { processMarkdown } from './workflow';

describe('processMarkdown', () => {
  it('should process valid Markdown end-to-end', () => {
    const markdown = `---
title: My Test Article
date: 2026-03-31
tags: ['test', 'example']
excerpt: A short summary
---
# Content

This is the article body with enough content to pass validation. It needs to be at least 100 characters to meet the minimum requirement.`;

    const result = processMarkdown(markdown);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.meta.title).toBe('My Test Article');
      expect(result.data.meta.date).toBe('2026-03-31');
      expect(result.data.body).toContain('# Content');
      expect(result.data.slug).toBe('my-test-article');
    }
  });

  it('should return error for missing frontmatter', () => {
    const markdown = `# Just content`;

    const result = processMarkdown(markdown);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('title');
    }
  });

  it('should return error for missing title', () => {
    const markdown = `---
date: 2026-03-31
---
# Content`;

    const result = processMarkdown(markdown);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('title');
    }
  });

  it('should return error for body too short', () => {
    const markdown = `---
title: Short Body Article
---
# Short`;

    const result = processMarkdown(markdown);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('100');
    }
  });

  it('should return error for invalid date format', () => {
    const markdown = `---
title: My Article
date: not-a-date
---
# Content

This is the article body with enough content to pass validation. It needs to be at least 100 characters to meet the minimum requirement.`;

    const result = processMarkdown(markdown);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('Date');
    }
  });

  it('should generate slug from title', () => {
    const markdown = `---
title: Hello, World! Test Article
---
# Content

This is the article body with enough content to pass validation. It needs to be at least 100 characters to meet the minimum requirement.`;

    const result = processMarkdown(markdown);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.slug).toBe('hello-world-test-article');
    }
  });

  it('should handle Chinese title', () => {
    const markdown = `---
title: 我的第一篇文章
---
# 内容

This is the article body with enough content to pass validation. It needs to be at least 100 characters to meet the minimum requirement.`;

    const result = processMarkdown(markdown);

    expect(result.success).toBe(true);
    // Chinese characters get normalized/removed, but workflow should still succeed
    if (result.success) {
      expect(result.data.slug).toBeDefined();
    }
  });
});
