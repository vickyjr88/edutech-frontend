import { describe, it, expect } from 'vitest'

describe('API Integration Tests', () => {
  it('should mock health check endpoint', async () => {
    const response = await fetch('/api/health')
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toEqual({ status: 'ok' })
  })

  it('should mock successful login', async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password'
      })
    })
    
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toEqual({
      user: { id: 1, email: 'test@example.com', name: 'Test User' },
      token: 'mock-jwt-token'
    })
  })

  it('should mock failed login', async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'wrong@example.com',
        password: 'wrongpassword'
      })
    })
    
    const data = await response.json()
    
    expect(response.status).toBe(401)
    expect(data).toEqual({ error: 'Invalid credentials' })
  })
})
