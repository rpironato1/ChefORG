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
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Usuário não encontrado após o login.");

    // Após o login, busca o perfil do usuário na tabela 'users'
    // Temporariamente comentado devido a problemas de compatibilidade localStorage
    const profile = null; // TODO: implementar busca de perfil
    const profileError = null;
    
    // const { data: profile, error: profileError } = await supabase
    //   .from('users')
    //   .select('*')
    //   .eq('id', authData.user.id)
    //   .single() as any;
    
    if (profileError) {
        // Se o perfil não for encontrado, ainda consideramos o login um sucesso,
        // mas o perfil será nulo. A aplicação pode decidir o que fazer.
        console.warn("Usuário autenticado mas perfil não encontrado na tabela 'users'.");
    }

    const response: AuthUser = {
      id: authData.user.id,
      email: authData.user.email,
      profile: profile,
    };

    return createSuccessResponse(response, 'Login realizado com sucesso!');
  } catch (error) {
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

        // Temporariamente comentado devido a problemas de compatibilidade localStorage
        const profile = null; // TODO: implementar busca de perfil
        const profileError = null;
        
        // const { data: profile, error: profileError } = await supabase
        //     .from('users')
        //     .select('*')
        //     .eq('id', user.id)
        //     .single() as any;

        if (profileError) {
            console.warn("Sessão encontrada mas perfil não encontrado na tabela 'users'.");
        }

        const response: AuthUser = {
            id: user.id,
            email: user.email,
            profile: profile,
        };

        return createSuccessResponse(response);
    } catch (error) {
        return handleApiError(error);
    }
};
