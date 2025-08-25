#!/bin/bash

# Comprehensive Lighthouse Testing Script for ChefORG
# Tests all modules and generates detailed reports

echo "🚀 Starting Comprehensive Lighthouse Tests for ChefORG"
echo "=================================================="

# Ensure server is running
if ! curl -s http://localhost:8110 > /dev/null; then
    echo "❌ Development server is not running on localhost:8110"
    echo "Please start the server with: npm run dev"
    exit 1
fi

# Create reports directory
mkdir -p test-results/lighthouse

# Define routes to test
declare -a routes=(
    "/"
    "/menu"
    "/reserva" 
    "/login"
    "/checkin"
    "/chegada-sem-reserva"
    "/mesa/1/pin"
    "/mesa/1/cardapio"
    "/mesa/1/acompanhar"
    "/mesa/1/pagamento"
    "/mesa/1/feedback"
    "/sprint3-demo"
)

declare -a route_names=(
    "Home Page"
    "Public Menu"
    "Online Reservation"
    "Login"
    "Client Check-in"
    "Walk-in Arrival"
    "Table PIN"
    "Table Menu"
    "Order Tracking"
    "Payment"
    "Feedback"
    "Sprint 3 Demo"
)

# Initialize report
report_file="test-results/lighthouse/comprehensive-report.md"
json_file="test-results/lighthouse/results.json"
echo "# 🎯 ChefORG Comprehensive Lighthouse Report" > $report_file
echo "" >> $report_file
echo "**Generated:** $(date)" >> $report_file
echo "" >> $report_file

# Initialize JSON results
echo "{" > $json_file
echo '  "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",' >> $json_file
echo '  "results": [' >> $json_file

total_routes=${#routes[@]}
passed_routes=0
failed_routes=0

# Performance tracking
declare -a performance_scores=()
declare -a accessibility_scores=()
declare -a seo_scores=()
declare -a best_practices_scores=()

echo "## 📊 Test Results Summary" >> $report_file
echo "" >> $report_file

for i in "${!routes[@]}"; do
    route="${routes[$i]}"
    name="${route_names[$i]}"
    url="http://localhost:8110${route}"
    
    echo "🔍 Testing: $name ($route)"
    
    # Run Lighthouse for desktop
    desktop_output="test-results/lighthouse/desktop_${i}.json"
    mobile_output="test-results/lighthouse/mobile_${i}.json"
    
    # Desktop test
    echo "  📱 Desktop test..."
    if lighthouse "$url" \
        --output=json \
        --output-path="$desktop_output" \
        --chrome-flags="--headless --no-sandbox" \
        --form-factor=desktop \
        --screenEmulation.mobile=false \
        --throttling.rttMs=40 \
        --throttling.throughputKbps=10240 \
        --throttling.cpuSlowdownMultiplier=1 \
        --quiet 2>/dev/null; then
        
        # Mobile test
        echo "  📱 Mobile test..."
        if lighthouse "$url" \
            --output=json \
            --output-path="$mobile_output" \
            --chrome-flags="--headless --no-sandbox" \
            --form-factor=mobile \
            --screenEmulation.mobile=true \
            --throttling.rttMs=150 \
            --throttling.throughputKbps=1638.4 \
            --throttling.cpuSlowdownMultiplier=4 \
            --quiet 2>/dev/null; then
            
            # Extract scores from desktop results
            if [ -f "$desktop_output" ]; then
                perf_score=$(jq -r '.categories.performance.score * 100 | floor' "$desktop_output" 2>/dev/null || echo "0")
                acc_score=$(jq -r '.categories.accessibility.score * 100 | floor' "$desktop_output" 2>/dev/null || echo "0")
                bp_score=$(jq -r '.categories["best-practices"].score * 100 | floor' "$desktop_output" 2>/dev/null || echo "0")
                seo_score=$(jq -r '.categories.seo.score * 100 | floor' "$desktop_output" 2>/dev/null || echo "0")
                
                # Track scores for overall calculation
                performance_scores+=($perf_score)
                accessibility_scores+=($acc_score)
                best_practices_scores+=($bp_score)
                seo_scores+=($seo_score)
                
                # Add to JSON results
                if [ $i -gt 0 ]; then
                    echo "    ," >> $json_file
                fi
                echo '    {' >> $json_file
                echo "      \"route\": \"$route\"," >> $json_file
                echo "      \"name\": \"$name\"," >> $json_file
                echo "      \"desktop\": {" >> $json_file
                echo "        \"performance\": $perf_score," >> $json_file
                echo "        \"accessibility\": $acc_score," >> $json_file
                echo "        \"bestPractices\": $bp_score," >> $json_file
                echo "        \"seo\": $seo_score" >> $json_file
                echo "      }" >> $json_file
                echo '    }' >> $json_file
                
                # Add to markdown report
                echo "### $name" >> $report_file
                echo "**Route:** $route" >> $report_file
                echo "**URL:** $url" >> $report_file
                echo "" >> $report_file
                echo "| Metric | Desktop Score | Status |" >> $report_file
                echo "|--------|---------------|--------|" >> $report_file
                echo "| Performance | $perf_score/100 | $([ $perf_score -ge 50 ] && echo "✅" || echo "❌") |" >> $report_file
                echo "| Accessibility | $acc_score/100 | $([ $acc_score -ge 80 ] && echo "✅" || echo "❌") |" >> $report_file
                echo "| Best Practices | $bp_score/100 | $([ $bp_score -ge 70 ] && echo "✅" || echo "❌") |" >> $report_file
                echo "| SEO | $seo_score/100 | $([ $seo_score -ge 70 ] && echo "✅" || echo "❌") |" >> $report_file
                echo "" >> $report_file
                
                passed_routes=$((passed_routes + 1))
                echo "  ✅ Completed: $name (Perf: $perf_score, A11y: $acc_score, BP: $bp_score, SEO: $seo_score)"
            else
                failed_routes=$((failed_routes + 1))
                echo "  ❌ Failed to parse results for: $name"
            fi
        else
            failed_routes=$((failed_routes + 1))
            echo "  ❌ Mobile test failed for: $name"
        fi
    else
        failed_routes=$((failed_routes + 1))
        echo "  ❌ Desktop test failed for: $name"
    fi
    
    # Cleanup individual files
    [ -f "$desktop_output" ] && rm "$desktop_output"
    [ -f "$mobile_output" ] && rm "$mobile_output"
done

# Close JSON
echo '  ],' >> $json_file

# Calculate overall scores
if [ ${#performance_scores[@]} -gt 0 ]; then
    avg_performance=$(printf '%s\n' "${performance_scores[@]}" | awk '{sum+=$1} END {print int(sum/NR)}')
    avg_accessibility=$(printf '%s\n' "${accessibility_scores[@]}" | awk '{sum+=$1} END {print int(sum/NR)}')
    avg_best_practices=$(printf '%s\n' "${best_practices_scores[@]}" | awk '{sum+=$1} END {print int(sum/NR)}')
    avg_seo=$(printf '%s\n' "${seo_scores[@]}" | awk '{sum+=$1} END {print int(sum/NR)}')
else
    avg_performance=0
    avg_accessibility=0
    avg_best_practices=0
    avg_seo=0
fi

# Add overall scores to JSON
echo '  "summary": {' >> $json_file
echo "    \"totalRoutes\": $total_routes," >> $json_file
echo "    \"passedRoutes\": $passed_routes," >> $json_file
echo "    \"failedRoutes\": $failed_routes," >> $json_file
echo "    \"overallScores\": {" >> $json_file
echo "      \"performance\": $avg_performance," >> $json_file
echo "      \"accessibility\": $avg_accessibility," >> $json_file
echo "      \"bestPractices\": $avg_best_practices," >> $json_file
echo "      \"seo\": $avg_seo" >> $json_file
echo "    }" >> $json_file
echo "  }" >> $json_file
echo "}" >> $json_file

# Add summary to markdown report
echo "" >> $report_file
echo "## 📈 Overall Summary" >> $report_file
echo "" >> $report_file
echo "**Total Routes Tested:** $total_routes" >> $report_file
echo "**Passed:** $passed_routes" >> $report_file
echo "**Failed:** $failed_routes" >> $report_file
echo "" >> $report_file
echo "### Average Scores" >> $report_file
echo "" >> $report_file
echo "| Category | Score | Status |" >> $report_file
echo "|----------|-------|--------|" >> $report_file
echo "| Performance | $avg_performance/100 | $([ $avg_performance -ge 50 ] && echo "✅ Pass" || echo "❌ Needs Improvement") |" >> $report_file
echo "| Accessibility | $avg_accessibility/100 | $([ $avg_accessibility -ge 80 ] && echo "✅ Pass" || echo "❌ Needs Improvement") |" >> $report_file
echo "| Best Practices | $avg_best_practices/100 | $([ $avg_best_practices -ge 70 ] && echo "✅ Pass" || echo "❌ Needs Improvement") |" >> $report_file
echo "| SEO | $avg_seo/100 | $([ $avg_seo -ge 70 ] && echo "✅ Pass" || echo "❌ Needs Improvement") |" >> $report_file
echo "" >> $report_file

# Add recommendations
echo "## 🎯 Priority Recommendations" >> $report_file
echo "" >> $report_file

if [ $avg_performance -lt 50 ]; then
    echo "### 🚨 High Priority - Performance Issues" >> $report_file
    echo "- Optimize images (compress, modern formats)" >> $report_file
    echo "- Reduce JavaScript bundle size" >> $report_file
    echo "- Enable compression (Gzip/Brotli)" >> $report_file
    echo "- Minimize render-blocking resources" >> $report_file
    echo "" >> $report_file
fi

if [ $avg_accessibility -lt 80 ]; then
    echo "### 🚨 High Priority - Accessibility Issues" >> $report_file
    echo "- Fix color contrast ratios (WCAG AA: 4.5:1)" >> $report_file
    echo "- Add alt text to all images" >> $report_file
    echo "- Improve keyboard navigation" >> $report_file
    echo "- Add proper ARIA labels" >> $report_file
    echo "" >> $report_file
fi

if [ $avg_best_practices -lt 70 ]; then
    echo "### ⚠️ Medium Priority - Best Practices" >> $report_file
    echo "- Fix console errors" >> $report_file
    echo "- Use HTTPS for all resources" >> $report_file
    echo "- Optimize third-party resources" >> $report_file
    echo "" >> $report_file
fi

if [ $avg_seo -lt 70 ]; then
    echo "### ⚠️ Medium Priority - SEO Issues" >> $report_file
    echo "- Add unique meta descriptions" >> $report_file
    echo "- Ensure proper heading hierarchy" >> $report_file
    echo "- Add structured data markup" >> $report_file
    echo "- Fix duplicate or missing titles" >> $report_file
    echo "" >> $report_file
fi

echo "" >> $report_file
echo "---" >> $report_file
echo "**Report generated on:** $(date)" >> $report_file
echo "**Lighthouse version:** $(lighthouse --version)" >> $report_file

# Final summary
echo ""
echo "=================================================="
echo "🎯 Lighthouse Testing Complete!"
echo "=================================================="
echo "📊 Summary:"
echo "  Total Routes: $total_routes"
echo "  Passed: $passed_routes"
echo "  Failed: $failed_routes"
echo ""
echo "📈 Average Scores:"
echo "  Performance: $avg_performance/100"
echo "  Accessibility: $avg_accessibility/100"
echo "  Best Practices: $avg_best_practices/100"
echo "  SEO: $avg_seo/100"
echo ""
echo "📄 Reports saved:"
echo "  - Markdown: $report_file"
echo "  - JSON: $json_file"
echo ""

# Return appropriate exit code
if [ $failed_routes -eq 0 ] && [ $avg_accessibility -ge 50 ] && [ $avg_performance -ge 30 ]; then
    echo "✅ Overall test result: PASS"
    exit 0
else
    echo "❌ Overall test result: NEEDS IMPROVEMENT"
    echo ""
    echo "🔧 Next steps:"
    echo "1. Review the detailed report: $report_file"
    echo "2. Address critical performance and accessibility issues"
    echo "3. Re-run tests to validate improvements"
    exit 1
fi