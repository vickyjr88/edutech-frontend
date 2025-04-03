import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarIcon, Clock, Users, PlusCircle, Trash2, AlertCircle, Repeat, Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { ClassFormValues, CohortData, LessonSchedule, RepeatSchedule } from "./types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CohortsTabProps {
  form: UseFormReturn<ClassFormValues>;
  onPreviousTab: () => void;
  onNextTab: () => void;
  cohorts: CohortData[];
  addCohort: () => void;
  removeCohort: (id: string) => void;
  updateCohort: (id: string, field: keyof CohortData, value: any) => void;
  updateRepeatSchedule: (cohortId: string, field: keyof RepeatSchedule, value: any) => void;
  toggleDayOfWeek: (cohortId: string, day: string) => void;
  addLessonSchedule: (cohortId: string) => void;
  removeLessonSchedule: (cohortId: string, scheduleId: string) => void;
  updateLessonSchedule: (cohortId: string, scheduleId: string, field: keyof LessonSchedule, value: any) => void;
  calculateNumberOfLessons: (startDate: Date | null, endDate: Date | null, repeatSchedule: RepeatSchedule) => number;
  calculateEndDate: (startDate: Date | null, numberOfLessons: number, repeatSchedule: RepeatSchedule) => Date | null;
}

const CohortsTab = ({ 
  form, 
  onPreviousTab, 
  onNextTab,
  cohorts,
  addCohort,
  removeCohort,
  updateCohort,
  updateRepeatSchedule,
  toggleDayOfWeek,
  addLessonSchedule,
  removeLessonSchedule,
  updateLessonSchedule,
  calculateEndDate
}: CohortsTabProps) => {
  const hasCohorts = form.watch("hasCohorts");
  const totalNumberOfLessons = form.watch("numberOfLessons");
  
  const daysOfWeek = [
    { label: "Monday", value: "monday" },
    { label: "Tuesday", value: "tuesday" },
    { label: "Wednesday", value: "wednesday" },
    { label: "Thursday", value: "thursday" },
    { label: "Friday", value: "friday" },
    { label: "Saturday", value: "saturday" },
    { label: "Sunday", value: "sunday" }
  ];
  
  useEffect(() => {
    if (!hasCohorts && cohorts.length === 0) {
      addCohort();
    }
  }, [hasCohorts, cohorts.length, addCohort]);
  
  useEffect(() => {
    if (!hasCohorts && cohorts.length > 1) {
      const firstCohortId = cohorts[0].id;
      cohorts.slice(1).forEach(cohort => {
        removeCohort(cohort.id);
      });
    }
  }, [hasCohorts, cohorts, removeCohort]);

  return (
    <div className="space-y-6">
      {hasCohorts ? (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-blue-800">Multiple Cohorts Enabled</h3>
            <p className="text-xs text-blue-700 mt-1">
              Create multiple cohorts for this class. Each cohort can have its own schedule, pricing, and dates.
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
                    {hasCohorts && cohorts.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeCohort(cohort.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
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
                      {/* Start Date */}
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left",
                                !cohort.startDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {cohort.startDate ? (
                                format(cohort.startDate, "PPP")
                              ) : (
                                <span>Select start date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={cohort.startDate || undefined}
                              onSelect={(date) => updateCohort(cohort.id, "startDate", date)}
                              className="p-3 pointer-events-auto"
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      {/* End Date - Now read-only */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Label>End Date</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-blue-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">
                                  End date is calculated based on start date, number of lessons ({totalNumberOfLessons}), 
                                  and repeat pattern.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left bg-gray-50",
                            !cohort.endDate && "text-muted-foreground"
                          )}
                          disabled
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {cohort.endDate ? (
                            format(cohort.endDate, "PPP")
                          ) : (
                            <span>Auto-calculated end date</span>
                          )}
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          Based on {totalNumberOfLessons} lessons from the basic information tab
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Start Time */}
                      <div className="space-y-2">
                        <Label htmlFor={`start-time-${cohort.id}`}>Start Time</Label>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id={`start-time-${cohort.id}`}
                            type="time"
                            value={cohort.startTime}
                            onChange={(e) => updateCohort(cohort.id, "startTime", e.target.value)}
                          />
                        </div>
                      </div>
                      
                      {/* End Time */}
                      <div className="space-y-2">
                        <Label htmlFor={`end-time-${cohort.id}`}>End Time</Label>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id={`end-time-${cohort.id}`}
                            type="time"
                            value={cohort.endTime}
                            onChange={(e) => updateCohort(cohort.id, "endTime", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Repeating schedule section */}
                    <div className="space-y-4 border rounded-md p-4 bg-gray-50">
                      <div className="flex items-center">
                        <Repeat className="h-4 w-4 mr-2 text-blue-500" />
                        <h5 className="text-sm font-medium">Repeating Schedule</h5>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label>Repeat Pattern</Label>
                          <RadioGroup 
                            value={cohort.repeatSchedule.pattern} 
                            onValueChange={(value: "weekly" | "twice-weekly" | "custom") => 
                              updateRepeatSchedule(cohort.id, "pattern", value)
                            }
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="weekly" id={`weekly-${cohort.id}`} />
                              <Label htmlFor={`weekly-${cohort.id}`} className="font-normal">Weekly (once a week)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="twice-weekly" id={`twice-weekly-${cohort.id}`} />
                              <Label htmlFor={`twice-weekly-${cohort.id}`} className="font-normal">Twice Weekly</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="custom" id={`custom-${cohort.id}`} />
                              <Label htmlFor={`custom-${cohort.id}`} className="font-normal">Custom Schedule</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        {cohort.repeatSchedule.pattern === "custom" && (
                          <div className="space-y-2 pt-2">
                            <Label className="text-sm">Repeat Every</Label>
                            <div className="flex items-center space-x-2">
                              <Select
                                value={cohort.repeatSchedule.repeatEvery.toString()}
                                onValueChange={(value) => 
                                  updateRepeatSchedule(cohort.id, "repeatEvery", parseInt(value))
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 week</SelectItem>
                                  <SelectItem value="2">2 weeks</SelectItem>
                                  <SelectItem value="3">3 weeks</SelectItem>
                                  <SelectItem value="4">4 weeks</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-2 pt-2">
                          <Label className="text-sm">
                            {cohort.repeatSchedule.pattern === "weekly" ? "Day of Week" :
                             cohort.repeatSchedule.pattern === "twice-weekly" ? "Select Two Days" :
                             "Select Days"}
                          </Label>
                          <div className="grid grid-cols-4 gap-2">
                            {daysOfWeek.map((day) => (
                              <div key={day.value} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`day-${day.value}-${cohort.id}`}
                                  checked={cohort.repeatSchedule.daysOfWeek.includes(day.value)}
                                  onCheckedChange={() => toggleDayOfWeek(cohort.id, day.value)}
                                  className="data-[state=checked]:bg-blue-600"
                                />
                                <Label 
                                  htmlFor={`day-${day.value}-${cohort.id}`}
                                  className="font-normal text-sm"
                                >
                                  {day.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                          {cohort.repeatSchedule.pattern === "twice-weekly" && 
                           cohort.repeatSchedule.daysOfWeek.length !== 2 && (
                            <p className="text-xs text-amber-600">
                              Please select exactly two days for twice-weekly schedule
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Flexible schedule section - keep if still needed */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`flexible-schedule-${cohort.id}`}>Custom Lesson Times</Label>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`flexible-schedule-${cohort.id}`}
                            checked={cohort.hasFlexibleSchedule}
                            onCheckedChange={(checked) => updateCohort(cohort.id, "hasFlexibleSchedule", checked)}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enable to set different times for specific lessons (overrides the repeat schedule)
                      </p>
                    </div>
                    
                    {cohort.hasFlexibleSchedule && (
                      // Flexible schedule - different times per lesson
                      <div className="mt-4 border border-gray-200 rounded-md p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="text-sm font-medium">Custom Lesson Times</h5>
                          <Button 
                            type="button" 
                            size="sm" 
                            variant="outline"
                            onClick={() => addLessonSchedule(cohort.id)}
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Custom Time
                          </Button>
                        </div>
                        
                        {cohort.lessonSchedules && cohort.lessonSchedules.length > 0 ? (
                          <Accordion type="single" collapsible className="w-full">
                            {cohort.lessonSchedules.map((schedule) => (
                              <AccordionItem key={schedule.id} value={schedule.id}>
                                <AccordionTrigger>
                                  <div className="flex items-center">
                                    <span>Lesson {schedule.lessonNumber}</span>
                                    <span className="ml-4 text-sm text-gray-500">
                                      {schedule.time === "custom" 
                                        ? schedule.customTime 
                                        : schedule.time === "morning" 
                                          ? "Morning (8AM-12PM)" 
                                          : schedule.time === "afternoon" 
                                            ? "Afternoon (12PM-4PM)" 
                                            : "Evening (4PM-8PM)"}
                                    </span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-4 pt-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor={`lesson-number-${schedule.id}`}>Lesson Number</Label>
                                        <Input
                                          id={`lesson-number-${schedule.id}`}
                                          type="number"
                                          min="1"
                                          max={totalNumberOfLessons.toString()}
                                          value={schedule.lessonNumber.toString()}
                                          onChange={(e) => updateLessonSchedule(
                                            cohort.id, 
                                            schedule.id, 
                                            "lessonNumber", 
                                            parseInt(e.target.value) || 1
                                          )}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor={`lesson-time-${schedule.id}`}>Custom Time</Label>
                                        <div className="flex items-center space-x-2">
                                          <Clock className="h-4 w-4 text-muted-foreground" />
                                          <Input
                                            id={`lesson-time-${schedule.id}`}
                                            type="time"
                                            value={schedule.customTime || ""}
                                            onChange={(e) => 
                                              updateLessonSchedule(cohort.id, schedule.id, "customTime", e.target.value)
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex justify-end">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeLessonSchedule(cohort.id, schedule.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Remove
                                      </Button>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        ) : (
                          <Alert variant="default" className="bg-yellow-50 border-yellow-200">
                            <AlertCircle className="h-4 w-4 text-yellow-800" />
                            <AlertTitle className="text-yellow-800">No custom times added</AlertTitle>
                            <AlertDescription className="text-yellow-700">
                              Add custom times for specific lessons that don't follow the regular schedule.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                    
                    {/* Display the number of lessons from basic info tab - informational only */}
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                      <div className="flex items-center text-blue-800">
                        <Info className="h-4 w-4 mr-2" />
                        <p className="text-sm font-medium">
                          This cohort will have {totalNumberOfLessons} lessons
                        </p>
                      </div>
                      <p className="text-xs text-blue-700 mt-1 ml-6">
                        Number of lessons is set in the Basic Information tab
                      </p>
                    </div>
                  </div>
                  
                  {/* New enrollment section */}
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="text-sm font-medium">Enrollment Settings</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Min Students */}
                      <div className="space-y-2">
                        <Label htmlFor={`min-students-${cohort.id}`}>Minimum Students</Label>
                        <Input
                          id={`min-students-${cohort.id}`}
                          type="number"
                          min="1"
                          value={cohort.minStudents}
                          onChange={(e) => updateCohort(cohort.id, "minStudents", parseInt(e.target.value) || 1)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Minimum number of students needed for the class to run
                        </p>
                      </div>
                      
                      {/* Max Students */}
                      <div className="space-y-2">
                        <Label htmlFor={`max-students-${cohort.id}`}>Maximum Students</Label>
                        <Input
                          id={`max-students-${cohort.id}`}
                          type="number"
                          min={cohort.minStudents}
                          value={cohort.maxStudents}
                          onChange={(e) => updateCohort(cohort.id, "maxStudents", parseInt(e.target.value) || cohort.minStudents)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Maximum enrollment capacity for this cohort
                        </p>
                      </div>
                    </div>
                    
                    {/* Enrollment Deadline */}
                    <div className="space-y-2">
                      <Label>Enrollment Deadline</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left",
                              !cohort.enrollmentDeadline && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {cohort.enrollmentDeadline ? (
                              format(cohort.enrollmentDeadline, "PPP")
                            ) : (
                              <span>Set enrollment deadline</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={cohort.enrollmentDeadline || undefined}
                            onSelect={(date) => updateCohort(cohort.id, "enrollmentDeadline", date)}
                            className="p-3 pointer-events-auto"
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-xs text-muted-foreground">
                        Last day students can enroll in this cohort
                      </p>
                      {cohort.enrollmentDeadline && cohort.startDate && 
                       cohort.enrollmentDeadline > cohort.startDate && (
                        <div className="mt-1 flex items-center">
                          <Badge variant="warning" className="text-xs">
                            Warning: Deadline is after start date
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Pricing information */}
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="text-sm font-medium">Pricing</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`cohort-price-${cohort.id}`}>Price for Entire Class</Label>
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
                          Total price for all {totalNumberOfLessons} lessons
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`cohort-discount-${cohort.id}`}>Discount (%)</Label>
                        <Input
                          id={`cohort-discount-${cohort.id}`}
                          type="number"
                          min="0"
                          max="100"
                          value={cohort.discount}
                          onChange={(e) => updateCohort(cohort.id, "discount", e.target.value)}
                          placeholder="0"
                        />
                        <p className="text-xs text-muted-foreground">
                          Discount percentage for siblings, friends, or early enrollment
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {hasCohorts && (
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
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-yellow-800">Single Cohort Mode</h3>
            <p className="text-xs text-yellow-700 mt-1">
              You have disabled multiple cohorts. Configure the details for a single cohort below.
            </p>
          </div>
          
          {cohorts.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-md">
              <Users className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No cohort defined</h3>
              <p className="mt-1 text-sm text-gray-500">Set up your class cohort</p>
              <Button
                type="button" 
                onClick={addCohort}
                className="mt-4"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Cohort
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cohorts.map((cohort, index) => (
                <div key={cohort.id} className="border rounded-md p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Class Cohort</h3>
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
                      {/* Start Date */}
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left",
                                !cohort.startDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {cohort.startDate ? (
                                format(cohort.startDate, "PPP")
                              ) : (
                                <span>Select start date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={cohort.startDate || undefined}
                              onSelect={(date) => updateCohort(cohort.id, "startDate", date)}
                              className="p-3 pointer-events-auto"
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      {/* End Date - Now read-only */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Label>End Date</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-blue-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">
                                  End date is calculated based on start date, number of lessons ({totalNumberOfLessons}), 
                                  and repeat pattern.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left bg-gray-50",
                            !cohort.endDate && "text-muted-foreground"
                          )}
                          disabled
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {cohort.endDate ? (
                            format(cohort.endDate, "PPP")
                          ) : (
                            <span>Auto-calculated end date</span>
                          )}
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          Based on {totalNumberOfLessons} lessons from the basic information tab
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Start Time */}
                      <div className="space-y-2">
                        <Label htmlFor={`start-time-${cohort.id}`}>Start Time</Label>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id={`start-time-${cohort.id}`}
                            type="time"
                            value={cohort.startTime}
                            onChange={(e) => updateCohort(cohort.id, "startTime", e.target.value)}
                          />
                        </div>
                      </div>
                      
                      {/* End Time */}
                      <div className="space-y-2">
                        <Label htmlFor={`end-time-${cohort.id}`}>End Time</Label>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id={`end-time-${cohort.id}`}
                            type="time"
                            value={cohort.endTime}
                            onChange={(e) => updateCohort(cohort.id, "endTime", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Repeating schedule section */}
                    <div className="space-y-4 border rounded-md p-4 bg-gray-50">
                      <div className="flex items-center">
                        <Repeat className="h-4 w-4 mr-2 text-blue-500" />
                        <h5 className="text-sm font-medium">Repeating Schedule</h5>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label>Repeat Pattern</Label>
                          <RadioGroup 
                            value={cohort.repeatSchedule.pattern} 
                            onValueChange={(value: "weekly" | "twice-weekly" | "custom") => 
                              updateRepeatSchedule(cohort.id, "pattern", value)
                            }
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="weekly" id={`weekly-${cohort.id}`} />
                              <Label htmlFor={`weekly-${cohort.id}`} className="font-normal">Weekly (once a week)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="twice-weekly" id={`twice-weekly-${cohort.id}`} />
                              <Label htmlFor={`twice-weekly-${cohort.id}`} className="font-normal">Twice Weekly</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="custom" id={`custom-${cohort.id}`} />
                              <Label htmlFor={`custom-${cohort.id}`} className="font-normal">Custom Schedule</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        {cohort.repeatSchedule.pattern === "custom" && (
                          <div className="space-y-2 pt-2">
                            <Label className="text-sm">Repeat Every</Label>
                            <div className="flex items-center space-x-2">
                              <Select
                                value={cohort.repeatSchedule.repeatEvery.toString()}
                                onValueChange={(value) => 
                                  updateRepeatSchedule(cohort.id, "repeatEvery", parseInt(value))
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 week</SelectItem>
                                  <SelectItem value="2">2 weeks</SelectItem>
                                  <SelectItem value="3">3 weeks</SelectItem>
                                  <SelectItem value="4">4 weeks</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-2 pt-2">
                          <Label className="text-sm">
                            {cohort.repeatSchedule.pattern === "weekly" ? "Day of Week" :
                             cohort.repeatSchedule.pattern === "twice-weekly" ? "Select Two Days" :
                             "Select Days"}
                          </Label>
                          <div className="grid grid-cols-4 gap-2">
                            {daysOfWeek.map((day) => (
                              <div key={day.value} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`day-${day.value}-${cohort.id}`}
                                  checked={cohort.repeatSchedule.daysOfWeek.includes(day.value)}
                                  onCheckedChange={() => toggleDayOfWeek(cohort.id, day.value)}
                                  className="data-[state=checked]:bg-blue-600"
                                />
                                <Label 
                                  htmlFor={`day-${day.value}-${cohort.id}`}
                                  className="font-normal text-sm"
                                >
                                  {day.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                          {cohort.repeatSchedule.pattern === "twice-weekly" && 
                           cohort.repeatSchedule.daysOfWeek.length !== 2 && (
                            <p className="text-xs text-amber-600">
                              Please select exactly two days for twice-weekly schedule
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Flexible schedule section - keep if still needed */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`flexible-schedule-${cohort.id}`}>Custom Lesson Times</Label>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`flexible-schedule-${cohort.id}`}
                            checked={cohort.hasFlexibleSchedule}
                            onCheckedChange={(checked) => updateCohort(cohort.id, "hasFlexibleSchedule", checked)}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enable to set different times for specific lessons (overrides the repeat schedule)
                      </p>
                    </div>
                    
                    {cohort.hasFlexibleSchedule && (
                      // Flexible schedule - different times per lesson
                      <div className="mt-4 border border-gray-200 rounded-md p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="text-sm font-medium">Custom Lesson Times</h5>
                          <Button 
                            type="button" 
                            size="sm" 
                            variant="outline"
                            onClick={() => addLessonSchedule(cohort.id)}
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Custom Time
                          </Button>
                        </div>
                        
                        {cohort.lessonSchedules && cohort.lessonSchedules.length > 0 ? (
                          <Accordion type="single" collapsible className="w-full">
                            {cohort.lessonSchedules.map((schedule) => (
                              <AccordionItem key={schedule.id} value={schedule.id}>
                                <AccordionTrigger>
                                  <div className="flex items-center">
                                    <span>Lesson {schedule.lessonNumber}</span>
                                    <span className="ml-4 text-sm text-gray-500">
                                      {schedule.time === "custom" 
                                        ? schedule.customTime 
                                        : schedule.time === "morning" 
                                          ? "Morning (8AM-12PM)" 
                                          : schedule.time === "afternoon" 
                                            ? "Afternoon (12PM-4PM)" 
                                            : "Evening (4PM-8PM)"}
                                    </span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-4 pt-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor={`lesson-number-${schedule.id}`}>Lesson Number</Label>
                                        <Input
                                          id={`lesson-number-${schedule.id}`}
                                          type="number"
                                          min="1"
                                          max={totalNumberOfLessons.toString()}
                                          value={schedule.lessonNumber.toString()}
                                          onChange={(e) => updateLessonSchedule(
                                            cohort.id, 
                                            schedule.id, 
                                            "lessonNumber", 
                                            parseInt(e.target.value) || 1
                                          )}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor={`lesson-time-${schedule.id}`}>Custom Time</Label>
                                        <div className="flex items-center space-x-2">
                                          <Clock className="h-4 w-4 text-muted-foreground" />
                                          <Input
                                            id={`lesson-time-${schedule.id}`}
                                            type="time"
                                            value={schedule.customTime || ""}
                                            onChange={(e) => 
                                              updateLessonSchedule(cohort.id, schedule.id, "customTime", e.target.value)
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex justify-end">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeLessonSchedule(cohort.id, schedule.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Remove
                                      </Button>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        ) : (
                          <Alert variant="default" className="bg-yellow-50 border-yellow-200">
                            <AlertCircle className="h-4 w-4 text-yellow-800" />
                            <AlertTitle className="text-yellow-800">No custom times added</AlertTitle>
                            <AlertDescription className="text-yellow-700">
                              Add custom times for specific lessons that don't follow the regular schedule.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                    
                    {/* Display the number of lessons from basic info tab - informational only */}
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                      <div className="flex items-center text-blue-800">
                        <Info className="h-4 w-4 mr-2" />
                        <p className="text-sm font-medium">
                          This cohort will have {totalNumberOfLessons} lessons
                        </p>
                      </div>
                      <p className="text-xs text-blue-700 mt-1 ml-6">
                        Number of lessons is set in the Basic Information tab
                      </p>
                    </div>
                  </div>
                  
                  {/* New enrollment section */}
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="text-sm font-medium">Enrollment Settings</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Min Students */}
                      <div className="space-y-2">
                        <Label htmlFor={`min-students-${cohort.id}`}>Minimum Students</Label>
                        <Input
                          id={`min-students-${cohort.id}`}
                          type="number"
                          min="1"
                          value={cohort.minStudents}
                          onChange={(e) => updateCohort(cohort.id, "minStudents", parseInt(e.target.value) || 1)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Minimum number of students needed for the class to run
                        </p>
                      </div>
                      
                      {/* Max Students */}
                      <div className="space-y-2">
                        <Label htmlFor={`max-students-${cohort.id}`}>Maximum Students</Label>
                        <Input
                          id={`max-students-${cohort.id}`}
                          type="number"
                          min={cohort.minStudents}
                          value={cohort.maxStudents}
                          onChange={(e) => updateCohort(cohort.id, "maxStudents", parseInt(e.target.value) || cohort.minStudents)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Maximum enrollment capacity for this cohort
                        </p>
                      </div>
                    </div>
                    
                    {/* Enrollment Deadline */}
                    <div className="space-y-2">
                      <Label>Enrollment Deadline</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left",
                              !cohort.enrollmentDeadline && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {cohort.enrollmentDeadline ? (
                              format(cohort.enrollmentDeadline, "PPP")
                            ) : (
                              <span>Set enrollment deadline</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={cohort.enrollmentDeadline || undefined}
                            onSelect={(date) => updateCohort(cohort.id, "enrollmentDeadline", date)}
                            className="p-3 pointer-events-auto"
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-xs text-muted-foreground">
                        Last day students can enroll in this cohort
                      </p>
                      {cohort.enrollmentDeadline && cohort.startDate && 
                       cohort.enrollmentDeadline > cohort.startDate && (
                        <div className="mt-1 flex items-center">
                          <Badge variant="warning" className="text-xs">
                            Warning: Deadline is after start date
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Pricing information */}
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="text-sm font-medium">Pricing</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`cohort-price-${cohort.id}`}>Price for Entire Class</Label>
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
                          Total price for all {totalNumberOfLessons} lessons
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`cohort-discount-${cohort.id}`}>Discount (%)</Label>
                        <Input
                          id={`cohort-discount-${cohort.id}`}
                          type="number"
                          min="0"
                          max="100"
                          value={cohort.discount}
                          onChange={(e) => updateCohort(cohort.id, "discount", e.target.value)}
                          placeholder="0"
                        />
                        <p className="text-xs text-muted-foreground">
                          Discount percentage for siblings, friends, or early enrollment
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
