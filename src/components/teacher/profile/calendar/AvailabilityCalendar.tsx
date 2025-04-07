
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, Clock } from "lucide-react";

interface AvailabilityCalendarProps {
  teacherId: string;
  bookingReason: string | null;
}

export default function AvailabilityCalendar({ teacherId, bookingReason }: AvailabilityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  
  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];
  
  // Generate some random available time slots for the demo
  const getAvailableTimesForDate = (date: Date) => {
    // This is a placeholder - in a real app, this would fetch from the backend
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Weekend has fewer slots
      return timeSlots.filter((_, i) => i % 3 === 0);
    }
    
    // Weekdays have more slots
    return timeSlots.filter((_, i) => i % 2 === 0);
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined); // Reset time when date changes
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };
  
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmationVisible(true);
    
    // In a real app, this would submit to the backend
    setTimeout(() => {
      setIsBookingDialogOpen(false);
      setIsConfirmationVisible(false);
    }, 2000);
  };
  
  const availableTimeSlots = selectedDate ? getAvailableTimesForDate(selectedDate) : [];
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-3">Select a Date</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
            disabled={(date) => {
              const now = new Date();
              now.setHours(0, 0, 0, 0);
              
              // Disable past dates and dates more than 2 months in the future
              const twoMonthsFromNow = new Date();
              twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);
              
              return date < now || date > twoMonthsFromNow;
            }}
          />
        </div>
        
        {selectedDate && (
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-3">Available Times</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableTimeSlots.length > 0 ? (
                availableTimeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => handleTimeSelect(time)}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {time}
                  </Button>
                ))
              ) : (
                <p className="col-span-2 text-center py-4 text-gray-500">
                  No available slots for this date
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-end mt-4">
        <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              disabled={!selectedDate || !selectedTime || !bookingReason}
              className="px-6"
            >
              Book Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Book a Session</DialogTitle>
            </DialogHeader>
            {isConfirmationVisible ? (
              <div className="py-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">Booking Confirmed!</h3>
                <p className="text-gray-500">
                  Your session has been booked successfully. You'll receive a confirmation email shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input 
                      value={selectedDate?.toLocaleDateString()} 
                      readOnly 
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time</label>
                    <Input value={selectedTime} readOnly className="bg-gray-50" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reason</label>
                  <Input value={bookingReason || ""} readOnly className="bg-gray-50" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input placeholder="Enter your full name" required />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input type="email" placeholder="Enter your email" required />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input placeholder="Enter your phone number" required />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Additional Notes (Optional)</label>
                  <Textarea placeholder="Any specific topics or questions you'd like to cover?" />
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button type="submit">Confirm Booking</Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
