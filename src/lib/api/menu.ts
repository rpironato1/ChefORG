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
    const { data, error } = await new Promise((resolve) => {
      const result = supabase.from('menu_categories').select('*');
      if (result && typeof result.then === 'function') {
        result.then(resolve);
      } else {
        resolve({ data: [], error: null });
      }
    }) as { data: any[] | null; error: any };

    if (error) throw error;
    
    // Filter and sort in memory since localStorage doesn't support chaining
    const filteredData = (data || [])
      .filter((cat: any) => cat.ativo === true)
      .sort((a: any, b: any) => a.ordem - b.ordem);
    
    return createSuccessResponse(filteredData);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Busca todos os itens de menu ativos.
 */
export const getAllMenuItems = async (): Promise<ApiResponse<MenuItem[]>> => {
    try {
        const { data, error } = await new Promise((resolve) => {
          const result = supabase.from('menu_items').select('*');
          if (result && typeof result.then === 'function') {
            result.then(resolve);
          } else {
            resolve({ data: [], error: null });
          }
        }) as { data: any[] | null; error: any };

        if (error) throw error;
        
        // Filter and sort in memory since localStorage doesn't support chaining
        const filteredData = (data || [])
            .filter((item: any) => item.disponivel === true)
            .sort((a: any, b: any) => a.nome.localeCompare(b.nome));
        
        return createSuccessResponse(filteredData);
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
    // For localStorage implementation, we need to handle joins manually
    const categoriesPromise = new Promise((resolve) => {
      const result = supabase.from('menu_categories').select('*');
      if (result && typeof result.then === 'function') {
        result.then(resolve);
      } else {
        resolve({ data: [], error: null });
      }
    }) as Promise<{ data: any[] | null; error: any }>;

    const itemsPromise = new Promise((resolve) => {
      const result = supabase.from('menu_items').select('*');
      if (result && typeof result.then === 'function') {
        result.then(resolve);
      } else {
        resolve({ data: [], error: null });
      }
    }) as Promise<{ data: any[] | null; error: any }>;

    const [categoriesResult, itemsResult] = await Promise.all([categoriesPromise, itemsPromise]);

    if (categoriesResult.error) throw categoriesResult.error;
    if (itemsResult.error) throw itemsResult.error;

    // Filter and combine data in memory
    const activeCategories = (categoriesResult.data || [])
      .filter((cat: any) => cat.ativo === true)
      .sort((a: any, b: any) => a.ordem - b.ordem);

    const availableItems = (itemsResult.data || [])
      .filter((item: any) => item.disponivel === true);

    // Group items by category
    const categoriesWithItems = activeCategories.map((category: any) => ({
      ...category,
      menu_items: availableItems.filter((item: any) => item.categoria === category.nome)
    }));

    return createSuccessResponse(categoriesWithItems as CategoryWithItems[]);
  } catch (error) {
    return handleApiError(error);
  }
};