// Pure localStorage implementation - Supabase online completely removed
import { localStorageClient } from './localStorage';

// Export localStorage client as 'supabase' for easy migration back to Supabase later
export const supabase = localStorageClient;

// Enhanced Database types to include missing tables
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          nome: string;
          telefone: string | null;
          cpf: string | null;
          email: string | null;
          role: 'cliente' | 'recepcao' | 'garcom' | 'cozinheiro' | 'caixa' | 'gerente';
          ativo: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          nome: string;
          telefone?: string | null;
          cpf?: string | null;
          email?: string | null;
          role: 'cliente' | 'recepcao' | 'garcom' | 'cozinheiro' | 'caixa' | 'gerente';
          ativo?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          nome?: string;
          telefone?: string | null;
          cpf?: string | null;
          email?: string | null;
          role?: 'cliente' | 'recepcao' | 'garcom' | 'cozinheiro' | 'caixa' | 'gerente';
          ativo?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      tables: {
        Row: {
          id: number;
          numero: number;
          lugares: number;
          status: 'livre' | 'ocupada' | 'reservada' | 'limpeza' | 'aguardando';
          pin: string | null;
          qr_code: string;
          garcom_id: number | null;
          cliente_atual: string | null;
          pedido_atual_id: number | null;
          observacoes: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          numero: number;
          lugares: number;
          status?: 'livre' | 'ocupada' | 'reservada' | 'limpeza' | 'aguardando';
          pin?: string | null;
          qr_code: string;
          garcom_id?: number | null;
          cliente_atual?: string | null;
          pedido_atual_id?: number | null;
          observacoes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          numero?: number;
          lugares?: number;
          status?: 'livre' | 'ocupada' | 'reservada' | 'limpeza' | 'aguardando';
          pin?: string | null;
          qr_code?: string;
          garcom_id?: number | null;
          cliente_atual?: string | null;
          pedido_atual_id?: number | null;
          observacoes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      menu_items: {
        Row: {
          id: number;
          nome: string;
          descricao: string;
          preco: number;
          categoria: string;
          disponivel: boolean;
          tempo_preparo: number;
          ingredientes: string[];
          imagem: string | null;
          restricoes: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          nome: string;
          descricao: string;
          preco: number;
          categoria: string;
          disponivel?: boolean;
          tempo_preparo: number;
          ingredientes: string[];
          imagem?: string | null;
          restricoes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          nome?: string;
          descricao?: string;
          preco?: number;
          categoria?: string;
          disponivel?: boolean;
          tempo_preparo?: number;
          ingredientes?: string[];
          imagem?: string | null;
          restricoes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      orders: {
        Row: {
          id: number;
          table_id: number;
          customer_name: string;
          status: 'carrinho' | 'confirmado' | 'preparando' | 'pronto' | 'entregue' | 'pago';
          total: number;
          observacoes: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          table_id: number;
          customer_name: string;
          status?: 'carrinho' | 'confirmado' | 'preparando' | 'pronto' | 'entregue' | 'pago';
          total: number;
          observacoes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          table_id?: number;
          customer_name?: string;
          status?: 'carrinho' | 'confirmado' | 'preparando' | 'pronto' | 'entregue' | 'pago';
          total?: number;
          observacoes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      order_items: {
        Row: {
          id: number;
          order_id: number;
          menu_item_id: number;
          quantidade: number;
          preco_unitario: number;
          observacoes: string | null;
          status: 'pendente' | 'preparando' | 'pronto' | 'entregue';
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          order_id: number;
          menu_item_id: number;
          quantidade: number;
          preco_unitario: number;
          observacoes?: string | null;
          status?: 'pendente' | 'preparando' | 'pronto' | 'entregue';
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          order_id?: number;
          menu_item_id?: number;
          quantidade?: number;
          preco_unitario?: number;
          observacoes?: string | null;
          status?: 'pendente' | 'preparando' | 'pronto' | 'entregue';
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      reservations: {
        Row: {
          id: number;
          cliente_nome: string;
          cliente_cpf: string;
          cliente_telefone: string;
          data_hora: string;
          numero_convidados: number;
          restricoes: string | null;
          status: 'confirmada' | 'cancelada' | 'realizada' | 'aguardando' | 'em_atendimento';
          mesa_id: number | null;
          posicao_fila: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          cliente_nome: string;
          cliente_cpf: string;
          cliente_telefone: string;
          data_hora: string;
          numero_convidados: number;
          restricoes?: string | null;
          status?: 'confirmada' | 'cancelada' | 'realizada' | 'aguardando' | 'em_atendimento';
          mesa_id?: number | null;
          posicao_fila?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          cliente_nome?: string;
          cliente_cpf?: string;
          cliente_telefone?: string;
          data_hora?: string;
          numero_convidados?: number;
          restricoes?: string | null;
          status?: 'confirmada' | 'cancelada' | 'realizada' | 'aguardando' | 'em_atendimento';
          mesa_id?: number | null;
          posicao_fila?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      payments: {
        Row: {
          id: number;
          order_id: number;
          valor: number;
          metodo: 'pix' | 'apple_pay' | 'google_pay' | 'samsung_pay' | 'dinheiro' | 'cartao';
          status: 'pendente' | 'processando' | 'confirmado' | 'cancelado';
          codigo_pagamento: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          order_id: number;
          valor: number;
          metodo: 'pix' | 'apple_pay' | 'google_pay' | 'samsung_pay' | 'dinheiro' | 'cartao';
          status?: 'pendente' | 'processando' | 'confirmado' | 'cancelado';
          codigo_pagamento?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          order_id?: number;
          valor?: number;
          metodo?: 'pix' | 'apple_pay' | 'google_pay' | 'samsung_pay' | 'dinheiro' | 'cartao';
          status?: 'pendente' | 'processando' | 'confirmado' | 'cancelado';
          codigo_pagamento?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      feedback: {
        Row: {
          id: number;
          mesa_id: number;
          order_id: number;
          estrelas: number;
          comentario: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          mesa_id: number;
          order_id: number;
          estrelas: number;
          comentario?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          mesa_id?: number;
          order_id?: number;
          estrelas?: number;
          comentario?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      menu_categories: {
        Row: {
          id: number;
          nome: string;
          descricao: string | null;
          ordem: number;
          ativo: boolean;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          nome: string;
          descricao?: string | null;
          ordem?: number;
          ativo?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          nome?: string;
          descricao?: string | null;
          ordem?: number;
          ativo?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      loyalty: {
        Row: {
          id: number;
          user_id: number;
          pontos: number;
          nivel: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          user_id: number;
          pontos?: number;
          nivel?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          user_id?: number;
          pontos?: number;
          nivel?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
    Enums: {
      order_status: 'carrinho' | 'confirmado' | 'preparando' | 'pronto' | 'entregue' | 'pago';
      table_status: 'livre' | 'ocupada' | 'reservada' | 'limpeza' | 'aguardando';
      user_role: 'cliente' | 'recepcao' | 'garcom' | 'cozinheiro' | 'caixa' | 'gerente';
      payment_method: 'pix' | 'apple_pay' | 'google_pay' | 'samsung_pay' | 'dinheiro' | 'cartao';
      payment_status: 'pendente' | 'processando' | 'confirmado' | 'cancelado';
      reservation_status:
        | 'confirmada'
        | 'cancelada'
        | 'realizada'
        | 'aguardando'
        | 'em_atendimento';
    };
  };
};
