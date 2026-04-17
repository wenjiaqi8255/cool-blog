# Cool Blog

> A modern, database-driven blog with MCP server integration for AI-powered content management.

![Cool Blog](docs/screenshots/article-detail-full.png)

## Live Demo

[https://cool-blog.aries10011.workers.dev](https://cool-blog.aries10011.workers.dev)

## Features

- **Modern Stack** — Astro 6, TypeScript, Tailwind CSS 4, React 19
- **Database-Driven** — Neon PostgreSQL + Drizzle ORM
- **MCP Server** — AI assistant integration for article management
- **Search** — Client-side fuzzy search with Fuse.js
- **Newsletter** — Email subscriptions via Resend
- **Analytics** — Privacy-friendly visitor tracking
- **Bento Grid** — Responsive card-based design
- **Hybrid Rendering** — SSR + static generation
- **Type-Safe** — Full TypeScript coverage

## Quick Start

### Prerequisites

- Node.js 22+
- A [Neon](https://neon.tech) account (free tier)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/cool-blog.git
cd cool-blog
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```bash
# Required
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Optional
GITHUB_TOKEN=your_github_token
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=newsletter@yourdomain.com
MCP_API_KEY=ckb_your_generated_key
```

### 3. Run

```bash
npm run dev
```

Visit `http://localhost:4321`

## Project Structure

```
cool-blog/
├── src/
│   ├── components/       # React & Astro components
│   ├── config/           # Site configuration & branding
│   ├── db/               # Database schema & connection
│   ├── lib/              # Utilities, MCP server, search
│   └── pages/            # Astro pages & API routes
├── public/               # Static assets
├── scripts/              # Build & migration scripts
└── tests/                # E2E tests
```

## Key Technologies

| Category | Technology |
|----------|-----------|
| **Framework** | Astro 6 |
| **Language** | TypeScript |
| **Database** | Neon PostgreSQL + Drizzle ORM |
| **Styling** | Tailwind CSS 4 |
| **UI** | React 19 |
| **Search** | Fuse.js |
| **Email** | Resend |
| **Testing** | Playwright + Vitest |
| **Deployment** | Cloudflare Workers / Zeabur |

## Usage

### Adding Articles

Articles are stored in PostgreSQL and can be managed via:

1. **Database** — Direct SQL inserts
2. **MCP Server** — AI assistant integration ([setup guide](docs/MCP_SETUP_GUIDE.md))
3. **API** — RESTful endpoints (with API key)

### Portfolio

Add `"Project"` tag to articles to feature them in the portfolio section. Use `"featured"` tag for prominent display.

### Customization

- **Branding** — Edit `src/config/content.ts` for site name and titles
- **Colors** — Edit `src/styles/global.css`
- **Card Layout** — Edit `src/config/cards.ts`
- **Portfolio** — Edit `src/config/portfolio.ts`

### MCP Server

Built-in MCP server for AI-powered content management. Available tools:

| Tool | Description |
|------|-------------|
| `create_article` | Create new articles |
| `update_article` | Update existing articles |
| `delete_article` | Remove articles |
| `list_articles` | List all articles |
| `get_article` | Get article by slug |

See [MCP Setup Guide](docs/MCP_SETUP_GUIDE.md) for configuration.

## Deployment

### Cloudflare Workers

1. Fork this repository
2. Add GitHub secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
3. Set `DATABASE_URL` as a Workers secret in Cloudflare Dashboard
4. Push to `master` — GitHub Actions deploys automatically

### Zeabur

1. Connect your repository on [Zeabur](https://zeabur.com)
2. Set environment variables: `DATABASE_URL`
3. Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Testing

```bash
npm run test:unit    # Unit tests
npm run test:e2e     # E2E tests
npm test             # All tests
```

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT License — see [LICENSE](LICENSE).

## Documentation

- [Deployment Guide](DEPLOYMENT.md)
- [MCP Server Setup](docs/MCP_SETUP_GUIDE.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)
- [Open Source Checklist](docs/OPENSOURCE-CHECKLIST.md)
