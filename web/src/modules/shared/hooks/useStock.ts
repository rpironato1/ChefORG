import { useState, useCallback } from 'react';

// Interface para item de estoque
interface ItemEstoque {
  id: string;
  nome: string;
  quantidade: number;
  unidade: string;
  categoria: string;
  valorUnitario: number;
  fornecedor?: string;
  dataValidade?: Date;
  estoqueMinimo: number;
  ultimaAtualizacao: Date;
}

// Interface para movimentação de estoque
interface MovimentacaoEstoque {
  id: string;
  itemId: string;
  tipo: 'entrada' | 'saida' | 'descarte' | 'ajuste';
  quantidade: number;
  motivo: string;
  funcionarioId: string;
  dataHora: Date;
}

// Hook para gerenciar estoque
export const useStock = () => {
  const [estoque, setEstoque] = useState<ItemEstoque[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>([]);

  const adicionarItem = useCallback((item: Omit<ItemEstoque, 'id' | 'ultimaAtualizacao'>): ItemEstoque => {
    const novoItem: ItemEstoque = {
      ...item,
      id: `EST-${Date.now()}`,
      ultimaAtualizacao: new Date()
    };
    
    setEstoque(prev => [...prev, novoItem]);
    return novoItem;
  }, []);

  const atualizarQuantidade = useCallback((id: string, quantidade: number, motivo: string = 'Ajuste manual', funcionarioId: string = 'SYSTEM'): boolean => {
    const item = estoque.find(i => i.id === id);
    if (!item) return false;

    // Registrar movimentação
    const movimentacao: MovimentacaoEstoque = {
      id: `MOV-${Date.now()}`,
      itemId: id,
      tipo: quantidade > item.quantidade ? 'entrada' : 'saida',
      quantidade: Math.abs(quantidade - item.quantidade),
      motivo,
      funcionarioId,
      dataHora: new Date()
    };

    setMovimentacoes(prev => [...prev, movimentacao]);
    
    setEstoque(prev => prev.map(i => 
      i.id === id ? { 
        ...i, 
        quantidade, 
        ultimaAtualizacao: new Date() 
      } : i
    ));
    
    return true;
  }, [estoque]);

  const registrarConsumo = useCallback((id: string, quantidade: number, motivo: string = 'Consumo', funcionarioId: string = 'SYSTEM'): boolean => {
    const item = estoque.find(i => i.id === id);
    if (!item || item.quantidade < quantidade) return false;

    const movimentacao: MovimentacaoEstoque = {
      id: `MOV-${Date.now()}`,
      itemId: id,
      tipo: 'saida',
      quantidade,
      motivo,
      funcionarioId,
      dataHora: new Date()
    };

    setMovimentacoes(prev => [...prev, movimentacao]);
    
    setEstoque(prev => prev.map(i => 
      i.id === id ? { 
        ...i, 
        quantidade: i.quantidade - quantidade,
        ultimaAtualizacao: new Date() 
      } : i
    ));
    
    return true;
  }, [estoque]);

  const registrarDescarte = useCallback((id: string, quantidade: number, motivo: string, funcionarioId: string): boolean => {
    const item = estoque.find(i => i.id === id);
    if (!item || item.quantidade < quantidade) return false;

    const movimentacao: MovimentacaoEstoque = {
      id: `MOV-${Date.now()}`,
      itemId: id,
      tipo: 'descarte',
      quantidade,
      motivo,
      funcionarioId,
      dataHora: new Date()
    };

    setMovimentacoes(prev => [...prev, movimentacao]);
    
    setEstoque(prev => prev.map(i => 
      i.id === id ? { 
        ...i, 
        quantidade: i.quantidade - quantidade,
        ultimaAtualizacao: new Date() 
      } : i
    ));
    
    return true;
  }, [estoque]);

  const alertarEstoqueBaixo = useCallback((limite?: number): ItemEstoque[] => {
    return estoque.filter(item => 
      item.quantidade <= (limite || item.estoqueMinimo)
    );
  }, [estoque]);

  const obterMovimentacoes = useCallback((itemId?: string, periodo?: { inicio: Date; fim: Date }): MovimentacaoEstoque[] => {
    let resultado = movimentacoes;
    
    if (itemId) {
      resultado = resultado.filter(m => m.itemId === itemId);
    }
    
    if (periodo) {
      resultado = resultado.filter(m => 
        m.dataHora >= periodo.inicio && m.dataHora <= periodo.fim
      );
    }
    
    return resultado.sort((a, b) => b.dataHora.getTime() - a.dataHora.getTime());
  }, [movimentacoes]);

  const calcularValorEstoque = useCallback((): number => {
    return estoque.reduce((total, item) => 
      total + (item.quantidade * item.valorUnitario), 0
    );
  }, [estoque]);

  return {
    estoque,
    movimentacoes,
    adicionarItem,
    atualizarQuantidade,
    registrarConsumo,
    registrarDescarte,
    alertarEstoqueBaixo,
    obterMovimentacoes,
    calcularValorEstoque
  };
};