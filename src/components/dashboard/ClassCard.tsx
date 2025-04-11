import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Clock, Calendar, Award, Star, BookOpen, Bookmark, CheckCircle2 } from "lucide-react";

interface ClassCardProps {
  classItem: any;
  isCurrentClass: boolean;
  minutesSinceStart: number | null;
  isBookmarked: boolean;
  index: number;
  onToggleBookmark: (classId: string) => void;
  onJoinClass: (classItem: any) => void;
}

const ClassCard = ({ 
  classItem, 
  isCurrentClass, 
  minutesSinceStart, 
  isBookmarked, 
  index,
  onToggleBookmark, 
  onJoinClass 
}: ClassCardProps) => {
  
  const formatProgressText = (completed: number, total: number) => {
    return `${completed}/${total} lessons`;
  };
  
  return (
    <div 
      className={`rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md ${classItem.color} ${isCurrentClass ? 'border-2 border-amber-400' : ''} animate-fade-in`}
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
              onToggleBookmark(classItem.id);
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
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center">
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
                </h3>
                <p className="text-sm text-gray-600">{classItem.teacher}</p>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Next topic:</span> {classItem.nextTopic}
                  </div>
                </div>
              </div>
              {index === 0 && isCurrentClass && (
                <span className="animate-pulse bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                  Live now!
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3 mb-3">
              <div className={`flex items-center text-xs px-2 py-1 rounded-full ${classItem.iconBg}`}>
                <Users className="h-3 w-3 mr-1" />
                <span>{classItem.students} friends</span>
              </div>
              <div className={`flex items-center text-xs px-2 py-1 rounded-full ${isCurrentClass ? 'bg-orange-100' : classItem.iconBg}`}>
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
                      ? "#f59e0b" // Amber color for live classes instead of red
                      : classItem.buttonColor.split(' ')[0].replace('bg-', '#').replace('green-500', '#9b87f5').replace('purple-500', '#a855f7').replace('blue-500', '#3b82f6').replace('yellow-500', '#eab308')
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
        
        <div className="bg-white/60 backdrop-blur-sm p-3">
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
              <span className="flex items-center text-amber-600 text-xs">
                <div className="h-2 w-2 bg-amber-500 rounded-full mr-1.5 animate-pulse"></div>
                In progress
              </span>
            )}
          </div>
          
          <div className="flex justify-end gap-2 flex-wrap">
            <Button 
              className={isCurrentClass ? "bg-amber-600 hover:bg-amber-700 text-white" : classItem.buttonColor.replace('bg-green-500', 'bg-purple-500')}
              onClick={() => onJoinClass(classItem)}
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
};

export default ClassCard;
