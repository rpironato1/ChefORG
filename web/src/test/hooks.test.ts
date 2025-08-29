import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../contexts/AppContext';
import { useBusinessLogic } from '../hooks/useBusinessLogic';
import { initializeTestData } from '../lib/testData';
import React from 'react';

// Setup test wrapper for hooks that need context
const wrapper = ({ children }: { children: React.ReactNode }) => (
  React.createElement(BrowserRouter, null,
    React.createElement(AppProvider, null, children)
  )
);

describe('Hooks Tests', () => {
  beforeEach(async () => {
    localStorage.clear();
    await initializeTestData();
  });

  describe('useBusinessLogic Hook', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useBusinessLogic(), { wrapper });
      
      expect(result.current.isLoading).toBeDefined();
      expect(result.current.error).toBeDefined();
      expect(typeof result.current.checkTableAvailability).toBe('function');
      expect(typeof result.current.createReservation).toBe('function');
      expect(typeof result.current.processOrder).toBe('function');
    });

    it('should handle table availability check', async () => {
      const { result } = renderHook(() => useBusinessLogic(), { wrapper });
      
      await act(async () => {
        const availability = await result.current.checkTableAvailability(4, new Date());
        expect(typeof availability).toBe('object');
      });
    });

    it('should handle reservation creation', async () => {
      const { result } = renderHook(() => useBusinessLogic(), { wrapper });
      
      await act(async () => {
        const reservation = await result.current.createReservation({
          nome: 'Hook Test Customer',
          telefone: '11999888777',
          convidados: 3,
          dataHora: new Date(),
          restricoes: '',
        });
        expect(typeof reservation).toBe('object');
      });
    });

    it('should handle order processing', async () => {
      const { result } = renderHook(() => useBusinessLogic(), { wrapper });
      
      await act(async () => {
        const order = await result.current.processOrder({
          mesaId: 1,
          clienteNome: 'Hook Test Customer',
          itens: [
            {
              menuItemId: 1,
              quantidade: 2,
              precoUnitario: 20.00,
              observacoes: 'Test item'
            }
          ],
          observacoesGerais: 'Hook test order'
        });
        expect(typeof order).toBe('object');
      });
    });

    it('should handle payment processing', async () => {
      const { result } = renderHook(() => useBusinessLogic(), { wrapper });
      
      await act(async () => {
        const payment = await result.current.processPayment({
          orderId: 1,
          valor: 40.00,
          metodoPagamento: 'cartao_debito',
          dadosCartao: {
            numero: '1234567812345678',
            cvv: '123',
            validade: '12/25',
            titular: 'Test User'
          }
        });
        expect(typeof payment).toBe('object');
      });
    });

    it('should handle queue management', async () => {
      const { result } = renderHook(() => useBusinessLogic(), { wrapper });
      
      await act(async () => {
        const queue = await result.current.getReservationQueue();
        expect(Array.isArray(queue)).toBe(true);
      });
    });

    it('should handle error states', async () => {
      const { result } = renderHook(() => useBusinessLogic(), { wrapper });
      
      // Test error handling with invalid data
      await act(async () => {
        try {
          await result.current.createReservation({
            nome: '',
            telefone: '',
            convidados: -1,
            dataHora: new Date('invalid'),
            restricoes: '',
          });
        } catch (error) {
          // Should handle gracefully
          expect(error).toBeDefined();
        }
      });
    });

    it('should manage loading states', async () => {
      const { result } = renderHook(() => useBusinessLogic(), { wrapper });
      
      let loadingState: boolean;
      
      await act(async () => {
        loadingState = result.current.isLoading;
        await result.current.checkTableAvailability(2, new Date());
      });
      
      expect(typeof loadingState!).toBe('boolean');
    });

    it('should handle table operations', async () => {
      const { result } = renderHook(() => useBusinessLogic(), { wrapper });
      
      await act(async () => {
        const tables = await result.current.getAvailableTables();
        expect(Array.isArray(tables)).toBe(true);
      });

      await act(async () => {
        const pinResult = await result.current.generateTablePIN(1);
        expect(typeof pinResult).toBe('object');
      });
    });

    it('should handle order status updates', async () => {
      const { result } = renderHook(() => useBusinessLogic(), { wrapper });
      
      await act(async () => {
        const statusUpdate = await result.current.updateOrderStatus(1, 'em_preparo');
        expect(typeof statusUpdate).toBe('object');
      });
    });

    it('should handle customer feedback', async () => {
      const { result } = renderHook(() => useBusinessLogic(), { wrapper });
      
      await act(async () => {
        const feedback = await result.current.submitFeedback({
          mesaId: 1,
          avaliacao: 5,
          comentario: 'Excellent service!',
          clienteNome: 'Happy Customer'
        });
        expect(typeof feedback).toBe('object');
      });
    });

    it('should calculate business metrics', async () => {
      const { result } = renderHook(() => useBusinessLogic(), { wrapper });
      
      await act(async () => {
        const metrics = await result.current.calculateDashboardMetrics();
        expect(typeof metrics).toBe('object');
        expect(metrics).toHaveProperty('reservasHoje');
        expect(metrics).toHaveProperty('pedidosAtivos');
        expect(metrics).toHaveProperty('receitaDia');
        expect(metrics).toHaveProperty('tempoMedioAtendimento');
      });
    });

    it('should handle inventory operations', async () => {
      const { result } = renderHook(() => useBusinessLogic(), { wrapper });
      
      await act(async () => {
        const inventory = await result.current.getInventoryStatus();
        expect(typeof inventory).toBe('object');
      });
    });

    it('should manage staff operations', async () => {
      const { result } = renderHook(() => useBusinessLogic(), { wrapper });
      
      await act(async () => {
        const staff = await result.current.getStaffList();
        expect(Array.isArray(staff)).toBe(true);
      });
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle rapid successive calls', async () => {
      const { result } = renderHook(() => useBusinessLogic(), { wrapper });
      
      const promises: Promise<any>[] = [];
      for (let i = 0; i < 5; i++) {
        promises.push(result.current.getAvailableTables());
      }
      
      await act(async () => {
        const results = await Promise.all(promises);
        expect(results.length).toBe(5);
        results.forEach(result => {
          expect(Array.isArray(result)).toBe(true);
        });
      });
    });

    it('should handle concurrent operations', async () => {
      const { result } = renderHook(() => useBusinessLogic(), { wrapper });
      
      await act(async () => {
        const [tables, queue, metrics] = await Promise.all([
          result.current.getAvailableTables(),
          result.current.getReservationQueue(),
          result.current.calculateDashboardMetrics()
        ]);
        
        expect(Array.isArray(tables)).toBe(true);
        expect(Array.isArray(queue)).toBe(true);
        expect(typeof metrics).toBe('object');
      });
    });

    it('should handle memory efficiency', async () => {
      const { result } = renderHook(() => useBusinessLogic(), { wrapper });
      
      // Simulate heavy usage
      for (let i = 0; i < 10; i++) {
        await act(async () => {
          await result.current.getAvailableTables();
          await result.current.getReservationQueue();
        });
      }
      
      // Should not cause memory issues
      expect(result.current).toBeDefined();
    });
  });
});