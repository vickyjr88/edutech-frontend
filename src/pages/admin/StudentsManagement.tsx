import { useState } from 'react';
import StudentsList from '@/components/admin/students/StudentsList';
import StudentDetails from '@/components/admin/students/StudentDetails';

/**
 * Students Management Page
 * Admin interface for managing students, viewing details, and accessing resources
 */
const StudentsManagement = () => {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const handleViewStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
  };

  const handleBack = () => {
    setSelectedStudentId(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Students Management</h1>
      {selectedStudentId ? (
        <StudentDetails studentId={selectedStudentId} onBack={handleBack} />
      ) : (
        <StudentsList onViewStudent={handleViewStudent} />
      )}
    </div>
  );
};

export default StudentsManagement;
