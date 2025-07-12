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

    const { data, error } = await supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single();

    if (error) throw error;

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
    const { error } = await supabase.rpc('process_payment_confirmation', {
      p_payment_id: paymentId,
    });

    if (error) throw error;

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
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
    }

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
    });

    if (error) throw error;
    if (data.error) throw new Error(data.error);

    return createSuccessResponse(data);
  } catch (error) {
    return handleApiError(error, 'Falha ao criar a intenção de pagamento.');
  }
};