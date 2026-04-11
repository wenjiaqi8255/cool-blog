/**
 * Page Configuration
 * Centralized page metadata for SEO and navigation
 */

import { branding } from './branding';

export type PageKey = 'home' | 'articles' | 'portfolio';

export interface PageConfig {
  title: string;
  description: string;
  brandTitle?: string;      // Header left part (e.g., "YOUR NAME")
  brandSubtitle?: string;  // Header right part (e.g., "ARCHITECTURE & SYSTEMS")
  footerBrand?: string;    // Footer brand text (e.g., "YN")
  authorName?: string;     // Author name for credit (e.g., "YOUR NAME")
  authorTagline?: string;  // Author tagline (e.g., "Building Something Fun")
}

export const pages: Record<PageKey, PageConfig> = {
  home: {
    title: branding.siteTitle,
    description: branding.siteDescription,
    brandTitle: branding.brandTitle,
    brandSubtitle: branding.brandSubtitle,
    footerBrand: branding.footerBrand,
    authorName: branding.authorName,
    authorTagline: branding.authorTagline
  },
  articles: {
    title: `${branding.siteName} | ARTICLES`,
    description: 'Technical articles about software architecture, systems engineering, and developer tools.',
    footerBrand: branding.footerBrand,
    authorName: branding.authorName,
    authorTagline: branding.authorTagline
  },
  portfolio: {
    title: `${branding.siteName} | PORTFOLIO`,
    description: 'Projects, experiments, and works exploring the boundaries of computing.',
    footerBrand: branding.footerBrand,
    authorName: branding.authorName,
    authorTagline: branding.authorTagline
  }
};
