import { test, expect } from '@playwright/test'

test.describe('RAFE Dashboard', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/RAFE/)
  })

  test('navigation is accessible', async ({ page }) => {
    await page.goto('/')
    // Add navigation tests as components are built
  })
})

test.describe('Authentication', () => {
  test.skip('redirects unauthenticated users to login', async ({ page }) => {
    // Will be enabled after auth is implemented
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/login/)
  })
})
