import api from "../lib/axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Types
export interface BlogAuthor {
  name: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface BlogCategory {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  postCount: number;
  isActive?: boolean;
  sortOrder?: number;
  icon?: string;
  isFeatured?: boolean;
}

export interface BlogImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface BlogSEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: BlogAuthor;
  featuredImage?: BlogImage;
  categories: BlogCategory[];
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  readingTime: number;
  viewCount: number;
  seoMetadata: BlogSEOMetadata;
  createdBy?: string;
  updatedBy?: string;
  isFeatured: boolean;
  allowComments: boolean;
  relatedPostIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBlogPostDto {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: BlogAuthor;
  featuredImage?: BlogImage;
  categories: BlogCategory[];
  tags: string[];
  status?: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  readingTime?: number;
  seoMetadata: BlogSEOMetadata;
  isFeatured?: boolean;
  allowComments?: boolean;
  relatedPostIds?: string[];
}

export interface UpdateBlogPostDto {
  slug?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  author?: BlogAuthor;
  featuredImage?: BlogImage;
  categories?: BlogCategory[];
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  readingTime?: number;
  seoMetadata?: BlogSEOMetadata;
  isFeatured?: boolean;
  allowComments?: boolean;
  relatedPostIds?: string[];
}

export interface QueryBlogPostsDto {
  status?: 'draft' | 'published' | 'archived';
  category?: string;
  tag?: string;
  isFeatured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BlogPostsResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateBlogCategoryDto {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  sortOrder?: number;
  isFeatured?: boolean;
}

export interface UpdateBlogCategoryDto {
  name?: string;
  slug?: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
  sortOrder?: number;
  isFeatured?: boolean;
}

export interface BlogComment {
  _id: string;
  postId: string;
  author: {
    name: string;
    email: string;
    website?: string;
  };
  content: string;
  status: 'pending' | 'approved' | 'spam';
  parentCommentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBlogCommentDto {
  postId: string;
  author: {
    name: string;
    email: string;
    website?: string;
  };
  content: string;
  parentCommentId?: string;
}

export interface UpdateBlogCommentDto {
  status?: 'pending' | 'approved' | 'spam';
  content?: string;
}

export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalCategories: number;
  totalComments: number;
  totalViews: number;
}

class BlogApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('kidato_admin_token');
  }

  private getAuthHeaders() {
    const token = this.getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Blog Posts
  async listPosts(query?: QueryBlogPostsDto): Promise<BlogPostsResponse> {
    const response = await api.get(`${API_BASE_URL}/blog/posts`, {
      params: query,
    });
    return response.data;
  }

  async getPostBySlug(slug: string, incrementView: boolean = false): Promise<BlogPost> {
    const response = await api.get(`${API_BASE_URL}/blog/posts/${slug}`, {
      params: { incrementView },
    });
    return response.data;
  }

  async getPostById(id: string): Promise<BlogPost> {
    const response = await api.get(`${API_BASE_URL}/blog/posts/id/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async createPost(data: CreateBlogPostDto): Promise<BlogPost> {
    const response = await api.post(`${API_BASE_URL}/blog/posts`, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async updatePost(id: string, data: UpdateBlogPostDto): Promise<BlogPost> {
    const response = await api.put(`${API_BASE_URL}/blog/posts/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async deletePost(id: string): Promise<void> {
    await api.delete(`${API_BASE_URL}/blog/posts/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Blog Categories
  async listCategories(): Promise<BlogCategory[]> {
    const response = await api.get(`${API_BASE_URL}/blog/categories`);
    return response.data;
  }

  async getCategoryBySlug(slug: string): Promise<BlogCategory> {
    const response = await api.get(`${API_BASE_URL}/blog/categories/${slug}`);
    return response.data;
  }

  async createCategory(data: CreateBlogCategoryDto): Promise<BlogCategory> {
    const response = await api.post(`${API_BASE_URL}/blog/categories`, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Note: Update and delete category endpoints need to be added to backend
  // These are placeholders for when they're implemented
  async updateCategory(slug: string, data: UpdateBlogCategoryDto): Promise<BlogCategory> {
    const response = await api.put(`${API_BASE_URL}/blog/categories/${slug}`, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async deleteCategory(slug: string): Promise<void> {
    await api.delete(`${API_BASE_URL}/blog/categories/${slug}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Blog Comments
  async createComment(data: CreateBlogCommentDto): Promise<BlogComment> {
    const response = await api.post(`${API_BASE_URL}/blog/comments`, data);
    return response.data;
  }

  async getCommentsByPostId(postId: string, status?: string): Promise<BlogComment[]> {
    const response = await api.get(`${API_BASE_URL}/blog/posts/${postId}/comments`, {
      params: { status },
    });
    return response.data;
  }

  async updateComment(id: string, data: UpdateBlogCommentDto): Promise<BlogComment> {
    const response = await api.put(`${API_BASE_URL}/blog/comments/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async deleteComment(id: string): Promise<void> {
    await api.delete(`${API_BASE_URL}/blog/comments/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Blog Stats
  async getBlogStats(): Promise<BlogStats> {
    const response = await api.get(`${API_BASE_URL}/blog/stats`);
    return response.data;
  }

  // Utility: Get all unique tags from posts
  async getAllTags(): Promise<string[]> {
    const response = await this.listPosts({ limit: 100 });
    const allTags = response.posts.flatMap(post => post.tags);
    return Array.from(new Set(allTags)).sort();
  }
}

export const blogApiService = new BlogApiService();
