import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  timeout: 60 * 1000, // 1 minute per test
  retries: 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI ? [['github'], ['html']] : 'html',
  use: {
    trace: 'on-first-retry',
    testIdAttribute: 'data-element-id',
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...(isCI
          ? {
              // Using a deterministic viewport in CI because headless browsers have no real window,
              // so relying on “maximize” or defaults leads to inconsistent and often small viewports.
              viewport: { width: 1920, height: 1080 },
              launchOptions: {
                args: ['--window-size=1920,1080', '--force-device-scale-factor=1'],
              },
            }
          : {
              viewport: null,
              launchOptions: {
                args: ['--start-maximized'],
              },
            }),
      },
    },
    // Disabling these browsers for now, as they increase CI time significantly.
    ...(!isCI
      ? [
          {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
          },
          {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
          },
        ]
      : []),

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'VITE_APP_ENV=CI yarn dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !isCI,
    timeout: 120 * 1000,
  },
});
