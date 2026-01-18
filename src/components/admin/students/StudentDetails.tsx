import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Calendar,
  Edit,
  Save,
  X,
  KeyRound,
  BookOpen,
  TrendingUp,
  User,
  Activity,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  History,
  ExternalLink,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { adminService } from '@/integrations/api/services/admin.service';
import { teachingConfigService } from '@/integrations/api/services/teaching-config.service';
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
import AuditLogViewer from '@/components/admin/users/AuditLogViewer';
import ManageAssociations from '@/components/admin/users/ManageAssociations';

interface StudentDetailsProps {
  studentId: string;
  onBack: () => void;
}

const StudentDetails = ({ studentId, onBack }: StudentDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch student details and resources
  const { data: studentResponse, isLoading } = useQuery({
    queryKey: ['adminStudent', studentId],
    queryFn: () => adminService.getStudentById(studentId),
  });

  const rawStudent = studentResponse?.data;
  const student = (rawStudent as any)?.data || rawStudent;

  // Fetch student's resources (enrollments, achievements, progress)
  const { data: resourcesResponse } = useQuery({
    queryKey: ['adminStudentResources', studentId],
    queryFn: () => adminService.getStudentResources(studentId),
    enabled: !!studentId,
  });

  const resources = resourcesResponse?.data?.studentProfile || resourcesResponse?.data || {};
  const enrollments = resources?.enrollments || [];
  const parents = resources?.parents || [];
  const enrolledClasses = resources?.enrolledClasses || 0;

  // Birthday Countdown
  const birthdayCountdown = useMemo(() => {
    if (!resources?.dateOfBirth) return null;
    const dob = new Date(resources.dateOfBirth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentYear = today.getFullYear();
    const nextBirthday = new Date(dob);
    nextBirthday.setFullYear(currentYear);
    nextBirthday.setHours(0, 0, 0, 0);

    if (nextBirthday < today) {
      nextBirthday.setFullYear(currentYear + 1);
    }

    const diffTime = nextBirthday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays <= 30) {
      return (
        <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full w-fit mt-1 block">
          🎂 {diffDays === 0 ? 'Today!' : `${diffDays} days to birthday!`}
        </span>
      );
    }
    return null;
  }, [resources?.dateOfBirth]);

  // Fetch active grade levels
  const { data: gradeLevelsResponse } = useQuery({
    queryKey: ['activeGradeLevels'],
    queryFn: () => teachingConfigService.getActiveGradeLevels(),
  });
  const gradeLevels = gradeLevelsResponse?.data || [];

  // Fetch active curricula
  const { data: curriculaResponse } = useQuery({
    queryKey: ['activeCurricula'],
    queryFn: () => teachingConfigService.getActiveCurricula(),
  });
  const curricula = curriculaResponse?.data || [];

  // Update student mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => adminService.updateStudent(studentId, data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Student details updated successfully',
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['adminStudent', studentId] });
      queryClient.invalidateQueries({ queryKey: ['adminStudents'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update student details',
        variant: 'destructive',
      });
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: () => adminService.resetUserPassword({ userId: studentId, newPassword: generateRandomPassword() }),
    onSuccess: () => {
      toast({
        title: 'Password Reset Sent',
        description: 'Password reset email has been sent to the student',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send password reset email',
        variant: 'destructive',
      });
    },
  });

  // Activate/Deactivate mutations
  const activateMutation = useMutation({
    mutationFn: () => adminService.bulkAction({
      userIds: [studentId],
      action: 'activate',
    }),
    onSuccess: () => {
      toast({
        title: 'Student Activated',
        description: 'The student has been activated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['adminStudent', studentId] });
      queryClient.invalidateQueries({ queryKey: ['adminStudents'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to activate student',
        variant: 'destructive',
      });
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: () => adminService.bulkAction({
      userIds: [studentId],
      action: 'deactivate',
    }),
    onSuccess: () => {
      toast({
        title: 'Student Deactivated',
        description: 'The student has been deactivated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['adminStudent', studentId] });
      queryClient.invalidateQueries({ queryKey: ['adminStudents'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to deactivate student',
        variant: 'destructive',
      });
    },
  });

  // Helper function to generate random password
  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-10) + Math.random().toString(36).toUpperCase().slice(-2);
  };

  const handleEdit = () => {
    setFormData({
      ...student,
      gradeLevel: resources.grade || student?.gradeLevel,
      curriculum: resources.curriculum,
      dateOfBirth: resources.dateOfBirth,
    });
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
      gradeLevel: formData.gradeLevel,
      curriculum: formData.curriculum,
      dateOfBirth: formData.dateOfBirth,
    };
    updateMutation.mutate(allowedFields);
  };

  const handleResetPassword = () => {
    resetPasswordMutation.mutate();
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading student details...</div>;
  }

  if (!student) {
    return <div className="p-8 text-center text-gray-500">Student not found</div>;
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
            <h2 className="text-2xl font-bold">{student?.fullName || 'N/A'}</h2>
            <p className="text-sm text-gray-500">Student ID: {student?._id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              {/* Suspension/Activation Controls */}
              {student?.isSuspended ? (
                <Button
                  variant="outline"
                  onClick={() => setSuspendModalOpen(true)}
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Unsuspend
                </Button>
              ) : student?.isActive ? (
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
                        <AlertDialogTitle>Deactivate Student</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will deactivate the student account. They will not be able to log in
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
                      <AlertDialogTitle>Activate Student</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will activate the student account, allowing them to log in and access the platform.
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
                      This will send a password reset email to {student?.email}. The student
                      will receive instructions to create a new password.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetPassword}>
                      Send Reset Email
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
          <TabsTrigger value="enrollments">Enrollments ({enrollments?.length || 0})</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="parent">Parent Info</TabsTrigger>
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
                <CardTitle className="text-sm font-medium text-gray-500">Enrolled Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="text-2xl font-bold">{enrollments?.length || 0}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold">{student?.progress || 0}%</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {student?.isSuspended ? (
                    <Badge variant="destructive" className="gap-1">
                      <Shield className="h-3 w-3" />
                      Suspended
                    </Badge>
                  ) : student?.isActive ? (
                    <Badge variant="default" className="bg-green-600">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
                {student?.isSuspended && student?.suspendedUntil && (
                  <p className="text-xs text-gray-500 mt-2">
                    Until: {new Date(student.suspendedUntil).toLocaleDateString()}
                  </p>
                )}
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
                      {student?.fullName || 'N/A'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {student?.email || 'N/A'}
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
                      {student?.phoneNumber || 'N/A'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Grade Level</Label>
                  {isEditing ? (
                    <Select
                      value={formData.gradeLevel || ''}
                      onValueChange={(value) =>
                        setFormData({ ...formData, gradeLevel: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select active grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeLevels.map((grade: any) => (
                          <SelectItem key={grade.code} value={grade.code}>
                            {grade.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="text-gray-700">
                      {resources.grade || student?.gradeLevel || 'N/A'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Curriculum</Label>
                  {isEditing ? (
                    <Select
                      value={formData.curriculum || ''}
                      onValueChange={(value) =>
                        setFormData({ ...formData, curriculum: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select active curriculum" />
                      </SelectTrigger>
                      <SelectContent>
                        {curricula.map((curr: any) => (
                          <SelectItem key={curr.code} value={curr.code}>
                            {curr.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="text-gray-700">
                      {resources.curriculum || 'N/A'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
                      onChange={(e) =>
                        setFormData({ ...formData, dateOfBirth: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {resources.dateOfBirth
                          ? new Date(resources.dateOfBirth).toLocaleDateString()
                          : 'N/A'}
                      </div>
                      {birthdayCountdown}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {student?.createdAt
                      ? new Date(student?.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enrollments Tab */}
        <TabsContent value="enrollments">
          <Card>
            <CardHeader>
              <CardTitle>Student's Enrollments ({enrollments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {enrollments && enrollments.length > 0 ? (
                <div className="space-y-3">
                  {enrollments.map((enrollment: any) => (
                    <div key={enrollment.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{enrollment.className}</h4>
                          <p className="text-sm text-gray-500">
                            Teacher: {enrollment.teacherName}
                            {enrollment.teacherId && (
                              <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0 ml-2"
                                onClick={() => navigate(`/admin/teachers?id=${enrollment.teacherId}`)}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            )}
                          </p>
                          {enrollment.subject && (
                            <p className="text-xs text-gray-500">Subject: {enrollment.subject}</p>
                          )}
                          <div className="flex gap-4 mt-2 text-sm text-gray-600">
                            {enrollment.sessionDate && (
                              <span>Session: {new Date(enrollment.sessionDate).toLocaleDateString()}</span>
                            )}
                            {enrollment.price > 0 && (
                              <span>Price: KES {enrollment.price.toLocaleString()}</span>
                            )}
                            {enrollment.paymentStatus && (
                              <Badge
                                variant={enrollment.paymentStatus === 'paid' ? 'default' : 'secondary'}
                                className={enrollment.paymentStatus === 'paid' ? 'bg-green-600' : ''}
                              >
                                {enrollment.paymentStatus}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            Booked: {enrollment.createdAt ? new Date(enrollment.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <Badge
                          variant={
                            enrollment.status === 'completed'
                              ? 'default'
                              : enrollment.status === 'confirmed'
                                ? 'secondary'
                                : enrollment.status === 'cancelled'
                                  ? 'destructive'
                                  : 'outline'
                          }
                          className={enrollment.status === 'completed' ? 'bg-green-600' : ''}
                        >
                          {enrollment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No enrollments found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">{enrolledClasses}</p>
                    <p className="text-sm text-gray-600">Enrolled Classes</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">{resources?.completedClasses || 0}</p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-600">{resources?.activeEnrollments || 0}</p>
                    <p className="text-sm text-gray-600">Active</p>
                  </div>
                </div>
                {resources?.learningStreak > 0 && (
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-600">Learning Streak</p>
                    <p className="text-xl font-bold">{resources.learningStreak} days 🔥</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parent Info Tab */}
        <TabsContent value="parent" className="space-y-4">
          {/* Associated Parents with Navigation */}
          {parents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Associated Parents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {parents.map((parent: any) => (
                    <div
                      key={parent.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium">{parent.fullName || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">{parent.email || '-'}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/parents?id=${parent.id}`)}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Parent
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Manage Associations */}
          <ManageAssociations
            userId={studentId}
            userType="student"
            userName={student?.fullName || 'Student'}
          />
        </TabsContent>

        {/* Activity History Tab */}
        <TabsContent value="activity">
          <AuditLogViewer userId={studentId} limit={50} />
        </TabsContent>
      </Tabs>

      {/* Suspend/Unsuspend Modal */}
      <SuspendUserModal
        open={suspendModalOpen}
        onClose={() => setSuspendModalOpen(false)}
        userId={studentId}
        userName={student?.fullName || 'Student'}
        isSuspended={student?.isSuspended || false}
      />
    </div>
  );
};

export default StudentDetails;
