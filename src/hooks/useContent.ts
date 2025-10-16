import { useState, useEffect } from 'react';
import type { PageContent } from '@/content/types';

interface UseContentResult<T = PageContent> {
  content: T | null;
  loading: boolean;
  error: Error | null;
}

// Cache for loaded content to avoid repeated fetches
const contentCache = new Map<string, any>();

/**
 * Custom hook for loading content from JSON files
 *
 * @param contentPath - The path to the content file relative to /src/content/
 *                      Example: 'pages/index.json' or 'shared/navigation.json'
 * @returns Object containing content, loading state, and error
 *
 * @example
 * ```tsx
 * const { content, loading, error } = useContent<PageContent>('pages/index.json');
 *
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * if (!content) return null;
 *
 * return <div>{content.metadata.title}</div>;
 * ```
 */
export function useContent<T = PageContent>(contentPath: string): UseContentResult<T> {
  const [content, setContent] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadContent() {
      try {
        // Check cache first
        if (contentCache.has(contentPath)) {
          if (isMounted) {
            setContent(contentCache.get(contentPath));
            setLoading(false);
          }
          return;
        }

        setLoading(true);
        setError(null);

        // Dynamically import the JSON file
        // Vite requires the file extension in the static part
        // We'll use a switch/map for known paths or fetch for dynamic paths
        let data;

        // For now, use a simple approach with known paths
        if (contentPath === 'pages/index.json') {
          const module = await import('../content/pages/index.json');
          data = module.default || module;
        } else if (contentPath === 'pages/for-parents.json') {
          const module = await import('../content/pages/for-parents.json');
          data = module.default || module;
        } else if (contentPath === 'pages/for-students.json') {
          const module = await import('../content/pages/for-students.json');
          data = module.default || module;
        } else if (contentPath === 'pages/for-teachers.json') {
          const module = await import('../content/pages/for-teachers.json');
          data = module.default || module;
        } else if (contentPath === 'pages/teachers-pricing.json') {
          const module = await import('../content/pages/teachers-pricing.json');
          data = module.default || module;
        } else if (contentPath === 'pages/privacy-policy.json') {
          const module = await import('../content/pages/privacy-policy.json');
          data = module.default || module;
        } else if (contentPath === 'pages/terms-and-conditions.json') {
          const module = await import('../content/pages/terms-and-conditions.json');
          data = module.default || module;
        } else {
          // Fallback: try to fetch as a static asset
          const response = await fetch(`/src/content/${contentPath}`);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          data = await response.json();
        }

        // Cache the loaded content
        contentCache.set(contentPath, data);

        if (isMounted) {
          setContent(data);
          setLoading(false);
        }
      } catch (err) {
        console.error(`Failed to load content from ${contentPath}:`, err);
        if (isMounted) {
          setError(
            err instanceof Error
              ? err
              : new Error(`Failed to load content from ${contentPath}`)
          );
          setLoading(false);
        }
      }
    }

    loadContent();

    return () => {
      isMounted = false;
    };
  }, [contentPath]);

  return { content, loading, error };
}

/**
 * Clears the content cache for a specific path or all paths
 * Useful for development or when content needs to be refreshed
 *
 * @param contentPath - Optional path to clear. If not provided, clears all cache
 */
export function clearContentCache(contentPath?: string): void {
  if (contentPath) {
    contentCache.delete(contentPath);
  } else {
    contentCache.clear();
  }
}

/**
 * Preloads content in the background
 * Useful for preloading content for pages that user might visit
 *
 * @param contentPath - The path to the content file to preload
 *
 * @example
 * ```tsx
 * // Preload content when hovering over a link
 * <Link
 *   to="/for-teachers"
 *   onMouseEnter={() => preloadContent('pages/for-teachers.json')}
 * >
 *   For Teachers
 * </Link>
 * ```
 */
export async function preloadContent(contentPath: string): Promise<void> {
  if (contentCache.has(contentPath)) {
    return; // Already cached
  }

  try {
    let data;

    if (contentPath === 'pages/index.json') {
      const module = await import('../content/pages/index.json');
      data = module.default || module;
    } else if (contentPath === 'pages/for-parents.json') {
      const module = await import('../content/pages/for-parents.json');
      data = module.default || module;
    } else if (contentPath === 'pages/for-students.json') {
      const module = await import('../content/pages/for-students.json');
      data = module.default || module;
    } else if (contentPath === 'pages/for-teachers.json') {
      const module = await import('../content/pages/for-teachers.json');
      data = module.default || module;
    } else if (contentPath === 'pages/teachers-pricing.json') {
      const module = await import('../content/pages/teachers-pricing.json');
      data = module.default || module;
    } else if (contentPath === 'pages/privacy-policy.json') {
      const module = await import('../content/pages/privacy-policy.json');
      data = module.default || module;
    } else if (contentPath === 'pages/terms-and-conditions.json') {
      const module = await import('../content/pages/terms-and-conditions.json');
      data = module.default || module;
    } else {
      const response = await fetch(`/src/content/${contentPath}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      data = await response.json();
    }

    contentCache.set(contentPath, data);
  } catch (err) {
    console.error(`Failed to preload content from ${contentPath}:`, err);
  }
}
