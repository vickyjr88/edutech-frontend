import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  MessageSquare, 
  Copy, 
  Link as LinkIcon 
} from "lucide-react";
import { zoomService, ZoomMeeting } from "@/integrations/api/services/zoom.service";
import { toast } from "@/components/ui/use-toast";

interface CreateZoomMeetingProps {
  classId?: string;
  className?: string;
  onMeetingCreated?: (meeting: ZoomMeeting) => void;
}

const CreateZoomMeeting: React.FC<CreateZoomMeetingProps> = ({ 
  classId, 
  className, 
  onMeetingCreated 
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [createdMeeting, setCreatedMeeting] = useState<ZoomMeeting | null>(null);
  
  // Form state
  const [topic, setTopic] = useState(className || "");
  const [agenda, setAgenda] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [enableWaitingRoom, setEnableWaitingRoom] = useState(true);
  const [allowJoinBeforeHost, setAllowJoinBeforeHost] = useState(true);
  const [muteUponEntry, setMuteUponEntry] = useState(true);
  
  const resetForm = () => {
    setTopic(className || "");
    setAgenda("");
    setDate("");
    setTime("");
    setDuration(60);
    setEnableWaitingRoom(true);
    setAllowJoinBeforeHost(true);
    setMuteUponEntry(true);
  };
  
  const handleOpenDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };
  
  const handleCreateMeeting = async () => {
    if (!topic || !date || !time) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
      const [year, month, day] = date.split("-").map(Number);
      const [hours, minutes] = time.split(":").map(Number);
      
      const startTime = new Date(year, month - 1, day, hours, minutes);
      
      const meetingData = {
        topic,
        start_time: startTime.toISOString(),
        duration,
        agenda,
        settings: {
          waiting_room: enableWaitingRoom,
          join_before_host: allowJoinBeforeHost,
          mute_upon_entry: muteUponEntry,
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
        return;
      }
      
      if (data) {
        setCreatedMeeting(data);
        setIsDialogOpen(false);
        setIsResultDialogOpen(true);
        
        if (onMeetingCreated) {
          onMeetingCreated(data);
        }
        
        toast({
          title: "Success",
          description: "Zoom meeting created successfully",
        });
      }
    } catch (error) {
      console.error("Error creating Zoom meeting:", error);
      toast({
        title: "Error",
        description: "Failed to create Zoom meeting",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
      duration: 2000
    });
  };
  
  const getCurrentDateString = () => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  };
  
  const handleJoinMeeting = () => {
    if (createdMeeting) {
      window.open(createdMeeting.join_url, "_blank");
    }
  };
  
  return (
    <>
      <Button 
        className="bg-blue-600 hover:bg-blue-700" 
        onClick={handleOpenDialog}
      >
        <Video className="h-4 w-4 mr-1.5" />
        Create Zoom Meeting
      </Button>
      
      {/* Create Meeting Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Video className="h-5 w-5 mr-2" />
              Create a Zoom Meeting
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new Zoom meeting for your class.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="topic">Meeting Topic*</Label>
              <Input 
                id="topic" 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)} 
                placeholder="Enter meeting topic"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="agenda">Agenda (Optional)</Label>
              <Textarea 
                id="agenda" 
                value={agenda} 
                onChange={(e) => setAgenda(e.target.value)} 
                placeholder="Enter meeting agenda or description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date*</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    id="date" 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)}
                    min={getCurrentDateString()}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Time*</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    id="time" 
                    type="time" 
                    value={time} 
                    onChange={(e) => setTime(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input 
                id="duration" 
                type="number" 
                min={15} 
                max={300} 
                step={15} 
                value={duration} 
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-4 border rounded-md p-4 bg-gray-50">
              <h4 className="font-medium text-sm">Meeting Settings</h4>
              
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <Label htmlFor="waitingRoom" className="text-sm">Waiting Room</Label>
                  <p className="text-xs text-gray-500">Attendees wait for host to admit them</p>
                </div>
                <Switch 
                  id="waitingRoom" 
                  checked={enableWaitingRoom} 
                  onCheckedChange={setEnableWaitingRoom}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <Label htmlFor="joinBeforeHost" className="text-sm">Join Before Host</Label>
                  <p className="text-xs text-gray-500">Attendees can join before host arrives</p>
                </div>
                <Switch 
                  id="joinBeforeHost" 
                  checked={allowJoinBeforeHost} 
                  onCheckedChange={setAllowJoinBeforeHost}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <Label htmlFor="muteOnEntry" className="text-sm">Mute Upon Entry</Label>
                  <p className="text-xs text-gray-500">Attendees are muted when joining</p>
                </div>
                <Switch 
                  id="muteOnEntry" 
                  checked={muteUponEntry} 
                  onCheckedChange={setMuteUponEntry}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateMeeting}
              disabled={isCreating || !topic || !date || !time}
            >
              {isCreating ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Video className="h-4 w-4 mr-1.5" />
                  Create Meeting
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Meeting Created Result Dialog */}
      <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-green-600">
              <Users className="h-5 w-5 mr-2" />
              Zoom Meeting Created
            </DialogTitle>
            <DialogDescription>
              Your Zoom meeting has been successfully created.
            </DialogDescription>
          </DialogHeader>
          
          {createdMeeting && (
            <div className="space-y-4 py-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{createdMeeting.topic}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="grid grid-cols-[auto_1fr] gap-x-2 items-center">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>
                      {new Date(createdMeeting.start_time).toLocaleDateString()} at {
                        new Date(createdMeeting.start_time).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })
                      }
                    </span>
                    
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{createdMeeting.duration} minutes</span>
                    
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    <span>Meeting ID: {createdMeeting.id}</span>
                    
                    <LinkIcon className="h-4 w-4 text-gray-500" />
                    <div className="flex items-center">
                      <span className="truncate flex-1 mr-2">Password: {createdMeeting.password}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0" 
                        onClick={() => copyToClipboard(createdMeeting.password)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <div className="flex items-center w-full">
                    <Input 
                      value={createdMeeting.join_url} 
                      readOnly 
                      className="rounded-r-none" 
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => copyToClipboard(createdMeeting.join_url)}
                      className="rounded-l-none border-l-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsResultDialogOpen(false)}>
              Close
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleJoinMeeting}
            >
              <Video className="h-4 w-4 mr-1.5" />
              Join Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateZoomMeeting;