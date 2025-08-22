// src/lib/api/dashboard.ts
import { supabase } from '../supabase';
import { handleApiError, createSuccessResponse, ApiResponse } from './index';

// --- Tipos de Dados para os Dashboards ---

export interface SalesDashboardData {
  totalRevenue: number;
  totalOrders: number;
  averageTicket: number;
  salesOverTime: { date: string; sales: number }[];
  topSellingItems: { name: string; quantity: number }[];
}

export interface ReservationsDashboardData {
  totalReservations: number;
  occupancyRate: number;
  reservationsByHour: { hour: string; count: number }[];
  upcomingReservations: { nome_cliente: string; data_hora: string; pessoas: number }[];
}

export interface StockDashboardData {
  totalItems: number;
  lowStockItemsCount: number;
  stockValue: number;
  itemsNearExpiration: { nome: string; validade: string; quantidade: number }[];
}

export interface LoyaltyDashboardData {
  totalMembers: number;
  totalPoints: number;
  topClients: { nome: string; pontos: number }[];
}


// --- Funções da API ---

/**
 * Busca dados agregados para o dashboard de vendas.
 * NOTA: Requer a função RPC `get_sales_dashboard_data` no Supabase.
 */
export const getSalesDashboardData = async (startDate: string, endDate: string): Promise<ApiResponse<SalesDashboardData>> => {
  try {
    const { data, error } = await supabase.rpc('get_sales_dashboard_data', {
      start_date: startDate,
      end_date: endDate,
    }) as { data: SalesDashboardData | null; error: any };
    if (error) throw error;
    if (!data) {
      throw new Error('Nenhum dado de vendas encontrado');
    }
    return createSuccessResponse(data);
  } catch (error) {
    return handleApiError(error, 'Falha ao buscar dados de vendas.');
  }
};

/**
 * Busca dados agregados para o dashboard de reservas.
 * NOTA: Requer a função RPC `get_reservations_dashboard_data` no Supabase.
 */
export const getReservationsDashboardData = async (date: string): Promise<ApiResponse<ReservationsDashboardData>> => {
    try {
        const { data, error } = await supabase.rpc('get_reservations_dashboard_data', {
            p_date: date
        }) as { data: ReservationsDashboardData | null; error: any };
        if (error) throw error;
        if (!data) {
            throw new Error('Nenhum dado de reservas encontrado');
        }
        return createSuccessResponse(data);
    } catch (error) {
        return handleApiError(error, 'Falha ao buscar dados de reservas.');
    }
};

/**
 * Busca dados agregados para o dashboard de estoque.
 * NOTA: Requer a função RPC `get_stock_dashboard_data` no Supabase.
 */
export const getStockDashboardData = async (): Promise<ApiResponse<StockDashboardData>> => {
    try {
        const { data, error } = await supabase.rpc('get_stock_dashboard_data', {}) as { data: StockDashboardData | null; error: any };
        if (error) throw error;
        if (!data) {
            throw new Error('Nenhum dado de estoque encontrado');
        }
        return createSuccessResponse(data);
    } catch (error) {
        return handleApiError(error, 'Falha ao buscar dados de estoque.');
    }
};

/**
 * Busca dados agregados para o dashboard de fidelidade.
 * NOTA: Requer a função RPC `get_loyalty_dashboard_data` no Supabase.
 */
export const getLoyaltyDashboardData = async (): Promise<ApiResponse<LoyaltyDashboardData>> => {
    try {
        const { data, error } = await supabase.rpc('get_loyalty_dashboard_data', {}) as { data: LoyaltyDashboardData | null; error: any };
        if (error) throw error;
        if (!data) {
            throw new Error('Nenhum dado de fidelidade encontrado');
        }
        return createSuccessResponse(data);
    } catch (error) {
        return handleApiError(error, 'Falha ao buscar dados de fidelidade.');
    }
};
