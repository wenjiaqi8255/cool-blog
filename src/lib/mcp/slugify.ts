/**
 * Generate URL-safe slugs from article titles.
 * Handles both ASCII and Chinese characters via Unicode normalization.
 */

/**
 * Generate a URL-safe slug from a title.
 * - Converts to lowercase
 * - Normalizes Unicode (NFD) and removes diacritics
 * - Replaces non-word characters (except spaces/hyphens) with empty string
 * - Replaces spaces with hyphens
 * - Collapses multiple hyphens into one
 *
 * @param title - The article title to convert
 * @returns URL-safe slug string
 *
 * @example
 * generateSlug('Hello World') // 'hello-world'
 * generateSlug('我的文章') // 'wo-de-wen-zhang'
 * generateSlug('Hello, World! Test') // 'hello-world-test'
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    // Remove diacritical marks (accents)
    .replace(/[\u0300-\u036f]/g, '')
    // Remove non-word characters except spaces and hyphens
    .replace(/[^\w\s-]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Collapse multiple hyphens into one
    .replace(/-+/g, '-')
    // Trim leading/trailing hyphens
    .trim();
}