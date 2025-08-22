import { useState, useCallback } from 'react';
import { Pedido, PedidoItem, MenuItem } from '../../../types';

// Hook principal para CRUD de pedidos
export const useOrders = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const criarPedido = useCallback((dados: Omit<Pedido, 'id' | 'status' | 'dataHora'>): Pedido => {
    const novoPedido: Pedido = {
      ...dados,
      id: `PED-${Date.now()}`,
      status: 'carrinho',
      dataHora: new Date()
    };
    
    setPedidos(prev => [...prev, novoPedido]);
    return novoPedido;
  }, []);

  const buscarPedido = useCallback((id: string): Pedido | undefined => {
    return pedidos.find(p => p.id === id);
  }, [pedidos]);

  const adicionarItem = useCallback((pedidoId: string, item: Omit<PedidoItem, 'id'>): boolean => {
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido || !['carrinho', 'confirmado'].includes(pedido.status)) return false;
    
    const novoItem: PedidoItem = {
      ...item,
      id: `ITEM-${Date.now()}`,
      status: 'pendente'
    };
    
    setPedidos(prev => prev.map(p => 
      p.id === pedidoId ? { 
        ...p, 
        itens: [...p.itens, novoItem],
        total: p.total + (item.preco * item.quantidade)
      } : p
    ));
    
    return true;
  }, [pedidos]);

  const removerItem = useCallback((pedidoId: string, itemId: string): boolean => {
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido || !['carrinho', 'confirmado'].includes(pedido.status)) return false;
    
    const item = pedido.itens.find(i => i.id === itemId);
    if (!item) return false;
    
    setPedidos(prev => prev.map(p => 
      p.id === pedidoId ? {
        ...p,
        itens: p.itens.filter(i => i.id !== itemId),
        total: p.total - (item.preco * item.quantidade)
      } : p
    ));
    
    return true;
  }, [pedidos]);

  const atualizarQuantidade = useCallback((pedidoId: string, itemId: string, quantidade: number): boolean => {
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido || !['carrinho', 'confirmado'].includes(pedido.status)) return false;
    
    const item = pedido.itens.find(i => i.id === itemId);
    if (!item) return false;
    
    const diferencaPreco = (quantidade - item.quantidade) * item.preco;
    
    setPedidos(prev => prev.map(p => 
      p.id === pedidoId ? {
        ...p,
        itens: p.itens.map(i => 
          i.id === itemId ? { ...i, quantidade } : i
        ),
        total: p.total + diferencaPreco
      } : p
    ));
    
    return true;
  }, [pedidos]);

  const confirmarPedido = useCallback((pedidoId: string): boolean => {
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido || pedido.status !== 'carrinho') return false;
    
    setPedidos(prev => prev.map(p => 
      p.id === pedidoId ? { ...p, status: 'confirmado' } : p
    ));
    
    return true;
  }, [pedidos]);

  const cancelarPedido = useCallback((pedidoId: string): boolean => {
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido || !['carrinho', 'confirmado'].includes(pedido.status)) return false;
    
    setPedidos(prev => prev.filter(p => p.id !== pedidoId));
    return true;
  }, [pedidos]);

  return {
    pedidos,
    criarPedido,
    buscarPedido,
    adicionarItem,
    removerItem,
    atualizarQuantidade,
    confirmarPedido,
    cancelarPedido
  };
};

// Hook para gerenciar status de pedidos
export const useOrderStatus = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const atualizarStatus = useCallback((pedidoId: string, novoStatus: Pedido['status']): boolean => {
    setPedidos(prev => prev.map(p => 
      p.id === pedidoId ? { ...p, status: novoStatus } : p
    ));
    return true;
  }, []);

  const atualizarStatusItem = useCallback((pedidoId: string, itemId: string, novoStatus: PedidoItem['status']): boolean => {
    setPedidos(prev => prev.map(p => 
      p.id === pedidoId ? {
        ...p,
        itens: p.itens.map(i => 
          i.id === itemId ? { ...i, status: novoStatus } : i
        )
      } : p
    ));
    return true;
  }, []);

  const obterStatusPedido = useCallback((pedidoId: string): Pedido['status'] | null => {
    const pedido = pedidos.find(p => p.id === pedidoId);
    return pedido ? pedido.status : null;
  }, [pedidos]);

  return {
    atualizarStatus,
    atualizarStatusItem,
    obterStatusPedido
  };
};

// Hook para calcular tempo estimado
export const useEstimatedTime = () => {
  const calcularTempoEstimado = useCallback((pedido: Pedido, itensMenu: MenuItem[]): number => {
    if (!pedido.itens.length) return 0;
    
    const temposPorItem = pedido.itens.map(item => {
      const menuItem = itensMenu.find(m => m.id === item.menuItemId);
      return menuItem ? menuItem.tempo_preparo * item.quantidade : 10;
    });
    
    // Tempo máximo (considerando preparo paralelo)
    const tempoMaximo = Math.max(...temposPorItem);
    
    // Adicionar 5 minutos de margem
    return tempoMaximo + 5;
  }, []);

  const atualizarTempoEstimado = useCallback((_pedidoId: string, _novoTempo: number): boolean => {
    // Implementar lógica para atualizar tempo estimado
    return true;
  }, []);

  return {
    calcularTempoEstimado,
    atualizarTempoEstimado
  };
};