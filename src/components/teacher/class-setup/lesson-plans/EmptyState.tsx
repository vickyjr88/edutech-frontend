
import React from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, PlusCircle } from "lucide-react";

export interface EmptyStateProps {
  onAddLesson: () => void;
}

export const EmptyState = ({ onAddLesson }: EmptyStateProps) => {
  return (
    <div className="text-center py-8 border border-dashed rounded-md">
      <BookOpen className="h-12 w-12 mx-auto text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No lesson plans yet</h3>
      <p className="mt-1 text-sm text-gray-500">Get started by creating a new lesson plan</p>
      <Button
        type="button" 
        onClick={onAddLesson}
        className="mt-4"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add First Lesson
      </Button>
    </div>
  );
};
