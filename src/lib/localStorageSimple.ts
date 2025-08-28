// Simplified localStorage client - no complex query building to avoid circular references
import { Database } from './supabase';

// Storage keys for organized data access
const STORAGE_KEYS = {
  users: 'cheforg_users',
  tables: 'cheforg_tables',
  menu_items: 'cheforg_menu_items',
  menu_categories: 'cheforg_menu_categories',
  orders: 'cheforg_orders',
  order_items: 'cheforg_order_items',
  reservations: 'cheforg_reservations',
  payments: 'cheforg_payments',
  feedback: 'cheforg_feedback',
  loyalty: 'cheforg_loyalty',
  current_user: 'cheforg_current_user',
  auth_session: 'cheforg_auth_session',
} as const;

// Utility functions for localStorage operations
const getFromStorage = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading from localStorage key ${key}:`, error);
    return [];
  }
};

const saveToStorage = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage key ${key}:`, error);
  }
};

const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Type definitions
type TableName = keyof Database['public']['Tables'];
type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row'];
type TableInsert<T extends TableName> = Database['public']['Tables'][T]['Insert'];
type TableUpdate<T extends TableName> = Database['public']['Tables'][T]['Update'];

// Simple query result that implements thenable without circular references
class QueryResult {
  private resultPromise: Promise<{ data: any; error: any }>;

  constructor(promiseOrResult: Promise<{ data: any; error: any }> | { data: any; error: any }) {
    if (promiseOrResult instanceof Promise) {
      this.resultPromise = promiseOrResult;
    } else {
      this.resultPromise = Promise.resolve(promiseOrResult);
    }
  }

  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: { data: any; error: any }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.resultPromise.then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null
  ): Promise<{ data: any; error: any } | TResult> {
    return this.resultPromise.catch(onrejected);
  }
}

// Simple localStorage client - no complex query building
export class SimpleLocalStorageClient {
  // Core data access method
  selectAll<T extends TableName>(table: T): TableRow<T>[] {
    const key = STORAGE_KEYS[table as keyof typeof STORAGE_KEYS] || `cheforg_${table}`;
    return getFromStorage<TableRow<T>>(key);
  }

  // Simple select with basic filtering
  select<T extends TableName>(table: T, filters?: Record<string, any>): QueryResult {
    try {
      let data = this.selectAll(table);
      
      if (filters) {
        data = data.filter(item => 
          Object.entries(filters).every(([key, value]) => 
            (item as any)[key] === value
          )
        );
      }
      
      return new QueryResult({ data, error: null });
    } catch (error) {
      return new QueryResult({ data: null, error });
    }
  }

  // Select single record
  selectSingle<T extends TableName>(table: T, filters: Record<string, any>): QueryResult {
    try {
      const data = this.selectAll(table);
      const result = data.find(item => 
        Object.entries(filters).every(([key, value]) => 
          (item as any)[key] === value
        )
      );
      
      return new QueryResult({ data: result || null, error: null });
    } catch (error) {
      return new QueryResult({ data: null, error });
    }
  }

  // Main query interface - simplified
  from<T extends TableName>(table: T) {
    const self = this;
    
    return {
      select: (_columns = '*') => ({
        // Return all data by default
        then: (callback?: (result: { data: any; error: any }) => void) => {
          const result = { data: self.selectAll(table), error: null };
          if (callback) callback(result);
          return Promise.resolve(result);
        },
        
        // Add filtering methods
        eq: (column: string, value: any) => ({
          then: (callback?: (result: { data: any; error: any }) => void) => {
            const filters = { [column]: value };
            const result = self.select(table, filters);
            return result.then(callback);
          },
          single: () => ({
            then: (callback?: (result: { data: any; error: any }) => void) => {
              const filters = { [column]: value };
              const result = self.selectSingle(table, filters);
              return result.then(callback);
            }
          })
        }),
        
        order: (column: string, options?: { ascending?: boolean }) => ({
          then: (callback?: (result: { data: any; error: any }) => void) => {
            try {
              let data = self.selectAll(table);
              const ascending = options?.ascending ?? true;
              
              data = [...data].sort((a, b) => {
                const aVal = (a as any)[column];
                const bVal = (b as any)[column];
                const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
                return ascending ? comparison : -comparison;
              });
              
              const result = { data, error: null };
              if (callback) callback(result);
              return Promise.resolve(result);
            } catch (error) {
              const result = { data: null, error };
              if (callback) callback(result);
              return Promise.resolve(result);
            }
          }
        }),
        
        gte: (column: string, value: any) => ({
          lte: (column2: string, value2: any) => ({
            then: (callback?: (result: { data: any; error: any }) => void) => {
              try {
                let data = self.selectAll(table);
                data = data.filter(item => 
                  (item as any)[column] >= value && (item as any)[column2] <= value2
                );
                
                const result = { data, error: null };
                if (callback) callback(result);
                return Promise.resolve(result);
              } catch (error) {
                const result = { data: null, error };
                if (callback) callback(result);
                return Promise.resolve(result);
              }
            }
          }),
          then: (callback?: (result: { data: any; error: any }) => void) => {
            try {
              let data = self.selectAll(table);
              data = data.filter(item => (item as any)[column] >= value);
              
              const result = { data, error: null };
              if (callback) callback(result);
              return Promise.resolve(result);
            } catch (error) {
              const result = { data: null, error };
              if (callback) callback(result);
              return Promise.resolve(result);
            }
          }
        }),
        
        single: () => ({
          then: (callback?: (result: { data: any; error: any }) => void) => {
            try {
              const data = self.selectAll(table);
              const result = { data: data[0] || null, error: null };
              if (callback) callback(result);
              return Promise.resolve(result);
            } catch (error) {
              const result = { data: null, error };
              if (callback) callback(result);
              return Promise.resolve(result);
            }
          }
        })
      }),

      insert: async (values: TableInsert<T> | TableInsert<T>[]) => {
        try {
          const key = STORAGE_KEYS[table as keyof typeof STORAGE_KEYS] || `cheforg_${table}`;
          const existingData = getFromStorage<TableRow<T>>(key);

          const newRecords = Array.isArray(values) ? values : [values];
          const recordsWithIds = newRecords.map(record => ({
            ...record,
            id: (record as any).id || generateId(),
            created_at: (record as any).created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })) as TableRow<T>[];

          const updatedData = [...existingData, ...recordsWithIds];
          saveToStorage(key, updatedData);

          return { data: recordsWithIds, error: null };
        } catch (error) {
          return { data: null, error };
        }
      },

      update: (values: TableUpdate<T>) => ({
        eq: async (column: string, value: any) => {
          try {
            const key = STORAGE_KEYS[table as keyof typeof STORAGE_KEYS] || `cheforg_${table}`;
            const existingData = getFromStorage<TableRow<T>>(key);

            const updatedData = existingData.map(item =>
              (item as any)[column] === value
                ? { ...item, ...values, updated_at: new Date().toISOString() }
                : item
            );

            saveToStorage(key, updatedData);
            const updated = updatedData.filter(item => (item as any)[column] === value);

            return { data: updated, error: null };
          } catch (error) {
            return { data: null, error };
          }
        },
      }),

      delete: () => ({
        eq: async (column: string, value: any) => {
          try {
            const key = STORAGE_KEYS[table as keyof typeof STORAGE_KEYS] || `cheforg_${table}`;
            const existingData = getFromStorage<TableRow<T>>(key);

            const filteredData = existingData.filter(item => (item as any)[column] !== value);
            saveToStorage(key, filteredData);

            return { data: [], error: null };
          } catch (error) {
            return { data: [], error };
          }
        },
      }),
    };
  }

  // Authentication methods
  auth = {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      const users = getFromStorage<any>(STORAGE_KEYS.users);
      const user = users.find((u: any) => u.email === email);

      if (!user) {
        return { data: null, error: { message: 'Usuário não encontrado' } };
      }

      // Accept '123456' for all users in development
      if (password !== '123456') {
        return { data: null, error: { message: 'Senha incorreta' } };
      }

      const authUser = {
        id: user.id.toString(),
        email: user.email,
        created_at: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEYS.auth_session, JSON.stringify(authUser));
      localStorage.setItem(STORAGE_KEYS.current_user, JSON.stringify(user));

      return { data: { user: authUser }, error: null };
    },

    signOut: async () => {
      localStorage.removeItem(STORAGE_KEYS.auth_session);
      localStorage.removeItem(STORAGE_KEYS.current_user);
      return { error: null };
    },

    getSession: async () => {
      const session = localStorage.getItem(STORAGE_KEYS.auth_session);
      if (session) {
        return { data: { session: { user: JSON.parse(session) } }, error: null };
      }
      return { data: { session: null }, error: null };
    },
  };

  // RPC functions
  rpc = async (functionName: string, _params: Record<string, any>): Promise<{ data: any; error: any }> => {
    try {
      if (functionName === 'get_sales_dashboard_data') {
        const mockData = {
          total_sales: 1250.75,
          order_count: 45,
          avg_order_value: 27.79,
          top_items: [
            { name: 'Hambúrguer Artesanal', sales: 15 },
            { name: 'Pizza Margherita', sales: 12 },
          ],
        };
        return { data: mockData, error: null };
      } else if (functionName === 'check_in_reservation') {
        return { data: { pin: '123456' }, error: null };
      } else {
        return {
          data: null,
          error: { message: `RPC function ${functionName} not implemented` },
        };
      }
    } catch (error) {
      return { data: null, error };
    }
  };

  // Edge functions
  functions = {
    invoke: async (functionName: string, _options?: { body?: any }) => {
      try {
        if (functionName === 'send-notification') {
          return { data: { success: true, messageId: 'mock-123' }, error: null };
        } else {
          return { data: null, error: { message: `Function ${functionName} not implemented` } };
        }
      } catch (error) {
        return { data: null, error };
      }
    },
  };
}

// Create and export the client instance
export const localStorageClient = new SimpleLocalStorageClient();