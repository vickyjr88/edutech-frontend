/**
 * MVP Teacher Rating Service
 *
 * Frontend service for teachers to view and manage their ratings
 */

import { mvpApiClient } from '@/integrations/api/mvp-client';
import { Rating } from './mvp-rating.service';

export interface TeacherRatingStats {
    totalRatings: number;
    verifiedRatings: number;
    disputedRatings: number;
    averageRating: number;
    distribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
    byOffering: Array<{
        offeringId: string;
        offeringTitle: string;
        averageRating: number;
        totalRatings: number;
    }>;
}

export interface TeacherDisputeRequest {
    disputeReason: string;
}

const MvpTeacherRatingService = {
    /**
     * Get all ratings for teacher's offerings
     */
    getMyRatings: async (page: number = 1, limit: number = 20): Promise<{ ratings: Rating[]; total: number; page: number; limit: number }> => {
        return mvpApiClient.get<{ ratings: Rating[]; total: number; page: number; limit: number }>(
            `/ratings/teacher/my-ratings?page=${page}&limit=${limit}`
        );
    },

    /**
     * Get teacher's rating statistics
     */
    getStats: async (): Promise<TeacherRatingStats> => {
        return mvpApiClient.get<TeacherRatingStats>('/ratings/teacher/stats');
    },

    /**
     * Dispute a rating
     */
    disputeRating: async (ratingId: string, data: TeacherDisputeRequest): Promise<Rating> => {
        return mvpApiClient.post<Rating>(`/ratings/${ratingId}/teacher-dispute`, data);
    },
};

export default MvpTeacherRatingService;
