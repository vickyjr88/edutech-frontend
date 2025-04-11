
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  Upload,
  Eye,
  FileCheck,
  AlarmClock,
  Users
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
import AssignmentDialog from "./AssignmentDialog";
import { useToast } from "@/components/ui/use-toast";

interface ProgressAssignmentsProps {
  courseId?: string;
}

// Mock data for assignments
const getMockAssignmentsData = () => {
  return [
    {
      id: "assignment1",
      title: "Basic Operations Worksheet",
      status: "completed",
      submitDate: "Feb 3, 2025",
      dueDate: "Feb 5, 2025",
      score: "95%",
      grade: "A",
      feedback: "Excellent work with clear solutions.",
      type: "individual",
      description: "Complete the worksheet on basic arithmetic operations including addition, subtraction, multiplication and division."
    },
    {
      id: "assignment2",
      title: "Mathematical Problem Solving",
      status: "pending_review",
      submitDate: "Feb 12, 2025",
      dueDate: "Feb 12, 2025",
      type: "individual",
      description: "Solve the given word problems using appropriate mathematical operations and show your work."
    },
    {
      id: "assignment3",
      title: "Group Math Project",
      status: "in_progress",
      dueDate: "Feb 20, 2025",
      progress: 30,
      type: "group",
      groupMembers: 3,
      description: "Work with your group to create a presentation explaining how mathematics is used in everyday life with at least 5 examples."
    },
    {
      id: "assignment4",
      title: "Fractions and Decimals",
      status: "upcoming",
      dueDate: "Feb 28, 2025",
      type: "individual",
      description: "Complete the worksheet on converting fractions to decimals and vice versa. Include practice problems with mixed numbers."
    },
    {
      id: "assignment5",
      title: "Challenge Problem Set",
      status: "late",
      dueDate: "Feb 10, 2025",
      type: "individual",
      lateBy: "2 days",
      description: "Solve these advanced math problems that incorporate multiple concepts learned in class."
    },
  ];
};

const ProgressAssignments = ({ courseId }: ProgressAssignmentsProps) => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulating API call
    const fetchData = async () => {
      setLoading(true);
      // In a real app, this would be an API call using courseId
      const data = getMockAssignmentsData();
      setAssignments(data);
      setLoading(false);
    };

    fetchData();
  }, [courseId]);

  const handleViewAssignment = (assignment: any) => {
    setSelectedAssignment(assignment);
    setAssignmentDialogOpen(true);
  };

  const handleUpdateAssignment = (assignmentId: string, updatedData: any) => {
    const updatedAssignments = assignments.map(assignment => 
      assignment.id === assignmentId 
        ? { ...assignment, ...updatedData } 
        : assignment
    );
    
    setAssignments(updatedAssignments);
    
    toast({
      title: "Assignment Updated",
      description: "Your assignment has been submitted successfully!",
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading assignments data...</div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="success" className="flex items-center w-fit">
            <CheckCircle className="h-3 w-3 mr-1" /> Completed
          </Badge>
        );
      case "pending_review":
        return (
          <Badge variant="warning" className="flex items-center w-fit bg-amber-100 text-amber-700">
            <Clock className="h-3 w-3 mr-1" /> Under Review
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="info" className="flex items-center w-fit">
            <FileText className="h-3 w-3 mr-1" /> In Progress
          </Badge>
        );
      case "upcoming":
        return (
          <Badge variant="outline" className="flex items-center w-fit">
            <Calendar className="h-3 w-3 mr-1" /> Upcoming
          </Badge>
        );
      case "late":
        return (
          <Badge variant="destructive" className="flex items-center w-fit">
            <AlarmClock className="h-3 w-3 mr-1" /> Late
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="flex items-center w-fit">
            {status}
          </Badge>
        );
    }
  };

  const getActionButton = (assignment: any) => {
    switch (assignment.status) {
      case "completed":
        return (
          <Button size="sm" variant="outline" onClick={() => handleViewAssignment(assignment)}>
            <Eye className="h-3.5 w-3.5 mr-1" /> View Feedback
          </Button>
        );
      case "pending_review":
        return (
          <Button size="sm" variant="outline" onClick={() => handleViewAssignment(assignment)}>
            <Clock className="h-3.5 w-3.5 mr-1" /> View Submission
          </Button>
        );
      case "in_progress":
        return (
          <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleViewAssignment(assignment)}>
            <Upload className="h-3.5 w-3.5 mr-1" /> Submit
          </Button>
        );
      case "upcoming":
        return (
          <Button size="sm" variant="outline" onClick={() => handleViewAssignment(assignment)}>
            <FileCheck className="h-3.5 w-3.5 mr-1" /> View Assignment
          </Button>
        );
      case "late":
        return (
          <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => handleViewAssignment(assignment)}>
            <Upload className="h-3.5 w-3.5 mr-1" /> Submit Late
          </Button>
        );
      default:
        return (
          <Button size="sm" variant="outline" disabled>
            No Action
          </Button>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Assignment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-3 mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold">
                {assignments.filter(a => a.status === "completed").length}
              </h3>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-amber-100 p-3 mb-3">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold">
                {assignments.filter(a => a.status === "pending_review").length}
              </h3>
              <p className="text-sm text-gray-500">Under Review</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-blue-100 p-3 mb-3">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold">
                {assignments.filter(a => ["in_progress", "upcoming"].includes(a.status)).length}
              </h3>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-red-100 p-3 mb-3">
                <AlarmClock className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold">
                {assignments.filter(a => a.status === "late").length}
              </h3>
              <p className="text-sm text-gray-500">Late</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Assignments Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <FileText className="mr-2 h-5 w-5 text-amber-500" />
            All Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Assignment</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map(assignment => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">
                      {assignment.title}
                    </TableCell>
                    <TableCell>
                      {assignment.type === "group" ? (
                        <div className="flex items-center">
                          <Users className="h-3.5 w-3.5 mr-1 text-purple-500" />
                          <span>Group ({assignment.groupMembers} members)</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <FileText className="h-3.5 w-3.5 mr-1 text-blue-500" />
                          <span>Individual</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(assignment.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        <span>{assignment.dueDate}</span>
                        {assignment.lateBy && (
                          <Badge variant="destructive" className="ml-2">
                            {assignment.lateBy} late
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {assignment.grade ? (
                        <div className="flex items-center">
                          <Badge 
                            variant="outline" 
                            className="bg-green-100 text-green-700 border-green-200"
                          >
                            {assignment.grade}
                          </Badge>
                          <span className="ml-2">{assignment.score}</span>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {getActionButton(assignment)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Assignment Dialog */}
      {selectedAssignment && (
        <AssignmentDialog
          isOpen={assignmentDialogOpen}
          onClose={() => setAssignmentDialogOpen(false)}
          assignment={selectedAssignment}
          onUpdateAssignment={handleUpdateAssignment}
        />
      )}
    </div>
  );
};

export default ProgressAssignments;
