import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Clock, Eye, EyeOff, Loader2, AlertTriangle } from 'lucide-react';
import { getMenuWithItems, CategoryWithItems } from '../lib/api/menu';

// O modal pode ser movido para um componente separado para maior clareza
// import MenuItemModal from '../components/admin/MenuItemModal';

function Cardapio() {
  const [menu, setMenu] = useState<CategoryWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getMenuWithItems();
        if (result.success && result.data) {
          setMenu(result.data);
        } else {
          setError(result.error || 'Falha ao carregar o cardápio.');
        }
      } catch (err) {
        setError('Ocorreu um erro de conexão.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const allCategories = ['Todas', ...menu.map(cat => cat.nome)];

  const filteredMenu = menu
    .map(category => ({
      ...category,
      menu_items: category.menu_items.filter(item => 
        item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.descricao && item.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    }))
    .filter(category => 
      (selectedCategory === 'Todas' || category.nome === selectedCategory) &&
      category.menu_items.length > 0
    );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <p className="ml-2 text-gray-600">Carregando cardápio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-red-50 rounded-lg">
        <AlertTriangle className="h-8 w-8 text-red-500" />
        <p className="mt-2 text-red-700 font-semibold">Erro ao carregar cardápio</p>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cardápio</h1>
          <p className="text-gray-600 mt-1">
            Gerencie os itens do seu menu e categorias
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Novo Item
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar itens do cardápio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {allCategories.map(categoria => (
            <button
              key={categoria}
              onClick={() => setSelectedCategory(categoria)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === categoria
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      {filteredMenu.map(category => (
        <div key={category.id}>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">{category.nome}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.menu_items.map(item => (
              <div key={item.id} className="card relative">
                {!item.disponivel && (
                  <div className="absolute top-4 right-4 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                    Indisponível
                  </div>
                )}
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.nome}</h3>
                  <p className="text-gray-600 text-sm mb-3">{item.descricao}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-primary-600">
                      R$ {Number(item.preco).toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{item.tempo_preparo} min</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <button
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      item.disponivel
                        ? 'text-green-700 bg-green-50 hover:bg-green-100'
                        : 'text-red-700 bg-red-50 hover:bg-red-100'
                    }`}
                  >
                    {item.disponivel ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    {item.disponivel ? 'Disponível' : 'Indisponível'}
                  </button>

                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Cardapio; 