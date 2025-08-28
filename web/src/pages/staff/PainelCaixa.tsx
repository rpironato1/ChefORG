import React, { useState } from 'react';
import TabelaResponsiva from '../../components/ui/TabelaResponsiva';
import Modal from '../../components/ui/Modal';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Loader2 } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { getOrderByMesaCode, OrderWithItems } from '../../lib/api/orders';
import { createPayment, confirmPayment } from '../../lib/api/payments';
import { Database } from '../../lib/supabase';

type PaymentMethod = Database['public']['Enums']['payment_method'];

const PainelCaixa: React.FC = () => {
  const [pedido, setPedido] = useState<OrderWithItems | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [codigoMesa, setCodigoMesa] = useState('');
  const { showSuccess, showError } = useToast();

  const handleBuscarMesa = async () => {
    if (!codigoMesa) {
      showError('Entrada Inválida', 'Por favor, digite o código da mesa.');
      return;
    }
    setIsLoading(true);
    setPedido(null);
    try {
      const result = await getOrderByMesaCode(codigoMesa);
      if (result.success && result.data) {
        setPedido(result.data);
      } else {
        showError('Não Encontrado', result.error || 'Nenhum pedido aberto para este código.');
      }
    } catch (err) {
      showError('Erro de Conexão', 'Não foi possível buscar o pedido.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrarPagamento = async (metodo: PaymentMethod) => {
    if (!pedido) return;

    setIsProcessing(true);
    try {
      // 1. Cria o registro de pagamento
      const paymentResult = await createPayment(pedido.id, metodo, Number(pedido.total));
      if (!paymentResult.success || !paymentResult.data) {
        throw new Error(paymentResult.error || 'Falha ao criar registro de pagamento.');
      }

      // 2. Confirma o pagamento (pois é manual)
      const confirmResult = await confirmPayment(paymentResult.data.id);
      if (!confirmResult.success) {
        throw new Error(confirmResult.error || 'Falha ao confirmar o pagamento.');
      }

      showSuccess(
        'Pagamento Registrado!',
        `Pagamento de R$ ${Number(pedido.total).toFixed(2)} via ${metodo} confirmado.`
      );
      setPedido(null);
      setCodigoMesa('');
    } catch (err: any) {
      showError('Erro no Pagamento', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Painel do Caixa</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Buscar Mesa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <input
                type="text"
                value={codigoMesa}
                onChange={e => setCodigoMesa(e.target.value)}
                placeholder="Digite o nº ou código da mesa"
                className="flex-grow p-2 border rounded-md"
                onKeyDown={e => e.key === 'Enter' && handleBuscarMesa()}
              />
              <button
                onClick={handleBuscarMesa}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Buscar'}
              </button>
            </div>
          </CardContent>
        </Card>

        {pedido ? (
          <Card>
            <CardHeader>
              <CardTitle>Comanda - Mesa {pedido.tables?.numero}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <TabelaResponsiva
                  headers={['Item', 'Qtd', 'Preço']}
                  rows={pedido.order_items.map(item => [
                    item.menu_items?.nome || 'Item desconhecido',
                    item.quantidade,
                    `R$ ${Number(item.preco_unitario).toFixed(2)}`,
                  ])}
                />
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-2xl font-bold">
                  <span>Total:</span>
                  <span>R$ {Number(pedido.total).toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Registrar Pagamento Manual</h3>
                {isProcessing ? (
                  <div className="text-center p-4">
                    <Loader2 className="animate-spin mx-auto" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleRegistrarPagamento('dinheiro')}
                      className="p-3 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      Dinheiro
                    </button>
                    <button
                      onClick={() => handleRegistrarPagamento('cartao')}
                      className="p-3 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                    >
                      Cartão
                    </button>
                    <button
                      onClick={() => handleRegistrarPagamento('pix')}
                      className="p-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                    >
                      PIX Manual
                    </button>
                    <button
                      onClick={() => handleRegistrarPagamento('apple_pay')}
                      className="p-3 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                      Apple Pay
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center bg-white rounded-lg shadow-md p-8 text-gray-500">
            Aguardando busca de mesa...
          </div>
        )}
      </div>
    </div>
  );
};

export default PainelCaixa;
