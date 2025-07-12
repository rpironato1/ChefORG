// src/lib/api/notifications.ts
import { supabase } from '../supabase';
import { handleApiError, createSuccessResponse, ApiResponse } from './index';

interface NotificationResponse {
  success: boolean;
  sid?: string;
}

/**
 * Envia uma notificação (SMS/WhatsApp) para um número de telefone.
 * Chama a Supabase Edge Function 'send-notification'.
 */
export const sendNotification = async (
  to: string,
  body: string
): Promise<ApiResponse<NotificationResponse>> => {
  try {
    // Adiciona o código do país (Brasil) se não estiver presente
    const formattedTo = to.startsWith('+') ? to : `+55${to}`;

    const { data, error } = await supabase.functions.invoke('send-notification', {
      body: { to: formattedTo, body },
    });

    if (error) throw error;
    if (data.error) throw new Error(data.error);

    return createSuccessResponse(data);
  } catch (error) {
    // Em ambiente de desenvolvimento, não bloqueie a UI se a notificação falhar.
    // Apenas logue o erro. Em produção, isso pode ter um tratamento diferente.
    console.error('Falha ao enviar notificação:', error);
    return handleApiError(error, 'Falha ao enviar notificação.');
  }
};