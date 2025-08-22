import { test, expect } from '@playwright/test'

test('should load the homepage', async ({ page }) => {
  await page.goto('/')
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle')
  
  // Check if the page title exists
  const title = await page.title()
  expect(title).toBeDefined()
  
  // Check if the page contains some content (adjust selector based on your app)
  const body = await page.locator('body')
  await expect(body).toBeVisible()
})
