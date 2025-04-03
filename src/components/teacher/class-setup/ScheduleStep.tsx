
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ScheduleStep = () => {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Set your teaching schedule and availability. This helps students know when they can book classes with you.
      </p>
      
      <div className="space-y-4">
        <div>
          <Label>Days Available</Label>
          <div className="grid grid-cols-7 gap-2 mt-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 hover:bg-blue-200 cursor-pointer flex items-center justify-center text-blue-800 text-sm font-medium">
                  {day[0]}
                </div>
                <span className="text-xs mt-1">{day}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t pt-4">
          <Label>Time Slots</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <Label className="text-xs text-gray-500">Start Time</Label>
              <Select defaultValue="9">
                <SelectTrigger>
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({length: 12}, (_, i) => i + 7).map(hour => (
                    <SelectItem key={hour} value={hour.toString()}>
                      {hour}:00 {hour < 12 ? 'AM' : 'PM'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-xs text-gray-500">End Time</Label>
              <Select defaultValue="17">
                <SelectTrigger>
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({length: 12}, (_, i) => i + 12).map(hour => (
                    <SelectItem key={hour} value={hour.toString()}>
                      {hour > 12 ? hour - 12 : hour}:00 PM
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="mt-3">
            Add Another Time Slot
          </Button>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="calendar-sync">Sync with your calendar</Label>
            <Switch id="calendar-sync" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Automatically sync your teaching schedule with Google Calendar or Outlook
          </p>
        </div>
        
        <div className="border-t pt-4">
          <Label>Class Duration</Label>
          <RadioGroup defaultValue="60" className="grid grid-cols-3 gap-2 mt-2">
            <div className="flex items-center space-x-2 border rounded-md p-2">
              <RadioGroupItem value="30" id="duration-30" />
              <Label htmlFor="duration-30">30 min</Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-md p-2">
              <RadioGroupItem value="60" id="duration-60" />
              <Label htmlFor="duration-60">60 min</Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-md p-2">
              <RadioGroupItem value="90" id="duration-90" />
              <Label htmlFor="duration-90">90 min</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default ScheduleStep;
