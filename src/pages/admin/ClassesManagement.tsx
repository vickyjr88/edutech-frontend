import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ClassesList from '@/components/admin/classes/ClassesList';
import ClassDetails from '@/components/admin/classes/ClassDetails';

/**
 * Classes Management Page
 * Admin interface for managing classes, viewing details, and status updates
 */
const ClassesManagement = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const classId = searchParams.get('id');

    const handleViewClass = (id: string) => {
        navigate(`/admin/classes?id=${id}`);
    };

    const handleBack = () => {
        navigate('/admin/classes');
    };

    return (
        <div>
            {!classId && <h1 className="text-2xl font-bold mb-4">Classes Management</h1>}
            {classId ? (
                <ClassDetails classId={classId} onBack={handleBack} />
            ) : (
                <ClassesList onViewClass={handleViewClass} />
            )}
        </div>
    );
};

export default ClassesManagement;
