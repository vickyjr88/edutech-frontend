/**
 * RatingForm Component
 *
 * Form for parents and students to submit ratings for classes/offerings they've taken
 * Only available to users who have paid and attended at least one class
 */

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import MvpRatingService, { Rating, RatingEligibility } from '@/integrations/api/services/mvp-rating.service';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface RatingFormProps {
    offeringId: string;
    teacherId: string;
    offeringTitle: string;
    bookingId?: string;
    enrollmentId?: string;
    onSuccess?: (rating: Rating) => void;
    onCancel?: () => void;
}

export const RatingForm: React.FC<RatingFormProps> = ({
    offeringId,
    teacherId,
    offeringTitle,
    bookingId,
    enrollmentId,
    onSuccess,
    onCancel,
}) => {
    const { toast } = useToast();
    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [review, setReview] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingEligibility, setIsCheckingEligibility] = useState(true);
    const [eligibility, setEligibility] = useState<RatingEligibility | null>(null);
    const [existingRating, setExistingRating] = useState<Rating | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        checkEligibility();
    }, [offeringId]);

    const checkEligibility = async () => {
        setIsCheckingEligibility(true);
        try {
            const eligibilityResult = await MvpRatingService.checkEligibility(offeringId);
            setEligibility(eligibilityResult);

            if (eligibilityResult.existingRating) {
                setExistingRating(eligibilityResult.existingRating);
                setRating(eligibilityResult.existingRating.rating);
                setReview(eligibilityResult.existingRating.review || '');
            }
        } catch (error) {
            console.error('Error checking eligibility:', error);
            toast({
                title: 'Error',
                description: 'Failed to check rating eligibility. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsCheckingEligibility(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toast({
                title: 'Rating Required',
                description: 'Please select a star rating before submitting.',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            let result: Rating;

            if (existingRating) {
                // Update existing rating
                result = await MvpRatingService.updateRating(existingRating._id, {
                    rating,
                    review: review.trim() || undefined,
                });

                toast({
                    title: 'Rating Updated',
                    description: 'Your rating has been updated successfully.',
                });
            } else {
                // Create new rating
                result = await MvpRatingService.createRating({
                    offeringId,
                    teacherId,
                    bookingId,
                    enrollmentId,
                    rating,
                    review: review.trim() || undefined,
                });

                toast({
                    title: 'Rating Submitted',
                    description: 'Thank you for your feedback!',
                });
            }

            setExistingRating(result);
            setIsEditing(false);

            if (onSuccess) {
                onSuccess(result);
            }
        } catch (error: any) {
            console.error('Error submitting rating:', error);
            toast({
                title: 'Submission Failed',
                description: error.response?.data?.message || 'Failed to submit rating. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!existingRating) return;

        if (!confirm('Are you sure you want to delete your rating?')) {
            return;
        }

        setIsSubmitting(true);

        try {
            await MvpRatingService.deleteRating(existingRating._id);

            toast({
                title: 'Rating Deleted',
                description: 'Your rating has been removed.',
            });

            setExistingRating(null);
            setRating(0);
            setReview('');
            setIsEditing(false);
        } catch (error) {
            console.error('Error deleting rating:', error);
            toast({
                title: 'Deletion Failed',
                description: 'Failed to delete rating. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isCheckingEligibility) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full mt-4" />
                </CardContent>
            </Card>
        );
    }

    if (!eligibility?.canRate) {
        return (
            <Alert variant="default" className="border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                    {eligibility?.reason || 'You are not eligible to rate this class yet. Complete at least one paid session to leave a review.'}
                </AlertDescription>
            </Alert>
        );
    }

    // Show existing rating in read-only mode
    if (existingRating && !isEditing) {
        return (
            <Card className="border-green-200 bg-green-50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                Your Rating
                            </CardTitle>
                            <CardDescription>
                                You rated "{offeringTitle}"
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`h-6 w-6 ${
                                    star <= existingRating.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                }`}
                            />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">
                            {existingRating.rating} out of 5 stars
                        </span>
                    </div>

                    {existingRating.review && (
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-700">{existingRating.review}</p>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditing(true)}
                            className="flex-1"
                        >
                            Edit Rating
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            Delete
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Show rating form (new or editing)
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">
                    {existingRating ? 'Edit Your Rating' : 'Rate This Class'}
                </CardTitle>
                <CardDescription>
                    Share your experience with "{offeringTitle}"
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Star Rating */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Your Rating *
                        </label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star
                                        className={`h-8 w-8 ${
                                            star <= (hoverRating || rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                </button>
                            ))}
                            {rating > 0 && (
                                <span className="text-sm text-gray-600 ml-2">
                                    {rating} out of 5 stars
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Written Review */}
                    <div className="space-y-2">
                        <label htmlFor="review" className="text-sm font-medium text-gray-700">
                            Your Review (Optional)
                        </label>
                        <Textarea
                            id="review"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Share details about your experience with this class..."
                            rows={4}
                            maxLength={1000}
                            className="resize-none"
                        />
                        <p className="text-xs text-gray-500 text-right">
                            {review.length}/1000 characters
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            type="submit"
                            disabled={isSubmitting || rating === 0}
                            className="flex-1 bg-kidato-purple hover:bg-kidato-dark-blue"
                        >
                            {isSubmitting
                                ? 'Submitting...'
                                : existingRating
                                ? 'Update Rating'
                                : 'Submit Rating'}
                        </Button>
                        {(onCancel || (existingRating && isEditing)) && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    if (isEditing && existingRating) {
                                        setIsEditing(false);
                                        setRating(existingRating.rating);
                                        setReview(existingRating.review || '');
                                    } else if (onCancel) {
                                        onCancel();
                                    }
                                }}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
