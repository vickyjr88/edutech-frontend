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
  Calendar, 
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
  Calendar as CalendarIcon,
  Clock,
  UsersRound,
  GraduationCap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  TEACHING_STRATEGIES 
} from "@/components/teacher/professional-profile/utils/strategyUtils";
import { 
  TEACHING_METHODOLOGIES 
} from "@/components/teacher/professional-profile/utils/methodologyUtils";

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

type CohortType = {
  id: string; 
  name: string; 
  schedule: string;
  maxStudents: string;
  startDate: string;
  endDate: string;
  meetingDays: string[];
  meetingTime: string;
  meetingDuration: string;
  teachingAssistant: string;
};

type CreateClassFormProps = {
  onSubmit: (data: ClassFormValues) => void;
  onCancel: () => void;
};

const CreateClassForm = ({ onSubmit, onCancel }: CreateClassFormProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [cohorts, setCohorts] = useState<CohortType[]>([]);
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
  const lessonPlans = form.watch("lessonPlans");

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
      maxStudents: "15",
      startDate: "",
      endDate: "",
      meetingDays: [],
      meetingTime: "",
      meetingDuration: "60",
      teachingAssistant: ""
    }]);
  };

  const removeCohort = (id: string) => {
    setCohorts(cohorts.filter(cohort => cohort.id !== id));
  };

  const updateCohort = (id: string, field: keyof CohortType, value: string | string[]) => {
    setCohorts(cohorts.map(cohort => 
      cohort.id === id ? { ...cohort, [field]: value } : cohort
    ));
  };

  const addTeamMember = () => {
    const newId = Date.now().toString();
    setTeamMembers([...teamMembers, { id: newId, email: "", role: "assistant" }]);
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  const updateTeamMember = (id: string, field: "email" | "role", value: string) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const addLessonPlan = () => {
    const newId = Date.now().toString();
    const updatedLessonPlans = [...lessonPlans, { 
      id: newId, 
      title: form.getValues("title") ? `${form.getValues("title")} - Lesson ${lessonPlans.length + 1}` : `Lesson ${lessonPlans.length + 1}`, 
      description: "", 
      duration: "30", 
      resourceUrl: "",
      resourceFiles: [] 
    }];
    form.setValue("lessonPlans", updatedLessonPlans);
  };

  const removeLessonPlan = (id: string) => {
    const updatedLessonPlans = lessonPlans.filter(plan => plan.id !== id);
    form.setValue("lessonPlans", updatedLessonPlans);
    // Also clean up any stored files
    const updatedFileUploads = {...lessonFileUploads};
    delete updatedFileUploads[id];
    setLessonFileUploads(updatedFileUploads);
  };

  const updateLessonPlan = (id: string, field: "title" | "description" | "duration" | "resourceUrl", value: string) => {
    const updatedLessonPlans = lessonPlans.map(plan => 
      plan.id === id ? { ...plan, [field]: value } : plan
    );
    form.setValue("lessonPlans", updatedLessonPlans);
  };

  const handleLessonFileUpload = (id: string, files: File[]) => {
    // Store the files in state
    setLessonFileUploads(prev => ({
      ...prev,
      [id]: files
    }));
    
    // Update the form value
    const updatedLessonPlans = lessonPlans.map(plan => 
      plan.id === id ? { ...plan, resourceFiles: files } : plan
    );
    form.setValue("lessonPlans", updatedLessonPlans);

    // Show a toast notification
    toast({
      title: "Files uploaded",
      description: `${files.length} file(s) uploaded for lesson plan.`,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Class</CardTitle>
          <CardDescription>
            Set up your class details, schedule, and teaching team
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                  <div className="space-y-6">
                    {/* Class Type and Title in one row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Class Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
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
                              Academic classes follow curriculum, after-school are extracurricular
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Class Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter a catchy title for your class" {...field} />
                            </FormControl>
                            <FormDescription>
                              Give your class a catchy, descriptive title
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Curriculum, Grade Level, and Subject in one row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="curriculum"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Curriculum</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select curriculum" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="national">National Curriculum</SelectItem>
                                <SelectItem value="cambridge">Cambridge</SelectItem>
                                <SelectItem value="ib">International Baccalaureate</SelectItem>
                                <SelectItem value="american">American Curriculum</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gradeLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{classType === "academic" ? "Grade Level" : "Age Range"}</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={classType === "academic" ? "Select grade level" : "Select age range"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {classType === "academic" ? (
                                  <>
                                    <SelectItem value="elementary_1_3">Elementary (Grades 1-3)</SelectItem>
                                    <SelectItem value="elementary_4_6">Elementary (Grades 4-6)</SelectItem>
                                    <SelectItem value="middle_school">Middle School (Grades 7-8)</SelectItem>
                                    <SelectItem value="high_school">High School (Grades 9-12)</SelectItem>
                                  </>
                                ) : (
                                  <>
                                    <SelectItem value="ages_5_7">Ages 5-7</SelectItem>
                                    <SelectItem value="ages_8_10">Ages 8-10</SelectItem>
                                    <SelectItem value="ages_11_13">Ages 11-13</SelectItem>
                                    <SelectItem value="ages_14_18">Ages 14-18</SelectItem>
                                  </>
                                )}\
                                <SelectItem value="all_ages">All Ages</SelectItem>
                              </SelectContent>
                            </Select>
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
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {classType === "academic" ? (
                                  <>
                                    <SelectItem value="mathematics">Mathematics</SelectItem>
                                    <SelectItem value="english">English</SelectItem>
                                    <SelectItem value="science">Science</SelectItem>
                                    <SelectItem value="social_studies">Social Studies</SelectItem>
                                    <SelectItem value="languages">Languages</SelectItem>
                                  </>
                                ) : (
                                  <>
                                    <SelectItem value="art">Art & Crafts</SelectItem>
                                    <SelectItem value="music">Music</SelectItem>
                                    <SelectItem value="sports">Sports & Physical Education</SelectItem>
                                    <SelectItem value="coding">Coding & Technology</SelectItem>
                                    <SelectItem value="drama">Drama & Theatre</SelectItem>
                                  </>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="summary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class Summary</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Write a brief summary of your class (max 200 characters)..." 
                              className="resize-none h-20"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            A short summary that will appear in class listings
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
                          <FormControl>
                            <Textarea 
                              placeholder="Provide a comprehensive description of what your class covers..." 
                              className="min-h-32"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Provide a detailed description of what students will learn
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="objectives"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Learning Objectives</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="List the key learning objectives or skills students will gain..." 
                              className="min-h-24"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            What will students be able to do after completing this class?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="assessmentMethods"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assessment Methods</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe how you will assess student progress..." 
                              className="min-h-24"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            How will you evaluate student progress and learning?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="technicalRequirements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Technical Requirements</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List technical requirements (internet speed, software, etc.)..." 
                                className="min-h-24"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              What technical setup do students need?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="materialsRequired"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Materials Required</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List materials students will need to participate..." 
                                className="min-h-24"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              What supplies should students have ready?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="commitmentRequired"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Commitment Required</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the time commitment needed (days/weeks/months)..." 
                              className="min-h-24"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            How long will this class run? What time commitment is expected?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="methodology"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teaching Methodology</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select methodology" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {TEACHING_METHODOLOGIES.map((methodology) => (
                                  <SelectItem key={methodology} value={methodology}>
                                    {methodology}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Choose your primary teaching methodology
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="strategy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teaching Strategy</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select strategy" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {TEACHING_STRATEGIES.map((strategy) => (
                                  <SelectItem key={strategy} value={strategy}>
                                    {strategy}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Select your preferred teaching strategy
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <FormField
                        control={form.control}
                        name="isPublic"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0">
                            <div className="space-y-1">
                              <FormLabel>Public Class</FormLabel>
                              <FormDescription>
                                Make this class publicly visible to students
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
                          <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0">
                            <div className="space-y-1">
                              <FormLabel>Multiple Cohorts</FormLabel>
                              <FormDescription>
                                Divide this class into multiple student cohorts
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
                          <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0">
                            <div className="space-y-1">
                              <FormLabel>Team Teaching</FormLabel>
                              <FormDescription>
                                Add co-teachers or teaching assistants to this class
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
                      <Button type="button" variant="outline" onClick={() => setActiveTab("lessons")}>
                        Next: Lesson Plans
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="lessons" className="space-y-6">
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                      <h3 className="text-sm font-medium text-blue-800">Lesson Plans</h3>
                      <p className="text-xs text-blue-700 mt-1">
                        Create detailed lesson plans for your class. Each lesson plan should outline what students will learn and what activities they'll engage in.
                      </p>
                    </div>

                    {lessonPlans.length === 0 ? (
                      <div className="text-center py-8 border border-dashed rounded-md">
                        <FileText className="h-12 w-12 mx-auto text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No lesson plans yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating your first lesson plan</p>
                        <Button
                          type="button" 
                          onClick={addLessonPlan}
                          className="mt-4"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add First Lesson Plan
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {lessonPlans.map((plan, index) => (
                          <div key={plan.id} className="border rounded-md p-4 space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-sm font-medium">Lesson {index + 1}</h3>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeLessonPlan(plan.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor={`lesson-title-${plan.id}`}>Lesson Title</Label>
                                <Input 
                                  id={`lesson-title-${plan.id}`}
                                  value={plan.title}
                                  onChange={(e) => updateLessonPlan(plan.id, "title", e.target.value)}
                                  placeholder={`${form.getValues("title") || "Class"} - Lesson ${index + 1}`}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`lesson-description-${plan.id}`}>Lesson Description</Label>
                                <Textarea 
                                  id={`lesson-description-${plan.id}`}
                                  value={plan.description}
                                  onChange={(e) => updateLessonPlan(plan.id, "description", e.target.value)}
                                  placeholder="Describe what students will learn and activities they'll complete"
                                  className="min-h-24"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`lesson-duration-${plan.id}`}>Duration</Label>
                                <Select
                                  value={plan.duration}
                                  onValueChange={(value) => updateLessonPlan(plan.id, "duration", value)}
                                >
                                  <SelectTrigger id={`lesson-duration-${plan.id}`}>
                                    <SelectValue placeholder="Select duration" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="15">15 minutes</SelectItem>
                                    <SelectItem value="30">30 minutes</SelectItem>
                                    <SelectItem value="45">45 minutes</SelectItem>
                                    <SelectItem value="60">60 minutes</SelectItem>
                                    <SelectItem value="75">75 minutes</SelectItem>
                                    <SelectItem value="90">90 minutes</SelectItem>
                                    <SelectItem value="120">2 hours</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              {/* Resource URL and File Upload */}
                              <div className="space-y-2 pt-2 border-t">
                                <h4 className="text-sm font-medium">Lesson Resources</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`lesson-resource-url-${plan.id}`} className="flex items-center gap-1">
                                      <Link className="h-4 w-4" />
                                      Resource URL
                                    </Label>
                                    <Input 
                                      id={`lesson-resource-url-${plan.id}`}
                                      value={plan.resourceUrl || ""}
                                      onChange={(e) => updateLessonPlan(plan.id, "resourceUrl", e.target.value)}
                                      placeholder="https://example.com/resource"
                                      type="url"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                      Link to online resources like videos or websites
                                    </p>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <FormFileUpload
                                      label="Upload Files"
                                      description="Upload worksheets, slides, or other materials"
                                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png"
                                      multiple={true}
                                      onFilesSelected={(files) => handleLessonFileUpload(plan.id, files)}
                                      icon={<FileUp className="h-8 w-8 text-gray-400" />}
                                      className="h-full"
                                    />
                                  </div>
                                </div>
                                
                                {/* Show selected files */}
                                {lessonFileUploads[plan.id] && lessonFileUploads[plan.id].length > 0 && (
                                  <div className="mt-2 p-2 bg-muted rounded-md">
                                    <p className="text-xs font-medium mb-1">Selected files:</p>
                                    <div className="space-y-1">
                                      {lessonFileUploads[plan.id].map((file, fileIndex) => (
                                        <div key={fileIndex} className="flex items-center text-xs">
                                          <FileText className="h-3 w-3 mr-1 text-primary" />
                                          {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button" 
                          variant="outline" 
                          onClick={addLessonPlan}
                          className="mt-2"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Another Lesson Plan
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
                  </div>
                </TabsContent>

                <TabsContent value="cohorts" className="space-y-6">
                  {hasCohorts ? (
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <h3 className="text-sm font-medium text-blue-800">Multiple Cohorts Enabled</h3>
                        <p className="text-xs text-blue-700 mt-1">
                          Create multiple cohorts for this class. Each cohort can have its own schedule, capacity, and student list.
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
                              
                              {/* Cohort Name */}
