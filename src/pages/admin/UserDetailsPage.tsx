import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit,
    Save,
    X,
    KeyRound,
    Shield,
    Ban,
    CheckCircle,
    XCircle,
    History,
    User,
} from 'lucide-react';
import { adminService } from '@/integrations/api/services/admin.service';
import { useToast } from '@/components/ui/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import SuspendUserModal from '@/components/admin/users/SuspendUserModal';
import AuditLogViewer from '@/components/admin/users/AuditLogViewer';

const UserDetailsPage = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [suspendModalOpen, setSuspendModalOpen] = useState(false);

    // Fetch user basic details
    const { data: userResponse, isLoading, error } = useQuery({
        queryKey: ['adminUser', userId],
        queryFn: () => adminService.getUserById(userId!),
        enabled: !!userId,
    });

    // Fetch user resources
    const { data: resourcesResponse } = useQuery({
        queryKey: ['adminUserResources', userId],
        queryFn: () => adminService.getUserResources(userId!),
        enabled: !!userId,
    });

    const rawUser = userResponse?.data;
    const user = (rawUser as any)?.data || rawUser;
    const resources = resourcesResponse?.data?.data || resourcesResponse?.data;

    // Update user mutation
    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            return adminService.updateUser(userId!, data);
        },
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'User details updated successfully',
            });
            setIsEditing(false);
            queryClient.invalidateQueries({ queryKey: ['adminUser', userId] });
        },
        onError: (err: any) => {
            toast({
                title: 'Error',
                description: err.message || 'Failed to update user details',
                variant: 'destructive',
            });
        },
    });

    // Reset password mutation
    const resetPasswordMutation = useMutation({
        mutationFn: () => adminService.resetUserPassword({
            userId: userId!,
            newPassword: generateRandomPassword()
        }),
        onSuccess: () => {
            toast({
                title: 'Password Reset',
                description: 'Password has been reset successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to reset password',
                variant: 'destructive',
            });
        },
    });

    // Activate/Deactivate mutations
    const activateMutation = useMutation({
        mutationFn: () => adminService.bulkAction({
            userIds: [userId!],
            action: 'activate',
        }),
        onSuccess: () => {
            toast({
                title: 'User Activated',
                description: 'The user has been activated successfully',
            });
            queryClient.invalidateQueries({ queryKey: ['adminUser', userId] });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to activate user',
                variant: 'destructive',
            });
        },
    });

    const deactivateMutation = useMutation({
        mutationFn: () => adminService.bulkAction({
            userIds: [userId!],
            action: 'deactivate',
        }),
        onSuccess: () => {
            toast({
                title: 'User Deactivated',
                description: 'The user has been deactivated successfully',
            });
            queryClient.invalidateQueries({ queryKey: ['adminUser', userId] });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to deactivate user',
                variant: 'destructive',
            });
        },
    });

    const generateRandomPassword = () => {
        return Math.random().toString(36).slice(-10) + Math.random().toString(36).toUpperCase().slice(-2);
    };

    const handleEdit = () => {
        setFormData(user);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({});
    };

    const handleSave = () => {
        const allowedFields = {
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            country: formData.country,
            bio: formData.bio,
        };
        updateMutation.mutate(allowedFields);
    };

    const handleBack = () => {
        navigate('/admin/users');
    };

    if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading user details...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {(error as any).message}</div>;
    if (!user) return <div className="p-8 text-center text-muted-foreground">User not found</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold">{user.fullName || 'N/A'}</h2>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>ID: {user._id}</span>
                            <Badge variant="outline" className="capitalize">{user.role}</Badge>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {!isEditing ? (
                        <>
                            {user.isSuspended ? (
                                <Button
                                    variant="outline"
                                    onClick={() => setSuspendModalOpen(true)}
                                    className="border-green-600 text-green-600 hover:bg-green-50"
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Unsuspend
                                </Button>
                            ) : user.isActive ? (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => setSuspendModalOpen(true)}
                                        className="border-red-600 text-red-600 hover:bg-red-50"
                                    >
                                        <Ban className="h-4 w-4 mr-2" />
                                        Suspend
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline">
                                                <XCircle className="h-4 w-4 mr-2" />
                                                Deactivate
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Deactivate User</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will deactivate the user account. They will not be able to log in
                                                    until the account is reactivated.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => deactivateMutation.mutate()}
                                                    className="bg-orange-600 hover:bg-orange-700"
                                                >
                                                    Deactivate
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </>
                            ) : (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Activate
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Activate User</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will activate the user account, allowing them to log in.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => activateMutation.mutate()}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                Activate
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline">
                                        <KeyRound className="h-4 w-4 mr-2" />
                                        Reset Password
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Reset Password</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will reset the password for {user.email}. A temporary
                                            password will be generated.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => resetPasswordMutation.mutate()}>
                                            Reset Password
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <Button onClick={handleEdit}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Details
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" onClick={handleCancel}>
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={updateMutation.isPending}>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <Tabs defaultValue="details" className="w-full">
                <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="activity">
                        <History className="h-4 w-4 mr-2" />
                        Activity History
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.fullName || ''}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <User className="h-4 w-4 text-gray-400" />
                                            {user.fullName}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        {user.email}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.phoneNumber || ''}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            {user.phoneNumber || 'N/A'}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Country</Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.country || ''}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                            {user.country || 'N/A'}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Member Since</Label>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Satus</Label>
                                    <div className="flex gap-2">
                                        {user.isSuspended ? (
                                            <Badge variant="destructive" className="gap-1">
                                                <Shield className="h-3 w-3" />
                                                Suspended
                                            </Badge>
                                        ) : user.isActive ? (
                                            <Badge variant="default" className="bg-green-600">Active</Badge>
                                        ) : (
                                            <Badge variant="secondary">Inactive</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Info / Bio */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Bio / Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isEditing ? (
                                <textarea
                                    className="w-full min-h-[100px] p-3 border rounded-md"
                                    value={formData.bio || ''}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="User bio..."
                                />
                            ) : (
                                <p className="text-gray-700">{user.bio || 'No bio available'}</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="activity">
                    <AuditLogViewer userId={userId!} limit={50} />
                </TabsContent>
            </Tabs>

            <SuspendUserModal
                open={suspendModalOpen}
                onClose={() => setSuspendModalOpen(false)}
                userId={userId!}
                userName={user.fullName}
                isSuspended={user.isSuspended || false}
            />
        </div>
    );
};

export default UserDetailsPage;
