import { test, expect } from '@playwright/test';

test('homepage renders the wordmark and tagline', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1.wordmark')).toBeVisible();
  await expect(page.getByText('Geschichten für den genaueren Blick.')).toBeVisible();
});

test('demo story renders hero, chapters and outro', async ({ page }) => {
  await page.goto('/stories/achtzehn-milliarden');
  await expect(page.locator('h1.hero__title')).toContainText('Achtzehn Milliarden');
  await expect(page.locator('#kapitel-01')).toBeVisible();
  await expect(page.locator('.outro__title')).toBeVisible();
});

test('health endpoint returns ok JSON', async ({ request }) => {
  const res = await request.get('/api/health');
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.status).toBe('ok');
  expect(body).toHaveProperty('timestamp');
  expect(body).toHaveProperty('environment');
});

test('404 page is intentionally designed', async ({ page }) => {
  const res = await page.goto('/diese-seite-gibt-es-nicht');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('404');
});
