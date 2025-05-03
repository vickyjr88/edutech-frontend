import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Video, 
  FileText, 
  Users, 
  RefreshCw, 
  Copy, 
  PlayCircle, 
  Download
} from "lucide-react";
import { zoomService, ZoomMeeting, ZoomParticipant, ZoomRecording } from "@/integrations/api/services/zoom.service";
import { toast } from "@/components/ui/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

const ZoomMeetingHistory: React.FC = () => {
  const [meetings, setMeetings] = useState<ZoomMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState<ZoomMeeting | null>(null);
  const [participants, setParticipants] = useState<ZoomParticipant[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [recordings, setRecordings] = useState<ZoomRecording[]>([]);
  const [loadingRecordings, setLoadingRecordings] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    loadMeetingHistory();
  }, []);

  const loadMeetingHistory = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await zoomService.getMeetingHistory();
      
      if (error) {
        console.error("Failed to load meeting history:", error);
        toast({
          title: "Error",
          description: "Failed to load meeting history",
          variant: "destructive"
        });
        return;
      }
      
      if (data) {
        setMeetings(data.meetings || []);
      }
    } catch (error) {
      console.error("Error loading meeting history:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMeetingParticipants = async (meetingId: string) => {
    setLoadingParticipants(true);
    
    try {
      const { data, error } = await zoomService.getMeetingParticipants(meetingId);
      
      if (error) {
        console.error("Failed to load participants:", error);
        return;
      }
      
      if (data) {
        setParticipants(data || []);
      }
    } catch (error) {
      console.error("Error loading participants:", error);
    } finally {
      setLoadingParticipants(false);
    }
  };

  const loadMeetingRecordings = async (meetingId: string) => {
    setLoadingRecordings(true);
    
    try {
      const { data, error } = await zoomService.getMeetingRecordings(meetingId);
      
      if (error) {
        console.error("Failed to load recordings:", error);
        return;
      }
      
      if (data) {
        setRecordings(data || []);
      }
    } catch (error) {
      console.error("Error loading recordings:", error);
    } finally {
      setLoadingRecordings(false);
    }
  };

  const openMeetingDetails = (meeting: ZoomMeeting) => {
    setSelectedMeeting(meeting);
    setParticipants([]);
    setRecordings([]);
    setDetailsDialogOpen(true);
    
    // Load participants and recordings
    loadMeetingParticipants(meeting.id);
    loadMeetingRecordings(meeting.id);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
      duration: 2000
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${remainingMinutes}m`;
  };
  
  const getMeetingStatus = (meeting: ZoomMeeting) => {
    // Use meeting.status if available, or calculate based on time
    if (meeting.status) {
      switch (meeting.status.toLowerCase()) {
        case 'started':
        case 'in_progress':
          return { label: 'In Progress', color: 'bg-green-100 text-green-800' };
        case 'finished':
        case 'ended':
          return { label: 'Completed', color: 'bg-gray-100 text-gray-800' };
        case 'waiting':
          return { label: 'Waiting', color: 'bg-yellow-100 text-yellow-800' };
        case 'scheduled':
          return { label: 'Scheduled', color: 'bg-blue-100 text-blue-800' };
        default:
          break;
      }
    }
    
    // Calculate based on start time and duration if status not provided
    const now = new Date();
    const startTime = new Date(meeting.start_time);
    const endTime = new Date(startTime.getTime() + meeting.duration * 60000);
    
    if (now < startTime) {
      return { label: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
    } else if (now >= startTime && now <= endTime) {
      return { label: 'In Progress', color: 'bg-green-100 text-green-800' };
    } else {
      return { label: 'Completed', color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Class Meeting History</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadMeetingHistory}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5"></div>
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Refresh
            </>
          )}
        </Button>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class Topic</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-40" /></TableCell>
                </TableRow>
              ))
            ) : meetings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No meeting history found. Once you create Zoom meetings for your classes, they'll appear here.
                </TableCell>
              </TableRow>
            ) : (
              meetings.map((meeting) => {
                const status = getMeetingStatus(meeting);
                const startDate = new Date(meeting.start_time);
                
                return (
                  <TableRow key={meeting.id}>
                    <TableCell className="font-medium">{meeting.topic}</TableCell>
                    <TableCell>{format(startDate, "MMM d, yyyy 'at' h:mm a")}</TableCell>
                    <TableCell>{formatDuration(meeting.duration)}</TableCell>
                    <TableCell>
                      <Badge className={status.color} variant="outline">
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openMeetingDetails(meeting)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(meeting.join_url, '_blank')}
                        >
                          <Video className="h-4 w-4 mr-1" />
                          Join
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(meeting.join_url)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Meeting Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedMeeting?.topic || 'Meeting Details'}
            </DialogTitle>
            <DialogDescription>
              {selectedMeeting && format(new Date(selectedMeeting.start_time), "EEEE, MMMM d, yyyy 'at' h:mm a")}
              {selectedMeeting && ` · ${formatDuration(selectedMeeting.duration)}`}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="participants" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="participants">
                <Users className="h-4 w-4 mr-1.5" />
                Participants
              </TabsTrigger>
              <TabsTrigger value="recordings">
                <PlayCircle className="h-4 w-4 mr-1.5" />
                Recordings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="participants" className="py-4">
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h4 className="font-medium text-gray-700 mb-1">Meeting Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Meeting ID</p>
                    <div className="flex items-center">
                      <p className="font-medium mr-2">{selectedMeeting?.id}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0" 
                        onClick={() => selectedMeeting?.id && copyToClipboard(selectedMeeting.id)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500">Password</p>
                    <div className="flex items-center">
                      <p className="font-medium mr-2">{selectedMeeting?.password}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0" 
                        onClick={() => selectedMeeting?.password && copyToClipboard(selectedMeeting.password)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {loadingParticipants ? (
                <div className="flex justify-center items-center py-8">
                  <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                  <p className="text-gray-500">Loading participants...</p>
                </div>
              ) : participants.length === 0 ? (
                <div className="bg-gray-50 rounded-md p-6 text-center">
                  <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <h4 className="font-medium text-gray-700 mb-1">No Participants Data</h4>
                  <p className="text-gray-500 text-sm">
                    There is no participant data available for this meeting.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Join Time</TableHead>
                      <TableHead>Leave Time</TableHead>
                      <TableHead>Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{participant.name}</TableCell>
                        <TableCell>{participant.user_email || 'Not available'}</TableCell>
                        <TableCell>{format(new Date(participant.join_time), 'h:mm a')}</TableCell>
                        <TableCell>
                          {participant.leave_time 
                            ? format(new Date(participant.leave_time), 'h:mm a')
                            : 'Still active'}
                        </TableCell>
                        <TableCell>
                          {Math.floor(participant.duration / 60)}m {participant.duration % 60}s
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            
            <TabsContent value="recordings" className="py-4">
              {loadingRecordings ? (
                <div className="flex justify-center items-center py-8">
                  <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                  <p className="text-gray-500">Loading recordings...</p>
                </div>
              ) : recordings.length === 0 ? (
                <div className="bg-gray-50 rounded-md p-6 text-center">
                  <PlayCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <h4 className="font-medium text-gray-700 mb-1">No Recordings Available</h4>
                  <p className="text-gray-500 text-sm">
                    There are no recordings available for this meeting.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {recordings.map((recording, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium">Recording {index + 1}</div>
                          <div className="text-sm text-gray-500">
                            {format(new Date(recording.recording_start), "MMM d, yyyy 'at' h:mm a")}
                            {recording.recording_end && ` - ${format(new Date(recording.recording_end), 'h:mm a')}`}
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-gray-50">
                          {recording.file_type.toUpperCase()} · {Math.round(recording.file_size / (1024 * 1024))} MB
                        </Badge>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => window.open(recording.play_url, '_blank')}
                        >
                          <PlayCircle className="h-4 w-4 mr-1.5" />
                          Play Recording
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => window.open(recording.download_url, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-1.5" />
                          Download
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ZoomMeetingHistory;