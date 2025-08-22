import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Clock, Utensils } from 'lucide-react';
import CardMenuItem from '../../components/ui/CardMenuItem';
import { MenuItem } from '../../types';

const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    nome: 'Hambúrguer Artesanal',
    descricao: 'Hambúrguer de carne bovina 180g com queijo artesanal, alface, tomate, cebola caramelizada e molho especial da casa',
    preco: 28.90,
    categoria: 'Lanches',
    disponivel: true,
    tempo_preparo: 15,
    ingredientes: ['Carne bovina', 'Queijo artesanal', 'Alface', 'Tomate', 'Cebola', 'Molho especial'],
    restricoes: []
  },
  {
    id: '2',
    nome: 'Risotto de Camarão',
    descricao: 'Risotto cremoso preparado com arroz arbóreo, camarões frescos, vinho branco e temperos especiais',
    preco: 45.50,
    categoria: 'Pratos Principais',
    disponivel: true,
    tempo_preparo: 25,
    ingredientes: ['Arroz arbóreo', 'Camarões', 'Vinho branco', 'Cebola', 'Alho', 'Parmesão'],
    restricoes: ['Frutos do mar']
  },
  {
    id: '3',
    nome: 'Salada Caesar Gourmet',
    descricao: 'Alface romana fresca, croutons dourados, lascas de parmesão e molho caesar tradicional',
    preco: 22.80,
    categoria: 'Entradas',
    disponivel: true,
    tempo_preparo: 10,
    ingredientes: ['Alface romana', 'Croutons', 'Parmesão', 'Molho caesar'],
    restricoes: ['Vegetariano']
  },
  {
    id: '4',
    nome: 'Tiramisu da Casa',
    descricao: 'Sobremesa italiana clássica com camadas de biscoito, café, mascarpone e cacau',
    preco: 16.90,
    categoria: 'Sobremesas',
    disponivel: true,
    tempo_preparo: 5,
    ingredientes: ['Mascarpone', 'Café', 'Biscoito', 'Cacau', 'Ovos', 'Açúcar'],
    restricoes: ['Vegetariano', 'Contém lactose', 'Contém glúten']
  },
  {
    id: '5',
    nome: 'Suco Natural de Laranja',
    descricao: 'Suco 100% natural de laranjas selecionadas, extraído na hora',
    preco: 8.50,
    categoria: 'Bebidas',
    disponivel: true,
    tempo_preparo: 3,
    ingredientes: ['Laranja'],
    restricoes: ['Vegano']
  },
  {
    id: '6',
    nome: 'Pasta ao Pesto',
    descricao: 'Massa italiana fresca com molho pesto artesanal de manjericão e pinhões',
    preco: 32.40,
    categoria: 'Pratos Principais',
    disponivel: true,
    tempo_preparo: 18,
    ingredientes: ['Massa', 'Manjericão', 'Pinhões', 'Alho', 'Parmesão', 'Azeite'],
    restricoes: ['Vegetariano', 'Contém glúten']
  },
  {
    id: '7',
    nome: 'Picanha na Brasa',
    descricao: 'Picanha premium grelhada na brasa, acompanha farofa, vinagrete e mandioca',
    preco: 52.90,
    categoria: 'Pratos Principais',
    disponivel: true,
    tempo_preparo: 30,
    ingredientes: ['Picanha', 'Farofa', 'Vinagrete', 'Mandioca'],
    restricoes: []
  },
  {
    id: '8',
    nome: 'Bruschetta Italiana',
    descricao: 'Fatias de pão italiano tostado com tomates frescos, manjericão e azeite extravirgem',
    preco: 18.50,
    categoria: 'Entradas',
    disponivel: true,
    tempo_preparo: 8,
    ingredientes: ['Pão italiano', 'Tomates', 'Manjericão', 'Azeite', 'Alho'],
    restricoes: ['Vegetariano', 'Vegano']
  }
];

const categorias = ['Todas', 'Entradas', 'Pratos Principais', 'Lanches', 'Sobremesas', 'Bebidas'];

function MenuPublico() {
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todas');
  const [busca, setBusca] = useState('');

  const itemsFiltrados = mockMenuItems.filter(item => {
    const matchCategoria = categoriaAtiva === 'Todas' || item.categoria === categoriaAtiva;
    const matchBusca = item.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      item.descricao.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  const getItemsPorCategoria = () => {
    const resultado: { [key: string]: MenuItem[] } = {};
    
    if (categoriaAtiva === 'Todas') {
      categorias.slice(1).forEach(categoria => {
        resultado[categoria] = mockMenuItems.filter(item => 
          item.categoria === categoria && 
          (item.nome.toLowerCase().includes(busca.toLowerCase()) ||
           item.descricao.toLowerCase().includes(busca.toLowerCase()))
        );
      });
    } else {
      resultado[categoriaAtiva] = itemsFiltrados;
    }
    
    return resultado;
  };

  const itemsPorCategoria = getItemsPorCategoria();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
              </Link>
              <div className="flex items-center">
                <Utensils className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">ChefORG</span>
              </div>
            </div>
            <Link 
              to="/reserva" 
              className="btn-primary"
            >
              Reservar Mesa
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-primary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Nosso Cardápio
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Descubra nossa seleção especial de pratos preparados com ingredientes 
            frescos e técnicas culinárias refinadas
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="mb-8">
          {/* Busca */}
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar pratos..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
              />
            </div>
          </div>

          {/* Categorias */}
          <div className="flex flex-wrap justify-center gap-3">
            {categorias.map(categoria => (
              <button
                key={categoria}
                onClick={() => setCategoriaAtiva(categoria)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  categoriaAtiva === categoria
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        {Object.entries(itemsPorCategoria).map(([categoria, items]) => (
          items.length > 0 && (
            <div key={categoria} className="mb-12">
              {categoriaAtiva === 'Todas' && (
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{categoria}</h2>
                  <div className="w-20 h-1 bg-primary-600 rounded"></div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                  <CardMenuItem
                    key={item.id}
                    item={item}
                  />
                ))}
              </div>
            </div>
          )
        ))}

        {/* Nenhum resultado */}
        {itemsFiltrados.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Utensils className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Nenhum prato encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar sua busca ou selecionar uma categoria diferente
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Gostou do que viu?
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Reserve sua mesa agora e experimente nossos pratos deliciosos
          </p>
          <Link 
            to="/reserva" 
            className="btn-primary text-lg px-8 py-4"
          >
            Fazer Reserva
          </Link>
        </div>
      </div>

      {/* Informações Importantes */}
      <div className="bg-primary-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Clock className="h-8 w-8 text-primary-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Funcionamento</h4>
              <p className="text-gray-600 text-sm">
                Segunda a Quinta: 11h às 23h<br />
                Sexta e Sábado: 11h às 24h<br />
                Domingo: 11h às 22h
              </p>
            </div>
            <div>
              <Utensils className="h-8 w-8 text-primary-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Informações</h4>
              <p className="text-gray-600 text-sm">
                Todos os pratos são preparados<br />
                na hora com ingredientes frescos<br />
                Tempos podem variar conforme movimento
              </p>
            </div>
            <div>
              <div className="text-primary-600 mx-auto mb-3">💳</div>
              <h4 className="font-semibold text-gray-900 mb-2">Pagamento</h4>
              <p className="text-gray-600 text-sm">
                Aceitamos dinheiro, cartões<br />
                PIX, Apple Pay, Google Pay<br />
                e Samsung Pay
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer simplificado */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Utensils className="h-6 w-6 text-primary-400" />
            <span className="ml-2 text-xl font-bold">ChefORG</span>
          </div>
          <p className="text-gray-400 mb-4">
            Experiência gastronômica única • (11) 3333-4444
          </p>
          <p className="text-gray-500 text-sm">
            &copy; 2024 ChefORG. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MenuPublico; 