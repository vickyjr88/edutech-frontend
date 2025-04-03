import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormFileUpload 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Calendar as CalendarIcon, 
  Users, 
  BookOpen, 
  ScrollText, 
  PlusCircle, 
  Trash2, 
  UserPlus, 
  BookText, 
  School, 
  FileText, 
  Link, 
  FileUp,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  TEACHING_STRATEGIES 
} from "@/components/teacher/professional-profile/utils/strategyUtils";
import { 
  TEACHING_METHODOLOGIES 
} from "@/components/teacher/professional-profile/utils/methodologyUtils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const classSchema = z.object({
  type: z.enum(["academic", "afterschool"]),
  title: z.string().min(3, { message: "Class title must be at least 3 characters" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  curriculum: z.string().optional(),
  gradeLevel: z.string().min(1, { message: "Grade level is required" }),
  summary: z.string().min(10, { message: "Class summary must be at least 10 characters" }).max(200, { message: "Class summary must be at most 200 characters" }),
  description: z.string().min(10, { message: "Detailed description must be at least 10 characters" }),
  objectives: z.string().optional(),
  assessmentMethods: z.string().optional(),
  technicalRequirements: z.string().optional(),
  materialsRequired: z.string().optional(),
  commitmentRequired: z.string().optional(),
  methodology: z.string().optional(),
  strategy: z.string().optional(),
  isPublic: z.boolean().default(true),
  hasCohorts: z.boolean().default(false),
  hasTeamTeaching: z.boolean().default(false),
  lessonPlans: z.array(z.object({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    duration: z.string().optional(),
    resourceUrl: z.string().optional(),
    resourceFiles: z.array(z.any()).optional(),
  })).default([]),
});

type ClassFormValues = z.infer<typeof classSchema>;

type CreateClassFormProps = {
  onSubmit: (data: ClassFormValues) => void;
  onCancel: () => void;
};

// Extended cohort type with new fields
type CohortData = {
  id: string;
  name: string; 
  schedule: string;
  scheduleDays: Date[];
  scheduleTime: string;
  price: string;
  siblingDiscount: string;
  friendDiscount: string;
  numberOfLessons: string;
  isActive: boolean;
  students: { id: string; name: string; email: string }[];
};

const CreateClassForm = ({ onSubmit, onCancel }: CreateClassFormProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [cohorts, setCohorts] = useState<CohortData[]>([]);
  const [teamMembers, setTeamMembers] = useState<{ id: string; email: string; role: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lessonFileUploads, setLessonFileUploads] = useState<Record<string, File[]>>({});

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      type: "academic",
      title: "",
      subject: "",
      curriculum: "",
      gradeLevel: "",
      summary: "",
      description: "",
      objectives: "",
      assessmentMethods: "",
      technicalRequirements: "",
      materialsRequired: "",
      commitmentRequired: "",
      isPublic: true,
      hasCohorts: false,
      hasTeamTeaching: false,
      lessonPlans: [],
    },
  });

  const classType = form.watch("type");
  const hasCohorts = form.watch("hasCohorts");
  const hasTeamTeaching = form.watch("hasTeamTeaching");

  const handleLessonFileChange = (lessonId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setLessonFileUploads(prev => ({ ...prev, [lessonId]: files }));
  };

  const removeLessonFile = (lessonId: string, fileIndex: number) => {
    setLessonFileUploads(prev => {
      const updatedFiles = [...(prev[lessonId] || [])];
      updatedFiles.splice(fileIndex, 1);
      return { ...prev, [lessonId]: updatedFiles };
    });
  };

  const appendLessonPlan = () => {
    form.setValue("lessonPlans", [...form.getValues().lessonPlans, { id: Date.now().toString() }]);
  };

  const removeLessonPlan = (id: string) => {
    form.setValue("lessonPlans", form.getValues().lessonPlans.filter(lesson => lesson.id !== id));
  };

  const updateLessonPlan = (id: string, field: string, value: string) => {
    form.setValue("lessonPlans", form.getValues().lessonPlans.map(lesson => {
      if (lesson.id === id) {
        return { ...lesson, [field]: value };
      }
      return lesson;
    }));
  };

  const handleSubmitForm = (values: ClassFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(values);
      toast({
        title: "Class created successfully",
        description: "Your new class has been created and is ready for students.",
      });
    }, 1000);
  };

  const addCohort = () => {
    const newId = Date.now().toString();
    setCohorts([...cohorts, { 
      id: newId, 
      name: `Cohort ${cohorts.length + 1}`, 
      schedule: "",
      scheduleDays: [],
      scheduleTime: "",
      price: "",
      siblingDiscount: "0",
      friendDiscount: "0",
      numberOfLessons: "8",
      isActive: true,
      students: []
    }]);
  };

  const removeCohort = (id: string) => {
    setCohorts(cohorts.filter(cohort => cohort.id !== id));
  };

  const addTeamMember = () => {
    const newId = Date.now().toString();
    setTeamMembers([...teamMembers, { id: newId, email: "", role: "co-teacher" }]);
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  const updateTeamMember = (id: string, field: "email" | "role", value: string) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const updateCohort = (id: string, field: keyof CohortData, value: any) => {
    setCohorts(cohorts.map(cohort => 
      cohort.id === id ? { ...cohort, [field]: value } : cohort
    ));
  };

  const addStudentToCohort = (cohortId: string) => {
    const cohort = cohorts.find(c => c.id === cohortId);
    if (!cohort) return;

    const newStudent = {
      id: Date.now().toString(),
      name: "",
      email: ""
    };

    const updatedCohort = {
      ...cohort,
      students: [...cohort.students, newStudent]
    };

    setCohorts(cohorts.map(c => c.id === cohortId ? updatedCohort : c));
  };

  const removeStudentFromCohort = (cohortId: string, studentId: string) => {
    const cohort = cohorts.find(c => c.id === cohortId);
    if (!cohort) return;

    const updatedCohort = {
      ...cohort,
      students: cohort.students.filter(s => s.id !== studentId)
    };

    setCohorts(cohorts.map(c => c.id === cohortId ? updatedCohort : c));
  };

  const updateStudent = (cohortId: string, studentId: string, field: "name" | "email", value: string) => {
    const cohort = cohorts.find(c => c.id === cohortId);
    if (!cohort) return;

    const updatedStudents = cohort.students.map(student => 
      student.id === studentId ? { ...student, [field]: value } : student
    );

    const updatedCohort = {
      ...cohort,
      students: updatedStudents
    };

    setCohorts(cohorts.map(c => c.id === cohortId ? updatedCohort : c));
  };

  return (
    <div className="w-full max-w-4xl mx-auto border rounded-lg shadow-sm bg-card text-card-foreground">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Create a New Class</h3>
        <p className="text-sm text-muted-foreground">
          Set up your class details, schedule, and teaching team
        </p>
      </div>
      <div className="p-6 pt-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Basic Information
            </TabsTrigger>
            <TabsTrigger value="lessons" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Lesson Plans
            </TabsTrigger>
            <TabsTrigger value="cohorts" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Cohorts & Students
            </TabsTrigger>
            <TabsTrigger value="teaching" className="flex items-center gap-2">
              <ScrollText className="h-4 w-4" />
              Teaching Team
            </TabsTrigger>
          </TabsList>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitForm)}>
              
              
              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select class type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="academic">Academic</SelectItem>
                            <SelectItem value="afterschool">After School</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the type of class you are creating.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <Input placeholder="Enter subject" {...field} />
                        <FormDescription>
                          Enter the subject of the class.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class Title</FormLabel>
                      <Input placeholder="Enter class title" {...field} />
                      <FormDescription>
                        Enter a descriptive title for the class.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {classType === "academic" && (
                  <FormField
                    control={form.control}
                    name="gradeLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1st Grade</SelectItem>
                            <SelectItem value="2">2nd Grade</SelectItem>
                            <SelectItem value="3">3rd Grade</SelectItem>
                            <SelectItem value="4">4th Grade</SelectItem>
                            <SelectItem value="5">5th Grade</SelectItem>
                            <SelectItem value="6">6th Grade</SelectItem>
                            <SelectItem value="7">7th Grade</SelectItem>
                            <SelectItem value="8">8th Grade</SelectItem>
                            <SelectItem value="9">9th Grade</SelectItem>
                            <SelectItem value="10">10th Grade</SelectItem>
                            <SelectItem value="11">11th Grade</SelectItem>
                            <SelectItem value="12">12th Grade</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the grade level for this class.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class Summary</FormLabel>
                      <Textarea
                        placeholder="Write a brief summary of the class"
                        className="resize-none"
                        {...field}
                      />
                      <FormDescription>
                        Write a brief summary of the class.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detailed Description</FormLabel>
                      <Textarea
                        placeholder="Write a detailed description of the class"
                        className="resize-none"
                        {...field}
                      />
                      <FormDescription>
                        Write a detailed description of the class.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Public Class</FormLabel>
                          <FormDescription>
                            Make this class visible to all students.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hasCohorts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Multiple Cohorts</FormLabel>
                          <FormDescription>
                            Enable multiple cohorts for this class.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hasTeamTeaching"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Team Teaching</FormLabel>
                          <FormDescription>
                            Enable team teaching for this class.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-between pt-4">
                  <div></div>
                  <Button type="button" variant="outline" onClick={() => setActiveTab("lessons")}>
                    Next: Lesson Plans
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="lessons" className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h3 className="text-sm font-medium text-blue-800">Lesson Plans</h3>
                  <p className="text-xs text-blue-700 mt-1">
                    Add lesson plans to organize your teaching curriculum and share with students.
                  </p>
                </div>

                {form.watch("lessonPlans").length === 0 ? (
                  <div className="text-center py-8 border border-dashed rounded-md">
                    <BookOpen className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No lesson plans yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new lesson plan</p>
                    <Button
                      type="button" 
                      onClick={appendLessonPlan}
                      className="mt-4"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add First Lesson
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {form.watch("lessonPlans").map((lesson, index) => (
                      <div key={lesson.id} className="border rounded-md p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-medium">Lesson {index + 1}</h3>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeLessonPlan(lesson.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`lesson-title-${lesson.id}`}>Title</Label>
                            <Input 
                              id={`lesson-title-${lesson.id}`}
                              placeholder="Enter lesson title"
                              value={lesson.title || ""}
                              onChange={(e) => updateLessonPlan(lesson.id, "title", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`lesson-duration-${lesson.id}`}>Duration</Label>
                            <Input 
                              id={`lesson-duration-${lesson.id}`}
                              placeholder="Enter lesson duration"
                              value={lesson.duration || ""}
                              onChange={(e) => updateLessonPlan(lesson.id, "duration", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`lesson-description-${lesson.id}`}>Description</Label>
                          <Textarea 
                            id={`lesson-description-${lesson.id}`}
                            placeholder="Enter lesson description"
                            className="resize-none"
                            value={lesson.description || ""}
                            onChange={(e) => updateLessonPlan(lesson.id, "description", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`lesson-resource-${lesson.id}`}>Resource URL</Label>
                          <div className="flex items-center space-x-2">
                            <Link className="h-4 w-4 text-muted-foreground" />
                            <Input 
                              id={`lesson-resource-${lesson.id}`}
                              placeholder="Enter resource URL"
                              type="url"
                              value={lesson.resourceUrl || ""}
                              onChange={(e) => updateLessonPlan(lesson.id, "resourceUrl", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`lesson-files-${lesson.id}`}>Resource Files</Label>
                          <div className="flex items-center space-x-2">
                            <FileUp className="h-4 w-4 text-muted-foreground" />
                            <input
                              type="file"
                              id={`lesson-files-${lesson.id}`}
                              multiple
                              onChange={(e) => handleLessonFileChange(lesson.id, e)}
                              className="hidden"
                            />
                            <Label htmlFor={`lesson-files-${lesson.id}`} className="cursor-pointer bg-secondary text-secondary-foreground rounded-md px-4 py-2 text-sm font-medium hover:bg-secondary/80">
                              Upload Files
                            </Label>
                          </div>
                          {lessonFileUploads[lesson.id] && lessonFileUploads[lesson.id].length > 0 && (
                            <div className="mt-2 space-y-1">
                              {lessonFileUploads[lesson.id].map((file, fileIndex) => (
                                <div key={fileIndex} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                                  <p className="text-sm text-gray-800">{file.name}</p>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => removeLessonFile(lesson.id, fileIndex)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button" 
                      variant="outline" 
                      onClick={appendLessonPlan}
                      className="mt-2"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Another Lesson
                    </Button>
                  </div>
                )}
                
                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>
                    Back: Basic Information
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setActiveTab("cohorts")}>
                    Next: Cohorts & Students
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="cohorts" className="space-y-6">
                {form.watch("hasCohorts") ? (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                      <h3 className="text-sm font-medium text-blue-800">Multiple Cohorts Enabled</h3>
                      <p className="text-xs text-blue-700 mt-1">
                        Create multiple cohorts for this class. Each cohort can have its own schedule, pricing, and student list.
                      </p>
                    </div>

                    {cohorts.length === 0 ? (
                      <div className="text-center py-8 border border-dashed rounded-md">
                        <Users className="h-12 w-12 mx-auto text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No cohorts defined</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new cohort</p>
                        <Button
                          type="button" 
                          onClick={addCohort}
                          className="mt-4"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add First Cohort
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cohorts.map((cohort, index) => (
                          <div key={cohort.id} className="border rounded-md p-4 space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-sm font-medium">Cohort {index + 1}</h3>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeCohort(cohort.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            {/* Basic cohort information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`cohort-name-${cohort.id}`}>Cohort Name</Label>
                                <Input 
                                  id={`cohort-name-${cohort.id}`}
                                  value={cohort.name}
                                  onChange={(e) => updateCohort(cohort.id, "name", e.target.value)}
                                  placeholder="Enter cohort name"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label htmlFor={`cohort-active-${cohort.id}`}>Status</Label>
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id={`cohort-active-${cohort.id}`}
                                      checked={cohort.isActive}
                                      onCheckedChange={(checked) => updateCohort(cohort.id, "isActive", checked)}
                                    />
                                    <span className={`text-sm ${cohort.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                                      {cohort.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Inactive cohorts won't accept new enrollments
                                </p>
                              </div>
                            </div>
                            
                            {/* Schedule information */}
                            <div className="space-y-4 pt-4 border-t">
                              <h4 className="text-sm font-medium">Schedule & Timing</h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Date picker for the schedule */}
                                <div className="space-y-2">
                                  <Label>Class Days</Label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className={cn(
                                          "w-full justify-start text-left",
                                          !cohort.scheduleDays.length && "text-muted-foreground"
                                        )}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {cohort.scheduleDays.length > 0 ? (
                                          cohort.scheduleDays.length > 3 
                                            ? `${cohort.scheduleDays.length} days selected` 
                                            : cohort.scheduleDays.map(date => format(date, "EEEE")).join(", ")
                                        ) : (
                                          <span>Select days of the week</span>
                                        )}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="multiple"
                                        selected={cohort.scheduleDays}
                                        onSelect={(days) => updateCohort(cohort.id, "scheduleDays", days || [])}
                                        className="p-3 pointer-events-auto"
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <p className="text-xs text-muted-foreground">
                                    Select the days when this cohort will meet
                                  </p>
                                </div>
                                
                                {/* Time of day */}
                                <div className="space-y-2">
                                  <Label htmlFor={`cohort-time-${cohort.id}`}>Class Time</Label>
                                  <div className="flex items-center gap-2">
                                    <Select
                                      value={cohort.scheduleTime}
                                      onValueChange={(value) => updateCohort(cohort.id, "scheduleTime", value)}
                                    >
                                      <SelectTrigger id={`cohort-time-${cohort.id}`} className="w-full">
                                        <SelectValue placeholder="Select time" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                                        <SelectItem value="afternoon">Afternoon (12PM - 4PM)</SelectItem>
                                        <SelectItem value="evening">Evening (4PM - 8PM)</SelectItem>
                                        <SelectItem value="custom">Custom Time</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    {cohort.scheduleTime === "custom" && (
                                      <div className="flex items-center space-x-2 ml-4">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <Input
                                          type="time"
                                          className="w-32"
                                          value={cohort.schedule}
                                          onChange={(e) => updateCohort(cohort.id, "schedule", e.target.value)}
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Set the time when this cohort will meet
                                  </p>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`cohort-lessons-${cohort.id}`}>Number of Lessons</Label>
                                <Input
                                  id={`cohort-lessons-${cohort.id}`}
                                  type="number"
                                  min="1"
                                  max="52"
                                  value={cohort.numberOfLessons}
                                  onChange={(e) => updateCohort(cohort.id, "numberOfLessons", e.target.value)}
                                  placeholder="E.g., 8, 10, 12"
                                />
                                <p className="text-xs text-muted-foreground">
                                  Total number of lessons in this cohort
                                </p>
                              </div>
                            </div>
                            
                            {/* Pricing information */}
                            <div className="space-y-4 pt-4 border-t">
                              <h4 className="text-sm font-medium">Pricing</h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`cohort-price-${cohort.id}`}>Price</Label>
                                  <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                    <Input
                                      id={`cohort-price-${cohort.id}`}
                                      className="pl-7"
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={cohort.price}
                                      onChange={(e) => updateCohort(cohort.id, "price", e.target.value)}
                                      placeholder="0.00"
                                    />
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Total price for the entire cohort
                                  </p>
                                </div>
                                
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`cohort-sibling-discount-${cohort.id}`}>Sibling Discount (%)</Label>
                                    <Input
                                      id={`cohort-sibling-discount-${cohort.id}`}
