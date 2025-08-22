# ChefORG - Restaurant Management System

ChefORG is a comprehensive restaurant management system built with React 18, TypeScript, Vite, and Supabase. It provides end-to-end functionality for restaurant operations including table management, reservations, orders, menu management, staff coordination, and customer-facing interfaces.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Setup
Run these commands in sequence to set up the development environment:

1. **Install Dependencies:**
   ```bash
   npm install
   ```
   - Takes ~1 minute to complete
   - Downloads ~332 packages
   - May show deprecation warnings - these are normal

2. **Start Development Server:**
   ```bash
   npm run dev
   ```
   - **NEVER CANCEL** - Server starts in ~235ms and runs on port 3000
   - Access at `http://localhost:3000`
   - Hot reload enabled for all React/TypeScript changes
   - Console will show test data initialization messages - this is normal

3. **Build for Production (CURRENTLY FAILS):**
   ```bash
   npm run build
   ```
   - **WARNING:** Currently fails with 167 TypeScript errors
   - **NEVER CANCEL** - Build takes ~7 seconds when it fails, would take 30+ seconds if successful
   - Do NOT attempt production builds until TypeScript errors are resolved
   - Set timeout to 90+ minutes for build commands

4. **Lint Code (PARTIALLY WORKS):**
   ```bash
   npm run lint
   ```
   - Basic ESLint configuration is present but limited
   - Does not handle TypeScript/React syntax properly
   - Use for basic JavaScript syntax checking only

5. **Preview Production Build:**
   ```bash
   npm run preview
   ```
   - Only works after successful `npm run build`
   - Currently not functional due to build errors

### Critical Build Status
- **Development Mode:** ✅ Works perfectly
- **Production Build:** ❌ Blocked by 167 TypeScript errors
- **Testing Infrastructure:** ❌ Not implemented (0% coverage)
- **Linting:** ⚠️ Basic setup only

## Validation and Testing

### Manual Validation Scenarios
Always test these complete user flows after making changes:

1. **Public Website Flow:**
   - Visit `http://localhost:3000`
   - Click "Reservar Mesa" button
   - Fill reservation form with valid data
   - Navigate through the 3-step reservation process
   - Check that form validation works properly

2. **Admin System Access:**
   - Try accessing `http://localhost:3000/admin`
   - Should redirect to login page (authentication working)
   - Verify protected routes are properly secured

3. **Menu and Customer Interface:**
   - Navigate to `http://localhost:3000/menu`
   - Check menu categories and item displays
   - Verify responsive design on different screen sizes

4. **System Functionality Check:**
   - Console should show: "Test data initialized successfully!"
   - Available test accounts should be logged to console
   - No critical JavaScript errors should appear

### Build Troubleshooting
**Common Build Errors to Fix:**
- Unused React imports in multiple files
- TypeScript type mismatches in API responses
- Missing exports in `lib/api/index.ts`
- Undefined checks in business logic hooks
- Import path resolution issues

**When Build Errors Occur:**
1. Read the specific TypeScript error messages
2. Focus on files with highest error counts first
3. Remove unused imports before fixing type issues
4. Verify all API exports are properly defined
5. Test incrementally with `npm run dev` after each fix

## Project Structure and Key Areas

### Core Application Structure
```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components (Sidebar, Header)
│   └── ui/             # UI primitives and shared components
├── pages/              # Route-based page components
│   ├── admin/          # Admin dashboard pages
│   ├── auth/           # Login/authentication pages
│   ├── cliente/        # Customer-facing pages
│   ├── public/         # Public website pages
│   └── staff/          # Staff operation panels
├── lib/                # Core business logic and APIs
│   ├── api/            # Supabase API modules (13 modules)
│   ├── supabase.ts     # Database client configuration
│   ├── localStorage.ts # Testing fallback storage
│   └── testData.ts     # Mock data for development
├── hooks/              # Custom React hooks
│   └── useBusinessLogic.ts # Core business logic (677 lines)
├── contexts/           # React context providers
└── types/              # TypeScript type definitions
```

### Important Configuration Files
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Build configuration (port 3000)
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - CSS framework configuration
- `.github/workflows/keepalive.yml` - Supabase keep-alive automation

### Frequently Modified Areas
- **Business Logic:** `src/hooks/useBusinessLogic.ts` - Contains core restaurant operations logic
- **API Layer:** `src/lib/api/` - All Supabase interactions and data operations
- **Authentication:** `src/contexts/AppContext.tsx` - User session management
- **Routes:** `src/App.tsx` - Application routing configuration
- **Test Data:** `src/lib/testData.ts` - Mock data for development and testing

## Database and Backend

### Supabase Configuration
- **Current Mode:** Uses localStorage fallback for development
- **Production Database:** Supabase (credentials in `src/lib/supabase.ts`)
- **Keep-Alive System:** Configured to prevent database sleep
- **Database Schema:** Comprehensive with 10+ tables for restaurant operations

### Key Database Tables
- `users` - Staff and customer accounts
- `tables` - Restaurant table management
- `menu_items` - Food and beverage catalog
- `orders` - Customer orders and status tracking
- `reservations` - Table reservations and queue management
- `payments` - Payment processing and methods
- `feedback` - Customer reviews and ratings

### API Modules (src/lib/api/)
Each module handles specific business domain:
- `dashboard.ts` - Management analytics
- `orders.ts` - Order processing
- `reservations.ts` - Booking management
- `menu.ts` - Menu item operations
- `tables.ts` - Table status management
- `payments.ts` - Payment processing
- `notifications.ts` - WhatsApp/SMS integration
- `reports.ts` - Business reporting
- `stock.ts` - Inventory management

## Development Guidelines

### Making Changes
1. **Always run `npm run dev` first** to ensure clean starting state
2. **Test in browser immediately** after any significant change
3. **Check console for errors** - application logs helpful debugging info
4. **Use TypeScript strictly** - fix type errors as they appear
5. **Test responsive design** - application targets mobile and desktop

### Code Quality
- Remove unused imports to reduce build errors
- Follow existing patterns in API modules
- Use proper TypeScript types from `src/types/index.ts`
- Maintain consistent error handling across components
- Test user flows manually after changes

### Common Tasks
**Adding New Features:**
1. Check if similar functionality exists in existing API modules
2. Add types to `src/types/index.ts` first
3. Create API functions in appropriate `src/lib/api/` module
4. Add business logic to `useBusinessLogic.ts` if needed
5. Create UI components following existing patterns
6. Test complete user scenarios

**Fixing Build Errors:**
1. Start development server: `npm run dev`
2. Attempt build: `npm run build` (expect failures)
3. Fix TypeScript errors systematically
4. Remove unused imports first (easy wins)
5. Fix type mismatches in API responses
6. Verify exports in `lib/api/index.ts`

**Debugging Issues:**
1. Check browser console for JavaScript errors
2. Verify network requests in browser dev tools
3. Check localStorage for test data persistence
4. Review React component error boundaries
5. Validate prop types and component interfaces

## Critical Warnings

- **NEVER CANCEL** long-running commands - builds may take 30+ minutes if successful
- **DO NOT** attempt production deployment until all 167 TypeScript errors are resolved
- **ALWAYS TEST** user scenarios manually - no automated testing exists
- **BE CAREFUL** with Supabase credentials - currently using localStorage fallback
- **VERIFY TIMEOUTS** of 90+ minutes for build commands and 30+ minutes for any compilation tasks

## Test Accounts (Development Mode)
When running in development, these accounts are available:
- Admin: admin@cheforg.com
- Recepção: recepcao@cheforg.com
- Garçom: garcom@cheforg.com
- Cozinha: cozinha@cheforg.com
- Caixa: caixa@cheforg.com
- Cliente: cliente@test.com

## Next Steps for Production Readiness
1. **Fix all 167 TypeScript errors** (blocking issue)
2. **Implement test infrastructure** (0% coverage currently)
3. **Resolve authentication context issues**
4. **Add comprehensive error handling**
5. **Implement proper environment configuration**
6. **Set up CI/CD pipeline validation**

---

*This system is 75% complete but requires TypeScript error resolution before production deployment.*