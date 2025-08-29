// Simplified API helpers for testing that work with localStorage
import { ApiResponse, createSuccessResponse, handleApiError } from './index';

// Simple localStorage operations for testing
const getStorageData = (key: string): any[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const setStorageData = (key: string, data: any[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Storage error:', error);
  }
};

// Test-friendly API implementations
export const testCreateReservation = async (data: any): Promise<ApiResponse<any>> => {
  try {
    const reservation = {
      id: Date.now(),
      cliente_nome: data.nome_cliente || data.cliente_nome,
      cliente_telefone: data.cliente_telefone,
      numero_convidados: data.numero_convidados,
      data_hora: data.data_hora,
      restricoes: data.restricoes,
      status: 'confirmada',
      created_at: new Date().toISOString(),
    };

    const reservations = getStorageData('cheforg_reservations');
    reservations.push(reservation);
    setStorageData('cheforg_reservations', reservations);

    return createSuccessResponse(reservation);
  } catch (error) {
    return handleApiError(error);
  }
};

export const testUpdateTableStatus = async (tableId: number, status: string): Promise<ApiResponse<any>> => {
  try {
    const tables = getStorageData('cheforg_tables');
    const tableIndex = tables.findIndex(t => t.id === tableId);
    
    if (tableIndex === -1) {
      // Create a test table if it doesn't exist
      const newTable = {
        id: tableId,
        numero: tableId,
        lugares: 4,
        status: status,
        updated_at: new Date().toISOString(),
      };
      tables.push(newTable);
      setStorageData('cheforg_tables', tables);
      return createSuccessResponse(newTable);
    }

    tables[tableIndex] = { ...tables[tableIndex], status, updated_at: new Date().toISOString() };
    setStorageData('cheforg_tables', tables);

    return createSuccessResponse(tables[tableIndex]);
  } catch (error) {
    return handleApiError(error);
  }
};

export const testGenerateTablePIN = async (tableId: number): Promise<ApiResponse<any>> => {
  try {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    const tables = getStorageData('cheforg_tables');
    const tableIndex = tables.findIndex(t => t.id === tableId);
    
    if (tableIndex === -1) {
      // Create a test table if it doesn't exist
      const newTable = {
        id: tableId,
        numero: tableId,
        lugares: 4,
        status: 'livre',
        pin: pin,
        updated_at: new Date().toISOString(),
      };
      tables.push(newTable);
      setStorageData('cheforg_tables', tables);
    } else {
      tables[tableIndex] = { ...tables[tableIndex], pin, updated_at: new Date().toISOString() };
      setStorageData('cheforg_tables', tables);
    }

    return createSuccessResponse({ pin, tableId });
  } catch (error) {
    return handleApiError(error);
  }
};

export const testSignIn = async (email: string, _password: string): Promise<ApiResponse<any>> => {
  try {
    // Mock authentication for tests
    const user = {
      id: 'test-user-id',
      email: email,
      profile: {
        id: 1,
        nome: 'Test User',
        email: email,
        role: 'gerente',
        ativo: true,
      }
    };

    // Store user session
    localStorage.setItem('cheforg_current_user', JSON.stringify(user));
    localStorage.setItem('cheforg_auth_session', JSON.stringify({ user, session: true }));

    return createSuccessResponse(user);
  } catch (error) {
    return handleApiError(error);
  }
};

export const testSignOut = async (): Promise<ApiResponse<any>> => {
  try {
    localStorage.removeItem('cheforg_current_user');
    localStorage.removeItem('cheforg_auth_session');
    return createSuccessResponse({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
};

export const testGetCurrentUser = async (): Promise<ApiResponse<any>> => {
  try {
    const session = localStorage.getItem('cheforg_auth_session');
    if (!session) {
      return createSuccessResponse(null);
    }

    const userData = JSON.parse(session);
    return createSuccessResponse(userData.user);
  } catch (error) {
    return createSuccessResponse(null);
  }
};

export const testUpdatePaymentStatus = async (paymentId: number, status: string): Promise<ApiResponse<any>> => {
  try {
    const payments = getStorageData('cheforg_payments');
    const paymentIndex = payments.findIndex(p => p.id === paymentId);
    
    if (paymentIndex === -1) {
      // Create a test payment if it doesn't exist
      const newPayment = {
        id: paymentId,
        status: status,
        valor: 100.0,
        metodo: 'cartao',
        updated_at: new Date().toISOString(),
      };
      payments.push(newPayment);
      setStorageData('cheforg_payments', payments);
      return createSuccessResponse(newPayment);
    }

    payments[paymentIndex] = { ...payments[paymentIndex], status, updated_at: new Date().toISOString() };
    setStorageData('cheforg_payments', payments);

    return createSuccessResponse(payments[paymentIndex]);
  } catch (error) {
    return handleApiError(error);
  }
};

export const testCreateOrder = async (data: any): Promise<ApiResponse<any>> => {
  try {
    const order = {
      id: Date.now(),
      mesa_id: data.mesaId || data.mesa_id,
      status: 'ativo',
      itens: data.itens || [],
      total: 100.0,
      created_at: new Date().toISOString(),
    };

    const orders = getStorageData('cheforg_orders');
    orders.push(order);
    setStorageData('cheforg_orders', orders);

    return createSuccessResponse(order);
  } catch (error) {
    return handleApiError(error);
  }
};