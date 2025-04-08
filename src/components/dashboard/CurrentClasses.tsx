
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Users, Clock, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import JoinClassDialog from "./JoinClassDialog";

export default function CurrentClasses() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  
  // Update current time every minute
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
      color: "bg-yellow-100 border-yellow-400",
      iconBg: "bg-yellow-200",
      buttonColor: "bg-yellow-500 hover:bg-yellow-600",
      image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=100&q=80"
    }
  ];

  // Sort classes by session time
  const sortedClasses = [...classes].sort((a, b) => 
    a.sessionTime.getTime() - b.sessionTime.getTime()
  );

  // Find current (ongoing) class if any
  const currentClass = sortedClasses.find(cls => {
    const now = currentTime.getTime();
    const classTime = cls.sessionTime.getTime();
    const timeDiffMinutes = (now - classTime) / (1000 * 60);
    return timeDiffMinutes >= 0 && timeDiffMinutes < 60;
  });

  // Get next classes (excluding current class)
  const upcomingClasses = sortedClasses
    .filter(cls => cls.sessionTime > currentTime)
    .filter(cls => !currentClass || cls.id !== currentClass.id)
    .slice(0, currentClass ? 2 : 3); // Show 2 upcoming if there's a current class, otherwise 3

  const classesToDisplay = currentClass 
    ? [currentClass, ...upcomingClasses] 
    : upcomingClasses;

  // Calculate minutes since class started (if class is ongoing)
  const getMinutesSinceStart = (classTime: Date) => {
    if (classTime > currentTime) return null;
    
    const diffMs = currentTime.getTime() - classTime.getTime();
    return Math.floor(diffMs / (1000 * 60));
  };

  const handleJoinClass = (classItem: any) => {
    setSelectedClass(classItem);
    setIsJoinDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <BookOpen className="mr-2 h-5 w-5 text-kidato-blue" />
          My Classes
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/courses" className="text-kidato-blue hover:text-kidato-blue/90 text-sm">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {classesToDisplay.length > 0 ? (
            classesToDisplay.map((classItem, index) => {
              const isCurrentClass = classItem.sessionTime <= currentTime;
              const minutesSinceStart = isCurrentClass ? getMinutesSinceStart(classItem.sessionTime) : null;
              
              return (
                <div 
                  key={classItem.id} 
                  className={`rounded-lg border-2 overflow-hidden shadow-sm transition-all hover:shadow-md ${classItem.color}`}
                >
                  <div className="flex flex-col">
                    <div className="flex flex-col sm:flex-row p-4">
                      {/* Teacher Image - Made responsive with consistent dimensions */}
                      <div className="sm:w-24 flex justify-center mb-4 sm:mb-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 relative rounded-full overflow-hidden border-2 border-white shadow-sm">
                          <img 
                            src={classItem.teacherImage} 
                            alt={classItem.teacher} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Class Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{classItem.title}</h3>
                            <p className="text-sm text-gray-600">{classItem.teacher}</p>
                            
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                              <div className="text-xs text-gray-500">
                                <span className="font-medium">Grade:</span> {classItem.grade}
                              </div>
                              <div className="text-xs text-gray-500">
                                <span className="font-medium">Subject:</span> {classItem.subject}
                              </div>
                              <div className="text-xs text-gray-500 col-span-1 sm:col-span-2">
                                <span className="font-medium">Curriculum:</span> {classItem.curriculum}
                              </div>
                            </div>
                          </div>
                          {index === 0 && isCurrentClass && (
                            <span className="animate-pulse bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              Live now!
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-3 mb-3">
                          <div className={`flex items-center text-xs px-2 py-1 rounded-full ${classItem.iconBg}`}>
                            <Users className="h-3 w-3 mr-1" />
                            <span>{classItem.students} friends</span>
                          </div>
                          <div className={`flex items-center text-xs px-2 py-1 rounded-full ${classItem.iconBg}`}>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              {isCurrentClass 
                                ? `Started ${minutesSinceStart} mins ago` 
                                : classItem.nextSession}
                            </span>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full mb-3">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full`} 
                              style={{ 
                                width: `${classItem.progress}%`,
                                backgroundColor: classItem.buttonColor.split(' ')[0].replace('bg-', '#').replace('green-500', '22c55e').replace('purple-500', 'a855f7').replace('blue-500', '3b82f6').replace('yellow-500', 'eab308')
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">Progress</span>
                            <span className="text-xs font-medium">{classItem.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Buttons Row - Moved to separate row below progress */}
                    <div className="px-4 pb-4 flex justify-end gap-2 flex-wrap">
                      <Button 
                        className={classItem.buttonColor}
                        onClick={() => handleJoinClass(classItem)}
                        size="sm"
                      >
                        Join Class
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/class/${classItem.id}`}>
                          View Details
                        </Link>
                      </Button>
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
