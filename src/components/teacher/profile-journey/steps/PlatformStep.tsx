import React, { useEffect, useState } from "react";
import { useProfileJourney } from "../ProfileJourneyContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { 
  Video, 
  CheckCircle, 
  X, 
  ExternalLink, 
  AlertCircle, 
  RefreshCw,
  Link as LinkIcon,
  Info,
  Save,
  Upload
} from "lucide-react";
import { zoomService } from "@/integrations/api/services/zoom.service";
import { teacherService } from "@/integrations/api/services/teacher.service";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const PlatformStep = () => {
  const { platformSettings, updatePlatformSettings, personalInfo, updatePersonalInfo, completeStep } = useProfileJourney();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isCheckingZoom, setIsCheckingZoom] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  
  // Video upload states
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [isSavingVideo, setIsSavingVideo] = useState(false);
  
  // Helper functions for video processing
  const getYoutubeEmbedUrl = (url: string): string => {
    if (url.includes('youtu.be')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    if (url.includes('youtube.com/watch')) {
      const videoId = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return url;
  };

  const isValidVideoUrl = (url: string): boolean => {
    return (
      url.includes('youtube.com/watch') || 
      url.includes('youtu.be/') || 
      url.includes('vimeo.com/')
    );
  };

  // Load existing data when component mounts
  useEffect(() => {
    checkZoomConnection();
  }, []);
  
  // Check Zoom connection status
  const checkZoomConnection = async () => {
    setIsCheckingZoom(true);
    
    try {
      const { data, error } = await zoomService.getConnectionStatus();
      
      if (error) {
        console.error("Failed to get Zoom connection status:", error);
        return;
      }
      
      // If Zoom is connected, update platform settings and mark as complete
      const isConnected = data?.connected || false;
      
      // Update platform settings in context
      await updatePlatformSettings({
        isZoomConnected: isConnected,
        zoomEmail: data?.account_email,
      });
      
      // Mark step as complete if connected
      if (isConnected) {
        completeStep("platform");
        
        // Log success
        console.log("Zoom connected successfully and platform step marked as complete");
      }
    } catch (error) {
      console.error("Error checking Zoom connection:", error);
    } finally {
      setIsCheckingZoom(false);
    }
  };
  
  // Connect to Zoom
  const connectZoom = async () => {
    setIsAuthenticating(true);
    
    try {
      const { data, error } = await zoomService.getAuthUrl();
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to get Zoom authorization URL",
          variant: "destructive"
        });
        setIsAuthenticating(false);
        return;
      }
      
      // Redirect to Zoom OAuth
      if (data?.auth_url) {
        window.location.href = data.auth_url;
      }
    } catch (error) {
      console.error("Error authorizing Zoom:", error);
      setIsAuthenticating(false);
      
      toast({
        title: "Error",
        description: "Failed to connect to Zoom",
        variant: "destructive"
      });
    }
  };
  
  // Disconnect Zoom
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
      
      // Update platform settings in context with disconnected status
      await updatePlatformSettings({
        isZoomConnected: false,
        zoomEmail: undefined,
      });
      
      // Log the disconnection
      console.log("Zoom account disconnected successfully");
      
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

  // Handle adding/updating intro video
  const handleAddVideo = async () => {
    const trimmedUrl = newVideoUrl.trim();
    if (!trimmedUrl) {
      toast({
        title: "Error",
        description: "Please enter a video URL",
        variant: "destructive"
      });
      return;
    }

    if (!isValidVideoUrl(trimmedUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube or Vimeo URL",
        variant: "destructive"
      });
      return;
    }

    setIsSavingVideo(true);

    try {
      // Update personal info with the intro video URL (this handles the API call)
      await updatePersonalInfo({
        introVideoUrl: trimmedUrl
      });
      
      setNewVideoUrl("");
      
      toast({
        title: "Success",
        description: "Introduction video has been saved to your profile",
      });

      // Check if step should be completed
      checkStepCompletion();
    } catch (error) {
      console.error("Error saving intro video URL:", error);
      toast({
        title: "Error",
        description: "Failed to save the introduction video",
        variant: "destructive"
      });
    } finally {
      setIsSavingVideo(false);
    }
  };

  // Check if the platform step should be marked as complete
  const checkStepCompletion = () => {
    // Step is complete if either Zoom is connected OR intro video is uploaded
    if (platformSettings.isZoomConnected || personalInfo.introVideoUrl) {
      completeStep("platform");
    }
  };

  // Update completion check when dependencies change
  useEffect(() => {
    checkStepCompletion();
  }, [platformSettings.isZoomConnected, personalInfo.introVideoUrl]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Video className="mr-2 h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-medium">Teaching Platform</h3>
      </div>
      
      <p className="text-sm text-gray-500">
        Set up your teaching platform by uploading an introduction video and connecting your video conferencing accounts.
      </p>

      {/* Introduction Video Upload */}
      <Card className={cn(
        "border",
        personalInfo.introVideoUrl ? "border-kidato-purple-200" : "border-kidato-orange-200"
      )}>
        <CardHeader className={cn(
          "pb-4",
          personalInfo.introVideoUrl ? "bg-kidato-purple-50" : "bg-kidato-orange-50"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Upload className="h-6 w-6 mr-3 text-kidato-orange-600" />
              <div>
                <CardTitle className="text-base font-medium">Introduction Video</CardTitle>
                <CardDescription>
                  {personalInfo.introVideoUrl 
                    ? "Your introduction video is ready and will appear on your profile"
                    : "Upload a short video to introduce yourself to potential students"}
                </CardDescription>
              </div>
            </div>
            
            <Badge 
              variant="outline" 
              className={cn(
                personalInfo.introVideoUrl 
                  ? "bg-kidato-purple-100 text-kidato-purple-700 border-kidato-purple-200" 
                  : "bg-kidato-orange-100 text-kidato-orange-700 border-kidato-orange-200"
              )}
            >
              {personalInfo.introVideoUrl ? "Video Added" : "No Video"}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-5">
          {personalInfo.introVideoUrl ? (
            <div className="space-y-4">
              <div className="flex items-center bg-kidato-purple-50 border border-kidato-purple-100 rounded-md p-3">
                <CheckCircle className="h-5 w-5 text-kidato-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-kidato-purple-800">Introduction video uploaded</p>
                  <p className="text-xs text-kidato-purple-700">
                    Your video will be displayed on your teacher profile
                  </p>
                </div>
              </div>
              
              {/* Video preview */}
              <div className="aspect-video w-full bg-gray-100 rounded-md overflow-hidden">
                {personalInfo.introVideoUrl.includes('youtube.com') || personalInfo.introVideoUrl.includes('youtu.be') ? (
                  <iframe
                    src={getYoutubeEmbedUrl(personalInfo.introVideoUrl)}
                    title="Introduction video preview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                ) : personalInfo.introVideoUrl.includes('vimeo.com') ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${personalInfo.introVideoUrl.split('/').pop()}`}
                    title="Introduction video preview"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Video preview not available</p>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 border border-gray-100 rounded-md p-3">
                <h4 className="text-sm font-medium mb-1 flex items-center">
                  <Info className="h-4 w-4 mr-1.5 text-kidato-orange-500" />
                  Your introduction video helps students:
                </h4>
                <ul className="text-xs text-gray-600 space-y-1 pl-6 list-disc">
                  <li>Get to know your teaching style and personality</li>
                  <li>Feel more confident about booking classes with you</li>
                  <li>Understand your expertise and approach</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center bg-kidato-orange-50 border border-kidato-orange-100 rounded-md p-3">
                <AlertCircle className="h-5 w-5 text-kidato-orange-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-kidato-orange-800">No introduction video yet</p>
                  <p className="text-xs text-kidato-orange-700">
                    Add a YouTube or Vimeo video to introduce yourself to students.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 border border-gray-100 rounded-md p-3">
                <h4 className="text-sm font-medium mb-1">Tips for a great introduction video:</h4>
                <ul className="text-xs text-gray-600 space-y-1 pl-6 list-disc">
                  <li>Keep it short (1-2 minutes)</li>
                  <li>Introduce yourself and your teaching experience</li>
                  <li>Explain your teaching style and approach</li>
                  <li>Speak clearly and with enthusiasm</li>
                  <li>Ensure good lighting and sound quality</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="video-url">YouTube or Vimeo URL</Label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="video-url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddVideo();
                        }
                      }}
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    onClick={handleAddVideo} 
                    disabled={!newVideoUrl.trim() || isSavingVideo}
                    className="bg-kidato-orange-600 hover:bg-kidato-orange-700"
                  >
                    {isSavingVideo ? (
                      <>
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Add Video
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        {personalInfo.introVideoUrl && (
          <CardFooter className="flex justify-between pt-3 border-t">
            <div className="text-xs text-gray-500">
              <a 
                href={personalInfo.introVideoUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-kidato-purple-600 hover:underline"
              >
                View original video
              </a>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setNewVideoUrl(personalInfo.introVideoUrl);
                updatePersonalInfo({ introVideoUrl: "" });
              }}
              className="text-kidato-orange-600 border-kidato-orange-200 hover:bg-kidato-orange-50"
            >
              <Video className="h-4 w-4 mr-1.5" />
              Change Video
            </Button>
          </CardFooter>
        )}
      </Card>
      
      <Separator />
      
      {/* Zoom Integration */}
      <Card className={cn(
        "border",
        platformSettings.isZoomConnected ? "border-green-200" : "border-blue-200"
      )}>
        <CardHeader className={cn(
          "pb-4",
          platformSettings.isZoomConnected ? "bg-green-50" : "bg-blue-50"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="https://kidato-images.s3.eu-west-1.amazonaws.com/Zoom-Logo.png" 
                alt="Zoom Logo"
                className="h-8 mr-3" 
              />
              <div>
                <CardTitle className="text-base font-medium">Zoom Integration</CardTitle>
                <CardDescription>
                  {platformSettings.isZoomConnected 
                    ? "Your Zoom account is connected and ready to use"
                    : "Connect Zoom to create virtual classrooms"}
                </CardDescription>
              </div>
            </div>
            
            <Badge 
              variant="outline" 
              className={cn(
                platformSettings.isZoomConnected 
                  ? "bg-green-100 text-green-700 border-green-200" 
                  : "bg-blue-100 text-blue-700 border-blue-200"
              )}
            >
              {platformSettings.isZoomConnected ? "Connected" : "Not Connected"}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-5">
          {platformSettings.isZoomConnected ? (
            <div className="space-y-4">
              <div className="flex items-center bg-green-50 border border-green-100 rounded-md p-3">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-800">Connected to Zoom</p>
                  {platformSettings.zoomEmail && (
                    <p className="text-xs text-green-700">
                      Account: {platformSettings.zoomEmail}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 border border-gray-100 rounded-md p-3">
                <h4 className="text-sm font-medium mb-1 flex items-center">
                  <Info className="h-4 w-4 mr-1.5 text-blue-500" />
                  With your Zoom account connected, you can:
                </h4>
                <ul className="text-xs text-gray-600 space-y-1 pl-6 list-disc">
                  <li>Create Zoom meetings for your classes</li>
                  <li>Schedule recurring sessions</li>
                  <li>Manage participant access</li>
                  <li>Record classes for students to review later</li>
                  <li>Access meeting analytics and attendance records</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center bg-amber-50 border border-amber-100 rounded-md p-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Not connected to Zoom</p>
                  <p className="text-xs text-amber-700">
                    Connect your Zoom account to create and manage virtual classrooms.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 border border-gray-100 rounded-md p-3">
                <h4 className="text-sm font-medium mb-1">Why connect Zoom?</h4>
                <p className="text-xs text-gray-600">
                  Connecting your Zoom account allows you to create and manage virtual classrooms
                  directly from the Kidato platform. This makes it easy to schedule and conduct
                  online classes with your students.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            disabled={isCheckingZoom}
            onClick={checkZoomConnection}
          >
            {isCheckingZoom ? (
              <>
                <span className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-1.5"></span>
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-1.5" />
                Refresh Status
              </>
            )}
          </Button>
          
          {platformSettings.isZoomConnected ? (
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              disabled={isDisconnecting}
              onClick={disconnectZoom}
            >
              {isDisconnecting ? (
                <>
                  <span className="h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin mr-1.5"></span>
                  Disconnecting...
                </>
              ) : (
                <>
                  <LinkIcon className="h-4 w-4 mr-1.5" />
                  Disconnect
                </>
              )}
            </Button>
          ) : (
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
              disabled={isAuthenticating}
              onClick={connectZoom}
            >
              {isAuthenticating ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5"></span>
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-1.5" />
                  Connect Zoom
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Google Meet Integration - Future Feature */}
      <Card className="border border-gray-200 opacity-70">
        <CardHeader className="pb-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 mr-3 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
                  <path d="M22 8v8a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h7l5 5h1a3 3 0 0 1 3 3z" fill="#4285f4" />
                  <path d="M18 9a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3z" fill="#fff" />
                  <path d="M15 11l-5 3v-6l5 3z" fill="#ea4335" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-base font-medium">Google Meet</CardTitle>
                <CardDescription>
                  Coming Soon
                </CardDescription>
              </div>
            </div>
            
            <Badge 
              variant="outline" 
              className="bg-gray-100 text-gray-600 border-gray-200"
            >
              Coming Soon
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-5">
          <div className="flex items-center bg-gray-50 border border-gray-100 rounded-md p-3">
            <div className="flex-shrink-0 h-5 w-5 text-gray-400 mr-3 flex items-center justify-center">
              <X className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Google Meet integration coming soon</p>
              <p className="text-xs text-gray-500">
                We're working on adding support for Google Meet to provide more options for your virtual classrooms.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Next steps */}
      {(platformSettings.isZoomConnected || personalInfo.introVideoUrl) && (
        <div className="bg-kidato-purple-50 border border-kidato-purple-100 rounded-md p-4 mt-6">
          <h4 className="text-sm font-medium text-kidato-purple-800 flex items-center mb-2">
            <CheckCircle className="h-4 w-4 mr-2" />
            Platform setup {(platformSettings.isZoomConnected && personalInfo.introVideoUrl) ? 'complete' : 'in progress'}!
          </h4>
          <div className="text-sm text-kidato-purple-700 space-y-1">
            {personalInfo.introVideoUrl && (
              <p>✓ Introduction video added - students can now see your teaching style</p>
            )}
            {platformSettings.isZoomConnected && (
              <p>✓ Zoom connected - you can create virtual classrooms for your classes</p>
            )}
            {!platformSettings.isZoomConnected && personalInfo.introVideoUrl && (
              <p className="text-kidato-orange-700">Consider connecting Zoom to enable virtual classroom creation</p>
            )}
            {platformSettings.isZoomConnected && !personalInfo.introVideoUrl && (
              <p className="text-kidato-orange-700">Add an introduction video to help students connect with you</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformStep;