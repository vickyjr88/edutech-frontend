
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileCheck, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import AssignmentDialog from "../progress/AssignmentDialog";
import { useGetStudentAssignments } from "@/hooks/use-assignment-service";
import { AssignmentType } from "@/integrations/api/services/assignment.service";
import { Assignment } from "../progress/data/mockAssignmentsData";

export default function UpcomingAssignments() {
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);

  // Fetch student assignments with filters for upcoming and in-progress
  const { data: assignmentsData, isLoading, error } = useGetStudentAssignments({
    status: ['pending', 'in_progress'], // Get pending (upcoming) and in-progress assignments
    sortBy: 'dueDate',
    sortOrder: 'asc',
    limit: 3 // Limit to 3 assignments for the dashboard
  });

  // Process the API data to convert to the expected format
  const assignments = assignmentsData?.data?.data?.filter(sa => sa.assignment.type !== AssignmentType.QUIZ) || [];
  
  // Convert StudentAssignment[] to Assignment[] format expected by existing components
  const convertedAssignments: Assignment[] = assignments.map(studentAssignment => ({
    id: studentAssignment._id,
    title: studentAssignment.assignment.title,
    description: studentAssignment.assignment.description || "",
    dueDate: new Date(studentAssignment.assignment.dueDate).toLocaleDateString(),
    status: studentAssignment.submissionStatus.toLowerCase().replace(' ', '-') as any,
    type: studentAssignment.assignment.type.toLowerCase().replace(' ', '-') as any,
    grade: studentAssignment.grade || 0,
    maxGrade: studentAssignment.assignment.totalPoints,
    submissionDate: studentAssignment.submittedAt ? new Date(studentAssignment.submittedAt).toLocaleDateString() : "",
    feedback: studentAssignment.feedback || "",
    isLate: studentAssignment.isLate,
    timeSpent: studentAssignment.timeSpent ? `${studentAssignment.timeSpent} min` : "",
    course: studentAssignment.assignment.class?.title || "Course", // Add course name
  }));

  const handleViewAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setAssignmentDialogOpen(true);
  };

  const handleUpdateAssignment = (assignmentId: string, updatedData: any) => {
    // This would trigger a refetch or optimistic update
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
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading assignments...
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              Failed to load assignments
            </div>
          ) : convertedAssignments.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No upcoming assignments
            </div>
          ) : (
            convertedAssignments.map((assignment) => (
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
