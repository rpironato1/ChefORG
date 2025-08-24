/**
 * MCP PLAYWRIGHT - PROTOCOLO DE TESTE AUTOMATIZADO v2.0
 * Execução Autônoma por Agente IA - Cobertura 90%+ com WCAG AA
 */

export interface MCPTestConfig {
  agent_mode: 'autonomous';
  human_intervention: false;
  coverage_target: number;
  wcag_compliance: 'AA';
  parallel_execution: boolean;
  self_healing: boolean;
}

export interface TestMetrics {
  coverage: number;
  wcag_score: number;
  errors: Error[];
  routes_tested: RouteTest[];
  execution_time: number;
  performance: PerformanceMetrics;
}

export interface RouteTest {
  url: string;
  wcag_passed: boolean;
  console_errors: ConsoleMessage[];
  performance_score: number;
}

export interface PerformanceMetrics {
  network: NetworkRequest[];
  console: ConsoleMessage[];
  wcag_violations: any[];
  performance_score: number;
}

export interface ConsoleMessage {
  level: 'error' | 'warning' | 'info' | 'debug';
  message: string;
  timestamp: number;
}

export interface NetworkRequest {
  url: string;
  method: string;
  status: number;
  time: number;
  size: number;
}

export interface WCAGCriterion {
  id: string;
  level: 'A' | 'AA' | 'AAA';
  description: string;
  test: () => Promise<boolean>;
}

export interface CoverageMatrix {
  functional: {
    navigation: number;
    forms: number;
    interactions: number;
    media: number;
    multi_context: number;
  };
  accessibility: {
    wcag_aa: number;
    keyboard: number;
  };
  total: number;
}

export const DEFAULT_CONFIG: MCPTestConfig = {
  agent_mode: 'autonomous',
  human_intervention: false,
  coverage_target: 0.90,
  wcag_compliance: 'AA',
  parallel_execution: true,
  self_healing: true
};

export const COVERAGE_MATRIX: CoverageMatrix = {
  functional: {
    navigation: 0.15,
    forms: 0.20,
    interactions: 0.25,
    media: 0.10,
    multi_context: 0.10
  },
  accessibility: {
    wcag_aa: 0.15,
    keyboard: 0.05
  },
  total: 0.90
};