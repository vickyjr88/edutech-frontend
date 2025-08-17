import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Mail, 
  MessageCircle, 
  X, 
  Send, 
  User, 
  Phone, 
  GraduationCap,
  Sparkles,
  CheckCircle,
  Plus,
  Trash2,
  Upload,
  Copy,
  UserPlus,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { teacherService, type StudentInviteRequest, type StudentInviteResponse } from '@/integrations/api/services/teacher.service';
import { useClassCohorts } from '@/hooks/useClassCohorts';
import type { TeacherClassSummary } from '@/types/enhanced-classes';

interface InviteStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes?: TeacherClassSummary[];
  onInviteSuccess?: (response: StudentInviteResponse[]) => void;
}

interface StudentData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  id?: string;
}

interface FormData {
  students: StudentData[];
  customMessage: string;
  cohortId: string;
  classId: string;
  bulkMode: boolean;
}

const SUGGESTED_MESSAGES = [
  "I would like to invite you to enroll in my Mathematics 101 class on Kidato. Join us for an exciting learning journey!",
  "You're invited to join my Science class! We'll explore fascinating concepts together. Looking forward to having you!",
  "Join my English Literature class where we'll dive into amazing stories and improve writing skills together!",
  "I'm excited to invite you to my Physics class. We'll make complex concepts simple and fun to understand!",
  "Welcome to my Chemistry class! Let's discover the wonders of science through hands-on experiments and learning."
];

const InviteStudentModal: React.FC<InviteStudentModalProps> = ({
  isOpen,
  onClose,
  classes = [],
  onInviteSuccess
}) => {
  const { user } = useAuth();
  const popupRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormData>({
    students: [{ firstName: '', lastName: '', email: '', phone: '', id: '1' }],
    customMessage: '',
    cohortId: '',
    classId: '',
    bulkMode: false
  });
  const [selectedClass, setSelectedClass] = useState<TeacherClassSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [inviteResponse, setInviteResponse] = useState<StudentInviteResponse[]>([]);

  // Dynamic cohort fetching based on selected class
  const { 
    cohorts, 
    loading: cohortsLoading, 
    error: cohortsError,
    availableCohorts,
    suggestedCohort 
  } = useClassCohorts({
    classId: selectedClass?.classId || null,
    enabled: !!selectedClass?.classId
  });

  // Keyboard navigation and focus management
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus trap - focus the popup when it opens
      popupRef.current?.focus();
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Auto-select suggested cohort when class changes
  useEffect(() => {
    if (suggestedCohort && selectedClass && !formData.cohortId) {
      setFormData(prev => ({ ...prev, cohortId: suggestedCohort._id }));
    }
  }, [suggestedCohort, selectedClass]);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        students: [{ firstName: '', lastName: '', email: '', phone: '', id: '1' }],
        customMessage: '',
        cohortId: '',
        classId: '',
        bulkMode: false
      });
      setSelectedClass(null);
      setIsSuccess(false);
      setInviteResponse([]);
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStudentChange = (index: number, field: keyof StudentData, value: string) => {
    setFormData(prev => ({
      ...prev,
      students: prev.students.map((student, i) => 
        i === index ? { ...student, [field]: value } : student
      )
    }));
  };

  const addStudent = () => {
    setFormData(prev => ({
      ...prev,
      students: [...prev.students, { 
        firstName: '', 
        lastName: '', 
        email: '', 
        phone: '', 
        id: Date.now().toString() 
      }]
    }));
  };

  const removeStudent = (index: number) => {
    if (formData.students.length > 1) {
      setFormData(prev => ({
        ...prev,
        students: prev.students.filter((_, i) => i !== index)
      }));
    }
  };

  const parseCSVInput = (csvText: string) => {
    const lines = csvText.trim().split('\n');
    const students: StudentData[] = [];
    
    lines.forEach((line, index) => {
      const [firstName, lastName, email, phone] = line.split(',').map(s => s.trim());
      if (firstName && lastName && email) {
        students.push({
          firstName,
          lastName,
          email,
          phone: phone || '',
          id: `csv-${index}`
        });
      }
    });
    
    if (students.length > 0) {
      setFormData(prev => ({ ...prev, students, bulkMode: true }));
    }
  };

  const generatePersonalizedMessage = () => {
    const className = selectedClass?.title || 'my class';
    const teacherName = user?.fullName || 'your teacher';
    
    const personalizedMessage = formData.bulkMode 
      ? `Hello! I'm ${teacherName} and I'd love to invite you to join my ${className} on Kidato. We have an amazing curriculum designed to help you excel and reach your learning goals. Looking forward to having you as part of our learning community!`
      : `Hi {firstName}! I'm ${teacherName} and I'd love to invite you to join my ${className} on Kidato. We have an amazing curriculum designed to help you excel and reach your learning goals. Looking forward to having you as part of our learning community!`;
    
    handleInputChange('customMessage', personalizedMessage);
  };

  const useSuggestedMessage = (message: string) => {
    // Replace placeholder class name with actual class
    const className = selectedClass?.title || selectedClass?.name || 'class';
    const personalizedMessage = message.replace(/Mathematics 101|Science|English Literature|Physics|Chemistry/, className);
    handleInputChange('customMessage', personalizedMessage);
  };

  const validateForm = (): boolean => {
    const hasValidStudents = formData.students.every(student => 
      student.firstName.trim() && 
      student.lastName.trim() && 
      student.email.trim() && 
      student.phone.trim()
    );
    
    return !!(
      hasValidStudents &&
      formData.students.length > 0 &&
      formData.customMessage.trim() &&
      formData.cohortId
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user?.teacherId) {
      return;
    }

    setIsLoading(true);
    
    try {
      const responses: StudentInviteResponse[] = [];
      
      for (const student of formData.students) {
        const customMessage = formData.customMessage.replace('{firstName}', student.firstName);
        
        const inviteData: StudentInviteRequest = {
          firstName: student.firstName.trim(),
          lastName: student.lastName.trim(),
          email: student.email.trim(),
          phone: student.phone.trim(),
          customMessage: customMessage.trim(),
          cohortId: formData.cohortId
        };

        const { data, error } = await teacherService.inviteStudentToClass(
          user.teacherId,
          inviteData
        );

        if (error) {
          console.error(`Error inviting ${student.firstName}:`, error);
          continue;
        }

        if (data) {
          responses.push(...data);
        }
      }

      if (responses.length > 0) {
        setInviteResponse(responses);
        setIsSuccess(true);
        onInviteSuccess?.(responses);
      }
    } catch (error) {
      console.error('Error sending invitations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isSuccess) {
      setIsSuccess(false);
      setInviteResponse([]);
    }
    onClose();
  };

  if (isSuccess && inviteResponse.length > 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300" 
          onClick={handleClose}
        />
        
        {/* Success Popup */}
        <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 animate-in slide-in-from-bottom-4 zoom-in-95 duration-300">
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-green-800">
                  {inviteResponse.length === 1 ? 'Invitation Sent!' : `${inviteResponse.length} Invitations Sent!`}
                </h2>
                <p className="text-sm text-green-600">Successfully delivered via WhatsApp and Email</p>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="px-6 pb-6">
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {inviteResponse.map((response, index) => (
                <Card key={index} className="bg-green-50/80 border-green-200/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-800">
                            {response.inviteeFirstName} {response.inviteeLastName}
                          </p>
                          <p className="text-sm text-green-600">{response.inviteeEmail}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {response.status}
                        </Badge>
                      </div>
                      
                      <div className="bg-white/70 rounded-lg p-3 border border-green-200/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Invitation Code</span>
                        </div>
                        <p className="font-mono text-sm bg-green-100/70 px-2 py-1 rounded border">
                          {response.invitationCode}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200/50">
              <Button 
                onClick={handleClose}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Done
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsSuccess(false);
                  setInviteResponse([]);
                }}
                className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Send More
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={handleClose}
      />
      
      {/* Main Popup */}
      <div 
        ref={popupRef}
        tabIndex={-1}
        className="relative w-full max-w-4xl max-h-[98vh] sm:max-h-[95vh] bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 animate-in slide-in-from-bottom-4 zoom-in-95 duration-300 overflow-hidden focus:outline-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-modal-title"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 p-4 sm:p-6 pb-3 sm:pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#5e6ad2] to-[#abb4dd] rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 id="invite-modal-title" className="text-lg sm:text-xl font-bold text-gray-900">Invite Students to Class</h2>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Send personalized invitations via WhatsApp and email</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(98vh-100px)] sm:max-h-[calc(95vh-120px)]" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent'
        }}>
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            
            {/* Tab Navigation */}
            <Tabs defaultValue="single" className="space-y-4 sm:space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100/50 p-1 rounded-xl h-12">
                <TabsTrigger value="single" className="flex items-center gap-1 sm:gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Single Student</span>
                  <span className="sm:hidden">Single</span>
                </TabsTrigger>
                <TabsTrigger value="bulk" className="flex items-center gap-1 sm:gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Bulk Invite</span>
                  <span className="sm:hidden">Bulk</span>
                </TabsTrigger>
              </TabsList>
            <TabsContent value="single" className="space-y-6 mt-0">
              {/* Single Student Form */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Student Information
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <Input
                      value={formData.students[0]?.firstName || ''}
                      onChange={(e) => handleStudentChange(0, 'firstName', e.target.value)}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <Input
                      value={formData.students[0]?.lastName || ''}
                      onChange={(e) => handleStudentChange(0, 'lastName', e.target.value)}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={formData.students[0]?.email || ''}
                    onChange={(e) => handleStudentChange(0, 'email', e.target.value)}
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={formData.students[0]?.phone || ''}
                    onChange={(e) => handleStudentChange(0, 'phone', e.target.value)}
                    placeholder="+2547"
                    required
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bulk" className="space-y-6 mt-0">
              {/* Bulk Student Form */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Student List ({formData.students.length})
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addStudent}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Student
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '.csv';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              const text = e.target?.result as string;
                              parseCSVInput(text);
                            };
                            reader.readAsText(file);
                          }
                        };
                        input.click();
                      }}
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Import CSV
                    </Button>
                  </div>
                </div>

                {/* CSV Format Helper */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>CSV Format:</strong> firstName, lastName, email, phone (one per line)
                  </p>
                  <p className="text-xs text-blue-600">
                    Example: John, Doe, john.doe@email.com, +254712345678
                  </p>
                </div>

                {/* Student List */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {formData.students.map((student, index) => (
                    <Card key={student.id || index} className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline">#{index + 1}</Badge>
                        {formData.students.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStudent(index)}
                            className="ml-auto text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="First Name"
                          value={student.firstName}
                          onChange={(e) => handleStudentChange(index, 'firstName', e.target.value)}
                          required
                        />
                        <Input
                          placeholder="Last Name"
                          value={student.lastName}
                          onChange={(e) => handleStudentChange(index, 'lastName', e.target.value)}
                          required
                        />
                        <Input
                          type="email"
                          placeholder="Email"
                          value={student.email}
                          onChange={(e) => handleStudentChange(index, 'email', e.target.value)}
                          required
                        />
                        <Input
                          type="tel"
                          placeholder="Phone"
                          value={student.phone}
                          onChange={(e) => handleStudentChange(index, 'phone', e.target.value)}
                          required
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            </Tabs>

            {/* Class and Cohort Selection - Shared Section */}
            <div className="space-y-4 bg-gray-50/50 rounded-xl p-4 border border-gray-200/50">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Class & Cohort Selection
              </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Class
              </label>
              <Select 
                value={selectedClass?.classId || ''} 
                onValueChange={(value) => {
                  const cls = classes.find(c => c.classId === value);
                  setSelectedClass(cls);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.classId} value={cls.classId}>
                      {cls.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Cohort
              </label>
              <Select 
                value={formData.cohortId} 
                onValueChange={(value) => handleInputChange('cohortId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a cohort" />
                </SelectTrigger>
                <SelectContent>
                  {cohortsLoading ? (
                    <SelectItem value="loading" disabled>Loading cohorts...</SelectItem>
                  ) : cohorts.length > 0 ? (
                    cohorts.map((cohort) => (
                      <SelectItem key={cohort._id} value={cohort._id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{cohort.name}</span>
                          <div className="flex gap-1 text-xs text-gray-500">
                            <span>{cohort.currentStudents}/{cohort.maximumStudents}</span>
                            {cohort === suggestedCohort && <Badge variant="outline" className="text-xs">Suggested</Badge>}
                          </div>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-cohorts" disabled>
                      {selectedClass ? 'No cohorts available for this class' : 'Please select a class first'}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            </div>

            {/* Custom Message - Shared Section */}
            <div className="space-y-4 bg-gray-50/50 rounded-xl p-4 border border-gray-200/50">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Invitation Message
                </h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={generatePersonalizedMessage}
                className="text-[#5e6ad2] hover:bg-[#5e6ad2]/10"
                disabled={!formData.students[0]?.firstName || !selectedClass}
              >
                <Sparkles className="w-4 h-4 mr-1" />
                Generate AI Message
              </Button>
            </div>

            <Textarea
              value={formData.customMessage}
              onChange={(e) => handleInputChange('customMessage', e.target.value)}
              placeholder="Write a personalized invitation message..."
              rows={4}
              required
            />

            {/* Suggested Messages */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Quick suggestions:</p>
              <div className="grid gap-2">
                {SUGGESTED_MESSAGES.slice(0, 2).map((message, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-left h-auto p-3 whitespace-normal justify-start"
                    onClick={() => useSuggestedMessage(message)}
                  >
                    <div className="text-xs text-gray-600 line-clamp-2">
                      {message}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
            </div>

            {/* Invitation Preview */}
          {formData.students[0]?.firstName && formData.customMessage && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Preview</h4>
              <div className="bg-white rounded-md p-3 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium">WhatsApp Message</span>
                </div>
                <p className="text-sm text-gray-700">
                  {formData.customMessage.replace('{firstName}', formData.students[0]?.firstName || 'Student')}
                </p>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    📧 A detailed email invitation will also be sent to {formData.students[0]?.email || 'their email'}
                  </p>
                  {formData.students.length > 1 && (
                    <p className="text-xs text-gray-500 mt-1">
                      + {formData.students.length - 1} more student{formData.students.length > 2 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t border-gray-200/50 sticky bottom-0 bg-white/80 backdrop-blur-md">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 border-gray-300 hover:bg-gray-50 h-12"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!validateForm() || isLoading}
                className="flex-1 bg-gradient-to-r from-[#5e6ad2] to-[#abb4dd] hover:from-[#5e6ad2]/90 hover:to-[#abb4dd]/90 text-white shadow-md h-12"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    <span className="hidden sm:inline">
                      Sending {formData.students.length > 1 ? `${formData.students.length} invitations` : 'invitation'}...
                    </span>
                    <span className="sm:hidden">Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">
                      Send {formData.students.length > 1 ? `${formData.students.length} Invitations` : 'Invitation'}
                    </span>
                    <span className="sm:hidden">
                      Send {formData.students.length > 1 ? `(${formData.students.length})` : ''}
                    </span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InviteStudentModal;