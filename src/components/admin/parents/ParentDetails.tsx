import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Phone, Edit, Save, X, KeyRound, Users, DollarSign } from 'lucide-react';
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

interface ParentDetailsProps {
  parentId: string;
  onBack: () => void;
}

const ParentDetails = ({ parentId, onBack }: ParentDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch parent details
  const { data: parentResponse, isLoading } = useQuery({
    queryKey: ['adminParent', parentId],
    queryFn: () => adminService.getParentById(parentId),
  });

  const parent = parentResponse?.data;

  // Fetch parent's resources (children, payment methods)
  const { data: resourcesResponse } = useQuery({
    queryKey: ['adminParentResources', parentId],
    queryFn: () => adminService.getParentResources(parentId),
    enabled: !!parentId,
  });

  const children = resourcesResponse?.data?.children || [];

  const updateMutation = useMutation({
    mutationFn: (data: any) => adminService.updateParent(parentId, data),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Parent details updated successfully' });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['adminParent', parentId] });
      queryClient.invalidateQueries({ queryKey: ['adminParents'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update parent details',
        variant: 'destructive',
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: () => adminService.resetUserPassword({ userId: parentId, newPassword: generateRandomPassword() }),
    onSuccess: () => {
      toast({ title: 'Password Reset Sent', description: 'Password reset email sent' });
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

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading parent details...</div>;
  }

  if (!parent) {
    return <div className="p-8 text-center text-gray-500">Parent not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{parent?.fullName || 'N/A'}</h2>
            <p className="text-sm text-gray-500">Parent ID: {parent?._id}</p>
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
                      Send password reset email to {parent?.email}?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => resetPasswordMutation.mutate()}>
                      Send Reset Email
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button onClick={() => { setFormData(parent); setIsEditing(true); }}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={() => updateMutation.mutate(formData)}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="children">Children ({children?.length || 0})</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">Total Children</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-2xl font-bold">{children?.length || 0}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">Total Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold">KES 0</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={parent?.isActive ? 'default' : 'secondary'}>
                  {parent?.isActive ? 'Active' : 'Inactive'}
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
                  <Label>Full Name</Label>
                  {isEditing ? (
                    <Input
                      value={formData.fullName || ''}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  ) : (
                    <div className="text-gray-700">{parent?.fullName || 'N/A'}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {parent?.email || 'N/A'}
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
                      {parent?.phoneNumber || 'N/A'}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="children">
          <Card>
            <CardHeader>
              <CardTitle>Children</CardTitle>
            </CardHeader>
            <CardContent>
              {children && children.length > 0 ? (
                <div className="space-y-3">
                  {children.map((child: any) => (
                    <div key={child.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <h4 className="font-medium">{child.fullName}</h4>
                      <p className="text-sm text-gray-500">{child.gradeLevel}</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span>Classes: {child.totalClasses}</span>
                        <span>Progress: {child.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No children found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">No payment history available</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParentDetails;
