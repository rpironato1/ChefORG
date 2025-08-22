#!/usr/bin/env node

/**
 * ChefORG Graph-Based Test Runner
 * 
 * This script demonstrates how to use graph theory to optimize test execution
 * based on route dependencies and priorities.
 */

import { graphBasedTestRunner } from '../src/test/graphBasedTestRunner.js';

function displayTestPlan() {
  console.log('🎯 ChefORG Graph-Based Test Execution Plan\n');
  console.log('═'.repeat(80));
  
  const testPlan = graphBasedTestRunner.getOptimizedTestPlan();
  const report = graphBasedTestRunner.generateTestReport();
  
  // Display summary
  console.log('📊 Test Coverage Summary:');
  console.log(`   Total Routes: ${report.summary.totalRoutes}`);
  console.log(`   Testable Routes: ${report.summary.testableRoutes}`);
  console.log(`   Critical Paths: ${report.summary.criticalPaths}`);
  console.log(`   User Flows: ${report.summary.userFlows}`);
  console.log('');
  
  // Display coverage breakdown
  console.log('📈 Priority Coverage:');
  console.log(`   Critical (10):  ${report.coverage.critical.toFixed(1)}%`);
  console.log(`   High (8-9):     ${report.coverage.high.toFixed(1)}%`);
  console.log(`   Medium (6-7):   ${report.coverage.medium.toFixed(1)}%`);
  console.log(`   Low (<6):       ${report.coverage.low.toFixed(1)}%`);
  console.log('');
  
  // Display execution phases
  console.log('🚀 Execution Phases (Dependency-Ordered):');
  console.log('─'.repeat(80));
  
  testPlan.forEach((phase, index) => {
    console.log(`\n${index + 1}. ${phase.phase}`);
    console.log(`   Priority: ${phase.priority}/10`);
    console.log(`   Duration: ~${phase.estimatedDuration} minutes`);
    console.log(`   Test Types: ${phase.testTypes.join(', ')}`);
    console.log(`   Routes: ${phase.routes.length} routes`);
    
    if (phase.routes.length <= 5) {
      phase.routes.forEach(route => {
        console.log(`     • ${route.path} (${route.component})`);
      });
    } else {
      phase.routes.slice(0, 3).forEach(route => {
        console.log(`     • ${route.path} (${route.component})`);
      });
      console.log(`     ... and ${phase.routes.length - 3} more routes`);
    }
  });
  
  console.log('\n' + '═'.repeat(80));
  
  // Validation check
  const validation = graphBasedTestRunner.validateTestSetup();
  console.log('\n✅ Test Setup Validation:');
  
  if (validation.valid) {
    console.log('   ✓ Test setup is valid and ready for execution');
  } else {
    console.log('   ⚠️  Issues found:');
    validation.issues.forEach(issue => {
      console.log(`      • ${issue}`);
    });
    
    console.log('\n   💡 Recommendations:');
    validation.recommendations.forEach(rec => {
      console.log(`      • ${rec}`);
    });
  }
}

function displayCommands() {
  console.log('\n🔧 Generated Test Commands:');
  console.log('─'.repeat(80));
  
  const commands = graphBasedTestRunner.generateTestCommands();
  
  Object.entries(commands).forEach(([phase, cmds]) => {
    console.log(`\n${phase}:`);
    cmds.forEach(cmd => {
      console.log(`   $ ${cmd}`);
    });
  });
}

function displayCIConfig() {
  console.log('\n🔄 CI/CD Pipeline Configuration:');
  console.log('─'.repeat(80));
  
  const ciConfig = graphBasedTestRunner.generateCIPipelineConfig();
  
  ciConfig.stages.forEach((stage, index) => {
    console.log(`\nStage ${index + 1}: ${stage.name}`);
    console.log(`   Duration: ${stage.duration} minutes`);
    console.log(`   Parallel: ${stage.parallel ? 'Yes' : 'No'}`);
    console.log(`   Commands:`);
    stage.commands.forEach(cmd => {
      console.log(`     - ${cmd}`);
    });
  });
}

function displayDependencyMatrix() {
  console.log('\n🕸️  Route Dependency Matrix (Impact Analysis):');
  console.log('─'.repeat(80));
  
  const matrix = graphBasedTestRunner.generateTestImpactMatrix();
  
  Object.entries(matrix).forEach(([route, dependents]) => {
    if (dependents.length > 0) {
      console.log(`\n${route} affects:`);
      dependents.forEach(dep => {
        console.log(`   → ${dep}`);
      });
    }
  });
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'plan';
  
  switch (command) {
    case 'plan':
      displayTestPlan();
      break;
      
    case 'commands':
      displayCommands();
      break;
      
    case 'ci':
      displayCIConfig();
      break;
      
    case 'dependencies':
      displayDependencyMatrix();
      break;
      
    case 'all':
      displayTestPlan();
      displayCommands();
      displayCIConfig();
      displayDependencyMatrix();
      break;
      
    case 'run':
      console.log('🚀 Running Graph-Based Tests...\n');
      displayTestPlan();
      
      // Here you would actually execute the tests
      // For now, we'll just show what would be executed
      console.log('\n📝 Test execution would proceed in this order:');
      const testPlan = graphBasedTestRunner.getOptimizedTestPlan();
      testPlan.forEach((phase, index) => {
        console.log(`${index + 1}. Execute ${phase.phase} tests`);
      });
      
      console.log('\n✨ Test execution plan generated successfully!');
      break;
      
    default:
      console.log('ChefORG Graph-Based Test Runner\n');
      console.log('Usage: node test-runner.js [command]\n');
      console.log('Commands:');
      console.log('  plan         Show test execution plan (default)');
      console.log('  commands     Show generated test commands');
      console.log('  ci           Show CI/CD pipeline configuration');
      console.log('  dependencies Show route dependency matrix');
      console.log('  all          Show all information');
      console.log('  run          Execute tests in dependency order');
      console.log('\nExamples:');
      console.log('  node test-runner.js plan');
      console.log('  node test-runner.js run');
      console.log('  node test-runner.js all');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}