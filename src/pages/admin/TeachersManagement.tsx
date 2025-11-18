import { useNavigate, useSearchParams } from 'react-router-dom';
import TeachersList from '@/components/admin/teachers/TeachersList';
import TeacherDetails from '@/components/admin/teachers/TeacherDetails';

/**
 * Teachers Management Page
 * Admin interface for managing teachers, viewing details, and accessing resources
 * Supports URL-based navigation with ?id=<teacherId> for easy sharing and bookmarking
 */
const TeachersManagement = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const teacherId = searchParams.get('id');

  const handleViewTeacher = (teacherId: string) => {
    navigate(`/admin/teachers?id=${teacherId}`);
  };

  const handleBack = () => {
    navigate('/admin/teachers');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Teachers Management</h1>
      {teacherId ? (
        <TeacherDetails teacherId={teacherId} onBack={handleBack} />
      ) : (
        <TeachersList onViewTeacher={handleViewTeacher} />
      )}
    </div>
  );
};

export default TeachersManagement;
