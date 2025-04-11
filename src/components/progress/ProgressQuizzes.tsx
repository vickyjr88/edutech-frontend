
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookMarked,
  CheckCircle,
  XCircle,
  Calendar,
  RefreshCw,
  Award,
  Clock
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

interface ProgressQuizzesProps {
  courseId?: string;
}

// Mock data for quizzes
const getMockQuizzesData = () => {
  return [
    {
      id: "quiz1",
      title: "Numbers and Operations",
      status: "completed",
      completedDate: "Feb 1, 2025",
      score: "9/10",
      grade: "A",
      timeSpent: "15 min",
      passingScore: "70%"
    },
    {
      id: "quiz2",
      title: "Addition and Subtraction",
      status: "completed",
      completedDate: "Feb 8, 2025",
      score: "8/10",
      grade: "B",
      timeSpent: "12 min",
      passingScore: "70%"
    },
    {
      id: "quiz3",
      title: "Multiplication Tables",
      status: "failed",
      completedDate: "Feb 15, 2025",
      score: "5/10",
      grade: "F",
      timeSpent: "18 min",
      passingScore: "70%",
      retakeAvailable: true
    },
    {
      id: "quiz4",
      title: "Division Problems",
      status: "upcoming",
      dueDate: "Feb 22, 2025",
      estimatedDuration: "20 min",
      passingScore: "70%"
    },
  ];
};

const ProgressQuizzes = ({ courseId }: ProgressQuizzesProps) => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call
    const fetchData = async () => {
      setLoading(true);
      // In a real app, this would be an API call using courseId
      const data = getMockQuizzesData();
      setQuizzes(data);
      setLoading(false);
    };

    fetchData();
  }, [courseId]);

  if (loading) {
    return <div className="text-center py-8">Loading quizzes data...</div>;
  }

  // Sort quizzes by status (upcoming first, then failed, then completed)
  const sortedQuizzes = [...quizzes].sort((a, b) => {
    const statusOrder = { upcoming: 0, failed: 1, completed: 2 };
    return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
  });

  const getScoreColor = (grade: string) => {
    switch(grade) {
      case 'A': return 'text-green-600';
      case 'B': return 'text-blue-600';
      case 'C': return 'text-amber-600';
      case 'D': return 'text-orange-600';
      case 'F': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quizzes Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-3 mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold">
                {quizzes.filter(q => q.status === "completed").length}
              </h3>
              <p className="text-sm text-gray-500">Completed Quizzes</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-amber-100 p-3 mb-3">
                <Award className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold">
                {(() => {
                  const passedQuizzes = quizzes.filter(q => q.status === "completed");
                  if (passedQuizzes.length === 0) return "N/A";
                  const avgScore = passedQuizzes.reduce((acc, quiz) => {
                    const [score, total] = quiz.score.split('/').map(Number);
                    return acc + (score / total);
                  }, 0) / passedQuizzes.length * 100;
                  return `${Math.round(avgScore)}%`;
                })()}
              </h3>
              <p className="text-sm text-gray-500">Average Score</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-blue-100 p-3 mb-3">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold">
                {quizzes.filter(q => q.status === "upcoming").length}
              </h3>
              <p className="text-sm text-gray-500">Upcoming Quizzes</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quizzes Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <BookMarked className="mr-2 h-5 w-5 text-purple-500" />
            All Quizzes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Quiz</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedQuizzes.map(quiz => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">
                      {quiz.title}
                    </TableCell>
                    <TableCell>
                      {quiz.status === "completed" ? (
                        <Badge variant="success" className="flex items-center w-fit">
                          <CheckCircle className="h-3 w-3 mr-1" /> Passed
                        </Badge>
                      ) : quiz.status === "failed" ? (
                        <Badge variant="destructive" className="flex items-center w-fit">
                          <XCircle className="h-3 w-3 mr-1" /> Failed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex items-center w-fit">
                          <Calendar className="h-3 w-3 mr-1" /> Due Soon
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {quiz.completedDate || quiz.dueDate || "Not scheduled"}
                    </TableCell>
                    <TableCell>
                      {quiz.score ? (
                        <div className="flex items-center gap-2">
                          <span>{quiz.score}</span>
                          <Badge 
                            variant="outline" 
                            className={`${getScoreColor(quiz.grade)} border-current`}
                          >
                            {quiz.grade}
                          </Badge>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {quiz.timeSpent || quiz.estimatedDuration || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {quiz.status === "completed" ? (
                        <Button size="sm" variant="outline">
                          View Results
                        </Button>
                      ) : quiz.status === "failed" && quiz.retakeAvailable ? (
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <RefreshCw className="h-3.5 w-3.5 mr-1" /> Retake
                        </Button>
                      ) : quiz.status === "upcoming" ? (
                        <Button size="sm" variant="outline">
                          Preview
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          No Action
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

export default ProgressQuizzes;
