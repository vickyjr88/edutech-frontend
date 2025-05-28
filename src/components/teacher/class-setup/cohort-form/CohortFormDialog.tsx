import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CohortData, RepeatSchedule } from "../types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlusCircle, 
  CalendarIcon, 
  Clock, 
  Users, 
  InfoIcon,
  Repeat,
  LifeBuoy,
  CreditCard,
  Info,
  Check
} from "lucide-react";

interface CohortFormDialogProps {
  cohort?: CohortData;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (cohort: CohortData) => void;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  totalNumberOfLessons: number;
  calculateEndDate: (startDate: Date | null, numberOfLessons: number, repeatSchedule: RepeatSchedule) => Date | null;
}

const defaultCohort: CohortData = {
  id: String(Date.now()),
  name: "",
  startDate: null,
  endDate: null,
  startTime: "",
  endTime: "",
  numberOfLessons: 1,
  price: "",
  discount: "0",
  isActive: true,
  lessonSchedules: [],
  hasFlexibleSchedule: false,
  repeatSchedule: {
    pattern: "weekly",
    daysOfWeek: ["monday"],
    repeatEvery: 1
  },
  minStudents: 1,
  maxStudents: 20,
  enrollmentDeadline: null
};

const daysOfWeek = [
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
  { label: "Friday", value: "friday" },
  { label: "Saturday", value: "saturday" },
  { label: "Sunday", value: "sunday" }
];

const CohortFormDialog: React.FC<CohortFormDialogProps> = ({
  cohort,
  isOpen,
  onOpenChange,
  onSave,
  title = "Cohort Details",
  description = "Configure your cohort details",
  buttonText = "Add Cohort",
  buttonIcon = <PlusCircle className="h-4 w-4 mr-2" />,
  buttonVariant = "default",
  totalNumberOfLessons,
  calculateEndDate
}) => {
  const [formData, setFormData] = useState<CohortData>(defaultCohort);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const steps = [
    { id: "schedule", title: "Schedule", icon: CalendarIcon },
    { id: "enrollment", title: "Enrollment", icon: Users },
    { id: "pricing", title: "Pricing", icon: CreditCard }
  ];
  
  // Reset form when dialog opens or cohort changes
  useEffect(() => {
    if (isOpen) {
      if (cohort) {
        // Edit mode - use provided cohort data
        setFormData(cohort);
      } else {
        // Create mode - use default values but with a new ID
        setFormData({
          ...defaultCohort,
          id: String(Date.now()),
          numberOfLessons: totalNumberOfLessons
        });
      }
      setCurrentStep(0);
      setIsDirty(false);
      setErrors({});
    }
  }, [isOpen, cohort, totalNumberOfLessons]);
  
  // Update end date when start date or repeat pattern changes
  useEffect(() => {
    if (formData.startDate) {
      const calculatedEndDate = calculateEndDate(
        formData.startDate,
        totalNumberOfLessons,
        formData.repeatSchedule
      );
      
      if (calculatedEndDate && (!formData.endDate || calculatedEndDate.getTime() !== formData.endDate.getTime())) {
        setFormData(prev => ({
          ...prev,
          endDate: calculatedEndDate
        }));
      }
    }
  }, [formData.startDate, formData.repeatSchedule, totalNumberOfLessons, calculateEndDate]);
  
  const updateFormField = (field: keyof CohortData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
    
    // Clear error for the field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  const updateRepeatScheduleField = (field: keyof RepeatSchedule, value: any) => {
    setFormData(prev => ({
      ...prev,
      repeatSchedule: {
        ...prev.repeatSchedule,
        [field]: value
      }
    }));
    setIsDirty(true);
  };
  
  const toggleDayOfWeek = (day: string) => {
    const currentDays = formData.repeatSchedule.daysOfWeek;
    const updatedDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    updateRepeatScheduleField("daysOfWeek", updatedDays);
  };
  
  // Validate individual step
  const validateStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (stepIndex === 0) { // Schedule step
      if (!formData.name) {
        newErrors.name = "Cohort name is required";
      }
      
      if (!formData.startDate) {
        newErrors.startDate = "Start date is required";
      }
      
      if (!formData.startTime) {
        newErrors.startTime = "Start time is required";
      }
      
      if (!formData.endTime) {
        newErrors.endTime = "End time is required";
      }
      
      // Time validation
      if (formData.startTime && formData.endTime) {
        const start = new Date(`2000-01-01T${formData.startTime}`);
        const end = new Date(`2000-01-01T${formData.endTime}`);
        
        if (start >= end) {
          newErrors.endTime = "End time must be after start time";
        }
      }
      
      // Pattern validation
      if (formData.repeatSchedule.pattern === "twice-weekly" && formData.repeatSchedule.daysOfWeek.length !== 2) {
        newErrors.repeatPattern = "Twice-weekly schedule requires exactly 2 days";
      }
      
      // Days of week validation
      if (formData.repeatSchedule.daysOfWeek.length === 0) {
        newErrors.daysOfWeek = "At least one day of the week must be selected";
      }
      
      // If custom pattern, ensure repeatEvery is valid
      if (formData.repeatSchedule.pattern === "custom" && 
          (formData.repeatSchedule.repeatEvery <= 0 || formData.repeatSchedule.repeatEvery > 4)) {
        newErrors.repeatEvery = "Repeat interval must be between 1 and 4 weeks";
      }
    }
    
    if (stepIndex === 1) { // Enrollment step
      if (formData.minStudents <= 0) {
        newErrors.minStudents = "Minimum students must be at least 1";
      }
      
      if (formData.maxStudents < formData.minStudents) {
        newErrors.maxStudents = "Maximum students must be greater than or equal to minimum students";
      }
      
      // Deadline validation
      if (formData.enrollmentDeadline && formData.startDate && 
          formData.enrollmentDeadline > formData.startDate) {
        newErrors.enrollmentDeadline = "Enrollment deadline should be on or before the start date";
      }
    }
    
    if (stepIndex === 2) { // Pricing step
      if (formData.price && isNaN(parseFloat(formData.price))) {
        newErrors.price = "Price must be a valid number";
      }
      
      if (formData.discount && (isNaN(parseFloat(formData.discount)) || parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100)) {
        newErrors.discount = "Discount must be a valid percentage (0-100)";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.name) {
      newErrors.name = "Cohort name is required";
    }
    
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }
    
    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    }
    
    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    }
    
    // Time validation
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      
      if (start >= end) {
        newErrors.endTime = "End time must be after start time";
      }
    }
    
    // Enrollment validation
    if (formData.minStudents <= 0) {
      newErrors.minStudents = "Minimum students must be at least 1";
    }
    
    if (formData.maxStudents < formData.minStudents) {
      newErrors.maxStudents = "Maximum students must be greater than or equal to minimum students";
    }
    
    // Price validation
    if (formData.price && isNaN(parseFloat(formData.price))) {
      newErrors.price = "Price must be a valid number";
    }
    
    // Discount validation
    if (formData.discount && (isNaN(parseFloat(formData.discount)) || parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100)) {
      newErrors.discount = "Discount must be a valid percentage (0-100)";
    }
    
    // Pattern validation
    if (formData.repeatSchedule.pattern === "twice-weekly" && formData.repeatSchedule.daysOfWeek.length !== 2) {
      newErrors.repeatPattern = "Twice-weekly schedule requires exactly 2 days";
    }
    
    // Days of week validation - ensure at least one day is selected
    if (formData.repeatSchedule.daysOfWeek.length === 0) {
      newErrors.daysOfWeek = "At least one day of the week must be selected";
    }
    
    // Deadline validation - if set, should be on or before start date
    if (formData.enrollmentDeadline && formData.startDate && 
        formData.enrollmentDeadline > formData.startDate) {
      newErrors.enrollmentDeadline = "Enrollment deadline should be on or before the start date";
    }
    
    // If custom pattern, ensure repeatEvery is valid
    if (formData.repeatSchedule.pattern === "custom" && 
        (formData.repeatSchedule.repeatEvery <= 0 || formData.repeatSchedule.repeatEvery > 4)) {
      newErrors.repeatEvery = "Repeat interval must be between 1 and 4 weeks";
    }
    
    // Navigate to first step with errors
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.name || newErrors.startDate || newErrors.startTime || 
          newErrors.endTime || newErrors.repeatPattern || newErrors.daysOfWeek || 
          newErrors.repeatEvery) {
        setCurrentStep(0); // Schedule step
      } else if (newErrors.minStudents || newErrors.maxStudents || 
                 newErrors.enrollmentDeadline) {
        setCurrentStep(1); // Enrollment step
      } else if (newErrors.price || newErrors.discount) {
        setCurrentStep(2); // Pricing step
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Final step - save the cohort
        handleSave();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      // Calculate the end date based on the start date, number of lessons, and repeat schedule
      const calculatedEndDate = calculateEndDate(formData.startDate, totalNumberOfLessons, formData.repeatSchedule);
      
      const finalCohort = {
        ...formData,
        endDate: calculatedEndDate,
        numberOfLessons: totalNumberOfLessons
      };
      
      onSave(finalCohort);
      onOpenChange(false);
      setIsDirty(false);
      
      // Reset form state
      setFormData(defaultCohort);
      setCurrentStep(0);
      setErrors({});
    }
  };
  
  const renderScheduleStep = () => (
    <div className="mt-0 space-y-8">
      <h3 className="text-xl font-semibold mb-8 text-gray-900">Schedule Details</h3>
      <div className="space-y-8">
        <div className="space-y-4">
          <Label htmlFor="cohort-name" className="text-base font-medium text-gray-700">
            Cohort Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="cohort-name"
            value={formData.name}
            onChange={(e) => updateFormField("name", e.target.value)}
            placeholder="Enter cohort name"
            className={cn("h-12 text-base", errors.name ? "border-red-500" : "")}
          />
          {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 h-6">
              <Label className="text-base font-medium text-gray-700">
                Start Date <span className="text-red-500">*</span>
              </Label>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left h-12 text-base",
                    !formData.startDate && "text-muted-foreground",
                    errors.startDate && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-3 h-5 w-5" />
                  {formData.startDate ? (
                    format(formData.startDate, "PPP")
                  ) : (
                    <span>Select start date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.startDate || undefined}
                  onSelect={(date) => updateFormField("startDate", date)}
                  className="p-3 pointer-events-auto"
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.startDate && <p className="text-red-500 text-sm mt-2">{errors.startDate}</p>}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2 h-6">
              <Label className="text-base font-medium text-gray-700">
                End Date (Auto-calculated)
              </Label>
              <InfoIcon className="h-4 w-4 text-blue-500" />
            </div>
            <Button
              variant="outline"
              className="w-full justify-start text-left h-12 text-base"
              disabled
            >
              <CalendarIcon className="mr-3 h-5 w-5" />
              {formData.endDate ? (
                format(formData.endDate, "PPP")
              ) : (
                <span>Will be calculated</span>
              )}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <Label htmlFor="start-time" className="text-base font-medium text-gray-700">
              Start Time <span className="text-red-500">*</span>
            </Label>
            <Input
              id="start-time"
              type="time"
              value={formData.startTime}
              onChange={(e) => updateFormField("startTime", e.target.value)}
              className={cn("h-12 text-base", errors.startTime ? "border-red-500" : "")}
            />
            {errors.startTime && <p className="text-red-500 text-sm mt-2">{errors.startTime}</p>}
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="end-time" className="text-base font-medium text-gray-700">
              End Time <span className="text-red-500">*</span>
            </Label>
            <Input
              id="end-time"
              type="time"
              value={formData.endTime}
              onChange={(e) => updateFormField("endTime", e.target.value)}
              className={cn("h-12 text-base", errors.endTime ? "border-red-500" : "")}
            />
            {errors.endTime && <p className="text-red-500 text-sm mt-2">{errors.endTime}</p>}
          </div>
        </div>
        
        <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
          <div className="space-y-4">
            <Label className="text-base font-medium text-gray-700">
              Repeat Pattern <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={formData.repeatSchedule.pattern}
              onValueChange={(value) => updateRepeatScheduleField("pattern", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-3 border rounded-lg bg-white">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly" className="text-base cursor-pointer">Weekly</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg bg-white">
                <RadioGroupItem value="twice-weekly" id="twice-weekly" />
                <Label htmlFor="twice-weekly" className="text-base cursor-pointer">Twice Weekly</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg bg-white">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="text-base cursor-pointer">Custom</Label>
              </div>
            </RadioGroup>
            {errors.repeatPattern && <p className="text-red-500 text-sm mt-2">{errors.repeatPattern}</p>}
          </div>
          
          {formData.repeatSchedule.pattern === "custom" && (
            <div className="space-y-4">
              <Label htmlFor="repeat-every" className="text-base font-medium text-gray-700">
                Repeat Every (weeks)
              </Label>
              <Select
                value={formData.repeatSchedule.repeatEvery.toString()}
                onValueChange={(value) => updateRepeatScheduleField("repeatEvery", parseInt(value))}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 week</SelectItem>
                  <SelectItem value="2">2 weeks</SelectItem>
                  <SelectItem value="3">3 weeks</SelectItem>
                  <SelectItem value="4">4 weeks</SelectItem>
                </SelectContent>
              </Select>
              {errors.repeatEvery && <p className="text-red-500 text-sm mt-2">{errors.repeatEvery}</p>}
            </div>
          )}
          
          <div className="space-y-6">
            <Label className="text-base font-medium text-gray-700">
              Days of Week <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-3">
              {daysOfWeek.map((day) => {
                const isSelected = formData.repeatSchedule.daysOfWeek.includes(day.value);
                return (
                  <div 
                    key={day.value} 
                    className={cn(
                      "relative cursor-pointer transition-all duration-200 rounded-lg border-2 p-4 hover:shadow-sm",
                      isSelected 
                        ? "border-blue-500 bg-blue-50 shadow-sm" 
                        : "border-gray-200 bg-white hover:border-gray-300"
                    )}
                    onClick={() => toggleDayOfWeek(day.value)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                          isSelected 
                            ? "border-blue-500 bg-blue-500" 
                            : "border-gray-300"
                        )}>
                          {isSelected && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <Label 
                          htmlFor={day.value} 
                          className={cn(
                            "text-base font-medium cursor-pointer transition-colors",
                            isSelected ? "text-blue-700" : "text-gray-700"
                          )}
                        >
                          {day.label}
                        </Label>
                      </div>
                      {isSelected && (
                        <div className="text-blue-500 text-sm font-medium">
                          Selected
                        </div>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      id={day.value}
                      checked={isSelected}
                      onChange={() => toggleDayOfWeek(day.value)}
                      className="sr-only"
                    />
                  </div>
                );
              })}
            </div>
            {errors.daysOfWeek && <p className="text-red-500 text-sm mt-2">{errors.daysOfWeek}</p>}
          </div>
        </div>
        
        <div className="space-y-4 bg-blue-50 p-6 rounded-lg border border-blue-100">
          <Label htmlFor="cohort-active" className="text-base font-medium text-gray-700">
            Cohort Status
          </Label>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <Switch
                  id="cohort-active"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => updateFormField("isActive", checked)}
                />
                <span className={`text-base font-medium ${formData.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                  {formData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Inactive cohorts won't accept new enrollments
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEnrollmentStep = () => (
    <div className="mt-0 space-y-6">
      <h3 className="text-lg font-medium mb-6">Enrollment Settings</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label htmlFor="min-students">Minimum Students <span className="text-red-500">*</span></Label>
            <Input
              id="min-students"
              type="number"
              min="1"
              value={formData.minStudents}
              onChange={(e) => updateFormField("minStudents", parseInt(e.target.value) || 1)}
              className={errors.minStudents ? "border-red-500" : ""}
            />
            <p className="text-xs text-muted-foreground">
              Minimum number of students needed for the class to run
            </p>
            {errors.minStudents && <p className="text-red-500 text-xs">{errors.minStudents}</p>}
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="max-students">Maximum Students <span className="text-red-500">*</span></Label>
            <Input
              id="max-students"
              type="number"
              min={formData.minStudents}
              value={formData.maxStudents}
              onChange={(e) => updateFormField("maxStudents", parseInt(e.target.value) || formData.minStudents)}
              className={errors.maxStudents ? "border-red-500" : ""}
            />
            <p className="text-xs text-muted-foreground">
              Maximum enrollment capacity for this cohort
            </p>
            {errors.maxStudents && <p className="text-red-500 text-xs">{errors.maxStudents}</p>}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Enrollment Deadline</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left",
                  !formData.enrollmentDeadline && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.enrollmentDeadline ? (
                  format(formData.enrollmentDeadline, "PPP")
                ) : (
                  <span>Set enrollment deadline</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.enrollmentDeadline || undefined}
                onSelect={(date) => updateFormField("enrollmentDeadline", date)}
                className="p-3 pointer-events-auto"
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <p className="text-xs text-muted-foreground">
            Last day students can enroll in this cohort
          </p>
          {errors.enrollmentDeadline && (
            <p className="text-red-500 text-xs mt-1">
              {errors.enrollmentDeadline}
            </p>
          )}
          {formData.enrollmentDeadline && formData.startDate && 
           formData.enrollmentDeadline > formData.startDate && !errors.enrollmentDeadline && (
            <p className="text-amber-600 text-xs flex items-center mt-1">
              <InfoIcon className="h-3 w-3 mr-1" />
              Warning: Deadline is after start date
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderPricingStep = () => (
    <div className="mt-0 space-y-6">
      <h3 className="text-lg font-medium mb-6">Pricing Information</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label htmlFor="cohort-price">Price for Entire Class</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
              <Input
                id="cohort-price"
                className={cn("pl-7", errors.price && "border-red-500")}
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => updateFormField("price", e.target.value)}
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Total price for all {totalNumberOfLessons} lessons
            </p>
            {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="cohort-discount">Discount (%)</Label>
            <Input
              id="cohort-discount"
              type="number"
              min="0"
              max="100"
              value={formData.discount}
              onChange={(e) => updateFormField("discount", e.target.value)}
              placeholder="0"
              className={errors.discount ? "border-red-500" : ""}
            />
            <p className="text-xs text-muted-foreground">
              Discount percentage for siblings, friends, or early enrollment
            </p>
            {errors.discount && <p className="text-red-500 text-xs">{errors.discount}</p>}
          </div>
        </div>
        
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
          <div className="flex items-center">
            <Info className="h-4 w-4 mr-2 text-blue-600" />
            <h3 className="text-sm font-medium text-blue-800">Pricing Information</h3>
          </div>
          <p className="ml-6 mt-1 text-sm text-blue-700">
            Setting the right price can help attract students while ensuring your time is valued.
            Consider your expertise, preparation time, and the value your students will receive.
          </p>
        </div>
      </div>
    </div>
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className="flex items-center">
          {buttonIcon}
          {buttonText}
        </Button>
      </DialogTrigger>
      
      <DialogContent
        className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
        onEscapeKeyDown={(e) => {
          // Prevent escape from closing if dirty
          if (isDirty) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          // Prevent outside click from closing if dirty
          if (isDirty) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            {cohort ? "Edit Cohort" : "Create New Cohort"}
          </DialogTitle>
          <DialogDescription>
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
          </DialogDescription>
        </DialogHeader>
        
        {/* Progress indicator */}
        <div className="px-6 py-2">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                    index <= currentStep
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "border-gray-300 text-gray-400"
                  )}
                >
                  {index < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                </div>
              );
            })}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="flex-grow overflow-hidden py-4">
          <ScrollArea className="h-full">
            <div className="px-8 py-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {currentStep === 0 && renderScheduleStep()}
                {currentStep === 1 && renderEnrollmentStep()}
                {currentStep === 2 && renderPricingStep()}
              </motion.div>
            </AnimatePresence>
            </div>
          </ScrollArea>
        </div>
        
        <DialogFooter className="pt-4 border-t flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-auto flex items-center text-sm">
              <CalendarIcon className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span className="text-muted-foreground">
                {totalNumberOfLessons} lessons
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (isDirty) {
                  if (confirm("Discard changes?")) {
                    onOpenChange(false);
                  }
                } else {
                  onOpenChange(false);
                }
              }}
            >
              Cancel
            </Button>
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 
                ? (cohort ? "Update Cohort" : "Create Cohort")
                : "Next"
              }
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CohortFormDialog;