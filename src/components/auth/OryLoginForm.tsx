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
        window.location.href = result.redirect_browser_to;
        return;
      }

      // If we get a session directly (shouldn't happen with OAuth)
      if (result.session || result.legacy) {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in with Google.',
        });
        
        setTimeout(() => {
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
        }, 300);
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
      // Remove return_to parameter temporarily until allowed URLs are configured
      const loginFlow = await authService.initializeLoginFlow();
      setFlow(loginFlow);
      setFlowError('');
      
      // Debug: Log the flow structure to understand OAuth providers
      console.log('Login flow UI nodes:', loginFlow.ui.nodes);
      console.log('Available OAuth providers:', loginFlow.ui.nodes.filter(node => 
        node.group === 'oidc' || node.attributes.name === 'provider'
      ));
    } catch (error: any) {
      console.error('Failed to initialize login flow:', error);
      setFlowError('Failed to initialize login. Please try again.');
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
      console.log('Has session:', !!result.session);
      console.log('Has legacy:', !!result.legacy);

      if (result.session || result.legacy) {
        console.log('Login successful, showing toast and navigating...');
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });
        
        console.log('About to navigate to /dashboard');
        // Force a hard redirect to bypass React Router navigation issues
        
        setTimeout(() => {
          // Handle role-based redirection
          const userRole = result.session?.identity?.traits?.role || result.user?.role;

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
          }, 300);
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
        <Label htmlFor="email">Email address</Label>
        <div className="mt-1">
          <Input
            id="email"
            name="identifier"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`block w-full ${errors.identifier ? 'border-red-500' : ''}`}
            disabled={isLoading}
          />
          {errors.identifier && (
            <p className="mt-1 text-sm text-red-600">{errors.identifier}</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
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

      <div>
        <Button
          type="submit"
          className="w-full bg-kidato-purple hover:bg-kidato-dark-blue"
          disabled={isLoading || !flow}
        >
          {isLoading ? 'Logging in...' : 'Log in'}
        </Button>
      </div>

      {/* Google OAuth Login */}
      {flow && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
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
        </>
      )}
    </form>
  );
};
