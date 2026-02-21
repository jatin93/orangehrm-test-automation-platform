import { defineConfig, devices } from '@playwright/test';
import { ENV } from './config/environment';

export default defineConfig({
  testDir: './tests',
  timeout: ENV.TEST_TIMEOUT,
  expect: { timeout: ENV.EXPECT_TIMEOUT },

  forbidOnly: ENV.IS_CI,
  retries: ENV.IS_CI ? 2 : ENV.RETRY_COUNT,
  workers: ENV.IS_CI ? 1 : undefined,
  fullyParallel: false,

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],

  ],

  outputDir: 'test-results',

  use: {
    baseURL: ENV.BASE_URL,
    headless: ENV.HEADLESS,
    screenshot: 'only-on-failure',
    video: ENV.VIDEO_ON_FAILURE,
    trace: ENV.TRACE_ON_FAILURE,
    navigationTimeout: ENV.NAVIGATION_TIMEOUT,
    actionTimeout: ENV.DEFAULT_TIMEOUT,
    launchOptions: {
      slowMo: ENV.SLOW_MO,
    },
  },

  projects: [
    {
      name: 'ui-tests',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        // headless is inherited from global use.headless (ENV.HEADLESS)
        // Override via CLI: --headed or set HEADLESS=false in .env
      },
    },
    {
      name: 'api-tests',
      testDir: './tests/api',
      use: {
        // API tests don't need a visible browser, always run headless
        headless: true,
      },
    },
  ],
});
