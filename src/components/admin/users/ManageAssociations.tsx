import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { adminService } from '@/integrations/api/services/admin.service';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, UserPlus, Search, X, Unlink, Users, ExternalLink } from 'lucide-react';

interface User {
    _id: string;
    fullName: string;
    email: string;
    profileImage?: string;
}

interface ManageAssociationsProps {
    userId: string;
    userType: 'student' | 'parent';
    userName: string;
}

const ManageAssociations: React.FC<ManageAssociationsProps> = ({
    userId,
    userType,
    userName,
}) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // State for current associations
    const [currentAssociations, setCurrentAssociations] = useState<User[]>([]);
    const [isLoadingAssociations, setIsLoadingAssociations] = useState(true);

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [availableUsers, setAvailableUsers] = useState<User[]>([]);
    const [isLoadingAvailable, setIsLoadingAvailable] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAssociating, setIsAssociating] = useState(false);

    // Fetch current associations
    const fetchCurrentAssociations = async () => {
        setIsLoadingAssociations(true);
        try {
            if (userType === 'student') {
                const response = await adminService.getParentsForStudent(userId);
                setCurrentAssociations(response.data?.parents || []);
            } else {
                const response = await adminService.getStudentsForParent(userId);
                setCurrentAssociations(response.data?.students || []);
            }
        } catch (error) {
            console.error('Error fetching associations:', error);
        } finally {
            setIsLoadingAssociations(false);
        }
    };

    // Fetch available users to associate
    const fetchAvailableUsers = async () => {
        setIsLoadingAvailable(true);
        try {
            if (userType === 'student') {
                // Student needs parents
                const response = await adminService.getAvailableParentsForStudent(userId);
                setAvailableUsers(response.data?.availableParents || []);
            } else {
                // Parent needs students
                const response = await adminService.getAvailableStudentsForParent(userId);
                setAvailableUsers(response.data?.availableStudents || []);
            }
        } catch (error) {
            console.error('Error fetching available users:', error);
        } finally {
            setIsLoadingAvailable(false);
        }
    };

    useEffect(() => {
        fetchCurrentAssociations();
    }, [userId, userType]);

    // Filter available users based on search
    const filteredAvailableUsers = useMemo(() => {
        if (!searchTerm) return availableUsers;
        const search = searchTerm.toLowerCase();
        return availableUsers.filter(
            (u) =>
                u.fullName?.toLowerCase().includes(search) ||
                u.email?.toLowerCase().includes(search)
        );
    }, [availableUsers, searchTerm]);

    // Toggle user selection
    const toggleUserSelection = (id: string) => {
        setSelectedUsers((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    // Handle opening the dialog
    const handleOpenDialog = () => {
        setSelectedUsers([]);
        setSearchTerm('');
        fetchAvailableUsers();
        setIsDialogOpen(true);
    };

    // Create associations
    const handleCreateAssociations = async () => {
        if (selectedUsers.length === 0) {
            toast({
                title: 'Validation Error',
                description: `Please select at least one ${userType === 'student' ? 'parent' : 'student'}.`,
                variant: 'destructive',
            });
            return;
        }

        setIsAssociating(true);
        let successCount = 0;
        let errorCount = 0;

        for (const selectedId of selectedUsers) {
            try {
                if (userType === 'student') {
                    // Associate parent with this student
                    await adminService.associateParentWithStudent(selectedId, userId);
                } else {
                    // Associate student with this parent
                    await adminService.associateParentWithStudent(userId, selectedId);
                }
                successCount++;
            } catch (error) {
                console.error('Error creating association:', error);
                errorCount++;
            }
        }

        setIsAssociating(false);

        if (successCount > 0) {
            toast({
                title: 'Success',
                description: `Successfully associated ${successCount} ${userType === 'student' ? 'parent(s)' : 'student(s)'}.${errorCount > 0 ? ` ${errorCount} failed.` : ''}`,
            });
            setIsDialogOpen(false);
            fetchCurrentAssociations();
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['adminStudent'] });
            queryClient.invalidateQueries({ queryKey: ['adminParent'] });
            queryClient.invalidateQueries({ queryKey: ['adminAssociations'] });
        } else {
            toast({
                title: 'Error',
                description: 'Failed to create associations.',
                variant: 'destructive',
            });
        }
    };

    // Remove an association
    const handleRemoveAssociation = async (associatedUserId: string) => {
        try {
            if (userType === 'student') {
                // Remove parent from student
                await adminService.disassociateParentFromStudent(associatedUserId, userId);
            } else {
                // Remove student from parent
                await adminService.disassociateParentFromStudent(userId, associatedUserId);
            }
            toast({
                title: 'Success',
                description: 'Association removed successfully.',
            });
            fetchCurrentAssociations();
            queryClient.invalidateQueries({ queryKey: ['adminStudent'] });
            queryClient.invalidateQueries({ queryKey: ['adminParent'] });
            queryClient.invalidateQueries({ queryKey: ['adminAssociations'] });
        } catch (error: any) {
            console.error('Error removing association:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to remove association.',
                variant: 'destructive',
            });
        }
    };

    // Get selected user names for display
    const getSelectedUserNames = () => {
        return selectedUsers
            .map((id) => availableUsers.find((u) => u._id === id)?.fullName)
            .filter(Boolean);
    };

    const associatedLabel = userType === 'student' ? 'Parents' : 'Children';
    const availableLabel = userType === 'student' ? 'parents' : 'students';

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Associated {associatedLabel}
                </CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" onClick={handleOpenDialog}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add {userType === 'student' ? 'Parent' : 'Student'}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>
                                Add {userType === 'student' ? 'Parents' : 'Students'} to {userName}
                            </DialogTitle>
                            <DialogDescription>
                                Select {availableLabel} to associate with this {userType}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="border rounded-md">
                                {/* Search input */}
                                <div className="p-2 border-b">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder={`Search ${availableLabel}...`}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                {/* Selected items display */}
                                {selectedUsers.length > 0 && (
                                    <div className="p-2 border-b flex flex-wrap gap-1 bg-muted/50">
                                        {getSelectedUserNames().map((name, idx) => (
                                            <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                                                {name}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleUserSelection(selectedUsers[idx])}
                                                    className="hover:text-destructive"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {/* Loading state */}
                                {isLoadingAvailable ? (
                                    <div className="flex items-center justify-center gap-2 p-8">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Loading {availableLabel}...
                                    </div>
                                ) : (
                                    <>
                                        {/* Scrollable list */}
                                        <ScrollArea className="h-48">
                                            <div className="p-2 space-y-1">
                                                {filteredAvailableUsers.length > 0 ? (
                                                    filteredAvailableUsers.map((user) => (
                                                        <div
                                                            key={user._id}
                                                            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted transition-colors ${selectedUsers.includes(user._id) ? 'bg-primary/10' : ''
                                                                }`}
                                                            onClick={() => toggleUserSelection(user._id)}
                                                        >
                                                            <Checkbox
                                                                checked={selectedUsers.includes(user._id)}
                                                                onCheckedChange={() => toggleUserSelection(user._id)}
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium truncate">{user.fullName}</p>
                                                                <p className="text-sm text-muted-foreground truncate">
                                                                    {user.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-center text-muted-foreground py-4">
                                                        No {availableLabel} available
                                                    </p>
                                                )}
                                            </div>
                                        </ScrollArea>

                                        {/* Selection count */}
                                        <div className="p-2 border-t text-sm text-muted-foreground">
                                            {selectedUsers.length} {userType === 'student' ? 'parent(s)' : 'student(s)'} selected
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateAssociations} disabled={isAssociating || selectedUsers.length === 0}>
                                {isAssociating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    `Add ${selectedUsers.length > 0 ? selectedUsers.length : ''} ${userType === 'student' ? 'Parent(s)' : 'Student(s)'}`
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {isLoadingAssociations ? (
                    <div className="flex items-center justify-center gap-2 p-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                    </div>
                ) : currentAssociations.length > 0 ? (
                    <div className="space-y-2">
                        {currentAssociations.map((user: any) => (
                            <div
                                key={user._id}
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                            >
                                <div>
                                    <p className="font-medium">{user.fullName || 'Unknown'}</p>
                                    <p className="text-sm text-muted-foreground">{user.email || '-'}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate(`/admin/${userType === 'student' ? 'parents' : 'students'}?id=${user._id}`)}
                                    >
                                        <ExternalLink className="h-4 w-4 mr-1" />
                                        View
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveAssociation(user._id)}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <Unlink className="h-4 w-4 mr-1" />
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-4">
                        No {associatedLabel.toLowerCase()} associated
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

export default ManageAssociations;
