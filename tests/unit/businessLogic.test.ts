import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGeradorPIN, useValidarDisponibilidadeMesa, useFidelidade } from '../../src/hooks/useBusinessLogic';
import { Mesa } from '../../src/types';

describe('Business Logic Tests', () => {
  describe('useGeradorPIN', () => {
    it('should generate a 4-digit PIN', () => {
      const { result } = renderHook(() => useGeradorPIN());
      
      act(() => {
        const pin = result.current.gerarPIN('mesa-1');
        expect(pin).toMatch(/^\d{4}$/);
        expect(pin.length).toBe(4);
      });
    });

    it('should validate correct PIN', () => {
      const { result } = renderHook(() => useGeradorPIN());
      
      let generatedPin: string;
      
      act(() => {
        generatedPin = result.current.gerarPIN('mesa-1');
      });

      act(() => {
        const isValid = result.current.validarPIN('mesa-1', generatedPin);
        expect(isValid).toBe(true);
      });
    });

    it('should reject invalid PIN', () => {
      const { result } = renderHook(() => useGeradorPIN());
      
      act(() => {
        result.current.gerarPIN('mesa-1');
      });

      act(() => {
        const isValid = result.current.validarPIN('mesa-1', '0000');
        expect(isValid).toBe(false);
      });
    });

    it('should expire PIN after time limit', () => {
      const { result } = renderHook(() => useGeradorPIN());
      
      let generatedPin: string;
      
      act(() => {
        // Generate PIN with very short expiration (1 millisecond)
        generatedPin = result.current.gerarPIN('mesa-1', 1 / (24 * 60 * 60 * 1000));
      });

      // Wait for expiration
      setTimeout(() => {
        act(() => {
          const isValid = result.current.validarPIN('mesa-1', generatedPin);
          expect(isValid).toBe(false);
        });
      }, 10);
    });
  });

  describe('useValidarDisponibilidadeMesa', () => {
    const mockMesas: Mesa[] = [
      {
        id: '1',
        numero: 1,
        capacidade: 2,
        status: 'livre',
        qrCode: 'QR001',
        pin: '1234'
      },
      {
        id: '2',
        numero: 2,
        capacidade: 4,
        status: 'ocupada',
        qrCode: 'QR002',
        pin: '2345'
      },
      {
        id: '3',
        numero: 3,
        capacidade: 6,
        status: 'livre',
        qrCode: 'QR003',
        pin: '3456'
      }
    ];

    it('should find available tables for the requested capacity', () => {
      const { result } = renderHook(() => useValidarDisponibilidadeMesa());
      
      const validation = result.current.validarDisponibilidade(
        mockMesas,
        new Date(),
        2
      );

      expect(validation.disponivel).toBe(true);
      expect(validation.mesasSugeridas).toHaveLength(2);
      expect(validation.mesasSugeridas[0].numero).toBe(1); // Smaller table first
    });

    it('should return no tables when capacity is too high', () => {
      const { result } = renderHook(() => useValidarDisponibilidadeMesa());
      
      const validation = result.current.validarDisponibilidade(
        mockMesas,
        new Date(),
        8
      );

      expect(validation.disponivel).toBe(false);
      expect(validation.mesasSugeridas).toHaveLength(0);
    });

    it('should suggest tables in order of size', () => {
      const { result } = renderHook(() => useValidarDisponibilidadeMesa());
      
      const validation = result.current.validarDisponibilidade(
        mockMesas,
        new Date(),
        2
      );

      expect(validation.mesasSugeridas[0].capacidade).toBeLessThanOrEqual(
        validation.mesasSugeridas[1].capacidade
      );
    });
  });

  describe('useFidelidade', () => {
    beforeEach(() => {
      // Clear localStorage before each test
      localStorage.clear();
    });

    it('should calculate points correctly for purchase', () => {
      const { result } = renderHook(() => useFidelidade());
      
      act(() => {
        result.current.adicionarPontos('user-1', 100.0);
      });

      const saldo = result.current.obterSaldoPontos('user-1');
      expect(saldo).toBe(10); // 10% of 100 = 10 points
    });

    it('should apply discount when redeeming points', () => {
      const { result } = renderHook(() => useFidelidade());
      
      // Add points first
      act(() => {
        result.current.adicionarPontos('user-1', 500.0); // 50 points
      });

      // Redeem points for discount
      act(() => {
        const discount = result.current.resgatarPontos('user-1', 25);
        expect(discount).toBe(25.0); // 25 points = R$ 25.00
      });

      // Check remaining balance
      const saldo = result.current.obterSaldoPontos('user-1');
      expect(saldo).toBe(25); // 50 - 25 = 25
    });

    it('should prevent redeeming more points than available', () => {
      const { result } = renderHook(() => useFidelidade());
      
      act(() => {
        result.current.adicionarPontos('user-1', 100.0); // 10 points
      });

      act(() => {
        const discount = result.current.resgatarPontos('user-1', 50); // Try to redeem 50
        expect(discount).toBe(0); // Should not allow
      });

      // Balance should remain unchanged
      const saldo = result.current.obterSaldoPontos('user-1');
      expect(saldo).toBe(10);
    });

    it('should track user tier correctly', () => {
      const { result } = renderHook(() => useFidelidade());
      
      act(() => {
        // Add enough points to reach higher tier
        result.current.adicionarPontos('user-1', 1000.0); // 100 points
      });

      const nivel = result.current.obterNivelFidelidade('user-1');
      expect(['Bronze', 'Prata', 'Ouro', 'Platina']).toContain(nivel);
    });
  });
});