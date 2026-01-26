/**
 * MVP Rating Service
 *
 * Frontend service for managing ratings for teachers and classes/offerings
 */

import { mvpApiClient } from '@/integrations/api/mvp-client';

export interface Rating {
    _id: string;
    userId: string; // Parent or student who submitted the rating
    userRole: 'parent' | 'student';
    userName?: string; // User's full name
    userAvatar?: string; // User's profile image
    offeringId: string; // Class/offering being rated
    teacherId: string; // Teacher being rated
    bookingId?: string; // Related booking (if from a booking)
    enrollmentId?: string; // Related enrollment (if from an enrollment)
    rating: number; // 1-5 stars
    review?: string; // Optional written review
    isVerified: boolean; // Has the user actually taken the class
    isDisputed: boolean; // Is this rating disputed by admin
    disputeReason?: string; // Reason for dispute
    disputedBy?: string; // Admin who disputed
    disputedAt?: string; // When disputed
    adminNotes?: string; // Internal admin notes
    createdAt: string;
    updatedAt?: string;
}

export interface CreateRatingRequest {
    offeringId: string;
    teacherId: string;
    bookingId?: string;
    enrollmentId?: string;
    rating: number; // 1-5
    review?: string;
}

export interface UpdateRatingRequest {
    rating?: number;
    review?: string;
}

export interface RatingEligibility {
    canRate: boolean;
    reason?: string; // Why user can't rate (if canRate is false)
    existingRating?: Rating; // If user has already rated
}

export interface RatingStats {
    averageRating: number;
    totalRatings: number;
    distribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}

const MvpRatingService = {
    /**
     * Check if current user can rate an offering
     */
    checkEligibility: async (offeringId: string): Promise<RatingEligibility> => {
        return mvpApiClient.get<RatingEligibility>(`/ratings/eligibility/${offeringId}`);
    },

    /**
     * Create a new rating
     */
    createRating: async (data: CreateRatingRequest): Promise<Rating> => {
        return mvpApiClient.post<Rating>('/ratings', data);
    },

    /**
     * Update an existing rating
     */
    updateRating: async (ratingId: string, data: UpdateRatingRequest): Promise<Rating> => {
        return mvpApiClient.put<Rating>(`/ratings/${ratingId}`, data);
    },

    /**
     * Delete a rating
     */
    deleteRating: async (ratingId: string): Promise<void> => {
        return mvpApiClient.delete(`/ratings/${ratingId}`);
    },

    /**
     * Get all ratings for an offering
     */
    getOfferingRatings: async (offeringId: string, page: number = 1, limit: number = 10): Promise<{ ratings: Rating[]; total: number; page: number; limit: number }> => {
        return mvpApiClient.get<{ ratings: Rating[]; total: number; page: number; limit: number }>(`/ratings/offering/${offeringId}?page=${page}&limit=${limit}`);
    },

    /**
     * Get all ratings for a teacher
     */
    getTeacherRatings: async (teacherId: string, page: number = 1, limit: number = 10): Promise<{ ratings: Rating[]; total: number; page: number; limit: number }> => {
        return mvpApiClient.get<{ ratings: Rating[]; total: number; page: number; limit: number }>(`/ratings/teacher/${teacherId}?page=${page}&limit=${limit}`);
    },

    /**
     * Get rating statistics for an offering
     */
    getOfferingStats: async (offeringId: string): Promise<RatingStats> => {
        return mvpApiClient.get<RatingStats>(`/ratings/offering/${offeringId}/stats`);
    },

    /**
     * Get rating statistics for a teacher
     */
    getTeacherStats: async (teacherId: string): Promise<RatingStats> => {
        return mvpApiClient.get<RatingStats>(`/ratings/teacher/${teacherId}/stats`);
    },

    /**
     * Get current user's rating for an offering (if exists)
     */
    getMyRating: async (offeringId: string): Promise<Rating | null> => {
        return mvpApiClient.get<Rating | null>(`/ratings/my-rating/${offeringId}`);
    },

    /**
     * Get all ratings submitted by current user
     */
    getMyRatings: async (): Promise<Rating[]> => {
        return mvpApiClient.get<Rating[]>('/ratings/my-ratings');
    },
};

export default MvpRatingService;
