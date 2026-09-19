const { defineConfig } = require("@playwright/test");

const fullAudit = process.env.VISUAL_FULL === "1";

const representative = [
  { name: "desktop-1440", viewport: { width: 1440, height: 900 } },
  { name: "tablet-768", viewport: { width: 768, height: 1024 } },
  { name: "mobile-390", viewport: { width: 390, height: 844 } }
];

const fullMatrix = [
  { name: "desktop-1440", viewport: { width: 1440, height: 900 } },
  { name: "desktop-1280", viewport: { width: 1280, height: 800 } },
  { name: "tablet-1024", viewport: { width: 1024, height: 900 } },
  { name: "tablet-768", viewport: { width: 768, height: 1024 } },
  { name: "mobile-430", viewport: { width: 430, height: 932 } },
  { name: "mobile-390", viewport: { width: 390, height: 844 } },
  { name: "mobile-375", viewport: { width: 375, height: 812 } }
];

module.exports = defineConfig({
  testDir: "./tests/visual",
  outputDir: "test-results/visual",
  timeout: 30000,
  expect: {
    timeout: 7500,
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.003,
      threshold: 0.2
    }
  },
  fullyParallel: false,
  workers: process.env.CI ? 2 : 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ["line"],
    ["html", { outputFolder: "playwright-report", open: "never" }]
  ],
  use: {
    baseURL: "http://127.0.0.1:4173/website/",
    colorScheme: "dark",
    reducedMotion: "reduce",
    screenshot: "only-on-failure",
    trace: "retain-on-failure"
  },
  webServer: {
    command: "node scripts/visual-server.cjs",
    url: "http://127.0.0.1:4173/website/",
    reuseExistingServer: !process.env.CI,
    timeout: 20000
  },
  projects: (fullAudit ? fullMatrix : representative).map(project => ({
    name: project.name,
    use: { viewport: project.viewport }
  }))
});
