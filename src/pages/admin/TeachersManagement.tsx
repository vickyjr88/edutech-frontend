import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TeachersList from '@/components/admin/teachers/TeachersList';
import TeacherDetails from '@/components/admin/teachers/TeacherDetails';
import CreateUserForm from '@/components/admin/users/CreateUserForm';

/**
 * Teachers Management Page
 * Admin interface for managing teachers, viewing details, and accessing resources
 * Supports URL-based navigation with ?id=<teacherId> for easy sharing and bookmarking
 */
const TeachersManagement = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const teacherId = searchParams.get('id');

  const handleViewTeacher = (teacherId: string) => {
    navigate(`/admin/teachers?id=${teacherId}`);
  };

  const handleBack = () => {
    navigate('/admin/teachers');
  };

  const handleAddTeacher = () => {
    setCreateModalOpen(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Teachers Management</h1>
      {teacherId ? (
        <TeacherDetails teacherId={teacherId} onBack={handleBack} />
      ) : (
        <TeachersList onViewTeacher={handleViewTeacher} onAddTeacher={handleAddTeacher} />
      )}

      <CreateUserForm
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        defaultRole="teacher"
      />
    </div>
  );
};

export default TeachersManagement;
