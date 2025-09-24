import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { authService } from '@/services/auth.service';

interface VerificationFlow {
  id: string;
  ui: {
    nodes: any[];
    action: string;
    method: string;
    messages?: any[];
  };
  state: string;
}

export const OryVerificationForm: React.FC = () => {
  const [flow, setFlow] = useState<VerificationFlow | null>(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [flowError, setFlowError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flow');
  const code = searchParams.get('code');

  useEffect(() => {
    if (flowId) {
      // If we have a flow ID from URL params (from email link), handle verification
      handleVerificationFromEmail();
    } else {
      // Otherwise, initialize a new verification flow
      initializeFlow();
    }
  }, [flowId]);

  const handleVerificationFromEmail = async () => {
    try {
      setIsLoading(true);
      // This handles the verification when user clicks the link in their email
      // The Ory verification flow should complete automatically with the flow ID
      const response = await fetch(`${authService.oryProxyUrl}/self-service/verification?flow=${flowId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });

      const verificationFlow = await response.json();

      if (verificationFlow.state === 'passed_challenge') {
        setIsVerified(true);
        toast({
          title: 'Email verified!',
          description: 'Your email has been successfully verified.',
        });
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setFlow(verificationFlow);
      }
    } catch (error: any) {
      console.error('Verification from email failed:', error);
      setFlowError('Verification failed. Please try again.');
      initializeFlow(); // Fallback to manual verification
    } finally {
      setIsLoading(false);
    }
  };

  const initializeFlow = async () => {
    try {
      setIsLoading(true);
      const verificationFlow = await authService.initializeVerificationFlow();
      setFlow(verificationFlow);
      setFlowError('');
    } catch (error: any) {
      console.error('Failed to initialize verification flow:', error);
      setFlowError('Failed to initialize verification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!flow) {
      setFlowError('Verification flow not initialized. Please refresh the page.');
      return;
    }

    if (!email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await authService.submitVerificationFlow(flow.id, email);

      if (result.ui?.messages?.some((msg: any) => msg.type === 'success')) {
        setVerificationSent(true);
        toast({
          title: 'Verification email sent!',
          description: 'Please check your email and click the verification link.',
        });
      } else if (result.ui) {
        // Handle errors from the flow
        const fieldErrors: any = {};
        result.ui.nodes.forEach((node: any) => {
          if (node.messages?.length > 0) {
            const fieldName = node.attributes?.name || 'email';
            fieldErrors[fieldName] = node.messages[0].text;
          }
        });
        setErrors(fieldErrors);

        if (result.ui.messages?.length > 0) {
          const errorMessage = result.ui.messages
            .filter((msg: any) => msg.type === 'error')
            .map((msg: any) => msg.text)
            .join('. ');
          if (errorMessage) {
            setFlowError(errorMessage);
          }
        }
      }
    } catch (error: any) {
      console.error('Verification submission failed:', error);
      setFlowError(error.message || 'Verification failed. Please try again.');
      toast({
        title: 'Verification failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (email) {
      await handleSubmitVerification(new Event('submit') as any);
    }
  };

  if (isVerified) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">Email Verified!</CardTitle>
          <CardDescription>
            Your email has been successfully verified. You will be redirected to login shortly.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            onClick={() => navigate('/login')} 
            className="w-full bg-kidato-purple hover:bg-kidato-dark-blue"
          >
            Continue to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (verificationSent) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to <strong>{email}</strong>. 
            Please check your email and click the link to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-gray-600">
            Didn't receive the email? Check your spam folder or
          </div>
          <Button
            variant="outline"
            onClick={handleResendEmail}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Sending...' : 'Resend verification email'}
          </Button>
          <Button
            variant="link"
            onClick={() => navigate('/login')}
            className="w-full"
          >
            Back to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!flow && !flowError) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kidato-purple"></div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
        <CardDescription>
          Enter your email address to receive a verification link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitVerification} className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${errors.email ? 'border-red-500' : ''}`}
              disabled={isLoading}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-kidato-purple hover:bg-kidato-dark-blue"
            disabled={isLoading || !flow}
          >
            {isLoading ? 'Sending...' : 'Send verification email'}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={() => navigate('/login')}
              className="text-sm"
            >
              Back to Login
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};