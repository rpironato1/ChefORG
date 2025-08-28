import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, MessageCircle, ArrowLeft, Loader2, AlertTriangle, Heart } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { createFeedback } from '../../lib/api/feedback';
import { getActiveOrderByTable } from '../../lib/api/orders';

interface AvaliacaoFeedback {
  estrelas_estabelecimento: number;
  estrelas_servico: number;
  estrelas_comida: number;
  estrelas_experiencia: number;
  comentario: string;
}

function Feedback() {
  const { numeroMesa, orderId } = useParams<{ numeroMesa: string; orderId: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError, ToastContainer } = useToast();

  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [avaliacao, setAvaliacao] = useState<AvaliacaoFeedback>({
    estrelas_estabelecimento: 0,
    estrelas_servico: 0,
    estrelas_comida: 0,
    estrelas_experiencia: 0,
    comentario: '',
  });

  useEffect(() => {
    const fetchOrder = async () => {
      if (!numeroMesa) return;
      setIsLoading(true);
      try {
        const tableId = parseInt(numeroMesa, 10);
        const result = await getActiveOrderByTable(tableId);
        if (result.success && result.data) {
          setCurrentOrderId(result.data.id);
        } else {
          // Fallback para o ID da URL se a mesa não tiver mais pedido ativo
          if (orderId) setCurrentOrderId(parseInt(orderId, 10));
          else showError('Erro', 'Não foi possível localizar o pedido para avaliação.');
        }
      } catch (e) {
        showError('Erro', 'Falha de conexão ao buscar pedido.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [numeroMesa, orderId]);

  const avaliarEstrelas = (
    categoria: keyof Omit<AvaliacaoFeedback, 'comentario'>,
    valor: number
  ) => {
    setAvaliacao(prev => ({ ...prev, [categoria]: valor }));
  };

  const enviarAvaliacao = async () => {
    if (!currentOrderId) {
      showError('Erro', 'ID do pedido não encontrado.');
      return;
    }
    if (Object.values(avaliacao).every(v => v === 0 || v === '')) {
      showError('Avaliação Vazia', 'Por favor, dê uma nota para continuar.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createFeedback({
        order_id: currentOrderId,
        ...avaliacao,
      });

      if (result.success) {
        showSuccess('Obrigado!', 'Sua avaliação foi registrada com sucesso.');
        setTimeout(() => navigate('/'), 2000);
      } else {
        showError('Erro', result.error || 'Não foi possível enviar sua avaliação.');
      }
    } catch (err) {
      showError('Erro de Conexão', 'Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderEstrelas = (
    categoria: keyof Omit<AvaliacaoFeedback, 'comentario'>,
    valor: number
  ) => {
    const categoryLabels = {
      estrelas_servico: 'Atendimento e Serviço',
      estrelas_comida: 'Qualidade da Comida',
      estrelas_estabelecimento: 'Ambiente do Restaurante',
      estrelas_experiencia: 'Experiência Geral',
    };

    return (
      <div
        className="flex gap-1 justify-center"
        role="group"
        aria-label={`Avaliação de ${categoryLabels[categoria]}`}
      >
        {[1, 2, 3, 4, 5].map(estrela => (
          <button
            key={estrela}
            onClick={() => avaliarEstrelas(categoria, estrela)}
            className={`p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 rounded ${estrela <= valor ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-300'}`}
            aria-label={`Dar ${estrela} estrela${estrela > 1 ? 's' : ''} para ${categoryLabels[categoria]}`}
            aria-pressed={estrela <= valor}
            type="button"
          >
            <Star className="h-8 w-8" fill={estrela <= valor ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" /> Pular Avaliação
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Heart className="h-4 w-4" /> Mesa {numeroMesa}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center mb-6">
          <MessageCircle className="h-8 w-8 text-primary-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Como foi sua experiência?</h1>
          <p className="text-gray-600 mt-2">Sua opinião é muito importante para nós.</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-center mb-2">Atendimento e Serviço</h2>
            {renderEstrelas('estrelas_servico', avaliacao.estrelas_servico)}
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-center mb-2">Qualidade da Comida</h2>
            {renderEstrelas('estrelas_comida', avaliacao.estrelas_comida)}
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-center mb-2">Ambiente do Restaurante</h2>
            {renderEstrelas('estrelas_estabelecimento', avaliacao.estrelas_estabelecimento)}
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-center mb-2">Experiência Geral</h2>
            {renderEstrelas('estrelas_experiencia', avaliacao.estrelas_experiencia)}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Comentário (opcional)</h2>
            <label htmlFor="feedback-comment" className="sr-only">
              Comentário opcional sobre sua experiência no restaurante
            </label>
            <textarea
              id="feedback-comment"
              value={avaliacao.comentario}
              onChange={e => setAvaliacao(prev => ({ ...prev, comentario: e.target.value }))}
              placeholder="Conte-nos mais sobre sua experiência..."
              className="w-full p-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              rows={4}
              aria-describedby="feedback-comment-description"
            />
            <p id="feedback-comment-description" className="sr-only">
              Campo opcional para comentários adicionais sobre sua experiência no restaurante
            </p>
          </div>

          <button
            onClick={enviarAvaliacao}
            disabled={isSubmitting}
            className="w-full py-3 btn-primary"
          >
            {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'Enviar Avaliação'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
