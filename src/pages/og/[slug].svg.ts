import { getCollection } from "astro:content";

export const prerender = true;

export async function getStaticPaths() {
  const articles = await getCollection("articles", ({ data }) => {
    return data.draft !== true;
  });

  return articles.map((article) => ({
    params: { slug: article.id },
    props: { entry: article },
  }));
}

export async function GET({ props }: { props: { entry: { id: string; data: { title: string; date: Date } } } }) {
  const { entry } = props;
  const title = entry.data.title;
  const dateStr = entry.data.date.toISOString().split("T")[0];

  // Escape XML special characters in title
  const safeTitle = title
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#111111;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#grad)"/>
  <g transform="translate(100, 80)">
    <text x="0" y="0" font-family="monospace" font-size="18" font-weight="600" fill="#22c55e" letter-spacing="0.05em">KERNEL_PANIC</text>
    <text x="1000" y="0" font-family="monospace" font-size="14" fill="#666666" text-anchor="end" letter-spacing="0.1em">ARCHITECTURE & SYSTEMS</text>
  </g>
  <g transform="translate(100, 315)">
    <text x="500" y="0" font-family="monospace" font-size="48" font-weight="600" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${safeTitle}</text>
  </g>
  <g transform="translate(100, 580)">
    <text x="0" y="0" font-family="monospace" font-size="16" fill="#888888">${dateStr}</text>
    <text x="1000" y="0" font-family="monospace" font-size="16" font-weight="500" fill="#22c55e" text-anchor="end">kernelpanic.io</text>
  </g>
</svg>`;

  return new Response(svgContent, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}