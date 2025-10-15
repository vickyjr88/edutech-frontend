import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Component that checks the user's role and redirects to the appropriate dashboard
 * This is used as an intermediary after OAuth login to ensure proper role-based routing
 */
export const RoleBasedDashboardRouter: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) {
      return;
    }

    // If no user, redirect to login
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    // Redirect based on user role
    const role = user.role?.toLowerCase();

    switch (role) {
      case 'teacher':
        // Check if teacher needs to complete profile setup
        if (!user.teacherId) {
          navigate('/teacher-profile-setup', { replace: true });
        } else {
          navigate('/teacher-dashboard', { replace: true });
        }
        break;

      case 'student':
        navigate('/student-dashboard', { replace: true });
        break;

      case 'parent':
        navigate('/parents-dashboard', { replace: true });
        break;

      default:
        // Fallback to student dashboard for unknown roles
        console.warn(`Unknown user role: ${role}, defaulting to student dashboard`);
        navigate('/student-dashboard', { replace: true });
        break;
    }
  }, [user, isLoading, navigate]);

  // Show loading state while determining redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Loading Dashboard</CardTitle>
          <CardDescription>
            Redirecting you to your personalized dashboard...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-kidato-purple" />
        </CardContent>
      </Card>
    </div>
  );
};
