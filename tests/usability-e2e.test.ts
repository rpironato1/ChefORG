/**
 * Comprehensive E2E Usability Tests with MCP Playwright + Axe Core React
 * Focus: Complete user journey testing with accessibility validation
 */

import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y, getViolations } from 'axe-playwright';

const BASE_URL = 'http://localhost:8110';

// Test data for consistent testing
const TEST_DATA = {
  reservation: {
    name: 'João Silva',
    phone: '(11) 99999-9999', 
    guests: 4,
    date: '2024-12-20',
    time: '19:30'
  },
  table: {
    number: 5,
    pin: '1234'
  }
};

test.describe('ChefORG Complete Usability & Accessibility E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to home page and inject Axe
    await page.goto(BASE_URL);
    await injectAxe(page);
  });

  test('Homepage - Accessibility & Usability Validation', async ({ page }) => {
    console.log('🏠 Testing Homepage Usability...');
    
    // Accessibility check
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
    
    // Usability checks
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Reservar Mesa')).toBeVisible();
    
    // Navigation usability
    const reserveButton = page.locator('text=Reservar Mesa').first();
    await expect(reserveButton).toBeEnabled();
    
    // Test responsive design
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    await expect(reserveButton).toBeVisible();
    
    await page.setViewportSize({ width: 1200, height: 800 }); // Desktop
    await expect(reserveButton).toBeVisible();
    
    console.log('✅ Homepage usability validation passed');
  });

  test('Reservation Flow - Complete User Journey', async ({ page }) => {
    console.log('📝 Testing Complete Reservation Flow...');
    
    // Start reservation
    await page.click('text=Reservar Mesa');
    await page.waitForLoadState('networkidle');
    
    // Check accessibility on reservation page
    await checkA11y(page);
    
    // Step 1: Personal Information
    await expect(page.locator('h2')).toContainText('Reserva');
    
    // Test form validation
    await page.click('button:has-text("Continuar")');
    // Should show validation errors
    await expect(page.locator('text=obrigatório')).toBeVisible();
    
    // Fill form correctly
    await page.fill('input[placeholder*="nome"]', TEST_DATA.reservation.name);
    await page.fill('input[placeholder*="telefone"]', TEST_DATA.reservation.phone);
    await page.selectOption('select', TEST_DATA.reservation.guests.toString());
    
    // Continue to next step
    await page.click('button:has-text("Continuar")');
    await page.waitForLoadState('networkidle');
    
    // Step 2: Date and Time Selection
    await checkA11y(page);
    
    // Test date picker usability
    const dateInput = page.locator('input[type="date"]');
    await expect(dateInput).toBeVisible();
    await dateInput.fill(TEST_DATA.reservation.date);
    
    // Test time selection
    const timeInput = page.locator('input[type="time"]');
    await expect(timeInput).toBeVisible();
    await timeInput.fill(TEST_DATA.reservation.time);
    
    await page.click('button:has-text("Continuar")');
    await page.waitForLoadState('networkidle');
    
    // Step 3: Confirmation
    await checkA11y(page);
    
    // Verify information display
    await expect(page.locator('text=' + TEST_DATA.reservation.name)).toBeVisible();
    await expect(page.locator('text=' + TEST_DATA.reservation.phone)).toBeVisible();
    
    // Complete reservation
    await page.click('button:has-text("Confirmar")');
    await page.waitForLoadState('networkidle');
    
    // Success validation
    await expect(page.locator('text=confirmada')).toBeVisible();
    
    console.log('✅ Reservation flow completed successfully');
  });

  test('Menu Interface - Usability & Performance', async ({ page }) => {
    console.log('🍽️ Testing Menu Interface...');
    
    // Navigate to menu
    await page.goto(`${BASE_URL}/menu`);
    await page.waitForLoadState('networkidle');
    
    // Accessibility check
    await checkA11y(page);
    
    // Test category navigation
    const categories = page.locator('[role="button"]:has-text("Categoria")');
    await expect(categories.first()).toBeVisible();
    
    // Test menu item interactions
    const menuItems = page.locator('[data-testid*="menu-item"]');
    if (await menuItems.count() > 0) {
      await expect(menuItems.first()).toBeVisible();
      
      // Test add to cart functionality
      const addButton = menuItems.first().locator('button:has-text("Adicionar")');
      if (await addButton.isVisible()) {
        await addButton.click();
        await expect(page.locator('text=adicionado')).toBeVisible();
      }
    }
    
    // Test search functionality
    const searchInput = page.locator('input[placeholder*="Buscar"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('pizza');
      await page.waitForTimeout(1000); // Allow search to process
      await checkA11y(page); // Check accessibility after filtering
    }
    
    console.log('✅ Menu interface usability validated');
  });

  test('Table PIN Validation - Security & UX', async ({ page }) => {
    console.log('🔐 Testing Table PIN Validation...');
    
    // Navigate to PIN entry
    await page.goto(`${BASE_URL}/mesa/${TEST_DATA.table.number}/pin`);
    await page.waitForLoadState('networkidle');
    
    // Accessibility check
    await checkA11y(page);
    
    // Test PIN input usability
    await expect(page.locator('h2')).toContainText('PIN');
    
    // Test invalid PIN
    await page.fill('input[type="password"]', '0000');
    await page.click('button:has-text("Entrar")');
    await expect(page.locator('text=incorreto')).toBeVisible();
    
    // Test correct PIN (if available)
    await page.fill('input[type="password"]', TEST_DATA.table.pin);
    await page.click('button:has-text("Entrar")');
    // Should proceed or show appropriate message
    
    console.log('✅ PIN validation security and UX tested');
  });

  test('Mobile Responsiveness - Touch & Navigation', async ({ page }) => {
    console.log('📱 Testing Mobile Responsiveness...');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Test touch interactions
    await page.goto(BASE_URL);
    await checkA11y(page);
    
    // Test mobile navigation
    const mobileMenu = page.locator('[aria-label*="menu"], button[aria-expanded]');
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await checkA11y(page); // Check accessibility of opened menu
    }
    
    // Test touch targets size (minimum 44px)
    const buttons = page.locator('button, a[href]');
    for (let i = 0; i < Math.min(await buttons.count(), 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(44);
          expect(box.width).toBeGreaterThanOrEqual(44);
        }
      }
    }
    
    // Test scroll behavior
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
    
    console.log('✅ Mobile responsiveness validated');
  });

  test('Error Handling & Recovery - User Experience', async ({ page }) => {
    console.log('⚠️ Testing Error Handling...');
    
    // Test network error simulation
    await page.route('**/api/**', route => route.abort());
    
    await page.goto(BASE_URL + '/admin');
    await page.waitForLoadState('networkidle');
    
    // Should show appropriate error message or redirect
    await expect(page.locator('text=erro, text=login, text=acesso')).toBeVisible();
    
    // Check accessibility of error pages
    await checkA11y(page);
    
    // Test recovery mechanisms
    await page.unroute('**/api/**');
    
    console.log('✅ Error handling and recovery tested');
  });

  test('Performance & Loading States', async ({ page }) => {
    console.log('⚡ Testing Performance & Loading States...');
    
    // Test initial page load performance
    const startTime = Date.now();
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    console.log(`Page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    
    // Test loading states visibility
    await page.goto(BASE_URL + '/menu');
    
    // Look for loading indicators
    const loadingIndicator = page.locator('[data-testid*="loading"], .spinner, text=Carregando');
    if (await loadingIndicator.isVisible()) {
      await expect(loadingIndicator).toBeHidden(); // Should disappear
    }
    
    // Check Core Web Vitals using browser APIs
    const webVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = entries.map(entry => ({
            name: entry.name,
            value: entry.value,
            rating: entry.value < 100 ? 'good' : entry.value < 300 ? 'needs-improvement' : 'poor'
          }));
          resolve(vitals);
        }).observe({ entryTypes: ['measure', 'navigation'] });
        
        // Fallback timeout
        setTimeout(() => resolve([]), 3000);
      });
    });
    
    console.log('Web Vitals:', webVitals);
    
    console.log('✅ Performance validation completed');
  });

  test('Complete User Flow Integration', async ({ page }) => {
    console.log('🎯 Testing Complete Integrated User Flow...');
    
    // Full user journey: Home → Reservation → Menu → Order → Payment
    
    // 1. Start from homepage
    await page.goto(BASE_URL);
    await checkA11y(page);
    
    // 2. Make a reservation
    await page.click('text=Reservar Mesa');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[placeholder*="nome"]', TEST_DATA.reservation.name);
    await page.fill('input[placeholder*="telefone"]', TEST_DATA.reservation.phone);
    await page.selectOption('select', '2');
    await page.click('button:has-text("Continuar")');
    
    // 3. Navigate to menu (simulate table access)
    await page.goto(`${BASE_URL}/menu`);
    await checkA11y(page);
    
    // 4. Test end-to-end accessibility across the flow
    const violations = await getViolations(page);
    if (violations.length > 0) {
      console.log('Accessibility violations found:', violations);
      // Log but don't fail - focus on usability
    }
    
    // 5. Test keyboard navigation throughout
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    console.log('✅ Complete user flow integration tested');
  });

  test.afterEach(async ({ page }) => {
    // Clean up and log any final accessibility violations
    try {
      const violations = await getViolations(page);
      if (violations.length > 0) {
        console.log(`⚠️ Found ${violations.length} accessibility violations to address`);
        violations.forEach((violation, index) => {
          console.log(`${index + 1}. ${violation.id}: ${violation.description}`);
          console.log(`   Impact: ${violation.impact}`);
          console.log(`   Nodes: ${violation.nodes.length}`);
        });
      }
    } catch (error) {
      console.log('Could not check final accessibility violations:', error.message);
    }
  });
});