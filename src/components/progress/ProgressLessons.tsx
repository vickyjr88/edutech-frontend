
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  ArrowRight,
  Play
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProgressLessonsProps {
  courseId?: string;
}

// Mock data for lessons
const getMockLessonsData = () => {
  return [
    {
      id: "lesson1",
      title: "Introduction to Numbers",
      status: "completed",
      completedDate: "Jan 25, 2025",
      duration: "45 min",
      grade: "A",
      notes: true
    },
    {
      id: "lesson2",
      title: "Basic Addition and Subtraction",
      status: "completed",
      completedDate: "Feb 1, 2025",
      duration: "50 min",
      grade: "A-",
      notes: true
    },
    {
      id: "lesson3",
      title: "Multiplication Fundamentals",
      status: "completed",
      completedDate: "Feb 8, 2025",
      duration: "55 min",
      grade: "B+",
      notes: true
    },
    {
      id: "lesson4",
      title: "Division Basics",
      status: "in-progress",
      nextSession: "Feb 15, 2025",
      duration: "60 min",
      completedPercentage: 35,
      notes: false
    },
    {
      id: "lesson5",
      title: "Fractions Introduction",
      status: "upcoming",
      nextSession: "Feb 22, 2025",
      duration: "60 min",
      notes: false
    },
    {
      id: "lesson6",
      title: "Decimals and Percentages",
      status: "upcoming",
      nextSession: "Mar 1, 2025",
      duration: "65 min",
      notes: false
    },
  ];
};

const ProgressLessons = ({ courseId }: ProgressLessonsProps) => {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call
    const fetchData = async () => {
      setLoading(true);
      // In a real app, this would be an API call using courseId
      const data = getMockLessonsData();
      setLessons(data);
      setLoading(false);
    };

    fetchData();
  }, [courseId]);

  if (loading) {
    return <div className="text-center py-8">Loading lessons data...</div>;
  }

  const completedLessons = lessons.filter(lesson => lesson.status === "completed");
  const inProgressLessons = lessons.filter(lesson => lesson.status === "in-progress");
  const upcomingLessons = lessons.filter(lesson => lesson.status === "upcoming");

  return (
    <div className="space-y-6">
      {/* In Progress Lessons */}
      {inProgressLessons.length > 0 && (
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
                    <Button className="bg-blue-600 hover:bg-blue-700">
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
      )}
      
      {/* All Lessons Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
            All Lessons
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                          <Button size="sm" variant="secondary">
                            Review Lesson
                          </Button>
                        </>
                      ) : lesson.status === "in-progress" ? (
                        <Button size="sm">
                          Continue
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressLessons;
