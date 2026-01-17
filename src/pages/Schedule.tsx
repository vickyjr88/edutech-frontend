import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Plus, Filter, ChevronDown, RefreshCw } from "lucide-react";
import StudentDashboardHeader from "@/components/dashboard/StudentDashboardHeader";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import KidatoMascot from "@/components/dashboard/KidatoMascot";
import { ScheduleCalendar } from "@/components/schedule/ScheduleCalendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EventFormDialog } from "@/components/schedule/EventFormDialog";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents } from "@/hooks/useEvents";
import { googleCalendarService } from "@/integrations/api/services/google-calendar.service";
import { ScheduleEvent } from "@/types/calendar";

const Schedule = () => {
  const { user } = useAuth();
  const { events, createEvent, updateEvent, deleteEvent, refreshEvents } = useEvents();
  const [view, setView] = useState<"month" | "week" | "day">("day");
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | undefined>(undefined);

  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>(['Classes', 'Hangouts', 'Birthdays', 'Achievements', 'Assignments']);

  const handleEventTypeToggle = (type: string) => {
    setSelectedEventTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const getEventTypeColor = (type: string, isSelected: boolean) => {
    if (!isSelected) return "bg-gray-100 text-gray-500 hover:bg-gray-200 border-transparent";
    switch (type) {
      case 'Classes': return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
      case 'Hangouts': return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
      case 'Birthdays': return "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200";
      case 'Achievements': return "bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200";
      case 'Assignments': return "bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleGoogleSync = async () => {
    toast({ title: "Sync initiated", description: "Checking Google Calendar connection..." });
    try {
      const { data: statusData, error: statusError } = await googleCalendarService.getConnectionStatus();

      if (statusError) {
        throw statusError;
      }

      if (statusData?.connected) {
        toast({ title: "Synced", description: "Schedule updated." });
        refreshEvents();
      } else {
        toast({ title: "Connecting", description: "Redirecting to Google Calendar authorization..." });
        const { data: authData, error: authError } = await googleCalendarService.getAuthUrl();

        if (authError) throw authError;

        if (authData?.authUrl) {
          window.location.href = authData.authUrl;
        }
      }
    } catch (error) {
      console.error("Sync error:", error);
      toast({ title: "Error", description: "Failed to sync with Google Calendar.", variant: "destructive" });
    }
  };

  const filteredEvents = events.filter(event => {
    const typeMapping: Record<string, string> = {
      'Classes': 'class',
      'Hangouts': 'hangout',
      'Birthdays': 'birthday',
      'Achievements': 'achievement',
      'Assignments': 'assignment'
    };
    return selectedEventTypes.some(t => typeMapping[t] === event.type);
  });

  const handleEditEvent = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setShowAddEventDialog(true);
  };

  const handleDeleteEvent = async (event: ScheduleEvent) => {
    await deleteEvent(event.id);
  };

  const handleSaveEvent = async (event: ScheduleEvent) => {
    if (selectedEvent) {
      await updateEvent(event.id, event);
    } else {
      await createEvent(event);
    }
  };

  const handleAddEvent = (date?: Date) => {
    setSelectedEvent(undefined);
    if (date) {
      // Pre-fill date if provided (e.g. from clicking a slot)
      // We'll handle this by passing initial values if EventFormDialog supported it, 
      // but for now simple 'add' is fine, or we can set a temp state.
      // Ideally EventFormDialog should be refactored to accept initialDate but we'll skip for now or rely on eventToEdit being null.
      // Actually, let's create a temp object if date is passed to initialize the form
      setSelectedEvent({
        id: '',
        title: '',
        date: date.toISOString(),
        time: '',
        type: 'class',
        duration: 1
      } as ScheduleEvent); // Type assertion for partial initialization
    }
    setShowAddEventDialog(true);
  }

  // Handle dialog close to reset selected event
  const onDialogChange = (open: boolean) => {
    setShowAddEventDialog(open);
    if (!open) {
      setTimeout(() => setSelectedEvent(undefined), 300); // clear after animation
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white md:ml-64 transition-all duration-300">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Nav */}
        <StudentDashboardHeader userName={user?.fullName || "Student"} />

        {/* Content */}
        <main className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h1 className="text-2xl font-bold text-gray-800">Schedule</h1>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={handleGoogleSync}
                >
                  <RefreshCw size={16} />
                  <span>Sync with Google Calendar</span>
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Filter size={16} />
                      <span>Filter</span>
                      <ChevronDown size={16} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56">
                    <div className="space-y-2">
                      <h4 className="font-medium">Event Types</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Classes', 'Hangouts', 'Birthdays', 'Achievements', 'Assignments'].map(type => (
                          <Badge
                            key={type}
                            variant="outline"
                            className={`cursor-pointer transition-colors border ${getEventTypeColor(type, selectedEventTypes.includes(type))}`}
                            onClick={() => handleEventTypeToggle(type)}
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  size="sm"
                  className="bg-kidato-purple hover:bg-kidato-dark-blue"
                  onClick={() => handleAddEvent()}
                >
                  <Plus size={16} className="mr-1" /> Add Event
                </Button>
              </div>
            </div>

            {/* Full-width Calendar Area */}
            <div className="w-full">
              <Card className="border-2 border-blue-100">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-bold flex items-center">
                      <CalendarIcon className="mr-2 h-5 w-5 text-blue-500" />
                      Your Schedule
                    </CardTitle>
                    <Tabs value={view} onValueChange={(v) => setView(v as "month" | "week" | "day")} className="ml-auto">
                      <TabsList>
                        <TabsTrigger value="day">Day</TabsTrigger>
                        <TabsTrigger value="week">Week</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <ScheduleCalendar
                    view={view}
                    events={filteredEvents}
                    onEventClick={handleEditEvent}
                    onAddEvent={handleAddEvent}
                    onDeleteEvent={handleDeleteEvent}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Kidato AI Mascot */}
      <KidatoMascot />

      {/* Add/Edit Event Dialog */}
      <EventFormDialog
        open={showAddEventDialog}
        onOpenChange={onDialogChange}
        eventToEdit={selectedEvent}
        onSave={handleSaveEvent}
      />

      {/* Toaster for notifications */}
      <Toaster />
    </div>
  );
};

export default Schedule;
