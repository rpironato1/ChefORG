import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Box, Star, TrendingUp, BookOpen, Loader2, AlertTriangle, Calendar } from 'lucide-react';
import {
  getSalesDashboardData, SalesDashboardData,
  getReservationsDashboardData, ReservationsDashboardData,
  getStockDashboardData, StockDashboardData,
  getLoyaltyDashboardData, LoyaltyDashboardData
} from '../../lib/api/reports';

// --- COMPONENTES DE DASHBOARD ESPECIALIZADOS ---

const MetricCard = ({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) => (
  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-primary-100 text-primary-600 mr-4">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const VendasDashboard = () => {
  const [data, setData] = useState<SalesDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      const endDate = today.toISOString().split('T')[0];
      
      const result = await getSalesDashboardData(startDate, endDate);
      if (result.success && result.data) setData(result.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8" /></div>;
  if (!data) return <div className="text-center p-8"><AlertTriangle className="mx-auto h-8 w-8 text-red-500" /><p>Erro ao carregar dados de vendas.</p></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="Receita do Mês" value={`R$ ${data.totalRevenue.toFixed(2)}`} icon={DollarSign} />
        <MetricCard title="Pedidos do Mês" value={data.totalOrders} icon={TrendingUp} />
        <MetricCard title="Ticket Médio" value={`R$ ${data.averageTicket.toFixed(2)}`} icon={Users} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Vendas ao Longo do Tempo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.salesOverTime || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#ea580c" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Itens Mais Vendidos</h3>
          <ul className="space-y-2">
            {(data.topSellingItems || []).map(item => (
              <li key={item.name} className="flex justify-between p-2 bg-gray-50 rounded">
                <span>{item.name}</span>
                <span className="font-bold">{item.quantity} un.</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const ReservasDashboard = () => {
    const [data, setData] = useState<ReservationsDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        const today = new Date().toISOString().split('T')[0];
        const result = await getReservationsDashboardData(today);
        if (result.success && result.data) setData(result.data);
        setLoading(false);
      };
      fetchData();
    }, []);
  
    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8" /></div>;
    if (!data) return <div className="text-center p-8"><AlertTriangle className="mx-auto h-8 w-8 text-red-500" /><p>Erro ao carregar dados de reservas.</p></div>;
  
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard title="Total de Reservas Hoje" value={data.totalReservations} icon={Calendar} />
          <MetricCard title="Taxa de Ocupação (Reservas)" value={`${data.occupancyRate.toFixed(1)}%`} icon={Users} />
        </div>
        <div>
            <h3 className="font-semibold mb-2">Próximas Reservas</h3>
            <ul className="space-y-2">
                {(data.upcomingReservations || []).map((r, i) => (
                    <li key={i} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>{r.nome_cliente} ({r.pessoas}p)</span>
                        <span className="font-bold">{new Date(r.data_hora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    );
};

const EstoqueDashboard = () => {
    const [data, setData] = useState<StockDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        const result = await getStockDashboardData();
        if (result.success && result.data) setData(result.data);
        setLoading(false);
      };
      fetchData();
    }, []);
  
    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8" /></div>;
    if (!data) return <div className="text-center p-8"><AlertTriangle className="mx-auto h-8 w-8 text-red-500" /><p>Erro ao carregar dados de estoque.</p></div>;
  
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard title="Itens em Estoque" value={data.totalItems} icon={Box} />
            <MetricCard title="Itens com Estoque Baixo" value={data.lowStockItemsCount} icon={AlertTriangle} />
            <MetricCard title="Valor do Estoque" value={`R$ ${data.stockValue.toFixed(2)}`} icon={DollarSign} />
        </div>
        <div>
            <h3 className="font-semibold mb-2">Itens Próximos da Validade (7 dias)</h3>
            <ul className="space-y-2">
                {(data.itemsNearExpiration || []).map((item, i) => (
                    <li key={i} className="flex justify-between p-2 bg-yellow-50 rounded text-yellow-800">
                        <span>{item.nome} ({item.quantidade} un)</span>
                        <span className="font-bold">Vence em: {new Date(item.validade).toLocaleDateString()}</span>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    );
};

const FidelidadeDashboard = () => {
    const [data, setData] = useState<LoyaltyDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        const result = await getLoyaltyDashboardData();
        if (result.success && result.data) setData(result.data);
        setLoading(false);
      };
      fetchData();
    }, []);
  
    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8" /></div>;
    if (!data) return <div className="text-center p-8"><AlertTriangle className="mx-auto h-8 w-8 text-red-500" /><p>Erro ao carregar dados de fidelidade.</p></div>;
  
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard title="Membros Fidelidade" value={data.totalMembers} icon={Users} />
            <MetricCard title="Total de Pontos" value={data.totalPoints} icon={Star} />
        </div>
        <div>
            <h3 className="font-semibold mb-2">Top 5 Clientes</h3>
            <ul className="space-y-2">
                {(data.topClients || []).map((client, i) => (
                    <li key={i} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>{client.nome}</span>
                        <span className="font-bold">{client.pontos} pontos</span>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    );
};

// --- COMPONENTE PRINCIPAL ---

type Tab = 'vendas' | 'reservas' | 'estoque' | 'fidelidade';

const DashboardGerente: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('vendas');

  const renderContent = () => {
    switch (activeTab) {
      case 'vendas': return <VendasDashboard />;
      case 'reservas': return <ReservasDashboard />;
      case 'estoque': return <EstoqueDashboard />;
      case 'fidelidade': return <FidelidadeDashboard />;
      default: return <VendasDashboard />;
    }
  };

  const tabs: { id: Tab, label: string, icon: React.ElementType }[] = [
    { id: 'vendas', label: 'Vendas', icon: TrendingUp },
    { id: 'reservas', label: 'Reservas', icon: BookOpen },
    { id: 'estoque', label: 'Estoque', icon: Box },
    { id: 'fidelidade', label: 'Fidelidade', icon: Star },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Painel do Gerente</h1>
      
      <div className="flex border-b mb-6">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 text-lg font-semibold transition-colors duration-200
                ${activeTab === tab.id 
                  ? 'border-b-2 border-primary-600 text-primary-600' 
                  : 'text-gray-500 hover:text-primary-500'}`
              }
            >
              <Icon className="mr-2" size={20} />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {renderContent()}
      </div>
    </div>
  );
};

export default DashboardGerente; 