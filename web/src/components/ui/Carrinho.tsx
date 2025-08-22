import React from 'react';
import { X, ShoppingCart, Trash2 } from 'lucide-react';

// Tipos mocados para visualização
type ItemCarrinho = {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  observacao?: string;
};

type CarrinhoProps = {
  isOpen: boolean;
  onClose: () => void;
  itens: ItemCarrinho[];
  onUpdateQuantidade: (itemId: number, novaQuantidade: number) => void;
  onRemoveItem: (itemId: number) => void;
  onConfirmarPedido: () => void;
};

const Carrinho: React.FC<CarrinhoProps> = ({
  isOpen,
  onClose,
  itens,
  onUpdateQuantidade,
  onRemoveItem,
  onConfirmarPedido,
}) => {
  if (!isOpen) return null;

  const subtotal = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="w-full max-w-md h-full bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <ShoppingCart className="mr-2" />
            Meu Pedido
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <X size={24} />
          </button>
        </div>

        {/* Lista de Itens */}
        <div className="flex-grow p-4 overflow-y-auto">
          {itens.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <p>Seu carrinho está vazio.</p>
              <p className="text-sm">Adicione itens do cardápio para começar.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {itens.map((item) => (
                <li key={item.id} className="flex items-start space-x-4 p-2 rounded-lg border">
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{item.nome}</p>
                    <p className="text-sm text-gray-600">R$ {item.preco.toFixed(2)}</p>
                    {item.observacao && <p className="text-xs text-gray-500 italic">Obs: {item.observacao}</p>}
                    <div className="flex items-center mt-2">
                      <button onClick={() => onUpdateQuantidade(item.id, item.quantidade - 1)} disabled={item.quantidade <= 1} className="px-2 py-1 border rounded-l hover:bg-gray-100 disabled:opacity-50">-</button>
                      <span className="px-3 py-1 border-t border-b">{item.quantidade}</span>
                      <button onClick={() => onUpdateQuantidade(item.id, item.quantidade + 1)} className="px-2 py-1 border rounded-r hover:bg-gray-100">+</button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                     <p className="font-bold text-lg text-gray-900">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                     <button onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-700 mt-2">
                        <Trash2 size={20} />
                     </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {itens.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-700">Subtotal:</span>
              <span className="text-2xl font-bold text-gray-900">R$ {subtotal.toFixed(2)}</span>
            </div>
            <button
              onClick={onConfirmarPedido}
              className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors duration-300"
            >
              Confirmar Pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Carrinho;
