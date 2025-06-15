import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain,
  Users,
  BarChart3,
  Settings,
  Calendar,
  Video,
  RefreshCw,
  ExternalLink,
  Edit,
  Plus,
  BookOpen,
  UserPlus,
  MoreHorizontal,
  Wand2,
  Copy,
  Archive
} from 'lucide-react';

// Enhanced components
import SmartClassHeader from './SmartClassHeader';
import AdaptiveDashboard from './AdaptiveDashboard';
import IntelligentSidebar from './IntelligentSidebar';
import EnhancedStudentInsights from './EnhancedStudentInsights';
import PredictiveAnalytics from './PredictiveAnalytics';
import LessonPlansTimeline from './LessonPlansTimeline';
import LessonPlanCreatorModal from './LessonPlanCreatorModal';

// Types and utilities
import { ClassDetailContext, TeachingMode } from '@/types/class-detail';
import { enhanceClassDetailData } from '@/utils/classDetailEnhancements';
import { cn } from '@/lib/utils';

interface EnhancedClassDetailPageProps {
  classData: any; // Raw class data from API
  onBack?: () => void;
}

const EnhancedClassDetailPage: React.FC<EnhancedClassDetailPageProps> = ({
  classData,
  onBack
}) => {
  const [context, setContext] = useState<ClassDetailContext | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  // Initialize enhanced context
  useEffect(() => {
    setIsLoading(true);
    try {
      const enhancedContext = enhanceClassDetailData(classData);
      setContext(enhancedContext);
      
      // Set initial tab based on mode
      if (enhancedContext.currentMode === 'teaching') {
        setActiveTab('live');
      } else if (enhancedContext.currentMode === 'reflect') {
        setActiveTab('analytics');
      }
    } catch (error) {
      console.error('Failed to enhance class data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [classData, refreshKey]);

  // Auto-refresh during live teaching
  useEffect(() => {
    if (context?.currentMode === 'teaching') {
      const interval = setInterval(() => {
        setRefreshKey(prev => prev + 1);
      }, 30000); // Refresh every 30 seconds during live teaching
      
      return () => clearInterval(interval);
    }
  }, [context?.currentMode]);

  const handleModeChange = (newMode: TeachingMode) => {
    if (!context) return;
    
    const updatedContext = {
      ...context,
      currentMode: newMode,
      header: {
        ...context.header,
        currentMode: newMode
      }
    };
    setContext(updatedContext);
  };

  const handleActionClick = (actionId: string, data?: any) => {
    console.log('Action clicked:', actionId, data);
    
    // Handle specific actions
    switch (actionId) {
      case 'zoomTest':
        window.open('https://zoom.us/test', '_blank');
        break;
      case 'materialCheck':
        // Navigate to materials section
        setActiveTab('overview');
        break;
      case 'studentMessage':
        // Open messaging interface
        console.log('Opening message interface for student:', data);
        break;
      case 'editClass':
        // Navigate to class setup page for editing
        window.location.href = `/teacher-class-setup/${classData?.id}`;
        break;
      case 'addLesson':
        // Open lesson creation modal
        setIsLessonModalOpen(true);
        break;
      case 'manageCohorts':
        // Navigate to cohort management
        console.log('Opening cohort management interface');
        break;
      case 'addStudent':
        // Open student enrollment
        console.log('Opening student enrollment interface');
        break;
      case 'duplicateClass':
        // Duplicate class functionality
        console.log('Duplicating class with ID:', classData?.id);
        break;
      case 'aiOptimize':
        // AI optimization suggestions
        console.log('Opening AI optimization suggestions');
        break;
      case 'editLesson':
        // Edit specific lesson
        console.log('Opening lesson editor for:', data);
        break;
      case 'markLessonComplete':
        // Mark lesson as complete
        console.log('Marking lesson complete:', data);
        // Here you would call an API to update lesson completion status
        setRefreshKey(prev => prev + 1); // Refresh the data
        break;
      default:
        console.log('Unhandled action:', actionId);
    }
  };

  const handleStudentAction = (studentId: string, action: string) => {
    console.log('Student action:', studentId, action);
    // Implement student-specific actions
  };

  const handleWidgetAction = (widgetId: string, action?: string) => {
    console.log('Widget action:', widgetId, action);
    // Implement widget actions
  };

  const handleDismissWidget = (widgetId: string) => {
    if (!context) return;
    
    const updatedWidgets = context.sidebarWidgets.map(widget => 
      widget.id === widgetId ? { ...widget, isVisible: false } : widget
    );
    
    setContext({
      ...context,
      sidebarWidgets: updatedWidgets
    });
  };

  const handleSaveLessonPlan = (lessonPlan: any) => {
    console.log('Saving lesson plan:', lessonPlan);
    // Here you would call an API to save the lesson plan
    // For now, we'll just refresh the data to show the new lesson in the timeline
    setRefreshKey(prev => prev + 1);
    setIsLessonModalOpen(false);
  };

  const getModeDescription = (mode: TeachingMode) => {
    switch (mode) {
      case 'prep': return 'Preparation & Planning Phase';
      case 'ready': return 'Final Readiness Checks';
      case 'teaching': return 'Live Teaching Session';
      case 'reflect': return 'Post-Session Reflection';
      default: return 'Teaching Mode';
    }
  };

  const getModeColor = (mode: TeachingMode) => {
    switch (mode) {
      case 'prep': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'ready': return 'text-green-600 bg-green-50 border-green-200';
      case 'teaching': return 'text-red-600 bg-red-50 border-red-200';
      case 'reflect': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (isLoading || !context) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your intelligent teaching dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="outline" onClick={onBack}>
                  ← Back
                </Button>
              )}
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Class Command Center</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={cn("border", getModeColor(context.currentMode))}>
                    {getModeDescription(context.currentMode)}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {context.header.nextSession.zoomRoomId && (
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.open(`https://zoom.us/j/${context.header.nextSession.zoomRoomId}`, '_blank')}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Join Zoom
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              )}
              <Button 
                variant="outline"
                onClick={() => setRefreshKey(prev => prev + 1)}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Smart Header */}
            <SmartClassHeader 
              data={context.header}
              onModeChange={handleModeChange}
              onActionClick={handleActionClick}
            />

            {/* Tabbed Interface */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="lessons" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Lessons
                </TabsTrigger>
                <TabsTrigger value="students" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Students
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <AdaptiveDashboard
                  mode={context.currentMode}
                  timeToClass={context.timeToClass}
                  prepChecklists={context.prepChecklist}
                  liveMetrics={context.liveMetrics}
                  zoomOptimization={context.zoomOptimization}
                  teachingEffectiveness={context.teachingEffectiveness}
                  onActionClick={handleActionClick}
                />
              </TabsContent>

              <TabsContent value="lessons" className="mt-6">
                <LessonPlansTimeline
                  lessonPlans={classData?.lessonPlans || []}
                  currentLessonIndex={classData?.currentLessonIndex || 0}
                  classStartDate={classData?.startDate ? new Date(classData.startDate) : new Date()}
                  onLessonClick={(lesson) => console.log('Lesson clicked:', lesson)}
                  onEditLesson={(lesson) => handleActionClick('editLesson', lesson)}
                  onMarkComplete={(lesson) => handleActionClick('markLessonComplete', lesson)}
                  onAddLesson={() => handleActionClick('addLesson')}
                />
              </TabsContent>

              <TabsContent value="students" className="mt-6">
                <EnhancedStudentInsights
                  students={context.studentInsights}
                  mode={context.currentMode}
                  onStudentAction={handleStudentAction}
                />
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <PredictiveAnalytics
                  teachingEffectiveness={context.teachingEffectiveness}
                  mode={context.currentMode}
                  timeToClass={context.timeToClass}
                  onImplementSuggestion={handleActionClick}
                />
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Dashboard Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Dashboard Settings</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Auto-switch modes based on timing</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Enable real-time notifications</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Show Zoom integration features</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Enable advanced analytics</span>
                      </label>
                    </div>
                  </div>

                  {/* Zoom Integration */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Zoom Integration</h3>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Connection Status</span>
                        <Badge variant="default" className="bg-green-600">Connected</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Zoom account linked for real-time session data
                      </p>
                      <Button variant="outline" size="sm">
                        Configure Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Intelligent Sidebar */}
          <div className="lg:col-span-1">
            <IntelligentSidebar
              widgets={context.sidebarWidgets}
              mode={context.currentMode}
              onWidgetAction={handleWidgetAction}
              onDismissWidget={handleDismissWidget}
            />
          </div>
        </div>
      </div>

      {/* Live Teaching Mode Footer */}
      {context.currentMode === 'teaching' && (
        <div className="fixed bottom-0 left-0 right-0 bg-red-600 text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-300 rounded-full animate-pulse" />
                <span className="font-medium">LIVE SESSION</span>
              </div>
              <span className="text-red-100">
                Session time: {Math.floor(Math.random() * 30) + 10} minutes
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-red-600 border-red-200 bg-white">
                Quick Poll
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 border-red-200 bg-white">
                Breakout Rooms
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 border-red-200 bg-white">
                End Session
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Smart Editing FAB & Quick Actions */}
      {context.currentMode !== 'teaching' && (
        <div className="fixed bottom-6 right-6 z-50">
          {/* Quick Edit Menu */}
          {showEditMenu && (
            <div className="absolute bottom-16 right-0 mb-4 bg-white rounded-lg shadow-xl border border-gray-200 p-2 min-w-48">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-3"
                  onClick={() => {
                    handleActionClick('addLesson');
                    setShowEditMenu(false);
                  }}
                >
                  <BookOpen className="h-4 w-4" />
                  Add Lesson Plan
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-3"
                  onClick={() => {
                    handleActionClick('manageCohorts');
                    setShowEditMenu(false);
                  }}
                >
                  <Users className="h-4 w-4" />
                  Manage Cohorts
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-3"
                  onClick={() => {
                    handleActionClick('addStudent');
                    setShowEditMenu(false);
                  }}
                >
                  <UserPlus className="h-4 w-4" />
                  Enroll Students
                </Button>
                <div className="border-t border-gray-100 my-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-3"
                  onClick={() => {
                    handleActionClick('duplicateClass');
                    setShowEditMenu(false);
                  }}
                >
                  <Copy className="h-4 w-4" />
                  Duplicate Class
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-3"
                  onClick={() => {
                    handleActionClick('aiOptimize');
                    setShowEditMenu(false);
                  }}
                >
                  <Wand2 className="h-4 w-4" />
                  AI Optimize
                </Button>
              </div>
            </div>
          )}

          {/* Floating Action Button */}
          <Button
            className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => setShowEditMenu(!showEditMenu)}
          >
            {showEditMenu ? (
              <MoreHorizontal className="h-6 w-6 rotate-90" />
            ) : (
              <Edit className="h-6 w-6" />
            )}
          </Button>
        </div>
      )}

      {/* Click outside to close menu */}
      {showEditMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowEditMenu(false)}
        />
      )}

      {/* Lesson Plan Creator Modal */}
      <LessonPlanCreatorModal
        open={isLessonModalOpen}
        onOpenChange={setIsLessonModalOpen}
        onSave={handleSaveLessonPlan}
        nextSequenceNumber={(classData?.lessonPlans?.length || 0) + 1}
      />
    </div>
  );
};

export default EnhancedClassDetailPage;