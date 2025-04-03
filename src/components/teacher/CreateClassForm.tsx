import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { PlusCircle, Trash2, Users, Calendar, Clock, Mail, Phone, Book, MapPin, CalendarRange, UserCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

type CohortType = {
  id: string; 
  name: string; 
  maxStudents: number;
  startDate: string;
  endDate: string;
  enrollmentStatus: "open" | "closed" | "waitlist";
  teachingMode: "online" | "in-person" | "hybrid";
  meetingDays: string[];
  meetingTime: string;
  meetingDuration: number;
  meetingFrequency: "weekly" | "biweekly" | "monthly" | "custom";
  prerequisites: string;
  learningObjectives: string;
  specialNotes: string;
  location?: string;
  students: StudentType[];
};

type StudentType = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  guardian?: {
    name: string;
    email: string;
    phone?: string;
    relationship: string;
  };
  status: "enrolled" | "waitlisted" | "pending" | "dropped";
  notes?: string;
  enrollmentDate: string;
};

interface CreateClassFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const CreateClassForm = ({ onSubmit, onCancel }: CreateClassFormProps) => {
  const [cohorts, setCohorts] = useState<CohortType[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [showAddStudent, setShowAddStudent] = useState<string | null>(null);
  const [newStudent, setNewStudent] = useState<Partial<StudentType>>({
    name: "",
    email: "",
    phone: "",
    status: "pending"
  });

  const form = useForm({
    defaultValues: {
      title: "",
      type: "academic",
      subject: "",
      gradeLevel: "",
      ageRange: "",
      description: "",
      objectives: [""],
      hasCohorts: false,
      activeTab: "basic",
    },
  });

  const { setValue, getValues, formState: { errors } } = form;

  const activeTab = getValues("activeTab") || "basic";

  const setActiveTab = (tab: string) => {
    setValue("activeTab", tab);
  };

  const hasCohorts = getValues("hasCohorts") === true;

  const onSubmitHandler = (data: any) => {
    const formData = {
      ...data,
      cohorts: cohorts
    };
    onSubmit(formData);
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const updatedObjectives = [...getValues("objectives")];
    updatedObjectives[index] = value;
    setValue("objectives", updatedObjectives);
  };

  const addObjective = () => {
    setValue("objectives", [...getValues("objectives"), ""]);
  };

  const removeObjective = (index: number) => {
    const updatedObjectives = [...getValues("objectives")];
    updatedObjectives.splice(index, 1);
    setValue("objectives", updatedObjectives);
  };

  const addCohort = () => {
    const newId = Date.now().toString();
    setCohorts([...cohorts, { 
      id: newId, 
      name: `Cohort ${cohorts.length + 1}`, 
      maxStudents: 15,
      startDate: "",
      endDate: "",
      enrollmentStatus: "open",
      teachingMode: "online",
      meetingDays: [],
      meetingTime: "",
      meetingDuration: 60,
      meetingFrequency: "weekly",
      prerequisites: "",
      learningObjectives: "",
      specialNotes: "",
      location: "",
      students: []
    }]);
  };

  const removeCohort = (id: string) => {
    setCohorts(cohorts.filter(cohort => cohort.id !== id));
  };

  const updateCohort = (id: string, field: keyof CohortType, value: any) => {
    setCohorts(cohorts.map(cohort => 
      cohort.id === id ? { ...cohort, [field]: value } : cohort
    ));
  };

  const toggleMeetingDay = (cohortId: string, day: string) => {
    const cohort = cohorts.find(c => c.id === cohortId);
    if (!cohort) return;

    const updatedDays = cohort.meetingDays.includes(day)
      ? cohort.meetingDays.filter(d => d !== day)
      : [...cohort.meetingDays, day];
    
    updateCohort(cohortId, "meetingDays", updatedDays);
  };

  const addStudent = (cohortId: string) => {
    if (!newStudent.name || !newStudent.email) return;

    const student: StudentType = {
      id: Date.now().toString(),
      name: newStudent.name || "",
      email: newStudent.email || "",
      phone: newStudent.phone || "",
      status: "pending",
      enrollmentDate: new Date().toISOString(),
      notes: "",
      ...(newStudent.guardian ? { guardian: newStudent.guardian } : {})
    };

    setCohorts(cohorts.map(cohort => 
      cohort.id === cohortId 
        ? { ...cohort, students: [...cohort.students, student] } 
        : cohort
    ));

    setNewStudent({
      name: "",
      email: "",
      phone: "",
      status: "pending"
    });
    setShowAddStudent(null);
  };

  const removeStudent = (cohortId: string, studentId: string) => {
    setCohorts(cohorts.map(cohort => 
      cohort.id === cohortId 
        ? { ...cohort, students: cohort.students.filter(s => s.id !== studentId) } 
        : cohort
    ));
  };

  const updateStudentStatus = (cohortId: string, studentId: string, status: StudentType["status"]) => {
    setCohorts(cohorts.map(cohort => 
      cohort.id === cohortId 
        ? { 
            ...cohort, 
            students: cohort.students.map(student => 
              student.id === studentId 
                ? { ...student, status } 
                : student
            ) 
          } 
        : cohort
    ));
  };

  const sendInvitations = (cohortId: string) => {
    alert(`Invitations would be sent to students in cohort ${cohortId}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Class</CardTitle>
            <CardDescription>Fill in the details to create a new class.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                <TabsTrigger value="lessons">Lesson Plans</TabsTrigger>
                <TabsTrigger value="cohorts">Cohorts & Students</TabsTrigger>
              </TabsList>
            
              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Class Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter class title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
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
                            <SelectItem value="afterSchool">After School</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter subject" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {getValues("type") === "academic" ? (
                    <FormField
                      control={form.control}
                      name="gradeLevel"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Grade Level</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter grade level" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="ageRange"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Age Range</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter age range" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Class Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter class description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label>Learning Objectives</Label>
                  {getValues("objectives")?.map((objective: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        type="text"
                        placeholder={`Objective ${index + 1}`}
                        value={objective}
                        onChange={(e) => handleObjectiveChange(index, e.target.value)}
                        className="flex-1"
                      />
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeObjective(index)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addObjective}>
                    Add Objective
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="hasCohorts"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Divide class into multiple cohorts?</FormLabel>
                    </FormItem>
                  )}
                />

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setActiveTab("lessons")}>
                    Next: Lesson Plans
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="lessons" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Lesson Plans</h3>
                  <p className="text-sm text-gray-500">Create and manage lesson plans for this class.</p>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>
                    Back: Basic Settings
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setActiveTab("cohorts")}>
                    Next: Cohorts
                  </Button>
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
                              <h3 className="text-sm font-medium flex items-center">
                                <Users className="h-4 w-4 mr-2 text-blue-500" />
                                Cohort {index + 1}
                                {cohort.students.length > 0 && (
                                  <Badge variant="secondary" className="ml-2">
                                    {cohort.students.length} student(s)
                                  </Badge>
                                )}
                              </h3>
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
                            
                            {/* Basic Cohort Information */}
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
                                <Label htmlFor={`cohort-max-students-${cohort.id}`}>Maximum Students</Label>
                                <Input 
                                  id={`cohort-max-students-${cohort.id}`}
                                  type="number"
                                  min={1}
                                  value={cohort.maxStudents}
                                  onChange={(e) => updateCohort(cohort.id, "maxStudents", parseInt(e.target.value))}
                                  placeholder="Enter maximum number of students"
                                />
                              </div>
                            </div>
                            
                            {/* Schedule Information */}
                            <div className="pt-4 border-t">
                              <h4 className="text-sm font-medium mb-3 flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                                Schedule
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`cohort-start-date-${cohort.id}`}>Start Date</Label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                        id={`cohort-start-date-${cohort.id}`}
                                      >
                                        <CalendarRange className="mr-2 h-4 w-4" />
                                        {cohort.startDate ? format(new Date(cohort.startDate), "PPP") : "Select start date"}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <CalendarComponent
                                        mode="single"
                                        selected={cohort.startDate ? new Date(cohort.startDate) : undefined}
                                        onSelect={(date) => updateCohort(cohort.id, "startDate", date ? date.toISOString() : "")}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`cohort-end-date-${cohort.id}`}>End Date</Label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                        id={`cohort-end-date-${cohort.id}`}
                                      >
                                        <CalendarRange className="mr-2 h-4 w-4" />
                                        {cohort.endDate ? format(new Date(cohort.endDate), "PPP") : "Select end date"}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <CalendarComponent
                                        mode="single"
                                        selected={cohort.endDate ? new Date(cohort.endDate) : undefined}
                                        onSelect={(date) => updateCohort(cohort.id, "endDate", date ? date.toISOString() : "")}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>
                              
                              <div className="mt-4 space-y-2">
                                <Label>Meeting Days</Label>
                                <div className="flex flex-wrap gap-2">
                                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                                    <div key={day} className="flex items-center space-x-2">
                                      <Checkbox 
                                        id={`cohort-${cohort.id}-day-${day}`}
                                        checked={cohort.meetingDays.includes(day)}
                                        onCheckedChange={() => toggleMeetingDay(cohort.id, day)}
                                      />
                                      <Label htmlFor={`cohort-${cohort.id}-day-${day}`}>{day}</Label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`cohort-meeting-time-${cohort.id}`}>Meeting Time</Label>
                                  <Input 
                                    id={`cohort-meeting-time-${cohort.id}`}
                                    type="time"
                                    value={cohort.meetingTime}
                                    onChange={(e) => updateCohort(cohort.id, "meetingTime", e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`cohort-meeting-duration-${cohort.id}`}>Duration (minutes)</Label>
                                  <Input 
                                    id={`cohort-meeting-duration-${cohort.id}`}
                                    type="number"
                                    min={15}
                                    step={15}
                                    value={cohort.meetingDuration}
                                    onChange={(e) => updateCohort(cohort.id, "meetingDuration", parseInt(e.target.value))}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`cohort-meeting-frequency-${cohort.id}`}>Frequency</Label>
                                  <Select 
                                    value={cohort.meetingFrequency}
                                    onValueChange={(value: "weekly" | "biweekly" | "monthly" | "custom") => 
                                      updateCohort(cohort.id, "meetingFrequency", value)
                                    }
                                  >
                                    <SelectTrigger id={`cohort-meeting-frequency-${cohort.id}`}>
                                      <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="weekly">Weekly</SelectItem>
                                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                                      <SelectItem value="monthly">Monthly</SelectItem>
                                      <SelectItem value="custom">Custom</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {cohort.teachingMode === "in-person" || cohort.teachingMode === "hybrid" ? (
                                <div className="mt-4 space-y-2">
                                  <Label htmlFor={`cohort-location-${cohort.id}`}>Location</Label>
                                  <Input 
                                    id={`cohort-location-${cohort.id}`}
                                    value={cohort.location || ""}
                                    onChange={(e) => updateCohort(cohort.id, "location", e.target.value)}
                                    placeholder="Enter meeting location"
                                  />
                                </div>
                              ) : null}
                            </div>
                            
                            {/* Enrollment Information */}
                            <div className="pt-4 border-t">
                              <h4 className="text-sm font-medium mb-3 flex items-center">
                                <Book className="h-4 w-4 mr-2 text-blue-500" />
                                Enrollment
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`cohort-enrollment-status-${cohort.id}`}>Enrollment Status</Label>
                                  <Select 
                                    value={cohort.enrollmentStatus}
                                    onValueChange={(value: "open" | "closed" | "waitlist") => 
                                      updateCohort(cohort.id, "enrollmentStatus", value)
                                    }
                                  >
                                    <SelectTrigger id={`cohort-enrollment-status-${cohort.id}`}>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="open">Open for enrollment</SelectItem>
                                      <SelectItem value="closed">Closed</SelectItem>
                                      <SelectItem value="waitlist">Waitlist only</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`cohort-teaching-mode-${cohort.id}`}>Teaching Mode</Label>
                                  <Select 
                                    value={cohort.teachingMode}
                                    onValueChange={(value: "online" | "in-person" | "hybrid") => 
                                      updateCohort(cohort.id, "teachingMode", value)
                                    }
                                  >
                                    <SelectTrigger id={`cohort-teaching-mode-${cohort.id}`}>
                                      <SelectValue placeholder="Select mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="online">Online</SelectItem>
                                      <SelectItem value="in-person">In-person</SelectItem>
                                      <SelectItem value="hybrid">Hybrid</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                            
                            {/* Additional Information */}
                            <div className="pt-4 border-t space-y-4">
                              <h4 className="text-sm font-medium flex items-center">
                                <Book className="h-4 w-4 mr-2 text-blue-500" />
                                Additional Information
                              </h4>
                              <div className="space-y-2">
                                <Label htmlFor={`cohort-prerequisites-${cohort.id}`}>Prerequisites</Label>
                                <Textarea 
                                  id={`cohort-prerequisites-${cohort.id}`}
                                  value={cohort.prerequisites}
                                  onChange={(e) => updateCohort(cohort.id, "prerequisites", e.target.value)}
                                  placeholder="Any prerequisites students should meet"
                                  className="min-h-24"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`cohort-objectives-${cohort.id}`}>Learning Objectives</Label>
                                <Textarea 
                                  id={`cohort-objectives-${cohort.id}`}
                                  value={cohort.learningObjectives}
                                  onChange={(e) => updateCohort(cohort.id, "learningObjectives", e.target.value)}
                                  placeholder="Specific objectives for this cohort"
                                  className="min-h-24"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`cohort-notes-${cohort.id}`}>Special Notes</Label>
                                <Textarea 
                                  id={`cohort-notes-${cohort.id}`}
                                  value={cohort.specialNotes}
                                  onChange={(e) => updateCohort(cohort.id, "specialNotes", e.target.value)}
                                  placeholder="Any additional notes or accommodations"
                                  className="min-h-24"
                                />
                              </div>
                            </div>

                            {/* Students Section */}
                            <div className="pt-4 border-t">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="text-sm font-medium flex items-center">
                                  <UserCircle2 className="h-4 w-4 mr-2 text-blue-500" />
                                  Students ({cohort.students.length}/{cohort.maxStudents})
                                </h4>
                                <div className="flex space-x-2">
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => sendInvitations(cohort.id)}
                                    disabled={cohort.students.length === 0}
                                  >
                                    <Mail className="h-4 w-4 mr-1" />
                                    Send Invitations
                                  </Button>
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setShowAddStudent(cohort.id)}
                                  >
                                    <PlusCircle className="h-4 w-4 mr-1" />
                                    Add Student
                                  </Button>
                                </div>
                              </div>

                              {showAddStudent === cohort.id && (
                                <div className="mb-4 p-4 border rounded-md bg-gray-50">
                                  <h5 className="text-sm font-medium mb-3">Add New Student</h5>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                    <div className="space-y-2">
                                      <Label htmlFor={`new-student-name-${cohort.id}`}>Student Name</Label>
                                      <Input 
                                        id={`new-student-name-${cohort.id}`}
                                        value={newStudent.name || ""}
                                        onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                                        placeholder="Enter student name"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`new-student-email-${cohort.id}`}>Email</Label>
                                      <Input 
                                        id={`new-student-email-${cohort.id}`}
                                        type="email"
                                        value={newStudent.email || ""}
                                        onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                                        placeholder="Enter student email"
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-2">
                                      <Label htmlFor={`new-student-phone-${cohort.id}`}>Phone (Optional)</Label>
                                      <Input 
                                        id={`new-student-phone-${cohort.id}`}
                                        value={newStudent.phone || ""}
                                        onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                                        placeholder="Enter student phone"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`new-student-status-${cohort.id}`}>Status</Label>
                                      <Select 
                                        value={newStudent.status as string || "pending"}
                                        onValueChange={(value: StudentType["status"]) => 
                                          setNewStudent({...newStudent, status: value})
                                        }
                                      >
                                        <SelectTrigger id={`new-student-status-${cohort.id}`}>
                                          <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="enrolled">Enrolled</SelectItem>
                                          <SelectItem value="waitlisted">Waitlisted</SelectItem>
                                          <SelectItem value="pending">Pending</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="flex justify-end space-x-2">
                                    <Button 
                                      type="button" 
                                      variant="outline"
                                      onClick={() => setShowAddStudent(null)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button 
                                      type="button"
                                      onClick={() => addStudent(cohort.id)}
                                      disabled={!newStudent.name || !newStudent.email}
                                    >
                                      Add Student
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {cohort.students.length > 0 ? (
                                <div className="border rounded-md overflow-hidden">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Contact
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Actions
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {cohort.students.map((student) => (
                                        <tr key={student.id}>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{student.email}</div>
                                            {student.phone && <div className="text-sm text-gray-500">{student.phone}</div>}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <Select 
                                              value={student.status}
                                              onValueChange={(value: StudentType["status"]) => 
                                                updateStudentStatus(cohort.id, student.id, value)
                                              }
                                            >
                                              <SelectTrigger className="h-8 w-32">
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="enrolled">
                                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Enrolled</Badge>
                                                </SelectItem>
                                                <SelectItem value="waitlisted">
                                                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Waitlisted</Badge>
                                                </SelectItem>
                                                <SelectItem value="pending">
                                                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Pending</Badge>
                                                </SelectItem>
                                                <SelectItem value="dropped">
                                                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Dropped</Badge>
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Button 
                                              type="button" 
                                              variant="ghost" 
                                              size="sm"
                                              onClick={() => removeStudent(cohort.id, student.id)}
                                              className="text-red-600 hover:text-red-900"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="text-center py-4 border border-dashed rounded-md">
                                  <p className="text-sm text-gray-500">No students added yet</p>
                                </div>
                              )}

                              <div className="mt-4">
                                <h5 className="text-sm font-medium mb-2">Bulk Invitation</h5>
                                <div className="flex space-x-2">
                                  <Input
                                    type="email"
                                    placeholder="Enter email address to invite"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    className="flex-1"
                                  />
                                  <Button 
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                      if (inviteEmail) {
                                        addStudent(cohort.id);
                                        setInviteEmail("");
                                      }
                                    }}
                                    disabled={!inviteEmail}
                                  >
                                    Add
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-center pt-4">
                      {cohorts.length > 0 && (
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={addCohort}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Another Cohort
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <h3 className="text-sm font-medium text-yellow-800">Multiple Cohorts Disabled</h3>
                    <p className="text-xs text-yellow-700 mt-1">
                      You have not enabled multiple cohorts for this class. To manage cohorts, go back to the basic settings and 
                      enable the "Divide class into multiple cohorts" option.
                    </p>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("lessons")}>
                    Back: Lesson Plans
                  </Button>
                  <Button type="submit">
                    {form.formState.isSubmitting ? "Saving..." : "Save Class"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            {activeTab === "basic" ? (
              <>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="button" variant="outline" onClick={() => setActiveTab("lessons")}>
                  Next: Lesson Plans
                </Button>
              </>
            ) : activeTab === "lessons" ? (
              <>
                <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>
                  Back: Basic Settings
                </Button>
                <Button type="button" variant="outline" onClick={() => setActiveTab("cohorts")}>
                  Next: Cohorts
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={() => setActiveTab("lessons")}>
                  Back: Lesson Plans
                </Button>
                <Button type="submit">
                  {form.formState.isSubmitting ? "Saving..." : "Save Class"}
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default CreateClassForm;
