import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Pedido, PedidoItem } from '../../../types';

// Estado para pedidos
interface OrdersState {
  pedidos: Pedido[];
  carrinhoAtual: Pedido | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number;

  // Actions
  addPedido: (pedido: Pedido) => void;
  updatePedido: (id: string, data: Partial<Pedido>) => void;
  removePedido: (id: string) => void;
  setPedidos: (pedidos: Pedido[]) => void;
  setCarrinhoAtual: (pedido: Pedido | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearCache: () => void;

  // Cart actions
  addItemToCart: (item: Omit<PedidoItem, 'id'>) => void;
  removeItemFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantidade: number) => void;
  clearCart: () => void;

  // Selectors
  getPedidoById: (id: string) => Pedido | undefined;
  getPedidosByStatus: (status: Pedido['status']) => Pedido[];
  getPedidosByMesa: (mesaId: string) => Pedido[];
  getActiveOrders: () => Pedido[];
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      pedidos: [],
      carrinhoAtual: null,
      loading: false,
      error: null,
      lastUpdated: 0,

      addPedido: pedido =>
        set(state => ({
          pedidos: [...state.pedidos, pedido],
          lastUpdated: Date.now(),
        })),

      updatePedido: (id, data) =>
        set(state => ({
          pedidos: state.pedidos.map(p => (p.id === id ? { ...p, ...data } : p)),
          carrinhoAtual:
            state.carrinhoAtual?.id === id
              ? { ...state.carrinhoAtual, ...data }
              : state.carrinhoAtual,
          lastUpdated: Date.now(),
        })),

      removePedido: id =>
        set(state => ({
          pedidos: state.pedidos.filter(p => p.id !== id),
          carrinhoAtual: state.carrinhoAtual?.id === id ? null : state.carrinhoAtual,
          lastUpdated: Date.now(),
        })),

      setPedidos: pedidos =>
        set({
          pedidos,
          lastUpdated: Date.now(),
        }),

      setCarrinhoAtual: pedido => set({ carrinhoAtual: pedido }),
      setLoading: loading => set({ loading }),
      setError: error => set({ error }),
      clearCache: () => set({ pedidos: [], carrinhoAtual: null, lastUpdated: 0 }),

      // Cart actions
      addItemToCart: item =>
        set(state => {
          if (!state.carrinhoAtual) return state;

          const novoItem: PedidoItem = {
            ...item,
            id: `ITEM-${Date.now()}`,
            status: 'pendente',
          };

          return {
            carrinhoAtual: {
              ...state.carrinhoAtual,
              itens: [...state.carrinhoAtual.itens, novoItem],
              total: state.carrinhoAtual.total + item.preco * item.quantidade,
            },
          };
        }),

      removeItemFromCart: itemId =>
        set(state => {
          if (!state.carrinhoAtual) return state;

          const item = state.carrinhoAtual.itens.find(i => i.id === itemId);
          if (!item) return state;

          return {
            carrinhoAtual: {
              ...state.carrinhoAtual,
              itens: state.carrinhoAtual.itens.filter(i => i.id !== itemId),
              total: state.carrinhoAtual.total - item.preco * item.quantidade,
            },
          };
        }),

      updateCartItemQuantity: (itemId, quantidade) =>
        set(state => {
          if (!state.carrinhoAtual) return state;

          const item = state.carrinhoAtual.itens.find(i => i.id === itemId);
          if (!item) return state;

          const diferencaPreco = (quantidade - item.quantidade) * item.preco;

          return {
            carrinhoAtual: {
              ...state.carrinhoAtual,
              itens: state.carrinhoAtual.itens.map(i =>
                i.id === itemId ? { ...i, quantidade } : i
              ),
              total: state.carrinhoAtual.total + diferencaPreco,
            },
          };
        }),

      clearCart: () =>
        set(state => ({
          carrinhoAtual: state.carrinhoAtual
            ? {
                ...state.carrinhoAtual,
                itens: [],
                total: 0,
              }
            : null,
        })),

      // Selectors
      getPedidoById: id => get().pedidos.find(p => p.id === id),

      getPedidosByStatus: status => get().pedidos.filter(p => p.status === status),

      getPedidosByMesa: mesaId => get().pedidos.filter(p => p.mesaId === mesaId),

      getActiveOrders: () =>
        get().pedidos.filter(p => ['confirmado', 'preparando', 'pronto'].includes(p.status)),
    }),
    {
      name: 'cheforg-orders',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        pedidos: state.pedidos,
        carrinhoAtual: state.carrinhoAtual,
        lastUpdated: state.lastUpdated,
      }),
      // Cache por 1 minuto (dados muito voláteis)
      onRehydrateStorage: () => state => {
        if (state && Date.now() - state.lastUpdated > 1 * 60 * 1000) {
          // Manter carrinho mas limpar pedidos antigos
          state.pedidos = [];
          state.lastUpdated = Date.now();
        }
      },
    }
  )
);
