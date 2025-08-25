import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Clock, Utensils, AlertCircle, CheckCircle, Phone, User } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../components/ui/Toast';
import { MobileInput } from '../../mobile/components/forms/MobileInput';
import { MobileTextArea } from '../../mobile/components/forms/MobileTextArea';
import { MobileButton } from '../../mobile/components/forms/MobileButton';

interface FormData {
  nome: string;
  telefone: string;
  pessoas: number;
  observacoes: string;
}

function ChegadaSemReserva() {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    telefone: '',
    pessoas: 2,
    observacoes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdicionado, setIsAdicionado] = useState(false);
  const [posicaoFila, setPosicaoFila] = useState<number>(0);
  const [tempoEstimado, setTempoEstimado] = useState<number>(0);

  const { state } = useApp();
  const { showSuccess, showError, ToastContainer } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      showError('Erro', 'Nome é obrigatório');
      return;
    }

    if (!formData.telefone.trim() || formData.telefone.replace(/\D/g, '').length < 10) {
      showError('Erro', 'Telefone inválido');
      return;
    }

    if (formData.pessoas < 1 || formData.pessoas > 12) {
      showError('Erro', 'Número de pessoas deve ser entre 1 e 12');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular verificação de mesas disponíveis
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Adicionar à fila de espera (mock implementation)
      // addFilaEspera(formData.nome, formData.pessoas);
      
      // Calcular posição e tempo (mock data)
      const novaPosicao = Math.floor(Math.random() * 5) + 1; // 1-5
      const novoTempo = novaPosicao * 15; // 15 min por posição
      
      setPosicaoFila(novaPosicao);
      setTempoEstimado(novoTempo);
      setIsAdicionado(true);

      showSuccess(
        'Adicionado à Fila!', 
        'Você receberá uma notificação quando sua mesa estiver pronta'
      );

    } catch (error) {
      showError('Erro', 'Falha ao processar solicitação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAdicionado) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ToastContainer />
        
        {/* Header */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Utensils className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">ChefORG</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Confirmação */}
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Na Fila de Espera
              </h1>
              <p className="text-gray-600 mb-8">
                Você foi adicionado à nossa fila virtual. Será notificado quando sua mesa estiver pronta.
              </p>
            </div>

            {/* Informações da Fila */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Posição na fila:</span>
                  <span className="text-2xl font-bold text-primary-600">#{posicaoFila}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Tempo estimado:</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-900">{tempoEstimado} minutos</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Pessoas:</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-900">{formData.pessoas}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Nome:</span>
                  <span className="font-medium text-gray-900">{formData.nome}</span>
                </div>
              </div>
            </div>

            {/* Notificação WhatsApp */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📱</span>
                <div className="text-sm">
                  <p className="font-medium text-green-800 mb-1">
                    Notificação por WhatsApp
                  </p>
                  <p className="text-green-700">
                    Enviaremos uma mensagem para <strong>{formData.telefone}</strong> quando sua mesa estiver pronta.
                  </p>
                </div>
              </div>
            </div>

            {/* Informações Úteis */}
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Mantenha-se próximo ao restaurante. O tempo pode variar conforme o movimento.
              </p>
              
              <div className="flex flex-col gap-3">
                <Link to="/" className="btn-primary">
                  Voltar ao Início
                </Link>
                <Link to="/menu" className="btn-secondary">
                  Ver Cardápio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/checkin" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
              </Link>
              <div className="flex items-center">
                <Utensils className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">ChefORG</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="mb-4">
              <Users className="h-16 w-16 text-primary-600 mx-auto" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Chegada sem Reserva
            </h1>
            <p className="text-gray-600">
              Não há mesas disponíveis no momento. Preencha os dados para entrar na fila de espera.
            </p>
          </div>

          {/* Alerta sobre fila */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Fila Virtual</p>
                <p>
                  Você será adicionado à nossa fila virtual e receberá uma notificação 
                  por WhatsApp quando uma mesa estiver disponível.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <MobileInput
              label="Nome para a Mesa"
              type="text"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Nome completo"
              leftIcon={<User className="w-5 h-5" />}
              required
            />

            <MobileInput
              label="WhatsApp/Telefone"
              type="tel"
              value={formData.telefone}
              onChange={(e) => handleInputChange('telefone', formatTelefone(e.target.value))}
              placeholder="(11) 99999-9999"
              maxLength={15}
              leftIcon={<Phone className="w-5 h-5" />}
              helperText="Será usado para notificar quando a mesa estiver pronta"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Pessoas *
              </label>
              <select
                value={formData.pessoas}
                onChange={(e) => handleInputChange('pessoas', parseInt(e.target.value))}
                className="w-full h-12 px-4 text-base border border-gray-500 rounded-lg bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-200"
                required
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'pessoa' : 'pessoas'}
                  </option>
                ))}
              </select>
            </div>

            <MobileTextArea
              label="Observações"
              value={formData.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              placeholder="Alguma preferência ou necessidade especial..."
              resize="none"
            />

            <MobileButton
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
              leftIcon={<Users className="w-5 h-5" />}
            >
              {isSubmitting ? 'Adicionando...' : 'Entrar na Fila'}
            </MobileButton>
          </form>

          {/* Informações Adicionais */}
          <div className="mt-8 text-center">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Como funciona?
            </h3>
            <div className="text-xs text-gray-600 space-y-2">
              <p>• Você será adicionado à nossa fila virtual</p>
              <p>• Receberá notificação quando a mesa estiver pronta</p>
              <p>• Tempo estimado é calculado automaticamente</p>
              <p>• Mantenha-se próximo ao restaurante</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChegadaSemReserva; 