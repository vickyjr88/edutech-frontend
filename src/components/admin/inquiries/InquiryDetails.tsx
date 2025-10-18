import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InquiryDetails = ({ inquiryId, onBack }) => {
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        const response = await api.get(`/inquiries/${inquiryId}`);
        setInquiry(response.data);
      } catch (error) {
        console.error(`Error fetching inquiry ${inquiryId}:`, error);
      } finally {
        setLoading(false);
      }
    };

    if (inquiryId) {
      fetchInquiry();
    }
  }, [inquiryId]);

  const handleMarkAsRead = async () => {
    try {
      await api.patch(`/inquiries/${inquiryId}/read`);
      setInquiry({ ...inquiry, isRead: true });
    } catch (error) {
      console.error(`Error marking inquiry ${inquiryId} as read:`, error);
    }
  };

  const handleArchive = async () => {
    try {
      await api.patch(`/inquiries/${inquiryId}/archive`);
      setInquiry({ ...inquiry, isArchived: true });
    } catch (error) {
      console.error(`Error archiving inquiry ${inquiryId}:`, error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!inquiry) {
    return <div>Inquiry not found</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{inquiry.subject}</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>From:</strong> {inquiry.fullName} ({inquiry.email})</p>
        <p><strong>Message:</strong></p>
        <p>{inquiry.message}</p>
        <div className="mt-4">
          {!inquiry.isRead && <Button onClick={handleMarkAsRead} className="mr-2">Mark as Read</Button>}
          {!inquiry.isArchived && <Button onClick={handleArchive} variant="destructive">Archive</Button>}
          <Button onClick={onBack} variant="outline" className="ml-2">Back to List</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InquiryDetails;
