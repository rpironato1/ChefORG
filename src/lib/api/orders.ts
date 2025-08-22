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
  userId?: number
): Promise<ApiResponse<Order>> => {
  try {
    // Idealmente, isso seria uma única transação (RPC) no Supabase.
    // Simulando a transação no lado do cliente:

    // 1. Criar o registro do pedido principal
    const orderInsertData = {
      table_id: tableId,
      status: 'confirmado',
      customer_name: 'Cliente',
      total: 0
      // totais podem ser calculados por triggers no DB ou aqui
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderInsertData)
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Associar os itens ao pedido recém-criado
    const itemsWithOrderId = items.map(item => ({ ...item, order_id: order.id }));
    const { error: itemsError } = await supabase
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
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    // Se o pedido for pago, iniciar o processo de liberação da mesa
    if (status === 'pago' && data.table_id) {
      await supabase
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
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        tables (numero),
        order_items ( *, menu_items (nome) )
      `)
      .eq('table_id', tableId)
      .in('status', ['confirmado', 'preparando', 'pronto', 'entregue'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) throw error;
    return createSuccessResponse(data as OrderWithItems);
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
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        tables (numero),
        order_items ( *, menu_items (nome) )
      `)
      .in('status', statuses)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return createSuccessResponse(data as OrderWithItems[]);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Busca um pedido pelo código da mesa (para o caixa).
 */
export const getOrderByMesaCode = async (codigoMesa: string): Promise<ApiResponse<OrderWithItems>> => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                tables (numero),
                order_items ( *, menu_items (nome) )
            `)
            .eq('codigo_mesa', codigoMesa)
            .in('status', ['entregue', 'pendente_pagamento']) // Status que permitem pagamento
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error) throw error;
        return createSuccessResponse(data as OrderWithItems);
    } catch (error) {
        return handleApiError(error, 'Nenhum pedido aberto encontrado para este código.');
    }
};
