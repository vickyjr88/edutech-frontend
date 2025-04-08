
import { Card, CardContent } from "@/components/ui/card";
import { Book, Clock, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

export interface CourseProps {
  id: string;
  title: string;
  subject: string;
  progress: number;
  teacher: string;
  nextLesson: string;
  color: string;
  icon: React.ReactNode;
}

const CourseCard = ({ course }: { course: CourseProps }) => {
  return (
    <Link to={`/course/${course.id}`}>
      <Card className="h-full overflow-hidden hover:shadow-md transition-all border-l-4" style={{ borderLeftColor: course.color }}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full p-2.5 mt-1" style={{ backgroundColor: `${course.color}20` }}>
              {course.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">{course.subject}</p>
              <h4 className="text-base font-semibold text-gray-900 line-clamp-1 mb-2">{course.title}</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" indicatorClassName={`bg-[${course.color}]`} />
              </div>
              
              <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <p>Next: {course.nextLesson}</p>
              </div>
              
              <p className="text-xs text-gray-500 mt-1.5">
                <span className="font-medium">Teacher:</span> {course.teacher}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;
