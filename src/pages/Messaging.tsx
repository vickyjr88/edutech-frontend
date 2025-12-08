
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import StudentDashboardHeader from "@/components/dashboard/StudentDashboardHeader";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import MessagingPlatform from "@/components/messaging/MessagingPlatform";

const Messaging = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userName] = useState("John Doe");

  useEffect(() => {
    // Redirect based on role if not a student
    if (user) {
      if (user.role === 'teacher') {
        navigate('/teacher-dashboard/messaging');
      } else if (user.role === 'parent') {
        navigate('/parents-messaging');
      } else if (user.role === 'admin') {
        navigate('/admin/messaging');
      }
    }
  }, [user, navigate]);

  // If we are redirecting, we can return null to avoid flash of student content
  if (user?.role === 'teacher' || user?.role === 'parent' || user?.role === 'admin') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Nav */}
        <StudentDashboardHeader userName={userName} />

        {/* Content */}
        <main className="p-6">
          <MessagingPlatform />
        </main>
      </div>
    </div>
  );
}

export default Messaging;
