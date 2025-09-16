import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { LoginForm } from '@/components/auth/Login'

// Mock the auth store
const mockLogin = vi.fn()
const mockStore = {
  login: mockLogin,
  loading: false,
  error: null as string | null,
  isAuthenticated: false
}

vi.mock('@/store/useAuth', () => ({
  default: vi.fn(() => mockStore)
}))

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn()
  }
}))

const LoginWrapper = () => (
  <BrowserRouter>
    <LoginForm />
  </BrowserRouter>
)

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStore.loading = false
    mockStore.error = null
    mockStore.isAuthenticated = false
  })

  it('renders login form correctly', () => {
    render(<LoginWrapper />)
    
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
    expect(screen.getByText(/¿no tienes una cuenta/i)).toBeInTheDocument()
  })

  it('handles form submission with valid data', async () => {
    mockLogin.mockResolvedValue({ success: true })
    
    render(<LoginWrapper />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })
  })

  it('shows validation errors for empty fields', async () => {
    render(<LoginWrapper />)
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/email es requerido/i)).toBeInTheDocument()
      expect(screen.getByText(/contraseña es requerida/i)).toBeInTheDocument()
    })
  })

  it('shows validation error for invalid email format', async () => {
    render(<LoginWrapper />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/formato de email inválido/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during login', () => {
    mockStore.loading = true
    
    render(<LoginWrapper />)
    
    const submitButton = screen.getByRole('button', { name: /iniciando sesión/i })
    expect(submitButton).toBeDisabled()
    expect(screen.getByText(/iniciando sesión/i)).toBeInTheDocument()
  })

  it('displays error message when login fails', () => {
    mockStore.error = 'Credenciales inválidas'
    
    render(<LoginWrapper />)
    
    expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument()
  })

  it('navigates to admin dashboard when authenticated', () => {
    mockStore.isAuthenticated = true
    
    render(<LoginWrapper />)
    
    expect(mockNavigate).toHaveBeenCalledWith('/admin')
  })

  it('has link to register page', () => {
    render(<LoginWrapper />)
    
    const registerLink = screen.getByRole('link', { name: /regístrate aquí/i })
    expect(registerLink).toHaveAttribute('href', '/register')
  })
})