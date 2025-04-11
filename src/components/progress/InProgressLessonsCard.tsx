
import { Clock, Calendar, ArrowRight, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useState, useEffect } from "react";

interface InProgressLessonsCardProps {
  inProgressLessons: any[];
  onContinueLearning: (lesson: any) => void;
}

const InProgressLessonsCard = ({ inProgressLessons, onContinueLearning }: InProgressLessonsCardProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pulsing, setPulsing] = useState(true);

  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    // Alternate pulsing effect every 3 seconds
    const pulsingTimer = setInterval(() => {
      setPulsing(prev => !prev);
    }, 3000);
    
    return () => {
      clearInterval(timer);
      clearInterval(pulsingTimer);
    };
  }, []);

  // Check if any lesson is currently happening right now
  const liveLesson = inProgressLessons.find(lesson => {
    if (lesson.startTime && lesson.endTime) {
      const startTime = new Date(lesson.startTime);
      const endTime = new Date(lesson.endTime);
      return currentTime >= startTime && currentTime <= endTime;
    }
    return false;
  });

  if (inProgressLessons.length === 0) {
    return null;
  }

  // Softer background colors
  // Background color for live class: soft peach gradient
  // Background color for regular classes: soft blue

  return (
    <Card className={`${liveLesson ? 'border-red-300' : 'border-blue-100'}`}>
      <CardHeader className={`pb-2 ${liveLesson ? 'bg-gradient-to-r from-red-50 to-orange-50' : 'bg-blue-50'}`}>
        <CardTitle className="text-lg font-medium flex items-center">
          {liveLesson ? (
            <Video className={`mr-2 h-5 w-5 text-red-500 ${pulsing ? 'animate-pulse' : ''}`} />
          ) : (
            <Play className="mr-2 h-5 w-5 text-blue-500" />
          )}
          {liveLesson ? "Live Class Happening Now!" : "Today's Lessons"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {liveLesson ? (
          <div key={liveLesson.id} className="bg-red-50/70 p-4 rounded-lg border border-red-100 mb-4">
            <div className="flex flex-wrap justify-between items-center">
              <div>
                <h3 className="font-medium text-red-800 flex items-center">
                  <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-600 mr-2 animate-pulse"></span> 
                  LIVE NOW: {liveLesson.title}
                </h3>
                <div className="flex items-center mt-1 text-sm text-red-700">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>Started at: {liveLesson.nextSession}</span>
                  <Clock className="h-3.5 w-3.5 ml-3 mr-1" />
                  <span>{liveLesson.duration}</span>
                </div>
              </div>
              <div className="mt-2 sm:mt-0">
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => onContinueLearning(liveLesson)}
                >
                  Join Now <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{liveLesson.completedPercentage}%</span>
              </div>
              <div className="w-full bg-orange-100 rounded-full h-2.5">
                <div 
                  className="bg-amber-400 h-2.5 rounded-full" 
                  style={{ width: `${liveLesson.completedPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : null}
        
        {/* Other in progress lessons */}
        {inProgressLessons.filter(lesson => lesson.id !== liveLesson?.id).map(lesson => (
          <div key={lesson.id} className="bg-blue-50/70 p-4 rounded-lg border border-blue-100 transition-all hover:shadow-md">
            <div className="flex flex-wrap justify-between items-center">
              <div>
                <h3 className="font-medium text-blue-800">{lesson.title}</h3>
                <div className="flex items-center mt-1 text-sm text-blue-700">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>Next: {lesson.nextSession}</span>
                  <Clock className="h-3.5 w-3.5 ml-3 mr-1" />
                  <span>{lesson.duration}</span>
                </div>
              </div>
              <div className="mt-2 sm:mt-0">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => onContinueLearning(lesson)}
                >
                  Join Class <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{lesson.completedPercentage}%</span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2.5">
                <div 
                  className="bg-blue-400 h-2.5 rounded-full" 
                  style={{ width: `${lesson.completedPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default InProgressLessonsCard;
