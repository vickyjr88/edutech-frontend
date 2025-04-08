
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import JoinClassDialog from "./JoinClassDialog";

export default function CurrentClasses() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  
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
      nextSession: "Today, 3:30 PM",
      sessionTime: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 15, 30),
      progress: 65,
      students: 24,
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=100&q=80"
    },
    {
      id: "science205",
      title: "Science Explorers",
      teacher: "Dr. Michael Chen",
      nextSession: "Tomorrow, 4:00 PM",
      sessionTime: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() + 1, 16, 0),
      progress: 42,
      students: 18,
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=100&q=80"
    },
    {
      id: "coding101",
      title: "Intro to Coding",
      teacher: "Mr. David Park",
      nextSession: "Thursday, 2:15 PM",
      sessionTime: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() + 3, 14, 15),
      progress: 28,
      students: 15,
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=100&q=80"
    }
  ];

  // Find current or next class
  const getCurrentOrNextClass = () => {
    // Sort classes by session time
    const sortedClasses = [...classes].sort((a, b) => a.sessionTime.getTime() - b.sessionTime.getTime());
    
    // Find current class (started less than 60 minutes ago)
    const currentClass = sortedClasses.find(cls => {
      const now = currentTime.getTime();
      const classTime = cls.sessionTime.getTime();
      const timeDiffMinutes = (now - classTime) / (1000 * 60);
      return timeDiffMinutes >= 0 && timeDiffMinutes < 60;
    });
    
    // If there's a current class, return it; otherwise return the next upcoming class
    return currentClass || sortedClasses.find(cls => cls.sessionTime > currentTime);
  };

  const classToDisplay = getCurrentOrNextClass();

  // Calculate minutes since class started (if class is ongoing)
  const getMinutesSinceStart = (classTime: Date) => {
    if (classTime > currentTime) return null;
    
    const diffMs = currentTime.getTime() - classTime.getTime();
    return Math.floor(diffMs / (1000 * 60));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          {classToDisplay && classToDisplay.sessionTime <= currentTime 
            ? "Current Class" 
            : "Next Class"}
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/courses">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {classToDisplay ? (
          <div className="flex flex-col border rounded-lg overflow-hidden">
            <div className="flex items-start">
              <img 
                src={classToDisplay.image} 
                alt={classToDisplay.title} 
                className="w-24 h-20 object-cover hidden sm:block"
              />
              <div className="flex-1 p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900">{classToDisplay.title}</h3>
                  <div className="flex items-center text-xs text-gray-500">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    <span>{classToDisplay.students} students</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{classToDisplay.teacher}</p>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-sm">
                    <Clock className="h-3.5 w-3.5 mr-1 text-gray-500" />
                    <span>
                      {classToDisplay.sessionTime <= currentTime 
                        ? `Started ${getMinutesSinceStart(classToDisplay.sessionTime)} minutes ago` 
                        : classToDisplay.nextSession}
                    </span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-kidato-blue h-1.5 rounded-full" 
                    style={{ width: `${classToDisplay.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">Progress</span>
                  <span className="text-xs font-medium">{classToDisplay.progress}%</span>
                </div>
              </div>
            </div>
            
            <div className="flex p-3 bg-gray-50 border-t">
              {classToDisplay.sessionTime <= currentTime ? (
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => setIsJoinDialogOpen(true)}
                >
                  Join Class Now
                </Button>
              ) : (
                <Button variant="outline" className="flex-1">
                  Set Reminder
                </Button>
              )}
              
              <Button variant="ghost" className="ml-2" asChild>
                <Link to={`/class/${classToDisplay.id}`}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No upcoming classes scheduled.</p>
            <Button asChild className="mt-4">
              <Link to="/courses">Browse Classes</Link>
            </Button>
          </div>
        )}
      </CardContent>
      
      {classToDisplay && (
        <JoinClassDialog
          isOpen={isJoinDialogOpen}
          setIsOpen={setIsJoinDialogOpen}
          classTitle={classToDisplay.title}
        />
      )}
    </Card>
  );
}
