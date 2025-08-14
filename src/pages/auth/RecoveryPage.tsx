import React from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import { OryRecoveryForm } from '@/components/auth/OryRecoveryForm';

const RecoveryPage: React.FC = () => {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Remember your password?"
      authType="recovery"
    >
      <OryRecoveryForm />
    </AuthLayout>
  );
};

export default RecoveryPage;
