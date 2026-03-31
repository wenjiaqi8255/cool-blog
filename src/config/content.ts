/**
 * Page Configuration
 * Centralized page metadata for SEO and navigation
 */

export type PageKey = 'home' | 'articles' | 'portfolio';

export interface PageConfig {
  title: string;
  description: string;
}

export const pages: Record<PageKey, PageConfig> = {
  home: {
    title: 'KERNEL_PANIC / ARCHITECTURE & SYSTEMS',
    description: 'Exploring the intersection of generative intelligence, low-level systems engineering, and the aesthetics of the command line interface.'
  },
  articles: {
    title: 'KERNEL_PANIC / ARTICLES',
    description: 'Technical articles on software architecture, systems engineering, and developer tooling.'
  },
  portfolio: {
    title: 'KERNEL_PANIC / PORTFOLIO',
    description: 'Projects, experiments, and experiments that explore the boundaries of computing.'
  }
};
