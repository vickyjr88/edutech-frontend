
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Award, BookOpen, CheckCircle2, AlertCircle, Video } from "lucide-react";
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
      { name: "Math", grade: "A-", progress: 85 },
      { name: "Science", grade: "B+", progress: 78 },
      { name: "English", grade: "A", progress: 92 }
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
      { name: "Math", grade: "B", progress: 75 },
      { name: "Science", grade: "A", progress: 88 },
      { name: "English", grade: "B+", progress: 82 }
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
      { name: "Math", grade: "A", progress: 90 },
      { name: "Science", grade: "A-", progress: 85 },
      { name: "English", grade: "A+", progress: 96 }
    ]
  }
];

const ChildrenOverview = () => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Children Overview</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {children.map((child) => (
          <Card key={child.id} className="overflow-hidden border border-blue-100">
            <div className="bg-blue-50/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14 border-2 border-white">
                    {child.avatar ? (
                      <AvatarImage src={child.avatar} alt={child.name} />
                    ) : (
                      <AvatarFallback className="bg-kidato-blue text-white text-lg">
                        {child.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{child.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{child.age} years old</span>
                      <span>•</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                        {child.grade}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {child.currentActivity === "In class (Live)" && (
                    <Button size="sm" className="bg-red-500 hover:bg-red-600">
                      <Video className="h-4 w-4 mr-1" />
                      Join Class
                    </Button>
                  )}
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left column - Next class and current activity */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Current Activity</h4>
                    <div className="flex items-start">
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
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Next Class</h4>
                    <div className="flex items-start">
                      <BookOpen className="h-4 w-4 text-kidato-blue mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{child.nextClass}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>{child.nextClassTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Middle column - Weekly stats */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-500">Weekly Progress</h4>
                      <span className="text-sm font-medium">{child.weeklyProgress}%</span>
                    </div>
                    <Progress value={child.weeklyProgress} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-500">Attendance</h4>
                      <span className="text-sm font-medium">{child.attendance}%</span>
                    </div>
                    <Progress value={child.attendance} className="h-2" />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Last Assignment</h4>
                    <div className="p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{child.lastAssignment.title}</span>
                        {child.lastAssignment.status === "completed" ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Done
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800">
                            <AlertCircle className="h-3 w-3 mr-1" /> Due {child.lastAssignment.due}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right column - Subject progress */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Key Subjects</h4>
                  <div className="space-y-3">
                    {child.subjects.map((subject, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{subject.name}</span>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 mr-2">{subject.progress}%</span>
                            <Badge variant="outline" className="bg-blue-50">{subject.grade}</Badge>
                          </div>
                        </div>
                        <Progress value={subject.progress} className="h-1.5" />
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
