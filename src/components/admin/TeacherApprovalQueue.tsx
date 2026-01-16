/**
 * MVP Teacher Approval Queue
 *
 * Admin interface to review and approve/reject teacher applications
 * - View pending teacher profiles
 * - Review profile details
 * - Approve or reject with comments
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  FileText,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mvpApiClient } from '@/integrations/api/mvp-client';

interface PendingTeacher {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  city: string;
  bio: string;
  subjects: string[];
  curriculums: string[];
  gradeLevels: string[];
  yearsOfExperience: number;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    certificateUrl?: string;
  }>;
  profilePhotoUrl?: string;
  submittedAt: string;
}

export default function TeacherApprovalQueue() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [pendingTeachers, setPendingTeachers] = useState<PendingTeacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<PendingTeacher | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);
  const [reviewComments, setReviewComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPendingTeachers();
  }, []);

  const loadPendingTeachers = async () => {
    try {
      setIsLoading(true);

      // Fetch pending teachers from API
      const { data, error } = await mvpApiClient.get<PendingTeacher[]>('/teachers/pending');

      if (error) {
        throw new Error(error.message || 'Failed to fetch pending teachers');
      }

      setPendingTeachers(data || []);
    } catch (error) {
      console.error('Error loading pending teachers:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load pending teachers. Please try again.',
      });
      setPendingTeachers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = (teacher: PendingTeacher, action: 'approve' | 'reject') => {
    setSelectedTeacher(teacher);
    setReviewAction(action);
    setReviewComments('');
    setShowReviewDialog(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedTeacher || !reviewAction) return;

    try {
      setIsSubmitting(true);

      let response;
      if (reviewAction === 'approve') {
        response = await mvpApiClient.post(
          `/teachers/${selectedTeacher._id}/approve`,
          { comments: reviewComments }
        );
      } else {
        response = await mvpApiClient.post(
          `/teachers/${selectedTeacher._id}/reject`,
          { reason: reviewComments }
        );
      }

      if (response.error) {
        throw new Error(response.error.message || 'Failed to submit review');
      }

      // Remove from pending list
      setPendingTeachers(prev =>
        prev.filter(t => t._id !== selectedTeacher._id)
      );

      toast({
        title: reviewAction === 'approve' ? 'Teacher approved' : 'Teacher rejected',
        description: `${selectedTeacher.fullName} has been ${reviewAction}d.`,
      });

      setShowReviewDialog(false);
      setSelectedTeacher(null);
      setReviewComments('');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit review. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-600">Loading pending applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Teacher Approval Queue</h2>
          <p className="text-gray-600 mt-1">
            Review and approve teacher applications
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Clock className="h-4 w-4 mr-2" />
          {pendingTeachers.length} Pending
        </Badge>
      </div>

      {/* Pending Applications */}
      {pendingTeachers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
            <p className="text-gray-600 text-center">
              There are no pending teacher applications to review.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingTeachers.map((teacher) => (
            <Card key={teacher._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                      {teacher.fullName.charAt(0)}
                    </div>

                    {/* Info */}
                    <div>
                      <CardTitle className="text-xl">{teacher.fullName}</CardTitle>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {teacher.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {teacher.phoneNumber}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {teacher.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-50"
                      onClick={() => handleReview(teacher, 'approve')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleReview(teacher, 'reject')}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Bio */}
                <div>
                  <Label className="text-sm font-medium mb-1 block">Bio</Label>
                  <p className="text-sm text-gray-700">{teacher.bio}</p>
                </div>

                {/* Teaching Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      Subjects
                    </Label>
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.map(subject => (
                        <Badge key={subject} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Curriculums</Label>
                    <div className="flex flex-wrap gap-1">
                      {teacher.curriculums.map(curriculum => (
                        <Badge key={curriculum} variant="outline" className="text-xs">
                          {curriculum}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" />
                      Experience
                    </Label>
                    <p className="text-sm font-medium">{teacher.yearsOfExperience} years</p>
                  </div>
                </div>

                {/* Education */}
                {teacher.education.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" />
                      Education
                    </Label>
                    <div className="space-y-2">
                      {teacher.education.map((edu, index) => (
                        <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                          <p className="font-medium">{edu.degree}</p>
                          <p className="text-gray-600">
                            {edu.institution} • {edu.year}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {teacher.certifications.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      Certifications
                    </Label>
                    <div className="space-y-2">
                      {teacher.certifications.map((cert, index) => (
                        <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                          <p className="font-medium">{cert.name}</p>
                          <p className="text-gray-600">Issued by: {cert.issuer}</p>
                          {cert.certificateUrl && (
                            <a
                              href={cert.certificateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-xs"
                            >
                              View Certificate
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Approve' : 'Reject'} Teacher Application
            </DialogTitle>
            <DialogDescription>
              {reviewAction === 'approve'
                ? 'This teacher will be able to create offerings and accept bookings.'
                : 'This teacher will be notified of the rejection.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedTeacher && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {selectedTeacher.fullName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{selectedTeacher.fullName}</p>
                  <p className="text-sm text-gray-600">{selectedTeacher.email}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="comments">
                Comments {reviewAction === 'reject' ? '(Required)' : '(Optional)'}
              </Label>
              <Textarea
                id="comments"
                placeholder={
                  reviewAction === 'approve'
                    ? 'Optional feedback for the teacher...'
                    : 'Please provide a reason for rejection...'
                }
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReviewDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={
                isSubmitting ||
                (reviewAction === 'reject' && !reviewComments.trim())
              }
              className={
                reviewAction === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              {isSubmitting ? (
                'Processing...'
              ) : reviewAction === 'approve' ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Teacher
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Application
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
