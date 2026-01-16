/**
 * MVP Booking Flow Component
 *
 * Streamlined booking process:
 * 1. Select offering
 * 2. Choose date/time from teacher's availability
 * 3. Confirm booking details
 * 4. Proceed to payment
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  Clock,
  DollarSign,
  Calendar as CalendarIcon,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  User,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mvpApiClient } from '@/integrations/api/mvp-client';
import { format, addDays, isSameDay, parse } from 'date-fns';

interface Offering {
  _id: string;
  type: 'one-time' | 'monthly-package' | 'course';
  title: string;
  description: string;
  price: number;
  sessionDuration: number;
  sessionsPerMonth?: number;
  numberOfSessions?: number;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface Teacher {
  _id: string;
  fullName: string;
  profilePhotoUrl?: string;
}

interface BookingFlowProps {
  teacherId: string;
  teacher?: Teacher;
  onComplete?: () => void;
}

type BookingStep = 'offering' | 'datetime' | 'confirm';

export default function BookingFlow({ teacherId, teacher, onComplete }: BookingFlowProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  // State
  const [currentStep, setCurrentStep] = useState<BookingStep>('offering');
  const [isLoading, setIsLoading] = useState(true);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [selectedOffering, setSelectedOffering] = useState<Offering | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadOfferings();
  }, [teacherId]);

  useEffect(() => {
    if (selectedDate && selectedOffering) {
      loadAvailableSlots(selectedDate);
    }
  }, [selectedDate, selectedOffering]);

  const loadOfferings = async () => {
    try {
      setIsLoading(true);

      // TODO: Replace with actual API call
      // const data = await mvpApiClient.get<Offering[]>(`/teachers/${teacherId}/offerings`);

      // Mock data
      setOfferings([]);
    } catch (error) {
      console.error('Error loading offerings:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load offerings. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableSlots = async (date: Date) => {
    try {
      // TODO: Replace with actual API call
      // const data = await mvpApiClient.get<TimeSlot[]>(
      //   `/teachers/${teacherId}/availability/${format(date, 'yyyy-MM-dd')}`
      // );

      // Mock data - generate slots for demo
      const slots: TimeSlot[] = [
        { time: '09:00', available: true },
        { time: '10:00', available: true },
        { time: '11:00', available: false },
        { time: '14:00', available: true },
        { time: '15:00', available: true },
        { time: '16:00', available: true },
      ];

      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading availability:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load availability. Please try again.',
      });
    }
  };

  const handleOfferingSelect = (offering: Offering) => {
    setSelectedOffering(offering);
    setCurrentStep('datetime');
  };

  const handleDateTimeConfirm = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please select both date and time.',
      });
      return;
    }
    setCurrentStep('confirm');
  };

  const handleBookingConfirm = async () => {
    if (!selectedOffering || !selectedDate || !selectedTime) {
      return;
    }

    try {
      setIsSubmitting(true);

      const bookingData = {
        teacherId,
        offeringId: selectedOffering._id,
        scheduledDate: format(selectedDate, 'yyyy-MM-dd'),
        scheduledTime: selectedTime,
      };

      // TODO: Replace with actual API call
      // const response = await mvpApiClient.post('/bookings', bookingData);

      // Mock response - replace with actual API response
      const mockBookingId = `booking_${Date.now()}`;

      toast({
        title: 'Booking created!',
        description: 'Redirecting to payment...',
      });

      // Navigate to payment page with booking details
      navigate(`/payment/${mockBookingId}`, {
        state: {
          amount: selectedOffering.price,
          offeringTitle: selectedOffering.title,
          teacherName: teacher?.fullName || 'Teacher',
          scheduledDate: format(selectedDate, 'PPP'),
        },
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        variant: 'destructive',
        title: 'Booking failed',
        description: 'Failed to create booking. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOfferingTypeLabel = (type: Offering['type']) => {
    switch (type) {
      case 'one-time':
        return 'One-time Lesson';
      case 'monthly-package':
        return 'Monthly Package';
      case 'course':
        return 'Course';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-600">Loading offerings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 'offering'
                ? 'bg-blue-600 text-white'
                : 'bg-green-600 text-white'
            }`}
          >
            {currentStep === 'offering' ? '1' : <Check className="h-5 w-5" />}
          </div>
          <span className="text-sm font-medium">Select Offering</span>
        </div>
        <div className="w-12 h-0.5 bg-gray-300"></div>
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 'datetime'
                ? 'bg-blue-600 text-white'
                : currentStep === 'confirm'
                ? 'bg-green-600 text-white'
                : 'bg-gray-300 text-gray-600'
            }`}
          >
            {currentStep === 'confirm' ? <Check className="h-5 w-5" /> : '2'}
          </div>
          <span className="text-sm font-medium">Date & Time</span>
        </div>
        <div className="w-12 h-0.5 bg-gray-300"></div>
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 'confirm'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-600'
            }`}
          >
            3
          </div>
          <span className="text-sm font-medium">Confirm & Pay</span>
        </div>
      </div>

      {/* Step 1: Select Offering */}
      {currentStep === 'offering' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select an Offering</CardTitle>
              <CardDescription>
                Choose the lesson, package, or course you want to book
              </CardDescription>
            </CardHeader>
            <CardContent>
              {offerings.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    This teacher hasn't created any offerings yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {offerings.map((offering) => (
                    <div
                      key={offering._id}
                      className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors"
                      onClick={() => handleOfferingSelect(offering)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{offering.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {getOfferingTypeLabel(offering.type)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {offering.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {offering.sessionDuration} min
                            </span>
                            {offering.type === 'monthly-package' && (
                              <span>{offering.sessionsPerMonth} sessions/month</span>
                            )}
                            {offering.type === 'course' && (
                              <span>{offering.numberOfSessions} sessions total</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">KES {offering.price}</p>
                          <p className="text-xs text-gray-500">
                            {offering.type === 'monthly-package' ? 'per month' : 'total'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Select Date & Time */}
      {currentStep === 'datetime' && selectedOffering && (
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep('offering')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Offerings
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Select Date & Time</CardTitle>
              <CardDescription>
                Choose when you'd like to have your session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Calendar */}
                <div>
                  <Label className="mb-3 block">Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>

                {/* Time Slots */}
                <div>
                  <Label className="mb-3 block">
                    Available Times
                    {selectedDate && ` for ${format(selectedDate, 'PPP')}`}
                  </Label>
                  {!selectedDate ? (
                    <p className="text-sm text-gray-600">
                      Please select a date first
                    </p>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-sm text-gray-600">
                      No available slots for this date
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTime === slot.time ? 'default' : 'outline'}
                          className="h-auto py-3"
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleDateTimeConfirm}
                  disabled={!selectedDate || !selectedTime}
                >
                  Continue to Confirm
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Confirm & Pay */}
      {currentStep === 'confirm' && selectedOffering && selectedDate && (
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep('datetime')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Date & Time
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Confirm Your Booking</CardTitle>
              <CardDescription>
                Review your booking details before proceeding to payment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Teacher Info */}
              {teacher && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                    {teacher.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{teacher.fullName}</p>
                    <p className="text-sm text-gray-600">Your Teacher</p>
                  </div>
                </div>
              )}

              {/* Booking Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Offering</span>
                  <span className="font-medium">{selectedOffering.title}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Type</span>
                  <Badge variant="outline">
                    {getOfferingTypeLabel(selectedOffering.type)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">{format(selectedDate, 'PPP')}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{selectedOffering.sessionDuration} minutes</span>
                </div>
                <div className="flex items-center justify-between py-3 bg-blue-50 px-3 rounded-lg">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold">KES {selectedOffering.price}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  size="lg"
                  onClick={handleBookingConfirm}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <DollarSign className="h-5 w-5 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
