import { useState } from 'react';
import { Plus, Edit, Trash2, User, Mail, Phone, Calendar } from 'lucide-react';

interface Funcionario {
  id: string;
  nome: string;
  cargo: 'garcom' | 'cozinheiro' | 'gerente' | 'caixa';
  email: string;
  telefone: string;
  status: 'ativo' | 'inativo';
  dataAdmissao: string;
  salario?: number;
}

const mockFuncionarios: Funcionario[] = [
  {
    id: '1',
    nome: 'João Silva',
    cargo: 'garcom',
    email: 'joao@restaurant.com',
    telefone: '(11) 99999-1234',
    status: 'ativo',
    dataAdmissao: '2023-01-15',
    salario: 2500,
  },
  {
    id: '2',
    nome: 'Maria Santos',
    cargo: 'cozinheiro',
    email: 'maria@restaurant.com',
    telefone: '(11) 99999-5678',
    status: 'ativo',
    dataAdmissao: '2023-02-20',
    salario: 3200,
  },
  {
    id: '3',
    nome: 'Pedro Oliveira',
    cargo: 'gerente',
    email: 'pedro@restaurant.com',
    telefone: '(11) 99999-9012',
    status: 'ativo',
    dataAdmissao: '2022-11-10',
    salario: 4500,
  },
  {
    id: '4',
    nome: 'Ana Costa',
    cargo: 'garcom',
    email: 'ana@restaurant.com',
    telefone: '(11) 99999-3456',
    status: 'ativo',
    dataAdmissao: '2023-03-05',
    salario: 2500,
  },
  {
    id: '5',
    nome: 'Carlos Pereira',
    cargo: 'caixa',
    email: 'carlos@restaurant.com',
    telefone: '(11) 99999-7890',
    status: 'inativo',
    dataAdmissao: '2023-01-20',
    salario: 2800,
  },
];

const cargos = ['Todos', 'garcom', 'cozinheiro', 'gerente', 'caixa'];

function Funcionarios() {
  const [funcionarios] = useState<Funcionario[]>(mockFuncionarios);
  const [selectedCargo, setSelectedCargo] = useState('Todos');
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFuncionarios = funcionarios.filter(func => {
    const matchesCargo = selectedCargo === 'Todos' || func.cargo === selectedCargo;
    const matchesSearch =
      func.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      func.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCargo && matchesSearch;
  });

  const getCargoColor = (cargo: string) => {
    switch (cargo) {
      case 'garcom':
        return 'bg-blue-100 text-blue-700';
      case 'cozinheiro':
        return 'bg-green-100 text-green-700';
      case 'gerente':
        return 'bg-purple-100 text-purple-700';
      case 'caixa':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCargoLabel = (cargo: string) => {
    switch (cargo) {
      case 'garcom':
        return 'Garçom';
      case 'cozinheiro':
        return 'Cozinheiro';
      case 'gerente':
        return 'Gerente';
      case 'caixa':
        return 'Caixa';
      default:
        return cargo;
    }
  };

  const handleEditFuncionario = (funcionario: Funcionario) => {
    setSelectedFuncionario(funcionario);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleNewFuncionario = () => {
    setSelectedFuncionario({
      id: '',
      nome: '',
      cargo: 'garcom',
      email: '',
      telefone: '',
      status: 'ativo',
      dataAdmissao: new Date().toISOString().split('T')[0],
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const getCargoStats = () => {
    const stats = cargos.slice(1).map(cargo => ({
      cargo,
      total: funcionarios.filter(f => f.cargo === cargo).length,
      ativos: funcionarios.filter(f => f.cargo === cargo && f.status === 'ativo').length,
    }));
    return stats;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Funcionários</h1>
          <p className="text-gray-600 mt-1">Gerencie a equipe do restaurante</p>
        </div>
        <button onClick={handleNewFuncionario} className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Novo Funcionário
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar funcionários..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {cargos.map(cargo => (
            <button
              key={cargo}
              onClick={() => setSelectedCargo(cargo)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCargo === cargo
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cargo === 'Todos' ? 'Todos' : getCargoLabel(cargo)}
            </button>
          ))}
        </div>
      </div>

      {/* Cargo Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {getCargoStats().map(stat => (
          <div key={stat.cargo} className="card">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{getCargoLabel(stat.cargo)}</div>
              <div className="text-sm text-gray-600 mt-1">
                {stat.ativos}/{stat.total} ativos
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${stat.total > 0 ? (stat.ativos / stat.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Funcionários Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFuncionarios.map(funcionario => (
          <div key={funcionario.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{funcionario.nome}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getCargoColor(funcionario.cargo)}`}
                  >
                    {getCargoLabel(funcionario.cargo)}
                  </span>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  funcionario.status === 'ativo'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {funcionario.status === 'ativo' ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{funcionario.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{funcionario.telefone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  Admissão: {new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}
                </span>
              </div>
              {funcionario.salario && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Salário: </span>
                  R$ {funcionario.salario.toFixed(2)}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleEditFuncionario(funcionario)}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add/Edit Funcionario */}
      {isModalOpen && selectedFuncionario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {isEditing ? 'Editar Funcionário' : 'Novo Funcionário'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={selectedFuncionario.nome}
                  onChange={e =>
                    setSelectedFuncionario({ ...selectedFuncionario, nome: e.target.value })
                  }
                  className="input-field"
                  placeholder="Ex: João Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                <select
                  value={selectedFuncionario.cargo}
                  onChange={e =>
                    setSelectedFuncionario({
                      ...selectedFuncionario,
                      cargo: e.target.value as Funcionario['cargo'],
                    })
                  }
                  className="input-field"
                >
                  <option value="garcom">Garçom</option>
                  <option value="cozinheiro">Cozinheiro</option>
                  <option value="gerente">Gerente</option>
                  <option value="caixa">Caixa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={selectedFuncionario.email}
                  onChange={e =>
                    setSelectedFuncionario({ ...selectedFuncionario, email: e.target.value })
                  }
                  className="input-field"
                  placeholder="funcionario@restaurant.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  type="tel"
                  value={selectedFuncionario.telefone}
                  onChange={e =>
                    setSelectedFuncionario({ ...selectedFuncionario, telefone: e.target.value })
                  }
                  className="input-field"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Admissão
                </label>
                <input
                  type="date"
                  value={selectedFuncionario.dataAdmissao}
                  onChange={e =>
                    setSelectedFuncionario({ ...selectedFuncionario, dataAdmissao: e.target.value })
                  }
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salário (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={selectedFuncionario.salario || ''}
                  onChange={e =>
                    setSelectedFuncionario({
                      ...selectedFuncionario,
                      salario: parseFloat(e.target.value),
                    })
                  }
                  className="input-field"
                  placeholder="2500.00"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedFuncionario.status}
                  onChange={e =>
                    setSelectedFuncionario({
                      ...selectedFuncionario,
                      status: e.target.value as Funcionario['status'],
                    })
                  }
                  className="input-field"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="btn-secondary">
                Cancelar
              </button>
              <button onClick={() => setIsModalOpen(false)} className="btn-primary">
                {isEditing ? 'Salvar Alterações' : 'Criar Funcionário'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Funcionarios;
