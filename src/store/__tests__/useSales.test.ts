import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useSalesStore } from '@/store/useSales'

// Mock axios
vi.mock('@/lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

// Mock other stores
vi.mock('@/store/useAuth', () => ({
  default: vi.fn(() => ({
    getCurrentUser: vi.fn().mockReturnValue({
      _id: 'user123',
      name: 'Test User',
      email: 'test@example.com'
    })
  }))
}))

describe('useSales Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useSalesStore.setState({
      sales: [],
      currentSale: null,
      isLoading: false,
      error: null,
      formData: {
        client: '',
        paymentMethod: 'EFECTIVO',
        deliveryType: 'RETIRO_LOCAL',
        deliveryFee: 0,
        amountPaid: 0,
        notes: '',
        totalDiscount: 0
      },
      selectedProducts: []
    })
    
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useSalesStore.getState()
      
      expect(state.sales).toEqual([])
      expect(state.currentSale).toBeNull()
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
      expect(state.formData.paymentMethod).toBe('EFECTIVO')
      expect(state.selectedProducts).toEqual([])
    })
  })

  describe('Form Data Management', () => {
    it('should update form data correctly', () => {
      const { updateFormData } = useSalesStore.getState()
      
      updateFormData('paymentMethod', 'TRANSFERENCIA')
      
      const state = useSalesStore.getState()
      expect(state.formData.paymentMethod).toBe('TRANSFERENCIA')
    })

    it('should reset form data', () => {
      // First update some data
      const { updateFormData, resetForm } = useSalesStore.getState()
      updateFormData('notes', 'Test notes')
      updateFormData('deliveryFee', 500)
      
      // Then reset
      resetForm()
      
      const state = useSalesStore.getState()
      expect(state.formData.notes).toBe('')
      expect(state.formData.deliveryFee).toBe(0)
      expect(state.selectedProducts).toEqual([])
    })
  })

  describe('Product Management', () => {
    it('should add product to selected products', () => {
      const { addProduct } = useSalesStore.getState()
      
      const product = {
        product: 'product123',
        quantity: 2,
        priceType: 'MAYORISTA' as const,
        unitPrice: 1000,
        discountPercentage: 10,
        subtotal: 1800
      }
      
      addProduct(product)
      
      const state = useSalesStore.getState()
      expect(state.selectedProducts).toHaveLength(1)
      expect(state.selectedProducts[0]).toEqual(product)
    })

    it('should update product in selected products', () => {
      const { addProduct, updateProduct } = useSalesStore.getState()
      
      // Add product first
      addProduct({
        product: 'product123',
        quantity: 1,
        priceType: 'MAYORISTA',
        unitPrice: 1000,
        discountPercentage: 0,
        subtotal: 1000
      })
      
      // Update it
      updateProduct(0, 'quantity', 3)
      updateProduct(0, 'discountPercentage', 15)
      updateProduct(0, 'subtotal', 2550)
      
      const state = useSalesStore.getState()
      expect(state.selectedProducts[0].quantity).toBe(3)
      expect(state.selectedProducts[0].discountPercentage).toBe(15)
      expect(state.selectedProducts[0].subtotal).toBe(2550)
    })

    it('should remove product from selected products', () => {
      const { addProduct, removeProduct } = useSalesStore.getState()
      
      // Add two products
      addProduct({
        product: 'product1',
        quantity: 1,
        priceType: 'MAYORISTA',
        unitPrice: 1000,
        discountPercentage: 0,
        subtotal: 1000
      })
      
      addProduct({
        product: 'product2',
        quantity: 2,
        priceType: 'MINORISTA',
        unitPrice: 1500,
        discountPercentage: 5,
        subtotal: 2850
      })
      
      // Remove first product
      removeProduct(0)
      
      const state = useSalesStore.getState()
      expect(state.selectedProducts).toHaveLength(1)
      expect(state.selectedProducts[0].product).toBe('product2')
    })
  })

  describe('Form State Management', () => {
    it('should manage form state correctly', () => {
      // Test direct state manipulation since the store doesn't expose setError/setLoading
      useSalesStore.setState({ isLoading: true, error: 'Test error' })
      
      let state = useSalesStore.getState()
      expect(state.isLoading).toBe(true)
      expect(state.error).toBe('Test error')
      
      useSalesStore.setState({ isLoading: false, error: null })
      
      state = useSalesStore.getState()
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('Totals Calculation', () => {
    it('should calculate correct totals with products and fees', () => {
      const { addProduct, updateFormData } = useSalesStore.getState()
      
      // Add products
      addProduct({
        product: 'product1',
        quantity: 2,
        priceType: 'MAYORISTA',
        unitPrice: 1000,
        discountPercentage: 10,
        subtotal: 1800
      })
      
      addProduct({
        product: 'product2',
        quantity: 1,
        priceType: 'MINORISTA',
        unitPrice: 2000,
        discountPercentage: 0,
        subtotal: 2000
      })
      
      // Add delivery fee and discount
      updateFormData('deliveryFee', 500)
      updateFormData('totalDiscount', 200)
      
      const state = useSalesStore.getState()
      const subtotal = state.selectedProducts.reduce((sum, p) => sum + p.subtotal, 0)
      const total = subtotal + state.formData.deliveryFee - state.formData.totalDiscount
      
      expect(subtotal).toBe(3800)
      expect(total).toBe(4100)
    })
  })
})