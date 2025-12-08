import { BlogPost, BlogComment, BlogCategory, BlogStats, BlogFilters, BlogListResponse } from '@/types/blog';
import { api } from '@/integrations/api/client';

class BlogApiService {
  // Blog Posts
  async getPosts(filters: BlogFilters = {}): Promise<BlogListResponse> {
    const params: Record<string, any> = {};

    if (filters.category) params.category = filters.category;
    if (filters.tag) params.tag = filters.tag;
    if (filters.author) params.author = filters.author;
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.isFeatured !== undefined) params.isFeatured = filters.isFeatured;
    if (filters.categories && filters.categories.length > 0) params.categories = filters.categories.join(',');
    if (filters.tags && filters.tags.length > 0) params.tags = filters.tags.join(',');

    const { data, error } = await api.get<BlogListResponse>('/blog/posts', { params });

    if (error) throw new Error(error.message);
    if (!data) throw new Error('No data received');

    return data;
  }

  async getPostBySlug(slug: string, incrementView = true): Promise<BlogPost> {
    const params = { incrementView };
    const { data, error } = await api.get<BlogPost>(`/blog/posts/${slug}`, { params });

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Post not found');

    return this.mapPost(data);
  }

  async findPostById(id: string): Promise<BlogPost> {
    const { data, error } = await api.get<BlogPost>(`/blog/posts/id/${id}`);

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Post not found');

    return this.mapPost(data);
  }

  async createPost(postData: Partial<BlogPost>): Promise<BlogPost> {
    const { data, error } = await api.post<BlogPost>('/blog/posts', postData);

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Failed to create post');

    return this.mapPost(data);
  }

  async updatePost(id: string, postData: Partial<BlogPost>): Promise<BlogPost> {
    const { data, error } = await api.put<BlogPost>(`/blog/posts/${id}`, postData);

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Failed to update post');

    return this.mapPost(data);
  }

  async deletePost(id: string): Promise<void> {
    const { error } = await api.delete<void>(`/blog/posts/${id}`);

    if (error) throw new Error(error.message);
  }

  // Blog Comments
  async getComments(postId: string, status = 'approved'): Promise<BlogComment[]> {
    const params = { status };
    const { data, error } = await api.get<BlogComment[]>(`/blog/posts/${postId}/comments`, { params });

    if (error) throw new Error(error.message);

    return (data || []).map(this.mapComment);
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
    const { data, error } = await api.post<BlogComment>('/blog/comments', commentData);

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Failed to create comment');

    return this.mapComment(data);
  }

  async updateComment(id: string, commentData: Partial<BlogComment>): Promise<BlogComment> {
    const { data, error } = await api.put<BlogComment>(`/blog/comments/${id}`, commentData);

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Failed to update comment');

    return this.mapComment(data);
  }

  async deleteComment(id: string): Promise<void> {
    const { error } = await api.delete<void>(`/blog/comments/${id}`);

    if (error) throw new Error(error.message);
  }

  // Blog Categories
  async getCategories(): Promise<BlogCategory[]> {
    const { data, error } = await api.get<BlogCategory[]>('/blog/categories');

    if (error) throw new Error(error.message);

    return (data || []).map(this.mapCategory);
  }

  async getCategoryBySlug(slug: string): Promise<BlogCategory> {
    const { data, error } = await api.get<BlogCategory>(`/blog/categories/${slug}`);

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Category not found');

    return this.mapCategory(data);
  }

  async createCategory(categoryData: Partial<BlogCategory>): Promise<BlogCategory> {
    const { data, error } = await api.post<BlogCategory>('/blog/categories', categoryData);

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Failed to create category');

    return this.mapCategory(data);
  }

  // Blog Stats
  async getStats(): Promise<BlogStats> {
    const { data, error } = await api.get<BlogStats>('/blog/stats');

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Failed to fetch stats');

    return data;
  }

  // Helpers to map _id to id
  private mapPost(post: any): BlogPost {
    return {
      ...post,
      id: post._id || post.id,
    };
  }

  private mapComment(comment: any): BlogComment {
    return {
      ...comment,
      id: comment._id || comment.id,
    };
  }

  private mapCategory(category: any): BlogCategory {
    return {
      ...category,
      id: category._id || category.id,
    };
  }
}

export const blogApiService = new BlogApiService();
export default blogApiService;
