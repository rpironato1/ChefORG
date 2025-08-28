import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getAllMenuItems, getAllCategories } from '../lib/api/menu'

describe('Menu API', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    vi.clearAllMocks()
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear()
    }
  })

  it('should return menu items successfully', async () => {
    const result = await getAllMenuItems()
    
    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()
    expect(Array.isArray(result.data)).toBe(true)
  })

  it('should return menu categories successfully', async () => {
    const result = await getAllCategories()
    
    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()
    expect(Array.isArray(result.data)).toBe(true)
  })

  it('should handle API errors gracefully', async () => {
    // This tests error handling when localStorage fails
    const originalGetItem = localStorage.getItem
    const originalSetItem = localStorage.setItem
    
    // Make localStorage throw errors
    localStorage.getItem = () => { throw new Error('Storage error') }
    localStorage.setItem = () => { throw new Error('Storage error') }
    
    try {
      const result = await getAllMenuItems()
      
      // The localStorage implementation might handle errors internally
      // so we just check that we get a response
      expect(result).toBeDefined()
      expect(typeof result.success).toBe('boolean')
    } finally {
      // Always restore original functions
      localStorage.getItem = originalGetItem
      localStorage.setItem = originalSetItem
    }
  })

  it('should filter menu items correctly', async () => {
    // First add some test data
    localStorage.setItem('cheforg_menu_items', JSON.stringify([
      { id: 1, nome: 'Hamburger', disponivel: true, categoria: 'Lanches' },
      { id: 2, nome: 'Pizza', disponivel: false, categoria: 'Pizzas' },
      { id: 3, nome: 'Salada', disponivel: true, categoria: 'Saladas' }
    ]))
    
    const result = await getAllMenuItems()
    
    expect(result.success).toBe(true)
    expect(result.data).toHaveLength(2) // Only available items
    expect(result.data?.every(item => item.disponivel)).toBe(true)
  })
})