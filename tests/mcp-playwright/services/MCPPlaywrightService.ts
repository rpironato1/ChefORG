import { Page, Browser, BrowserContext } from '@playwright/test';
import { MCPTestConfig, TestMetrics, RouteTest, PerformanceMetrics } from '../types';

/**
 * MCP Playwright Core Service
 * Autonomous test execution with self-healing capabilities
 */
export class MCPPlaywrightService {
  private page: Page | null = null;
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private config: MCPTestConfig;
  private metrics: TestMetrics;

  constructor(config: MCPTestConfig) {
    this.config = config;
    this.metrics = {
      coverage: 0,
      wcag_score: 0,
      errors: [],
      routes_tested: [],
      execution_time: 0,
      performance: {
        network: [],
        console: [],
        wcag_violations: [],
        performance_score: 0
      }
    };
  }

  /**
   * Initialize test environment with autonomous configuration
   */
  async initializeTestEnvironment(browser: Browser): Promise<string> {
    try {
      this.browser = browser;
      this.context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        recordVideo: { dir: 'test-results/videos/' },
        recordHar: { path: 'test-results/network.har' }
      });

      this.page = await this.context.newPage();

      // Setup viewports for responsive testing
      const viewports = [
        { width: 1920, height: 1080, device: "desktop" },
        { width: 768, height: 1024, device: "tablet" },
        { width: 375, height: 667, device: "mobile" }
      ];

      for (const vp of viewports) {
        await this.page.setViewportSize({ width: vp.width, height: vp.height });
        await this.page.waitForTimeout(1000); // Allow time for responsive adjustments
      }

      // Reset to desktop view
      await this.page.setViewportSize({ width: 1920, height: 1080 });

      // Setup console monitoring
      this.page.on('console', (msg) => {
        this.metrics.performance.console.push({
          level: msg.type() as any,
          message: msg.text(),
          timestamp: Date.now()
        });
      });

      // Setup network monitoring
      this.page.on('response', (response) => {
        this.metrics.performance.network.push({
          url: response.url(),
          method: response.request().method(),
          status: response.status(),
          time: Date.now(),
          size: 0 // Will be calculated separately
        });
      });

      return "INITIALIZATION_COMPLETE";
    } catch (error) {
      this.metrics.errors.push(error as Error);
      throw error;
    }
  }

  /**
   * Discover application routes automatically
   */
  async discoverApplicationRoutes(): Promise<RouteTest[]> {
    if (!this.page) throw new Error('Page not initialized');

    const routes: RouteTest[] = [];
    
    try {
      // Navigate to home page
      await this.page.goto('/');
      await this.page.waitForLoadState('networkidle');

      // Extract routes from navigation elements, links, and buttons
      const routeLinks = await this.page.$$eval('a[href], button[data-route]', (elements) => {
        return elements
          .map(el => {
            if (el.tagName === 'A') {
              return (el as HTMLAnchorElement).getAttribute('href');
            } else {
              return (el as HTMLButtonElement).getAttribute('data-route');
            }
          })
          .filter(href => href && href.startsWith('/') && !href.includes('#'))
          .filter((href, index, array) => array.indexOf(href) === index); // Remove duplicates
      });

      // Add common routes
      const commonRoutes = [
        '/',
        '/menu',
        '/reservations', 
        '/orders',
        '/admin',
        '/login',
        '/profile'
      ];

      const allRoutes = [...new Set([...routeLinks, ...commonRoutes])];

      // Test each route
      for (const route of allRoutes) {
        try {
          await this.page.goto(route);
          await this.page.waitForLoadState('networkidle');
          
          // Capture console errors
          const consoleErrors = this.metrics.performance.console
            .filter(msg => msg.level === 'error')
            .filter(msg => msg.timestamp > Date.now() - 5000); // Last 5 seconds

          const routeTest: RouteTest = {
            url: route,
            wcag_passed: await this.validateBasicWCAG(),
            console_errors: consoleErrors,
            performance_score: await this.calculatePerformanceScore()
          };

          routes.push(routeTest);
        } catch (error) {
          routes.push({
            url: route,
            wcag_passed: false,
            console_errors: [{ level: 'error', message: (error as Error).message, timestamp: Date.now() }],
            performance_score: 0
          });
        }
      }

      this.metrics.routes_tested = routes;
      return routes;
    } catch (error) {
      this.metrics.errors.push(error as Error);
      return routes;
    }
  }

  /**
   * Basic WCAG validation
   */
  private async validateBasicWCAG(): Promise<boolean> {
    if (!this.page) return false;

    try {
      // Check for alt text on images
      const imagesWithoutAlt = await this.page.$$eval('img', (images) => {
        return images.filter(img => !img.getAttribute('alt')).length;
      });

      // Check for form labels
      const inputsWithoutLabels = await this.page.$$eval('input', (inputs) => {
        return inputs.filter(input => {
          const id = input.getAttribute('id');
          const ariaLabel = input.getAttribute('aria-label');
          const label = id ? document.querySelector(`label[for="${id}"]`) : null;
          return !ariaLabel && !label;
        }).length;
      });

      // Check for heading structure
      const headings = await this.page.$$eval('h1, h2, h3, h4, h5, h6', (headings) => {
        return headings.map(h => parseInt(h.tagName.charAt(1)));
      });

      const hasValidHeadingStructure = headings.length > 0 && headings[0] === 1;

      return imagesWithoutAlt === 0 && inputsWithoutLabels === 0 && hasValidHeadingStructure;
    } catch (error) {
      return false;
    }
  }

  /**
   * Calculate performance score for current page
   */
  private async calculatePerformanceScore(): Promise<number> {
    if (!this.page) return 0;

    let score = 100;

    // Check network requests
    const slowRequests = this.metrics.performance.network
      .filter(req => req.time > 3000).length;
    
    const errorRequests = this.metrics.performance.network
      .filter(req => req.status >= 400).length;

    score -= slowRequests * 10;
    score -= errorRequests * 20;

    // Check console errors
    const recentErrors = this.metrics.performance.console
      .filter(msg => msg.level === 'error' && msg.timestamp > Date.now() - 10000);

    score -= recentErrors.length * 15;

    return Math.max(0, score);
  }

  /**
   * Self-healing mechanism for common failures
   */
  async selfHealingMechanism(error: Error, selector?: string): Promise<boolean> {
    if (!this.page) return false;

    try {
      if (error.message.includes('Element not found') && selector) {
        // Try alternative selectors
        const alternativeSelectors = this.generateAlternativeSelectors(selector);
        
        for (const altSelector of alternativeSelectors) {
          try {
            await this.page.click(altSelector);
            return true;
          } catch (e) {
            continue;
          }
        }

        // Try clicking by coordinates if element was found before
        try {
          const element = await this.page.$(selector);
          if (element) {
            const box = await element.boundingBox();
            if (box) {
              await this.page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
              return true;
            }
          }
        } catch (e) {
          // Continue to next healing strategy
        }
      }

      if (error.message.includes('Timeout')) {
        await this.page.waitForTimeout(5000);
        return true;
      }

      if (error.message.includes('Navigation')) {
        await this.page.reload();
        await this.page.waitForLoadState('networkidle');
        return true;
      }

      return false;
    } catch (healingError) {
      this.metrics.errors.push(healingError as Error);
      return false;
    }
  }

  /**
   * Generate alternative selectors for self-healing
   */
  private generateAlternativeSelectors(originalSelector: string): string[] {
    const alternatives: string[] = [];

    // If it's an ID selector, try class-based alternatives
    if (originalSelector.startsWith('#')) {
      const id = originalSelector.substring(1);
      alternatives.push(
        `[id="${id}"]`,
        `[data-testid="${id}"]`,
        `[name="${id}"]`,
        `.${id}`
      );
    }

    // If it's a class selector, try attribute-based alternatives
    if (originalSelector.startsWith('.')) {
      const className = originalSelector.substring(1);
      alternatives.push(
        `[class*="${className}"]`,
        `[data-testid="${className}"]`,
        `[role="${className}"]`
      );
    }

    // Try text-based selectors
    alternatives.push(
      `text=${originalSelector}`,
      `[aria-label*="${originalSelector}"]`,
      `[title*="${originalSelector}"]`
    );

    return alternatives;
  }

  /**
   * Get current metrics
   */
  getMetrics(): TestMetrics {
    return { ...this.metrics };
  }

  /**
   * Clean up resources
   */
  async cleanup(): Promise<void> {
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }
}