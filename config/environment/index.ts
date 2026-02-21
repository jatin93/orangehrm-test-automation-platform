import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

export const ENV = {
  BASE_URL: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com',
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'Admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',

  API_BASE_URL:
    process.env.API_BASE_URL ||
    'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2',

  HEADLESS: process.env.HEADLESS !== 'false',
  BROWSER: (process.env.BROWSER || 'chromium') as 'chromium' | 'firefox' | 'webkit',
  SLOW_MO: Number(process.env.SLOW_MO ?? 0),

  TEST_TIMEOUT: Number(process.env.TEST_TIMEOUT ?? 180_000),
  DEFAULT_TIMEOUT: Number(process.env.DEFAULT_TIMEOUT ?? 30_000),
  NAVIGATION_TIMEOUT: Number(process.env.NAVIGATION_TIMEOUT ?? 45_000),
  EXPECT_TIMEOUT: Number(process.env.EXPECT_TIMEOUT ?? 10_000),

  RETRY_COUNT: Number(process.env.RETRY_COUNT ?? 1),

  VIDEO_ON_FAILURE: (process.env.VIDEO_ON_FAILURE || 'retain-on-failure') as
    | 'off'
    | 'on'
    | 'retain-on-failure'
    | 'on-first-retry',
  TRACE_ON_FAILURE: (process.env.TRACE_ON_FAILURE || 'retain-on-failure') as
    | 'off'
    | 'on'
    | 'retain-on-failure'
    | 'on-first-retry',

  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  IS_CI: !!process.env.CI,
} as const;
