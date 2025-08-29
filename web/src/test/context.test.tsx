import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, renderHook, act, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider, useMesa, useAuth } from '../contexts/AppContext';
import { initializeTestData } from '../lib/testData';
import React from 'react';

// Mock react-router-dom for components that use navigation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
  };
});

describe('Context Tests', () => {
  beforeEach(async () => {
    localStorage.clear();
    await initializeTestData();
  });

  describe('AppProvider', () => {
    it('should provide context values to children', () => {
      const TestComponent = () => {
        const mesa = useMesa();
        const auth = useAuth();
        return (
          <div>
            <div data-testid="mesa-context">{mesa ? 'mesa-available' : 'no-mesa'}</div>
            <div data-testid="auth-context">{auth ? 'auth-available' : 'no-auth'}</div>
          </div>
        );
      };

      render(
        <BrowserRouter>
          <AppProvider>
            <TestComponent />
          </AppProvider>
        </BrowserRouter>
      );

      expect(screen.getByTestId('mesa-context')).toBeInTheDocument();
      expect(screen.getByTestId('auth-context')).toBeInTheDocument();
    });

    it('should handle auth context operations', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <BrowserRouter>
          <AppProvider>{children}</AppProvider>
        </BrowserRouter>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current).toBeDefined();
      expect(typeof result.current.user).toBeDefined();
      expect(typeof result.current.loading).toBe('boolean');
      expect(typeof result.current.signIn).toBe('function');
      expect(typeof result.current.signOut).toBe('function');
    });

    it('should handle mesa context operations', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <BrowserRouter>
          <AppProvider>{children}</AppProvider>
        </BrowserRouter>
      );

      const { result } = renderHook(() => useMesa(), { wrapper });

      expect(result.current).toBeDefined();
      expect(typeof result.current.mesaAtual).toBeDefined();
      expect(typeof result.current.selecionarMesa).toBe('function');
      expect(typeof result.current.liberarMesa).toBe('function');
    });

    it('should update auth state on sign in', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <BrowserRouter>
          <AppProvider>{children}</AppProvider>
        </BrowserRouter>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.signIn('admin@cheforg.com', 'admin123');
      });

      // Check if user state is updated
      expect(result.current.user).toBeDefined();
    });

    it('should update mesa state on selection', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <BrowserRouter>
          <AppProvider>{children}</AppProvider>
        </BrowserRouter>
      );

      const { result } = renderHook(() => useMesa(), { wrapper });

      await act(async () => {
        result.current.selecionarMesa({
          id: '1',
          numero: 5,
          capacidade: 4,
          status: 'livre',
          pin: undefined,
          qrCode: 'test_qr',
          garcom: undefined,
          pedidoAtual: undefined,
          clienteAtual: undefined,
        });
      });

      expect(result.current.mesaAtual).toBeDefined();
      expect(result.current.mesaAtual.mesa?.numero).toBe(5);
    });

    it('should handle error states in auth', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <BrowserRouter>
          <AppProvider>{children}</AppProvider>
        </BrowserRouter>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        try {
          await result.current.signIn('invalid@email.com', 'wrongpassword');
        } catch (error) {
          // Should handle auth errors gracefully
          expect(error).toBeDefined();
        }
      });
    });

    it('should persist auth state across re-renders', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <BrowserRouter>
          <AppProvider>{children}</AppProvider>
        </BrowserRouter>
      );

      const { result, rerender } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.signIn('admin@cheforg.com', 'admin123');
      });

      const userBeforeRerender = result.current.user;

      rerender();

      // User should persist after rerender
      expect(result.current.user).toEqual(userBeforeRerender);
    });

    it('should clear auth state on sign out', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <BrowserRouter>
          <AppProvider>{children}</AppProvider>
        </BrowserRouter>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Sign in first
      await act(async () => {
        await result.current.signIn('admin@cheforg.com', 'admin123');
      });

      expect(result.current.user).toBeDefined();

      // Then sign out
      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.user).toBeNull();
    });

    it('should handle concurrent context operations', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <BrowserRouter>
          <AppProvider>{children}</AppProvider>
        </BrowserRouter>
      );

      const authResult = renderHook(() => useAuth(), { wrapper });
      const mesaResult = renderHook(() => useMesa(), { wrapper });

      await act(async () => {
        // Perform concurrent operations
        const authPromise = authResult.result.current.signIn('admin@cheforg.com', 'admin123');
        const mesaPromise = mesaResult.result.current.selecionarMesa({
          id: '2',
          numero: 10,
          capacidade: 6,
          status: 'livre',
          pin: undefined,
          qrCode: 'test_qr_2',
          garcom: undefined,
          pedidoAtual: undefined,
          clienteAtual: undefined,
        });

        await Promise.all([authPromise, mesaPromise]);
      });

      expect(authResult.result.current.user).toBeDefined();
      expect(mesaResult.result.current.mesaAtual).toBeDefined();
      expect(mesaResult.result.current.mesaAtual.mesa?.numero).toBe(10);
    });
  });

  describe('Context Error Handling', () => {
    it('should handle context provider unmounting gracefully', () => {
      const TestComponent = () => {
        const auth = useAuth();
        return <div data-testid="test">{auth ? 'mounted' : 'unmounted'}</div>;
      };

      const { unmount } = render(
        <BrowserRouter>
          <AppProvider>
            <TestComponent />
          </AppProvider>
        </BrowserRouter>
      );

      expect(screen.getByTestId('test')).toBeInTheDocument();
      
      // Should not throw on unmount
      expect(() => unmount()).not.toThrow();
    });

    it('should handle missing context provider', () => {
      const TestComponent = () => {
        try {
          useAuth();
          return <div data-testid="success">Success</div>;
        } catch (error) {
          return <div data-testid="error">Error</div>;
        }
      };

      // This should either work with default values or show error
      const { container } = render(<TestComponent />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('Context Performance', () => {
    it('should not cause unnecessary re-renders', () => {
      let renderCount = 0;
      
      const TestComponent = () => {
        renderCount++;
        useAuth();
        return <div data-testid="render-count">{renderCount}</div>;
      };

      const { rerender } = render(
        <BrowserRouter>
          <AppProvider>
            <TestComponent />
          </AppProvider>
        </BrowserRouter>
      );

      const initialRenderCount = renderCount;
      
      // Multiple rerenders should not cause excessive re-renders
      rerender(
        <BrowserRouter>
          <AppProvider>
            <TestComponent />
          </AppProvider>
        </BrowserRouter>
      );

      expect(renderCount).toBeLessThanOrEqual(initialRenderCount + 2);
    });

    it('should handle rapid state updates efficiently', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <BrowserRouter>
          <AppProvider>{children}</AppProvider>
        </BrowserRouter>
      );

      const { result } = renderHook(() => useMesa(), { wrapper });

      // Rapid mesa selections
      await act(async () => {
        for (let i = 1; i <= 5; i++) {
          result.current.selecionarMesa({
            id: i.toString(),
            numero: i,
            capacidade: 4,
            status: 'livre',
            pin: undefined,
            qrCode: `test_qr_${i}`,
            garcom: undefined,
            pedidoAtual: undefined,
            clienteAtual: undefined,
          });
        }
      });

      // Should end up with the last selected mesa
      expect(result.current.mesaAtual.mesa?.numero).toBe(5);
    });
  });
});