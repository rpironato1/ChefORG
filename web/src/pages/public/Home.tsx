import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Phone, Star, Utensils, Users, Award } from 'lucide-react';

function Home() {
  const destaques = [
    {
      icone: Utensils,
      titulo: 'Culinária Premium',
      descricao: 'Pratos elaborados com ingredientes frescos e técnicas refinadas'
    },
    {
      icone: Users,
      titulo: 'Ambiente Acolhedor',
      descricao: 'Espaço elegante e confortável para momentos especiais'
    },
    {
      icone: Award,
      titulo: 'Prêmios e Reconhecimentos',
      descricao: 'Reconhecido pela excelência em gastronomia e atendimento'
    }
  ];

  const avaliacoes = [
    {
      nome: 'Maria Silva',
      estrelas: 5,
      comentario: 'Experiência incrível! Comida deliciosa e atendimento excepcional.',
      data: '2 dias atrás'
    },
    {
      nome: 'João Santos',
      estrelas: 5,
      comentario: 'Ambiente maravilhoso e pratos surpreendentes. Voltarei com certeza!',
      data: '1 semana atrás'
    },
    {
      nome: 'Ana Costa',
      estrelas: 4,
      comentario: 'Ótima experiência gastronômica. Recomendo para ocasiões especiais.',
      data: '2 semanas atrás'
    }
  ];

  const renderEstrelas = (quantidade: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < quantidade ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header de Navegação */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Utensils className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">ChefORG</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#sobre" className="text-gray-600 hover:text-gray-900">Sobre</a>
              <a href="#cardapio" className="text-gray-600 hover:text-gray-900">Cardápio</a>
              <a href="#contato" className="text-gray-600 hover:text-gray-900">Contato</a>
              <Link 
                to="/reserva" 
                className="btn-primary"
              >
                Reservar Mesa
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Bem-vindos ao ChefORG
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Uma experiência gastronômica única que combina sabores excepcionais 
              com um ambiente sofisticado e acolhedor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/reserva" 
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                <Calendar className="inline-block h-5 w-5 mr-2" />
                Reservar Mesa
              </Link>
              <Link 
                to="/menu" 
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                Ver Cardápio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Destaques */}
      <section className="py-20" id="sobre">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher o ChefORG?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oferecemos uma experiência gastronômica completa, onde cada detalhe 
              é pensado para proporcionar momentos inesquecíveis.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destaques.map((destaque, index) => {
              const Icon = destaque.icone;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-6">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {destaque.titulo}
                  </h3>
                  <p className="text-gray-600">
                    {destaque.descricao}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Informações do Restaurante */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Nossa História
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Fundado em 2015, o ChefORG nasceu da paixão pela gastronomia e do 
                desejo de criar experiências memoráveis. Nossa equipe de chefs 
                especializados trabalha incansavelmente para oferecer pratos 
                únicos e saborosos.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Utilizamos apenas ingredientes frescos e de alta qualidade, 
                combinados com técnicas culinárias modernas para criar uma 
                experiência gastronômica incomparável.
              </p>
              <Link 
                to="/menu" 
                className="btn-primary"
              >
                Conheça nosso Cardápio
              </Link>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Informações
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Endereço</p>
                    <p className="text-gray-600">Rua das Flores, 123 - Centro</p>
                    <p className="text-gray-600">São Paulo - SP</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Funcionamento</p>
                    <p className="text-gray-600">Segunda a Quinta: 11h às 23h</p>
                    <p className="text-gray-600">Sexta e Sábado: 11h às 24h</p>
                    <p className="text-gray-600">Domingo: 11h às 22h</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Contato</p>
                    <p className="text-gray-600">(11) 3333-4444</p>
                    <p className="text-gray-600">contato@cheforg.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avaliações */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-gray-600">
              Avaliações reais de quem já viveu a experiência ChefORG
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {avaliacoes.map((avaliacao, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {avaliacao.nome.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{avaliacao.nome}</h4>
                    <div className="flex items-center">
                      {renderEstrelas(avaliacao.estrelas)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">"{avaliacao.comentario}"</p>
                <p className="text-sm text-gray-500">{avaliacao.data}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para uma experiência única?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Reserve sua mesa agora e descubra por que somos o restaurante 
            favorito de tantas pessoas.
          </p>
          <Link 
            to="/reserva" 
            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Fazer Reserva
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <Utensils className="h-8 w-8 text-primary-400" />
                <span className="ml-2 text-2xl font-bold">ChefORG</span>
              </div>
              <p className="text-gray-400 mb-4">
                Experiência gastronômica única com sabores excepcionais 
                e ambiente sofisticado.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><a href="#sobre" className="text-gray-400 hover:text-white">Sobre</a></li>
                <li><Link to="/menu" className="text-gray-400 hover:text-white">Cardápio</Link></li>
                <li><Link to="/reserva" className="text-gray-400 hover:text-white">Reservas</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contato</h3>
              <ul className="space-y-2 text-gray-400">
                <li>(11) 3333-4444</li>
                <li>contato@cheforg.com</li>
                <li>Rua das Flores, 123</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ChefORG. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home; 