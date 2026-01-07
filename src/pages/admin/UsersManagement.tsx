import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Search,
    Filter,
    Users,
    Trash2,
    Edit,
    Eye,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Loader2,
    UserCheck,
    UserX,
    Shield,
    MoreHorizontal,
    RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { adminService, AdminUser } from '@/integrations/api/services/admin.service';

const UsersManagement: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { toast } = useToast();

    // State
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || 'all');
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
    const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [stats, setStats] = useState<{
        activeCount: number;
        inactiveCount: number;
        suspendedCount: number;
    } | null>(null);

    // Delete confirmation dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
    const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
    const [deleting, setDeleting] = useState(false);

    // Fetch users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const result = await adminService.advancedQueryUsers({
                search: search || undefined,
                role: roleFilter !== 'all' ? roleFilter : undefined,
                status: statusFilter !== 'all' ? statusFilter as any : undefined,
                page,
                limit: 20,
                sortBy: 'createdAt',
                sortOrder: 'desc',
            });

            // Handle API response - might have data wrapper
            const data = (result as any).data || result;
            setUsers(data.users || []);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 1);
            setStats(data.stats);
        } catch (error: any) {
            console.error('Error fetching users:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to fetch users',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, roleFilter, statusFilter]);

    // Search debounce
    useEffect(() => {
        const timeout = setTimeout(() => {
            setPage(1);
            fetchUsers();
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    // Update URL params
    useEffect(() => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (roleFilter !== 'all') params.set('role', roleFilter);
        if (statusFilter !== 'all') params.set('status', statusFilter);
        if (page > 1) params.set('page', page.toString());
        setSearchParams(params);
    }, [search, roleFilter, statusFilter, page]);

    // Handle permanent delete
    const handleDeleteClick = (user: AdminUser) => {
        setUserToDelete(user);
        setDeleteConfirmEmail('');
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;

        if (deleteConfirmEmail !== userToDelete.email) {
            toast({
                title: 'Email mismatch',
                description: 'Please enter the correct email to confirm deletion',
                variant: 'destructive',
            });
            return;
        }

        setDeleting(true);
        try {
            const result = await adminService.permanentDeleteUser(userToDelete._id);

            // Handle API response - might have data wrapper
            const data = (result as any).data || result;
            toast({
                title: 'User Deleted',
                description: data.message || 'User deleted successfully',
            });

            setDeleteDialogOpen(false);
            setUserToDelete(null);
            setDeleteConfirmEmail('');

            // Refresh the list
            fetchUsers();
        } catch (error: any) {
            console.error('Error deleting user:', error);
            toast({
                title: 'Delete Failed',
                description: error.message || 'Failed to delete user',
                variant: 'destructive',
            });
        } finally {
            setDeleting(false);
        }
    };

    // Handle reactivate/deactivate
    const handleToggleActive = async (user: AdminUser) => {
        try {
            if (user.isActive) {
                await adminService.deactivateUser(user._id);
                toast({ title: 'User Deactivated', description: `${user.fullName} has been deactivated` });
            } else {
                await adminService.reactivateUser(user._id);
                toast({ title: 'User Reactivated', description: `${user.fullName} has been reactivated` });
            }
            fetchUsers();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update user status',
                variant: 'destructive',
            });
        }
    };

    // Get role badge color
    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Admin</Badge>;
            case 'teacher':
                return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Teacher</Badge>;
            case 'student':
                return <Badge className="bg-green-100 text-green-800 border-green-200">Student</Badge>;
            case 'parent':
                return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Parent</Badge>;
            case 'default':
                return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Default</Badge>;
            default:
                return <Badge variant="outline">{role}</Badge>;
        }
    };

    // Get status badge
    const getStatusBadge = (user: AdminUser) => {
        if (user.isSuspended) {
            return <Badge variant="destructive">Suspended</Badge>;
        }
        if (!user.isActive) {
            return <Badge variant="secondary">Inactive</Badge>;
        }
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Users className="h-6 w-6" />
                        Users Management
                    </h1>
                    <p className="text-muted-foreground">
                        View, manage, and delete user accounts
                    </p>
                </div>
                <Button onClick={fetchUsers} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Users</p>
                                    <p className="text-2xl font-bold">{total}</p>
                                </div>
                                <Users className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Active</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.activeCount}</p>
                                </div>
                                <UserCheck className="h-8 w-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Inactive</p>
                                    <p className="text-2xl font-bold text-gray-600">{stats.inactiveCount}</p>
                                </div>
                                <UserX className="h-8 w-8 text-gray-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Suspended</p>
                                    <p className="text-2xl font-bold text-red-600">{stats.suspendedCount}</p>
                                </div>
                                <Shield className="h-8 w-8 text-red-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, email, or phone..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1); }}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="All Roles" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="teacher">Teacher</SelectItem>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="parent">Parent</SelectItem>
                                <SelectItem value="default">Default</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No users found</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Verified</TableHead>
                                    <TableHead>Last Login</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{user.fullName}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                                        <TableCell>{getStatusBadge(user)}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                {user.isEmailVerified && (
                                                    <Badge variant="outline" className="text-xs">Email</Badge>
                                                )}
                                                {user.isPhoneVerified && (
                                                    <Badge variant="outline" className="text-xs">Phone</Badge>
                                                )}
                                                {!user.isEmailVerified && !user.isPhoneVerified && (
                                                    <span className="text-muted-foreground text-sm">-</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {user.lastLogin
                                                ? new Date(user.lastLogin).toLocaleDateString()
                                                : <span className="text-muted-foreground">Never</span>
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => navigate(`/admin/users/${user._id}`)}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleToggleActive(user)}>
                                                        {user.isActive ? (
                                                            <>
                                                                <UserX className="h-4 w-4 mr-2" />
                                                                Deactivate
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserCheck className="h-4 w-4 mr-2" />
                                                                Reactivate
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteClick(user)}
                                                        className="text-red-600 focus:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Permanently Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t">
                        <p className="text-sm text-muted-foreground">
                            Page {page} of {totalPages} ({total} total users)
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                            Permanently Delete User
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-4">
                            <p>
                                You are about to permanently delete <strong>{userToDelete?.fullName}</strong> ({userToDelete?.email}).
                            </p>
                            <p className="text-red-600 font-medium">
                                ⚠️ This action is IRREVERSIBLE! All associated data including profiles, suspensions, and audit logs will be permanently deleted.
                            </p>
                            <div className="pt-2">
                                <label className="text-sm font-medium">
                                    Type the user's email to confirm:
                                </label>
                                <Input
                                    value={deleteConfirmEmail}
                                    onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                                    placeholder={userToDelete?.email}
                                    className="mt-2"
                                />
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            disabled={deleting || deleteConfirmEmail !== userToDelete?.email}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Permanently
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default UsersManagement;
