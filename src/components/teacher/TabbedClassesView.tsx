import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  PlusCircle, 
  Loader2, 
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Eye,
  Users,
  DollarSign,
  Calendar,
  Trash2,
  Brain,
  Grid,
  MessageCircle,
  Video,
  Settings,
  TrendingUp,
  Zap
} from 'lucide-react';
import RecommendedClasses from './RecommendedClasses';
import { ClassRecommendation } from '@/integrations/api/services/teacher.service';
import EnhancedClassesCommandCenter from '../classes/EnhancedClassesCommandCenter';
import TeacherOnboardingDashboard from './TeacherOnboardingDashboard';

interface TabbedClassesViewProps {
  classes: any[];
  isLoading: boolean;
  hasClassesSetup: boolean;
  onCreateClass: () => void;
  onViewClass: (classItem: any) => void;
  onSetupClassSettings: () => void;
  onDeleteClass?: (classItem: any) => void;
  onCreateClassFromRecommendation?: (recommendation: ClassRecommendation) => void;
  // Onboarding dashboard props
  hasProfile?: boolean;
  zoomConnected?: boolean;
  calendarConnected?: boolean;
  driveConnected?: boolean;
  onViewProfile?: () => void;
  onConnectZoom?: () => void;
  onConnectCalendar?: () => void;
  onConnectDrive?: () => void;
}

type ClassStatus = 'published' | 'draft' | 'pending_review' | 'archived' | 'recommendations';

const TabbedClassesView: React.FC<TabbedClassesViewProps> = ({
  classes,
  isLoading,
  hasClassesSetup,
  onCreateClass,
  onViewClass,
  onSetupClassSettings,
  onDeleteClass,
  onCreateClassFromRecommendation,
  // Onboarding dashboard props
  hasProfile = true,
  zoomConnected = false,
  calendarConnected = false,
  driveConnected = false,
  onViewProfile = () => {},
  onConnectZoom = () => {},
  onConnectCalendar = () => {},
  onConnectDrive = () => {}
}) => {
  const [activeClassTab, setActiveClassTab] = useState<ClassStatus>('published');
  const [useEnhancedView, setUseEnhancedView] = useState(true);

  // Categorize classes by status
  const categorizeClasses = () => {
    return {
      published: classes.filter(c => c.status === 'published'),
      draft: classes.filter(c => c.status === 'draft' || !c.status),
      pending_review: classes.filter(c => c.status === 'pending_review'),
      archived: classes.filter(c => c.status === 'archived')
    };
  };

  const categorizedClasses = categorizeClasses();

  const getTabCounts = () => {
    return {
      published: categorizedClasses.published.length,
      draft: categorizedClasses.draft.length,
      pending_review: categorizedClasses.pending_review.length,
      archived: categorizedClasses.archived.length
    };
  };

  const counts = getTabCounts();

  const renderClassCard = (classItem: any) => {
    const classId = classItem._id || classItem.id;
    const currentEnrollment = classItem.enrollment?.current || 0;
    
    // Debug: Log class data structure for published classes
    if (classItem.status === 'published') {
      console.log('Published class data:', {
        title: classItem.title,
        price: classItem.price,
        cohorts: classItem.cohorts,
        pricing: classItem.pricing,
        cost: classItem.cost,
        enrollment: classItem.enrollment
      });
    }
    
    const getStatusBadge = () => {
      if (classItem.status === 'pending_review') {
        return (
          <Badge variant="outline" className="border-sea-buckthorn-200 bg-sea-buckthorn-50 text-sea-buckthorn-700 kidato-status-pending">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      }
      if (classItem.status === 'archived') {
        return (
          <Badge variant="outline" className="border-athens-gray-300 bg-athens-gray-100 text-pigeon-post-700">
            <XCircle className="h-3 w-3 mr-1" />
            Archived
          </Badge>
        );
      }
      if (classItem.status === 'published') {
        return (
          <Badge variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-700 kidato-status-published">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Published
          </Badge>
        );
      }
      return (
        <Badge variant="outline" className="border-pigeon-post-200 bg-pigeon-post-50 text-pigeon-post-700 kidato-status-draft">
          <AlertCircle className="h-3 w-3 mr-1" />
          Draft
        </Badge>
      );
    };

    return (
      <Card 
        key={classId} 
        className="cursor-pointer kidato-card-hover group bg-white border border-athens-gray-200 hover:border-indigo-200" 
        onClick={() => onViewClass(classItem)}
      >
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg">{classItem.title}</CardTitle>
              <CardDescription className="mt-1">
                {classItem.type === "academic" ? "Academic" : "After School"} - {classItem.subject}
              </CardDescription>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">
            {classItem.description || "No description provided"}
          </p>
          
          {/* Show additional info for published classes */}
          {classItem.status === 'published' && (
            <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg group-hover:bg-indigo-100 transition-colors duration-200">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center text-sm font-medium text-indigo-800">
                  <Calendar className="h-4 w-4 mr-1" />
                  Active Cohort
                </div>
                <div className="flex items-center text-sm font-bold text-indigo-900">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {(() => {
                    // Try different price sources
                    const price = classItem.price || 
                                 classItem.cohorts?.[0]?.price || 
                                 classItem.pricing?.amount ||
                                 classItem.cost ||
                                 0;
                    const discount = classItem.discount || classItem.cohorts?.[0]?.discount || 0;
                    
                    return (
                      <>
                        ${typeof price === 'string' ? price : price}
                        {discount > 0 && (
                          <span className="ml-1 text-xs text-red-600 line-through">
                            ${Math.round((parseFloat(price) || 0) / (1 - parseFloat(discount) / 100))}
                          </span>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
              <div className="flex justify-between text-xs text-indigo-700">
                <span>
                  {classItem.cohorts && classItem.cohorts.length > 0 
                    ? `Cohort ${classItem.cohorts[0].name || 'A'} • ${classItem.cohorts[0].schedule || classItem.cohorts[0].startTime && classItem.cohorts[0].endTime ? `${classItem.cohorts[0].startTime}-${classItem.cohorts[0].endTime}` : 'Schedule TBD'}` 
                    : 'Default Cohort • Schedule TBD'
                  }
                </span>
                <span className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {currentEnrollment}/{classItem.enrollment?.maximum || classItem.cohorts?.[0]?.maxStudents || 'Unlimited'}
                </span>
              </div>
            </div>
          )}
          
          {/* Smart Alerts */}
          {classItem.status === 'published' && currentEnrollment === 0 && (
            <div className="mb-3 p-2 bg-sea-buckthorn-50 border border-sea-buckthorn-200 rounded-lg kidato-urgent-pulse">
              <div className="flex items-center text-sm text-sea-buckthorn-800">
                <Zap className="h-4 w-4 mr-2" />
                <span className="font-medium">No students enrolled yet! Share your class link.</span>
              </div>
            </div>
          )}
          
          {classItem.status === 'draft' && (
            <div className="mb-3 p-2 bg-pigeon-post-50 border border-pigeon-post-200 rounded-lg">
              <div className="flex items-center text-sm text-pigeon-post-800">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span className="font-medium">Ready to publish? Complete your class setup first.</span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex gap-4 text-sm">
              <span className="flex items-center text-pigeon-post-600 group-hover:text-pigeon-post-700 transition-colors">
                <Eye className="h-4 w-4 mr-1" />
                {currentEnrollment} students
              </span>
              <span className="text-xs px-2 py-1 bg-athens-gray-100 text-pigeon-post-700 rounded-full group-hover:bg-pigeon-post-100 transition-colors">
                {classItem.type === "academic" ? classItem.gradeLevel : classItem.ageRange}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Delete button for draft classes */}
              {(classItem.status === 'draft' || (!classItem.status && !classItem.isPublished)) && onDeleteClass && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClass(classItem);
                  }}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8"
                  title="Delete draft class"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              {classItem.status === 'published' && (
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 kidato-celebration">
                  🎉 Live
                </Badge>
              )}
            </div>
          </div>

          {/* Contextual Action Buttons */}
          <div className="mt-4 pt-3 border-t border-athens-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {classItem.status === 'published' && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle message students action
                      }}
                      className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle start session action
                      }}
                      className="border-sea-buckthorn-200 text-sea-buckthorn-700 hover:bg-sea-buckthorn-50 hover:border-sea-buckthorn-300 transition-all duration-200"
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Start Session
                    </Button>
                  </>
                )}
                {classItem.status === 'draft' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle edit action
                    }}
                    className="border-pigeon-post-200 text-pigeon-post-700 hover:bg-pigeon-post-50 hover:border-pigeon-post-300 transition-all duration-200"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Complete Setup
                  </Button>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewClass(classItem);
                }}
                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-all duration-200"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderEmptyState = (type: ClassStatus) => {
    const emptyStates = {
      published: {
        icon: <CheckCircle2 className="h-16 w-16 text-indigo-300 mb-4" />,
        title: "No Published Classes",
        description: "You don't have any published classes yet. Create and publish your first class to start teaching.",
        action: "Create New Class"
      },
      draft: {
        icon: <AlertCircle className="h-16 w-16 text-pigeon-post-400 mb-4" />,
        title: "No Draft Classes",
        description: "All your classes are published! Create a new class if you want to work on something new.",
        action: "Create New Class"
      },
      pending_review: {
        icon: <Clock className="h-16 w-16 text-sea-buckthorn-300 mb-4" />,
        title: "No Classes Pending Review",
        description: "You don't have any classes awaiting review. Great job keeping your content up to date!",
        action: "Create New Class"
      },
      archived: {
        icon: <XCircle className="h-16 w-16 text-athens-gray-400 mb-4" />,
        title: "No Archived Classes",
        description: "You don't have any archived classes. All your classes are active!",
        action: "Create New Class"
      },
      recommendations: {
        icon: <Sparkles className="h-16 w-16 text-sea-buckthorn-400 mb-4" />,
        title: "No Recommendations",
        description: "AI-powered class recommendations will appear here based on your teaching profile.",
        action: "Generate Recommendations"
      }
    };

    const state = emptyStates[type];

    return (
      <div className="flex flex-col items-center justify-center bg-white rounded-lg border border-dashed border-athens-gray-300 p-12 hover:border-indigo-300 transition-colors duration-300">
        {state.icon}
        <h3 className="text-lg font-medium text-gray-900 mb-1">{state.title}</h3>
        <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
          {state.description}
        </p>
        {hasClassesSetup ? (
          <Button onClick={onCreateClass} className="bg-indigo-500 hover:bg-indigo-600 text-white transition-all duration-200 hover:scale-105">
            <PlusCircle className="mr-2 h-4 w-4" />
            {state.action}
          </Button>
        ) : (
          <Button onClick={onSetupClassSettings} className="bg-indigo-500 hover:bg-indigo-600 text-white transition-all duration-200 hover:scale-105">
            Set Up Your Classroom First
          </Button>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mb-3" />
          <p className="text-gray-600">Loading your classes...</p>
        </div>
      </div>
    );
  }

  // Show onboarding dashboard when teacher has no classes at all
  if (classes.length === 0) {
    return (
      <TeacherOnboardingDashboard
        hasProfile={hasProfile}
        hasClasses={false}
        zoomConnected={zoomConnected}
        calendarConnected={calendarConnected}
        driveConnected={driveConnected}
        onCreateClass={onCreateClass}
        onViewProfile={onViewProfile}
        onConnectZoom={onConnectZoom}
        onConnectCalendar={onConnectCalendar}
        onConnectDrive={onConnectDrive}
      />
    );
  }

  // If enhanced view is enabled and there are classes, use the command center
  if (useEnhancedView && classes.length > 0) {
    return (
      <EnhancedClassesCommandCenter
        classes={classes}
        isLoading={isLoading}
        hasClassesSetup={hasClassesSetup}
        onCreateClass={onCreateClass}
        onViewClass={onViewClass}
        onSetupClassSettings={onSetupClassSettings}
        onDeleteClass={onDeleteClass}
        onCreateClassFromRecommendation={onCreateClassFromRecommendation}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">My Classes</h2>
        <div className="flex items-center gap-2">
          {classes.length > 0 && (
            <div className="flex items-center gap-2 mr-4">
              <Button
                variant={useEnhancedView ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUseEnhancedView(true)}
              >
                <Brain className="h-4 w-4 mr-2" />
                Smart View
              </Button>
              <Button
                variant={!useEnhancedView ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUseEnhancedView(false)}
              >
                <Grid className="h-4 w-4 mr-2" />
                Simple View
              </Button>
            </div>
          )}
          {hasClassesSetup && (
            <Button onClick={onCreateClass} className="bg-indigo-500 hover:bg-indigo-600 text-white transition-all duration-200 hover:scale-105">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Class
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeClassTab} onValueChange={(value) => setActiveClassTab(value as ClassStatus)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="published" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Published
            {counts.published > 0 && (
              <Badge variant="secondary" className="ml-1 bg-indigo-100 text-indigo-700 kidato-gentle-pulse">
                {counts.published}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="draft" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Draft
            {counts.draft > 0 && (
              <Badge variant="secondary" className="ml-1 bg-pigeon-post-100 text-pigeon-post-700">
                {counts.draft}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="archived" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Archived
            {counts.archived > 0 && (
              <Badge variant="secondary" className="ml-1 bg-athens-gray-100 text-pigeon-post-600">
                {counts.archived}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="pending_review" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending Review
            {counts.pending_review > 0 && (
              <Badge variant="secondary" className="ml-1 bg-sea-buckthorn-100 text-sea-buckthorn-700 kidato-urgent-pulse">
                {counts.pending_review}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="published" className="mt-6">
          {categorizedClasses.published.length === 0 ? (
            renderEmptyState('published')
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categorizedClasses.published.map(renderClassCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <RecommendedClasses onCreateClass={onCreateClassFromRecommendation} />
        </TabsContent>

        <TabsContent value="draft" className="mt-6">
          {categorizedClasses.draft.length === 0 ? (
            renderEmptyState('draft')
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categorizedClasses.draft.map(renderClassCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived" className="mt-6">
          {categorizedClasses.archived.length === 0 ? (
            renderEmptyState('archived')
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categorizedClasses.archived.map(renderClassCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending_review" className="mt-6">
          {categorizedClasses.pending_review.length === 0 ? (
            renderEmptyState('pending_review')
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categorizedClasses.pending_review.map(renderClassCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabbedClassesView;