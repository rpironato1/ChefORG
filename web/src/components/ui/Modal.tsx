import { X } from 'lucide-react';
import { ModalProps } from '../../types';

interface ModalConfirmacaoProps extends ModalProps {
  onConfirmar?: () => void;
  onCancelar?: () => void;
  textoBotaoConfirmar?: string;
  textoBotaoCancelar?: string;
  tipoConfirmacao?: 'info' | 'sucesso' | 'aviso' | 'erro';
}

function Modal({
  isOpen,
  onClose,
  titulo,
  children,
  onConfirmar,
  onCancelar,
  textoBotaoConfirmar = 'Confirmar',
  textoBotaoCancelar = 'Cancelar',
  tipoConfirmacao = 'info',
}: ModalConfirmacaoProps) {
  if (!isOpen) return null;

  const getCorTema = () => {
    switch (tipoConfirmacao) {
      case 'sucesso':
        return 'border-green-500 text-green-700';
      case 'aviso':
        return 'border-yellow-500 text-yellow-700';
      case 'erro':
        return 'border-red-500 text-red-700';
      default:
        return 'border-blue-500 text-blue-700';
    }
  };

  const getCorBotao = () => {
    switch (tipoConfirmacao) {
      case 'sucesso':
        return 'bg-green-600 hover:bg-green-700';
      case 'aviso':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'erro':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b-2 ${getCorTema()}`}>
          <h2 className="text-lg font-semibold">{titulo}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>

        {/* Footer com botões */}
        {(onConfirmar || onCancelar) && (
          <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
            {onCancelar && (
              <button
                onClick={onCancelar}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                {textoBotaoCancelar}
              </button>
            )}
            {onConfirmar && (
              <button
                onClick={onConfirmar}
                className={`px-4 py-2 text-white font-medium rounded-lg transition-colors ${getCorBotao()}`}
              >
                {textoBotaoConfirmar}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
