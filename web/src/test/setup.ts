import '@testing-library/jest-dom';
import { vi, beforeEach, afterEach } from 'vitest';

// Mock lucide-react to use our mock file
vi.mock('lucide-react', () => import('./__mocks__/lucide-react'));

// Enhanced localStorage mock with realistic behavior and proper isolation
class MockLocalStorage {
  private store: Record<string, string> = {};

  getItem = vi.fn((key: string): string | null => {
    return this.store[key] || null;
  });

  setItem = vi.fn((key: string, value: string): void => {
    this.store[key] = String(value);
  });

  removeItem = vi.fn((key: string): void => {
    delete this.store[key];
  });

  clear = vi.fn((): void => {
    this.store = {};
  });

  key = vi.fn((index: number): string | null => {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  });

  get length(): number {
    return Object.keys(this.store).length;
  }

  // Method to reset store for test isolation
  reset(): void {
    this.store = {};
    this.getItem.mockClear();
    this.setItem.mockClear();
    this.removeItem.mockClear();
    this.clear.mockClear();
    this.key.mockClear();
  }

  // Method to seed test data
  seedTestData(data: Record<string, any>): void {
    Object.entries(data).forEach(([key, value]) => {
      this.store[key] = JSON.stringify(value);
    });
  }
}

// Create mock instance
const localStorageMock = new MockLocalStorage();

// Set localStorage on both window and global for full compatibility
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Also set it on global for Node.js environment
(global as any).localStorage = localStorageMock;

// Mock environment variables for test isolation
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

// Complete test isolation - reset before each test
beforeEach(() => {
  console.log('[TEST SETUP] Initializing test environment with comprehensive mocks...');
  
  // Reset localStorage completely
  localStorageMock.reset();

  // Seed with minimal test data structure
  localStorageMock.seedTestData({
    cheforg_users: [
      {
        id: '1',
        nome: 'Test User',
        email: 'test@test.com',
        role: 'cliente',
        ativo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    cheforg_tables: [
      {
        id: '1',
        numero: 1,
        lugares: 4,
        status: 'livre',
        qr_code: 'QR001',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    cheforg_menu_items: [
      {
        id: '1',
        nome: 'Test Item',
        descricao: 'Test Description',
        preco: 10.99,
        categoria: 'test',
        disponivel: true,
        tempo_preparo: 15,
        ingredientes: ['test'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    cheforg_orders: [],
    cheforg_reservations: [],
    cheforg_payments: [],
  });

  console.log('[TEST SETUP] Test data initialized successfully with comprehensive lucide-react mocks');
});

// Additional cleanup after each test
afterEach(() => {
  console.log('[TEST CLEANUP] Cleaning up test environment...');
  localStorageMock.reset();
});

// Export mock instance for direct test access
export { localStorageMock };
