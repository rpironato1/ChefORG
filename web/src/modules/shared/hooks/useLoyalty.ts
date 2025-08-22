import { useState, useCallback } from 'react';

// Interface para cliente fidelidade
interface ClienteFidelidade {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  pontos: number;
  nivel: 'bronze' | 'prata' | 'ouro' | 'diamante';
  dataUltimaCompra?: Date;
  dataCadastro: Date;
  totalGasto: number;
}

// Interface para cupom
interface CupomDesconto {
  id: string;
  clienteId: string;
  codigo: string;
  valorDesconto: number;
  porcentagemDesconto?: number;
  valorMinimo?: number;
  validade: Date;
  usado: boolean;
  dataUso?: Date;
  pedidoId?: string;
}

// Interface para histórico de pontos
interface HistoricoPontos {
  id: string;
  clienteId: string;
  tipo: 'ganho' | 'resgate' | 'expiracao';
  pontos: number;
  motivo: string;
  dataHora: Date;
  pedidoId?: string;
  cupomId?: string;
}

// Hook para programa de fidelidade
export const useLoyalty = () => {
  const [clientes, setClientes] = useState<ClienteFidelidade[]>([]);
  const [cupons, setCupons] = useState<CupomDesconto[]>([]);
  const [historico, setHistorico] = useState<HistoricoPontos[]>([]);

  const calcularPontos = useCallback((valorCompra: number): number => {
    // 1 ponto a cada R$ 10,00 gastos
    return Math.floor(valorCompra / 10);
  }, []);

  const determinarNivel = useCallback((pontos: number): ClienteFidelidade['nivel'] => {
    if (pontos >= 1000) return 'diamante';
    if (pontos >= 500) return 'ouro';
    if (pontos >= 200) return 'prata';
    return 'bronze';
  }, []);

  const adicionarCliente = useCallback((dados: Omit<ClienteFidelidade, 'id' | 'pontos' | 'nivel' | 'dataCadastro' | 'totalGasto'>): ClienteFidelidade => {
    const novoCliente: ClienteFidelidade = {
      ...dados,
      id: `CLI-${Date.now()}`,
      pontos: 0,
      nivel: 'bronze',
      dataCadastro: new Date(),
      totalGasto: 0
    };
    
    setClientes(prev => [...prev, novoCliente]);
    return novoCliente;
  }, []);

  const adicionarPontos = useCallback((clienteId: string, pontos: number, motivo: string, pedidoId?: string): boolean => {
    const cliente = clientes.find(c => c.id === clienteId);
    if (!cliente) return false;

    const novosPontos = cliente.pontos + pontos;
    const novoNivel = determinarNivel(novosPontos);

    // Atualizar cliente
    setClientes(prev => prev.map(c => 
      c.id === clienteId ? { 
        ...c, 
        pontos: novosPontos,
        nivel: novoNivel,
        dataUltimaCompra: new Date()
      } : c
    ));

    // Registrar histórico
    const registro: HistoricoPontos = {
      id: `HIST-${Date.now()}`,
      clienteId,
      tipo: 'ganho',
      pontos,
      motivo,
      dataHora: new Date(),
      pedidoId
    };

    setHistorico(prev => [...prev, registro]);
    return true;
  }, [clientes, determinarNivel]);

  const gerarCupom = useCallback((clienteId: string, dados: {
    valorDesconto?: number;
    porcentagemDesconto?: number;
    valorMinimo?: number;
    validadeDias?: number;
  }): CupomDesconto | null => {
    const cliente = clientes.find(c => c.id === clienteId);
    if (!cliente) return null;

    const cupom: CupomDesconto = {
      id: `CUPOM-${Date.now()}`,
      clienteId,
      codigo: `${cliente.nome.substring(0, 3).toUpperCase()}${Date.now().toString().slice(-4)}`,
      valorDesconto: dados.valorDesconto || 0,
      porcentagemDesconto: dados.porcentagemDesconto,
      valorMinimo: dados.valorMinimo,
      validade: new Date(Date.now() + (dados.validadeDias || 30) * 24 * 60 * 60 * 1000),
      usado: false
    };
    
    setCupons(prev => [...prev, cupom]);
    return cupom;
  }, [clientes]);

  const resgatarPontos = useCallback((clienteId: string, pontos: number, motivo: string): boolean => {
    const cliente = clientes.find(c => c.id === clienteId);
    if (!cliente || cliente.pontos < pontos) return false;
    
    // Atualizar pontos do cliente
    setClientes(prev => prev.map(c => 
      c.id === clienteId ? { ...c, pontos: c.pontos - pontos } : c
    ));

    // Registrar histórico
    const registro: HistoricoPontos = {
      id: `HIST-${Date.now()}`,
      clienteId,
      tipo: 'resgate',
      pontos,
      motivo,
      dataHora: new Date()
    };

    setHistorico(prev => [...prev, registro]);
    return true;
  }, [clientes]);

  const usarCupom = useCallback((codigo: string, pedidoId: string): { sucesso: boolean; cupom?: CupomDesconto; erro?: string } => {
    const cupom = cupons.find(c => c.codigo === codigo && !c.usado);
    
    if (!cupom) {
      return { sucesso: false, erro: 'Cupom não encontrado ou já utilizado' };
    }

    if (new Date() > cupom.validade) {
      return { sucesso: false, erro: 'Cupom expirado' };
    }

    // Marcar cupom como usado
    setCupons(prev => prev.map(c => 
      c.id === cupom.id ? { 
        ...c, 
        usado: true, 
        dataUso: new Date(),
        pedidoId 
      } : c
    ));

    return { sucesso: true, cupom };
  }, [cupons]);

  const obterCuponsCliente = useCallback((clienteId: string, apenasValidos: boolean = true): CupomDesconto[] => {
    let cuponsCliente = cupons.filter(c => c.clienteId === clienteId);
    
    if (apenasValidos) {
      cuponsCliente = cuponsCliente.filter(c => 
        !c.usado && new Date() <= c.validade
      );
    }
    
    return cuponsCliente.sort((a, b) => b.validade.getTime() - a.validade.getTime());
  }, [cupons]);

  const obterHistoricoCliente = useCallback((clienteId: string, limite?: number): HistoricoPontos[] => {
    let historioCliente = historico.filter(h => h.clienteId === clienteId);
    historioCliente = historioCliente.sort((a, b) => b.dataHora.getTime() - a.dataHora.getTime());
    
    if (limite) {
      historioCliente = historioCliente.slice(0, limite);
    }
    
    return historioCliente;
  }, [historico]);

  return {
    clientes,
    cupons,
    historico,
    calcularPontos,
    determinarNivel,
    adicionarCliente,
    adicionarPontos,
    gerarCupom,
    resgatarPontos,
    usarCupom,
    obterCuponsCliente,
    obterHistoricoCliente
  };
};