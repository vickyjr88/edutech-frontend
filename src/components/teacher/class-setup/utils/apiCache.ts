// Cache duration in milliseconds
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

// Local storage keys
const STORAGE_KEYS = {
  CURRICULA: 'cached_curricula',
  SUBJECTS: 'cached_subjects',
  GRADE_LEVELS: 'cached_grade_levels',
  TEACHERS: 'cached_teachers',
};

// Cache structure
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version: number;
}

// Cache version - increment this when the structure of cached data changes
const CACHE_VERSION = 1;

/**
 * Generic function to get data from cache or fetch it
 */
export async function getOrFetchData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  maxAge: number = CACHE_DURATION
): Promise<T> {
  try {
    // Check for data in cache
    const cachedJson = localStorage.getItem(key);
    
    if (cachedJson) {
      const cached = JSON.parse(cachedJson) as CacheEntry<T>;
      
      // Check cache version and age
      const isCurrentVersion = cached.version === CACHE_VERSION;
      const isFresh = Date.now() - cached.timestamp < maxAge;
      
      if (isCurrentVersion && isFresh) {
        console.log(`Using cached data for ${key}`);
        return cached.data;
      }
    }
    
    // If we reach here, need to fetch fresh data
    console.log(`Fetching fresh data for ${key}`);
    const data = await fetchFn();
    
    // Cache the result
    const cacheEntry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      version: CACHE_VERSION,
    };
    
    localStorage.setItem(key, JSON.stringify(cacheEntry));
    return data;
  } catch (error) {
    console.error(`Error getting/fetching data for ${key}:`, error);
    
    // If we have any cached data (even if old), use it as fallback
    const cachedJson = localStorage.getItem(key);
    if (cachedJson) {
      console.log(`Using stale cache as fallback for ${key}`);
      const cached = JSON.parse(cachedJson) as CacheEntry<T>;
      return cached.data;
    }
    
    // Re-throw if we have no fallback
    throw error;
  }
}

/**
 * Clear a specific cache entry
 */
export function clearCache(key: string): void {
  localStorage.removeItem(key);
}

/**
 * Clear all API caches
 */
export function clearAllCaches(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

// Specific cache functions for common data types
export async function getCachedCurricula<T>(fetchFn: () => Promise<T>): Promise<T> {
  return getOrFetchData<T>(STORAGE_KEYS.CURRICULA, fetchFn);
}

export async function getCachedSubjects<T>(fetchFn: () => Promise<T>): Promise<T> {
  return getOrFetchData<T>(STORAGE_KEYS.SUBJECTS, fetchFn);
}

export async function getCachedGradeLevels<T>(fetchFn: () => Promise<T>): Promise<T> {
  return getOrFetchData<T>(STORAGE_KEYS.GRADE_LEVELS, fetchFn);
}

export async function getCachedTeachers<T>(fetchFn: () => Promise<T>): Promise<T> {
  // Teachers cache expires faster (5 minutes) since it might change more often
  return getOrFetchData<T>(STORAGE_KEYS.TEACHERS, fetchFn, 5 * 60 * 1000);
}

// Helper to invalidate specific caches when needed
export function invalidateCurriculaCache(): void {
  clearCache(STORAGE_KEYS.CURRICULA);
}

export function invalidateSubjectsCache(): void {
  clearCache(STORAGE_KEYS.SUBJECTS);
}

export function invalidateGradeLevelsCache(): void {
  clearCache(STORAGE_KEYS.GRADE_LEVELS);
}

export function invalidateTeachersCache(): void {
  clearCache(STORAGE_KEYS.TEACHERS);
}