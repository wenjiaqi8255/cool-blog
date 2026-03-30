export const prerender = true;

export async function GET() {
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#111111;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#grad)"/>
  <g transform="translate(100, 265)">
    <text x="500" y="-80" font-family="monospace" font-size="28" font-weight="600" fill="#22c55e" text-anchor="middle" letter-spacing="0.05em">KERNEL_PANIC</text>
    <text x="500" y="-40" font-family="monospace" font-size="20" fill="#666666" text-anchor="middle" letter-spacing="0.1em">ARCHITECTURE & SYSTEMS</text>
  </g>
  <rect x="580" y="260" width="40" height="60" fill="#22c55e"/>
  <text x="600" y="360" font-family="system-ui" font-size="32" font-weight="500" fill="#ffffff" text-anchor="middle">Computing as craft</text>
</svg>`;

  return new Response(svgContent, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}