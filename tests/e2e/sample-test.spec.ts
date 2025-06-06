import { test, expect } from '@playwright/test';

test('should display welcome message', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page.getByText('Learn AWS IAM in a fun way')).toBeVisible();
});
