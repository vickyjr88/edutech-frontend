import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const InquiriesList = ({ onViewInquiry }) => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await api.get('/inquiries');
        setInquiries(response.data);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Full Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inquiries.map((inquiry: any) => (
          <TableRow key={inquiry._id}>
            <TableCell>{inquiry.fullName}</TableCell>
            <TableCell>{inquiry.email}</TableCell>
            <TableCell>{inquiry.subject}</TableCell>
            <TableCell>
              {inquiry.isRead ? <Badge variant="secondary">Read</Badge> : <Badge>Unread</Badge>}
              {inquiry.isArchived && <Badge variant="destructive">Archived</Badge>}
            </TableCell>
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => onViewInquiry(inquiry._id)}>View</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InquiriesList;
