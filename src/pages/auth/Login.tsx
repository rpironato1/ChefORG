import { useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { LogIn, User, Lock, Utensils } from 'lucide-react';
import { useAuth } from '../../contexts/AppContext';
import { useToast } from '../../components/ui/Toast';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated, login } = useAuth();
  const { showSuccess, showError, ToastContainer } = useToast();
  const location = useLocation();

  // Se já está logado, redireciona
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.senha) {
      showError('Erro', 'Email e senha são obrigatórios');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting login with:', formData.email);

      // Realizar login usando a API unificada
      const result = await login(formData.email, formData.senha);

      console.log('Login result:', result);

      if (result.success && result.data) {
        const userName = result.data.profile?.nome || 'Usuário';
        showSuccess('Login realizado!', `Bem-vindo(a), ${userName}`);
      } else {
        showError('Erro', result.error || 'Email ou senha incorretos');
      }
    } catch (error) {
      console.error('Login error:', error);
      showError('Erro', 'Falha no sistema. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <Utensils className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">ChefORG</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
              <LogIn className="h-8 w-8 text-primary-600" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Acesso Staff</h2>
            <p className="mt-2 text-sm text-gray-600">
              Entre com suas credenciais para acessar o sistema
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-2" />
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  className="input-field"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="inline h-4 w-4 mr-2" />
                  Senha
                </label>
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.senha}
                  onChange={e => handleInputChange('senha', e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>

            {/* Development Help Section */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                🔧 Contas de Teste (Desenvolvimento)
              </h3>
              <div className="text-xs text-blue-700 space-y-1">
                <p>
                  <strong>Senha padrão:</strong> 123456
                </p>
                <div className="grid grid-cols-1 gap-1 mt-2">
                  <p>• admin@cheforg.com (Gerente)</p>
                  <p>• recepcao@cheforg.com (Recepção)</p>
                  <p>• garcom@cheforg.com (Garçom)</p>
                  <p>• cozinha@cheforg.com (Cozinha)</p>
                  <p>• caixa@cheforg.com (Caixa)</p>
                </div>
              </div>
            </div>
          </form>

          <div className="text-center">
            <Link to="/" className="text-sm text-primary-600 hover:text-primary-700">
              ← Voltar para página inicial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
