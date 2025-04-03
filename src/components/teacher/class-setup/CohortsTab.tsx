
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock, Users, PlusCircle, Trash2, UserPlus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { ClassFormValues } from "../CreateClassForm";
import { CohortData } from "../CreateClassForm";

interface CohortsTabProps {
  form: UseFormReturn<ClassFormValues>;
  onPreviousTab: () => void;
  onNextTab: () => void;
  cohorts: CohortData[];
  addCohort: () => void;
  removeCohort: (id: string) => void;
  updateCohort: (id: string, field: keyof CohortData, value: any) => void;
  addStudentToCohort: (cohortId: string) => void;
  removeStudentFromCohort: (cohortId: string, studentId: string) => void;
  updateStudent: (cohortId: string, studentId: string, field: "name" | "email", value: string) => void;
}

const CohortsTab = ({ 
  form, 
  onPreviousTab, 
  onNextTab,
  cohorts,
  addCohort,
  removeCohort,
  updateCohort,
  addStudentToCohort,
  removeStudentFromCohort,
  updateStudent
}: CohortsTabProps) => {
  const hasCohorts = form.watch("hasCohorts");

  return (
    <div className="space-y-6">
      {hasCohorts ? (
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
                            type="number"
                            min="0"
                            max="100"
                            value={cohort.siblingDiscount}
                            onChange={(e) => updateCohort(cohort.id, "siblingDiscount", e.target.value)}
                            placeholder="0"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`cohort-friend-discount-${cohort.id}`}>Friend/Colleague Discount (%)</Label>
                          <Input
                            id={`cohort-friend-discount-${cohort.id}`}
                            type="number"
                            min="0"
                            max="100"
                            value={cohort.friendDiscount}
                            onChange={(e) => updateCohort(cohort.id, "friendDiscount", e.target.value)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Students section */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Students</h4>
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline"
                        onClick={() => addStudentToCohort(cohort.id)}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Student
                      </Button>
                    </div>
                    
                    {cohort.students.length === 0 ? (
                      <div className="text-center py-4 border border-dashed rounded-md">
                        <p className="text-sm text-gray-500">No students enrolled yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {cohort.students.map((student, studentIndex) => (
                          <div key={student.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center border rounded-md p-3">
                            <div className="md:col-span-2">
                              <Label htmlFor={`student-name-${student.id}`} className="sr-only">Name</Label>
                              <Input
                                id={`student-name-${student.id}`}
                                placeholder="Student name"
                                value={student.name}
                                onChange={(e) => updateStudent(cohort.id, student.id, "name", e.target.value)}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label htmlFor={`student-email-${student.id}`} className="sr-only">Email</Label>
                              <Input
                                id={`student-email-${student.id}`}
                                placeholder="Email address"
                                type="email"
                                value={student.email}
                                onChange={(e) => updateStudent(cohort.id, student.id, "email", e.target.value)}
                              />
                            </div>
                            <div className="flex justify-end">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeStudentFromCohort(cohort.id, student.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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
                onClick={addCohort}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Another Cohort
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-yellow-800">Multiple Cohorts Disabled</h3>
          <p className="text-xs text-yellow-700 mt-1">
            Enable multiple cohorts in the Basic Information tab to create and manage cohorts for this class.
          </p>
        </div>
      )}
      
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPreviousTab}>
          Back: Lesson Plans
        </Button>
        <Button type="button" variant="outline" onClick={onNextTab}>
          Next: Teaching Team
        </Button>
      </div>
    </div>
  );
};

export default CohortsTab;
