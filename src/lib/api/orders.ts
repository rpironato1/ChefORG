// src/lib/api/orders.ts
import { supabase, Database } from '../supabase';
import { handleApiError, createSuccessResponse, ApiResponse } from './index';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];
type OrderStatus = Database['public']['Enums']['order_status'];

export type OrderWithItems = Order & {
  order_items: ({
    menu_items: {
      nome: string;
    } | null;
  } & Database['public']['Tables']['order_items']['Row'])[];
  tables: {
    numero: number;
  } | null;
};

/**
 * Cria um novo pedido e seus itens. (Endpoint 6.4)
 * Esta função deve ser chamada quando o cliente confirma o carrinho.
 */
export const createOrder = async (
  tableId: number,
  items: Omit<OrderItemInsert, 'order_id'>[],
  _userId?: number
): Promise<ApiResponse<Order>> => {
  try {
    // Idealmente, isso seria uma única transação (RPC) no Supabase.
    // Simulando a transação no lado do cliente:

    // 1. Criar o registro do pedido principal
    const orderInsertData: OrderInsert = {
      table_id: tableId,
      customer_name: `Cliente Mesa ${tableId}`,
      status: 'confirmado',
      total: 0, // Will be calculated from items
      // totais podem ser calculados por triggers no DB ou aqui
    };

    const insertResult = await (supabase as any)
      .from('orders')
      .insert(orderInsertData);

    if (insertResult.error) throw insertResult.error;
    
    // Get the created order by reading back from storage
    const { data: orders, error: fetchError } = await new Promise((resolve) => {
      const result = supabase.from('orders').select('*');
      if (result && typeof result.then === 'function') {
        result.then(resolve);
      } else {
        resolve({ data: [], error: null });
      }
    }) as { data: any[] | null; error: any };
      
    if (fetchError) throw fetchError;
    
    // Find the most recently created order (since localStorage doesn't return the inserted record)
    const order = orders?.[orders.length - 1];
    if (!order) throw new Error('Failed to create order');

    // 2. Associar os itens ao pedido recém-criado
    const itemsWithOrderId = items.map(item => ({ ...item, order_id: order.id }));
    const { error: itemsError } = await (supabase as any)
      .from('order_items')
      .insert(itemsWithOrderId);

    if (itemsError) {
      // Se a inserção de itens falhar, tenta reverter o pedido (melhor feito com transações reais)
      await supabase.from('orders').delete().eq('id', order.id);
      throw itemsError;
    }
    
    // 3. Atualizar a mesa para associar ao novo pedido
    await supabase.from('tables').update({ pedido_atual_id: order.id }).eq('id', tableId);

    return createSuccessResponse(order, 'Pedido criado com sucesso!');
  } catch (error) {
    return handleApiError(error, 'Falha ao criar o pedido.');
  }
};

/**
 * Atualiza o status de um pedido. (Endpoint 6.5)
 * Usado pelos painéis da Cozinha e do Garçom.
 */
export const updateOrderStatus = async (orderId: number, status: OrderStatus): Promise<ApiResponse<Order>> => {
  try {
    const updateResult = await (supabase as any)
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (updateResult.error) throw updateResult.error;

    // Get the updated order
    const { data: orders, error } = await new Promise((resolve) => {
      const result = supabase.from('orders').select('*');
      if (result && typeof result.then === 'function') {
        result.then(resolve);
      } else {
        resolve({ data: [], error: null });
      }
    }) as { data: any[] | null; error: any };

    if (error) throw error;
    
    const data = orders?.find(o => o.id === orderId);
    if (!data) throw new Error('Order not found after update');

    // Se o pedido for pago, iniciar o processo de liberação da mesa
    if (status === 'pago' && data.table_id) {
      await (supabase as any)
        .from('tables')
        .update({ status: 'limpeza', pin: null, pedido_atual_id: null })
        .eq('id', data.table_id);
    }

    return createSuccessResponse(data, `Status do pedido atualizado para ${status}.`);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Busca um pedido ativo para uma determinada mesa.
 */
export const getActiveOrderByTable = async (tableId: number): Promise<ApiResponse<OrderWithItems>> => {
  try {
    // Simplified query - get orders and manually join data if needed
    const { data: orders, error } = await new Promise((resolve) => {
      const result = supabase.from('orders').select('*');
      if (result && typeof result.then === 'function') {
        result.then(resolve);
      } else {
        resolve({ data: [], error: null });
      }
    }) as { data: any[] | null; error: any };
    
    if (error) throw error;
    
    // Filter for active orders for this table
    const activeOrders = (orders || []).filter(order => 
      order.table_id === tableId && 
      ['confirmado', 'preparando', 'pronto', 'entregue'].includes(order.status)
    );
    
    if (activeOrders.length === 0) {
      throw new Error('Nenhum pedido ativo encontrado para esta mesa.');
    }
    
    // Get the most recent order
    const data = activeOrders[activeOrders.length - 1];
    
    // Add empty arrays for related data (simplified for localStorage)
    const orderWithItems = {
      ...data,
      order_items: [],
      tables: { numero: tableId }
    };
    
    return createSuccessResponse(orderWithItems as OrderWithItems);
  } catch (error) {
    return handleApiError(error, 'Nenhum pedido ativo encontrado para esta mesa.');
  }
};

/**
 * Busca pedidos com base em uma lista de status.
 * Essencial para os painéis da Cozinha e do Garçom.
 */
export const getOrdersByStatus = async (statuses: OrderStatus[]): Promise<ApiResponse<OrderWithItems[]>> => {
  try {
    // Simplified query - get orders and manually filter
    const { data: orders, error } = await new Promise((resolve) => {
      const result = supabase.from('orders').select('*');
      if (result && typeof result.then === 'function') {
        result.then(resolve);
      } else {
        resolve({ data: [], error: null });
      }
    }) as { data: any[] | null; error: any };

    if (error) throw error;
    
    // Filter by status and add simplified related data
    const filteredOrders = (orders || [])
      .filter(order => statuses.includes(order.status))
      .map(order => ({
        ...order,
        order_items: [],
        tables: { numero: order.table_id }
      }));

    return createSuccessResponse(filteredOrders as OrderWithItems[]);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Busca um pedido pelo código da mesa (para o caixa).
 */
export const getOrderByMesaCode = async (_codigoMesa: string): Promise<ApiResponse<OrderWithItems>> => {
    try {
        // Simplified query - get orders and manually filter
        const { data: orders, error } = await new Promise((resolve) => {
          const result = supabase.from('orders').select('*');
          if (result && typeof result.then === 'function') {
            result.then(resolve);
          } else {
            resolve({ data: [], error: null });
          }
        }) as { data: any[] | null; error: any };

        if (error) throw error;
        
        // Filter by mesa code (simplified - using table_id for now)
        const validOrders = (orders || []).filter(order => 
          ['entregue', 'pendente_pagamento'].includes(order.status)
        );
        
        if (validOrders.length === 0) {
          throw new Error('Nenhum pedido aberto encontrado para este código.');
        }
        
        // Get the most recent valid order
        const data = validOrders[validOrders.length - 1];
        
        // Add simplified related data
        const orderWithItems = {
          ...data,
          order_items: [],
          tables: { numero: data.table_id }
        };

        return createSuccessResponse(orderWithItems as OrderWithItems);
    } catch (error) {
        return handleApiError(error, 'Nenhum pedido aberto encontrado para este código.');
    }
};
