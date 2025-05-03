import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Clock, Copy, ExternalLink, Users, Video } from "lucide-react";
import { zoomService, ZoomMeeting } from '@/integrations/api/services/zoom.service';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface ClassSession {
  id: string;
  title: string;
  date: string;
  startTime: string;
  duration: number;
  zoomMeetingId?: string;
  zoomJoinUrl?: string;
}

interface ZoomClassIntegrationProps {
  classId: string;
  sessions: ClassSession[];
  onSessionUpdate: (updatedSession: ClassSession) => void;
}

const ZoomClassIntegration: React.FC<ZoomClassIntegrationProps> = ({ 
  classId,
  sessions,
  onSessionUpdate
}) => {
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null);
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false);
  const [isZoomConnected, setIsZoomConnected] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState<ZoomMeeting | null>(null);
  const [meetingDialogOpen, setMeetingDialogOpen] = useState(false);

  // Check Zoom connection on component load
  useEffect(() => {
    checkZoomConnection();
  }, []);

  const checkZoomConnection = async () => {
    try {
      const { data, error } = await zoomService.getConnectionStatus();
      
      if (error) {
        console.error("Failed to get Zoom connection status:", error);
        return;
      }
      
      setIsZoomConnected(data?.connected || false);
    } catch (error) {
      console.error("Error checking Zoom connection:", error);
    }
  };
  
  const connectZoom = async () => {
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
      
      // Redirect to Zoom OAuth
      if (data?.auth_url) {
        window.location.href = data.auth_url;
      }
    } catch (error) {
      console.error("Error connecting to Zoom:", error);
      toast({
        title: "Error",
        description: "Failed to connect to Zoom",
        variant: "destructive"
      });
    }
  };

  const createZoomMeeting = async (session: ClassSession) => {
    setIsCreatingMeeting(true);
    setSelectedSession(session);
    
    try {
      // Format date and time for Zoom API
      const [year, month, day] = session.date.split('-').map(Number);
      const [hours, minutes] = session.startTime.split(':').map(Number);
      
      const startTime = new Date(year, month - 1, day, hours, minutes);
      
      const meetingData = {
        topic: session.title,
        start_time: startTime.toISOString(),
        duration: session.duration,
        agenda: `Class session for ${classId}`,
        settings: {
          join_before_host: true,
          waiting_room: true,
          meeting_authentication: true
        }
      };
      
      const { data, error } = await zoomService.createMeeting(meetingData);
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to create Zoom meeting",
          variant: "destructive"
        });
        setIsCreatingMeeting(false);
        return;
      }
      
      if (data) {
        // Update the session with Zoom meeting data
        const updatedSession = {
          ...session,
          zoomMeetingId: data.id,
          zoomJoinUrl: data.join_url
        };
        
        onSessionUpdate(updatedSession);
        
        toast({
          title: "Success",
          description: "Zoom meeting created successfully",
        });
        
        setMeetingDetails(data);
        setMeetingDialogOpen(true);
      }
    } catch (error) {
      console.error("Error creating Zoom meeting:", error);
      toast({
        title: "Error",
        description: "Failed to create Zoom meeting",
        variant: "destructive"
      });
    } finally {
      setIsCreatingMeeting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Meeting link copied to clipboard",
      duration: 2000
    });
  };

  const handleStartMeeting = (joinUrl: string) => {
    window.open(joinUrl, '_blank');
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return format(date, 'h:mm a');
  };

  return (
    <div className="space-y-4">
      {!isZoomConnected && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Connect Zoom for Live Classes</CardTitle>
            <CardDescription>
              Connect your Zoom account to create and manage online classes
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => setIsConnectionDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Video className="h-4 w-4 mr-2" />
              Connect Zoom Account
            </Button>
          </CardFooter>
        </Card>
      )}

      <h3 className="text-lg font-medium mt-6">Class Sessions</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => (
          <Card key={session.id} className="relative">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{session.title}</CardTitle>
              <div className="flex items-center text-gray-500 text-sm">
                <CalendarIcon className="h-4 w-4 mr-1.5" />
                <span>{session.date}</span>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="h-4 w-4 mr-1.5" />
                <span>{formatTime(session.startTime)} ({session.duration} min)</span>
              </div>
            </CardHeader>
            <CardFooter>
              {session.zoomMeetingId ? (
                <div className="space-y-2 w-full">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                      onClick={() => handleStartMeeting(session.zoomJoinUrl as string)}
                    >
                      <Video className="h-4 w-4 mr-1.5" />
                      Join Class
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(session.zoomJoinUrl as string)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-green-600 flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></div>
                    Zoom meeting ready
                  </div>
                </div>
              ) : (
                <Button
                  className="w-full"
                  disabled={!isZoomConnected || isCreatingMeeting}
                  onClick={() => createZoomMeeting(session)}
                >
                  {isCreatingMeeting && selectedSession?.id === session.id ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Meeting...
                    </>
                  ) : (
                    <>
                      <Video className="h-4 w-4 mr-1.5" />
                      Create Zoom Meeting
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Connect Zoom Dialog */}
      <Dialog open={isConnectionDialogOpen} onOpenChange={setIsConnectionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Zoom Account</DialogTitle>
            <DialogDescription>
              Connect your Zoom account to create online class sessions
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-6">
            <img 
              src="https://kidato-images.s3.eu-west-1.amazonaws.com/Zoom-Logo.png" 
              alt="Zoom Logo"
              className="h-16" 
            />
          </div>
          <p className="text-sm text-center text-gray-600 mb-4">
            You'll be redirected to Zoom to authorize this connection. 
            After connecting, you'll be able to create and manage Zoom meetings for your classes.
          </p>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsConnectionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={connectZoom} className="bg-blue-600 hover:bg-blue-700">
              Connect Zoom
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Meeting Created Dialog */}
      <Dialog open={meetingDialogOpen} onOpenChange={setMeetingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Zoom Meeting Created</DialogTitle>
            <DialogDescription>
              Your Zoom meeting has been successfully created
            </DialogDescription>
          </DialogHeader>
          {meetingDetails && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Meeting Topic</Label>
                <Input value={meetingDetails.topic} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Meeting ID</Label>
                <div className="flex">
                  <Input value={meetingDetails.id} readOnly className="rounded-r-none" />
                  <Button 
                    variant="outline" 
                    onClick={() => copyToClipboard(meetingDetails.id)}
                    className="rounded-l-none border-l-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="flex">
                  <Input value={meetingDetails.password} readOnly className="rounded-r-none" />
                  <Button 
                    variant="outline" 
                    onClick={() => copyToClipboard(meetingDetails.password)}
                    className="rounded-l-none border-l-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Join URL</Label>
                <div className="flex">
                  <Input value={meetingDetails.join_url} readOnly className="rounded-r-none" />
                  <Button 
                    variant="outline" 
                    onClick={() => copyToClipboard(meetingDetails.join_url)}
                    className="rounded-l-none border-l-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setMeetingDialogOpen(false)}>
              Close
            </Button>
            <Button 
              onClick={() => {
                handleStartMeeting(meetingDetails?.join_url as string);
                setMeetingDialogOpen(false);
              }}
            >
              <Video className="h-4 w-4 mr-1.5" />
              Start Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ZoomClassIntegration;