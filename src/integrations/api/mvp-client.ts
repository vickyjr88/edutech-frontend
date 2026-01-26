/**
 * MVP API Client
 *
 * This client handles API calls to the /mvp namespace for new simplified endpoints
 * that don't exist in the original kidato-api backend.
 *
 * All MVP-specific endpoints should go through this client.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '@/config/features';
import { tokenRefreshManager } from './auth-refresh';

class MVPApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.mvpURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      (config) => {
        // Try kidato_access_token first (used by AuthContext), fallback to accessToken
        const token = localStorage.getItem('kidato_access_token') || localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Only try to refresh if user was actually logged in
          const hadToken = localStorage.getItem('kidato_access_token') || localStorage.getItem('accessToken');

          if (hadToken) {
            try {
              const accessToken = await tokenRefreshManager.refreshToken();

              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.client(originalRequest);
            } catch (refreshError) {
              // Refresh failed, manager already cleared tokens
              // Only redirect if we're not on a public page
              const publicPages = ['/class/', '/teacher/', '/teachers', '/all-classes', '/'];
              const isPublicPage = publicPages.some(page => window.location.pathname.startsWith(page));

              if (!isPublicPage) {
                window.location.href = '/login';
              }
              return Promise.reject(refreshError);
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic request methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  // File upload helper
  async uploadFile<T = any>(url: string, file: File, fieldName: string = 'file'): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);

    const response: AxiosResponse<T> = await this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  // Get raw axios instance if needed
  getClient(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const mvpApiClient = new MVPApiClient();

// Export class for testing
export default MVPApiClient;
