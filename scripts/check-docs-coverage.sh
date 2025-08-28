#!/bin/bash

# Documentation Coverage Analyzer for ChefORG
# Checks if all components, functions, and API endpoints are documented

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📚 ChefORG Documentation Coverage Analysis${NC}"
echo -e "${BLUE}==========================================${NC}"
echo ""

# Initialize counters
TOTAL_COMPONENTS=0
DOCUMENTED_COMPONENTS=0
TOTAL_FUNCTIONS=0
DOCUMENTED_FUNCTIONS=0
TOTAL_API_ENDPOINTS=0
DOCUMENTED_API_ENDPOINTS=0

# Find all React components
echo -e "${BLUE}🔍 Analyzing React Components...${NC}"
COMPONENT_FILES=$(find "$PROJECT_ROOT/src" -name "*.tsx" -type f | grep -E "(components|pages|modules)" | head -20)

for file in $COMPONENT_FILES; do
    if [ -f "$file" ]; then
        TOTAL_COMPONENTS=$((TOTAL_COMPONENTS + 1))
        
        # Check if component has JSDoc comments or meaningful comments
        if grep -q -E "(\/\*\*|\/\/ @|interface.*Props|type.*Props)" "$file"; then
            DOCUMENTED_COMPONENTS=$((DOCUMENTED_COMPONENTS + 1))
            echo -e "  ${GREEN}✅$(basename "$file")${NC}"
        else
            echo -e "  ${RED}❌$(basename "$file")${NC} - Missing documentation"
        fi
    fi
done

# Find all API functions
echo -e "\n${BLUE}🔍 Analyzing API Functions...${NC}"
API_FILES=$(find "$PROJECT_ROOT/src/lib/api" -name "*.ts" -type f 2>/dev/null || echo "")

for file in $API_FILES; do
    if [ -f "$file" ]; then
        # Count exported functions
        FUNCTION_COUNT=$(grep -c "export.*function\|export.*=.*=>" "$file" 2>/dev/null || echo "0")
        FUNCTION_COUNT=$(echo "$FUNCTION_COUNT" | tr -d '\n')
        FUNCTION_COUNT=${FUNCTION_COUNT:-0}
        if ! [[ "$FUNCTION_COUNT" =~ ^[0-9]+$ ]]; then
            FUNCTION_COUNT=0
        fi
        TOTAL_FUNCTIONS=$((TOTAL_FUNCTIONS + FUNCTION_COUNT))
        
        # Count documented functions (with JSDoc)
        DOC_COUNT=$(grep -B5 "export.*function\|export.*=.*=>" "$file" | grep -c "\/\*\*\|\/\/ @" 2>/dev/null || echo "0")
        DOC_COUNT=$(echo "$DOC_COUNT" | tr -d '\n')
        DOC_COUNT=${DOC_COUNT:-0}
        if ! [[ "$DOC_COUNT" =~ ^[0-9]+$ ]]; then
            DOC_COUNT=0
        fi
        DOCUMENTED_FUNCTIONS=$((DOCUMENTED_FUNCTIONS + DOC_COUNT))
        
        echo -e "  📄 $(basename "$file"): $DOC_COUNT/$FUNCTION_COUNT documented"
    fi
done

# Find all hook functions
echo -e "\n${BLUE}🔍 Analyzing Custom Hooks...${NC}"
HOOK_FILES=$(find "$PROJECT_ROOT/src/hooks" -name "*.ts" -type f 2>/dev/null || echo "")

for file in $HOOK_FILES; do
    if [ -f "$file" ]; then
        # Count hook functions
        HOOK_COUNT=$(grep -c "export.*use[A-Z]" "$file" 2>/dev/null || echo "0")
        HOOK_COUNT=$(echo "$HOOK_COUNT" | tr -d '\n')
        HOOK_COUNT=${HOOK_COUNT:-0}
        if ! [[ "$HOOK_COUNT" =~ ^[0-9]+$ ]]; then
            HOOK_COUNT=0
        fi
        TOTAL_FUNCTIONS=$((TOTAL_FUNCTIONS + HOOK_COUNT))
        
        # Count documented hooks
        HOOK_DOC_COUNT=$(grep -B3 "export.*use[A-Z]" "$file" | grep -c "\/\*\*\|\/\/ @" 2>/dev/null || echo "0")
        HOOK_DOC_COUNT=$(echo "$HOOK_DOC_COUNT" | tr -d '\n')
        HOOK_DOC_COUNT=${HOOK_DOC_COUNT:-0}
        if ! [[ "$HOOK_DOC_COUNT" =~ ^[0-9]+$ ]]; then
            HOOK_DOC_COUNT=0
        fi
        DOCUMENTED_FUNCTIONS=$((DOCUMENTED_FUNCTIONS + HOOK_DOC_COUNT))
        
        echo -e "  🪝 $(basename "$file"): $HOOK_DOC_COUNT/$HOOK_COUNT documented"
    fi
done

# Check for README files
echo -e "\n${BLUE}🔍 Analyzing README Documentation...${NC}"
README_SCORE=0

if [ -f "$PROJECT_ROOT/README.md" ]; then
    README_SCORE=$((README_SCORE + 20))
    echo -e "  ${GREEN}✅ Main README.md${NC}"
else
    echo -e "  ${RED}❌ Main README.md missing${NC}"
fi

# Check for specific documentation files
DOC_FILES=(
    "CONTRIBUTING.md"
    "DEPLOYMENT.md"
    "API.md"
    "DEVELOPMENT.md"
    "SECURITY.md"
)

for doc in "${DOC_FILES[@]}"; do
    if [ -f "$PROJECT_ROOT/$doc" ]; then
        README_SCORE=$((README_SCORE + 10))
        echo -e "  ${GREEN}✅ $doc${NC}"
    else
        echo -e "  ${YELLOW}⚠️ $doc missing${NC}"
    fi
done

# Check for package.json documentation
if [ -f "$PROJECT_ROOT/package.json" ]; then
    if grep -q '"description"' "$PROJECT_ROOT/package.json" && grep -q '"repository"' "$PROJECT_ROOT/package.json"; then
        README_SCORE=$((README_SCORE + 10))
        echo -e "  ${GREEN}✅ package.json metadata${NC}"
    else
        echo -e "  ${YELLOW}⚠️ package.json missing description/repository${NC}"
    fi
fi

# Calculate coverage percentages
if [ "$TOTAL_COMPONENTS" -gt 0 ]; then
    COMPONENT_COVERAGE=$((DOCUMENTED_COMPONENTS * 100 / TOTAL_COMPONENTS))
else
    COMPONENT_COVERAGE=0
fi

if [ "$TOTAL_FUNCTIONS" -gt 0 ]; then
    FUNCTION_COVERAGE=$((DOCUMENTED_FUNCTIONS * 100 / TOTAL_FUNCTIONS))
else
    FUNCTION_COVERAGE=0
fi

# Overall documentation score
OVERALL_SCORE=$(((COMPONENT_COVERAGE + FUNCTION_COVERAGE + README_SCORE) / 3))

echo ""
echo -e "${BLUE}📊 Documentation Coverage Report${NC}"
echo -e "${BLUE}================================${NC}"
echo ""
echo -e "📦 Components: $DOCUMENTED_COMPONENTS/$TOTAL_COMPONENTS (${COMPONENT_COVERAGE}%)"
echo -e "⚙️  Functions: $DOCUMENTED_FUNCTIONS/$TOTAL_FUNCTIONS (${FUNCTION_COVERAGE}%)"
echo -e "📚 Documentation Files: ${README_SCORE}/100"
echo ""

if [ "$OVERALL_SCORE" -ge 90 ]; then
    echo -e "${GREEN}🎉 Overall Score: ${OVERALL_SCORE}% - Excellent!${NC}"
    exit 0
elif [ "$OVERALL_SCORE" -ge 75 ]; then
    echo -e "${YELLOW}📈 Overall Score: ${OVERALL_SCORE}% - Good${NC}"
    exit 0
elif [ "$OVERALL_SCORE" -ge 50 ]; then
    echo -e "${YELLOW}⚠️  Overall Score: ${OVERALL_SCORE}% - Needs Improvement${NC}"
    exit 1
else
    echo -e "${RED}❌ Overall Score: ${OVERALL_SCORE}% - Poor${NC}"
    exit 1
fi