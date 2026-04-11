# Quick Start Guide

Get Cool Blog up and running in 5 minutes!

## 🎯 Prerequisites

Make sure you have:
- **Node.js 20+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **A code editor** - VS Code recommended

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/cool-blog.git
cd cool-blog
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages (~2-3 minutes).

## 🗄️ Database Setup (Required)

### Create a Free Neon Database

1. Go to [https://neon.tech](https://neon.tech)
2. Click **"Sign up"** (or log in)
3. Click **"Create a project"**
4. Choose **Free tier** (no credit card needed)
5. Select a region close to you
6. Click **"Create project"**

### Get Your Connection String

1. In Neon Dashboard, find your project
2. Click **"Connection Details"** tab
3. Copy the **Connection string** (looks like `postgresql://...`)
4. It should end with `?sslmode=require`

**Example:**
```
postgresql://postgres:YOUR_PASSWORD@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

⚠️ **Note**: This is just an example format. Replace with your actual connection string from Neon Dashboard.

## ⚙️ Configuration

### Set Up Environment Variables

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`** and add your database URL:
   ```bash
   # Required
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   
   # Optional - for GitHub stats
   # GITHUB_TOKEN=your_github_token
   
   # Optional - for newsletter
   # RESEND_API_KEY=re_xxxxx
   ```

3. **Save the file**

## 🚀 Start Development Server

```bash
npm run dev
```

You should see:
```
➜  Local:   http://localhost:4321/
➜  Network: use --host to expose
```

## 🎉 Visit Your Blog

Open [http://localhost:4321](http://localhost:4321) in your browser!

## ✅ What's Next?

### Add Your First Article

You can add articles via:

**Option 1: Direct Database Insert**
```bash
# Use any PostgreSQL client
psql $DATABASE_URL

INSERT INTO articles (slug, title, content, published)
VALUES ('my-first-article', 'My First Article', '# Hello World\n\nThis is my first article!', true);
```

**Option 2: MCP Server (AI-Powered)**

See [MCP_SETUP_GUIDE.md](MCP_SETUP_GUIDE.md) for how to use AI assistants to write articles.

**Option 3: API (Coming Soon)**

We're working on a REST API for article management.

## 🎨 Customize Your Blog

### Change Site Name & Branding

Edit `src/config/content.ts`:

```typescript
export const pages = {
  home: {
    title: 'YOUR NAME | BUILDING SOMETHING FUN',
    brandTitle: 'YOUR NAME',
    // ...
  }
};
```

### Update Colors

Edit `src/styles/global.css` - look for the `:root` section.

### Add Your Own Articles

See the "Add Your First Article" section above.

## 📦 Deploy to Production

### Deploy to Cloudflare Pages (Free)

1. **Install Wrangler CLI:**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare:**
   ```bash
   wrangler login
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

Your site will be live at `https://cool-blog.pages.dev`

**See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.**

## 🆘 Troubleshooting

### "Database connection failed"

**Solution:**
- Check your `DATABASE_URL` is correct
- Make sure it ends with `?sslmode=require`
- Verify Neon project is active (not suspended)

### "Module not found" error

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 4321 already in use

**Solution:**
```bash
# Kill the process using port 4321
npx kill-port 4321

# Or use a different port
npm run dev -- --port 4322
```

### Build errors

**Solution:**
```bash
# Clean build
rm -rf .astro dist
npm run dev
```

## 📚 Learn More

- [Full Documentation](README.md)
- [Feature Overview](FEATURES.md)
- [Deployment Guide](DEPLOYMENT.md)
- [MCP Server Setup](MCP_SETUP_GUIDE.md)

## 🤝 Need Help?

- **GitHub Issues**: [Report a problem](https://github.com/your-username/cool-blog/issues)
- **GitHub Discussions**: [Ask a question](https://github.com/your-username/cool-blog/discussions)
- **Documentation**: Check the `docs/` folder

---

**Congratulations!** 🎉 You now have a modern, database-driven blog running locally!

**Next step:** Deploy it to the world with `npm run deploy`
