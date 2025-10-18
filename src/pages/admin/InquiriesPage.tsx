import React, { useState } from 'react';
import InquiriesList from '@/components/admin/inquiries/InquiriesList';
import InquiryDetails from '@/components/admin/inquiries/InquiryDetails';

const InquiriesPage = () => {
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);

  const handleViewInquiry = (inquiryId) => {
    setSelectedInquiryId(inquiryId);
  };

  const handleBack = () => {
    setSelectedInquiryId(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Inquiries</h1>
      {selectedInquiryId ? (
        <InquiryDetails inquiryId={selectedInquiryId} onBack={handleBack} />
      ) : (
        <InquiriesList onViewInquiry={handleViewInquiry} />
      )}
    </div>
  );
};

export default InquiriesPage;