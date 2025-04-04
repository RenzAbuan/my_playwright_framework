// @ts-check
import { defineConfig } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config()

// Environment profiles
const ENVIRONMENT_PROFILES: Record<
  string,
  {
    baseURL: string
  }
> = {
  qa: {
    baseURL: 'https://www.saucedemo.com/'
  },
  staging: {
    baseURL: ''
  },
  prod: {
    baseURL: ''
  }
}

const { PLAYWRIGHT_BASE_URL, PLAYWRIGHT_BROWSER, PLAYWRIGHT_HEADLESS, TEST_ENVIRONMENT } = readEnvironmentVariables()

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  timeout: 60000,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: PLAYWRIGHT_BASE_URL,
    browserName: PLAYWRIGHT_BROWSER,
    headless: PLAYWRIGHT_HEADLESS,
    screenshot: 'only-on-failure',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
});

function readEnvironmentVariables() {

  const PLAYWRIGHT_BROWSER: 'chromium'|'firefox'|'webkit' = process.env.PLAYWRIGHT_BROWSER
    ? process.env.PLAYWRIGHT_BROWSER as 'chromium'|'firefox'|'webkit' 
    : 'chromium';
  const PLAYWRIGHT_HEADLESS = process.env.PLAYWRIGHT_HEADLESS
    ? process.env.PLAYWRIGHT_HEADLESS!=='false'
    : true;
  const TEST_ENVIRONMENT: 'qa' | 'staging' | 'prod' = process.env.TEST_ENVIRONMENT
    ? process.env.TEST_ENVIRONMENT as 'qa' | 'staging' | 'prod'
    : 'qa'
  const PLAYWRIGHT_BASE_URL = ENVIRONMENT_PROFILES[TEST_ENVIRONMENT].baseURL
  
  return {PLAYWRIGHT_BASE_URL, PLAYWRIGHT_BROWSER, PLAYWRIGHT_HEADLESS, TEST_ENVIRONMENT}
}
