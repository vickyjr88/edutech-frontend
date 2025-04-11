
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import AssignmentDialog from "./AssignmentDialog";
import { AssignmentStatistics } from "./components/AssignmentStatistics";
import { AssignmentsTable } from "./components/AssignmentsTable";
import { getMockAssignmentsData, Assignment } from "./data/mockAssignmentsData";

interface ProgressAssignmentsProps {
  courseId?: string;
}

const ProgressAssignments = ({ courseId }: ProgressAssignmentsProps) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
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

  const handleViewAssignment = (assignment: Assignment) => {
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

  return (
    <div className="space-y-6">
      {/* Assignment Statistics */}
      <AssignmentStatistics assignments={assignments} />
      
      {/* Assignments Table */}
      <AssignmentsTable 
        assignments={assignments} 
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
