/**
 * Simplified Parents Dashboard Page
 *
 * MVP version of the parent dashboard with essential features only
 */

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageWrapper from '@/components/PageWrapper';
import SimplifiedParentDashboard from '@/components/parent/SimplifiedParentDashboard';

export default function SimplifiedParentsDashboardPage() {
  return (
    <PageWrapper>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SimplifiedParentDashboard />
        </div>
      </div>
    </PageWrapper>
  );
}
