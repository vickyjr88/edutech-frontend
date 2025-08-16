// src/api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { authService } from './services/auth.service';

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
            withCredentials: true, // Include cookies for Ory session
            headers: {
                'Content-Type': 'application/json'
            },
        });

        // Add request interceptor to include auth token
        this.client.interceptors.request.use((config) => {
            const session = authService.getSession();
            if (session?.token) {
                config.headers.Authorization = `Bearer ${session.token}`;
            }
            return config;
        });

        // Add response interceptor to handle errors
        this.client.interceptors.response.use(
            (response) => response,
            async (error) => {
                // Try to refresh token if unauthorized
                if (error.response?.status === 401) {
                    const refreshed = await authService.refreshSession();
                    if (refreshed) {
                        // Retry the original request with the new token
                        const session = authService.getSession();
                        error.config.headers.Authorization = `Bearer ${session.token}`;
                        return this.client.request(error.config);
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