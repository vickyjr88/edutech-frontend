import { useState } from 'react';
import ParentsList from '@/components/admin/parents/ParentsList';
import ParentDetails from '@/components/admin/parents/ParentDetails';

/**
 * Parents Management Page
 * Admin interface for managing parents, viewing details, and accessing resources
 */
const ParentsManagement = () => {
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  const handleViewParent = (parentId: string) => {
    setSelectedParentId(parentId);
  };

  const handleBack = () => {
    setSelectedParentId(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Parents Management</h1>
      {selectedParentId ? (
        <ParentDetails parentId={selectedParentId} onBack={handleBack} />
      ) : (
        <ParentsList onViewParent={handleViewParent} />
      )}
    </div>
  );
};

export default ParentsManagement;
