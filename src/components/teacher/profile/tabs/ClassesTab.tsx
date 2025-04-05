
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Filter, Calendar, Clock, ArrowRight } from "lucide-react";
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
  // Format: day of week (0 = Sunday) mapped to available time slots
  0: ["13:00", "14:00", "15:00"],
  1: ["09:00", "10:00", "15:00", "16:00"],
  2: ["09:00", "10:00", "14:00"],
  3: ["11:00", "13:00", "14:00", "15:00"],
  4: ["09:00", "10:00", "11:00"],
  5: ["14:00", "15:00", "16:00"],
  6: ["10:00", "11:00"]
};

export default function ClassesTab({ teacher }: ClassesTabProps) {
  const [classType, setClassType] = useState<"all" | "academic" | "afterschool">("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
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
    return availabilityData[dayOfWeek as keyof typeof availabilityData] || [];
  };

  const availableTimeSlots = selectedDate ? getTimeSlots(selectedDate) : [];

  // Handle time slot selection
  const handleTimeSlotSelect = (time: string) => {
    setSelectedTime(time);
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Book On-Demand Session with {teacher.name}</h2>
        
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
              />
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
                  {availableTimeSlots.length > 0 ? (
                    availableTimeSlots.map((time) => (
                      <Button 
                        key={time} 
                        variant={selectedTime === time ? "default" : "outline"}
                        className={`px-4 py-6 h-auto ${selectedTime === time ? 'bg-kidato-blue text-white' : 'border-gray-300 text-gray-700'}`}
                        onClick={() => handleTimeSlotSelect(time)}
                      >
                        <Clock className="h-4 w-4 mr-2" /> {time}
                      </Button>
                    ))
                  ) : (
                    <p className="col-span-full text-center py-4 text-gray-500">No available times for this date.</p>
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
                <div className="flex justify-between">
                  <span className="text-gray-500">Time:</span>
                  <span className="font-medium">{selectedTime}</span>
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
