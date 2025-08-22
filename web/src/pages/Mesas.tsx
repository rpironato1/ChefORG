import { useState } from 'react';
import { Plus, Edit, Trash2, Users, Clock, DollarSign } from 'lucide-react';

interface Mesa {
  id: string;
  numero: number;
  capacidade: number;
  status: 'livre' | 'ocupada' | 'reservada' | 'limpeza';
  garcom?: string;
  pedidoAtual?: string;
  tempoOcupacao?: string;
  valorConta?: number;
}

const mockMesas: Mesa[] = [
  { id: '1', numero: 1, capacidade: 4, status: 'ocupada', garcom: 'João', pedidoAtual: '#001', tempoOcupacao: '45 min', valorConta: 89.50 },
  { id: '2', numero: 2, capacidade: 2, status: 'livre', garcom: 'Maria' },
  { id: '3', numero: 3, capacidade: 6, status: 'reservada', garcom: 'Pedro', tempoOcupacao: '19:30' },
  { id: '4', numero: 4, capacidade: 4, status: 'limpeza' },
  { id: '5', numero: 5, capacidade: 8, status: 'ocupada', garcom: 'Ana', pedidoAtual: '#002', tempoOcupacao: '23 min', valorConta: 156.80 },
  { id: '6', numero: 6, capacidade: 2, status: 'livre', garcom: 'Carlos' },
  { id: '7', numero: 7, capacidade: 4, status: 'ocupada', garcom: 'Lucia', pedidoAtual: '#003', tempoOcupacao: '12 min', valorConta: 45.20 },
  { id: '8', numero: 8, capacidade: 6, status: 'livre', garcom: 'Roberto' },
  { id: '9', numero: 9, capacidade: 4, status: 'reservada', garcom: 'Isabel', tempoOcupacao: '20:15' },
  { id: '10', numero: 10, capacidade: 2, status: 'livre', garcom: 'Miguel' },
  { id: '11', numero: 11, capacidade: 8, status: 'ocupada', garcom: 'Fernanda', pedidoAtual: '#004', tempoOcupacao: '67 min', valorConta: 234.90 },
  { id: '12', numero: 12, capacidade: 4, status: 'limpeza' },
];

function Mesas() {
  const [mesas, setMesas] = useState<Mesa[]>(mockMesas);
  const [selectedMesa, setSelectedMesa] = useState<Mesa | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'livre': return 'bg-green-100 border-green-200 text-green-700';
      case 'ocupada': return 'bg-red-100 border-red-200 text-red-700';
      case 'reservada': return 'bg-yellow-100 border-yellow-200 text-yellow-700';
      case 'limpeza': return 'bg-gray-100 border-gray-200 text-gray-700';
      default: return 'bg-gray-100 border-gray-200 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'livre': return 'Livre';
      case 'ocupada': return 'Ocupada';
      case 'reservada': return 'Reservada';
      case 'limpeza': return 'Limpeza';
      default: return 'Desconhecido';
    }
  };

  const handleMesaClick = (mesa: Mesa) => {
    setSelectedMesa(mesa);
    setIsModalOpen(true);
  };

  const handleStatusChange = (mesaId: string, newStatus: Mesa['status']) => {
    setMesas(mesas.map(mesa => 
      mesa.id === mesaId ? { ...mesa, status: newStatus } : mesa
    ));
  };

  const stats = {
    total: mesas.length,
    livres: mesas.filter(m => m.status === 'livre').length,
    ocupadas: mesas.filter(m => m.status === 'ocupada').length,
    reservadas: mesas.filter(m => m.status === 'reservada').length,
    limpeza: mesas.filter(m => m.status === 'limpeza').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Mesas</h1>
          <p className="text-gray-600 mt-1">
            Controle o status e ocupação das mesas do restaurante
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Grade
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Lista
            </button>
          </div>
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Nova Mesa
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.livres}</div>
            <div className="text-sm text-gray-600">Livres</div>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.ocupadas}</div>
            <div className="text-sm text-gray-600">Ocupadas</div>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.reservadas}</div>
            <div className="text-sm text-gray-600">Reservadas</div>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.limpeza}</div>
            <div className="text-sm text-gray-600">Limpeza</div>
          </div>
        </div>
      </div>

      {/* Mesas Grid/List View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {mesas.map((mesa) => (
            <div
              key={mesa.id}
              onClick={() => handleMesaClick(mesa)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${getStatusColor(mesa.status)}`}
            >
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">Mesa {mesa.numero}</div>
                <div className="text-sm mb-2">
                  <Users className="h-4 w-4 inline mr-1" />
                  {mesa.capacidade} pessoas
                </div>
                <div className="text-xs font-medium mb-2">
                  {getStatusText(mesa.status)}
                </div>
                {mesa.garcom && (
                  <div className="text-xs text-gray-600 mb-1">
                    Garçom: {mesa.garcom}
                  </div>
                )}
                {mesa.tempoOcupacao && (
                  <div className="text-xs text-gray-600 mb-1">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {mesa.tempoOcupacao}
                  </div>
                )}
                {mesa.valorConta && (
                  <div className="text-xs font-medium text-green-600">
                    <DollarSign className="h-3 w-3 inline mr-1" />
                    R$ {mesa.valorConta.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mesa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Garçom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tempo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mesas.map((mesa) => (
                  <tr key={mesa.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Mesa {mesa.numero}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{mesa.capacidade} pessoas</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mesa.status)}`}>
                        {getStatusText(mesa.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{mesa.garcom || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{mesa.tempoOcupacao || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {mesa.valorConta ? `R$ ${mesa.valorConta.toFixed(2)}` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Mesa Details */}
      {isModalOpen && selectedMesa && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Mesa {selectedMesa.numero}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={selectedMesa.status}
                  onChange={(e) => handleStatusChange(selectedMesa.id, e.target.value as Mesa['status'])}
                  className="input-field"
                >
                  <option value="livre">Livre</option>
                  <option value="ocupada">Ocupada</option>
                  <option value="reservada">Reservada</option>
                  <option value="limpeza">Limpeza</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacidade
                </label>
                <input
                  type="number"
                  value={selectedMesa.capacidade}
                  className="input-field"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Garçom Responsável
                </label>
                <input
                  type="text"
                  value={selectedMesa.garcom || ''}
                  className="input-field"
                  placeholder="Nome do garçom"
                />
              </div>

              {selectedMesa.valorConta && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor da Conta
                  </label>
                  <input
                    type="text"
                    value={`R$ ${selectedMesa.valorConta.toFixed(2)}`}
                    className="input-field"
                    readOnly
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn-primary"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Mesas; 