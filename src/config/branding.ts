/**
 * Branding Configuration
 *
 * This file handles different branding for:
 * - Public open-source version (template)
 * - Your private deployment
 *
 * Users can customize this file for their own branding.
 */

export interface BrandConfig {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  brandTitle: string;
  brandSubtitle: string;
  footerBrand: string;
  authorName: string;
  authorTagline: string;
}

/**
 * Detect environment based on PUBLIC_SITE_URL
 *
 * Production: your actual domain
 * Template: localhost or example domain
 *
 * Update this with your actual domain(s)
 */
const isProduction = import.meta.env.PUBLIC_SITE_URL?.includes('your-domain.com') ||
                      import.meta.env.PUBLIC_SITE_URL?.includes('wenjiaqi') ||
                      import.meta.env.PUBLIC_SITE_URL?.includes('your-actual-domain');

/**
 * Production branding (your private deployment)
 */
const productionBranding: BrandConfig = {
  siteName: '温嘉琪',
  siteTitle: '温嘉琪 | ARCHITECTURE & SYSTEMS',
  siteDescription: '探索生成式智能、低层系统工程与命令行美学的交叉领域。',
  brandTitle: '温嘉琪',
  brandSubtitle: 'BUILDING SOMETHING FUN',
  footerBrand: 'WEN',
  authorName: 'WEN',
  authorTagline: 'Building Something Fun'
};

/**
 * Template branding (for open-source users)
 */
const templateBranding: BrandConfig = {
  siteName: 'YOUR NAME',
  siteTitle: 'YOUR NAME | BUILDING SOMETHING FUN',
  siteDescription: 'A modern blog exploring software engineering, systems design, and developer tools.',
  brandTitle: 'YOUR NAME',
  brandSubtitle: 'BUILDING SOMETHING FUN',
  footerBrand: 'YN',
  authorName: 'YOUR NAME',
  authorTagline: 'Building Something Fun'
};

/**
 * Export branding based on environment
 *
 * Users can override by setting environment variable:
 * PUBLIC_USE_TEMPLATE_BRANDING=true
 */
export const branding: BrandConfig = import.meta.env.PUBLIC_USE_TEMPLATE_BRANDING === 'true'
  ? templateBranding
  : isProduction
    ? productionBranding
    : templateBranding;

/**
 * Helper function to get custom branding
 * Users can create their own branding config
 */
export function getCustomBranding(custom: Partial<BrandConfig>): BrandConfig {
  return {
    ...branding,
    ...custom
  };
}
