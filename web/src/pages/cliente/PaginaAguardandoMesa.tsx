import React from 'react';

const PaginaAguardandoMesa: React.FC = () => {
  // Dados mocados para visualização
  const posicaoNaFila = 3;
  const tempoEstimado = 15; // em minutos

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="animate-pulse">
          <svg
            className="w-16 h-16 mx-auto text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Aguardando por uma Mesa</h1>
        <p className="text-lg text-gray-600">
          Obrigado por escolher nosso restaurante! Estamos preparando o melhor lugar para você.
        </p>

        <div className="p-6 border-2 border-dashed rounded-lg">
          <div className="mb-4">
            <p className="text-xl font-semibold text-gray-700">Sua posição na fila:</p>
            <p className="text-5xl font-extrabold text-blue-600">{posicaoNaFila}º</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-700">Tempo de espera estimado:</p>
            <p className="text-3xl font-bold text-gray-800">{tempoEstimado} minutos</p>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Você receberá uma notificação por WhatsApp assim que sua mesa estiver pronta.
        </p>
      </div>
    </div>
  );
};

export default PaginaAguardandoMesa;
