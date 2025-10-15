
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // This effect handles the OAuth callback
    const handleAuthCallback = async () => {
      try {
        // We just need to check the result and redirect

        if (error) {
          console.error("Auth error:", error);
          navigate("/login");
          return;
        }

        // If we have a user, redirect to /dashboard which will handle role-based routing
        if (user) {
          console.log("User:", user);
          navigate("/dashboard");
        } else {
          // Wait a bit for auth state to be processed
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        }
      } catch (err) {
        console.error("Error in auth callback:", err);
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate, error, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kidato-purple"></div>
      <p className="ml-4 text-gray-600">Authenticating...</p>
    </div>
  );
};

export default AuthCallback;
