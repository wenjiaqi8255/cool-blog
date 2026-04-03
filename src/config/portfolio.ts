import { z } from 'zod';
import type { Article } from '../lib/articles';
import type { CardConfig } from './cards';

/**
 * Portfolio Configuration Schema
 *
 * This configuration defines ALL rules for portfolio display.
 * Both humans and AI agents can read this to understand system behavior.
 *
 * USAGE EXAMPLES:
 *
 * To feature an article:
 *   -> Add "featured" tag to article
 *   -> Article will automatically get span-2, image variant
 *
 * To add article to portfolio:
 *   -> Add "Project" tag to article
 *   -> Article will appear in BentoGrid
 *
 * To specify custom image:
 *   -> Set article.image field to URL
 *   -> If null, first image from body will be extracted
 */

export const PortfolioConfigSchema = z.object({
  // Which tags to include in portfolio
  tagFilter: z.array(z.string()),

  // Which tags to exclude
  excludeTags: z.array(z.string()),

  // Tag that marks featured articles
  featuredTag: z.string(),

  // Maximum featured articles to display
  maxFeatured: z.number().int().positive(),

  // Card sizing rules
  sizing: z.object({
    featured: z.object({
      span: z.union([z.literal(1), z.literal(2), z.literal(4)]),
      row: z.number().int().positive().optional(),
      variant: z.enum(['image', 'text'])
    }),
    standard: z.object({
      span: z.union([z.literal(1), z.literal(2), z.literal(4)]),
      variant: z.enum(['image', 'text'])
    })
  }),

  // Fallback behavior
  fallback: z.object({
    whenNoArticles: z.enum(['animation', 'empty', 'placeholder']),
    whenNoImage: z.enum(['text', 'placeholder', 'hide'])
  }),

  // Variety patterns for visual diversity
  variety: z.object({
    spanCycle: z.array(z.union([z.literal(1), z.literal(2), z.literal(4)])),
    variantCycle: z.array(z.enum(['dark', 'light'])),
    rowPatterns: z.array(z.number().int().positive().optional()),
    // Control which cards show images vs text-only
    imageCycle: z.array(z.boolean()) // true = show image, false = text-only
  }).optional()
});

export type PortfolioConfig = z.infer<typeof PortfolioConfigSchema>;

/**
 * Default Portfolio Configuration
 */
export const portfolioConfig: PortfolioConfig = {
  tagFilter: ['Project'],
  excludeTags: ['draft', 'archived'],
  featuredTag: 'featured',
  maxFeatured: 3,

  sizing: {
    featured: { span: 2, row: 2, variant: 'image' },
    standard: { span: 1, variant: 'text' }
  },

  fallback: {
    whenNoArticles: 'animation',
    whenNoImage: 'text'
  },

  // Variety patterns for non-featured cards
  variety: {
    // Cycle through spans: 1, 2, 1, 1, 2, 4...
    spanCycle: [1, 2, 1, 1, 2, 4],
    // Cycle through variants: dark, light, dark, light...
    variantCycle: ['dark', 'light', 'dark', 'light'],
    // Row spans for visual interest
    rowPatterns: [undefined, 2, undefined, undefined],
    // Control image visibility: true = image card, false = text-only card
    imageCycle: [false, false, false, false, false, false, false, false]
  }
};

/**
 * Map Article to CardConfig
 *
 * Rules:
 * - Featured articles: span-2, image variant (if image exists)
 * - Standard articles: use variety patterns for visual diversity
 * - Image source: article.image || extractFirstImage(article.body)
 */
export function mapArticleToCard(
  article: Article,
  config: PortfolioConfig,
  index: number = 0
): CardConfig {
  const isFeatured = article.tags?.includes(config.featuredTag) ?? false;

  // Determine image
  const image = article.image || extractFirstImage(article.body);

  // Determine card type
  const cardType = image ? 'image' : 'text';

  // Extract meta tag (first non-Project, non-featured tag)
  const metaTag = article.tags?.find(
    tag => tag !== 'Project' && tag !== config.featuredTag
  );

  // Format date as YYYY-MM-DD string
  const dateString = article.date instanceof Date
    ? article.date.toISOString().split('T')[0]
    : String(article.date);

  // Calculate variety based on index
  let span: 1 | 2 | 4 = 1;
  let row: 2 | undefined = undefined;
  let variant: 'dark' | 'light' = 'dark';
  let finalCardType: 'image' | 'text' = cardType;

  if (isFeatured) {
    // Featured: keep existing logic
    span = config.sizing.featured.span as 1 | 2 | 4;
    row = config.sizing.featured.row;
    variant = 'dark';
    // Featured always shows image if available
    finalCardType = cardType;
  } else if (config.variety) {
    // Non-featured: use variety patterns
    const { spanCycle, variantCycle, rowPatterns, imageCycle } = config.variety;
    span = spanCycle[index % spanCycle.length] as 1 | 2 | 4;
    variant = variantCycle[index % variantCycle.length];
    row = rowPatterns[index % rowPatterns.length];
    // Force text-only card if imageCycle says false
    finalCardType = imageCycle ? (imageCycle[index % imageCycle.length] ? cardType : 'text') : cardType;
  }

  return {
    id: article.slug,
    type: finalCardType,
    span,
    row,
    variant,
    isModalTrigger: true, // Open modal instead of navigating to article
    props: {
      title: article.title,
      body: article.excerpt,
      image: image,
      metaTag: metaTag,
      date: dateString
    }
  };
}

/**
 * Extract first image URL from Markdown body
 *
 * Supports:
 * - Markdown images: ![alt](url)
 * - HTML images: <img src="url">
 */
export function extractFirstImage(body: string): string | null {
  // Markdown image: ![alt](url)
  const mdMatch = body.match(/!\[.*?\]\((.*?)\)/);
  if (mdMatch) return mdMatch[1];

  // HTML image: <img src="url">
  const htmlMatch = body.match(/<img.*?src=["'](.*?)["']/);
  if (htmlMatch) return htmlMatch[1];

  return null;
}

/**
 * Map all articles to card configurations
 */
export function mapArticlesToCards(
  articles: Article[],
  config: PortfolioConfig = portfolioConfig
): CardConfig[] {
  return articles
    .filter(article => {
      // Must have Project tag
      if (!article.tags?.some(tag => config.tagFilter.includes(tag))) {
        return false;
      }

      // Must not have excluded tags
      if (article.tags?.some(tag => config.excludeTags.includes(tag))) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Featured articles first
      const aFeatured = a.tags?.includes(config.featuredTag) ?? false;
      const bFeatured = b.tags?.includes(config.featuredTag) ?? false;

      if (aFeatured && !bFeatured) return -1;
      if (!aFeatured && bFeatured) return 1;

      // Then by date
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 12) // Max 12 articles in grid
    .map((article, index) => mapArticleToCard(article, config, index));
}
