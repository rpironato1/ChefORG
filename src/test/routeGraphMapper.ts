/**
 * Graph Theory Route Mapping System for ChefORG
 * 
 * This module applies graph theory concepts to map routes and their dependencies,
 * enabling precise test execution order and dependency management.
 */

export interface RouteNode {
  id: string;
  path: string;
  component: string;
  dependencies: string[];
  requiredRole?: string;
  isPublic: boolean;
  priority: number; // Higher = more critical
  testCategories: string[];
}

export interface RouteGraph {
  nodes: Map<string, RouteNode>;
  edges: Map<string, string[]>; // source -> targets
  reversedEdges: Map<string, string[]>; // target -> sources
}

export class RouteGraphMapper {
  private graph: RouteGraph;

  constructor() {
    this.graph = {
      nodes: new Map(),
      edges: new Map(),
      reversedEdges: new Map()
    };
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const routes: RouteNode[] = [
      // Public Routes
      {
        id: 'home',
        path: '/',
        component: 'Home',
        dependencies: [],
        isPublic: true,
        priority: 10,
        testCategories: ['unit', 'e2e']
      },
      {
        id: 'menu-public',
        path: '/menu',
        component: 'MenuPublico',
        dependencies: ['home'],
        isPublic: true,
        priority: 8,
        testCategories: ['unit', 'integration', 'e2e']
      },
      {
        id: 'reserva-online',
        path: '/reserva',
        component: 'ReservaOnline',
        dependencies: ['menu-public'],
        isPublic: true,
        priority: 9,
        testCategories: ['unit', 'integration', 'e2e']
      },

      // Client Routes (Mesa Flow)
      {
        id: 'checkin-qr',
        path: '/checkin',
        component: 'CheckinQR',
        dependencies: ['reserva-online'],
        isPublic: true,
        priority: 7,
        testCategories: ['unit', 'e2e']
      },
      {
        id: 'pin-mesa',
        path: '/mesa/:numeroMesa/pin',
        component: 'PinMesa',
        dependencies: ['checkin-qr'],
        isPublic: true,
        priority: 8,
        testCategories: ['unit', 'integration', 'e2e']
      },
      {
        id: 'cardapio-mesa',
        path: '/mesa/:numeroMesa/cardapio',
        component: 'CardapioMesa',
        dependencies: ['pin-mesa'],
        isPublic: true,
        priority: 9,
        testCategories: ['unit', 'integration', 'e2e']
      },
      {
        id: 'acompanhar-pedido',
        path: '/mesa/:numeroMesa/acompanhar',
        component: 'AcompanharPedido',
        dependencies: ['cardapio-mesa'],
        isPublic: true,
        priority: 8,
        testCategories: ['unit', 'integration', 'e2e']
      },
      {
        id: 'pagamento',
        path: '/mesa/:numeroMesa/pagamento',
        component: 'Pagamento',
        dependencies: ['acompanhar-pedido'],
        isPublic: true,
        priority: 10,
        testCategories: ['unit', 'integration', 'e2e']
      },
      {
        id: 'feedback',
        path: '/mesa/:numeroMesa/feedback',
        component: 'Feedback',
        dependencies: ['pagamento'],
        isPublic: true,
        priority: 6,
        testCategories: ['unit', 'e2e']
      },

      // Auth Routes
      {
        id: 'login',
        path: '/admin/login',
        component: 'Login',
        dependencies: [],
        isPublic: true,
        priority: 10,
        testCategories: ['unit', 'integration', 'e2e']
      },

      // Admin Dashboard Routes
      {
        id: 'admin-dashboard',
        path: '/admin/dashboard',
        component: 'Dashboard',
        dependencies: ['login'],
        requiredRole: 'admin',
        isPublic: false,
        priority: 10,
        testCategories: ['unit', 'integration', 'dashboard', 'e2e']
      },

      // Staff Routes
      {
        id: 'painel-recepcao',
        path: '/admin/recepcao',
        component: 'PainelRecepcao',
        dependencies: ['login'],
        requiredRole: 'recepcao',
        isPublic: false,
        priority: 9,
        testCategories: ['unit', 'integration', 'dashboard', 'e2e']
      },
      {
        id: 'painel-garcom',
        path: '/admin/garcom',
        component: 'PainelGarcom',
        dependencies: ['login'],
        requiredRole: 'garcom',
        isPublic: false,
        priority: 9,
        testCategories: ['unit', 'integration', 'dashboard', 'e2e']
      },
      {
        id: 'painel-cozinha',
        path: '/admin/cozinha',
        component: 'PainelCozinha',
        dependencies: ['login'],
        requiredRole: 'cozinheiro',
        isPublic: false,
        priority: 10,
        testCategories: ['unit', 'integration', 'dashboard', 'e2e']
      },
      {
        id: 'painel-caixa',
        path: '/admin/caixa',
        component: 'PainelCaixa',
        dependencies: ['login'],
        requiredRole: 'caixa',
        isPublic: false,
        priority: 10,
        testCategories: ['unit', 'integration', 'dashboard', 'e2e']
      },
      {
        id: 'painel-gerencia',
        path: '/admin/gerencia',
        component: 'PainelGerencia',
        dependencies: ['login'],
        requiredRole: 'gerente',
        isPublic: false,
        priority: 10,
        testCategories: ['unit', 'integration', 'dashboard', 'e2e']
      }
    ];

    // Add routes to graph
    routes.forEach(route => {
      this.graph.nodes.set(route.id, route);
    });

    // Build edges
    routes.forEach(route => {
      this.graph.edges.set(route.id, route.dependencies);
      
      // Build reversed edges for dependency tracking
      route.dependencies.forEach(dep => {
        if (!this.graph.reversedEdges.has(dep)) {
          this.graph.reversedEdges.set(dep, []);
        }
        this.graph.reversedEdges.get(dep)!.push(route.id);
      });
    });
  }

  /**
   * Get topological sort of routes for test execution order
   */
  getTestExecutionOrder(): RouteNode[] {
    const visited = new Set<string>();
    const result: RouteNode[] = [];

    const dfs = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const node = this.graph.nodes.get(nodeId);
      if (!node) return;

      // Visit dependencies first
      node.dependencies.forEach(dep => dfs(dep));
      
      result.push(node);
    };

    // Start DFS from all nodes
    Array.from(this.graph.nodes.keys()).forEach(nodeId => dfs(nodeId));

    // Sort by priority within the topological order
    return result.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get routes by test category
   */
  getRoutesByTestCategory(category: string): RouteNode[] {
    return Array.from(this.graph.nodes.values())
      .filter(route => route.testCategories.includes(category))
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get critical path for testing (routes with highest priority)
   */
  getCriticalPath(): RouteNode[] {
    return Array.from(this.graph.nodes.values())
      .filter(route => route.priority >= 9)
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get dashboard routes specifically for dashboard testing
   */
  getDashboardRoutes(): RouteNode[] {
    return Array.from(this.graph.nodes.values())
      .filter(route => route.testCategories.includes('dashboard'))
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get user flow paths (sequences of related routes)
   */
  getUserFlowPaths(): { [key: string]: RouteNode[] } {
    return {
      'customer-reservation-flow': this.getFlowPath('reserva-online', 'feedback'),
      'customer-walkin-flow': this.getFlowPath('checkin-qr', 'feedback'),
      'staff-auth-flow': this.getFlowPath('login', 'admin-dashboard'),
      'kitchen-workflow': this.getFlowPath('login', 'painel-cozinha'),
      'payment-flow': this.getFlowPath('cardapio-mesa', 'pagamento')
    };
  }

  /**
   * Get path between two routes
   */
  private getFlowPath(startId: string, endId: string): RouteNode[] {
    const visited = new Set<string>();
    const path: RouteNode[] = [];

    const dfs = (nodeId: string, target: string): boolean => {
      if (visited.has(nodeId)) return false;
      visited.add(nodeId);

      const node = this.graph.nodes.get(nodeId);
      if (!node) return false;

      path.push(node);

      if (nodeId === target) return true;

      // Check dependent routes
      const dependents = this.graph.reversedEdges.get(nodeId) || [];
      for (const dependent of dependents) {
        if (dfs(dependent, target)) return true;
      }

      path.pop();
      return false;
    };

    dfs(startId, endId);
    return path;
  }

  /**
   * Generate test dependency matrix
   */
  getTestDependencyMatrix(): { [key: string]: string[] } {
    const matrix: { [key: string]: string[] } = {};
    
    this.graph.nodes.forEach((route, id) => {
      matrix[id] = route.dependencies.slice();
    });

    return matrix;
  }

  /**
   * Get routes that depend on a specific route (for impact analysis)
   */
  getRouteDependents(routeId: string): RouteNode[] {
    const dependents = this.graph.reversedEdges.get(routeId) || [];
    return dependents
      .map(id => this.graph.nodes.get(id))
      .filter(Boolean) as RouteNode[];
  }

  /**
   * Check if route exists and get its details
   */
  getRouteDetails(routeId: string): RouteNode | null {
    return this.graph.nodes.get(routeId) || null;
  }
}

// Singleton instance
export const routeGraphMapper = new RouteGraphMapper();