import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const articles = await getCollection('articles', ({ data }) => !data.draft);

  const items = articles.map((article) => ({
    title: article.data.title,
    pubDate: article.data.date,
    description: article.data.excerpt,
    link: `/articles/${article.id}/`,
    content: article.body,
    customData: article.data.coverImage
      ? `<media:content
          url="${article.data.coverImage}"
          type="image/jpeg"
          medium="image"
        />`
      : undefined,
  }));

  return rss({
    title: 'KERNEL_PANIC / ARCHITECTURE & SYSTEMS',
    description: 'Computing as craft — Technical writing and portfolio',
    site: context.site,
    items,
    customData: '<language>en-us</language>',
  });
}
