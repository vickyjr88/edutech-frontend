import React, { useState } from 'react';
import { Calendar, CalendarDays, Check, Clock, DollarSign, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TeacherBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: any;
}

const TeacherBookingDialog: React.FC<TeacherBookingDialogProps> = ({ isOpen, onClose, teacher }) => {
  const [step, setStep] = useState<'session-type' | 'date-time' | 'confirmation'>('session-type');
  const [sessionType, setSessionType] = useState<'one-time' | 'recurring' | 'package'>('one-time');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Mock data for UI demonstration
  const availableDates = [
    '2023-05-12', '2023-05-13', '2023-05-15', '2023-05-16', '2023-05-18'
  ];
  
  const availableTimes = [
    '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleContinue = () => {
    if (step === 'session-type') {
      setStep('date-time');
    } else if (step === 'date-time') {
      setStep('confirmation');
    }
  };

  const handleBack = () => {
    if (step === 'date-time') {
      setStep('session-type');
    } else if (step === 'confirmation') {
      setStep('date-time');
    }
  };

  const handleComplete = () => {
    // Here you would submit the booking
    onClose();
    // Reset state for next time
    setStep('session-type');
    setSessionType('one-time');
    setSelectedDate('');
    setSelectedTime('');
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center space-x-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'session-type' ? 'bg-kidato-purple text-white' : 'bg-kidato-purple text-white'}`}>
          1
        </div>
        <div className={`w-16 h-1 ${step === 'session-type' ? 'bg-gray-300' : 'bg-kidato-purple'}`}></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'date-time' ? 'bg-kidato-purple text-white' : step === 'confirmation' ? 'bg-kidato-purple text-white' : 'bg-gray-200 text-gray-600'}`}>
          2
        </div>
        <div className={`w-16 h-1 ${step === 'confirmation' ? 'bg-kidato-purple' : 'bg-gray-300'}`}></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'confirmation' ? 'bg-kidato-purple text-white' : 'bg-gray-200 text-gray-600'}`}>
          3
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Book a Session with {teacher.name}</DialogTitle>
          <DialogDescription>
            Select your session type, preferred date, and time to schedule your learning session.
          </DialogDescription>
        </DialogHeader>

        {renderStepIndicator()}

        {step === 'session-type' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">Select Session Type</h3>
              
              <RadioGroup 
                defaultValue={sessionType} 
                onValueChange={(value) => setSessionType(value as any)}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-4 hover:border-kidato-purple transition-colors">
                  <RadioGroupItem value="one-time" id="one-time" />
                  <Label htmlFor="one-time" className="flex-1 cursor-pointer">
                    <div className="font-medium">One-time Session</div>
                    <div className="text-sm text-gray-600 mt-1">
                      A single learning session focused on specific topics or questions
                    </div>
                  </Label>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    From {teacher.hourlyRate}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-4 hover:border-kidato-purple transition-colors">
                  <RadioGroupItem value="recurring" id="recurring" />
                  <Label htmlFor="recurring" className="flex-1 cursor-pointer">
                    <div className="font-medium">Recurring Sessions</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Weekly sessions for ongoing support and consistent progress
                    </div>
                  </Label>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    10% off
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-4 hover:border-kidato-purple transition-colors">
                  <RadioGroupItem value="package" id="package" />
                  <Label htmlFor="package" className="flex-1 cursor-pointer">
                    <div className="font-medium">Session Package</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Bundle of 5 or 10 sessions at a discounted rate
                    </div>
                  </Label>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    20% off
                  </Badge>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {step === 'date-time' && (
          <div className="space-y-6">
            <Tabs defaultValue="calendar">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="calendar" className="space-y-4">
                <div className="grid grid-cols-7 gap-1">
                  {/* Calendar header */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600 py-1">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days */}
                  {Array.from({ length: 35 }).map((_, index) => {
                    const day = index - 2; // Adjust to start on Monday
                    const isAvailable = availableDates.includes(`2023-05-${day < 10 ? '0' + day : day}`);
                    return (
                      <div 
                        key={index}
                        className={`text-center py-2 rounded-md ${
                          day <= 0 || day > 31 
                            ? 'text-gray-300 cursor-default' 
                            : isAvailable 
                              ? 'cursor-pointer hover:bg-blue-100 ' + (selectedDate === `2023-05-${day < 10 ? '0' + day : day}` ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-800') 
                              : 'text-gray-400 cursor-default'
                        }`}
                        onClick={() => {
                          if (day > 0 && day <= 31 && isAvailable) {
                            setSelectedDate(`2023-05-${day < 10 ? '0' + day : day}`);
                          }
                        }}
                      >
                        {day > 0 && day <= 31 ? day : ''}
                      </div>
                    );
                  })}
                </div>
                
                {selectedDate && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">Available Times on {selectedDate}</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          className={`p-2 text-sm rounded-md border ${
                            selectedTime === time 
                              ? 'bg-blue-500 text-white border-blue-500' 
                              : 'border-gray-200 hover:border-blue-500'
                          }`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="list">
                <div className="space-y-4">
                  {availableDates.map((date) => (
                    <Card key={date} className={`cursor-pointer transition-colors ${selectedDate === date ? 'border-blue-500' : 'hover:border-blue-200'}`}>
                      <CardContent className="p-4" onClick={() => setSelectedDate(date)}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <CalendarDays className="h-5 w-5 text-blue-600 mr-2" />
                            <span className="font-medium">{date}</span>
                          </div>
                          <span className="text-sm text-gray-600">{availableTimes.length} slots available</span>
                        </div>
                        
                        {selectedDate === date && (
                          <div className="mt-4 grid grid-cols-3 gap-2">
                            {availableTimes.map((time) => (
                              <button
                                key={time}
                                className={`p-2 text-sm rounded-md border ${
                                  selectedTime === time 
                                    ? 'bg-blue-500 text-white border-blue-500' 
                                    : 'border-gray-200 hover:border-blue-500'
                                }`}
                                onClick={() => setSelectedTime(time)}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {step === 'confirmation' && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Booking Summary</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium mr-2">Date:</span>
                  <span>{selectedDate}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium mr-2">Time:</span>
                  <span>{selectedTime}</span>
                </div>
                
                <div className="flex items-center">
                  <ExternalLink className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium mr-2">Session Type:</span>
                  <span>
                    {sessionType === 'one-time' && 'One-time Session'}
                    {sessionType === 'recurring' && 'Recurring Weekly Sessions'}
                    {sessionType === 'package' && 'Session Package'}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium mr-2">Price:</span>
                  <span>
                    {sessionType === 'one-time' && teacher.hourlyRate}
                    {sessionType === 'recurring' && `${teacher.hourlyRate} (10% discount applied)`}
                    {sessionType === 'package' && `${teacher.hourlyRate} (20% discount applied)`}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-3">What to Expect</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>You'll receive a confirmation email with meeting details</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>The session will take place online via Zoom</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Payment will be processed only after session confirmation</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>You can reschedule up to 24 hours before the session</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          {step !== 'session-type' && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          
          <div className="flex-1 sm:flex-initial mb-4 sm:mb-0">
            {step === 'confirmation' ? (
              <Button 
                className="w-full bg-kidato-purple hover:bg-blue-700" 
                onClick={handleComplete}
              >
                Confirm Booking
              </Button>
            ) : (
              <Button 
                className="w-full bg-kidato-purple hover:bg-blue-700" 
                onClick={handleContinue}
                disabled={(step === 'date-time' && (!selectedDate || !selectedTime))}
              >
                Continue
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherBookingDialog;