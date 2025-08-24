import React from 'react';
import { useParams } from 'react-router-dom';

const CardapioPage: React.FC = () => {
  const params = useParams();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Cardapio - Em Desenvolvimento
      </h1>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          Esta página está em desenvolvimento e será implementada em breve.
        </p>
        {params.numeroMesa && (
          <p className="mt-2 text-sm text-yellow-700">
            Mesa: {params.numeroMesa}
          </p>
        )}
      </div>
    </div>
  );
};

export default CardapioPage;
