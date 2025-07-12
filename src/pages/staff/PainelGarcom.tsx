import React, { useState, useEffect } from 'react';
import { Clock, Users, CheckCircle, Bell, Utensils, MapPin, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { getAllTables, updateTableStatus } from '../../lib/api/tables';
import { getOrdersByStatus, updateOrderStatus, OrderWithItems } from '../../lib/api/orders';
import { Database } from '../../lib/supabase';

type Table = Database['public']['Tables']['tables']['Row'];
type OrderStatus = Database['public']['Enums']['order_status'];
type TableStatus = Database['public']['Enums']['table_status'];

function PainelGarcom() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pedidos' | 'mesas'>('pedidos');
  const { showSuccess, showError } = useToast();

  const fetchData = async () => {
    // Não mostra o loader em atualizações silenciosas
    if(!isLoading) setIsLoading(true);
    setError(null);
    try {
      const [ordersResult, tablesResult] = await Promise.all([
        getOrdersByStatus(['pronto', 'confirmado', 'preparando', 'entregue']),
        getAllTables()
      ]);

      if (ordersResult.success && ordersResult.data) {
        setOrders(ordersResult.data);
      } else {
        throw new Error(ordersResult.error || "Falha ao buscar pedidos.");
      }

      if (tablesResult.success && tablesResult.data) {
        setTables(tablesResult.data);
      } else {
        throw new Error(tablesResult.error || "Falha ao buscar mesas.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 20000); // Atualiza a cada 20 segundos
    return () => clearInterval(intervalId);
  }, []);

  const handleUpdateOrderStatus = async (orderId: number, status: OrderStatus) => {
    const result = await updateOrderStatus(orderId, status);
    if (result.success) {
      showSuccess("Status do Pedido Atualizado!");
      fetchData();
    } else {
      showError("Erro", result.error);
    }
  };

  const handleUpdateTableStatus = async (tableId: number, status: TableStatus) => {
    const result = await updateTableStatus(tableId, status);
    if (result.success) {
      showSuccess("Status da Mesa Atualizado!");
      fetchData();
    } else {
      showError("Erro", result.error);
    }
  };

  const pedidosProntos = orders.filter(p => p.status === 'pronto');
  const pedidosEmAndamento = orders.filter(p => ['confirmado', 'preparando'].includes(p.status));
  
  const mesasOcupadas = tables.filter(m => m.status === 'ocupada');
  const mesasLimpeza = tables.filter(m => m.status === 'limpeza');

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin" /></div>;
  }

  if (error) {
    return <div className="p-6"><AlertTriangle className="h-8 w-8 text-red-500" /> <p>{error}</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Painel do Garçom</h1>
      
      <div className="mb-6">
        <div className="flex border-b">
          <button onClick={() => setActiveTab('pedidos')} className={`px-6 py-3 font-medium ${activeTab === 'pedidos' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500'}`}>
            Pedidos ({pedidosProntos.length + pedidosEmAndamento.length})
          </button>
          <button onClick={() => setActiveTab('mesas')} className={`px-6 py-3 font-medium ${activeTab === 'mesas' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500'}`}>
            Mesas ({mesasOcupadas.length + mesasLimpeza.length})
          </button>
        </div>
      </div>

      {activeTab === 'pedidos' && (
        <div className="space-y-6">
          {pedidosProntos.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Pedidos Prontos para Entrega</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pedidosProntos.map(pedido => (
                  <div key={pedido.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                    <h3 className="font-bold">Mesa {pedido.tables?.numero} - Pedido #{pedido.id}</h3>
                    <ul>{pedido.order_items.map(item => <li key={item.id}>{item.quantidade}x {item.menu_items?.nome}</li>)}</ul>
                    <button onClick={() => handleUpdateOrderStatus(pedido.id, 'entregue')} className="mt-2 btn-primary w-full">Marcar como Entregue</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {pedidosEmAndamento.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Pedidos em Andamento</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pedidosEmAndamento.map(pedido => (
                  <div key={pedido.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
                    <h3 className="font-bold">Mesa {pedido.tables?.numero} - Pedido #{pedido.id}</h3>
                    <p>Status: {pedido.status}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'mesas' && (
        <div className="space-y-6">
          {mesasOcupadas.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Mesas Ocupadas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mesasOcupadas.map(mesa => (
                  <div key={mesa.id} className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-bold">Mesa {mesa.numero}</h3>
                    <p>Cliente: {mesa.cliente_atual || 'N/A'}</p>
                    <button onClick={() => handleUpdateTableStatus(mesa.id, 'limpeza')} className="mt-2 btn-secondary w-full">Marcar para Limpeza</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {mesasLimpeza.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Mesas para Limpeza</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mesasLimpeza.map(mesa => (
                  <div key={mesa.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
                    <h3 className="font-bold">Mesa {mesa.numero}</h3>
                    <button onClick={() => handleUpdateTableStatus(mesa.id, 'livre')} className="mt-2 btn-primary w-full">Marcar como Limpa</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PainelGarcom;