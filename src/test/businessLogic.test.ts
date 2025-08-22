import { describe, it, expect } from 'vitest'
import { Mesa } from '../types'

// Extract the pure function logic from the hook for testing
function validateMesaAvailability(
  mesas: Mesa[],
  numeroConvidados: number,
  mesaId?: string
): { disponivel: boolean; mesasSugeridas: Mesa[] } {
  const mesasDisponiveis = mesas.filter(mesa => 
    mesa.status === 'livre' && 
    mesa.capacidade >= numeroConvidados &&
    (!mesaId || mesa.id === mesaId)
  );

  const mesasSugeridas = mesasDisponiveis
    .sort((a, b) => a.capacidade - b.capacidade) // Menor mesa primeiro
    .slice(0, 3); // Máximo 3 sugestões

  return {
    disponivel: mesasSugeridas.length > 0,
    mesasSugeridas
  };
}

describe('Business Logic - Mesa Validation', () => {
  const mockMesas: Mesa[] = [
    {
      id: '1',
      numero: 1,
      capacidade: 4,
      status: 'livre',
      qrCode: 'QR1',
    },
    {
      id: '2', 
      numero: 2,
      capacidade: 6,
      status: 'ocupada',
      qrCode: 'QR2',
    },
    {
      id: '3',
      numero: 3,
      capacidade: 8,
      status: 'livre', 
      qrCode: 'QR3',
    }
  ]

  it('should find available tables for requested capacity', () => {
    const result = validateMesaAvailability(mockMesas, 4)

    expect(result.disponivel).toBe(true)
    expect(result.mesasSugeridas).toHaveLength(2)
    expect(result.mesasSugeridas[0].numero).toBe(1) // Smallest table first
  })

  it('should return no suggestions when no tables available', () => {
    const occupiedMesas = mockMesas.map(mesa => ({ ...mesa, status: 'ocupada' as const }))
    
    const result = validateMesaAvailability(occupiedMesas, 4)

    expect(result.disponivel).toBe(false)
    expect(result.mesasSugeridas).toHaveLength(0)
  })

  it('should filter by specific table ID when provided', () => {
    const result = validateMesaAvailability(mockMesas, 4, '1')

    expect(result.disponivel).toBe(true)
    expect(result.mesasSugeridas).toHaveLength(1)
    expect(result.mesasSugeridas[0].id).toBe('1')
  })

  it('should not suggest tables with insufficient capacity', () => {
    const result = validateMesaAvailability(mockMesas, 10) // Larger than any available table

    expect(result.disponivel).toBe(false)
    expect(result.mesasSugeridas).toHaveLength(0)
  })

  it('should sort suggestions by capacity (smallest first)', () => {
    const result = validateMesaAvailability(mockMesas, 2)

    expect(result.disponivel).toBe(true)
    expect(result.mesasSugeridas).toHaveLength(2)
    expect(result.mesasSugeridas[0].capacidade).toBeLessThanOrEqual(result.mesasSugeridas[1].capacidade)
  })
})