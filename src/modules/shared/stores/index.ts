// Exports for Zustand stores - Optimized state management for Sprint 3

export { useReservationsStore, useTablesStore } from './reservationsStore';
export { useMenuStore } from './menuStore';
export { useOrdersStore } from './ordersStore';

// Store utilities - using dynamic imports to avoid circular dependencies
export const clearAllCaches = async () => {
  const { useReservationsStore, useTablesStore } = await import('./reservationsStore');
  const { useMenuStore } = await import('./menuStore');
  const { useOrdersStore } = await import('./ordersStore');
  
  useReservationsStore.getState().clearCache();
  useTablesStore.getState().clearCache();
  useMenuStore.getState().clearCache();
  useOrdersStore.getState().clearCache();
};

// Cache management utilities
export const getCacheStatus = async () => {
  const { useReservationsStore, useTablesStore } = await import('./reservationsStore');
  const { useMenuStore } = await import('./menuStore');
  const { useOrdersStore } = await import('./ordersStore');
  
  const now = Date.now();
  const reservationsAge = now - useReservationsStore.getState().lastUpdated;
  const tablesAge = now - useTablesStore.getState().lastUpdated;
  const menuAge = now - useMenuStore.getState().lastUpdated;
  const ordersAge = now - useOrdersStore.getState().lastUpdated;

  return {
    reservations: {
      lastUpdated: useReservationsStore.getState().lastUpdated,
      ageMinutes: Math.floor(reservationsAge / (1000 * 60)),
      isStale: reservationsAge > 5 * 60 * 1000 // 5 minutes
    },
    tables: {
      lastUpdated: useTablesStore.getState().lastUpdated,
      ageMinutes: Math.floor(tablesAge / (1000 * 60)),
      isStale: tablesAge > 2 * 60 * 1000 // 2 minutes
    },
    menu: {
      lastUpdated: useMenuStore.getState().lastUpdated,
      ageMinutes: Math.floor(menuAge / (1000 * 60)),
      isStale: menuAge > 10 * 60 * 1000 // 10 minutes
    },
    orders: {
      lastUpdated: useOrdersStore.getState().lastUpdated,
      ageMinutes: Math.floor(ordersAge / (1000 * 60)),
      isStale: ordersAge > 1 * 60 * 1000 // 1 minute
    }
  };
};