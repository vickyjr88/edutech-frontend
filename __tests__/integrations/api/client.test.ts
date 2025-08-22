import { describe, it, expect, vi, beforeEach, beforeAll, Mock } from 'vitest';
import axios from 'axios';

// Mock axios with factory function
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      request: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
  },
}));

// Mock authService
vi.mock('@/integrations/api/services/auth.service', () => ({
  authService: {
    getSession: vi.fn(),
    refreshSession: vi.fn(),
  },
}));

// Import after mocking
import { authService } from '@/integrations/api/services/auth.service';

describe('ApiClient', () => {
  let api: any;
  let mockAxiosInstance: any;

  beforeAll(async () => {
    // Import the api client after all mocks are set up
    const clientModule = await import('@/integrations/api/client');
    api = clientModule.api;
    
    // Get the mocked axios instance
    const mockedAxios = vi.mocked(axios);
    mockAxiosInstance = mockedAxios.create.mock.results[0].value;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('HTTP Methods', () => {
    it('should make successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockAxiosInstance.get.mockResolvedValue({ data: mockData });

      const result = await api.get('/test');

      expect(result).toEqual({
        data: mockData,
        error: null,
      });
    });

    it('should handle GET request error', async () => {
      const mockError = {
        response: {
          data: { message: 'Not found' },
          status: 404,
        },
      };
      mockAxiosInstance.get.mockRejectedValue(mockError);

      const result = await api.get('/test');

      expect(result).toEqual({
        data: null,
        error: {
          message: 'Not found',
          status: 404,
        },
      });
    });

    it('should make successful POST request', async () => {
      const mockData = { id: 1, name: 'Created' };
      const postData = { name: 'New Item' };
      mockAxiosInstance.post.mockResolvedValue({ data: mockData });

      const result = await api.post('/test', postData);

      expect(result).toEqual({
        data: mockData,
        error: null,
      });
    });

    it('should handle POST request error', async () => {
      const mockError = {
        response: {
          data: { message: 'Validation failed' },
          status: 422,
        },
      };
      const postData = { name: '' };
      mockAxiosInstance.post.mockRejectedValue(mockError);

      const result = await api.post('/test', postData);

      expect(result).toEqual({
        data: null,
        error: {
          message: 'Validation failed',
          status: 422,
        },
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network Error');
      mockAxiosInstance.get.mockRejectedValue(networkError);

      const result = await api.get('/test');

      expect(result).toEqual({
        data: null,
        error: {
          message: 'Request failed',
          status: 500,
        },
      });
    });
  });

  describe('API Response Format', () => {
    it('should return consistent response format for all HTTP methods', async () => {
      const mockData = { message: 'success' };
      mockAxiosInstance.get.mockResolvedValue({ data: mockData });
      mockAxiosInstance.post.mockResolvedValue({ data: mockData });
      
      const getResult = await api.get('/test');
      const postResult = await api.post('/test', {});
      
      // Both should have the same response structure
      expect(getResult).toHaveProperty('data');
      expect(getResult).toHaveProperty('error');
      expect(postResult).toHaveProperty('data');
      expect(postResult).toHaveProperty('error');
      
      expect(getResult.error).toBeNull();
      expect(postResult.error).toBeNull();
    });
  });
});
