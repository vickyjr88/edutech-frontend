
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { classService } from "@/integrations/api/services/class.service";
import { enrollmentService } from "@/integrations/api/services/enrollment.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGroupCreate?: (groupData: any) => void;
}

const subjects = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Art",
  "Music",
  "Computer Science",
  "Physical Education",
  "Geography",
  "Foreign Language"
];

const CreateGroupDialog = ({ open, onOpenChange, onGroupCreate }: CreateGroupDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    description: "",
    meetingTime: "",
    courseId: "",
    groupType: "project", // Default to project
    lessons: [] as string[],
    startDate: null as Date | null,
    endDate: null as Date | null,
  });

  const [courses, setCourses] = useState<Array<{ id: string; name: string; subject: string }>>([]);
  const [availableLessons, setAvailableLessons] = useState<{ id: string, name: string }[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);

  // Fetch enrolled courses when dialog opens
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!open || !user?.id) return;

      setIsLoadingCourses(true);
      try {
        const response = await enrollmentService.getStudentCurrentEnrollments(user.id);
        if (response.data) {
          const mappedCourses = response.data.map((enrollment: any) => ({
            id: enrollment.course?.id || enrollment.enrollmentId,
            name: enrollment.course?.title || "Untitled Course",
            subject: enrollment.course?.subject || "General"
          }));
          setCourses(mappedCourses);
        }
      } catch (error) {
        console.error("Failed to fetch enrolled courses:", error);
        toast({
          title: "Error",
          description: "Failed to load your courses. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchEnrolledCourses();
  }, [open, user?.id, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }));
  };

  const handleCourseChange = async (courseId: string) => {
    setFormData((prev) => ({
      ...prev,
      courseId: courseId,
      lessons: [] // Reset lessons when course changes
    }));

    // Fetch lessons for the selected course
    setIsLoadingLessons(true);
    try {
      const response = await classService.getLessonPlans(courseId);
      if (response.data) {
        const mappedLessons = response.data.map((lesson: any, index: number) => ({
          id: lesson._id || lesson.id || `lesson-${index}`,
          name: lesson.title || `Lesson ${index + 1}`
        }));
        setAvailableLessons(mappedLessons);
      }
    } catch (error) {
      console.error("Failed to fetch lessons:", error);
      setAvailableLessons([]);
      toast({
        title: "Info",
        description: "No lessons found for this course.",
        variant: "default"
      });
    } finally {
      setIsLoadingLessons(false);
    }
  };

  const handleLessonChange = (lessonId: string) => {
    // Toggle lesson selection
    setFormData((prev) => {
      const isSelected = prev.lessons.includes(lessonId);
      if (isSelected) {
        return {
          ...prev,
          lessons: prev.lessons.filter(id => id !== lessonId)
        };
      } else {
        return {
          ...prev,
          lessons: [...prev.lessons, lessonId]
        };
      }
    });
  };

  const handleGroupTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, groupType: value }));
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, startDate: date }));
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, endDate: date }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get lesson names for selected lesson IDs
    const selectedLessonNames = formData.lessons.map(lessonId => {
      const lesson = availableLessons.find(l => l.id === lessonId);
      return lesson ? lesson.name : '';
    }).filter(Boolean);

    // Here you would typically handle the API call to create a group
    if (onGroupCreate) {
      onGroupCreate({
        ...formData,
        id: Math.floor(Math.random() * 1000), // Temporary ID generation
        progress: 0,
        members: [{ id: 1, name: "John D", image: "" }], // Current user
        lessonNames: selectedLessonNames,
      });
    }

    // Close the dialog
    onOpenChange(false);

    // Reset form
    setFormData({
      name: "",
      subject: "",
      description: "",
      meetingTime: "",
      courseId: "",
      groupType: "project",
      lessons: [],
      startDate: null,
      endDate: null,
    });
    setAvailableLessons([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Create a new collaborative group for your project or study session.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter group name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  value={formData.subject}
                  onValueChange={handleSubjectChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the purpose of your group"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Group Type</Label>
              <RadioGroup
                value={formData.groupType}
                onValueChange={handleGroupTypeChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="project" id="project" />
                  <Label htmlFor="project">Project</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="assignment" id="assignment" />
                  <Label htmlFor="assignment">Assignment</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="study" id="study" />
                  <Label htmlFor="study">Study Group</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Course</Label>
                <Select
                  value={formData.courseId}
                  onValueChange={handleCourseChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetingTime">Meeting Time</Label>
                <Input
                  id="meetingTime"
                  name="meetingTime"
                  value={formData.meetingTime}
                  onChange={handleChange}
                  placeholder="e.g., Tuesday, 4:00 PM"
                  required
                />
              </div>
            </div>

            {formData.courseId && availableLessons.length > 0 && (
              <div className="space-y-2">
                <Label>Lessons (Select all that apply)</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border rounded-md p-3">
                  {availableLessons.map(lesson => (
                    <div key={lesson.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`lesson-${lesson.id}`}
                        checked={formData.lessons.includes(lesson.id)}
                        onChange={() => handleLessonChange(lesson.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label htmlFor={`lesson-${lesson.id}`} className="text-sm">
                        {lesson.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate || undefined}
                      onSelect={handleStartDateSelect}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate || undefined}
                      onSelect={handleEndDateSelect}
                      disabled={(date) => formData.startDate ? date < formData.startDate : false}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-kidato-purple hover:bg-kidato-dark-blue"
            >
              Create Group
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
