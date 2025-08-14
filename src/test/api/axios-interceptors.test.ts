import { describe, it, expect, vi, afterEach, beforeAll, afterAll } from 'vitest';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
import { api } from '@/integrations/api/client';
import { authService } from '@/integrations/api/services/auth.service';

// Mock the auth service
vi.mock('@/integrations/api/services/auth.service', () => ({
  authService: {
    getSession: vi.fn(),
    refreshSession: vi.fn(),
  },
}));

describe('Axios Interceptors with MSW', () => {
  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  describe('Token Injection', () => {
    it('should inject Bearer token when session exists', async () => {
      const mockSession = { token: 'valid-token-123' };
      (authService.getSession as any).mockReturnValue(mockSession);

      let capturedHeaders: Headers | undefined;
      server.use(
        http.get('http://localhost:3001/test-endpoint', ({ request }) => {
          capturedHeaders = request.headers;
          return HttpResponse.json({ success: true });
        })
      );

      const { data, error } = await api.get('/test-endpoint');

      expect(data).toEqual({ success: true });
      expect(error).toBeNull();
      expect(capturedHeaders?.get('Authorization')).toBe('Bearer valid-token-123');
      expect(authService.getSession).toHaveBeenCalled();
    });
  });

  describe('401 Retry Logic', () => {
    it('should retry request with new token after successful refresh', async () => {
      const expiredSession = { token: 'expired-token' };
      const refreshedSession = { token: 'refreshed-token' };

      (authService.getSession as any)
        .mockReturnValueOnce(expiredSession)
        .mockReturnValueOnce(refreshedSession);

      (authService.refreshSession as any).mockResolvedValue(true);

      const requestTracker = vi.fn();
      server.use(
        http.get('http://localhost:3001/protected-endpoint', ({ request }) => {
          requestTracker();
          const authHeader = request.headers.get('Authorization');
          if (requestTracker.mock.calls.length === 1) {
            expect(authHeader).toBe('Bearer expired-token');
            return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
          }
          expect(authHeader).toBe('Bearer refreshed-token');
          return HttpResponse.json({ data: 'protected-data' });
        })
      );

      const { data, error } = await api.get('/protected-endpoint');

      expect(data).toEqual({ data: 'protected-data' });
      expect(error).toBeNull();
      expect(requestTracker).toHaveBeenCalledTimes(2);
      expect(authService.refreshSession).toHaveBeenCalledTimes(1);
    });

    it('should return error if token refresh fails', async () => {
        const expiredSession = { token: 'expired-token' };
        (authService.getSession as any).mockReturnValue(expiredSession);
        (authService.refreshSession as any).mockResolvedValue(false);
    
        const requestTracker = vi.fn();
        server.use(
            http.get('http://localhost:3001/protected-endpoint', () => {
                requestTracker();
                return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
            })
        );
    
        const { data, error } = await api.get('/protected-endpoint');
    
        expect(data).toBeNull();
        expect(error).not.toBeNull();
        expect(error.message).toBe('Token refresh failed');
        expect(requestTracker).toHaveBeenCalledTimes(1);
        expect(authService.refreshSession).toHaveBeenCalledTimes(1);
    });

    it('should handle refresh session throwing an error', async () => {
      const expiredSession = { token: 'expired-token' };
      (authService.getSession as any).mockReturnValue(expiredSession);
      const refreshError = new Error('Network error during refresh');
      (authService.refreshSession as any).mockRejectedValue(refreshError);

      server.use(
        http.get('http://localhost:3001/protected-endpoint', () => {
          return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
        })
      );

      const { data, error } = await api.get('/protected-endpoint');

      expect(data).toBeNull();
      expect(error).toEqual(refreshError);
      expect(authService.refreshSession).toHaveBeenCalledTimes(1);
    });
  });

  describe('Token Injection with Retry Integration', () => {
    it('should preserve request body during retry', async () => {
      const expiredSession = { token: 'expired-token' };
      const refreshedSession = { token: 'refreshed-token' };

      (authService.getSession as any)
        .mockReturnValueOnce(expiredSession)
        .mockReturnValueOnce(refreshedSession);

      (authService.refreshSession as any).mockResolvedValue(true);

      const capturedBodies: any[] = [];
      const requestTracker = vi.fn();

      server.use(
        http.post('http://localhost:3001/api/save-data', async ({ request }) => {
          requestTracker();
          const body = await request.json();
          capturedBodies.push(body);

          if (requestTracker.mock.calls.length === 1) {
            return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
          }

          return HttpResponse.json({ saved: true, data: body });
        })
      );

      const testData = { title: 'Test Post', content: 'This is test content' };
      const { data, error } = await api.post('/api/save-data', testData);

      expect(data).toEqual({ saved: true, data: testData });
      expect(error).toBeNull();
      expect(requestTracker).toHaveBeenCalledTimes(2);
      expect(capturedBodies).toHaveLength(2);
      expect(capturedBodies[0]).toEqual(testData);
      expect(capturedBodies[1]).toEqual(testData);
    });

    it('should handle multiple concurrent 401s correctly', async () => {
        const expiredSession = { token: 'expired-token' };
        const refreshedSession = { token: 'refreshed-token' };
    
        (authService.getSession as any).mockReturnValue(expiredSession);
        (authService.refreshSession as any).mockImplementation(() => {
            return new Promise(resolve => {
                // Simulate network latency for refresh
                setTimeout(() => {
                    (authService.getSession as any).mockReturnValue(refreshedSession);
                    resolve(true);
                }, 100);
            });
        });
    
        let endpoint1Calls = 0;
        let endpoint2Calls = 0;
    
        server.use(
            http.get('http://localhost:3001/api/endpoint1', ({request}) => {
                endpoint1Calls++;
                const auth = request.headers.get('Authorization');
                if (endpoint1Calls === 1) {
                    expect(auth).toBe('Bearer expired-token');
                    return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
                }
                expect(auth).toBe('Bearer refreshed-token');
                return HttpResponse.json({ endpoint: 1, data: 'success' });
            }),
            http.get('http://localhost:3001/api/endpoint2', ({request}) => {
                endpoint2Calls++;
                const auth = request.headers.get('Authorization');
                if (endpoint2Calls === 1) {
                    expect(auth).toBe('Bearer expired-token');
                    return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
                }
                expect(auth).toBe('Bearer refreshed-token');
                return HttpResponse.json({ endpoint: 2, data: 'success' });
            })
        );
    
        const [result1, result2] = await Promise.all([
            api.get('/api/endpoint1'),
            api.get('/api/endpoint2'),
        ]);
    
        expect(result1.data).toEqual({ endpoint: 1, data: 'success' });
        expect(result1.error).toBeNull();
        expect(result2.data).toEqual({ endpoint: 2, data: 'success' });
        expect(result2.error).toBeNull();
    
        expect(endpoint1Calls).toBe(2);
        expect(endpoint2Calls).toBe(2);
        expect(authService.refreshSession).toHaveBeenCalledTimes(1);
    });
  });
});
