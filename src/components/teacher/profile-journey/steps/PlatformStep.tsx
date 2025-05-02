import React, { useEffect, useState } from "react";
import { useProfileJourney } from "../ProfileJourneyContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Video, 
  CheckCircle, 
  X, 
  ExternalLink, 
  AlertCircle, 
  RefreshCw,
  Link as LinkIcon,
  Info
} from "lucide-react";
import { zoomService } from "@/integrations/api/services/zoom.service";
import { cn } from "@/lib/utils";

const PlatformStep = () => {
  const { platformSettings, updatePlatformSettings, completeStep } = useProfileJourney();
  const { toast } = useToast();
  const [isCheckingZoom, setIsCheckingZoom] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  
  // Check Zoom connection when component mounts
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
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Video className="mr-2 h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-medium">Teaching Platform</h3>
      </div>
      
      <p className="text-sm text-gray-500">
        Connect your video conferencing accounts to seamlessly create and manage virtual classroom meetings.
      </p>
      
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
      {platformSettings.isZoomConnected && (
        <div className="bg-green-50 border border-green-100 rounded-md p-4 mt-6">
          <h4 className="text-sm font-medium text-green-800 flex items-center mb-2">
            <CheckCircle className="h-4 w-4 mr-2" />
            You're all set!
          </h4>
          <p className="text-sm text-green-700">
            Your teaching platform is now configured. You can create Zoom meetings for your classes 
            from the class setup page.
          </p>
        </div>
      )}
    </div>
  );
};

export default PlatformStep;