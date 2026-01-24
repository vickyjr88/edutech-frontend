import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  PlusCircle,
  CalendarIcon,
  Clock,
  Users,
  InfoIcon,
  Info,
  Settings,
  DollarSign,
  BookOpen,
  Globe,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Calendar as CalendarHeart
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
    daysOfWeek: [],
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
  buttonText = "Add Cohort",
  buttonIcon = <PlusCircle className="h-4 w-4 mr-2" />,
  buttonVariant = "default",
  totalNumberOfLessons,
  calculateEndDate
}) => {
  const [formData, setFormData] = useState<CohortData>(defaultCohort);
  const [activeSection, setActiveSection] = useState("basic");
  const [timezone, setTimezone] = useState("EAT");
  const [cohortDescription, setCohortDescription] = useState("");
  const [scheduleTemplate, setScheduleTemplate] = useState("");
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [dailySchedules, setDailySchedules] = useState<Record<string, { enabled: boolean; startTime: string; endTime: string; duration: number }>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sections = [
    { id: "basic", title: "Cohort Details", icon: Settings, description: "Set up the basic information for your cohort" },
    { id: "schedule", title: "Class Schedule", icon: CalendarIcon, description: "Define when and how often your cohort meets" },
    { id: "enrollment", title: "Student Enrollment", icon: Users, description: "Set enrollment limits and deadlines" },
    { id: "pricing", title: "Course Pricing", icon: DollarSign, description: "Set the cost and any discounts for this cohort" },
    { id: "sessions", title: "Session Planning", icon: BookOpen, description: "Plan your class dates and virtual meeting setup" }
  ];

  // Initialize daily schedules for each day
  useEffect(() => {
    const initialSchedules: Record<string, { enabled: boolean; startTime: string; endTime: string; duration: number }> = {};
    daysOfWeek.forEach(day => {
      initialSchedules[day.value] = {
        enabled: false,
        startTime: "09:00",
        endTime: "10:00",
        duration: 60
      };
    });
    setDailySchedules(initialSchedules);
  }, []);

  // Reset form when dialog opens or cohort changes
  useEffect(() => {
    if (isOpen) {
      if (cohort) {
        // Edit mode - use provided cohort data
        setFormData(cohort);
        setCohortDescription(cohort.name || "");
      } else {
        // Create mode - use default values but with a new ID
        setFormData({
          ...defaultCohort,
          id: String(Date.now()),
          numberOfLessons: totalNumberOfLessons
        });
        setCohortDescription("");
      }
      setActiveSection("basic");
      setIsDirty(false);
      setErrors({});
    }
  }, [isOpen, cohort, totalNumberOfLessons]);

  // Calculate weekly hours based on daily schedules
  useEffect(() => {
    const totalHours = Object.values(dailySchedules)
      .filter(schedule => schedule.enabled)
      .reduce((total, schedule) => total + (schedule.duration / 60), 0);
    setWeeklyHours(totalHours);
  }, [dailySchedules]);

  // Calculate end date when needed, not in useEffect to avoid infinite loop
  const calculatedEndDate = formData.startDate ?
    calculateEndDate(formData.startDate, totalNumberOfLessons, formData.repeatSchedule) :
    null;

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

  const updateDailySchedule = (day: string, field: string, value: any) => {
    setDailySchedules(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
        ...(field === 'startTime' || field === 'endTime' ? {
          duration: calculateDuration(field === 'startTime' ? value : prev[day].startTime, field === 'endTime' ? value : prev[day].endTime)
        } : {})
      }
    }));
    setIsDirty(true);
  };

  const calculateDuration = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60)); // duration in minutes
  };

  const applyScheduleTemplate = (template: string) => {
    const templates = {
      "weekday-morning": {
        days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        startTime: "09:00",
        endTime: "11:00"
      },
      "evening": {
        days: ["monday", "wednesday", "friday"],
        startTime: "18:00",
        endTime: "20:00"
      },
      "weekend": {
        days: ["saturday", "sunday"],
        startTime: "09:00",
        endTime: "17:00"
      }
    };

    const templateConfig = templates[template as keyof typeof templates];
    if (templateConfig) {
      const newSchedules = { ...dailySchedules };
      Object.keys(newSchedules).forEach(day => {
        newSchedules[day] = {
          enabled: templateConfig.days.includes(day),
          startTime: templateConfig.startTime,
          endTime: templateConfig.endTime,
          duration: calculateDuration(templateConfig.startTime, templateConfig.endTime)
        };
      });
      setDailySchedules(newSchedules);
      updateRepeatScheduleField("daysOfWeek", templateConfig.days);
      setScheduleTemplate(template);
    }
  };

  // Section completion tracking - memoized to prevent unnecessary re-renders
  const completionStatus = useMemo(() => {
    return {
      basic: !!(formData.name && timezone),
      schedule: !!(formData.startDate && formData.repeatSchedule.daysOfWeek.length > 0 && weeklyHours > 0),
      enrollment: !!(formData.minStudents && formData.maxStudents),
      pricing: !!(formData.price && parseFloat(formData.price) > 0),
      sessions: !!(formData.startDate && calculatedEndDate)
    };
  }, [formData.name, timezone, formData.startDate, formData.repeatSchedule.daysOfWeek.length, weeklyHours, formData.minStudents, formData.maxStudents, formData.price, calculatedEndDate]);

  const completedSections = Object.values(completionStatus).filter(Boolean).length;
  const completionPercentage = (completedSections / sections.length) * 100;

  // Validate individual section without updating errors state (to prevent infinite loops)
  const isValidSection = useCallback((sectionId: string): boolean => {
    if (sectionId === "basic") {
      return !!(formData.name);
    }

    if (sectionId === "schedule") {
      return !!(formData.startDate && formData.repeatSchedule.daysOfWeek.length > 0 &&
        !(formData.repeatSchedule.pattern === "twice-weekly" && formData.repeatSchedule.daysOfWeek.length !== 2) &&
        !(formData.repeatSchedule.pattern === "custom" &&
          (formData.repeatSchedule.repeatEvery <= 0 || formData.repeatSchedule.repeatEvery > 4)));
    }

    if (sectionId === "enrollment") {
      return !!(formData.minStudents > 0 && formData.maxStudents >= formData.minStudents &&
        !(formData.enrollmentDeadline && formData.startDate &&
          formData.enrollmentDeadline > formData.startDate));
    }

    if (sectionId === "pricing") {
      return !!(formData.price && !isNaN(parseFloat(formData.price)) &&
        (!formData.discount || (!isNaN(parseFloat(formData.discount)) && parseFloat(formData.discount) >= 0 && parseFloat(formData.discount) <= 100)));
    }

    return true;
  }, [formData.name, formData.startDate, formData.repeatSchedule.daysOfWeek.length, formData.repeatSchedule.pattern, formData.repeatSchedule.repeatEvery, formData.minStudents, formData.maxStudents, formData.enrollmentDeadline, formData.price, formData.discount]);

  // Validate individual section and update errors (only called when explicitly validating)
  const validateSection = (sectionId: string): boolean => {
    const newErrors: Record<string, string> = {};

    if (sectionId === "basic") {
      if (!formData.name) {
        newErrors.name = "Cohort name is required";
      }
    }

    if (sectionId === "schedule") {
      if (!formData.startDate) {
        newErrors.startDate = "Start date is required";
      }

      if (formData.repeatSchedule.daysOfWeek.length === 0) {
        newErrors.daysOfWeek = "At least one day of the week must be selected";
      }

      // Pattern validation
      if (formData.repeatSchedule.pattern === "twice-weekly" && formData.repeatSchedule.daysOfWeek.length !== 2) {
        newErrors.repeatPattern = "Twice-weekly schedule requires exactly 2 days";
      }

      // If custom pattern, ensure repeatEvery is valid
      if (formData.repeatSchedule.pattern === "custom" &&
        (formData.repeatSchedule.repeatEvery <= 0 || formData.repeatSchedule.repeatEvery > 4)) {
        newErrors.repeatEvery = "Repeat interval must be between 1 and 4 weeks";
      }
    }

    if (sectionId === "enrollment") {
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

    if (sectionId === "pricing") {
      if (!formData.price || isNaN(parseFloat(formData.price))) {
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
    return sections.every(section => validateSection(section.id));
  };

  const handleNext = () => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (validateSection(activeSection)) {
      if (currentIndex < sections.length - 1) {
        setActiveSection(sections[currentIndex + 1].id);
      } else {
        // Final section - save the cohort
        handleSave();
      }
    }
  };

  const handlePrevious = () => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1].id);
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
      setActiveSection("basic");
      setErrors({});
      setCohortDescription("");
      setTimezone("EAT");
      setScheduleTemplate("");
      setWeeklyHours(0);
    }
  };

  // SECTION 1: BASIC INFORMATION
  const renderBasicSection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-kidato-indigo-500 to-kidato-indigo-600 rounded-2xl shadow-lg">
          <Settings className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-kidato-indigo-800">Cohort Details</h3>
          <p className="text-sm text-gray-600">Set up the basic information for your cohort</p>
        </div>
      </div>

      <div className="space-y-6 p-6 bg-gradient-to-br from-kidato-indigo-50 to-white rounded-2xl border border-kidato-indigo-200 shadow-sm">
        <div className="space-y-4">
          <Label htmlFor="cohort-name" className="text-lg font-semibold text-kidato-indigo-800">
            Cohort Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="cohort-name"
            value={formData.name}
            onChange={(e) => updateFormField("name", e.target.value)}
            placeholder="e.g., Advanced Python - Fall 2025"
            className={cn("h-12 text-base border-2 border-kidato-indigo-200 focus:border-kidato-indigo-500 focus:ring-kidato-indigo-500 rounded-xl bg-white shadow-sm", errors.name ? "border-red-500" : "")}
          />
          {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label className="text-base font-medium text-kidato-indigo-700">Status</Label>
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-kidato-indigo-200">
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => updateFormField("isActive", checked)}
                  />
                  <span className={`text-base font-medium ${formData.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Inactive cohorts won't accept new enrollments
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium text-kidato-indigo-700">Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger className="h-12 border-2 border-kidato-indigo-200 focus:border-kidato-indigo-500 focus:ring-kidato-indigo-500 rounded-xl bg-white">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-kidato-indigo-600" />
                  <SelectValue placeholder="Select timezone" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EAT">East Africa Time (EAT)</SelectItem>
                <SelectItem value="UTC">Coordinated Universal Time (UTC)</SelectItem>
                <SelectItem value="EST">Eastern Standard Time (EST)</SelectItem>
                <SelectItem value="PST">Pacific Standard Time (PST)</SelectItem>
                <SelectItem value="GMT">Greenwich Mean Time (GMT)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium text-kidato-indigo-700">Description (Optional)</Label>
          <Textarea
            value={cohortDescription}
            onChange={(e) => setCohortDescription(e.target.value)}
            placeholder="Brief overview of this cohort - what makes it special, who it's for, etc."
            className="border-2 border-kidato-indigo-200 focus:border-kidato-indigo-500 focus:ring-kidato-indigo-500 rounded-xl bg-white"
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  // SECTION 3: ENROLLMENT & CAPACITY
  const renderEnrollmentSection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
          <Users className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-emerald-800">Student Enrollment</h3>
          <p className="text-sm text-gray-600">Set enrollment limits and deadlines</p>
        </div>
      </div>

      <div className="space-y-6 p-6 bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-200 shadow-sm">
        {/* Class Size Range */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-emerald-800">Class Size Range</Label>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="min-students" className="text-base font-medium text-gray-700">
                Minimum Students <span className="text-red-500">*</span>
              </Label>
              <Input
                id="min-students"
                type="number"
                min="1"
                value={formData.minStudents}
                onChange={(e) => updateFormField("minStudents", parseInt(e.target.value) || 1)}
                className={cn("h-12 text-base border-2 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl", errors.minStudents ? "border-red-500" : "")}
              />
              <p className="text-sm text-gray-600">
                Minimum number of students needed for the class to run
              </p>
              {errors.minStudents && <p className="text-red-500 text-sm">{errors.minStudents}</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="max-students" className="text-base font-medium text-gray-700">
                Maximum Students <span className="text-red-500">*</span>
              </Label>
              <Input
                id="max-students"
                type="number"
                min={formData.minStudents}
                value={formData.maxStudents}
                onChange={(e) => updateFormField("maxStudents", parseInt(e.target.value) || formData.minStudents)}
                className={cn("h-12 text-base border-2 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl", errors.maxStudents ? "border-red-500" : "")}
              />
              <p className="text-sm text-gray-600">
                Maximum enrollment capacity for this cohort
              </p>
              {errors.maxStudents && <p className="text-red-500 text-sm">{errors.maxStudents}</p>}
            </div>
          </div>

          {/* Capacity Indicator */}
          <div className="p-4 bg-white rounded-lg border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Current Enrollment</span>
              <span className="text-sm text-gray-600">0/{formData.maxStudents} students</span>
            </div>
            <Progress value={0} className="h-2" />
            <div className="mt-2 text-xs text-gray-600">
              Class will run with minimum {formData.minStudents} student{formData.minStudents !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Enrollment Deadline */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-emerald-800">Enrollment Deadline</Label>
          <div className="space-y-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left h-12 text-base border-2 border-emerald-200 focus:border-emerald-500",
                    !formData.enrollmentDeadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-3 h-5 w-5" />
                  {formData.enrollmentDeadline ? (
                    format(formData.enrollmentDeadline, "PPP")
                  ) : (
                    <span>Set enrollment deadline (optional)</span>
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
            <p className="text-sm text-gray-600">
              Last day students can enroll in this cohort
            </p>
            {errors.enrollmentDeadline && (
              <p className="text-red-500 text-sm mt-2">
                {errors.enrollmentDeadline}
              </p>
            )}
            {formData.enrollmentDeadline && formData.startDate &&
              formData.enrollmentDeadline > formData.startDate && !errors.enrollmentDeadline && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <p className="text-amber-700 text-sm">
                    Warning: Deadline is after start date
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );

  // SECTION 4: PRICING & FEES
  const renderPricingSection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
          <DollarSign className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-purple-800">Course Pricing</h3>
          <p className="text-sm text-gray-600">Set the cost and any discounts for this cohort</p>
        </div>
      </div>

      <div className="space-y-6 p-6 bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-200 shadow-sm">
        {/* Currency and Price */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-purple-800">Course Pricing</Label>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="cohort-currency" className="text-base font-medium text-gray-700">
                Currency <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.currency || 'KES'}
                onValueChange={(val) => updateFormField("currency", val)}
              >
                <SelectTrigger id="cohort-currency" className="h-12 border-2 border-purple-200 focus:border-purple-500 rounded-xl bg-white">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KES">Kenyan Shilling (KES)</SelectItem>
                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                  <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="cohort-price" className="text-base font-medium text-gray-700">
                Price for Entire Course ({formData.currency || 'KES'}) <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-gray-500 text-base">{formData.currency || 'KES'}</span>
                <Input
                  id="cohort-price"
                  className={cn("pl-16 h-12 text-base border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl", errors.price && "border-red-500")}
                  type="number"
                  min="0"
                  step="1"
                  value={formData.price}
                  onChange={(e) => updateFormField("price", e.target.value)}
                  placeholder="1000"
                />
              </div>
              <p className="text-sm text-gray-600">
                Total price for all {totalNumberOfLessons} lessons
              </p>
              {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="cohort-discount" className="text-base font-medium text-gray-700">
              Discount (%)
            </Label>
            <Input
              id="cohort-discount"
              type="number"
              min="0"
              max="100"
              value={formData.discount}
              onChange={(e) => updateFormField("discount", e.target.value)}
              placeholder="10"
              className={cn("h-12 text-base border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl", errors.discount ? "border-red-500" : "")}
            />
            <p className="text-sm text-gray-600">
              Discount for siblings, friends, or early enrollment
            </p>
            {errors.discount && <p className="text-red-500 text-sm">{errors.discount}</p>}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="p-6 bg-white rounded-2xl border border-purple-200 shadow-sm">
          <h4 className="text-lg font-semibold text-purple-800 mb-4">Pricing Summary</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Price per lesson:</span>
              <span className="font-medium">{formData.currency || 'KES'} {formData.price ? (parseFloat(formData.price) / totalNumberOfLessons).toFixed(0) : '0'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total lessons:</span>
              <span className="font-medium">{totalNumberOfLessons}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-medium">{formData.currency || 'KES'} {formData.price || '0'}</span>
            </div>
            {formData.discount && parseFloat(formData.discount) > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Discount ({formData.discount}%):</span>
                <span className="font-medium text-red-600">- {formData.currency || 'KES'} {formData.price ? ((parseFloat(formData.price) * parseFloat(formData.discount)) / 100).toFixed(0) : '0'}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between items-center text-lg">
              <span className="font-bold text-purple-800">Final Course Price:</span>
              <span className="font-bold text-purple-800">
                {formData.currency || 'KES'} {formData.price ? (parseFloat(formData.price) - ((parseFloat(formData.price) * parseFloat(formData.discount || '0')) / 100)).toFixed(0) : '0'}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Tips */}
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-blue-600" />
            <h4 className="text-sm font-medium text-blue-800">Pricing Tips</h4>
          </div>
          <p className="text-sm text-blue-700">
            Setting the right price can help attract students while ensuring your time is valued.
            Consider your expertise, preparation time, and the value your students will receive.
          </p>
        </div>
      </div>
    </div>
  );

  // SECTION 2: SCHEDULE & TIMING
  const renderScheduleSection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
          <CalendarIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-blue-800">Class Schedule</h3>
          <p className="text-sm text-gray-600">Define when and how often your cohort meets</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Quick Schedule Templates */}
        <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-200 shadow-sm">
          <Label className="text-lg font-semibold text-blue-800">Quick Time Templates</Label>
          <p className="text-sm text-gray-600">Choose a common schedule pattern to get started quickly</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              type="button"
              variant={scheduleTemplate === "weekday-morning" ? "default" : "outline"}
              onClick={() => applyScheduleTemplate("weekday-morning")}
              className="h-auto p-4 flex flex-col items-start gap-2 text-left"
            >
              <div className="font-medium">Weekday Mornings</div>
              <div className="text-xs text-muted-foreground">Mon-Fri, 9am-11am</div>
            </Button>
            <Button
              type="button"
              variant={scheduleTemplate === "evening" ? "default" : "outline"}
              onClick={() => applyScheduleTemplate("evening")}
              className="h-auto p-4 flex flex-col items-start gap-2 text-left"
            >
              <div className="font-medium">Evening Classes</div>
              <div className="text-xs text-muted-foreground">Mon/Wed/Fri, 6pm-8pm</div>
            </Button>
            <Button
              type="button"
              variant={scheduleTemplate === "weekend" ? "default" : "outline"}
              onClick={() => applyScheduleTemplate("weekend")}
              className="h-auto p-4 flex flex-col items-start gap-2 text-left"
            >
              <div className="font-medium">Weekend Intensive</div>
              <div className="text-xs text-muted-foreground">Sat/Sun, 9am-5pm</div>
            </Button>
          </div>
        </div>

        {/* Start & End Dates */}
        <div className="space-y-4 p-6 bg-white rounded-2xl border border-blue-200 shadow-sm">
          <Label className="text-lg font-semibold text-blue-800">Course Timeline</Label>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-base font-medium text-gray-700">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left h-12 text-base border-2 border-blue-200 focus:border-blue-500",
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

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="text-base font-medium text-gray-700">
                  End Date (Auto-calculated)
                </Label>
                <InfoIcon className="h-4 w-4 text-blue-500" />
              </div>
              <Button
                variant="outline"
                className="w-full justify-start text-left h-12 text-base border-2 border-gray-200"
                disabled
              >
                <CalendarIcon className="mr-3 h-5 w-5" />
                {formData.endDate ? (
                  format(formData.endDate, "PPP")
                ) : (
                  <span>Will be calculated based on schedule</span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Weekly Schedule Builder */}
        <div className="space-y-4 p-6 bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-lg font-semibold text-green-800">Weekly Schedule Builder</Label>
              <p className="text-sm text-gray-600 mt-1">Select days and set specific times for each day</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Total weekly hours:</div>
              <div className="text-lg font-bold text-green-600">{weeklyHours.toFixed(1)} hours</div>
            </div>
          </div>

          <div className="space-y-3">
            {daysOfWeek.map((day) => {
              const schedule = dailySchedules[day.value] || { enabled: false, startTime: "09:00", endTime: "10:00", duration: 60 };
              const isSelected = formData.repeatSchedule.daysOfWeek.includes(day.value);

              return (
                <div
                  key={day.value}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg border-2 transition-all",
                    isSelected
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => {
                        toggleDayOfWeek(day.value);
                        updateDailySchedule(day.value, "enabled", !schedule.enabled);
                      }}
                      className="w-5 h-5"
                    />
                    <Label className={cn("text-base font-medium w-20", isSelected ? "text-green-700" : "text-gray-700")}>
                      {day.label}
                    </Label>
                  </div>

                  {isSelected && (
                    <div className="flex items-center gap-3">
                      <Input
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) => updateDailySchedule(day.value, "startTime", e.target.value)}
                        className="w-24 h-8 text-sm"
                      />
                      <span className="text-gray-500">to</span>
                      <Input
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) => updateDailySchedule(day.value, "endTime", e.target.value)}
                        className="w-24 h-8 text-sm"
                      />
                      <Badge variant="secondary" className="ml-2">
                        {Math.floor(schedule.duration / 60)}h {schedule.duration % 60}m
                      </Badge>
                    </div>
                  )}

                  {!isSelected && (
                    <div className="text-sm text-gray-400 italic">Click to enable</div>
                  )}
                </div>
              );
            })}
          </div>

          {errors.daysOfWeek && <p className="text-red-500 text-sm mt-2">{errors.daysOfWeek}</p>}
        </div>

        {/* Repeat Pattern */}
        <div className="space-y-4 p-6 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm">
          <Label className="text-lg font-semibold text-gray-800">
            Repeat Pattern <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.repeatSchedule.pattern}
            onValueChange={(value) => updateRepeatScheduleField("pattern", value)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="flex items-center space-x-3 p-4 border-2 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="weekly" id="weekly" />
              <div>
                <Label htmlFor="weekly" className="text-base font-medium cursor-pointer">Weekly</Label>
                <p className="text-xs text-gray-600">Same days every week</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border-2 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="twice-weekly" id="twice-weekly" />
              <div>
                <Label htmlFor="twice-weekly" className="text-base font-medium cursor-pointer">Bi-weekly</Label>
                <p className="text-xs text-gray-600">Every other week</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border-2 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="custom" id="custom" />
              <div>
                <Label htmlFor="custom" className="text-base font-medium cursor-pointer">Custom</Label>
                <p className="text-xs text-gray-600">Set your own pattern</p>
              </div>
            </div>
          </RadioGroup>
          {errors.repeatPattern && <p className="text-red-500 text-sm mt-2">{errors.repeatPattern}</p>}

          {formData.repeatSchedule.pattern === "custom" && (
            <div className="space-y-3 mt-4">
              <Label className="text-base font-medium text-gray-700">
                Repeat Every (weeks)
              </Label>
              <Select
                value={formData.repeatSchedule.repeatEvery.toString()}
                onValueChange={(value) => updateRepeatScheduleField("repeatEvery", parseInt(value))}
              >
                <SelectTrigger className="h-10 text-base">
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
        </div>

        {/* Schedule Summary */}
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-blue-600" />
            <h4 className="text-sm font-medium text-blue-800">Schedule Summary</h4>
          </div>
          <div className="text-sm text-blue-700">
            {formData.repeatSchedule.daysOfWeek.length > 0 ? (
              <>
                Classes on: {formData.repeatSchedule.daysOfWeek.map(day =>
                  daysOfWeek.find(d => d.value === day)?.label
                ).join(", ")}
                <br />
                Total weekly hours: {weeklyHours.toFixed(1)} hours
                <br />
                Pattern: {formData.repeatSchedule.pattern === "custom"
                  ? `Every ${formData.repeatSchedule.repeatEvery} week(s)`
                  : formData.repeatSchedule.pattern}
              </>
            ) : (
              "No schedule selected yet"
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // SECTION 5: SESSION PLANNING
  const renderSessionsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-orange-800">Session Planning</h3>
          <p className="text-sm text-gray-600">Plan your class dates and virtual meeting setup</p>
        </div>
      </div>

      <div className="space-y-6 p-6 bg-gradient-to-br from-orange-50 to-white rounded-2xl border border-orange-200 shadow-sm">
        {/* Auto-Generate Class Dates */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-lg font-semibold text-orange-800">Class Dates</Label>
              <p className="text-sm text-gray-600 mt-1">Preview of all planned session dates</p>
            </div>
            <Button
              type="button"
              onClick={() => {
                // This would trigger auto-generation of dates based on schedule
                console.log('Auto-generating class dates...');
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <CalendarHeart className="h-4 w-4 mr-2" />
              Auto-Generate Dates
            </Button>
          </div>

          {/* Class Dates Preview */}
          <div className="bg-white rounded-lg border border-orange-200 p-4">
            <div className="text-sm text-gray-600 mb-3">Upcoming Sessions Preview</div>
            {formData.startDate && calculatedEndDate ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <span>Session 1</span>
                  <span>{format(formData.startDate, "PPP")}</span>
                </div>
                <div className="text-xs text-gray-500 text-center">... and {totalNumberOfLessons - 1} more sessions</div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <span>Final Session</span>
                  <span>{format(calculatedEndDate, "PPP")}</span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic text-center py-4">
                Set start date and schedule to preview class dates
              </div>
            )}
          </div>
        </div>

        {/* Next Session Display */}
        {formData.startDate && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Next Session</span>
            </div>
            <div className="text-sm text-green-700">
              {formData.startDate > new Date() ? (
                <>Starts {format(formData.startDate, "PPP")} at {formData.startTime || '09:00'}</>
              ) : (
                <>Course has already started</>
              )}
            </div>
          </div>
        )}

        {/* Google Calendar Integration Nudge */}
        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <CalendarHeart className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-blue-900">Connect Google Calendar</h3>
                  <Badge variant="outline" className="bg-yellow-100 border-yellow-300 text-yellow-800">
                    Recommended
                  </Badge>
                </div>
                <p className="text-sm text-blue-700 mb-4">
                  Automatically sync your cohort sessions with Google Calendar to stay organized and send calendar invites to students.
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                    onClick={() => {
                      // This would trigger Google Calendar integration
                      console.log('Connecting Google Calendar...');
                    }}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Connect Google Calendar
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      // This would skip for now
                      console.log('Skipping Google Calendar connection...');
                    }}
                  >
                    Skip for now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Session Summary */}
        <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-orange-600" />
            <h4 className="text-sm font-medium text-orange-800">Session Summary</h4>
          </div>
          <div className="text-sm text-orange-700 space-y-1">
            <div>Total sessions: {totalNumberOfLessons}</div>
            <div>Duration: {formData.startDate && formData.endDate ?
              `${Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24))} days` :
              'Not calculated yet'
            }</div>
            <div>Weekly commitment: {weeklyHours.toFixed(1)} hours</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {buttonText && (
        <Button variant={buttonVariant} className="flex items-center" onClick={() => onOpenChange(true)}>
          {buttonIcon}
          {buttonText}
        </Button>
      )}

      {/* Full-screen overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-kidato-indigo-900/80 via-black/60 to-kidato-purple-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          {/* Main popup container - 70% viewport */}
          <div
            className="bg-gradient-to-br from-white via-kidato-indigo-50/50 to-white rounded-2xl shadow-2xl border border-kidato-indigo-200/50 w-[70%] h-full flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b bg-gradient-to-r from-kidato-indigo-600 via-kidato-purple-600 to-kidato-indigo-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-kidato-indigo-600 rounded-xl">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      {cohort ? "Edit Cohort" : "Create New Cohort"}
                    </h1>
                    <p className="text-sm text-kidato-indigo-100">
                      Active Section: {sections.find(s => s.id === activeSection)?.title || "Loading..."}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (isDirty) {
                      if (confirm("Discard changes?")) {
                        onOpenChange(false);
                      }
                    } else {
                      onOpenChange(false);
                    }
                  }}
                  className="text-white/70 hover:text-white"
                >
                  ✕
                </Button>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="px-6 py-4 bg-gradient-to-r from-kidato-indigo-50 to-white">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600">
                  {completedSections} of {sections.length} sections completed
                </div>
                <div className="text-sm font-medium text-kidato-indigo-600">
                  {completionPercentage.toFixed(0)}% complete
                </div>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>

            <div className="flex-grow overflow-hidden py-4">
              <ScrollArea className="h-full">
                <div className="px-6">
                  <Tabs value={activeSection} onValueChange={setActiveSection}>
                    {/* Section Navigation */}
                    <div className="mb-6">
                      <TabsList className="grid w-full grid-cols-5 h-auto p-2 bg-gradient-to-r from-kidato-spindle-300 via-kidato-gray-100 to-kidato-spindle-300 rounded-xl border border-kidato-indigo/20 shadow-sm">
                        {sections.map((section) => {
                          const Icon = section.icon;
                          const isCompleted = completionStatus[section.id as keyof typeof completionStatus];
                          return (
                            <TabsTrigger
                              key={section.id}
                              value={section.id}
                              onClick={() => setActiveSection(section.id)}
                              className="flex flex-col items-center gap-2 px-3 py-4 text-sm data-[state=active]:bg-gradient-to-br data-[state=active]:from-kidato-indigo data-[state=active]:to-kidato-orange data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-kidato-indigo/30 rounded-lg transition-all duration-200 hover:bg-gradient-to-br hover:from-kidato-spindle-100 hover:to-kidato-gray-50 cursor-pointer"
                            >
                              <div className="flex items-center gap-1">
                                <Icon className={`h-5 w-5 ${isCompleted ? 'text-green-400' : activeSection === section.id ? 'text-white' : 'text-gray-500'}`} />
                                {isCompleted && <CheckCircle2 className={`h-4 w-4 ${activeSection === section.id ? 'text-green-200' : 'text-green-600'}`} />}
                              </div>
                              <span className={`font-medium text-center leading-tight ${activeSection === section.id ? 'text-white' : 'text-gray-700'}`}>
                                {section.title}
                              </span>
                            </TabsTrigger>
                          );
                        })}
                      </TabsList>
                    </div>

                    <TabsContent value="basic" className="mt-0">
                      {renderBasicSection()}
                    </TabsContent>
                    <TabsContent value="schedule" className="mt-0">
                      {renderScheduleSection()}
                    </TabsContent>
                    <TabsContent value="enrollment" className="mt-0">
                      {renderEnrollmentSection()}
                    </TabsContent>
                    <TabsContent value="pricing" className="mt-0">
                      {renderPricingSection()}
                    </TabsContent>
                    <TabsContent value="sessions" className="mt-0">
                      {renderSessionsSection()}
                    </TabsContent>
                  </Tabs>
                </div>
              </ScrollArea>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t bg-gradient-to-r from-kidato-indigo-50 via-white to-kidato-purple-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4 mr-1.5" />
                  <span>{totalNumberOfLessons} lessons</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1.5" />
                  <span>{weeklyHours.toFixed(1)}h/week</span>
                </div>
                {formData.price && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4 mr-1.5" />
                    <span>${formData.price}</span>
                  </div>
                )}
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
                {sections.findIndex(s => s.id === activeSection) > 0 && (
                  <Button variant="outline" onClick={handlePrevious}>
                    <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
                    Previous
                  </Button>
                )}
                <Button onClick={handleNext} disabled={!isValidSection(activeSection)}>
                  {sections.findIndex(s => s.id === activeSection) === sections.length - 1
                    ? (cohort ? "Update Cohort" : "Create Cohort")
                    : (
                      <>
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </>
                    )
                  }
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CohortFormDialog;