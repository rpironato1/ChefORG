import { useState, useCallback } from 'react';
import { MenuItem } from '../../../types';

// Hook principal para CRUD de menu
export const useMenu = () => {
  const [itensMenu, setItensMenu] = useState<MenuItem[]>([]);

  const criarItem = useCallback((dados: Omit<MenuItem, 'id'>): MenuItem => {
    const novoItem: MenuItem = {
      ...dados,
      id: `ITEM-${Date.now()}`,
    };

    setItensMenu(prev => [...prev, novoItem]);
    return novoItem;
  }, []);

  const buscarItem = useCallback(
    (id: string): MenuItem | undefined => {
      return itensMenu.find(i => i.id === id);
    },
    [itensMenu]
  );

  const atualizarItem = useCallback((id: string, dados: Partial<MenuItem>): boolean => {
    setItensMenu(prev => prev.map(i => (i.id === id ? { ...i, ...dados } : i)));
    return true;
  }, []);

  const removerItem = useCallback((id: string): boolean => {
    setItensMenu(prev => prev.filter(i => i.id !== id));
    return true;
  }, []);

  const listarItens = useCallback(
    (filtros?: { categoria?: string; disponivel?: boolean; busca?: string }) => {
      let resultado = itensMenu;

      if (filtros?.categoria) {
        resultado = resultado.filter(i => i.categoria === filtros.categoria);
      }

      if (filtros?.disponivel !== undefined) {
        resultado = resultado.filter(i => i.disponivel === filtros.disponivel);
      }

      if (filtros?.busca) {
        const termo = filtros.busca.toLowerCase();
        resultado = resultado.filter(
          i => i.nome.toLowerCase().includes(termo) || i.descricao.toLowerCase().includes(termo)
        );
      }

      return resultado;
    },
    [itensMenu]
  );

  const obterCategorias = useCallback((): string[] => {
    return Array.from(new Set(itensMenu.map(i => i.categoria)));
  }, [itensMenu]);

  return {
    itensMenu,
    criarItem,
    buscarItem,
    atualizarItem,
    removerItem,
    listarItens,
    obterCategorias,
  };
};
