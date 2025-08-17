import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { authService } from '@/services/auth.service';
import { RecoveryFlow } from '@ory/client-fetch';

interface OryRecoveryFormProps {
  onSuccess?: () => void;
}

export const OryRecoveryForm: React.FC<OryRecoveryFormProps> = ({ onSuccess }) => {
  const [flow, setFlow] = useState<RecoveryFlow | null>(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [flowError, setFlowError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    initializeFlow();
  }, []);

  const initializeFlow = async () => {
    try {
      setIsLoading(true);
      const recoveryFlow = await authService.initializeRecoveryFlow();
      setFlow(recoveryFlow);
      setFlowError('');
    } catch (error: any) {
      console.error('Failed to initialize recovery flow:', error);
      setFlowError('Failed to initialize password recovery. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!flow) {
      setFlowError('Recovery flow not initialized. Please refresh the page.');
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Extract CSRF token from flow
      const csrfToken = flow.ui.nodes.find(node => node.attributes.name === 'csrf_token')?.attributes.value;
      
      // Use direct fetch API like login/registration to avoid SDK CSRF issues
      const response = await fetch(`${authService.oryProxyUrl}/self-service/recovery?flow=${flow.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: new URLSearchParams({
          method: 'link',
          email: email,
          csrf_token: csrfToken || ''
        }).toString(),
      });

      const result = await response.json();

      if (!response.ok) {
        // Ory returns 400 for validation errors, with the updated flow in the body
        if (response.status === 400 && result.ui) {
          // Handle the validation errors in the catch block
          const error = new Error('Validation failed');
          (error as any).ui = result.ui;
          (error as any).response = { data: result };
          throw error;
        }
        throw new Error(result.message || `Recovery submission failed with status ${response.status}`);
      }
      
      setSuccess(true);
      toast({
        title: 'Recovery email sent!',
        description: 'Please check your email for password recovery instructions.',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Recovery error:', error);
      
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
        setFlowError(error.message || 'Password recovery failed. Please try again.');
      }

      // Use the flow error message if available, otherwise use generic message
      const toastMessage = flowError || error.message || 'Please check your email address and try again.';
      toast({
        title: 'Recovery failed',
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

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Recovery email sent!
          </h3>
          <p className="text-gray-600">
            We've sent password recovery instructions to <strong>{email}</strong>.
            Please check your email and follow the instructions to reset your password.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => navigate('/login')}
            className="w-full bg-kidato-purple hover:bg-kidato-dark-blue"
          >
            Back to Login
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              setSuccess(false);
              setEmail('');
              initializeFlow();
            }}
            className="w-full"
          >
            Send another email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

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
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`block w-full ${errors.email ? 'border-red-500' : ''}`}
              disabled={isLoading}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
        </div>

        <div>
          <Button
            type="submit"
            className="w-full bg-kidato-purple hover:bg-kidato-dark-blue"
            disabled={isLoading || !flow}
          >
            {isLoading ? 'Sending...' : 'Send recovery email'}
          </Button>
        </div>
      </form>

      <div className="text-center">
        <Button
          variant="link"
          onClick={() => navigate('/login')}
          className="text-kidato-purple hover:text-kidato-dark-blue"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to login
        </Button>
      </div>
    </div>
  );
};
