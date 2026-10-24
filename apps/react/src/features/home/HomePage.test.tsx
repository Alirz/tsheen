import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HomePage } from '@/features/home/HomePage'

vi.mock('@/lib/auth/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}))

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows the application name', () => {
    render(<HomePage />)
    const heading = screen.getByRole('heading', { name: 'Tsheen' })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveClass('type-page-title-24-b')
  })
})
