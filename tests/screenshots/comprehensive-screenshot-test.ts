import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import path from 'path';

// Comprehensive screenshot configuration
const SCREENSHOT_CONFIG = {
  // Device viewports
  devices: [
    { name: 'desktop', width: 1920, height: 1080 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 667 },
  ],

  // All application routes from App.tsx analysis
  routes: [
    // Public routes
    { path: '/', name: 'home' },
    { path: '/menu', name: 'menu-publico' },
    { path: '/reserva', name: 'reserva-online' },
    { path: '/sprint3-demo', name: 'sprint3-demo' },

    // Client routes (with dynamic mesa ID)
    { path: '/checkin', name: 'checkin-qr' },
    { path: '/chegada-sem-reserva', name: 'chegada-sem-reserva' },
    { path: '/mesa/1/pin', name: 'mesa-pin' },
    { path: '/mesa/1/cardapio', name: 'mesa-cardapio' },
    { path: '/mesa/1/acompanhar', name: 'mesa-acompanhar' },
    { path: '/mesa/1/pagamento', name: 'mesa-pagamento' },
    { path: '/mesa/1/feedback', name: 'mesa-feedback' },

    // Auth routes
    { path: '/login', name: 'login' },
    { path: '/admin/login', name: 'admin-login' },

    // Admin routes (will require authentication handling)
    { path: '/admin', name: 'admin-dashboard' },
    { path: '/admin/dashboard', name: 'admin-dashboard-explicit' },
    { path: '/admin/recepcao', name: 'admin-recepcao' },
    { path: '/admin/garcom', name: 'admin-garcom' },
    { path: '/admin/cozinha', name: 'admin-cozinha' },
    { path: '/admin/caixa', name: 'admin-caixa' },
    { path: '/admin/gerencia', name: 'admin-gerencia' },
    { path: '/admin/acesso-negado', name: 'admin-acesso-negado' },
  ],

  baseUrl: 'http://localhost:3000',
  screenshotDir: 'screenshots/screen-now',
};

class ComprehensiveScreenshotTester {
  private browser: Browser;
  private context: BrowserContext;
  private page: Page;
  private currentDevice: string = '';

  constructor(browser: Browser, context: BrowserContext, page: Page) {
    this.browser = browser;
    this.context = context;
    this.page = page;
  }

  async takeScreenshotForRoute(
    route: { path: string; name: string },
    device: { name: string; width: number; height: number }
  ) {
    try {
      // Set viewport for device
      await this.page.setViewportSize({ width: device.width, height: device.height });

      // Navigate to route
      await this.page.goto(`${SCREENSHOT_CONFIG.baseUrl}${route.path}`, {
        waitUntil: 'networkidle',
        timeout: 10000,
      });

      // Wait for potential loading animations
      await this.page.waitForTimeout(2000);

      // Handle authentication redirects for admin routes
      if (route.path.startsWith('/admin') && this.page.url().includes('/login')) {
        console.log(
          `Admin route ${route.path} redirected to login - taking login screenshot instead`
        );
        const filename = `${route.name}-redirected-to-login-${device.name}.png`;
        await this.page.screenshot({
          path: path.join(SCREENSHOT_CONFIG.screenshotDir, filename),
          fullPage: true,
        });
        return { success: true, filename, redirected: true };
      }

      // Take screenshot
      const filename = `${route.name}-${device.name}.png`;
      await this.page.screenshot({
        path: path.join(SCREENSHOT_CONFIG.screenshotDir, filename),
        fullPage: true,
      });

      console.log(`✅ Screenshot saved: ${filename}`);
      return { success: true, filename, redirected: false };
    } catch (error) {
      console.error(`❌ Error taking screenshot for ${route.path} on ${device.name}:`, error);
      return { success: false, error: error.message, route: route.path, device: device.name };
    }
  }

  async captureInteractiveStates(
    route: { path: string; name: string },
    device: { name: string; width: number; height: number }
  ) {
    try {
      await this.page.setViewportSize({ width: device.width, height: device.height });
      await this.page.goto(`${SCREENSHOT_CONFIG.baseUrl}${route.path}`, {
        waitUntil: 'networkidle',
        timeout: 10000,
      });
      await this.page.waitForTimeout(1000);

      // Capture different interactive states
      const states = [];

      // 1. Default state
      let filename = `${route.name}-${device.name}-default.png`;
      await this.page.screenshot({
        path: path.join(SCREENSHOT_CONFIG.screenshotDir, filename),
        fullPage: true,
      });
      states.push({ state: 'default', filename });

      // 2. Try to find and hover over interactive elements
      const interactiveElements = await this.page
        .locator('button, a, input, select, [role="button"]')
        .all();
      if (interactiveElements.length > 0) {
        await interactiveElements[0].hover();
        await this.page.waitForTimeout(500);
        filename = `${route.name}-${device.name}-hover.png`;
        await this.page.screenshot({
          path: path.join(SCREENSHOT_CONFIG.screenshotDir, filename),
          fullPage: true,
        });
        states.push({ state: 'hover', filename });
      }

      // 3. Try to focus on form elements
      const formElements = await this.page.locator('input, textarea, select').all();
      if (formElements.length > 0) {
        await formElements[0].focus();
        await this.page.waitForTimeout(500);
        filename = `${route.name}-${device.name}-focused.png`;
        await this.page.screenshot({
          path: path.join(SCREENSHOT_CONFIG.screenshotDir, filename),
          fullPage: true,
        });
        states.push({ state: 'focused', filename });
      }

      return { success: true, states };
    } catch (error) {
      console.error(`❌ Error capturing interactive states for ${route.path}:`, error);
      return { success: false, error: error.message };
    }
  }
}

test.describe('Comprehensive Screenshot Test Suite', () => {
  let screenshotTester: ComprehensiveScreenshotTester;

  test.beforeAll(async ({ browser }) => {
    // Ensure screenshot directory exists
    const fs = require('fs');
    if (!fs.existsSync(SCREENSHOT_CONFIG.screenshotDir)) {
      fs.mkdirSync(SCREENSHOT_CONFIG.screenshotDir, { recursive: true });
    }
  });

  test.beforeEach(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    screenshotTester = new ComprehensiveScreenshotTester(browser, context, page);
  });

  // Test each route on each device
  for (const device of SCREENSHOT_CONFIG.devices) {
    for (const route of SCREENSHOT_CONFIG.routes) {
      test(`Screenshot: ${route.name} on ${device.name}`, async () => {
        const result = await screenshotTester.takeScreenshotForRoute(route, device);
        expect(result.success).toBe(true);

        if (!result.success) {
          console.error(`Failed to capture ${route.name} on ${device.name}:`, result.error);
        }
      });
    }
  }

  // Special test for interactive states on key pages
  test('Interactive States - Homepage', async () => {
    for (const device of SCREENSHOT_CONFIG.devices) {
      const result = await screenshotTester.captureInteractiveStates(
        { path: '/', name: 'home-interactive' },
        device
      );
      expect(result.success).toBe(true);
    }
  });

  test('Interactive States - Menu', async () => {
    for (const device of SCREENSHOT_CONFIG.devices) {
      const result = await screenshotTester.captureInteractiveStates(
        { path: '/menu', name: 'menu-interactive' },
        device
      );
      expect(result.success).toBe(true);
    }
  });

  test('Interactive States - Reserva', async () => {
    for (const device of SCREENSHOT_CONFIG.devices) {
      const result = await screenshotTester.captureInteractiveStates(
        { path: '/reserva', name: 'reserva-interactive' },
        device
      );
      expect(result.success).toBe(true);
    }
  });
});

// Utility test to generate comprehensive summary
test('Generate Screenshot Summary Report', async ({ page }) => {
  const fs = require('fs');
  const reportPath = path.join(SCREENSHOT_CONFIG.screenshotDir, 'SCREENSHOT_REPORT.md');

  let report = `# ChefORG Screenshot Report\n\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;
  report += `## Coverage Summary\n\n`;
  report += `- **Total Routes**: ${SCREENSHOT_CONFIG.routes.length}\n`;
  report += `- **Device Types**: ${SCREENSHOT_CONFIG.devices.length} (Desktop, Tablet, Mobile)\n`;
  report += `- **Total Screenshots**: ${SCREENSHOT_CONFIG.routes.length * SCREENSHOT_CONFIG.devices.length}\n\n`;

  report += `## Device Specifications\n\n`;
  for (const device of SCREENSHOT_CONFIG.devices) {
    report += `- **${device.name}**: ${device.width}x${device.height}px\n`;
  }
  report += `\n`;

  report += `## Routes Captured\n\n`;
  for (const route of SCREENSHOT_CONFIG.routes) {
    report += `### ${route.name}\n`;
    report += `- **Path**: \`${route.path}\`\n`;
    for (const device of SCREENSHOT_CONFIG.devices) {
      const filename = `${route.name}-${device.name}.png`;
      report += `- **${device.name}**: \`${filename}\`\n`;
    }
    report += `\n`;
  }

  fs.writeFileSync(reportPath, report);
  console.log(`📊 Screenshot report generated: ${reportPath}`);
});
