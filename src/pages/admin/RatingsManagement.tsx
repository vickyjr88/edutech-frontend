/**
 * Admin Ratings Management Page
 *
 * Allows administrators to manage ratings and resolve disputes
 */

import React, { useState, useEffect } from 'react';
import { Star, Shield, AlertTriangle, CheckCircle, X, Eye, Ban, Trash2, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import MvpAdminRatingService, { AdminRatingStats } from '@/integrations/api/services/mvp-admin-rating.service';
import { Rating } from '@/integrations/api/services/mvp-rating.service';
import { formatDistanceToNow } from 'date-fns';

export default function RatingsManagement() {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('all');
    const [stats, setStats] = useState<AdminRatingStats | null>(null);
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [disputedRatings, setDisputedRatings] = useState<Rating[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
    const [actionDialog, setActionDialog] = useState<{
        open: boolean;
        type: 'dispute' | 'verify' | 'unverify' | 'resolve' | null;
        rating: Rating | null;
    }>({ open: false, type: null, rating: null });
    const [actionData, setActionData] = useState<{
        reason?: string;
        notes?: string;
        action?: 'keep-verified' | 'unverify' | 'delete';
    }>({});

    useEffect(() => {
        loadData();
    }, [activeTab, page]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [statsData] = await Promise.all([
                MvpAdminRatingService.getStats(),
            ]);

            setStats(statsData);

            if (activeTab === 'all') {
                const result = await MvpAdminRatingService.getAllRatings({}, page, 20);
                setRatings(result.ratings);
                setTotal(result.total);
            } else if (activeTab === 'disputed') {
                const result = await MvpAdminRatingService.getDisputedRatings(page, 20);
                setDisputedRatings(result.ratings);
                setTotal(result.total);
            } else if (activeTab === 'verified') {
                const result = await MvpAdminRatingService.getAllRatings({ isVerified: true }, page, 20);
                setRatings(result.ratings);
                setTotal(result.total);
            } else if (activeTab === 'unverified') {
                const result = await MvpAdminRatingService.getAllRatings({ isVerified: false }, page, 20);
                setRatings(result.ratings);
                setTotal(result.total);
            }
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

    const handleAction = async () => {
        if (!actionDialog.rating) return;

        try {
            if (actionDialog.type === 'dispute') {
                await MvpAdminRatingService.markAsDisputed(actionDialog.rating._id, {
                    disputeReason: actionData.reason || '',
                    adminNotes: actionData.notes,
                });
                toast({ title: 'Success', description: 'Rating marked as disputed' });
            } else if (actionDialog.type === 'verify') {
                await MvpAdminRatingService.updateVerification(actionDialog.rating._id, {
                    isVerified: true,
                    adminNotes: actionData.notes,
                });
                toast({ title: 'Success', description: 'Rating verified' });
            } else if (actionDialog.type === 'unverify') {
                await MvpAdminRatingService.updateVerification(actionDialog.rating._id, {
                    isVerified: false,
                    adminNotes: actionData.notes,
                });
                toast({ title: 'Success', description: 'Rating unverified' });
            } else if (actionDialog.type === 'resolve' && actionData.action) {
                await MvpAdminRatingService.resolveDispute(actionDialog.rating._id, {
                    action: actionData.action,
                    resolutionNotes: actionData.notes,
                });
                toast({ title: 'Success', description: 'Dispute resolved' });
            }

            setActionDialog({ open: false, type: null, rating: null });
            setActionData({});
            loadData();
        } catch (error: any) {
            console.error('Error performing action:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to perform action',
                variant: 'destructive',
            });
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
        );
    };

    const renderRatingCard = (rating: Rating) => (
        <Card key={rating._id} className={`${rating.isDisputed ? 'border-red-300 bg-red-50' : ''}`}>
            <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={rating.userAvatar} />
                            <AvatarFallback>{rating.userName?.charAt(0) || '?'}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium">{rating.userName || 'Anonymous'}</span>
                                {rating.isVerified && (
                                    <Badge variant="outline" className="text-xs border-green-500 text-green-700 bg-green-50">
                                        <Shield className="h-3 w-3 mr-1" />
                                        Verified
                                    </Badge>
                                )}
                                {rating.isDisputed && (
                                    <Badge variant="outline" className="text-xs border-red-500 text-red-700 bg-red-50">
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        Disputed
                                    </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                    {rating.userRole}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-2">
                                {renderStars(rating.rating)}
                                <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(new Date(rating.createdAt), { addSuffix: true })}
                                </span>
                            </div>

                            {rating.review && (
                                <p className="text-sm text-gray-700">{rating.review}</p>
                            )}

                            {rating.isDisputed && rating.disputeReason && (
                                <div className="mt-2 p-3 bg-red-100 rounded-lg border border-red-200">
                                    <p className="text-xs font-medium text-red-900 mb-1">Dispute Reason:</p>
                                    <p className="text-sm text-red-800">{rating.disputeReason}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedRating(rating)}
                        >
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                        </Button>

                        {!rating.isDisputed && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => setActionDialog({ open: true, type: 'dispute', rating })}
                            >
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Dispute
                            </Button>
                        )}

                        {rating.isDisputed && (
                            <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => setActionDialog({ open: true, type: 'resolve', rating })}
                            >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Resolve
                            </Button>
                        )}

                        {rating.isVerified && !rating.isDisputed && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setActionDialog({ open: true, type: 'unverify', rating })}
                            >
                                <Ban className="h-4 w-4 mr-1" />
                                Unverify
                            </Button>
                        )}

                        {!rating.isVerified && !rating.isDisputed && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => setActionDialog({ open: true, type: 'verify', rating })}
                            >
                                <Check className="h-4 w-4 mr-1" />
                                Verify
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Ratings Management</h1>
                <p className="text-gray-600 mt-2">Manage and moderate ratings and reviews</p>
            </div>

            {/* Statistics */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Ratings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalRatings}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600">Verified</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.verifiedRatings}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600">Disputed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.disputedRatings}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.averageRating.toFixed(1)}</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Ratings List */}
            <Card>
                <CardHeader>
                    <CardTitle>Ratings</CardTitle>
                    <CardDescription>View and manage all ratings</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-4 mb-6">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="disputed">
                                Disputed
                                {stats && stats.disputedRatings > 0 && (
                                    <Badge variant="destructive" className="ml-2">{stats.disputedRatings}</Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="verified">Verified</TabsTrigger>
                            <TabsTrigger value="unverified">Unverified</TabsTrigger>
                        </TabsList>

                        <TabsContent value={activeTab} className="space-y-4">
                            {isLoading ? (
                                <>
                                    {[1, 2, 3].map((i) => (
                                        <Card key={i}>
                                            <CardContent className="pt-6">
                                                <div className="flex items-start gap-4">
                                                    <Skeleton className="h-12 w-12 rounded-full" />
                                                    <div className="flex-1 space-y-2">
                                                        <Skeleton className="h-4 w-32" />
                                                        <Skeleton className="h-4 w-full" />
                                                        <Skeleton className="h-4 w-3/4" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {(activeTab === 'disputed' ? disputedRatings : ratings).length === 0 ? (
                                        <div className="text-center py-12 text-gray-500">
                                            <p>No ratings found</p>
                                        </div>
                                    ) : (
                                        (activeTab === 'disputed' ? disputedRatings : ratings).map(renderRatingCard)
                                    )}

                                    {/* Pagination */}
                                    {total > 20 && (
                                        <div className="flex justify-center gap-2 mt-6">
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
                                </>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Action Dialog */}
            <Dialog open={actionDialog.open} onOpenChange={(open) => {
                if (!open) {
                    setActionDialog({ open: false, type: null, rating: null });
                    setActionData({});
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {actionDialog.type === 'dispute' && 'Mark as Disputed'}
                            {actionDialog.type === 'verify' && 'Verify Rating'}
                            {actionDialog.type === 'unverify' && 'Unverify Rating'}
                            {actionDialog.type === 'resolve' && 'Resolve Dispute'}
                        </DialogTitle>
                        <DialogDescription>
                            {actionDialog.type === 'dispute' && 'Provide a reason for disputing this rating'}
                            {actionDialog.type === 'verify' && 'Confirm this rating as verified'}
                            {actionDialog.type === 'unverify' && 'Remove verification from this rating'}
                            {actionDialog.type === 'resolve' && 'Choose how to resolve this dispute'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {actionDialog.type === 'dispute' && (
                            <>
                                <div>
                                    <Label htmlFor="reason">Dispute Reason *</Label>
                                    <Textarea
                                        id="reason"
                                        value={actionData.reason || ''}
                                        onChange={(e) => setActionData({ ...actionData, reason: e.target.value })}
                                        placeholder="Explain why this rating is being disputed..."
                                        rows={3}
                                    />
                                </div>
                            </>
                        )}

                        {actionDialog.type === 'resolve' && (
                            <div>
                                <Label>Resolution Action *</Label>
                                <div className="space-y-2 mt-2">
                                    <Button
                                        variant={actionData.action === 'keep-verified' ? 'default' : 'outline'}
                                        className="w-full justify-start"
                                        onClick={() => setActionData({ ...actionData, action: 'keep-verified' })}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Keep as Verified
                                    </Button>
                                    <Button
                                        variant={actionData.action === 'unverify' ? 'default' : 'outline'}
                                        className="w-full justify-start"
                                        onClick={() => setActionData({ ...actionData, action: 'unverify' })}
                                    >
                                        <Ban className="h-4 w-4 mr-2" />
                                        Unverify Rating
                                    </Button>
                                    <Button
                                        variant={actionData.action === 'delete' ? 'default' : 'outline'}
                                        className="w-full justify-start text-red-600 hover:text-red-700"
                                        onClick={() => setActionData({ ...actionData, action: 'delete' })}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Rating
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div>
                            <Label htmlFor="notes">Admin Notes (Internal)</Label>
                            <Textarea
                                id="notes"
                                value={actionData.notes || ''}
                                onChange={(e) => setActionData({ ...actionData, notes: e.target.value })}
                                placeholder="Add internal notes about this action..."
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setActionDialog({ open: false, type: null, rating: null });
                                setActionData({});
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAction}
                            disabled={
                                (actionDialog.type === 'dispute' && !actionData.reason) ||
                                (actionDialog.type === 'resolve' && !actionData.action)
                            }
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
