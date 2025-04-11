
import React from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { Assignment } from "./types";

interface AssignmentHeaderProps {
  assignment: Assignment;
}

export const AssignmentHeader = ({ assignment }: AssignmentHeaderProps) => {
  return (
    <DialogHeader className="p-6 pb-2 sticky top-0 bg-background z-10">
      <DialogTitle className="text-xl font-bold">{assignment.title}</DialogTitle>
      <div className="flex items-center gap-2 mt-2">
        <StatusBadge status={assignment.status} />
        {assignment.type === "group" && (
          <div className="flex items-center">
            <Users className="h-3.5 w-3.5 mr-1 text-purple-500" />
            <span className="text-sm">Group ({assignment.groupMembers} members)</span>
          </div>
        )}
      </div>
    </DialogHeader>
  );
};
