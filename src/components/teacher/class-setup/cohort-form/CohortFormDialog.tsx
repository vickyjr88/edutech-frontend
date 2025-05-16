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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Info
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
  const [activeTab, setActiveTab] = useState("schedule");
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
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
  
  const updateRepeatSchedule = (field: keyof RepeatSchedule, value: any) => {
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
    setFormData(prev => {
      const daysOfWeek = [...prev.repeatSchedule.daysOfWeek];
      
      if (daysOfWeek.includes(day)) {
        // Don't allow removing the last day
        if (daysOfWeek.length === 1) {
          return prev;
        }
        
        return {
          ...prev,
          repeatSchedule: {
            ...prev.repeatSchedule,
            daysOfWeek: daysOfWeek.filter(d => d !== day)
          }
        };
      } else {
        // For twice-weekly pattern, limit to exactly 2 days
        if (prev.repeatSchedule.pattern === "twice-weekly" && daysOfWeek.length >= 2) {
          // Replace the first day
          daysOfWeek.shift();
        }
        
        return {
          ...prev,
          repeatSchedule: {
            ...prev.repeatSchedule,
            daysOfWeek: [...daysOfWeek, day]
          }
        };
      }
    });
    setIsDirty(true);
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
    
    // Validate tab-specific fields
    if (activeTab === "schedule" && (newErrors.name || newErrors.startDate || 
        newErrors.startTime || newErrors.endTime || newErrors.repeatPattern || 
        newErrors.daysOfWeek || newErrors.repeatEvery)) {
      // Schedule tab has errors
      setActiveTab("schedule");
    } else if (activeTab === "enrollment" && (newErrors.minStudents || 
               newErrors.maxStudents || newErrors.enrollmentDeadline)) {
      // Enrollment tab has errors
      setActiveTab("enrollment");
    } else if (activeTab === "pricing" && (newErrors.price || newErrors.discount)) {
      // Pricing tab has errors
      setActiveTab("pricing");
    } else if (Object.keys(newErrors).length > 0) {
      // If there are errors but we're not on the right tab, switch to the first tab with errors
      if (newErrors.name || newErrors.startDate || newErrors.startTime || 
          newErrors.endTime || newErrors.repeatPattern || newErrors.daysOfWeek || 
          newErrors.repeatEvery) {
        setActiveTab("schedule");
      } else if (newErrors.minStudents || newErrors.maxStudents || 
                 newErrors.enrollmentDeadline) {
        setActiveTab("enrollment");
      } else if (newErrors.price || newErrors.discount) {
        setActiveTab("pricing");
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onOpenChange(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className="flex items-center">
          {buttonIcon}
          {buttonText}
        </Button>
      </DialogTrigger>
      
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
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
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-grow overflow-hidden py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <TabsList className="w-full mb-4 grid grid-cols-3">
              <TabsTrigger value="schedule" className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="enrollment" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Enrollment
              </TabsTrigger>
              <TabsTrigger value="pricing" className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Pricing
              </TabsTrigger>
            </TabsList>
            
            <ScrollArea className="flex-grow pr-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="schedule" className="mt-0 space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cohort-name">Cohort Name <span className="text-red-500">*</span></Label>
                        <Input
                          id="cohort-name"
                          value={formData.name}
                          onChange={(e) => updateFormField("name", e.target.value)}
                          placeholder="Enter cohort name"
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Date <span className="text-red-500">*</span></Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left",
                                  !formData.startDate && "text-muted-foreground",
                                  errors.startDate && "border-red-500"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
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
                          {errors.startDate && <p className="text-red-500 text-xs">{errors.startDate}</p>}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Label>End Date (Auto-calculated)</Label>
                            <InfoIcon className="h-4 w-4 text-blue-500" />
                          </div>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left bg-gray-50"
                            disabled
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.endDate ? (
                              format(formData.endDate, "PPP")
                            ) : (
                              <span>Auto-calculated end date</span>
                            )}
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            Based on {totalNumberOfLessons} lessons and repeat pattern
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="start-time">Start Time <span className="text-red-500">*</span></Label>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <Input
                              id="start-time"
                              type="time"
                              value={formData.startTime}
                              onChange={(e) => updateFormField("startTime", e.target.value)}
                              className={errors.startTime ? "border-red-500" : ""}
                            />
                          </div>
                          {errors.startTime && <p className="text-red-500 text-xs">{errors.startTime}</p>}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="end-time">End Time <span className="text-red-500">*</span></Label>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <Input
                              id="end-time"
                              type="time"
                              value={formData.endTime}
                              onChange={(e) => updateFormField("endTime", e.target.value)}
                              className={errors.endTime ? "border-red-500" : ""}
                            />
                          </div>
                          {errors.endTime && <p className="text-red-500 text-xs">{errors.endTime}</p>}
                        </div>
                      </div>
                      
                      <div className="space-y-4 border rounded-md p-4 bg-gray-50">
                        <div className="flex items-center">
                          <Repeat className="h-4 w-4 mr-2 text-blue-500" />
                          <h5 className="text-sm font-medium">Repeating Schedule</h5>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label>Repeat Pattern</Label>
                            <RadioGroup 
                              value={formData.repeatSchedule.pattern} 
                              onValueChange={(value: "weekly" | "twice-weekly" | "custom") => 
                                updateRepeatSchedule("pattern", value)
                              }
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="weekly" id="weekly" />
                                <Label htmlFor="weekly" className="font-normal">Weekly (once a week)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="twice-weekly" id="twice-weekly" />
                                <Label htmlFor="twice-weekly" className="font-normal">Twice Weekly</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="custom" id="custom" />
                                <Label htmlFor="custom" className="font-normal">Custom Schedule</Label>
                              </div>
                            </RadioGroup>
                            {errors.repeatPattern && <p className="text-red-500 text-xs">{errors.repeatPattern}</p>}
                          </div>
                          
                          {formData.repeatSchedule.pattern === "custom" && (
                            <div className="space-y-2 pt-2">
                              <Label className="text-sm">Repeat Every</Label>
                              <div className="flex items-center space-x-2">
                                <Select
                                  value={formData.repeatSchedule.repeatEvery.toString()}
                                  onValueChange={(value) => 
                                    updateRepeatSchedule("repeatEvery", parseInt(value))
                                  }
                                >
                                  <SelectTrigger className={cn("w-32", errors.repeatEvery && "border-red-500")}>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">1 week</SelectItem>
                                    <SelectItem value="2">2 weeks</SelectItem>
                                    <SelectItem value="3">3 weeks</SelectItem>
                                    <SelectItem value="4">4 weeks</SelectItem>
                                  </SelectContent>
                                </Select>
                                {errors.repeatEvery && (
                                  <p className="text-xs text-red-500 mt-1">
                                    {errors.repeatEvery}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <div className="space-y-2 pt-2">
                            <Label className="text-sm">
                              {formData.repeatSchedule.pattern === "weekly" ? "Day of Week" :
                               formData.repeatSchedule.pattern === "twice-weekly" ? "Select Two Days" :
                               "Select Days"}
                            </Label>
                            <div className="grid grid-cols-4 gap-2">
                              {daysOfWeek.map((day) => (
                                <div key={day.value} className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`day-${day.value}`}
                                    checked={formData.repeatSchedule.daysOfWeek.includes(day.value)}
                                    onCheckedChange={() => toggleDayOfWeek(day.value)}
                                    className={cn(
                                      "data-[state=checked]:bg-blue-600",
                                      errors.daysOfWeek && "border-red-500"
                                    )}
                                  />
                                  <Label 
                                    htmlFor={`day-${day.value}`}
                                    className="font-normal text-sm"
                                  >
                                    {day.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                            {errors.daysOfWeek && (
                              <p className="text-xs text-red-500 mt-1">
                                {errors.daysOfWeek}
                              </p>
                            )}
                            {formData.repeatSchedule.pattern === "twice-weekly" && 
                             formData.repeatSchedule.daysOfWeek.length !== 2 && !errors.daysOfWeek && (
                              <p className="text-xs text-amber-600 mt-1">
                                Please select exactly two days for twice-weekly schedule
                              </p>
                            )}
                            {errors.repeatPattern && (
                              <p className="text-xs text-red-500 mt-1">
                                {errors.repeatPattern}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="cohort-active">Cohort Status</Label>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="cohort-active"
                              checked={formData.isActive}
                              onCheckedChange={(checked) => updateFormField("isActive", checked)}
                            />
                            <span className={`text-sm ${formData.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                              {formData.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Inactive cohorts won't accept new enrollments
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="enrollment" className="mt-0 space-y-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
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
                        
                        <div className="space-y-2">
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
                  </TabsContent>
                  
                  <TabsContent value="pricing" className="mt-0 space-y-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
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
                        
                        <div className="space-y-2">
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
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </ScrollArea>
          </Tabs>
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
            <Button onClick={handleSave}>
              {cohort ? "Update Cohort" : "Create Cohort"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CohortFormDialog;