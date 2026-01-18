import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { authService } from '@/services/auth.service';

export const OAuthCallbackPage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string>('');
  const [provider, setProvider] = useState<string>('OAuth');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    try {
      setIsProcessing(true);

      // Check if there's an error from OAuth provider
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (error) {
        setError(errorDescription || 'OAuth authentication failed');
        setIsProcessing(false);
        return;
      }

      // Get the current session (which should be set by Ory after OAuth completion)
      const session = await authService.getCurrentSession();

      if (!session) {
        throw new Error('No session found after OAuth completion');
      }

      // Detect the provider from session or stored state
      const storedFlowType = sessionStorage.getItem('kidato_oauth_flow_type');
      const traits = session.identity.traits;

      // Determine provider based on traits
      let detectedProvider = 'OAuth';
      if (traits.linkedin_id || traits.picture?.includes('linkedin')) {
        detectedProvider = 'LinkedIn';
        setProvider('LinkedIn');
      } else {
        detectedProvider = 'Google';
        setProvider('Google');
      }

      // Check if user exists in backend, if not create one
      let backendUser;
      try {
        backendUser = await authService.getBackendUserByOryId(session.identity.id);
      } catch (e) {
        // User doesn't exist, create one based on provider
        if (detectedProvider === 'LinkedIn') {
          backendUser = await authService.createBackendUserFromLinkedIn(session, {
            email: traits.email,
            firstName: traits.name?.first || '',
            lastName: traits.name?.last || '',
            profilePicture: traits.picture || null,
            linkedInId: traits.linkedin_id || session.identity.id,
            role: traits.role || 'parent',
          });
        } else {
          backendUser = await authService.createBackendUserFromOry(session);
        }
      }

      if (backendUser) {
        toast({
          title: 'Welcome!',
          description: `You have successfully signed in with ${detectedProvider}.`,
        });

        // Clear any stored OAuth data
        sessionStorage.removeItem('kidato_post_oauth_redirect');
        sessionStorage.removeItem('kidato_oauth_flow_type');

        // Always redirect to /dashboard - the RoleBasedDashboardRouter will handle
        // routing to the appropriate dashboard based on user role
        navigate('/dashboard');
      } else {
        throw new Error('Failed to create or retrieve user account');
      }
    } catch (error: any) {
      console.error('OAuth callback error:', error);
      setError(error.message || 'Authentication failed');
      toast({
        title: 'Authentication failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    const postOAuthRedirect = sessionStorage.getItem('kidato_post_oauth_redirect');
    if (postOAuthRedirect && postOAuthRedirect.includes('/signup')) {
      navigate('/signup');
    } else {
      navigate('/login');
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Processing Authentication</CardTitle>
            <CardDescription>
              Please wait while we complete your sign in...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-kidato-purple" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Authentication Failed</CardTitle>
            <CardDescription>
              There was an issue completing your authentication.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>

            <div className="flex flex-col space-y-2">
              <Button
                onClick={handleRetry}
                className="w-full bg-kidato-purple hover:bg-kidato-dark-blue"
              >
                Try Again
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
              >
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};