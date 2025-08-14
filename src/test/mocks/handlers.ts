import { http, HttpResponse } from 'msw'

// Example API handlers - customize based on your API endpoints
export const handlers = [
  // Example: Mock a GET endpoint
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' })
  }),

  // Example: Mock user authentication
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as { email: string, password: string }
    
    if (email === 'test@example.com' && password === 'password') {
      return HttpResponse.json({
        user: { id: 1, email: 'test@example.com', name: 'Test User' },
        token: 'mock-jwt-token'
      })
    }
    
    return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }),

  // Add more handlers as needed for your application
]
