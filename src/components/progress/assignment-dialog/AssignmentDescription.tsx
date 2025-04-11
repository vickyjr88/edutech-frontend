
import React from "react";
import { Assignment } from "./types";

interface AssignmentDescriptionProps {
  assignment: Assignment;
}

export const AssignmentDescription = ({ assignment }: AssignmentDescriptionProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h3 className="text-sm font-medium mb-1">Assignment Description:</h3>
      <p className="text-sm text-gray-700">
        {assignment.description || "Complete the assigned problem set and show your work. Make sure to include all necessary steps and explanations."}
      </p>
    </div>
  );
};
