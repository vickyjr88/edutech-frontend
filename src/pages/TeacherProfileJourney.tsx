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
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
            <Award className="h-9 w-9 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Your Teaching Journey!</h1>
          <p className="text-gray-600 text-center max-w-xl mx-auto">
            Complete these simple steps to create your professional profile and start connecting with students.
            A complete profile helps you stand out and attract more students.
          </p>
          
          {/* Benefits Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="rounded-full bg-green-100 w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-800 mb-1">Stand Out</h3>
              <p className="text-sm text-gray-600">Complete profile ranks higher in search results</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-800 mb-1">Connect</h3>
              <p className="text-sm text-gray-600">Build trust with students before they even message you</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="rounded-full bg-amber-100 w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-medium text-gray-800 mb-1">Teach</h3>
              <p className="text-sm text-gray-600">Get matched with students looking for your expertise</p>
            </div>
          </div>
        </div>
        
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