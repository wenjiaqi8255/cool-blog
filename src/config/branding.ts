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
 * Detect environment based on PUBLIC_SITE_URL or explicit flag
 *
 * Production detection:
 * 1. Domain matching (blog.wenjiaqi.top)
 * 2. Explicit flag (PUBLIC_IS_PERSONAL_SITE=true)
 * 3. Any non-localhost, non-example domain
 *
 * Template mode:
 * - PUBLIC_USE_TEMPLATE_BRANDING=true
 * - localhost or example domains
 */
const isPersonalSite = import.meta.env.PUBLIC_IS_PERSONAL_SITE === 'true' ||  // Explicit flag
                          import.meta.env.PUBLIC_SITE_URL?.includes('blog.wenjiaqi.top') ||
                          import.meta.env.PUBLIC_SITE_URL?.includes('wenjiaqi');

const isTemplateSite = import.meta.env.PUBLIC_USE_TEMPLATE_BRANDING === 'true' ||
                          !import.meta.env.PUBLIC_SITE_URL ||
                          (import.meta.env.PUBLIC_SITE_URL?.includes('localhost') && import.meta.env.PUBLIC_IS_PERSONAL_SITE !== 'true') ||
                          import.meta.env.PUBLIC_SITE_URL?.includes('example') ||
                          import.meta.env.PUBLIC_SITE_URL?.includes('your-domain');

const isProduction = isPersonalSite && !isTemplateSite;

/**
 * Production branding (your private deployment)
 */
const productionBranding: BrandConfig = {
  siteName: '温嘉琪的博客',
  siteTitle: '温嘉琪的博客 | BUILDING SOMETHING FUN',
  siteDescription: '探索生成式智能、低层系统工程与命令行美学的交叉领域。',
  brandTitle: '温嘉琪的博客',
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
  siteTitle: 'YOUR NAME\'s Blog | BUILDING SOMETHING FUN',
  siteDescription: 'A modern blog exploring software engineering, systems design, and developer tools.',
  brandTitle: 'YOUR NAME\'s Blog',
  brandSubtitle: 'BUILDING SOMETHING FUN',
  footerBrand: 'YOUR NAME',
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
