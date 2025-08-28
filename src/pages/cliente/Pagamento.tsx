import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  QrCode,
  Receipt,
  DollarSign,
  Hash,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

import { useToast } from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';
import CheckoutForm from '../../components/ui/CheckoutForm';
import { getActiveOrderByTable, OrderWithItems } from '../../lib/api/orders';
import { createPayment, createPaymentIntent } from '../../lib/api/payments';
import { Database } from '../../lib/supabase';

type PaymentMethod = Database['public']['Enums']['payment_method'];

// Carregue o Stripe fora do render para evitar recriá-lo a cada renderização.
// Use uma variável de ambiente para a chave publicável.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

function PagamentoPage() {
  const { numeroMesa, orderId } = useParams<{ numeroMesa: string; orderId: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError, ToastContainer } = useToast();

  const [pedido, setPedido] = useState<OrderWithItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Estados para o Stripe ---
  const [clientSecret, setClientSecret] = useState('');

  // --- Estados para outros métodos ---
  const [pixCode, setPixCode] = useState('');
  const [caixaCode, setCaixaCode] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!numeroMesa || !orderId) {
        setError('URL inválida. Faltam informações da mesa ou do pedido.');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const tableId = parseInt(numeroMesa, 10);
        const result = await getActiveOrderByTable(tableId);
        if (result.success && result.data) {
          if (result.data.id === parseInt(orderId, 10)) {
            setPedido(result.data);
          } else {
            setError('Este não é mais o pedido ativo da mesa.');
          }
        } else {
          setError(result.error || 'Não foi possível carregar os detalhes do pedido.');
        }
      } catch (e) {
        setError('Erro de conexão ao buscar pedido.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [numeroMesa, orderId]);

  const handlePaymentMethodSelection = async (method: PaymentMethod) => {
    if (!pedido) return;

    setIsProcessing(true);
    setSelectedMethod(method);

    try {
      // Primeiro, crie o registro de pagamento no nosso DB
      const paymentResult = await createPayment(pedido.id, method, Number(pedido.total));
      if (!paymentResult.success || !paymentResult.data) {
        throw new Error(paymentResult.error || 'Falha ao registrar o início do pagamento.');
      }

      // Lógica específica para cada método
      if (method === 'cartao') {
        const intentResult = await createPaymentIntent(Number(pedido.total), pedido.id);
        if (intentResult.success && intentResult.data?.clientSecret) {
          setClientSecret(intentResult.data.clientSecret);
          setIsModalOpen(true);
        } else {
          throw new Error(intentResult.error || 'Não foi possível iniciar o pagamento com cartão.');
        }
      } else if (method === 'pix') {
        setPixCode(paymentResult.data.codigo_pagamento || `PIX-SIMULADO-${paymentResult.data.id}`);
        setIsModalOpen(true);
        // A confirmação real viria de um webhook. Aqui simulamos.
      } else if (method === 'dinheiro') {
        // For cash payments, show the order number at counter
        setCaixaCode(`M${numeroMesa}-P${pedido.id}`);
        setIsModalOpen(true);
      }
      // Outros métodos como Apple/Google Pay usariam uma lógica similar ao cartão.
    } catch (err: any) {
      showError('Erro', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStripeSuccess = (_paymentIntentId: string) => {
    // O webhook já deve ter atualizado o status do pedido.
    // Apenas redirecionamos o usuário.
    showSuccess('Pagamento com cartão aprovado!');
    setIsModalOpen(false);
    navigate(`/mesa/${numeroMesa}/feedback`);
  };

  const handleStripeError = (errorMessage: string) => {
    showError('Falha no Pagamento', errorMessage);
    // O modal permanece aberto para o usuário tentar novamente.
  };

  const stripeOptions: StripeElementsOptions = {
    clientSecret,
    appearance: { theme: 'stripe' },
  };

  const paymentMethods: { id: PaymentMethod; name: string; icon: React.ElementType }[] = [
    { id: 'cartao', name: 'Cartão de Crédito', icon: CreditCard },
    { id: 'pix', name: 'PIX', icon: QrCode },
    { id: 'apple_pay', name: 'Apple Pay', icon: Smartphone },
    { id: 'google_pay', name: 'Google Pay', icon: Smartphone },
    { id: 'dinheiro', name: 'Pagar no Caixa', icon: Receipt },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <div className="p-6">
        <AlertTriangle className="h-8 w-8 text-red-500" />{' '}
        <p>{error || 'Pedido não encontrado.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to={`/mesa/${numeroMesa}/acompanhar-pedido/${orderId}`}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" /> Voltar
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="h-4 w-4" /> Mesa {numeroMesa}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>
          <div className="space-y-3">
            {pedido.order_items.map(item => (
              <div
                key={item.id}
                className="flex justify-between items-center py-2 border-b border-gray-100"
              >
                <p>
                  {item.menu_items?.nome} x{item.quantidade}
                </p>
                <p>R$ {(Number(item.preco_unitario) * item.quantidade).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center text-2xl font-bold">
              <p>Total:</p>
              <p>R$ {Number(pedido.total).toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Escolha a Forma de Pagamento</h2>
          {isProcessing ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Iniciando pagamento via {selectedMethod}...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  onClick={() => handlePaymentMethodSelection(method.id)}
                  className="flex items-center justify-center gap-3 p-4 border-2 rounded-lg hover:border-primary-600"
                >
                  <method.icon className="h-6 w-6" />
                  <span>{method.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- MODAIS --- */}

      {/* Modal para Cartão de Crédito (Stripe) */}
      <Modal
        isOpen={isModalOpen && selectedMethod === 'cartao' && !!clientSecret}
        onClose={() => setIsModalOpen(false)}
        titulo="Pagamento com Cartão"
      >
        <Elements options={stripeOptions} stripe={stripePromise}>
          <CheckoutForm onSuccess={handleStripeSuccess} onError={handleStripeError} />
        </Elements>
      </Modal>

      {/* Modal para PIX */}
      <Modal
        isOpen={isModalOpen && selectedMethod === 'pix'}
        onClose={() => setIsModalOpen(false)}
        titulo="Pagamento via PIX"
      >
        <div className="text-center py-6">
          <p>Escaneie o QR Code ou use o código abaixo.</p>
          <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center mx-auto my-4">
            <QrCode className="h-24 w-24 text-gray-400" />
          </div>
          <p className="text-xs bg-gray-100 p-2 rounded break-all">{pixCode}</p>
          <p className="mt-4 animate-pulse">Aguardando confirmação do pagamento...</p>
        </div>
      </Modal>

      {/* Modal para Pagamento no Caixa */}
      <Modal
        isOpen={isModalOpen && selectedMethod === 'dinheiro'}
        onClose={() => setIsModalOpen(false)}
        titulo="Pagamento no Caixa"
      >
        <div className="text-center py-6">
          <Hash className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Apresente o código no caixa:</h3>
          <p className="text-4xl font-bold tracking-widest my-4">{caixaCode}</p>
          <button onClick={() => setIsModalOpen(false)} className="btn-primary">
            Entendi
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default PagamentoPage;
