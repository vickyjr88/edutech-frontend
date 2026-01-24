import axios from 'axios';
import { API_CONFIG } from '@/config/features';

/**
 * Singleton service to handle token refreshing across different API clients.
 * This prevents multiple simultaneous refresh calls.
 */
class TokenRefreshManager {
    private refreshPromise: Promise<string> | null = null;

    /**
     * Refreshes the access token using the stored refresh token.
     * If a refresh is already in progress, returns the existing promise.
     */
    async refreshToken(): Promise<string> {
        // If a refresh is already in progress, return the current promise
        if (this.refreshPromise) {
            return this.refreshPromise;
        }

        // Start a new refresh process
        this.refreshPromise = (async () => {
            try {
                const refreshToken = localStorage.getItem('kidato_refresh_token') || localStorage.getItem('refreshToken');

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                console.log('🔄 TokenRefreshManager: Starting token refresh...');
                const response = await axios.post(
                    `${API_CONFIG.baseURL}/auth/refresh-token`,
                    { refreshToken },
                    { timeout: 30000 } // Give it plenty of time
                );

                const { accessToken, refreshToken: newRefreshToken, user } = response.data;

                // Update stored tokens
                localStorage.setItem('kidato_access_token', accessToken);
                if (newRefreshToken) {
                    localStorage.setItem('kidato_refresh_token', newRefreshToken);
                }

                // If user data was returned, update it too
                if (user) {
                    const savedUser = localStorage.getItem('kidato_user');
                    if (savedUser) {
                        const userData = JSON.parse(savedUser);
                        localStorage.setItem('kidato_user', JSON.stringify({ ...userData, ...user }));
                    }
                }

                console.log('✅ TokenRefreshManager: Token refreshed successfully');
                return accessToken;
            } catch (error) {
                console.error('❌ TokenRefreshManager: Token refresh failed', error);
                // Clear tokens on failure
                this.clearTokens();
                throw error;
            } finally {
                this.refreshPromise = null;
            }
        })();

        return this.refreshPromise;
    }

    private clearTokens() {
        localStorage.removeItem('kidato_access_token');
        localStorage.removeItem('kidato_refresh_token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('kidato_user');
    }
}

export const tokenRefreshManager = new TokenRefreshManager();
