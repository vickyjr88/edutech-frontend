import { ory } from '../lib/ory'; // Import ory from lib/ory
import axios from 'axios';
import { api } from '../integrations/api/client';
import { s } from 'node_modules/framer-motion/dist/types.d-DSjX-LJB';

// Removed: import { getOryBaseUrl } from '../lib/ory';

// Ory Network interfaces (these will remain the same)
interface LoginFlow {
  id: string;
  ui: {
    nodes: any[];
    action: string;
    method: string;
    messages?: any[];
  };
  expires_at: string;
  issued_at: string;
  request_url: string;
  state: string;
  type: string;
}

interface RegistrationFlow {
  id: string;
  ui: {
    nodes: any[];
    action: string;
    method: string;
    messages?: any[];
  };
  expires_at: string;
  issued_at: string;
  request_url: string;
  state: string;
  type: string;
}

interface Session {
  id: string;
  identity: {
    id: string;
    traits: {
      email: string;
      name: {
        first: string;
        last: string;
      };
      role: string;
    };
  };
  expires_at: string;
}

interface AuthResponse {
  data?: {
    user: {
      id: string;
      email: string;
      fullName: string;
      role: string;
      teacherId?: string;
      studentId?: string;
      parentId?: string;
    };
    session?: Session;
    accessToken?: string;
    refreshToken?: string;
    legacy?: boolean; // Indicates if this is a legacy login response
  };
  error?: Error;
}

class AuthService {
  private readonly baseUrl = import.meta.env.VITE_API_URL;
  public readonly oryProxyUrl = import.meta.env.VITE_ORY_SDK_URL || 'http://localhost:4000'; // Use this directly

  async initializeLoginFlow(returnTo?: string): Promise<LoginFlow> {
    try {
      const response = await fetch(`${this.oryProxyUrl}/self-service/login/browser`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to initialize login flow with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to initialize login flow:', error);
      // This is where you'd typically trigger your fallback to native auth
      throw error;
    }
  }

  async initializeRegistrationFlow(returnTo?: string): Promise<RegistrationFlow> {
    try {
      const response = await fetch(`${this.oryProxyUrl}/self-service/registration/browser`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to initialize registration flow with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to initialize registration flow:', error);
      // This is where you'd typically trigger your fallback to native auth
      throw error;
    }
  }

  async getRegistrationFlow(flowId: string): Promise<RegistrationFlow> {
    try {
      const response = await fetch(`${this.oryProxyUrl}/self-service/registration/flows?id=${flowId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch registration flow with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch registration flow:', error);
      throw error;
    }
  }

  async submitLoginFlow(flowId: string, values: Record<string, any>): Promise<AuthResponse> { // Changed return type
    try {
      const response = await fetch(`${this.oryProxyUrl}/self-service/login?flow=${flowId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: new URLSearchParams(values).toString(),
      });

      const result = await response.json();

      if (!response.ok) {
        // Ory returns 400 for validation errors, with the updated flow in the body
        if (response.status === 400 && result.ui) {
          console.log('Ory login failed with validation error in submitLoginFlow, attempting legacy login...');
          try {
            const legacyResponse = await this.loginLegacy(values.identifier, values.password);
            // If legacy login is successful, return AuthResponse
            if (legacyResponse.accessToken && legacyResponse.refreshToken && legacyResponse.user) {
              localStorage.setItem('kidato_user', JSON.stringify(legacyResponse.user));
              localStorage.setItem('kidato_access_token', legacyResponse.accessToken);
              localStorage.setItem('kidato_refresh_token', legacyResponse.refreshToken);
              const resp =  {
                data: {
                  user: {
                    id: legacyResponse.user.id,
                    email: legacyResponse.user.email,
                    fullName: legacyResponse.user.fullName,
                    role: legacyResponse.user.role,
                    teacherId: legacyResponse.user.teacherId,
                    studentId: legacyResponse.user.studentId,
                    parentId: legacyResponse.user.parentId,
                  },
                  accessToken: legacyResponse.accessToken,
                  refreshToken: legacyResponse.refreshToken,
                  legacy: true
                }
              };
              const session = await this.getCurrentSession();
              return resp;
            } else {
              throw new Error('Legacy login response missing tokens or user data.');
            }
          } catch (legacyError: any) {
            console.error('Legacy login also failed in submitLoginFlow:', legacyError);
            // Re-throw the original Ory error if legacy also fails
            const error = new Error('Validation failed');
            (error as any).ui = result.ui;
            (error as any).response = { data: result };
            throw error;
          }
        }
        throw new Error(result.message || `Login submission failed with status ${response.status}`);
      }

      // On successful Ory login, fetch session and return AuthResponse
      const session = await this.getCurrentSession();
      const storedUser = localStorage.getItem('kidato_user');
      const isLegacyUser = storedUser ? JSON.parse(storedUser).legacy : false;
      if (session && !isLegacyUser) {
        const backendUser = await this.getBackendUserByOryId(session.identity.id);
        return { 
          data: { 
            user: { 
              id: backendUser?.user?.id || session.identity.id, 
              email: session.identity.traits.email, 
              fullName: `${session.identity.traits.name.first} ${session.identity.traits.name.last}`, 
              role: session.identity.traits.role,
              teacherId: backendUser?.user?.teacherId,
              studentId: backendUser?.user?.studentId,
              parentId: backendUser?.user?.parentId,
            }, 
            session: session,
            accessToken: backendUser?.accessToken,
            refreshToken: backendUser?.refreshToken,
          } 
        };
      }
      // throw new Error('No session returned from Ory login');
    } catch (error: any) {
      console.error('Login flow submission failed:', error);
      throw error;
    }
  }

  async submitRegistrationFlow(flowId: string, values: Record<string, any>) {
    try {
      const response = await fetch(`${this.oryProxyUrl}/self-service/registration?flow=${flowId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: new URLSearchParams(values).toString(),
      });

      const result = await response.json();

      if (!response.ok) {
        // Ory returns 400 for validation errors, with the updated flow in the body
        if (response.status === 400 && result.ui) {
          // Throw error with the UI data so the form can handle it
          const error = new Error('Validation failed');
          (error as any).ui = result.ui;
          (error as any).response = { data: result };
          throw error;
        }
        throw new Error(result.message || `Registration submission failed with status ${response.status}`);
      }

      // On successful registration, Ory sets the session cookie.
      // We can then fetch the session to confirm.
      const session = await this.getCurrentSession();
      return { session };
    } catch (error: any) {
      console.error('Registration flow submission failed:', error);
      throw error;
    }
  }

  async getCurrentSession(): Promise<Session | null> {
    // Check for existing tokens in local storage first
    const accessToken = localStorage.getItem('kidato_access_token');
    const refreshToken = localStorage.getItem('kidato_refresh_token');
    const storedUser = localStorage.getItem('kidato_user');

    if (accessToken && refreshToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Construct a mock Ory session from local storage data
        // This assumes the local storage user object has enough info
        // to mimic an Ory session for the purpose of AuthContext
        return {
          id: 'local-session', // A dummy ID for local session
          active: true,
          authenticated_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hour from now
          issued_at: new Date().toISOString(),
          identity: {
            id: user.id,
            schema_id: 'default',
            schema_url: '',
            traits: {
              email: user.email,
              name: {
                first: user.fullName.split(' ')[0] || '',
                last: user.fullName.split(' ').slice(1).join(' ') || '',
              },
              role: user.role,
            },
            metadata_public: user.metadata || {},
            verifiable_addresses: [{
              id: 'email-address',
              value: user.email,
              verified: user.verified || false,
              via: 'email',
              status: 'completed',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }],
          },
        } as Session;
      } catch (e) {
        console.error('Error parsing stored user from local storage:', e);
        // Clear corrupted data and proceed to Ory API call
        localStorage.removeItem('kidato_user');
        localStorage.removeItem('kidato_access_token');
        localStorage.removeItem('kidato_refresh_token');
      }
    }

    // If no valid tokens in local storage, proceed with Ory API call
    try {
      const response = await fetch(`${this.oryProxyUrl}/sessions/whoami`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        // 401 is expected if no session
        if (response.status === 401) {
          console.log('No Ory session found (401)');
          return null;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch session with status ${response.status}`);
      }
      
      const sessionData = await response.json();
      return sessionData;
    } catch (error) {
      console.error('Error fetching current session from Ory:', error);
      // If Ory session fails, clear any potentially stale local storage data
      localStorage.removeItem('kidato_user');
      localStorage.removeItem('kidato_access_token');
      localStorage.removeItem('kidato_refresh_token');
      return null;
    }
  }

  async logout() {
    try {
      // Clear local storage immediately
      this.clearLocalSession();

      // Initialize logout flow
      const response = await fetch(`${this.oryProxyUrl}/self-service/logout/browser`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const logoutFlow = await response.json();
        // Perform server-side logout
        if (logoutFlow.logout_url) {
          await fetch(logoutFlow.logout_url, {
            method: 'GET',
            credentials: 'include',
          });
        }
      }
      
      // Force clear any remaining session data
      this.clearLocalSession();
      
      // Navigate to login page after clearing everything
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local session and redirect
      this.clearLocalSession();
      window.location.href = '/login';
    }
  }

  private clearLocalSession() {
    // Clear all authentication-related localStorage items
    localStorage.removeItem('kidato_user');
    localStorage.removeItem('kidato_access_token');
    localStorage.removeItem('kidato_refresh_token');
    
    // Clear any other session-related items
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('kidato_') || key.startsWith('ory_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Clear sessionStorage as well
    const sessionKeysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.startsWith('kidato_') || key.startsWith('ory_'))) {
        sessionKeysToRemove.push(key);
      }
    }
    sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
  }

  async initializeRecoveryFlow(): Promise<any> {
    try {
      const response = await fetch(`${this.oryProxyUrl}/self-service/recovery/browser`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to initialize recovery flow with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to initialize recovery flow:', error);
      throw error;
    }
  }

  async submitRecoveryFlow(flowId: string, email: string) {
    try {
      const response = await fetch(`${this.oryProxyUrl}/self-service/recovery?flow=${flowId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: new URLSearchParams({ method: 'link', email }).toString(),
      });

      const result = await response.json();
      if (!response.ok) {
        if (response.status === 400 && result.ui) {
          // Throw error with the UI data so the form can handle it
          const error = new Error('Validation failed');
          (error as any).ui = result.ui;
          (error as any).response = { data: result };
          throw error;
        }
        throw new Error(result.message || `Recovery submission failed with status ${response.status}`);
      }
      return result;
    } catch (error) {
      console.error('Recovery flow submission failed:', error);
      throw error;
    }
  }

  async initializeVerificationFlow(): Promise<any> {
    try {
      const response = await fetch(`${this.oryProxyUrl}/self-service/verification/browser`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to initialize verification flow with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to initialize verification flow:', error);
      throw error;
    }
  }

  async submitVerificationFlow(flowId: string, email: string) {
    try {
      const response = await fetch(`${this.oryProxyUrl}/self-service/verification?flow=${flowId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: new URLSearchParams({ method: 'link', email }).toString(),
      });

      const result = await response.json();
      if (!response.ok) {
        if (response.status === 400 && result.ui) {
          return result;
        }
        throw new Error(result.message || `Verification submission failed with status ${response.status}`);
      }
      return result;
    } catch (error) {
      console.error('Verification flow submission failed:', error);
      throw error;
    }
  }

  async initializeSettingsFlow(): Promise<any> {
    try {
      const response = await fetch(`${this.oryProxyUrl}/self-service/settings/browser`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to initialize settings flow with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to initialize settings flow:', error);
      throw error;
    }
  }

  async submitSettingsFlow(flowId: string, method: string, values: Record<string, any>) {
    try {
      const body = new URLSearchParams({ method, ...values }).toString();
      const response = await fetch(`${this.oryProxyUrl}/self-service/settings?flow=${flowId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: body,
      });

      const result = await response.json();
      if (!response.ok) {
        if (response.status === 400 && result.ui) {
          return result;
        }
        throw new Error(result.message || `Settings submission failed with status ${response.status}`);
      }
      return result;
    } catch (error) {
      console.error('Settings flow submission failed:', error);
      throw error;
    }
  }

  // Enhanced login method with better error handling
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    try {
      // Attempt Ory login flow
      const flow = await this.initializeLoginFlow();
      const csrfToken = flow.ui.nodes.find(node => node.attributes.name === 'csrf_token')?.attributes.value;
      
      // submitLoginFlow now returns AuthResponse directly
      const authResponse = await this.submitLoginFlow(flow.id, {
        identifier: credentials.email,
        password: credentials.password,
        csrf_token: csrfToken,
        method: 'password',
      });

      // If submitLoginFlow returned data (either Ory or legacy success)
      if (authResponse.data) {
        // If it's an Ory session, set it
        const kidatoAccessToken = localStorage.getItem('kidato_access_token');
        const storedUser = localStorage.getItem('kidato_user');
        const isLegacyUser = storedUser ? JSON.parse(storedUser).legacy : false;
        console.log('kidatoAccessToken', kidatoAccessToken);
        console.log('storedUser', storedUser);
        if (authResponse.data.session && !isLegacyUser) {
          const session = authResponse.data.session;
          const backendUser = await this.getBackendUserByOryId(session.identity.id);
          this.setSession({ 
            user: { 
              id: backendUser?.user?.id || session.identity.id, 
              email: session.identity.traits.email, 
              fullName: `${session.identity.traits.name.first} ${session.identity.traits.name.last}`, 
              role: session.identity.traits.role,
              teacherId: backendUser?.user?.teacherId,
              studentId: backendUser?.user?.studentId,
              parentId: backendUser?.user?.parentId,
            }, 
            token: backendUser?.accessToken || '', // Assuming token is required for session
            refreshToken: backendUser?.refreshToken || '', // Assuming refreshToken is required
            expiresAt: this.calculateExpiryTime(24), // Assuming 24 hour token
          });
        } else if (authResponse.data.accessToken && authResponse.data.refreshToken && authResponse.data.user) {
          // If it's a legacy login response, set session based on that
          this.setSession({
            user: authResponse.data.user,
            token: authResponse.data.accessToken,
            refreshToken: authResponse.data.refreshToken,
            expiresAt: this.calculateExpiryTime(24),
          });
        }
        return authResponse; // Return the successful AuthResponse
      }

      throw new Error('Login failed: No session or user data returned.');
    } catch (error: any) {
      console.error('Login error:', error);
      return { error };
    }
  }

  // Enhanced register method with better error handling
  async register(userData: {
    email: string;
    password: string;
    fullName: string;
    role: string;
  }): Promise<AuthResponse> {
    try {
      const flow = await this.initializeRegistrationFlow();
      const csrfToken = flow.ui.nodes.find(node => node.attributes.name === 'csrf_token')?.attributes.value;
      const result = await this.submitRegistrationFlow(flow.id, {
        'traits.email': userData.email,
        password: userData.password,
        'traits.name.first': userData.fullName.split(' ')[0],
        'traits.name.last': userData.fullName.split(' ').slice(1).join(' '),
        'traits.role': userData.role,
        csrf_token: csrfToken,
        method: 'password',
      });

      const session = await this.getCurrentSession();
      if (session) {
        // Get backend user to include role-specific IDs
        const backendUser = await this.createBackendUserFromOry(session);
        return { 
          data: { 
            user: { 
              id: backendUser?.user?.id || session.identity.id, 
              email: session.identity.traits.email, 
              fullName: `${session.identity.traits.name.first} ${session.identity.traits.name.last}`, 
              role: session.identity.traits.role,
              teacherId: backendUser?.user?.teacherId,
              studentId: backendUser?.user?.studentId,
              parentId: backendUser?.user?.parentId,
            }, 
            session: session,
            accessToken: backendUser?.accessToken,
            refreshToken: backendUser?.refreshToken,
          } 
        };
      }

      throw new Error('No session returned from registration');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.response?.data?.ui) {
        return error.response.data;
      }
      return { error };
    }
  }

  // Legacy API endpoints for backward compatibility
  async loginLegacy(email: string, password: string) {
    try {
      const response = await axios.post(`${this.baseUrl}/auth/login`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async registerLegacy(data: {
    email: string;
    password: string;
    fullName: string;
    role: string;
  }) {
    try {
      const response = await axios.post(`${this.baseUrl}/auth/register`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Backend user management for Ory integration
  async getBackendUserByOryId(oryIdentityId: string) {
    try {
      console.log('Fetching backend user by Ory ID:', oryIdentityId);
      // Use axios directly with credentials to include Ory session cookies
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/by-ory-id/${oryIdentityId}`,
        {
          withCredentials: true, // Include session cookies
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      // If we get tokens, persist them for legacy API compatibility
      return response.data;
    } catch (error) {
      console.error('Error fetching backend user by Ory ID:', error);
      return null;
    }
  }

  async createBackendUserFromOry(session: Session) {
    try {
      // Use axios directly with credentials to include Ory session cookies
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/from-ory`,
        {
          oryIdentityId: session.identity.id,
          email: session.identity.traits.email,
          fullName: `${session.identity.traits.name.first} ${session.identity.traits.name.last}`,
          role: session.identity.traits.role,
        },
        {
          withCredentials: true, // Include session cookies
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating backend user from Ory:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
