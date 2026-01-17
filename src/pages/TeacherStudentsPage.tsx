import React from "react";
import { useNavigate } from "react-router-dom";
import AIStudentsPage from "@/components/teacher/students/AIStudentsPage";

const TeacherStudentsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleViewProfile = (studentId: string) => {
    // Navigate to student profile or open modal
    console.log("View profile for student:", studentId);
    // You can implement navigation to student profile page
    // navigate(`/teacher/students/${studentId}`);
  };

  const handleEnrollStudents = () => {
    // Navigate to enrollment page or open modal
    console.log("Enroll students");
    // You can implement navigation to enrollment page
    // navigate("/teacher/enroll-students");
  };

  return (
    <div className="bg-[#ededf4] min-h-screen">
      <AIStudentsPage
        onViewProfile={handleViewProfile}
        onEnrollStudents={handleEnrollStudents}
      />
    </div>
  );
};

export default TeacherStudentsPage;