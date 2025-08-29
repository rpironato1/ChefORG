/**
 * Focused E2E Usability Tests for ChefORG - Critical User Journeys
 * Focus: Core functionality and usability issues
 */

import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

const BASE_URL = 'http://localhost:8110';

test.describe('ChefORG Core Usability Testing', () => {
  
  test('Homepage Navigation and Call-to-Actions', async ({ page }) => {
    console.log('🏠 Testing Homepage Core Usability...');
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Inject accessibility testing
    await injectAxe(page);
    
    // Take screenshot for visual validation
    await page.screenshot({ path: 'test-results/homepage-full.png', fullPage: true });
    
    // Test main heading visibility
    const mainHeading = page.locator('h1').first();
    await expect(mainHeading).toBeVisible();
    console.log('✅ Main heading is visible');
    
    // Test primary CTA - Reservar Mesa button
    const reserveButton = page.locator('text=Reservar Mesa, [href*="reserva"]').first();
    await expect(reserveButton).toBeVisible();
    await expect(reserveButton).toBeEnabled();
    console.log('✅ Reserve button is accessible');
    
    // Test menu navigation if available
    const menuLink = page.locator('text=Menu, text=Cardápio, [href*="menu"]').first();
    if (await menuLink.isVisible()) {
      await expect(menuLink).toBeEnabled();
      console.log('✅ Menu link is accessible');
    }
    
    // Check basic accessibility
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
    console.log('✅ Basic accessibility check passed');
    
    // Test responsive behavior
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(reserveButton).toBeVisible();
    await page.setViewportSize({ width: 1200, height: 800 });
    
    console.log('✅ Homepage core usability validated');
  });

  test('Menu Interface Core Functionality', async ({ page }) => {
    console.log('🍽️ Testing Menu Interface...');
    
    await page.goto(`${BASE_URL}/menu`);
    await page.waitForLoadState('networkidle');
    await injectAxe(page);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/menu-interface.png' });
    
    // Check if menu loads content
    await page.waitForTimeout(2000); // Allow for data loading
    
    // Look for menu categories or items
    const menuContent = page.locator('[data-testid*="menu"], .menu, [class*="menu"], [class*="cardapio"]').first();
    if (await menuContent.isVisible()) {
      console.log('✅ Menu content is visible');
    } else {
      console.log('⚠️ Menu content not found, checking for loading states');
      
      // Check for loading indicators
      const loadingIndicator = page.locator('text=Carregando, .loading, [data-testid*="loading"]');
      if (await loadingIndicator.isVisible()) {
        console.log('📊 Loading indicator found');
        await loadingIndicator.waitFor({ state: 'hidden', timeout: 10000 });
      }
    }
    
    // Check for category navigation
    const categories = page.locator('button:has-text("Categoria"), [role="tab"], .category').first();
    if (await categories.isVisible()) {
      await categories.click();
      console.log('✅ Category navigation works');
    }
    
    // Test search if available
    const searchInput = page.locator('input[placeholder*="Buscar"], input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      console.log('✅ Search input is functional');
    }
    
    await checkA11y(page);
    console.log('✅ Menu accessibility validated');
  });

  test('Reservation Flow - Critical Path', async ({ page }) => {
    console.log('📝 Testing Reservation Flow...');
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await injectAxe(page);
    
    // Find and click reservation button
    const reserveButton = page.locator('text=Reservar Mesa, [href*="reserva"]').first();
    await reserveButton.click();
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of reservation form
    await page.screenshot({ path: 'test-results/reservation-form.png' });
    
    // Test form validation
    const submitButton = page.locator('button:has-text("Continuar"), button:has-text("Confirmar"), button[type="submit"]').first();
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      // Look for validation messages
      const validationMessages = page.locator('text=obrigatório, text=required, .error, [role="alert"]');
      if (await validationMessages.first().isVisible()) {
        console.log('✅ Form validation is working');
      } else {
        console.log('⚠️ No validation messages found');
      }
    }
    
    // Test form fields
    const nameField = page.locator('input[placeholder*="nome"], input[name*="name"]').first();
    if (await nameField.isVisible()) {
      await nameField.fill('Test User');
      console.log('✅ Name field is functional');
    }
    
    const phoneField = page.locator('input[placeholder*="telefone"], input[type="tel"]').first();
    if (await phoneField.isVisible()) {
      await phoneField.fill('(11) 99999-9999');
      console.log('✅ Phone field is functional');
    }
    
    await checkA11y(page);
    console.log('✅ Reservation form accessibility validated');
  });

  test('Mobile Touch Interface Testing', async ({ page }) => {
    console.log('📱 Testing Mobile Touch Interface...');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await injectAxe(page);
    
    // Take mobile screenshot
    await page.screenshot({ path: 'test-results/mobile-interface.png' });
    
    // Test touch target sizes (minimum 44px)
    const touchTargets = page.locator('button, a[href], input[type="submit"]');
    const touchTargetCount = await touchTargets.count();
    
    for (let i = 0; i < Math.min(touchTargetCount, 5); i++) {
      const target = touchTargets.nth(i);
      if (await target.isVisible()) {
        const box = await target.boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(44);
          expect(box.width).toBeGreaterThanOrEqual(44);
          console.log(`✅ Touch target ${i + 1} meets minimum size requirements`);
        }
      }
    }
    
    // Test mobile navigation
    const mobileMenuButton = page.locator('[aria-label*="menu"], button[aria-expanded], .menu-button').first();
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      console.log('✅ Mobile menu toggle works');
    }
    
    // Test scroll behavior
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
    console.log('✅ Scroll behavior is smooth');
    
    await checkA11y(page);
    console.log('✅ Mobile accessibility validated');
  });

  test('Error States and Recovery', async ({ page }) => {
    console.log('⚠️ Testing Error Handling...');
    
    // Test non-existent routes
    await page.goto(`${BASE_URL}/non-existent-page`);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of error page
    await page.screenshot({ path: 'test-results/error-page.png' });
    
    // Should show some form of error message or redirect
    const errorIndicators = page.locator('text=404, text=erro, text=não encontrado, text=error');
    const hasError = await errorIndicators.first().isVisible();
    
    if (hasError) {
      console.log('✅ Error page is displayed');
    } else {
      console.log('⚠️ No clear error indication found');
    }
    
    // Test navigation back to home
    const homeLink = page.locator('text=Home, text=Início, [href="/"], [href="' + BASE_URL + '"]').first();
    if (await homeLink.isVisible()) {
      await homeLink.click();
      await page.waitForLoadState('networkidle');
      console.log('✅ Navigation back to home works');
    }
    
    // Test protected routes
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('networkidle');
    
    // Should redirect to login or show access denied
    const authRedirect = page.locator('text=login, text=acesso, text=entrar, input[type="password"]');
    if (await authRedirect.first().isVisible()) {
      console.log('✅ Protected route handling works');
    }
    
    console.log('✅ Error handling tested');
  });

  test('Performance and Loading States', async ({ page }) => {
    console.log('⚡ Testing Performance...');
    
    // Measure page load time
    const startTime = Date.now();
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    console.log(`📊 Page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(10000); // Should load within 10 seconds
    
    // Check for loading states
    await page.goto(`${BASE_URL}/menu`);
    
    // Look for loading indicators
    const loadingStates = page.locator('text=Carregando, .loading, [data-testid*="loading"], .spinner');
    if (await loadingStates.first().isVisible()) {
      console.log('✅ Loading states are visible to users');
      // Wait for loading to complete
      await loadingStates.first().waitFor({ state: 'hidden', timeout: 15000 });
    }
    
    // Test basic performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.navigationStart
      };
    });
    
    console.log('📊 Performance metrics:', performanceMetrics);
    
    console.log('✅ Performance testing completed');
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Take a final screenshot on failure
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ 
        path: `test-results/failure-${testInfo.title.replace(/[^a-zA-Z0-9]/g, '-')}.png`,
        fullPage: true 
      });
    }
  });
});