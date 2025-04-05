
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Filter, Calendar as CalendarIcon, Clock, ArrowRight, Users, User, Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

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
    }>;
  };
}

// Mock availability data - this would come from an API in a real application
const availabilityData = {
  // Format: day of week (0 = Sunday) mapped to available time slots with session type
  0: [
    { time: "13:00", type: "one-to-one" },
    { time: "14:00", type: "one-to-one" },
    { time: "15:00", type: "group" }
  ],
  1: [
    { time: "09:00", type: "one-to-one" },
    { time: "10:00", type: "group" },
    { time: "15:00", type: "one-to-one" },
    { time: "16:00", type: "group" }
  ],
  2: [
    { time: "09:00", type: "one-to-one" },
    { time: "10:00", type: "one-to-one" },
    { time: "14:00", type: "group" }
  ],
  3: [
    { time: "11:00", type: "group" },
    { time: "13:00", type: "one-to-one" },
    { time: "14:00", type: "one-to-one" },
    { time: "15:00", type: "group" }
  ],
  4: [
    { time: "09:00", type: "one-to-one" },
    { time: "10:00", type: "group" },
    { time: "11:00", type: "one-to-one" }
  ],
  5: [
    { time: "14:00", type: "group" },
    { time: "15:00", type: "one-to-one" },
    { time: "16:00", type: "group" }
  ],
  6: [
    { time: "10:00", type: "one-to-one" },
    { time: "11:00", type: "group" }
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
  const [selectedSubject, setSelectedSubject] = useState("");
  const [bookingStep, setBookingStep] = useState<"calendar" | "details">("calendar");
  const [bookingNotes, setBookingNotes] = useState("");

  // Group classes by type (academic or afterschool)
  const academicClasses = teacher.classes.filter(cls => cls.type === "academic" || !cls.type);
  const afterschoolClasses = teacher.classes.filter(cls => cls.type === "afterschool");
  
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

  // Handle time slot selection
  const handleTimeSlotSelect = (time: string, type: string) => {
    setSelectedTime(time);
    setSelectedSessionType(type);
  };

  // Handle booking submission
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !selectedSubject) {
      toast.error("Please select a date, time and subject for your booking.");
      return;
    }
    
    toast.success("Booking request sent! We'll notify you once confirmed.", {
      position: "top-center",
    });
    
    // Reset form
    setSelectedDate(new Date());
    setSelectedTime(null);
    setSelectedSessionType(null);
    setSelectedSubject("");
    setBookingNotes("");
    setBookingStep("calendar");
  };

  // Function to move to details step
  const moveToDetailsStep = () => {
    if (!selectedDate || !selectedTime) {
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
          {cls.type && (
            <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full ${
              cls.type === 'academic' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
            }`}>
              {cls.type === 'academic' ? 'Academic' : 'After-School'}
            </div>
          )}
        </div>
        <CardContent className="p-5">
          <h3 className="font-semibold text-gray-900 mb-1">{cls.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{cls.subject} · {cls.level}</p>
          
          {cls.rating && (
            <div className="flex items-center gap-1 mb-3">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{cls.rating}</span>
            </div>
          )}
          
          <div className="flex gap-2">
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
          On-demand sessions allow you to book personalized tutoring at times that work for you. 
          Select a green date with available slots, choose a time, and get immediate help with specific 
          subjects or homework questions. One-to-one sessions offer personalized attention, while group 
          sessions provide collaborative learning at a lower cost.
        </p>
        
        {bookingStep === "calendar" ? (
          <div className="grid md:grid-cols-7 gap-8">
            <div className="md:col-span-3">
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2">Select a Date</h3>
                <p className="text-gray-500 text-sm mb-4">Choose a date for your tutoring session</p>
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
              
              {selectedDate && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {isTeacherUnavailable(selectedDate) ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-8 px-4 border border-orange-200 bg-orange-50 rounded-md">
                      <Calendar className="h-12 w-12 text-orange-500 mb-3 opacity-80" />
                      <h4 className="text-orange-800 font-medium text-lg mb-1">Teacher Unavailable</h4>
                      <p className="text-orange-700 text-center">
                        {teacher.name} has not scheduled any sessions for this day.
                      </p>
                      <p className="text-orange-700 text-center text-sm mt-1">
                        Please try selecting another date from the calendar.
                      </p>
                    </div>
                  ) : filteredTimeSlots.length > 0 ? (
                    filteredTimeSlots.map((slot) => (
                      <Button 
                        key={slot.time} 
                        variant={selectedTime === slot.time ? "default" : "outline"}
                        className={`px-4 py-6 h-auto ${
                          selectedTime === slot.time 
                            ? (slot.type === 'one-to-one' ? 'bg-kidato-blue text-white' : 'bg-emerald-500 text-white')
                            : 'border-gray-300 text-gray-700'
                        }`}
                        onClick={() => handleTimeSlotSelect(slot.time, slot.type)}
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
                        </div>
                      </Button>
                    ))
                  ) : (
                    <p className="col-span-full text-center py-4 text-gray-500">
                      {isDateFullyBooked(selectedDate) 
                        ? "All slots for this date are booked. Please select another date." 
                        : hasNoSlots(selectedDate) 
                          ? "No scheduled sessions for this date. Please select another date." 
                          : "No available times for this date."}
                    </p>
                  )}
                </div>
              )}
              
              {(selectedDate && selectedTime) && (
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
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
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
              </div>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
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
      </div>

      {/* Regular Classes Section */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Regular Classes by {teacher.name}</h2>
          
          <div>
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
