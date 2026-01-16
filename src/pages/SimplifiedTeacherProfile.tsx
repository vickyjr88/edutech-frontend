import React from 'react';
import SimplifiedTeacherProfileForm from '@/components/teacher/SimplifiedTeacherProfileForm';
import PageWrapper from '@/components/PageWrapper';

export default function SimplifiedTeacherProfile() {
  return (
    <PageWrapper>
      <div className="min-h-screen flex flex-col py-8">
        <SimplifiedTeacherProfileForm />
      </div>
    </PageWrapper>
  );
}
