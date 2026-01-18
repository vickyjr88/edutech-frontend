import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { authService } from '@/services/auth.service';
import { RegistrationFlow } from '@ory/client-fetch';
import { GoogleIcon } from '@/components/ui/icons';
import { LinkedInLoginButton } from './LinkedInLoginButton';

interface OryRegistrationFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
  defaultRole?: 'teacher' | 'student' | 'parent';
}

export const OryRegistrationForm: React.FC<OryRegistrationFormProps> = ({ onSuccess, redirectTo, defaultRole }) => {
  const [flow, setFlow] = useState<RegistrationFlow | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: defaultRole || '',  // Use defaultRole if provided
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [flowError, setFlowError] = useState('');
  const [prefilledFields, setPrefilledFields] = useState<Set<string>>(new Set());
  const [isGoogleOAuthFlow, setIsGoogleOAuthFlow] = useState(false);  // Track if this is a Google OAuth signup
  const [rolePreselected, setRolePreselected] = useState(!!defaultRole);  // Track if role was preselected via URL

  const navigate = useNavigate();

  // Update form data when defaultRole changes
  useEffect(() => {
    if (defaultRole) {
      setFormData(prev => ({ ...prev, role: defaultRole }));
      setRolePreselected(true);
    }
  }, [defaultRole]);

  // Helper function to get OAuth providers from the registration flow
  const getOAuthProviders = () => {
    if (!flow) return [];
    return flow.ui.nodes.filter(node =>
      node.group === 'oidc' &&
      node.type === 'input' &&
      node.attributes.type === 'submit'
    );
  };

  // Handle OAuth provider registration (Google, etc.)
  const handleOAuthSignup = async (provider: string) => {
    if (!flow) {
      setFlowError('Registration flow not initialized. Please refresh the page.');
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Extract CSRF token from flow
      const csrfToken = flow.ui.nodes.find(node => node.attributes.name === 'csrf_token')?.attributes.value;

      // Submit the OAuth registration using direct fetch
      const formData = new URLSearchParams();
      formData.append('method', 'oidc');
      formData.append('provider', provider);
      if (csrfToken) {
        formData.append('csrf_token', csrfToken);
      }

      const response = await fetch(`${authService.oryProxyUrl}/self-service/registration?flow=${flow.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: formData.toString(),
      });

      const result = await response.json();
      console.log('OAuth registration result:', result);

      // Handle OAuth redirect (this is the normal flow)
      if (result.redirect_browser_to) {
        // Don't store return URL - let OAuth callback handle routing via /dashboard
        // This allows Ory to determine if user exists (login) or is new (signup)
        sessionStorage.removeItem('kidato_post_oauth_redirect');
        console.log('Redirecting to OAuth provider:', result.redirect_browser_to);
        window.location.href = result.redirect_browser_to;
        return;
      }

      // If we get a session directly
      if (result.session || result.legacy) {
        const session = result.session;
        const userRole = session?.identity?.traits?.role || result.user?.role;

        // Persist user to localStorage immediately
        const userData = {
          id: session?.identity?.id || '',
          email: session?.identity?.traits?.email || '',
          fullName: `${session?.identity?.traits?.name?.first || ''} ${session?.identity?.traits?.name?.last || ''}`,
          role: userRole,
          verified: true,
          oryIdentityId: session?.identity?.id,
        };
        localStorage.setItem('kidato_user', JSON.stringify(userData));
        localStorage.setItem('kidato_session_id', session?.id || '');

        toast({
          title: 'Account created!',
          description: 'Your account has been created successfully with Google.',
        });

        setTimeout(() => {
          if (userRole === 'teacher') {
            window.location.href = '/teacher-profile-setup';
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
      console.error('OAuth registration error:', error);
      setFlowError(error.message || 'OAuth registration failed. Please try again.');
      toast({
        title: 'Registration failed',
        description: error.message || 'OAuth registration failed. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeFlow();
  }, []);

  const initializeFlow = async () => {
    try {
      setIsLoading(true);

      // Check if there's a flow ID in the URL (from Google OAuth redirect)
      const urlParams = new URLSearchParams(window.location.search);
      const flowId = urlParams.get('flow');

      let registrationFlow: RegistrationFlow;

      if (flowId) {
        // If flow ID exists, fetch the existing flow with pre-filled data
        console.log('Found flow ID in URL, fetching flow data:', flowId);
        registrationFlow = await authService.getRegistrationFlow(flowId);

        // Populate form with pre-filled data from Google OAuth
        populateFormFromFlow(registrationFlow);
      } else {
        // Initialize new flow
        registrationFlow = await authService.initializeRegistrationFlow(redirectTo);
      }

      setFlow(registrationFlow);
      setFlowError('');

      // Clean up URL parameters after successful flow initialization
      if (flowId) {
        const url = new URL(window.location.href);
        url.searchParams.delete('flow');
        window.history.replaceState({}, document.title, url.pathname + url.search);
      }

    } catch (error: any) {
      console.error('Failed to initialize registration flow:', error);
      setFlowError('Failed to initialize registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to populate form with pre-filled data from OAuth
  const populateFormFromFlow = (flow: RegistrationFlow) => {
    if (!flow.ui.nodes) return;

    const updatedFormData = { ...formData };
    const prefilled = new Set<string>();
    let hasPrefilledData = false;

    flow.ui.nodes.forEach(node => {
      if (node.attributes && node.attributes.value) {
        const fieldName = node.attributes.name;
        const fieldValue = node.attributes.value;

        switch (fieldName) {
          case 'traits.email':
            updatedFormData.email = fieldValue;
            prefilled.add('email');
            hasPrefilledData = true;
            console.log('Pre-filled email from Google:', fieldValue);
            break;
          case 'traits.name.first':
            updatedFormData.firstName = fieldValue;
            prefilled.add('firstName');
            hasPrefilledData = true;
            console.log('Pre-filled first name from Google:', fieldValue);
            break;
          case 'traits.name.last':
            updatedFormData.lastName = fieldValue;
            prefilled.add('lastName');
            hasPrefilledData = true;
            console.log('Pre-filled last name from Google:', fieldValue);
            break;
        }
      }
    });

    if (hasPrefilledData) {
      setFormData(updatedFormData);
      setPrefilledFields(prefilled);
      setIsGoogleOAuthFlow(true);  // Mark this as a Google OAuth flow
      console.log('Form populated with Google OAuth data:', updatedFormData);

      // Debug: Log all flow nodes to understand the structure
      console.log('=== OIDC Flow Debug ===');
      console.log('Flow ID:', flow.id);
      console.log('All nodes:', JSON.stringify(flow.ui.nodes, null, 2));
      console.log('Flow messages:', flow.ui.messages);

      // Find all available methods in the flow
      const methods = new Set<string>();
      flow.ui.nodes.forEach((node: any) => {
        if (node.group) methods.add(node.group);
      });
      console.log('Available groups/methods:', Array.from(methods));

      // Log OIDC specific nodes
      const oidcNodes = flow.ui.nodes.filter((node: any) => node.group === 'oidc');
      console.log('OIDC nodes:', JSON.stringify(oidcNodes, null, 2));

      toast({
        title: 'Complete your signup',
        description: 'Please select your role and review your information to complete registration with Google.',
        duration: 6000,
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!flow) {
      setFlowError('Registration flow not initialized. Please refresh the page.');
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: 'Terms required',
        description: 'You must agree to the terms and conditions to sign up.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const csrfToken = flow.ui.nodes.find(node => node.attributes.name === 'csrf_token')?.attributes.value;

      let result;

      if (isGoogleOAuthFlow) {
        // Check if the flow has trait input fields (not just the Continue button)
        // Trait fields can be in group 'oidc', 'profile', or 'default'
        const hasTraitFields = flow.ui.nodes.some((node: any) =>
          node.attributes?.name?.startsWith('traits.') &&
          node.attributes?.type !== 'submit'
        );

        // Find the OIDC submit node (the "Continue" button)
        const oidcSubmitNode = flow.ui.nodes.find((node: any) =>
          node.group === 'oidc' && node.type === 'input' && node.attributes?.type === 'submit'
        );

        console.log('Flow state check:', {
          hasTraitFields,
          oidcSubmitNode,
          flowState: (flow as any).state,
          formRole: formData.role,
        });

        if (hasTraitFields && oidcSubmitNode) {
          // Ory OIDC flow requires re-authentication to complete registration
          // We need to follow the OAuth redirect with the provider
          console.log('Flow has trait fields, following OAuth redirect to complete registration...');

          // Store the selected role for after OAuth completes
          sessionStorage.setItem('kidato_selected_role', formData.role);

          // Submit with provider to trigger OAuth redirect
          const submitData = {
            provider: oidcSubmitNode.attributes.value,
            method: 'oidc',
            csrf_token: csrfToken,
            // Include traits so they're available 
            'traits.email': formData.email,
            'traits.name.first': formData.firstName,
            'traits.name.last': formData.lastName,
            'traits.role': formData.role,
          };

          console.log('Submitting OIDC with traits and provider:', submitData);

          const response = await fetch(`${authService.oryProxyUrl}/self-service/registration?flow=${flow.id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json',
            },
            credentials: 'include',
            body: new URLSearchParams(submitData as any).toString(),
          });

          result = await response.json();
          console.log('OIDC submission result:', result, 'Status:', response.status);

          // Handle OAuth redirect (expected for OIDC flows)
          if (result.redirect_browser_to) {
            console.log('Following OAuth redirect:', result.redirect_browser_to);
            window.location.href = result.redirect_browser_to;
            return;
          }

          // Handle the result if we got a session directly
          if (result.session) {
            toast({
              title: 'Account created!',
              description: 'Your account has been created successfully with Google.',
            });

            const userRole = result.session?.identity?.traits?.role;
            if (userRole === 'teacher') {
              window.location.href = '/teacher-profile-setup';
            } else if (userRole === 'student') {
              window.location.href = '/student-dashboard';
            } else if (userRole === 'parent') {
              window.location.href = '/parents-dashboard';
            } else {
              window.location.href = '/dashboard';
            }
            return;
          }

          // Handle errors
          if (result.ui?.messages) {
            const errorMessage = result.ui.messages.map((msg: any) => msg.text).join('. ');
            setFlowError(errorMessage);
            setIsLoading(false);
            return;
          }

          setFlowError('Registration could not be completed. Please try again.');
          setIsLoading(false);
          return;
        } else if (!hasTraitFields && oidcSubmitNode) {
          // Flow is in 'choose_method' state - we need to click "Continue" to restart OAuth
          // The traits will be populated by the Jsonnet mapper after OAuth completes
          console.log('Flow requires OAuth restart - clicking Continue...');

          const submitData = {
            provider: oidcSubmitNode.attributes.value,
            method: 'oidc',
            csrf_token: csrfToken,
          };

          console.log('Submitting OIDC continuation:', submitData);

          // This will redirect to Google OAuth again
          const response = await fetch(`${authService.oryProxyUrl}/self-service/registration?flow=${flow.id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json',
            },
            credentials: 'include',
            body: new URLSearchParams(submitData as any).toString(),
          });

          const result = await response.json();
          console.log('OIDC continuation result:', result);
          console.log('Response status:', response.status);

          // Handle OAuth redirect - Ory returns 422 with redirect_browser_to for OAuth flows
          // This is expected behavior, not an error!
          if (result.redirect_browser_to) {
            console.log('Redirecting to OAuth provider:', result.redirect_browser_to);
            window.location.href = result.redirect_browser_to;
            return;
          }

          // Also check for error.redirect_browser_to (some Ory versions wrap it)
          if (result.error?.id === 'browser_location_change_required' && result.redirect_browser_to) {
            console.log('Redirecting to OAuth provider (from error):', result.redirect_browser_to);
            window.location.href = result.redirect_browser_to;
            return;
          }

          // If we got a session directly
          if (result.session) {
            toast({
              title: 'Account created!',
              description: 'Your account has been created successfully with Google.',
            });

            const userRole = result.session?.identity?.traits?.role;
            if (userRole === 'teacher') {
              window.location.href = '/teacher-profile-setup';
            } else if (userRole === 'student') {
              window.location.href = '/student-dashboard';
            } else if (userRole === 'parent') {
              window.location.href = '/parents-dashboard';
            } else {
              window.location.href = '/dashboard';
            }
            return;
          }

          // Handle errors (only if not a redirect)
          if (result.ui?.messages) {
            const errorMessage = result.ui.messages.map((msg: any) => msg.text).join('. ');
            setFlowError(errorMessage);
          } else if (result.error?.message && result.error?.id !== 'browser_location_change_required') {
            setFlowError(result.error.message);
          }

          setIsLoading(false);
          return;
        }

        // If we have trait fields, submit with traits
        console.log('Submitting Google OAuth registration with traits');
        const submitData: Record<string, any> = {
          'traits.email': formData.email,
          'traits.name.first': formData.firstName,
          'traits.name.last': formData.lastName,
          'traits.role': formData.role,
          csrf_token: csrfToken,
          method: 'oidc',
          provider: 'google',
        };

        console.log('Final OIDC submit data:', submitData);
        result = await authService.submitRegistrationFlow(flow.id, submitData);
      } else {
        // Normal password registration
        result = await authService.submitRegistrationFlow(flow.id, {
          'traits.email': formData.email,
          password: formData.password,
          'traits.name.first': formData.firstName,
          'traits.name.last': formData.lastName,
          'traits.role': formData.role,
          csrf_token: csrfToken,
          method: 'password',
        });
      }

      if (result.session || result.legacy) {
        // Get user role for routing
        const session = result.session;
        const userRole = session?.identity?.traits?.role || result.user?.role || formData.role;

        // Construct user object from session
        const userData = {
          id: session?.identity?.id || '',
          email: session?.identity?.traits?.email || formData.email,
          fullName: `${session?.identity?.traits?.name?.first || formData.firstName} ${session?.identity?.traits?.name?.last || formData.lastName}`,
          role: userRole,
          verified: true,
          oryIdentityId: session?.identity?.id,
        };

        // Persist user to localStorage immediately so AuthContext picks it up
        localStorage.setItem('kidato_user', JSON.stringify(userData));
        localStorage.setItem('kidato_session_id', session?.id || '');

        // Try to create backend user (async, don't block navigation)
        try {
          const backendResponse = await authService.createBackendUserFromOry(session as any);
          if (backendResponse?.user) {
            // Update user with backend IDs
            const updatedUser = {
              ...userData,
              id: backendResponse.user.id || userData.id,
              teacherId: backendResponse.user.teacherId,
              studentId: backendResponse.user.studentId,
              parentId: backendResponse.user.parentId,
            };
            localStorage.setItem('kidato_user', JSON.stringify(updatedUser));

            // Store tokens if provided
            if (backendResponse.accessToken) {
              localStorage.setItem('kidato_access_token', backendResponse.accessToken);
            }
            if (backendResponse.refreshToken) {
              localStorage.setItem('kidato_refresh_token', backendResponse.refreshToken);
            }
          }
        } catch (backendError) {
          console.warn('Could not create backend user during registration, will retry on next page load:', backendError);
        }

        toast({
          title: 'Account created!',
          description: 'Your account has been created successfully.',
        });

        if (onSuccess) {
          onSuccess();
        } else {
          // Handle role-based redirection with window.location for full page reload
          // This ensures AuthContext re-initializes with the new user data
          if (userRole === 'teacher') {
            window.location.href = '/teacher-profile-setup';
          } else if (userRole === 'student') {
            window.location.href = '/student-dashboard';
          } else if (userRole === 'parent') {
            window.location.href = '/parents-dashboard';
          } else {
            window.location.href = '/dashboard';
          }
        }
      } else {
        throw new Error('Registration failed - no session returned');
      }
    } catch (error: any) {
      console.error('Registration error:', error);

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
        setFlowError(error.message || 'Registration failed. Please try again.');
      }

      toast({
        title: 'Registration failed',
        description: error.message || 'Please check your information and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const roleLabels = {
    student: "I'm a student",
    parent: "I'm a parent",
    teacher: "I'm a teacher"
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">
            First name
            {prefilledFields.has('firstName') && (
              <span className="text-xs text-green-600 ml-1">(from Google)</span>
            )}
          </Label>
          <div className="mt-1">
            <Input
              id="firstName"
              name="traits.name.first"
              type="text"
              autoComplete="given-name"
              required
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`block w-full ${errors['traits.name.first'] ? 'border-red-500' : ''} ${prefilledFields.has('firstName') ? 'bg-green-50 border-green-200' : ''}`}
              disabled={isLoading}
            />
            {errors['traits.name.first'] && (
              <p className="mt-1 text-sm text-red-600">{errors['traits.name.first']}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="lastName">
            Last name
            {prefilledFields.has('lastName') && (
              <span className="text-xs text-green-600 ml-1">(from Google)</span>
            )}
          </Label>
          <div className="mt-1">
            <Input
              id="lastName"
              name="traits.name.last"
              type="text"
              autoComplete="family-name"
              required
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`block w-full ${errors['traits.name.last'] ? 'border-red-500' : ''} ${prefilledFields.has('lastName') ? 'bg-green-50 border-green-200' : ''}`}
              disabled={isLoading}
            />
            {errors['traits.name.last'] && (
              <p className="mt-1 text-sm text-red-600">{errors['traits.name.last']}</p>
            )}
          </div>
        </div>
      </div>

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
            name="traits.email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`block w-full ${errors['traits.email'] ? 'border-red-500' : ''} ${prefilledFields.has('email') ? 'bg-green-50 border-green-200' : ''}`}
            disabled={isLoading || prefilledFields.has('email')}
            readOnly={prefilledFields.has('email')}
          />
          {prefilledFields.has('email') && (
            <p className="mt-1 text-xs text-green-600">This email is verified through Google</p>
          )}
          {errors['traits.email'] && (
            <p className="mt-1 text-sm text-red-600">{errors['traits.email']}</p>
          )}
        </div>
      </div>

      {/* Password field - only show for non-Google signups */}
      {!isGoogleOAuthFlow && (
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="mt-1 relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
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
      )}

      {/* Show info for Google OAuth signup */}
      {isGoogleOAuthFlow && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <GoogleIcon className="h-5 w-5 text-blue-600 mr-2" />
            <p className="text-sm text-blue-800">
              <strong>Signing up with Google</strong> - No password required. You'll use Google to sign in.
            </p>
          </div>
        </div>
      )}

      <div>
        <Label>I am joining as</Label>
        {rolePreselected && (
          <p className="text-xs text-gray-500 mt-1">
            Role preselected. You can change it if needed.
          </p>
        )}
        <RadioGroup
          value={formData.role}
          onValueChange={(value) => {
            handleInputChange('role', value);
            setRolePreselected(false);  // Clear preselected state when user changes
          }}
          className="mt-2 grid grid-cols-3 gap-4"
        >
          {Object.entries(roleLabels).map(([value, label]) => (
            <div key={value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={value}
                id={value}
                name="traits.role"
                disabled={isLoading}
              />
              <Label htmlFor={value} className="text-sm font-medium">
                {label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {errors['traits.role'] && (
          <p className="mt-1 text-sm text-red-600">{errors['traits.role']}</p>
        )}
      </div>

      <div className="flex items-center">
        <Checkbox
          id="terms"
          checked={agreedToTerms}
          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          className="h-4 w-4 text-kidato-purple focus:ring-kidato-purple"
          disabled={isLoading}
        />
        <Label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
          I agree to the{' '}
          <a
            href="/terms-and-conditions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-kidato-purple hover:text-kidato-dark-blue"
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-kidato-purple hover:text-kidato-dark-blue"
          >
            Privacy Policy
          </a>
        </Label>
      </div>

      <div>
        <Button
          type="submit"
          className="w-full bg-kidato-purple hover:bg-kidato-dark-blue"
          disabled={isLoading || !flow || !formData.role}
        >
          {isLoading ? 'Creating account...' : isGoogleOAuthFlow ? 'Complete Google Sign Up' : 'Sign up'}
        </Button>
        {!formData.role && (
          <p className="mt-1 text-sm text-amber-600 text-center">Please select your role above</p>
        )}
      </div>

      {/* Google OAuth Registration - only show if NOT already in Google OAuth flow */}
      {flow && !isGoogleOAuthFlow && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or sign up with</span>
            </div>
          </div>

          {getOAuthProviders().length > 0 ? (
            <div className="space-y-2">
              {getOAuthProviders().map((provider) => {
                const providerName = provider.attributes.value;
                return (
                  <Button
                    key={providerName}
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOAuthSignup(providerName)}
                    disabled={isLoading}
                  >
                    {providerName.indexOf('google') !== -1 && <GoogleIcon className="mr-2 h-4 w-4" />}
                    Sign up with {(providerName.charAt(0).toUpperCase() + providerName.slice(1)).split('-')[0]}
                  </Button>
                );
              })}
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => handleOAuthSignup('google')}
              disabled={isLoading}
            >
              <GoogleIcon className="mr-2 h-4 w-4" />
              Sign up with Google
            </Button>
          )}

          {/* LinkedIn Signup Button */}
          <LinkedInLoginButton mode="signup" className="mt-2" />
        </>
      )}
    </form>
  );
};
