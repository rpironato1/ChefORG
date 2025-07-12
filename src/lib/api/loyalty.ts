// src/lib/api/loyalty.ts
import { supabase, Database } from '../supabase';
import { handleApiError, createSuccessResponse, ApiResponse } from './index';

type Loyalty = Database['public']['Tables']['loyalty']['Row'];
type User = Database['public']['Tables']['users']['Row'];

export type LoyaltyWithUser = Loyalty & {
    users: Pick<User, 'nome'> | null;
}

/**
 * Busca o ranking de clientes por pontos de fidelidade.
 */
export const getLoyaltyRanking = async (limit = 10): Promise<ApiResponse<LoyaltyWithUser[]>> => {
  try {
    const { data, error } = await supabase
      .from('loyalty')
      .select(`
        *,
        users ( nome )
      `)
      .order('pontos', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return createSuccessResponse(data as LoyaltyWithUser[]);
  } catch (error) {
    return handleApiError(error, 'Falha ao buscar ranking de fidelidade.');
  }
};
