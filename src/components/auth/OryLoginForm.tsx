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

      if (result.session || result.legacy) {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });

        if (onSuccess) {
          onSuccess();
        } else {
          // Handle role-based redirection
          const userRole = result.session?.identity?.traits?.role || result.user?.role;
          
          if (userRole === 'teacher') {
            navigate('/teacher-dashboard');
          } else if (userRole === 'student') {
            navigate('/student-dashboard');
          } else if (userRole === 'parent') {
            navigate('/parents-dashboard');
          } else {
            navigate('/dashboard');
          }
        }
      } else {
        throw new Error('Login failed - no session returned');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle Ory validation errors
      if (error.response?.data?.ui?.nodes) {
        const fieldErrors: any = {};
        error.response.data.ui.nodes.forEach((node: any) => {
          if (node.messages?.length > 0) {
            const fieldName = node.attributes?.name;
            if (fieldName) {
              fieldErrors[fieldName] = node.messages[0].text;
            }
          }
        });
        setErrors(fieldErrors);
      }

      // Handle generic error messages
      if (error.response?.data?.ui?.messages) {
        const messages = error.response.data.ui.messages;
        const errorMessage = messages.map((msg: any) => msg.text).join('. ');
        setFlowError(errorMessage);
      } else {
        setFlowError(error.message || 'Login failed. Please check your credentials.');
      }

      toast({
        title: 'Login failed',
        description: error.message || 'Please check your credentials and try again.',
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
    </form>
  );
};
