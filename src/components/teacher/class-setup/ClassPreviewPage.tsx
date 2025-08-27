import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CohortData, TeamMember, curriculaMap, curriculumLevelMap, subjectsMap } from "./types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Users, 
  Book, 
  BookOpen, 
  User, 
  Edit3,
  Star,
  MapPin,
  DollarSign,
  GraduationCap,
  Target,
  FileText,
  Play,
  Award,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ClassPreviewPageProps {
  form: UseFormReturn<any>;
  onPreviousTab?: () => void;
  onPrev?: () => void;
  isSubmitting: boolean;
  cohorts: CohortData[];
  teamMembers?: TeamMember[];
  checkClassCompleteness?: () => { 
    isComplete: boolean; 
    basicInfoComplete: boolean; 
    hasMinLessonPlans: boolean; 
    hasMinCohorts: boolean;
    missingItems: string[];
  };
  onPublish?: () => void;
  onSaveDraft?: () => void;
  onSubmit?: (data: any) => void;
}

const ClassPreviewPage = ({ 
  form, 
  onPreviousTab, 
  isSubmitting, 
  cohorts, 
  teamMembers, 
  checkClassCompleteness,
  onPublish,
  onSaveDraft
}: ClassPreviewPageProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isPublic, setIsPublic] = useState(form.getValues().isPublic);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  
  const formValues = form.getValues();
  const completenessCheck = checkClassCompleteness ? checkClassCompleteness() : {
    isComplete: true,
    basicInfoComplete: true,
    hasMinLessonPlans: true,
    hasMinCohorts: true,
    missingItems: []
  };
  
  // Quick stats calculation
  const totalLessons = formValues.lessonPlans?.length || 0;
  const totalDuration = formValues.lessonPlans?.reduce((acc: number, lesson: any) => {
    return acc + (parseInt(lesson.duration) || 60);
  }, 0) || 0;
  const totalCapacity = cohorts.reduce((acc, cohort) => acc + (cohort.maxStudents || 0), 0);
  const avgPrice = cohorts.length > 0 
    ? cohorts.reduce((acc, cohort) => acc + (parseFloat(cohort.price) || 0), 0) / cohorts.length 
    : 0;

  const handlePublishClick = () => {
    if (!completenessCheck.isComplete) {
      toast({
        title: "Cannot publish class",
        description: "Please complete all required information before publishing.",
        variant: "destructive"
      });
      return;
    }
    setShowPublishConfirm(true);
  };

  const confirmPublish = () => {
    form.setValue("isPublic", isPublic);
    form.setValue("isPublished", true);
    form.setValue("status", "published");
    setShowPublishConfirm(false);
    if (onPublish) {
      onPublish();
    }
  };

  const handleSaveDraft = () => {
    form.setValue("isPublic", isPublic);
    form.setValue("isPublished", false);
    form.setValue("status", "draft");
    if (onSaveDraft) {
      onSaveDraft();
    }
  };

  return (
    <div className="min-h-screen bg-kidato-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-kidato-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-kidato-gray-900 mb-2">
                Class Preview
              </h1>
              <p className="text-kidato-gray-600 text-lg">
                Review your class details before publishing to students
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="isPublic" 
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
                <Label htmlFor="isPublic" className="text-sm font-medium">
                  Public listing
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Student View Preview */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Completeness Alert */}
            {!completenessCheck.isComplete ? (
              <Alert className="border-kidato-orange bg-kidato-orange/5">
                <AlertTriangle className="h-4 w-4 text-kidato-orange" />
                <AlertTitle className="text-kidato-orange">Complete Your Class Setup</AlertTitle>
                <AlertDescription className="text-kidato-gray-700">
                  <p className="mb-2">Missing required information:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {completenessCheck.missingItems.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-kidato-indigo bg-kidato-indigo/5">
                <CheckCircle2 className="h-4 w-4 text-kidato-indigo" />
                <AlertTitle className="text-kidato-indigo">Ready to Publish!</AlertTitle>
                <AlertDescription className="text-kidato-gray-700">
                  All requirements met. Your class is ready for students.
                </AlertDescription>
              </Alert>
            )}

            {/* Class Header Display */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-kidato-indigo to-kidato-spindle p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">
                      {formValues.title || "Your Class Title"}
                    </h2>
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        {subjectsMap[formValues.subject]?.name || formValues.subject || "Subject"}
                      </Badge>
                      {formValues.gradeLevel && (
                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                          Grade {formValues.gradeLevel}
                        </Badge>
                      )}
                    </div>
                    <p className="text-white/90 leading-relaxed">
                      {formValues.description || "Class description will appear here..."}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructor Profile */}
              <div className="p-6 border-b border-kidato-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-kidato-indigo rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-kidato-gray-900">
                      {user?.name || "Your Name"}
                    </p>
                    <p className="text-kidato-gray-600 text-sm">Class Instructor</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Course Outline Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-kidato-gray-900">
                  <Target className="h-5 w-5 text-kidato-indigo" />
                  Course Outline
                </CardTitle>
              </CardHeader>
              <CardContent>
                {formValues.objectives ? (
                  <div className="space-y-3">
                    {(Array.isArray(formValues.objectives)
                      ? formValues.objectives
                      : typeof formValues.objectives === 'string'
                      ? formValues.objectives.split('\n')
                      : []
                    ).filter(Boolean).map((objective: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-kidato-indigo/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-semibold text-kidato-indigo">{index + 1}</span>
                        </div>
                        <p className="text-kidato-gray-700">{objective.trim()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-kidato-gray-500 italic">Course objectives will be displayed here...</p>
                )}
              </CardContent>
            </Card>

            {/* Lesson Plans Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-kidato-gray-900">
                  <BookOpen className="h-5 w-5 text-kidato-indigo" />
                  Lesson Plans ({totalLessons} lessons)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {formValues.lessonPlans && formValues.lessonPlans.length > 0 ? (
                  <div className="space-y-3">
                    {formValues.lessonPlans.slice(0, 4).map((lesson: any, index: number) => (
                      <div 
                        key={lesson.id} 
                        className="group border border-kidato-gray-200 rounded-lg p-4 hover:border-kidato-indigo/30 hover:bg-kidato-indigo/5 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-kidato-gray-900 mb-1">
                              {lesson.title || `Lesson ${index + 1}`}
                            </h4>
                            {lesson.description && (
                              <p className="text-kidato-gray-600 text-sm mb-2 line-clamp-2">
                                {lesson.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-kidato-gray-500">
                              {lesson.duration && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {lesson.duration} minutes
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Play className="h-3 w-3" />
                                Interactive
                              </span>
                            </div>
                          </div>
                          <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-8 h-8 bg-kidato-indigo/10 rounded-full flex items-center justify-center">
                              <Play className="h-4 w-4 text-kidato-indigo" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {formValues.lessonPlans.length > 4 && (
                      <div className="text-center py-3">
                        <p className="text-kidato-gray-500 text-sm">
                          + {formValues.lessonPlans.length - 4} more lessons
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-kidato-gray-300 mx-auto mb-3" />
                    <p className="text-kidato-gray-500">No lesson plans created yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Schedule & Cohorts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-kidato-gray-900">
                  <Calendar className="h-5 w-5 text-kidato-indigo" />
                  Available Schedules
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cohorts.length > 0 ? (
                  <div className="space-y-4">
                    {cohorts.slice(0, 3).map((cohort) => (
                      <div 
                        key={cohort._id || cohort.id} 
                        className="border border-kidato-gray-200 rounded-lg p-4 bg-gradient-to-r from-kidato-orange/5 to-transparent"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-kidato-gray-900">{cohort.name}</h4>
                          <Badge className="bg-kidato-orange text-white">
                            USD {parseFloat(cohort.price).toLocaleString()}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {cohort.startDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-kidato-gray-400" />
                              <span className="text-kidato-gray-600">
                                Starts: {format(new Date(cohort.startDate), 'MMM d, yyyy')}
                              </span>
                            </div>
                          )}
                          
                          {cohort.startTime && cohort.endTime && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-kidato-gray-400" />
                              <span className="text-kidato-gray-600">
                                {cohort.startTime} - {cohort.endTime}
                              </span>
                            </div>
                          )}
                          
                          {cohort.repeatSchedule && (
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4 text-kidato-gray-400" />
                              <span className="text-kidato-gray-600">
                                {cohort.repeatSchedule.pattern === 'custom' 
                                  ? cohort.repeatSchedule.daysOfWeek.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')
                                  : cohort.repeatSchedule.pattern === 'twice-weekly' ? 'Twice Weekly' : 'Weekly'}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-kidato-gray-400" />
                            <span className="text-kidato-gray-600">
                              {cohort.minStudents} - {cohort.maxStudents} students
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {cohorts.length > 3 && (
                      <div className="text-center py-2">
                        <p className="text-kidato-gray-500 text-sm">
                          + {cohorts.length - 3} more schedules available
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-kidato-gray-300 mx-auto mb-3" />
                    <p className="text-kidato-gray-500">No schedules created yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* Pricing Display */}
            {avgPrice > 0 && (
              <Card className="bg-gradient-to-br from-kidato-orange/10 to-kidato-orange/5 border-kidato-orange/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-kidato-orange text-lg">Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-kidato-orange mb-1">
                      USD {avgPrice.toLocaleString()}
                    </div>
                    <p className="text-kidato-orange text-sm">Average per schedule</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-kidato-gray-900 text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-kidato-indigo/5 rounded-lg">
                    <div className="text-2xl font-bold text-kidato-indigo">{totalLessons}</div>
                    <div className="text-xs text-kidato-gray-600">Lessons</div>
                  </div>
                  <div className="text-center p-3 bg-kidato-orange/5 rounded-lg">
                    <div className="text-2xl font-bold text-kidato-orange">{Math.round(totalDuration / 60)}h</div>
                    <div className="text-xs text-kidato-gray-600">Duration</div>
                  </div>
                  <div className="text-center p-3 bg-kidato-spindle/10 rounded-lg">
                    <div className="text-2xl font-bold text-kidato-spindle">{totalCapacity}</div>
                    <div className="text-xs text-kidato-gray-600">Capacity</div>
                  </div>
                  <div className="text-center p-3 bg-kidato-spindle/20 rounded-lg">
                    <div className="text-2xl font-bold text-kidato-indigo">{cohorts.length}</div>
                    <div className="text-xs text-kidato-gray-600">Schedules</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Links Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-kidato-gray-900 text-lg flex items-center gap-2">
                  <Edit3 className="h-4 w-4" />
                  Quick Edit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-kidato-indigo hover:text-kidato-indigo hover:bg-kidato-indigo/5"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Edit Basic Information
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-kidato-indigo hover:text-kidato-indigo hover:bg-kidato-indigo/5"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Modify Lesson Plans
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-kidato-indigo hover:text-kidato-indigo hover:bg-kidato-indigo/5"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Update Schedules
                </Button>
              </CardContent>
            </Card>

            {/* Pre-publish Warning */}
            <Alert className="border-kidato-orange bg-kidato-orange/5">
              <Shield className="h-4 w-4 text-kidato-orange" />
              <AlertTitle className="text-kidato-orange">Publishing Notice</AlertTitle>
              <AlertDescription className="text-kidato-gray-700 text-sm">
                Once published, your class will be visible to students and available for enrollment.
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handlePublishClick}
                disabled={isSubmitting || !completenessCheck.isComplete}
                className="w-full bg-kidato-indigo hover:bg-kidato-indigo/90 text-white font-semibold py-3"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Publish Class
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleSaveDraft}
                variant="outline"
                disabled={isSubmitting}
                className="w-full border-kidato-orange text-kidato-orange hover:bg-kidato-orange hover:text-white"
                size="lg"
              >
                Save as Draft
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Publish Confirmation Dialog */}
      {showPublishConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-kidato-gray-900">Confirm Publication</CardTitle>
              <CardDescription>
                Are you ready to make your class available to students?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-kidato-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-kidato-indigo" />
                  Class will be visible in search results
                </div>
                <div className="flex items-center gap-2 text-sm text-kidato-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-kidato-indigo" />
                  Students can enroll immediately
                </div>
                <div className="flex items-center gap-2 text-sm text-kidato-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-kidato-indigo" />
                  You'll receive enrollment notifications
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPublishConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmPublish}
                className="flex-1 bg-kidato-indigo hover:bg-kidato-indigo/90"
              >
                Publish Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClassPreviewPage;