
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MessagingPlatform from "@/components/messaging/MessagingPlatform";

const Messaging = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userName] = useState("John Doe");

  useEffect(() => {
    // Redirect based on role if not a student
    if (user) {
      if (user.role === 'teacher') {
        navigate('/teacher/messages');
      } else if (user.role === 'parent') {
        navigate('/parent/messages');
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
    <div className="p-6">
      <MessagingPlatform />
    </div>
  );
}

export default Messaging;
