// Arquivo principal da API - Seção 6 do Escopo
import { Database } from '../supabase';

// Re-exportar tipos do banco de dados para uso nos módulos da API
export type { Database };

// Tipos base para respostas da API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Utilitários comuns
export const handleApiError = (error: any, customMessage?: string): ApiResponse<any> => {
  console.error('API Error:', error);
  
  // Erros do Supabase podem ter `code` e `message`
  if (error?.code) {
    return {
      success: false,
      error: customMessage || error.message || 'Ocorreu um erro na operação.',
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: customMessage || error.message,
    };
  }
  
  return {
    success: false,
    error: customMessage || 'Erro interno do servidor.',
  };
};

export const createSuccessResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
  success: true,
  data,
  message,
});

// Nota: Os endpoints individuais estão organizados em arquivos separados:
// - reservations.ts (6.1, 6.2)
// - tables.ts (6.3)
// - orders.ts (6.4, 6.5)
// - payments.ts (6.6, 6.7)
// - menu.ts (6.8)
// - feedback.ts (6.9)
// - reports.ts (6.10) 