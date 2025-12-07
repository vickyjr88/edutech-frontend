import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Award,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Video,
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  Target,
  Loader2,
  Users
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { studentService } from "@/integrations/api/services/student.service";
import { classService } from "@/integrations/api/services/class.service";
import { assignmentService } from "@/integrations/api/services/assignment.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Subject {
  name: string;
  grade: string;
  progress: number;
  trend: "up" | "down" | "stable";
}

interface Alert {
  type: string;
  message: string;
  severity: string;
}

interface Child {
  id: string;
  name: string;
  age?: number;
  grade?: string;
  nextClass?: string;
  nextClassTime?: string;
  achievements: number;
  activeTasks: number;
  completedCourses: number;
  avatar?: string | null;
  weeklyProgress: number;
  attendance: number;
  lastAssignment?: {
    title: string;
    due: string;
    status: string;
  };
  currentActivity: string;
  subjects: Subject[];
  alerts: Alert[];
}

const ChildrenOverview = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChildrenData = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Fetch student dashboard stats
        const statsResponse = await studentService.getDashboardStats(user.id);

        // Fetch current classes
        const classesResponse = await classService.getCurrentClassesForStudent(user.id);

        // Fetch assignments
        const assignmentsResponse = await assignmentService.getStudentAssignments(user.id);

        if (statsResponse.data) {
          const stats = statsResponse.data;
          const classes = classesResponse.data || [];
          const assignments = assignmentsResponse.data || [];

          // Determine next class
          const now = new Date();
          const upcomingClasses = classes
            .filter((c: any) => c.schedule && new Date(c.schedule.startTime) > now)
            .sort((a: any, b: any) =>
              new Date(a.schedule.startTime).getTime() - new Date(b.schedule.startTime).getTime()
            );

          const nextClass = upcomingClasses[0];

          // Determine current activity
          const liveClasses = classes.filter((c: any) => {
            if (!c.schedule) return false;
            const start = new Date(c.schedule.startTime);
            const end = new Date(c.schedule.endTime);
            return now >= start && now <= end;
          });

          let currentActivity = "Break until next class";
          if (liveClasses.length > 0) {
            currentActivity = "In class (Live)";
          } else if (assignments.some((a: any) => a.status === "pending")) {
            currentActivity = "Completing homework";
          }

          // Find last assignment
          const sortedAssignments = [...assignments].sort((a: any, b: any) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          );
          const lastAssignment = sortedAssignments[0];

          // Extract subjects from enrolled classes
          const subjects: Subject[] = classes
            .filter((c: any) => c.subject)
            .slice(0, 3) // Show top 3 subjects
            .map((classData: any) => {
              const progress = classData.progress?.percentage || 0;

              // Determine trend based on progress
              let trend: "up" | "down" | "stable" = "stable";
              if (progress >= 80) trend = "up";
              else if (progress < 60) trend = "down";

              // Determine grade based on progress
              let grade = "B";
              if (progress >= 90) grade = "A+";
              else if (progress >= 85) grade = "A";
              else if (progress >= 80) grade = "A-";
              else if (progress >= 75) grade = "B+";
              else if (progress >= 70) grade = "B";
              else if (progress >= 65) grade = "B-";
              else if (progress >= 60) grade = "C+";
              else grade = "C";

              return {
                name: classData.subject || classData.title || "Subject",
                grade,
                progress,
                trend
              };
            });

          // Generate alerts based on real performance data
          const alerts: Alert[] = [];

          // Low completion rate alert
          if (stats.completionRate?.percentage < 70) {
            alerts.push({
              type: "attention",
              message: `Completion rate at ${stats.completionRate.percentage}% - needs improvement`,
              severity: "high"
            });
          }

          // Overdue assignments alert
          const overdueCount = assignments.filter((a: any) => {
            if (a.status === 'pending' && a.dueDate) {
              return new Date(a.dueDate) < now;
            }
            return false;
          }).length;

          if (overdueCount > 0) {
            alerts.push({
              type: "attention",
              message: `${overdueCount} overdue ${overdueCount === 1 ? 'assignment' : 'assignments'}`,
              severity: "high"
            });
          }

          // Low progress in subjects alert
          const lowProgressSubjects = subjects.filter(s => s.progress < 60);
          if (lowProgressSubjects.length > 0) {
            alerts.push({
              type: "attention",
              message: `Low progress in ${lowProgressSubjects.map(s => s.name).join(', ')}`,
              severity: "medium"
            });
          }

          const childData: Child = {
            id: user.id,
            name: user.fullName || "Student",
            age: undefined, // Not available in current API
            grade: undefined, // Not available in current API
            nextClass: nextClass?.title,
            nextClassTime: nextClass?.schedule?.startTime
              ? formatNextClassTime(new Date(nextClass.schedule.startTime))
              : undefined,
            achievements: stats.achievementsAndStreak?.achievements || 0,
            activeTasks: assignments.filter((a: any) => a.status === "pending").length,
            completedCourses: stats.completionRate?.completed || 0,
            avatar: user.profileImage || null,
            weeklyProgress: stats.completionRate?.percentage || 0,
            attendance: 95, // Default, as not available in current stats
            lastAssignment: lastAssignment ? {
              title: lastAssignment.title || "Assignment",
              due: formatDueDate(new Date(lastAssignment.dueDate)),
              status: lastAssignment.status || "pending"
            } : undefined,
            currentActivity,
            subjects,
            alerts
          };

          setChildren([childData]);
        }
      } catch (err) {
        console.error("Failed to fetch children data:", err);
        setError("Failed to load children overview");
        toast({
          title: "Error",
          description: "Failed to load children overview. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildrenData();
  }, [user?.id, user?.fullName, user?.profileImage, toast]);

  const formatNextClassTime = (date: Date): string => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      const timeStr = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return `Today, ${timeStr}`;
    } else if (hours < 48) {
      const timeStr = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return `Tomorrow, ${timeStr}`;
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  const formatDueDate = (date: Date): string => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return "Yesterday";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `In ${days} days`;
  };

  if (isLoading) {
    return (
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
          <span>My Children</span>
        </h2>
        <Card className="overflow-hidden border border-blue-100">
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-3 text-gray-600">Loading children overview...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
          <span>My Children</span>
        </h2>
        <Card className="overflow-hidden border border-blue-100">
          <CardContent className="p-8">
            <div className="text-center text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
          <span>My Children</span>
        </h2>
        <Card className="overflow-hidden border border-blue-100">
          <CardContent className="p-8">
            <div className="text-center text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No children data available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
        <span>My Children</span>
        <Badge className="ml-2 bg-blue-100 text-blue-800">{children.length}</Badge>
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {children.map((child) => (
          <Card key={child.id} className="overflow-hidden border border-blue-100 hover:shadow-md transition-all">
            <div className="bg-gradient-to-r from-blue-50 to-white p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                    {child.avatar ? (
                      <AvatarImage src={child.avatar} alt={child.name} />
                    ) : (
                      <AvatarFallback className="bg-kidato-purple text-white text-xl">
                        {child.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-xl text-blue-900">{child.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      {child.age && <span>{child.age} years old</span>}
                      {child.age && child.grade && <span>•</span>}
                      {child.grade && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                          {child.grade}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick actions specific to this child */}
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  {child.currentActivity === "In class (Live)" && (
                    <Button size="sm" className="bg-red-500 hover:bg-red-600">
                      <Video className="h-4 w-4 mr-1" />
                      Join Live Class
                    </Button>
                  )}

                  {child.lastAssignment?.status === "pending" && (
                    <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 bg-amber-50">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Review Homework
                    </Button>
                  )}

                  <Button variant="outline" size="sm" onClick={() => window.location.href = '/student-dashboard'}>
                    View Full Profile
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Alert section - only show if there are alerts */}
            {child.alerts.length > 0 && (
              <div className="bg-amber-50 px-4 py-2 border-y border-amber-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-amber-800">
                    {child.alerts[0].message}
                  </span>
                  {child.alerts.length > 1 && (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 ml-auto">
                      +{child.alerts.length - 1} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <CardContent className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left column - Current Status - 3/12 */}
                <div className="lg:col-span-3 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Current Status</h4>
                    <div className="p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center">
                        <div className={`p-1.5 rounded-full mr-2 ${child.currentActivity === "In class (Live)"
                          ? "bg-red-100"
                          : child.currentActivity.includes("homework")
                            ? "bg-amber-100"
                            : "bg-blue-100"
                          }`}>
                          {child.currentActivity === "In class (Live)" ? (
                            <Video className="h-4 w-4 text-red-500" />
                          ) : child.currentActivity.includes("homework") ? (
                            <BookOpen className="h-4 w-4 text-amber-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{child.currentActivity}</p>
                        </div>
                      </div>

                      {child.nextClass && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-start">
                            <BookOpen className="h-4 w-4 text-kidato-purple mt-1 mr-2 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-sm">Next: {child.nextClass}</p>
                              {child.nextClassTime && (
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                  <Calendar className="h-3.5 w-3.5 mr-1" />
                                  <span>{child.nextClassTime}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Middle column - Weekly Performance - 4/12 */}
                <div className="lg:col-span-4 space-y-3">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Weekly Performance</h4>

                  <div className="p-3 rounded-lg bg-gray-50">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Overall Progress</span>
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{child.weeklyProgress}%</span>
                          {child.weeklyProgress > 80 ? (
                            <TrendingUp className="ml-1 h-3 w-3 text-green-500" />
                          ) : null}
                        </div>
                      </div>
                      <Progress
                        value={child.weeklyProgress}
                        className="h-2.5"
                        style={{
                          background: 'linear-gradient(90deg, rgba(219,234,254,1) 0%, rgba(191,219,254,1) 100%)',
                          borderRadius: '9999px',
                        }}
                      />
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Attendance</span>
                        <span className="text-sm font-medium">{child.attendance}%</span>
                      </div>
                      <Progress
                        value={child.attendance}
                        className="h-2"
                        style={{
                          background: 'linear-gradient(90deg, rgba(220,252,231,1) 0%, rgba(187,247,208,1) 100%)',
                          borderRadius: '9999px',
                        }}
                      />
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Award className="h-4 w-4 text-amber-500 mr-1" />
                          <span className="text-sm">{child.achievements} achievements</span>
                        </div>
                        <div className="flex items-center">
                          <Target className="h-4 w-4 text-blue-500 mr-1" />
                          <span className="text-sm">{child.activeTasks} active tasks</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right column - Subject progress - 5/12 */}
                <div className="lg:col-span-5">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Key Subjects</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {child.subjects.map((subject, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{subject.name}</span>
                          <div className="flex items-center gap-1">
                            <Badge className={
                              subject.grade.includes('A') ? 'bg-green-100 text-green-800' :
                                subject.grade.includes('B') ? 'bg-blue-100 text-blue-800' :
                                  'bg-amber-100 text-amber-800'
                            }>
                              {subject.grade}
                            </Badge>

                            {subject.trend === "up" && (
                              <TrendingUp className="h-3 w-3 text-green-500" />
                            )}
                            {subject.trend === "down" && (
                              <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
                            )}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span>Progress</span>
                            <span>{subject.progress}%</span>
                          </div>
                          <Progress
                            value={subject.progress}
                            className="h-1.5"
                            style={{
                              background: subject.trend === "up"
                                ? 'linear-gradient(90deg, rgba(220,252,231,1) 0%, rgba(187,247,208,1) 100%)'
                                : subject.trend === "down"
                                  ? 'linear-gradient(90deg, rgba(254,226,226,1) 0%, rgba(254,202,202,1) 100%)'
                                  : 'linear-gradient(90deg, rgba(219,234,254,1) 0%, rgba(191,219,254,1) 100%)',
                              borderRadius: '9999px',
                            }}
                          />

                          <div className="flex justify-end mt-1">
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-blue-600">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChildrenOverview;