// src/lib/api/auth.ts
import { supabase, Database } from '../supabase';
import { handleApiError, createSuccessResponse, ApiResponse } from './index';

// Re-export ApiResponse for other modules
export type { ApiResponse };

type UserProfile = Database['public']['Tables']['users']['Row'];

export interface AuthUser {
  id: string;
  email?: string;
  profile: UserProfile | null;
}

/**
 * Realiza o login do usuário com email e senha.
 */
export const login = async (email: string, password: string): Promise<ApiResponse<AuthUser>> => {
  try {
    console.log('Auth login attempt:', { email });
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('Auth response:', { authData, authError });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Usuário não encontrado após o login.");

    // Busca o perfil do usuário na tabela 'users' usando localStorage
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    console.log('Profile lookup:', { profile, profileError });
    
    if (profileError || !profile) {
        console.warn("Usuário autenticado mas perfil não encontrado na tabela 'users'.");
        // Retorna erro se não encontrar o perfil
        throw new Error("Perfil do usuário não encontrado.");
    }

    const response: AuthUser = {
      id: profile.id.toString(),
      email: profile.email,
      profile: profile,
    };

    console.log('Successful login response:', response);
    return createSuccessResponse(response, 'Login realizado com sucesso!');
  } catch (error) {
    console.error('Login error:', error);
    return handleApiError(error, 'Email ou senha inválidos.');
  }
};

/**
 * Realiza o logout do usuário.
 */
export const logout = async (): Promise<ApiResponse<{ success: boolean }>> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return createSuccessResponse({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Busca a sessão do usuário atual.
 * Útil para verificar se o usuário está logado ao carregar a aplicação.
 */
export const getCurrentUser = async (): Promise<ApiResponse<AuthUser | null>> => {
    try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!sessionData.session) return createSuccessResponse(null); // Ninguém logado

        const { user } = sessionData.session;

        // Busca o perfil do usuário na tabela 'users' usando o email da sessão
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single();

        if (profileError || !profile) {
            console.warn("Sessão encontrada mas perfil não encontrado na tabela 'users'.");
            // Força logout se não encontrar o perfil
            await supabase.auth.signOut();
            return createSuccessResponse(null);
        }

        const response: AuthUser = {
            id: profile.id.toString(),
            email: profile.email,
            profile: profile,
        };

        return createSuccessResponse(response);
    } catch (error) {
        return handleApiError(error);
    }
};
