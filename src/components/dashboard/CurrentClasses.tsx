
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Users, Clock, Calendar, Award, Star, CheckCircle2, Bookmark, BookOpen, BellRing } from "lucide-react";
import { Link } from "react-router-dom";
import JoinClassDialog from "./JoinClassDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CurrentClasses() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [bookmarkedClasses, setBookmarkedClasses] = useState<string[]>([]);
  const [isAlertVisible, setIsAlertVisible] = useState(true);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const classes = [
    {
      id: "math101",
      title: "Math Fundamentals",
      teacher: "Ms. Sarah Johnson",
      teacherImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80",
      nextSession: "Today, 3:30 PM",
      sessionTime: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 15, 30),
      progress: 65,
      students: 24,
      grade: "Grade 6",
      subject: "Mathematics",
      curriculum: "National Curriculum",
      classType: "Academic",
      nextTopic: "Fractions & Decimals",
      homeworkDue: "Thursday",
      totalLessonsCompleted: 8,
      totalLessons: 12,
      color: "bg-green-100 border-green-400",
      iconBg: "bg-green-200",
      buttonColor: "bg-green-500 hover:bg-green-600",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=100&q=80"
    },
    {
      id: "science205",
      title: "Science Explorers",
      teacher: "Dr. Michael Chen",
      teacherImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80",
      nextSession: "Tomorrow, 4:00 PM",
      sessionTime: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() + 1, 16, 0),
      progress: 42,
      students: 18,
      grade: "Grade 8",
      subject: "Biology",
      curriculum: "Cambridge",
      classType: "Exam Prep",
      nextTopic: "Cellular Structure",
      homeworkDue: "Friday",
      totalLessonsCompleted: 5,
      totalLessons: 12,
      color: "bg-purple-100 border-purple-400",
      iconBg: "bg-purple-200",
      buttonColor: "bg-purple-500 hover:bg-purple-600",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=100&q=80"
    },
    {
      id: "coding101",
      title: "Intro to Coding",
      teacher: "Mr. David Park",
      teacherImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80",
      nextSession: "Thursday, 2:15 PM",
      sessionTime: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() + 3, 14, 15),
      progress: 28,
      students: 15,
      grade: "Grade 10",
      subject: "Computer Science",
      curriculum: "National Curriculum",
      classType: "Non-Academic",
      nextTopic: "JavaScript Functions",
      homeworkDue: "Next Monday",
      totalLessonsCompleted: 3,
      totalLessons: 10,
      color: "bg-blue-100 border-blue-400",
      iconBg: "bg-blue-200",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=100&q=80"
    },
    {
      id: "english101",
      title: "English Adventures",
      teacher: "Ms. Emily Rodriguez",
      teacherImage: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80",
      nextSession: "Friday, 1:30 PM",
      sessionTime: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() + 4, 13, 30),
      progress: 50,
      students: 22,
      grade: "Grade 7",
      subject: "English Literature",
      curriculum: "International Baccalaureate",
      classType: "Tutoring",
      nextTopic: "Creative Writing",
      homeworkDue: "Wednesday",
      totalLessonsCompleted: 6,
      totalLessons: 12,
      color: "bg-yellow-100 border-yellow-400",
      iconBg: "bg-yellow-200",
      buttonColor: "bg-yellow-500 hover:bg-yellow-600",
      image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=100&q=80"
    }
  ];

  const sortedClasses = [...classes].sort((a, b) => 
    a.sessionTime.getTime() - b.sessionTime.getTime()
  );

  const currentClass = sortedClasses.find(cls => {
    const now = currentTime.getTime();
    const classTime = cls.sessionTime.getTime();
    const timeDiffMinutes = (now - classTime) / (1000 * 60);
    return timeDiffMinutes >= 0 && timeDiffMinutes < 60;
  });

  const upcomingClasses = sortedClasses
    .filter(cls => cls.sessionTime > currentTime)
    .filter(cls => !currentClass || cls.id !== currentClass.id)
    .slice(0, currentClass ? 2 : 3);

  const classesToDisplay = currentClass 
    ? [currentClass, ...upcomingClasses] 
    : upcomingClasses;

  const getMinutesSinceStart = (classTime: Date) => {
    if (classTime > currentTime) return null;
    
    const diffMs = currentTime.getTime() - classTime.getTime();
    return Math.floor(diffMs / (1000 * 60));
  };

  const handleJoinClass = (classItem: any) => {
    setSelectedClass(classItem);
    setIsJoinDialogOpen(true);
  };

  const toggleBookmark = (classId: string) => {
    setBookmarkedClasses(prev => 
      prev.includes(classId) 
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  const formatProgressText = (completed: number, total: number) => {
    return `${completed}/${total} lessons`;
  };

  return (
    <Card className="border-2 border-blue-100 rounded-xl overflow-hidden shadow-md transform transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="text-lg font-bold flex items-center">
          <BookOpen className="mr-2 h-5 w-5 text-kidato-blue" />
          Today's Lessons
        </CardTitle>
        <Button variant="ghost" size="sm" asChild className="px-4">
          <Link to="/courses" className="text-kidato-blue hover:text-kidato-blue/90 text-sm flex items-center">
            View all
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        {currentClass && isAlertVisible && (
          <Alert 
            className="mb-4 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-l-red-500 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BellRing className="h-5 w-5 text-red-500 mr-2" />
                <AlertDescription className="text-red-800 font-medium">
                  You have a live class happening now: {currentClass.title}
                </AlertDescription>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-red-300 text-red-600 hover:bg-red-100"
                onClick={() => handleJoinClass(currentClass)}
              >
                Join Now
              </Button>
            </div>
          </Alert>
        )}
        
        <div className="space-y-4">
          {classesToDisplay.length > 0 ? (
            classesToDisplay.map((classItem, index) => {
              const isCurrentClass = classItem.sessionTime <= currentTime;
              const minutesSinceStart = isCurrentClass ? getMinutesSinceStart(classItem.sessionTime) : null;
              const isBookmarked = bookmarkedClasses.includes(classItem.id);
              
              return (
                <div 
                  key={classItem.id} 
                  className={`rounded-xl border-2 overflow-hidden shadow-sm transition-all hover:shadow-md ${classItem.color} ${isCurrentClass ? 'ring-2 ring-red-400 ring-offset-1' : ''} animate-fade-in`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex flex-col">
                    <div className="p-3 bg-white/40 backdrop-blur-sm flex items-center justify-between">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className={`${classItem.iconBg} p-1.5 rounded-lg`}>
                            {classItem.classType === "Academic" && <BookOpen className="h-4 w-4" />}
                            {classItem.classType === "Exam Prep" && <Award className="h-4 w-4" />}
                            {classItem.classType === "Non-Academic" && <Star className="h-4 w-4" />}
                            {classItem.classType === "Tutoring" && <Users className="h-4 w-4" />}
                          </div>
                          <span className="text-xs font-medium">{classItem.classType}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 ml-7">
                          <span className="text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-full">
                            {classItem.grade}
                          </span>
                          <span className="text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-full">
                            {classItem.subject}
                          </span>
                          <span className="text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-full">
                            {classItem.curriculum}
                          </span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          toggleBookmark(classItem.id);
                        }}
                        className="text-gray-500 hover:text-yellow-500 transition-colors"
                      >
                        <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-yellow-400 text-yellow-500" : ""}`} />
                      </button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row p-4">
                      <div className="sm:w-24 flex justify-center mb-4 sm:mb-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 relative rounded-full overflow-hidden border-2 border-white shadow-sm">
                          <img 
                            src={classItem.teacherImage} 
                            alt={classItem.teacher} 
                            className="w-full h-full object-cover"
                          />
                          {isCurrentClass && (
                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full animate-ping absolute"></div>
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              {classItem.title}
                              {isCurrentClass && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                  LIVE
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600">{classItem.teacher}</p>
                            
                            <div className="mt-2 flex flex-wrap gap-2">
                              <div className="text-xs text-gray-500">
                                <span className="font-medium">Next topic:</span> {classItem.nextTopic}
                              </div>
                            </div>
                          </div>
                          {index === 0 && isCurrentClass && (
                            <span className="animate-pulse bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              Live now!
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-3 mb-3">
                          <div className={`flex items-center text-xs px-2 py-1 rounded-full ${classItem.iconBg}`}>
                            <Users className="h-3 w-3 mr-1" />
                            <span>{classItem.students} friends</span>
                          </div>
                          <div className={`flex items-center text-xs px-2 py-1 rounded-full ${isCurrentClass ? 'bg-red-100' : classItem.iconBg}`}>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              {isCurrentClass 
                                ? `Started ${minutesSinceStart} mins ago` 
                                : classItem.nextSession}
                            </span>
                          </div>
                          {classItem.homeworkDue && (
                            <div className={`flex items-center text-xs px-2 py-1 rounded-full ${classItem.iconBg}`}>
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>Homework due: {classItem.homeworkDue}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="w-full mb-1">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full`} 
                              style={{ 
                                width: `${classItem.progress}%`,
                                backgroundColor: isCurrentClass 
                                  ? "#ea384c" // Red color for live classes
                                  : classItem.buttonColor.split(' ')[0].replace('bg-', '#').replace('green-500', '22c55e').replace('purple-500', 'a855f7').replace('blue-500', '3b82f6').replace('yellow-500', 'eab308')
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">
                              {formatProgressText(classItem.totalLessonsCompleted, classItem.totalLessons)}
                            </span>
                            <span className="text-xs font-medium">{classItem.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/60 backdrop-blur-sm border-t border-gray-200 p-3">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                          <span className="text-xs font-medium text-gray-700">
                            {isCurrentClass ? "Current session" : "Next session"}:
                          </span>
                          <span className="text-xs ml-1 text-gray-800">
                            {classItem.nextSession}
                          </span>
                        </div>
                        
                        {isCurrentClass && (
                          <span className="flex items-center text-red-600 text-xs">
                            <div className="h-2 w-2 bg-red-500 rounded-full mr-1.5 animate-pulse"></div>
                            In progress
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-end gap-2 flex-wrap">
                        <Button 
                          className={isCurrentClass ? "bg-red-600 hover:bg-red-700 text-white" : classItem.buttonColor}
                          onClick={() => handleJoinClass(classItem)}
                          size="sm"
                        >
                          {isCurrentClass ? "Join Now" : "Join Class"}
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/course-progress/${classItem.id}`}>
                            View Progress
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-kidato-light-blue rounded-lg">
              <div className="w-16 h-16 bg-kidato-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <p className="text-lg font-medium text-gray-700 mb-2">No upcoming classes scheduled</p>
              <p className="text-gray-500 mb-6">Time to explore new subjects!</p>
              <Button asChild className="bg-kidato-blue hover:bg-kidato-blue/90">
                <Link to="/courses">Browse Classes</Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      
      {selectedClass && (
        <JoinClassDialog
          isOpen={isJoinDialogOpen}
          setIsOpen={setIsJoinDialogOpen}
          classTitle={selectedClass.title}
        />
      )}
    </Card>
  );
}
