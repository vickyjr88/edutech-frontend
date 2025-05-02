import React, { useState } from "react";
import { useProfileJourney } from "../ProfileJourneyContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Save, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import LocationPicker from "../../LocationPicker";

const LocationStep = () => {
  const { locationInfo, updateLocationInfo, completeStep } = useProfileJourney();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // Create local state to track form changes
  const [formData, setFormData] = useState({
    address: locationInfo.address,
    city: locationInfo.city,
    county: locationInfo.county,
    postalCode: locationInfo.postalCode,
    coordinates: locationInfo.coordinates,
    availability: {
      days: [...locationInfo.availability.days],
      times: { ...locationInfo.availability.times }
    }
  });
  
  // Track if form has been changed
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(locationInfo);
  
  // Handle location selection
  const handleLocationSelect = (location: any) => {
    setFormData({
      ...formData,
      address: location.address,
      city: location.city,
      county: location.county,
      postalCode: location.postalCode,
      coordinates: {
        latitude: location.latitude,
        longitude: location.longitude
      }
    });
    
    toast({
      title: "Location Updated",
      description: `Selected: ${location.address}, ${location.city}`,
    });
  };
  
  // Toggle day selection
  const toggleDay = (day: string) => {
    const currentDays = [...formData.availability.days];
    if (currentDays.includes(day)) {
      setFormData({
        ...formData,
        availability: {
          ...formData.availability,
          days: currentDays.filter(d => d !== day)
        }
      });
    } else {
      setFormData({
        ...formData,
        availability: {
          ...formData.availability,
          days: [...currentDays, day]
        }
      });
    }
  };
  
  // Toggle time selection
  const toggleTime = (time: 'morning' | 'afternoon' | 'evening') => {
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        times: {
          ...formData.availability.times,
          [time]: !formData.availability.times[time]
        }
      }
    });
  };
  
  // Save changes
  const handleSave = () => {
    setIsSaving(true);
    
    // Validate required fields
    if (!formData.address || !formData.city || formData.availability.days.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide your location and availability",
        variant: "destructive"
      });
      setIsSaving(false);
      return;
    }
    
    // Save to context
    setTimeout(() => {
      updateLocationInfo(formData);
      
      // Check if we should mark this step as complete
      if (formData.address && formData.city && formData.availability.days.length > 0) {
        completeStep("location");
      }
      
      toast({
        title: "Location Updated",
        description: "Your location and availability have been saved"
      });
      
      setIsSaving(false);
    }, 1000);
  };
  
  const weekdays = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' }
  ];
  
  const timeSlots = [
    { id: 'morning', label: 'Morning (8am-12pm)', icon: '🌅' },
    { id: 'afternoon', label: 'Afternoon (12pm-5pm)', icon: '☀️' },
    { id: 'evening', label: 'Evening (5pm-9pm)', icon: '🌆' }
  ];
  
  return (
    <div className="space-y-6">
      {/* Location Information */}
      <div className="space-y-4">
        <div className="flex items-center">
          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
          <h3 className="text-base font-medium">Teaching Location</h3>
        </div>
        
        <p className="text-sm text-gray-500">
          Enter the location where you'll be teaching. This helps match you with nearby students.
        </p>
        
        <LocationPicker 
          onLocationSelect={handleLocationSelect}
          initialAddress={formData.address}
          initialCity={formData.city}
          initialCounty={formData.county}
          initialPostalCode={formData.postalCode}
        />
        
        {/* Display selected location information */}
        {formData.address && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
            <h4 className="text-sm font-medium text-blue-800 mb-1">Selected Location</h4>
            <p className="text-sm text-blue-700">{formData.address}</p>
            <p className="text-sm text-blue-700">
              {formData.city}, {formData.county} {formData.postalCode}
            </p>
          </div>
        )}
      </div>
      
      <Separator />
      
      {/* Availability */}
      <div className="space-y-4">
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          <h3 className="text-base font-medium">Teaching Days</h3>
          <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 text-xs">Required</Badge>
        </div>
        
        <p className="text-sm text-gray-500">
          Select the days when you're available to teach.
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {weekdays.map(day => (
            <div key={day.id} className="flex items-center space-x-2">
              <Checkbox 
                id={day.id} 
                checked={formData.availability.days.includes(day.id)}
                onCheckedChange={() => toggleDay(day.id)}
              />
              <Label htmlFor={day.id} className="cursor-pointer">{day.label}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
          <h3 className="text-base font-medium">Teaching Times</h3>
          <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 text-xs">Required</Badge>
        </div>
        
        <p className="text-sm text-gray-500">
          Select the times of day when you're available to teach.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {timeSlots.map(time => (
            <div 
              key={time.id} 
              className={cn(
                "p-3 rounded-md border cursor-pointer transition-all",
                formData.availability.times[time.id as keyof typeof formData.availability.times] 
                  ? "bg-blue-50 border-blue-200" 
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              )}
              onClick={() => toggleTime(time.id as 'morning' | 'afternoon' | 'evening')}
            >
              <div className="flex items-center">
                <div className="text-xl mr-2">{time.icon}</div>
                <Label className="cursor-pointer">{time.label}</Label>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Save button */}
      {hasChanges && (
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              "transition-all",
              isSaving ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {isSaving ? (
              <>
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default LocationStep;