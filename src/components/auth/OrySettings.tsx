import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from '../ui/use-toast';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/contexts/AuthContext';

interface SettingsFlow {
  id: string;
  ui: {
    nodes: any[];
    action: string;
    method: string;
    messages?: any[];
  };
}

const OrySettings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [flow, setFlow] = useState<SettingsFlow | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [flowError, setFlowError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    initializeFlow();
  }, []);

  const initializeFlow = async () => {
    try {
      setIsLoading(true);
      const settingsFlow = await authService.initializeSettingsFlow();
      setFlow(settingsFlow);
      setFlowError('');
    } catch (error: any) {
      console.error('Failed to initialize settings flow:', error);
      setFlowError('Failed to initialize settings. Please try again.');

      // If not authenticated, redirect to login
      if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
        toast({
          title: 'Session expired',
          description: 'Please log in again to change your password.',
          variant: 'destructive',
        });
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!flow) {
      setFlowError('Settings flow not initialized. Please refresh the page.');
      return;
    }

    // Client-side validation
    if (password.length < 8) {
      setErrors({ password: 'Password must be at least 8 characters' });
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      toast({
        title: 'Passwords do not match',
        description: 'Please ensure both password fields are the same.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setErrors({});
    setFlowError('');
    setSuccessMessage('');

    try {
      // Extract CSRF token from flow
      const csrfToken = flow.ui.nodes.find(node => node.attributes?.name === 'csrf_token')?.attributes?.value;

      // Submit the password change
      const result = await authService.submitSettingsFlow(flow.id, 'password', {
        password,
        csrf_token: csrfToken,
      });

      console.log('Password change result:', result);

      // Check if successful
      if (result.state === 'success' || !result.ui?.messages?.some((msg: any) => msg.type === 'error')) {
        setSuccessMessage('Password updated successfully!');
        toast({
          title: 'Success!',
          description: 'Your password has been updated successfully.',
        });

        // Clear the form
        setPassword('');
        setConfirmPassword('');

        // Re-initialize flow for next change
        setTimeout(() => {
          initializeFlow();
        }, 1000);
      } else {
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
            const messages = result.ui.messages.filter((msg: any) => msg.type === 'error');
            if (messages.length > 0) {
              const errorMessage = messages.map((msg: any) => msg.text).join('. ');
              setFlowError(errorMessage);
              toast({
                title: 'Failed to update password',
                description: errorMessage,
                variant: 'destructive',
              });
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Password change error:', error);

      const errorMessage = error.message || 'Failed to update password. Please try again.';
      setFlowError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!flow && !flowError) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kidato-purple"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Profile Information (Read-only for now) */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm text-gray-500">Full Name</Label>
            <p className="text-base font-medium">{user?.fullName || 'N/A'}</p>
          </div>
          <div>
            <Label className="text-sm text-gray-500">Email</Label>
            <p className="text-base font-medium">{user?.email || 'N/A'}</p>
          </div>
          <div>
            <Label className="text-sm text-gray-500">Role</Label>
            <p className="text-base font-medium capitalize">{user?.role || 'N/A'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          {flowError && (
            <Alert variant="destructive" className="mb-4">
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

          {successMessage && (
            <Alert className="mb-4 border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">New Password</Label>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors({ ...errors, password: '' });
                    }
                  }}
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
              <p className="mt-1 text-sm text-gray-500">
                Password must be at least 8 characters
              </p>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="mt-1 relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: '' });
                    }
                  }}
                  className={`block w-full pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-kidato-purple hover:bg-kidato-dark-blue"
              disabled={isLoading || !flow}
            >
              {isLoading ? 'Updating password...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrySettings;
