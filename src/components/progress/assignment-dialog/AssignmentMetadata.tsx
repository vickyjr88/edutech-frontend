
import React from "react";
import { Assignment } from "./types";

interface AssignmentMetadataProps {
  assignment: Assignment;
}

export const AssignmentMetadata = ({ assignment }: AssignmentMetadataProps) => {
  return (
    <div className="flex justify-between">
      <div>
        <span className="text-xs text-gray-500">Due Date:</span>
        <p className="text-sm font-medium">{assignment.dueDate}</p>
      </div>
      
      {assignment.grade && (
        <div>
          <span className="text-xs text-gray-500">Grade:</span>
          <p className="text-sm font-medium">{assignment.grade} ({assignment.score})</p>
        </div>
      )}
    </div>
  );
};
