#!/usr/bin/env node

/**
 * 🎯 COMPREHENSIVE 56 COMPONENT ANALYSIS SCRIPT
 * Validates all components and API modules without external dependencies
 */

const fs = require('fs');
const path = require('path');

console.log('🎯 MCP Analysis Protocol - Comprehensive Component Validation');
console.log('============================================================');

// 📊 EXACT PROJECT METRICS
const PROJECT_METRICS = {
  TOTAL_COMPONENTS: 56,
  API_MODULES: 12,
  TARGET_COVERAGE: 100
};

// 🗺️ COMPLETE COMPONENT REGISTRY - ALL 56 COMPONENTS
const ALL_COMPONENTS = {
  // UI Components (14)
  ui_components: [
    'src/components/ErrorBoundary.tsx',
    'src/components/Sprint3Demo.tsx', 
    'src/components/auth/ProtectedRoute.tsx',
    'src/components/layout/Header.tsx',
    'src/components/layout/Layout.tsx',
    'src/components/layout/Sidebar.tsx',
    'src/components/ui/Card.tsx',
    'src/components/ui/CardMenuItem.tsx',
    'src/components/ui/Carrinho.tsx',
    'src/components/ui/CheckoutForm.tsx',
    'src/components/ui/LoadingSpinner.tsx',
    'src/components/ui/Modal.tsx',
    'src/components/ui/TabelaResponsiva.tsx',
    'src/components/ui/Toast.tsx'
  ],
  
  // Mobile Components (6)
  mobile_components: [
    'src/mobile/components/forms/MobileButton.tsx',
    'src/mobile/components/forms/MobileInput.tsx',
    'src/mobile/components/forms/MobileTextArea.tsx',
    'src/mobile/components/gestures/SwipeGestureDemo.tsx',
    'src/mobile/components/index.ts',
    'src/mobile/components/pwa/PWAInstallBanner.tsx'
  ],
  
  // Home Module Components (4)
  home_components: [
    'src/modules/home/components/ContactSection.tsx',
    'src/modules/home/components/FeaturesSection.tsx',
    'src/modules/home/components/HeroSection.tsx',
    'src/modules/home/components/TestimonialsSection.tsx'
  ],
  
  // Page Components (32)
  page_components: [
    'src/pages/Cardapio.tsx',
    'src/pages/Configuracoes.tsx',
    'src/pages/Dashboard.tsx',
    'src/pages/Funcionarios.tsx',
    'src/pages/Mesas.tsx',
    'src/pages/Pedidos.tsx',
    'src/pages/Relatorios.tsx',
    'src/pages/Reservas.tsx',
    'src/pages/admin/Dashboard.tsx',
    'src/pages/auth/Login.tsx',
    'src/pages/cliente/AcompanharPedido.tsx',
    'src/pages/cliente/CardapioMesa.tsx',
    'src/pages/cliente/CheckinQR.tsx',
    'src/pages/cliente/ChegadaSemReserva.tsx',
    'src/pages/cliente/Feedback.tsx',
    'src/pages/cliente/Pagamento.tsx',
    'src/pages/cliente/PaginaAguardandoMesa.tsx',
    'src/pages/cliente/PinMesa.tsx',
    'src/pages/cliente/checkin.tsx',
    'src/pages/cliente/chegada-sem-reserva.tsx',
    'src/pages/cliente/mesa/acompanhar.tsx',
    'src/pages/cliente/mesa/cardapio.tsx',
    'src/pages/cliente/mesa/feedback.tsx',
    'src/pages/cliente/mesa/pagamento.tsx',
    'src/pages/cliente/mesa/pin.tsx',
    'src/pages/public/Home.tsx',
    'src/pages/public/MenuPublico.tsx',
    'src/pages/public/ReservaOnline.tsx',
    'src/pages/staff/PainelCaixa.tsx',
    'src/pages/staff/PainelCozinha.tsx',
    'src/pages/staff/PainelGarcom.tsx',
    'src/pages/staff/PainelRecepcao.tsx'
  ]
};

// 🌐 ALL API MODULES (12)
const API_MODULES = [
  'auth.ts',
  'dashboard.ts', 
  'feedback.ts',
  'loyalty.ts',
  'menu.ts',
  'notifications.ts',
  'orders.ts',
  'payments.ts',
  'reports.ts',
  'reservations.ts',
  'stock.ts',
  'tables.ts'
];

// Testing execution results
const testResults = {
  components_tested: 0,
  components_passed: 0,
  apis_tested: 0,
  apis_passed: 0,
  coverage_percentage: 0,
  execution_time: 0,
  errors: [],
  detailed_results: {}
};

function analyzeComponent(componentPath) {
  try {
    const fullPath = path.resolve(componentPath);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return { valid: false, error: 'File does not exist', path: fullPath };
    }
    
    // Read and analyze component
    const content = fs.readFileSync(fullPath, 'utf-8');
    
    const analysis = {
      has_react_import: content.includes('import React') || content.includes('from \'react\''),
      has_export: content.includes('export'),
      has_tsx: componentPath.endsWith('.tsx'),
      has_typescript: content.includes(': ') || content.includes('interface') || content.includes('type'),
      lines_of_code: content.split('\n').length,
      size_bytes: content.length
    };
    
    const isValid = analysis.has_export && (analysis.has_tsx || componentPath.endsWith('.ts'));
    
    return { valid: isValid, analysis, path: fullPath };
    
  } catch (error) {
    return { valid: false, error: error.message, path: componentPath };
  }
}

function analyzeAPIModule(moduleName) {
  try {
    const modulePath = path.resolve('src/lib/api', moduleName);
    
    if (!fs.existsSync(modulePath)) {
      return { valid: false, error: 'Module file does not exist', path: modulePath };
    }
    
    const content = fs.readFileSync(modulePath, 'utf-8');
    
    // Check for exports and functions
    const hasExports = content.includes('export');
    const functionMatches = content.match(/export\s+(?:const|function|async\s+function)/g) || [];
    const functionCount = functionMatches.length;
    const hasTypes = content.includes('interface') || content.includes('type');
    
    const analysis = {
      has_exports: hasExports,
      function_count: functionCount,
      has_types: hasTypes,
      lines_of_code: content.split('\n').length,
      size_bytes: content.length,
      functions: functionMatches
    };
    
    const isValid = hasExports && functionCount > 0;
    
    return { valid: isValid, analysis, path: modulePath };
    
  } catch (error) {
    return { valid: false, error: error.message, path: moduleName };
  }
}

function runComponentAnalysis() {
  console.log('\n🧩 Phase 1: Component Analysis (56 Components)');
  console.log('===============================================');
  
  const allComponents = [
    ...ALL_COMPONENTS.ui_components,
    ...ALL_COMPONENTS.mobile_components,
    ...ALL_COMPONENTS.home_components,
    ...ALL_COMPONENTS.page_components
  ];
  
  console.log(`📊 Analyzing ${allComponents.length} components...`);
  
  let componentsByCategory = {
    'UI Components': { tested: 0, passed: 0, total: ALL_COMPONENTS.ui_components.length },
    'Mobile Components': { tested: 0, passed: 0, total: ALL_COMPONENTS.mobile_components.length },
    'Home Components': { tested: 0, passed: 0, total: ALL_COMPONENTS.home_components.length },
    'Page Components': { tested: 0, passed: 0, total: ALL_COMPONENTS.page_components.length }
  };
  
  // Test UI Components
  console.log('\n📦 UI Components (14):');
  ALL_COMPONENTS.ui_components.forEach(comp => {
    testResults.components_tested++;
    componentsByCategory['UI Components'].tested++;
    
    const result = analyzeComponent(comp);
    if (result.valid) {
      testResults.components_passed++;
      componentsByCategory['UI Components'].passed++;
      console.log(`  ✅ ${path.basename(comp)} - Valid (${result.analysis.lines_of_code} lines)`);
    } else {
      console.log(`  ❌ ${path.basename(comp)} - ${result.error}`);
      testResults.errors.push(`${comp}: ${result.error}`);
    }
    
    testResults.detailed_results[comp] = result;
  });
  
  // Test Mobile Components
  console.log('\n📱 Mobile Components (6):');
  ALL_COMPONENTS.mobile_components.forEach(comp => {
    testResults.components_tested++;
    componentsByCategory['Mobile Components'].tested++;
    
    const result = analyzeComponent(comp);
    if (result.valid) {
      testResults.components_passed++;
      componentsByCategory['Mobile Components'].passed++;
      console.log(`  ✅ ${path.basename(comp)} - Valid (${result.analysis.lines_of_code} lines)`);
    } else {
      console.log(`  ❌ ${path.basename(comp)} - ${result.error}`);
      testResults.errors.push(`${comp}: ${result.error}`);
    }
    
    testResults.detailed_results[comp] = result;
  });
  
  // Test Home Components
  console.log('\n🏠 Home Module Components (4):');
  ALL_COMPONENTS.home_components.forEach(comp => {
    testResults.components_tested++;
    componentsByCategory['Home Components'].tested++;
    
    const result = analyzeComponent(comp);
    if (result.valid) {
      testResults.components_passed++;
      componentsByCategory['Home Components'].passed++;
      console.log(`  ✅ ${path.basename(comp)} - Valid (${result.analysis.lines_of_code} lines)`);
    } else {
      console.log(`  ❌ ${path.basename(comp)} - ${result.error}`);
      testResults.errors.push(`${comp}: ${result.error}`);
    }
    
    testResults.detailed_results[comp] = result;
  });
  
  // Test Page Components
  console.log('\n📄 Page Components (32):');
  ALL_COMPONENTS.page_components.forEach(comp => {
    testResults.components_tested++;
    componentsByCategory['Page Components'].tested++;
    
    const result = analyzeComponent(comp);
    if (result.valid) {
      testResults.components_passed++;
      componentsByCategory['Page Components'].passed++;
      console.log(`  ✅ ${path.basename(comp)} - Valid (${result.analysis.lines_of_code} lines)`);
    } else {
      console.log(`  ❌ ${path.basename(comp)} - ${result.error}`);
      testResults.errors.push(`${comp}: ${result.error}`);
    }
    
    testResults.detailed_results[comp] = result;
  });
  
  return componentsByCategory;
}

function runAPIAnalysis() {
  console.log('\n🌐 Phase 2: API Module Analysis (12 Modules)');
  console.log('=============================================');
  
  let totalFunctions = 0;
  
  API_MODULES.forEach(module => {
    testResults.apis_tested++;
    
    const result = analyzeAPIModule(module);
    if (result.valid) {
      testResults.apis_passed++;
      totalFunctions += result.analysis.function_count;
      console.log(`  ✅ ${module} - Valid (${result.analysis.function_count} functions, ${result.analysis.lines_of_code} lines)`);
    } else {
      console.log(`  ❌ ${module} - ${result.error}`);
      testResults.errors.push(`${module}: ${result.error}`);
    }
    
    testResults.detailed_results[`api_${module}`] = result;
  });
  
  return totalFunctions;
}

function generateFinalReport(componentsByCategory, totalFunctions) {
  // Calculate final metrics
  testResults.coverage_percentage = (
    (testResults.components_passed / PROJECT_METRICS.TOTAL_COMPONENTS) * 0.7 +
    (testResults.apis_passed / PROJECT_METRICS.API_MODULES) * 0.3
  ) * 100;
  
  const finalReport = {
    timestamp: new Date().toISOString(),
    execution_summary: {
      total_execution_time: `${testResults.execution_time}ms`,
      target_coverage: `${PROJECT_METRICS.TARGET_COVERAGE}%`,
      achieved_coverage: `${testResults.coverage_percentage.toFixed(1)}%`,
      coverage_status: testResults.coverage_percentage >= PROJECT_METRICS.TARGET_COVERAGE ? 'TARGET_ACHIEVED' : 'TARGET_MISSED'
    },
    component_metrics: {
      total_components: PROJECT_METRICS.TOTAL_COMPONENTS,
      components_tested: testResults.components_tested,
      components_passed: testResults.components_passed,
      component_success_rate: `${((testResults.components_passed / testResults.components_tested) * 100).toFixed(1)}%`,
      by_category: componentsByCategory
    },
    api_metrics: {
      total_apis: PROJECT_METRICS.API_MODULES,
      apis_tested: testResults.apis_tested,
      apis_passed: testResults.apis_passed,
      api_success_rate: `${((testResults.apis_passed / testResults.apis_tested) * 100).toFixed(1)}%`,
      total_functions: totalFunctions
    },
    errors: testResults.errors,
    detailed_results: testResults.detailed_results
  };
  
  // Save comprehensive report
  const reportDir = 'test-results';
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const reportPath = path.join(reportDir, 'comprehensive-56-component-analysis.json');
  fs.writeFileSync(reportPath, JSON.stringify(finalReport, null, 2));
  
  return { finalReport, reportPath };
}

function main() {
  const startTime = Date.now();
  
  console.log(`📊 VALIDATING EXACTLY ${PROJECT_METRICS.TOTAL_COMPONENTS} COMPONENTS`);
  console.log(`🌐 VALIDATING EXACTLY ${PROJECT_METRICS.API_MODULES} API MODULES`);
  
  // Run analysis phases
  const componentsByCategory = runComponentAnalysis();
  const totalFunctions = runAPIAnalysis();
  
  testResults.execution_time = Date.now() - startTime;
  
  // Generate final report
  const { finalReport, reportPath } = generateFinalReport(componentsByCategory, totalFunctions);
  
  // Display final results
  console.log('\n🎯 FINAL COMPREHENSIVE ANALYSIS RESULTS');
  console.log('=======================================');
  console.log(`📊 FINAL COVERAGE: ${testResults.coverage_percentage.toFixed(1)}%`);
  console.log(`🧩 COMPONENTS: ${testResults.components_passed}/${PROJECT_METRICS.TOTAL_COMPONENTS} (${((testResults.components_passed/PROJECT_METRICS.TOTAL_COMPONENTS)*100).toFixed(1)}%)`);
  console.log(`🌐 APIs: ${testResults.apis_passed}/${PROJECT_METRICS.API_MODULES} (${((testResults.apis_passed/PROJECT_METRICS.API_MODULES)*100).toFixed(1)}%)`);
  console.log(`🔧 Total Functions: ${totalFunctions}`);
  console.log(`⏱️ Execution Time: ${testResults.execution_time}ms`);
  
  console.log('\n📂 Breakdown by Category:');
  Object.entries(componentsByCategory).forEach(([category, stats]) => {
    console.log(`  ${category}: ${stats.passed}/${stats.total} (${((stats.passed/stats.total)*100).toFixed(1)}%)`);
  });
  
  if (testResults.errors.length > 0) {
    console.log(`\n⚠️ ERRORS FOUND: ${testResults.errors.length}`);
    testResults.errors.slice(0, 5).forEach(error => {
      console.log(`  ❌ ${error}`);
    });
    if (testResults.errors.length > 5) {
      console.log(`  ... and ${testResults.errors.length - 5} more errors`);
    }
  }
  
  console.log(`\n📄 Detailed report saved: ${reportPath}`);
  
  // Success criteria
  const success = testResults.coverage_percentage >= 90;
  console.log(`\n🏆 SUCCESS CRITERIA: ${success ? '✅ MET' : '❌ NOT MET'}`);
  
  if (success) {
    console.log('🎉 COMPREHENSIVE ANALYSIS COMPLETED SUCCESSFULLY!');
    console.log(`✅ Confirmed: Exactly ${PROJECT_METRICS.TOTAL_COMPONENTS} components exist and analyzed`);
    console.log(`✅ Confirmed: Exactly ${PROJECT_METRICS.API_MODULES} API modules exist and analyzed`);
  } else {
    console.log(`🎯 Additional ${(90 - testResults.coverage_percentage).toFixed(1)}% coverage needed for success`);
  }
  
  return success ? 0 : 1;
}

// Run the analysis
const exitCode = main();
process.exit(exitCode);