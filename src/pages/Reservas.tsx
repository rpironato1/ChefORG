import { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, Clock, Users, Phone } from 'lucide-react';

interface Reserva {
  id: string;
  clienteNome: string;
  clienteTelefone: string;
  mesa: number;
  dataHora: string;
  numeroConvidados: number;
  status: 'confirmada' | 'cancelada' | 'realizada';
  observacoes?: string;
}

const mockReservas: Reserva[] = [
  {
    id: '1',
    clienteNome: 'Maria Silva',
    clienteTelefone: '(11) 99999-1111',
    mesa: 3,
    dataHora: '2024-01-15T19:30',
    numeroConvidados: 4,
    status: 'confirmada',
    observacoes: 'Aniversário - decorar a mesa',
  },
  {
    id: '2',
    clienteNome: 'João Santos',
    clienteTelefone: '(11) 99999-2222',
    mesa: 8,
    dataHora: '2024-01-15T20:00',
    numeroConvidados: 2,
    status: 'confirmada',
  },
  {
    id: '3',
    clienteNome: 'Ana Costa',
    clienteTelefone: '(11) 99999-3333',
    mesa: 12,
    dataHora: '2024-01-16T18:00',
    numeroConvidados: 6,
    status: 'confirmada',
    observacoes: 'Jantar de negócios',
  },
  {
    id: '4',
    clienteNome: 'Pedro Oliveira',
    clienteTelefone: '(11) 99999-4444',
    mesa: 5,
    dataHora: '2024-01-16T19:00',
    numeroConvidados: 3,
    status: 'realizada',
  },
];

function Reservas() {
  const [reservas] = useState<Reserva[]>(mockReservas);
  // const [setReservas] = useState<Reserva[]>(mockReservas); // Para futuro uso com API
  const [selectedStatus, setSelectedStatus] = useState<string>('todas');
  const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = [
    { value: 'todas', label: 'Todas', count: reservas.length },
    {
      value: 'confirmada',
      label: 'Confirmadas',
      count: reservas.filter(r => r.status === 'confirmada').length,
    },
    {
      value: 'realizada',
      label: 'Realizadas',
      count: reservas.filter(r => r.status === 'realizada').length,
    },
    {
      value: 'cancelada',
      label: 'Canceladas',
      count: reservas.filter(r => r.status === 'cancelada').length,
    },
  ];

  const filteredReservas = reservas.filter(reserva => {
    const matchesStatus = selectedStatus === 'todas' || reserva.status === selectedStatus;
    const matchesSearch =
      reserva.clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.clienteTelefone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada':
        return 'bg-green-100 text-green-700';
      case 'realizada':
        return 'bg-blue-100 text-blue-700';
      case 'cancelada':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmada':
        return 'Confirmada';
      case 'realizada':
        return 'Realizada';
      case 'cancelada':
        return 'Cancelada';
      default:
        return 'Desconhecido';
    }
  };

  const handleEditReserva = (reserva: Reserva) => {
    setSelectedReserva(reserva);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleNewReserva = () => {
    setSelectedReserva({
      id: '',
      clienteNome: '',
      clienteTelefone: '',
      mesa: 1,
      dataHora: new Date().toISOString().slice(0, 16),
      numeroConvidados: 2,
      status: 'confirmada',
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservas</h1>
          <p className="text-gray-600 mt-1">Gerencie as reservas do restaurante</p>
        </div>
        <button onClick={handleNewReserva} className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Nova Reserva
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por cliente ou telefone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
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
      </div>

      {/* Reservas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReservas.map(reserva => {
          const { date, time } = formatDateTime(reserva.dataHora);
          return (
            <div key={reserva.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{reserva.clienteNome}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <Phone className="h-3 w-3" />
                    {reserva.clienteTelefone}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reserva.status)}`}
                >
                  {getStatusText(reserva.status)}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{reserva.numeroConvidados} convidados</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Mesa:</span> {reserva.mesa}
                </div>
              </div>

              {reserva.observacoes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Observações:</span> {reserva.observacoes}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEditReserva(reserva)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Add/Edit Reserva */}
      {isModalOpen && selectedReserva && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {isEditing ? 'Editar Reserva' : 'Nova Reserva'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Cliente
                </label>
                <input
                  type="text"
                  value={selectedReserva.clienteNome}
                  onChange={e =>
                    setSelectedReserva({ ...selectedReserva, clienteNome: e.target.value })
                  }
                  className="input-field"
                  placeholder="Ex: Maria Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  type="tel"
                  value={selectedReserva.clienteTelefone}
                  onChange={e =>
                    setSelectedReserva({ ...selectedReserva, clienteTelefone: e.target.value })
                  }
                  className="input-field"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora</label>
                <input
                  type="datetime-local"
                  value={selectedReserva.dataHora}
                  onChange={e =>
                    setSelectedReserva({ ...selectedReserva, dataHora: e.target.value })
                  }
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Convidados
                </label>
                <input
                  type="number"
                  min="1"
                  value={selectedReserva.numeroConvidados}
                  onChange={e =>
                    setSelectedReserva({
                      ...selectedReserva,
                      numeroConvidados: parseInt(e.target.value),
                    })
                  }
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mesa</label>
                <input
                  type="number"
                  min="1"
                  value={selectedReserva.mesa}
                  onChange={e =>
                    setSelectedReserva({ ...selectedReserva, mesa: parseInt(e.target.value) })
                  }
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedReserva.status}
                  onChange={e =>
                    setSelectedReserva({
                      ...selectedReserva,
                      status: e.target.value as Reserva['status'],
                    })
                  }
                  className="input-field"
                >
                  <option value="confirmada">Confirmada</option>
                  <option value="realizada">Realizada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea
                  value={selectedReserva.observacoes || ''}
                  onChange={e =>
                    setSelectedReserva({ ...selectedReserva, observacoes: e.target.value })
                  }
                  className="input-field h-20 resize-none"
                  placeholder="Observações especiais..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="btn-secondary">
                Cancelar
              </button>
              <button onClick={() => setIsModalOpen(false)} className="btn-primary">
                {isEditing ? 'Salvar Alterações' : 'Criar Reserva'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reservas;
