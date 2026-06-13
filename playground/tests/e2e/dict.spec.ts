import { test, expect } from '@playwright/test'

test('page title renders', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('Playground')
})

test('dict translations appear after client load', async ({ page }) => {
  await page.goto('/')

  // Wait for loading state to disappear and translations to appear
  const maleText = page.locator('text=男').first()
  await maleText.waitFor({ state: 'visible', timeout: 10000 })

  const femaleText = page.locator('text=女').first()
  await expect(femaleText).toBeVisible()
})

test('dict options show in status section', async ({ page }) => {
  await page.goto('/')

  // Wait for status section to load
  const disableTag = page.locator('text=禁用').first()
  await disableTag.waitFor({ state: 'visible', timeout: 10000 })
  await expect(page.locator('text=启用').first()).toBeVisible()
})

test('tree dict shows path backtracking', async ({ page }) => {
  await page.goto('/')

  // Wait for tree data to load
  const pathText = page.locator('text=广东 / 广州 / 越秀区')
  await pathText.waitFor({ state: 'visible', timeout: 10000 })
})

test('mock dict API returns correct data', async ({ request }) => {
  const response = await request.get('/api/dict/list?types=gender&locale=zh-CN')
  expect(response.status()).toBe(200)

  const data = await response.json()
  expect(data.version).toBe('1.0.0')
  expect(data.data.gender.items).toHaveLength(3)
  expect(data.data.gender.items[0]).toEqual({ code: 'male', label: '男' })
})

test('mock version API returns version', async ({ request }) => {
  const response = await request.get('/api/dict/version?locale=zh-CN')
  expect(response.status()).toBe(200)
  expect((await response.json()).version).toBe('1.0.0')
})

test('language switcher buttons exist', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('button:has-text("中文")')).toBeVisible()
  await expect(page.locator('button:has-text("English")')).toBeVisible()
})
