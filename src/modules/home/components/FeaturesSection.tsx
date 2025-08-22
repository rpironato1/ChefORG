import React from 'react';
import { ChefHat, Heart, Award } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: ChefHat,
      title: "Culinária Premium",
      description: "Pratos elaborados com ingredientes frescos e técnicas refinadas"
    },
    {
      icon: Heart,
      title: "Ambiente Acolhedor", 
      description: "Espaço elegante e confortável para momentos especiais"
    },
    {
      icon: Award,
      title: "Prêmios e Reconhecimentos",
      description: "Reconhecido pela excelência em gastronomia e atendimento"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Por que escolher o ChefORG?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Oferecemos uma experiência gastronômica completa, onde cada detalhe 
            é pensado para proporcionar momentos inesquecíveis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                  <IconComponent className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};