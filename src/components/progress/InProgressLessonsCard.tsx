
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface InProgressLessonsCardProps {
  inProgressLessons: any[];
  onContinueLearning: (lesson: any) => void;
}

const InProgressLessonsCard = ({ inProgressLessons, onContinueLearning }: InProgressLessonsCardProps) => {
  if (inProgressLessons.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Play className="mr-2 h-5 w-5 text-blue-500" />
          In Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        {inProgressLessons.map(lesson => (
          <div key={lesson.id} className="bg-blue-50 p-4 rounded-lg border border-blue-100">
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
                  Continue Learning <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{lesson.completedPercentage}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
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
