import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthLayout from "@/components/auth/AuthLayout";
import { OryRegistrationForm } from "@/components/auth/OryRegistrationForm";
import { teacherService } from "@/integrations/api";

const SignUp = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // If user is already logged in, redirect them
  useEffect(() => {
    const checkUserRedirect = async () => {
      if (user) {
        const userRole = user?.role;
        if (userRole === "teacher" && user.id) {
          try {
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
          navigate("/dashboard");
        }
      }
    };

    checkUserRedirect();
  }, [user, navigate]);

  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Already have an account?"
      authType="signup"
    >
      <OryRegistrationForm />
    </AuthLayout>
  );
};

export default SignUp;
