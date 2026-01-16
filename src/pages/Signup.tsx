import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthLayout from "@/components/auth/AuthLayout";
import { OryRegistrationForm } from "@/components/auth/OryRegistrationForm";
import { teacherService } from "@/integrations/api";

const SignUp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // Get role from query parameter (e.g., /signup?role=teacher)
  const roleFromQuery = searchParams.get("role") as "teacher" | "student" | "parent" | null;

  // If user is already logged in, redirect them
  useEffect(() => {
    const checkUserRedirect = async () => {
      if (user) {
        const userRole = user?.role;
        if (userRole === "admin") {
          navigate("/admin/pages");
        } else if (userRole === "teacher" && user.id) {
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

  // Get appropriate title based on role
  const getTitle = () => {
    switch (roleFromQuery) {
      case "teacher":
        return "Create a Teacher Account";
      case "student":
        return "Create a Student Account";
      case "parent":
        return "Create a Parent Account";
      default:
        return "Create an account";
    }
  };

  return (
    <AuthLayout 
      title={getTitle()} 
      subtitle="Already have an account?"
      authType="signup"
    >
      <OryRegistrationForm defaultRole={roleFromQuery || undefined} />
    </AuthLayout>
  );
};

export default SignUp;
