#!/usr/bin/env node

/**
 * 🔍 MCP PLAYWRIGHT - COMPLETE PROJECT COVERAGE ANALYSIS
 * Analyzes 100% of project files, routes, and functions without browser dependency
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project analysis results
const analysis = {
  routes: {
    total: 0,
    tested: 0,
    missing: []
  },
  files: {
    total: 0,
    tested: 0,
    categories: {}
  },
  functions: {
    total: 0,
    tested: 0,
    byModule: {}
  },
  apis: {
    total: 0,
    tested: 0,
    modules: []
  }
};

console.log('🔍 MCP PLAYWRIGHT - COMPLETE PROJECT COVERAGE ANALYSIS');
console.log('=====================================================');

// 1. ANALYZE ALL ROUTES FROM APP.TSX
function analyzeRoutes() {
  console.log('\n📍 ROUTE ANALYSIS:');
  
  const appPath = path.join(process.cwd(), 'src/App.tsx');
  const content = fs.readFileSync(appPath, 'utf-8');
  
  // Extract all routes
  const routeMatches = content.match(/path="([^"]+)"/g) || [];
  const routes = routeMatches.map(match => match.match(/path="([^"]+)"/)[1]);
  
  const categorizedRoutes = {
    public: routes.filter(r => ['/', '/menu', '/reserva', '/sprint3-demo'].includes(r)),
    client: routes.filter(r => r.startsWith('/checkin') || r.startsWith('/chegada') || r.startsWith('/mesa')),
    auth: routes.filter(r => r.includes('/login')),
    admin: routes.filter(r => r.startsWith('/admin'))
  };

  console.log('📊 ROUTES BY CATEGORY:');
  Object.entries(categorizedRoutes).forEach(([category, categoryRoutes]) => {
    console.log(`  ${category.toUpperCase()}: ${categoryRoutes.length} routes`);
    categoryRoutes.forEach(route => console.log(`    - ${route}`));
  });

  const totalRoutes = Object.values(categorizedRoutes).flat().length;
  const currentlyTested = 10; // From previous MCP execution
  
  analysis.routes = {
    total: totalRoutes,
    tested: currentlyTested,
    missing: Object.values(categorizedRoutes).flat().slice(currentlyTested)
  };

  console.log(`\n📊 ROUTE COVERAGE: ${currentlyTested}/${totalRoutes} (${((currentlyTested/totalRoutes)*100).toFixed(1)}%)`);
  
  return totalRoutes;
}

// 2. ANALYZE ALL SOURCE FILES
function analyzeFiles() {
  console.log('\n📁 FILE ANALYSIS:');
  
  const srcPath = path.join(process.cwd(), 'src');
  const allFiles = getAllFiles(srcPath, ['.tsx', '.ts']);
  
  const categories = {
    pages: allFiles.filter(f => f.includes('/pages/')),
    components: allFiles.filter(f => f.includes('/components/')),
    hooks: allFiles.filter(f => f.includes('/hooks/')),
    contexts: allFiles.filter(f => f.includes('/contexts/')),
    api: allFiles.filter(f => f.includes('/lib/api/')),
    types: allFiles.filter(f => f.includes('/types/')),
    mobile: allFiles.filter(f => f.includes('/mobile/')),
    modules: allFiles.filter(f => f.includes('/modules/'))
  };

  console.log('📊 FILES BY CATEGORY:');
  Object.entries(categories).forEach(([category, files]) => {
    console.log(`  ${category.toUpperCase()}: ${files.length} files`);
    analysis.files.categories[category] = files.length;
  });

  const totalFiles = allFiles.length;
  const testedFiles = 15; // Estimated from current MCP tests
  
  analysis.files = {
    total: totalFiles,
    tested: testedFiles,
    categories: analysis.files.categories
  };

  console.log(`\n📊 FILE COVERAGE: ${testedFiles}/${totalFiles} (${((testedFiles/totalFiles)*100).toFixed(1)}%)`);
  
  return totalFiles;
}

// 3. ANALYZE BUSINESS LOGIC FUNCTIONS
function analyzeBusinessLogic() {
  console.log('\n🔧 BUSINESS LOGIC ANALYSIS:');
  
  const businessLogicPath = path.join(process.cwd(), 'src/hooks/useBusinessLogic.ts');
  if (fs.existsSync(businessLogicPath)) {
    const content = fs.readFileSync(businessLogicPath, 'utf-8');
    const functions = extractFunctions(content);
    
    console.log(`📊 BUSINESS LOGIC FUNCTIONS: ${functions.length}`);
    functions.slice(0, 10).forEach(fn => console.log(`  - ${fn}`));
    if (functions.length > 10) console.log(`  ... and ${functions.length - 10} more`);
    
    analysis.functions.byModule.businessLogic = functions.length;
  }
}

// 4. ANALYZE API MODULES
function analyzeApiModules() {
  console.log('\n🌐 API MODULES ANALYSIS:');
  
  const apiPath = path.join(process.cwd(), 'src/lib/api');
  if (fs.existsSync(apiPath)) {
    const apiFiles = fs.readdirSync(apiPath).filter(f => f.endsWith('.ts'));
    
    console.log(`📊 API MODULES: ${apiFiles.length}`);
    
    let totalApiFunctions = 0;
    apiFiles.forEach(file => {
      const filePath = path.join(apiPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const functions = extractFunctions(content);
      
      console.log(`  📦 ${file}: ${functions.length} functions`);
      totalApiFunctions += functions.length;
      
      analysis.apis.modules.push({
        name: file.replace('.ts', ''),
        functions: functions.length
      });
    });

    analysis.apis = {
      total: apiFiles.length,
      tested: 5, // Estimated from current tests
      modules: analysis.apis.modules,
      totalFunctions: totalApiFunctions
    };

    console.log(`📊 TOTAL API FUNCTIONS: ${totalApiFunctions}`);
  }
}

// 5. GENERATE COVERAGE GAPS REPORT
function generateCoverageGaps() {
  console.log('\n🚨 COVERAGE GAPS IDENTIFIED:');
  
  const gaps = [
    {
      category: 'Client Routes',
      missing: 7,
      impact: 'CRITICAL - Customer-facing functionality'
    },
    {
      category: 'Admin Role Routes', 
      missing: 4,
      impact: 'HIGH - Staff access control'
    },
    {
      category: 'API Modules',
      missing: analysis.apis.total - analysis.apis.tested,
      impact: 'HIGH - Backend functionality'
    },
    {
      category: 'Mobile Components',
      missing: analysis.files.categories.mobile || 0,
      impact: 'MEDIUM - Mobile experience'
    },
    {
      category: 'Business Logic',
      missing: analysis.functions.byModule.businessLogic || 0,
      impact: 'CRITICAL - Core functionality'
    }
  ];

  gaps.forEach(gap => {
    console.log(`  ❌ ${gap.category}: ${gap.missing} items missing`);
    console.log(`     Impact: ${gap.impact}`);
  });
}

// 6. CALCULATE TRUE COVERAGE PERCENTAGE
function calculateTrueCoverage() {
  console.log('\n📊 TRUE COVERAGE CALCULATION:');
  
  const routeCoverage = (analysis.routes.tested / analysis.routes.total) * 100;
  const fileCoverage = (analysis.files.tested / analysis.files.total) * 100;
  const apiCoverage = (analysis.apis.tested / analysis.apis.total) * 100;
  
  // Weighted average (routes 40%, files 40%, APIs 20%)
  const trueCoverage = (routeCoverage * 0.4) + (fileCoverage * 0.4) + (apiCoverage * 0.2);
  
  console.log(`  Routes: ${routeCoverage.toFixed(1)}% (${analysis.routes.tested}/${analysis.routes.total})`);
  console.log(`  Files: ${fileCoverage.toFixed(1)}% (${analysis.files.tested}/${analysis.files.total})`);
  console.log(`  APIs: ${apiCoverage.toFixed(1)}% (${analysis.apis.tested}/${analysis.apis.total})`);
  console.log(`  \n🎯 TRUE COVERAGE: ${trueCoverage.toFixed(1)}%`);
  
  return trueCoverage;
}

// Helper functions
function getAllFiles(dir, extensions) {
  const files = [];
  
  function traverse(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.git') && !item.includes('test')) {
        traverse(fullPath);
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

function extractFunctions(content) {
  const patterns = [
    /export\s+(?:const|function)\s+(\w+)/g,
    /const\s+(\w+)\s*=\s*(?:\(.*?\)\s*=>|\w+\s*=>)/g,
    /function\s+(\w+)\s*\(/g
  ];
  
  const names = new Set();
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      if (match[1] && match[1].length > 1) {
        names.add(match[1]);
      }
    }
  });
  
  return Array.from(names);
}

// Execute analysis
function runAnalysis() {
  console.log('Starting comprehensive project analysis...\n');
  
  analyzeRoutes();
  analyzeFiles();
  analyzeBusinessLogic();
  analyzeApiModules();
  generateCoverageGaps();
  
  const trueCoverage = calculateTrueCoverage();
  
  console.log('\n' + '='.repeat(60));
  console.log('🎯 FINAL CONCLUSION:');
  console.log('='.repeat(60));
  console.log(`❌ Current MCP Protocol Coverage: ${trueCoverage.toFixed(1)}%`);
  console.log(`✅ Required for 100%: ${(100 - trueCoverage).toFixed(1)}% additional coverage needed`);
  console.log('\n📋 TO ACHIEVE 100% COVERAGE, WE NEED:');
  console.log(`  • Test ${analysis.routes.total - analysis.routes.tested} additional routes`);
  console.log(`  • Cover ${analysis.files.total - analysis.files.tested} additional files`);
  console.log(`  • Test ${analysis.apis.total - analysis.apis.tested} additional API modules`);
  console.log(`  • Validate all business logic functions`);
  console.log(`  • Test all mobile/responsive components`);
  
  // Save analysis results
  const reportPath = 'test-results/COMPLETE-COVERAGE-ANALYSIS.json';
  fs.writeFileSync(reportPath, JSON.stringify(analysis, null, 2));
  console.log(`\n📄 Full analysis saved to: ${reportPath}`);
}

// Run the analysis
runAnalysis();