// src/lib/api/reports.ts
import { supabase } from '../supabase';
import { handleApiError, createSuccessResponse, ApiResponse } from './index';

// Tipos para os dados que as funções do DB retornarão
export interface SalesReportData {
  total_vendas: number;
  total_pedidos: number;
  ticket_medio: number;
  itens_mais_vendidos: {
    item_id: number;
    nome: string;
    quantidade_vendida: number;
  }[];
}

export interface GeneralStatsData {
    mesas_ocupadas: number;
    reservas_hoje: number;
    fila_espera: number;
}

// Novos tipos para dashboards especializados
export interface SalesDashboardData {
  totalRevenue: number;
  totalOrders: number;
  averageTicket: number;
  salesOverTime: Array<{ date: string; sales: number }> | null;
  topSellingItems: Array<{ name: string; quantity: number }> | null;
}

export interface ReservationsDashboardData {
  totalReservations: number;
  occupancyRate: number;
  reservationsByHour: Array<{ hour: number; count: number }> | null;
  upcomingReservations: Array<{ nome_cliente: string; data_hora: string; pessoas: number }> | null;
}

export interface StockDashboardData {
  totalItems: number;
  lowStockItemsCount: number;
  stockValue: number;
  itemsNearExpiration: Array<{ nome: string; validade: string; quantidade: number }> | null;
}

export interface LoyaltyDashboardData {
  totalMembers: number;
  totalPoints: number;
  topClients: Array<{ nome: string; pontos: number }> | null;
}

/**
 * Busca um relatório de vendas consolidado. (Endpoint 6.10)
 * Chama uma função RPC no Supabase para agregar os dados.
 */
export const getSalesReport = async (
  startDate: string,
  endDate: string
): Promise<ApiResponse<SalesReportData>> => {
  try {
    const { data, error } = await supabase.rpc('get_sales_report', {
      start_date: startDate,
      end_date: endDate,
    }) as { data: any; error: any };

    if (error) throw error;
    return createSuccessResponse(data);
  } catch (error) {
    return handleApiError(error, 'Falha ao gerar o relatório de vendas.');
  }
};

/**
 * Busca estatísticas gerais para o dashboard principal.
 * Chama uma função RPC no Supabase.
 */
export const getGeneralStats = async (): Promise<ApiResponse<GeneralStatsData>> => {
    try {
        const { data, error } = await supabase.rpc('get_general_stats', {}) as { data: any; error: any };

        if (error) throw error;
        return createSuccessResponse(data);
    } catch (error) {
        return handleApiError(error, 'Falha ao buscar estatísticas gerais.');
    }
};

/**
 * Busca dados para o dashboard de vendas especializado.
 */
export const getSalesDashboardData = async (
  startDate: string,
  endDate: string
): Promise<ApiResponse<SalesDashboardData>> => {
  try {
    const { data, error } = await supabase.rpc('get_sales_dashboard_data', {
      start_date: startDate,
      end_date: endDate,
    }) as { data: any; error: any };

    if (error) throw error;
    return createSuccessResponse(data);
  } catch (error) {
    return handleApiError(error, 'Falha ao buscar dados do dashboard de vendas.');
  }
};

/**
 * Busca dados para o dashboard de reservas especializado.
 */
export const getReservationsDashboardData = async (
  date: string
): Promise<ApiResponse<ReservationsDashboardData>> => {
  try {
    const { data, error } = await supabase.rpc('get_reservations_dashboard_data', {
      p_date: date,
    }) as { data: any; error: any };

    if (error) throw error;
    return createSuccessResponse(data);
  } catch (error) {
    return handleApiError(error, 'Falha ao buscar dados do dashboard de reservas.');
  }
};

/**
 * Busca dados para o dashboard de estoque especializado.
 */
export const getStockDashboardData = async (): Promise<ApiResponse<StockDashboardData>> => {
  try {
    const { data, error } = await supabase.rpc('get_stock_dashboard_data', {}) as { data: any; error: any };

    if (error) throw error;
    return createSuccessResponse(data);
  } catch (error) {
    return handleApiError(error, 'Falha ao buscar dados do dashboard de estoque.');
  }
};

/**
 * Busca dados para o dashboard de fidelidade especializado.
 */
export const getLoyaltyDashboardData = async (): Promise<ApiResponse<LoyaltyDashboardData>> => {
  try {
    const { data, error } = await supabase.rpc('get_loyalty_dashboard_data', {}) as { data: any; error: any };

    if (error) throw error;
    return createSuccessResponse(data);
  } catch (error) {
    return handleApiError(error, 'Falha ao buscar dados do dashboard de fidelidade.');
  }
};