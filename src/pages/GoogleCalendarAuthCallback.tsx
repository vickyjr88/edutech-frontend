import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { googleCalendarService } from '@/integrations/api/services/google-calendar.service';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const GoogleCalendarAuthCallback: React.FC = () => {
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

        const { data, error } = await googleCalendarService.handleOAuthCallback(code, state);

        if (error) {
          setStatus('error');
          setErrorMessage(error.message);
          return;
        }

        setStatus('success');

        // Show success toast
        toast({
          title: 'Success',
          description: 'Google Calendar connected successfully',
        });

        // Redirect after a delay
        setTimeout(() => {
          navigate('/teacher-dashboard?calendar=connected');
        }, 3000);
      } catch (error) {
        console.error('Error handling Google Calendar callback:', error);
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
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <svg className="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {status === 'processing' && 'Connecting your Google Calendar'}
            {status === 'success' && 'Google Calendar connected!'}
            {status === 'error' && 'Connection failed'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {status === 'processing' && 'Please wait while we connect your Google Calendar...'}
            {status === 'success' && 'Your Google Calendar has been successfully connected.'}
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
                onClick={() => navigate('/teacher-dashboard?calendar=connected')}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Return to dashboard
              </Button>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-800">There was a problem connecting your Google Calendar.</p>
              </div>
              <Button
                onClick={() => navigate('/teacher-dashboard?calendar=connected')}
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

export default GoogleCalendarAuthCallback;