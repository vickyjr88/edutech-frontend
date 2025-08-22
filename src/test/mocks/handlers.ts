import { http, HttpResponse } from 'msw';
import { apiHandlers } from './api-handlers';

// Example API handlers - customize based on your API endpoints
export const handlers = [
  // Example: Mock a GET endpoint
  http.get('http://localhost:3001/api/health', () => {
    return HttpResponse.json({ status: 'ok' })
  }),

  // Auth endpoints for API test
  http.post('http://localhost:3001/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as { email: string; password: string };
    
    if (email === 'test@example.com' && password === 'password') {
      return HttpResponse.json({
        user: { id: 1, email: 'test@example.com', name: 'Test User' },
        token: 'mock-jwt-token'
      });
    }
    
    return HttpResponse.json(
      { error: 'Invalid credentials' }, 
      { status: 401 }
    );
  }),

  // Include all API handlers for comprehensive testing
  ...apiHandlers,

  // Add more handlers as needed for your application
];
