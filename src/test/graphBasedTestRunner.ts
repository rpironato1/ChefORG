/**
 * Graph Theory-Based Test Runner for ChefORG
 * 
 * This module uses the route dependency graph to execute tests in the optimal order,
 * ensuring dependencies are tested before dependent components.
 */

import { routeGraphMapper, RouteNode } from '../src/test/routeGraphMapper';

export interface TestExecutionPlan {
  phase: string;
  routes: RouteNode[];
  testTypes: string[];
  estimatedDuration: number; // in minutes
  priority: number;
}

export class GraphBasedTestRunner {
  private testPlans: TestExecutionPlan[] = [];

  constructor() {
    this.generateTestExecutionPlans();
  }

  private generateTestExecutionPlans() {
    // Phase 1: Critical Path Tests (Highest Priority)
    const criticalRoutes = routeGraphMapper.getCriticalPath();
    this.testPlans.push({
      phase: 'Critical Path',
      routes: criticalRoutes,
      testTypes: ['unit', 'integration', 'e2e'],
      estimatedDuration: 15,
      priority: 10
    });

    // Phase 2: Dashboard Tests
    const dashboardRoutes = routeGraphMapper.getDashboardRoutes();
    this.testPlans.push({
      phase: 'Dashboard Components',
      routes: dashboardRoutes,
      testTypes: ['unit', 'dashboard', 'integration'],
      estimatedDuration: 20,
      priority: 9
    });

    // Phase 3: User Flow Tests
    const userFlows = routeGraphMapper.getUserFlowPaths();
    Object.entries(userFlows).forEach(([flowName, routes]) => {
      this.testPlans.push({
        phase: `User Flow: ${flowName}`,
        routes,
        testTypes: ['integration', 'e2e'],
        estimatedDuration: 10,
        priority: 8
      });
    });

    // Phase 4: Comprehensive Route Tests
    const allRoutes = routeGraphMapper.getTestExecutionOrder();
    this.testPlans.push({
      phase: 'All Routes Comprehensive',
      routes: allRoutes,
      testTypes: ['unit', 'integration'],
      estimatedDuration: 30,
      priority: 6
    });

    // Sort plans by priority
    this.testPlans.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get test execution plan optimized by dependency graph
   */
  getOptimizedTestPlan(): TestExecutionPlan[] {
    return this.testPlans;
  }

  /**
   * Generate test commands based on route dependencies
   */
  generateTestCommands(): { [phase: string]: string[] } {
    const commands: { [phase: string]: string[] } = {};

    this.testPlans.forEach(plan => {
      commands[plan.phase] = [];

      plan.testTypes.forEach(testType => {
        switch (testType) {
          case 'unit':
            commands[plan.phase].push(`npm run test -- tests/unit/ --run`);
            break;
          case 'integration':
            commands[plan.phase].push(`npm run test -- tests/integration/ --run`);
            break;
          case 'dashboard':
            commands[plan.phase].push(`npm run test -- tests/unit/dashboard.test.tsx --run`);
            break;
          case 'e2e':
            // Generate targeted e2e tests based on routes
            const routePatterns = plan.routes
              .map(route => route.path.replace(/:/g, '\\:'))
              .join('|');
            commands[plan.phase].push(`npm run test:e2e -- --grep "${plan.phase}"`);
            break;
        }
      });
    });

    return commands;
  }

  /**
   * Generate dependency matrix for test impact analysis
   */
  generateTestImpactMatrix(): { [route: string]: string[] } {
    const matrix = routeGraphMapper.getTestDependencyMatrix();
    const impactMatrix: { [route: string]: string[] } = {};

    Object.keys(matrix).forEach(routeId => {
      const dependents = routeGraphMapper.getRouteDependents(routeId);
      impactMatrix[routeId] = dependents.map(route => route.id);
    });

    return impactMatrix;
  }

  /**
   * Get test order for specific test category
   */
  getTestOrderForCategory(category: string): RouteNode[] {
    return routeGraphMapper.getRoutesByTestCategory(category);
  }

  /**
   * Calculate test coverage by route priority
   */
  calculateTestCoverage(): {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  } {
    const allRoutes = routeGraphMapper.getTestExecutionOrder();
    const totalRoutes = allRoutes.length;
    
    const critical = allRoutes.filter(r => r.priority >= 10).length;
    const high = allRoutes.filter(r => r.priority >= 8 && r.priority < 10).length;
    const medium = allRoutes.filter(r => r.priority >= 6 && r.priority < 8).length;
    const low = allRoutes.filter(r => r.priority < 6).length;

    return {
      critical: (critical / totalRoutes) * 100,
      high: (high / totalRoutes) * 100,
      medium: (medium / totalRoutes) * 100,
      low: (low / totalRoutes) * 100,
      total: totalRoutes
    };
  }

  /**
   * Generate CI/CD pipeline configuration
   */
  generateCIPipelineConfig(): {
    stages: Array<{
      name: string;
      commands: string[];
      duration: number;
      parallel: boolean;
    }>;
  } {
    const stages = this.testPlans.map(plan => ({
      name: plan.phase.toLowerCase().replace(/\s+/g, '-'),
      commands: [
        ...this.generateTestCommands()[plan.phase],
        `echo "Completed ${plan.phase} tests"`
      ],
      duration: plan.estimatedDuration,
      parallel: plan.testTypes.includes('unit') && plan.testTypes.includes('integration')
    }));

    return { stages };
  }

  /**
   * Get routes that should be tested when a specific route changes
   */
  getImpactedRoutes(changedRouteId: string): RouteNode[] {
    const dependents = routeGraphMapper.getRouteDependents(changedRouteId);
    const changedRoute = routeGraphMapper.getRouteDetails(changedRouteId);
    
    if (!changedRoute) return [];

    return [changedRoute, ...dependents];
  }

  /**
   * Generate test report with route dependency information
   */
  generateTestReport(): {
    summary: {
      totalRoutes: number;
      testableRoutes: number;
      criticalPaths: number;
      userFlows: number;
    };
    phases: TestExecutionPlan[];
    dependencyMatrix: { [route: string]: string[] };
    coverage: ReturnType<typeof this.calculateTestCoverage>;
  } {
    const allRoutes = routeGraphMapper.getTestExecutionOrder();
    const testableRoutes = allRoutes.filter(r => r.testCategories.length > 0);
    const userFlows = Object.keys(routeGraphMapper.getUserFlowPaths());

    return {
      summary: {
        totalRoutes: allRoutes.length,
        testableRoutes: testableRoutes.length,
        criticalPaths: routeGraphMapper.getCriticalPath().length,
        userFlows: userFlows.length
      },
      phases: this.testPlans,
      dependencyMatrix: this.generateTestImpactMatrix(),
      coverage: this.calculateTestCoverage()
    };
  }

  /**
   * Validate test setup based on route dependencies
   */
  validateTestSetup(): {
    valid: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check if all critical routes have tests
    const criticalRoutes = routeGraphMapper.getCriticalPath();
    const untestedCriticalRoutes = criticalRoutes.filter(r => r.testCategories.length === 0);
    
    if (untestedCriticalRoutes.length > 0) {
      issues.push(`${untestedCriticalRoutes.length} critical routes lack test coverage`);
      recommendations.push('Add test categories to critical routes');
    }

    // Check if dashboard routes have dashboard tests
    const dashboardRoutes = routeGraphMapper.getDashboardRoutes();
    const dashboardsWithoutTests = dashboardRoutes.filter(r => 
      !r.testCategories.includes('dashboard')
    );

    if (dashboardsWithoutTests.length > 0) {
      issues.push(`${dashboardsWithoutTests.length} dashboard routes lack dashboard-specific tests`);
      recommendations.push('Add dashboard test category to dashboard routes');
    }

    // Check dependency cycles
    const dependencyMatrix = routeGraphMapper.getTestDependencyMatrix();
    // Simple cycle detection (more sophisticated algorithms could be used)
    const hasCycles = this.detectDependencyCycles(dependencyMatrix);
    
    if (hasCycles) {
      issues.push('Circular dependencies detected in route graph');
      recommendations.push('Review and break circular dependencies');
    }

    return {
      valid: issues.length === 0,
      issues,
      recommendations
    };
  }

  private detectDependencyCycles(matrix: { [key: string]: string[] }): boolean {
    // Simple DFS cycle detection
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (node: string): boolean => {
      visited.add(node);
      recursionStack.add(node);

      const dependencies = matrix[node] || [];
      for (const dep of dependencies) {
        if (!visited.has(dep)) {
          if (hasCycle(dep)) return true;
        } else if (recursionStack.has(dep)) {
          return true; // Cycle found
        }
      }

      recursionStack.delete(node);
      return false;
    };

    for (const node of Object.keys(matrix)) {
      if (!visited.has(node)) {
        if (hasCycle(node)) return true;
      }
    }

    return false;
  }
}

// Export singleton instance
export const graphBasedTestRunner = new GraphBasedTestRunner();