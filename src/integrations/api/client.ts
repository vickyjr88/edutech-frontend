// src/api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { authService } from './services/auth.service';
import { API_CONFIG } from '@/config/features';
import { tokenRefreshManager } from './auth-refresh';

export interface ApiResponse<T> {
    data: T | null;
    error: null | { message: string; status: number };
}

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        // Create axios instance with base configuration
        this.client = axios.create({
            baseURL: import.meta.env.VITE_API_URL,
            timeout: API_CONFIG.timeout,
            withCredentials: true, // Include cookies for Ory session
            headers: {
                'Content-Type': 'application/json'
            },
        });

        // Add request interceptor to include auth token
        this.client.interceptors.request.use((config) => {
            const accessToken = localStorage.getItem('kidato_access_token');
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        });

        // Add response interceptor to handle token refresh
        this.client.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // If we get a 401 and haven't already tried to refresh
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    // Only try to refresh if user was actually logged in
                    const hadToken = localStorage.getItem('kidato_access_token') || localStorage.getItem('accessToken');

                    if (hadToken) {
                        try {
                            const accessToken = await tokenRefreshManager.refreshToken();

                            // Update the Authorization header and retry the original request
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

    // Generic data methods
    public async get<T>(path: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.get<T>(path, config);
            return { data: response.data, error: null };
        } catch (error) {
            return {
                data: null,
                error: {
                    message: error.response?.data?.message || 'Request failed',
                    status: error.response?.status || 500
                }
            };
        }
    }

    public async post<T>(path: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.post<T>(path, data, config);
            return { data: response.data, error: null };
        } catch (error) {
            return {
                data: null,
                error: {
                    message: error.response?.data?.message || 'Request failed',
                    status: error.response?.status || 500
                }
            };
        }
    }

    public async put<T>(path: string, data: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.put<T>(path, data, config);
            return { data: response.data, error: null };
        } catch (error) {
            return {
                data: null,
                error: {
                    message: error.response?.data?.message || 'Request failed',
                    status: error.response?.status || 500
                }
            };
        }
    }

    public async patch<T>(path: string, data: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.patch<T>(path, data, config);
            return { data: response.data, error: null };
        } catch (error) {
            return {
                data: null,
                error: {
                    message: error.response?.data?.message || 'Request failed',
                    status: error.response?.status || 500
                }
            };
        }
    }

    public async delete<T>(path: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.delete<T>(path, config);
            return { data: response.data, error: null };
        } catch (error) {
            return {
                data: null,
                error: {
                    message: error.response?.data?.message || 'Request failed',
                    status: error.response?.status || 500
                }
            };
        }
    }
}

// Create a singleton instance
export const api = new ApiClient();