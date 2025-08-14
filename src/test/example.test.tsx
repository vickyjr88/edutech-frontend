import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

// Simple example component for testing
function Button({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="px-4 py-2 bg-blue-500 text-white rounded">
      {children}
    </button>
  )
}

describe('Button Component', () => {
  it('renders button with text', () => {
    const mockFn = vi.fn()
    render(<Button onClick={mockFn}>Click me</Button>)
    
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const mockFn = vi.fn()
    
    render(<Button onClick={mockFn}>Click me</Button>)
    
    const button = screen.getByRole('button', { name: 'Click me' })
    await user.click(button)
    
    expect(mockFn).toHaveBeenCalledOnce()
  })

  it('has correct CSS classes', () => {
    const mockFn = vi.fn()
    render(<Button onClick={mockFn}>Styled Button</Button>)
    
    const button = screen.getByRole('button', { name: 'Styled Button' })
    expect(button).toHaveClass('px-4', 'py-2', 'bg-blue-500', 'text-white', 'rounded')
  })
})
