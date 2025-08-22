import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getSalesDashboardData, getReservationsDashboardData, getStockDashboardData, getLoyaltyDashboardData } from '../../src/lib/api/dashboard';
import { createReservation, getReservationsByDate } from '../../src/lib/api/reservations';
import { createOrder, updateOrderStatus, getOrdersByTable } from '../../src/lib/api/orders';
import { processPayment, getPaymentStatus } from '../../src/lib/api/payments';

// Mock Supabase
vi.mock('../../src/lib/supabase', () => ({
  default: {
    rpc: vi.fn(),
  }
}));

// Mock localStorage client
vi.mock('../../src/lib/localStorage', () => ({
  localStorageClient: {
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ data: [], error: null }),
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      update: vi.fn().mockResolvedValue({ data: [], error: null }),
      delete: vi.fn().mockResolvedValue({ data: [], error: null }),
      eq: vi.fn().mockReturnThis(),
      filter: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
    })),
    rpc: vi.fn(),
  }
}));

describe('API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Dashboard API', () => {
    it('should fetch sales dashboard data successfully', async () => {
      const mockData = {
        total_sales: 1250.75,
        order_count: 45,
        avg_order_value: 27.79,
        top_products: [
          { name: 'Hambúrguer Artesanal', quantity: 15 },
          { name: 'Pizza Margherita', quantity: 12 }
        ]
      };

      // Mock successful RPC call
      const { localStorageClient } = await import('../../src/lib/localStorage');
      vi.mocked(localStorageClient.rpc).mockResolvedValue({
        data: mockData,
        error: null
      });

      const result = await getSalesDashboardData('2024-01-01', '2024-01-31');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
      expect(localStorageClient.rpc).toHaveBeenCalledWith('get_sales_dashboard_data', {
        start_date: '2024-01-01',
        end_date: '2024-01-31'
      });
    });

    it('should handle error when sales data is not found', async () => {
      const { localStorageClient } = await import('../../src/lib/localStorage');
      vi.mocked(localStorageClient.rpc).mockResolvedValue({
        data: null,
        error: null
      });

      const result = await getSalesDashboardData('2024-01-01', '2024-01-31');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Dados de vendas não encontrados');
    });

    it('should fetch reservations dashboard data', async () => {
      const mockData = {
        total_reservations: 25,
        confirmed_reservations: 20,
        pending_reservations: 3,
        cancelled_reservations: 2,
        peak_hours: ['19:00', '20:00', '21:00']
      };

      const { localStorageClient } = await import('../../src/lib/localStorage');
      vi.mocked(localStorageClient.rpc).mockResolvedValue({
        data: mockData,
        error: null
      });

      const result = await getReservationsDashboardData('2024-01-15');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
    });

    it('should fetch stock dashboard data', async () => {
      const mockData = {
        low_stock_items: 5,
        out_of_stock_items: 2,
        total_items: 50,
        stock_value: 5250.00
      };

      const { localStorageClient } = await import('../../src/lib/localStorage');
      vi.mocked(localStorageClient.rpc).mockResolvedValue({
        data: mockData,
        error: null
      });

      const result = await getStockDashboardData();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
    });

    it('should fetch loyalty dashboard data', async () => {
      const mockData = {
        total_members: 150,
        active_members: 120,
        points_redeemed_today: 500,
        new_members_this_week: 8
      };

      const { localStorageClient } = await import('../../src/lib/localStorage');
      vi.mocked(localStorageClient.rpc).mockResolvedValue({
        data: mockData,
        error: null
      });

      const result = await getLoyaltyDashboardData();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
    });
  });

  describe('Reservations API', () => {
    it('should create a reservation successfully', async () => {
      const reservationData = {
        cliente_nome: 'João Silva',
        cliente_cpf: '123.456.789-00',
        cliente_telefone: '(11) 99999-0000',
        data_hora: '2024-01-15T19:00:00',
        numero_convidados: 4,
        restricoes: 'Mesa próxima à janela'
      };

      const mockCreatedReservation = {
        id: 1,
        ...reservationData,
        status: 'confirmada',
        created_at: new Date().toISOString()
      };

      const { localStorageClient } = await import('../../src/lib/localStorage');
      const mockFrom = {
        insert: vi.fn().mockResolvedValue({ 
          data: [mockCreatedReservation], 
          error: null 
        }),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
      };
      vi.mocked(localStorageClient.from).mockReturnValue(mockFrom as any);

      const result = await createReservation(reservationData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCreatedReservation);
    });

    it('should get reservations by date', async () => {
      const mockReservations = [
        {
          id: 1,
          cliente_nome: 'João Silva',
          data_hora: '2024-01-15T19:00:00',
          status: 'confirmada'
        },
        {
          id: 2,
          cliente_nome: 'Maria Santos',
          data_hora: '2024-01-15T20:00:00',
          status: 'pendente'
        }
      ];

      const { localStorageClient } = await import('../../src/lib/localStorage');
      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lt: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ 
          data: mockReservations, 
          error: null 
        }),
      };
      vi.mocked(localStorageClient.from).mockReturnValue(mockFrom as any);

      const result = await getReservationsByDate('2024-01-15');

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
    });
  });

  describe('Orders API', () => {
    it('should create an order successfully', async () => {
      const orderData = {
        table_id: 1,
        customer_name: 'Cliente Teste',
        items: [
          { menu_item_id: 1, quantidade: 2, preco_unitario: 25.90 },
          { menu_item_id: 2, quantidade: 1, preco_unitario: 32.50 }
        ]
      };

      const mockCreatedOrder = {
        id: 1,
        ...orderData,
        status: 'pendente',
        total: 84.30,
        created_at: new Date().toISOString()
      };

      const { localStorageClient } = await import('../../src/lib/localStorage');
      const mockFrom = {
        insert: vi.fn().mockResolvedValue({ 
          data: [mockCreatedOrder], 
          error: null 
        }),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
      };
      vi.mocked(localStorageClient.from).mockReturnValue(mockFrom as any);

      const result = await createOrder(orderData);

      expect(result.success).toBe(true);
      expect(result.data?.total).toBe(84.30);
    });

    it('should update order status', async () => {
      const { localStorageClient } = await import('../../src/lib/localStorage');
      const mockFrom = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ 
          data: { id: 1, status: 'preparando' }, 
          error: null 
        }),
      };
      vi.mocked(localStorageClient.from).mockReturnValue(mockFrom as any);

      const result = await updateOrderStatus(1, 'preparando');

      expect(result.success).toBe(true);
      expect(result.data?.status).toBe('preparando');
    });

    it('should get orders by table', async () => {
      const mockOrders = [
        { id: 1, table_id: 1, status: 'preparando', total: 84.30 },
        { id: 2, table_id: 1, status: 'pronto', total: 45.50 }
      ];

      const { localStorageClient } = await import('../../src/lib/localStorage');
      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ 
          data: mockOrders, 
          error: null 
        }),
      };
      vi.mocked(localStorageClient.from).mockReturnValue(mockFrom as any);

      const result = await getOrdersByTable(1);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
    });
  });

  describe('Payments API', () => {
    it('should process payment successfully', async () => {
      const paymentData = {
        order_id: 1,
        valor: 84.30,
        metodo: 'pix' as const
      };

      const mockPayment = {
        id: 1,
        ...paymentData,
        status: 'processando',
        codigo_pagamento: 'PIX_12345',
        created_at: new Date().toISOString()
      };

      const { localStorageClient } = await import('../../src/lib/localStorage');
      const mockFrom = {
        insert: vi.fn().mockResolvedValue({ 
          data: [mockPayment], 
          error: null 
        }),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
      };
      vi.mocked(localStorageClient.from).mockReturnValue(mockFrom as any);

      const result = await processPayment(paymentData);

      expect(result.success).toBe(true);
      expect(result.data?.status).toBe('processando');
      expect(result.data?.codigo_pagamento).toBeDefined();
    });

    it('should get payment status', async () => {
      const mockPayment = {
        id: 1,
        status: 'confirmado',
        codigo_pagamento: 'PIX_12345'
      };

      const { localStorageClient } = await import('../../src/lib/localStorage');
      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ 
          data: mockPayment, 
          error: null 
        }),
      };
      vi.mocked(localStorageClient.from).mockReturnValue(mockFrom as any);

      const result = await getPaymentStatus('PIX_12345');

      expect(result.success).toBe(true);
      expect(result.data?.status).toBe('confirmado');
    });
  });
});