import { ShoppingCart, DollarSign, Clock, Utensils } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const mockSalesData = [
  { name: 'Seg', vendas: 1200, pedidos: 45 },
  { name: 'Ter', vendas: 1800, pedidos: 67 },
  { name: 'Qua', vendas: 2200, pedidos: 89 },
  { name: 'Qui', vendas: 1900, pedidos: 72 },
  { name: 'Sex', vendas: 3200, pedidos: 124 },
  { name: 'Sáb', vendas: 4100, pedidos: 156 },
  { name: 'Dom', vendas: 3800, pedidos: 142 },
];

const statsCards = [
  {
    title: 'Vendas Hoje',
    value: 'R$ 3.240',
    change: '+12%',
    changeType: 'positive',
    icon: DollarSign,
    color: 'bg-green-500',
  },
  {
    title: 'Pedidos Ativos',
    value: '23',
    change: '+5',
    changeType: 'positive',
    icon: ShoppingCart,
    color: 'bg-blue-500',
  },
  {
    title: 'Mesas Ocupadas',
    value: '18/24',
    change: '75%',
    changeType: 'neutral',
    icon: Utensils,
    color: 'bg-orange-500',
  },
  {
    title: 'Tempo Médio',
    value: '24 min',
    change: '-3 min',
    changeType: 'positive',
    icon: Clock,
    color: 'bg-purple-500',
  },
];

function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Visão geral do seu restaurante - {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Sistema Online</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p
                    className={`text-sm mt-1 ${
                      stat.changeType === 'positive'
                        ? 'text-green-600'
                        : stat.changeType === 'negative'
                          ? 'text-red-600'
                          : 'text-gray-600'
                    }`}
                  >
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendas da Semana</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="vendas" stroke="#f97316" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pedidos por Dia</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="pedidos" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pedidos Recentes</h3>
          <div className="space-y-3">
            {[
              { id: '#001', mesa: '05', status: 'preparando', tempo: '5 min' },
              { id: '#002', mesa: '12', status: 'pronto', tempo: '12 min' },
              { id: '#003', mesa: '08', status: 'entregue', tempo: '18 min' },
              { id: '#004', mesa: '03', status: 'pendente', tempo: '2 min' },
            ].map(pedido => (
              <div
                key={pedido.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="font-medium text-gray-900">{pedido.id}</div>
                  <div className="text-sm text-gray-600">Mesa {pedido.mesa}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pedido.status === 'pronto'
                        ? 'bg-green-100 text-green-700'
                        : pedido.status === 'preparando'
                          ? 'bg-yellow-100 text-yellow-700'
                          : pedido.status === 'entregue'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {pedido.status}
                  </span>
                  <span className="text-sm text-gray-500">{pedido.tempo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mesas Disponíveis</h3>
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 24 }, (_, i) => i + 1).map(mesa => {
              const isOccupied = mesa <= 18;
              const isReserved = mesa === 19 || mesa === 20;

              return (
                <div
                  key={mesa}
                  className={`p-4 rounded-lg border-2 text-center font-medium ${
                    isOccupied
                      ? 'bg-red-100 border-red-200 text-red-700'
                      : isReserved
                        ? 'bg-yellow-100 border-yellow-200 text-yellow-700'
                        : 'bg-green-100 border-green-200 text-green-700'
                  }`}
                >
                  {mesa}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Livre</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Ocupada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">Reservada</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
