import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StudentsList from '@/components/admin/students/StudentsList';
import StudentDetails from '@/components/admin/students/StudentDetails';
import CreateUserForm from '@/components/admin/users/CreateUserForm';

/**
 * Students Management Page
 * Admin interface for managing students, viewing details, and accessing resources
 * Supports URL-based navigation with ?id=<studentId> for easy sharing and bookmarking
 */
const StudentsManagement = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const studentId = searchParams.get('id');

  const handleViewStudent = (studentId: string) => {
    navigate(`/admin/students?id=${studentId}`);
  };

  const handleBack = () => {
    navigate('/admin/students');
  };

  const handleAddStudent = () => {
    setCreateModalOpen(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Students Management</h1>
      {studentId ? (
        <StudentDetails studentId={studentId} onBack={handleBack} />
      ) : (
        <StudentsList onViewStudent={handleViewStudent} onAddStudent={handleAddStudent} />
      )}

      <CreateUserForm
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        defaultRole="student"
      />
    </div>
  );
};

export default StudentsManagement;
