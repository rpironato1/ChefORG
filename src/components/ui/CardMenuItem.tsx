import { Clock, Plus, Minus } from 'lucide-react';
import { MenuItem } from '../../types';
import LazyImage from './LazyImage';

interface CardMenuItemProps {
  item: MenuItem;
  quantidade?: number;
  onAdicionar?: (item: MenuItem) => void;
  onRemover?: (item: MenuItem) => void;
  onQuantidadeChange?: (item: MenuItem, quantidade: number) => void;
  showControles?: boolean;
  disabled?: boolean;
}

function CardMenuItem({
  item,
  quantidade = 0,
  onAdicionar,
  onRemover,
  // onQuantidadeChange, // Commented out as it's unused
  showControles = false,
  disabled = false,
}: CardMenuItemProps) {
  const handleAdicionar = () => {
    if (onAdicionar && !disabled) {
      onAdicionar(item);
    }
  };

  const handleRemover = () => {
    if (onRemover && quantidade > 0 && !disabled) {
      onRemover(item);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border transition-all duration-200 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md cursor-pointer'
      } ${!item.disponivel ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}
    >
      {/* Imagem do item (se disponível) */}
      {item.imagem && (
        <div className="relative">
          <LazyImage
            src={item.imagem}
            alt={`Imagem do prato ${item.nome}`}
            className="w-full h-48 rounded-t-lg"
          />
          {!item.disponivel && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-lg">
              <span className="text-white font-medium">Indisponível</span>
            </div>
          )}
        </div>
      )}

      {/* Conteúdo do card */}
      <div className="p-4">
        {/* Header com nome e preço */}
        <div className="flex justify-between items-start mb-2">
          <h3
            className={`text-lg font-semibold ${!item.disponivel ? 'text-gray-500' : 'text-gray-900'}`}
          >
            {item.nome}
          </h3>
          <span
            className={`text-xl font-bold ${!item.disponivel ? 'text-gray-500' : 'text-primary-600'}`}
          >
            R$ {item.preco.toFixed(2)}
          </span>
        </div>

        {/* Descrição */}
        <p className={`text-sm mb-3 ${!item.disponivel ? 'text-gray-400' : 'text-gray-600'}`}>
          {item.descricao}
        </p>

        {/* Informações adicionais */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                !item.disponivel ? 'bg-gray-100 text-gray-500' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {item.categoria}
            </span>
            <div
              className={`flex items-center gap-1 text-xs ${
                !item.disponivel ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              <Clock className="h-3 w-3" />
              <span>{item.tempo_preparo} min</span>
            </div>
          </div>
        </div>

        {/* Restrições */}
        {item.restricoes && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {(Array.isArray(item.restricoes) ? item.restricoes : [item.restricoes]).map(
                (restricao: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
                  >
                    {restricao}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {/* Ingredientes */}
        {item.ingredientes && item.ingredientes.length > 0 && (
          <div className="mb-4">
            <p
              className={`text-xs font-medium mb-1 ${
                !item.disponivel ? 'text-gray-400' : 'text-gray-700'
              }`}
            >
              Ingredientes:
            </p>
            <p className={`text-xs ${!item.disponivel ? 'text-gray-400' : 'text-gray-600'}`}>
              {item.ingredientes.join(', ')}
            </p>
          </div>
        )}

        {/* Controles de quantidade */}
        {showControles && item.disponivel && !disabled && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleRemover}
                disabled={quantidade === 0}
                className={`p-2 rounded-full transition-colors ${
                  quantidade === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                }`}
              >
                <Minus className="h-4 w-4" />
              </button>

              <span className="text-lg font-semibold min-w-[2rem] text-center">{quantidade}</span>

              <button
                onClick={handleAdicionar}
                className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {quantidade > 0 && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-lg font-bold text-primary-600">
                  R$ {(item.preco * quantidade).toFixed(2)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Botão simples de adicionar */}
        {showControles && item.disponivel && !disabled && quantidade === 0 && (
          <button onClick={handleAdicionar} className="w-full mt-3 btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar ao Carrinho
          </button>
        )}

        {/* Status indisponível */}
        {!item.disponivel && (
          <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded-lg text-center">
            <span className="text-red-700 font-medium text-sm">Temporariamente Indisponível</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CardMenuItem;
