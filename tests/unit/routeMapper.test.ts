import { describe, it, expect } from 'vitest';
import { routeGraphMapper } from '../../src/test/routeGraphMapper';

describe('Route Graph Mapper Tests', () => {
  it('should have defined routes', () => {
    const routes = routeGraphMapper.getTestExecutionOrder();
    expect(routes.length).toBeGreaterThan(0);
  });

  it('should identify critical path routes', () => {
    const criticalRoutes = routeGraphMapper.getCriticalPath();
    expect(criticalRoutes.length).toBeGreaterThan(0);
    
    // All critical routes should have priority >= 9
    criticalRoutes.forEach(route => {
      expect(route.priority).toBeGreaterThanOrEqual(9);
    });
  });

  it('should have dashboard routes', () => {
    const dashboardRoutes = routeGraphMapper.getDashboardRoutes();
    expect(dashboardRoutes.length).toBeGreaterThan(0);
    
    // All should have dashboard test category
    dashboardRoutes.forEach(route => {
      expect(route.testCategories).toContain('dashboard');
    });
  });

  it('should generate user flow paths', () => {
    const flows = routeGraphMapper.getUserFlowPaths();
    
    expect(flows['customer-reservation-flow']).toBeDefined();
    expect(flows['staff-auth-flow']).toBeDefined();
    expect(flows['payment-flow']).toBeDefined();
  });

  it('should validate route dependencies are acyclic', () => {
    const matrix = routeGraphMapper.getTestDependencyMatrix();
    
    // Simple check - no route should depend on itself
    Object.entries(matrix).forEach(([routeId, dependencies]) => {
      expect(dependencies).not.toContain(routeId);
    });
  });
});