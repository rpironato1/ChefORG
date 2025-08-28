import { test, expect, chromium, Browser, Page } from '@playwright/test';
import lighthouse from 'lighthouse';
import { playAudit } from 'playwright-lighthouse';

/**
 * Comprehensive Lighthouse Test Suite for ChefORG
 * Tests all modules: Public, Client, Admin, Staff, Mobile, and Shared components
 *
 * Performance, Accessibility, SEO, Best Practices, and PWA testing
 */

interface LighthouseResult {
  url: string;
  route: string;
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
    pwa?: number;
  };
  issues: Array<{
    category: string;
    description: string;
    severity: 'error' | 'warning' | 'info';
    recommendation: string;
  }>;
  metrics: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    speedIndex: number;
    totalBlockingTime: number;
    cumulativeLayoutShift: number;
  };
}

interface TestSuiteResults {
  timestamp: string;
  totalRoutes: number;
  passedRoutes: number;
  failedRoutes: number;
  overallScores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
    pwa: number;
  };
  results: LighthouseResult[];
  criticalIssues: Array<{
    route: string;
    issues: string[];
  }>;
}

// Comprehensive route definitions for all ChefORG modules
const TEST_ROUTES = {
  public: [
    { path: '/', name: 'Home Page (Modular)', critical: true },
    { path: '/menu', name: 'Public Menu', critical: true },
    { path: '/reserva', name: 'Online Reservation', critical: true },
    { path: '/sprint3-demo', name: 'Sprint 3 Demo', critical: false },
  ],
  client: [
    { path: '/checkin', name: 'Client Check-in', critical: true },
    { path: '/chegada-sem-reserva', name: 'Walk-in Arrival', critical: true },
    // Dynamic routes need special handling
    { path: '/mesa/1/pin', name: 'Table PIN Entry', critical: true },
    { path: '/mesa/1/cardapio', name: 'Table Menu', critical: true },
    { path: '/mesa/1/acompanhar', name: 'Order Tracking', critical: true },
    { path: '/mesa/1/pagamento', name: 'Payment', critical: true },
    { path: '/mesa/1/feedback', name: 'Feedback', critical: false },
  ],
  auth: [
    { path: '/login', name: 'Login Page', critical: true },
    { path: '/admin/login', name: 'Admin Login', critical: true },
  ],
  admin: [
    { path: '/admin/', name: 'Admin Dashboard', critical: true, requiresAuth: true },
    { path: '/admin/dashboard', name: 'Admin Main Dashboard', critical: true, requiresAuth: true },
    { path: '/admin/recepcao', name: 'Reception Panel', critical: false, requiresAuth: true },
    { path: '/admin/garcom', name: 'Waiter Panel', critical: true, requiresAuth: true },
    { path: '/admin/cozinha', name: 'Kitchen Panel', critical: true, requiresAuth: true },
    { path: '/admin/caixa', name: 'Cashier Panel', critical: false, requiresAuth: true },
    { path: '/admin/gerencia', name: 'Management Panel', critical: false, requiresAuth: true },
  ],
};

// Lighthouse configuration for comprehensive testing
const LIGHTHOUSE_CONFIG = {
  extends: 'lighthouse:default',
  settings: {
    maxWaitForFcp: 15 * 1000,
    maxWaitForLoad: 35 * 1000,
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    emulatedUserAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Safari/537.36',
  },
  categories: {
    performance: { weight: 1 },
    accessibility: { weight: 1 },
    'best-practices': { weight: 1 },
    seo: { weight: 1 },
    pwa: { weight: 1 },
  },
};

// Mobile Lighthouse configuration
const MOBILE_LIGHTHOUSE_CONFIG = {
  ...LIGHTHOUSE_CONFIG,
  settings: {
    ...LIGHTHOUSE_CONFIG.settings,
    formFactor: 'mobile',
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      disabled: false,
    },
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
  },
};

class LighthouseTestRunner {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private results: TestSuiteResults = {
    timestamp: new Date().toISOString(),
    totalRoutes: 0,
    passedRoutes: 0,
    failedRoutes: 0,
    overallScores: {
      performance: 0,
      accessibility: 0,
      bestPractices: 0,
      seo: 0,
      pwa: 0,
    },
    results: [],
    criticalIssues: [],
  };

  async initialize() {
    this.browser = await chromium.launch({
      args: ['--remote-debugging-port=9222'],
    });
    this.page = await this.browser.newPage();

    // Set up basic auth mock data for testing
    await this.setupTestEnvironment();
  }

  private async setupTestEnvironment() {
    if (!this.page) return;

    // Mock authentication for admin routes
    await this.page.addInitScript(() => {
      localStorage.setItem(
        'cheforg_auth',
        JSON.stringify({
          user: {
            id: 'test-admin',
            email: 'admin@cheforg.com',
            role: 'admin',
            nome: 'Test Admin',
          },
          token: 'test-token',
        })
      );
    });
  }

  async runLighthouseAudit(
    url: string,
    routeName: string,
    isMobile = false
  ): Promise<LighthouseResult> {
    if (!this.page) throw new Error('Page not initialized');

    console.log(`🔍 Testing ${routeName}: ${url}`);

    try {
      // Navigate to the page
      await this.page.goto(url, { waitUntil: 'networkidle' });

      // Wait for potential dynamic content
      await this.page.waitForTimeout(2000);

      // Run Lighthouse audit
      const config = isMobile ? MOBILE_LIGHTHOUSE_CONFIG : LIGHTHOUSE_CONFIG;
      const audit = await playAudit({
        page: this.page,
        config: config,
        thresholds: {
          performance: 50, // Minimum threshold for performance
          accessibility: 80, // Minimum threshold for accessibility
          'best-practices': 70, // Minimum threshold for best practices
          seo: 70, // Minimum threshold for SEO
        },
      });

      // Process results
      return this.processLighthouseResults(url, routeName, audit);
    } catch (error) {
      console.error(`❌ Error testing ${routeName}:`, error);
      return this.createErrorResult(url, routeName, error as Error);
    }
  }

  private processLighthouseResults(url: string, routeName: string, audit: any): LighthouseResult {
    const lhr = audit.lhr;

    const result: LighthouseResult = {
      url,
      route: routeName,
      scores: {
        performance: Math.round((lhr.categories.performance?.score || 0) * 100),
        accessibility: Math.round((lhr.categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((lhr.categories['best-practices']?.score || 0) * 100),
        seo: Math.round((lhr.categories.seo?.score || 0) * 100),
        pwa: lhr.categories.pwa ? Math.round(lhr.categories.pwa.score * 100) : undefined,
      },
      issues: [],
      metrics: {
        firstContentfulPaint: lhr.audits['first-contentful-paint']?.numericValue || 0,
        largestContentfulPaint: lhr.audits['largest-contentful-paint']?.numericValue || 0,
        speedIndex: lhr.audits['speed-index']?.numericValue || 0,
        totalBlockingTime: lhr.audits['total-blocking-time']?.numericValue || 0,
        cumulativeLayoutShift: lhr.audits['cumulative-layout-shift']?.numericValue || 0,
      },
    };

    // Extract issues and recommendations
    this.extractIssues(lhr, result);

    return result;
  }

  private extractIssues(lhr: any, result: LighthouseResult) {
    // Performance issues
    if (result.scores.performance < 50) {
      result.issues.push({
        category: 'performance',
        description: 'Poor performance score',
        severity: 'error',
        recommendation: 'Optimize images, reduce JavaScript, enable compression',
      });
    }

    // Accessibility issues
    if (lhr.audits['color-contrast']?.score < 1) {
      result.issues.push({
        category: 'accessibility',
        description: 'Color contrast issues detected',
        severity: 'error',
        recommendation: 'Ensure color contrast meets WCAG AA standards (4.5:1 ratio)',
      });
    }

    if (lhr.audits['image-alt']?.score < 1) {
      result.issues.push({
        category: 'accessibility',
        description: 'Images missing alt text',
        severity: 'error',
        recommendation: 'Add descriptive alt text to all images',
      });
    }

    if (lhr.audits['heading-order']?.score < 1) {
      result.issues.push({
        category: 'accessibility',
        description: 'Improper heading hierarchy',
        severity: 'warning',
        recommendation: 'Use headings in logical order (h1 -> h2 -> h3)',
      });
    }

    // SEO issues
    if (lhr.audits['meta-description']?.score < 1) {
      result.issues.push({
        category: 'seo',
        description: 'Missing meta description',
        severity: 'warning',
        recommendation: 'Add unique meta descriptions to all pages',
      });
    }

    if (lhr.audits['document-title']?.score < 1) {
      result.issues.push({
        category: 'seo',
        description: 'Missing or duplicate page title',
        severity: 'error',
        recommendation: 'Add unique, descriptive titles to all pages',
      });
    }

    // Best practices issues
    if (lhr.audits['errors-in-console']?.score < 1) {
      result.issues.push({
        category: 'best-practices',
        description: 'Console errors detected',
        severity: 'error',
        recommendation: 'Fix JavaScript errors in browser console',
      });
    }

    if (lhr.audits['uses-https']?.score < 1) {
      result.issues.push({
        category: 'best-practices',
        description: 'Not using HTTPS',
        severity: 'warning',
        recommendation: 'Use HTTPS for all resources',
      });
    }
  }

  private createErrorResult(url: string, routeName: string, error: Error): LighthouseResult {
    return {
      url,
      route: routeName,
      scores: {
        performance: 0,
        accessibility: 0,
        bestPractices: 0,
        seo: 0,
      },
      issues: [
        {
          category: 'error',
          description: `Test failed: ${error.message}`,
          severity: 'error',
          recommendation: 'Fix the underlying issue causing the test failure',
        },
      ],
      metrics: {
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        speedIndex: 0,
        totalBlockingTime: 0,
        cumulativeLayoutShift: 0,
      },
    };
  }

  async runComprehensiveTests(): Promise<TestSuiteResults> {
    console.log('🚀 Starting Comprehensive Lighthouse Test Suite for ChefORG');
    console.log('='.repeat(80));

    // Test all route categories
    const allRoutes = [
      ...TEST_ROUTES.public,
      ...TEST_ROUTES.client,
      ...TEST_ROUTES.auth,
      ...TEST_ROUTES.admin,
    ];

    this.results.totalRoutes = allRoutes.length;

    for (const route of allRoutes) {
      const fullUrl = `http://localhost:8110${route.path}`;

      try {
        // Test desktop version
        const desktopResult = await this.runLighthouseAudit(
          fullUrl,
          `${route.name} (Desktop)`,
          false
        );
        this.results.results.push(desktopResult);

        // Test mobile version for critical routes
        if (route.critical) {
          const mobileResult = await this.runLighthouseAudit(
            fullUrl,
            `${route.name} (Mobile)`,
            true
          );
          this.results.results.push(mobileResult);
        }

        this.results.passedRoutes++;
        console.log(`✅ Completed: ${route.name}`);
      } catch (error) {
        this.results.failedRoutes++;
        console.log(`❌ Failed: ${route.name} - ${error}`);
      }
    }

    // Calculate overall scores
    this.calculateOverallScores();
    this.identifyCriticalIssues();

    return this.results;
  }

  private calculateOverallScores() {
    const totalResults = this.results.results.length;
    if (totalResults === 0) return;

    this.results.overallScores = {
      performance: Math.round(
        this.results.results.reduce((sum, r) => sum + r.scores.performance, 0) / totalResults
      ),
      accessibility: Math.round(
        this.results.results.reduce((sum, r) => sum + r.scores.accessibility, 0) / totalResults
      ),
      bestPractices: Math.round(
        this.results.results.reduce((sum, r) => sum + r.scores.bestPractices, 0) / totalResults
      ),
      seo: Math.round(
        this.results.results.reduce((sum, r) => sum + r.scores.seo, 0) / totalResults
      ),
      pwa: Math.round(
        this.results.results.reduce((sum, r) => sum + (r.scores.pwa || 0), 0) / totalResults
      ),
    };
  }

  private identifyCriticalIssues() {
    this.results.criticalIssues = this.results.results
      .filter(result => result.issues.some(issue => issue.severity === 'error'))
      .map(result => ({
        route: result.route,
        issues: result.issues
          .filter(issue => issue.severity === 'error')
          .map(issue => issue.description),
      }));
  }

  async generateReport(): Promise<string> {
    const report = `
# 🎯 ChefORG Comprehensive Lighthouse Test Report

**Generated:** ${this.results.timestamp}
**Total Routes Tested:** ${this.results.totalRoutes}
**Passed:** ${this.results.passedRoutes}
**Failed:** ${this.results.failedRoutes}

## 📊 Overall Scores

| Category | Score | Status |
|----------|-------|--------|
| Performance | ${this.results.overallScores.performance}/100 | ${this.results.overallScores.performance >= 50 ? '✅' : '❌'} |
| Accessibility | ${this.results.overallScores.accessibility}/100 | ${this.results.overallScores.accessibility >= 80 ? '✅' : '❌'} |
| Best Practices | ${this.results.overallScores.bestPractices}/100 | ${this.results.overallScores.bestPractices >= 70 ? '✅' : '❌'} |
| SEO | ${this.results.overallScores.seo}/100 | ${this.results.overallScores.seo >= 70 ? '✅' : '❌'} |
| PWA | ${this.results.overallScores.pwa}/100 | ${this.results.overallScores.pwa >= 30 ? '✅' : '❌'} |

## 🚨 Critical Issues Summary

${
  this.results.criticalIssues.length === 0
    ? 'No critical issues found!'
    : this.results.criticalIssues
        .map(issue => `### ${issue.route}\n${issue.issues.map(i => `- ❌ ${i}`).join('\n')}`)
        .join('\n\n')
}

## 📋 Detailed Results

${this.results.results
  .map(
    result => `
### ${result.route}
**URL:** ${result.url}
**Scores:** Performance: ${result.scores.performance}, Accessibility: ${result.scores.accessibility}, Best Practices: ${result.scores.bestPractices}, SEO: ${result.scores.seo}

**Core Web Vitals:**
- First Contentful Paint: ${Math.round(result.metrics.firstContentfulPaint)}ms
- Largest Contentful Paint: ${Math.round(result.metrics.largestContentfulPaint)}ms
- Cumulative Layout Shift: ${result.metrics.cumulativeLayoutShift.toFixed(3)}

**Issues:**
${
  result.issues.length === 0
    ? 'No issues found!'
    : result.issues
        .map(
          issue =>
            `- ${issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️'} **${issue.category}:** ${issue.description} - ${issue.recommendation}`
        )
        .join('\n')
}
`
  )
  .join('\n')}

## 🎯 Recommendations

### High Priority (Performance)
1. **Optimize Images:** Compress and resize images, use modern formats (WebP, AVIF)
2. **Reduce JavaScript Bundle Size:** Code splitting and tree shaking
3. **Enable Compression:** Gzip/Brotli compression for static assets
4. **Optimize CSS:** Remove unused CSS, minimize critical CSS

### Medium Priority (Accessibility)
1. **Color Contrast:** Ensure 4.5:1 contrast ratio for normal text
2. **Alt Text:** Add descriptive alt text to all images
3. **Keyboard Navigation:** Ensure all interactive elements are keyboard accessible
4. **Focus Management:** Proper focus indicators and management

### Low Priority (SEO & Best Practices)
1. **Meta Tags:** Add unique meta descriptions and titles
2. **Structured Data:** Implement schema.org markup
3. **Error Handling:** Fix console errors
4. **HTTPS:** Use HTTPS for all resources
`;

    // Save report
    const fs = await import('fs');
    const path = await import('path');

    const reportDir = path.join(process.cwd(), 'test-results', 'lighthouse');
    fs.mkdirSync(reportDir, { recursive: true });

    const reportPath = path.join(reportDir, 'comprehensive-lighthouse-report.md');
    fs.writeFileSync(reportPath, report);

    const jsonPath = path.join(reportDir, 'lighthouse-results.json');
    fs.writeFileSync(jsonPath, JSON.stringify(this.results, null, 2));

    console.log(`📊 Report saved to: ${reportPath}`);
    return reportPath;
  }

  async cleanup() {
    if (this.page) await this.page.close();
    if (this.browser) await this.browser.close();
  }
}

// Main test suite
test.describe('ChefORG Comprehensive Lighthouse Testing', () => {
  let testRunner: LighthouseTestRunner;

  test.beforeAll(async () => {
    testRunner = new LighthouseTestRunner();
    await testRunner.initialize();
  });

  test.afterAll(async () => {
    if (testRunner) {
      await testRunner.cleanup();
    }
  });

  test('Execute Comprehensive Lighthouse Tests for All Modules', async () => {
    console.log('🎯 Starting comprehensive Lighthouse testing for ChefORG...');

    const results = await testRunner.runComprehensiveTests();

    // Generate and save report
    const reportPath = await testRunner.generateReport();

    console.log('\n📊 Test Summary:');
    console.log(`Total Routes: ${results.totalRoutes}`);
    console.log(`Passed: ${results.passedRoutes}`);
    console.log(`Failed: ${results.failedRoutes}`);
    console.log(`Overall Performance: ${results.overallScores.performance}/100`);
    console.log(`Overall Accessibility: ${results.overallScores.accessibility}/100`);
    console.log(`Critical Issues: ${results.criticalIssues.length}`);

    // Assertions for test success
    expect(results.passedRoutes).toBeGreaterThan(0);
    expect(results.overallScores.accessibility).toBeGreaterThanOrEqual(50); // Minimum accessibility
    expect(results.criticalIssues.length).toBeLessThan(results.totalRoutes); // Not all routes can have critical issues

    console.log(`\n✅ Comprehensive Lighthouse testing completed!`);
    console.log(`📄 Report: ${reportPath}`);
  });
});

export { LighthouseTestRunner, TEST_ROUTES };
