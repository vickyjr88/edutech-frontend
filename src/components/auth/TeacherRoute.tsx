import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { teacherService } from "@/integrations/api/services/teacher.service";

interface TeacherRouteProps {
  children: ReactNode;
  requireProfileComplete?: boolean;
}

/**
 * A route component that protects teacher routes and redirects based on profile completion status.
 * 
 * @param children The components to render when the user is a teacher
 * @param requireProfileComplete If true, redirect to profile setup if profile is incomplete
 */
const TeacherRoute = ({ children, requireProfileComplete = true }: TeacherRouteProps) => {
  const { user, isLoading, retryBackendUserFetch } = useAuth();
  const location = useLocation();
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  useEffect(() => {
    // Check if user is a teacher and get profile status
    const checkTeacherProfile = async () => {
      if (!isLoading && user && user.role === 'teacher' && user.teacherId) {
        try {
          // Get the teacher profile
          const { data } = await teacherService.getProfileById(user.teacherId);
          
          // Check if the profile is complete
          setIsProfileComplete(data?.isProfileComplete || false);
        } catch (error) {
          console.error("Error checking teacher profile:", error);
          setIsProfileComplete(false);
        } finally {
          setIsCheckingProfile(false);
        }
      } else if (!isLoading) {
        // Not a teacher or no teacherId
        setIsCheckingProfile(false);
      }
    };

    checkTeacherProfile();
  }, [user, isLoading]);

  // Show loading indicator while checking authentication and profile
  if (isLoading || isCheckingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to student dashboard if not a teacher
  if (user.role !== 'teacher') {
    return <Navigate to="/student-dashboard" replace />;
  }

  // If teacher doesn't have teacherId, show error state with retry option
  if (!user.teacherId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="text-red-500 text-4xl">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800">Account Setup Incomplete</h2>
          <p>{ JSON.stringify(user)}</p>
          <p className="text-gray-600">
            Your teacher account is missing required information. This may be a temporary issue.
          </p>
          <div className="flex gap-2">
            <button 
              onClick={retryBackendUserFetch}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Retrying...' : 'Retry Setup'}
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to profile setup if teacher profile is incomplete and the route requires completion
  if (requireProfileComplete && isProfileComplete === false) {
    // Don't redirect if we're already on the profile setup page
    if (location.pathname !== '/teacher-profile-setup') {
      return <Navigate to="/teacher-profile-setup" replace />;
    }
  }

  // Do not redirect from profile setup page even if profile is complete
  // This allows users to edit their profile regardless of completion status
  // Previously: if (!requireProfileComplete && isProfileComplete === true && location.pathname === '/teacher-profile-setup') {
  //   return <Navigate to="/teacher-dashboard" replace />;
  // }

  // User is a teacher with the right profile status for this route
  return <>{children}</>;
};

export default TeacherRoute;