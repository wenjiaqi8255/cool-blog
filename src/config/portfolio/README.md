# Portfolio Configuration Guide

This guide explains how to configure portfolio display rules.

## Quick Start

### Add Article to Portfolio
```typescript
// Add "Project" tag to article
article.tags = ["Project", "React", "TypeScript"];
```

### Feature an Article
```typescript
// Add "featured" tag
article.tags = ["Project", "featured", "React"];
```

### Set Custom Image
```typescript
// Set image field
article.image = "https://example.com/image.jpg";

// Or let system extract first image from body
// (automatically finds ![alt](url) or <img src="url">)
```

## Configuration Rules

### Tag Filtering
- Articles MUST have at least one tag from `tagFilter`
- Articles are EXCLUDED if they have any tag from `excludeTags`
- Default: Show articles with "Project" tag, exclude "draft"/"archived"

### Featured Placement
- Articles with `featuredTag` get special treatment
- Featured cards: span-2, row-2, image variant
- Max `maxFeatured` articles can be featured (default: 3)
- Featured articles appear first in grid

### Card Sizing
- Featured: Large cards (span-2, optional row-2)
- Standard: Regular cards (span-1)
- Image variant used if image exists
- Text variant used if no image

### Image Handling
1. Use `article.image` if set
2. Otherwise extract first image from `article.body`
3. If no image found, show text-only card

### Fallback Behavior
- No articles: Show loading animation
- No image: Show text-only card (no placeholder)
- Too few articles: Same as "no articles"

## Modifying Configuration

Edit `src/config/portfolio.ts`:

```typescript
export const portfolioConfig: PortfolioConfig = {
  tagFilter: ['Project', 'Showcase'], // Add more tags
  maxFeatured: 5, // Allow more featured articles
  // ...
};
```

## For AI Agents

When user says:
- "Make this featured" -> Add "featured" tag
- "Add to portfolio" -> Add "Project" tag
- "Use this image" -> Set article.image field
- "What should I feature?" -> Check articles with images, suggest recent ones

All rules are explicit in this configuration file. No hidden logic.
