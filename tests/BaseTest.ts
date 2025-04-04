import { test as base, expect, Page } from '@playwright/test'
import BasePage from '../model/pages/ecommerce/BasePage'

export const test = base.extend<{ open: Open }>({
  // When 'open' is called, baseUrl page will be opened
  // and a new Page object will be returned
  // Opens the baseURL, instantiates and returns a Page object
  open: async ({ page, context, baseURL }, use) => {
    await context.clearCookies()
    await page.goto(baseURL!)
    
    await use(openFactory(page))
  },
})

export type Open = <T extends BasePage>(type: new (page: Page) => T) => Promise<T>

export const openFactory =
  (page: Page) =>
  async <T extends BasePage>(type: new (page: Page) => T): Promise<T> =>
    await new type(page).init()

export { expect }
