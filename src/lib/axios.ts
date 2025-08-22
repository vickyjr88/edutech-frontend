import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth tokens
api.interceptors.request.use(
  (config) => {
    // Add access token if available
    const accessToken = localStorage.getItem('kidato_access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('kidato_refresh_token');
        if (refreshToken) {
          const refreshResponse = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
            { refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );

          if (refreshResponse.data.accessToken) {
            localStorage.setItem('kidato_access_token', refreshResponse.data.accessToken);
            localStorage.setItem('kidato_refresh_token', refreshResponse.data.refreshToken);
            
            // Update the original request with new token
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
            
            // Retry the original request
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('kidato_access_token');
        localStorage.removeItem('kidato_refresh_token');
        localStorage.removeItem('kidato_user');
        localStorage.removeItem('kidato_session_id');
        
        // Redirect to login page
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { api };
export default api;