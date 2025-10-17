import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AdminRouteProps {
  children: ReactNode;
}

/**
 * A route component that protects admin-only routes.
 * Redirects non-admin users to their appropriate dashboard.
 *
 * @param children The components to render when the user is an admin
 */
const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to appropriate dashboard if not an admin
  if (user.role !== 'admin') {
    // Redirect based on user role
    const redirectMap: Record<string, string> = {
      teacher: '/teacher-dashboard',
      student: '/student-dashboard',
      parent: '/parent-dashboard',
    };

    const redirectTo = redirectMap[user.role] || '/';
    return <Navigate to={redirectTo} replace />;
  }

  // User is an admin, render the protected content
  return <>{children}</>;
};

export default AdminRoute;
