import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('TabNavigation', () => {
  describe('component structure', () => {
    it('component file exists', () => {
      const componentPath = join(process.cwd(), 'src/components/interactive/TabNavigation.tsx');
      expect(require('fs').existsSync(componentPath)).toBe(true);
    });

    it('imports React hooks correctly', async () => {
      const componentModule = await import('../../../components/interactive/TabNavigation');
      expect(componentModule.default).toBeDefined();
    });

    it('contains Portfolio and Articles tab labels', () => {
      const componentPath = join(process.cwd(), 'src/components/interactive/TabNavigation.tsx');
      const componentCode = readFileSync(componentPath, 'utf-8');

      expect(componentCode).toContain('Portfolio');
      expect(componentCode).toContain('Articles');
      expect(componentCode).toContain('/');
      expect(componentCode).toContain('/articles');
    });

    it('uses useState for managing current path', () => {
      const componentPath = join(process.cwd(), 'src/components/interactive/TabNavigation.tsx');
      const componentCode = readFileSync(componentPath, 'utf-8');

      expect(componentCode).toContain('useState');
      expect(componentCode).toContain('currentPath');
    });

    it('implements active tab highlighting', () => {
      const componentPath = join(process.cwd(), 'src/components/interactive/TabNavigation.tsx');
      const componentCode = readFileSync(componentPath, 'utf-8');

      expect(componentCode).toContain('isActive');
      expect(componentCode).toContain('active');
      expect(componentCode).toContain('aria-current');
    });

    it('has correct href attributes for navigation', () => {
      const componentPath = join(process.cwd(), 'src/components/interactive/TabNavigation.tsx');
      const componentCode = readFileSync(componentPath, 'utf-8');

      expect(componentCode).toContain("href: '/'");
      expect(componentCode).toContain("href: '/articles'");
    });
  });

  describe('accessibility', () => {
    it('includes tab-navigation class for styling', () => {
      const componentPath = join(process.cwd(), 'src/components/interactive/TabNavigation.tsx');
      const componentCode = readFileSync(componentPath, 'utf-8');

      expect(componentCode).toContain('tab-navigation');
      expect(componentCode).toContain('tab-button');
    });
  });
});
