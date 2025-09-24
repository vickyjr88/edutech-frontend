import React from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import { OryVerificationForm } from '@/components/auth/OryVerificationForm';

export const VerificationPage: React.FC = () => {
  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="Complete your account setup by verifying your email address"
      authType="signup"
    >
      <OryVerificationForm />
    </AuthLayout>
  );
};