import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MenuItem } from '../../../types';

// Estado para menu
interface MenuState {
  itens: MenuItem[];
  categorias: string[];
  loading: boolean;
  error: string | null;
  lastUpdated: number;

  // Actions
  addItem: (item: MenuItem) => void;
  updateItem: (id: string, data: Partial<MenuItem>) => void;
  removeItem: (id: string) => void;
  setItens: (itens: MenuItem[]) => void;
  setCategorias: (categorias: string[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearCache: () => void;

  // Selectors
  getItemById: (id: string) => MenuItem | undefined;
  getItemsByCategory: (categoria: string) => MenuItem[];
  getAvailableItems: () => MenuItem[];
  searchItems: (query: string) => MenuItem[];
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      itens: [],
      categorias: [],
      loading: false,
      error: null,
      lastUpdated: 0,

      addItem: item =>
        set(state => {
          const newCategorias = Array.from(new Set([...state.categorias, item.categoria]));
          return {
            itens: [...state.itens, item],
            categorias: newCategorias,
            lastUpdated: Date.now(),
          };
        }),

      updateItem: (id, data) =>
        set(state => ({
          itens: state.itens.map(i => (i.id === id ? { ...i, ...data } : i)),
          lastUpdated: Date.now(),
        })),

      removeItem: id =>
        set(state => ({
          itens: state.itens.filter(i => i.id !== id),
          lastUpdated: Date.now(),
        })),

      setItens: itens =>
        set({
          itens,
          categorias: Array.from(new Set(itens.map(i => i.categoria))),
          lastUpdated: Date.now(),
        }),

      setCategorias: categorias => set({ categorias }),
      setLoading: loading => set({ loading }),
      setError: error => set({ error }),
      clearCache: () => set({ itens: [], categorias: [], lastUpdated: 0 }),

      // Selectors
      getItemById: id => get().itens.find(i => i.id === id),

      getItemsByCategory: categoria => get().itens.filter(i => i.categoria === categoria),

      getAvailableItems: () => get().itens.filter(i => i.disponivel),

      searchItems: query => {
        const lowerQuery = query.toLowerCase();
        return get().itens.filter(
          i =>
            i.nome.toLowerCase().includes(lowerQuery) ||
            i.descricao.toLowerCase().includes(lowerQuery) ||
            (i.ingredientes && i.ingredientes.some(ing => ing.toLowerCase().includes(lowerQuery)))
        );
      },
    }),
    {
      name: 'cheforg-menu',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        itens: state.itens,
        categorias: state.categorias,
        lastUpdated: state.lastUpdated,
      }),
      // Cache por 10 minutos (dados menos voláteis)
      onRehydrateStorage: () => state => {
        if (state && Date.now() - state.lastUpdated > 10 * 60 * 1000) {
          state.clearCache();
        }
      },
    }
  )
);
