
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileCheck, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import AssignmentDialog from "../progress/AssignmentDialog";
import { Assignment } from "../progress/data/mockAssignmentsData";
import { useGetStudentAssignments } from "@/hooks/use-assignment-service";
import { SubmissionStatus, StudentAssignment } from "@/integrations/api/services/assignment.service";
import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from "date-fns";

export default function UpcomingAssignments() {
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);

  // Fetch student assignments from API
  const { data: studentAssignmentsResponse, isLoading } = useGetStudentAssignments();

  // Transform backend data to frontend format
  const transformAssignment = (studentAssignment: StudentAssignment): Assignment => {
    const assignment = studentAssignment.assignment;
    const dueDate = new Date(assignment.dueDate);

    // Map backend submission status to frontend status
    let status: Assignment['status'];
    switch (studentAssignment.submissionStatus) {
      case SubmissionStatus.IN_PROGRESS:
        status = 'in_progress';
        break;
      case SubmissionStatus.NOT_STARTED:
        status = isPast(dueDate) ? 'late' : 'upcoming';
        break;
      case SubmissionStatus.SUBMITTED:
        status = 'pending_review';
        break;
      case SubmissionStatus.GRADED:
        status = 'completed';
        break;
      case SubmissionStatus.LATE:
        status = 'late';
        break;
      default:
        status = 'upcoming';
    }

    // Format due date
    let formattedDueDate: string;
    if (isToday(dueDate)) {
      formattedDueDate = 'Today';
    } else if (isTomorrow(dueDate)) {
      formattedDueDate = 'Tomorrow';
    } else {
      formattedDueDate = format(dueDate, 'MMM d, yyyy');
    }

    return {
      id: studentAssignment._id,
      title: assignment.title,
      status,
      submitDate: studentAssignment.submittedAt
        ? format(new Date(studentAssignment.submittedAt), 'MMM d, yyyy')
        : undefined,
      dueDate: formattedDueDate,
      score: studentAssignment.grade ? `${studentAssignment.grade}%` : undefined,
      grade: studentAssignment.grade
        ? studentAssignment.grade >= 90 ? 'A'
          : studentAssignment.grade >= 80 ? 'B'
            : studentAssignment.grade >= 70 ? 'C'
              : studentAssignment.grade >= 60 ? 'D'
                : 'F'
        : undefined,
      feedback: studentAssignment.feedback,
      type: assignment.type === 'Group Project' ? 'group' : 'individual',
      description: assignment.description,
      progress: studentAssignment.submissionStatus === SubmissionStatus.IN_PROGRESS ? 50 : undefined,
      course: typeof assignment.class === 'string' ? 'Course' : (assignment.class as any)?.title || 'Course', // Placeholder, will be populated if class data is included
    } as Assignment & { course: string };
  };

  // Filter and transform assignments
  const assignments = useMemo(() => {
    if (!studentAssignmentsResponse?.data?.data) return [];

    return studentAssignmentsResponse.data.data
      .map(transformAssignment)
      .filter(assignment =>
        assignment.status === "upcoming" ||
        assignment.status === "in_progress"
      )
      .sort((a, b) => {
        // Sort by due date (earliest first)
        const dateA = a.dueDate === 'Today' ? new Date() : a.dueDate === 'Tomorrow' ? new Date(Date.now() + 86400000) : new Date(a.dueDate);
        const dateB = b.dueDate === 'Today' ? new Date() : b.dueDate === 'Tomorrow' ? new Date(Date.now() + 86400000) : new Date(b.dueDate);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 3); // Limit to 3 assignments for the dashboard
  }, [studentAssignmentsResponse]);

  const handleViewAssignment = (assignment: any) => {
    setSelectedAssignment(assignment);
    setAssignmentDialogOpen(true);
  };

  const handleUpdateAssignment = (assignmentId: string, updatedData: any) => {
    // In a real app, this would update the assignment in the database
    console.log("Assignment updated:", assignmentId, updatedData);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Upcoming Assignments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No upcoming assignments
            </div>
          ) : (
            assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="border rounded-md p-3"
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                  {(assignment.dueDate === "Today" || assignment.dueDate === "Tomorrow") && (
                    <Badge variant="destructive" className="text-xs">Due soon</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{assignment.course}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Due {assignment.dueDate}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewAssignment(assignment)}
                  >
                    <FileCheck className="h-3.5 w-3.5 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            ))
          )}
          <Link to="/course-progress/math101">
            <Button variant="ghost" size="sm" className="w-full mt-2">
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              View all assignments
            </Button>
          </Link>
        </div>
      </CardContent>

      {/* Assignment Dialog */}
      {selectedAssignment && (
        <AssignmentDialog
          isOpen={assignmentDialogOpen}
          onClose={() => setAssignmentDialogOpen(false)}
          assignment={selectedAssignment}
          onUpdateAssignment={handleUpdateAssignment}
        />
      )}
    </Card>
  );
}
