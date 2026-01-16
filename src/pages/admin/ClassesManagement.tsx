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
    const type = searchParams.get('type') as 'class' | 'offering' | null;

    const handleViewClass = (id: string, type: 'class' | 'offering') => {
        navigate(`/admin/classes?id=${id}&type=${type}`);
    };

    const handleBack = () => {
        navigate('/admin/classes');
    };

    return (
        <div>
            {!classId && <h1 className="text-2xl font-bold mb-4">Classes Management</h1>}
            {classId ? (
                <ClassDetails classId={classId} type={type || 'class'} onBack={handleBack} />
            ) : (
                <ClassesList onViewClass={handleViewClass} />
            )}
        </div>
    );
};

export default ClassesManagement;
