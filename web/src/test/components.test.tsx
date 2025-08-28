import { describe, it, expect } from 'vitest';

// Simple utility function tests to demonstrate test infrastructure
describe('Basic Utility Tests', () => {
  it('should validate email format', () => {
    const isValidEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  it('should format currency correctly', () => {
    const formatCurrency = (value: number): string => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    };

    // Test the basic formatting structure instead of exact string matching
    const result1 = formatCurrency(1234.56);
    expect(result1).toContain('1.234,56');
    expect(result1).toMatch(/R\$\s*1\.234,56/);

    const result2 = formatCurrency(0);
    expect(result2).toContain('0,00');

    const result3 = formatCurrency(10);
    expect(result3).toContain('10,00');
  });

  it('should calculate table capacity utilization', () => {
    const calculateUtilization = (occupied: number, total: number): number => {
      if (total === 0) return 0;
      return Math.round((occupied / total) * 100);
    };

    expect(calculateUtilization(15, 20)).toBe(75);
    expect(calculateUtilization(0, 20)).toBe(0);
    expect(calculateUtilization(20, 20)).toBe(100);
    expect(calculateUtilization(5, 0)).toBe(0);
  });
});
