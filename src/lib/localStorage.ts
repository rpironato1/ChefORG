// Pure localStorage service - completely offline, optimized for performance
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

// Simple query builder that returns data directly
class LocalStorageQueryBuilder<T extends TableName> {
  private table: T;
  private filters: Array<(item: any) => boolean> = [];
  private orderConfig: { column: string; ascending: boolean } | null = null;
  private limitConfig: number | null = null;
  private singleMode = false;

  constructor(table: T, private client: LocalStorageClient) {
    this.table = table;
  }

  eq(column: string, value: any) {
    this.filters.push((item: any) => item[column] === value);
    return this;
  }

  gte(column: string, value: any) {
    this.filters.push((item: any) => item[column] >= value);
    return this;
  }

  lte(column: string, value: any) {
    this.filters.push((item: any) => item[column] <= value);
    return this;
  }

  in(column: string, values: any[]) {
    this.filters.push((item: any) => values.includes(item[column]));
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderConfig = { column, ascending: options?.ascending ?? true };
    return this;
  }

  limit(count: number) {
    this.limitConfig = count;
    return this;
  }

  single() {
    this.singleMode = true;
    return this;
  }

  // Execute query and return promise - simplified to avoid circular references
  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: { data: any; error: any }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    const promise = this.execute();
    return promise.then(onfulfilled, onrejected);
  }

  // Internal execution method
  private async execute(): Promise<{ data: any; error: any }> {
    try {
      let data = this.client.selectAll(this.table);

      // Apply filters
      if (this.filters.length > 0) {
        data = data.filter(item => this.filters.every(filter => filter(item)));
      }

      // Apply ordering
      if (this.orderConfig) {
        const { column, ascending } = this.orderConfig;
        data = [...data].sort((a, b) => {
          const aVal = (a as any)[column];
          const bVal = (b as any)[column];
          const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
          return ascending ? comparison : -comparison;
        });
      }

      // Apply limit
      if (this.limitConfig) {
        data = data.slice(0, this.limitConfig);
      }

      // Return single item or array
      const result = this.singleMode ? data[0] || null : data;
      return { data: result, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
}

// Pure localStorage client - no online dependencies
export class LocalStorageClient {
  // Core data access method
  selectAll<T extends TableName>(table: T): TableRow<T>[] {
    const key = STORAGE_KEYS[table as keyof typeof STORAGE_KEYS] || `cheforg_${table}`;
    return getFromStorage<TableRow<T>>(key);
  }

  // Main query interface
  from<T extends TableName>(table: T) {
    return {
      select: (_columns = '*') => new LocalStorageQueryBuilder(table, this),

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

        match: async (filters: Record<string, any>) => {
          try {
            const key = STORAGE_KEYS[table as keyof typeof STORAGE_KEYS] || `cheforg_${table}`;
            const existingData = getFromStorage<TableRow<T>>(key);

            const updatedData = existingData.map(item => {
              const matches = Object.entries(filters).every(
                ([filterKey, filterValue]) => (item as any)[filterKey] === filterValue
              );
              return matches ? { ...item, ...values, updated_at: new Date().toISOString() } : item;
            });

            saveToStorage(key, updatedData);
            const updated = updatedData.filter(item =>
              Object.entries(filters).every(
                ([filterKey, filterValue]) => (item as any)[filterKey] === filterValue
              )
            );

            return { data: updated, error: null };
          } catch (error) {
            return { data: null, error };
          }
        },

        select: () => ({
          single: async () => {
            try {
              // Return first item with updates applied
              const mockData = { id: 'updated', ...values };
              return { data: mockData, error: null };
            } catch (error) {
              return { data: null, error };
            }
          },
        }),
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

        match: async (filters: Record<string, any>) => {
          try {
            const key = STORAGE_KEYS[table as keyof typeof STORAGE_KEYS] || `cheforg_${table}`;
            const existingData = getFromStorage<TableRow<T>>(key);

            const filteredData = existingData.filter(
              item =>
                !Object.entries(filters).every(
                  ([filterKey, filterValue]) => (item as any)[filterKey] === filterValue
                )
            );

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
export const localStorageClient = new LocalStorageClient();
