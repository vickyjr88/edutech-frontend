
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { ScheduleEvent, addEvent, updateEvent } from "./mockScheduleData";
import { toast } from "@/hooks/use-toast";

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventToEdit?: ScheduleEvent;
}

export const EventFormDialog = ({ open, onOpenChange, eventToEdit }: EventFormDialogProps) => {
  const isEditing = !!eventToEdit;
  
  const [eventData, setEventData] = useState<Partial<ScheduleEvent>>(
    eventToEdit || {
      title: "",
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      time: "",
      location: "",
      description: "",
      type: "class",
      duration: 1
    }
  );

  const handleChange = (field: keyof ScheduleEvent, value: any) => {
    setEventData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!eventData.title || !eventData.date) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isEditing && eventToEdit) {
        // Update existing event
        updateEvent({
          ...eventToEdit,
          ...eventData,
        });
        toast({
          title: "Event updated",
          description: "Your event has been updated successfully"
        });
      } else {
        // Create new event
        addEvent(eventData as ScheduleEvent);
        toast({
          title: "Event created",
          description: "Your event has been created successfully"
        });
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem saving your event",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Event" : "Add Event"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={eventData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Event title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date & Time *</Label>
              <Input
                id="date"
                type="datetime-local"
                value={typeof eventData.date === 'string' ? eventData.date.slice(0, 16) : format(new Date(eventData.date), "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => {
                  handleChange("date", e.target.value);
                  // Also update the human-readable time
                  const date = new Date(e.target.value);
                  const timeFormat = format(date, "h:mm a");
                  if (eventData.duration) {
                    const endTime = new Date(date.getTime() + eventData.duration * 60 * 60 * 1000);
                    const endTimeFormat = format(endTime, "h:mm a");
                    handleChange("time", `${timeFormat} - ${endTimeFormat}`);
                  } else {
                    handleChange("time", timeFormat);
                  }
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                min="0.5"
                step="0.5"
                value={eventData.duration}
                onChange={(e) => handleChange("duration", parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={eventData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="Event location"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={eventData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Add details about this event"
              className="min-h-[80px]"
            />
          </div>

          <div className="grid gap-2">
            <Label>Event Type</Label>
            <RadioGroup 
              value={eventData.type} 
              onValueChange={(value) => handleChange("type", value)}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="class" id="class" />
                <Label htmlFor="class" className="text-blue-700 font-medium">Class</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hangout" id="hangout" />
                <Label htmlFor="hangout" className="text-green-700 font-medium">Hangout</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="birthday" id="birthday" />
                <Label htmlFor="birthday" className="text-amber-700 font-medium">Birthday</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="achievement" id="achievement" />
                <Label htmlFor="achievement" className="text-purple-700 font-medium">Achievement</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="assignment" id="assignment" />
                <Label htmlFor="assignment" className="text-rose-700 font-medium">Assignment</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEditing ? "Update" : "Create"} Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
