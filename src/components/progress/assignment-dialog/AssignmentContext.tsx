
import React from "react";
import { Assignment } from "./types";

interface AssignmentContextProps {
  assignment: Assignment;
}

export const AssignmentContext = ({ assignment }: AssignmentContextProps) => {
  return (
    <div className="bg-blue-50 p-3 rounded-md">
      <div className="flex flex-col sm:flex-row sm:justify-between text-sm">
        <div>
          <span className="font-medium">Class:</span>{" "}
          <span>{assignment.course || "Math Fundamentals"}</span>
        </div>
        <div>
          <span className="font-medium">Lesson:</span>{" "}
          <span>{assignment.lesson || "Week 3: Algebraic Expressions"}</span>
        </div>
      </div>
    </div>
  );
};
