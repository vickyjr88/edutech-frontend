import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ZoomConnectionStatus from "./ZoomConnectionStatus";
import CreateZoomMeeting from "./CreateZoomMeeting";
import ZoomMeetingHistory from "./ZoomMeetingHistory";
import { zoomService } from "@/integrations/api/services/zoom.service";

const ZoomDashboard: React.FC = () => {
  const [isZoomConnected, setIsZoomConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkZoomConnection();
  }, []);

  const checkZoomConnection = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await zoomService.getConnectionStatus();
      
      if (error) {
        console.error("Failed to get Zoom connection status:", error);
        setIsZoomConnected(false);
      } else {
        setIsZoomConnected(data?.connected || false);
      }
    } catch (error) {
      console.error("Error checking Zoom connection:", error);
      setIsZoomConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectionChange = (connected: boolean) => {
    setIsZoomConnected(connected);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Zoom Integration</h2>
        <p className="text-muted-foreground">
          Manage your Zoom meetings and live classes
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <ZoomConnectionStatus onConnectionChange={handleConnectionChange} />
        
        {isZoomConnected && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Create and manage Zoom meetings for your classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <CreateZoomMeeting />
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-2">
                  <Card className="border-blue-100 hover:border-blue-300 cursor-pointer transition-colors">
                    <CardContent className="p-4 text-center">
                      <p className="font-medium">View Recordings</p>
                    </CardContent>
                  </Card>
                  <Card className="border-blue-100 hover:border-blue-300 cursor-pointer transition-colors">
                    <CardContent className="p-4 text-center">
                      <p className="font-medium">Meeting History</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {isZoomConnected === false && !isLoading && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Connected</AlertTitle>
          <AlertDescription>
            Your Zoom account is not connected. Please connect your account to create and manage meetings.
          </AlertDescription>
        </Alert>
      )}
      
      {isZoomConnected && (
        <Tabs defaultValue="upcoming" className="mt-6">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="recordings">Recordings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Meetings</CardTitle>
                <CardDescription>
                  View and manage your scheduled Zoom meetings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ZoomMeetingHistory />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Meeting History</CardTitle>
                <CardDescription>
                  Review past meetings and attendance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ZoomMeetingHistory />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recordings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recordings</CardTitle>
                <CardDescription>
                  Access and share your meeting recordings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">
                  You can view and manage your recordings within your meeting history.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ZoomDashboard;