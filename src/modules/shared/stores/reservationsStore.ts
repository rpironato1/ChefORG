import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Reserva, Mesa } from '../../../types';

// Estado para reservas
interface ReservationsState {
  reservas: Reserva[];
  loading: boolean;
  error: string | null;
  lastUpdated: number;
  
  // Actions
  addReserva: (reserva: Reserva) => void;
  updateReserva: (id: string, data: Partial<Reserva>) => void;
  removeReserva: (id: string) => void;
  setReservas: (reservas: Reserva[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearCache: () => void;
  
  // Selectors
  getReservaById: (id: string) => Reserva | undefined;
  getReservasByStatus: (status: Reserva['status']) => Reserva[];
  getReservasByDate: (date: Date) => Reserva[];
}

// Store de reservas com persistência
export const useReservationsStore = create<ReservationsState>()(
  persist(
    (set, get) => ({
      reservas: [],
      loading: false,
      error: null,
      lastUpdated: 0,

      addReserva: (reserva) => 
        set((state) => ({
          reservas: [...state.reservas, reserva],
          lastUpdated: Date.now()
        })),

      updateReserva: (id, data) =>
        set((state) => ({
          reservas: state.reservas.map(r => 
            r.id === id ? { ...r, ...data } : r
          ),
          lastUpdated: Date.now()
        })),

      removeReserva: (id) =>
        set((state) => ({
          reservas: state.reservas.filter(r => r.id !== id),
          lastUpdated: Date.now()
        })),

      setReservas: (reservas) =>
        set({
          reservas,
          lastUpdated: Date.now()
        }),

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearCache: () => set({ reservas: [], lastUpdated: 0 }),

      // Selectors
      getReservaById: (id) => get().reservas.find(r => r.id === id),
      
      getReservasByStatus: (status) => 
        get().reservas.filter(r => r.status === status),
      
      getReservasByDate: (date) =>
        get().reservas.filter(r => 
          r.dataHora.toDateString() === date.toDateString()
        )
    }),
    {
      name: 'cheforg-reservations',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        reservas: state.reservas,
        lastUpdated: state.lastUpdated
      }),
      // Cache por 5 minutos
      onRehydrateStorage: () => (state) => {
        if (state && Date.now() - state.lastUpdated > 5 * 60 * 1000) {
          state.clearCache();
        }
      }
    }
  )
);

// Estado para mesas
interface TablesState {
  mesas: Mesa[];
  loading: boolean;
  error: string | null;
  lastUpdated: number;
  
  // Actions
  addMesa: (mesa: Mesa) => void;
  updateMesa: (id: string, data: Partial<Mesa>) => void;
  removeMesa: (id: string) => void;
  setMesas: (mesas: Mesa[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearCache: () => void;
  
  // Selectors
  getMesaById: (id: string) => Mesa | undefined;
  getMesasByStatus: (status: Mesa['status']) => Mesa[];
  getAvailableTables: (capacidade?: number) => Mesa[];
}

// Store de mesas com persistência
export const useTablesStore = create<TablesState>()(
  persist(
    (set, get) => ({
      mesas: [],
      loading: false,
      error: null,
      lastUpdated: 0,

      addMesa: (mesa) =>
        set((state) => ({
          mesas: [...state.mesas, mesa],
          lastUpdated: Date.now()
        })),

      updateMesa: (id, data) =>
        set((state) => ({
          mesas: state.mesas.map(m => 
            m.id === id ? { ...m, ...data } : m
          ),
          lastUpdated: Date.now()
        })),

      removeMesa: (id) =>
        set((state) => ({
          mesas: state.mesas.filter(m => m.id !== id),
          lastUpdated: Date.now()
        })),

      setMesas: (mesas) =>
        set({
          mesas,
          lastUpdated: Date.now()
        }),

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearCache: () => set({ mesas: [], lastUpdated: 0 }),

      // Selectors
      getMesaById: (id) => get().mesas.find(m => m.id === id),
      
      getMesasByStatus: (status) =>
        get().mesas.filter(m => m.status === status),
      
      getAvailableTables: (capacidade) => {
        const mesas = get().mesas.filter(m => m.status === 'livre');
        return capacidade 
          ? mesas.filter(m => m.capacidade >= capacidade)
          : mesas;
      }
    }),
    {
      name: 'cheforg-tables',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        mesas: state.mesas,
        lastUpdated: state.lastUpdated
      }),
      // Cache por 2 minutos (dados mais voláteis)
      onRehydrateStorage: () => (state) => {
        if (state && Date.now() - state.lastUpdated > 2 * 60 * 1000) {
          state.clearCache();
        }
      }
    }
  )
);