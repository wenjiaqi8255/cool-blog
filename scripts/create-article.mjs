/**
 * Quick script to create an article via database (bypassing MCP import issues)
 */
import { createArticle } from '../src/lib/mcp/db.js';

async function main() {
  // Create a sample article
  const article = await createArticle({
    title: 'Hello World: Testing the MCP Server',
    body: `# Hello World

This is a test article created to verify the database integration is working correctly.

## Why This Matters

We need to ensure that:
1. The database connection works
2. Articles can be created
3. The frontend can display them

\`\`\`javascript
console.log("Hello from the blog!");
\`\`\`

Thanks for reading!`,
    excerpt: 'A test article to verify database integration',
    tags: ['test', 'introduction'],
    status: 'published',
    date: '2026-03-31'
  });

  console.log('Article created:', article);
}

main().catch(console.error);