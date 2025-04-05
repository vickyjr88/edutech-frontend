
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { FormCard } from "@/components/teacher/professional-profile/shared/FormCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Check } from "lucide-react";

interface BookingFormProps {
  teacher: any;
  onCancel: () => void;
  selectedService?: string;
}

export default function BookingForm({ teacher, onCancel, selectedService }: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    service: selectedService || "",
    date: null as Date | null,
    time: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const totalSteps = 4;
  
  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset after success message display
      setTimeout(() => {
        onCancel();
      }, 3000);
    }, 1500);
  };
  
  if (isSuccess) {
    return (
      <Card className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
        <p className="text-gray-600 mb-6">
          Your booking has been confirmed. You will receive a confirmation email shortly.
        </p>
        <Button onClick={onCancel}>Return to Profile</Button>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div 
              key={index}
              className="flex flex-col items-center"
            >
              <div className={`flex items-center ${index !== 0 ? 'w-full' : 'ml-0'}`}>
                {index !== 0 && (
                  <div 
                    className={`h-1 w-full ${
                      currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep > index + 1 
                      ? 'bg-green-500 text-white' 
                      : currentStep === index + 1 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                {index !== totalSteps - 1 && (
                  <div 
                    className={`h-1 w-full ${
                      currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
              <span className="text-xs mt-1 text-gray-500">
                {index === 0 ? "Service" : index === 1 ? "Date & Time" : index === 2 ? "Details" : "Confirm"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <FormCard title={`Step ${currentStep} of ${totalSteps}`}>
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="font-medium">Select a Service</h3>
            <Select 
              value={formData.service} 
              onValueChange={(value) => updateForm("service", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent>
                {teacher.classes?.map((classItem: any) => (
                  <SelectItem key={classItem.id} value={classItem.id}>
                    {classItem.title} - {classItem.subject}
                  </SelectItem>
                )) || (
                  <SelectItem value="default-class">Default Class</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Select a Date</h3>
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => updateForm("date", date)}
                className="rounded-md border"
                disabled={(date) => 
                  date < new Date() || 
                  date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                }
              />
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Select a Time</h3>
              <Select 
                value={formData.time} 
                onValueChange={(value) => updateForm("time", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"].map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="font-medium">Your Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <Input
                value={formData.name}
                onChange={(e) => updateForm("name", e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => updateForm("email", e.target.value)}
                placeholder="Enter your email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <Input
                value={formData.phone}
                onChange={(e) => updateForm("phone", e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
              <Textarea
                value={formData.message}
                onChange={(e) => updateForm("message", e.target.value)}
                placeholder="Any specific requirements or questions?"
                rows={3}
              />
            </div>
          </div>
        )}
        
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="font-medium">Booking Summary</h3>
            <div className="rounded-lg border border-gray-200 p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Service:</span>
                <span className="text-sm font-medium">
                  {teacher.classes?.find((c: any) => c.id === formData.service)?.title || formData.service}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Date:</span>
                <span className="text-sm font-medium">
                  {formData.date ? formData.date.toLocaleDateString() : "Not selected"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Time:</span>
                <span className="text-sm font-medium">{formData.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Name:</span>
                <span className="text-sm font-medium">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email:</span>
                <span className="text-sm font-medium">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Phone:</span>
                <span className="text-sm font-medium">{formData.phone}</span>
              </div>
            </div>
          </div>
        )}
      </FormCard>
      
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={goToPreviousStep}
          className="flex items-center"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {currentStep === 1 ? 'Cancel' : 'Back'}
        </Button>
        
        {currentStep < totalSteps ? (
          <Button 
            onClick={goToNextStep}
            disabled={
              (currentStep === 1 && !formData.service) ||
              (currentStep === 2 && (!formData.date || !formData.time)) ||
              (currentStep === 3 && (!formData.name || !formData.email || !formData.phone))
            }
            className="flex items-center"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center"
          >
            {isSubmitting ? 'Processing...' : 'Confirm Booking'}
          </Button>
        )}
      </div>
    </div>
  );
}
