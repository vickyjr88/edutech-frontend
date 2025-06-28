import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain,
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
  Target,
  Lightbulb,
  BarChart3,
  Settings,
  Filter,
  Grid,
  List,
  Search
} from 'lucide-react';

// Enhanced components
import EnhancedClassCard from './EnhancedClassCard';
import LessonPlanningHub from './LessonPlanningHub';
import ObjectiveTracker from './ObjectiveTracker';
import TeachingIntelligenceDashboard from './TeachingIntelligenceDashboard';

// Types and utilities
import { Class } from '@/integrations/api/services/class.service';
import { EnhancedClass, DashboardSettings, TeachingAnalytics } from '@/types/enhanced-classes';
import { 
  enhanceClassesData, 
  generateTeachingAnalytics,
  generateCrossClassSynergies 
} from '@/utils/mockEnhancements';

// Existing components for fallback
import RecommendedClasses from '../teacher/RecommendedClasses';
import { ClassRecommendation } from '@/integrations/api/services/teacher.service';

interface EnhancedClassesCommandCenterProps {
  classes: Class[];
  isLoading: boolean;
  hasClassesSetup: boolean;
  onCreateClass: () => void;
  onViewClass: (classItem: any) => void;
  onSetupClassSettings: () => void;
  onDeleteClass?: (classItem: any) => void;
  onCreateClassFromRecommendation?: (recommendation: ClassRecommendation) => void;
}

type ClassStatus = 'published' | 'draft' | 'pending_review' | 'archived' | 'recommendations';
type ViewMode = 'command-center' | 'simple';

const EnhancedClassesCommandCenter: React.FC<EnhancedClassesCommandCenterProps> = ({
  classes,
  isLoading,
  hasClassesSetup,
  onCreateClass,
  onViewClass,
  onSetupClassSettings,
  onDeleteClass,
  onCreateClassFromRecommendation
}) => {
  const [activeClassTab, setActiveClassTab] = useState<ClassStatus>('published');
  const [viewMode, setViewMode] = useState<ViewMode>('command-center');
  const [enhancedClasses, setEnhancedClasses] = useState<EnhancedClass[]>([]);
  const [analytics, setAnalytics] = useState<TeachingAnalytics | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dashboardSettings, setDashboardSettings] = useState<DashboardSettings>({
    layout: 'grid',
    sortBy: 'momentum',
    sortDirection: 'desc',
    filters: {
      status: [],
      performance: [],
      needsAttention: false
    },
    cardSize: 'normal',
    showPreview: true
  });

  // Enhanced data generation
  useEffect(() => {
    if (classes.length > 0) {
      const enhanced = enhanceClassesData(classes);
      setEnhancedClasses(enhanced);
      setAnalytics(generateTeachingAnalytics(enhanced));
    }
  }, [classes]);

  // Categorize classes by status
  const categorizeClasses = () => {
    return enhancedClasses.reduce((acc, classItem) => {
      const status = classItem.status || 'draft';
      if (!acc[status]) acc[status] = [];
      acc[status].push(classItem);
      return acc;
    }, {} as Record<string, EnhancedClass[]>);
  };

  const categorizedClasses = categorizeClasses();
  const currentTabClasses = categorizedClasses[activeClassTab] || [];

  // Filter and sort classes
  const filteredAndSortedClasses = currentTabClasses
    .filter(cls => {
      if (searchTerm) {
        return cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               cls.subject.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    })
    .filter(cls => {
      if (dashboardSettings.filters.needsAttention) {
        return cls.alerts.some(alert => alert.type === 'urgent') ||
               cls.studentInsights.strugglingStudents > 0 ||
               cls.preparationStatus === 'critical';
      }
      return true;
    })
    .sort((a, b) => {
      const { sortBy, sortDirection } = dashboardSettings;
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'momentum':
          aValue = a.momentum.overallScore;
          bValue = b.momentum.overallScore;
          break;
        case 'performance':
          aValue = a.performanceMetrics.teachingEffectiveness;
          bValue = b.performanceMetrics.teachingEffectiveness;
          break;
        case 'engagement':
          aValue = a.studentInsights.engagementLevel === 'high' ? 3 :
                   a.studentInsights.engagementLevel === 'medium' ? 2 : 1;
          bValue = b.studentInsights.engagementLevel === 'high' ? 3 :
                   b.studentInsights.engagementLevel === 'medium' ? 2 : 1;
          break;
        case 'next-lesson':
          aValue = a.nextLesson ? new Date(a.nextLesson.scheduledDate).getTime() : 0;
          bValue = b.nextLesson ? new Date(b.nextLesson.scheduledDate).getTime() : 0;
          break;
        default:
          aValue = a.title;
          bValue = b.title;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getTabCount = (status: ClassStatus) => {
    if (status === 'recommendations') return 0; // Recommendations are dynamic
    return categorizedClasses[status]?.length || 0;
  };

  const handleCardAction = (action: string, classData: EnhancedClass) => {
    switch (action) {
      case 'view':
        onViewClass(classData);
        break;
      case 'message':
        console.log('Message students for class:', classData.title);
        break;
      case 'prepare':
        console.log('Prepare lesson for class:', classData.title);
        break;
      case 'edit':
        console.log('Edit class:', classData.title);
        break;
      default:
        break;
    }
  };

  const renderCommandCenterView = () => (
    <Tabs value={activeClassTab} onValueChange={(value) => setActiveClassTab(value as ClassStatus)}>
      <div className="flex items-center justify-between mb-6">
        <TabsList className="grid w-auto grid-cols-5">
          <TabsTrigger value="published" className="relative">
            Published
            {getTabCount('published') > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                {getTabCount('published')}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            <Sparkles className="w-4 h-4 mr-1" />
            AI Suggestions
          </TabsTrigger>
          <TabsTrigger value="draft" className="relative">
            Draft
            {getTabCount('draft') > 0 && (
              <Badge variant="outline" className="ml-2 h-5 w-5 p-0 text-xs">
                {getTabCount('draft')}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="archived" className="relative">
            Archived
            {getTabCount('archived') > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                {getTabCount('archived')}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="pending_review" className="relative">
            Under Review
            {getTabCount('pending_review') > 0 && (
              <Badge variant="outline" className="ml-2 h-5 w-5 p-0 text-xs">
                {getTabCount('pending_review')}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg text-sm w-64"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <TabsContent value="published">
        {renderEnhancedClassGrid(filteredAndSortedClasses)}
      </TabsContent>

      <TabsContent value="recommendations">
        <RecommendedClasses 
          onCreateClassFromRecommendation={onCreateClassFromRecommendation}
        />
      </TabsContent>

      <TabsContent value="draft">
        {renderEnhancedClassGrid(filteredAndSortedClasses)}
      </TabsContent>

      <TabsContent value="archived">
        {renderEnhancedClassGrid(filteredAndSortedClasses)}
      </TabsContent>

      <TabsContent value="pending_review">
        {renderEnhancedClassGrid(filteredAndSortedClasses)}
      </TabsContent>
    </Tabs>
  );

  const renderEnhancedClassGrid = (classes: EnhancedClass[]) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading your classes...</span>
        </div>
      );
    }

    if (classes.length === 0) {
      return renderEmptyState();
    }

    return (
      <div className={`grid gap-6 ${
        dashboardSettings.layout === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {classes.map(classData => (
          <EnhancedClassCard
            key={classData.id}
            classData={classData}
            onViewClass={(cls) => handleCardAction('view', cls)}
            onEditClass={(cls) => handleCardAction('edit', cls)}
            onMessageStudents={(cls) => handleCardAction('message', cls)}
            onPrepareLesson={(cls) => handleCardAction('prepare', cls)}
            variant={dashboardSettings.cardSize}
          />
        ))}
      </div>
    );
  };

  const renderEmptyState = () => {
    const emptyStateConfig = {
      published: {
        icon: CheckCircle2,
        title: "No Published Classes",
        description: "Your published classes will appear here. Start by creating your first class or publishing a draft.",
        action: "Create New Class",
        iconColor: "text-green-600"
      },
      draft: {
        icon: Clock,
        title: "No Draft Classes",
        description: "Draft classes are saved here while you work on them. Create a new class to get started.",
        action: "Create New Class",
        iconColor: "text-orange-600"
      },
      archived: {
        icon: XCircle,
        title: "No Archived Classes",
        description: "Classes you've archived will appear here for future reference.",
        action: null,
        iconColor: "text-gray-600"
      },
      pending_review: {
        icon: AlertCircle,
        title: "No Classes Under Review",
        description: "Classes pending admin approval will appear here.",
        action: null,
        iconColor: "text-yellow-600"
      }
    };

    const config = emptyStateConfig[activeClassTab as keyof typeof emptyStateConfig];
    if (!config) return null;

    const IconComponent = config.icon;

    return (
      <div className="text-center py-12">
        <IconComponent className={`h-16 w-16 mx-auto mb-4 ${config.iconColor}`} />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{config.title}</h3>
        <p className="text-gray-600 mb-6 max-w-sm mx-auto">{config.description}</p>
        
        {config.action && (
          <div className="space-y-2">
            <Button onClick={onCreateClass} className="mr-2">
              <PlusCircle className="h-4 w-4 mr-2" />
              {config.action}
            </Button>
            {!hasClassesSetup && (
              <Button variant="outline" onClick={onSetupClassSettings}>
                <Settings className="h-4 w-4 mr-2" />
                Setup Class Settings
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!enhancedClasses.length && !isLoading) {
    return renderEmptyState();
  }

  return (
    <div className="space-y-8">
      {/* Command Center Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="h-8 w-8 text-purple-600" />
            My Classes Command Center
          </h1>
          <p className="text-gray-600 mt-1">
            Your intelligent teaching hub with AI-powered insights and proactive guidance
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'command-center' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('command-center')}
          >
            <Brain className="h-4 w-4 mr-2" />
            Smart View
          </Button>
          <Button
            variant={viewMode === 'simple' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('simple')}
          >
            <Grid className="h-4 w-4 mr-2" />
            Simple View
          </Button>
          <Button onClick={onCreateClass}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Class
          </Button>
        </div>
      </div>

      {viewMode === 'command-center' ? (
        <Tabs defaultValue="classes" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="classes">My Classes</TabsTrigger>
            {/*<TabsTrigger value="intelligence">Intelligence</TabsTrigger>*/}
            <TabsTrigger value="planning">Lesson Planning</TabsTrigger>
            <TabsTrigger value="objectives">Objectives</TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="mt-6">
            {renderCommandCenterView()}
          </TabsContent>

          {/*<TabsContent value="intelligence" className="mt-6">*/}
          {/*  {analytics && (*/}
          {/*    <TeachingIntelligenceDashboard */}
          {/*      classes={enhancedClasses}*/}
          {/*      analytics={analytics}*/}
          {/*    />*/}
          {/*  )}*/}
          {/*</TabsContent>*/}

          <TabsContent value="planning" className="mt-6">
            <LessonPlanningHub 
              classes={enhancedClasses}
              onCreateLesson={(classId) => console.log('Create lesson for:', classId)}
              onEditLesson={(lessonId) => console.log('Edit lesson:', lessonId)}
              onScheduleEvent={(event) => console.log('Schedule event:', event)}
            />
          </TabsContent>

          <TabsContent value="objectives" className="mt-6">
            <ObjectiveTracker 
              classes={enhancedClasses}
              onEditObjective={(objectiveId, classId) => console.log('Edit objective:', objectiveId, 'for class:', classId)}
              onCreateObjective={(classId) => console.log('Create objective for class:', classId)}
            />
          </TabsContent>
        </Tabs>
      ) : (
        // Simple view - render basic class grid without enhanced features
        <div className="space-y-6">
          {renderCommandCenterView()}
        </div>
      )}
    </div>
  );
};

export default EnhancedClassesCommandCenter;