import { useState } from 'react';
import { Plus, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

interface PedidoItem {
  id: string;
  nome: string;
  quantidade: number;
  preco: number;
  observacoes?: string;
  status: 'pendente' | 'preparando' | 'pronto';
}

interface Pedido {
  id: string;
  mesa: number;
  itens: PedidoItem[];
  status: 'pendente' | 'preparando' | 'pronto' | 'entregue' | 'cancelado';
  garcom: string;
  dataHora: string;
  total: number;
  observacoes?: string;
  tempoEspera?: number;
}

const mockPedidos: Pedido[] = [
  {
    id: '#001',
    mesa: 5,
    itens: [
      { id: '1', nome: 'Hambúrguer Artesanal', quantidade: 2, preco: 28.9, status: 'preparando' },
      { id: '2', nome: 'Suco de Laranja', quantidade: 2, preco: 8.5, status: 'pronto' },
    ],
    status: 'preparando',
    garcom: 'João',
    dataHora: '14:30',
    total: 74.8,
    tempoEspera: 15,
  },
  {
    id: '#002',
    mesa: 12,
    itens: [
      { id: '3', nome: 'Risotto de Camarão', quantidade: 1, preco: 45.5, status: 'pronto' },
      { id: '4', nome: 'Tiramisu', quantidade: 1, preco: 16.9, status: 'pronto' },
    ],
    status: 'pronto',
    garcom: 'Maria',
    dataHora: '14:45',
    total: 62.4,
    tempoEspera: 25,
  },
  {
    id: '#003',
    mesa: 8,
    itens: [
      { id: '5', nome: 'Pasta ao Pesto', quantidade: 1, preco: 32.4, status: 'pendente' },
      { id: '6', nome: 'Salada Caesar', quantidade: 1, preco: 22.8, status: 'pendente' },
    ],
    status: 'pendente',
    garcom: 'Pedro',
    dataHora: '15:12',
    total: 55.2,
    tempoEspera: 2,
  },
  {
    id: '#004',
    mesa: 3,
    itens: [
      { id: '7', nome: 'Hambúrguer Artesanal', quantidade: 1, preco: 28.9, status: 'preparando' },
    ],
    status: 'preparando',
    garcom: 'Ana',
    dataHora: '15:20',
    total: 28.9,
    tempoEspera: 8,
  },
];

function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>(mockPedidos);
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusOptions = [
    { value: 'todos', label: 'Todos', count: pedidos.length },
    {
      value: 'pendente',
      label: 'Pendentes',
      count: pedidos.filter(p => p.status === 'pendente').length,
    },
    {
      value: 'preparando',
      label: 'Preparando',
      count: pedidos.filter(p => p.status === 'preparando').length,
    },
    { value: 'pronto', label: 'Prontos', count: pedidos.filter(p => p.status === 'pronto').length },
    {
      value: 'entregue',
      label: 'Entregues',
      count: pedidos.filter(p => p.status === 'entregue').length,
    },
    {
      value: 'cancelado',
      label: 'Cancelados',
      count: pedidos.filter(p => p.status === 'cancelado').length,
    },
  ];

  const filteredPedidos =
    selectedStatus === 'todos' ? pedidos : pedidos.filter(p => p.status === selectedStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'preparando':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pronto':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'entregue':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'cancelado':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'preparando':
        return 'Preparando';
      case 'pronto':
        return 'Pronto';
      case 'entregue':
        return 'Entregue';
      case 'cancelado':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  const handleStatusChange = (pedidoId: string, newStatus: Pedido['status']) => {
    setPedidos(
      pedidos.map(pedido => (pedido.id === pedidoId ? { ...pedido, status: newStatus } : pedido))
    );
  };

  const handleViewPedido = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setIsModalOpen(true);
  };

  const getUrgencyColor = (tempoEspera: number) => {
    if (tempoEspera > 30) return 'text-red-600';
    if (tempoEspera > 20) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-600 mt-1">Acompanhe e gerencie todos os pedidos do restaurante</p>
        </div>
        <button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Novo Pedido
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-3">
        {statusOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setSelectedStatus(option.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              selectedStatus === option.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {option.label}
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                selectedStatus === option.value ? 'bg-primary-700' : 'bg-gray-200'
              }`}
            >
              {option.count}
            </span>
          </button>
        ))}
      </div>

      {/* Pedidos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPedidos.map(pedido => (
          <div key={pedido.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{pedido.id}</h3>
                <p className="text-sm text-gray-600">
                  Mesa {pedido.mesa} • {pedido.garcom}
                </p>
                <p className="text-xs text-gray-500 mt-1">{pedido.dataHora}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(pedido.status)}`}
                >
                  {getStatusText(pedido.status)}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {pedido.itens.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {item.quantidade}x {item.nome}
                    </div>
                    {item.observacoes && (
                      <div className="text-xs text-gray-500 mt-1">Obs: {item.observacoes}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      R$ {(item.preco * item.quantidade).toFixed(2)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}
                    >
                      {getStatusText(item.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div>
                <div className="text-lg font-bold text-gray-900">
                  Total: R$ {pedido.total.toFixed(2)}
                </div>
                <div
                  className={`text-sm flex items-center gap-1 ${getUrgencyColor(pedido.tempoEspera || 0)}`}
                >
                  <Clock className="h-4 w-4" />
                  {pedido.tempoEspera} min
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewPedido(pedido)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </button>
                {pedido.status === 'pendente' && (
                  <button
                    onClick={() => handleStatusChange(pedido.id, 'preparando')}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                )}
                {pedido.status === 'preparando' && (
                  <button
                    onClick={() => handleStatusChange(pedido.id, 'pronto')}
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                )}
                {pedido.status === 'pronto' && (
                  <button
                    onClick={() => handleStatusChange(pedido.id, 'entregue')}
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                )}
                <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Pedido Details */}
      {isModalOpen && selectedPedido && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Detalhes do Pedido {selectedPedido.id}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Informações Gerais</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Mesa:</span> {selectedPedido.mesa}
                  </div>
                  <div>
                    <span className="font-medium">Garçom:</span> {selectedPedido.garcom}
                  </div>
                  <div>
                    <span className="font-medium">Horário:</span> {selectedPedido.dataHora}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedPedido.status)}`}
                    >
                      {getStatusText(selectedPedido.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Resumo</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Total de Itens:</span>{' '}
                    {selectedPedido.itens.length}
                  </div>
                  <div>
                    <span className="font-medium">Valor Total:</span> R${' '}
                    {selectedPedido.total.toFixed(2)}
                  </div>
                  <div>
                    <span className="font-medium">Tempo de Espera:</span>{' '}
                    {selectedPedido.tempoEspera} min
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Itens do Pedido</h3>
              <div className="space-y-3">
                {selectedPedido.itens.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.nome}</div>
                      <div className="text-sm text-gray-600">Quantidade: {item.quantidade}</div>
                      {item.observacoes && (
                        <div className="text-sm text-gray-500 mt-1">
                          Observações: {item.observacoes}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        R$ {(item.preco * item.quantidade).toFixed(2)}
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}
                      >
                        {getStatusText(item.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedPedido.observacoes && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Observações</h3>
                <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                  {selectedPedido.observacoes}
                </p>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <select
                  value={selectedPedido.status}
                  onChange={e =>
                    handleStatusChange(selectedPedido.id, e.target.value as Pedido['status'])
                  }
                  className="input-field text-sm"
                >
                  <option value="pendente">Pendente</option>
                  <option value="preparando">Preparando</option>
                  <option value="pronto">Pronto</option>
                  <option value="entregue">Entregue</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setIsModalOpen(false)} className="btn-secondary">
                  Fechar
                </button>
                <button className="btn-primary">Salvar Alterações</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pedidos;
