
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileCheck, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import AssignmentDialog from "../progress/AssignmentDialog";
import { getMockAssignmentsData } from "../progress/data/mockAssignmentsData";

export default function UpcomingAssignments() {
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [assignments, setAssignments] = useState<any[]>([]);

  // Fetch assignments data from the same source as the course progress page
  useEffect(() => {
    const allAssignments = getMockAssignmentsData();
    
    // Filter to get only upcoming or in-progress assignments
    const upcomingAssignments = allAssignments
      .filter(assignment => 
        assignment.status === "upcoming" || 
        assignment.status === "in_progress")
      .slice(0, 3); // Limit to 3 assignments for the dashboard
    
    setAssignments(upcomingAssignments);
  }, []);

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
          {assignments.length === 0 ? (
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
