// src/api/services/auth.service.ts
import { api, ApiResponse } from '../client';
import { User, Session } from '../types/auth.types';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
}

export interface UpdateUserData {
    fullName?: string;
    email?: string;
    legal_id?: {
        id_type: string;
        id: string;
        country: string;
    };
    tax_info?: {
        tax_no: string;
        country: string;
    };
    bio?: string;
    phoneNumber?: string;
    alternativePhoneNumber?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
}

// Session storage keys
const SESSION_KEY = 'kidato_session';
const REFRESH_KEY = 'kidato_refresh_token';
const TOKEN_KEY = 'kidato_auth_token';

class AuthService {
    private session: Session | null = null;
    private listeners: ((session: Session | null) => void)[] = [];

    constructor() {
        // Initialize from localStorage
        this.loadSession();
    }

    async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
        try {
            const response = await api.post<AuthResponse>('/auth/login', credentials);

            if (response.data) {
                this.setSession({
                    user: response.data.user,
                    token: response.data['accessToken'],
                    refreshToken: response.data['refreshToken'],
                    expiresAt: this.calculateExpiryTime(24) // Assuming 24 hour token
                });
            }

            return response;
        } catch (error) {
            this.clearSession();
            return {
                data: null,
                error: {
                    message: error.response?.data?.message || 'Login failed',
                    status: error.response?.status || 500
                }
            };
        }
    }

    async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
        try {
            const response = await api.post<AuthResponse>('/auth/register', data);

            if (response.data) {
                this.setSession({
                    user: response.data.user,
                    token: response.data.token,
                    refreshToken: response.data.refreshToken,
                    expiresAt: this.calculateExpiryTime(24) // Assuming 24 hour token
                });
            }

            return response;
        } catch (error) {
            return {
                data: null,
                error: {
                    message: error.response?.data?.message || 'Registration failed',
                    status: error.response?.status || 500
                }
            };
        }
    }

    async logout(): Promise<void> {
        // Optionally call server-side logout endpoint
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        }

        this.clearSession();
    }

    async refreshSession(): Promise<boolean> {
        try {
            const refreshToken = localStorage.getItem('kidato_refresh_token');
            if (!refreshToken) {
                this.clearSession();
                return false;
            }

            const response = await api.post<AuthResponse>('/auth/refresh-token', { refreshToken });

            if (response.data) {
                this.setSession({
                    user: response.data.user,
                    token: response.data.token,
                    refreshToken: response.data.refreshToken,
                    expiresAt: this.calculateExpiryTime(24)
                });
                return true;
            }

            return false;
        } catch (error) {
            // console.error('Session refresh error:', error);
            // this.clearSession();
            return false;
        }
    }

    async getCurrentUser(): Promise<ApiResponse<User>> {
        if (!this.getSession()) {
            return {
                data: null,
                error: { message: 'Not authenticated', status: 401 }
            };
        }

        try {
            const response = await api.get<{user: User, accessToken?: string, refreshToken?: string}>('/auth/me');
            
            if (response.data) {
                // Check if we got a full response with user property
                if (response.data.user) {
                    const userData = response.data.user;
                    
                    // Update our session with the latest user info
                    if (this.session) {
                        this.setSession({
                            ...this.session,
                            user: userData,
                            // If new tokens were provided, update those too
                            ...(response.data.accessToken && { token: response.data.accessToken }),
                            ...(response.data.refreshToken && { refreshToken: response.data.refreshToken })
                        });
                    }
                    
                    return { 
                        data: userData,
                        error: null
                    };
                }
                
                // If we got a direct user object without wrapping
                return response;
            }
            
            return {
                data: null,
                error: { message: 'Invalid response format', status: 500 }
            };
        } catch (error) {
            if (error.response?.status === 401) {
                // Token expired, try to refresh
                const refreshed = await this.refreshSession();
                if (refreshed) {
                    // Retry with new token
                    return await this.getCurrentUser();
                }
            }

            return {
                data: null,
                error: {
                    message: error.response?.data?.message || 'Failed to get user',
                    status: error.response?.status || 500
                }
            };
        }
    }

    async updateUserProfile(userData: UpdateUserData): Promise<ApiResponse<User>> {
        if (!this.getSession()) {
            return {
                data: null,
                error: { message: 'Not authenticated', status: 401 }
            };
        }

        try {
            // Get current user ID from session
            const currentUserId = this.session?.user?.id;
            if (!currentUserId) {
                throw new Error('No user ID found in session');
            }

            // Use the PATCH /users/:id endpoint for updating basic user information
            const response = await api.patch<User>(`/users/${currentUserId}`, userData);
            
            // If successful, update the user in the session
            if (response.data && this.session) {
                this.setSession({
                    ...this.session,
                    user: { ...this.session.user, ...response.data }
                });
            }
            
            return response;
        } catch (error) {
            if (error.response?.status === 401) {
                // Token expired, try to refresh
                const refreshed = await this.refreshSession();
                if (refreshed) {
                    // Retry with new token
                    const currentUserId = this.session?.user?.id;
                    if (currentUserId) {
                        return await api.patch<User>(`/users/${currentUserId}`, userData);
                    }
                }
            }

            return {
                data: null,
                error: {
                    message: error.response?.data?.message || 'Failed to update user profile',
                    status: error.response?.status || 500
                }
            };
        }
    }

    getSession(): Session | null {
        // Check if token is expired
        if (this.session && this.session.expiresAt && this.session.expiresAt < Date.now()) {
            this.clearSession();
            return null;
        }

        return this.session;
    }

    isAuthenticated(): boolean {
        return !!this.getSession();
    }

    onAuthStateChange(callback: (session: Session | null) => void): () => void {
        this.listeners.push(callback);

        // Call immediately with current state
        callback(this.getSession());

        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(listener => listener !== callback);
        };
    }

    // Private methods
    private setSession(session: Session): void {
        this.session = session;

        // Store in localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
            localStorage.setItem(TOKEN_KEY, session.token);
            localStorage.setItem(REFRESH_KEY, session.refreshToken);
        }

        // Notify listeners
        this.notifyListeners();
    }

    private clearSession(): void {
        this.session = null;

        // Remove from localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem(SESSION_KEY);
            localStorage.removeItem(TOKEN_KEY);
        }

        // Notify listeners
        this.notifyListeners();
    }

    private loadSession(): void {
        if (typeof window !== 'undefined') {
            const sessionStr = localStorage.getItem(SESSION_KEY);
            if (sessionStr) {
                try {
                    this.session = JSON.parse(sessionStr);
                } catch (e) {
                    this.clearSession();
                }
            }
        }
    }

    private notifyListeners(): void {
        const session = this.getSession();
        this.listeners.forEach(listener => listener(session));
    }

    private calculateExpiryTime(hours: number): number {
        return Date.now() + (hours * 60 * 60 * 1000);
    }
}

// Create a singleton instance
export const authService = new AuthService();