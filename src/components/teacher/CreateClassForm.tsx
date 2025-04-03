import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { TabsContent } from "@/components/ui/tabs";
import { PlusCircle, Trash2, Users } from "lucide-react";
import { useForm } from "react-hook-form";

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
};

interface CreateClassFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const CreateClassForm = ({ onSubmit, onCancel }: CreateClassFormProps) => {
  const [cohorts, setCohorts] = useState<CohortType[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      type: "academic",
      subject: "",
      gradeLevel: "",
      ageRange: "",
      description: "",
      objectives: [""],
      hasCohorts: false,
    },
  });

  const activeTab = getValues("activeTab") || "basic";

  const setActiveTab = (tab: string) => {
    setValue("activeTab", tab);
  };

  const hasCohorts = getValues("hasCohorts") === true;

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
      specialNotes: ""
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

  const handleObjectiveChange = (index: number, value: string) => {
    const objectives = getValues("objectives") as string[];
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setValue("objectives", newObjectives);
  };

  const addObjective = () => {
    const objectives = getValues("objectives") as string[];
    setValue("objectives", [...objectives, ""]);
  };

  const removeObjective = (index: number) => {
    const objectives = getValues("objectives") as string[];
    const newObjectives = [...objectives];
    newObjectives.splice(index, 1);
    setValue("objectives", newObjectives);
  };

  const onSubmitHandler = (data: any) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Class</CardTitle>
          <CardDescription>Fill in the details to create a new class.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Class Title</Label>
                <Input id="title" placeholder="Enter class title" {...register("title", { required: "Title is required" })} />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Class Type</Label>
                <Select {...register("type", { required: "Type is required" })}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select class type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="afterSchool">After School</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Enter subject" {...register("subject", { required: "Subject is required" })} />
                {errors.subject && <p className="text-red-500 text-sm">{errors.subject.message}</p>}
              </div>

              {getValues("type") === "academic" ? (
                <div className="space-y-2">
                  <Label htmlFor="gradeLevel">Grade Level</Label>
                  <Input id="gradeLevel" placeholder="Enter grade level" {...register("gradeLevel", { required: "Grade level is required" })} />
                  {errors.gradeLevel && <p className="text-red-500 text-sm">{errors.gradeLevel.message}</p>}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="ageRange">Age Range</Label>
                  <Input id="ageRange" placeholder="Enter age range" {...register("ageRange", { required: "Age range is required" })} />
                  {errors.ageRange && <p className="text-red-500 text-sm">{errors.ageRange.message}</p>}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Class Description</Label>
              <Textarea id="description" placeholder="Enter class description" {...register("description")} />
            </div>

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

            <div className="flex items-center space-x-2">
              <Checkbox id="hasCohorts" {...register("hasCohorts")} />
              <Label htmlFor="hasCohorts">Divide class into multiple cohorts?</Label>
            </div>

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
                    <h4 className="text-sm font-medium mb-3">Schedule</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`cohort-start-date-${cohort.id}`}>Start Date</Label>
                        <Input 
                          id={`cohort-start-date-${cohort.id}`}
                          type="date"
                          value={cohort.startDate}
                          onChange={(e) => updateCohort(cohort.id, "startDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`cohort-end-date-${cohort.id}`}>End Date</Label>
                        <Input 
                          id={`cohort-end-date-${cohort.id}`}
                          type="date"
                          value={cohort.endDate}
                          onChange={(e) => updateCohort(cohort.id, "endDate", e.target.value)}
                        />
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
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  updateCohort(cohort.id, "meetingDays", [...cohort.meetingDays, day]);
                                } else {
                                  updateCohort(
                                    cohort.id, 
                                    "meetingDays", 
                                    cohort.meetingDays.filter(d => d !== day)
                                  );
                                }
                              }}
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
                          onValueChange={(value) => updateCohort(cohort.id, "meetingFrequency", value)}
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
                  </div>
                  
                  {/* Enrollment Information */}
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3">Enrollment</h4>
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
                    <h4 className="text-sm font-medium">Additional Information</h4>
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
          
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={() => setActiveTab("lessons")}>
              Back: Lesson Plans
            </Button>
            <Button type="button" variant="outline" onClick={() => setActiveTab("teaching")}>
              Next: Teaching Team
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-gray-800">Multiple Cohorts Disabled</h3>
            <p className="text-xs text-gray-700 mt-1">
              You've opted not to divide this class into multiple cohorts. If you want to manage separate groups of students, go back to basic settings and enable cohorts.
            </p>
            <Button
              type="button" 
              variant="outline" 
              className="mt-3"
              onClick={() => {
                setValue("hasCohorts", true);
                setActiveTab("basic");
              }}
            >
              Enable Cohorts
            </Button>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={() => setActiveTab("lessons")}>
              Back: Lesson Plans
            </Button>
            <Button type="button" variant="outline" onClick={() => setActiveTab("teaching")}>
              Next: Teaching Team
            </Button>
          </div>
        </div>
      )}
    </TabsContent>

          <TabsContent value="teaching" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Teaching Team</h3>
              <p className="text-sm text-gray-500">Add and manage the teaching team for this class.</p>
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={() => setActiveTab("cohorts")}>
                Back: Cohorts
              </Button>
              <Button type="submit">
                Create Class
              </Button>
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </form>
  );
};

export default CreateClassForm;
