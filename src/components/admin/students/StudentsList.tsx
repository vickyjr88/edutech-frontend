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

interface StudentsListProps {
  onViewStudent: (studentId: string) => void;
  onAddStudent?: () => void;
}

const StudentsList = ({ onViewStudent, onAddStudent }: StudentsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch students list with advanced query
  const { data: studentsData, isLoading, error, refetch } = useQuery({
    queryKey: ['adminStudents', currentPage, searchTerm, statusFilter, verificationFilter],
    queryFn: async () => {
      // Map status filter to API format
      let status: 'active' | 'inactive' | 'suspended' | undefined;
      if (statusFilter === 'active') status = 'active';
      else if (statusFilter === 'inactive') status = 'inactive';
      else if (statusFilter === 'suspended') status = 'suspended';

      const response = await adminService.advancedQueryUsers({
        role: 'student',
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
        status,
        isEmailVerified: verificationFilter === 'verified' ? true : verificationFilter === 'unverified' ? false : undefined,
      });
      return response;
    },
  });

  const students = studentsData?.data?.users || [];
  const totalStudents = studentsData?.data?.total || 0;
  const totalPages = studentsData?.data?.totalPages || 1;
  const stats = studentsData?.data?.stats;

  // Bulk action mutation
  const bulkActionMutation = useMutation({
    mutationFn: async (action: 'activate' | 'deactivate' | 'suspend' | 'delete') => {
      return adminService.bulkAction({
        userIds: Array.from(selectedStudents),
        action,
        reason: action === 'suspend' ? 'other' : undefined,
      });
    },
    onSuccess: (data) => {
      toast({
        title: 'Bulk action completed',
        description: `${data.success} students updated successfully. ${data.failed} failed.`,
      });
      setSelectedStudents(new Set());
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
  const toggleStudent = (studentId: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  // Select all on current page
  const toggleSelectAll = () => {
    if (selectedStudents.size === students.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(students.map((s: any) => s._id)));
    }
  };

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'suspend' | 'delete') => {
    if (selectedStudents.size === 0) {
      toast({
        title: 'No students selected',
        description: 'Please select students first',
        variant: 'destructive',
      });
      return;
    }

    if (confirm(`Are you sure you want to ${action} ${selectedStudents.size} student(s)?`)) {
      bulkActionMutation.mutate(action);
    }
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
      {selectedStudents.size > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {selectedStudents.size} student(s) selected
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
                  onClick={() => setSelectedStudents(new Set())}
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
          <Button onClick={onAddStudent}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
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

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading students...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              Error loading students. Please try again.
            </div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No students found matching your criteria.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={students.length > 0 && selectedStudents.size === students.length}
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
                {students.map((student: any) => (
                  <TableRow key={student._id} className={selectedStudents.has(student._id) ? 'bg-blue-50' : ''}>
                    <TableCell>
                      <Checkbox
                        checked={selectedStudents.has(student._id)}
                        onCheckedChange={() => toggleStudent(student._id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        <div>{student.fullName || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{student._id}</div>
                      </div>
                    </TableCell>
                    <TableCell>{student.email || 'N/A'}</TableCell>
                    <TableCell>{student.phoneNumber || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {student.isSuspended ? (
                          <Badge variant="destructive" className="gap-1">
                            <Shield className="h-3 w-3" />
                            Suspended
                          </Badge>
                        ) : student.isActive ? (
                          <Badge variant="default" className="bg-green-600">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {student.isEmailVerified && (
                          <Badge variant="outline" className="text-xs">Email ✓</Badge>
                        )}
                        {student.isPhoneVerified && (
                          <Badge variant="outline" className="text-xs">Phone ✓</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {student.createdAt
                        ? new Date(student.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewStudent(student._id)}
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
      {totalStudents > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {Math.min((currentPage - 1) * pageSize + 1, totalStudents)} to{' '}
            {Math.min(currentPage * pageSize, totalStudents)} of{' '}
            {totalStudents} students
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

export default StudentsList;
