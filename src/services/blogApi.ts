import { BlogPost, BlogComment, BlogCategory, BlogStats, BlogFilters, BlogListResponse } from '@/types/blog';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class BlogApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}/blog${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Blog Posts
  async getPosts(filters: BlogFilters = {}): Promise<BlogListResponse> {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.tag) params.append('tag', filters.tag);
    if (filters.author) params.append('author', filters.author);
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.isFeatured !== undefined) params.append('isFeatured', filters.isFeatured.toString());
    if (filters.categories) params.append('categories', filters.categories.join(','));
    if (filters.tags) params.append('tags', filters.tags.join(','));

    const queryString = params.toString();
    const endpoint = `/posts${queryString ? `?${queryString}` : ''}`;
    
    return this.request<BlogListResponse>(endpoint);
  }

  async getPostBySlug(slug: string, incrementView = true): Promise<BlogPost> {
    const params = new URLSearchParams();
    if (incrementView) params.append('incrementView', 'true');
    
    const queryString = params.toString();
    const endpoint = `/posts/${slug}${queryString ? `?${queryString}` : ''}`;
    
    return this.request<BlogPost>(endpoint);
  }

  async createPost(postData: Partial<BlogPost>, token: string): Promise<BlogPost> {
    return this.request<BlogPost>('/posts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });
  }

  async updatePost(id: string, postData: Partial<BlogPost>, token: string): Promise<BlogPost> {
    return this.request<BlogPost>(`/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });
  }

  async deletePost(id: string, token: string): Promise<void> {
    return this.request<void>(`/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Blog Comments
  async getComments(postId: string, status = 'approved'): Promise<BlogComment[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    
    const queryString = params.toString();
    const endpoint = `/posts/${postId}/comments${queryString ? `?${queryString}` : ''}`;
    
    return this.request<BlogComment[]>(endpoint);
  }

  async createComment(commentData: {
    postId: string;
    author: {
      name: string;
      email: string;
      website?: string;
    };
    content: string;
    parentId?: string;
  }): Promise<BlogComment> {
    return this.request<BlogComment>('/comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  }

  async updateComment(id: string, commentData: Partial<BlogComment>, token: string): Promise<BlogComment> {
    return this.request<BlogComment>(`/comments/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(commentData),
    });
  }

  async deleteComment(id: string, token: string): Promise<void> {
    return this.request<void>(`/comments/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Blog Categories
  async getCategories(): Promise<BlogCategory[]> {
    return this.request<BlogCategory[]>('/categories');
  }

  async getCategoryBySlug(slug: string): Promise<BlogCategory> {
    return this.request<BlogCategory>(`/categories/${slug}`);
  }

  async createCategory(categoryData: Partial<BlogCategory>, token: string): Promise<BlogCategory> {
    return this.request<BlogCategory>('/categories', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });
  }

  // Blog Stats
  async getStats(): Promise<BlogStats> {
    return this.request<BlogStats>('/stats');
  }
}

export const blogApiService = new BlogApiService();
export default blogApiService;
