
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/auth/AuthLayout";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api, authService, studentService, teacherService } from "@/integrations/api";

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const state = location.state as LocationState;
  const from = state?.from?.pathname || "/dashboard";

  // If user is already logged in, check if we need to redirect
  // We'll use an effect to handle this so we can use async functions
  useEffect(() => {
    const checkUserRedirect = async () => {
      if (user) {
        const userRole = user?.role;
        if (userRole === "teacher" && user.id) {
          try {
            // Check if the teacher profile is complete
            const isProfileComplete = await teacherService.isProfileComplete(user.id);
            if (!isProfileComplete) {
              navigate("/teacher-profile-setup");
            } else {
              navigate("/teacher-dashboard");
            }
          } catch (error) {
            console.error("Error checking teacher profile:", error);
            navigate("/teacher-dashboard");
          }
        } else if (userRole === "student") {
          navigate("/student-dashboard");
        } else if (userRole === "parent") {
          navigate("/parent-dashboard");
        } else {
          navigate(from);
        }
      }
    };

    checkUserRedirect();
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const { data, error: signInError } = await authService.login({
        email,
        password,
      });

      if (signInError) throw signInError;

      toast({
        title: `Welcome back ${data.user?.fullName || data.user?.email || "user"}`,
        description: "You have successfully logged in.",
      });

      // Check user role to redirect to the correct dashboard
      const userRole = data.user?.role;
      if (userRole === "teacher") {
        try {
          // Check if the teacher profile is complete
          if (data.user && data.user.id) {
            const isProfileComplete = await teacherService.isProfileComplete(data.user.id);
            if (!isProfileComplete) {
              // Redirect to profile setup if profile is incomplete
              navigate("/teacher-profile-setup");
            } else {
              // Redirect to dashboard if profile is complete
              navigate("/teacher-dashboard");
            }
          } else {
            navigate("/teacher-dashboard");
          }
        } catch (error) {
          console.error("Error checking teacher profile:", error);
          navigate("/teacher-dashboard");
        }
      } else if (userRole === "student") {
        navigate("/student-dashboard");
      } else {
        navigate(from);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password");
      toast({
        title: "Login failed",
        description: err.message || "Invalid email or password",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  // Handle social logins
  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      setIsLoading(true);
      const { error } = await authService.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + '/auth/callback',
        },
      });
      
      if (error) throw error;
      
    } catch (err: any) {
      console.error(`${provider} login error:`, err);
      toast({
        title: "Login failed",
        description: err.message || `Could not sign in with ${provider}`,
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Log in to your account"
      subtitle="Don't have an account yet?"
      authType="login"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div>
          <Label htmlFor="email">Email address</Label>
          <div className="mt-1">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              className="text-sm font-medium text-kidato-blue hover:text-kidato-dark-blue"
              onClick={handleForgotPassword}
            >
              Forgot your password?
            </button>
          </div>
          <div className="mt-1 relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <Button
            type="submit"
            className="w-full bg-kidato-blue hover:bg-kidato-dark-blue"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
          >
            <span className="sr-only">Sign in with Google</span>
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                fill="currentColor"
              />
            </svg>
            Google
          </Button>

          <Button
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => handleSocialLogin('facebook')}
            disabled={isLoading}
          >
            <span className="sr-only">Sign in with Facebook</span>
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                clipRule="evenodd"
              />
            </svg>
            Facebook
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
