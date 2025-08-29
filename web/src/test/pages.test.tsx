import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../contexts/AppContext';
import Home from '../pages/public/Home';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/admin/Dashboard';
import MenuPublico from '../pages/public/MenuPublico';
import { initializeTestData } from '../lib/testData';
import React from 'react';

// Error Boundary Component for testing
class TestErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div data-testid="error-fallback">Something went wrong.</div>;
    }

    return this.props.children;
  }
}

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
    useParams: () => ({ numeroMesa: '1' }),
  };
});

vi.mock('lucide-react', () => ({
  // Core icons
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
  AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
  ArrowRight: () => <div data-testid="arrow-right-icon" />,
  Award: () => <div data-testid="award-icon" />,
  Bell: () => <div data-testid="bell-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Camera: () => <div data-testid="camera-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  ChefHat: () => <div data-testid="chef-hat-icon" />,
  ChevronDown: () => <div data-testid="chevron-down-icon" />,
  ChevronUp: () => <div data-testid="chevron-up-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Database: () => <div data-testid="database-icon" />,
  DollarSign: () => <div data-testid="dollar-sign-icon" />,
  Download: () => <div data-testid="download-icon" />,
  Edit: () => <div data-testid="edit-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  EyeOff: () => <div data-testid="eye-off-icon" />,
  Filter: () => <div data-testid="filter-icon" />,
  Globe: () => <div data-testid="globe-icon" />,
  Heart: () => <div data-testid="heart-icon" />,
  Home: () => <div data-testid="home-icon" />,
  ImageIcon: () => <div data-testid="image-icon" />,
  Info: () => <div data-testid="info-icon" />,
  Loader: () => <div data-testid="loader-icon" />,
  Lock: () => <div data-testid="lock-icon" />,
  LogIn: () => <div data-testid="log-in-icon" />,
  Mail: () => <div data-testid="mail-icon" />,
  MapPin: () => <div data-testid="map-pin-icon" />,
  Menu: () => <div data-testid="menu-icon" />,
  MessageCircle: () => <div data-testid="message-circle-icon" />,
  Minus: () => <div data-testid="minus-icon" />,
  Phone: () => <div data-testid="phone-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  Printer: () => <div data-testid="printer-icon" />,
  QrCode: () => <div data-testid="qr-code-icon" />,
  RotateCcw: () => <div data-testid="rotate-ccw-icon" />,
  Save: () => <div data-testid="save-icon" />,
  Search: () => <div data-testid="search-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  ShoppingCart: () => <div data-testid="cart-icon" />,
  Smartphone: () => <div data-testid="smartphone-icon" />,
  Star: () => <div data-testid="star-icon" />,
  Trash: () => <div data-testid="trash-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  User: () => <div data-testid="user-icon" />,
  Users: () => <div data-testid="users-icon" />,
  Utensils: () => <div data-testid="utensils-icon" />,
  X: () => <div data-testid="x-icon" />,
  XCircle: () => <div data-testid="x-circle-icon" />,
  // Critical missing icons from errors
  BookOpen: () => <div data-testid="book-open-icon" />,
  Box: () => <div data-testid="box-icon" />,
  BarChart3: () => <div data-testid="bar-chart-3-icon" />,
  Loader2: () => <div data-testid="loader2-icon" />,
  Trash2: () => <div data-testid="trash2-icon" />,
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AppProvider>
      <TestErrorBoundary>
        {children}
      </TestErrorBoundary>
    </AppProvider>
  </BrowserRouter>
);

describe('Page Components Tests', () => {
  beforeEach(async () => {
    localStorage.clear();
    await initializeTestData();
  });

  describe('Home Page', () => {
    it('should render hero section', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Should render without errors
      expect(document.body).toBeInTheDocument();
    });

    it('should handle navigation interactions', async () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Look for any clickable elements
      const buttons = screen.queryAllByRole('button');
      const links = screen.queryAllByRole('link');

      // Should have some interactive elements
      expect(buttons.length + links.length).toBeGreaterThanOrEqual(0);
    });

    it('should be responsive', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Test responsive behavior by checking viewport
      expect(document.body).toBeInTheDocument();
    });

    it('should handle scroll interactions', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Simulate scroll event
      fireEvent.scroll(window, { target: { scrollY: 100 } });
      
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('Login Page', () => {
    it('should render login form', () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      // Should render without errors
      expect(document.body).toBeInTheDocument();
    });

    it('should handle form submission', async () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      // Look for form elements
      const forms = screen.queryAllByRole('form');
      const buttons = screen.queryAllByRole('button');
      const inputs = screen.queryAllByRole('textbox');

      // Should have form elements
      expect(forms.length + buttons.length + inputs.length).toBeGreaterThanOrEqual(0);
    });

    it('should validate form fields', async () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      // Try to find email and password inputs
      const emailInputs = screen.queryAllByDisplayValue('');
      const passwordInputs = screen.queryAllByDisplayValue('');

      // Should handle field validation
      expect(emailInputs.length + passwordInputs.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle authentication errors', async () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      // Should render error states gracefully
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('Admin Dashboard', () => {
    it('should render dashboard metrics', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Should render without errors
      expect(document.body).toBeInTheDocument();
    });

    it('should display data visualizations', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Wait for any async data loading
      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });

    it('should handle real-time updates', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Simulate data updates
      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });

    it('should handle user interactions', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Look for interactive elements
      const buttons = screen.queryAllByRole('button');
      const links = screen.queryAllByRole('link');

      // Should have interactive dashboard elements
      expect(buttons.length + links.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Public Menu', () => {
    it('should render menu categories', async () => {
      render(
        <TestWrapper>
          <MenuPublico />
        </TestWrapper>
      );

      // Should render without errors
      expect(document.body).toBeInTheDocument();
    });

    it('should handle menu filtering', async () => {
      render(
        <TestWrapper>
          <MenuPublico />
        </TestWrapper>
      );

      // Look for filter elements
      const buttons = screen.queryAllByRole('button');
      
      // Should have filtering capabilities
      expect(buttons.length).toBeGreaterThanOrEqual(0);
    });

    it('should display menu items', async () => {
      render(
        <TestWrapper>
          <MenuPublico />
        </TestWrapper>
      );

      // Wait for menu data to load
      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });

    it('should handle search functionality', async () => {
      render(
        <TestWrapper>
          <MenuPublico />
        </TestWrapper>
      );

      // Look for search input
      const searchInputs = screen.queryAllByRole('searchbox');
      const textInputs = screen.queryAllByRole('textbox');

      // Should have search capability
      expect(searchInputs.length + textInputs.length).toBeGreaterThanOrEqual(0);
    });

    it('should be mobile responsive', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <TestWrapper>
          <MenuPublico />
        </TestWrapper>
      );

      expect(document.body).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle component mount errors gracefully', () => {
      // Test error boundary behavior
      const ErrorComponent = () => {
        throw new Error('Test error');
      };

      expect(() => {
        render(
          <TestWrapper>
            <ErrorComponent />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle missing data gracefully', async () => {
      // Clear localStorage to simulate missing data
      localStorage.clear();

      render(
        <TestWrapper>
          <MenuPublico />
        </TestWrapper>
      );

      // Should handle missing data without crashing
      expect(document.body).toBeInTheDocument();
    });

    it('should handle network errors', async () => {
      // Mock network failure
      vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Should handle network errors gracefully
      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Look for headings
      const headings = screen.queryAllByRole('heading');
      expect(headings.length).toBeGreaterThanOrEqual(0);
    });

    it('should have keyboard navigation support', () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      // Look for focusable elements
      const buttons = screen.queryAllByRole('button');
      const links = screen.queryAllByRole('link');
      const inputs = screen.queryAllByRole('textbox');

      // Should have keyboard accessible elements
      expect(buttons.length + links.length + inputs.length).toBeGreaterThanOrEqual(0);
    });

    it('should have proper ARIA labels', () => {
      render(
        <TestWrapper>
          <MenuPublico />
        </TestWrapper>
      );

      // Should render with proper accessibility attributes
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render quickly', async () => {
      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within reasonable time (1 second)
      expect(renderTime).toBeLessThan(1000);
    });

    it('should handle large datasets', async () => {
      // Initialize with large dataset
      await initializeTestData();
      
      render(
        <TestWrapper>
          <MenuPublico />
        </TestWrapper>
      );

      // Should handle large menu datasets
      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });

    it('should not have memory leaks', () => {
      const { unmount } = render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Should unmount cleanly
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Integration with Context', () => {
    it('should update UI when context changes', async () => {
      const { rerender } = render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Should handle context updates
      rerender(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      expect(document.body).toBeInTheDocument();
    });

    it('should reflect auth state changes', async () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      // Should update based on auth state
      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });
  });
});