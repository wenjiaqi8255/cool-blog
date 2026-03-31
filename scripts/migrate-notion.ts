import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { db } from '../src/db';
import { articles, ArticleStatus } from '../src/db/schema';

// Configuration
const NOTION_EXPORT_PATH = process.env.NOTION_EXPORT_PATH || '/Users/wenjiaqi/Downloads/BLOG-notion';
const CSV_FILE = path.join(NOTION_EXPORT_PATH, 'BLOG 8e31fdff877c4d7caef28277beed03cf_all.csv');
const MARKDOWN_FOLDER = path.join(NOTION_EXPORT_PATH, 'BLOG');
const IMAGES_OUTPUT = path.join(process.cwd(), 'public/images/articles');
const BATCH_SIZE = 10;

// Types
interface NotionArticle {
  Name: string;
  Created: string;
  Tags: string;
  Tech_Tag: string;
  '状态': string;
}

function getArticleName(article: NotionArticle): string {
  // Handle BOM prefix in column name
  return article.Name || (article as unknown as Record<string, string>)['\uFEFFName'] || '';
}

interface MigrationResult {
  total: number;
  successful: number;
  failed: number;
  errors: Array<{ title: string; error: string }>;
  imagesCopied: number;
}

// 1. Parse Notion CSV
function parseNotionCsv(): NotionArticle[] {
  const csvContent = fs.readFileSync(CSV_FILE, 'utf-8');
  // Normalize column names by removing BOM and trimming
  const normalizeColumns = (header: string[]) => header.map(col => col.replace(/^\uFEFF/, '').trim());

  // Parse with record parsing to handle the column mapping
  const records = parse(csvContent, {
    columns: (header) => normalizeColumns(header),
    skip_empty_lines: true,
  }) as NotionArticle[];
  return records;
}

// 2. Generate URL-safe slug from title
function generateSlug(title: string): string {
  let slug = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-\u4e00-\u9fa5]+/g, '')
    .substring(0, 100);

  // For Chinese titles, use hash-based slug
  if (/[\u4e00-\u9fa5]/.test(slug)) {
    const hash = title.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    slug = `article-${hash}`;
  }

  return slug;
}

// 3. Parse Chinese date format: 2024年6月30日 00:59
function parseChineseDate(dateStr: string): Date {
  const match = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日\s+(\d{1,2}):(\d{2})/);
  if (!match) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }

  const [, year, month, day, hour, minute] = match.map(Number);
  return new Date(year, month - 1, day, hour, minute);
}

// 4. Merge tags from Tags and Tech_Tag
function mergeTags(tags: string, techTag: string): string[] {
  const allTags: string[] = [];

  if (tags) {
    allTags.push(...tags.split(',').map(t => t.trim()));
  }

  if (techTag) {
    allTags.push(...techTag.split(',').map(t => t.trim()));
  }

  return allTags.filter(t => t.length > 0);
}

// 5. Map Notion status to database status
function mapStatus(status: string): string {
  switch (status) {
    case 'Published':
      return ArticleStatus.PUBLISHED;
    case 'Draft':
    case 'Ready':
      return ArticleStatus.DRAFT;
    default:
      return ArticleStatus.DRAFT;
  }
}

// 6. Generate excerpt from body (first 150 chars, strip markdown)
function generateExcerpt(body: string): string {
  const stripped = body
    .replace(/^#\s+.*$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*_\[\]]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  return stripped.substring(0, 150) + (stripped.length > 150 ? '...' : '');
}

// 7. Read and parse markdown file
function parseMarkdownFile(articleName: string): { body: string; excerpt: string } {
  // Get only files, not directories
  const files = fs.readdirSync(MARKDOWN_FOLDER).filter(f => fs.statSync(path.join(MARKDOWN_FOLDER, f)).isFile());

  // Normalize the article name for comparison
  const normalizedName = articleName.replace(/[^\w\u4e00-\u9fa5]/g, '').toLowerCase();

  // Try multiple matching strategies
  let matchedFile: string | undefined;

  // Strategy 1: Exact match (without extension)
  matchedFile = files.find(f => f.replace(/\.md$/, '').replace(/[^\w\u4e00-\u9fa5]/g, '').toLowerCase() === normalizedName);

  // Strategy 2: Starts with (handles truncated names)
  if (!matchedFile) {
    matchedFile = files.find(f => {
      const fileBase = f.replace(/\.md$/, '').replace(/[^\w\u4e00-\u9fa5]/g, '').toLowerCase();
      return fileBase.startsWith(normalizedName.substring(0, 10)) || normalizedName.startsWith(fileBase.substring(0, 10));
    });
  }

  // Strategy 3: Contains key words (for complex titles)
  if (!matchedFile) {
    const keyWords = normalizedName.substring(0, 15).split('').filter(c => c.length > 0);
    matchedFile = files.find(f => {
      const fileBase = f.replace(/\.md$/, '').replace(/[^\w\u4e00-\u9fa5]/g, '').toLowerCase();
      return keyWords.slice(0, 5).every(w => fileBase.includes(w));
    });
  }

  if (!matchedFile) {
    throw new Error(`Markdown file not found for: ${articleName}`);
  }

  const filePath = path.join(MARKDOWN_FOLDER, matchedFile);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract body (skip Notion frontmatter)
  const lines = content.split('\n');
  let bodyStartIndex = 0;

  // Find first blank line, then look for actual content
  let foundFirstBlank = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === '' && i > 0) {
      foundFirstBlank = true;
      continue;
    }

    if (foundFirstBlank && line !== '' &&
        !line.startsWith('Created:') &&
        !line.startsWith('Tags:') &&
        !line.startsWith('Tech_Tag:') &&
        !line.startsWith('状态:')) {
      bodyStartIndex = i;
      break;
    }

    // Fallback: look for ## header
    if (i > 5 && line.startsWith('##')) {
      bodyStartIndex = i;
      break;
    }
  }

  const body = lines.slice(bodyStartIndex).join('\n').trim();
  const excerpt = generateExcerpt(body);

  return { body, excerpt };
}

// 8. Copy images and rewrite paths
function processImages(body: string, slug: string): { newBody: string; imagesCopied: number } {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let imagesCopied = 0;
  const replacements: Array<{ original: string; replacement: string }> = [];

  const slugImageFolder = path.join(IMAGES_OUTPUT, slug);

  let match;
  while ((match = imageRegex.exec(body)) !== null) {
    const [fullMatch, alt, imagePath] = match;

    // Skip external URLs
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      continue;
    }

    // Create slug folder if needed
    if (!fs.existsSync(slugImageFolder)) {
      fs.mkdirSync(slugImageFolder, { recursive: true });
    }

    // Decode URL-encoded path
    const decodedPath = decodeURIComponent(imagePath);

    // Copy image from Notion export
    const sourcePath = path.join(MARKDOWN_FOLDER, decodedPath);
    const filename = path.basename(decodedPath);
    const destPath = path.join(slugImageFolder, filename);

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      imagesCopied++;

      const newPath = `/images/articles/${slug}/${filename}`;
      replacements.push({
        original: fullMatch,
        replacement: `![${alt}](${newPath})`
      });
    } else {
      console.warn(`  Image not found: ${sourcePath}`);
    }
  }

  // Apply replacements
  let newBody = body;
  for (const { original, replacement } of replacements) {
    newBody = newBody.replace(original, replacement);
  }

  return { newBody, imagesCopied };
}

// 9. Main migration function
async function migrateNotionArticles(): Promise<MigrationResult> {
  const result: MigrationResult = {
    total: 0,
    successful: 0,
    failed: 0,
    errors: [],
    imagesCopied: 0,
  };

  try {
    // Parse CSV
    const articlesData = parseNotionCsv();
    result.total = articlesData.length;

    console.log(`Found ${result.total} articles in Notion export`);
    console.log('');

    // Process in batches
    for (let i = 0; i < articlesData.length; i += BATCH_SIZE) {
      const batch = articlesData.slice(i, i + BATCH_SIZE);

      for (const article of batch) {
        try {
          const articleName = getArticleName(article);

          // Skip empty records
          if (!articleName) {
            console.warn('[WARN] Skipping empty article record');
            result.failed++;
            continue;
          }

          // Generate slug
          const slug = generateSlug(articleName);

          // Parse date
          const date = parseChineseDate(article.Created);

          // Merge tags
          const tags = mergeTags(article.Tags || '', article.Tech_Tag || '');

          // Map status
          const rawStatus = article['状态'] || '';
          const status = mapStatus(rawStatus);

          // Parse markdown
          const { body, excerpt } = parseMarkdownFile(articleName);

          // Process images
          const { newBody, imagesCopied } = processImages(body, slug);
          result.imagesCopied += imagesCopied;

          // Insert into database
          await db.insert(articles).values({
            title: articleName,
            slug,
            date,
            tags: tags.length > 0 ? tags : null,
            excerpt,
            body: newBody,
            status,
            deleted_at: null,
          }).onConflictDoNothing();

          result.successful++;
          console.log(`[OK] Migrated: ${articleName}`);

        } catch (error) {
          result.failed++;
          const articleName = getArticleName(article);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          result.errors.push({ title: articleName || 'Unknown', error: errorMessage });
          console.error(`[FAIL] ${articleName || 'Unknown'} - ${errorMessage}`);
        }
      }

      // Delay between batches
      if (i + BATCH_SIZE < articlesData.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }

  return result;
}

// 10. Print summary
function printSummary(result: MigrationResult): void {
  console.log('\n' + '='.repeat(60));
  console.log('MIGRATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total articles: ${result.total}`);
  console.log(`Successfully imported: ${result.successful}`);
  console.log(`Failed: ${result.failed}`);
  console.log(`Images copied: ${result.imagesCopied}`);

  if (result.errors.length > 0) {
    console.log('\nErrors:');
    result.errors.forEach(({ title, error }) => {
      console.log(`  - ${title}: ${error}`);
    });
  }

  console.log('='.repeat(60));
}

// Run migration
async function main() {
  console.log('Starting Notion migration...');
  console.log(`Source: ${NOTION_EXPORT_PATH}`);
  console.log(`CSV: ${CSV_FILE}`);
  console.log(`Markdown: ${MARKDOWN_FOLDER}`);
  console.log(`Images output: ${IMAGES_OUTPUT}`);
  console.log(`Database: ${process.env.DATABASE_URL ? 'Connected' : 'NOT SET'}`);
  console.log('');

  const result = await migrateNotionArticles();
  printSummary(result);

  process.exit(result.failed > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

export { migrateNotionArticles, parseNotionCsv, generateSlug, parseChineseDate, mergeTags, mapStatus, generateExcerpt };
