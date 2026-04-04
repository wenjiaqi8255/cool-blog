/**
 * Page Configuration
 * Centralized page metadata for SEO and navigation
 */

export type PageKey = 'home' | 'articles' | 'portfolio';

export interface PageConfig {
  title: string;
  description: string;
  brandTitle?: string;      // Header left part (e.g., "温佳琪")
  brandSubtitle?: string;  // Header right part (e.g., "ARCHITECTURE & SYSTEMS")
}

export const pages: Record<PageKey, PageConfig> = {
  home: {
    title: '温佳琪 | ARCHITECTURE & SYSTEMS',
    description: '探索生成式智能、低层系统工程与命令行美学的交叉领域。',
    brandTitle: '温嘉琪',
    brandSubtitle: 'BUILDING SOMETHING FUN'
  },
  articles: {
    title: '温佳琪 | ARTICLES',
    description: '关于软件架构、系统工程和开发者工具的技术文章。'
  },
  portfolio: {
    title: '温佳琪 | PORTFOLIO',
    description: '项目、实验与探索计算边界的作品集。'
  }
};
