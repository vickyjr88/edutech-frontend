/**
 * MVP Admin Rating Service
 *
 * Frontend service for admin rating management and dispute resolution
 */

import { mvpApiClient } from '@/integrations/api/mvp-client';
import { Rating } from './mvp-rating.service';

export interface MarkDisputedRequest {
    disputeReason: string;
    adminNotes?: string;
}

export interface UpdateVerificationRequest {
    isVerified: boolean;
    adminNotes?: string;
}

export interface ResolveDisputeRequest {
    action: 'keep-verified' | 'unverify' | 'delete';
    resolutionNotes?: string;
}

export interface RatingFilters {
    isVerified?: boolean;
    isDisputed?: boolean;
    isActive?: boolean;
}

export interface AdminRatingStats {
    totalRatings: number;
    verifiedRatings: number;
    disputedRatings: number;
    averageRating: number;
    recentRatings: Rating[];
}

const MvpAdminRatingService = {
    /**
     * Get rating statistics for admin dashboard
     */
    getStats: async (): Promise<AdminRatingStats> => {
        return mvpApiClient.get<AdminRatingStats>('/admin/ratings/stats');
    },

    /**
     * Get all disputed ratings
     */
    getDisputedRatings: async (page: number = 1, limit: number = 20): Promise<{ ratings: Rating[]; total: number; page: number; limit: number }> => {
        return mvpApiClient.get<{ ratings: Rating[]; total: number; page: number; limit: number }>(`/admin/ratings/disputed?page=${page}&limit=${limit}`);
    },

    /**
     * Get rating by ID with full details
     */
    getRatingById: async (ratingId: string): Promise<Rating> => {
        return mvpApiClient.get<Rating>(`/admin/ratings/${ratingId}`);
    },

    /**
     * Get all ratings with filters
     */
    getAllRatings: async (
        filters: RatingFilters,
        page: number = 1,
        limit: number = 20,
    ): Promise<{ ratings: Rating[]; total: number; page: number; limit: number }> => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        if (filters.isVerified !== undefined) {
            params.append('isVerified', filters.isVerified.toString());
        }
        if (filters.isDisputed !== undefined) {
            params.append('isDisputed', filters.isDisputed.toString());
        }
        if (filters.isActive !== undefined) {
            params.append('isActive', filters.isActive.toString());
        }

        return mvpApiClient.get<{ ratings: Rating[]; total: number; page: number; limit: number }>(
            `/admin/ratings?${params.toString()}`,
        );
    },

    /**
     * Mark a rating as disputed
     */
    markAsDisputed: async (ratingId: string, data: MarkDisputedRequest): Promise<Rating> => {
        return mvpApiClient.post<Rating>(`/admin/ratings/${ratingId}/dispute`, data);
    },

    /**
     * Update rating verification status
     */
    updateVerification: async (ratingId: string, data: UpdateVerificationRequest): Promise<Rating> => {
        return mvpApiClient.put<Rating>(`/admin/ratings/${ratingId}/verification`, data);
    },

    /**
     * Resolve a disputed rating
     */
    resolveDispute: async (ratingId: string, data: ResolveDisputeRequest): Promise<Rating | { message: string }> => {
        return mvpApiClient.post<Rating | { message: string }>(`/admin/ratings/${ratingId}/resolve`, data);
    },
};

export default MvpAdminRatingService;
