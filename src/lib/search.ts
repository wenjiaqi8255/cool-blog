import Fuse from 'fuse.js';

export interface ArticleSearchItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  date: string;
}

export interface SearchResult {
  item: ArticleSearchItem;
  score?: number;
}

let fuseInstance: Fuse<ArticleSearchItem> | null = null;

export function createSearchIndex(articles: ArticleSearchItem[]): void {
  const options: Fuse.IFuseOptions<ArticleSearchItem> = {
    keys: [
      { name: 'title', weight: 2 },
      { name: 'excerpt', weight: 1 },
      { name: 'content', weight: 1 },
      { name: 'tags', weight: 1.5 }
    ],
    threshold: 0.3,
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 2
  };

  fuseInstance = new Fuse(articles, options);
}

export function search(query: string): SearchResult[] {
  if (!fuseInstance) {
    console.warn('Search index not initialized. Call createSearchIndex first.');
    return [];
  }

  if (!query.trim()) {
    return [];
  }

  const results = fuseInstance.search(query);
  return results.map((result) => ({
    item: result.item,
    score: result.score
  }));
}

export function isInitialized(): boolean {
  return fuseInstance !== null;
}