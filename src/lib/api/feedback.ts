// src/lib/api/feedback.ts
import { supabase, Database } from '../supabase';
import { handleApiError, createSuccessResponse, ApiResponse } from './index';

type Feedback = Database['public']['Tables']['feedback']['Row'];
type FeedbackInsert = Database['public']['Tables']['feedback']['Insert'];

/**
 * Cria um novo registro de feedback para um pedido. (Endpoint 6.9)
 */
export const createFeedback = async (
  details: Omit<FeedbackInsert, 'id' | 'created_at'>
): Promise<ApiResponse<Feedback>> => {
  try {
    // Validação para garantir que o pedido não foi avaliado ainda
    const { data: existingFeedback, error: existingError } = await supabase
      .from('feedback')
      .select('id')
      .eq('order_id', details.order_id)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      throw existingError;
    }
    if (existingFeedback) {
      return handleApiError(new Error('Este pedido já foi avaliado.'));
    }

    // Inserir o novo feedback
    const { data, error } = await supabase
      .from('feedback')
      .insert(details)
      .select()
      .single();

    if (error) throw error;

    // Idealmente, um trigger no DB calcularia a média e adicionaria pontos de fidelidade.
    // Ex: PERFORM on_new_feedback(data.id);

    return createSuccessResponse(data, 'Obrigado pelo seu feedback!');
  } catch (error) {
    return handleApiError(error, 'Não foi possível registrar o feedback.');
  }
};

/**
 * Busca o feedback associado a um pedido específico.
 */
export const getFeedbackByOrder = async (orderId: number): Promise<ApiResponse<Feedback | null>> => {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('order_id', orderId)
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
 * Busca os feedbacks mais recentes para o painel do gerente.
 */
export const getRecentFeedbacks = async (limit = 10): Promise<ApiResponse<Feedback[]>> => {
    try {
        const { data, error } = await supabase
            .from('feedback')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return createSuccessResponse(data);
    } catch (error) {
        return handleApiError(error);
    }
};