import { describe, it, expect } from 'vitest';
import { pages, type PageKey } from './content';

describe('content config', () => {
  it('exports pages object with required keys', () => {
    expect(pages).toHaveProperty('home');
    expect(pages).toHaveProperty('articles');
    expect(pages).toHaveProperty('portfolio');
  });

  it('each page has title and description', () => {
    const pageKeys: PageKey[] = ['home', 'articles', 'portfolio'];
    pageKeys.forEach((key) => {
      expect(pages[key]).toHaveProperty('title');
      expect(pages[key]).toHaveProperty('description');
      expect(typeof pages[key].title).toBe('string');
      expect(typeof pages[key].description).toBe('string');
    });
  });

  it('home page has correct title format', () => {
    expect(pages.home.title).toContain('KERNEL_PANIC');
  });

  it('articles page has description', () => {
    expect(pages.articles.description.length).toBeGreaterThan(0);
  });

  it('portfolio page configuration exists', () => {
    expect(pages.portfolio.title).toBeTruthy();
    expect(pages.portfolio.description).toBeTruthy();
  });
});
