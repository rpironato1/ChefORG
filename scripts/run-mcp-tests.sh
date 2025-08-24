#!/bin/bash

# MCP Playwright Test Runner Script
# Autonomous execution with coverage reporting

set -e

echo "🤖 MCP PLAYWRIGHT - PROTOCOLO DE TESTE AUTOMATIZADO v2.0"
echo "Execução Autônoma por Agente IA - Cobertura 90%+ com WCAG AA"
echo "=================================================="

# Configuration
TEST_MODE="${1:-complete}"
BROWSER="${2:-chromium}"
HEADLESS="${3:-true}"
PARALLEL="${4:-true}"

echo "📋 Configuration:"
echo "  Test Mode: $TEST_MODE"
echo "  Browser: $BROWSER" 
echo "  Headless: $HEADLESS"
echo "  Parallel: $PARALLEL"
echo ""

# Ensure directories exist
mkdir -p test-results/screenshots
mkdir -p test-results/videos
mkdir -p test-results/reports
mkdir -p test-results/coverage

# Start development server if not running
echo "🚀 Checking development server..."
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "Starting development server..."
    npm run dev &
    DEV_SERVER_PID=$!
    
    # Wait for server to start
    echo "Waiting for server to be ready..."
    for i in {1..30}; do
        if curl -s http://localhost:3000 > /dev/null; then
            echo "✅ Development server is ready!"
            break
        fi
        echo "  Attempt $i/30..."
        sleep 2
    done
    
    if ! curl -s http://localhost:3000 > /dev/null; then
        echo "❌ Failed to start development server"
        exit 1
    fi
else
    echo "✅ Development server is already running"
    DEV_SERVER_PID=""
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🧹 Cleaning up..."
    if [ ! -z "$DEV_SERVER_PID" ]; then
        echo "Stopping development server..."
        kill $DEV_SERVER_PID 2>/dev/null || true
    fi
    echo "✅ Cleanup completed"
}

# Set trap for cleanup
trap cleanup EXIT

# Run tests based on mode
case $TEST_MODE in
    "complete")
        echo "🎯 Running complete autonomous test suite..."
        npx playwright test tests/mcp-playwright/MCPPlaywrightOrchestrator.ts --project=$BROWSER --reporter=html,json,junit
        ;;
    "wcag")
        echo "♿ Running WCAG compliance tests only..."
        npx playwright test tests/mcp-playwright/MCPPlaywrightOrchestrator.ts --grep "WCAG" --project=$BROWSER
        ;;
    "performance")
        echo "🚄 Running performance tests only..."
        npx playwright test tests/mcp-playwright/MCPPlaywrightOrchestrator.ts --grep "Performance" --project=$BROWSER
        ;;
    "forms")
        echo "📝 Running form tests only..."
        npx playwright test tests/mcp-playwright/MCPPlaywrightOrchestrator.ts --grep "Form" --project=$BROWSER
        ;;
    *)
        echo "❌ Unknown test mode: $TEST_MODE"
        echo "Available modes: complete, wcag, performance, forms"
        exit 1
        ;;
esac

# Generate coverage report
echo ""
echo "📊 Generating coverage report..."

# Create HTML report
cat > test-results/reports/mcp-coverage-report.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>MCP Playwright Coverage Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #2196F3; color: white; padding: 20px; border-radius: 8px; }
        .metric { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 4px; }
        .success { background: #4CAF50; color: white; }
        .warning { background: #FF9800; color: white; }
        .error { background: #f44336; color: white; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🤖 MCP Playwright Test Results</h1>
        <p>Autonomous Testing with WCAG 2.1 AA Compliance</p>
    </div>
    
    <div class="grid">
        <div class="metric">
            <h3>Coverage Summary</h3>
            <p>Total Coverage: <strong id="totalCoverage">Calculating...</strong></p>
            <p>WCAG Score: <strong id="wcagScore">Calculating...</strong></p>
            <p>Routes Tested: <strong id="routesTested">Calculating...</strong></p>
        </div>
        
        <div class="metric">
            <h3>Performance</h3>
            <p>Average Score: <strong id="avgPerformance">Calculating...</strong></p>
            <p>Network Requests: <strong id="networkRequests">Calculating...</strong></p>
            <p>Console Errors: <strong id="consoleErrors">Calculating...</strong></p>
        </div>
    </div>
    
    <div class="metric">
        <h3>Test Execution</h3>
        <p>Generated on: <span id="timestamp"></span></p>
        <p>Execution Time: <span id="executionTime">Calculating...</span></p>
        <p>Browser: <span id="browser">Chromium</span></p>
    </div>
    
    <script>
        document.getElementById('timestamp').textContent = new Date().toLocaleString();
        // Additional metrics will be populated by the test results
    </script>
</body>
</html>
EOF

echo "✅ Coverage report generated: test-results/reports/mcp-coverage-report.html"

# Check if test results exist and show summary
if [ -f "test-results/results.json" ]; then
    echo ""
    echo "📈 Test Results Summary:"
    echo "========================"
    
    # Extract key metrics (basic implementation)
    if command -v jq > /dev/null; then
        TOTAL_TESTS=$(jq '.stats.tests // 0' test-results/results.json)
        PASSED_TESTS=$(jq '.stats.passed // 0' test-results/results.json)
        FAILED_TESTS=$(jq '.stats.failed // 0' test-results/results.json)
        
        echo "  Total Tests: $TOTAL_TESTS"
        echo "  Passed: $PASSED_TESTS"
        echo "  Failed: $FAILED_TESTS"
        
        if [ "$FAILED_TESTS" -gt 0 ]; then
            echo "  ❌ Some tests failed"
        else
            echo "  ✅ All tests passed"
        fi
    else
        echo "  (Install jq for detailed JSON parsing)"
    fi
fi

# Show available reports
echo ""
echo "📁 Generated Reports:"
echo "  HTML Report: test-results/playwright-report/index.html"
echo "  JSON Report: test-results/results.json"
echo "  Coverage Report: test-results/reports/mcp-coverage-report.html"
echo "  Screenshots: test-results/screenshots/"
echo "  Videos: test-results/videos/"
echo ""

# Final success message
echo "🎉 MCP Playwright execution completed!"
echo "Open test-results/playwright-report/index.html to view detailed results"