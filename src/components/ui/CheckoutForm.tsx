// src/components/ui/CheckoutForm.tsx
import React, { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';

interface CheckoutFormProps {
  onSuccess: (paymentIntentId: string) => void;
  onError: (errorMessage: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // A URL de retorno não é usada aqui, pois lidamos com o resultado diretamente.
        // Mas é necessária. Aponta para uma página de status genérica.
        return_url: `${window.location.origin}/payment-status`,
      },
      redirect: 'if_required', // Impede o redirecionamento automático
    });

    if (error) {
      setMessage(error.message || 'Ocorreu um erro inesperado.');
      onError(error.message || 'Ocorreu um erro inesperado.');
      setIsProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    } else {
      // Este caso é menos comum com 'if_required'
      setMessage('O pagamento não foi bem-sucedido.');
      onError('O pagamento não foi bem-sucedido.');
    }

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button disabled={isProcessing || !stripe || !elements} id="submit" className="w-full btn-primary mt-6">
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            <span>Processando...</span>
          </div>
        ) : (
          <span>Pagar Agora</span>
        )}
      </button>
      {message && <div id="payment-message" className="text-red-500 text-sm mt-2">{message}</div>}
    </form>
  );
};

export default CheckoutForm;