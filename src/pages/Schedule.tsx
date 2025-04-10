
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

const Schedule = () => {
  const [userName] = useState("John Doe");
  const [view, setView] = useState<"month" | "week" | "day">("day");
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
  
  const handleGoogleSync = () => {
    toast({
      title: "Sync initiated",
      description: "Syncing with Google Calendar...",
    });
    
    // Simulate syncing process
    setTimeout(() => {
      toast({
        title: "Sync complete",
        description: "Your schedule has been synced with Google Calendar",
      });
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <StudentSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Nav */}
        <StudentDashboardHeader userName={userName} />

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
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer">Classes</Badge>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer">Hangouts</Badge>
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 cursor-pointer">Birthdays</Badge>
                        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer">Achievements</Badge>
                        <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 cursor-pointer">Assignments</Badge>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button 
                  size="sm" 
                  className="bg-kidato-blue hover:bg-kidato-dark-blue"
                  onClick={() => setShowAddEventDialog(true)}
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
                  <ScheduleCalendar view={view} />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Kidato AI Mascot */}
      <KidatoMascot />

      {/* Add Event Dialog */}
      <EventFormDialog 
        open={showAddEventDialog}
        onOpenChange={setShowAddEventDialog}
      />

      {/* Toaster for notifications */}
      <Toaster />
    </div>
  );
};

export default Schedule;
