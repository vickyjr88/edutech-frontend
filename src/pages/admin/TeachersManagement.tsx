import { useState } from 'react';
import TeachersList from '@/components/admin/teachers/TeachersList';
import TeacherDetails from '@/components/admin/teachers/TeacherDetails';

/**
 * Teachers Management Page
 * Admin interface for managing teachers, viewing details, and accessing resources
 */
const TeachersManagement = () => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);

  const handleViewTeacher = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
  };

  const handleBack = () => {
    setSelectedTeacherId(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Teachers Management</h1>
      {selectedTeacherId ? (
        <TeacherDetails teacherId={selectedTeacherId} onBack={handleBack} />
      ) : (
        <TeachersList onViewTeacher={handleViewTeacher} />
      )}
    </div>
  );
};

export default TeachersManagement;
