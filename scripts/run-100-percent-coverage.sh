#!/bin/bash

# 🎯 MCP PLAYWRIGHT - COMPREHENSIVE 56 COMPONENT TESTING SCRIPT
# This script executes complete testing of all 56 components and 12 API modules

echo "🚀 Starting MCP Playwright 100% Coverage Protocol v3.0"
echo "Target: 56 Components + 12 API Modules"
echo "======================================================="

# Ensure we're in the right directory
cd /home/runner/work/ChefORG/ChefORG

# Start development server if not running
echo "🔧 Checking development server..."
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "🚀 Starting development server..."
    npm run dev &
    SERVER_PID=$!
    echo "⏱️ Waiting for server to start..."
    sleep 10
    
    # Wait for server to be ready
    for i in {1..30}; do
        if curl -s http://localhost:3000 > /dev/null; then
            echo "✅ Development server is ready"
            break
        fi
        echo "⏳ Waiting... ($i/30)"
        sleep 2
    done
else
    echo "✅ Development server already running"
fi

# Run the comprehensive testing
echo "🧪 Executing MCP Playwright 100% Coverage Tests..."
npx playwright test tests/mcp-playwright/MCPPlaywright100PercentCoverage.test.ts --reporter=html

# Check test results
TEST_EXIT_CODE=$?

echo ""
echo "📊 EXECUTION COMPLETED"
echo "======================================================="

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "🎉 SUCCESS: All tests passed!"
    echo "✅ 56 Components validated"
    echo "✅ 12 API modules validated"
    echo "✅ Coverage target achieved"
else
    echo "❌ SOME TESTS FAILED"
    echo "📄 Check the HTML report for details"
fi

# Display report location
echo ""
echo "📋 Reports Generated:"
echo "  📄 HTML Report: playwright-report/index.html"
echo "  📄 JSON Report: test-results/mcp-100-percent-coverage-report.json"

# Show test results summary
if [ -f "test-results/mcp-100-percent-coverage-report.json" ]; then
    echo ""
    echo "📈 COVERAGE SUMMARY:"
    echo "======================================================="
    # Extract key metrics from the JSON report
    if command -v jq &> /dev/null; then
        COVERAGE=$(jq -r '.execution_summary.achieved_coverage // "N/A"' test-results/mcp-100-percent-coverage-report.json)
        COMPONENTS_TESTED=$(jq -r '.component_metrics.components_tested // "N/A"' test-results/mcp-100-percent-coverage-report.json)
        APIS_TESTED=$(jq -r '.api_metrics.apis_tested // "N/A"' test-results/mcp-100-percent-coverage-report.json)
        
        echo "📊 Overall Coverage: $COVERAGE"
        echo "🧩 Components Tested: $COMPONENTS_TESTED/56"
        echo "🌐 APIs Tested: $APIS_TESTED/12"
    else
        echo "📄 Full results available in JSON report"
    fi
fi

echo ""
echo "🎯 MCP Playwright 100% Coverage Protocol Completed"

exit $TEST_EXIT_CODE