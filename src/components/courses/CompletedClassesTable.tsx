
import { 
  CheckCircle, 
  Calendar, 
  Star, 
  Download, 
  ExternalLink,
  DollarSign
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

export interface CompletedCourse {
  id: string;
  title: string;
  subject: string;
  description: string;
  completedDate: string;
  grade: string;
  rating: number;
  cost: string;
}

interface CompletedClassesTableProps {
  completedCourses: CompletedCourse[];
}

const CompletedClassesTable = ({ completedCourses }: CompletedClassesTableProps) => {
  return (
    <Card className="mt-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
          Completed Classes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Course</TableHead>
                <TableHead>Completed Date</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{course.title}</div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 mt-1">
                        {course.subject}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 text-gray-400 mr-1" />
                      <span className="text-sm">{course.completedDate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-200">
                      {course.grade}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-amber-500 mr-1" />
                      <span className="font-medium">{course.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-gray-700">
                      <DollarSign className="h-3.5 w-3.5 text-gray-500 mr-0.5" />
                      <span>{course.cost}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="h-8">
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Certificate
                      </Button>
                      <Button size="sm" className="bg-kidato-purple hover:bg-kidato-dark-blue h-8">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        Review
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompletedClassesTable;
