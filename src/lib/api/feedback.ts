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
    const existingQuery = supabase
      .from('feedback')
      .select('id')
      .eq('order_id', details.order_id)
      .single();

    const { data: existingFeedback, error: existingError } = (await existingQuery) as any;

    if (existingError && existingError.code !== 'PGRST116') {
      throw existingError;
    }
    if (existingFeedback) {
      return handleApiError(new Error('Este pedido já foi avaliado.'));
    }

    // Inserir o novo feedback
    const insertResult = await (supabase as any).from('feedback').insert(details);

    if (insertResult.error) throw insertResult.error;

    // Get the created feedback by reading back from storage
    const { data: allFeedback, error } = (await new Promise(resolve => {
      const result = supabase.from('feedback').select('*');
      if (result && typeof result.then === 'function') {
        result.then(resolve);
      } else {
        resolve({ data: [], error: null });
      }
    })) as { data: any[] | null; error: any };

    if (error) throw error;

    // Find the most recently created feedback
    const data = allFeedback?.[allFeedback.length - 1];
    if (!data) throw new Error('Failed to create feedback');

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
export const getFeedbackByOrder = async (
  orderId: number
): Promise<ApiResponse<Feedback | null>> => {
  try {
    const feedbackQuery = supabase
      .from('feedback')
      .select('*')
      .eq('order_id', orderId)
      .single();

    const { data, error } = (await feedbackQuery) as any;

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found
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
    // Get all feedback and sort/limit in memory
    const { data: allFeedback, error } = (await new Promise(resolve => {
      const result = supabase.from('feedback').select('*');
      if (result && typeof result.then === 'function') {
        result.then(resolve);
      } else {
        resolve({ data: [], error: null });
      }
    })) as { data: any[] | null; error: any };

    if (error) throw error;

    // Sort by created_at descending and limit
    const sortedData = (allFeedback || [])
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      .slice(0, limit);

    return createSuccessResponse(sortedData);
  } catch (error) {
    return handleApiError(error);
  }
};
