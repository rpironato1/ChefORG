import { describe, it, expect } from 'vitest'

// Simple utility functions that are easy to test
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const calculateTableCapacityUtilization = (occupied: number, total: number): number => {
  if (total === 0) return 0
  return Math.round((occupied / total) * 100)
}

export const generateRandomPIN = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  }
  return phone
}

export const calculateOrderTotal = (items: Array<{ preco: number; quantidade: number }>): number => {
  return items.reduce((total, item) => total + (item.preco * item.quantidade), 0)
}

export const isValidCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '')
  if (cleaned.length !== 11) return false
  
  // Check for known invalid patterns
  if (/^(\d)\1{10}$/.test(cleaned)) return false
  
  // Validate check digits
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * (10 - i)
  }
  let digit1 = 11 - (sum % 11)
  if (digit1 > 9) digit1 = 0
  
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]) * (11 - i)
  }
  let digit2 = 11 - (sum % 11)
  if (digit2 > 9) digit2 = 0
  
  return parseInt(cleaned[9]) === digit1 && parseInt(cleaned[10]) === digit2
}

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('should format numbers as Brazilian currency', () => {
      expect(formatCurrency(10.50)).toBe('R$ 10,50')
      expect(formatCurrency(1000)).toBe('R$ 1.000,00')
      expect(formatCurrency(0)).toBe('R$ 0,00')
    })
  })

  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
    })
  })

  describe('calculateTableCapacityUtilization', () => {
    it('should calculate utilization percentage correctly', () => {
      expect(calculateTableCapacityUtilization(8, 10)).toBe(80)
      expect(calculateTableCapacityUtilization(0, 10)).toBe(0)
      expect(calculateTableCapacityUtilization(10, 10)).toBe(100)
      expect(calculateTableCapacityUtilization(5, 0)).toBe(0)
    })
  })

  describe('generateRandomPIN', () => {
    it('should generate 4-digit PIN', () => {
      const pin = generateRandomPIN()
      expect(pin).toHaveLength(4)
      expect(/^\d{4}$/.test(pin)).toBe(true)
    })
  })

  describe('formatPhoneNumber', () => {
    it('should format Brazilian mobile numbers', () => {
      expect(formatPhoneNumber('11987654321')).toBe('(11) 98765-4321')
      expect(formatPhoneNumber('invalid')).toBe('invalid')
    })
  })

  describe('calculateOrderTotal', () => {
    it('should calculate order total correctly', () => {
      const items = [
        { preco: 10.50, quantidade: 2 },
        { preco: 15.00, quantidade: 1 },
        { preco: 8.75, quantidade: 3 }
      ]
      expect(calculateOrderTotal(items)).toBe(62.25)
      expect(calculateOrderTotal([])).toBe(0)
    })
  })

  describe('isValidCPF', () => {
    it('should validate CPF correctly', () => {
      expect(isValidCPF('11144477735')).toBe(true)
      expect(isValidCPF('111.444.777-35')).toBe(true)
      expect(isValidCPF('00000000000')).toBe(false)
      expect(isValidCPF('11111111111')).toBe(false)
      expect(isValidCPF('12345678901')).toBe(false)
      expect(isValidCPF('invalid')).toBe(false)
    })
  })
})