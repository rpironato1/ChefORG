import React from 'react';
import { Star } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Maria Silva',
      text: 'Experiência incrível! Comida deliciosa e atendimento excepcional.',
      time: '2 dias atrás',
      rating: 5,
    },
    {
      name: 'João Santos',
      text: 'Ambiente maravilhoso e pratos surpreendentes. Voltarei com certeza!',
      time: '1 semana atrás',
      rating: 5,
    },
    {
      name: 'Ana Costa',
      text: 'Ótima experiência gastronômica. Recomendo para ocasiões especiais.',
      time: '2 semanas atrás',
      rating: 5,
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-lg text-gray-600">
            Avaliações reais de quem já viviu a experiência ChefORG
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <div className="flex items-center mt-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-3 italic">"{testimonial.text}"</p>
              <p className="text-sm text-gray-500">{testimonial.time}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
