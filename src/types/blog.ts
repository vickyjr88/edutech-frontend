// Blog Types for the Kidato Learning Platform

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: BlogAuthor;
  featuredImage?: BlogImage;
  categories: BlogCategory[];
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt: Date;
  updatedAt: Date;
  createdAt: Date;
  readingTime: number; // in minutes
  viewCount: number;
  seoMetadata: BlogSEOMetadata;
}

export interface BlogAuthor {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  postCount: number;
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

export interface BlogListResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BlogFilters {
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
  status?: 'draft' | 'published' | 'archived';
  sortBy?: 'publishedAt' | 'updatedAt' | 'title' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  isFeatured?: boolean;
  categories?: string[];
  tags?: string[];
}

export interface BlogComment {
  id: string;
  postId: string;
  author: {
    name: string;
    email: string;
    website?: string;
  };
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  parentId?: string; // for replies
  replies?: BlogComment[];
}

export interface BlogNewsletter {
  id: string;
  title: string;
  description: string;
  content: string;
  publishedAt: Date;
  subscribers: number;
  status: 'draft' | 'scheduled' | 'sent';
}

export interface BlogStats {
  totalPosts: number;
  totalViews: number;
  totalComments: number;
  totalSubscribers: number;
  popularPosts: BlogPost[];
  recentPosts: BlogPost[];
  topCategories: BlogCategory[];
  topTags: Array<{ tag: string; count: number }>;
}
