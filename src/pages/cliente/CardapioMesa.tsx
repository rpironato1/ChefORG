import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Search,
  Utensils,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { useMesa } from '../../contexts/AppContext';
import { useToast } from '../../components/ui/Toast';
import CardMenuItem from '../../components/ui/CardMenuItem';
import { getMenuWithItems, CategoryWithItems } from '../../lib/api/menu';
import { createOrder } from '../../lib/api/orders';
import { Database } from '../../lib/supabase';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];

interface CarrinhoItem {
  item: MenuItem;
  quantidade: number;
  observacoes: string;
}

function CardapioMesa() {
  const { numeroMesa } = useParams<{ numeroMesa: string }>();
  const { mesaAtual } = useMesa();
  const { showSuccess, showError, ToastContainer } = useToast();
  const navigate = useNavigate();

  const [menu, setMenu] = useState<CategoryWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [categoriaAtiva, setCategoriaAtiva] = useState('Todas');
  const [busca, setBusca] = useState('');
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
  const [showCarrinho, setShowCarrinho] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!mesaAtual.isAutorizado || !numeroMesa) {
      // navigate(`/mesa/${numeroMesa}/pin`); // Descomentar em produção
    }

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
  }, [mesaAtual.isAutorizado, numeroMesa, navigate]);

  const allCategories = ['Todas', ...menu.map(cat => cat.nome)];

  const itemsFiltrados = menu
    .map(category => ({
      ...category,
      menu_items: category.menu_items.filter(
        item =>
          (item.nome.toLowerCase().includes(busca.toLowerCase()) ||
            (item.descricao && item.descricao.toLowerCase().includes(busca.toLowerCase()))) &&
          item.disponivel
      ),
    }))
    .filter(
      category =>
        (categoriaAtiva === 'Todas' || category.nome === categoriaAtiva) &&
        category.menu_items.length > 0
    );

  const getQuantidadeNoCarrinho = (itemId: number) => {
    const itemCarrinho = carrinho.find(c => c.item.id === itemId);
    return itemCarrinho?.quantidade || 0;
  };

  const adicionarItem = (item: MenuItem) => {
    setCarrinho(prev => {
      const existente = prev.find(c => c.item.id === item.id);
      if (existente) {
        return prev.map(c => (c.item.id === item.id ? { ...c, quantidade: c.quantidade + 1 } : c));
      } else {
        return [...prev, { item, quantidade: 1, observacoes: '' }];
      }
    });
  };

  const removerItem = (item: MenuItem) => {
    setCarrinho(prev => {
      const existente = prev.find(c => c.item.id === item.id);
      if (existente && existente.quantidade > 1) {
        return prev.map(c => (c.item.id === item.id ? { ...c, quantidade: c.quantidade - 1 } : c));
      } else {
        return prev.filter(c => c.item.id !== item.id);
      }
    });
  };

  const getTotalCarrinho = () => {
    return carrinho.reduce((total, item) => total + Number(item.item.preco) * item.quantidade, 0);
  };

  const getQuantidadeTotalItens = () => {
    return carrinho.reduce((total, item) => total + item.quantidade, 0);
  };

  const handleConfirmarPedido = async () => {
    if (carrinho.length === 0) {
      showError('Carrinho Vazio', 'Adicione itens ao carrinho antes de confirmar');
      return;
    }

    setIsSubmitting(true);
    try {
      const tableId = parseInt(numeroMesa!, 10);
      const orderItems = carrinho.map(c => ({
        menu_item_id: c.item.id,
        quantidade: c.quantidade,
        observacoes: c.observacoes,
        preco_unitario: Number(c.item.preco),
      }));

      const result = await createOrder(tableId, orderItems);

      if (result.success && result.data) {
        showSuccess('Pedido Enviado!', 'Seu pedido foi enviado para a cozinha.');
        setCarrinho([]);
        setShowCarrinho(false);
        navigate(`/mesa/${numeroMesa}/acompanhar-pedido/${result.data.id}`);
      } else {
        showError('Erro no Pedido', result.error || 'Não foi possível confirmar o pedido.');
      }
    } catch (err) {
      showError('Erro de Conexão', 'Não foi possível se conectar ao servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col justify-center items-center h-64 bg-red-50 rounded-lg">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <p className="mt-2 text-red-700 font-semibold">Erro ao carregar o cardápio</p>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
              <ArrowLeft className="h-5 w-5 mr-2" /> Sair
            </Link>
            <button
              onClick={() => setShowCarrinho(true)}
              className="relative bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">Carrinho</span>
              {getQuantidadeTotalItens() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getQuantidadeTotalItens()}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="relative max-w-md mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar pratos..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {allCategories.map(categoria => (
              <button
                key={categoria}
                onClick={() => setCategoriaAtiva(categoria)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${categoriaAtiva === categoria ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>

        {itemsFiltrados.map(category => (
          <div key={category.id}>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">{category.nome}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.menu_items.map(item => {
                // Mapear item do banco para tipo MenuItem
                const menuItem: MenuItem = {
                  id: item.id,
                  nome: item.nome,
                  descricao: item.descricao,
                  preco: item.preco,
                  categoria: item.categoria,
                  disponivel: item.disponivel,
                  tempo_preparo: item.tempo_preparo,
                  ingredientes: item.ingredientes,
                  imagem: item.imagem,
                  restricoes: item.restricoes,
                };
                return (
                  <CardMenuItem
                    key={item.id}
                    item={menuItem}
                    quantidade={getQuantidadeNoCarrinho(item.id.toString())}
                    onAdicionar={item => adicionarItem({ ...item, id: item.id.toString() })}
                    onRemover={item => removerItem({ ...item, id: item.id.toString() })}
                    showControles={true}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {itemsFiltrados.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <Utensils className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum prato encontrado</h3>
            <p className="text-gray-600">
              Tente ajustar sua busca ou selecionar uma categoria diferente.
            </p>
          </div>
        )}
      </div>

      {showCarrinho && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Seu Pedido</h2>
              <button
                onClick={() => setShowCarrinho(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {carrinho.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Seu carrinho está vazio</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {carrinho.map(carrinhoItem => (
                    <div
                      key={carrinhoItem.item.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{carrinhoItem.item.nome}</h4>
                        <p className="text-sm text-gray-600">
                          R$ {Number(carrinhoItem.item.preco).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => removerItem(carrinhoItem.item)}
                          className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-medium min-w-[2rem] text-center">
                          {carrinhoItem.quantidade}
                        </span>
                        <button
                          onClick={() => adicionarItem(carrinhoItem.item)}
                          className="p-1 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-right ml-4 w-20">
                        <p className="font-bold text-primary-600">
                          R${' '}
                          {(Number(carrinhoItem.item.preco) * carrinhoItem.quantidade).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {carrinho.length > 0 && (
              <div className="border-t p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    R$ {getTotalCarrinho().toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowCarrinho(false)} className="flex-1 btn-secondary">
                    Continuar Pedindo
                  </button>
                  <button
                    onClick={handleConfirmarPedido}
                    disabled={isSubmitting}
                    className="flex-1 btn-primary"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin mx-auto" />
                    ) : (
                      'Confirmar Pedido'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CardapioMesa;
