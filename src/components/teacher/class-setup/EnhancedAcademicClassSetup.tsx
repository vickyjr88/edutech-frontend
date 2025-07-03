import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Users, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Eye,
  Send
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { AcademicClassProvider, useAcademicClass } from './AcademicClassContext';
import AcademicClassCreator from './AcademicClassCreator';
import { ClassFormValues } from './types';
import { classService } from '@/integrations/api/services/class.service';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ClassCompletionModalProps {
  isOpen: boolean;
  classData: ClassFormValues;
  classId: string;
  onViewClass: () => void;
  onInviteStudents: () => void;
  onCreateAnother: () => void;
}

const ClassCompletionModal: React.FC<ClassCompletionModalProps> = ({
  isOpen,
  classData,
  classId,
  onViewClass,
  onInviteStudents,
  onCreateAnother
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="h-10 w-10" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-2">Class Published!</h2>
          <p className="text-green-100 text-lg">
            "{classData.title}" is now live and ready for students
          </p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">View Live Class</h3>
                <p className="text-sm text-gray-600">See how students will discover your class</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Invite Students</h3>
                <p className="text-sm text-gray-600">Start building your first cohort</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Manage Schedule</h3>
                <p className="text-sm text-gray-600">Set up your teaching calendar</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button onClick={onViewClass} variant="outline" className="h-12">
                <Eye className="mr-2 h-4 w-4" />
                View Class Page
              </Button>
              <Button onClick={onInviteStudents} className="h-12 bg-purple-600 hover:bg-purple-700">
                <Users className="mr-2 h-4 w-4" />
                Invite Students
              </Button>
            </div>
            
            <Separator />
            
            <Button onClick={onCreateAnother} variant="ghost" className="w-full">
              Create Another Class
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

interface QuickActionsProps {
  classId: string;
  hasUnsavedChanges: boolean;
  onSaveDraft: () => void;
  isSubmitting: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  classId,
  hasUnsavedChanges,
  onSaveDraft,
  isSubmitting
}) => {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription>Manage your class efficiently</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {hasUnsavedChanges && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have unsaved changes. They'll be automatically saved as you work.
            </AlertDescription>
          </Alert>
        )}
        
        <Button
          onClick={onSaveDraft}
          disabled={isSubmitting}
          variant="outline"
          className="w-full"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Saving...' : 'Save Draft'}
        </Button>

        {classId && (
          <>
            <Button variant="outline" className="w-full">
              <Users className="mr-2 h-4 w-4" />
              Invite Students
            </Button>
            
            <Button variant="outline" className="w-full">
              <Eye className="mr-2 h-4 w-4" />
              Preview Class
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const EnhancedAcademicClassSetupContent: React.FC = () => {
  const navigate = useNavigate();
  const { classId: urlClassId } = useParams<{ classId?: string }>();
  const { user } = useAuth();
  
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedClassData, setCompletedClassData] = useState<ClassFormValues | null>(null);
  const [completedClassId, setCompletedClassId] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<Partial<ClassFormValues> | undefined>(undefined);
  const [initialCohorts, setInitialCohorts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(!!urlClassId);

  const {
    saveDraft,
    publishClass,
    hasUnsavedChanges,
    isSubmitting,
    classId,
    getOverallProgress
  } = useAcademicClass();

  // Load existing class data if editing
  useEffect(() => {
    const loadClassData = async () => {
      if (!urlClassId) return;

      try {
        setIsLoading(true);
        const { data, error } = await classService.getById(urlClassId);

        if (error) {
          toast.error('Failed to load class data');
          navigate('/teacher-dashboard');
          return;
        }

        if (data) {
          // Transform API data to form values
          const formData: Partial<ClassFormValues> = {
            title: data.title,
            type: 'academic',
            subject: data.subject,
            gradeLevel: data.gradeLevel,
            description: data.description,
            objectives: data.objectives,
            numberOfLessons: data.numberOfLessons || 8,
            isPublic: data.isPublic,
            isPublished: data.isPublished,
            status: data.status,
            lessonPlans: data.lessonPlans?.map((lesson: any) => ({
              id: lesson._id || Date.now().toString(),
              title: lesson.title || '',
              description: lesson.description || '',
              duration: String(lesson.duration) || '60'
            })) || []
          };

          const transformedCohorts = data.cohorts?.map((cohort: any) => ({
            _id: cohort._id,
            id: cohort._id,
            name: cohort.name || '',
            startDate: cohort.startDate ? new Date(cohort.startDate) : null,
            endDate: cohort.endDate ? new Date(cohort.endDate) : null,
            startTime: cohort.startTime || '',
            endTime: cohort.endTime || '',
            numberOfLessons: data.numberOfLessons || 8,
            price: String(cohort.price) || '',
            discount: String(cohort.discount) || '0',
            isActive: cohort.isActive !== false,
            lessonSchedules: [],
            hasFlexibleSchedule: cohort.customLessonTimes || false,
            repeatSchedule: {
              pattern: cohort.repeatPattern === 'WEEKLY' ? 'weekly' as const : 
                       cohort.repeatPattern === 'TWICE_WEEKLY' ? 'twice-weekly' as const : 
                       'custom' as const,
              daysOfWeek: cohort.daysOfWeek?.map((day: string) => day.toLowerCase()) || ['monday'],
              repeatEvery: cohort.repeatEvery || 1
            },
            minStudents: cohort.minimumStudents || 1,
            maxStudents: cohort.maximumStudents || 20,
            enrollmentDeadline: cohort.enrollmentDeadline ? new Date(cohort.enrollmentDeadline) : null
          })) || [];

          setInitialValues(formData);
          setInitialCohorts(transformedCohorts);
        }
      } catch (error) {
        console.error('Error loading class:', error);
        toast.error('Failed to load class data');
        navigate('/teacher-dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadClassData();
  }, [urlClassId, navigate]);

  const handleClassComplete = (classData: ClassFormValues, completedId?: string) => {
    setCompletedClassData(classData);
    setCompletedClassId(completedId);
    setShowCompletionModal(true);
  };

  const handleViewClass = () => {
    if (completedClassId) {
      navigate(`/class/${completedClassId}`);
    }
  };

  const handleInviteStudents = () => {
    if (completedClassId) {
      navigate('/teacher-dashboard', {
        state: {
          activeTab: 'enrollment',
          classId: completedClassId,
          className: completedClassData?.title
        }
      });
    }
  };

  const handleCreateAnother = () => {
    setShowCompletionModal(false);
    navigate('/teacher-class-setup');
  };

  const handleBackToDashboard = () => {
    navigate('/teacher-dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-kidato-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading class data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToDashboard}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {urlClassId ? 'Edit Academic Class' : 'Create Academic Class'}
                </h1>
                {urlClassId && (
                  <Badge variant="secondary" className="mt-1">
                    Editing
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {hasUnsavedChanges && (
                <div className="flex items-center gap-2 text-amber-600 text-sm">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  Unsaved changes
                </div>
              )}
              
              <Button
                onClick={saveDraft}
                disabled={isSubmitting}
                variant="outline"
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Draft'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-3">
            <AcademicClassCreator
              onSubmit={handleClassComplete}
              initialValues={initialValues}
              classId={urlClassId}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuickActions
              classId={classId || ''}
              hasUnsavedChanges={hasUnsavedChanges}
              onSaveDraft={saveDraft}
              isSubmitting={isSubmitting}
            />
            
            {/* Progress Indicator */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Progress</CardTitle>
                <CardDescription>Complete all sections to publish</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Overall completion</span>
                    <span>{Math.round(getOverallProgress())}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-kidato-blue h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getOverallProgress()}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help & Tips */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-900">Teaching Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-blue-800">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-blue-600" />
                  <p>Clear learning objectives help students understand what they'll achieve</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-blue-600" />
                  <p>Break complex topics into digestible lesson-sized chunks</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-blue-600" />
                  <p>Consider different learning styles in your lesson planning</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletionModal && completedClassData && completedClassId && (
          <ClassCompletionModal
            isOpen={showCompletionModal}
            classData={completedClassData}
            classId={completedClassId}
            onViewClass={handleViewClass}
            onInviteStudents={handleInviteStudents}
            onCreateAnother={handleCreateAnother}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

interface EnhancedAcademicClassSetupProps {
  initialValues?: Partial<ClassFormValues>;
  initialCohorts?: any[];
  classId?: string;
}

const EnhancedAcademicClassSetup: React.FC<EnhancedAcademicClassSetupProps> = (props) => {
  return (
    <AcademicClassProvider {...props}>
      <EnhancedAcademicClassSetupContent />
    </AcademicClassProvider>
  );
};

export default EnhancedAcademicClassSetup;