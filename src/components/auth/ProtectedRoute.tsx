
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Set isReady to true when the authentication state is loaded
    if (!isLoading) {
      setIsReady(true);
    }
  }, [isLoading]);

  // Show loading indicator while checking authentication
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kidato-purple"></div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to complete-profile if user has 'default' role
  // They must select their actual role before accessing protected content
  if (user.role === 'default') {
    return <Navigate to="/complete-profile" replace />;
  }

  // User is authenticated with a valid role, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
