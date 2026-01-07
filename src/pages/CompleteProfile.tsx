import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { authService } from '@/services/auth.service';
import { GraduationCap, Users, BookOpen, Loader2 } from 'lucide-react';

const roleOptions = [
    {
        value: 'student',
        label: 'Student',
        description: 'I am a student looking to learn',
        icon: GraduationCap,
    },
    {
        value: 'parent',
        label: 'Parent/Guardian',
        description: 'I am a parent managing my child\'s education',
        icon: Users,
    },
    {
        value: 'teacher',
        label: 'Teacher',
        description: 'I am an educator offering classes',
        icon: BookOpen,
    },
];

export const CompleteProfile: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [settingsFlow, setSettingsFlow] = useState<any>(null);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        // Check if user is logged in and has the default role
        checkUserStatus();
    }, []);

    const checkUserStatus = async () => {
        try {
            const session = await authService.getCurrentSession();

            if (!session) {
                // Not logged in, redirect to login
                navigate('/login');
                return;
            }

            const currentRole = session.identity?.traits?.role;

            // If user already has a valid role, redirect them
            if (currentRole && currentRole !== 'default') {
                redirectBasedOnRole(currentRole);
                return;
            }

            // Initialize settings flow for updating profile
            await initializeSettingsFlow();
        } catch (err) {
            console.error('Error checking user status:', err);
            navigate('/login');
        }
    };

    const initializeSettingsFlow = async () => {
        try {
            const flow = await authService.initializeSettingsFlow();
            setSettingsFlow(flow);
        } catch (err) {
            console.error('Error initializing settings flow:', err);
            setError('Failed to initialize profile update. Please refresh the page.');
        }
    };

    const redirectBasedOnRole = (role: string) => {
        switch (role) {
            case 'teacher':
                navigate('/teacher-profile-setup');
                break;
            case 'student':
                navigate('/student-dashboard');
                break;
            case 'parent':
                navigate('/parents-dashboard');
                break;
            default:
                navigate('/dashboard');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedRole) {
            setError('Please select a role to continue');
            return;
        }

        if (!settingsFlow) {
            setError('Settings flow not initialized. Please refresh the page.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Get CSRF token from settings flow
            const csrfToken = settingsFlow.ui?.nodes?.find(
                (node: any) => node.attributes?.name === 'csrf_token'
            )?.attributes?.value;

            // Submit the settings flow to update the role
            const response = await fetch(`${authService.oryProxyUrl}/self-service/settings?flow=${settingsFlow.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: new URLSearchParams({
                    'traits.role': selectedRole,
                    csrf_token: csrfToken || '',
                    method: 'profile',
                }).toString(),
            });

            const result = await response.json();
            console.log('Settings update result:', result);

            if (response.ok || result.state === 'success') {
                toast({
                    title: 'Profile Updated!',
                    description: `You've been set up as a ${selectedRole}. Redirecting to your dashboard...`,
                });

                // Update local storage with new role
                const storedUser = localStorage.getItem('kidato_user');
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    user.role = selectedRole;
                    localStorage.setItem('kidato_user', JSON.stringify(user));
                }

                // Redirect based on selected role
                setTimeout(() => {
                    redirectBasedOnRole(selectedRole);
                }, 1000);
            } else if (result.ui?.messages) {
                const errorMessage = result.ui.messages.map((msg: any) => msg.text).join('. ');
                setError(errorMessage);
            } else {
                setError('Failed to update profile. Please try again.');
            }
        } catch (err: any) {
            console.error('Profile update error:', err);
            setError(err.message || 'Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-kidato-purple/10 via-white to-kidato-blue/10 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg shadow-xl">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-kidato-purple/10 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-kidato-purple" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        Complete Your Profile
                    </CardTitle>
                    <CardDescription className="text-base">
                        Welcome to Kidato! Please tell us how you'll be using the platform.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-4">
                            <Label className="text-base font-medium">I am a...</Label>

                            <RadioGroup
                                value={selectedRole}
                                onValueChange={setSelectedRole}
                                className="space-y-3"
                            >
                                {roleOptions.map((option) => (
                                    <label
                                        key={option.value}
                                        className={`
                      flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${selectedRole === option.value
                                                ? 'border-kidato-purple bg-kidato-purple/5'
                                                : 'border-gray-200 hover:border-kidato-purple/50'
                                            }
                    `}
                                    >
                                        <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                                        <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center mr-4
                      ${selectedRole === option.value
                                                ? 'bg-kidato-purple text-white'
                                                : 'bg-gray-100 text-gray-500'
                                            }
                    `}>
                                            <option.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">{option.label}</div>
                                            <div className="text-sm text-gray-500">{option.description}</div>
                                        </div>
                                        <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${selectedRole === option.value
                                                ? 'border-kidato-purple bg-kidato-purple'
                                                : 'border-gray-300'
                                            }
                    `}>
                                            {selectedRole === option.value && (
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </RadioGroup>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-kidato-purple hover:bg-kidato-dark-blue py-6 text-lg"
                            disabled={isLoading || !selectedRole}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Continue'
                            )}
                        </Button>

                        <p className="text-center text-sm text-gray-500">
                            You can change your role later in your profile settings.
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CompleteProfile;
