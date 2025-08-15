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

interface OryRegistrationFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export const OryRegistrationForm: React.FC<OryRegistrationFormProps> = ({ onSuccess, redirectTo }) => {
  const [flow, setFlow] = useState<RegistrationFlow | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'student',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [flowError, setFlowError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    initializeFlow();
  }, []);

  const initializeFlow = async () => {
    try {
      setIsLoading(true);
      const registrationFlow = await authService.initializeRegistrationFlow(redirectTo);
      setFlow(registrationFlow);
      setFlowError('');
    } catch (error: any) {
      console.error('Failed to initialize registration flow:', error);
      setFlowError('Failed to initialize registration. Please try again.');
    } finally {
      setIsLoading(false);
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
      const result = await authService.submitRegistrationFlow(flow.id, {
        'traits.email': formData.email,
        password: formData.password,
        'traits.name.first': formData.firstName,
        'traits.name.last': formData.lastName,
        'traits.role': formData.role,
      });

      if (result.session || result.legacy) {
        toast({
          title: 'Account created!',
          description: 'Your account has been created successfully.',
        });

        if (onSuccess) {
          onSuccess();
        } else {
          // Handle role-based redirection
          const userRole = result.session?.identity?.traits?.role || result.user?.role;
          
          if (userRole === 'teacher') {
            navigate('/teacher-profile-setup');
          } else if (userRole === 'student') {
            navigate('/student-dashboard');
          } else if (userRole === 'parent') {
            navigate('/parents-dashboard');
          } else {
            navigate('/dashboard');
          }
        }
      } else {
        throw new Error('Registration failed - no session returned');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
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
          <Label htmlFor="firstName">First name</Label>
          <div className="mt-1">
            <Input
              id="firstName"
              name="traits.name.first"
              type="text"
              autoComplete="given-name"
              required
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`block w-full ${errors['traits.name.first'] ? 'border-red-500' : ''}`}
              disabled={isLoading}
            />
            {errors['traits.name.first'] && (
              <p className="mt-1 text-sm text-red-600">{errors['traits.name.first']}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="lastName">Last name</Label>
          <div className="mt-1">
            <Input
              id="lastName"
              name="traits.name.last"
              type="text"
              autoComplete="family-name"
              required
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`block w-full ${errors['traits.name.last'] ? 'border-red-500' : ''}`}
              disabled={isLoading}
            />
            {errors['traits.name.last'] && (
              <p className="mt-1 text-sm text-red-600">{errors['traits.name.last']}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email address</Label>
        <div className="mt-1">
          <Input
            id="email"
            name="traits.email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`block w-full ${errors['traits.email'] ? 'border-red-500' : ''}`}
            disabled={isLoading}
          />
          {errors['traits.email'] && (
            <p className="mt-1 text-sm text-red-600">{errors['traits.email']}</p>
          )}
        </div>
      </div>

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

      <div>
        <Label>I am joining as</Label>
        <RadioGroup
          value={formData.role}
          onValueChange={(value) => handleInputChange('role', value)}
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
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-kidato-purple hover:text-kidato-dark-blue"
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            href="/privacy"
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
          disabled={isLoading || !flow}
        >
          {isLoading ? 'Creating account...' : 'Sign up'}
        </Button>
      </div>
    </form>
  );
};
