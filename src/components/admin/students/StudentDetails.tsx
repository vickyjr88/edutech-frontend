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
  Calendar,
  Edit,
  Save,
  X,
  KeyRound,
  BookOpen,
  TrendingUp,
  User,
  Activity,
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

interface StudentDetailsProps {
  studentId: string;
  onBack: () => void;
}

const StudentDetails = ({ studentId, onBack }: StudentDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch student details and resources
  const { data: studentResponse, isLoading } = useQuery({
    queryKey: ['adminStudent', studentId],
    queryFn: () => adminService.getStudentById(studentId),
  });

  const student = studentResponse?.data;

  // Fetch student's resources (enrollments, achievements, progress)
  const { data: resourcesResponse } = useQuery({
    queryKey: ['adminStudentResources', studentId],
    queryFn: () => adminService.getStudentResources(studentId),
    enabled: !!studentId,
  });

  const enrollments = resourcesResponse?.data?.enrollments || [];

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

  // Helper function to generate random password
  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-10) + Math.random().toString(36).toUpperCase().slice(-2);
  };

  const handleEdit = () => {
    setFormData(student);
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
                <Badge variant={student?.isActive ? 'default' : 'secondary'}>
                  {student?.isActive ? 'Active' : 'Inactive'}
                </Badge>
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
                    <Input
                      value={formData.gradeLevel || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, gradeLevel: e.target.value })
                      }
                    />
                  ) : (
                    <div className="text-gray-700">{student?.gradeLevel || 'N/A'}</div>
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
              <CardTitle>Student's Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              {enrollments && enrollments.length > 0 ? (
                <div className="space-y-3">
                  {enrollments.map((enrollment: any) => (
                    <div key={enrollment.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{enrollment.className}</h4>
                          <p className="text-sm text-gray-500">{enrollment.teacherName}</p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-600">
                            <span>Progress: {enrollment.progress}%</span>
                            <span>Attendance: {enrollment.attendance}%</span>
                            <span>Grade: {enrollment.grade}</span>
                          </div>
                        </div>
                        <Badge>{enrollment.status}</Badge>
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
              <p className="text-gray-500 text-center py-8">Progress data will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parent Info Tab */}
        <TabsContent value="parent">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Parent Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">Parent information will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDetails;
