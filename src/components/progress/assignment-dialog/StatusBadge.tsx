
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Eye, FileText, Calendar, AlarmClock } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
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
          <Eye className="h-3 w-3 mr-1" /> Under Review
        </Badge>
      );
    case "in_progress":
      return (
        <Badge variant="info" className="flex items-center w-fit">
          <FileText className="h-3 w-3 mr-1" /> In Progress
        </Badge>
      );
    case "late":
      return (
        <Badge variant="destructive" className="flex items-center w-fit">
          <FileText className="h-3 w-3 mr-1" /> Late
        </Badge>
      );
    case "upcoming":
      return (
        <Badge variant="outline" className="flex items-center w-fit">
          <Calendar className="h-3 w-3 mr-1" /> Upcoming
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
