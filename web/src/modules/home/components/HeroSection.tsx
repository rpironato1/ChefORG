import React from 'react';
import { Calendar, Menu } from 'lucide-react';

interface HeroSectionProps {
  onReserveClick: () => void;
  onMenuClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onReserveClick, onMenuClick }) => {
  return (
    <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Bem-vindos ao ChefORG</h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
          Uma experiência gastronômica única que combina sabores excepcionais com um ambiente
          sofisticado e acolhedor.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
          <button
            onClick={onReserveClick}
            className="w-full sm:w-auto bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold 
                     hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2
                     text-lg shadow-lg"
          >
            <Calendar className="w-5 h-5" />
            Reservar Mesa
          </button>

          <button
            onClick={onMenuClick}
            className="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-lg font-semibold 
                     hover:bg-white hover:text-primary-600 transition-colors duration-200 text-lg"
          >
            Ver Cardápio
          </button>
        </div>
      </div>
    </section>
  );
};
