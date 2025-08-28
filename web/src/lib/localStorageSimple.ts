// Simplified localStorage implementation - completely avoiding circular references
import { Database } from './supabase';

// Storage keys
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

// Helper functions for localStorage operations
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

// Type definitions for localStorage operations
type TableName = keyof Database['public']['Tables'];
type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row'];
type TableInsert<T extends TableName> = Database['public']['Tables'][T]['Insert'];
type TableUpdate<T extends TableName> = Database['public']['Tables'][T]['Update'];

// Simplified query builder - no circular references
class SimpleQueryBuilder<T extends TableName> {
  private table: T;
  private filters: Array<(item: any) => boolean> = [];
  private orderConfig: { column: string; ascending: boolean } | null = null;
  private limitConfig: number | null = null;
  private rangeConfig: { from: number; to: number } | null = null;
  private singleMode = false;

  constructor(table: T) {
    this.table = table;
  }

  eq(column: string, value: any): SimpleQueryBuilder<T> {
    const newBuilder = new SimpleQueryBuilder(this.table);
    newBuilder.filters = [...this.filters, (item: any) => item[column] === value];
    newBuilder.orderConfig = this.orderConfig;
    newBuilder.limitConfig = this.limitConfig;
    newBuilder.rangeConfig = this.rangeConfig;
    newBuilder.singleMode = this.singleMode;
    return newBuilder;
  }

  gte(column: string, value: any): SimpleQueryBuilder<T> {
    const newBuilder = new SimpleQueryBuilder(this.table);
    newBuilder.filters = [...this.filters, (item: any) => item[column] >= value];
    newBuilder.orderConfig = this.orderConfig;
    newBuilder.limitConfig = this.limitConfig;
    newBuilder.rangeConfig = this.rangeConfig;
    newBuilder.singleMode = this.singleMode;
    return newBuilder;
  }

  lte(column: string, value: any): SimpleQueryBuilder<T> {
    const newBuilder = new SimpleQueryBuilder(this.table);
    newBuilder.filters = [...this.filters, (item: any) => item[column] <= value];
    newBuilder.orderConfig = this.orderConfig;
    newBuilder.limitConfig = this.limitConfig;
    newBuilder.rangeConfig = this.rangeConfig;
    newBuilder.singleMode = this.singleMode;
    return newBuilder;
  }

  in(column: string, values: any[]): SimpleQueryBuilder<T> {
    const newBuilder = new SimpleQueryBuilder(this.table);
    newBuilder.filters = [...this.filters, (item: any) => values.includes(item[column])];
    newBuilder.orderConfig = this.orderConfig;
    newBuilder.limitConfig = this.limitConfig;
    newBuilder.rangeConfig = this.rangeConfig;
    newBuilder.singleMode = this.singleMode;
    return newBuilder;
  }

  order(column: string, options?: { ascending?: boolean }): SimpleQueryBuilder<T> {
    const newBuilder = new SimpleQueryBuilder(this.table);
    newBuilder.filters = [...this.filters];
    newBuilder.orderConfig = { column, ascending: options?.ascending ?? true };
    newBuilder.limitConfig = this.limitConfig;
    newBuilder.rangeConfig = this.rangeConfig;
    newBuilder.singleMode = this.singleMode;
    return newBuilder;
  }

  limit(count: number): SimpleQueryBuilder<T> {
    const newBuilder = new SimpleQueryBuilder(this.table);
    newBuilder.filters = [...this.filters];
    newBuilder.orderConfig = this.orderConfig;
    newBuilder.limitConfig = count;
    newBuilder.rangeConfig = this.rangeConfig;
    newBuilder.singleMode = this.singleMode;
    return newBuilder;
  }

  range(from: number, to: number): SimpleQueryBuilder<T> {
    const newBuilder = new SimpleQueryBuilder(this.table);
    newBuilder.filters = [...this.filters];
    newBuilder.orderConfig = this.orderConfig;
    newBuilder.limitConfig = this.limitConfig;
    newBuilder.rangeConfig = { from, to };
    newBuilder.singleMode = this.singleMode;
    return newBuilder;
  }

  single(): SimpleQueryBuilder<T> {
    const newBuilder = new SimpleQueryBuilder(this.table);
    newBuilder.filters = [...this.filters];
    newBuilder.orderConfig = this.orderConfig;
    newBuilder.limitConfig = this.limitConfig;
    newBuilder.rangeConfig = this.rangeConfig;
    newBuilder.singleMode = true;
    return newBuilder;
  }

  // Promise implementation - single method, no circular references
  then<TResult1 = { data: any; error: any }, TResult2 = never>(
    onFulfilled?: ((value: { data: any; error: any }) => TResult1 | PromiseLike<TResult1>) | null,
    onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onFulfilled, onRejected);
  }

  // Execute the query
  private execute(): Promise<{ data: any; error: any }> {
    return new Promise(resolve => {
      try {
        const key =
          STORAGE_KEYS[this.table as keyof typeof STORAGE_KEYS] || `cheforg_${this.table}`;
        let data = getFromStorage<TableRow<T>>(key);

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

        // Apply range/limit
        if (this.rangeConfig) {
          const { from, to } = this.rangeConfig;
          data = data.slice(from, to + 1);
        } else if (this.limitConfig) {
          data = data.slice(0, this.limitConfig);
        }

        // Return single item or array
        const result = this.singleMode ? data[0] || null : data;
        resolve({ data: result, error: null });
      } catch (error) {
        resolve({ data: null, error });
      }
    });
  }
}

// Main localStorage client class - simplified
export class SimpleLocalStorageClient {
  from<T extends TableName>(table: T) {
    return {
      select: (_columns = '*') => new SimpleQueryBuilder(table),

      insert: (values: TableInsert<T> | TableInsert<T>[]) => this.insert(table, values),

      update: (values: TableUpdate<T>) => ({
        eq: (column: string, value: any) => this.update(table, values, column, value),
        match: (filters: Record<string, any>) => this.updateWithMatch(table, values, filters),
      }),

      delete: () => ({
        eq: (column: string, value: any) => this.delete(table, column, value),
        match: (filters: Record<string, any>) => this.deleteWithMatch(table, filters),
      }),
    };
  }

  private async insert<T extends TableName>(
    table: T,
    values: TableInsert<T> | TableInsert<T>[]
  ): Promise<{ data: TableRow<T>[] | null; error: any }> {
    return new Promise(resolve => {
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

        resolve({ data: recordsWithIds, error: null });
      } catch (error) {
        resolve({ data: null, error });
      }
    });
  }

  private async update<T extends TableName>(
    table: T,
    values: TableUpdate<T>,
    column: string,
    value: any
  ): Promise<{ data: TableRow<T>[] | null; error: any }> {
    return new Promise(resolve => {
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

        resolve({ data: updated, error: null });
      } catch (error) {
        resolve({ data: null, error });
      }
    });
  }

  private async updateWithMatch<T extends TableName>(
    table: T,
    values: TableUpdate<T>,
    filters: Record<string, any>
  ): Promise<{ data: TableRow<T>[] | null; error: any }> {
    return new Promise(resolve => {
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

        resolve({ data: updated, error: null });
      } catch (error) {
        resolve({ data: null, error });
      }
    });
  }

  private async delete<T extends TableName>(
    table: T,
    column: string,
    value: any
  ): Promise<{ data: null; error: any }> {
    return new Promise(resolve => {
      try {
        const key = STORAGE_KEYS[table as keyof typeof STORAGE_KEYS] || `cheforg_${table}`;
        const existingData = getFromStorage<TableRow<T>>(key);

        const filteredData = existingData.filter(item => (item as any)[column] !== value);
        saveToStorage(key, filteredData);

        resolve({ data: null, error: null });
      } catch (error) {
        resolve({ data: null, error });
      }
    });
  }

  private async deleteWithMatch<T extends TableName>(
    table: T,
    filters: Record<string, any>
  ): Promise<{ data: null; error: any }> {
    return new Promise(resolve => {
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

        resolve({ data: null, error: null });
      } catch (error) {
        resolve({ data: null, error });
      }
    });
  }

  // Auth methods
  auth = {
    signInWithPassword: async ({
      email,
      password: _password,
    }: {
      email: string;
      password: string;
    }) => {
      // Simple mock authentication
      const users = getFromStorage<any>(STORAGE_KEYS.users);
      const user = users.find((u: any) => u.email === email);

      if (!user) {
        return { data: null, error: { message: 'Usuário não encontrado' } };
      }

      // For testing, accept any password for demo purposes
      const authUser = {
        id: user.id,
        email: user.email,
        created_at: new Date().toISOString(),
      };

      // Save session
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

  // RPC methods
  rpc = (
    functionName: string,
    _params: Record<string, any>
  ): Promise<{ data: any; error: any }> => {
    return new Promise(resolve => {
      try {
        // Mock RPC responses for common functions
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
          resolve({ data: mockData, error: null });
        } else if (functionName === 'check_in_reservation') {
          // Mock successful check-in response
          resolve({ data: { pin: '123456' }, error: null });
        } else {
          resolve({
            data: null,
            error: { message: `RPC function ${functionName} not implemented` },
          });
        }
      } catch (error) {
        resolve({ data: null, error });
      }
    });
  };

  // Functions support for edge functions
  functions = {
    invoke: (functionName: string, _options?: { body?: any }) => {
      return new Promise(resolve => {
        try {
          // Mock function responses
          if (functionName === 'send-notification') {
            resolve({ data: { success: true, messageId: 'mock-123' }, error: null });
          } else {
            resolve({ data: null, error: { message: `Function ${functionName} not implemented` } });
          }
        } catch (error) {
          resolve({ data: null, error });
        }
      });
    },
  };
}

// Create and export the client instance
export const simpleLocalStorageClient = new SimpleLocalStorageClient();

// Export for backward compatibility
export const supabase = simpleLocalStorageClient;
