import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Users,
  AlertCircle,
  AlertTriangle,
  Bell,
  ChefHat,
  Loader2,
} from 'lucide-react';
import { getActiveOrderByTable, OrderWithItems } from '../../lib/api/orders';

function AcompanharPedido() {
  const { numeroMesa, orderId } = useParams<{ numeroMesa: string; orderId: string }>();
  const [pedido, setPedido] = useState<OrderWithItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    if (!numeroMesa || !orderId) {
      setError('Número da mesa ou ID do pedido não fornecido.');
      setIsLoading(false);
      return;
    }

    // Na primeira carga, o isLoading já é true. Nas seguintes, não mostramos o loader.
    if (!isLoading) setIsLoading(true);
    setError(null);

    try {
      const tableId = parseInt(numeroMesa, 10);
      const result = await getActiveOrderByTable(tableId);

      if (result.success && result.data) {
        if (result.data.id === parseInt(orderId, 10)) {
          setPedido(result.data);
        } else {
          setError('O pedido ativo nesta mesa não corresponde ao seu. Chame um garçom.');
        }
      } else {
        setError(result.error || 'Não foi possível encontrar seu pedido.');
      }
    } catch (err) {
      setError('Ocorreu um erro de conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const intervalId = setInterval(fetchOrder, 20000); // Atualiza a cada 20 segundos
    return () => clearInterval(intervalId);
  }, [numeroMesa, orderId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'text-blue-600 bg-blue-100';
      case 'preparando':
        return 'text-yellow-600 bg-yellow-100';
      case 'pronto':
        return 'text-green-600 bg-green-100';
      case 'entregue':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmado':
        return <Clock className="h-5 w-5" />;
      case 'preparando':
        return <ChefHat className="h-5 w-5" />;
      case 'pronto':
        return <Bell className="h-5 w-5" />;
      case 'entregue':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'Pedido Confirmado';
      case 'preparando':
        return 'Em Preparo';
      case 'pronto':
        return 'Pronto para Entrega';
      case 'entregue':
        return 'Entregue';
      default:
        return 'Status Desconhecido';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
        <p className="ml-3">Buscando seu pedido...</p>
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col justify-center items-center h-64 bg-red-50 rounded-lg">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <p className="mt-2 text-red-700 font-semibold">Erro ao carregar o pedido</p>
          <p className="text-red-600">{error || 'Pedido não encontrado.'}</p>
          <Link to={`/mesa/${numeroMesa}/cardapio`} className="mt-4 btn-primary">
            Voltar ao Cardápio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to={`/mesa/${numeroMesa}/cardapio`}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar ao Cardápio
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>Mesa {numeroMesa}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(pedido.status)} mb-4`}
          >
            {getStatusIcon(pedido.status)}
            <span className="font-semibold">{getStatusLabel(pedido.status)}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pedido #{pedido.id}</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Detalhes do Pedido</h2>
          <div className="space-y-4">
            {pedido.order_items.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.menu_items?.nome}</h4>
                  <p className="text-sm text-gray-600">Quantidade: {item.quantidade}</p>
                  {item.observacoes && (
                    <p className="text-sm text-gray-500">Obs: {item.observacoes}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    R$ {(Number(item.preco_unitario) * item.quantidade).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 mt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-primary-600">
                R$ {Number(pedido.total).toFixed(2)}
              </span>
            </div>
          </div>
          {pedido.status === 'entregue' && (
            <div className="mt-6 pt-6 border-t text-center">
              <Link to={`/mesa/${numeroMesa}/pagamento`} className="btn-primary">
                Ir para Pagamento
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AcompanharPedido;
