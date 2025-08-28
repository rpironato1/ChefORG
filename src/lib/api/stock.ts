// src/lib/api/stock.ts - Stock management API
import { handleApiError, createSuccessResponse, ApiResponse } from './index';

// Temporary stock item type for localStorage implementation
type StockItem = {
  id: number;
  nome: string;
  quantidade: number;
  unidade: string;
  valor_unitario: number;
  categoria: string;
  fornecedor?: string;
  data_validade?: string;
  created_at?: string;
  updated_at?: string;
};

/**
 * Busca todos os itens do estoque.
 * Note: Using placeholder data since stock table is not in main database schema
 */
export const getStockItems = async (
  lowStockThreshold = 10
): Promise<ApiResponse<{ items: StockItem[]; lowStockCount: number }>> => {
  try {
    // Placeholder implementation for stock management
    const mockStockData: StockItem[] = [
      {
        id: 1,
        nome: 'Tomate',
        quantidade: 50,
        unidade: 'kg',
        valor_unitario: 4.5,
        categoria: 'Vegetais',
      },
      {
        id: 2,
        nome: 'Carne Bovina',
        quantidade: 5,
        unidade: 'kg',
        valor_unitario: 32.0,
        categoria: 'Carnes',
      },
      {
        id: 3,
        nome: 'Queijo Mussarela',
        quantidade: 8,
        unidade: 'kg',
        valor_unitario: 28.0,
        categoria: 'Laticínios',
      },
    ];

    const lowStockCount = mockStockData.filter(item => item.quantidade <= lowStockThreshold).length;

    return createSuccessResponse({ items: mockStockData, lowStockCount });
  } catch (error) {
    return handleApiError(error, 'Falha ao buscar itens do estoque.');
  }
};
