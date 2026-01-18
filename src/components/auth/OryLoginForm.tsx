import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { authService } from '@/services/auth.service';
import { LoginFlow } from '@ory/client-fetch';
import { GoogleIcon } from '@/components/ui/icons';
import { LinkedInLoginButton } from './LinkedInLoginButton';

interface OryLoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export const OryLoginForm: React.FC<OryLoginFormProps> = ({ onSuccess, redirectTo }) => {
  const [flow, setFlow] = useState<LoginFlow | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [flowError, setFlowError] = useState('');
  const [prefilledFields, setPrefilledFields] = useState<Set<string>>(new Set());
  const [isAccountLinking, setIsAccountLinking] = useState(false); // For Google account linking flow
  const hasInitialized = useRef(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to get OAuth providers from the login flow
  const getOAuthProviders = () => {
    if (!flow) return [];
    // Look for OAuth/OIDC provider nodes in the oidc group
    return flow.ui.nodes.filter(node =>
      node.group === 'oidc' &&
      node.type === 'input' &&
      node.attributes.type === 'submit'
    );
  };

  // Handle OAuth provider login (Google, etc.)
  const handleOAuthLogin = async (provider: string) => {
    if (!flow) {
      setFlowError('Login flow not initialized. Please refresh the page.');
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // For OAuth providers, we need to find the specific provider node and submit it
      const providerNode = flow.ui.nodes.find(node =>
        node.group === 'oidc' &&
        node.attributes.value === provider
      );

      if (!providerNode) {
        // If provider not configured in Ory, try the correct OAuth endpoint structure
        const googleAuthUrl = `${authService.oryProxyUrl}/self-service/login/browser?flow=${flow.id}&provider=${provider}`;
        window.location.href = googleAuthUrl;
        return;
      }

      // Extract CSRF token from flow
      const csrfToken = flow.ui.nodes.find(node => node.attributes.name === 'csrf_token')?.attributes.value;

      // Submit the OAuth login using the provider node's attributes
      const formData = new URLSearchParams();
      formData.append('method', 'oidc');
      formData.append('provider', provider);
      if (csrfToken) {
        formData.append('csrf_token', csrfToken);
      }

      const response = await fetch(`${authService.oryProxyUrl || 'http://localhost:4000'}/self-service/login?flow=${flow.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: formData.toString(),
      });

      const result = await response.json();
      console.log('OAuth login result:', result);

      // Handle OAuth redirect (this is the normal flow)
      if (result.redirect_browser_to) {
        // Don't store return URL - let OAuth callback handle routing via /dashboard
        // This prevents existing users from being redirected to signup
        sessionStorage.removeItem('kidato_post_oauth_redirect');
        console.log('Redirecting to OAuth provider:', result.redirect_browser_to);
        window.location.href = result.redirect_browser_to;
        return;
      }

      // If we get a session directly (shouldn't happen with OAuth)
      if (result.session) {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in with Google.',
        });

        const userRole = result.session?.identity?.traits?.role || result.user?.role;
        if (userRole === 'teacher') {
          window.location.href = '/teacher-dashboard';
        } else if (userRole === 'student') {
          window.location.href = '/student-dashboard';
        } else if (userRole === 'parent') {
          window.location.href = '/parents-dashboard';
        } else {
          window.location.href = '/dashboard';
        }
      }

      // Handle flow errors
      if (result.ui) {
        const fieldErrors: any = {};
        result.ui.nodes.forEach((node: any) => {
          if (node.messages?.length > 0) {
            const fieldName = node.attributes?.name;
            if (fieldName) {
              fieldErrors[fieldName] = node.messages[0].text;
            }
          }
        });
        setErrors(fieldErrors);

        if (result.ui.messages) {
          const messages = result.ui.messages;
          const errorMessage = messages.map((msg: any) => msg.text).join('. ');
          setFlowError(errorMessage);
        }
      }
    } catch (error: any) {
      console.error('OAuth login error:', error);
      setFlowError(error.message || 'OAuth login failed. Please try again.');
      toast({
        title: 'Login failed',
        description: error.message || 'OAuth login failed. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }
    hasInitialized.current = true;
    initializeFlow();
  }, []);

  const initializeFlow = async () => {
    try {
      setIsLoading(true);

      // Check if there's a flow ID in the URL (from Google OAuth redirect)
      const urlParams = new URLSearchParams(window.location.search);
      const flowId = urlParams.get('flow');

      let loginFlow: LoginFlow;

      if (flowId) {
        // If flow ID exists, fetch the existing flow with pre-filled data
        console.log('Found flow ID in URL, fetching flow data:', flowId);
        loginFlow = await authService.getLoginFlow(flowId);

        // Populate form with pre-filled data from Google OAuth
        populateFormFromFlow(loginFlow);
      } else {
        // Initialize new flow
        loginFlow = await authService.initializeLoginFlow();
      }

      setFlow(loginFlow);
      setFlowError('');

      // Clean up URL parameters after successful flow initialization
      if (flowId) {
        const url = new URL(window.location.href);
        url.searchParams.delete('flow');
        window.history.replaceState({}, document.title, url.pathname + url.search);
      }

    } catch (error: any) {
      console.error('Failed to initialize login flow:', error);
      setFlowError('Failed to initialize login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to populate form with pre-filled data from OAuth
  const populateFormFromFlow = (flow: LoginFlow) => {
    if (!flow.ui.nodes) return;

    const prefilled = new Set<string>();
    let hasPrefilledData = false;
    let isAccountLinkingFlow = false;

    // Check if this is an account linking flow (password field is present)
    const hasPasswordField = flow.ui.nodes.some(
      node => node.attributes?.name === 'password' && node.group === 'password'
    );

    // Check for OIDC link message in the flow
    const hasLinkMessage = flow.ui.messages?.some(
      msg => msg.text?.toLowerCase().includes('link') ||
        msg.text?.toLowerCase().includes('existing')
    );

    flow.ui.nodes.forEach(node => {
      if (node.attributes && node.attributes.value) {
        const fieldName = node.attributes.name;
        const fieldValue = node.attributes.value;

        switch (fieldName) {
          case 'identifier':
            setEmail(fieldValue);
            prefilled.add('email');
            hasPrefilledData = true;
            console.log('Pre-filled email from Google:', fieldValue);
            break;
        }
      }
    });

    // Determine if this is account linking (existing user needs to enter password)
    isAccountLinkingFlow = hasPrefilledData && hasPasswordField;

    if (hasPrefilledData) {
      setPrefilledFields(prefilled);
      console.log('Login form populated with Google OAuth data');
      console.log('Is account linking flow:', isAccountLinkingFlow);

      if (isAccountLinkingFlow) {
        // This is an account linking flow - user needs to enter password
        // Don't auto-submit, show helpful message instead
        setIsAccountLinking(true);
        setFlowError('');
        toast({
          title: 'Link your Google account',
          description: 'An account with this email already exists. Enter your password to link your Google account for easier sign-in next time.',
          duration: 8000,
        });
      } else {
        setIsAccountLinking(false);
        // No password required - this might be a new user or already linked account
        // Try auto-submit for seamless login
        setTimeout(() => {
          handleOAuthAutoLogin(flow);
        }, 1000);
      }
    }
  };

  // Auto-submit login for OAuth flows with pre-filled data
  const handleOAuthAutoLogin = async (flow: LoginFlow) => {
    if (!prefilledFields.has('email') || isLoading) return;

    console.log('Auto-submitting OAuth login with pre-filled email');
    setIsLoading(true);

    try {
      const csrfToken = flow.ui.nodes.find(node => node.attributes.name === 'csrf_token')?.attributes.value;

      const result = await authService.submitLoginFlow(flow.id, {
        identifier: email,
        csrf_token: csrfToken,
        method: 'oidc',
      });

      console.log('Auto-login result:', result);

      if (result.data.session || result.data.legacy) {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in with Google.',
        });

        // Handle role-based redirection
        const userRole = result.data.session?.identity?.traits?.role || result.data.user?.role;
        console.log('User role from OAuth auto-login:', userRole);

        if (userRole === 'teacher') {
          window.location.href = '/teacher-dashboard';
        } else if (userRole === 'student') {
          window.location.href = '/student-dashboard';
        } else if (userRole === 'parent') {
          window.location.href = '/parents-dashboard';
        } else {
          window.location.href = '/dashboard';
        }
      }
    } catch (error: any) {
      console.error('OAuth auto-login failed:', error);
      // If auto-login fails, user can still enter password manually
      setFlowError('Automatic login failed. Please enter your password to continue.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!flow) {
      setFlowError('Login flow not initialized. Please refresh the page.');
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Extract CSRF token from flow
      const csrfToken = flow.ui.nodes.find(node => node.attributes.name === 'csrf_token')?.attributes.value;

      const result = await authService.submitLoginFlow(flow.id, {
        identifier: email,
        password,
        csrf_token: csrfToken,
        method: 'password',
      });

      console.log('Login result:', result);
      console.log('Has session:', !!result.data.session);
      console.log('Has legacy:', !!result.data.legacy);
      if (result.data.session || result.data.legacy) {
        console.log('Login successful, showing toast and navigating...');
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });

        console.log('About to navigate to /dashboard');
        // Force a hard redirect to bypass React Router navigation issues

        // Handle role-based redirection
        const userRole = result.data.session?.identity?.traits?.role || result.data.user?.role;

        console.log('User role:', userRole);

        if (userRole === 'teacher') {
          window.location.href = '/teacher-dashboard';
        } else if (userRole === 'student') {
          window.location.href = '/student-dashboard';
        } else if (userRole === 'parent') {
          window.location.href = '/parents-dashboard';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        console.log('No session found in result:', result);
        throw new Error('Login failed - no session returned');
      }
    } catch (error: any) {
      console.error('Login error:', error);

      // Handle Ory validation errors from response
      if (error.response?.data?.ui) {
        const uiData = error.response.data.ui;

        // Handle field-specific errors
        if (uiData.nodes) {
          const fieldErrors: any = {};
          uiData.nodes.forEach((node: any) => {
            if (node.messages?.length > 0) {
              const fieldName = node.attributes?.name;
              if (fieldName) {
                fieldErrors[fieldName] = node.messages[0].text;
              }
            }
          });
          setErrors(fieldErrors);
        }

        // Handle general flow-level error messages
        if (uiData.messages?.length > 0) {
          const errorMessage = uiData.messages.map((msg: any) => msg.text).join('. ');
          setFlowError(errorMessage);
        }
      }
      // Handle direct error response (when Ory returns updated flow with errors)
      else if (error.ui?.messages) {
        const errorMessage = error.ui.messages.map((msg: any) => msg.text).join('. ');
        setFlowError(errorMessage);
      }
      // Handle field errors from direct error response
      else if (error.ui?.nodes) {
        const fieldErrors: any = {};
        error.ui.nodes.forEach((node: any) => {
          if (node.messages?.length > 0) {
            const fieldName = node.attributes?.name;
            if (fieldName) {
              fieldErrors[fieldName] = node.messages[0].text;
            }
          }
        });
        setErrors(fieldErrors);
      }
      // Fallback error handling
      else {
        setFlowError(error.message || 'Login failed. Please check your credentials.');
      }

      // Use the flow error message if available, otherwise use generic message
      const toastMessage = flowError || error.message || 'Please check your credentials and try again.';
      toast({
        title: 'Login failed',
        description: toastMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!flow && !flowError) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kidato-purple"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {flowError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {flowError}
            {flowError.includes('initialize') && (
              <Button
                variant="link"
                className="p-0 h-auto ml-2 text-destructive"
                onClick={initializeFlow}
                disabled={isLoading}
              >
                Try again
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="email">
          Email address
          {prefilledFields.has('email') && (
            <span className="text-xs text-green-600 ml-1">(from Google)</span>
          )}
        </Label>
        <div className="mt-1">
          <Input
            id="email"
            name="identifier"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`block w-full ${errors.identifier ? 'border-red-500' : ''} ${prefilledFields.has('email') ? 'bg-green-50 border-green-200' : ''}`}
            disabled={isLoading || prefilledFields.has('email')}
            readOnly={prefilledFields.has('email')}
          />
          {prefilledFields.has('email') && (
            <div className="mt-1">
              <p className="text-xs text-green-600">This email is verified through Google</p>
              {isLoading && (
                <p className="text-xs text-blue-600 mt-1 flex items-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                  Completing sign-in...
                </p>
              )}
            </div>
          )}
          {errors.identifier && (
            <p className="mt-1 text-sm text-red-600">{errors.identifier}</p>
          )}
        </div>
      </div>

      {/* Show password field if: not prefilled email OR this is account linking flow */}
      {(!prefilledFields.has('email') || isAccountLinking) && (
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">
              Password
              {isAccountLinking && (
                <span className="text-xs text-blue-600 ml-1">(to link your Google account)</span>
              )}
            </Label>
            <Button
              type="button"
              variant="link"
              className="text-sm font-medium text-kidato-purple hover:text-kidato-dark-blue p-0 h-auto"
              onClick={() => navigate('/auth/recovery')}
            >
              Forgot your password?
            </Button>
          </div>
          <div className="mt-1 relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`block w-full pr-10 ${errors.password ? 'border-red-500' : ''}`}
              disabled={isLoading}
              placeholder={isAccountLinking ? 'Enter your existing password' : ''}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
      )}

      {/* Show submit button if: not prefilled email OR this is account linking flow */}
      {(!prefilledFields.has('email') || isAccountLinking) && (
        <div>
          <Button
            type="submit"
            className="w-full bg-kidato-purple hover:bg-kidato-dark-blue"
            disabled={isLoading || !flow}
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </Button>
        </div>
      )}

      {/* OAuth Login Options */}
      {flow && !prefilledFields.has('email') && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="space-y-2">
            {getOAuthProviders().length > 0 ? (
              getOAuthProviders().map((provider) => {
                const providerName = provider.attributes.value;
                return (
                  <Button
                    key={providerName}
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOAuthLogin(providerName)}
                    disabled={isLoading}
                  >
                    {providerName.indexOf('google') !== -1 && <GoogleIcon className="mr-2 h-4 w-4" />}
                    Continue with {(providerName.charAt(0).toUpperCase() + providerName.slice(1)).split('-')[0]}
                  </Button>
                );
              })
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleOAuthLogin('google')}
                disabled={isLoading}
              >
                <GoogleIcon className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>
            )}

            {/* LinkedIn Login Button */}
            <LinkedInLoginButton mode="login" className="mt-2" />
          </div>
        </>
      )}
    </form>
  );
};
