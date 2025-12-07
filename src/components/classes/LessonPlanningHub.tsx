import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Lightbulb,
  Target,
  Users,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Zap,
  Link,
  FileText,
  Video,
  Download
} from 'lucide-react';
import { EnhancedClass, LessonPlan, ClassEvent, CrossClassSynergy } from '@/types/enhanced-classes';
import { cn } from '@/lib/utils';
import { classService } from '@/integrations/api/services/class.service';

interface LessonPlanningHubProps {
  classes: EnhancedClass[];
  onCreateLesson?: (classId: string) => void;
  onEditLesson?: (lessonId: string) => void;
  onScheduleEvent?: (event: Partial<ClassEvent>) => void;
}

const LessonPlanningHub: React.FC<LessonPlanningHubProps> = ({
  classes,
  onCreateLesson,
  onEditLesson,
  onScheduleEvent
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState('calendar');
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLessonPlans = async () => {
      setIsLoading(true);
      try {
        const allPlans: LessonPlan[] = [];
        for (const cls of classes) {
          const response = await classService.getLessonPlans(cls.id);
          if (response.data) {
            const mappedPlans: LessonPlan[] = response.data.map((plan: any, index: number) => ({
              id: plan._id || `lesson_${cls.id}_${index}`,
              classId: cls.id,
              lessonNumber: index + 1,
              title: plan.title,
              description: plan.description || '',
              objectives: [], // Backend might not return this yet specific to LessonPlan interface
              activities: [],
              materials: [...(plan.resourceFiles || []), ...(plan.resourceLinks?.map((l: any) => l.title) || [])],
              assessment: '',
              homework: '',
              duration: plan.duration,
              status: 'planned',
              notes: ''
            }));
            allPlans.push(...mappedPlans);
          }
        }
        setLessonPlans(allPlans);
      } catch (error) {
        console.error("Failed to fetch lesson plans", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (classes.length > 0) {
      fetchLessonPlans();
    }
  }, [classes]);

  const [synergies, setSynergies] = useState<CrossClassSynergy[]>([]);

  useEffect(() => {
    if (!classes.length) {
      setSynergies([]);
      return;
    }

    const calculatedSynergies: CrossClassSynergy[] = [];

    // 1. Content Reuse Adjustment: Group classes by subject
    const classesBySubject = classes.reduce((acc, cls) => {
      const subject = cls.subject || 'General';
      if (!acc[subject]) acc[subject] = [];
      acc[subject].push(cls);
      return acc;
    }, {} as Record<string, EnhancedClass[]>);

    Object.entries(classesBySubject).forEach(([subject, subjectClasses]) => {
      if (subjectClasses.length >= 2) {
        calculatedSynergies.push({
          id: `synergy_reuse_${subject.toLowerCase().replace(/\s+/g, '_')}`,
          type: 'content-reuse',
          title: `${subject} Content Alignment`,
          description: `Leverage materials across your ${subjectClasses.length} ${subject} classes to reduce prep time.`,
          involvedClasses: subjectClasses.map(c => c.id),
          potentialTimeSaved: 45,
          difficulty: 'easy',
          suggestedActions: [
            `Standardize ${subject} lesson templates`,
            'Reuse successful activities',
            'Coordinate assessment schedules'
          ]
        });
      }
    });

    // 2. Batch Prep: If there are multiple classes, suggest batching
    if (classes.length >= 2) {
      calculatedSynergies.push({
        id: 'synergy_batch_prep',
        type: 'batch-prep',
        title: 'Weekly Prep Batching',
        description: 'Consolidate preparation for all classes into focused blocks to minimize context switching.',
        involvedClasses: classes.map(c => c.id),
        potentialTimeSaved: 15 * classes.length,
        difficulty: 'medium',
        suggestedActions: [
          'Schedule 2h deep work block',
          'Prepare all slides in sequence',
          'Bulk upload resources'
        ]
      });
    }

    // 3. Scheduling: If classes on same day (simple check)
    // For now, if we don't have enough data for specific synergies, ensuring at least one generic synergy based on volume if classes exist.
    if (calculatedSynergies.length === 0 && classes.length > 0) {
      calculatedSynergies.push({
        id: 'synergy_optimization',
        type: 'resource-sharing',
        title: 'Resource Optimization',
        description: 'Review and optimize resource usage for your class.',
        involvedClasses: [classes[0].id],
        potentialTimeSaved: 20,
        difficulty: 'easy',
        suggestedActions: [
          'Digitize handouts',
          'Organize digital library',
          'Check for updated materials'
        ]
      });
    }

    setSynergies(calculatedSynergies);
  }, [classes]);

  const getUpcomingEvents = (): ClassEvent[] => {
    const events: ClassEvent[] = [];
    const today = new Date();

    // Add fetched lesson plans
    lessonPlans.forEach(plan => {
      if (plan.scheduledDate) {
        const cls = classes.find(c => c.id === plan.classId);
        events.push({
          id: `event_${plan.id}`,
          classId: plan.classId,
          title: `${cls?.title || 'Class'}: ${plan.title}`,
          description: plan.description || '',
          startTime: new Date(plan.scheduledDate),
          endTime: new Date(new Date(plan.scheduledDate).getTime() + (plan.duration || 60) * 60000),
          type: 'lesson',
          attendees: cls?.nextLesson?.studentsNeedingHelp ? [`${cls.nextLesson.studentsNeedingHelp} students need help`] : [],
          resources: plan.objectives || [],
          status: plan.status === 'completed' ? 'completed' : 'scheduled'
        });
      }
    });

    // Fallback to class.nextLesson if no plans fetched yet or to ensure next lesson is visible
    if (events.length === 0) {
      classes.forEach(cls => {
        if (cls.nextLesson) {
          events.push({
            id: `event_${cls.id}`,
            classId: cls.id,
            title: `${cls.title}: ${cls.nextLesson.topic}`,
            description: cls.nextLesson.description,
            startTime: cls.nextLesson.scheduledDate,
            endTime: new Date(cls.nextLesson.scheduledDate.getTime() + cls.nextLesson.duration * 60000),
            type: 'lesson',
            attendees: [`${cls.enrollment?.current || 0} students`],
            resources: cls.nextLesson.objectives,
            status: 'scheduled'
          });
        }
      });
    }

    return events.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const renderCalendarView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Schedule Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getUpcomingEvents().slice(0, 5).map(event => (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                      {formatDate(event.startTime)} at {formatTime(event.startTime)}
                    </p>
                  </div>
                  <Badge variant="outline">{event.type}</Badge>
                </div>
              ))}

              {getUpcomingEvents().length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No upcoming events scheduled</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => onCreateLesson?.(classes[0]?.id)} className="h-auto p-4 flex-col">
                <Plus className="h-6 w-6 mb-2" />
                Create Lesson
              </Button>
              <Button variant="outline" onClick={() => onScheduleEvent?.({})} className="h-auto p-4 flex-col">
                <CalendarIcon className="h-6 w-6 mb-2" />
                Schedule Event
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderConceptProgression = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            Learning Objective Flow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {classes.slice(0, 2).map(cls => (
              <div key={cls.id} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">{cls.title}</h3>
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {cls.objectives.map((objective, index) => (
                    <React.Fragment key={objective.id}>
                      <div className="flex-shrink-0 min-w-[200px]">
                        <div className={cn(
                          "p-3 rounded-lg border-2",
                          objective.status === 'completed' ? 'border-green-200 bg-green-50' :
                            objective.status === 'in-progress' ? 'border-blue-200 bg-blue-50' :
                              objective.status === 'behind' ? 'border-red-200 bg-red-50' :
                                'border-gray-200 bg-gray-50'
                        )}>
                          <div className="flex items-center gap-2 mb-2">
                            {objective.status === 'completed' ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : objective.status === 'behind' ? (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            ) : (
                              <Clock className="h-4 w-4 text-gray-600" />
                            )}
                            <Badge variant="outline" className="text-xs">
                              Week {objective.targetWeek}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-sm mb-1">{objective.title}</h4>
                          <p className="text-xs text-gray-600 mb-2">{objective.description}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${objective.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      {index < cls.objectives.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCrossSynergies = () => (
    <div className="space-y-4">
      {synergies.map(synergy => (
        <Card key={synergy.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  {synergy.title}
                </CardTitle>
                <p className="text-gray-600 mt-1">{synergy.description}</p>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-200">
                Save {synergy.potentialTimeSaved}min
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Involved Classes:</span>
                <div className="flex gap-2">
                  {synergy.involvedClasses.slice(0, 2).map(classId => {
                    const cls = classes.find(c => c.id === classId);
                    return cls ? (
                      <Badge key={classId} variant="secondary" className="text-xs">
                        {cls.title}
                      </Badge>
                    ) : null;
                  })}
                </div>
                <Badge variant="outline" className={cn(
                  "text-xs",
                  synergy.difficulty === 'easy' ? 'text-green-600 border-green-200' :
                    synergy.difficulty === 'medium' ? 'text-yellow-600 border-yellow-200' :
                      'text-red-600 border-red-200'
                )}>
                  {synergy.difficulty}
                </Badge>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Suggested Actions:</h4>
                <ul className="space-y-1">
                  {synergy.suggestedActions.map((action, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1">
                  Implement Now
                </Button>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderPrepOptimizer = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Preparation Time Optimizer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-semibold">This Week's Prep Schedule</h3>

              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Monday Block</span>
                    <Badge variant="outline">2 hours</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Math lessons 5-7, create worksheets and answer keys
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">Mathematics</Badge>
                    <Badge variant="secondary" className="text-xs">Algebra</Badge>
                  </div>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Wednesday Block</span>
                    <Badge variant="outline">1.5 hours</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Science lab prep, materials check, safety review
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">Science</Badge>
                    <Badge variant="secondary" className="text-xs">Chemistry</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Resource Library</h3>

              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Lesson Plan Templates</span>
                  <Download className="h-4 w-4 text-gray-400 ml-auto" />
                </div>

                <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                  <Video className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Interactive Presentations</span>
                  <Download className="h-4 w-4 text-gray-400 ml-auto" />
                </div>

                <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                  <Link className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Educational Resources</span>
                  <Download className="h-4 w-4 text-gray-400 ml-auto" />
                </div>
              </div>

              <Button className="w-full" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-yellow-500" />
          Lesson Planning Hub
        </h2>
        <Button onClick={() => onCreateLesson?.(classes[0]?.id)}>
          <Plus className="h-4 w-4 mr-2" />
          New Lesson Plan
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="progression">Concept Flow</TabsTrigger>
          <TabsTrigger value="synergies">Cross-Class</TabsTrigger>
          <TabsTrigger value="optimizer">Prep Optimizer</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          {renderCalendarView()}
        </TabsContent>

        <TabsContent value="progression">
          {renderConceptProgression()}
        </TabsContent>

        <TabsContent value="synergies">
          {renderCrossSynergies()}
        </TabsContent>

        <TabsContent value="optimizer">
          {renderPrepOptimizer()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LessonPlanningHub;