/**
 * RatingDisplay Component
 *
 * Displays ratings and reviews for classes/offerings and teachers
 * Shows rating statistics, distribution, and individual reviews
 */

import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import MvpRatingService, { Rating, RatingStats } from '@/integrations/api/services/mvp-rating.service';
import { formatDistanceToNow } from 'date-fns';

interface RatingDisplayProps {
    type: 'offering' | 'teacher';
    id: string; // offeringId or teacherId
    showStats?: boolean;
    showReviews?: boolean;
    initialLimit?: number;
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
    type,
    id,
    showStats = true,
    showReviews = true,
    initialLimit = 5,
}) => {
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [stats, setStats] = useState<RatingStats | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [isLoadingRatings, setIsLoadingRatings] = useState(true);
    const [page, setPage] = useState(1);
    const [totalRatings, setTotalRatings] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        if (showStats) {
            loadStats();
        }
        if (showReviews) {
            loadRatings();
        }
    }, [id, type, page]);

    const loadStats = async () => {
        setIsLoadingStats(true);
        try {
            const statsData = type === 'offering'
                ? await MvpRatingService.getOfferingStats(id)
                : await MvpRatingService.getTeacherStats(id);
            setStats(statsData);
        } catch (error) {
            console.error('Error loading rating stats:', error);
        } finally {
            setIsLoadingStats(false);
        }
    };

    const loadRatings = async () => {
        setIsLoadingRatings(true);
        try {
            const response = type === 'offering'
                ? await MvpRatingService.getOfferingRatings(id, page, initialLimit)
                : await MvpRatingService.getTeacherRatings(id, page, initialLimit);

            setRatings(response.ratings);
            setTotalRatings(response.total);
            setHasMore(response.total > page * initialLimit);
        } catch (error) {
            console.error('Error loading ratings:', error);
        } finally {
            setIsLoadingRatings(false);
        }
    };

    const getStarPercentage = (starCount: number): number => {
        if (!stats || stats.totalRatings === 0) return 0;
        return (stats.distribution[starCount as keyof typeof stats.distribution] / stats.totalRatings) * 100;
    };

    const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
        const sizeClass = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${sizeClass} ${
                            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                    />
                ))}
            </div>
        );
    };

    if (isLoadingStats && showStats) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-40 w-full" />
                </CardContent>
            </Card>
        );
    }

    // If no ratings exist
    if (!isLoadingStats && stats && stats.totalRatings === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                    <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No ratings yet</p>
                    <p className="text-sm text-gray-400 mt-2">
                        Be the first to rate this {type === 'offering' ? 'class' : 'teacher'}!
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Rating Statistics */}
            {showStats && stats && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Ratings & Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Average Rating */}
                            <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-kidato-purple/10 to-kidato-dark-blue/10 rounded-lg">
                                <div className="text-5xl font-bold text-kidato-purple mb-2">
                                    {stats.averageRating.toFixed(1)}
                                </div>
                                {renderStars(Math.round(stats.averageRating), 'lg')}
                                <p className="text-sm text-gray-600 mt-2">
                                    Based on {stats.totalRatings} {stats.totalRatings === 1 ? 'review' : 'reviews'}
                                </p>
                            </div>

                            {/* Rating Distribution */}
                            <div className="space-y-2">
                                {[5, 4, 3, 2, 1].map((stars) => (
                                    <div key={stars} className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 w-16">
                                            <span className="text-sm font-medium text-gray-700">{stars}</span>
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        </div>
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                                                style={{ width: `${getStarPercentage(stars)}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 w-12 text-right">
                                            {stats.distribution[stars as keyof typeof stats.distribution]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Individual Reviews */}
            {showReviews && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Student Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingRatings ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-4 w-32" />
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-3/4" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : ratings.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>No reviews yet. Be the first to share your experience!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {ratings.map((rating) => (
                                    <div key={rating._id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                        <div className="flex items-start gap-4">
                                            {/* User Avatar */}
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={rating.userAvatar} />
                                                <AvatarFallback className="bg-kidato-purple text-white">
                                                    {rating.userName?.charAt(0) || '?'}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1 space-y-2">
                                                {/* User Name and Verification */}
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-medium text-gray-900">
                                                        {rating.userName || 'Anonymous'}
                                                    </span>
                                                    {rating.isVerified && !rating.isDisputed && (
                                                        <Badge variant="outline" className="text-xs border-green-500 text-green-700 bg-green-50">
                                                            <Shield className="h-3 w-3 mr-1" />
                                                            Verified Student
                                                        </Badge>
                                                    )}
                                                    {rating.isDisputed && (
                                                        <Badge variant="outline" className="text-xs border-red-500 text-red-700 bg-red-50">
                                                            <AlertTriangle className="h-3 w-3 mr-1" />
                                                            Under Review
                                                        </Badge>
                                                    )}
                                                    {!rating.isVerified && !rating.isDisputed && (
                                                        <Badge variant="outline" className="text-xs border-gray-400 text-gray-600">
                                                            Unverified
                                                        </Badge>
                                                    )}
                                                    <Badge variant="outline" className="text-xs">
                                                        {rating.userRole === 'parent' ? 'Parent' : 'Student'}
                                                    </Badge>
                                                </div>

                                                {/* Star Rating */}
                                                <div className="flex items-center gap-2">
                                                    {renderStars(rating.rating, 'sm')}
                                                    <span className="text-xs text-gray-500">
                                                        {formatDistanceToNow(new Date(rating.createdAt), { addSuffix: true })}
                                                    </span>
                                                </div>

                                                {/* Review Text */}
                                                {rating.review && (
                                                    <p className="text-sm text-gray-700 leading-relaxed">
                                                        {rating.review}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Load More Button */}
                                {hasMore && (
                                    <div className="text-center pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => setPage(page + 1)}
                                            disabled={isLoadingRatings}
                                        >
                                            {isLoadingRatings ? 'Loading...' : 'Load More Reviews'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
