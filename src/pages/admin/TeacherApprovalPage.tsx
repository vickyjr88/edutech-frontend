/**
 * Teacher Approval Page
 *
 * Admin page for reviewing and approving teacher applications
 */

import React from 'react';
import TeacherApprovalQueue from '@/components/admin/TeacherApprovalQueue';

export default function TeacherApprovalPage() {
  return (
    <div className="container mx-auto py-6">
      <TeacherApprovalQueue />
    </div>
  );
}
