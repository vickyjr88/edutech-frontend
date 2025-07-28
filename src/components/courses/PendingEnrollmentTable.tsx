
import {
  BookOpen,
  Clock,
  Calendar,
  Star,
  FileText,
  Users,
  BookMarked,
  BookLock
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
import { useState } from "react";
import { formatDate } from "date-fns";
import CheckoutFlow from "@/components/payments/Checkout";

interface Course {
  id: string;
  title: string;
  subject: string;
  rating: number;
}

interface NextClass {
  date: string;
  time: string;
}

interface Participants {
  current: number;
  maximum: number;
}

interface Enrollment {
  enrollmentId: string;
  course: Course;
  progress: number;
  nextClass: NextClass;
  enrollmentDeadline: string; // ISO date string
  participants: Participants;
  price: number;
}

interface EnrollmentTableProps {
  enrollments: Enrollment[];
}

  // Generate avatar initials for demo
  const generateInitials = (index: number) => {
    const initials = ["JD", "TS", "EW", "AM", "KP", "RJ"];
    return initials[index % initials.length];
  };

const EnrollmentTable = ({ enrollments }: EnrollmentTableProps) => {
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);

  return (
    <Card className="mb-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <BookLock className="mr-2 h-5 w-5 text-blue-500" />
          Pending Enrollments
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
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((enrollment) => {
                
                return (
                  <EnrollmentTableRow
                    key={enrollment.enrollmentId}
                    enrollment={enrollment}
                    onPayNow={(enrollment) => setSelectedEnrollment(enrollment)} />
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {selectedEnrollment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CheckoutFlow onClose={() => setSelectedEnrollment(null)} />
          </div>
        </div>
      )}
    </Card>
  );
};

const EnrollmentTableRow = ({ 
  enrollment, 
  onPayNow 
}: { 
  enrollment: Enrollment;
  onPayNow: (enrollment: Enrollment) => void;
}) => {
  const { course } = enrollment;
  
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
          <span className="text-sm">{`${formatDate(enrollment?.nextClass?.date, 'MMMM d, yyyy')}, ${enrollment?.nextClass?.time}`}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Calendar className="h-3.5 w-3.5 text-gray-400 mr-1" />
          <span className="text-sm">{formatDate(enrollment?.enrollmentDeadline, 'MMMM d, yyyy')}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <span className="text-sm font-medium mr-2">{enrollment?.participants?.current}/{enrollment?.participants?.maximum}</span>
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
              <Avatar key={i} className="border-2 border-white w-7 h-7 bg-blue-200">
                <AvatarFallback className="text-xs text-blue-700">
                  {generateInitials(i)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      </TableCell>
      <TableCell>
        {enrollment.price}
      </TableCell>
      <TableCell className="text-right">
        <Button
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700 h-8"
          onClick={() => onPayNow(enrollment)}
        >
          Pay Now
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default EnrollmentTable;
