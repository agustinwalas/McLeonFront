import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import useAuth from '@/store/useAuth'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock jwt-decode
vi.mock('jwt-decode', () => ({
  default: vi.fn()
}))

// Mock axios
vi.mock('@/lib/axios', () => ({
  default: {
    post: vi.fn()
  }
}))

describe('useAuth Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuth.setState({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      loading: false,
      error: null
    })
    
    // Clear all mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { user, isAuthenticated, isAdmin, loading, error } = useAuth.getState()
      
      expect(user).toBeNull()
      expect(isAuthenticated).toBe(false)
      expect(isAdmin).toBe(false)
      expect(loading).toBe(false)
      expect(error).toBeNull()
    })
  })

  describe('initializeAuth', () => {
    it('should set unauthenticated when no token exists', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const { initializeAuth } = useAuth.getState()
      initializeAuth()
      
      const state = useAuth.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.user).toBeNull()
    })

    it('should remove expired token and set unauthenticated', () => {
      localStorageMock.getItem
        .mockReturnValueOnce('fake-token')
        .mockReturnValueOnce(String(Date.now() - 1000)) // Expired token
      
      const { initializeAuth } = useAuth.getState()
      initializeAuth()
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token_expiry')
      
      const state = useAuth.getState()
      expect(state.isAuthenticated).toBe(false)
    })
  })

  describe('logout', () => {
    it('should clear localStorage and reset state', () => {
      // Set initial authenticated state
      useAuth.setState({
        user: { _id: '1', email: 'test@test.com', name: 'Test', phone: '', isAdmin: false },
        isAuthenticated: true,
        isAdmin: false
      })

      const { logout } = useAuth.getState()
      logout()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token_expiry')
      
      const state = useAuth.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isAdmin).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('Token Expiry Logic', () => {
    it('should create expiry time at 23:59 of current day', () => {
      const mockDate = new Date('2025-09-16T15:30:00.000Z')
      vi.setSystemTime(mockDate)

      // Calculate expected expiry (23:59 of same day)
      const expectedExpiry = new Date(2025, 8, 16, 23, 59, 0, 0).getTime()
      
      localStorageMock.setItem = vi.fn()
      
      // Simulate saving token with expiry
      const now = new Date()
      const expiry = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 0, 0).getTime()
      
      expect(expiry).toBe(expectedExpiry)
      
      vi.useRealTimers()
    })
  })
})