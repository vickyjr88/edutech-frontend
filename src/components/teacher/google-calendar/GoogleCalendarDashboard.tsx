import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, ExternalLink, Calendar, Clock, RefreshCw, Link as LinkIcon, Users, Plus } from "lucide-react";
import CreateGoogleCalendarEvent from "./CreateGoogleCalendarEvent";
import GoogleCalendarDisconnectDialog from "./GoogleCalendarDisconnectDialog";
import { googleCalendarService } from "@/integrations/api/services/google-calendar.service";
import { toast } from "@/hooks/use-toast";

const GoogleCalendarDashboard: React.FC = () => {
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accountEmail, setAccountEmail] = useState<string | undefined>(undefined);
  const [connectionDate, setConnectionDate] = useState<string | undefined>(undefined);
  const [isChecking, setIsChecking] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    checkGoogleCalendarConnection();
  }, []);

  const checkGoogleCalendarConnection = async () => {
    setIsLoading(true);
    setIsChecking(true);
    try {
      const { data, error } = await googleCalendarService.getConnectionStatus();
      
      if (error) {
        console.error("Failed to get Google Calendar connection status:", error);
        setIsGoogleCalendarConnected(false);
      } else {
        setIsGoogleCalendarConnected(data?.connected || false);
        setAccountEmail(data?.email);
        setConnectionDate(data?.connected_at);
        
        if (data?.connected) {
          // Load recent events if connected
          loadEvents();
        }
      }
    } catch (error) {
      console.error("Error checking Google Calendar connection:", error);
      setIsGoogleCalendarConnected(false);
    } finally {
      setIsLoading(false);
      setIsChecking(false);
    }
  };

  const loadEvents = async () => {
    try {
      const { data, error } = await googleCalendarService.getEvents();
      if (!error && data) {
        setEvents(data);
      }
    } catch (error) {
      console.error("Error loading calendar events:", error);
    }
  };

  const getAuthUrl = async () => {
    try {
      const { data, error } = await googleCalendarService.getAuthUrl();
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to get Google Calendar authorization URL",
          variant: "destructive"
        });
        return;
      }
      
      if (data?.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error("Error getting Google Calendar auth URL:", error);
      toast({
        title: "Error",
        description: "Failed to connect to Google Calendar",
        variant: "destructive"
      });
    }
  };

  const handleDisconnectClick = () => {
    setShowDisconnectDialog(true);
  };

  const disconnectGoogleCalendar = async () => {
    setIsDisconnecting(true);
    setShowDisconnectDialog(false);
    
    try {
      const { data, error } = await googleCalendarService.disconnectAccount();
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to disconnect Google Calendar account",
          variant: "destructive"
        });
        return;
      }
      
      setIsGoogleCalendarConnected(false);
      setAccountEmail(undefined);
      setConnectionDate(undefined);
      setEvents([]);
      
      toast({
        title: "Success",
        description: "Google Calendar account disconnected successfully",
      });
    } catch (error) {
      console.error("Error disconnecting Google Calendar:", error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const formatConnectionDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleEventCreated = (event: any) => {
    toast({
      title: "Event Created",
      description: `"${event.title}" has been added to your calendar`,
    });
    loadEvents(); // Refresh events list
  };

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className={`relative overflow-hidden rounded-lg border ${
        isGoogleCalendarConnected 
          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200" 
          : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
      }`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="flex items-center space-x-2">
                    {isGoogleCalendarConnected ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-green-900">Connected</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                          Active
                        </Badge>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-blue-900">Not Connected</span>
                        <Badge variant="outline" className="border-blue-300 text-blue-700">
                          Setup Required
                        </Badge>
                      </>
                    )}
                  </div>
                  {isGoogleCalendarConnected && accountEmail && (
                    <p className="text-sm text-green-700 mt-1">
                      {accountEmail} • Connected {formatConnectionDate(connectionDate)}
                    </p>
                  )}
                  {!isGoogleCalendarConnected && (
                    <p className="text-sm text-blue-700 mt-1">
                      Connect your account to sync calendar events
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={isChecking}
                onClick={checkGoogleCalendarConnection}
                className={isGoogleCalendarConnected ? "text-green-700 hover:bg-green-100" : "text-blue-700 hover:bg-blue-100"}
              >
                {isChecking ? (
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              
              {isGoogleCalendarConnected ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  disabled={isDisconnecting}
                  onClick={handleDisconnectClick}
                >
                  {isDisconnecting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin mr-2" />
                      Disconnecting...
                    </>
                  ) : (
                    <>
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Disconnect
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  size="sm"
                  onClick={getAuthUrl}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Connect Account
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className={`absolute inset-0 opacity-10 ${
          isGoogleCalendarConnected 
            ? "bg-gradient-to-r from-green-400 to-emerald-400" 
            : "bg-gradient-to-r from-blue-400 to-indigo-400"
        }`} />
      </div>
      
      {/* Main Content */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Google Calendar</h2>
          <p className="text-muted-foreground">
            {isGoogleCalendarConnected 
              ? "Manage your calendar events and class schedules" 
              : "Connect your Google Calendar to sync class events and schedules"}
          </p>
        </div>
        
        {!isGoogleCalendarConnected ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Google Calendar to Get Started</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Once connected, you'll be able to create calendar events, sync class schedules, and manage your time all from here.
            </p>
            <Button onClick={getAuthUrl} className="bg-blue-600 hover:bg-blue-700">
              <ExternalLink className="h-4 w-4 mr-2" />
              Connect Your Google Calendar
            </Button>
          </div>
        ) : (
          <>
            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Plus className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Quick Event</h3>
                      <p className="text-sm text-gray-500">Create instantly</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    New Event
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Schedule Class</h3>
                      <p className="text-sm text-gray-500">Plan ahead</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Schedule Class
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">View Calendar</h3>
                      <p className="text-sm text-gray-500">See full view</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Open Calendar
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Calendar Tabs */}
            <Tabs defaultValue="create" className="mt-6">
              <TabsList className="w-full max-w-md">
                <TabsTrigger value="create" className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Create Event</span>
                </TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="create" className="mt-6">
                <CreateGoogleCalendarEvent onEventCreated={handleEventCreated} />
              </TabsContent>
              
              <TabsContent value="upcoming" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>
                      View and manage your scheduled calendar events
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {events.length > 0 ? (
                      <div className="space-y-4">
                        {events.map((event, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-medium">{event.title}</h4>
                              <p className="text-sm text-gray-500">
                                {new Date(event.startTime).toLocaleString()}
                              </p>
                            </div>
                            <Badge variant="outline">Scheduled</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">
                          No upcoming events found
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Calendar Settings</CardTitle>
                    <CardDescription>
                      Manage your Google Calendar integration preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Auto-sync class schedules</h4>
                          <p className="text-sm text-gray-500">Automatically create calendar events for new classes</p>
                        </div>
                        <Badge variant="secondary">Coming Soon</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Default reminder time</h4>
                          <p className="text-sm text-gray-500">Set default reminder for all events</p>
                        </div>
                        <Badge variant="secondary">30 minutes</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      <GoogleCalendarDisconnectDialog
        open={showDisconnectDialog}
        onOpenChange={setShowDisconnectDialog}
        onConfirm={disconnectGoogleCalendar}
        isDisconnecting={isDisconnecting}
        accountEmail={accountEmail}
      />
    </div>
  );
};

export default GoogleCalendarDashboard;