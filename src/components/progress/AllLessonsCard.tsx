
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import LessonsTable from "./LessonsTable";

interface AllLessonsCardProps {
  lessons: any[];
  onReviewLesson: (lesson: any) => void;
  onContinueLearning: (lesson: any) => void;
}

const AllLessonsCard = ({ lessons, onReviewLesson, onContinueLearning }: AllLessonsCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
          All Lessons
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LessonsTable 
          lessons={lessons} 
          onReviewLesson={onReviewLesson} 
          onContinueLearning={onContinueLearning} 
        />
      </CardContent>
    </Card>
  );
};

export default AllLessonsCard;
