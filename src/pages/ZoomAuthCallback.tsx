import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { zoomService } from '@/integrations/api/services/zoom.service';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ZoomAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code || !state) {
          setStatus('error');
          setErrorMessage('Missing required parameters');
          return;
        }

        const { data, error } = await zoomService.handleOAuthCallback(code, state);

        if (error) {
          setStatus('error');
          setErrorMessage(error.message);
          return;
        }

        setStatus('success');

        // Show success toast
        toast({
          title: 'Success',
          description: 'Zoom account connected successfully',
        });

        // Redirect after a delay
        setTimeout(() => {
          navigate('/teacher-dashboard?zoom=connected');
        }, 3000);
      } catch (error) {
        console.error('Error handling Zoom callback:', error);
        setStatus('error');
        setErrorMessage('An unexpected error occurred');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img src="https://kidato-images.s3.eu-west-1.amazonaws.com/Zoom-Logo.png" alt="Zoom Logo" className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {status === 'processing' && 'Connecting your Zoom account'}
            {status === 'success' && 'Zoom account connected!'}
            {status === 'error' && 'Connection failed'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {status === 'processing' && 'Please wait while we connect your Zoom account...'}
            {status === 'success' && 'Your Zoom account has been successfully connected.'}
            {status === 'error' && errorMessage}
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          {status === 'processing' && (
            <div className="flex justify-center">
              <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {status === 'success' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-800">You will be redirected in a few seconds...</p>
              </div>
              <Button
                onClick={() => navigate('/teacher-dashboard?zoom=connected')}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Return to dashboard
              </Button>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-800">There was a problem connecting your Zoom account.</p>
              </div>
              <Button
                onClick={() => navigate('/teacher-dashboard?zoom=connected')}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Return to dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZoomAuthCallback;