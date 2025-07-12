// src/lib/api/menu.ts
import { supabase, Database } from '../supabase';
import { handleApiError, createSuccessResponse, ApiResponse } from './index';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type MenuCategory = Database['public']['Tables']['menu_categories']['Row'];

export type CategoryWithItems = MenuCategory & {
  menu_items: MenuItem[];
};

/**
 * Busca todas as categorias ativas do cardápio.
 */
export const getAllCategories = async (): Promise<ApiResponse<MenuCategory[]>> => {
  try {
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('ativo', true)
      .order('ordem', { ascending: true });

    if (error) throw error;
    return createSuccessResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Busca todos os itens de menu ativos.
 */
export const getAllMenuItems = async (): Promise<ApiResponse<MenuItem[]>> => {
    try {
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .eq('disponivel', true)
            .order('nome', { ascending: true });

        if (error) throw error;
        return createSuccessResponse(data);
    } catch (error) {
        return handleApiError(error);
    }
};

/**
 * Busca o cardápio completo, com categorias e seus respectivos itens.
 * Esta é a função principal para exibir o cardápio na UI. (Endpoint 6.8)
 */
export const getMenuWithItems = async (): Promise<ApiResponse<CategoryWithItems[]>> => {
  try {
    const { data, error } = await supabase
      .from('menu_categories')
      .select(`
        *,
        menu_items ( * )
      `)
      .eq('ativo', true)
      .eq('menu_items.disponivel', true)
      .order('ordem', { ascending: true });

    if (error) throw error;

    // O Supabase já retorna os itens aninhados dentro das categorias
    return createSuccessResponse(data as CategoryWithItems[]);
  } catch (error) {
    return handleApiError(error);
  }
};