import { test, expect, Page } from '@playwright/test';
import { routeGraphMapper } from '../../src/test/routeGraphMapper';

class ChefORGTestHelper {
  constructor(private page: Page) {}

  async navigateToRoute(routeId: string) {
    const route = routeGraphMapper.getRouteDetails(routeId);
    if (!route) {
      throw new Error(`Route ${routeId} not found`);
    }
    
    // Replace dynamic segments for testing
    let path = route.path.replace(':numeroMesa', '1');
    await this.page.goto(path);
  }

  async loginAsStaff(role: string = 'gerente') {
    await this.page.goto('/admin/login');
    
    const emailMap = {
      'gerente': 'admin@cheforg.com',
      'recepcao': 'recepcao@cheforg.com',
      'garcom': 'garcom@cheforg.com',
      'cozinheiro': 'cozinha@cheforg.com',
      'caixa': 'caixa@cheforg.com'
    };

    await this.page.fill('input[type="email"]', emailMap[role] || emailMap.gerente);
    await this.page.fill('input[type="password"]', 'password123');
    await this.page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await this.page.waitForURL('/admin/dashboard');
  }

  async validatePIN(mesa: string, pin: string) {
    await this.page.goto(`/mesa/${mesa}/pin`);
    await this.page.fill('input[type="text"]', pin);
    await this.page.click('button[type="submit"]');
  }

  async createTestReservation() {
    await this.page.goto('/reserva');
    
    await this.page.fill('input[name="nome"]', 'João Silva Teste');
    await this.page.fill('input[name="cpf"]', '123.456.789-00');
    await this.page.fill('input[name="telefone"]', '(11) 99999-0000');
    await this.page.fill('input[name="convidados"]', '4');
    
    // Set future date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    await this.page.fill('input[type="date"]', dateString);
    await this.page.fill('input[type="time"]', '19:00');
    
    await this.page.click('button[type="submit"]');
    
    // Wait for success message
    await this.page.waitForSelector('[data-testid="success-message"]', { timeout: 5000 });
  }

  async addItemToOrder(itemName: string, quantity: number = 1) {
    await this.page.click(`[data-testid="menu-item-${itemName.toLowerCase().replace(/\s+/g, '-')}"]`);
    
    if (quantity > 1) {
      for (let i = 1; i < quantity; i++) {
        await this.page.click('[data-testid="quantity-increase"]');
      }
    }
    
    await this.page.click('[data-testid="add-to-cart"]');
  }

  async proceedToPayment() {
    await this.page.click('[data-testid="proceed-to-payment"]');
    await this.page.waitForURL(/\/pagamento$/);
  }

  async selectPaymentMethod(method: 'pix' | 'cartao' | 'dinheiro') {
    await this.page.click(`[data-testid="payment-method-${method}"]`);
  }

  async completePayment() {
    await this.page.click('[data-testid="confirm-payment"]');
    await this.page.waitForSelector('[data-testid="payment-success"]', { timeout: 10000 });
  }
}

test.describe('ChefORG E2E Tests - Route Dependency Based', () => {
  let testHelper: ChefORGTestHelper;

  test.beforeEach(async ({ page }) => {
    testHelper = new ChefORGTestHelper(page);
    
    // Initialize test data if needed
    await page.addInitScript(() => {
      localStorage.clear();
      // Initialize with test data
      localStorage.setItem('cheforg_test_mode', 'true');
    });
  });

  test.describe('Critical Path Tests (Priority 10)', () => {
    test('should complete full customer reservation flow', async ({ page }) => {
      const criticalPath = routeGraphMapper.getCriticalPath();
      const reservationFlow = routeGraphMapper.getUserFlowPaths()['customer-reservation-flow'];
      
      // Test each step in the critical reservation flow
      for (const route of reservationFlow) {
        if (route.testCategories.includes('e2e')) {
          console.log(`Testing route: ${route.path}`);
          
          if (route.id === 'reserva-online') {
            await testHelper.createTestReservation();
            expect(page.url()).toContain('/reserva');
          }
          
          if (route.id === 'checkin-qr') {
            await testHelper.navigateToRoute('checkin-qr');
            await expect(page.locator('h1')).toContainText('Check-in');
          }
          
          if (route.id === 'pin-mesa') {
            await testHelper.validatePIN('1', '1234');
            await expect(page).toHaveURL(/\/mesa\/1\/cardapio/);
          }
        }
      }
    });

    test('should handle complete order and payment flow', async ({ page }) => {
      const paymentFlow = routeGraphMapper.getUserFlowPaths()['payment-flow'];
      
      // Start from cardapio
      await testHelper.navigateToRoute('cardapio-mesa');
      
      // Add items to cart
      await testHelper.addItemToOrder('Hambúrguer Artesanal', 2);
      await testHelper.addItemToOrder('Pizza Margherita', 1);
      
      // Check cart contents
      await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(2);
      
      // Proceed to payment
      await testHelper.proceedToPayment();
      
      // Select payment method
      await testHelper.selectPaymentMethod('pix');
      
      // Complete payment
      await testHelper.completePayment();
      
      // Verify feedback page
      await expect(page).toHaveURL(/\/feedback$/);
    });

    test('should test admin login and dashboard access', async ({ page }) => {
      const authFlow = routeGraphMapper.getUserFlowPaths()['staff-auth-flow'];
      
      await testHelper.loginAsStaff('gerente');
      
      // Verify dashboard loads with data
      await expect(page.locator('[data-testid="sales-metric"]')).toBeVisible();
      await expect(page.locator('[data-testid="orders-metric"]')).toBeVisible();
      await expect(page.locator('[data-testid="reservations-metric"]')).toBeVisible();
    });
  });

  test.describe('Dashboard Tests', () => {
    test('should test kitchen dashboard workflow', async ({ page }) => {
      await testHelper.loginAsStaff('cozinheiro');
      
      // Navigate to kitchen panel
      await page.goto('/admin/cozinha');
      
      // Verify kitchen panel elements
      await expect(page.locator('h1')).toContainText('Painel da Cozinha');
      await expect(page.locator('[data-testid="pending-orders"]')).toBeVisible();
      
      // Test order status update
      const firstOrder = page.locator('[data-testid="order-item"]').first();
      if (await firstOrder.count() > 0) {
        await firstOrder.locator('[data-testid="mark-ready"]').click();
        await expect(page.locator('[data-testid="success-toast"]')).toBeVisible();
      }
    });

    test('should test waiter dashboard functionality', async ({ page }) => {
      await testHelper.loginAsStaff('garcom');
      
      await page.goto('/admin/garcom');
      
      // Verify waiter panel elements
      await expect(page.locator('h1')).toContainText('Painel do Garçom');
      await expect(page.locator('[data-testid="active-tables"]')).toBeVisible();
      await expect(page.locator('[data-testid="ready-orders"]')).toBeVisible();
      
      // Test table management
      const firstTable = page.locator('[data-testid="table-item"]').first();
      if (await firstTable.count() > 0) {
        await firstTable.click();
        await expect(page.locator('[data-testid="table-details"]')).toBeVisible();
      }
    });

    test('should test real-time dashboard updates', async ({ page }) => {
      await testHelper.loginAsStaff('gerente');
      
      // Get initial metrics
      const initialSales = await page.locator('[data-testid="sales-metric"]').textContent();
      
      // Simulate new order (would typically come from WebSocket)
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('newOrder', {
          detail: { orderId: 'test-123', amount: 50.00 }
        }));
      });
      
      // Wait for update (if real-time updates are implemented)
      await page.waitForTimeout(1000);
      
      // Note: This would need actual WebSocket implementation to test properly
      console.log('Initial sales:', initialSales);
    });
  });

  test.describe('Route Protection Tests', () => {
    test('should protect admin routes from unauthorized access', async ({ page }) => {
      // Try to access admin route without login
      await page.goto('/admin/dashboard');
      
      // Should redirect to login
      await expect(page).toHaveURL('/admin/login');
    });

    test('should protect role-specific routes', async ({ page }) => {
      // Login as garcom
      await testHelper.loginAsStaff('garcom');
      
      // Try to access gerente-only route
      await page.goto('/admin/gerencia');
      
      // Should show access denied or redirect
      await expect(page.locator('text=Acesso Negado')).toBeVisible();
    });

    test('should allow access to public routes', async ({ page }) => {
      const publicRoutes = routeGraphMapper.getRoutesByTestCategory('e2e')
        .filter(route => route.isPublic);
      
      for (const route of publicRoutes.slice(0, 5)) { // Test first 5 to save time
        let testPath = route.path.replace(':numeroMesa', '1');
        await page.goto(testPath);
        
        // Should not redirect to login
        await expect(page).not.toHaveURL('/admin/login');
        
        // Should have some content
        await expect(page.locator('body')).not.toBeEmpty();
      }
    });
  });

  test.describe('Mobile Responsiveness Tests', () => {
    test('should work on mobile devices - customer flow', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Test mobile reservation flow
      await testHelper.createTestReservation();
      
      // Verify mobile-friendly elements
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    });

    test('should work on tablet - staff dashboard', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await testHelper.loginAsStaff('garcom');
      await page.goto('/admin/garcom');
      
      // Verify tablet layout
      await expect(page.locator('[data-testid="tablet-layout"]')).toBeVisible();
    });
  });

  test.describe('Error Handling Tests', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate offline mode
      await page.context().setOffline(true);
      
      await testHelper.navigateToRoute('menu-public');
      
      // Should show offline message
      await expect(page.locator('[data-testid="offline-message"]')).toBeVisible();
      
      // Restore connection
      await page.context().setOffline(false);
    });

    test('should handle invalid PIN gracefully', async ({ page }) => {
      await page.goto('/mesa/1/pin');
      
      // Enter invalid PIN
      await page.fill('input[type="text"]', '0000');
      await page.click('button[type="submit"]');
      
      // Should show error message
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('text=PIN inválido')).toBeVisible();
    });

    test('should handle payment failures', async ({ page }) => {
      await testHelper.navigateToRoute('cardapio-mesa');
      await testHelper.addItemToOrder('Hambúrguer Artesanal');
      await testHelper.proceedToPayment();
      
      // Simulate payment failure
      await page.evaluate(() => {
        window.mockPaymentFailure = true;
      });
      
      await testHelper.selectPaymentMethod('pix');
      await page.click('[data-testid="confirm-payment"]');
      
      // Should show payment error
      await expect(page.locator('[data-testid="payment-error"]')).toBeVisible();
    });
  });

  test.describe('Performance Tests', () => {
    test('should load pages within acceptable time limits', async ({ page }) => {
      const criticalRoutes = routeGraphMapper.getCriticalPath().slice(0, 3);
      
      for (const route of criticalRoutes) {
        const startTime = Date.now();
        
        let testPath = route.path.replace(':numeroMesa', '1');
        await page.goto(testPath);
        
        const loadTime = Date.now() - startTime;
        
        // Pages should load within 3 seconds
        expect(loadTime).toBeLessThan(3000);
        
        console.log(`Route ${route.path} loaded in ${loadTime}ms`);
      }
    });

    test('should handle concurrent users simulation', async ({ browser }) => {
      // Create multiple contexts to simulate concurrent users
      const contexts = await Promise.all([
        browser.newContext(),
        browser.newContext(),
        browser.newContext()
      ]);
      
      const pages = await Promise.all(
        contexts.map(context => context.newPage())
      );
      
      // Simulate concurrent access
      await Promise.all(
        pages.map(async (page, index) => {
          const helper = new ChefORGTestHelper(page);
          if (index === 0) {
            await helper.createTestReservation();
          } else {
            await helper.navigateToRoute('menu-public');
          }
        })
      );
      
      // Clean up
      await Promise.all(contexts.map(context => context.close()));
    });
  });
});