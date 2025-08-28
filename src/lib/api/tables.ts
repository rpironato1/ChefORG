// src/lib/api/tables.ts
import { supabase, Database } from '../supabase';
import { handleApiError, createSuccessResponse, ApiResponse } from './index';

type Table = Database['public']['Tables']['tables']['Row'];

/**
 * Busca todas as mesas e seu status atual.
 * Ideal para painéis de staff (Recepção, Garçom).
 */
export const getAllTables = async (): Promise<ApiResponse<Table[]>> => {
  try {
    const { data, error } = (await (supabase as any)
      .from('tables')
      .select('*')
      .order('numero', { ascending: true })) as any;

    if (error) throw error;
    return createSuccessResponse(data || []);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Busca uma mesa específica pelo seu QR Code.
 * Usado no check-in do cliente na mesa.
 */
export const getTableByQR = async (qrCode: string): Promise<ApiResponse<Table>> => {
  try {
    const { data, error } = (await (supabase as any)
      .from('tables')
      .select('*')
      .eq('qr_code', qrCode)
      .single()) as any;

    if (error) throw error;
    return createSuccessResponse(data || null);
  } catch (error) {
    return handleApiError(error, 'Mesa não encontrada.');
  }
};

/**
 * Valida o PIN inserido pelo cliente para uma mesa específica.
 * Libera o acesso ao cardápio. (Fluxo 3.4.3)
 */
export const validateTablePIN = async (
  tableId: number,
  pin: string
): Promise<ApiResponse<{ valid: boolean }>> => {
  try {
    const { data: table, error } = (await (supabase as any)
      .from('tables')
      .select('pin, status')
      .eq('id', tableId)
      .single()) as any;

    if (error) throw error;

    if (table.status !== 'ocupada' && table.status !== 'reservada') {
      return handleApiError(
        new Error('Mesa não está aguardando um cliente.'),
        'Mesa não está ocupada ou reservada.'
      );
    }

    if (table.pin !== pin) {
      return createSuccessResponse({ valid: false }, 'PIN incorreto.');
    }

    // Opcional: Limpar o PIN após o primeiro uso bem-sucedido
    // await supabase.from('tables').update({ pin: null }).eq('id', tableId);

    return createSuccessResponse({ valid: true });
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Libera uma mesa após o pagamento e saída do cliente.
 * O status muda para 'limpeza' e o PIN é removido. (Fluxo 3.8.4)
 */
export const releaseTable = async (tableId: number): Promise<ApiResponse<Table>> => {
  try {
    const releaseQuery = supabase
      .from('tables')
      .update({ status: 'limpeza', pin: null, cliente_atual: null, pedido_atual_id: null })
      .eq('id', tableId)
      .select()
      .single();

    const { data, error } = (await releaseQuery) as any;

    if (error) throw error;
    return createSuccessResponse(data, 'Mesa liberada para limpeza.');
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Atualiza o status de uma mesa.
 * Ex: 'limpeza' -> 'livre'
 */
export const updateTableStatus = async (
  tableId: number,
  status: Table['status']
): Promise<ApiResponse<Table>> => {
  try {
    const updateQuery = supabase
      .from('tables')
      .update({ status })
      .eq('id', tableId)
      .select()
      .single();

    const { data, error } = (await updateQuery) as any;

    if (error) throw error;
    return createSuccessResponse(data, `Status da mesa atualizado para ${status}.`);
  } catch (error) {
    return handleApiError(error);
  }
};
