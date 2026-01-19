import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '@/integrations/api/services/user.service';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, BookOpen, Clock, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function WishlistPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState<string | null>(null);

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        try {
            setLoading(true);
            const response = await userService.getWishlist();
            // Handle response structure depending on backend
            // Assuming response.data is the array of classes or { wishlist: [] }
            const items = Array.isArray(response.data) ? response.data : (response.data as any)?.wishlist || [];
            setWishlist(items);
        } catch (error) {
            console.error('Failed to load wishlist:', error);
            toast.error('Failed to load your wishlist');
        } finally {
            setLoading(false);
        }
    };

    const handRemoveFromWishlist = async (classId: string) => {
        try {
            setRemovingId(classId);
            await userService.removeFromWishlist(classId);
            setWishlist(prev => prev.filter(item => item._id !== classId && item.id !== classId));
            toast.success('Removed from wishlist');
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
            toast.error('Failed to remove item');
        } finally {
            setRemovingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
                <p className="text-muted-foreground mt-2">
                    Classes and offerings you have saved for later.
                </p>
            </div>

            {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                    <div className="rounded-full bg-primary/10 p-4 mb-4">
                        <Heart className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Your wishlist is empty</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm">
                        Browse our classes and save the ones you're interested in to enroll later.
                    </p>
                    <Button className="mt-6" onClick={() => navigate('/all-classes')}>
                        Browse Classes
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {wishlist.map((item) => (
                        <Card key={item._id || item.id} className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative h-48 w-full bg-muted">
                                {item.coverImage ? (
                                    <img
                                        src={item.coverImage}
                                        alt={item.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                        <BookOpen className="h-12 w-12 text-gray-300" />
                                    </div>
                                )}
                                <Badge className="absolute top-2 right-2 bg-white text-black hover:bg-white">
                                    {item.subject}
                                </Badge>
                            </div>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="line-clamp-1 text-lg">{item.title}</CardTitle>
                                        <CardDescription className="line-clamp-1 mt-1">
                                            by {item.teacher?.fullName || 'Verified Teacher'}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 pb-2">
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                    {item.description || item.summary}
                                </p>
                                <div className="flex flex-wrap gap-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center w-1/2">
                                        <Clock className="mr-1.5 h-3.5 w-3.5" />
                                        {item.sessionDuration || 60} mins
                                    </div>
                                    <div className="flex items-center w-1/2">
                                        <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                                        {item.curriculum || 'Standard'}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-4 border-t flex gap-2">
                                <Button
                                    className="flex-1"
                                    onClick={() => navigate(`/book/${item._id || item.id}`)}
                                >
                                    Enroll Now
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handRemoveFromWishlist(item._id || item.id)}
                                    disabled={removingId === (item._id || item.id)}
                                >
                                    <Heart className="h-4 w-4 fill-current" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
