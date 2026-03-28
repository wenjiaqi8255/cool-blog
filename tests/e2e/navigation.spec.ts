import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('Portfolio tab is active on home page', async ({ page }) => {
    await page.goto('/');

    const portfolioTab = page.getByRole('link', { name: 'Portfolio' });
    await expect(portfolioTab).toHaveClass(/active/);
  });

  test('Articles tab is active on articles page', async ({ page }) => {
    await page.goto('/articles');

    const articlesTab = page.getByRole('link', { name: 'Articles' });
    await expect(articlesTab).toHaveClass(/active/);
  });

  test('clicking Articles tab navigates to articles page', async ({ page }) => {
    await page.goto('/');

    const articlesTab = page.getByRole('link', { name: 'Articles' });
    await articlesTab.click();

    await expect(page).toHaveURL('/articles');
  });

  test('clicking Portfolio tab navigates to home page', async ({ page }) => {
    await page.goto('/articles');

    const portfolioTab = page.getByRole('link', { name: 'Portfolio' });
    await portfolioTab.click();

    await expect(page).toHaveURL('/');
  });
});

test.describe('Subscribe Modal', () => {
  test('opens subscribe modal on button click', async ({ page }) => {
    await page.goto('/');

    const subscribeButton = page.getByRole('button', { name: 'Subscribe' });
    await subscribeButton.click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    const modalTitle = page.getByText('Subscribe to the newsletter');
    await expect(modalTitle).toBeVisible();
  });

  test('closes modal on close button click', async ({ page }) => {
    await page.goto('/');

    // Open modal
    const subscribeButton = page.getByRole('button', { name: 'Subscribe' });
    await subscribeButton.click();

    // Close modal
    const closeButton = page.getByRole('button', { name: 'Close modal' });
    await closeButton.click();

    const modal = page.getByRole('dialog');
    await expect(modal).not.toBeVisible();
  });

  test('closes modal on Escape key', async ({ page }) => {
    await page.goto('/');

    // Open modal
    const subscribeButton = page.getByRole('button', { name: 'Subscribe' });
    await subscribeButton.click();

    // Press Escape
    await page.keyboard.press('Escape');

    const modal = page.getByRole('dialog');
    await expect(modal).not.toBeVisible();
  });

  test('closes modal on overlay click', async ({ page }) => {
    await page.goto('/');

    // Open modal
    const subscribeButton = page.getByRole('button', { name: 'Subscribe' });
    await subscribeButton.click();

    // Click overlay (outside modal content)
    const overlay = page.locator('.modal-overlay');
    await overlay.click({ position: { x: 10, y: 10 } });

    const modal = page.getByRole('dialog');
    await expect(modal).not.toBeVisible();
  });

  test('email input has correct placeholder', async ({ page }) => {
    await page.goto('/');

    const subscribeButton = page.getByRole('button', { name: 'Subscribe' });
    await subscribeButton.click();

    const emailInput = page.getByPlaceholder('your@email.com');
    await expect(emailInput).toBeVisible();
  });
});

test.describe('Touch Targets (Accessibility)', () => {
  test('all interactive elements have 44px minimum touch targets', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check tab buttons
    const tabButtons = page.locator('.tab-button');
    const tabCount = await tabButtons.count();

    for (let i = 0; i < tabCount; i++) {
      const button = tabButtons.nth(i);
      const box = await button.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
      expect(box?.width).toBeGreaterThanOrEqual(44);
    }

    // Check subscribe button
    const subscribeButton = page.getByRole('button', { name: 'Subscribe' });
    const subscribeBox = await subscribeButton.boundingBox();
    expect(subscribeBox?.height).toBeGreaterThanOrEqual(44);
    expect(subscribeBox?.width).toBeGreaterThanOrEqual(44);

    // Open modal and check modal elements
    await subscribeButton.click();

    const emailInput = page.getByPlaceholder('your@email.com');
    const inputBox = await emailInput.boundingBox();
    expect(inputBox?.height).toBeGreaterThanOrEqual(44);

    const submitButton = page.locator('.modal-submit');
    const submitBox = await submitButton.boundingBox();
    expect(submitBox?.height).toBeGreaterThanOrEqual(44);

    const closeButton = page.getByRole('button', { name: 'Close modal' });
    const closeBox = await closeButton.boundingBox();
    expect(closeBox?.height).toBeGreaterThanOrEqual(44);
    expect(closeBox?.width).toBeGreaterThanOrEqual(44);
  });
});
