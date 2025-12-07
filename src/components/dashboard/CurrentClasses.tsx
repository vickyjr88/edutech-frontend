
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import JoinClassDialog from "./JoinClassDialog";
import ClassCard from "./ClassCard";
import EmptyClassesState from "./EmptyClassesState";
import { useClassesData } from "./useClassesData";

export default function CurrentClasses() {
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  
  // Create a function to handle joining a class
  const handleJoinClass = (classItem: any) => {
    setSelectedClass(classItem);
    setIsJoinDialogOpen(true);
  };
  
  const { 
    currentClass, 
    classesToDisplay, 
    bookmarkedClasses, 
    getMinutesSinceStart, 
    toggleBookmark,
    isLoading,
    todaysLessons
  } = useClassesData();
  
  const title = todaysLessons.length > 0 ? "Today's Lessons" : "Upcoming Lessons";
  
  return (
    <Card className="border-2 border-blue-100 rounded-xl overflow-hidden shadow-md transform transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="text-lg font-bold flex items-center">
          <BookOpen className="mr-2 h-5 w-5 text-kidato-purple" />
          {title}
        </CardTitle>
        <Button variant="ghost" size="sm" asChild className="px-4">
          <Link to="/courses" className="text-kidato-purple hover:text-kidato-purple/90 text-sm flex items-center">
            View all
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kidato-purple"></div>
            </div>
          ) : classesToDisplay.length > 0 ? (
            classesToDisplay.map((classItem, index) => {
              const isCurrentClass = classItem.sessionTime <= new Date();
              const minutesSinceStart = isCurrentClass ? getMinutesSinceStart(classItem.sessionTime) : null;
              const isBookmarked = bookmarkedClasses.includes(classItem.id);
              
              return (
                <ClassCard
                  key={`${classItem.id}-${index}`}
                  classItem={classItem}
                  isCurrentClass={isCurrentClass}
                  minutesSinceStart={minutesSinceStart}
                  isBookmarked={isBookmarked}
                  index={index}
                  onToggleBookmark={toggleBookmark}
                  onJoinClass={handleJoinClass}
                />
              );
            })
          ) : (
            <EmptyClassesState />
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
