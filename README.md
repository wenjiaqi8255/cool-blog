# Cool Blog

> A modern, database-driven blog solution with MCP (Model Context Protocol) server integration for AI-powered content management.

![Cool Blog](docs/screenshots/article-detail-full.png)

## ✨ Features

- **🚀 Modern Stack** - Built with Astro 6, TypeScript, and Tailwind CSS 4

## 🌟 Live Demo

Check out the live demo: [https://cool-blog.pages.dev](https://cool-blog.pages.dev)

*Looking for the original author's site? It's coming soon!*
- **💾 Database-Driven** - PostgreSQL + Drizzle ORM for scalable content management
- **🤖 MCP Server** - Built-in MCP server for AI assistant article management
- **🔍 Search** - Client-side fuzzy search with Fuse.js
- **📧 Newsletter** - Email subscription system via Resend
- **📊 Analytics** - Privacy-friendly visitor tracking
- **🎨 Bento Grid** - Modern card-based responsive design
- **⚡ Hybrid Rendering** - SSR + static generation for optimal performance
- **🔒 Type-Safe** - Full TypeScript coverage
- **✅ Tested** - Playwright E2E + Vitest unit tests

## 🎯 Perfect For

- Developers wanting a modern, database-driven blog
- Content creators needing AI-powered management
- Teams requiring collaborative publishing workflows
- Anyone interested in MCP protocol integration

## 🚀 Quick Start

### Prerequisites

- Node.js 22+ (required for Astro 6)
- A [Neon](https://neon.tech) account (free tier available)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/cool-blog.git
cd cool-blog
npm install
```

### 2. Set Up Database

```bash
# Create a Neon project at https://neon.tech
# Get your connection string from Dashboard → Connection Details
```

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```bash
# Required
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Optional - for GitHub stats card
GITHUB_TOKEN=your_github_token

# Optional - for newsletter feature
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=newsletter@yourdomain.com

# Optional - for MCP article management
MCP_API_KEY=ckb_your_generated_key
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:4321`

## 📁 Project Structure

```
cool-blog/
├── src/
│   ├── components/          # React components
│   ├── config/              # Site configuration
│   ├── db/                  # Database schema & connection
│   ├── lib/                 # Utilities & helpers
│   │   ├── mcp/            # MCP server implementation
│   │   └── content/        # Content parsing & validation
│   └── pages/              # Astro pages & API routes
├── public/                  # Static assets
├── scripts/                 # Build & migration scripts
└── tests/                   # E2E tests
```

## 🔧 Key Technologies

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
| **Deployment** | Cloudflare Pages |

## 📖 Usage

### Adding Articles

Articles are stored in PostgreSQL and can be managed via:

1. **Database** - Direct SQL inserts
2. **MCP Server** - AI assistant integration
3. **API** - RESTful endpoints (with API key)

See [MCP_SETUP_GUIDE.md](MCP_SETUP_GUIDE.md) for MCP server details.

### Portfolio Management

Add `"Project"` tag to articles to feature them in the portfolio section. Use `"featured"` tag for prominent display.

### Newsletter

Visitors can subscribe via the modal form. Subscriptions are stored in PostgreSQL and managed via Resend.

## 🚢 Deployment

Cool Blog supports deployment to Zeabur or Cloudflare Pages. Both platforms support server-side rendering and database queries.

### Deploy to Zeabur

[Zeabur](https://zeabur.com) provides Node.js deployment with domestic China network optimization.

1. Push your code to GitHub
2. Create a new project on Zeabur
3. Configure environment variables:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `DEPLOY_PLATFORM`: Leave unset (defaults to Node.js)
4. Deploy!

Zeabur will automatically build and deploy your blog.

### Deploy to Cloudflare Pages

[Cloudflare Pages](https://pages.cloudflare.com) provides global edge deployment with Workers runtime.

1. Push your code to GitHub
2. Add environment variables in Cloudflare Pages:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `DEPLOY_PLATFORM`: `cloudflare`
3. Add GitHub repository to Cloudflare Pages
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions.

### Advanced: Multi-Region Setup

Configure intelligent DNS routing for optimal global performance. Domestic users route to Zeabur, international users route to Cloudflare Pages.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the complete multi-region deployment guide.

## 🧪 Testing

```bash
# Unit tests
npm run test:unit

# E2E tests
npm run test:e2e

# All tests
npm test
```

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Credits

Built by the open-source community

Special thanks to:
- [Astro](https://astro.build) - The web framework
- [Neon](https://neon.tech) - Serverless PostgreSQL
- [Cloudflare](https://cloudflare.com) - Hosting & deployment

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT.md)
- [MCP Server Setup](MCP_SETUP_GUIDE.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)

## 🌟 Show Your Support

If you find this project helpful, consider:
- ⭐ Starring it on GitHub
- 🐛 Reporting issues
- 💡 Suggesting features
- 📖 Improving documentation

---

**Note**: This is a personal blog template. Feel free to customize it for your needs!
