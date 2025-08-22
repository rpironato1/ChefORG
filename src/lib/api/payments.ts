// src/lib/api/payments.ts
import { supabase, Database } from '../supabase';
import { handleApiError, createSuccessResponse, ApiResponse } from './index';

type Payment = Database['public']['Tables']['payments']['Row'];
type PaymentInsert = Database['public']['Tables']['payments']['Insert'];
type PaymentMethod = Database['public']['Enums']['payment_method'];

/**
 * Inicia um processo de pagamento para um pedido. (Endpoint 6.6)
 * Cria um registro de pagamento com status 'pendente'.
 */
export const createPayment = async (
  orderId: number,
  method: PaymentMethod,
  amount: number
): Promise<ApiResponse<Payment>> => {
  try {
    const paymentData: PaymentInsert = {
      order_id: orderId,
      metodo: method,
      valor: amount,
      status: 'pendente', // O status inicial é sempre pendente
    };

    const insertResult = await supabase
      .from('payments')
      .insert(paymentData);

    if (insertResult.error) throw insertResult.error;

    // Get the created payment by reading back from storage
    const { data: allPayments, error } = await new Promise((resolve) => {
      const result = supabase.from('payments').select('*');
      if (result && typeof result.then === 'function') {
        result.then(resolve);
      } else {
        resolve({ data: [], error: null });
      }
    }) as { data: any[] | null; error: any };

    if (error) throw error;
    
    // Find the most recently created payment
    const data = allPayments?.[allPayments.length - 1];
    if (!data) throw new Error('Failed to create payment');

    // Para pagamentos manuais (dinheiro, cartao), a confirmação pode ser chamada em seguida.
    // Para pagamentos digitais, aguardaria um webhook.
    return createSuccessResponse(data, 'Registro de pagamento criado.');
  } catch (error) {
    return handleApiError(error, 'Falha ao iniciar o pagamento.');
  }
};

/**
 * Processa a confirmação de um pagamento. (Simula Endpoint 6.7 - Webhook)
 * Esta função chama um RPC no Supabase para garantir a atomicidade.
 */
export const confirmPayment = async (paymentId: number): Promise<ApiResponse<{ success: boolean }>> => {
  try {
    // Chama a função do banco de dados que executa a transação
    const result = await supabase.rpc('process_payment_confirmation', {
      p_payment_id: paymentId,
    }) as { error: any };

    if (result.error) throw result.error;

    return createSuccessResponse(
      { success: true },
      'Pagamento confirmado e processado com sucesso.'
    );
  } catch (error) {
    return handleApiError(error, 'Falha ao confirmar o pagamento.');
  }
};

/**
 * Busca os detalhes de um pagamento por ID do pedido.
 */
export const getPaymentByOrder = async (orderId: number): Promise<ApiResponse<Payment | null>> => {
  try {
    // Get all payments and filter in memory
    const { data: allPayments, error } = await new Promise((resolve) => {
      const result = supabase.from('payments').select('*');
      if (result && typeof result.then === 'function') {
        result.then(resolve);
      } else {
        resolve({ data: [], error: null });
      }
    }) as { data: any[] | null; error: any };
    
    if (error) throw error;

    // Filter by order_id and get the most recent
    const orderPayments = (allPayments || [])
      .filter(payment => payment.order_id === orderId)
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

    const data = orderPayments.length > 0 ? orderPayments[0] : null;

    return createSuccessResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Cria uma intenção de pagamento via Stripe.
 * Chama a Supabase Edge Function 'payment-intent'.
 */
export const createPaymentIntent = async (
  amount: number,
  orderId: number
): Promise<ApiResponse<{ clientSecret: string }>> => {
  try {
    const { data, error } = await supabase.functions.invoke('payment-intent', {
      body: { amount, orderId },
    }) as { data: any; error: any };

    if (error) throw error;
    if (data?.error) throw new Error(data.error);

    return createSuccessResponse(data);
  } catch (error) {
    return handleApiError(error, 'Falha ao criar a intenção de pagamento.');
  }
};