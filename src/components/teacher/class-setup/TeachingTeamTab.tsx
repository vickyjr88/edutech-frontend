
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ClassFormValues, TeamMember } from "./types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, X, AlertCircle, Mail, Phone, Send, CheckCircle, Users, Sparkles, MessageSquare } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/integrations/api/client";
import { classService } from "@/integrations/api/services/class.service";

interface InviteFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  personalMessage: string;
  apiResponse?: {
    success: boolean;
    message: string;
    teacher: {
      id: string;
      name: string;
      email: string;
      phone: string;
    };
    isNewUser: boolean;
  };
}

interface TeachingTeamTabProps {
  form: UseFormReturn<ClassFormValues>;
  onPreviousTab: () => void;
  onNextTab: () => void; 
  isSubmitting: boolean;
  hasTeamTeaching: boolean;
  teamMembers: TeamMember[];
  addTeamMember: () => void;
  removeTeamMember: (id: string) => void;
  updateTeamMember: (id: string, field: "email" | "role", value: string) => void;
  classId?: string;
  setTeamMembers?: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  onRefreshClassData?: () => Promise<void>; // Add refresh class data function
}

// Awesome Co-Teacher Invitation Dialog Component
const CoTeacherInviteDialog = ({ 
  isOpen, 
  onClose, 
  onInvite,
  classId
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onInvite: (data: InviteFormData) => void;
  classId?: string;
}) => {
  const [formData, setFormData] = useState<InviteFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'co-teacher',
    personalMessage: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const { toast } = useToast();

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in the required fields (name and email).",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      if (!classId) {
        // For new classes that haven't been saved yet, store locally
        toast({
          title: "Class Not Saved Yet",
          description: "Save your class first, then you can send invitations to co-teachers.",
          variant: "default",
        });
        
        // Still add them to the local team for now
        onInvite(formData);
        setStep('success');
        
        setTimeout(() => {
          setStep('form');
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            role: 'co-teacher',
            personalMessage: ''
          });
          onClose();
        }, 2000);
        
        return;
      }
      
      // Make API call to invite co-teacher
      console.log('📡 Making API call to invite co-teacher:', {
        endpoint: `/classes/${classId}/teaching-team/invite`,
        payload: {
          name: fullName,
          email: formData.email,
          phone: formData.phone || undefined
        }
      });
      
      const response = await api.post(`/classes/${classId}/teaching-team/invite`, {
        name: fullName,
        email: formData.email,
        phone: formData.phone || undefined // Only include phone if provided
      });

      console.log('📦 API Response:', response);

      if (response.error) {
        console.error('❌ API Error:', response.error);
        throw new Error(response.error.message || 'Failed to send invitation');
      }

      console.log('✅ API call successful, passing data to parent:', {
        formData,
        apiResponse: response.data
      });

      // Pass the API response data to the parent
      onInvite({
        ...formData,
        apiResponse: response.data
      });
      
      setStep('success');
      
      setTimeout(() => {
        setStep('form');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          role: 'co-teacher',
          personalMessage: ''
        });
        onClose();
      }, 3000); // Increased from 2000ms to 3000ms to give more time
      
    } catch (error) {
      console.error('Invitation error:', error);
      toast({
        title: "Invitation Failed",
        description: error instanceof Error ? error.message : "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultMessage = `Hi ${formData.firstName || '[Name]'},

I'd love to have you as a ${formData.role === 'co-teacher' ? 'co-teacher' : 'teaching assistant'} for my upcoming class! 

You'll be able to help create lesson plans, interact with students, and collaborate on making this an amazing learning experience.

Looking forward to working together!`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 'form' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <UserPlus className="h-5 w-5 text-blue-600" />
                  </div>
                  Invite a Co-Teacher
                </DialogTitle>
                <DialogDescription>
                  Send a personalized invitation to collaborate on your class
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="John"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Doe"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john.doe@example.com"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Role
                  </Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="co-teacher">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Co-Teacher
                        </div>
                      </SelectItem>
                      <SelectItem value="teaching-assistant">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Teaching Assistant
                        </div>
                      </SelectItem>
                      <SelectItem value="guest-lecturer">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Guest Lecturer
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Personal Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    Personal Message
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.personalMessage || defaultMessage}
                    onChange={(e) => setFormData(prev => ({ ...prev, personalMessage: e.target.value }))}
                    placeholder="Write a personal message..."
                    className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-muted-foreground">
                    Tip: A personal message increases the likelihood of acceptance!
                  </p>
                </div>

                {/* Preview Card */}
                <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Invitation Preview
                  </p>
                  <div className="text-sm">
                    <p className="font-medium">
                      {formData.firstName} {formData.lastName} {formData.firstName && '→'}
                    </p>
                    <p className="text-muted-foreground">{formData.email}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {formData.role === 'co-teacher' ? 'Co-Teacher' : 
                       formData.role === 'teaching-assistant' ? 'Teaching Assistant' : 'Guest Lecturer'}
                    </Badge>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || !formData.firstName || !formData.lastName || !formData.email}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div 
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      />
                      Sending Invitation...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </DialogFooter>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="text-center py-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
                className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
              >
                <CheckCircle className="h-8 w-8 text-green-600" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Invitation Sent! 🎉
              </h3>
              <p className="text-muted-foreground">
                {formData.firstName} will receive an email invitation to join your teaching team.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

const TeachingTeamTab = ({
  form,
  onPreviousTab,
  onNextTab,
  isSubmitting,
  hasTeamTeaching,
  teamMembers,
  addTeamMember,
  removeTeamMember,
  updateTeamMember,
  classId,
  setTeamMembers,
  onRefreshClassData,
}: TeachingTeamTabProps) => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [removingTeacherId, setRemovingTeacherId] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [forceUpdateKey, setForceUpdateKey] = useState(0); // Force re-render mechanism
  const { toast } = useToast();


  const handleInviteTeacher = async (inviteData: InviteFormData) => {
    const fullName = `${inviteData.firstName} ${inviteData.lastName}`.trim();
    
    console.log('🎯 handleInviteTeacher called with:', { 
      fullName, 
      hasApiResponse: !!inviteData.apiResponse,
      apiSuccess: inviteData.apiResponse?.success,
      classId 
    });
    
    if (inviteData.apiResponse && inviteData.apiResponse.success) {
      console.log('✅ API call was successful, refreshing entire class data...');
      
      const { teacher, isNewUser, message } = inviteData.apiResponse;

      // Refresh the entire class data from the parent component
      if (onRefreshClassData) {
        try {
          await onRefreshClassData();
          console.log('🔄 Entire class data refresh completed');
        } catch (error) {
          console.error('❌ Error during class data refresh:', error);
        }
      }

      toast({
        title: isNewUser ? "New Teacher Invited! 🎉" : "Teacher Added! 🎉",
        description: isNewUser 
          ? `${teacher.name} has been invited to join your teaching team.`
          : `${teacher.name} has been added to your teaching team.`,
      });
    } else {
      console.log('⚠️ No successful API response, handling locally...');

    }
  };

  const handleRemoveTeacher = async (teacherId: string) => {
    if (!classId) {
      // For new classes, just remove locally
      removeTeamMember(teacherId);
      setRemovingTeacherId(null);
      toast({
        title: "Teacher Removed",
        description: "The teacher has been removed from your team list.",
      });
      return;
    }

    setIsRemoving(true);
    
    try {
      // Make API call to remove teacher from teaching team
      const response = await api.delete(`/classes/${classId}/teaching-team/${teacherId}`);

      if (response.error) {
        throw new Error(response.error.message || 'Failed to remove teacher');
      }

      // Refresh the entire class data from the parent component
      if (onRefreshClassData) {
        try {
          await onRefreshClassData();
          console.log('🔄 Entire class data refresh completed after removing teacher');
        } catch (error) {
          console.error('❌ Error during class data refresh:', error);
        }
      }
      setRemovingTeacherId(null);

      toast({
        title: "Teacher Removed Successfully! ✅",
        description: "The teacher has been removed from your teaching team.",
      });

    } catch (error) {
      console.error('Remove teacher error:', error);
      toast({
        title: "Failed to Remove Teacher",
        description: error instanceof Error ? error.message : "Failed to remove teacher. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRemoving(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'co-teacher': return 'bg-green-100 text-green-700 border-green-200';
      case 'teaching-assistant': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'guest-lecturer': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'co-teacher': return 'Co-Teacher';
      case 'teaching-assistant': return 'Teaching Assistant';
      case 'guest-lecturer': return 'Guest Lecturer';
      default: return role;
    }
  };

  return (
    <div key={forceUpdateKey} className="space-y-6">
      <div className="space-y-4">
        <CardHeader className="px-0">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Teaching Team
            {teamMembers.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {teamMembers.length} {teamMembers.length === 1 ? 'member' : 'members'}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Invite other teachers to collaborate on this class. They'll have access to modify the class, create lessons, and communicate with students.
          </CardDescription>
        </CardHeader>

        {hasTeamTeaching ? (
          <>
            {console.log('🔍 Rendering team members, length:', teamMembers.length, 'members:', teamMembers)}
            {teamMembers.length === 0 ? (
              <Card className="border-dashed border-2 hover:border-blue-300 transition-colors">
                <CardContent className="pt-8 pb-8 text-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4"
                  >
                    <UserPlus className="h-8 w-8 text-blue-600" />
                  </motion.div>
                  <h3 className="text-lg font-medium mb-2">Start Building Your Team</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Collaboration makes classes better! Invite experienced teachers to help create amazing learning experiences.
                  </p>
                  <Button 
                    onClick={() => setIsInviteDialogOpen(true)} 
                    className="bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    Invite a Co-Teacher
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {teamMembers.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-md transition-all duration-200">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                              <div>
                                <Label className="text-sm font-medium mb-2 flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  Email Address
                                </Label>
                                <Input
                                  type="email"
                                  value={member.email}
                                  onChange={(e) => updateTeamMember(member.id, "email", e.target.value)}
                                  placeholder="colleague@example.com"
                                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <Label className="text-sm font-medium mb-2 flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  Role
                                </Label>
                                <Select
                                  value={member.role || "co-teacher"}
                                  onValueChange={(value) => updateTeamMember(member.id, "role", value)}
                                >
                                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="Select a role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="co-teacher">
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        Co-Teacher
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="teaching-assistant">
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        Teaching Assistant
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="guest-lecturer">
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        Guest Lecturer
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getRoleBadgeColor(member.role || 'co-teacher')}`}
                              >
                                {getRoleDisplayName(member.role || 'co-teacher')}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setRemovingTeacherId(member.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={() => setIsInviteDialogOpen(true)} 
                    variant="outline" 
                    className="w-full border-dashed border-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 h-12"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Another Team Member
                  </Button>
                </motion.div>
              </div>
            )}
          </>
        ) : (
          <Alert variant="default" className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Team teaching is disabled</AlertTitle>
            <AlertDescription className="text-amber-700">
              Enable team teaching in the basic information tab to invite other teachers to collaborate on this class.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="ghost" onClick={onPreviousTab}>
          Previous: Cohorts & Schedule
        </Button>
        <Button type="button" onClick={onNextTab}>
          Next: Preview
        </Button>
      </div>

      <CoTeacherInviteDialog
        isOpen={isInviteDialogOpen}
        onClose={() => setIsInviteDialogOpen(false)}
        onInvite={handleInviteTeacher}
        classId={classId}
      />

      {/* Remove Teacher Confirmation Dialog */}
      {removingTeacherId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setRemovingTeacherId(null)}
          />
          
          {/* Floating Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="relative bg-white rounded-xl shadow-2xl border p-6 w-96 mx-4"
          >
            <div className="text-center">
              {/* Warning Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 150 }}
                className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"
              >
                <AlertCircle className="h-8 w-8 text-red-600" />
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Remove Teacher from Team?
              </h3>
              
              {(() => {
                const teacherToRemove = teamMembers.find(m => m.id === removingTeacherId);
                const teacherEmail = teacherToRemove?.email || 'this teacher';
                
                return (
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      Are you sure you want to remove <span className="font-medium text-gray-900">{teacherEmail}</span> from your teaching team?
                    </p>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-amber-600 mr-2 flex-shrink-0" />
                        <p className="text-sm text-amber-700">
                          {classId 
                            ? "They will lose access to this class and receive a notification email."
                            : "They will be removed from your local team list."
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 justify-center mt-6">
              <Button
                variant="outline"
                onClick={() => setRemovingTeacherId(null)}
                disabled={isRemoving}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleRemoveTeacher(removingTeacherId)}
                disabled={isRemoving}
                className="px-6 bg-red-600 hover:bg-red-700"
              >
                {isRemoving ? (
                  <>
                    <motion.div 
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                    Removing...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Remove Teacher
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TeachingTeamTab;
