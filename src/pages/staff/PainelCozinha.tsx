import { useState, useEffect, useMemo } from 'react';
import { ChefHat, Bell, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { getOrdersByStatus, updateOrderStatus, OrderWithItems } from '../../lib/api/orders';
import { Database } from '../../lib/supabase'; // Ajuste o caminho se necessário

type OrderStatus = Database['public']['Enums']['order_status'];

function PainelCozinha() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const { showSuccess, showError, ToastContainer } = useToast();

  const fetchOrders = async () => {
    // Apenas mostra o loader na carga inicial
    if (isLoading) {
        const result = await getOrdersByStatus(['confirmado', 'preparando']);
        if (result.success && result.data) {
            setOrders(result.data);
        } else {
            setError(result.error || 'Falha ao buscar pedidos.');
        }
        setIsLoading(false);
    } else { // Atualizações subsequentes são silenciosas
        const result = await getOrdersByStatus(['confirmado', 'preparando']);
        if (result.success && result.data) {
            setOrders(result.data);
        }
    }
  };

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 15000); // Atualiza a cada 15 segundos
    return () => clearInterval(intervalId);
  }, []);

  const handleUpdateStatus = async (orderId: number, newStatus: OrderStatus) => {
    const originalOrders = [...orders];
    
    // Atualização otimista da UI
    setOrders(prevOrders => prevOrders.filter(o => o.id !== orderId));

    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      showSuccess('Status atualizado!', `Pedido #${orderId} agora está ${newStatus}.`);
      await fetchOrders(); 
    } else {
      showError('Erro!', result.error || 'Não foi possível atualizar o status.');
      setOrders(originalOrders); // Reverte em caso de erro
    }
  };

  const { itemsByCategory, categories } = useMemo(() => {
    const itemsByCategory: { [key: string]: any[] } = { 'Todos': [] };
    const categorySet = new Set<string>(['Todos']);

    orders.forEach(order => {
      order.order_items.forEach(item => {
        const categoryName = (item.menu_items as any)?.categoria || item.menu_items?.nome || 'Outros';
        categorySet.add(categoryName);
        if (!itemsByCategory[categoryName]) {
          itemsByCategory[categoryName] = [];
        }
        
        const itemData = {
          ...item,
          orderId: order.id,
          tableNumber: order.tables?.numero,
          orderStatus: order.status,
        };

        itemsByCategory[categoryName].push(itemData);
        itemsByCategory['Todos'].push(itemData);
      });
    });
    return { itemsByCategory, categories: Array.from(categorySet) };
  }, [orders]);

  const filteredItems = itemsByCategory[activeCategory] || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col justify-center items-center h-64 bg-red-50 rounded-lg">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <p className="mt-2 text-red-700 font-semibold">Erro ao carregar o painel</p>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Painel da Cozinha</h1>
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
              <span className="ml-2 text-sm">({itemsByCategory[category]?.length || 0})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-900">{item.menu_items?.nome}</h3>
                <span className="text-2xl font-bold">x{item.quantidade}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Mesa {item.tableNumber} - Pedido #{item.orderId}</p>
              {item.observacoes && (
                <p className="text-sm bg-yellow-50 p-2 rounded-md border border-yellow-200 text-yellow-800">
                  Obs: {item.observacoes}
                </p>
              )}
            </div>
            <div className="mt-4">
              {item.orderStatus === 'confirmado' && (
                <button
                  onClick={() => handleUpdateStatus(item.orderId, 'preparando')}
                  className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium flex items-center justify-center"
                >
                  <ChefHat className="h-4 w-4 mr-2" />
                  Iniciar Preparo
                </button>
              )}
              {item.orderStatus === 'preparando' && (
                <button
                  onClick={() => handleUpdateStatus(item.orderId, 'pronto')}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Marcar como Pronto
                </button>
              )}
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="lg:col-span-3 text-center py-16">
            <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum item para preparar</h3>
            <p className="text-gray-600">
              Todos os pedidos da categoria "{activeCategory}" estão em dia.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PainelCozinha;