
import React from "react";
import { Assignment } from "./types";

interface TeacherFeedbackProps {
  assignment: Assignment;
}

export const TeacherFeedback = ({ assignment }: TeacherFeedbackProps) => {
  if (assignment.status !== "completed" || !assignment.feedback) {
    return null;
  }

  return (
    <div className="bg-green-50 p-4 rounded-md border border-green-100">
      <h3 className="text-sm font-medium mb-1">Teacher Feedback:</h3>
      <p className="text-sm text-gray-700">{assignment.feedback}</p>
    </div>
  );
};
