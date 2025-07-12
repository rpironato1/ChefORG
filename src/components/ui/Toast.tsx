import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { ToastMessage } from '../../types';

interface ToastProps {
  message: ToastMessage;
  onRemove: (id: string) => void;
}

interface ToastContainerProps {
  messages: ToastMessage[];
  onRemove: (id: string) => void;
}

function Toast({ message, onRemove }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animar entrada
    setIsVisible(true);

    // Auto remover após duração especificada
    if (message.duracao && message.duracao > 0) {
      const timer = setTimeout(() => {
        handleRemove();
      }, message.duracao);

      return () => clearTimeout(timer);
    }
  }, [message.duracao]);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(message.id);
    }, 300); // Duração da animação de saída
  };

  const getIcon = () => {
    switch (message.tipo) {
      case 'sucesso':
        return <CheckCircle className="h-5 w-5" />;
      case 'erro':
        return <AlertCircle className="h-5 w-5" />;
      case 'aviso':
        return <AlertTriangle className="h-5 w-5" />;
      case 'info':
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getColors = () => {
    switch (message.tipo) {
      case 'sucesso':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'erro':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'aviso':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIconColors = () => {
    switch (message.tipo) {
      case 'sucesso':
        return 'text-green-500';
      case 'erro':
        return 'text-red-500';
      case 'aviso':
        return 'text-yellow-500';
      case 'info':
      default:
        return 'text-blue-500';
    }
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isLeaving ? 'translate-x-full opacity-0' : ''}
        max-w-sm w-full shadow-lg rounded-lg pointer-events-auto border
        ${getColors()}
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${getIconColors()}`}>
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium">
              {message.titulo}
            </p>
            {message.mensagem && (
              <p className="mt-1 text-sm opacity-90">
                {message.mensagem}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleRemove}
              className="inline-flex rounded-md p-1.5 hover:bg-black hover:bg-opacity-10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToastContainer({ messages, onRemove }: ToastContainerProps) {
  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {messages.map((message) => (
          <Toast
            key={message.id}
            message={message}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}

// Hook para gerenciar toasts
export function useToast() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = (
    tipo: ToastMessage['tipo'],
    titulo: string,
    mensagem?: string,
    duracao = 5000
  ) => {
    const id = Date.now().toString();
    const newMessage: ToastMessage = {
      id,
      tipo,
      titulo,
      mensagem: mensagem || '',
      duracao
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const removeToast = (id: string) => {
    setMessages(prev => prev.filter(message => message.id !== id));
  };

  const showSuccess = (titulo: string, mensagem?: string, duracao?: number) => {
    addToast('sucesso', titulo, mensagem, duracao);
  };

  const showError = (titulo: string, mensagem?: string, duracao?: number) => {
    addToast('erro', titulo, mensagem, duracao);
  };

  const showWarning = (titulo: string, mensagem?: string, duracao?: number) => {
    addToast('aviso', titulo, mensagem, duracao);
  };

  const showInfo = (titulo: string, mensagem?: string, duracao?: number) => {
    addToast('info', titulo, mensagem, duracao);
  };

  return {
    messages,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    ToastContainer: () => <ToastContainer messages={messages} onRemove={removeToast} />
  };
}

export default Toast; 