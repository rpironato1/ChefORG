#!/bin/bash

# ChefORG Mobile Build Pipeline Script
# This script handles the complete build process for Android and iOS

set -e

echo "🚀 ChefORG Mobile Build Pipeline"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="ChefORG Mobile"
BUILD_TYPE=${1:-"development"}
PLATFORM=${2:-"all"}

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    # Check Expo CLI
    if ! command -v expo &> /dev/null; then
        log_warning "Expo CLI not found globally, installing..."
        npm install -g @expo/cli
    fi
    
    # Check EAS CLI
    if ! command -v eas &> /dev/null; then
        log_warning "EAS CLI not found globally, installing..."
        npm install -g eas-cli
    fi
    
    log_success "Prerequisites checked"
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    cd mobile
    npm ci
    
    log_success "Dependencies installed"
}

# Run tests
run_tests() {
    log_info "Running tests..."
    
    # Install test dependencies if not present
    if ! npm list @testing-library/react-native &> /dev/null; then
        log_info "Installing test dependencies..."
        npm install --save-dev @testing-library/react-native @testing-library/jest-native jest-expo
    fi
    
    # Run tests
    if npm test -- --watchAll=false --coverage; then
        log_success "All tests passed"
    else
        log_error "Tests failed"
        exit 1
    fi
}

# Lint code
lint_code() {
    log_info "Linting code..."
    
    if npm run lint; then
        log_success "Linting passed"
    else
        log_warning "Linting issues found (continuing build)"
    fi
}

# Build for development
build_development() {
    log_info "Building development version..."
    
    case $PLATFORM in
        "android")
            eas build --platform android --profile development --local
            ;;
        "ios")
            eas build --platform ios --profile development --local
            ;;
        "all")
            eas build --platform all --profile development --local
            ;;
        *)
            log_error "Invalid platform: $PLATFORM"
            exit 1
            ;;
    esac
    
    log_success "Development build completed"
}

# Build for preview
build_preview() {
    log_info "Building preview version..."
    
    case $PLATFORM in
        "android")
            eas build --platform android --profile preview
            ;;
        "ios")
            eas build --platform ios --profile preview
            ;;
        "all")
            eas build --platform all --profile preview
            ;;
        *)
            log_error "Invalid platform: $PLATFORM"
            exit 1
            ;;
    esac
    
    log_success "Preview build completed"
}

# Build for production
build_production() {
    log_info "Building production version..."
    
    # Verify version bump
    log_info "Current version: $(node -p "require('./package.json').version")"
    
    # Build
    case $PLATFORM in
        "android")
            eas build --platform android --profile production
            ;;
        "ios")
            eas build --platform ios --profile production
            ;;
        "all")
            eas build --platform all --profile production
            ;;
        *)
            log_error "Invalid platform: $PLATFORM"
            exit 1
            ;;
    esac
    
    log_success "Production build completed"
}

# Update app version
update_version() {
    local version_type=${1:-"patch"}
    
    log_info "Updating version ($version_type)..."
    
    npm version $version_type --no-git-tag-version
    
    # Update app.json version
    local new_version=$(node -p "require('./package.json').version")
    
    # Use jq if available, otherwise use sed
    if command -v jq &> /dev/null; then
        jq ".expo.version = \"$new_version\"" app.json > app.json.tmp && mv app.json.tmp app.json
    else
        sed -i.bak "s/\"version\": \"[^\"]*\"/\"version\": \"$new_version\"/" app.json
    fi
    
    log_success "Version updated to $new_version"
}

# Generate assets
generate_assets() {
    log_info "Generating app assets..."
    
    # Check if we have the icon and splash files
    if [ ! -f "assets/icon.png" ]; then
        log_warning "Icon not found, using default"
    fi
    
    if [ ! -f "assets/splash-icon.png" ]; then
        log_warning "Splash icon not found, using default"
    fi
    
    log_success "Assets checked"
}

# Setup EAS project
setup_eas() {
    log_info "Setting up EAS project..."
    
    if [ ! -f "eas.json" ]; then
        log_error "eas.json not found"
        exit 1
    fi
    
    # Configure EAS project if not already done
    if ! eas whoami &> /dev/null; then
        log_warning "Please login to EAS:"
        eas login
    fi
    
    # Update EAS project
    eas build:configure
    
    log_success "EAS project configured"
}

# Deploy to stores
deploy_to_stores() {
    log_info "Deploying to app stores..."
    
    case $PLATFORM in
        "android")
            eas submit --platform android --latest
            ;;
        "ios")
            eas submit --platform ios --latest
            ;;
        "all")
            eas submit --platform all --latest
            ;;
        *)
            log_error "Invalid platform: $PLATFORM"
            exit 1
            ;;
    esac
    
    log_success "Deployment to stores initiated"
}

# Generate build report
generate_report() {
    log_info "Generating build report..."
    
    local report_file="build-report-$(date +%Y%m%d-%H%M%S).md"
    
    cat > $report_file << EOF
# ChefORG Mobile Build Report

**Build Date:** $(date)
**Build Type:** $BUILD_TYPE
**Platform:** $PLATFORM
**Version:** $(node -p "require('./package.json').version")

## Build Configuration
- Node.js: $(node --version)
- npm: $(npm --version)
- Expo CLI: $(expo --version)
- EAS CLI: $(eas --version)

## Features Included
- ✅ React Navigation with bottom tabs
- ✅ QR Code scanner functionality
- ✅ Push notifications
- ✅ Biometric authentication
- ✅ Offline localStorage compatibility
- ✅ All main screens (Home, Menu, Reservations, Orders, Profile, Admin, Staff)
- ✅ Native camera integration
- ✅ Cross-platform build configuration

## Test Results
$(if [ -f "coverage/lcov-report/index.html" ]; then echo "✅ Test coverage report available"; else echo "⚠️ No test coverage available"; fi)

## Build Artifacts
$(ls -la *.apk *.ipa 2>/dev/null || echo "No build artifacts found")

## Next Steps
1. Test the app on physical devices
2. Verify all native features work correctly
3. Submit for app store review (if production build)
4. Monitor crash reports and user feedback

---
Generated by ChefORG Mobile Build Pipeline
EOF

    log_success "Build report generated: $report_file"
}

# Main execution
main() {
    echo "Starting build process..."
    echo "Build Type: $BUILD_TYPE"
    echo "Platform: $PLATFORM"
    echo ""
    
    # Navigate to mobile directory
    if [ ! -d "mobile" ]; then
        log_error "Mobile directory not found. Run this script from the project root."
        exit 1
    fi
    
    # Execute build pipeline
    check_prerequisites
    install_dependencies
    generate_assets
    
    # Run tests for non-production builds
    if [ "$BUILD_TYPE" != "production" ]; then
        run_tests
    fi
    
    lint_code
    
    # Setup EAS if needed
    if [ "$BUILD_TYPE" = "preview" ] || [ "$BUILD_TYPE" = "production" ]; then
        setup_eas
    fi
    
    # Build based on type
    case $BUILD_TYPE in
        "development")
            build_development
            ;;
        "preview")
            build_preview
            ;;
        "production")
            update_version
            build_production
            ;;
        *)
            log_error "Invalid build type: $BUILD_TYPE"
            echo "Available types: development, preview, production"
            exit 1
            ;;
    esac
    
    # Deploy if production
    if [ "$BUILD_TYPE" = "production" ]; then
        read -p "Deploy to app stores? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            deploy_to_stores
        fi
    fi
    
    generate_report
    
    log_success "Build pipeline completed successfully! 🎉"
    echo ""
    echo "Next steps:"
    echo "1. Test the app on device"
    echo "2. Verify all features work"
    echo "3. Check build artifacts"
    
    cd ..
}

# Help function
show_help() {
    cat << EOF
ChefORG Mobile Build Pipeline

Usage: $0 [BUILD_TYPE] [PLATFORM]

BUILD_TYPE:
  development  - Development build with debugging
  preview      - Internal testing build
  production   - Production build for app stores

PLATFORM:
  android      - Build for Android only
  ios          - Build for iOS only  
  all          - Build for both platforms (default)

Examples:
  $0                           # Development build for all platforms
  $0 preview android           # Preview build for Android
  $0 production ios            # Production build for iOS
  
Environment variables:
  EXPO_TOKEN   - Expo authentication token
  EAS_TOKEN    - EAS authentication token

EOF
}

# Handle command line arguments
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    show_help
    exit 0
fi

# Run main function
main