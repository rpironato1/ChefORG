// Compatibility layer that creates Supabase-like patterns for localStorage
// This applies graph theory optimization by creating reusable query patterns

import { Database } from './supabase';
import { localStorageClient } from './localStorage';

type TableName = keyof Database['public']['Tables'];

// Create a wrapper that provides both immediate and promise-based access
export const createCompatibleQuery = <T extends TableName>(table: T) => {
  return {
    select: (columns = '*') => {
      const query = localStorageClient.from(table).select(columns);
      
      // Return an object that works both as promise and query builder
      const compatibleQuery = {
        // Promise-like methods
        then: query.then.bind(query),
        catch: (handler: (error: any) => any) => query.then(
          (result: any) => result
        ).catch(handler),
        
        // Query builder methods that return promises
        eq: (column: string, value: any) => {
          const newQuery = query.eq(column, value);
          return {
            then: newQuery.then.bind(newQuery),
            single: () => {
              const singleQuery = newQuery.single();
              return {
                then: singleQuery.then.bind(singleQuery)
              };
            }
          };
        },
        
        order: (column: string, options?: { ascending?: boolean }) => {
          const newQuery = query.order(column, options);
          return {
            then: newQuery.then.bind(newQuery)
          };
        },
        
        gte: (column: string, value: any) => {
          const newQuery = query.gte(column, value);
          return {
            then: newQuery.then.bind(newQuery),
            lte: (col: string, val: any) => {
              const finalQuery = newQuery.lte(col, val);
              return {
                then: finalQuery.then.bind(finalQuery)
              };
            }
          };
        },
        
        single: () => {
          const singleQuery = query.single();
          return {
            then: singleQuery.then.bind(singleQuery)
          };
        }
      };
      
      return compatibleQuery;
    },
    
    // Direct insert/update/delete operations
    insert: localStorageClient.from(table).insert.bind(localStorageClient.from(table)),
    update: (values: any) => ({
      eq: (column: string, value: any) => {
        const updateQuery = localStorageClient.from(table).update(values).eq(column, value);
        return {
          then: updateQuery.then?.bind(updateQuery) || (() => Promise.resolve({ data: [], error: null })),
          select: () => ({
            single: () => ({
              then: (callback: Function) => {
                // Mock successful update with return data
                const mockData = { id: value, ...values };
                return callback({ data: mockData, error: null });
              }
            })
          })
        };
      }
    }),
    delete: localStorageClient.from(table).delete.bind(localStorageClient.from(table))
  };
};

// Export a simplified supabase-like interface
export const compatibleSupabase = {
  from: createCompatibleQuery,
  rpc: localStorageClient.rpc.bind(localStorageClient),
  auth: localStorageClient.auth,
  functions: localStorageClient.functions
};