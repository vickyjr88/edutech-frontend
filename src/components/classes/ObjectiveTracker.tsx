import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  Users,
  Plus,
  Edit,
  Link,
  FileText,
  Video,
  Award,
  BarChart3,
  ArrowRight,
  Filter,
  Search,
  MoreVertical
} from 'lucide-react';
import { EnhancedClass, LearningObjective } from '@/types/enhanced-classes';
import { cn } from '@/lib/utils';

interface ObjectiveTrackerProps {
  classes: EnhancedClass[];
  onEditObjective?: (objectiveId: string, classId: string) => void;
  onCreateObjective?: (classId: string) => void;
}

const ObjectiveTracker: React.FC<ObjectiveTrackerProps> = ({
  classes,
  onEditObjective,
  onCreateObjective
}) => {
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.id || '');
  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getObjectiveStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'in-progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'behind': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getObjectiveIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'behind': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedClassData = classes.find(c => c.id === selectedClass);
  const filteredObjectives = selectedClassData?.objectives.filter(obj => 
    filterStatus === 'all' || obj.status === filterStatus
  ) || [];

  const getOverallProgress = () => {
    if (!selectedClassData?.objectives.length) return 0;
    const totalProgress = selectedClassData.objectives.reduce((sum, obj) => sum + obj.progress, 0);
    return Math.round(totalProgress / selectedClassData.objectives.length);
  };

  const getStatusCounts = () => {
    if (!selectedClassData?.objectives.length) return { completed: 0, inProgress: 0, notStarted: 0, behind: 0 };
    
    return selectedClassData.objectives.reduce((counts, obj) => {
      switch (obj.status) {
        case 'completed': counts.completed++; break;
        case 'in-progress': counts.inProgress++; break;
        case 'behind': counts.behind++; break;
        default: counts.notStarted++; break;
      }
      return counts;
    }, { completed: 0, inProgress: 0, notStarted: 0, behind: 0 });
  };

  const getMilestoneData = () => {
    const milestones = [
      { week: 4, title: 'Foundation Complete', achieved: true },
      { week: 8, title: 'Core Skills Mastered', achieved: true },
      { week: 12, title: 'Advanced Applications', achieved: false },
      { week: 16, title: 'Final Assessments', achieved: false }
    ];
    return milestones;
  };

  const renderOverviewTab = () => {
    const statusCounts = getStatusCounts();
    const overallProgress = getOverallProgress();
    const milestones = getMilestoneData();

    return (
      <div className="space-y-6">
        {/* Progress Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overall Progress</p>
                  <p className="text-2xl font-bold">{overallProgress}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{statusCounts.completed}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{statusCounts.inProgress}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Behind Schedule</p>
                  <p className="text-2xl font-bold text-red-600">{statusCounts.behind}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Milestone Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Learning Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={milestone.week} className="flex items-center gap-4">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    milestone.achieved ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                  )}>
                    {milestone.achieved ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <span className="text-xs font-bold">{milestone.week}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{milestone.title}</h4>
                    <p className="text-sm text-gray-600">Week {milestone.week}</p>
                  </div>
                  <Badge variant={milestone.achieved ? "default" : "outline"}>
                    {milestone.achieved ? "Achieved" : "Upcoming"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progress Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Objective Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedClassData?.objectives.slice(0, 5).map(objective => (
                <div key={objective.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{objective.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(objective.priority)} variant="secondary">
                        {objective.priority}
                      </Badge>
                      <span className="text-sm font-medium">{objective.progress}%</span>
                    </div>
                  </div>
                  <Progress value={objective.progress} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Target: Week {objective.targetWeek}</span>
                    <span>{objective.studentsAchieved} students achieved</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderObjectivesTab = () => (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="all">All Status</option>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="behind">Behind</option>
          </select>
        </div>
        <Button onClick={() => onCreateObjective?.(selectedClass)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Objective
        </Button>
      </div>

      {/* Objectives List */}
      <div className="space-y-4">
        {filteredObjectives.map(objective => (
          <Card key={objective.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getObjectiveIcon(objective.status)}
                      <h3 className="font-semibold">{objective.title}</h3>
                      <Badge className={getPriorityColor(objective.priority)} variant="secondary">
                        {objective.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{objective.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn("border", getObjectiveStatusColor(objective.status))}>
                      {objective.status.replace('-', ' ')}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => onEditObjective?.(objective.id, selectedClass)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{objective.progress}%</span>
                  </div>
                  <Progress value={objective.progress} className="h-2" />
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Week {objective.targetWeek}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{objective.studentsAchieved} achieved</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{objective.priority} priority</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{objective.resources.length} resources</span>
                  </div>
                </div>

                {/* Resources */}
                {objective.resources.length > 0 && (
                  <div className="border-t pt-3">
                    <h4 className="font-medium text-sm mb-2">Resources:</h4>
                    <div className="flex flex-wrap gap-2">
                      {objective.resources.map(resource => (
                        <div key={resource.id} className="flex items-center gap-1 text-xs bg-gray-50 px-2 py-1 rounded">
                          {resource.type === 'video' ? (
                            <Video className="h-3 w-3" />
                          ) : resource.type === 'link' ? (
                            <Link className="h-3 w-3" />
                          ) : (
                            <FileText className="h-3 w-3" />
                          )}
                          <span>{resource.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prerequisites */}
                {objective.prerequisites.length > 0 && (
                  <div className="border-t pt-3">
                    <h4 className="font-medium text-sm mb-2">Prerequisites:</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {objective.prerequisites.map((prereq, index) => (
                        <React.Fragment key={prereq}>
                          <span>{prereq}</span>
                          {index < objective.prerequisites.length - 1 && (
                            <ArrowRight className="h-3 w-3" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredObjectives.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">No objectives found</h3>
            <p className="text-gray-600 mb-4">
              {filterStatus === 'all' ? 'Create your first learning objective to get started.' : `No objectives with status "${filterStatus}".`}
            </p>
            <Button onClick={() => onCreateObjective?.(selectedClass)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Objective
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderAnalyticsTab = () => {
    const weeklyData = [
      { week: 'Week 1', completed: 2, inProgress: 3, behind: 0 },
      { week: 'Week 2', completed: 4, inProgress: 2, behind: 1 },
      { week: 'Week 3', completed: 6, inProgress: 1, behind: 0 },
      { week: 'Week 4', completed: 8, inProgress: 2, behind: 0 }
    ];

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Achievement Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-4">Weekly Progress</h4>
                <div className="space-y-3">
                  {weeklyData.map(week => (
                    <div key={week.week} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{week.week}</span>
                        <span>{week.completed + week.inProgress + week.behind} total</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full flex">
                          <div 
                            className="bg-green-500" 
                            style={{ width: `${(week.completed / (week.completed + week.inProgress + week.behind)) * 100}%` }}
                          />
                          <div 
                            className="bg-blue-500" 
                            style={{ width: `${(week.inProgress / (week.completed + week.inProgress + week.behind)) * 100}%` }}
                          />
                          <div 
                            className="bg-red-500" 
                            style={{ width: `${(week.behind / (week.completed + week.inProgress + week.behind)) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Student Achievement Rate</h4>
                <div className="space-y-4">
                  {selectedClassData?.objectives.slice(0, 3).map(objective => (
                    <div key={objective.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="truncate">{objective.title}</span>
                        <span>{Math.round((objective.studentsAchieved / (selectedClassData.enrollment?.current || 1)) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(objective.studentsAchieved / (selectedClassData.enrollment?.current || 1)) * 100} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Target className="h-6 w-6 text-blue-600" />
          Learning Objectives Tracker
        </h2>
        
        {/* Class Selector */}
        <select 
          value={selectedClass} 
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border rounded-lg px-4 py-2 bg-white"
        >
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.title}</option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="objectives">Objectives</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {renderOverviewTab()}
        </TabsContent>

        <TabsContent value="objectives">
          {renderObjectivesTab()}
        </TabsContent>

        <TabsContent value="analytics">
          {renderAnalyticsTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ObjectiveTracker;