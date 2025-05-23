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
import { getApiRepeatPatternValue, getLocalRepeatPatternValue } from "./utils/repeatPatternUtils";
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
  
  // Handle cohort creation - new approach: send to API first, then update local state
  const handleCreateCohort = async (newCohort: CohortData) => {
    console.log("Creating new cohort with data:", newCohort);
    
    try {
      // Get class ID
      let classId = form.getValues("id");
      
      // If no class ID in form, try to extract it from URL
      if (!classId && window.location.pathname.includes('/teacher-class-setup/')) {
        const pathSegments = window.location.pathname.split('/');
        const potentialClassId = pathSegments[pathSegments.length - 1];
        if (potentialClassId && potentialClassId !== 'teacher-class-setup') {
          classId = potentialClassId;
          console.log("Using class ID from URL:", classId);
        }
      }
      
      // If still no class ID, we can't save cohort data yet
      if (!classId) {
        console.error("Cannot create cohort: No class ID available");
        setSavingError("Cannot create cohort: No class ID available. Please create the class first.");
        return;
      }
      
      // Set loading state
      setIsSaving(true);
      setSavingError(null);
      
      // 1. Format the new cohort for API according to CohortDto format
      // Using the utility function for pattern value conversion
      
      const formattedNewCohort = {
        // Don't include id for new cohorts - let the backend assign it
        name: newCohort.name || `Cohort ${Date.now()}`,
        isActive: typeof newCohort.isActive === 'boolean' ? newCohort.isActive : true,
        startDate: newCohort.startDate,
        endDate: newCohort.endDate,
        startTime: newCohort.startTime || "",
        endTime: newCohort.endTime || "",
        repeatEvery: newCohort.repeatSchedule.repeatEvery || 1,
        repeatPattern: getApiRepeatPatternValue(newCohort.repeatSchedule.pattern || "weekly"),
        daysOfWeek: (newCohort.repeatSchedule.daysOfWeek || []).map(day => day.toUpperCase()),
        customLessonTimes: !!newCohort.hasFlexibleSchedule,
        minimumStudents: newCohort.minStudents || 1,
        maximumStudents: newCohort.maxStudents || 20,
        enrollmentDeadline: newCohort.enrollmentDeadline,
        price: parseFloat(newCohort.price) || 0,
        discount: parseFloat(newCohort.discount) || 0
      };
      
      // 2. Combine with existing cohorts
      const formattedCurrentCohorts = cohorts.map(cohort => {
        if (!cohort || !cohort.repeatSchedule) {
          console.error("Invalid cohort data:", cohort);
          return null;
        }
        
        return {
          id: cohort.id,
          name: cohort.name || `Cohort ${cohort.id}`,
          isActive: typeof cohort.isActive === 'boolean' ? cohort.isActive : true,
          startDate: cohort.startDate,
          endDate: cohort.endDate,
          startTime: cohort.startTime || "",
          endTime: cohort.endTime || "",
          repeatEvery: cohort.repeatSchedule.repeatEvery || 1,
          repeatPattern: getApiRepeatPatternValue(cohort.repeatSchedule.pattern || "weekly"),
          daysOfWeek: (cohort.repeatSchedule.daysOfWeek || []).map(day => day.toUpperCase()),
          customLessonTimes: !!cohort.hasFlexibleSchedule,
          minimumStudents: cohort.minStudents || 1,
          maximumStudents: cohort.maxStudents || 20,
          enrollmentDeadline: cohort.enrollmentDeadline,
          price: parseFloat(cohort.price) || 0,
          discount: parseFloat(cohort.discount) || 0
        };
      }).filter(cohort => cohort !== null);
      
      // 3. Create combined cohorts array with the new cohort
      const allCohorts = [...formattedCurrentCohorts, formattedNewCohort];
      
      console.log("Sending cohorts to API:", allCohorts);
      
      // 4. Send the complete cohorts array to the API
      const classData = {
        cohorts: allCohorts,
        enableMultipleCohorts: hasCohorts
      };
      
      // 5. Update the class via API
      const { data, error } = await classService.update(classId, classData as any);
      
      if (error) {
        console.error("Error creating cohort:", error);
        setSavingError(`Failed to create cohort: ${error.message || "Unknown error"}`);
        setIsSaving(false);
        return;
      }
      
      console.log("Cohort created successfully:", data);
      
      // 6. Fetch the updated class data to refresh local state
      const { data: refreshedClassData, error: refreshError } = await classService.getById(classId);
      
      if (refreshError) {
        console.error("Error refreshing class data:", refreshError);
        setSavingError("Cohort created, but failed to refresh class data. Please reload the page.");
        setIsSaving(false);
        return;
      }
      
      // 7. Update local state with the refreshed data
      if (refreshedClassData && refreshedClassData.cohorts) {
        // Using the imported utility function for local pattern value conversion
        
        // Convert the API cohort format back to our internal format
        const refreshedCohorts = refreshedClassData.cohorts.map((apiCohort: any) => {
          return {
            id: apiCohort.id,
            name: apiCohort.name,
            isActive: apiCohort.isActive,
            startDate: apiCohort.startDate ? new Date(apiCohort.startDate) : null,
            endDate: apiCohort.endDate ? new Date(apiCohort.endDate) : null,
            startTime: apiCohort.startTime,
            endTime: apiCohort.endTime,
            numberOfLessons: refreshedClassData.numberOfLessons || 1,
            price: apiCohort.price?.toString() || "",
            discount: apiCohort.discount?.toString() || "0",
            minStudents: apiCohort.minimumStudents,
            maxStudents: apiCohort.maximumStudents,
            enrollmentDeadline: apiCohort.enrollmentDeadline ? new Date(apiCohort.enrollmentDeadline) : null,
            hasFlexibleSchedule: apiCohort.customLessonTimes,
            repeatSchedule: {
              pattern: getLocalRepeatPatternValue(apiCohort.repeatPattern) || "weekly",
              repeatEvery: apiCohort.repeatEvery || 1,
              daysOfWeek: apiCohort.daysOfWeek?.map((day: string) => day.toLowerCase()) || []
            },
            lessonSchedules: []
          };
        });
        
        // Update form values with any other refreshed data as needed
        form.setValue("enableMultipleCohorts", refreshedClassData.enableMultipleCohorts);
        form.setValue("hasCohorts", refreshedClassData.enableMultipleCohorts);
        
        // Replace all cohorts with the refreshed data
        // Since we don't have a setCohorts function, we need to handle this differently
        // First remove all existing cohorts
        [...cohorts].forEach(cohort => {
          removeCohort(cohort.id);
        });
        
        // Then add each refreshed cohort one by one
        refreshedCohorts.forEach((cohort: CohortData) => {
          addCohort();
          
          // Get the ID of the newly added cohort
          const newCohortId = cohorts[cohorts.length - 1]?.id;
          if (newCohortId) {
            updateBasicCohortProperties(newCohortId, cohort);
          }
        });
      }
      
      // Reset loading state
      setIsSaving(false);
    } catch (error) {
      console.error("Error creating cohort:", error);
      setSavingError(`An error occurred while creating the cohort: ${error.message || "Unknown error"}`);
      setIsSaving(false);
    }
  };
  
  // Helper function to update all cohort properties using the available props
  const updateBasicCohortProperties = (cohortId: string, sourceCohort: CohortData) => {
    const cohortNumber = cohorts.length;
    const classTitle = form.getValues().title || "Class";
    
    // Update all the individual fields
    updateCohort(cohortId, "name", sourceCohort.name || (hasCohorts ? `${classTitle} Cohort ${cohortNumber}` : classTitle));
    updateCohort(cohortId, "startDate", sourceCohort.startDate);
    updateCohort(cohortId, "endDate", sourceCohort.endDate);
    updateCohort(cohortId, "startTime", sourceCohort.startTime);
    updateCohort(cohortId, "endTime", sourceCohort.endTime);
    updateCohort(cohortId, "price", sourceCohort.price);
    updateCohort(cohortId, "discount", sourceCohort.discount);
    updateCohort(cohortId, "isActive", sourceCohort.isActive);
    updateCohort(cohortId, "minStudents", sourceCohort.minStudents);
    updateCohort(cohortId, "maxStudents", sourceCohort.maxStudents);
    updateCohort(cohortId, "enrollmentDeadline", sourceCohort.enrollmentDeadline);
    updateCohort(cohortId, "hasFlexibleSchedule", sourceCohort.hasFlexibleSchedule);
    
    // Update repeat schedule
    updateRepeatSchedule(cohortId, "pattern", sourceCohort.repeatSchedule.pattern);
    updateRepeatSchedule(cohortId, "repeatEvery", sourceCohort.repeatSchedule.repeatEvery);
    
    // Set days of week one by one
    sourceCohort.repeatSchedule.daysOfWeek.forEach(day => {
      toggleDayOfWeek(cohortId, day);
    });
  };
  
  // Handle cohort update - new approach: send to API first, then update local state
  const handleUpdateCohort = async (updatedCohort: CohortData) => {
    if (!updatedCohort.id) return;
    
    console.log("Updating cohort with data:", updatedCohort);
    
    try {
      // Get class ID
      let classId = form.getValues("id");
      
      // If no class ID in form, try to extract it from URL
      if (!classId && window.location.pathname.includes('/teacher-class-setup/')) {
        const pathSegments = window.location.pathname.split('/');
        const potentialClassId = pathSegments[pathSegments.length - 1];
        if (potentialClassId && potentialClassId !== 'teacher-class-setup') {
          classId = potentialClassId;
          console.log("Using class ID from URL:", classId);
        }
      }
      
      // If still no class ID, we can't save cohort data yet
      if (!classId) {
        console.error("Cannot update cohort: No class ID available");
        setSavingError("Cannot update cohort: No class ID available.");
        return;
      }
      
      // Check if the cohort exists in the array
      if (!cohorts.some(c => c.id === updatedCohort.id)) {
        console.error("Cannot update cohort that doesn't exist in state:", updatedCohort.id);
        setSavingError("Cannot update cohort - not found in state");
        return;
      }
      
      // Set loading state
      setIsSaving(true);
      setSavingError(null);
      
      // 1. Format the updated cohort for API
      // Using the imported utility function for API pattern value conversion
      
      const formattedUpdatedCohort = {
        id: updatedCohort.id,
        name: updatedCohort.name || `Cohort ${updatedCohort.id}`,
        isActive: typeof updatedCohort.isActive === 'boolean' ? updatedCohort.isActive : true,
        startDate: updatedCohort.startDate,
        endDate: updatedCohort.endDate,
        startTime: updatedCohort.startTime || "",
        endTime: updatedCohort.endTime || "",
        repeatEvery: updatedCohort.repeatSchedule.repeatEvery || 1,
        repeatPattern: getApiRepeatPatternValue(updatedCohort.repeatSchedule.pattern || "weekly"),
        daysOfWeek: (updatedCohort.repeatSchedule.daysOfWeek || []).map(day => day.toUpperCase()),
        customLessonTimes: !!updatedCohort.hasFlexibleSchedule,
        minimumStudents: updatedCohort.minStudents || 1,
        maximumStudents: updatedCohort.maxStudents || 20,
        enrollmentDeadline: updatedCohort.enrollmentDeadline,
        price: parseFloat(updatedCohort.price) || 0,
        discount: parseFloat(updatedCohort.discount) || 0
      };
      
      // 2. Format and combine with other cohorts
      const formattedCohorts = cohorts.map(cohort => {
        if (!cohort || !cohort.repeatSchedule) {
          console.error("Invalid cohort data:", cohort);
          return null;
        }
        
        // If this is the cohort we're updating, use the updated data
        if (cohort.id === updatedCohort.id) {
          return formattedUpdatedCohort;
        }
        
        // Otherwise, use the existing cohort data
        return {
          id: cohort.id,
          name: cohort.name || `Cohort ${cohort.id}`,
          isActive: typeof cohort.isActive === 'boolean' ? cohort.isActive : true,
          startDate: cohort.startDate,
          endDate: cohort.endDate,
          startTime: cohort.startTime || "",
          endTime: cohort.endTime || "",
          repeatEvery: cohort.repeatSchedule.repeatEvery || 1,
          repeatPattern: getApiRepeatPatternValue(cohort.repeatSchedule.pattern || "weekly"),
          daysOfWeek: (cohort.repeatSchedule.daysOfWeek || []).map(day => day.toUpperCase()),
          customLessonTimes: !!cohort.hasFlexibleSchedule,
          minimumStudents: cohort.minStudents || 1,
          maximumStudents: cohort.maxStudents || 20,
          enrollmentDeadline: cohort.enrollmentDeadline,
          price: parseFloat(cohort.price) || 0,
          discount: parseFloat(cohort.discount) || 0
        };
      }).filter(cohort => cohort !== null);
      
      console.log("Sending updated cohorts to API:", formattedCohorts);
      
      // 3. Prepare class data for API
      const classData = {
        cohorts: formattedCohorts,
        enableMultipleCohorts: hasCohorts
      };
      
      // 4. Update the class via API
      const { data, error } = await classService.update(classId, classData as any);
      
      if (error) {
        console.error("Error updating cohort:", error);
        setSavingError(`Failed to update cohort: ${error.message || "Unknown error"}`);
        setIsSaving(false);
        return;
      }
      
      console.log("Cohort updated successfully:", data);
      
      // Clean up by clearing the edit ID
      setEditCohortId(null);
      
      // 5. Fetch the updated class data to refresh local state
      const { data: refreshedClassData, error: refreshError } = await classService.getById(classId);
      
      if (refreshError) {
        console.error("Error refreshing class data:", refreshError);
        setSavingError("Cohort updated, but failed to refresh class data. Please reload the page.");
        setIsSaving(false);
        return;
      }
      
      // 6. Update local state with the refreshed data
      if (refreshedClassData && refreshedClassData.cohorts) {
        // Using the imported utility function for local pattern value conversion
        
        // Convert the API cohort format back to our internal format
        const refreshedCohorts = refreshedClassData.cohorts.map((apiCohort: any) => {
          return {
            id: apiCohort.id,
            name: apiCohort.name,
            isActive: apiCohort.isActive,
            startDate: apiCohort.startDate ? new Date(apiCohort.startDate) : null,
            endDate: apiCohort.endDate ? new Date(apiCohort.endDate) : null,
            startTime: apiCohort.startTime,
            endTime: apiCohort.endTime,
            numberOfLessons: refreshedClassData.numberOfLessons || 1,
            price: apiCohort.price?.toString() || "",
            discount: apiCohort.discount?.toString() || "0",
            minStudents: apiCohort.minimumStudents,
            maxStudents: apiCohort.maximumStudents,
            enrollmentDeadline: apiCohort.enrollmentDeadline ? new Date(apiCohort.enrollmentDeadline) : null,
            hasFlexibleSchedule: apiCohort.customLessonTimes,
            repeatSchedule: {
              pattern: getLocalRepeatPatternValue(apiCohort.repeatPattern) || "weekly",
              repeatEvery: apiCohort.repeatEvery || 1,
              daysOfWeek: apiCohort.daysOfWeek?.map((day: string) => day.toLowerCase()) || []
            },
            lessonSchedules: []
          };
        });
        
        // Update form values
        form.setValue("enableMultipleCohorts", refreshedClassData.enableMultipleCohorts);
        form.setValue("hasCohorts", refreshedClassData.enableMultipleCohorts);
        
        // Replace all cohorts with the refreshed data
        // Since we don't have a setCohorts function, we need to handle this differently
        // First remove all existing cohorts
        [...cohorts].forEach(cohort => {
          removeCohort(cohort.id);
        });
        
        // Then add each refreshed cohort one by one
        refreshedCohorts.forEach((cohort: CohortData) => {
          addCohort();
          
          // Get the ID of the newly added cohort
          const newCohortId = cohorts[cohorts.length - 1]?.id;
          if (newCohortId) {
            updateBasicCohortProperties(newCohortId, cohort);
          }
        });
      }
      
      // Reset loading state
      setIsSaving(false);
    } catch (error) {
      console.error("Error updating cohort:", error);
      setSavingError(`An error occurred while updating the cohort: ${error.message || "Unknown error"}`);
      setIsSaving(false);
    }
  };
  
  // Save class details to API - updated to follow the new pattern (API first, then refresh local state)
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
      
      // Check if cohorts array is available
      const currentCohorts = [...cohorts]; // Make a fresh copy to ensure we have the latest
      console.log("Current cohorts before saving:", currentCohorts);
      
      if (!currentCohorts || currentCohorts.length === 0) {
        console.error("No cohorts available to save");
        setSavingError("No cohorts to save. Please create at least one cohort.");
        return;
      }
      
      setIsSaving(true);
      setSavingError(null);
      
      // 1. Format the cohort data for the API using a fresh copy
      // Using the imported utility function for API pattern value conversion
      
      const formattedCohorts = currentCohorts.map(cohort => {
        // Ensure we have valid values for all required fields
        if (!cohort || !cohort.repeatSchedule) {
          console.error("Invalid cohort data:", cohort);
          return null;
        }
        
        // Create a formatted cohort object with all necessary fields
        return {
          id: cohort.id,
          name: cohort.name || `Cohort ${cohort.id}`,
          isActive: typeof cohort.isActive === 'boolean' ? cohort.isActive : true,
          startDate: cohort.startDate,
          endDate: cohort.endDate,
          startTime: cohort.startTime || "",
          endTime: cohort.endTime || "",
          repeatEvery: cohort.repeatSchedule.repeatEvery || 1,
          repeatPattern: getApiRepeatPatternValue(cohort.repeatSchedule.pattern || "weekly"),
          daysOfWeek: (cohort.repeatSchedule.daysOfWeek || []).map(day => day.toUpperCase()),
          customLessonTimes: !!cohort.hasFlexibleSchedule,
          minimumStudents: cohort.minStudents || 1,
          maximumStudents: cohort.maxStudents || 20,
          enrollmentDeadline: cohort.enrollmentDeadline,
          price: parseFloat(cohort.price) || 0,
          discount: parseFloat(cohort.discount) || 0
        };
      }).filter(cohort => cohort !== null); // Remove any null entries
      
      console.log("Formatted cohorts for API:", formattedCohorts);
      
      if (formattedCohorts.length === 0) {
        console.error("No valid cohorts to save after formatting");
        setSavingError("Unable to save cohort data. Please try again or check console for details.");
        setIsSaving(false);
        return;
      }
      
      // 2. Prepare the data payload
      const classData = {
        cohorts: formattedCohorts,
        enableMultipleCohorts: hasCohorts
      };
      
      console.log("Sending data to API:", JSON.stringify(classData));
      
      // 3. Make the API call using the class service
      const { data, error } = await classService.update(classId, classData as any);
      
      if (error) {
        console.error("Error saving class details:", error);
        setSavingError(`Failed to save class data: ${error.message || "Unknown error"}`);
        setIsSaving(false);
        return;
      }
      
      console.log("Class details saved successfully:", data);
      
      // 4. Fetch the updated class data to refresh local state
      const { data: refreshedClassData, error: refreshError } = await classService.getById(classId);
      
      if (refreshError) {
        console.error("Error refreshing class data:", refreshError);
        setSavingError("Changes saved, but failed to refresh class data. Please reload the page.");
        setIsSaving(false);
        return;
      }
      
      // 5. Update local state with the refreshed data
      if (refreshedClassData && refreshedClassData.cohorts) {
        // Using the imported utility function for local pattern value conversion
        
        // Convert the API cohort format back to our internal format
        const refreshedCohorts = refreshedClassData.cohorts.map((apiCohort: any) => {
          return {
            id: apiCohort.id,
            name: apiCohort.name,
            isActive: apiCohort.isActive,
            startDate: apiCohort.startDate ? new Date(apiCohort.startDate) : null,
            endDate: apiCohort.endDate ? new Date(apiCohort.endDate) : null,
            startTime: apiCohort.startTime,
            endTime: apiCohort.endTime,
            numberOfLessons: refreshedClassData.numberOfLessons || 1,
            price: apiCohort.price?.toString() || "",
            discount: apiCohort.discount?.toString() || "0",
            minStudents: apiCohort.minimumStudents,
            maxStudents: apiCohort.maximumStudents,
            enrollmentDeadline: apiCohort.enrollmentDeadline ? new Date(apiCohort.enrollmentDeadline) : null,
            hasFlexibleSchedule: apiCohort.customLessonTimes,
            repeatSchedule: {
              pattern: getLocalRepeatPatternValue(apiCohort.repeatPattern) || "weekly",
              repeatEvery: apiCohort.repeatEvery || 1,
              daysOfWeek: apiCohort.daysOfWeek?.map((day: string) => day.toLowerCase()) || []
            },
            lessonSchedules: []
          };
        });
        
        // Update form values with any other refreshed data
        form.setValue("enableMultipleCohorts", refreshedClassData.enableMultipleCohorts);
        form.setValue("hasCohorts", refreshedClassData.enableMultipleCohorts);
        
        // Replace all cohorts with the refreshed data
        // First remove all existing cohorts
        [...cohorts].forEach(cohort => {
          removeCohort(cohort.id);
        });
        
        // Then add each refreshed cohort one by one
        refreshedCohorts.forEach((cohort: CohortData) => {
          addCohort();
          
          // Get the ID of the newly added cohort
          const newCohortId = cohorts[cohorts.length - 1]?.id;
          if (newCohortId) {
            updateBasicCohortProperties(newCohortId, cohort);
          }
        });
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
