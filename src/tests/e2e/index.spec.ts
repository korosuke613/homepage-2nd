import { expect, test } from '@playwright/test';

test('meta is correct', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await expect(page).toHaveTitle('korosuke613');
});
