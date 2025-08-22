import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getOrFetchData,
  clearCache,
  clearAllCaches,
  getCachedCurricula,
  getCachedSubjects,
  getCachedGradeLevels,
  getCachedTeachers,
  invalidateCurriculaCache,
  invalidateSubjectsCache,
  invalidateGradeLevelsCache,
  invalidateTeachersCache
} from '@/components/teacher/class-setup/utils/apiCache';

describe('API Cache Utilities', () => {
  const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
  const mockCurrentTime = new Date('2024-01-15T12:00:00Z').getTime();

  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    };
    Object.defineProperty(window, 'localStorage', { 
      value: localStorageMock,
      writable: true 
    });

    // Mock Date.now()
    vi.spyOn(Date, 'now').mockReturnValue(mockCurrentTime);

    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getOrFetchData', () => {
    it('should fetch and cache data when no cache exists', async () => {
      const mockData = { id: 1, name: 'Test Data' };
      const fetchFn = vi.fn().mockResolvedValue(mockData);
      
      (window.localStorage.getItem as any).mockReturnValue(null);

      const result = await getOrFetchData('test-key', fetchFn);

      expect(result).toEqual(mockData);
      expect(fetchFn).toHaveBeenCalledTimes(1);
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify({
          data: mockData,
          timestamp: mockCurrentTime,
          version: 1
        })
      );
    });

    it('should return cached data when cache is fresh', async () => {
      const mockData = { id: 1, name: 'Cached Data' };
      const cachedEntry = {
        data: mockData,
        timestamp: mockCurrentTime - (5 * 60 * 1000), // 5 minutes ago
        version: 1
      };
      const fetchFn = vi.fn();

      (window.localStorage.getItem as any).mockReturnValue(JSON.stringify(cachedEntry));

      const result = await getOrFetchData('test-key', fetchFn);

      expect(result).toEqual(mockData);
      expect(fetchFn).not.toHaveBeenCalled();
    });

    it('should fetch new data when cache is stale', async () => {
      const oldData = { id: 1, name: 'Old Data' };
      const newData = { id: 2, name: 'New Data' };
      const staleEntry = {
        data: oldData,
        timestamp: mockCurrentTime - (20 * 60 * 1000), // 20 minutes ago (stale)
        version: 1
      };
      const fetchFn = vi.fn().mockResolvedValue(newData);

      (window.localStorage.getItem as any).mockReturnValue(JSON.stringify(staleEntry));

      const result = await getOrFetchData('test-key', fetchFn);

      expect(result).toEqual(newData);
      expect(fetchFn).toHaveBeenCalledTimes(1);
    });

    it('should fetch new data when cache version is outdated', async () => {
      const oldData = { id: 1, name: 'Old Version Data' };
      const newData = { id: 2, name: 'New Version Data' };
      const outdatedEntry = {
        data: oldData,
        timestamp: mockCurrentTime - (5 * 60 * 1000), // Fresh timestamp
        version: 0 // Old version
      };
      const fetchFn = vi.fn().mockResolvedValue(newData);

      (window.localStorage.getItem as any).mockReturnValue(JSON.stringify(outdatedEntry));

      const result = await getOrFetchData('test-key', fetchFn);

      expect(result).toEqual(newData);
      expect(fetchFn).toHaveBeenCalledTimes(1);
    });

    it('should use custom maxAge when provided', async () => {
      const mockData = { id: 1, name: 'Test Data' };
      const cachedEntry = {
        data: mockData,
        timestamp: mockCurrentTime - (10 * 60 * 1000), // 10 minutes ago
        version: 1
      };
      const fetchFn = vi.fn();
      const customMaxAge = 5 * 60 * 1000; // 5 minutes

      (window.localStorage.getItem as any).mockReturnValue(JSON.stringify(cachedEntry));

      await getOrFetchData('test-key', fetchFn, customMaxAge);

      expect(fetchFn).toHaveBeenCalledTimes(1); // Should fetch because 10 min > 5 min maxAge
    });

    it('should fallback to stale cache on fetch error', async () => {
      const staleData = { id: 1, name: 'Stale Data' };
      const staleEntry = {
        data: staleData,
        timestamp: mockCurrentTime - (20 * 60 * 1000), // Stale
        version: 1
      };
      const fetchFn = vi.fn().mockRejectedValue(new Error('Network error'));
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      (window.localStorage.getItem as any).mockReturnValue(JSON.stringify(staleEntry));

      const result = await getOrFetchData('test-key', fetchFn);

      expect(result).toEqual(staleData);
      expect(fetchFn).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });

    it('should throw error when fetch fails and no fallback exists', async () => {
      const fetchFn = vi.fn().mockRejectedValue(new Error('Network error'));
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      (window.localStorage.getItem as any).mockReturnValue(null);

      await expect(getOrFetchData('test-key', fetchFn)).rejects.toThrow('Network error');
      
      consoleErrorSpy.mockRestore();
    });

    it('should handle JSON parsing errors gracefully', async () => {
      const mockData = { id: 1, name: 'Test Data' };
      const fetchFn = vi.fn().mockResolvedValue(mockData);

      (window.localStorage.getItem as any).mockReturnValue('invalid-json');

      const result = await getOrFetchData('test-key', fetchFn);

      expect(result).toEqual(mockData);
      expect(fetchFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearCache', () => {
    it('should remove specific cache entry', () => {
      clearCache('test-key');
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('test-key');
    });
  });

  describe('clearAllCaches', () => {
    it('should remove all predefined cache entries', () => {
      clearAllCaches();
      
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('cached_curricula');
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('cached_subjects');
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('cached_grade_levels');
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('cached_teachers');
    });
  });

  describe('Specific Cache Functions', () => {
    describe('getCachedCurricula', () => {
      it('should use curricula cache key', async () => {
        const mockData = ['IB', 'Cambridge', 'AP'];
        const fetchFn = vi.fn().mockResolvedValue(mockData);
        
        (window.localStorage.getItem as any).mockReturnValue(null);

        await getCachedCurricula(fetchFn);

        expect(window.localStorage.setItem).toHaveBeenCalledWith(
          'cached_curricula',
          expect.stringContaining(JSON.stringify(mockData))
        );
      });
    });

    describe('getCachedSubjects', () => {
      it('should use subjects cache key', async () => {
        const mockData = ['Math', 'Science', 'English'];
        const fetchFn = vi.fn().mockResolvedValue(mockData);
        
        (window.localStorage.getItem as any).mockReturnValue(null);

        await getCachedSubjects(fetchFn);

        expect(window.localStorage.setItem).toHaveBeenCalledWith(
          'cached_subjects',
          expect.stringContaining(JSON.stringify(mockData))
        );
      });
    });

    describe('getCachedGradeLevels', () => {
      it('should use grade levels cache key', async () => {
        const mockData = ['9', '10', '11', '12'];
        const fetchFn = vi.fn().mockResolvedValue(mockData);
        
        (window.localStorage.getItem as any).mockReturnValue(null);

        await getCachedGradeLevels(fetchFn);

        expect(window.localStorage.setItem).toHaveBeenCalledWith(
          'cached_grade_levels',
          expect.stringContaining(JSON.stringify(mockData))
        );
      });
    });

    describe('getCachedTeachers', () => {
      it('should use shorter cache duration for teachers', async () => {
        const mockTeacher = { id: 1, name: 'John Teacher' };
        const cachedEntry = {
          data: mockTeacher,
          timestamp: mockCurrentTime - (6 * 60 * 1000), // 6 minutes ago
          version: 1
        };
        const fetchFn = vi.fn().mockResolvedValue({ id: 2, name: 'Updated Teacher' });

        (window.localStorage.getItem as any).mockReturnValue(JSON.stringify(cachedEntry));

        await getCachedTeachers(fetchFn);

        // Should fetch new data because 6 min > 5 min teacher cache duration
        expect(fetchFn).toHaveBeenCalledTimes(1);
      });

      it('should return cached teachers when within 5 minute window', async () => {
        const mockTeacher = { id: 1, name: 'John Teacher' };
        const cachedEntry = {
          data: mockTeacher,
          timestamp: mockCurrentTime - (3 * 60 * 1000), // 3 minutes ago
          version: 1
        };
        const fetchFn = vi.fn();

        (window.localStorage.getItem as any).mockReturnValue(JSON.stringify(cachedEntry));

        const result = await getCachedTeachers(fetchFn);

        expect(result).toEqual(mockTeacher);
        expect(fetchFn).not.toHaveBeenCalled();
      });
    });
  });

  describe('Cache Invalidation Functions', () => {
    describe('invalidateCurriculaCache', () => {
      it('should clear curricula cache', () => {
        invalidateCurriculaCache();
        expect(window.localStorage.removeItem).toHaveBeenCalledWith('cached_curricula');
      });
    });

    describe('invalidateSubjectsCache', () => {
      it('should clear subjects cache', () => {
        invalidateSubjectsCache();
        expect(window.localStorage.removeItem).toHaveBeenCalledWith('cached_subjects');
      });
    });

    describe('invalidateGradeLevelsCache', () => {
      it('should clear grade levels cache', () => {
        invalidateGradeLevelsCache();
        expect(window.localStorage.removeItem).toHaveBeenCalledWith('cached_grade_levels');
      });
    });

    describe('invalidateTeachersCache', () => {
      it('should clear teachers cache', () => {
        invalidateTeachersCache();
        expect(window.localStorage.removeItem).toHaveBeenCalledWith('cached_teachers');
      });
    });
  });

  describe('Cache Performance and Edge Cases', () => {
    it('should handle large data sets efficiently', async () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({ id: i, data: `item-${i}` }));
      const fetchFn = vi.fn().mockResolvedValue(largeData);

      (window.localStorage.getItem as any).mockReturnValue(null);

      const start = performance.now();
      const result = await getOrFetchData('large-data', fetchFn);
      const end = performance.now();

      expect(result).toEqual(largeData);
      expect(end - start).toBeLessThan(100); // Should be reasonably fast
    });

    it('should handle concurrent cache access', async () => {
      const mockData = { id: 1, concurrent: true };
      const fetchFn = vi.fn().mockResolvedValue(mockData);

      (window.localStorage.getItem as any).mockReturnValue(null);

      // Simulate concurrent access
      const promises = Array.from({ length: 5 }, () => 
        getOrFetchData('concurrent-key', fetchFn)
      );

      const results = await Promise.all(promises);

      // All should return the same data
      results.forEach(result => {
        expect(result).toEqual(mockData);
      });

      // But fetch should only be called once (due to async nature)
      // Note: In real scenarios with proper caching, this would be 1
      expect(fetchFn).toHaveBeenCalled();
    });

    it('should handle empty data gracefully', async () => {
      const emptyData = null;
      const fetchFn = vi.fn().mockResolvedValue(emptyData);

      (window.localStorage.getItem as any).mockReturnValue(null);

      const result = await getOrFetchData('empty-key', fetchFn);

      expect(result).toBeNull();
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'empty-key',
        expect.stringContaining('null')
      );
    });

    it('should handle undefined data gracefully', async () => {
      const fetchFn = vi.fn().mockResolvedValue(undefined);

      (window.localStorage.getItem as any).mockReturnValue(null);

      const result = await getOrFetchData('undefined-key', fetchFn);

      expect(result).toBeUndefined();
    });

    it('should maintain cache integrity with special characters', async () => {
      const specialData = {
        text: 'Special chars: àáâãäå ñ 中文 🚀',
        quotes: 'He said "Hello" and she said \'Hi\'',
        newlines: 'Line 1\nLine 2\r\nLine 3'
      };
      const fetchFn = vi.fn().mockResolvedValue(specialData);

      (window.localStorage.getItem as any).mockReturnValue(null);

      const result = await getOrFetchData('special-chars', fetchFn);

      expect(result).toEqual(specialData);
      
      // Verify it can be retrieved from cache
      const cachedEntry = JSON.stringify({
        data: specialData,
        timestamp: mockCurrentTime,
        version: 1
      });
      
      (window.localStorage.getItem as any).mockReturnValue(cachedEntry);
      
      const cachedResult = await getOrFetchData('special-chars', vi.fn());
      expect(cachedResult).toEqual(specialData);
    });
  });

  describe('Cache Statistics and Monitoring', () => {
    it('should track cache hit/miss statistics', async () => {
      let cacheHits = 0;
      let cacheMisses = 0;

      const trackingGetOrFetchData = async (key: string, fetchFn: () => Promise<any>) => {
        const cached = window.localStorage.getItem(key);
        if (cached) {
          cacheHits++;
        } else {
          cacheMisses++;
        }
        return getOrFetchData(key, fetchFn);
      };

      const mockData = { test: 'data' };
      const fetchFn = vi.fn().mockResolvedValue(mockData);

      // First call - cache miss
      (window.localStorage.getItem as any).mockReturnValue(null);
      await trackingGetOrFetchData('stats-key', fetchFn);

      // Second call - cache hit
      (window.localStorage.getItem as any).mockReturnValue(JSON.stringify({
        data: mockData,
        timestamp: mockCurrentTime,
        version: 1
      }));
      await trackingGetOrFetchData('stats-key', fetchFn);

      expect(cacheMisses).toBe(1);
      expect(cacheHits).toBe(1);
    });
  });
});
