
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, Users, BookOpen, ScrollText, PlusCircle, Trash2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  TEACHING_STRATEGIES 
} from "@/components/teacher/professional-profile/utils/strategyUtils";
import { 
  TEACHING_METHODOLOGIES 
} from "@/components/teacher/professional-profile/utils/methodologyUtils";

const classSchema = z.object({
  title: z.string().min(3, { message: "Class title must be at least 3 characters" }),
  type: z.enum(["academic", "afterschool"]),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  gradeLevel: z.string().min(1, { message: "Grade level is required" }),
  methodology: z.string().optional(),
  strategy: z.string().optional(),
  maxStudents: z.coerce.number().min(1, { message: "Class must have at least 1 student" }),
  isPublic: z.boolean().default(true),
  hasCohorts: z.boolean().default(false),
  hasTeamTeaching: z.boolean().default(false),
});

type ClassFormValues = z.infer<typeof classSchema>;

type CreateClassFormProps = {
  onSubmit: (data: ClassFormValues) => void;
  onCancel: () => void;
};

const CreateClassForm = ({ onSubmit, onCancel }: CreateClassFormProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [cohorts, setCohorts] = useState<{ id: string; name: string; schedule: string }[]>([]);
  const [teamMembers, setTeamMembers] = useState<{ id: string; email: string; role: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      title: "",
      type: "academic",
      description: "",
      subject: "",
      gradeLevel: "",
      maxStudents: 20,
      isPublic: true,
      hasCohorts: false,
      hasTeamTeaching: false,
    },
  });

  const classType = form.watch("type");
  const hasCohorts = form.watch("hasCohorts");
  const hasTeamTeaching = form.watch("hasTeamTeaching");

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
    setCohorts([...cohorts, { id: newId, name: `Cohort ${cohorts.length + 1}`, schedule: "" }]);
  };

  const removeCohort = (id: string) => {
    setCohorts(cohorts.filter(cohort => cohort.id !== id));
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

  const updateCohort = (id: string, field: "name" | "schedule", value: string) => {
    setCohorts(cohorts.map(cohort => 
      cohort.id === id ? { ...cohort, [field]: value } : cohort
    ));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New Class</CardTitle>
        <CardDescription>
          Set up your class details, schedule, and teaching team
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Basic Information
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter class title" {...field} />
                          </FormControl>
                          <FormDescription>
                            Give your class a catchy, descriptive title
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe what students will learn in this class..." 
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a detailed description of the class objectives and outcomes
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    <FormField
                      control={form.control}
                      name="gradeLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade Level</FormLabel>
                          <Select 
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select grade level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="elementary_1_3">Elementary (Grades 1-3)</SelectItem>
                              <SelectItem value="elementary_4_6">Elementary (Grades 4-6)</SelectItem>
                              <SelectItem value="middle_school">Middle School (Grades 7-8)</SelectItem>
                              <SelectItem value="high_school">High School (Grades 9-12)</SelectItem>
                              <SelectItem value="all_ages">All Ages</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                            Choose your primary teaching methodology for this class
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

                  <FormField
                    control={form.control}
                    name="maxStudents"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Students</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="100" {...field} />
                        </FormControl>
                        <FormDescription>
                          Set the maximum number of students allowed in this class
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                        Create multiple cohorts for this class. Each cohort can have its own schedule and student list.
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
                                <Label htmlFor={`cohort-schedule-${cohort.id}`}>Schedule</Label>
                                <Select 
                                  value={cohort.schedule}
                                  onValueChange={(value) => updateCohort(cohort.id, "schedule", value)}
                                >
                                  <SelectTrigger id={`cohort-schedule-${cohort.id}`}>
                                    <SelectValue placeholder="Select schedule" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="monday">Mondays, 4-5 PM</SelectItem>
                                    <SelectItem value="tuesday">Tuesdays, 4-5 PM</SelectItem>
                                    <SelectItem value="wednesday">Wednesdays, 4-5 PM</SelectItem>
                                    <SelectItem value="thursday">Thursdays, 4-5 PM</SelectItem>
                                    <SelectItem value="friday">Fridays, 4-5 PM</SelectItem>
                                    <SelectItem value="saturday">Saturdays, 10-11 AM</SelectItem>
                                    <SelectItem value="custom">Custom Schedule</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button" 
                          variant="outline" 
                          onClick={addCohort}
                          className="mt-2"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Another Cohort
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                      <h3 className="text-sm font-medium text-amber-800">Single Cohort Class</h3>
                      <p className="text-xs text-amber-700 mt-1">
                        This class has a single cohort. All students will follow the same schedule.
                        To enable multiple cohorts, go back to the Basic Information tab.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Class Schedule</Label>
                        <Select defaultValue="monday">
                          <SelectTrigger>
                            <SelectValue placeholder="Select days" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monday">Mondays, 4-5 PM</SelectItem>
                            <SelectItem value="tuesday">Tuesdays, 4-5 PM</SelectItem>
                            <SelectItem value="wednesday">Wednesdays, 4-5 PM</SelectItem>
                            <SelectItem value="thursday">Thursdays, 4-5 PM</SelectItem>
                            <SelectItem value="friday">Fridays, 4-5 PM</SelectItem>
                            <SelectItem value="saturday">Saturdays, 10-11 AM</SelectItem>
                            <SelectItem value="custom">Custom Schedule</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>
                    Back: Basic Information
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setActiveTab("teaching")}>
                    Next: Teaching Team
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="teaching" className="space-y-6">
                {hasTeamTeaching ? (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                      <h3 className="text-sm font-medium text-blue-800">Team Teaching Enabled</h3>
                      <p className="text-xs text-blue-700 mt-1">
                        Add co-teachers or teaching assistants to collaborate on this class.
                      </p>
                    </div>

                    {teamMembers.length === 0 ? (
                      <div className="text-center py-8 border border-dashed rounded-md">
                        <UserPlus className="h-12 w-12 mx-auto text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No team members added</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by adding a team member</p>
                        <Button
                          type="button" 
                          onClick={addTeamMember}
                          className="mt-4"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add First Team Member
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {teamMembers.map((member, index) => (
                          <div key={member.id} className="border rounded-md p-4 space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-sm font-medium">Team Member {index + 1}</h3>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeTeamMember(member.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`member-email-${member.id}`}>Email</Label>
                                <Input 
                                  id={`member-email-${member.id}`}
                                  value={member.email}
                                  onChange={(e) => updateTeamMember(member.id, "email", e.target.value)}
                                  placeholder="colleague@example.com"
                                  type="email"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`member-role-${member.id}`}>Role</Label>
                                <Select 
                                  value={member.role}
                                  onValueChange={(value) => updateTeamMember(member.id, "role", value)}
                                >
                                  <SelectTrigger id={`member-role-${member.id}`}>
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="co-teacher">Co-Teacher</SelectItem>
                                    <SelectItem value="assistant">Teaching Assistant</SelectItem>
                                    <SelectItem value="guest">Guest Lecturer</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button" 
                          variant="outline" 
                          onClick={addTeamMember}
                          className="mt-2"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Another Team Member
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                      <h3 className="text-sm font-medium text-amber-800">Solo Teaching</h3>
                      <p className="text-xs text-amber-700 mt-1">
                        You'll be the only teacher for this class.
                        To add co-teachers or assistants, go back to the Basic Information tab.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("cohorts")}>
                    Back: Cohorts & Students
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating Class..." : "Create Class"}
                  </Button>
                </div>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        {activeTab === "teaching" && (
          <Button onClick={form.handleSubmit(handleSubmitForm)} disabled={isSubmitting}>
            {isSubmitting ? "Creating Class..." : "Create Class"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CreateClassForm;
