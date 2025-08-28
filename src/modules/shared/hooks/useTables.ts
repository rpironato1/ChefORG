import { useState, useCallback } from 'react';
import { Mesa } from '../../../types';

// Hook principal para CRUD de mesas
export const useTables = () => {
  const [mesas, setMesas] = useState<Mesa[]>([]);

  const criarMesa = useCallback((dados: Omit<Mesa, 'id' | 'qrCode' | 'status'>): Mesa => {
    const novaMesa: Mesa = {
      ...dados,
      id: `MESA-${Date.now()}`,
      qrCode: `QR-${dados.numero.toString().padStart(3, '0')}`,
      status: 'livre',
    };

    setMesas(prev => [...prev, novaMesa]);
    return novaMesa;
  }, []);

  const buscarMesa = useCallback(
    (id: string): Mesa | undefined => {
      return mesas.find(m => m.id === id);
    },
    [mesas]
  );

  const buscarMesaPorNumero = useCallback(
    (numero: number): Mesa | undefined => {
      return mesas.find(m => m.numero === numero);
    },
    [mesas]
  );

  const atualizarStatusMesa = useCallback((id: string, status: Mesa['status']): boolean => {
    setMesas(prev => prev.map(m => (m.id === id ? { ...m, status } : m)));
    return true;
  }, []);

  const ocuparMesa = useCallback((id: string, clienteAtual: string, garcom?: string): boolean => {
    setMesas(prev =>
      prev.map(m => (m.id === id ? { ...m, status: 'ocupada', clienteAtual, garcom } : m))
    );
    return true;
  }, []);

  const liberarMesa = useCallback((id: string): boolean => {
    setMesas(prev =>
      prev.map(m =>
        m.id === id
          ? {
              ...m,
              status: 'livre',
              clienteAtual: undefined,
              garcom: undefined,
              pedidoAtual: undefined,
              pin: undefined,
            }
          : m
      )
    );
    return true;
  }, []);

  const listarMesas = useCallback(
    (filtros?: { status?: Mesa['status']; garcom?: string; capacidadeMin?: number }) => {
      let resultado = mesas;

      if (filtros?.status) {
        resultado = resultado.filter(m => m.status === filtros.status);
      }

      if (filtros?.garcom) {
        resultado = resultado.filter(m => m.garcom === filtros.garcom);
      }

      if (filtros?.capacidadeMin) {
        resultado = resultado.filter(m => m.capacidade >= filtros.capacidadeMin!);
      }

      return resultado;
    },
    [mesas]
  );

  return {
    mesas,
    criarMesa,
    buscarMesa,
    buscarMesaPorNumero,
    atualizarStatusMesa,
    ocuparMesa,
    liberarMesa,
    listarMesas,
  };
};
