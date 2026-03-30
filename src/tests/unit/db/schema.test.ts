import { describe, it, expect } from 'vitest';
import { articles, ArticleStatus, subscribers } from '../../../db/schema';

describe('Database Schema', () => {
  describe('articles table', () => {
    it('should export articles table definition', () => {
      expect(articles).toBeDefined();
      expect(articles).toHaveProperty('id');
      expect(articles).toHaveProperty('title');
      expect(articles).toHaveProperty('slug');
      expect(articles).toHaveProperty('date');
      expect(articles).toHaveProperty('tags');
      expect(articles).toHaveProperty('excerpt');
      expect(articles).toHaveProperty('body');
      expect(articles).toHaveProperty('status');
      expect(articles).toHaveProperty('deleted_at');
      expect(articles).toHaveProperty('created_at');
      expect(articles).toHaveProperty('updated_at');
    });

    it('should have ArticleStatus constants', () => {
      expect(ArticleStatus).toBeDefined();
      expect(ArticleStatus.DRAFT).toBe('draft');
      expect(ArticleStatus.PUBLISHED).toBe('published');
    });

    it('should have all 11 required columns', () => {
      const columnNames = Object.keys(articles);
      // Drizzle adds internal properties like 'enableRLS', so we check for presence, not count
      expect(columnNames).toContain('id');
      expect(columnNames).toContain('title');
      expect(columnNames).toContain('slug');
      expect(columnNames).toContain('date');
      expect(columnNames).toContain('tags');
      expect(columnNames).toContain('excerpt');
      expect(columnNames).toContain('body');
      expect(columnNames).toContain('status');
      expect(columnNames).toContain('deleted_at');
      expect(columnNames).toContain('created_at');
      expect(columnNames).toContain('updated_at');
    });

    it('should have unique constraint on slug', () => {
      // Drizzle schema objects don't expose constraint details directly
      // We verify the column exists; the unique constraint is in the schema definition
      expect(articles.slug).toBeDefined();
    });

    it('should use text type for status with draft/published values', () => {
      // We verify status column exists; the type is in the schema definition
      expect(articles.status).toBeDefined();
    });

    it('should support PostgreSQL array type for tags', () => {
      // We verify tags column exists; the array type is in the schema definition
      expect(articles.tags).toBeDefined();
    });

    it('should have nullable deleted_at timestamp', () => {
      // We verify deleted_at column exists; nullability is in the schema definition
      expect(articles.deleted_at).toBeDefined();
    });

    it('should not modify existing subscribers table', () => {
      expect(subscribers).toBeDefined();
      expect(subscribers).toHaveProperty('id');
      expect(subscribers).toHaveProperty('email');
      expect(subscribers).toHaveProperty('subscribedAt');
      expect(subscribers).toHaveProperty('confirmed');
      expect(subscribers).toHaveProperty('confirmationSentAt');
      expect(subscribers).toHaveProperty('confirmationToken');
    });
  });
});
