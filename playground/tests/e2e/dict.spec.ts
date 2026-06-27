import { test, expect } from '@playwright/test';

test('page title renders', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('功能演示');
});

test('dict translations appear after client load', async ({ page }) => {
  await page.goto('/vanilla/basic');

  // Wait for loading state to disappear and translations to appear
  const maleText = page.locator('text=男').first();
  await maleText.waitFor({ state: 'visible', timeout: 10000 });

  const femaleText = page.locator('text=女').first();
  await expect(femaleText).toBeVisible();
});

test('dict options show in status section', async ({ page }) => {
  await page.goto('/element-plus/tags');

  // Wait for status section to load — use el-tag class to avoid hidden select options
  const disableTag = page.locator('.el-tag:has-text("禁用")').first();
  await disableTag.waitFor({ state: 'visible', timeout: 10000 });
  await expect(page.locator('.el-tag:has-text("启用")').first()).toBeVisible();
});

test('tree dict shows path backtracking', async ({ page }) => {
  await page.goto('/vanilla/tree');

  // Wait for tree data to load, then click a findPath button
  await page.locator('button:has-text("440104")').waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('button:has-text("440104")').click();

  // Find the path result paragraph (avoids Unicode arrow matching issues)
  await page.getByText(/广东.*广州.*越秀区/u).waitFor({ state: 'visible', timeout: 10000 });
});

test('mock dict API returns correct data', async ({ request }) => {
  const response = await request.get('/api/dict/list?types=gender&locale=zh-CN');
  expect(response.status()).toBe(200);

  const data = await response.json();
  expect(data.data.gender.type).toBe('gender');
  expect(data.data.gender.items).toHaveLength(3);
  expect(data.data.gender.items[0]).toEqual({ value: 'male', label: '男' });
});

test('mock version API returns version', async ({ request }) => {
  const response = await request.get('/api/dict/version?locale=zh-CN');
  expect(response.status()).toBe(200);
  expect((await response.json()).version).toBe('1.0.0');
});

test('language switcher buttons exist', async ({ page }) => {
  await page.goto('/vanilla/locale');
  await expect(page.locator('button:has-text("中文")')).toBeVisible();
  await expect(page.locator('button:has-text("English")')).toBeVisible();
});
