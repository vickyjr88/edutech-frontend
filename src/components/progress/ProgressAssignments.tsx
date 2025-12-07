
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import AssignmentDialog from "./AssignmentDialog";
import { AssignmentStatistics } from "./components/AssignmentStatistics";
import { AssignmentsTable } from "./components/AssignmentsTable";
import { Assignment } from "./data/mockAssignmentsData";
import { useGetStudentCurrentEnrollments } from "@/hooks/use-enrollment-service";
import { useGetStudentAssignmentsByClass } from "@/hooks/use-assignment-service";
import { AssignmentType } from "@/integrations/api/services/assignment.service";
import { useAuth } from "@/contexts/AuthContext";

interface ProgressAssignmentsProps {
  courseId?: string;
}

const ProgressAssignments = ({ courseId }: ProgressAssignmentsProps) => {
  const { user } = useAuth();
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const { toast } = useToast();

  // courseId is actually an enrollment ID
  const { data: enrollmentsData, isLoading: enrollmentLoading, error: enrollmentError } = useGetStudentCurrentEnrollments(user.studentId || "");
  
  // Find the specific enrollment by enrollmentId
  const currentEnrollment = enrollmentsData?.data?.find((enrollment: any) => enrollment.enrollmentId === courseId);
  const classId = currentEnrollment?.course?.id;

  // Fetch student assignments for the class, excluding quizzes
  const { data: assignmentsData, isLoading: assignmentsLoading, error: assignmentsError } = useGetStudentAssignmentsByClass(
    classId || "", 
    { 
      // Filter out quiz assignments - those will be shown in Quizzes tab
      sortBy: 'dueDate',
      sortOrder: 'asc'
    }
  );

  const handleViewAssignment = (assignment: Assignment) => {
    // Find the original StudentAssignment data
    const studentAssignment = assignments.find(sa => sa._id === assignment.id);
    
    // Create enriched assignment data with all needed fields
    const enrichedAssignment: Assignment = {
      ...assignment,
      // Add real API data fields
      description: studentAssignment?.assignment?.description || studentAssignment?.assignment?.detailedInstructions || assignment.description,
      submissionContent: studentAssignment?.content || "",
      submittedAt: studentAssignment?.submittedAt,
      attachments: studentAssignment?.attachments || [],
      assignmentId: studentAssignment?.assignment?._id,
      studentAssignmentId: studentAssignment?._id,
      totalPoints: studentAssignment?.assignment?.totalPoints,
      passingGrade: studentAssignment?.assignment?.passingGrade,
      submissionStatus: studentAssignment?.submissionStatus,
      timeSpent: studentAssignment?.timeSpent,
      attempts: studentAssignment?.attempts || 0,
      isLate: studentAssignment?.isLate || false,
      feedback: studentAssignment?.feedback,
      dueDate: studentAssignment?.assignment?.dueDate ? new Date(studentAssignment.assignment.dueDate).toLocaleDateString() : assignment.dueDate,
      type: studentAssignment?.assignment?.type?.toLowerCase().includes('group') ? 'group' : 'individual',
      grade: studentAssignment?.grade ? `${studentAssignment.grade}/${studentAssignment.assignment?.totalPoints}` : assignment.grade,
    };
    
    setSelectedAssignment(enrichedAssignment);
    setAssignmentDialogOpen(true);
  };

  const handleUpdateAssignment = (assignmentId: string, updatedData: any) => {
    // This would trigger a refetch or optimistic update
    toast({
      title: "Assignment Updated",
      description: "Your assignment has been submitted successfully!",
    });
  };

  if (!courseId) {
    return <div className="text-center py-8">No course selected</div>;
  }

  if (enrollmentLoading || assignmentsLoading) {
    return <div className="text-center py-8">Loading assignments data...</div>;
  }

  if (enrollmentError || !currentEnrollment) {
    return <div className="text-center py-8">Course enrollment not found</div>;
  }

  if (assignmentsError) {
    return <div className="text-center py-8">Failed to load assignments data</div>;
  }

  // Filter out quiz-type assignments and convert to mock format for existing components
  const assignments = assignmentsData?.data?.data.filter(sa => sa.assignment.type !== AssignmentType.QUIZ) || [];
  
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
  }));

  return (
    <div className="space-y-6">
      {/* Assignment Statistics */}
      <AssignmentStatistics assignments={convertedAssignments} />
      
      {/* Assignments Table */}
      <AssignmentsTable 
        assignments={convertedAssignments} 
        onViewAssignment={handleViewAssignment} 
      />

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
