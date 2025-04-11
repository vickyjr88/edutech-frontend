
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  Upload,
  Eye,
  FileCheck,
  AlarmClock,
  FileText,
  Users
} from "lucide-react";
import { Assignment } from "../data/mockAssignmentsData";

export const getStatusBadge = (status: string) => {
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

export const getActionButton = (
  assignment: Assignment, 
  onViewAssignment: (assignment: Assignment) => void
) => {
  switch (assignment.status) {
    case "completed":
      return (
        <Button size="sm" variant="outline" onClick={() => onViewAssignment(assignment)}>
          <Eye className="h-3.5 w-3.5 mr-1" /> View Feedback
        </Button>
      );
    case "pending_review":
      return (
        <Button size="sm" variant="outline" onClick={() => onViewAssignment(assignment)}>
          <Clock className="h-3.5 w-3.5 mr-1" /> View Submission
        </Button>
      );
    case "in_progress":
      return (
        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => onViewAssignment(assignment)}>
          <Upload className="h-3.5 w-3.5 mr-1" /> Submit
        </Button>
      );
    case "upcoming":
      return (
        <Button size="sm" variant="outline" onClick={() => onViewAssignment(assignment)}>
          <FileCheck className="h-3.5 w-3.5 mr-1" /> View Assignment
        </Button>
      );
    case "late":
      return (
        <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => onViewAssignment(assignment)}>
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
