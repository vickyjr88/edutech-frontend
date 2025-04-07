
import { useState } from "react";
import AboutTab from "./tabs/AboutTab";
import ClassesTab from "./tabs/ClassesTab";
import ReviewsTab from "./tabs/ReviewsTab";
import BookingForm from "./BookingForm";
import { BookOpen, FileText, Star } from "lucide-react";

interface TabsProps {
  teacher: any; // Using any here as this is a wrapper component that passes data down
}

export default function Tabs({ teacher }: TabsProps) {
  const [activeTab, setActiveTab] = useState<'classes' | 'about' | 'reviews'>('classes');
  const [isBookingFlow, setIsBookingFlow] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);

  const handleStartBooking = (serviceId?: string) => {
    setSelectedService(serviceId);
    setIsBookingFlow(true);
    // Force scroll to the booking form
    setTimeout(() => {
      const element = document.getElementById("booking-form-container");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleCancelBooking = () => {
    setIsBookingFlow(false);
    setSelectedService(undefined);
  };

  return (
    <>
      <div className="mb-8 border-b">
        <div className="flex overflow-x-auto">
          <button 
            onClick={() => {
              setActiveTab('classes');
              setIsBookingFlow(false); // Cancel booking flow when changing tabs
            }}
            className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'classes' ? 'text-kidato-blue border-b-2 border-kidato-blue' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <BookOpen className="h-4 w-4" />
            Classes
          </button>
          <button 
            onClick={() => {
              setActiveTab('about');
              setIsBookingFlow(false); // Cancel booking flow when changing tabs
            }}
            className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'about' ? 'text-kidato-blue border-b-2 border-kidato-blue' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FileText className="h-4 w-4" />
            About me
          </button>
          <button 
            onClick={() => {
              setActiveTab('reviews');
              setIsBookingFlow(false); // Cancel booking flow when changing tabs
            }}
            className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'reviews' ? 'text-kidato-blue border-b-2 border-kidato-blue' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Star className="h-4 w-4" />
            Reviews
          </button>
        </div>
      </div>
      
      <div id="booking-form-container" className="w-full">
        {isBookingFlow ? (
          <BookingForm teacher={teacher} onCancel={handleCancelBooking} selectedService={selectedService} />
        ) : (
          <>
            {activeTab === 'classes' && <ClassesTab teacher={teacher} onBookService={handleStartBooking} />}
            {activeTab === 'about' && <AboutTab teacher={teacher} />}
            {activeTab === 'reviews' && <ReviewsTab teacher={teacher} />}
          </>
        )}
      </div>
    </>
  );
}
