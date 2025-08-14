import { http, HttpResponse } from 'msw';

// API handlers specifically for testing the API client
export const apiHandlers = [
  // Auth endpoints
  http.post('/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as { email: string; password: string };
    
    if (email === 'test@example.com' && password === 'password') {
      return HttpResponse.json({
        user: { 
          id: '1', 
          email: 'test@example.com', 
          firstName: 'Test', 
          lastName: 'User' 
        },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      });
    }
    
    return HttpResponse.json(
      { message: 'Invalid credentials' }, 
      { status: 401 }
    );
  }),

  http.post('/auth/register', async ({ request }) => {
    const userData = await request.json() as any;
    return HttpResponse.json({
      user: { 
        id: '2', 
        email: userData.email, 
        firstName: userData.firstName,
        lastName: userData.lastName 
      },
      token: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    });
  }),

  http.post('/auth/refresh-token', () => {
    return HttpResponse.json({
      user: { 
        id: '1', 
        email: 'test@example.com', 
        firstName: 'Test', 
        lastName: 'User' 
      },
      token: 'new-mock-access-token',
      refreshToken: 'new-mock-refresh-token'
    });
  }),

  http.get('/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      user: {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      }
    });
  }),

  http.post('/auth/logout', () => {
    return HttpResponse.json({ message: 'Logged out successfully' });
  }),

  // Generic API endpoints for testing
  http.get('/test', () => {
    return HttpResponse.json({ id: 1, name: 'Test Item' });
  }),

  http.post('/test', async ({ request }) => {
    const data = await request.json() as any;
    return HttpResponse.json({ id: 2, ...data });
  }),

  http.put('/test/:id', async ({ params, request }) => {
    const data = await request.json() as any;
    return HttpResponse.json({ id: params.id, ...data });
  }),

  http.patch('/test/:id', async ({ params, request }) => {
    const data = await request.json() as any;
    return HttpResponse.json({ id: params.id, ...data });
  }),

  http.delete('/test/:id', ({ params }) => {
    return HttpResponse.json({ id: params.id, deleted: true });
  }),

  // Error scenarios for testing
  http.get('/test/error', () => {
    return HttpResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }),

  http.get('/test/not-found', () => {
    return HttpResponse.json(
      { message: 'Resource not found' },
      { status: 404 }
    );
  }),

  http.post('/test/validation-error', () => {
    return HttpResponse.json(
      { message: 'Validation failed' },
      { status: 422 }
    );
  }),
];
