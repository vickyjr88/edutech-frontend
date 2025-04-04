
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LessonFormProps {
  lesson: {
    id: string;
    title?: string;
    description?: string;
    duration?: string;
  };
  onUpdate: (field: string, value: string) => void;
  onRemove: () => void;
  isRemovable: boolean;
  lessonNumber: number;
}

const durationOptions = [
  { value: "15m", label: "15 minutes" },
  { value: "30m", label: "30 minutes" },
  { value: "45m", label: "45 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "1h15m", label: "1 hour 15 minutes" },
  { value: "1h30m", label: "1 hour 30 minutes" },
  { value: "1h45m", label: "1 hour 45 minutes" },
  { value: "2h", label: "2 hours" },
  { value: "2h15m", label: "2 hours 15 minutes" },
  { value: "2h30m", label: "2 hours 30 minutes" },
  { value: "2h45m", label: "2 hours 45 minutes" },
  { value: "3h", label: "3 hours" },
  { value: "custom", label: "Custom duration" },
];

export const LessonForm = ({
  lesson,
  onUpdate,
  onRemove,
  isRemovable,
  lessonNumber
}: LessonFormProps) => {
  const [customDuration, setCustomDuration] = useState<string>(
    lesson.duration && !durationOptions.some(option => option.value === lesson.duration) 
      ? lesson.duration 
      : ""
  );

  const handleDurationChange = (value: string) => {
    if (value === "custom") {
      // If custom is selected, don't update the lesson plan yet
      setCustomDuration(customDuration || "");
    } else {
      // For predefined options, update the lesson plan directly
      onUpdate("duration", value);
    }
  };

  const handleCustomDurationChange = (value: string) => {
    setCustomDuration(value);
    onUpdate("duration", value);
  };

  return (
    <div className="border rounded-md p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Lesson {lessonNumber}</h3>
        {isRemovable && (
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={onRemove}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`lesson-title-${lesson.id}`}>Title</Label>
          <Input 
            id={`lesson-title-${lesson.id}`}
            placeholder="Enter a descriptive lesson title"
            value={lesson.title || ""}
            onChange={(e) => onUpdate("title", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`lesson-duration-${lesson.id}`}>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-gray-500" />
              Duration
            </div>
          </Label>
          <div className="flex gap-2">
            <Select 
              value={lesson.duration && durationOptions.some(option => option.value === lesson.duration) 
                ? lesson.duration 
                : "custom"}
              onValueChange={handleDurationChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {durationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {(lesson.duration === "custom" || 
              (lesson.duration && !durationOptions.some(option => option.value === lesson.duration))) && (
              <Input
                placeholder="e.g. 1 hour 15 min"
                value={customDuration}
                onChange={(e) => handleCustomDurationChange(e.target.value)}
                className="flex-1"
              />
            )}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`lesson-description-${lesson.id}`}>Description</Label>
        <p className="text-xs text-gray-500 mb-1">Describe the lesson content, learning objectives, and planned activities</p>
        <Textarea 
          id={`lesson-description-${lesson.id}`}
          placeholder="Describe what students will learn and do in this lesson"
          className="resize-none"
          value={lesson.description || ""}
          onChange={(e) => onUpdate("description", e.target.value)}
        />
      </div>
    </div>
  );
};
