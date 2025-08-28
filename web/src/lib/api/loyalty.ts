// src/lib/api/loyalty.ts
import { supabase, Database } from '../supabase';
import { handleApiError, createSuccessResponse, ApiResponse } from './index';

type Loyalty = Database['public']['Tables']['loyalty']['Row'];
type User = Database['public']['Tables']['users']['Row'];

export type LoyaltyWithUser = Loyalty & {
  users: Pick<User, 'nome'> | null;
};

/**
 * Busca o ranking de clientes por pontos de fidelidade.
 */
export const getLoyaltyRanking = async (limit = 10): Promise<ApiResponse<LoyaltyWithUser[]>> => {
  try {
    // Get loyalty data and users separately, then join in memory
    const loyaltyPromise = new Promise(resolve => {
      const result = supabase.from('loyalty').select('*');
      if (result && typeof result.then === 'function') {
        result.then(resolve);
      } else {
        resolve({ data: [], error: null });
      }
    }) as Promise<{ data: any[] | null; error: any }>;

    const usersPromise = new Promise(resolve => {
      const result = supabase.from('users').select('*');
      if (result && typeof result.then === 'function') {
        result.then(resolve);
      } else {
        resolve({ data: [], error: null });
      }
    }) as Promise<{ data: any[] | null; error: any }>;

    const [loyaltyResult, usersResult] = await Promise.all([loyaltyPromise, usersPromise]);

    if (loyaltyResult.error) throw loyaltyResult.error;
    if (usersResult.error) throw usersResult.error;

    // Join data in memory
    const loyaltyWithUsers = (loyaltyResult.data || [])
      .map(loyalty => ({
        ...loyalty,
        users: usersResult.data?.find(user => user.id === loyalty.user_id) || {
          nome: 'Usuário Desconhecido',
        },
      }))
      .sort((a, b) => b.pontos - a.pontos)
      .slice(0, limit);

    return createSuccessResponse(loyaltyWithUsers as LoyaltyWithUser[]);
  } catch (error) {
    return handleApiError(error, 'Falha ao buscar ranking de fidelidade.');
  }
};
