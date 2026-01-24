/**
 * MVP Availability Calendar
 *
 * Simplified calendar interface for teachers to set their availability:
 * - Weekly recurring schedule (e.g., Mon, Wed, Fri 2-5pm)
 * - Block out specific dates (holidays, vacation)
 * - View upcoming bookings
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MvpAvailabilityService, { DaySchedule } from '@/integrations/api/services/mvp-availability.service';
import { format, parse, addMinutes, parseISO } from 'date-fns';

// ... existing imports

// Days of the week
const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

interface TimeSlot {
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
}

interface WeeklySchedule {
  _id?: string;
  day: string;
  slots: TimeSlot[];
  isActive: boolean;
}

interface BlockedDate {
  _id?: string;
  date: Date;
  reason: string;
}

export default function AvailabilityCalendar() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [blockReason, setBlockReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load availability on mount
  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    try {
      setIsLoading(true);

      const availability = await MvpAvailabilityService.getMyAvailability();

      // Map backend schedule to frontend format
      if (availability && availability.weeklySchedule) {
        // Ensure all days are represented
        const schedule = DAYS_OF_WEEK.map(day => {
          const found = availability.weeklySchedule.find(s => s.day === day.value);
          if (found) {
            return {
              day: found.day,
              slots: found.slots,
              isActive: found.isActive
            };
          }
          return {
            day: day.value,
            slots: [],
            isActive: false
          };
        });
        setWeeklySchedule(schedule);
      } else {
        // Initialize empty schedule for all days
        const initialSchedule = DAYS_OF_WEEK.map(day => ({
          day: day.value,
          slots: [],
          isActive: false,
        }));
        setWeeklySchedule(initialSchedule);
      }

      // Map blocked dates
      if (availability && availability.blockedDates) {
        const mappedBlockedDates = availability.blockedDates.map((block: any) => ({
          _id: block.date, // Use date as ID since backend uses date for blocking/unblocking
          date: new Date(block.date),
          reason: block.reason || ''
        }));
        setBlockedDates(mappedBlockedDates);
      } else {
        setBlockedDates([]);
      }

    } catch (error) {
      console.error('Error loading availability:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load availability. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDayToggle = (day: string, checked: boolean) => {
    setWeeklySchedule(prev =>
      prev.map(schedule =>
        schedule.day === day
          ? { ...schedule, isActive: checked }
          : schedule
      )
    );
  };

  const handleAddTimeSlot = (day: string) => {
    setWeeklySchedule(prev =>
      prev.map(schedule =>
        schedule.day === day
          ? {
            ...schedule,
            slots: [
              ...schedule.slots,
              { startTime: '09:00', endTime: '10:00' },
            ],
          }
          : schedule
      )
    );
  };

  const handleRemoveTimeSlot = (day: string, slotIndex: number) => {
    setWeeklySchedule(prev =>
      prev.map(schedule =>
        schedule.day === day
          ? {
            ...schedule,
            slots: schedule.slots.filter((_, index) => index !== slotIndex),
          }
          : schedule
      )
    );
  };

  const handleTimeSlotChange = (
    day: string,
    slotIndex: number,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    setWeeklySchedule(prev =>
      prev.map(schedule =>
        schedule.day === day
          ? {
            ...schedule,
            slots: schedule.slots.map((slot, index) =>
              index === slotIndex ? { ...slot, [field]: value } : slot
            ),
          }
          : schedule
      )
    );
  };

  const handleBlockDates = async () => {
    if (selectedDates.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select at least one date to block.',
      });
      return;
    }

    try {
      // Prepare dates to block (only those not already blocked)
      const datesToBlock = selectedDates.filter(date => !isDateBlocked(date));

      if (datesToBlock.length === 0) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'All selected dates are already blocked.',
        });
        return;
      }

      const dateStrings = datesToBlock.map(date => format(date, 'yyyy-MM-dd'));

      // Optimistic update
      const newBlockedDates: BlockedDate[] = datesToBlock.map(date => ({
        _id: format(date, 'yyyy-MM-dd'),
        date: date,
        reason: blockReason || 'Unavailable',
      }));
      setBlockedDates(prev => [...prev, ...newBlockedDates]);

      await MvpAvailabilityService.blockDates({
        blockedDates: dateStrings.map(dateStr => ({
          date: dateStr,
          reason: blockReason
        }))
      });

      setSelectedDates([]);
      setBlockReason('');

      toast({
        title: 'Dates blocked',
        description: `${datesToBlock.length} date${datesToBlock.length > 1 ? 's' : ''} blocked successfully.`,
      });
    } catch (error) {
      console.error('Error blocking dates:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to block dates.',
      });
      // Revert optimistic update
      loadAvailability();
    }
  };

  const handleUnblockDate = async (id: string) => {
    try {
      // Optimistic update
      setBlockedDates(prev => prev.filter(blocked => blocked._id !== id));

      // ID is stored as date string compatible with backend
      await MvpAvailabilityService.unblockDate(id);

      toast({
        title: 'Date unblocked',
        description: 'The date has been unblocked.',
      });
    } catch (error) {
      console.error('Error unblocking date:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to unblock date.',
      });
      loadAvailability();
    }
  };

  const handleSaveAvailability = async () => {
    try {
      setIsSaving(true);

      // Validate that active days have at least one time slot
      const activeDaysWithoutSlots = weeklySchedule.filter(
        schedule => schedule.isActive && schedule.slots.length === 0
      );

      if (activeDaysWithoutSlots.length > 0) {
        toast({
          variant: 'destructive',
          title: 'Validation Error',
          description: 'Active days must have at least one time slot.',
        });
        setIsSaving(false);
        return;
      }

      // Convert frontend schedule to backend expected format
      const scheduleToSave: DaySchedule[] = weeklySchedule.map(s => ({
        day: s.day as DaySchedule['day'], // Cast as specific enum
        isActive: s.isActive,
        slots: s.slots
      }));

      await MvpAvailabilityService.setWeeklySchedule({ weeklySchedule: scheduleToSave });

      toast({
        title: 'Availability saved',
        description: 'Your availability has been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving availability:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save availability. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isDateBlocked = (date: Date) => {
    return blockedDates.some(
      blocked =>
        format(blocked.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const isDateSelected = (date: Date) => {
    return selectedDates.some(
      selected =>
        format(selected, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const handleDateClick = (date: Date | undefined) => {
    if (!date) return;

    // Don't allow selecting already blocked dates
    if (isDateBlocked(date)) return;

    const dateStr = format(date, 'yyyy-MM-dd');
    const isAlreadySelected = selectedDates.some(
      d => format(d, 'yyyy-MM-dd') === dateStr
    );

    if (isAlreadySelected) {
      // Deselect the date
      setSelectedDates(prev =>
        prev.filter(d => format(d, 'yyyy-MM-dd') !== dateStr)
      );
    } else {
      // Add the date to selection
      setSelectedDates(prev => [...prev, date]);
    }
  };

  const handleClearSelection = () => {
    setSelectedDates([]);
    setBlockReason('');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-600">Loading availability...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Availability Calendar</h2>
          <p className="text-gray-600 mt-1">
            Set your weekly schedule and block out specific dates
          </p>
        </div>
        <Button onClick={handleSaveAvailability} disabled={isSaving}>
          <Check className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Availability'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Weekly Schedule
            </CardTitle>
            <CardDescription>
              Set your recurring weekly availability
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {DAYS_OF_WEEK.map(day => {
              const daySchedule = weeklySchedule.find(s => s.day === day.value);
              if (!daySchedule) return null;

              return (
                <div key={day.value} className="border rounded-lg p-4 space-y-3">
                  {/* Day Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={day.value}
                        checked={daySchedule.isActive}
                        onCheckedChange={(checked) =>
                          handleDayToggle(day.value, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={day.value}
                        className="text-base font-medium cursor-pointer"
                      >
                        {day.label}
                      </Label>
                    </div>
                    {daySchedule.isActive && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddTimeSlot(day.value)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Time Slots */}
                  {daySchedule.isActive && daySchedule.slots.length > 0 && (
                    <div className="space-y-2 pl-6">
                      {daySchedule.slots.map((slot, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2"
                        >
                          <Input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) =>
                              handleTimeSlotChange(
                                day.value,
                                index,
                                'startTime',
                                e.target.value
                              )
                            }
                            className="w-32"
                          />
                          <span className="text-gray-500">to</span>
                          <Input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) =>
                              handleTimeSlotChange(
                                day.value,
                                index,
                                'endTime',
                                e.target.value
                              )
                            }
                            className="w-32"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleRemoveTimeSlot(day.value, index)
                            }
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {daySchedule.isActive && daySchedule.slots.length === 0 && (
                    <div className="pl-6">
                      <p className="text-sm text-gray-500">
                        No time slots added. Click + to add.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {weeklySchedule.every(s => !s.isActive) && (
              <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <p className="text-sm text-amber-800">
                  Please select at least one day to set your availability.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Block Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Block Dates
            </CardTitle>
            <CardDescription>
              Block specific dates when you're unavailable
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Calendar */}
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDates[0]}
                onSelect={handleDateClick}
                modifiers={{
                  blocked: (date) => isDateBlocked(date),
                  selected: (date) => isDateSelected(date),
                }}
                modifiersStyles={{
                  blocked: {
                    backgroundColor: '#FEE2E2',
                    color: '#991B1B',
                    textDecoration: 'line-through',
                  },
                  selected: {
                    backgroundColor: '#DBEAFE',
                    color: '#1E40AF',
                    fontWeight: 'bold',
                  },
                }}
                className="rounded-md border"
              />
            </div>

            {/* Block Date Form */}
            {selectedDates.length > 0 && (
              <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-900">
                    {selectedDates.length} date{selectedDates.length > 1 ? 's' : ''} selected
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleClearSelection}
                    className="h-6 text-xs"
                  >
                    Clear
                  </Button>
                </div>

                {/* Selected Dates List */}
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {selectedDates
                    .sort((a, b) => a.getTime() - b.getTime())
                    .map((date, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-xs bg-white px-2 py-1 rounded"
                      >
                        <span>{format(date, 'PPP')}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDateClick(date)}
                          className="h-5 w-5 p-0"
                        >
                          <Trash2 className="h-3 w-3 text-gray-500" />
                        </Button>
                      </div>
                    ))}
                </div>

                <Input
                  placeholder="Reason (optional)"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                />
                <Button
                  size="sm"
                  className="w-full"
                  onClick={handleBlockDates}
                >
                  Block {selectedDates.length} Date{selectedDates.length > 1 ? 's' : ''}
                </Button>
              </div>
            )}

            {/* Blocked Dates List */}
            {blockedDates.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Blocked Dates</Label>
                {blockedDates.map((blocked) => (
                  <div
                    key={blocked._id}
                    className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {format(blocked.date, 'PPP')}
                      </p>
                      {blocked.reason && (
                        <p className="text-xs text-gray-600">{blocked.reason}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleUnblockDate(blocked._id!)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {blockedDates.length === 0 && selectedDates.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No blocked dates. Click dates on the calendar to select and block them.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Banner */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="flex items-start gap-3 pt-6">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-900">
              How availability works
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Set your weekly recurring schedule for each day</li>
              <li>• Click multiple dates on the calendar to select them</li>
              <li>• Block specific dates for holidays or personal time</li>
              <li>• Parents can only book during your available time slots</li>
              <li>• Remember to save your changes!</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
