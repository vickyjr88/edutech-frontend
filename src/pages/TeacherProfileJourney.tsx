import React from "react";
import { ProfileJourney } from "@/components/teacher/profile-journey";
import { useNavigate } from "react-router-dom";
import { Award, BookOpen, Star, Users } from "lucide-react";

const TeacherProfileJourney: React.FC = () => {
  const navigate = useNavigate();
  
  // Handler for when profile setup is complete
const handleProfileComplete = () => {
    // Navigate to teacher dashboard after profile completion
    navigate("/teacher-dashboard");
  };
  
  // Handler for cancellation
  const handleCancel = () => {
    navigate("/teacher-dashboard");
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white py-8 px-4 sm:px-6">
      <div className="max-w-screen-xl mx-auto">
        
        <ProfileJourney 
          onComplete={handleProfileComplete}
          onCancel={handleCancel}
        />
        
        <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-200 pt-6">
          <p>Need help? Contact our support team at <span className="text-blue-600">support@kidato.com</span></p>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileJourney;