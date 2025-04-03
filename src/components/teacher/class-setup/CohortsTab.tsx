
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarIcon, Clock, Users, PlusCircle, Trash2, AlertCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { ClassFormValues, CohortData, LessonSchedule } from "./types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CohortsTabProps {
  form: UseFormReturn<ClassFormValues>;
  onPreviousTab: () => void;
  onNextTab: () => void;
  cohorts: CohortData[];
  addCohort: () => void;
  removeCohort: (id: string) => void;
  updateCohort: (id: string, field: keyof CohortData, value: any) => void;
  addLessonSchedule: (cohortId: string) => void;
  removeLessonSchedule: (cohortId: string, scheduleId: string) => void;
  updateLessonSchedule: (cohortId: string, scheduleId: string, field: keyof LessonSchedule, value: any) => void;
  calculateNumberOfLessons: (startDate: Date | null, endDate: Date | null) => number;
}

const CohortsTab = ({ 
  form, 
  onPreviousTab, 
  onNextTab,
  cohorts,
  addCohort,
  removeCohort,
  updateCohort,
  addLessonSchedule,
  removeLessonSchedule,
  updateLessonSchedule,
  calculateNumberOfLessons
}: CohortsTabProps) => {
  const hasCohorts = form.watch("hasCohorts");

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
                      
                      {/* End Date */}
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left",
                                !cohort.endDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {cohort.endDate ? (
                                format(cohort.endDate, "PPP")
                              ) : (
                                <span>Select end date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={cohort.endDate || undefined}
                              onSelect={(date) => updateCohort(cohort.id, "endDate", date)}
                              className="p-3 pointer-events-auto"
                              initialFocus
                              disabled={(date) => 
                                cohort.startDate ? date < cohort.startDate : false
                              }
                            />
                          </PopoverContent>
                        </Popover>
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
                    
                    {/* Flexible schedule toggle */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`flexible-schedule-${cohort.id}`}>Flexible Lesson Schedule</Label>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`flexible-schedule-${cohort.id}`}
                            checked={cohort.hasFlexibleSchedule}
                            onCheckedChange={(checked) => updateCohort(cohort.id, "hasFlexibleSchedule", checked)}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enable to set different times for each lesson
                      </p>
                    </div>
                    
                    {cohort.hasFlexibleSchedule && (
                      // Flexible schedule - different times per lesson
                      <div className="mt-4 border border-gray-200 rounded-md p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="text-sm font-medium">Lesson Schedule</h5>
                          <Button 
                            type="button" 
                            size="sm" 
                            variant="outline"
                            onClick={() => addLessonSchedule(cohort.id)}
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Lesson Time
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
                                          max={cohort.numberOfLessons > 0 ? cohort.numberOfLessons.toString() : "10"}
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
                            <AlertTitle className="text-yellow-800">No lesson times added</AlertTitle>
                            <AlertDescription className="text-yellow-700">
                              Add specific times for each lesson in this cohort using the button above.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor={`cohort-lessons-${cohort.id}`}>Number of Lessons</Label>
                      <Input
                        id={`cohort-lessons-${cohort.id}`}
                        type="number"
                        min="1"
                        max="52"
                        value={cohort.numberOfLessons}
                        onChange={(e) => updateCohort(cohort.id, "numberOfLessons", parseInt(e.target.value) || 0)}
                        readOnly={!!(cohort.startDate && cohort.endDate)}
                        className={cn(
                          cohort.startDate && cohort.endDate ? "bg-gray-100" : ""
                        )}
                      />
                      <p className="text-xs text-muted-foreground">
                        {cohort.startDate && cohort.endDate 
                          ? "Auto-calculated from start and end dates" 
                          : "Manually set the number of lessons or define start/end dates"}
                      </p>
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
                          Total price for all {cohort.numberOfLessons || "?"} lessons
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
