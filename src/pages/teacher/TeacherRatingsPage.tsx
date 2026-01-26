/**
 * Teacher Ratings Page
 *
 * Allows teachers to view all their ratings and dispute unfair ones
 */

import React, { useState, useEffect } from 'react';
import { Star, Shield, AlertTriangle, TrendingUp, Award, BookOpen, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MvpTeacherRatingService, { TeacherRatingStats } from '@/integrations/api/services/mvp-teacher-rating.service';
import { Rating } from '@/integrations/api/services/mvp-rating.service';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

export default function TeacherRatingsPage() {
    const { toast } = useToast();
    const [stats, setStats] = useState<TeacherRatingStats | null>(null);
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [disputeDialog, setDisputeDialog] = useState<{
        open: boolean;
        rating: Rating | null;
    }>({ open: false, rating: null });
    const [disputeReason, setDisputeReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadData();
    }, [page]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [statsData, ratingsData] = await Promise.all([
                MvpTeacherRatingService.getStats(),
                MvpTeacherRatingService.getMyRatings(page, 20),
            ]);

            setStats(statsData);
            setRatings(ratingsData.ratings);
            setTotal(ratingsData.total);
        } catch (error) {
            console.error('Error loading ratings:', error);
            toast({
                title: 'Error',
                description: 'Failed to load ratings data',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDispute = async () => {
        if (!disputeDialog.rating || !disputeReason.trim()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await MvpTeacherRatingService.disputeRating(disputeDialog.rating._id, {
                disputeReason: disputeReason.trim(),
            });

            toast({
                title: 'Dispute Submitted',
                description: 'Your dispute has been submitted for admin review. You will be notified of the outcome.',
            });

            setDisputeDialog({ open: false, rating: null });
            setDisputeReason('');
            loadData();
        } catch (error: any) {
            console.error('Error submitting dispute:', error);
            toast({
                title: 'Dispute Failed',
                description: error.response?.data?.message || 'Failed to submit dispute. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
        const sizeClass = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-5 w-5';
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

    const getStarPercentage = (starCount: number): number => {
        if (!stats || stats.totalRatings === 0) return 0;
        return (stats.distribution[starCount as keyof typeof stats.distribution] / stats.totalRatings) * 100;
    };

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">My Ratings & Reviews</h1>
                <p className="text-gray-600 mt-2">View and manage ratings from your students</p>
            </div>

            {/* Statistics Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
                                <Star className="h-4 w-4 text-yellow-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-yellow-600">
                                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '-'}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">out of 5.0</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-600">Total Reviews</CardTitle>
                                <Award className="h-4 w-4 text-kidato-purple" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{stats.totalRatings}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                {stats.verifiedRatings} verified
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-600">Disputed</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-orange-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-orange-600">{stats.disputedRatings}</div>
                            <p className="text-xs text-gray-500 mt-1">under review</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-600">Classes Rated</CardTitle>
                                <BookOpen className="h-4 w-4 text-blue-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-600">{stats.byOffering.length}</div>
                            <p className="text-xs text-gray-500 mt-1">with reviews</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Rating Distribution */}
            {stats && stats.totalRatings > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Rating Distribution</CardTitle>
                        <CardDescription>Breakdown of your ratings by star level</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((stars) => (
                                <div key={stars} className="flex items-center gap-4">
                                    <div className="flex items-center gap-1 w-20">
                                        <span className="text-sm font-medium text-gray-700">{stars}</span>
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    </div>
                                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                                            style={{ width: `${getStarPercentage(stars)}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-600 w-16 text-right">
                                        {stats.distribution[stars as keyof typeof stats.distribution]} ({getStarPercentage(stars).toFixed(0)}%)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Ratings by Class */}
            {stats && stats.byOffering.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Ratings by Class</CardTitle>
                        <CardDescription>Performance breakdown by offering</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats.byOffering.map((offering) => (
                                <div
                                    key={offering.offeringId}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex-1">
                                        <Link
                                            to={`/class/${offering.offeringId}`}
                                            className="font-medium text-gray-900 hover:text-kidato-purple"
                                        >
                                            {offering.offeringTitle}
                                        </Link>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {offering.totalRatings} {offering.totalRatings === 1 ? 'review' : 'reviews'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-right">
                                            <div className="flex items-center gap-1">
                                                {renderStars(Math.round(offering.averageRating), 'sm')}
                                            </div>
                                            <p className="text-sm font-medium text-gray-900 mt-1">
                                                {offering.averageRating.toFixed(1)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Info Alert */}
            <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                    If you believe a rating is unfair, inaccurate, or violates our community guidelines, you can dispute it.
                    Our admin team will review your dispute and take appropriate action.
                </AlertDescription>
            </Alert>

            {/* Individual Ratings */}
            <Card>
                <CardHeader>
                    <CardTitle>All Reviews</CardTitle>
                    <CardDescription>Individual ratings from your students</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex items-start gap-4">
                                        <Skeleton className="h-12 w-12 rounded-full" />
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
                        <div className="text-center py-12 text-gray-500">
                            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="font-medium">No ratings yet</p>
                            <p className="text-sm mt-2">
                                Your students will be able to rate your classes after completing sessions
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {ratings.map((rating) => (
                                <div
                                    key={rating._id}
                                    className={`p-4 rounded-lg border ${
                                        rating.isDisputed ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-white'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={rating.userAvatar} />
                                            <AvatarFallback>{rating.userName?.charAt(0) || '?'}</AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-medium text-gray-900">
                                                        {rating.userName || 'Anonymous'}
                                                    </span>
                                                    {rating.isVerified && !rating.isDisputed && (
                                                        <Badge variant="outline" className="text-xs border-green-500 text-green-700 bg-green-50">
                                                            <Shield className="h-3 w-3 mr-1" />
                                                            Verified
                                                        </Badge>
                                                    )}
                                                    {rating.isDisputed && (
                                                        <Badge variant="outline" className="text-xs border-orange-500 text-orange-700 bg-orange-50">
                                                            <AlertTriangle className="h-3 w-3 mr-1" />
                                                            Under Review
                                                        </Badge>
                                                    )}
                                                    {!rating.isVerified && !rating.isDisputed && (
                                                        <Badge variant="outline" className="text-xs border-gray-400 text-gray-600">
                                                            Unverified
                                                        </Badge>
                                                    )}
                                                </div>
                                                {!rating.isDisputed && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                                        onClick={() => setDisputeDialog({ open: true, rating })}
                                                    >
                                                        <AlertTriangle className="h-4 w-4 mr-1" />
                                                        Dispute
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {renderStars(rating.rating, 'sm')}
                                                <span className="text-xs text-gray-500">
                                                    {formatDistanceToNow(new Date(rating.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>

                                            {/* Class Name */}
                                            {(rating as any).offeringId?.title && (
                                                <p className="text-sm text-gray-600">
                                                    Class: <span className="font-medium">{(rating as any).offeringId.title}</span>
                                                </p>
                                            )}

                                            {rating.review && (
                                                <p className="text-sm text-gray-700 leading-relaxed">
                                                    {rating.review}
                                                </p>
                                            )}

                                            {rating.isDisputed && rating.disputeReason && (
                                                <div className="mt-2 p-3 bg-orange-100 rounded-lg border border-orange-200">
                                                    <p className="text-xs font-medium text-orange-900 mb-1">Dispute Status:</p>
                                                    <p className="text-sm text-orange-800">{rating.disputeReason}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Pagination */}
                            {total > 20 && (
                                <div className="flex justify-center gap-2 mt-6 pt-6 border-t">
                                    <Button
                                        variant="outline"
                                        disabled={page === 1}
                                        onClick={() => setPage(page - 1)}
                                    >
                                        Previous
                                    </Button>
                                    <span className="py-2 px-4 text-sm text-gray-600">
                                        Page {page} of {Math.ceil(total / 20)}
                                    </span>
                                    <Button
                                        variant="outline"
                                        disabled={page >= Math.ceil(total / 20)}
                                        onClick={() => setPage(page + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Dispute Dialog */}
            <Dialog
                open={disputeDialog.open}
                onOpenChange={(open) => {
                    if (!open) {
                        setDisputeDialog({ open: false, rating: null });
                        setDisputeReason('');
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Dispute Rating</DialogTitle>
                        <DialogDescription>
                            Explain why you believe this rating is unfair or inaccurate. Our admin team will review your dispute.
                        </DialogDescription>
                    </DialogHeader>

                    {disputeDialog.rating && (
                        <div className="space-y-4">
                            {/* Rating Preview */}
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2 mb-2">
                                    {renderStars(disputeDialog.rating.rating, 'sm')}
                                    <span className="text-sm text-gray-600">
                                        by {disputeDialog.rating.userName || 'Anonymous'}
                                    </span>
                                </div>
                                {disputeDialog.rating.review && (
                                    <p className="text-sm text-gray-700 mt-2">{disputeDialog.rating.review}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="disputeReason">Reason for Dispute *</Label>
                                <Textarea
                                    id="disputeReason"
                                    value={disputeReason}
                                    onChange={(e) => setDisputeReason(e.target.value)}
                                    placeholder="Please provide a detailed explanation of why this rating should be reviewed..."
                                    rows={4}
                                    maxLength={500}
                                    className="mt-1"
                                />
                                <p className="text-xs text-gray-500 mt-1 text-right">
                                    {disputeReason.length}/500 characters
                                </p>
                            </div>

                            <Alert className="border-blue-200 bg-blue-50">
                                <AlertCircle className="h-4 w-4 text-blue-600" />
                                <AlertDescription className="text-sm text-blue-800">
                                    Valid reasons include: factual inaccuracies, personal attacks, inappropriate content,
                                    or ratings from students who didn't attend the class.
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setDisputeDialog({ open: false, rating: null });
                                setDisputeReason('');
                            }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDispute}
                            disabled={isSubmitting || !disputeReason.trim()}
                            className="bg-orange-600 hover:bg-orange-700"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Dispute'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
