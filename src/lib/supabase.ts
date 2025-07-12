import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ybefpjodbvfhfcvqsxkl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliZWZwam9kYnZmaGZjdnFzeGtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2MDczOTksImV4cCI6MjA1NDE4MzM5OX0.1LqcZgLMqvQNYvUraNWJnNp3xMUG3yY8nfZfKJH3XVY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos do banco de dados gerados automaticamente
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          nome: string
          telefone: string | null
          cpf: string | null
          email: string | null
          role: 'cliente' | 'recepcao' | 'garcom' | 'cozinheiro' | 'caixa' | 'gerente'
          ativo: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          nome: string
          telefone?: string | null
          cpf?: string | null
          email?: string | null
          role: 'cliente' | 'recepcao' | 'garcom' | 'cozinheiro' | 'caixa' | 'gerente'
          ativo?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          nome?: string
          telefone?: string | null
          cpf?: string | null
          email?: string | null
          role?: 'cliente' | 'recepcao' | 'garcom' | 'cozinheiro' | 'caixa' | 'gerente'
          ativo?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      tables: {
        Row: {
          id: number
          numero: number
          lugares: number
          status: 'livre' | 'ocupada' | 'reservada' | 'limpeza' | 'aguardando'
          pin: string | null
          qr_code: string
          garcom_id: number | null
          cliente_atual: string | null
          pedido_atual_id: number | null
          observacoes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          numero: number
          lugares: number
          status?: 'livre' | 'ocupada' | 'reservada' | 'limpeza' | 'aguardando'
          pin?: string | null
          qr_code: string
          garcom_id?: number | null
          cliente_atual?: string | null
          pedido_atual_id?: number | null
          observacoes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          numero?: number
          lugares?: number
          status?: 'livre' | 'ocupada' | 'reservada' | 'limpeza' | 'aguardando'
          pin?: string | null
          qr_code?: string
          garcom_id?: number | null
          cliente_atual?: string | null
          pedido_atual_id?: number | null
          observacoes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      // Adicionar outros tipos conforme necessário...
    }
  }
} 