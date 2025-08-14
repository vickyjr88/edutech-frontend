import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

describe('API Integration Tests', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'warn' });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it('should mock health check endpoint', async () => {
    const response = await fetch('http://localhost:3001/api/health')
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toEqual({ status: 'ok' })
  })

  it('should mock successful login', async () => {
    const response = await fetch('http://localhost:3001/api/auth/login', {
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
    const response = await fetch('http://localhost:3001/api/auth/login', {
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
