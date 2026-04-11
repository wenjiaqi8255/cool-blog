# Cool Blog Features

A comprehensive guide to what makes Cool Blog special and how to use its features.

## 🎨 Design Features

### Bento Grid Layout

Modern, card-based responsive design inspired by Apple's bento grids.

**Benefits:**
- Efficient use of screen space
- Visually organized content
- Mobile-first responsive design
- Smooth animations and transitions

**Customization:**
Edit `src/config/cards.ts` to adjust card sizes and layouts:

```typescript
export const cardConfigs = {
  // Adjust span for responsive behavior
  span: {
    mobile: 6,    // Full width on mobile
    tablet: 3,    // Half width on tablet
    desktop: 2    // Third width on desktop
  }
};
```

### Dark Theme

Beautiful dark mode by default with carefully chosen color palette.

**Color System:**
- Background: `#0a0a0a` (nearly black)
- Cards: `#141414` (dark gray)
- Text: `#e5e5e5` (off-white)
- Accents: Cyan and orange gradients

## 🚀 Technical Features

### Hybrid Rendering

Astro's hybrid rendering combines SSR and static generation for optimal performance.

**How it works:**
- Static pages: Pre-rendered at build time
- Dynamic pages: Server-side rendered on demand
- Client hydration: React components become interactive

**Benefits:**
- Fast initial page load
- SEO-friendly (content is server-rendered)
- Interactive features (search, modals)
- Efficient caching strategies

### Database-Driven Content

All content stored in PostgreSQL for scalability and flexibility.

**Advantages:**
- No build step required for content updates
- Easy content management
- Scalable to thousands of articles
- Advanced querying capabilities
- Real-time content updates

**Database Schema:**
```sql
articles table:
- id (primary key)
- slug (unique, URL-friendly)
- title
- content (markdown)
- published (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

## 🤖 MCP Server Integration

Unique feature: Built-in Model Context Protocol (MCP) server for AI-powered content management.

### What is MCP?

MCP is a protocol that allows AI assistants (like Claude) to interact with external tools and data sources.

### How It Works

1. **Start MCP Server**
   ```bash
   npm run dev  # MCP server runs on /api/mcp
   ```

2. **Configure AI Assistant**
   Add to Claude Desktop config (`~/.claude/claude_desktop_config.json`):
   ```json
   {
     "mcpServers": {
       "cool-blog": {
         "command": "node",
         "args": ["/path/to/cool-blog/src/mcp-stdio-wrapper.ts"],
         "env": {
           "MCP_API_KEY": "your-api-key",
           "DATABASE_URL": "your-database-url"
         }
       }
     }
   }
   ```

3. **Use Natural Language**
   ```
   You: Create a new article about TypeScript best practices
   Claude: I'll create that article for you...
   ```

### Available MCP Tools

- `create_article` - Create new articles
- `update_article` - Update existing articles
- `delete_article` - Remove articles
- `list_articles` - List all articles
- `get_article` - Get article by slug

### Security

- MCP_API_KEY required for all operations
- API key authentication
- No unauthorized access
- Audit logging available

See [MCP_SETUP_GUIDE.md](MCP_SETUP_GUIDE.md) for complete documentation.

## 🔍 Search Functionality

Client-side fuzzy search powered by Fuse.js.

### Features

- **Instant Results** - No server round-trips
- **Fuzzy Matching** - Finds results even with typos
- **Weighted Scoring** - Title matches ranked higher
- **Real-time** - Results update as you type

### Usage

Search bar appears on articles page. Start typing to filter articles.

### Customization

Edit `src/lib/search.ts` to adjust search parameters:

```typescript
const options = {
  keys: ['title', 'content', 'tags'],
  threshold: 0.3,        // Fuzziness (0 = exact, 1 = match anything)
  distance: 100,         // How far apart matches can be
  minMatchCharLength: 2, // Minimum characters to match
  includeScore: true,
  includeMatches: true
};
```

## 📧 Newsletter System

Built-in email subscription with Resend integration.

### Features

- **Subscription Modal** - Beautiful signup form
- **Email Validation** - Client-side + server-side validation
- **Database Storage** - Subscriptions stored in PostgreSQL
- **Privacy-First** - No third-party tracking

### Setup

1. Get Resend API key from https://resend.com/api-keys
2. Add to environment variables:
   ```bash
   RESEND_API_KEY=re_xxxxxxxxx
   RESEND_FROM_EMAIL=newsletter@yourdomain.com
   ```
3. Newsletter form is automatically enabled

### API Endpoints

- `POST /api/subscribe` - Subscribe to newsletter
- `GET /api/subscribers` - List subscribers (requires API key)
- `DELETE /api/unsubscribe` - Unsubscribe

## 📊 Analytics

Privacy-friendly visitor tracking without cookies or external scripts.

### Features

- **Visitor Counter** - Track page visits
- **Geolocation** - Country/city data (optional)
- **Referrer Tracking** - Know where traffic comes from
- **No Cookies** - Privacy-first approach

### Data Collected

- Page path
- Timestamp
- User agent (browser/device)
- Referrer (if any)
- IP address (hashed for privacy)

### API Endpoints

- `POST /api/track-visit` - Track page visit
- `GET /api/visitor-stats` - Get statistics (requires API key)

## 🎯 Portfolio Management

Automatically showcase projects from your blog articles.

### How It Works

Articles tagged with `"Project"` appear in the portfolio section.

### Features

- **Auto-Discovery** - Tag an article, it appears in portfolio
- **Featured Projects** - Use `"featured"` tag for prominent display
- **Image Extraction** - First image in article used as card image
- **Responsive Grid** - Adapts to screen size
- **Modal View** - Click to view full project details

### Configuration

Edit `src/config/portfolio.ts`:

```typescript
export const portfolioConfig = {
  tags: ['Project'],           // Tags that identify portfolio items
  featuredTag: 'featured',      // Tag for featured items
  itemsPerPage: 9,             // Items per page
  cacheDuration: 60            // Cache duration in seconds
};
```

## 🔧 Developer Experience

### TypeScript Throughout

Full type safety from database to frontend.

**Benefits:**
- Catch errors at compile time
- Better IDE autocomplete
- Self-documenting code
- Safer refactoring

### Testing Setup

Pre-configured testing with Playwright and Vitest.

**Run Tests:**
```bash
npm test              # All tests
npm run test:unit    # Unit tests only
npm run test:e2e     # E2E tests only
```

### Hot Module Replacement

Instant feedback during development with Astro HMR.

### ESLint & Prettier Ready

Code formatting and linting pre-configured (optional).

## 🌐 Deployment

### Cloudflare Pages

Optimized for Cloudflare Pages deployment.

**Features:**
- Automatic deployments from Git
- Preview deployments for pull requests
- Edge caching
- DDoS protection
- Free SSL certificates

**One-Command Deploy:**
```bash
npm run deploy
```

### Environment Variable Management

Easy configuration via Cloudflare Dashboard or `.env` files.

## 📈 Performance

### Optimized Assets

- Lazy-loaded images
- Font optimization (Inter & JetBrains Mono)
- CSS-in-JS with Tailwind CSS 4
- Automatic critical CSS extraction

### Caching Strategy

- Static assets cached for 1 year
- API responses cached for 60 seconds
- Database connection pooling
- Edge caching with Cloudflare

### Performance Metrics

Target metrics:
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms

## 🔒 Security Features

- **SQL Injection Prevention** - Parameterized queries via Drizzle ORM
- **XSS Protection** - DOMPurify sanitization
- **CSRF Protection** - Token validation
- **Input Validation** - Zod schema validation
- **Type Safety** - TypeScript coverage
- **Dependency Auditing** - Automated security scans

## 🎓 Learning Resources

Cool Blog is a great learning resource for:

- **Astro** - Modern web framework
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL** - Relational database
- **Drizzle ORM** - Modern database toolkit
- **MCP Protocol** - AI integration
- **Cloudflare Pages** - Edge deployment
- **Tailwind CSS 4** - Utility-first CSS

## 🚀 Getting Started

See [README.md](README.md) for quick start guide.

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT.md)
- [MCP Server Setup](MCP_SETUP_GUIDE.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)

---

**Have questions?** Open an issue on GitHub!
