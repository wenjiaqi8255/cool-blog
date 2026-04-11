# Contributing to Cool Blog

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to Cool Blog.

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn package manager
- Git
- A Neon account (for local database testing)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/cool-blog.git
   cd cool-blog
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Neon database URL:
   ```bash
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 📋 Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

### 2. Make Changes

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Keep commits atomic and focused

### 3. Test Your Changes

```bash
# Run unit tests
npm run test:unit

# Run E2E tests
npm run test:e2e

# Run all tests
npm test

# Type checking
npx tsc --noEmit
```

### 4. Commit Changes

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
feat: add dark mode toggle
fix: resolve mobile menu z-index issue
docs: update deployment instructions
refactor: simplify database connection logic
test: add tests for search functionality
chore: upgrade dependencies
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 📝 Pull Request Guidelines

### PR Title

Follow the Conventional Commits format:
```
feat: add search functionality
fix: mobile responsive issues
docs: improve README clarity
```

### PR Description

Include:
- **Summary** - What changes were made and why
- **Related Issues** - Link to any related issues
- **Testing** - How you tested the changes
- **Screenshots** - For UI changes (before/after)

### PR Checklist

- [ ] Tests pass locally
- [ ] New features include tests
- [ ] Documentation updated
- [ ] No console errors
- [ ] Responsive design verified (mobile, tablet, desktop)
- [ ] Code follows project style guidelines
- [ ] Commit messages follow Conventional Commits

## 🎨 Code Style Guidelines

### TypeScript

- Use explicit types for public APIs
- Avoid `any` - use `unknown` for untrusted input
- Prefer `interface` for object shapes that may be extended
- Use `type` for unions, intersections, and utility types

```typescript
// Good
interface User {
  id: string;
  name: string;
}

type UserRole = 'admin' | 'member';

function getUser(id: string): User | null {
  // ...
}

// Bad
function getUser(id: any): any {
  // ...
}
```

### React Components

- Use functional components with hooks
- Define props with explicit types
- Avoid `React.FC` unless necessary

```typescript
interface CardProps {
  title: string;
  onClick: () => void;
}

function Card({ title, onClick }: CardProps) {
  return <div onClick={onClick}>{title}</div>;
}
```

### Error Handling

- Always handle errors explicitly
- Provide user-friendly error messages in UI
- Log detailed error context on server side

```typescript
async function loadData() {
  try {
    const data = await fetchData();
    return data;
  } catch (error) {
    logger.error('Failed to load data', error);
    throw new Error('Unable to load data. Please try again later.');
  }
}
```

### Immutability

- Never mutate existing objects
- Create new objects with spread operator

```typescript
// Good
function updateUser(user: User, name: string): User {
  return { ...user, name };
}

// Bad
function updateUser(user: User, name: string): User {
  user.name = name; // MUTATION!
  return user;
}
```

## 🧪 Testing Guidelines

### Unit Tests

- Test business logic and utilities
- Mock external dependencies
- Aim for 80%+ coverage

```typescript
import { describe, it, expect } from 'vitest';

describe('slugify', () => {
  it('should convert spaces to hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should remove special characters', () => {
    expect(slugify('Hello, World!')).toBe('hello-world');
  });
});
```

### E2E Tests

- Test critical user flows
- Use Playwright for browser automation
- Test on multiple viewports

```typescript
import { test, expect } from '@playwright/test';

test('article page loads', async ({ page }) => {
  await page.goto('/articles/test-article');
  await expect(page.locator('h1')).toContainText('Test Article');
});
```

## 🐛 Bug Reports

### Before Creating a Bug Report

1. Check existing issues
2. Try to reproduce the bug
3. Gather relevant information

### Bug Report Template

```markdown
### Description
A clear description of the bug.

### Reproduction Steps
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

### Expected Behavior
What should happen.

### Actual Behavior
What actually happens.

### Screenshots
If applicable, add screenshots.

### Environment
- OS: [e.g. macOS 14.0]
- Browser: [e.g. Chrome 120]
- Node version: [e.g. 20.10.0]
- Project version: [e.g. 1.0.0]

### Additional Context
Logs, error messages, or other relevant info.
```

## 💡 Feature Requests

### Feature Request Template

```markdown
### Feature Description
A clear description of the proposed feature.

### Problem Statement
What problem does this solve? What pain points does it address?

### Proposed Solution
How should this be implemented?

### Alternatives Considered
What alternative approaches did you consider?

### Additional Context
Examples, mockups, or references to similar features.
```

## 📚 Documentation

### When to Update Documentation

- Adding new features
- Changing configuration options
- Modifying API endpoints
- Updating deployment process

### Documentation Style

- Use clear, concise language
- Provide code examples
- Include screenshots for UI features
- Keep it up-to-date with code changes

## 🤝 Community Guidelines

### Be Respectful

- Use inclusive language
- Respect different viewpoints
- Assume good intentions

### Constructive Feedback

- Focus on what is best for the community
- Show empathy towards other community members
- Accept constructive criticism

### Collaboration

- Work together to resolve conflicts
- Ask for help when needed
- Help others when you can

## 📧 Getting Help

- **GitHub Issues** - For bug reports and feature requests
- **GitHub Discussions** - For questions and ideas
- **Documentation** - Check existing docs first

## 🎯 Priority Labels

- `critical` - Blocks release, data loss, security issues
- `high` - Major functionality broken
- `medium` - Important but not blocking
- `low` - Nice to have, minor issues
- `enhancement` - New features or improvements

## ✨ Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Cool Blog! 🎉
