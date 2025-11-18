import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { Eye, Search, Filter, Download, UserPlus } from 'lucide-react';
import { adminService } from '@/integrations/api/services/admin.service';

interface ParentsListProps {
  onViewParent: (parentId: string) => void;
}

const ParentsList = ({ onViewParent }: ParentsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch parents list
  const { data: parentsData, isLoading, error } = useQuery({
    queryKey: ['adminParents', currentPage, searchTerm],
    queryFn: async () => {
      const response = await adminService.getParents({
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
      });
      return response;
    },
  });

  const parents = parentsData?.data?.parents || [];

  // Filter by status locally (search is done server-side)
  const filteredParents = parents.filter((parent: any) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && parent.isActive) ||
      (statusFilter === 'inactive' && !parent.isActive);

    return matchesStatus;
  });

  const totalParents = parentsData?.data?.total || 0;
  const totalPages = parentsData?.data?.totalPages || 1;

  const handleExport = () => {
    // Export functionality
    console.log('Exporting parents data...');
  };

  return (
    <div className="space-y-4">
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
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Parent
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Parents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParents}</div>
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
              {parents.filter((p: any) => p.isActive).length}
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
              {parents.filter((p: any) => !p.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {parents.filter((p: any) => {
                const createdAt = new Date(p.createdAt);
                const now = new Date();
                return (
                  createdAt.getMonth() === now.getMonth() &&
                  createdAt.getFullYear() === now.getFullYear()
                );
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parents Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading parents...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              Error loading parents. Please try again.
            </div>
          ) : filteredParents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No parents found matching your criteria.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParents.map((parent: any) => (
                  <TableRow key={parent._id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{parent.fullName || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{parent._id}</div>
                      </div>
                    </TableCell>
                    <TableCell>{parent.email || 'N/A'}</TableCell>
                    <TableCell>{parent.phoneNumber || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge
                        variant={parent.isActive ? 'default' : 'secondary'}
                      >
                        {parent.isActive ? 'active' : 'inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {parent.createdAt
                        ? new Date(parent.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewParent(parent._id)}
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
      {totalParents > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {Math.min((currentPage - 1) * pageSize + 1, totalParents)} to{' '}
            {Math.min(currentPage * pageSize, totalParents)} of{' '}
            {totalParents} parents
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

export default ParentsList;
