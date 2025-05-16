import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarIcon, Clock, Users, PlusCircle, Trash2, AlertCircle, Repeat, Info, Edit, Loader2, CreditCard } from "lucide-react";
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
import CohortFormDialog from "./cohort-form/CohortFormDialog";
import { classService } from "@/integrations/api/services/class.service";

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
  
  // State for cohort creation/editing dialogs
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editCohortId, setEditCohortId] = useState<string | null>(null);
  
  const daysOfWeek = [
    { label: "Monday", value: "monday" },
    { label: "Tuesday", value: "tuesday" },
    { label: "Wednesday", value: "wednesday" },
    { label: "Thursday", value: "thursday" },
    { label: "Friday", value: "friday" },
    { label: "Saturday", value: "saturday" },
    { label: "Sunday", value: "sunday" }
  ];
  
  // Get the cohort being edited, if any
  const cohortBeingEdited = editCohortId 
    ? cohorts.find(cohort => cohort.id === editCohortId) 
    : undefined;
  
  useEffect(() => {
    if (!hasCohorts && cohorts.length === 0) {
      // Auto-open create dialog if no cohorts exist
      setIsCreateDialogOpen(true);
    }
  }, [hasCohorts, cohorts.length]);
  
  useEffect(() => {
    if (!hasCohorts && cohorts.length > 1) {
      const firstCohortId = cohorts[0].id;
      cohorts.slice(1).forEach(cohort => {
        removeCohort(cohort.id);
      });
    }
  }, [hasCohorts, cohorts, removeCohort]);
  
  // Import classService at the top of the file
  const [isSaving, setIsSaving] = useState(false);
  const [savingError, setSavingError] = useState<string | null>(null);
  
  // Handle cohort creation
  const handleCreateCohort = async (newCohort: CohortData) => {
    console.log("Creating new cohort with data:", newCohort);
    
    // First check if the cohort already exists in the array (to avoid duplicates)
    if (!cohorts.some(c => c.id === newCohort.id)) {
      // Add the new cohort to the cohorts array first
      // This ensures the cohort exists when subsequent update operations run
      addCohort();
      console.log("Added new cohort to state, current cohorts:", cohorts);
    }
    
    // Now perform all the individual updates
    const cohortNumber = cohorts.length;
    const classTitle = form.getValues().title || "Class";
    
    updateCohort(newCohort.id, "name", newCohort.name || (hasCohorts ? `${classTitle} Cohort ${cohortNumber}` : classTitle));
    updateCohort(newCohort.id, "startDate", newCohort.startDate);
    updateCohort(newCohort.id, "endDate", newCohort.endDate);
    updateCohort(newCohort.id, "startTime", newCohort.startTime);
    updateCohort(newCohort.id, "endTime", newCohort.endTime);
    updateCohort(newCohort.id, "price", newCohort.price);
    updateCohort(newCohort.id, "discount", newCohort.discount);
    updateCohort(newCohort.id, "isActive", newCohort.isActive);
    updateCohort(newCohort.id, "minStudents", newCohort.minStudents);
    updateCohort(newCohort.id, "maxStudents", newCohort.maxStudents);
    updateCohort(newCohort.id, "enrollmentDeadline", newCohort.enrollmentDeadline);
    updateCohort(newCohort.id, "hasFlexibleSchedule", newCohort.hasFlexibleSchedule);
    
    // Update repeat schedule
    updateRepeatSchedule(newCohort.id, "pattern", newCohort.repeatSchedule.pattern);
    updateRepeatSchedule(newCohort.id, "repeatEvery", newCohort.repeatSchedule.repeatEvery);
    
    // Set days of week one by one to trigger the right updates
    newCohort.repeatSchedule.daysOfWeek.forEach(day => {
      if (!cohorts.find(c => c.id === newCohort.id)?.repeatSchedule.daysOfWeek.includes(day)) {
        toggleDayOfWeek(newCohort.id, day);
      }
    });
    
    console.log("Cohort data updated, current cohorts:", cohorts);
    
    // Save class details to API after a short delay to ensure state updates are complete
    setTimeout(async () => {
      await saveClassDetailsToAPI();
    }, 500);
  };
  
  // Handle cohort update
  const handleUpdateCohort = async (updatedCohort: CohortData) => {
    if (!updatedCohort.id) return;
    
    console.log("Updating cohort with data:", updatedCohort);
    
    // Check if the cohort exists in the array
    if (!cohorts.some(c => c.id === updatedCohort.id)) {
      console.error("Cannot update cohort that doesn't exist in state:", updatedCohort.id);
      return;
    }
    
    // Update all fields
    updateCohort(updatedCohort.id, "name", updatedCohort.name);
    updateCohort(updatedCohort.id, "startDate", updatedCohort.startDate);
    updateCohort(updatedCohort.id, "endDate", updatedCohort.endDate);
    updateCohort(updatedCohort.id, "startTime", updatedCohort.startTime);
    updateCohort(updatedCohort.id, "endTime", updatedCohort.endTime);
    updateCohort(updatedCohort.id, "price", updatedCohort.price);
    updateCohort(updatedCohort.id, "discount", updatedCohort.discount);
    updateCohort(updatedCohort.id, "isActive", updatedCohort.isActive);
    updateCohort(updatedCohort.id, "minStudents", updatedCohort.minStudents);
    updateCohort(updatedCohort.id, "maxStudents", updatedCohort.maxStudents);
    updateCohort(updatedCohort.id, "enrollmentDeadline", updatedCohort.enrollmentDeadline);
    updateCohort(updatedCohort.id, "hasFlexibleSchedule", updatedCohort.hasFlexibleSchedule);
    
    // Update repeat schedule
    updateRepeatSchedule(updatedCohort.id, "pattern", updatedCohort.repeatSchedule.pattern);
    updateRepeatSchedule(updatedCohort.id, "repeatEvery", updatedCohort.repeatSchedule.repeatEvery);
    
    // Reset days of week and set them from scratch to ensure correct state
    const existingCohort = cohorts.find(c => c.id === updatedCohort.id);
    if (existingCohort) {
      // First remove any days not in the updated cohort
      existingCohort.repeatSchedule.daysOfWeek.forEach(day => {
        if (!updatedCohort.repeatSchedule.daysOfWeek.includes(day)) {
          toggleDayOfWeek(updatedCohort.id, day);
        }
      });
      
      // Then add any new days
      updatedCohort.repeatSchedule.daysOfWeek.forEach(day => {
        if (!existingCohort.repeatSchedule.daysOfWeek.includes(day)) {
          toggleDayOfWeek(updatedCohort.id, day);
        }
      });
    }
    
    // Clean up by clearing the edit ID
    setEditCohortId(null);
    
    console.log("Cohort data updated, current cohorts after update:", cohorts);
    
    // Save class details to API after a short delay to ensure state updates are complete
    setTimeout(async () => {
      await saveClassDetailsToAPI();
    }, 500);
  };
  
  // Save class details to API
  const saveClassDetailsToAPI = async () => {
    try {
      // Check for class ID in multiple places
      let classId = form.getValues("id");
      
      // If no class ID in form, but it's stored in component state
      if (!classId && window.location.pathname.includes('/teacher-class-setup/')) {
        // Try to extract class ID from URL
        const pathSegments = window.location.pathname.split('/');
        const potentialClassId = pathSegments[pathSegments.length - 1];
        if (potentialClassId && potentialClassId !== 'teacher-class-setup') {
          classId = potentialClassId;
          console.log("Using class ID from URL:", classId);
        }
      }
      
      // If still no class ID, we can't save cohort data yet
      if (!classId) {
        console.log("No class ID available yet - cohort data will be saved later");
        return; // Exit gracefully without error - the data will be saved when class is created
      }
      
      // DEBUG: Check if cohorts array is available
      console.log("Current cohorts before saving:", cohorts);
      
      if (!cohorts || cohorts.length === 0) {
        console.error("No cohorts available to save");
        setSavingError("No cohorts to save. Please create at least one cohort.");
        return;
      }
      
      setIsSaving(true);
      setSavingError(null);
      
      // Format the cohort data for the API
      // Use the component state directly instead of any potentially stale values
      const formattedCohorts = [...cohorts].map(cohort => {
        // Ensure we have valid values for all required fields
        if (!cohort || !cohort.repeatSchedule) {
          console.error("Invalid cohort data:", cohort);
          return null;
        }
        
        // Convert days of week format if needed
        const daysOfWeek = (cohort.repeatSchedule.daysOfWeek || []).map(day => day.toUpperCase());
        
        // Create a formatted cohort object with all necessary fields
        return {
          id: cohort.id,
          name: cohort.name || `Cohort ${cohort.id}`,
          isActive: typeof cohort.isActive === 'boolean' ? cohort.isActive : true,
          startDate: cohort.startDate,
          endDate: cohort.endDate,
          startTime: cohort.startTime || "",
          endTime: cohort.endTime || "",
          repeatPattern: (cohort.repeatSchedule.pattern || "weekly").toUpperCase(),
          repeatEvery: cohort.repeatSchedule.repeatEvery || 1,
          daysOfWeek,
          customLessonTimes: !!cohort.hasFlexibleSchedule,
          minimumStudents: cohort.minStudents || 1,
          maximumStudents: cohort.maxStudents || 20,
          enrollmentDeadline: cohort.enrollmentDeadline,
          price: parseFloat(cohort.price) || 0,
          discount: parseFloat(cohort.discount) || 0
        };
      }).filter(cohort => cohort !== null); // Remove any null entries
      
      console.log("Formatted cohorts for API:", formattedCohorts);
      
      // Prepare the data payload
      const classData = {
        cohorts: formattedCohorts,
        enableMultipleCohorts: hasCohorts
      };
      
      console.log("Sending data to API:", JSON.stringify(classData));
      
      // Make the API call using the class service
      const { data, error } = await classService.update(classId, classData as any);
      
      if (error) {
        console.error("Error saving class details:", error);
        setSavingError(`Failed to save class data: ${error.message || "Unknown error"}`);
      } else {
        console.log("Class details saved successfully:", data);
        // Could show a success message or toast here
      }
    } catch (err) {
      console.error("Error saving class details:", err);
      setSavingError(`Failed to save class data: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status alert for API operations */}
      {savingError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error saving class data</AlertTitle>
          <AlertDescription>{savingError}</AlertDescription>
        </Alert>
      )}
      
      {isSaving && (
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <AlertTitle className="text-blue-800">Saving class details</AlertTitle>
          <AlertDescription className="text-blue-700">
            Please wait while we save your class information...
          </AlertDescription>
        </Alert>
      )}
      
      {/* Cohort Creation Dialog */}
      <CohortFormDialog 
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSave={handleCreateCohort}
        title="Create New Cohort"
        description="Configure your new cohort details"
        buttonText="Create Cohort"
        buttonIcon={<PlusCircle className="h-4 w-4 mr-2" />}
        totalNumberOfLessons={totalNumberOfLessons}
        calculateEndDate={calculateEndDate}
      />
      
      {/* Cohort Edit Dialog */}
      {cohortBeingEdited && (
        <CohortFormDialog
          cohort={cohortBeingEdited}
          isOpen={!!editCohortId}
          onOpenChange={(open) => {
            if (!open) setEditCohortId(null);
          }}
          onSave={handleUpdateCohort}
          title="Edit Cohort"
          description="Update your cohort details"
          totalNumberOfLessons={totalNumberOfLessons}
          calculateEndDate={calculateEndDate}
        />
      )}
      
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
                onClick={() => {
                  addCohort();
                  setIsCreateDialogOpen(true);
                }}
                className="mt-4"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add First Cohort
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cohorts.map((cohort, index) => (
                <div key={cohort.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                  {/* Cohort header with status badge and actions */}
                  <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        <div className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-full text-white",
                          cohort.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
                        )}>
                          <Users className="h-4 w-4" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium">{cohort.name || `Cohort ${index + 1}`}</h3>
                        <div className="flex items-center mt-0.5">
                          <Badge variant={cohort.isActive ? "success" : "secondary"} className={cn(
                            "text-xs rounded-full px-2 py-0 h-5",
                            cohort.isActive ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                          )}>
                            {cohort.isActive ? "Active" : "Inactive"}
                          </Badge>
                          
                          {cohort.startDate && (
                            <p className="text-xs text-muted-foreground ml-2">
                              Starts {format(cohort.startDate, "MMM d, yyyy")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setEditCohortId(cohort.id)}
                        className="flex items-center text-sm"
                      >
                        <Edit className="h-3.5 w-3.5 mr-1.5" />
                        Edit Details
                      </Button>
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
                  </div>
                  
                  {/* Cohort details in a clean grid layout */}
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* COLUMN 1: Schedule information */}
                      <div>
                        <h4 className="font-medium flex items-center mb-3 text-sm">
                          <CalendarIcon className="text-blue-500 h-4 w-4 mr-2" />
                          Schedule
                        </h4>
                        
                        <div className="space-y-3">
                          {/* Class times */}
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm flex items-center text-gray-700">
                              <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                              <span className="font-medium">Class Times</span>
                            </p>
                            {cohort.startTime && cohort.endTime ? (
                              <p className="mt-1 text-sm">
                                <span className="font-medium">{cohort.startTime}</span> to <span className="font-medium">{cohort.endTime}</span>
                              </p>
                            ) : (
                              <p className="mt-1 text-sm text-muted-foreground italic">No times set</p>
                            )}
                          </div>
                          
                          {/* Days */}
                          <div>
                            <p className="text-sm text-gray-700 mb-1.5 flex items-center">
                              <span className="font-medium">{
                                cohort.repeatSchedule.pattern === "weekly" 
                                  ? "Weekly" 
                                  : cohort.repeatSchedule.pattern === "twice-weekly" 
                                    ? "Twice Weekly" 
                                    : "Custom Schedule"
                              }</span>
                              {cohort.repeatSchedule.pattern === "custom" && cohort.repeatSchedule.repeatEvery > 1 && (
                                <span className="ml-1 text-xs text-gray-500">(every {cohort.repeatSchedule.repeatEvery} weeks)</span>
                              )}
                            </p>
                            
                            <div className="flex flex-wrap gap-1">
                              {cohort.repeatSchedule.daysOfWeek.map(day => (
                                <Badge key={day} variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                                  {day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()}
                                </Badge>
                              ))}
                              {cohort.repeatSchedule.daysOfWeek.length === 0 && (
                                <p className="text-xs text-muted-foreground italic">No days selected</p>
                              )}
                            </div>
                          </div>
                          
                          {/* Duration */}
                          <div>
                            <p className="text-xs text-gray-500">
                              Total of <span className="font-medium">{totalNumberOfLessons}</span> lessons
                            </p>
                            {cohort.startDate && cohort.endDate && (
                              <p className="text-xs text-gray-500">
                                From {format(cohort.startDate, "MMM d")} to {format(cohort.endDate, "MMM d, yyyy")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* COLUMN 2: Enrollment information */}
                      <div>
                        <h4 className="font-medium flex items-center mb-3 text-sm">
                          <Users className="text-purple-500 h-4 w-4 mr-2" />
                          Enrollment
                        </h4>
                        
                        <div className="space-y-3">
                          {/* Capacity */}
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Capacity</span>
                            </p>
                            <div className="flex items-center mt-1">
                              <p className="text-2xl font-bold">{cohort.minStudents}-{cohort.maxStudents}</p>
                              <p className="ml-2 text-xs text-gray-500">students</p>
                            </div>
                          </div>
                          
                          {/* Enrollment deadline */}
                          {cohort.enrollmentDeadline ? (
                            <div>
                              <p className="text-sm text-gray-700 mb-1">
                                <span className="font-medium">Enrollment Deadline</span>
                              </p>
                              <div className="flex items-center">
                                <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                                <p className="text-sm">{format(cohort.enrollmentDeadline, "MMMM d, yyyy")}</p>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm text-gray-700 mb-1">
                                <span className="font-medium">Enrollment Deadline</span>
                              </p>
                              <p className="text-sm text-muted-foreground italic">No deadline set</p>
                            </div>
                          )}
                          
                          {/* Flexible schedule info if enabled */}
                          {cohort.hasFlexibleSchedule && (
                            <div className="mt-2">
                              <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">
                                Custom lesson times enabled
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* COLUMN 3: Pricing information */}
                      <div>
                        <h4 className="font-medium flex items-center mb-3 text-sm">
                          <CreditCard className="text-emerald-500 h-4 w-4 mr-2" />
                          Pricing
                        </h4>
                        
                        <div className="space-y-3">
                          {/* Price display */}
                          <div className="bg-gray-50 p-3 rounded-md">
                            {cohort.price ? (
                              <>
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">Class Price</span>
                                </p>
                                <div className="flex items-baseline mt-1">
                                  <p className="text-2xl font-bold">${cohort.price}</p>
                                  <p className="ml-2 text-xs text-gray-500">for all {totalNumberOfLessons} lessons</p>
                                </div>
                              </>
                            ) : (
                              <>
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">Class Price</span>
                                </p>
                                <p className="text-sm text-muted-foreground italic mt-1">No price set</p>
                              </>
                            )}
                          </div>
                          
                          {/* Discount if available */}
                          {cohort.discount && cohort.discount !== "0" && (
                            <div className="flex items-center">
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                                {cohort.discount}% discount
                              </Badge>
                              {cohort.price && (
                                <p className="text-xs text-gray-500 ml-2">
                                  Final price: ${(parseFloat(cohort.price) * (1 - parseInt(cohort.discount) / 100)).toFixed(2)}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {hasCohorts && (
                <Button
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    addCohort();
                    setIsCreateDialogOpen(true);
                  }}
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
                onClick={() => {
                  addCohort();
                  setIsCreateDialogOpen(true);
                }}
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
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setEditCohortId(cohort.id)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Basic cohort information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* COLUMN 1: Schedule information */}
                    <div>
                      <h4 className="font-medium flex items-center mb-3 text-sm">
                        <CalendarIcon className="text-blue-500 h-4 w-4 mr-2" />
                        Schedule
                      </h4>
                      
                      <div className="space-y-3">
                        {/* Class times */}
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm flex items-center text-gray-700">
                            <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                            <span className="font-medium">Class Times</span>
                          </p>
                          {cohort.startTime && cohort.endTime ? (
                            <p className="mt-1 text-sm">
                              <span className="font-medium">{cohort.startTime}</span> to <span className="font-medium">{cohort.endTime}</span>
                            </p>
                          ) : (
                            <p className="mt-1 text-sm text-muted-foreground italic">No times set</p>
                          )}
                        </div>
                        
                        {/* Days */}
                        <div>
                          <p className="text-sm text-gray-700 mb-1.5 flex items-center">
                            <span className="font-medium">{
                              cohort.repeatSchedule.pattern === "weekly" 
                                ? "Weekly" 
                                : cohort.repeatSchedule.pattern === "twice-weekly" 
                                  ? "Twice Weekly" 
                                  : "Custom Schedule"
                            }</span>
                            {cohort.repeatSchedule.pattern === "custom" && cohort.repeatSchedule.repeatEvery > 1 && (
                              <span className="ml-1 text-xs text-gray-500">(every {cohort.repeatSchedule.repeatEvery} weeks)</span>
                            )}
                          </p>
                          
                          <div className="flex flex-wrap gap-1">
                            {cohort.repeatSchedule.daysOfWeek.map(day => (
                              <Badge key={day} variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                                {day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()}
                              </Badge>
                            ))}
                            {cohort.repeatSchedule.daysOfWeek.length === 0 && (
                              <p className="text-xs text-muted-foreground italic">No days selected</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Duration */}
                        <div>
                          <p className="text-xs text-gray-500">
                            Total of <span className="font-medium">{totalNumberOfLessons}</span> lessons
                          </p>
                          {cohort.startDate && cohort.endDate && (
                            <p className="text-xs text-gray-500">
                              From {format(cohort.startDate, "MMM d")} to {format(cohort.endDate, "MMM d, yyyy")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* COLUMN 2: Enrollment information */}
                    <div>
                      <h4 className="font-medium flex items-center mb-3 text-sm">
                        <Users className="text-purple-500 h-4 w-4 mr-2" />
                        Enrollment
                      </h4>
                      
                      <div className="space-y-3">
                        {/* Capacity */}
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Capacity</span>
                          </p>
                          <div className="flex items-center mt-1">
                            <p className="text-2xl font-bold">{cohort.minStudents}-{cohort.maxStudents}</p>
                            <p className="ml-2 text-xs text-gray-500">students</p>
                          </div>
                        </div>
                        
                        {/* Status */}
                        <div>
                          <p className="text-sm text-gray-700 mb-1">
                            <span className="font-medium">Status</span>
                          </p>
                          <Badge variant={cohort.isActive ? "success" : "secondary"} className={cn(
                            "text-xs rounded-full px-2 py-0.5 h-5",
                            cohort.isActive ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                          )}>
                            {cohort.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        
                        {/* Enrollment deadline */}
                        {cohort.enrollmentDeadline ? (
                          <div>
                            <p className="text-sm text-gray-700 mb-1">
                              <span className="font-medium">Enrollment Deadline</span>
                            </p>
                            <div className="flex items-center">
                              <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                              <p className="text-sm">{format(cohort.enrollmentDeadline, "MMMM d, yyyy")}</p>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-gray-700 mb-1">
                              <span className="font-medium">Enrollment Deadline</span>
                            </p>
                            <p className="text-sm text-muted-foreground italic">No deadline set</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* COLUMN 3: Pricing information */}
                    <div>
                      <h4 className="font-medium flex items-center mb-3 text-sm">
                        <CreditCard className="text-emerald-500 h-4 w-4 mr-2" />
                        Pricing
                      </h4>
                      
                      <div className="space-y-3">
                        {/* Price display */}
                        <div className="bg-gray-50 p-3 rounded-md">
                          {cohort.price ? (
                            <>
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Class Price</span>
                              </p>
                              <div className="flex items-baseline mt-1">
                                <p className="text-2xl font-bold">${cohort.price}</p>
                                <p className="ml-2 text-xs text-gray-500">for all {totalNumberOfLessons} lessons</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Class Price</span>
                              </p>
                              <p className="text-sm text-muted-foreground italic mt-1">No price set</p>
                            </>
                          )}
                        </div>
                        
                        {/* Discount if available */}
                        {cohort.discount && cohort.discount !== "0" && (
                          <div className="flex items-center">
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                              {cohort.discount}% discount
                            </Badge>
                            {cohort.price && (
                              <p className="text-xs text-gray-500 ml-2">
                                Final price: ${(parseFloat(cohort.price) * (1 - parseInt(cohort.discount) / 100)).toFixed(2)}
                              </p>
                            )}
                          </div>
                        )}
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
