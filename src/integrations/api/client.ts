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

                    try {
                        const refreshToken = localStorage.getItem('kidato_refresh_token');
                        if (refreshToken) {
                            const response = await this.client.post('/auth/refresh-token', {
                                refreshToken: refreshToken
                            });

                            const { accessToken, refreshToken: newRefreshToken } = response.data;
                            
                            // Update stored tokens
                            localStorage.setItem('kidato_access_token', accessToken);
                            if (newRefreshToken) {
                                localStorage.setItem('kidato_refresh_token', newRefreshToken);
                            }

                            // Update the Authorization header and retry the original request
                            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                            return this.client(originalRequest);
                        }
                    } catch (refreshError) {
                        // Refresh failed, clear tokens and redirect to login
                        localStorage.removeItem('kidato_access_token');
                        localStorage.removeItem('kidato_refresh_token');
                        localStorage.removeItem('kidato_user');
                        
                        // You may want to redirect to login page here
                        window.location.href = '/login';
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