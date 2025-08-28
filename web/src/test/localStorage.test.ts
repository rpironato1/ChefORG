// Comprehensive tests for localStorage implementation and Supabase compatibility
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocalStorageClient } from '../lib/localStorage';

// Mock localStorage for testing
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    length: 0,
    key: (index: number) => null,
  };
})();

// Mock global localStorage
Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('LocalStorageClient', () => {
  let client: LocalStorageClient;

  beforeEach(() => {
    mockLocalStorage.clear();
    client = new LocalStorageClient();
  });

  describe('Basic CRUD Operations', () => {
    it('should insert data successfully', async () => {
      const userData = {
        nome: 'Test User',
        email: 'test@example.com',
        role: 'cliente' as const,
      };

      const result = await client.from('users').insert(userData);

      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(1);
      expect(result.data?.[0]).toMatchObject(userData);
      expect(result.data?.[0].id).toBeDefined();
    });

    it('should select data with filters', async () => {
      // Insert test data
      const userData1 = { nome: 'User 1', email: 'user1@test.com', role: 'cliente' as const };
      const userData2 = { nome: 'User 2', email: 'user2@test.com', role: 'garcom' as const };

      await client.from('users').insert([userData1, userData2]);

      // Test select with filter
      const result = await client.from('users').select('*').eq('role', 'cliente');

      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(1);
      expect(result.data?.[0].email).toBe('user1@test.com');
    });

    it('should update data correctly', async () => {
      // Insert test data
      const userData = {
        nome: 'Original Name',
        email: 'test@example.com',
        role: 'cliente' as const,
      };
      const insertResult = await client.from('users').insert(userData);
      const userId = insertResult.data?.[0].id;

      // Update data
      const updateResult = await client
        .from('users')
        .update({ nome: 'Updated Name' })
        .eq('id', userId);

      expect(updateResult.error).toBeNull();
      expect(updateResult.data?.[0].nome).toBe('Updated Name');
    });

    it('should delete data correctly', async () => {
      // Insert test data
      const userData = { nome: 'Test User', email: 'test@example.com', role: 'cliente' as const };
      const insertResult = await client.from('users').insert(userData);
      const userId = insertResult.data?.[0].id;

      // Delete data
      const deleteResult = await client.from('users').delete().eq('id', userId);

      expect(deleteResult.error).toBeNull();

      // Verify deletion
      const selectResult = await client.from('users').select('*').eq('id', userId);
      expect(selectResult.data).toHaveLength(0);
    });
  });

  describe('Authentication Methods', () => {
    beforeEach(() => {
      // Setup test user data
      const testUsers = [{ id: 1, nome: 'Test User', email: 'test@example.com', role: 'cliente' }];
      mockLocalStorage.setItem('cheforg_users', JSON.stringify(testUsers));
    });

    it('should sign in user successfully', async () => {
      const result = await client.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'any-password',
      });

      expect(result.error).toBeNull();
      expect(result.data?.user).toBeDefined();
      expect(result.data?.user.email).toBe('test@example.com');
    });

    it('should handle sign in with invalid user', async () => {
      const result = await client.auth.signInWithPassword({
        email: 'nonexistent@example.com',
        password: 'password',
      });

      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Usuário não encontrado');
      expect(result.data).toBeNull();
    });

    it('should sign out user successfully', async () => {
      // First sign in
      await client.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password',
      });

      // Then sign out
      const result = await client.auth.signOut();

      expect(result.error).toBeNull();
      expect(mockLocalStorage.getItem('cheforg_auth_session')).toBeNull();
      expect(mockLocalStorage.getItem('cheforg_current_user')).toBeNull();
    });

    it('should get session when user is signed in', async () => {
      // Sign in first
      await client.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password',
      });

      // Get session
      const result = await client.auth.getSession();

      expect(result.error).toBeNull();
      expect(result.data?.session?.user).toBeDefined();
      expect(result.data?.session?.user.email).toBe('test@example.com');
    });
  });

  describe('RPC Functions', () => {
    it('should handle get_sales_dashboard_data RPC', async () => {
      const result = await client.rpc('get_sales_dashboard_data', {});

      expect(result.error).toBeNull();
      expect(result.data).toBeDefined();
      expect(result.data.total_sales).toBeDefined();
      expect(result.data.order_count).toBeDefined();
      expect(result.data.top_items).toBeInstanceOf(Array);
    });

    it('should handle check_in_reservation RPC', async () => {
      const result = await client.rpc('check_in_reservation', { reservation_id: 1 });

      expect(result.error).toBeNull();
      expect(result.data.pin).toBe('123456');
    });

    it('should handle unknown RPC functions', async () => {
      const result = await client.rpc('unknown_function', {});

      expect(result.error).toBeDefined();
      expect(result.error.message).toContain('not implemented');
      expect(result.data).toBeNull();
    });
  });

  describe('Edge Functions', () => {
    it('should handle send-notification function', async () => {
      const result = await client.functions.invoke('send-notification', {
        body: { message: 'Test notification' },
      });

      expect(result.error).toBeNull();
      expect(result.data.success).toBe(true);
      expect(result.data.messageId).toBeDefined();
    });

    it('should handle unknown functions', async () => {
      const result = await client.functions.invoke('unknown-function', {});

      expect(result.error).toBeDefined();
      expect(result.error.message).toContain('not implemented');
      expect(result.data).toBeNull();
    });
  });

  describe('Data Persistence', () => {
    it('should persist data across client instances', async () => {
      // Insert data with first client instance
      const userData = {
        nome: 'Persistent User',
        email: 'persist@test.com',
        role: 'cliente' as const,
      };
      await client.from('users').insert(userData);

      // Create new client instance and verify data exists
      const newClient = new LocalStorageClient();
      const result = await newClient.from('users').select('*').eq('email', 'persist@test.com');

      expect(result.data).toHaveLength(1);
      expect(result.data?.[0].nome).toBe('Persistent User');
    });

    it('should handle localStorage errors gracefully', async () => {
      // Mock localStorage to throw error
      const originalSetItem = mockLocalStorage.setItem;
      mockLocalStorage.setItem = vi.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      const userData = { nome: 'Test User', email: 'test@example.com', role: 'cliente' as const };
      const result = await client.from('users').insert(userData);

      // Should handle error gracefully
      expect(result.error).toBeDefined();

      // Restore original function
      mockLocalStorage.setItem = originalSetItem;
    });
  });

  describe('Complex Queries', () => {
    beforeEach(async () => {
      // Setup test data for complex queries
      const menuItems = [
        { id: 1, nome: 'Pizza Margherita', preco: 25.0, categoria_id: 1, ativo: true },
        { id: 2, nome: 'Pizza Pepperoni', preco: 30.0, categoria_id: 1, ativo: true },
        { id: 3, nome: 'Hambúrguer', preco: 20.0, categoria_id: 2, ativo: false },
      ];

      mockLocalStorage.setItem('cheforg_menu_items', JSON.stringify(menuItems));
    });

    it('should handle order by queries', async () => {
      const result = await client
        .from('menu_items')
        .select('*')
        .order('preco', { ascending: false });

      expect(result.data).toHaveLength(3);
      expect(result.data?.[0].preco).toBe(30.0); // Highest price first
    });

    it('should handle range operations', async () => {
      const result = await client
        .from('menu_items')
        .select('*')
        .gte('preco', 25.0)
        .lte('preco', 30.0);

      expect(result.data).toHaveLength(2);
      expect(result.data?.every(item => item.preco >= 25.0 && item.preco <= 30.0)).toBe(true);
    });

    it('should handle single record queries', async () => {
      const result = await client.from('menu_items').select('*').eq('id', 1).single();

      expect(result.data).toBeDefined();
      expect(result.data?.nome).toBe('Pizza Margherita');
    });
  });

  describe('Supabase Compatibility', () => {
    it('should maintain Supabase API compatibility', () => {
      // Test that the client exposes the same interface as Supabase
      expect(client.from).toBeDefined();
      expect(client.auth).toBeDefined();
      expect(client.rpc).toBeDefined();
      expect(client.functions).toBeDefined();

      expect(typeof client.from).toBe('function');
      expect(typeof client.auth.signInWithPassword).toBe('function');
      expect(typeof client.auth.signOut).toBe('function');
      expect(typeof client.auth.getSession).toBe('function');
    });

    it('should return data in Supabase format', async () => {
      const userData = { nome: 'Format Test', email: 'format@test.com', role: 'cliente' as const };
      const result = await client.from('users').insert(userData);

      // Should have { data, error } structure like Supabase
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('error');
      expect(result.error).toBeNull();
      expect(Array.isArray(result.data)).toBe(true);
    });
  });

  describe('Migration Readiness', () => {
    it('should store data in format ready for Supabase migration', async () => {
      const orderData = {
        table_id: 1,
        customer_name: 'John Doe',
        status: 'confirmado' as const,
        total: 50.0,
        observacoes: 'No onions',
      };

      await client.from('orders').insert(orderData);

      // Verify data is stored with proper structure
      const storedData = JSON.parse(mockLocalStorage.getItem('cheforg_orders') || '[]');
      expect(storedData[0]).toMatchObject(orderData);
      expect(storedData[0].id).toBeDefined();
      expect(storedData[0].created_at).toBeDefined();
    });

    it('should handle all table types defined in Database schema', async () => {
      // Test that all major tables can be accessed
      const tables = [
        'users',
        'tables',
        'menu_items',
        'menu_categories',
        'orders',
        'order_items',
        'reservations',
        'payments',
        'feedback',
        'loyalty',
      ];

      for (const table of tables) {
        const result = await client.from(table as any).select('*');
        expect(result).toHaveProperty('data');
        expect(result).toHaveProperty('error');
      }
    });
  });
});
