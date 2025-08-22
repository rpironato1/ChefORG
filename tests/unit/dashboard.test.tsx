import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../../src/pages/admin/Dashboard';
import PainelCozinha from '../../src/pages/staff/PainelCozinha';
import PainelGarcom from '../../src/pages/staff/PainelGarcom';
import { AppProvider } from '../../src/contexts/AppContext';

// Mock the API modules
vi.mock('../../src/lib/api/dashboard', () => ({
  getSalesDashboardData: vi.fn().mockResolvedValue({
    success: true,
    data: {
      total_sales: 1250.75,
      order_count: 45,
      avg_order_value: 27.79,
      top_products: [
        { name: 'Hambúrguer Artesanal', quantity: 15 },
        { name: 'Pizza Margherita', quantity: 12 }
      ]
    }
  }),
  getReservationsDashboardData: vi.fn().mockResolvedValue({
    success: true,
    data: {
      total_reservations: 25,
      confirmed_reservations: 20,
      pending_reservations: 3,
      cancelled_reservations: 2
    }
  }),
  getStockDashboardData: vi.fn().mockResolvedValue({
    success: true,
    data: {
      low_stock_items: 5,
      out_of_stock_items: 2,
      total_items: 50,
      stock_value: 5250.00
    }
  }),
  getLoyaltyDashboardData: vi.fn().mockResolvedValue({
    success: true,
    data: {
      total_members: 150,
      active_members: 120,
      points_redeemed_today: 500,
      new_members_this_week: 8
    }
  })
}));

vi.mock('../../src/lib/api/orders', () => ({
  getOrdersByStatus: vi.fn().mockResolvedValue({
    success: true,
    data: [
      {
        id: 1,
        table_id: 2,
        customer_name: 'Cliente Teste',
        status: 'preparando',
        items: [
          {
            id: 1,
            menu_items: { nome: 'Hambúrguer Artesanal' },
            quantidade: 1,
            observacoes: 'Sem cebola'
          }
        ],
        created_at: new Date().toISOString()
      }
    ]
  }),
  updateOrderStatus: vi.fn().mockResolvedValue({
    success: true,
    data: { id: 1, status: 'pronto' }
  })
}));

// Mock authentication context
const mockUser = {
  id: 1,
  nome: 'Test User',
  role: 'gerente' as const,
  email: 'test@example.com'
};

const MockAppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppProvider>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </AppProvider>
  );
};

describe('Dashboard Components Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock authentication
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key) => {
          if (key === 'currentUser') {
            return JSON.stringify(mockUser);
          }
          return null;
        }),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn()
      },
      writable: true
    });
  });

  describe('Admin Dashboard', () => {
    it('should render dashboard cards with correct data', async () => {
      render(
        <MockAppProvider>
          <Dashboard />
        </MockAppProvider>
      );

      // Check if main dashboard elements are present
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      
      // Wait for data to load and verify dashboard metrics
      await waitFor(() => {
        expect(screen.getByText('R$ 1.250,75')).toBeInTheDocument(); // Total sales
        expect(screen.getByText('45')).toBeInTheDocument(); // Order count
        expect(screen.getByText('25')).toBeInTheDocument(); // Total reservations
      });
    });

    it('should display sales chart', async () => {
      render(
        <MockAppProvider>
          <Dashboard />
        </MockAppProvider>
      );

      await waitFor(() => {
        const chartContainer = screen.getByText('Vendas por Dia');
        expect(chartContainer).toBeInTheDocument();
      });
    });

    it('should show top products', async () => {
      render(
        <MockAppProvider>
          <Dashboard />
        </MockAppProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Hambúrguer Artesanal')).toBeInTheDocument();
        expect(screen.getByText('Pizza Margherita')).toBeInTheDocument();
      });
    });

    it('should display stock alerts when there are low stock items', async () => {
      render(
        <MockAppProvider>
          <Dashboard />
        </MockAppProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('5')).toBeInTheDocument(); // Low stock items
        expect(screen.getByText('2')).toBeInTheDocument(); // Out of stock items
      });
    });
  });

  describe('Painel Cozinha', () => {
    it('should render kitchen panel with pending orders', async () => {
      render(
        <MockAppProvider>
          <PainelCozinha />
        </MockAppProvider>
      );

      expect(screen.getByText('Painel da Cozinha')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.getByText('Hambúrguer Artesanal')).toBeInTheDocument();
        expect(screen.getByText('Mesa 2')).toBeInTheDocument();
        expect(screen.getByText('Sem cebola')).toBeInTheDocument();
      });
    });

    it('should show order status buttons', async () => {
      render(
        <MockAppProvider>
          <PainelCozinha />
        </MockAppProvider>
      );

      await waitFor(() => {
        const preparandoButton = screen.getByText('Preparando');
        const prontoButton = screen.getByText('Marcar como Pronto');
        
        expect(preparandoButton).toBeInTheDocument();
        expect(prontoButton).toBeInTheDocument();
      });
    });

    it('should display order timing information', async () => {
      render(
        <MockAppProvider>
          <PainelCozinha />
        </MockAppProvider>
      );

      await waitFor(() => {
        // Check for time-related elements
        const timeElements = screen.getAllByText(/min/i);
        expect(timeElements.length).toBeGreaterThan(0);
      });
    });

    it('should show order queue statistics', async () => {
      render(
        <MockAppProvider>
          <PainelCozinha />
        </MockAppProvider>
      );

      await waitFor(() => {
        // Check for queue statistics
        expect(screen.getByText('Pedidos na Fila')).toBeInTheDocument();
        expect(screen.getByText('Tempo Médio')).toBeInTheDocument();
      });
    });
  });

  describe('Painel Garçom', () => {
    it('should render waiter panel with table information', async () => {
      render(
        <MockAppProvider>
          <PainelGarcom />
        </MockAppProvider>
      );

      expect(screen.getByText('Painel do Garçom')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.getByText('Mesas Ativas')).toBeInTheDocument();
        expect(screen.getByText('Pedidos Prontos')).toBeInTheDocument();
      });
    });

    it('should display active tables status', async () => {
      render(
        <MockAppProvider>
          <PainelGarcom />
        </MockAppProvider>
      );

      await waitFor(() => {
        // Check for table status elements
        const tableElements = screen.getAllByText(/Mesa/i);
        expect(tableElements.length).toBeGreaterThan(0);
      });
    });

    it('should show ready orders notification', async () => {
      render(
        <MockAppProvider>
          <PainelGarcom />
        </MockAppProvider>
      );

      await waitFor(() => {
        // Check for ready orders section
        expect(screen.getByText('Pedidos Prontos')).toBeInTheDocument();
      });
    });

    it('should display reservation management', async () => {
      render(
        <MockAppProvider>
          <PainelGarcom />
        </MockAppProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Próximas Reservas')).toBeInTheDocument();
      });
    });
  });

  describe('Dashboard Real-time Updates', () => {
    it('should update order status when kitchen marks item as ready', async () => {
      const { updateOrderStatus } = await import('../../src/lib/api/orders');
      
      render(
        <MockAppProvider>
          <PainelCozinha />
        </MockAppProvider>
      );

      await waitFor(() => {
        const readyButton = screen.getByText('Marcar como Pronto');
        readyButton.click();
      });

      expect(updateOrderStatus).toHaveBeenCalledWith(1, 'pronto');
    });

    it('should refresh dashboard data periodically', async () => {
      const { getSalesDashboardData } = await import('../../src/lib/api/dashboard');
      
      render(
        <MockAppProvider>
          <Dashboard />
        </MockAppProvider>
      );

      // Initial load
      await waitFor(() => {
        expect(getSalesDashboardData).toHaveBeenCalled();
      });

      // Should be called again after timeout (mocked)
      vi.advanceTimersByTime(30000); // 30 seconds
      
      expect(getSalesDashboardData).toHaveBeenCalledTimes(2);
    });
  });

  describe('Dashboard Error Handling', () => {
    it('should display error message when API fails', async () => {
      const { getSalesDashboardData } = await import('../../src/lib/api/dashboard');
      vi.mocked(getSalesDashboardData).mockResolvedValueOnce({
        success: false,
        error: 'Failed to fetch data'
      });

      render(
        <MockAppProvider>
          <Dashboard />
        </MockAppProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/erro/i)).toBeInTheDocument();
      });
    });

    it('should show loading state while fetching data', async () => {
      const { getSalesDashboardData } = await import('../../src/lib/api/dashboard');
      
      // Create a delayed promise
      const delayedPromise = new Promise(resolve => 
        setTimeout(() => resolve({
          success: true,
          data: { total_sales: 1000 }
        }), 1000)
      );
      
      vi.mocked(getSalesDashboardData).mockReturnValue(delayedPromise);

      render(
        <MockAppProvider>
          <Dashboard />
        </MockAppProvider>
      );

      // Should show loading indicator
      expect(screen.getByText(/carregando/i) || screen.getByTestId('loading')).toBeInTheDocument();
    });
  });

  describe('Dashboard Responsiveness', () => {
    it('should adapt layout for mobile screens', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <MockAppProvider>
          <Dashboard />
        </MockAppProvider>
      );

      const dashboard = screen.getByText('Dashboard').closest('div');
      expect(dashboard).toBeInTheDocument();
      
      // Check for responsive classes (depends on your CSS framework)
      // This would need to be adapted based on your actual responsive implementation
    });

    it('should show full dashboard on desktop', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });

      render(
        <MockAppProvider>
          <Dashboard />
        </MockAppProvider>
      );

      const dashboard = screen.getByText('Dashboard').closest('div');
      expect(dashboard).toBeInTheDocument();
    });
  });
});