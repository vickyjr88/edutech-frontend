import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { toast } from '@/components/ui/use-toast';

interface LinkedInLoginButtonProps {
    mode: 'login' | 'signup';
    returnTo?: string;
    className?: string;
    fullWidth?: boolean;
}

export const LinkedInLoginButton: React.FC<LinkedInLoginButtonProps> = ({
    mode,
    returnTo,
    className = '',
    fullWidth = true,
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleLinkedInAuth = async () => {
        try {
            setIsLoading(true);

            if (mode === 'login') {
                await authService.initiateLinkedInLogin(returnTo);
            } else {
                await authService.initiateLinkedInSignup(returnTo);
            }
        } catch (error: any) {
            console.error('LinkedIn auth error:', error);
            setIsLoading(false);
            toast({
                title: 'LinkedIn Sign-in Unavailable',
                description: error.message || 'LinkedIn sign-in is not configured. Please use email to sign in.',
                variant: 'destructive',
            });
        }
    };

    return (
        <Button
            type="button"
            variant="outline"
            onClick={handleLinkedInAuth}
            disabled={isLoading}
            className={`${fullWidth ? 'w-full' : ''} flex items-center justify-center gap-2 border-gray-300 hover:bg-blue-50 hover:border-blue-400 ${className}`}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                        fill="#0A66C2"
                    />
                </svg>
            )}
            <span className="text-gray-700">
                {isLoading
                    ? 'Connecting...'
                    : mode === 'login'
                        ? 'Continue with LinkedIn'
                        : 'Sign up with LinkedIn'}
            </span>
        </Button>
    );
};

export default LinkedInLoginButton;
