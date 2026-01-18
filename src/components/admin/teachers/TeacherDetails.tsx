import { useState } from 'react';
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
  BookOpen,
  Users,
  DollarSign,
  Activity,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  History,
} from 'lucide-react';
import { adminService } from '@/integrations/api/services/admin.service';
import { useToast } from '@/hooks/use-toast';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import AuditLogViewer from '@/components/admin/users/AuditLogViewer';

interface TeacherDetailsProps {
  teacherId: string;
  onBack: () => void;
}

const TeacherDetails = ({ teacherId, onBack }: TeacherDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch teacher basic details
  const { data: teacherResponse, isLoading, error } = useQuery({
    queryKey: ['adminTeacher', teacherId],
    queryFn: () => adminService.getTeacherById(teacherId),
  });

  // Fetch teacher resources (classes, students, earnings)
  const { data: resourcesResponse } = useQuery({
    queryKey: ['adminTeacherResources', teacherId],
    queryFn: () => adminService.getTeacherResources(teacherId),
    enabled: !!teacherId,
  });

  // Extract data from API client wrapper
  const rawTeacher = teacherResponse?.data;
  const teacher = (rawTeacher as any)?.data || rawTeacher;
  const teacherProfile = teacher?.teacherProfile;

  // Extract resources data - API returns data directly, not nested in data.data
  const resourcesData = resourcesResponse?.data;
  const teacherClasses = resourcesData?.classes || [];
  const teacherStudents = resourcesData?.students || [];
  const teacherEarnings = resourcesData?.earnings || { total: 0, pending: 0, paid: 0 };

  // Update teacher mutation
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return adminService.updateTeacher(teacherId, data);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Teacher details updated successfully',
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['adminTeacher', teacherId] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update teacher details',
        variant: 'destructive',
      });
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: () => adminService.resetUserPassword({
      userId: teacherId,
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
      userIds: [teacherId],
      action: 'activate',
    }),
    onSuccess: () => {
      toast({
        title: 'Teacher Activated',
        description: 'The teacher has been activated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['adminTeacher', teacherId] });
      queryClient.invalidateQueries({ queryKey: ['adminTeachers'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to activate teacher',
        variant: 'destructive',
      });
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: () => adminService.bulkAction({
      userIds: [teacherId],
      action: 'deactivate',
    }),
    onSuccess: () => {
      toast({
        title: 'Teacher Deactivated',
        description: 'The teacher has been deactivated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['adminTeacher', teacherId] });
      queryClient.invalidateQueries({ queryKey: ['adminTeachers'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to deactivate teacher',
        variant: 'destructive',
      });
    },
  });

  // Helper function to generate random password
  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-10) + Math.random().toString(36).toUpperCase().slice(-2);
  };

  const handleEdit = () => {
    setFormData(teacher);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const handleSave = () => {
    // Only send allowed fields to avoid validation errors
    const allowedFields = {
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      country: formData.country,
      bio: formData.bio,
    };
    updateMutation.mutate(allowedFields);
  };

  const handleResetPassword = () => {
    resetPasswordMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading teacher details...</div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading teacher details: {(error as any)?.message || 'Unknown error'}
      </div>
    );
  }

  if (teacherResponse?.error) {
    return (
      <div className="p-8 text-center text-red-500">
        API Error: {teacherResponse.error.message}
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="p-8 text-center text-gray-500">
        Teacher not found
        <div className="text-xs mt-2">Debug: Check console for response data</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{teacher?.fullName || 'N/A'}</h2>
            <p className="text-sm text-gray-500">Teacher ID: {teacher?._id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              {/* Suspension/Activation Controls */}
              {teacher?.isSuspended ? (
                <Button
                  variant="outline"
                  onClick={() => setSuspendModalOpen(true)}
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Unsuspend
                </Button>
              ) : teacher?.isActive ? (
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
                        <AlertDialogTitle>Deactivate Teacher</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will deactivate the teacher account. They will not be able to log in
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
                      <AlertDialogTitle>Activate Teacher</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will activate the teacher account, allowing them to log in and access the platform.
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
                      This will reset the password for {teacher?.email}. A temporary
                      password will be generated and you'll need to communicate it to the teacher.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetPassword}>
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

      {/* Main Content */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="classes">
            Classes ({teacherClasses?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="students">
            Students ({teacherStudents?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="activity">
            <History className="h-4 w-4 mr-2" />
            Activity History
          </TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Classes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="text-2xl font-bold">
                    {teacherClasses?.length || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold">
                    {teacherStudents?.length || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  <span className="text-2xl font-bold">
                    KES {teacherEarnings?.total?.toLocaleString() || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="full_name"
                      value={formData.fullName || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700">
                      {teacher?.fullName || 'N/A'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {teacher?.email || 'N/A'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phoneNumber || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, phoneNumber: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {teacher?.phoneNumber || 'N/A'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  {isEditing ? (
                    <Input
                      id="country"
                      value={formData.country || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {teacher?.country || 'N/A'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex gap-2">
                    {teacher?.isSuspended ? (
                      <Badge variant="destructive" className="gap-1">
                        <Shield className="h-3 w-3" />
                        Suspended
                      </Badge>
                    ) : teacher?.isActive ? (
                      <Badge variant="default" className="bg-green-600">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                  {teacher?.isSuspended && teacher?.suspendedUntil && (
                    <p className="text-xs text-gray-500 mt-2">
                      Until: {new Date(teacher.suspendedUntil).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {teacher?.createdAt
                      ? new Date(teacher?.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bio</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <textarea
                  className="w-full min-h-[100px] p-3 border rounded-md"
                  value={formData.bio || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Teacher bio..."
                />
              ) : (
                <p className="text-gray-700">{resourcesData?.bio || teacher?.bio || 'No bio available'}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Classes Tab */}
        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle>Teacher's Classes</CardTitle>
            </CardHeader>
            <CardContent>
              {teacherClasses && teacherClasses.length > 0 ? (
                <div className="space-y-3">
                  {teacherClasses.map((cls: any) => (
                    <div
                      key={cls.id}
                      className="p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{cls.name}</h4>
                          <p className="text-sm text-gray-500">{cls.description}</p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-600">
                            <span>{cls.students_count || 0} students</span>
                            <span>{cls.schedule}</span>
                          </div>
                        </div>
                        <Badge>{cls.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No classes assigned yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Teacher's Students</CardTitle>
            </CardHeader>
            <CardContent>
              {teacherStudents && teacherStudents.length > 0 ? (
                <div className="space-y-3">
                  {teacherStudents.map((student: any) => (
                    <div
                      key={student.id}
                      className="p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{student.name}</h4>
                          <p className="text-sm text-gray-500">{student.email}</p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-600">
                            <span>Class: {student.class_name}</span>
                            <span>Progress: {student.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No students enrolled yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Earnings Tab */}
        <TabsContent value="earnings">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  KES {teacherEarnings?.total?.toLocaleString() || 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-yellow-600">
                  KES {teacherEarnings?.pending?.toLocaleString() || 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Paid Out</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  KES {teacherEarnings?.paid?.toLocaleString() || 0}
                </p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {resourcesData?.history && resourcesData.history.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resourcesData.history.map((tx: any) => (
                      <TableRow key={tx.id}>
                        <TableCell>
                          {new Date(tx.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{tx.description}</TableCell>
                        <TableCell>{tx.student}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs ${tx.status === 'Paid'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                              }`}
                          >
                            {tx.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          KES {tx.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No payment history available
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <AuditLogViewer userId={teacherId} limit={50} />
        </TabsContent>
      </Tabs>

      {/* Suspend/Unsuspend Modal */}
      <SuspendUserModal
        open={suspendModalOpen}
        onClose={() => setSuspendModalOpen(false)}
        userId={teacherId}
        userName={teacher?.fullName || 'Teacher'}
        isSuspended={teacher?.isSuspended || false}
      />
    </div>
  );
};

export default TeacherDetails;
