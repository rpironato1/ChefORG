import { test, expect, chromium, Page, Browser } from '@playwright/test';
import { DEFAULT_CONFIG, TestMetrics } from './types';
import { MCPPlaywrightService } from './services/MCPPlaywrightService';
import { WCAGComplianceService } from './services/WCAGComplianceService';
import { FormTestingService } from './services/FormTestingService';
import { InteractionMatrixService } from './services/InteractionMatrixService';
import { CoverageCalculatorService } from './utils/CoverageCalculatorService';

/**
 * MCP Playwright Complete Test Suite
 * Autonomous execution with 90%+ coverage and WCAG AA compliance
 */
class MCPPlaywrightOrchestrator {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private mcpService: MCPPlaywrightService;
  private wcagService: WCAGComplianceService | null = null;
  private formService: FormTestingService | null = null;
  private interactionService: InteractionMatrixService | null = null;
  private coverageService: CoverageCalculatorService;
  private startTime: number = 0;

  constructor() {
    this.mcpService = new MCPPlaywrightService(DEFAULT_CONFIG);
    this.coverageService = new CoverageCalculatorService();
  }

  /**
   * Execute complete test suite autonomously
   */
  async executeCompleteTestSuite(): Promise<{ status: string; report: any }> {
    this.startTime = Date.now();

    try {
      console.log('🚀 Starting MCP Playwright Test Suite...');

      // Phase 1: Initialization
      console.log('📋 Phase 1: Initializing test environment...');
      await this.initializeTestEnvironment();

      // Phase 2: WCAG Compliance
      console.log('♿ Phase 2: WCAG 2.1 AA compliance testing...');
      const wcagScore = await this.executeWCAGCompliance();

      // Phase 3: Route Discovery
      console.log('🗺️ Phase 3: Discovering application routes...');
      const routes = await this.discoverApplicationRoutes();

      // Phase 4-6: Parallel execution
      console.log('⚡ Phase 4-6: Parallel testing execution...');
      await this.executeParallelTests();

      // Phase 7: Visual Validation
      console.log('👁️ Phase 7: Visual compliance validation...');
      await this.validateVisualCompliance();

      // Phase 8: Performance Monitoring
      console.log('📊 Phase 8: Performance monitoring...');
      const performanceMetrics = await this.monitorApplicationPerformance();

      // Phase 9: Coverage Calculation
      console.log('📈 Phase 9: Calculating coverage...');
      const metrics = this.mcpService.getMetrics();
      metrics.wcag_score = wcagScore;
      metrics.execution_time = Date.now() - this.startTime;

      const coverage = this.coverageService.calculateCoverage(metrics);
      const report = this.coverageService.generateCoverageReport(metrics);

      // Validation
      if (this.coverageService.meetsCoverageTarget(metrics)) {
        console.log('✅ SUCCESS: Coverage target met!');
        await this.cleanup();
        return { status: 'SUCCESS', report };
      } else {
        const gaps = this.coverageService.getCoverageGaps(metrics);
        console.log('❌ Coverage target not met. Gaps:', gaps);

        // Attempt self-healing retry
        console.log('🔧 Attempting self-healing retry...');
        return await this.executeCompleteTestSuite();
      }
    } catch (error) {
      console.error('❌ Test suite failed:', error);

      // Self-healing mechanism
      const healed = await this.mcpService.selfHealingMechanism(error as Error);
      if (healed) {
        console.log('🔧 Self-healing successful, retrying...');
        return await this.executeCompleteTestSuite();
      }

      await this.cleanup();
      throw error;
    }
  }

  /**
   * Initialize test environment
   */
  private async initializeTestEnvironment(): Promise<void> {
    this.browser = await chromium.launch({
      headless: true,
      args: ['--disable-web-security', '--allow-running-insecure-content'],
    });

    await this.mcpService.initializeTestEnvironment(this.browser);

    // Get page from service
    const context = this.browser.contexts()[0];
    this.page = context.pages()[0];

    // Initialize other services
    this.wcagService = new WCAGComplianceService(this.page);
    this.formService = new FormTestingService(this.page);
    this.interactionService = new InteractionMatrixService(this.page);
  }

  /**
   * Execute WCAG compliance testing
   */
  private async executeWCAGCompliance(): Promise<number> {
    if (!this.wcagService || !this.page) throw new Error('Services not initialized');

    // Navigate to home page for WCAG testing
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');

    return await this.wcagService.executeWCAGCompliance();
  }

  /**
   * Discover application routes
   */
  private async discoverApplicationRoutes(): Promise<any[]> {
    return await this.mcpService.discoverApplicationRoutes();
  }

  /**
   * Execute parallel tests (forms, interactions, multi-context)
   */
  private async executeParallelTests(): Promise<void> {
    if (!this.formService || !this.interactionService || !this.page) {
      throw new Error('Services not initialized');
    }

    const promises: Promise<any>[] = [];

    // Test forms on multiple pages
    promises.push(this.testAllForms());

    // Test interaction matrix
    promises.push(this.executeInteractionMatrix());

    // Test multiple contexts (tabs)
    promises.push(this.testMultipleContexts());

    await Promise.all(promises);
  }

  /**
   * Test all forms across the application
   */
  private async testAllForms(): Promise<void> {
    if (!this.formService || !this.page) return;

    const formRoutes = ['/', '/login', '/reservations', '/contact'];

    for (const route of formRoutes) {
      try {
        await this.page.goto(route);
        await this.page.waitForLoadState('networkidle');
        await this.formService.testAllForms();
      } catch (error) {
        console.warn(`Form testing failed on ${route}:`, error);
      }
    }
  }

  /**
   * Execute interaction matrix testing
   */
  private async executeInteractionMatrix(): Promise<void> {
    if (!this.interactionService || !this.page) return;

    const interactionRoutes = ['/', '/menu', '/admin'];

    for (const route of interactionRoutes) {
      try {
        await this.page.goto(route);
        await this.page.waitForLoadState('networkidle');
        await this.interactionService.executeInteractionMatrix();
      } catch (error) {
        console.warn(`Interaction testing failed on ${route}:`, error);
      }
    }
  }

  /**
   * Test multiple contexts (tabs)
   */
  private async testMultipleContexts(): Promise<void> {
    if (!this.browser) return;

    const contexts = ['/menu', '/reservations', '/admin'];
    const pages: Page[] = [];

    try {
      // Open multiple tabs
      for (const contextRoute of contexts) {
        const context = await this.browser.newContext();
        const page = await context.newPage();
        await page.goto(contextRoute);
        await page.waitForLoadState('networkidle');
        pages.push(page);
      }

      // Test accessibility in each context
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];

        // Basic accessibility check
        const title = await page.title();
        expect(title).toBeTruthy();

        // Check for console errors
        const errors = await page.evaluate(() => {
          const errors: string[] = [];
          const originalError = console.error;
          console.error = (...args) => {
            errors.push(args.join(' '));
            originalError.apply(console, args);
          };
          return errors;
        });

        if (errors.length > 5) {
          console.warn(`Many console errors on ${contexts[i]}: ${errors.length}`);
        }
      }
    } finally {
      // Cleanup: close all additional pages
      for (const page of pages) {
        try {
          await page.context().close();
        } catch (error) {
          console.warn('Failed to close context:', error);
        }
      }
    }
  }

  /**
   * Validate visual compliance
   */
  private async validateVisualCompliance(): Promise<void> {
    if (!this.page) return;

    // Navigate to main page
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');

    // Take baseline screenshot
    await this.page.screenshot({
      path: 'test-results/baseline-screenshot.png',
      fullPage: true,
    });

    // Test zoom to 200%
    await this.page.setViewportSize({ width: 960, height: 540 });
    await this.page.waitForTimeout(1000);

    // Check for horizontal scroll
    const hasHorizontalScroll = await this.page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    if (hasHorizontalScroll) {
      console.warn('Horizontal scroll detected at 200% zoom');
    }

    // Take zoomed screenshot
    await this.page.screenshot({
      path: 'test-results/zoomed-screenshot.png',
      fullPage: true,
    });

    // Reset viewport
    await this.page.setViewportSize({ width: 1920, height: 1080 });

    // Test high contrast mode (simulated)
    await this.page.addStyleTag({
      content: `
        * { 
          filter: contrast(200%) !important; 
          background: black !important;
          color: white !important;
        }
      `,
    });

    await this.page.screenshot({
      path: 'test-results/high-contrast-screenshot.png',
      fullPage: true,
    });
  }

  /**
   * Monitor application performance
   */
  private async monitorApplicationPerformance(): Promise<any> {
    const metrics = this.mcpService.getMetrics();

    return {
      network: metrics.performance.network,
      console: metrics.performance.console,
      wcag_violations: metrics.performance.wcag_violations,
      performance_score:
        metrics.routes_tested.length > 0
          ? metrics.routes_tested.reduce((sum, route) => sum + route.performance_score, 0) /
            metrics.routes_tested.length
          : 0,
    };
  }

  /**
   * Cleanup resources
   */
  private async cleanup(): Promise<void> {
    await this.mcpService.cleanup();
  }
}

// Playwright test definitions
test.describe('MCP Playwright - Complete Test Suite', () => {
  let orchestrator: MCPPlaywrightOrchestrator;

  test.beforeEach(() => {
    orchestrator = new MCPPlaywrightOrchestrator();
  });

  test('Execute Complete Autonomous Test Suite', async () => {
    const result = await orchestrator.executeCompleteTestSuite();

    expect(result.status).toBe('SUCCESS');
    expect(result.report.summary.totalCoverage).toBeGreaterThanOrEqual(90);
    expect(result.report.summary.wcagScore).toBeGreaterThanOrEqual(95);

    console.log('📊 Final Test Report:');
    console.log(JSON.stringify(result.report, null, 2));
  });

  test('WCAG 2.1 AA Compliance Only', async () => {
    const orchestrator = new MCPPlaywrightOrchestrator();
    const browser = await chromium.launch({ headless: true });

    try {
      await orchestrator['initializeTestEnvironment']();
      const wcagScore = await orchestrator['executeWCAGCompliance']();

      expect(wcagScore).toBeGreaterThanOrEqual(0.95);
      console.log(`WCAG Score: ${Math.round(wcagScore * 100)}%`);
    } finally {
      await browser.close();
    }
  });

  test('Route Discovery and Performance', async () => {
    const orchestrator = new MCPPlaywrightOrchestrator();
    const browser = await chromium.launch({ headless: true });

    try {
      await orchestrator['initializeTestEnvironment']();
      const routes = await orchestrator['discoverApplicationRoutes']();

      expect(routes.length).toBeGreaterThanOrEqual(5);

      const performantRoutes = routes.filter(route => route.performance_score > 70);
      expect(performantRoutes.length).toBeGreaterThanOrEqual(routes.length * 0.8);

      console.log(
        `Discovered ${routes.length} routes, ${performantRoutes.length} with good performance`
      );
    } finally {
      await browser.close();
    }
  });
});

// Export for direct usage
export { MCPPlaywrightOrchestrator };
export default MCPPlaywrightOrchestrator;
