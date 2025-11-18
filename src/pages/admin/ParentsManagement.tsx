import { useNavigate, useSearchParams } from 'react-router-dom';
import ParentsList from '@/components/admin/parents/ParentsList';
import ParentDetails from '@/components/admin/parents/ParentDetails';

/**
 * Parents Management Page
 * Admin interface for managing parents, viewing details, and accessing resources
 * Supports URL-based navigation with ?id=<parentId> for easy sharing and bookmarking
 */
const ParentsManagement = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const parentId = searchParams.get('id');

  const handleViewParent = (parentId: string) => {
    navigate(`/admin/parents?id=${parentId}`);
  };

  const handleBack = () => {
    navigate('/admin/parents');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Parents Management</h1>
      {parentId ? (
        <ParentDetails parentId={parentId} onBack={handleBack} />
      ) : (
        <ParentsList onViewParent={handleViewParent} />
      )}
    </div>
  );
};

export default ParentsManagement;
