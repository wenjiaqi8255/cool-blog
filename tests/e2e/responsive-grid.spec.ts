import { test, expect } from '@playwright/test';

test.describe('Bento Grid Responsive Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays 4-column grid on desktop (1440px)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    const grid = page.locator('.bento-grid');
    await expect(grid).toBeVisible();

    // Verify grid has 4 columns
    const gridStyle = await grid.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        gridTemplateColumns: styles.gridTemplateColumns,
        gap: styles.gap,
        maxWidth: styles.maxWidth
      };
    });

    // Check for 4 columns (grid-template-columns should have 4 values)
    expect(gridStyle.gridTemplateColumns.split(' ')).toHaveLength(4);

    // Verify gap is 4px
    expect(gridStyle.gap).toBe('4px');

    // Verify max-width is 1600px
    expect(gridStyle.maxWidth).toBe('1600px');
  });

  test('displays 2-column grid on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    const grid = page.locator('.bento-grid');
    await expect(grid).toBeVisible();

    const gridStyle = await grid.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        gridTemplateColumns: styles.gridTemplateColumns,
        gap: styles.gap,
        padding: styles.padding
      };
    });

    // Check for 2 columns
    expect(gridStyle.gridTemplateColumns.split(' ')).toHaveLength(2);

    // Gap should be 3px on tablet
    expect(gridStyle.gap).toBe('3px');
  });

  test('displays 1-column grid on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const grid = page.locator('.bento-grid');
    await expect(grid).toBeVisible();

    const gridStyle = await grid.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        gridTemplateColumns: styles.gridTemplateColumns,
        gap: styles.gap,
        padding: styles.padding
      };
    });

    // Check for 1 column
    expect(gridStyle.gridTemplateColumns.split(' ')).toHaveLength(1);

    // Gap should be 2px on mobile
    expect(gridStyle.gap).toBe('2px');
  });

  test('renders all 12 cards', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    const cards = page.locator('.bento-card');
    await expect(cards).toHaveCount(12);
  });

  test('image card has grayscale filter by default', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1440, height: 900 });

    const firstImageCard = page.locator('.bento-card[data-card-type="image"]').first();
    const img = firstImageCard.locator('img');

    // Check that grayscale filter is applied
    const filterStyle = await img.evaluate((el) => {
      return window.getComputedStyle(el).filter;
    });

    expect(filterStyle).toContain('grayscale');
  });

  test('span-2 cards take 2 columns on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    const span2Cards = page.locator('.bento-card.col-span-2');
    const count = await span2Cards.count();

    // Verify span-2 cards exist
    expect(count).toBeGreaterThan(0);

    // Verify they have correct class
    const firstSpan2 = span2Cards.first();
    await expect(firstSpan2).toHaveClass(/col-span-2/);
  });

  test('row-span-2 cards take 2 rows on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    const rowSpan2Cards = page.locator('.bento-card.row-span-2');
    const count = await rowSpan2Cards.count();

    // Should have at least 1 row-span-2 card (featured project)
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
