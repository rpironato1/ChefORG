import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, Calendar, TrendingUp, DollarSign, Users, ShoppingCart } from 'lucide-react';

const mockVendasData = [
  { name: 'Jan', vendas: 12000, pedidos: 150 },
  { name: 'Fev', vendas: 19000, pedidos: 200 },
  { name: 'Mar', vendas: 15000, pedidos: 180 },
  { name: 'Abr', vendas: 22000, pedidos: 280 },
  { name: 'Mai', vendas: 25000, pedidos: 320 },
  { name: 'Jun', vendas: 28000, pedidos: 350 },
];

const mockCategoriasData = [
  { name: 'Pratos Principais', value: 45, color: '#3b82f6' },
  { name: 'Bebidas', value: 25, color: '#10b981' },
  { name: 'Sobremesas', value: 15, color: '#f59e0b' },
  { name: 'Entradas', value: 10, color: '#ef4444' },
  { name: 'Lanches', value: 5, color: '#8b5cf6' },
];

const mockFuncionariosData = [
  { name: 'João', vendas: 8500 },
  { name: 'Maria', vendas: 12000 },
  { name: 'Pedro', vendas: 6200 },
  { name: 'Ana', vendas: 9800 },
  { name: 'Carlos', vendas: 7500 },
];

const mockHorariosData = [
  { horario: '11:00', pedidos: 5 },
  { horario: '12:00', pedidos: 18 },
  { horario: '13:00', pedidos: 25 },
  { horario: '14:00', pedidos: 12 },
  { horario: '18:00', pedidos: 15 },
  { horario: '19:00', pedidos: 32 },
  { horario: '20:00', pedidos: 28 },
  { horario: '21:00', pedidos: 18 },
];

function Relatorios() {
  const [selectedPeriod, setSelectedPeriod] = useState('mensal');

  const periodOptions = [
    { value: 'diario', label: 'Diário' },
    { value: 'semanal', label: 'Semanal' },
    { value: 'mensal', label: 'Mensal' },
    { value: 'anual', label: 'Anual' },
  ];

  const metricas = [
    {
      title: 'Receita Total',
      value: 'R$ 156.780',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Pedidos Totais',
      value: '1.847',
      change: '+8.2%',
      changeType: 'positive',
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      title: 'Ticket Médio',
      value: 'R$ 84.90',
      change: '+3.1%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      title: 'Clientes Únicos',
      value: '892',
      change: '+15.7%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-1">
            Análise detalhada do desempenho do restaurante
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input-field"
          >
            {periodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button className="btn-primary">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Métricas Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricas.map((metrica, index) => {
          const Icon = metrica.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{metrica.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metrica.value}</p>
                  <p className="text-sm text-green-600 mt-1">{metrica.change}</p>
                </div>
                <div className={`p-3 rounded-full ${metrica.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas por Mês */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendas por Mês</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockVendasData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="vendas" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Vendas por Categoria */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendas por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockCategoriasData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {mockCategoriasData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Performance dos Funcionários */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance dos Funcionários</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockFuncionariosData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="vendas" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pedidos por Horário */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pedidos por Horário</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockHorariosData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="horario" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="pedidos" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela de Pratos Mais Vendidos */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Pratos Mais Vendidos</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Margem
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { pos: 1, prato: 'Hambúrguer Artesanal', categoria: 'Lanches', vendas: 245, receita: 7080.50, margem: 65 },
                { pos: 2, prato: 'Risotto de Camarão', categoria: 'Pratos Principais', vendas: 189, receita: 8599.50, margem: 72 },
                { pos: 3, prato: 'Pasta ao Pesto', categoria: 'Pratos Principais', vendas: 156, receita: 5053.40, margem: 68 },
                { pos: 4, prato: 'Tiramisu', categoria: 'Sobremesas', vendas: 142, receita: 2400.38, margem: 78 },
                { pos: 5, prato: 'Suco de Laranja', categoria: 'Bebidas', vendas: 298, receita: 2533.00, margem: 82 },
              ].map((item) => (
                <tr key={item.pos} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.pos}º</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.prato}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {item.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.vendas}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">R$ {item.receita.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600">{item.margem}%</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights Principais</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Crescimento Consistente</p>
                <p className="text-sm text-gray-600">Vendas aumentaram 12.5% em relação ao mês anterior</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Horário de Pico</p>
                <p className="text-sm text-gray-600">19h às 20h concentram 40% dos pedidos</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Categoria Líder</p>
                <p className="text-sm text-gray-600">Pratos Principais respondem por 45% das vendas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendações</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Otimizar Cardápio</p>
                <p className="text-sm text-gray-600">Considere remover itens com baixa margem</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Aumentar Equipe</p>
                <p className="text-sm text-gray-600">Reforçar equipe no horário de pico</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Promoções</p>
                <p className="text-sm text-gray-600">Criar ofertas para horários de baixo movimento</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Relatorios; 