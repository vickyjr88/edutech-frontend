import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import { OryLoginForm } from "@/components/auth/OryLoginForm";
import { teacherService } from "@/integrations/api";

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const state = location.state as LocationState;
  const from = state?.from?.pathname || "/dashboard";

  // If user is already logged in, check if we need to redirect
  useEffect(() => {
    const checkUserRedirect = async () => {
      if (user) {
        const userRole = user?.role;
        if (userRole === "admin") {
          navigate("/admin/pages");
        } else if (userRole === "teacher" && user.id) {
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
          navigate("/parents-dashboard");
        } else {
          navigate(from);
        }
      }
    };

    checkUserRedirect();
  }, [user, navigate, from]);

  return (
    <AuthLayout
      title="Log in to your account"
      subtitle="Don't have an account yet?"
      authType="login"
    >
      <OryLoginForm redirectTo={from} />
    </AuthLayout>
  );
};

export default Login;