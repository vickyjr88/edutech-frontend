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
  Target
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Mock data for children
const children = [
  {
    id: 1,
    name: "Emma Johnson",
    age: 12,
    grade: "7th Grade",
    nextClass: "Math - Algebra Fundamentals",
    nextClassTime: "Today, 3:30 PM",
    achievements: 2,
    activeTasks: 3,
    completedCourses: 8,
    avatar: null,
    weeklyProgress: 85,
    attendance: 95,
    lastAssignment: {
      title: "Math Homework",
      due: "Tomorrow",
      status: "pending"
    },
    currentActivity: "In class (Live)",
    subjects: [
      { name: "Math", grade: "A-", progress: 85, trend: "up" },
      { name: "Science", grade: "B+", progress: 78, trend: "stable" },
      { name: "English", grade: "A", progress: 92, trend: "up" }
    ],
    alerts: [
      { type: "upcoming", message: "Math test tomorrow", severity: "medium" }
    ]
  },
  {
    id: 2,
    name: "Noah Johnson",
    age: 10,
    grade: "5th Grade",
    nextClass: "Science - Introduction to Ecology",
    nextClassTime: "Tomorrow, 10:00 AM",
    achievements: 5,
    activeTasks: 1,
    completedCourses: 6,
    avatar: null,
    weeklyProgress: 72,
    attendance: 90,
    lastAssignment: {
      title: "Reading Response",
      due: "Today",
      status: "completed"
    },
    currentActivity: "Completing homework",
    subjects: [
      { name: "Math", grade: "B", progress: 75, trend: "down" },
      { name: "Science", grade: "A", progress: 88, trend: "up" },
      { name: "English", grade: "B+", progress: 82, trend: "stable" }
    ],
    alerts: [
      { type: "attention", message: "Math scores declining", severity: "high" }
    ]
  },
  {
    id: 3,
    name: "Olivia Johnson",
    age: 8,
    grade: "3rd Grade",
    nextClass: "Language Arts - Reading Comprehension",
    nextClassTime: "Today, 4:45 PM",
    achievements: 3,
    activeTasks: 2,
    completedCourses: 5,
    avatar: null,
    weeklyProgress: 95,
    attendance: 98,
    lastAssignment: {
      title: "Spelling Test",
      due: "Yesterday",
      status: "completed"
    },
    currentActivity: "Break until next class",
    subjects: [
      { name: "Math", grade: "A", progress: 90, trend: "up" },
      { name: "Science", grade: "A-", progress: 85, trend: "stable" },
      { name: "English", grade: "A+", progress: 96, trend: "up" }
    ],
    alerts: []
  }
];

const ChildrenOverview = () => {
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
                      <AvatarFallback className="bg-kidato-blue text-white text-xl">
                        {child.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-xl text-blue-900">{child.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <span>{child.age} years old</span>
                      <span>•</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                        {child.grade}
                      </Badge>
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
                  
                  {child.lastAssignment.status === "pending" && (
                    <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 bg-amber-50">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Review Homework
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm">
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
                        <div className={`p-1.5 rounded-full mr-2 ${
                          child.currentActivity === "In class (Live)" 
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
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-start">
                          <BookOpen className="h-4 w-4 text-kidato-blue mt-1 mr-2 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm">Next: {child.nextClass}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              <span>{child.nextClassTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
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