import { useState, useCallback } from 'react';
import { Reserva, Mesa } from '../../../types';

// Hook para validar disponibilidade de mesa
export const useValidarDisponibilidadeMesa = () => {
  const validarDisponibilidade = useCallback((
    mesas: Mesa[],
    _dataHora: Date,
    numeroConvidados: number,
    mesaId?: string
  ): { disponivel: boolean; mesasSugeridas: Mesa[] } => {
    const mesasDisponiveis = mesas.filter(mesa => 
      mesa.status === 'livre' && 
      mesa.capacidade >= numeroConvidados &&
      (!mesaId || mesa.id === mesaId)
    );

    const mesasSugeridas = mesasDisponiveis
      .sort((a, b) => a.capacidade - b.capacidade) // Menor mesa primeiro
      .slice(0, 3); // Máximo 3 sugestões

    return {
      disponivel: mesasDisponiveis.length > 0,
      mesasSugeridas
    };
  }, []);

  return { validarDisponibilidade };
};

// Hook para gerar e validar PINs
export const useGeradorPIN = () => {
  const [pinsAtivos, setPinsAtivos] = useState<Map<string, { pin: string; expiracao: Date }>>(new Map());

  const gerarPIN = useCallback((mesaId: string, validadeDias: number = 1): string => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    const expiracao = new Date(Date.now() + validadeDias * 24 * 60 * 60 * 1000);
    
    setPinsAtivos(prev => new Map(prev.set(mesaId, { pin, expiracao })));
    
    return pin;
  }, []);

  const validarPIN = useCallback((mesaId: string, pin: string): boolean => {
    const pinAtivo = pinsAtivos.get(mesaId);
    if (!pinAtivo) return false;
    
    const agora = new Date();
    if (agora > pinAtivo.expiracao) {
      setPinsAtivos(prev => {
        const newMap = new Map(prev);
        newMap.delete(mesaId);
        return newMap;
      });
      return false;
    }
    
    return pinAtivo.pin === pin;
  }, [pinsAtivos]);

  const removerPIN = useCallback((mesaId: string) => {
    setPinsAtivos(prev => {
      const newMap = new Map(prev);
      newMap.delete(mesaId);
      return newMap;
    });
  }, []);

  return { gerarPIN, validarPIN, removerPIN };
};

// Hook principal para CRUD de reservas
export const useReservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);

  const criarReserva = useCallback((dados: Omit<Reserva, 'id' | 'status'>): Reserva => {
    const novaReserva: Reserva = {
      ...dados,
      id: `RES-${Date.now()}`,
      status: 'confirmada'
    };
    
    setReservas(prev => [...prev, novaReserva]);
    return novaReserva;
  }, []);

  const buscarReserva = useCallback((id: string): Reserva | undefined => {
    return reservas.find(r => r.id === id);
  }, [reservas]);

  const atualizarReserva = useCallback((id: string, dados: Partial<Reserva>): boolean => {
    setReservas(prev => prev.map(r => r.id === id ? { ...r, ...dados } : r));
    return true;
  }, []);

  const cancelarReserva = useCallback((id: string): boolean => {
    return atualizarReserva(id, { status: 'cancelada' });
  }, [atualizarReserva]);

  const listarReservas = useCallback((filtros?: {
    data?: Date;
    status?: Reserva['status'];
    mesaId?: string;
  }) => {
    let resultado = reservas;
    
    if (filtros?.data) {
      resultado = resultado.filter(r => 
        r.dataHora.toDateString() === filtros.data!.toDateString()
      );
    }
    
    if (filtros?.status) {
      resultado = resultado.filter(r => r.status === filtros.status);
    }
    
    if (filtros?.mesaId) {
      resultado = resultado.filter(r => r.mesaId === filtros.mesaId);
    }
    
    return resultado;
  }, [reservas]);

  return {
    reservas,
    criarReserva,
    buscarReserva,
    atualizarReserva,
    cancelarReserva,
    listarReservas
  };
};