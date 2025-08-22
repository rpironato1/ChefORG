import { useState, useCallback } from 'react';
import { Pagamento } from '../../../types';

// Hook para pagamentos digitais
export const useDigitalPayments = () => {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);

  const criarPagamento = useCallback((dados: Omit<Pagamento, 'id' | 'dataHora' | 'status'>): Pagamento => {
    const novoPagamento: Pagamento = {
      ...dados,
      id: `PAG-${Date.now()}`,
      dataHora: new Date(),
      status: 'pendente'
    };
    
    setPagamentos(prev => [...prev, novoPagamento]);
    return novoPagamento;
  }, []);

  const processarWebhook = useCallback((dados: {
    codigoPagamento: string;
    status: 'confirmado' | 'cancelado';
    transacaoId?: string;
  }): boolean => {
    setPagamentos(prev => prev.map(p => 
      p.codigoPagamento === dados.codigoPagamento ? {
        ...p,
        status: dados.status,
        codigoPagamento: dados.transacaoId
      } : p
    ));
    return true;
  }, []);

  const consultarStatusPagamento = useCallback((pagamentoId: string): Pagamento['status'] | null => {
    const pagamento = pagamentos.find(p => p.id === pagamentoId);
    return pagamento ? pagamento.status : null;
  }, [pagamentos]);

  return {
    pagamentos,
    criarPagamento,
    processarWebhook,
    consultarStatusPagamento
  };
};

// Hook para pagamentos manuais no caixa
export const useCashPayments = () => {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);

  const registrarPagamentoManual = useCallback((dados: {
    pedidoId: string;
    valor: number;
    metodo: 'dinheiro' | 'cartao';
    funcionarioId: string;
  }): Pagamento => {
    const novoPagamento: Pagamento = {
      id: `PAG-${Date.now()}`,
      pedidoId: dados.pedidoId,
      valor: dados.valor,
      metodo: dados.metodo,
      status: 'confirmado',
      dataHora: new Date()
    };
    
    setPagamentos(prev => [...prev, novoPagamento]);
    return novoPagamento;
  }, []);

  const buscarPagamentoPorCodigo = useCallback((_codigoMesa: string): Pagamento | null => {
    // Implementar lógica para buscar pagamento por código da mesa
    return null;
  }, []);

  return {
    pagamentos,
    registrarPagamentoManual,
    buscarPagamentoPorCodigo
  };
};

// Hook consolidado para pagamentos
export const usePayments = () => {
  const digitalPayments = useDigitalPayments();
  const cashPayments = useCashPayments();

  const getAllPayments = useCallback(() => {
    return [...digitalPayments.pagamentos, ...cashPayments.pagamentos];
  }, [digitalPayments.pagamentos, cashPayments.pagamentos]);

  const findPaymentById = useCallback((id: string): Pagamento | null => {
    const allPayments = getAllPayments();
    return allPayments.find(p => p.id === id) || null;
  }, [getAllPayments]);

  return {
    // Digital payments
    ...digitalPayments,
    // Cash payments  
    registrarPagamentoManual: cashPayments.registrarPagamentoManual,
    buscarPagamentoPorCodigo: cashPayments.buscarPagamentoPorCodigo,
    // Consolidated
    getAllPayments,
    findPaymentById
  };
};