// src/lib/api/reservations.ts
import { supabase, Database } from '../supabase';
import { handleApiError, createSuccessResponse, ApiResponse } from './index';

type Reservation = Database['public']['Tables']['reservations']['Row'];
type ReservationInsert = Database['public']['Tables']['reservations']['Insert'];
type User = Database['public']['Tables']['users']['Row'];

/**
 * Cria uma nova reserva. (Fluxo 3.1)
 * Se houver mesa, associa. Se não, entra na fila.
 */
export const createReservation = async (
  details: Omit<
    ReservationInsert,
    'id' | 'created_at' | 'status' | 'qr_code' | 'pin' | 'user_id'
  > & { nome_cliente: string; cpf?: string }
): Promise<ApiResponse<Reservation>> => {
  try {
    // Note: Simplified version - not creating user associations
    // In a full implementation, would find or create user here

    // 2. Criar a reserva
    const reservationData = {
      cliente_nome: details.cliente_nome,
      cliente_cpf: details.cliente_cpf,
      cliente_telefone: details.cliente_telefone,
      data_hora: details.data_hora,
      numero_convidados: details.numero_convidados,
      restricoes: details.restricoes,
      status: 'confirmada' as const,
    };

    const insertResult = await (supabase as any).from('reservations').insert(reservationData);

    if (insertResult.error) throw insertResult.error;

    // Get the created reservation
    const { data: allReservations, error } = (await new Promise(resolve => {
      const result = supabase.from('reservations').select('*');
      if (result && typeof result.then === 'function') {
        result.then(resolve);
      } else {
        resolve({ data: [], error: null });
      }
    })) as { data: any[] | null; error: any };

    if (error) throw error;

    // Find the most recently created reservation
    const data = allReservations?.[allReservations.length - 1];
    if (!data) throw new Error('Failed to create reservation');

    return createSuccessResponse(data, 'Reserva criada com sucesso!');
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Busca uma reserva pelo seu QR Code. (Fluxo 3.2.1)
 */
export const getReservationByQR = async (
  qrCode: string
): Promise<ApiResponse<Reservation & { user: User | null }>> => {
  try {
    const reservationQuery = supabase
      .from('reservations')
      .select(
        `
        *,
        user:users(*)
      `
      )
      .eq('qr_code', qrCode)
      .single();

    const { data, error } = (await reservationQuery) as any;

    if (error) throw error;
    return createSuccessResponse(data || null);
  } catch (error) {
    return handleApiError(error, 'Reserva não encontrada.');
  }
};

/**
 * Busca todas as reservas, opcionalmente filtrando por data.
 * Ideal para o Painel da Recepção.
 */
export const getAllReservations = async (date?: string): Promise<ApiResponse<Reservation[]>> => {
  try {
    let query = supabase.from('reservations').select('*').order('data_hora', { ascending: true });

    if (date) {
      // Filtra para o dia inteiro - using optimized localStorage query
      const baseQuery = query.gte('data_hora', `${date}T00:00:00Z`);
      query = baseQuery.lte('data_hora', `${date}T23:59:59Z`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return createSuccessResponse(data || []);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Realiza o check-in de uma reserva, alocando uma mesa e gerando um PIN. (Fluxo 3.2.3)
 */
export const checkInReservation = async (
  reservationId: number,
  tableId: number
): Promise<ApiResponse<{ pin: string }>> => {
  try {
    const pin = Math.floor(100000 + Math.random() * 900000).toString();

    // Inicia uma transação para garantir consistência (optimized for localStorage)
    const { error: transactionError } = (await supabase.rpc('check_in_reservation', {
      p_reservation_id: reservationId,
      p_table_id: tableId,
      p_pin: pin,
    })) as { data: any; error: any };

    if (transactionError) throw transactionError;

    // Notificar cliente sobre a mesa e o PIN
    // Ex: await sendWhatsAppNotification(telefone, `Sua mesa é a ${numeroMesa}. Use o PIN: ${pin}`);

    return createSuccessResponse({ pin }, 'Check-in realizado com sucesso!');
  } catch (error) {
    return handleApiError(error, 'Falha ao realizar o check-in.');
  }
};

/**
 * Cancela uma reserva.
 */
export const cancelReservation = async (
  reservationId: number
): Promise<ApiResponse<Reservation>> => {
  try {
    const updateQuery = supabase
      .from('reservations')
      .update({ status: 'cancelada' })
      .eq('id', reservationId)
      .select()
      .single();

    const { data, error } = (await updateQuery) as any;

    if (error) throw error;

    // Se uma mesa estava associada, liberá-la
    if (data?.mesa_id) {
      await supabase.from('tables').update({ status: 'livre' }).eq('id', data.mesa_id);
    }

    return createSuccessResponse(data || null, 'Reserva cancelada.');
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Aloca uma mesa para um cliente na fila de espera e gera um PIN.
 */
export const allocateTableToWaitingClient = async (
  reservationId: number,
  tableId: number
): Promise<ApiResponse<{ pin: string }>> => {
  try {
    // Esta função é muito similar ao check-in, então podemos reusar a mesma lógica de RPC
    const { data, error } = (await supabase.rpc('check_in_reservation', {
      p_reservation_id: reservationId,
      p_table_id: tableId,
      p_pin: Math.floor(100000 + Math.random() * 900000).toString(),
    })) as { data: any; error: any };

    if (error) throw error;

    // O RPC retorna o PIN gerado
    return createSuccessResponse({ pin: data }, 'Mesa alocada com sucesso!');
  } catch (error) {
    return handleApiError(error, 'Falha ao alocar mesa.');
  }
};
