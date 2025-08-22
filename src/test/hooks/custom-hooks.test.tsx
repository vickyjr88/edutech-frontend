import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';

// Mock Ory client
vi.mock('@/config/ory', () => {
  // Define mockOry inside the factory function
  const mockOry = {
    toSession: vi.fn(),
    createSelfServiceLogoutFlowUrlForBrowsers: vi.fn()
  };
  return {
    ory: mockOry // Export it
  };
});

// Now, import ory from the mocked module
import { ory } from '@/config/ory'; // Import ory directly from the mocked module

describe('Custom Hooks', () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
    vi.clearAllMocks();
    // Reset mocks for ory before each test
    ory.toSession.mockReset();
    ory.createSelfServiceLogoutFlowUrlForBrowsers.mockReset();
  });

  describe('useAuth', () => {
    it('should return loading state initially', () => {
      ory.toSession.mockReturnValue(new Promise(() => {})); // Use ory directly
      
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      expect(result.current.loading).toBe(true);
      expect(result.current.session).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should set session data on successful authentication', async () => {
      const mockSession = {
        id: 'session-123',
        identity: {
          id: 'user-123',
          traits: {
            email: 'test@example.com',
            name: {
              first: 'John',
              last: 'Doe'
            },
            role: 'teacher'
          }
        }
      };

      ory.toSession.mockResolvedValue({ data: mockSession });
      
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.session).toEqual(mockSession);
      expect(result.current.error).toBeNull();
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should set error state on authentication failure', async () => {
      const mockError = new Error('Authentication failed');
      ory.toSession.mockRejectedValue(mockError);
      
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.session).toBeNull();
      expect(result.current.error).toEqual(mockError);
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should handle logout correctly', async () => {
      const mockSession = {
        id: 'session-123',
        identity: { id: 'user-123', traits: {} }
      };
      
      ory.toSession.mockResolvedValue({ data: mockSession });
      ory.createSelfServiceLogoutFlowUrlForBrowsers.mockResolvedValue({
        data: { logout_url: 'https://logout.url' }
      });

      // Mock window.location
      const mockLocation = { href: '' };
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true
      });
      
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.session).toEqual(mockSession);
      });
      
      await act(async () => {
        await result.current.logout();
      });
      
      expect(ory.createSelfServiceLogoutFlowUrlForBrowsers).toHaveBeenCalled();
      expect(mockLocation.href).toBe('https://logout.url');
    });

    it('should handle logout error', async () => {
      const mockSession = {
        id: 'session-123',
        identity: { id: 'user-123', traits: {} }
      };
      const logoutError = new Error('Logout failed');
      
      ory.toSession.mockResolvedValue({ data: mockSession });
      ory.createSelfServiceLogoutFlowUrlForBrowsers.mockRejectedValue(logoutError);
      
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.session).toEqual(mockSession);
      });
      
      await act(async () => {
        await result.current.logout();
      });
      
      expect(result.current.error).toEqual(logoutError);
    });
  });

  describe('Custom Data Fetching Hook', () => {
    // Let's create a mock custom hook for testing
    const useFetchData = <T>(url: string, options?: { enabled?: boolean }) => {
      const [data, setData] = React.useState<T | null>(null);
      const [loading, setLoading] = React.useState(false);
      const [error, setError] = React.useState<Error | null>(null);

      React.useEffect(() => {
        if (options?.enabled === false) return;

        const fetchData = async () => {
          setLoading(true);
          setError(null);
          
          try {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            setData(result);
          } catch (err) {
            setError(err as Error);
          } finally {
            setLoading(false);
          }
        };

        fetchData();
      }, [url, options?.enabled]);

      const refetch = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          const result = await response.json();
          setData(result);
        } catch (err) {
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      }, [url]);

      return { data, loading, error, refetch };
    };

    beforeEach(() => {
      global.fetch = vi.fn();
    });

    it('should fetch data successfully', async () => {
      const mockData = { id: 1, name: 'Test Item' };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const { result } = renderHook(() => 
        useFetchData<typeof mockData>('/api/test')
      );

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeNull();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeNull();
    });

    it('should handle fetch errors', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      const { result } = renderHook(() => 
        useFetchData('/api/not-found')
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error?.message).toBe('HTTP 404: Not Found');
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      (global.fetch as any).mockRejectedValue(networkError);

      const { result } = renderHook(() => 
        useFetchData('/api/test')
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toEqual(networkError);
    });

    it('should not fetch when disabled', () => {
      const { result } = renderHook(() => 
        useFetchData('/api/test', { enabled: false })
      );

      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeNull();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should refetch data when refetch is called', async () => {
      const mockData = { id: 1, name: 'Test Item' };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const { result } = renderHook(() => 
        useFetchData<typeof mockData>('/api/test')
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Clear fetch calls
      vi.clearAllMocks();

      // Trigger refetch
      await act(async () => {
        await result.current.refetch();
      });

      expect(global.fetch).toHaveBeenCalledWith('/api/test');
    });
  });

  describe('Custom State Management Hook', () => {
    const useLocalStorage = <T>(key: string, initialValue: T) => {
      const [storedValue, setStoredValue] = React.useState<T>(() => {
        try {
          const item = window.localStorage.getItem(key);
          return item ? JSON.parse(item) : initialValue;
        } catch (error) {
          return initialValue;
        }
      });

      const setValue = React.useCallback((value: T | ((val: T) => T)) => {
        try {
          const valueToStore = value instanceof Function ? value(storedValue) : value;
          setStoredValue(valueToStore);
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }
      }, [key, storedValue]);

      const removeValue = React.useCallback(() => {
        try {
          window.localStorage.removeItem(key);
          setStoredValue(initialValue);
        } catch (error) {
          console.error('Error removing from localStorage:', error);
        }
      }, [key, initialValue]);

      return [storedValue, setValue, removeValue] as const;
    };

    beforeEach(() => {
      // Mock localStorage
      const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn()
      };
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock
      });
    });

    it('should return initial value when localStorage is empty', () => {
      (window.localStorage.getItem as any).mockReturnValue(null);

      const { result } = renderHook(() => 
        useLocalStorage('test-key', 'initial-value')
      );

      expect(result.current[0]).toBe('initial-value');
    });

    it('should return stored value from localStorage', () => {
      (window.localStorage.getItem as any).mockReturnValue('"stored-value"');

      const { result } = renderHook(() => 
        useLocalStorage('test-key', 'initial-value')
      );

      expect(result.current[0]).toBe('stored-value');
    });

    it('should update localStorage when value changes', () => {
      (window.localStorage.getItem as any).mockReturnValue(null);

      const { result } = renderHook(() => 
        useLocalStorage('test-key', 'initial-value')
      );

      act(() => {
        result.current[1]('new-value');
      });

      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'test-key', 
        '"new-value"'
      );
      expect(result.current[0]).toBe('new-value');
    });

    it('should handle function updates', () => {
      (window.localStorage.getItem as any).mockReturnValue('5');

      const { result } = renderHook(() => 
        useLocalStorage('counter', 0)
      );

      act(() => {
        result.current[1](prev => prev + 1);
      });

      expect(result.current[0]).toBe(6);
    });

    it('should remove value from localStorage', () => {
      (window.localStorage.getItem as any).mockReturnValue('"stored-value"');

      const { result } = renderHook(() => 
        useLocalStorage('test-key', 'initial-value')
      );

      act(() => {
        result.current[2](); // removeValue
      });

      expect(window.localStorage.removeItem).toHaveBeenCalledWith('test-key');
      expect(result.current[0]).toBe('initial-value');
    });

    it('should handle localStorage errors gracefully', () => {
      (window.localStorage.getItem as any).mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => 
        useLocalStorage('test-key', 'initial-value')
      );

      expect(result.current[0]).toBe('initial-value');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Debounced Value Hook', () => {
    const useDebounce = <T>(value: T, delay: number) => {
      const [debouncedValue, setDebouncedValue] = React.useState(value);

      React.useEffect(() => {
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);

        return () => {
          clearTimeout(handler);
        };
      }, [value, delay]);

      return debouncedValue;
    };

    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should debounce value changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      );

      expect(result.current).toBe('initial');

      // Change value
      rerender({ value: 'updated', delay: 500 });
      expect(result.current).toBe('initial'); // Should still be initial

      // Fast forward time
      act(() => {
        vi.advanceTimersByTime(250);
      });
      expect(result.current).toBe('initial'); // Still initial

      act(() => {
        vi.advanceTimersByTime(250);
      });
      expect(result.current).toBe('updated'); // Now updated
    });

    it('should cancel previous debounce on rapid changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      );

      // Rapid changes
      rerender({ value: 'change1', delay: 500 });
      act(() => {
        vi.advanceTimersByTime(200);
      });

      rerender({ value: 'change2', delay: 500 });
      act(() => {
        vi.advanceTimersByTime(200);
      });

      rerender({ value: 'final', delay: 500 });
      
      // Complete the debounce
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current).toBe('final');
    });
  });

  describe('Previous Value Hook', () => {
    const usePrevious = <T>(value: T) => {
      const ref = React.useRef<T>();
      
      React.useEffect(() => {
        ref.current = value;
      });
      
      return ref.current;
    };

    it('should return undefined on first render', () => {
      const { result } = renderHook(
        ({ value }) => usePrevious(value),
        { initialProps: { value: 'initial' } }
      );

      expect(result.current).toBeUndefined();
    });

    it('should return previous value after update', () => {
      const { result, rerender } = renderHook(
        ({ value }) => usePrevious(value),
        { initialProps: { value: 'initial' } }
      );

      expect(result.current).toBeUndefined();

      rerender({ value: 'updated' });
      expect(result.current).toBe('initial');

      rerender({ value: 'final' });
      expect(result.current).toBe('updated');
    });
  });
});
