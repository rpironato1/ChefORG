#!/bin/bash

# Detailed Lighthouse Analysis with Issue Identification
echo "🔍 Running Detailed Lighthouse Analysis for ChefORG"
echo "================================================="

# Ensure server is running
if ! curl -s http://localhost:8110 > /dev/null; then
    echo "❌ Development server is not running on localhost:8110"
    exit 1
fi

# Create detailed reports directory
mkdir -p test-results/lighthouse/detailed

# Key routes to analyze in detail
declare -a critical_routes=(
    "/"
    "/menu"
    "/reserva"
    "/mesa/1/cardapio"
    "/mesa/1/feedback"
)

declare -a route_names=(
    "Home Page"
    "Public Menu"
    "Reservation"
    "Table Menu"
    "Feedback"
)

echo "## 🎯 Detailed Issue Analysis" > test-results/lighthouse/detailed-issues.md
echo "" >> test-results/lighthouse/detailed-issues.md

for i in "${!critical_routes[@]}"; do
    route="${critical_routes[$i]}"
    name="${route_names[$i]}"
    url="http://localhost:8110${route}"
    
    echo "🔍 Analyzing: $name ($route)"
    
    # Run detailed Lighthouse audit
    output_file="test-results/lighthouse/detailed/${name// /_}_detailed.json"
    
    lighthouse "$url" \
        --output=json \
        --output-path="$output_file" \
        --chrome-flags="--headless --no-sandbox" \
        --form-factor=desktop \
        --quiet 2>/dev/null
    
    if [ -f "$output_file" ]; then
        echo "### $name" >> test-results/lighthouse/detailed-issues.md
        echo "**URL:** $url" >> test-results/lighthouse/detailed-issues.md
        echo "" >> test-results/lighthouse/detailed-issues.md
        
        # Extract specific issues
        perf_score=$(jq -r '.categories.performance.score * 100 | floor' "$output_file")
        acc_score=$(jq -r '.categories.accessibility.score * 100 | floor' "$output_file")
        
        # Performance issues
        if [ $perf_score -lt 85 ]; then
            echo "#### 🚀 Performance Issues" >> test-results/lighthouse/detailed-issues.md
            
            # Check specific metrics
            fcp=$(jq -r '.audits["first-contentful-paint"].displayValue' "$output_file" 2>/dev/null || echo "N/A")
            lcp=$(jq -r '.audits["largest-contentful-paint"].displayValue' "$output_file" 2>/dev/null || echo "N/A")
            cls=$(jq -r '.audits["cumulative-layout-shift"].displayValue' "$output_file" 2>/dev/null || echo "N/A")
            
            echo "- First Contentful Paint: $fcp" >> test-results/lighthouse/detailed-issues.md
            echo "- Largest Contentful Paint: $lcp" >> test-results/lighthouse/detailed-issues.md
            echo "- Cumulative Layout Shift: $cls" >> test-results/lighthouse/detailed-issues.md
            
            # Check for unused JavaScript
            unused_js=$(jq -r '.audits["unused-javascript"].score' "$output_file" 2>/dev/null)
            if [ "$unused_js" != "null" ] && [ "$unused_js" != "1" ]; then
                echo "- ⚠️ Unused JavaScript detected" >> test-results/lighthouse/detailed-issues.md
            fi
            
            # Check for unoptimized images
            unopt_images=$(jq -r '.audits["uses-optimized-images"].score' "$output_file" 2>/dev/null)
            if [ "$unopt_images" != "null" ] && [ "$unopt_images" != "1" ]; then
                echo "- ⚠️ Unoptimized images detected" >> test-results/lighthouse/detailed-issues.md
            fi
            
            # Check for render-blocking resources
            render_blocking=$(jq -r '.audits["render-blocking-resources"].score' "$output_file" 2>/dev/null)
            if [ "$render_blocking" != "null" ] && [ "$render_blocking" != "1" ]; then
                echo "- ⚠️ Render-blocking resources detected" >> test-results/lighthouse/detailed-issues.md
            fi
            
            echo "" >> test-results/lighthouse/detailed-issues.md
        fi
        
        # Accessibility issues
        if [ $acc_score -lt 95 ]; then
            echo "#### ♿ Accessibility Issues" >> test-results/lighthouse/detailed-issues.md
            
            # Check color contrast
            color_contrast=$(jq -r '.audits["color-contrast"].score' "$output_file" 2>/dev/null)
            if [ "$color_contrast" != "null" ] && [ "$color_contrast" != "1" ]; then
                echo "- ❌ Color contrast issues detected" >> test-results/lighthouse/detailed-issues.md
            fi
            
            # Check image alt text
            image_alt=$(jq -r '.audits["image-alt"].score' "$output_file" 2>/dev/null)
            if [ "$image_alt" != "null" ] && [ "$image_alt" != "1" ]; then
                echo "- ❌ Images missing alt text" >> test-results/lighthouse/detailed-issues.md
            fi
            
            # Check form labels
            form_labels=$(jq -r '.audits["label"].score' "$output_file" 2>/dev/null)
            if [ "$form_labels" != "null" ] && [ "$form_labels" != "1" ]; then
                echo "- ❌ Form controls missing labels" >> test-results/lighthouse/detailed-issues.md
            fi
            
            # Check heading order
            heading_order=$(jq -r '.audits["heading-order"].score' "$output_file" 2>/dev/null)
            if [ "$heading_order" != "null" ] && [ "$heading_order" != "1" ]; then
                echo "- ⚠️ Improper heading hierarchy" >> test-results/lighthouse/detailed-issues.md
            fi
            
            echo "" >> test-results/lighthouse/detailed-issues.md
        fi
        
        # Best practices issues
        bp_score=$(jq -r '.categories["best-practices"].score * 100 | floor' "$output_file")
        if [ $bp_score -lt 100 ]; then
            echo "#### 🛡️ Best Practices Issues" >> test-results/lighthouse/detailed-issues.md
            
            # Check console errors
            console_errors=$(jq -r '.audits["errors-in-console"].score' "$output_file" 2>/dev/null)
            if [ "$console_errors" != "null" ] && [ "$console_errors" != "1" ]; then
                echo "- ❌ Console errors detected" >> test-results/lighthouse/detailed-issues.md
            fi
            
            # Check for vulnerable libraries
            vuln_libs=$(jq -r '.audits["no-vulnerable-libraries"].score' "$output_file" 2>/dev/null)
            if [ "$vuln_libs" != "null" ] && [ "$vuln_libs" != "1" ]; then
                echo "- ⚠️ Vulnerable libraries detected" >> test-results/lighthouse/detailed-issues.md
            fi
            
            echo "" >> test-results/lighthouse/detailed-issues.md
        fi
        
        echo "---" >> test-results/lighthouse/detailed-issues.md
        echo "" >> test-results/lighthouse/detailed-issues.md
        
        echo "  ✅ Analyzed: $name"
    else
        echo "  ❌ Failed to analyze: $name"
    fi
done

echo ""
echo "📄 Detailed analysis saved to: test-results/lighthouse/detailed-issues.md"