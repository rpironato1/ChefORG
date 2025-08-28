import { useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { LogIn, User, Lock, Utensils } from 'lucide-react';
import { useAuth } from '../../contexts/AppContext';
import { useToast } from '../../components/ui/Toast';
import { Funcionario } from '../../types';

// Mock de funcionários para demonstração
const mockFuncionarios: Funcionario[] = [
  {
    id: '1',
    nome: 'Ana Silva',
    cargo: 'recepcao',
    email: 'ana@cheforg.com',
    telefone: '(11) 99999-0001',
    status: 'ativo',
    dataAdmissao: new Date('2023-01-15'),
  },
  {
    id: '2',
    nome: 'Carlos Santos',
    cargo: 'garcom',
    email: 'carlos@cheforg.com',
    telefone: '(11) 99999-0002',
    status: 'ativo',
    dataAdmissao: new Date('2023-03-10'),
  },
  {
    id: '3',
    nome: 'Maria Oliveira',
    cargo: 'cozinheiro',
    email: 'maria@cheforg.com',
    telefone: '(11) 99999-0003',
    status: 'ativo',
    dataAdmissao: new Date('2023-02-20'),
  },
  {
    id: '4',
    nome: 'João Costa',
    cargo: 'caixa',
    email: 'joao@cheforg.com',
    telefone: '(11) 99999-0004',
    status: 'ativo',
    dataAdmissao: new Date('2023-04-05'),
  },
  {
    id: '5',
    nome: 'Sandra Lima',
    cargo: 'gerente',
    email: 'sandra@cheforg.com',
    telefone: '(11) 99999-0005',
    status: 'ativo',
    dataAdmissao: new Date('2022-11-01'),
  },
];

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
      // Simular verificação de login
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock: encontrar funcionário por email
      const funcionario = mockFuncionarios.find(f => f.email === formData.email);

      if (!funcionario) {
        showError('Erro', 'Email ou senha incorretos');
        return;
      }

      // Mock: verificar senha (em produção seria hash)
      const senhasMock: { [email: string]: string } = {
        'ana@cheforg.com': '123456',
        'carlos@cheforg.com': '123456',
        'maria@cheforg.com': '123456',
        'joao@cheforg.com': '123456',
        'sandra@cheforg.com': '123456',
      };

      if (senhasMock[formData.email] !== formData.senha) {
        showError('Erro', 'Email ou senha incorretos');
        return;
      }

      // Login bem-sucedido
      const result = await login(formData.email, formData.senha);
      if (result.success) {
        showSuccess('Login realizado!', `Bem-vindo(a), ${funcionario.nome}`);
      } else {
        showError('Erro', result.error || 'Falha no login');
      }
    } catch (error) {
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

  // Função para futuro uso na exibição de perfis
  // const getCargoLabel = (cargo: Funcionario['cargo']) => {
  //   const labels = {
  //     recepcao: 'Recepção',
  //     garcom: 'Garçom',
  //     cozinheiro: 'Cozinheiro',
  //     caixa: 'Caixa',
  //     gerente: 'Gerente'
  //   };
  //   return labels[cargo];
  // };

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
