import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Eye, Search, Filter, Download, UserPlus,
  MoreVertical, Ban, CheckCircle, XCircle, Trash2,
  Users, Shield
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { adminService } from '@/integrations/api/services/admin.service';
import { useToast } from '@/hooks/use-toast';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface TeachersListProps {
  onViewTeacher: (teacherId: string) => void;
  onAddTeacher?: () => void;
}

const TeachersList = ({ onViewTeacher, onAddTeacher }: TeachersListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [selectedTeachers, setSelectedTeachers] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const queryClient = useQueryClient();
  const { confirm, ConfirmDialog } = useConfirmationDialog();
  const { toast } = useToast();

  // Fetch teachers list with advanced query
  const { data: teachersData, isLoading, error, refetch } = useQuery({
    queryKey: ['adminTeachers', currentPage, searchTerm, statusFilter, verificationFilter],
    queryFn: async () => {
      // Map status filter to API format
      let status: 'active' | 'inactive' | 'suspended' | undefined;
      if (statusFilter === 'active') status = 'active';
      else if (statusFilter === 'inactive') status = 'inactive';
      else if (statusFilter === 'suspended') status = 'suspended';

      const response = await adminService.advancedQueryUsers({
        role: 'teacher',
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
        status,
        isEmailVerified: verificationFilter === 'verified' ? true : verificationFilter === 'unverified' ? false : undefined,
      });
      return response;
    },
  });

  const teachers = teachersData?.data?.users || [];
  const totalTeachers = teachersData?.data?.total || 0;
  const totalPages = teachersData?.data?.totalPages || 1;
  const stats = teachersData?.data?.stats;

  // Bulk action mutation
  const bulkActionMutation = useMutation({
    mutationFn: async (action: 'activate' | 'deactivate' | 'suspend' | 'delete') => {
      return adminService.bulkAction({
        userIds: Array.from(selectedTeachers),
        action,
        reason: action === 'suspend' ? 'other' : undefined,
      });
    },
    onSuccess: (data) => {
      toast({
        title: 'Bulk action completed',
        description: `${data.success} teachers updated successfully. ${data.failed} failed.`,
      });
      setSelectedTeachers(new Set());
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: 'Bulk action failed',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  // Toggle selection
  const toggleTeacher = (teacherId: string) => {
    const newSelected = new Set(selectedTeachers);
    if (newSelected.has(teacherId)) {
      newSelected.delete(teacherId);
    } else {
      newSelected.add(teacherId);
    }
    setSelectedTeachers(newSelected);
  };

  // Select all on current page
  const toggleSelectAll = () => {
    if (selectedTeachers.size === teachers.length) {
      setSelectedTeachers(new Set());
    } else {
      setSelectedTeachers(new Set(teachers.map((t: any) => t._id)));
    }
  };

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'suspend' | 'delete') => {
    if (selectedTeachers.size === 0) {
      toast({
        title: 'No teachers selected',
        description: 'Please select teachers first',
        variant: 'destructive',
      });
      return;
    }

    const actionLabels = {
      activate: 'Activate',
      deactivate: 'Deactivate',
      suspend: 'Suspend',
      delete: 'Delete',
    };

    confirm({
      title: `${actionLabels[action]} Teachers`,
      description: `Are you sure you want to ${action} ${selectedTeachers.size} teacher(s)? This action may affect their access to the platform.`,
      confirmText: actionLabels[action],
      cancelText: 'Cancel',
      variant: action === 'delete' ? 'destructive' : 'default',
      onConfirm: () => {
        bulkActionMutation.mutate(action);
      },
    });
  };

  const handleExport = () => {
    toast({
      title: 'Export started',
      description: 'Your export is being prepared...',
    });
    // TODO: Implement actual export
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {selectedTeachers.size > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {selectedTeachers.size} teacher(s) selected
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('activate')}
                  disabled={bulkActionMutation.isPending}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Activate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('deactivate')}
                  disabled={bulkActionMutation.isPending}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Deactivate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('suspend')}
                  disabled={bulkActionMutation.isPending}
                >
                  <Ban className="h-4 w-4 mr-1" />
                  Suspend
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkAction('delete')}
                  disabled={bulkActionMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedTeachers(new Set())}
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select value={verificationFilter} onValueChange={setVerificationFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Verification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={onAddTeacher}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Teacher
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Teachers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeachers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.activeCount || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Inactive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">
              {stats?.inactiveCount || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Suspended
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats?.suspendedCount || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teachers Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading teachers...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              Error loading teachers. Please try again.
            </div>
          ) : teachers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No teachers found matching your criteria.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={teachers.length > 0 && selectedTeachers.size === teachers.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher: any) => (
                  <TableRow key={teacher._id} className={selectedTeachers.has(teacher._id) ? 'bg-blue-50' : ''}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTeachers.has(teacher._id)}
                        onCheckedChange={() => toggleTeacher(teacher._id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        <div>{teacher.fullName || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{teacher._id}</div>
                      </div>
                    </TableCell>
                    <TableCell>{teacher.email || 'N/A'}</TableCell>
                    <TableCell>{teacher.phoneNumber || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {teacher.isSuspended ? (
                          <Badge variant="destructive" className="gap-1">
                            <Shield className="h-3 w-3" />
                            Suspended
                          </Badge>
                        ) : teacher.isActive ? (
                          <Badge variant="default" className="bg-green-600">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                        {/* Approval Status */}
                        {teacher.isApproved ? (
                          <Badge variant="outline" className="text-xs border-blue-500 text-blue-600">Approved</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-600 bg-yellow-50">Pending</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {teacher.isEmailVerified && (
                          <Badge variant="outline" className="text-xs">Email ✓</Badge>
                        )}
                        {teacher.isPhoneVerified && (
                          <Badge variant="outline" className="text-xs">Phone ✓</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {teacher.createdAt
                        ? new Date(teacher.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewTeacher(teacher._id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalTeachers > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {Math.min((currentPage - 1) * pageSize + 1, totalTeachers)} to{' '}
            {Math.min(currentPage * pageSize, totalTeachers)} of{' '}
            {totalTeachers} teachers
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachersList;
