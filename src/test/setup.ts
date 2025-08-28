import '@testing-library/jest-dom';
import { vi, beforeEach, afterEach } from 'vitest';

// Enhanced localStorage mock for pure localStorage client
const createLocalStorageMock = () => {
  const storage = new Map<string, string>();
  
  return {
    getItem: vi.fn((key: string) => {
      return storage.get(key) || null;
    }),
    setItem: vi.fn((key: string, value: string) => {
      storage.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      storage.delete(key);
    }),
    clear: vi.fn(() => {
      storage.clear();
    }),
    key: vi.fn((index: number) => {
      const keys = Array.from(storage.keys());
      return keys[index] || null;
    }),
    get length() {
      return storage.size;
    },
  };
};

const localStorageMock = createLocalStorageMock();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_SUPABASE_URL: 'http://localhost:54321',
    VITE_SUPABASE_ANON_KEY: 'test-key',
    VITE_STRIPE_PUBLISHABLE_KEY: 'pk_test_123',
    MODE: 'test',
    DEV: false,
    PROD: false,
    SSR: false,
  },
  writable: true,
});

// Mock console to reduce test noise
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  // Reset localStorage mock and recreate storage
  localStorageMock.clear();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  
  // Initialize with test data for consistent testing
  const testUsers = [
    {
      id: 1,
      nome: 'Admin User',
      email: 'admin@cheforg.com',
      role: 'gerente',
      ativo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      nome: 'Test Client',
      email: 'client@test.com',
      role: 'cliente',
      ativo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
  
  const testTables = [
    {
      id: 1,
      numero: 1,
      lugares: 4,
      status: 'livre',
      qr_code: 'QR001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
  
  const testMenuItems = [
    {
      id: 1,
      nome: 'Hambúrguer Artesanal',
      descricao: 'Delicioso hambúrguer caseiro',
      preco: 25.90,
      categoria: 'Lanches',
      disponivel: true,
      tempo_preparo: 15,
      ingredientes: ['carne', 'pão', 'queijo'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
  
  // Set up initial test data
  localStorageMock.setItem('cheforg_users', JSON.stringify(testUsers));
  localStorageMock.setItem('cheforg_tables', JSON.stringify(testTables));
  localStorageMock.setItem('cheforg_menu_items', JSON.stringify(testMenuItems));
  localStorageMock.setItem('cheforg_orders', JSON.stringify([]));
  localStorageMock.setItem('cheforg_reservations', JSON.stringify([]));
  
  // Suppress console errors/warnings for cleaner test output
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterEach(() => {
  // Restore console
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  
  // Clear all mocks
  vi.clearAllMocks();
});
