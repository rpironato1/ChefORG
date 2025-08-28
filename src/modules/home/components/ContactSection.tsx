import React from 'react';
import { MapPin, Clock, Phone } from 'lucide-react';

interface ContactSectionProps {
  onReserveClick: () => void;
  onMenuClick: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onReserveClick, onMenuClick }) => {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Endereço',
      lines: ['Rua das Flores, 123 - Centro', 'São Paulo - SP'],
    },
    {
      icon: Clock,
      title: 'Funcionamento',
      lines: ['Segunda a Quinta: 11h às 23h', 'Sexta e Sábado: 11h às 24h', 'Domingo: 11h às 22h'],
    },
    {
      icon: Phone,
      title: 'Contato',
      lines: ['(11) 3333-4444', 'contato@cheforg.com'],
    },
  ];

  return (
    <>
      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Nossa História</h2>
              <p className="text-lg text-gray-700 mb-4">
                Fundado em 2015, o ChefORG nasceu da paixão pela gastronomia e do desejo de criar
                experiências memoráveis. Nossa equipe de chefs especializados trabalha
                incansavelmente para oferecer pratos únicos e saborosos.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Utilizamos apenas ingredientes frescos e de alta qualidade, combinados com técnicas
                culinárias modernas para criar uma experiência gastronômica incomparável.
              </p>
              <button
                onClick={onMenuClick}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold 
                         hover:bg-primary-700 transition-colors duration-200"
              >
                Conheça nosso Cardápio
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Informações</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <div key={index} className="flex items-start">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">{info.title}</p>
                        {info.lines.map((line, lineIndex) => (
                          <p key={lineIndex} className="text-gray-600 text-sm">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para uma experiência única?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Reserve sua mesa agora e descubra por que somos o restaurante favorito de tantas
            pessoas.
          </p>
          <button
            onClick={onReserveClick}
            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold 
                     hover:bg-gray-100 transition-colors duration-200 inline-flex items-center gap-2"
          >
            <Phone className="w-5 h-5" />
            Fazer Reserva
          </button>
        </div>
      </section>
    </>
  );
};
