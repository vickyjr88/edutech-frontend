import { ory } from '../config/ory';
import axios from 'axios';
import { LoginFlow, RegistrationFlow, Session } from '@ory/kratos-client';

interface AuthResponse {
  data?: {
    user: {
      id: string;
      email: string;
      fullName: string;
      role: string;
    };
    session?: Session;
    accessToken?: string;
    refreshToken?: string;
  };
  error?: Error;
}

class AuthService {
  private readonly baseUrl = import.meta.env.VITE_API_URL;

  async initializeLoginFlow(returnTo?: string): Promise<LoginFlow> {
    try {
      const { data: flow } = await ory.createNativeLoginFlow({
        returnTo,
      });
      return flow;
    } catch (error) {
      console.error('Failed to initialize login flow:', error);
      throw error;
    }
  }

  async initializeRegistrationFlow(returnTo?: string): Promise<RegistrationFlow> {
    try {
      const { data: flow } = await ory.createNativeRegistrationFlow({
        returnTo,
      });
      return flow;
    } catch (error) {
      console.error('Failed to initialize registration flow:', error);
      throw error;
    }
  }

  async submitLoginFlow(flowId: string, values: Record<string, any>) {
    try {
      const { data } = await ory.updateLoginFlow({
        flow: flowId,
        updateLoginFlowBody: {
          method: 'password',
          identifier: values.identifier || values.email,
          password: values.password,
        },
      });
      return data;
    } catch (error: any) {
      console.error('Login flow submission failed:', error);
      // If Ory login fails, fallback to legacy
      if (values.email && values.password) {
        try {
          const legacyResponse = await this.loginLegacy(values.email, values.password);
          return {
            session: {
              identity: {
                id: legacyResponse.user.id,
                traits: {
                  email: legacyResponse.user.email,
                  name: {
                    first: legacyResponse.user.fullName.split(' ')[0],
                    last: legacyResponse.user.fullName.split(' ').slice(1).join(' '),
                  },
                  role: legacyResponse.user.role,
                },
              },
            },
            legacy: true,
            ...legacyResponse,
          };
        } catch (legacyError) {
          console.error('Legacy login also failed:', legacyError);
          throw error;
        }
      }
      throw error;
    }
  }

  async submitRegistrationFlow(flowId: string, values: Record<string, any>) {
    try {
      const { data } = await ory.updateRegistrationFlow({
        flow: flowId,
        updateRegistrationFlowBody: {
          method: 'password',
          password: values.password,
          traits: {
            email: values['traits.email'] || values.email,
            name: {
              first: values['traits.name.first'] || values.fullName?.split(' ')[0] || '',
              last: values['traits.name.last'] || values.fullName?.split(' ').slice(1).join(' ') || '',
            },
            role: values['traits.role'] || values.role || 'student',
          },
        },
      });
      return data;
    } catch (error: any) {
      console.error('Registration flow submission failed:', error);
      // If Ory registration fails, fallback to legacy
      if (values.email && values.password && values.fullName) {
        try {
          const legacyResponse = await this.registerLegacy({
            email: values['traits.email'] || values.email,
            password: values.password,
            fullName: values.fullName || `${values['traits.name.first']} ${values['traits.name.last']}`,
            role: values['traits.role'] || values.role || 'student',
          });
          return {
            session: {
              identity: {
                id: legacyResponse.user.id,
                traits: {
                  email: legacyResponse.user.email,
                  name: {
                    first: legacyResponse.user.fullName.split(' ')[0],
                    last: legacyResponse.user.fullName.split(' ').slice(1).join(' '),
                  },
                  role: legacyResponse.user.role,
                },
              },
            },
            legacy: true,
            ...legacyResponse,
          };
        } catch (legacyError) {
          console.error('Legacy registration also failed:', legacyError);
          throw error;
        }
      }
      throw error;
    }
  }

  async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: session } = await ory.toSession();
      return session;
    } catch (error) {
      console.log('No active session found');
      return null;
    }
  }

  async logout() {
    try {
      const { data } = await ory.createSelfServiceLogoutFlowUrlForBrowsers();
      window.location.href = data.logout_url;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  async initializeRecoveryFlow(): Promise<any> {
    try {
      const { data: flow } = await ory.createNativeRecoveryFlow();
      return flow;
    } catch (error) {
      console.error('Failed to initialize recovery flow:', error);
      throw error;
    }
  }

  async submitRecoveryFlow(flowId: string, email: string) {
    try {
      const { data } = await ory.updateRecoveryFlow({
        flow: flowId,
        updateRecoveryFlowBody: {
          method: 'link',
          email,
        },
      });
      return data;
    } catch (error) {
      console.error('Recovery flow submission failed:', error);
      throw error;
    }
  }

  async initializeVerificationFlow(): Promise<any> {
    try {
      const { data: flow } = await ory.createNativeVerificationFlow();
      return flow;
    } catch (error) {
      console.error('Failed to initialize verification flow:', error);
      throw error;
    }
  }

  async submitVerificationFlow(flowId: string, email: string) {
    try {
      const { data } = await ory.updateVerificationFlow({
        flow: flowId,
        updateVerificationFlowBody: {
          method: 'link',
          email,
        },
      });
      return data;
    } catch (error) {
      console.error('Verification flow submission failed:', error);
      throw error;
    }
  }

  async initializeSettingsFlow(): Promise<any> {
    try {
      const { data: flow } = await ory.createNativeSettingsFlow();
      return flow;
    } catch (error) {
      console.error('Failed to initialize settings flow:', error);
      throw error;
    }
  }

  async submitSettingsFlow(flowId: string, method: string, values: Record<string, any>) {
    try {
      const { data } = await ory.updateSettingsFlow({
        flow: flowId,
        updateSettingsFlowBody: {
          method,
          ...values,
        },
      });
      return data;
    } catch (error) {
      console.error('Settings flow submission failed:', error);
      throw error;
    }
  }

  // Enhanced login method with better error handling
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    try {
      // Try Ory first
      const flow = await this.initializeLoginFlow();
      const result = await this.submitLoginFlow(flow.id, {
        identifier: credentials.email,
        password: credentials.password,
      });

      if (result.session) {
        return {
          data: {
            user: {
              id: result.session.identity.id,
              email: result.session.identity.traits.email,
              fullName: `${result.session.identity.traits.name.first} ${result.session.identity.traits.name.last}`,
              role: result.session.identity.traits.role,
            },
            session: result.session,
          },
        };
      }

      throw new Error('No session returned from login');
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
      // Try Ory first
      const flow = await this.initializeRegistrationFlow();
      const result = await this.submitRegistrationFlow(flow.id, {
        'traits.email': userData.email,
        password: userData.password,
        'traits.name.first': userData.fullName.split(' ')[0],
        'traits.name.last': userData.fullName.split(' ').slice(1).join(' '),
        'traits.role': userData.role,
      });

      if (result.session) {
        return {
          data: {
            user: {
              id: result.session.identity.id,
              email: result.session.identity.traits.email,
              fullName: `${result.session.identity.traits.name.first} ${result.session.identity.traits.name.last}`,
              role: result.session.identity.traits.role,
            },
            session: result.session,
          },
        };
      }

      throw new Error('No session returned from registration');
    } catch (error: any) {
      console.error('Registration error:', error);
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
}

export const authService = new AuthService();
