
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Star, Filter, Clock, ArrowRight, Users, User, Calendar,
  MapPin, BookOpen, GraduationCap, MessageSquare, Video
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ClassesTabProps {
  teacher: {
    name: string;
    classes: Array<{
      id: string;
      title: string;
      subject: string;
      level: string;
      rating?: number;
      imageSrc?: string;
      type?: "academic" | "afterschool";
      schedule?: "onetime" | "repeat";
      location?: "online" | "physical" | "hybrid";
      nextDate?: string;
      time?: string;
      duration?: number;
    }>;
  };
}

// Mock services offered by the teacher
const teacherServices = [
  { 
    id: "service1", 
    name: "Academic Tutoring", 
    description: "One-on-one academic subject support",
    icon: BookOpen,
    duration: [30, 60, 90],
    locations: ["online", "physical"]
  },
  { 
    id: "service2", 
    name: "After-School Programs", 
    description: "Group activities for skill development",
    icon: Users,
    duration: [60, 90],
    locations: ["physical"]
  },
  { 
    id: "service3", 
    name: "Exam Preparation", 
    description: "Focused sessions for upcoming exams",
    icon: GraduationCap,
    duration: [60, 90, 120],
    locations: ["online", "physical"]
  },
  { 
    id: "service4", 
    name: "Parent Consultation", 
    description: "Educational guidance for parents",
    icon: MessageSquare,
    duration: [30, 45],
    locations: ["online", "physical"]
  }
];

// Mock availability data - this would come from an API in a real application
const availabilityData = {
  // Format: day of week (0 = Sunday) mapped to available time slots with session type and service
  0: [
    { time: "13:00", type: "one-to-one", service: "Academic Tutoring", location: "online" },
    { time: "14:00", type: "one-to-one", service: "Exam Preparation", location: "physical" },
    { time: "15:00", type: "group", service: "After-School Programs", location: "physical" }
  ],
  1: [
    { time: "09:00", type: "one-to-one", service: "Academic Tutoring", location: "online" },
    { time: "10:00", type: "group", service: "After-School Programs", location: "physical" },
    { time: "15:00", type: "one-to-one", service: "Parent Consultation", location: "online" },
    { time: "16:00", type: "group", service: "After-School Programs", location: "physical" }
  ],
  2: [
    { time: "09:00", type: "one-to-one", service: "Academic Tutoring", location: "physical" },
    { time: "10:00", type: "one-to-one", service: "Exam Preparation", location: "online" },
    { time: "14:00", type: "group", service: "After-School Programs", location: "physical" }
  ],
  3: [
    { time: "11:00", type: "group", service: "After-School Programs", location: "physical" },
    { time: "13:00", type: "one-to-one", service: "Academic Tutoring", location: "online" },
    { time: "14:00", type: "one-to-one", service: "Exam Preparation", location: "physical" },
    { time: "15:00", type: "group", service: "After-School Programs", location: "physical" }
  ],
  4: [
    { time: "09:00", type: "one-to-one", service: "Academic Tutoring", location: "online" },
    { time: "10:00", type: "group", service: "After-School Programs", location: "physical" },
    { time: "11:00", type: "one-to-one", service: "Parent Consultation", location: "physical" }
  ],
  5: [
    { time: "14:00", type: "group", service: "After-School Programs", location: "physical" },
    { time: "15:00", type: "one-to-one", service: "Academic Tutoring", location: "online" },
    { time: "16:00", type: "group", service: "Exam Preparation", location: "online" }
  ],
  6: [
    { time: "10:00", type: "one-to-one", service: "Academic Tutoring", location: "physical" },
    { time: "11:00", type: "group", service: "After-School Programs", location: "physical" }
  ]
};

// Define days when the teacher is completely unavailable (no slots)
const unavailableDays = [2, 3]; // Tuesday and Wednesday are completely unavailable

// Mock booked slots - this would come from an API in a real application
const bookedSlots = {
  // Format: 'YYYY-MM-DD' mapped to booked time slots
  '2025-04-06': ["10:00"],
  '2025-04-09': ["09:00", "10:00", "11:00"], // Fully booked day
  '2025-04-11': ["15:00"],
  '2025-04-12': ["14:00", "15:00"],
  '2025-04-15': ["09:00"]
};

export default function ClassesTab({ teacher }: ClassesTabProps) {
  const [classType, setClassType] = useState<"all" | "academic" | "afterschool">("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSessionType, setSelectedSessionType] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<"online" | "physical" | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [bookingStep, setBookingStep] = useState<"calendar" | "service" | "details">("calendar");
  const [bookingNotes, setBookingNotes] = useState("");
  const [customSlot, setCustomSlot] = useState(false);
  const [customTime, setCustomTime] = useState("");

  // Group classes by type (academic or afterschool) and schedule (onetime or repeat)
  const academicClasses = teacher.classes.filter(cls => cls.type === "academic" || !cls.type);
  const afterschoolClasses = teacher.classes.filter(cls => cls.type === "afterschool");
  
  const onetimeClasses = teacher.classes.filter(cls => cls.schedule === "onetime" || !cls.schedule);
  const repeatClasses = teacher.classes.filter(cls => cls.schedule === "repeat");

  // Get available time slots for selected date
  const getTimeSlots = (date: Date | undefined) => {
    if (!date) return [];
    const dayOfWeek = date.getDay();
    
    // Check if this day is marked as completely unavailable
    if (unavailableDays.includes(dayOfWeek)) return [];
    
    return availabilityData[dayOfWeek as keyof typeof availabilityData] || [];
  };

  // Check if a date is fully booked
  const isDateFullyBooked = (date: Date): boolean => {
    const dateString = format(date, 'yyyy-MM-dd');
    const daySlots = getTimeSlots(date);
    const bookedForDate = bookedSlots[dateString as keyof typeof bookedSlots] || [];
    
    // If there are no slots for this day, it's not bookable
    if (daySlots.length === 0) return false;
    
    // If all slots for this day are booked, it's fully booked
    return daySlots.length === bookedForDate.length;
  };

  // Check if a date has some available slots (partially booked)
  const hasAvailableSlots = (date: Date): boolean => {
    const dateString = format(date, 'yyyy-MM-dd');
    const daySlots = getTimeSlots(date);
    const bookedForDate = bookedSlots[dateString as keyof typeof bookedSlots] || [];
    
    // Has slots for this day and not all are booked
    return daySlots.length > 0 && bookedForDate.length < daySlots.length;
  };

  // Check if a date has no slots scheduled
  const hasNoSlots = (date: Date): boolean => {
    const dayOfWeek = date.getDay();
    return !availabilityData[dayOfWeek as keyof typeof availabilityData] || 
           availabilityData[dayOfWeek as keyof typeof availabilityData].length === 0;
  };

  // Check if a date is completely unavailable (teacher has not scheduled any slots)
  const isTeacherUnavailable = (date: Date): boolean => {
    const dayOfWeek = date.getDay();
    return unavailableDays.includes(dayOfWeek);
  };

  const availableTimeSlots = selectedDate ? getTimeSlots(selectedDate) : [];
  
  // Filter out booked slots for the selected date
  const filteredTimeSlots = useMemo(() => {
    if (!selectedDate) return [];
    
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const bookedForDate = bookedSlots[dateString as keyof typeof bookedSlots] || [];
    
    return availableTimeSlots.filter(slot => !bookedForDate.includes(slot.time));
  }, [selectedDate, availableTimeSlots]);

  // Filter time slots by selected service and location if needed
  const filteredByServiceTimeSlots = useMemo(() => {
    if (!selectedService && !selectedLocation) return filteredTimeSlots;
    
    return filteredTimeSlots.filter(slot => {
      const matchesService = !selectedService || slot.service === selectedService;
      const matchesLocation = !selectedLocation || slot.location === selectedLocation;
      return matchesService && matchesLocation;
    });
  }, [filteredTimeSlots, selectedService, selectedLocation]);

  // Handle time slot selection
  const handleTimeSlotSelect = (time: string, type: string, service: string, location: string) => {
    setSelectedTime(time);
    setSelectedSessionType(type);
    setSelectedService(service);
    setSelectedLocation(location as "online" | "physical");
    setCustomSlot(false);
  };

  // Handle custom slot selection
  const handleCustomSlotToggle = () => {
    setCustomSlot(!customSlot);
    if (!customSlot) {
      setSelectedTime(null);
      setSelectedSessionType(null);
    } else {
      setCustomTime("");
    }
  };

  // Handle service selection
  const handleServiceSelect = (serviceId: string) => {
    const service = teacherServices.find(s => s.id === serviceId);
    if (service) {
      setSelectedService(service.name);
      if (service.duration.length > 0) {
        setSelectedDuration(service.duration[0]);
      }
      setBookingStep("calendar");
    }
  };

  // Handle booking submission
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || (!selectedTime && !customTime) || !selectedService) {
      toast.error("Please complete all required booking information.");
      return;
    }
    
    toast.success("Booking request sent! We'll notify you once confirmed.", {
      position: "top-center",
    });
    
    // Reset form
    setSelectedDate(new Date());
    setSelectedTime(null);
    setSelectedSessionType(null);
    setSelectedService(null);
    setSelectedLocation(null);
    setSelectedDuration(null);
    setBookingNotes("");
    setBookingStep("calendar");
    setCustomSlot(false);
    setCustomTime("");
  };

  // Function to move to details step
  const moveToDetailsStep = () => {
    if (!selectedDate || (!selectedTime && !customTime)) {
      toast.error("Please select both date and time before proceeding.", {
        position: "top-center",
      });
      return;
    }
    setBookingStep("details");
  };

  // Function to render classes based on current filter
  const renderClasses = () => {
    let classesToRender = teacher.classes;
    
    if (classType === "academic") {
      classesToRender = academicClasses;
    } else if (classType === "afterschool") {
      classesToRender = afterschoolClasses;
    }
    
    if (classesToRender.length === 0) {
      return (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">No classes available in this category.</p>
        </div>
      );
    }
    
    return classesToRender.map((cls) => (
      <Card key={cls.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
        <div className="h-48 w-full overflow-hidden relative">
          <img 
            src={cls.imageSrc || 'https://via.placeholder.com/400x250?text=Class+Image'} 
            alt={cls.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {cls.type && (
              <div className={`px-2 py-1 text-xs font-semibold rounded-full ${
                cls.type === 'academic' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
              }`}>
                {cls.type === 'academic' ? 'Academic' : 'After-School'}
              </div>
            )}
            
            {cls.schedule && (
              <div className={`px-2 py-1 text-xs font-semibold rounded-full ${
                cls.schedule === 'onetime' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
              }`}>
                {cls.schedule === 'onetime' ? 'One-time' : 'Recurring'}
              </div>
            )}
            
            {cls.location && (
              <div className={`px-2 py-1 text-xs font-semibold rounded-full ${
                cls.location === 'online' 
                  ? 'bg-indigo-100 text-indigo-800' 
                  : cls.location === 'physical' 
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-teal-100 text-teal-800'
              }`}>
                {cls.location === 'online' 
                  ? 'Online' 
                  : cls.location === 'physical' 
                    ? 'In-Person'
                    : 'Hybrid'}
              </div>
            )}
          </div>
        </div>
        <CardContent className="p-5">
          <h3 className="font-semibold text-gray-900 mb-1">{cls.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{cls.subject} · {cls.level}</p>
          
          {cls.rating && (
            <div className="flex items-center gap-1 mb-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{cls.rating}</span>
            </div>
          )}
          
          {(cls.nextDate || cls.time) && (
            <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-3">
              {cls.nextDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{cls.nextDate}</span>
                </div>
              )}
              {cls.time && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{cls.time}</span>
                </div>
              )}
              {cls.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{cls.duration} min</span>
                </div>
              )}
            </div>
          )}
          
          <div className="flex gap-2 mt-3">
            <Button variant="outline" className="flex-1 border-kidato-blue text-kidato-blue hover:bg-kidato-blue/10">
              View Details
            </Button>
            <Button className="flex-1 bg-kidato-blue hover:bg-kidato-blue/90">
              Enroll Now
            </Button>
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="space-y-10">
      {/* On-Demand Booking Calendar Section */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Book On-Demand Session with {teacher.name}</h2>
        <p className="text-gray-600 mb-6">
          Book personalized sessions with Mr. Mwangi at times that work for you. Select from academic tutoring, 
          after-school programs, exam preparation, or parent consultations. Choose from pre-scheduled slots or 
          request a custom time. One-to-one sessions offer personalized attention, while group sessions provide 
          collaborative learning opportunities.
        </p>
        
        <Tabs defaultValue="calendar" className="w-full" value={bookingStep === "service" ? "service" : "calendar"}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="calendar" onClick={() => setBookingStep("calendar")}>Select Date & Time</TabsTrigger>
            <TabsTrigger value="service" onClick={() => bookingStep !== "details" && setBookingStep("service")}>Choose Service</TabsTrigger>
          </TabsList>
          
          <TabsContent value="service" className="space-y-6">
            <h3 className="font-semibold text-lg mb-4">Select a Service</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teacherServices.map(service => (
                <Card 
                  key={service.id} 
                  className={`overflow-hidden hover:border-kidato-blue cursor-pointer transition-all ${
                    selectedService === service.name ? 'border-2 border-kidato-blue' : ''
                  }`}
                  onClick={() => handleServiceSelect(service.id)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-full bg-kidato-blue/10 flex items-center justify-center">
                        <service.icon className="h-5 w-5 text-kidato-blue" />
                      </div>
                      <h4 className="font-medium text-lg">{service.name}</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {service.locations.includes("online") && (
                        <div className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Video className="h-3 w-3" /> Online
                        </div>
                      )}
                      {service.locations.includes("physical") && (
                        <div className="bg-rose-100 text-rose-800 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> In-Person
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {service.duration.map(time => (
                        <div key={time} className="bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {time} min
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="calendar">
            {bookingStep === "calendar" ? (
              <div className="grid md:grid-cols-7 gap-8">
                <div className="md:col-span-3">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">Select a Date</h3>
                    <p className="text-gray-500 text-sm mb-4">Choose a date for your session with {teacher.name}</p>
                  </div>
                  
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border shadow-sm pointer-events-auto"
                    disabled={(date) => {
                      // Disable past dates and dates more than 2 months in the future
                      const now = new Date();
                      const maxDate = new Date();
                      maxDate.setMonth(maxDate.getMonth() + 2);
                      return date < now || date > maxDate;
                    }}
                    modifiers={{
                      available: (date) => hasAvailableSlots(date),
                      booked: (date) => isDateFullyBooked(date),
                      noSlots: (date) => hasNoSlots(date),
                      unavailable: (date) => isTeacherUnavailable(date)
                    }}
                    modifiersClassNames={{
                      available: "bg-green-50 text-green-800 font-medium border-green-200",
                      booked: "bg-red-50 text-red-800 font-medium border-red-200",
                      noSlots: "bg-gray-50 text-gray-400 opacity-50",
                      unavailable: "bg-orange-50 text-orange-800 font-medium border-orange-200 opacity-60"
                    }}
                  />
                  
                  <div className="mt-6 flex flex-col gap-3">
                    <h4 className="text-sm font-medium text-gray-700">Calendar Legend</h4>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-xs text-gray-600">Available Slots</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <span className="text-xs text-gray-600">Fully Booked</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                        <span className="text-xs text-gray-600">No Scheduled Slots</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-orange-400"></div>
                        <span className="text-xs text-gray-600">Teacher Unavailable</span>
                      </div>
                    </div>
                    <div className="border-t pt-3 mt-2">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-kidato-blue"></div>
                        <span className="text-xs text-gray-600">One-to-One Session</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                        <span className="text-xs text-gray-600">Group Session</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedService && (
                    <div className="mt-6 p-4 border border-kidato-blue/30 rounded-md bg-kidato-blue/5">
                      <h4 className="font-medium text-kidato-blue mb-2">Selected Service</h4>
                      <p className="text-gray-700">{selectedService}</p>
                      
                      <div className="mt-3 flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setBookingStep("service")}
                        >
                          Change Service
                        </Button>
                        
                        <Select value={selectedLocation || ""} onValueChange={(val) => setSelectedLocation(val as "online" | "physical" || null)}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Any Location</SelectItem>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="physical">In-Person</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="md:col-span-4">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">Select a Time Slot</h3>
                    <p className="text-gray-500 text-sm mb-4">
                      {selectedDate 
                        ? `Available times for ${format(selectedDate, 'EEEE, MMMM d, yyyy')}` 
                        : 'Please select a date to see available times'}
                    </p>
                  </div>
                  
                  {!selectedService && (
                    <div className="mb-4 p-4 border border-amber-200 rounded-md bg-amber-50">
                      <div className="flex items-center gap-2 text-amber-800">
                        <BookOpen className="h-5 w-5 text-amber-600" />
                        <span className="font-medium">Please select a service first</span>
                      </div>
                      <p className="text-amber-700 text-sm mt-1">
                        Click on "Choose Service" tab to select what type of session you'd like to book.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="mt-2 border-amber-500 text-amber-700 hover:bg-amber-100"
                        onClick={() => setBookingStep("service")}
                      >
                        Choose Service
                      </Button>
                    </div>
                  )}
                  
                  {selectedDate && selectedService && (
                    <>
                      {isTeacherUnavailable(selectedDate) ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-8 px-4 border border-orange-200 bg-orange-50 rounded-md">
                          <Calendar className="h-12 w-12 text-orange-500 mb-3 opacity-80" />
                          <h4 className="text-orange-800 font-medium text-lg mb-1">Teacher Unavailable</h4>
                          <p className="text-orange-700 text-center">
                            {teacher.name} has not scheduled any sessions for this day.
                          </p>
                          <p className="text-orange-700 text-center text-sm mt-1">
                            Please try selecting another date from the calendar or request a custom time below.
                          </p>
                          
                          <div className="mt-4 w-full max-w-md">
                            <Button 
                              variant="outline" 
                              className="w-full border-orange-500 text-orange-700 hover:bg-orange-100"
                              onClick={handleCustomSlotToggle}
                            >
                              Request Custom Time
                            </Button>
                            
                            {customSlot && (
                              <div className="mt-3">
                                <Label htmlFor="custom-time" className="text-sm font-medium text-orange-800">
                                  Preferred Time
                                </Label>
                                <div className="flex gap-2 mt-1">
                                  <Input 
                                    id="custom-time" 
                                    type="time" 
                                    value={customTime} 
                                    onChange={(e) => setCustomTime(e.target.value)}
                                    className="border-orange-300"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : filteredByServiceTimeSlots.length > 0 ? (
                        <>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {filteredByServiceTimeSlots.map((slot) => (
                              <TooltipProvider key={slot.time}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant={selectedTime === slot.time ? "default" : "outline"}
                                      className={`px-4 py-6 h-auto ${
                                        selectedTime === slot.time 
                                          ? (slot.type === 'one-to-one' ? 'bg-kidato-blue text-white' : 'bg-emerald-500 text-white')
                                          : 'border-gray-300 text-gray-700'
                                      }`}
                                      onClick={() => handleTimeSlotSelect(slot.time, slot.type, slot.service, slot.location)}
                                    >
                                      <div className="flex flex-col items-center gap-1">
                                        <div className="flex items-center gap-2">
                                          <Clock className="h-4 w-4" /> 
                                          <span>{slot.time}</span>
                                        </div>
                                        <div className="flex items-center text-xs mt-1 gap-1">
                                          {slot.type === 'one-to-one' ? (
                                            <>
                                              <User className="h-3 w-3" /> 
                                              <span>One-to-One</span>
                                            </>
                                          ) : (
                                            <>
                                              <Users className="h-3 w-3" /> 
                                              <span>Group</span>
                                            </>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-1 mt-1">
                                          {slot.location === 'online' ? (
                                            <Video className="h-3 w-3" />
                                          ) : (
                                            <MapPin className="h-3 w-3" />
                                          )}
                                        </div>
                                      </div>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{slot.service}</p>
                                    <p className="text-xs">{slot.location === 'online' ? 'Online' : 'In-Person'}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ))}
                          </div>
                          
                          <div className="mt-6 border-t pt-4">
                            <Button 
                              variant="outline" 
                              className="flex items-center gap-2"
                              onClick={handleCustomSlotToggle}
                            >
                              <Clock className="h-4 w-4" />
                              {customSlot ? "Use Scheduled Slots" : "Request Custom Time"}
                            </Button>
                            
                            {customSlot && (
                              <div className="mt-3 flex flex-col sm:flex-row gap-3">
                                <div className="flex-1">
                                  <Label htmlFor="custom-time" className="text-sm font-medium">
                                    Preferred Time
                                  </Label>
                                  <Input 
                                    id="custom-time" 
                                    type="time" 
                                    value={customTime} 
                                    onChange={(e) => setCustomTime(e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                                <div className="flex-1">
                                  <Label htmlFor="custom-duration" className="text-sm font-medium">
                                    Session Duration
                                  </Label>
                                  <Select value={selectedDuration?.toString() || ""} onValueChange={(val) => setSelectedDuration(parseInt(val))}>
                                    <SelectTrigger id="custom-duration" className="mt-1">
                                      <SelectValue placeholder="Select duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="30">30 minutes</SelectItem>
                                      <SelectItem value="45">45 minutes</SelectItem>
                                      <SelectItem value="60">60 minutes</SelectItem>
                                      <SelectItem value="90">90 minutes</SelectItem>
                                      <SelectItem value="120">2 hours</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="col-span-full text-center py-8 border border-gray-200 rounded-md">
                          <p className="text-gray-500 mb-4">
                            {isDateFullyBooked(selectedDate) 
                              ? "All slots for this date are booked. Please select another date or request a custom time." 
                              : hasNoSlots(selectedDate) 
                                ? "No scheduled sessions for this date. Please select another date or request a custom time." 
                                : "No available times for the selected service and filters."}
                          </p>
                          
                          <Button 
                            variant="outline" 
                            className="flex items-center gap-2"
                            onClick={handleCustomSlotToggle}
                          >
                            <Clock className="h-4 w-4" />
                            Request Custom Time
                          </Button>
                          
                          {customSlot && (
                            <div className="mt-4 max-w-sm mx-auto">
                              <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1">
                                  <Label htmlFor="custom-time-alt" className="text-sm font-medium">
                                    Preferred Time
                                  </Label>
                                  <Input 
                                    id="custom-time-alt" 
                                    type="time" 
                                    value={customTime} 
                                    onChange={(e) => setCustomTime(e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                                <div className="flex-1">
                                  <Label htmlFor="custom-duration-alt" className="text-sm font-medium">
                                    Session Duration
                                  </Label>
                                  <Select value={selectedDuration?.toString() || ""} onValueChange={(val) => setSelectedDuration(parseInt(val))}>
                                    <SelectTrigger id="custom-duration-alt" className="mt-1">
                                      <SelectValue placeholder="Select duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="30">30 minutes</SelectItem>
                                      <SelectItem value="45">45 minutes</SelectItem>
                                      <SelectItem value="60">60 minutes</SelectItem>
                                      <SelectItem value="90">90 minutes</SelectItem>
                                      <SelectItem value="120">2 hours</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                  
                  {selectedDate && (selectedTime || customTime) && selectedService && (
                    <div className="mt-6 flex justify-end">
                      <Button 
                        className="bg-kidato-blue hover:bg-kidato-blue/90 flex items-center gap-2"
                        onClick={moveToDetailsStep}
                      >
                        Continue <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="max-w-lg mx-auto">
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-2">Session Details</h3>
                  <p className="text-gray-500 text-sm mb-2">Complete your booking request</p>
                  
                  <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Date:</span>
                      <span className="font-medium">{selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Time:</span>
                      <span className="font-medium">{customSlot ? `${customTime} (Custom)` : selectedTime}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Service:</span>
                      <span className="font-medium">{selectedService}</span>
                    </div>
                    {!customSlot && selectedSessionType && (
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Session Type:</span>
                        <span className="font-medium flex items-center gap-1">
                          {selectedSessionType === 'one-to-one' ? (
                            <>
                              <User className="h-3 w-3" /> One-to-One
                            </>
                          ) : (
                            <>
                              <Users className="h-3 w-3" /> Group
                            </>
                          )}
                        </span>
                      </div>
                    )}
                    {selectedLocation && (
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Location:</span>
                        <span className="font-medium flex items-center gap-1">
                          {selectedLocation === 'online' ? (
                            <>
                              <Video className="h-3 w-3" /> Online
                            </>
                          ) : (
                            <>
                              <MapPin className="h-3 w-3" /> In-Person
                            </>
                          )}
                        </span>
                      </div>
                    )}
                    {(customSlot && selectedDuration) && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Duration:</span>
                        <span className="font-medium">{selectedDuration} minutes</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="grid gap-4">
                    {customSlot && !selectedService && (
                      <div>
                        <Label htmlFor="service">Service Type</Label>
                        <Select value={selectedService || ""} onValueChange={setSelectedService} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            {teacherServices.map(service => (
                              <SelectItem key={service.id} value={service.name}>{service.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {!selectedLocation && (
                      <div>
                        <Label htmlFor="location">Location Preference</Label>
                        <Select 
                          value={selectedLocation || ""} 
                          onValueChange={(val) => setSelectedLocation(val as "online" | "physical")}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select location preference" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="physical">In-Person</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Textarea 
                        id="notes" 
                        placeholder="Any specific topics or requirements?"
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-end pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setBookingStep("calendar")}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-kidato-blue hover:bg-kidato-blue/90"
                    >
                      Request Session
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Regular Classes Section */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Regular Classes by {teacher.name}</h2>
          
          <div className="flex flex-wrap gap-3">
            <Select value={classType} onValueChange={(value: "all" | "academic" | "afterschool") => setClassType(value)}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter by type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="academic">Academic Classes</SelectItem>
                <SelectItem value="afterschool">After-School Classes</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <SelectValue placeholder="Filter by schedule" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schedules</SelectItem>
                <SelectItem value="onetime">One-time Sessions</SelectItem>
                <SelectItem value="repeat">Recurring Classes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teacher.classes.length > 0 ? (
            renderClasses()
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No classes available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
