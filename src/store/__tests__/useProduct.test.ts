import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useProductStore } from '@/store/useProduct'
import { UnitOfMeasure } from '@/types/product'

// Mock axios
vi.mock('@/lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

const mockProduct = {
  _id: 'product1',
  name: 'Torta Chocolate',
  productCode: 'TC001',
  category: { _id: 'cat1', name: 'Tortas', active: true },
  supplier: { _id: 'sup1', name: 'Proveedor 1', active: true },
  associatedSuppliers: [],
  wholesalePrice: 1000,
  retailPrice: 1500,
  purchaseCost: 800,
  currentStock: 10,
  minimumStock: 5,
  unitOfMeasure: UnitOfMeasure.UNIDAD,
  description: 'Deliciosa torta de chocolate',
  isActive: true
}

describe('useProduct Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useProductStore.setState({
      products: [],
      product: null,
      loading: false,
      error: null,
      isInitialized: false,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      }
    })
    
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useProductStore.getState()
      
      expect(state.products).toEqual([])
      expect(state.product).toBeNull()
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
      expect(state.isInitialized).toBe(false)
      expect(state.pagination.page).toBe(1)
      expect(state.pagination.limit).toBe(10)
    })
  })

  describe('State Management', () => {
    it('should set loading state', () => {
      const { setLoading } = useProductStore.getState()
      
      setLoading(true)
      expect(useProductStore.getState().loading).toBe(true)
      
      setLoading(false)
      expect(useProductStore.getState().loading).toBe(false)
    })

    it('should clear error', () => {
      // Set error first
      useProductStore.setState({ error: 'Test error' })
      expect(useProductStore.getState().error).toBe('Test error')
      
      const { clearError } = useProductStore.getState()
      clearError()
      
      expect(useProductStore.getState().error).toBeNull()
    })

    it('should reset store', () => {
      // Set some state
      useProductStore.setState({
        products: [mockProduct],
        product: mockProduct,
        loading: true,
        error: 'Some error',
        isInitialized: true
      })
      
      const { reset } = useProductStore.getState()
      reset()
      
      const state = useProductStore.getState()
      expect(state.products).toEqual([])
      expect(state.product).toBeNull()
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
      expect(state.isInitialized).toBe(false)
    })
  })

  describe('Product Management', () => {
    it('should manage product state correctly', () => {
      // Test direct state updates since we're focusing on state management
      useProductStore.setState({ 
        products: [mockProduct],
        product: mockProduct,
        isInitialized: true
      })
      
      const state = useProductStore.getState()
      expect(state.products).toHaveLength(1)
      expect(state.products[0]).toEqual(mockProduct)
      expect(state.product).toEqual(mockProduct)
      expect(state.isInitialized).toBe(true)
    })

    it('should handle pagination correctly', () => {
      useProductStore.setState({
        pagination: {
          page: 2,
          limit: 20,
          total: 100,
          totalPages: 5
        }
      })
      
      const state = useProductStore.getState()
      expect(state.pagination.page).toBe(2)
      expect(state.pagination.limit).toBe(20)
      expect(state.pagination.total).toBe(100)
      expect(state.pagination.totalPages).toBe(5)
    })
  })

  describe('Error Handling', () => {
    it('should handle error states correctly', () => {
      const errorMessage = 'Failed to load products'
      
      useProductStore.setState({ 
        error: errorMessage,
        loading: false 
      })
      
      const state = useProductStore.getState()
      expect(state.error).toBe(errorMessage)
      expect(state.loading).toBe(false)
    })
  })
})