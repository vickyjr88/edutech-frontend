import api from '../client';

export interface CreateReviewRequest {
  reviewerName: string;
  reviewerEmail: string;
  reviewerType: 'student' | 'parent' | 'supervisor' | 'other';
  customMessage?: string;
}

export interface SubmitReview {
  rating: number;
  comment?: string;
}

export interface Review {
  _id: string;
  teacherId: string;
  reviewerId?: string;
  reviewerName: string;
  reviewerEmail: string;
  reviewerType: string;
  rating?: number;
  comment?: string;
  status: 'pending' | 'completed';
  invitationSentAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const reviewService = {
  createRequest: (data: CreateReviewRequest) =>
    api.post<Review>('/reviews/request', data),

  getPendingReviews: () =>
    api.get<Review[]>('/reviews/pending'),

  getCompletedReviews: () =>
    api.get<Review[]>('/reviews/completed'),

  submitReview: (reviewId: string, data: SubmitReview) =>
    api.patch<Review>(`/reviews/${reviewId}/submit`, data),

  resendRequest: (reviewId: string) =>
    api.post<Review>(`/reviews/${reviewId}/resend`, {}),
};
