import React, { useEffect } from 'react';
import { 
  useReservas, 
  useTables, 
  useMenu, 
  useOrders,
  usePayments 
} from '../modules/shared/hooks';
import { 
  useReservationsStore, 
  useTablesStore,
  useMenuStore,
  useOrdersStore
} from '../modules/shared/stores';
import { 
  ReservationsErrorBoundary,
  TablesErrorBoundary,
  MenuErrorBoundary,
  OrdersErrorBoundary 
} from '../modules/shared/errors';

// Demo component showing Sprint 3 modular architecture
const Sprint3Demo: React.FC = () => {
  // Using modular hooks (local state)
  const reservationsHook = useReservas();
  const tablesHook = useTables();
  const menuHook = useMenu();
  const ordersHook = useOrders();
  const paymentsHook = usePayments();

  // Using Zustand stores (global state with caching)
  const reservationsStore = useReservationsStore();
  const tablesStore = useTablesStore();
  const menuStore = useMenuStore();
  const ordersStore = useOrdersStore();

  useEffect(() => {
    // Demo data initialization
    console.log('🚀 Sprint 3 - Business Logic Modular Demo');
    console.log('📊 Hooks initialized:', {
      reservations: reservationsHook.reservas.length,
      tables: tablesHook.mesas.length,
      menu: menuHook.itensMenu.length,
      orders: ordersHook.pedidos.length,
      payments: paymentsHook.getAllPayments().length
    });
    
    console.log('🏪 Stores initialized:', {
      reservations: reservationsStore.reservas.length,
      tables: tablesStore.mesas.length,
      menu: menuStore.itens.length,
      orders: ordersStore.pedidos.length
    });

    // Demo: Create some test data
    const testMesa = tablesHook.criarMesa({
      numero: 1,
      capacidade: 4
    });
    
    const testMenuItem = menuHook.criarItem({
      nome: 'Pizza Margherita',
      descricao: 'Pizza clássica com molho de tomate, mussarela e manjericão',
      preco: 45.90,
      categoria: 'Pizzas',
      disponivel: true,
      tempo_preparo: 20,
      ingredientes: ['massa', 'molho de tomate', 'mussarela', 'manjericão']
    });

    const testReserva = reservationsHook.criarReserva({
      clienteNome: 'João Silva',
      clienteCpf: '123.456.789-00',
      clienteTelefone: '(11) 99999-9999',
      dataHora: new Date(),
      numeroConvidados: 4,
      restricoes: 'Vegetariano'
    });

    console.log('✅ Test data created:', {
      mesa: testMesa.id,
      menuItem: testMenuItem.id,
      reserva: testReserva.id
    });

    // Demo: Update stores with test data
    tablesStore.addMesa(testMesa);
    menuStore.addItem(testMenuItem);
    reservationsStore.addReserva(testReserva);

  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🚀 Sprint 3: Business Logic Modular
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Reservations Module */}
          <ReservationsErrorBoundary>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-blue-600 mb-4">📅 Reservas</h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Hook Local: {reservationsHook.reservas.length} reservas</p>
                <p className="text-sm text-gray-600">Store Global: {reservationsStore.reservas.length} reservas</p>
                <p className="text-sm text-gray-600">Cache: {Math.floor((Date.now() - reservationsStore.lastUpdated) / 1000)}s ago</p>
              </div>
              <button
                onClick={() => reservationsHook.criarReserva({
                  clienteNome: `Cliente ${Date.now()}`,
                  clienteCpf: '000.000.000-00',
                  clienteTelefone: '(11) 99999-9999',
                  dataHora: new Date(),
                  numeroConvidados: 2
                })}
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Criar Reserva
              </button>
            </div>
          </ReservationsErrorBoundary>

          {/* Tables Module */}
          <TablesErrorBoundary>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-green-600 mb-4">🪑 Mesas</h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Hook Local: {tablesHook.mesas.length} mesas</p>
                <p className="text-sm text-gray-600">Store Global: {tablesStore.mesas.length} mesas</p>
                <p className="text-sm text-gray-600">Cache: {Math.floor((Date.now() - tablesStore.lastUpdated) / 1000)}s ago</p>
              </div>
              <button
                onClick={() => {
                  const mesa = tablesHook.criarMesa({
                    numero: tablesHook.mesas.length + 1,
                    capacidade: Math.floor(Math.random() * 6) + 2
                  });
                  tablesStore.addMesa(mesa);
                }}
                className="mt-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Criar Mesa
              </button>
            </div>
          </TablesErrorBoundary>

          {/* Menu Module */}
          <MenuErrorBoundary>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-orange-600 mb-4">🍽️ Menu</h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Hook Local: {menuHook.itensMenu.length} itens</p>
                <p className="text-sm text-gray-600">Store Global: {menuStore.itens.length} itens</p>
                <p className="text-sm text-gray-600">Cache: {Math.floor((Date.now() - menuStore.lastUpdated) / 1000)}s ago</p>
              </div>
              <button
                onClick={() => {
                  const item = menuHook.criarItem({
                    nome: `Prato ${Date.now()}`,
                    descricao: 'Prato delicioso',
                    preco: Math.random() * 50 + 10,
                    categoria: 'Pratos Principais',
                    disponivel: true,
                    tempo_preparo: 15,
                    ingredientes: ['ingrediente1', 'ingrediente2']
                  });
                  menuStore.addItem(item);
                }}
                className="mt-3 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Criar Item
              </button>
            </div>
          </MenuErrorBoundary>

          {/* Orders Module */}
          <OrdersErrorBoundary>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-purple-600 mb-4">📝 Pedidos</h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Hook Local: {ordersHook.pedidos.length} pedidos</p>
                <p className="text-sm text-gray-600">Store Global: {ordersStore.pedidos.length} pedidos</p>
                <p className="text-sm text-gray-600">Cache: {Math.floor((Date.now() - ordersStore.lastUpdated) / 1000)}s ago</p>
              </div>
              <button
                onClick={() => {
                  const pedido = ordersHook.criarPedido({
                    mesaId: 'MESA-1',
                    itens: [],
                    garcom: 'Garçom 1',
                    total: 0
                  });
                  ordersStore.addPedido(pedido);
                }}
                className="mt-3 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Criar Pedido
              </button>
            </div>
          </OrdersErrorBoundary>

          {/* Payments Module */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-red-600 mb-4">💳 Pagamentos</h2>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Total Payments: {paymentsHook.getAllPayments().length}</p>
              <p className="text-sm text-gray-600">Digital: {paymentsHook.pagamentos.length}</p>
            </div>
            <button
              onClick={() => paymentsHook.criarPagamento({
                pedidoId: 'PED-1',
                valor: 45.90,
                metodo: 'pix'
              })}
              className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Criar Pagamento
            </button>
          </div>

          {/* Cache Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-600 mb-4">⚡ Cache Status</h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Reservations:</span>
                <span className={reservationsStore.lastUpdated ? 'text-green-600' : 'text-red-600'}>
                  {reservationsStore.lastUpdated ? 'Active' : 'Empty'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tables:</span>
                <span className={tablesStore.lastUpdated ? 'text-green-600' : 'text-red-600'}>
                  {tablesStore.lastUpdated ? 'Active' : 'Empty'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Menu:</span>
                <span className={menuStore.lastUpdated ? 'text-green-600' : 'text-red-600'}>
                  {menuStore.lastUpdated ? 'Active' : 'Empty'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Orders:</span>
                <span className={ordersStore.lastUpdated ? 'text-green-600' : 'text-red-600'}>
                  {ordersStore.lastUpdated ? 'Active' : 'Empty'}
                </span>
              </div>
            </div>
            <button
              onClick={async () => {
                const { clearAllCaches } = await import('../modules/shared/stores');
                await clearAllCaches();
                window.location.reload();
              }}
              className="mt-3 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 w-full"
            >
              Clear All Caches
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📋 Sprint 3 Implementation Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-green-600">✅ Completed</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Modular hooks (9 focused hooks)</li>
                <li>Zustand stores with intelligent caching</li>
                <li>Error boundaries per module</li>
                <li>Shared API layer for cross-platform</li>
                <li>Backward compatibility maintained</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600">🎯 Benefits</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Performance optimized with caching</li>
                <li>Better code organization</li>
                <li>Easier testing and maintenance</li>
                <li>Ready for React Native migration</li>
                <li>Robust error handling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sprint3Demo;