import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { googleCalendarService, CreateEventRequest } from '@/integrations/api/services/google-calendar.service';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';

interface CreateGoogleCalendarEventProps {
  onEventCreated?: (event: any) => void;
  defaultTitle?: string;
  defaultStartTime?: string;
  defaultEndTime?: string;
  defaultAttendees?: string[];
}

const CreateGoogleCalendarEvent: React.FC<CreateGoogleCalendarEventProps> = ({
  onEventCreated,
  defaultTitle = '',
  defaultStartTime = '',
  defaultEndTime = '',
  defaultAttendees = []
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<CreateEventRequest>({
    title: defaultTitle,
    description: '',
    startTime: defaultStartTime,
    endTime: defaultEndTime,
    timezone: 'Africa/Nairobi',
    attendees: defaultAttendees,
    reminderMinutes: 30
  });

  const handleInputChange = (field: keyof CreateEventRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAttendeesChange = (value: string) => {
    const emails = value.split(',').map(email => email.trim()).filter(email => email);
    setFormData(prev => ({
      ...prev,
      attendees: emails
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.startTime || !formData.endTime) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    try {
      const { data, error } = await googleCalendarService.createEvent(formData);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create calendar event",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Calendar event created successfully",
      });

      if (onEventCreated && data) {
        onEventCreated(data.event);
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        timezone: 'Africa/Nairobi',
        attendees: [],
        reminderMinutes: 30
      });

    } catch (error) {
      console.error('Error creating calendar event:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Calendar className="h-6 w-6 mr-2 text-blue-600" />
          <CardTitle>Create Calendar Event</CardTitle>
        </div>
        <CardDescription>
          Create a new event in your Google Calendar for class sessions or meetings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter event title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Nairobi">Africa/Nairobi (EAT)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter event description (optional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="attendees">Attendees (Email addresses)</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="attendees"
                  value={formData.attendees?.join(', ') || ''}
                  onChange={(e) => handleAttendeesChange(e.target.value)}
                  placeholder="email1@example.com, email2@example.com"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-gray-500">Separate multiple emails with commas</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reminderMinutes">Reminder (Minutes)</Label>
              <Select 
                value={formData.reminderMinutes?.toString()} 
                onValueChange={(value) => handleInputChange('reminderMinutes', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No reminder</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="1440">1 day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  title: '',
                  description: '',
                  startTime: '',
                  endTime: '',
                  timezone: 'Africa/Nairobi',
                  attendees: [],
                  reminderMinutes: 30
                });
              }}
            >
              Clear
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isCreating ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Create Event
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateGoogleCalendarEvent;