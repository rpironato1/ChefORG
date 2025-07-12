// src/lib/api/stock.ts
import { supabase, Database } from '../supabase';
import { handleApiError, createSuccessResponse, ApiResponse } from './index';

type StockItem = Database['public']['Tables']['stock']['Row'];

/**
 * Busca todos os itens do estoque.
 */
export const getStockItems = async (lowStockThreshold = 10): Promise<ApiResponse<{items: StockItem[], lowStockCount: number}>> => {
  try {
    const { data, error } = await supabase
      .from('stock')
      .select('*')
      .order('quantidade', { ascending: true });

    if (error) throw error;

    const lowStockCount = data.filter(item => item.quantidade <= lowStockThreshold).length;

    return createSuccessResponse({ items: data, lowStockCount });
  } catch (error) {
    return handleApiError(error, 'Falha ao buscar itens do estoque.');
  }
};
