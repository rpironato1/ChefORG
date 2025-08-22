import { useState, useCallback } from 'react';

// Interface básica para usuário autenticado
interface AuthUser {
  id: string;
  email: string;
  nome?: string;
  tipo?: 'admin' | 'garcom' | 'cozinha' | 'caixa' | 'recepcao' | 'cliente';
  created_at?: string;
}

// Hook para gerenciar autenticação
export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular autenticação (em produção seria uma chamada à API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Basic password validation for demo
      if (password.length < 3) {
        throw new Error('Senha muito curta');
      }
      
      // Mock de usuário autenticado
      const mockUser: AuthUser = {
        id: `USER-${Date.now()}`,
        email,
        nome: email.split('@')[0],
        tipo: email.includes('admin') ? 'admin' : 'cliente',
        created_at: new Date().toISOString()
      };
      
      setUser(mockUser);
      setLoading(false);
      return true;
    } catch (err) {
      setError('Erro ao fazer login');
      setLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  const register = useCallback(async (dados: {
    email: string;
    password: string;
    nome: string;
    tipo?: AuthUser['tipo'];
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular registro (em produção seria uma chamada à API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: AuthUser = {
        id: `USER-${Date.now()}`,
        email: dados.email,
        nome: dados.nome,
        tipo: dados.tipo || 'cliente',
        created_at: new Date().toISOString()
      };
      
      setUser(newUser);
      setLoading(false);
      return true;
    } catch (err) {
      setError('Erro ao criar conta');
      setLoading(false);
      return false;
    }
  }, []);

  const updateProfile = useCallback(async (dados: Partial<AuthUser>): Promise<boolean> => {
    if (!user) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      // Simular atualização (em produção seria uma chamada à API)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(prev => prev ? { ...prev, ...dados } : null);
      setLoading(false);
      return true;
    } catch (err) {
      setError('Erro ao atualizar perfil');
      setLoading(false);
      return false;
    }
  }, [user]);

  const isAuthenticated = useCallback(() => {
    return user !== null;
  }, [user]);

  const hasRole = useCallback((roles: AuthUser['tipo'][]): boolean => {
    return user ? roles.includes(user.tipo || 'cliente') : false;
  }, [user]);

  return {
    user,
    loading,
    error,
    login,
    logout,
    register,
    updateProfile,
    isAuthenticated,
    hasRole
  };
};