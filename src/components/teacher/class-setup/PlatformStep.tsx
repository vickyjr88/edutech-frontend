
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Video, CheckCircle, Link as LinkIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { zoomService } from "@/integrations/api/services/zoom.service";
import { toast } from "@/components/ui/use-toast";

type PlatformStepProps = {
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
};

const PlatformStep = ({ selectedPlatform, setSelectedPlatform }: PlatformStepProps) => {
  const [isIntegrationEnabled, setIsIntegrationEnabled] = useState(true);
  const [isZoomAuthorized, setIsZoomAuthorized] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [accountEmail, setAccountEmail] = useState<string | undefined>(undefined);
  const [connectionDate, setConnectionDate] = useState<string | undefined>(undefined);
  
  // Always set the platform to zoom
  useEffect(() => {
    if (selectedPlatform !== "zoom") {
      setSelectedPlatform("zoom");
    }
  }, []);
  
  // Check if Zoom is already authorized when component mounts
  useEffect(() => {
    checkZoomConnection();
  }, []);
  
  // Check Zoom connection status
  const checkZoomConnection = async () => {
    try {
      const { data, error } = await zoomService.getConnectionStatus();
      
      if (error) {
        console.error("Failed to get Zoom connection status:", error);
        return;
      }
      
      if (data?.connected) {
        setIsZoomAuthorized(true);
        setAccountEmail(data.account_email);
        setConnectionDate(data.connected_at);
      } else {
        setIsZoomAuthorized(false);
      }
    } catch (error) {
      console.error("Error checking Zoom connection:", error);
    }
  };
  
  // Zoom authorization function
  const authorizeZoom = async () => {
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
  
  // Disconnect Zoom account
  const disconnectZoom = async () => {
    setIsAuthenticating(true);
    
    try {
      const { data, error } = await zoomService.disconnectAccount();
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to disconnect Zoom account",
          variant: "destructive"
        });
        setIsAuthenticating(false);
        return;
      }
      
      setIsZoomAuthorized(false);
      setAccountEmail(undefined);
      setConnectionDate(undefined);
      
      toast({
        title: "Success",
        description: "Zoom account disconnected successfully",
      });
    } catch (error) {
      console.error("Error disconnecting Zoom:", error);
    } finally {
      setIsAuthenticating(false);
    }
  };
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        We've selected Zoom as your teaching platform for the best online class experience. You'll use this to conduct your virtual classes.
      </p>
      
      <div className="mb-6 text-center">
        <div className="inline-flex items-center bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full border border-blue-200">
          <CheckCircle className="h-3.5 w-3.5 mr-1" />
          Currently using Zoom for all online classes
        </div>
      </div>

      <div className="bg-white border border-blue-100 rounded-lg shadow-md overflow-hidden">
        <div className="flex items-center justify-center bg-blue-50 p-5 border-b border-blue-100">
          <img src="https://kidato-images.s3.eu-west-1.amazonaws.com/Zoom-Logo.png" 
              alt="Zoom" 
              className="h-16 w-auto object-contain" 
          />
        </div>
        
        <div className="p-6">
          <h3 className="font-medium text-center text-lg mb-1">Zoom Integration</h3>
          <p className="text-gray-600 text-center mb-4">Connect your Zoom account to automatically create and manage class meetings</p>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5">
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="platform-integration" className="font-medium text-gray-800">Enable automatic integration</Label>
              <Switch 
                id="platform-integration" 
                checked={isIntegrationEnabled}
                onCheckedChange={setIsIntegrationEnabled}
              />
            </div>
            <p className="text-xs text-gray-600">
              When enabled, we'll automatically create and manage Zoom meetings for your classes
            </p>
          </div>
          
          {isZoomAuthorized ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="inline-flex items-center text-green-600 font-medium mb-1">
                <CheckCircle className="h-5 w-5 mr-1.5" />
                Connected to Zoom
              </div>
              <p className="text-sm text-green-700 mb-3">
                {accountEmail ? `Your Zoom account (${accountEmail}) is connected and ready to use` : 'Your Zoom account is connected and ready to use for all your classes'}
              </p>
              <div className="flex justify-between items-center">
                <div className="text-xs text-green-600">
                  {connectionDate ? `Connected on: ${new Date(connectionDate).toLocaleDateString()}` : 'Last verified: Just now'}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-green-300 text-green-700 hover:bg-green-50"
                    onClick={checkZoomConnection}
                    disabled={isAuthenticating}
                  >
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                    Verify
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                    onClick={disconnectZoom}
                    disabled={isAuthenticating}
                  >
                    <LinkIcon className="h-3.5 w-3.5 mr-1" />
                    Disconnect
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className={`border rounded-lg p-4 text-center ${isIntegrationEnabled ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
              <h4 className="font-medium text-gray-800 mb-2">Connect your Zoom account</h4>
              <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
                Connect your Zoom account to enable automatic meeting creation for all your classes.
              </p>
              <Button 
                className={`px-6 h-10 flex items-center justify-center gap-2
                  ${isIntegrationEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300'}`}
                onClick={authorizeZoom}
                disabled={isAuthenticating || !isIntegrationEnabled}
              >
                {isAuthenticating ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Connecting to Zoom...
                  </>
                ) : (
                  <>
                    <img src="https://kidato-images.s3.eu-west-1.amazonaws.com/Zoom-Logo.png" className="h-5 w-5 object-contain" alt="" />
                    {isIntegrationEnabled ? "Authorize Zoom Account" : "Enable integration first"}
                  </>
                )}
              </Button>
              {isIntegrationEnabled && (
                <div className="mt-3 text-xs text-gray-500 flex items-center justify-center">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  You'll be redirected to Zoom to authorize this connection
                </div>
              )}
            </div>
          )}
          
          <div className="mt-5 bg-blue-50 rounded-lg p-3 border border-blue-200 flex items-start gap-2">
            <div className="min-w-4 h-4 rounded-full bg-blue-200 flex items-center justify-center mt-0.5">
              <span className="text-xs text-blue-800 font-bold">i</span>
            </div>
            <div>
              <p className="text-sm text-blue-800 font-medium">Why connect Zoom?</p>
              <p className="text-xs text-blue-700 mt-0.5">
                Authorizing Zoom allows us to create and manage meetings automatically for all your scheduled classes, saving you time and ensuring a smooth experience for your students.
              </p>
            </div>
          </div>
          
          {isZoomAuthorized && isIntegrationEnabled && (
            <div className="mt-6 space-y-4">
              <h4 className="font-medium text-center text-lg">Create Meetings</h4>
              <p className="text-sm text-gray-600 text-center mb-2">
                You can now create Zoom meetings for your classes.
              </p>
              <div className="flex justify-center">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    toast({
                      title: "Info",
                      description: "You'll be able to create meetings after setting up your class",
                    });
                  }}
                >
                  <Video className="h-4 w-4 mr-1.5" />
                  Set Up Class Meetings
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlatformStep;
