/**
 * CMS API Service
 *
 * Service for interacting with the CMS backend API
 */

import api from "../lib/axios";

export interface PageMetadata {
  title: string;
  description: string;
  keywords: string[];
  author?: string;
  lastModified?: Date;
}

export interface PageContent {
  _id?: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  version: number;
  metadata: PageMetadata;
  sections: any[];
  additionalFields?: any;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PageVersion {
  _id: string;
  pageId: string;
  slug: string;
  version: number;
  content: {
    metadata: PageMetadata;
    sections: any[];
    additionalFields?: any;
  };
  changeLog?: string;
  createdBy?: string;
  createdAt: Date;
}

export interface PagesListResponse {
  pages: PageContent[];
  total: number;
}

export interface CreatePageDto {
  slug: string;
  metadata: PageMetadata;
  sections: any[];
  additionalFields?: any;
}

export interface UpdatePageDto {
  metadata: PageMetadata;
  sections: any[];
  additionalFields?: any;
  changeLog?: string;
}

export interface UpdateSectionDto {
  section: any;
  changeLog?: string;
}

export interface DuplicatePageDto {
  newSlug: string;
  newTitle: string;
}

export interface QueryPagesDto {
  status?: 'draft' | 'published' | 'archived';
  search?: string;
  limit?: number;
  offset?: number;
}

class CMSApiService {
  private baseUrl = '/cms/pages';

  /**
   * Get authentication token from localStorage
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('kidato_access_token');
  }

  /**
   * Get authorization headers
   */
  private getAuthHeaders() {
    const token = this.getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * List all pages with optional filtering
   */
  async listPages(query?: QueryPagesDto): Promise<PagesListResponse> {
    const params = new URLSearchParams();
    if (query?.status) params.append('status', query.status);
    if (query?.search) params.append('search', query.search);
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.offset) params.append('offset', query.offset.toString());

    const response = await api.get(`${this.baseUrl}?${params.toString()}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  /**
   * Get a specific page by slug
   */
  async getPage(slug: string, version?: number): Promise<PageContent> {
    const params = version ? `?version=${version}` : '';
    const response = await api.get(`${this.baseUrl}/${slug}${params}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  /**
   * Get version history for a page
   */
  async getVersionHistory(slug: string): Promise<PageVersion[]> {
    const response = await api.get(`${this.baseUrl}/${slug}/versions`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  /**
   * Create a new page
   */
  async createPage(data: CreatePageDto): Promise<PageContent> {
    const response = await api.post(this.baseUrl, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  /**
   * Update a page
   */
  async updatePage(slug: string, data: UpdatePageDto): Promise<PageContent> {
    const response = await api.put(`${this.baseUrl}/${slug}`, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  /**
   * Update a specific section
   */
  async updateSection(
    slug: string,
    sectionIndex: number,
    data: UpdateSectionDto
  ): Promise<PageContent> {
    const response = await api.patch(
      `${this.baseUrl}/${slug}/sections/${sectionIndex}`,
      data,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  /**
   * Publish a page
   */
  async publishPage(slug: string): Promise<PageContent> {
    const response = await api.patch(
      `${this.baseUrl}/${slug}/publish`,
      {},
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  /**
   * Unpublish a page
   */
  async unpublishPage(slug: string): Promise<PageContent> {
    const response = await api.patch(
      `${this.baseUrl}/${slug}/unpublish`,
      {},
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  /**
   * Duplicate a page
   */
  async duplicatePage(
    slug: string,
    data: DuplicatePageDto
  ): Promise<PageContent> {
    const response = await api.post(
      `${this.baseUrl}/${slug}/duplicate`,
      data,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  /**
   * Rollback to a specific version
   */
  async rollbackToVersion(
    slug: string,
    version: number
  ): Promise<PageContent> {
    const response = await api.post(
      `${this.baseUrl}/${slug}/rollback/${version}`,
      {},
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  /**
   * Archive a page
   */
  async archivePage(slug: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${slug}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

export const cmsApiService = new CMSApiService();
