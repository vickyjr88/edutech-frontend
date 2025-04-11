
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Calendar } from "lucide-react";

interface LessonsTableProps {
  lessons: any[];
  onReviewLesson: (lesson: any) => void;
  onContinueLearning: (lesson: any) => void;
}

const LessonsTable = ({ lessons, onReviewLesson, onContinueLearning }: LessonsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Lesson</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lessons.map(lesson => (
            <TableRow key={lesson.id}>
              <TableCell className="font-medium">
                {lesson.title}
              </TableCell>
              <TableCell>
                {lesson.status === "completed" ? (
                  <Badge variant="success" className="flex items-center w-fit">
                    <CheckCircle className="h-3 w-3 mr-1" /> Completed
                  </Badge>
                ) : lesson.status === "in-progress" ? (
                  <Badge variant="info" className="flex items-center w-fit">
                    <Clock className="h-3 w-3 mr-1" /> In Progress
                  </Badge>
                ) : (
                  <Badge variant="outline" className="flex items-center w-fit">
                    <Calendar className="h-3 w-3 mr-1" /> Upcoming
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {lesson.duration}
              </TableCell>
              <TableCell>
                {lesson.completedDate || lesson.nextSession || "Not scheduled"}
              </TableCell>
              <TableCell>
                {lesson.grade || "-"}
              </TableCell>
              <TableCell className="text-right flex justify-end gap-2">
                {lesson.status === "completed" ? (
                  <>
                    <Button size="sm" variant="outline">
                      Lesson Plan
                    </Button>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => onReviewLesson(lesson)}
                    >
                      Review Lesson
                    </Button>
                  </>
                ) : lesson.status === "in-progress" ? (
                  <Button 
                    size="sm"
                    onClick={() => onContinueLearning(lesson)}
                  >
                    Join Class
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" disabled>
                    Start
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LessonsTable;
