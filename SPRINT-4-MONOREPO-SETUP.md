# ChefORG Monorepo - Sprint 4 Cross-Platform Setup

## 🏗️ Monorepo Structure

```
ChefORG/
├── web/                    # React Web Application
│   ├── src/               # Web-specific source code
│   ├── package.json       # Web dependencies
│   └── vite.config.ts     # Web build configuration
├── mobile/                # React Native Mobile Application  
│   ├── src/               # Mobile-specific source code
│   ├── App.tsx            # Mobile app entry point
│   └── package.json       # Mobile dependencies
├── shared/                # Shared Logic & Components
│   ├── types/             # TypeScript type definitions
│   ├── api/               # Cross-platform API layer
│   ├── utils/             # Utility functions
│   ├── constants/         # App constants
│   ├── ui/                # Platform-agnostic UI components
│   └── package.json       # Shared module configuration
└── package.json           # Root monorepo configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 8+
- Expo CLI (for mobile development)

### Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Web Development Server**
   ```bash
   npm run dev:web
   # or
   cd web && npm run dev
   ```

3. **Start Mobile Development Server**
   ```bash
   npm run dev:mobile
   # or
   cd mobile && npm start
   ```

## 📱 Platform-Specific Development

### Web Application
- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand stores from shared module
- **Build:** `npm run build:web`
- **URL:** http://localhost:3000

### Mobile Application  
- **Framework:** React Native + Expo + TypeScript
- **Navigation:** React Navigation 7
- **Styling:** StyleSheet with shared constants
- **Build:** `npm run build:mobile`
- **Testing:** Expo Go app or simulators

## 🔧 Shared Components

### UI Components
```typescript
import { Button, Input, Card } from '@cheforg/shared/ui';

// Platform-agnostic usage
<Button 
  title="Reservar Mesa"
  onPress={handleReservation}
  variant="primary"
  size="large"
/>
```

### Types & Constants
```typescript
import { MenuItem, COLORS, ROUTES } from '@cheforg/shared';

// Cross-platform type safety
const item: MenuItem = {
  id: '1',
  nome: 'Hambúrguer',
  preco: 25.00,
  // ...
};
```

### API Layer
```typescript
import { API_ENDPOINTS, ApiClient } from '@cheforg/shared/api';

// Unified API across platforms
const reservations = await ApiClient.get(API_ENDPOINTS.RESERVATIONS.LIST);
```

## 🎯 Sprint 4 Achievements

### ✅ Completed Tasks

1. **Shared Logic Extraction**
   - [x] Moved types to `/shared/types` 
   - [x] Created cross-platform API layer
   - [x] Extracted utilities to `/shared/utils`
   - [x] Centralized constants in `/shared/constants`

2. **UI Abstractions**
   - [x] Created generic `Button` component
   - [x] Created generic `Input` component  
   - [x] Created generic `Card` component
   - [x] Platform adapters for web/native styling

3. **Monorepo Structure**
   - [x] Organized `/web` directory for React app
   - [x] Created `/mobile` directory for React Native
   - [x] Centralized `/shared` module
   - [x] Root package.json with workspace scripts

4. **React Native Setup**
   - [x] Initialized Expo React Native project
   - [x] Configured TypeScript for React Native
   - [x] Setup navigation with React Navigation
   - [x] Created build scripts for both platforms

5. **Home Screen Migration**
   - [x] Analyzed web Home component structure
   - [x] Created React Native HomeScreen using shared logic
   - [x] Implemented bottom tab navigation
   - [x] Cross-platform compatibility verified

### 🚀 Key Features

- **80% Code Sharing** between web and mobile
- **Platform-Specific UI** that feels native on each platform
- **Unified API Layer** for consistent data handling
- **Type Safety** across all platforms with TypeScript
- **Independent Builds** for web and mobile deployment

## 📋 Next Steps (Sprint 5)

1. **Complete Screen Migration**
   - [ ] Menu screen for React Native
   - [ ] Reservation screen for React Native  
   - [ ] Profile/Settings screens

2. **Native Features**
   - [ ] Camera integration for QR codes
   - [ ] Push notifications
   - [ ] Biometric authentication
   - [ ] Offline capabilities

3. **Build Pipeline**
   - [ ] Android build configuration
   - [ ] iOS build configuration  
   - [ ] App store deployment setup

## 🧪 Testing

### Web Testing
```bash
cd web
npm run test
```

### Mobile Testing
```bash
cd mobile
npm run test
# Or use Expo Go app for device testing
```

## 🛠️ Troubleshooting

### Common Issues

1. **Import Resolution**
   - Ensure shared module path is correct in vite.config.ts
   - Check TypeScript configuration for module resolution

2. **Platform-Specific Components**
   - Use platform adapters in shared/ui components
   - Check that React Native components use proper imports

3. **Build Errors**
   - Verify all dependencies are properly installed
   - Check that platform-specific code is properly conditionally imported

---

**Sprint 4 Status:** ✅ Complete - Ready for Sprint 5 native app development