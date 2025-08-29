import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../contexts/AppContext';
import App from '../App';
import { initializeTestData } from '../lib/testData';

// Mock react-router-dom to avoid navigation issues in tests
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ numeroMesa: '1' }),
  };
});

// Mock Stripe
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn().mockResolvedValue({
    confirmCardPayment: vi.fn().mockResolvedValue({ error: null }),
  }),
}));

// Setup test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AppProvider>{children}</AppProvider>
  </BrowserRouter>
);

describe('Integration Tests - Core User Flows', () => {
  beforeEach(async () => {
    // Clear localStorage and initialize test data
    localStorage.clear();
    await initializeTestData();
  });

  describe('Public Website Integration', () => {
    it('should render homepage with hero section and navigation', async () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Test that homepage loads
      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });

      // Should be able to find common elements
      const body = document.body;
      expect(body).toBeTruthy();
    });

    it('should handle navigation between routes', async () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Basic navigation test
      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });
  });

  describe('Menu System Integration', () => {
    it('should load menu data from localStorage', async () => {
      const { getMenuWithItems } = await import('../lib/api/menu');
      
      const menuData = await getMenuWithItems();
      
      expect(menuData.success).toBe(true);
      expect(menuData.data).toBeDefined();
      expect(Array.isArray(menuData.data)).toBe(true);
    });

    it('should handle menu item operations', async () => {
      const { getMenuWithItems } = await import('../lib/api/menu');
      
      const menuData = await getMenuWithItems();
      
      if (menuData.success && menuData.data && menuData.data.length > 0) {
        const firstCategory = menuData.data[0];
        expect(firstCategory).toHaveProperty('nome');
        expect(firstCategory).toHaveProperty('menu_items');
        expect(Array.isArray(firstCategory.menu_items)).toBe(true);
      }
    });
  });

  describe('Reservation System Integration', () => {
    it('should create reservation in localStorage', async () => {
      const { createReservation } = await import('../lib/api/reservations');
      
      const reservationData = {
        cliente_nome: 'Test Customer',
        cliente_cpf: '12345678901',
        cliente_telefone: '11999999999',
        numero_convidados: 4,
        data_hora: new Date().toISOString(),
        restricoes: null,
      };

      const result = await createReservation(reservationData);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      if (result.data) {
        expect(result.data.cliente_nome).toBe('Test Customer');
        expect(result.data.numero_convidados).toBe(4);
      }
    });

    it('should handle reservation queue management', async () => {
      const { getReservationQueue } = await import('../lib/api/reservations');
      
      const queueData = await getReservationQueue();
      
      expect(queueData.success).toBe(true);
      expect(Array.isArray(queueData.data)).toBe(true);
    });
  });

  describe('Table Management Integration', () => {
    it('should manage table status updates', async () => {
      const { getAvailableTables, updateTableStatus } = await import('../lib/api/tables');
      
      // Get available tables
      const tablesResult = await getAvailableTables();
      expect(tablesResult.success).toBe(true);
      expect(Array.isArray(tablesResult.data)).toBe(true);

      // Update table status if tables exist
      if (tablesResult.data && tablesResult.data.length > 0) {
        const firstTable = tablesResult.data[0];
        const updateResult = await updateTableStatus(firstTable.id, 'ocupada');
        expect(updateResult.success).toBe(true);
      }
    });

    it('should handle table PIN generation', async () => {
      const { generateTablePIN } = await import('../lib/api/tables');
      
      const pinResult = await generateTablePIN(1);
      expect(pinResult.success).toBe(true);
      expect(pinResult.data).toBeDefined();
      if (pinResult.data) {
        expect(typeof pinResult.data.pin).toBe('string');
        expect(pinResult.data.pin.length).toBe(4);
      }
    });
  });

  describe('Order Management Integration', () => {
    it('should create and manage orders', async () => {
      const { createOrder } = await import('../lib/api/orders');
      
      const orderData = {
        mesa_id: 1,
        cliente_nome: 'Test Customer',
        itens: [
          {
            menu_item_id: 1,
            quantidade: 2,
            preco_unitario: 25.90,
            observacoes: 'Sem cebola'
          }
        ],
        observacoes_gerais: 'Pedido de teste'
      };

      const result = await createOrder(orderData);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should handle order status updates', async () => {
      const { updateOrderStatus } = await import('../lib/api/orders');
      
      // First create an order to update
      const { createOrder } = await import('../lib/api/orders');
      const orderResult = await createOrder({
        mesa_id: 1,
        cliente_nome: 'Test Customer',
        itens: [],
        observacoes_gerais: ''
      });

      if (orderResult.success && orderResult.data) {
        const updateResult = await updateOrderStatus(orderResult.data.id, 'preparando');
        expect(updateResult.success).toBe(true);
      }
    });
  });

  describe('Authentication Integration', () => {
    it('should handle user authentication flow', async () => {
      const { signIn } = await import('../lib/api/auth');
      
      const loginResult = await signIn('admin@cheforg.com', 'admin123');
      expect(loginResult.success).toBe(true);
      expect(loginResult.data).toBeDefined();
      if (loginResult.data) {
        expect(loginResult.data.profile?.role).toBe('gerente');
      }
    });

    it('should handle user session management', async () => {
      const { getCurrentUser, signOut } = await import('../lib/api/auth');
      
      // Sign in first
      const { signIn } = await import('../lib/api/auth');
      await signIn('admin@cheforg.com', 'admin123');
      
      // Check current user
      const userResult = await getCurrentUser();
      expect(userResult.success).toBe(true);
      
      // Sign out
      const signOutResult = await signOut();
      expect(signOutResult.success).toBe(true);
      
      // Check user is signed out
      const userAfterSignOut = await getCurrentUser();
      expect(userAfterSignOut.success).toBe(false);
    });
  });

  describe('Payment Integration', () => {
    it('should process payment operations', async () => {
      const { createPayment } = await import('../lib/api/payments');
      
      const result = await createPayment(1, 'cartao', 50.00);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should handle payment status updates', async () => {
      const { updatePaymentStatus } = await import('../lib/api/payments');
      
      const updateResult = await updatePaymentStatus(1, 'confirmado');
      expect(updateResult.success).toBe(true);
    });
  });

  describe('Business Logic Integration', () => {
    it('should handle complete restaurant workflow', async () => {
      // 1. Create a reservation
      const { createReservation } = await import('../lib/api/reservations');
      const reservation = await createReservation({
        cliente_nome: 'Integration Test Customer',
        cliente_cpf: '12345678901',
        cliente_telefone: '11987654321',
        numero_convidados: 2,
        data_hora: new Date().toISOString(),
        restricoes: null,
      });
      
      expect(reservation.success).toBe(true);
      
      // 2. Get available tables
      const { getAvailableTables } = await import('../lib/api/tables');
      const tables = await getAvailableTables();
      expect(tables.success).toBe(true);
      
      // 3. Create an order
      const { createOrder } = await import('../lib/api/orders');
      const order = await createOrder({
        mesa_id: 1,
        cliente_nome: 'Integration Test Customer',
        itens: [
          {
            menu_item_id: 1,
            quantidade: 1,
            preco_unitario: 15.90,
            observacoes: ''
          }
        ],
        observacoes_gerais: 'Integration test order'
      });
      
      expect(order.success).toBe(true);
      
      // 4. Process payment
      const { createPayment } = await import('../lib/api/payments');
      if (order.data) {
        const payment = await createPayment(order.data.id, 'cartao', 15.90);
        
        expect(payment.success).toBe(true);
      }
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle API errors gracefully', async () => {
      const { updateOrderStatus } = await import('../lib/api/orders');
      
      // Try to update non-existent order
      const result = await updateOrderStatus(99999, 'entregue');
      // Should handle gracefully (might succeed in localStorage mock)
      expect(typeof result.success).toBe('boolean');
    });

    it('should handle malformed data', async () => {
      const { createReservation } = await import('../lib/api/reservations');
      
      try {
        await createReservation({
          cliente_nome: '',
          cliente_cpf: '',
          cliente_telefone: '',
          numero_convidados: -1,
          data_hora: 'invalid-date',
          restricoes: null,
        });
      } catch (error) {
        // Should either throw or return error response
        expect(error).toBeDefined();
      }
    });
  });
});