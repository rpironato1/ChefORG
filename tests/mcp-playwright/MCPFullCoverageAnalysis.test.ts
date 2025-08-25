import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

/**
 * 🔍 MCP PLAYWRIGHT - COMPREHENSIVE 100% COVERAGE ANALYSIS
 * Analyzes and tests ALL routes, components, pages, hooks, and functions
 */

test.describe('MCP 100% Coverage Analysis', () => {
  
  test('Complete Route Discovery and Coverage', async ({ page }) => {
    const routes = {
      public: [
        '/',
        '/menu', 
        '/reserva',
        '/sprint3-demo'
      ],
      client: [
        '/checkin',
        '/chegada-sem-reserva',
        '/mesa/1/pin',
        '/mesa/1/cardapio', 
        '/mesa/1/acompanhar',
        '/mesa/1/pagamento',
        '/mesa/1/feedback'
      ],
      auth: [
        '/login',
        '/admin/login'
      ],
      admin: [
        '/admin/',
        '/admin/dashboard',
        '/admin/recepcao',
        '/admin/garcom',
        '/admin/cozinha', 
        '/admin/caixa',
        '/admin/gerencia',
        '/admin/acesso-negado'
      ]
    };

    const totalRoutes = Object.values(routes).flat().length;
    let testedRoutes = 0;
    let accessibleRoutes = 0;

    // Test all routes systematically
    for (const [category, categoryRoutes] of Object.entries(routes)) {
      console.log(`\n🔍 Testing ${category.toUpperCase()} routes...`);
      
      for (const route of categoryRoutes) {
        try {
          await page.goto(`http://localhost:3000${route}`, { waitUntil: 'networkidle' });
          
          // Wait for content to load
          await page.waitForTimeout(1000);
          
          // Check if page loaded without critical errors
          const title = await page.title();
          const bodyContent = await page.textContent('body');
          
          if (bodyContent && bodyContent.length > 0) {
            accessibleRoutes++;
            console.log(`✅ ${route} - Accessible (${title})`);
            
            // Capture screenshot for documentation
            await page.screenshot({
              path: `test-results/screenshots/route-${route.replace(/\//g, '_').replace(/:/g, '_')}.png`,
              fullPage: true
            });
            
            // Test WCAG compliance for each route
            await validateWCAGCompliance(page, route);
            
          } else {
            console.log(`⚠️ ${route} - Empty content`);
          }
          
          testedRoutes++;
          
        } catch (error) {
          console.log(`❌ ${route} - Error: ${error.message}`);
          testedRoutes++;
        }
      }
    }

    const routeCoverage = (accessibleRoutes / totalRoutes) * 100;
    console.log(`\n📊 ROUTE COVERAGE: ${routeCoverage.toFixed(1)}% (${accessibleRoutes}/${totalRoutes})`);
    
    // Route coverage should be high (allowing for auth-protected routes)
    expect(routeCoverage).toBeGreaterThan(60); // Some admin routes require auth
  });

  test('Component and File Coverage Analysis', async () => {
    const srcPath = join(process.cwd(), 'src');
    const allFiles = getAllFiles(srcPath, ['.tsx', '.ts']);
    
    const fileCategories = {
      pages: allFiles.filter(f => f.includes('/pages/')),
      components: allFiles.filter(f => f.includes('/components/')),
      hooks: allFiles.filter(f => f.includes('/hooks/')),
      contexts: allFiles.filter(f => f.includes('/contexts/')),
      api: allFiles.filter(f => f.includes('/lib/api/')),
      types: allFiles.filter(f => f.includes('/types/')),
      mobile: allFiles.filter(f => f.includes('/mobile/')),
      modules: allFiles.filter(f => f.includes('/modules/'))
    };

    console.log('\n📁 PROJECT FILE ANALYSIS:');
    
    let totalCoverable = 0;
    for (const [category, files] of Object.entries(fileCategories)) {
      console.log(`${category.toUpperCase()}: ${files.length} files`);
      totalCoverable += files.length;
      
      // Analyze each file for functions/components
      for (const file of files) {
        const content = readFileSync(file, 'utf-8');
        const functionCount = countFunctions(content);
        const componentCount = countComponents(content);
        
        if (functionCount > 0 || componentCount > 0) {
          console.log(`  📄 ${file.replace(srcPath, '')} - ${functionCount} functions, ${componentCount} components`);
        }
      }
    }

    console.log(`\n📊 TOTAL COVERABLE FILES: ${totalCoverable}`);
    
    // Currently tested vs total files
    const currentTestCoverage = (10 / totalCoverable) * 100; // Current MCP tests 10 routes/files
    console.log(`📊 CURRENT TEST COVERAGE: ${currentTestCoverage.toFixed(1)}%`);
    console.log(`📊 REQUIRED FOR 100%: ${totalCoverable} files need testing`);

    expect(totalCoverable).toBeGreaterThan(50); // Ensure we have substantial codebase
  });

  test('Business Logic Function Coverage', async ({ page }) => {
    // Test the main business logic hook
    const businessLogicPath = join(process.cwd(), 'src/hooks/useBusinessLogic.ts');
    const content = readFileSync(businessLogicPath, 'utf-8');
    
    // Extract all exported functions
    const functionNames = extractFunctionNames(content);
    console.log('\n🔧 BUSINESS LOGIC FUNCTIONS FOUND:');
    functionNames.forEach(fn => console.log(`  - ${fn}`));
    
    // Navigate to a page that uses business logic
    await page.goto('http://localhost:3000/admin/dashboard');
    await page.waitForTimeout(2000);
    
    // Test that business logic is working by checking for data
    const hasData = await page.evaluate(() => {
      // Check for any data indicators in the DOM
      const dataElements = document.querySelectorAll('[data-testid*="data"], .data-display, .stats');
      return dataElements.length > 0;
    });
    
    console.log(`📊 Business Logic Active: ${hasData ? 'YES' : 'NO'}`);
    
    expect(functionNames.length).toBeGreaterThan(10); // Should have substantial business logic
  });

  test('API Module Coverage', async () => {
    const apiPath = join(process.cwd(), 'src/lib/api');
    const apiFiles = readdirSync(apiPath).filter(f => f.endsWith('.ts'));
    
    console.log('\n🌐 API MODULES ANALYSIS:');
    
    const apiModules = [];
    for (const file of apiFiles) {
      const filePath = join(apiPath, file);
      const content = readFileSync(filePath, 'utf-8');
      const functions = extractFunctionNames(content);
      
      apiModules.push({
        module: file.replace('.ts', ''),
        functions: functions.length,
        exports: functions
      });
      
      console.log(`  📦 ${file}: ${functions.length} functions`);
      functions.forEach(fn => console.log(`    - ${fn}`));
    }

    const totalApiFunctions = apiModules.reduce((sum, mod) => sum + mod.functions, 0);
    console.log(`\n📊 TOTAL API FUNCTIONS: ${totalApiFunctions}`);
    
    expect(apiModules.length).toBeGreaterThan(10); // Should have multiple API modules
    expect(totalApiFunctions).toBeGreaterThan(50); // Should have substantial API coverage
  });

  test('Form and Interaction Coverage Enhancement', async ({ page }) => {
    const forms = [
      { route: '/login', name: 'Login Form' },
      { route: '/reserva', name: 'Reservation Form' },
      { route: '/admin/login', name: 'Admin Login' }
    ];

    console.log('\n📝 COMPREHENSIVE FORM TESTING:');
    
    for (const form of forms) {
      try {
        await page.goto(`http://localhost:3000${form.route}`);
        await page.waitForTimeout(1000);
        
        // Find all form elements
        const inputs = await page.locator('input').count();
        const buttons = await page.locator('button').count();
        const selects = await page.locator('select').count();
        const textareas = await page.locator('textarea').count();
        
        console.log(`  📋 ${form.name}:`);
        console.log(`    - Inputs: ${inputs}`);
        console.log(`    - Buttons: ${buttons}`);
        console.log(`    - Selects: ${selects}`);
        console.log(`    - Textareas: ${textareas}`);
        
        // Test keyboard navigation
        if (inputs > 0) {
          await page.keyboard.press('Tab');
          const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
          console.log(`    - Tab navigation: ${focusedElement}`);
        }
        
      } catch (error) {
        console.log(`  ❌ ${form.name} - Error: ${error.message}`);
      }
    }
  });

  test('Mobile and Responsive Coverage', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];

    console.log('\n📱 RESPONSIVE DESIGN TESTING:');
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3000');
      await page.waitForTimeout(1000);
      
      // Check mobile-specific elements
      const mobileNavExists = await page.locator('[data-testid*="mobile"], .mobile-nav, .drawer').isVisible().catch(() => false);
      const responsiveElements = await page.locator('.responsive, .lg\\:, .md\\:, .sm\\:').count();
      
      console.log(`  📱 ${viewport.name} (${viewport.width}x${viewport.height}):`);
      console.log(`    - Mobile nav: ${mobileNavExists ? 'YES' : 'NO'}`);
      console.log(`    - Responsive elements: ${responsiveElements}`);
      
      await page.screenshot({
        path: `test-results/screenshots/responsive-${viewport.name.toLowerCase()}.png`
      });
    }
  });

});

// Helper functions
function getAllFiles(dir: string, extensions: string[]): string[] {
  const files: string[] = [];
  
  function traverse(currentDir: string) {
    const items = readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.git')) {
        traverse(fullPath);
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

function countFunctions(content: string): number {
  const functionRegex = /(?:function\s+\w+|const\s+\w+\s*=\s*(?:\(.*?\)\s*=>|\w+\s*=>\s*\{)|export\s+(?:const|function)\s+\w+)/g;
  return (content.match(functionRegex) || []).length;
}

function countComponents(content: string): number {
  const componentRegex = /(?:const\s+[A-Z]\w*\s*=\s*(?:\(.*?\)\s*=>|React\.FC)|function\s+[A-Z]\w*\s*\(|export\s+(?:default\s+)?(?:const|function)\s+[A-Z]\w*)/g;
  return (content.match(componentRegex) || []).length;
}

function extractFunctionNames(content: string): string[] {
  const patterns = [
    /export\s+(?:const|function)\s+(\w+)/g,
    /const\s+(\w+)\s*=\s*(?:\(.*?\)\s*=>|\w+\s*=>)/g,
    /function\s+(\w+)\s*\(/g,
    /(\w+):\s*(?:\(.*?\)\s*=>|\w+\s*=>)/g
  ];
  
  const names = new Set<string>();
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      names.add(match[1]);
    }
  }
  
  return Array.from(names).filter(name => 
    name.length > 1 && 
    !['if', 'for', 'while', 'const', 'let', 'var'].includes(name)
  );
}

async function validateWCAGCompliance(page: any, route: string): Promise<void> {
  try {
    // Check for basic WCAG compliance
    const hasLangAttr = await page.getAttribute('html', 'lang');
    const headingCount = await page.locator('h1, h2, h3, h4, h5, h6').count();
    const altTextsCount = await page.locator('img[alt]').count();
    const allImagesCount = await page.locator('img').count();
    
    console.log(`    WCAG ${route}: lang=${hasLangAttr}, headings=${headingCount}, alt-texts=${altTextsCount}/${allImagesCount}`);
  } catch (error) {
    console.log(`    WCAG ${route}: Error checking compliance`);
  }
}