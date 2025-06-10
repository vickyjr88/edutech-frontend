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
  ExternalLink
} from 'lucide-react';

// Enhanced components
import SmartClassHeader from './SmartClassHeader';
import AdaptiveDashboard from './AdaptiveDashboard';
import IntelligentSidebar from './IntelligentSidebar';
import EnhancedStudentInsights from './EnhancedStudentInsights';
import PredictiveAnalytics from './PredictiveAnalytics';

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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Dashboard
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
    </div>
  );
};

export default EnhancedClassDetailPage;