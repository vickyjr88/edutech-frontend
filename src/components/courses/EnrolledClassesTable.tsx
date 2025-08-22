
import {
  BookOpen,
  Clock,
  Calendar,
  Star,
  FileText,
  Users,
  BookMarked
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { ClassDetail } from "@/integrations/api/services/class.service";
import { getNextClassTime } from "@/lib/utils";
import { formatDate } from "date-fns";

interface EnrolledCourse {
  id: string;
  title: string;
  subject: string;
  description: string;
  progress: number;
  nextClass: string;
  enrollmentDeadline: string;
  enrolledCount: number;
  maxCapacity: number;
  rating: number;
  cost?: string;
  activityStatus?: {
    type: 'assignment' | 'group' | 'quiz';
    label: string;
    dueDate: string;
  };
}

interface EnrolledClassesTableProps {
  enrolledCourses: ClassDetail[];
}

  // Generate avatar initials for demo
  const generateInitials = (index: number) => {
    const initials = ["JD", "TS", "EW", "AM", "KP", "RJ"];
    return initials[index % initials.length];
  };

  // Render appropriate icon based on activity type
  const getActivityIcon = (type: 'assignment' | 'group' | 'quiz') => {
    switch (type) {
      case 'assignment':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'group':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'quiz':
        return <BookMarked className="h-4 w-4 text-amber-500" />;
      default:
        return <FileText className="h-4 w-4 text-blue-500" />;
    }
  };

const EnrolledClassesTable = ({ enrolledCourses }: EnrolledClassesTableProps) => {
  console.log("Enrolled courses", enrolledCourses);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
          Current Classes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Course</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Next Class</TableHead>
                <TableHead>Enrollment Deadline</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Activity Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrolledCourses.map((enrollment, index) => {
                
                return (
                  <CourseRow
                    key={enrollment._id || `enrollment-${index}`}
                    enrollment={enrollment} />
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

const CourseRow = ({ enrollment }: { enrollment: ClassDetail }) => {
  const course = enrollment; // enrollment is the ClassDetail itself
  const cohort = course.cohorts?.find((cohort) => cohort.isActive) ?? course.cohorts?.[0];
  const nextClassTime = cohort && getNextClassTime({
    daysOfWeek: cohort?.daysOfWeek,
    startTime: cohort?.startTime,
    endTime: cohort?.endTime
  });
  return (
    <TableRow>
      <TableCell className="font-medium">
        <div>
          <div className="font-semibold">{course.title}</div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
              {course.subject}
            </Badge>
            <div className="flex items-center text-amber-500">
              <Star className="h-3.5 w-3.5 fill-amber-500 mr-1" />
              <span className="font-medium">{course.rating}</span>
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="w-[100px]">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600"></span>
            <span className="text-xs font-medium">{enrollment?.progress}%</span>
          </div>
          <Progress value={enrollment?.progress ?? 20} className="h-2" />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Clock className="h-3.5 w-3.5 text-gray-400 mr-1" />
          <span className="text-sm">{nextClassTime}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Calendar className="h-3.5 w-3.5 text-gray-400 mr-1" />
          <span className="text-sm">{cohort && formatDate(cohort.enrollmentDeadline, 'MMMM d, yyyy')}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <span className="text-sm font-medium mr-2">{course?.studentsList?.length}/{cohort?.maximumStudents}</span>
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
              <Avatar key={`avatar-${course._id || 'unknown'}-${i}`} className="border-2 border-white w-7 h-7 bg-blue-200">
                <AvatarFallback className="text-xs text-blue-700">
                  {generateInitials(i)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm text-gray-500">No upcoming activities</span>
      </TableCell>
      <TableCell className="text-right">
        {course.enrollmentId ? (
          <Link to={`/course-progress/${course.enrollmentId}`}>
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 h-8"
            >
              View Progress
            </Button>
          </Link>
        ) : (
          <Button
            size="sm"
            className="bg-gray-400 cursor-not-allowed h-8"
            disabled
          >
            View Progress
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default EnrolledClassesTable;
