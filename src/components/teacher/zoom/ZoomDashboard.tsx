import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, ExternalLink, Video, Calendar, Play, RefreshCw, Link as LinkIcon, Users, Clock } from "lucide-react";
import CreateZoomMeeting from "./CreateZoomMeeting";
import ZoomMeetingHistory from "./ZoomMeetingHistory";
import { zoomService } from "@/integrations/api/services/zoom.service";
import { toast } from "@/hooks/use-toast";

const ZoomDashboard: React.FC = () => {
  const [isZoomConnected, setIsZoomConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accountEmail, setAccountEmail] = useState<string | undefined>(undefined);
  const [connectionDate, setConnectionDate] = useState<string | undefined>(undefined);
  const [isChecking, setIsChecking] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  useEffect(() => {
    checkZoomConnection();
  }, []);

  const checkZoomConnection = async () => {
    setIsLoading(true);
    setIsChecking(true);
    try {
      const { data, error } = await zoomService.getConnectionStatus();
      
      if (error) {
        console.error("Failed to get Zoom connection status:", error);
        setIsZoomConnected(false);
      } else {
        setIsZoomConnected(data?.connected || false);
        setAccountEmail(data?.account_email);
        setConnectionDate(data?.connected_at);
      }
    } catch (error) {
      console.error("Error checking Zoom connection:", error);
      setIsZoomConnected(false);
    } finally {
      setIsLoading(false);
      setIsChecking(false);
    }
  };

  const getAuthUrl = async () => {
    try {
      const { data, error } = await zoomService.getAuthUrl();
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to get Zoom authorization URL",
          variant: "destructive"
        });
        return;
      }
      
      if (data?.auth_url) {
        window.location.href = data.auth_url;
      }
    } catch (error) {
      console.error("Error getting Zoom auth URL:", error);
      toast({
        title: "Error",
        description: "Failed to connect to Zoom",
        variant: "destructive"
      });
    }
  };

  const disconnectZoom = async () => {
    setIsDisconnecting(true);
    
    try {
      const { data, error } = await zoomService.disconnectAccount();
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to disconnect Zoom account",
          variant: "destructive"
        });
        return;
      }
      
      setIsZoomConnected(false);
      setAccountEmail(undefined);
      setConnectionDate(undefined);
      
      toast({
        title: "Success",
        description: "Zoom account disconnected successfully",
      });
    } catch (error) {
      console.error("Error disconnecting Zoom:", error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const formatConnectionDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };


  return (
    <div className="space-y-6">
      {/* Elegant Status Bar at Top */}
      <div className={`relative overflow-hidden rounded-lg border ${
        isZoomConnected 
          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200" 
          : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
      }`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://kidato-images.s3.eu-west-1.amazonaws.com/Zoom-Logo.png" 
                  alt="Zoom Logo"
                  className="h-8" 
                />
                <div>
                  <div className="flex items-center space-x-2">
                    {isZoomConnected ? (
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
                  {isZoomConnected && accountEmail && (
                    <p className="text-sm text-green-700 mt-1">
                      {accountEmail} • Connected {formatConnectionDate(connectionDate)}
                    </p>
                  )}
                  {!isZoomConnected && (
                    <p className="text-sm text-blue-700 mt-1">
                      Connect your account to start creating meetings
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
                onClick={checkZoomConnection}
                className={isZoomConnected ? "text-green-700 hover:bg-green-100" : "text-blue-700 hover:bg-blue-100"}
              >
                {isChecking ? (
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              
              {isZoomConnected ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  disabled={isDisconnecting}
                  onClick={disconnectZoom}
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
        
        {/* Subtle animated background element */}
        <div className={`absolute inset-0 opacity-10 ${
          isZoomConnected 
            ? "bg-gradient-to-r from-green-400 to-emerald-400" 
            : "bg-gradient-to-r from-blue-400 to-indigo-400"
        }`} />
      </div>
      
      {/* Main Content */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Zoom Meetings</h2>
          <p className="text-muted-foreground">
            {isZoomConnected 
              ? "Create and manage your virtual class sessions" 
              : "Connect your Zoom account to start hosting virtual classes"}
          </p>
        </div>
        
        {!isZoomConnected ? (
          <div className="text-center py-12">
            <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Zoom to Get Started</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Once connected, you'll be able to create meetings, schedule classes, and manage your virtual sessions all from here.
            </p>
            <Button onClick={getAuthUrl} className="bg-blue-600 hover:bg-blue-700">
              <ExternalLink className="h-4 w-4 mr-2" />
              Connect Your Zoom Account
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
                      <Play className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Quick Meeting</h3>
                      <p className="text-sm text-gray-500">Start instantly</p>
                    </div>
                  </div>
                  <CreateZoomMeeting />
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
                    Schedule Meeting
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
                      <h3 className="font-semibold">Join Meeting</h3>
                      <p className="text-sm text-gray-500">Enter meeting ID</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Join Meeting
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Meetings Tabs */}
            <Tabs defaultValue="upcoming" className="mt-6">
              <TabsList className="w-full max-w-md">
                <TabsTrigger value="upcoming" className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Upcoming</span>
                </TabsTrigger>
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
                    <div className="text-center py-8">
                      <Video className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
                        Your meeting recordings will appear here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default ZoomDashboard;