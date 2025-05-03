import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Link as LinkIcon, RefreshCw, ExternalLink } from "lucide-react";
import { zoomService, ZoomConnectionStatus as ZoomConnectionStatusType } from "@/integrations/api/services/zoom.service";
import { toast } from "@/components/ui/use-toast";

interface ZoomConnectionProps {
  onConnectionChange?: (connected: boolean) => void;
}

const ZoomConnectionStatus: React.FC<ZoomConnectionProps> = ({ onConnectionChange }) => {
  const [isZoomConnected, setIsZoomConnected] = useState(false);
  const [accountEmail, setAccountEmail] = useState<string | undefined>(undefined);
  const [connectionDate, setConnectionDate] = useState<string | undefined>(undefined);
  const [isChecking, setIsChecking] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  useEffect(() => {
    checkZoomConnection();
  }, []);

  const checkZoomConnection = async () => {
    setIsChecking(true);
    
    try {
      const { data, error } = await zoomService.getConnectionStatus();
      
      if (error) {
        console.error("Failed to get Zoom connection status:", error);
        toast({
          title: "Error",
          description: "Failed to check Zoom connection status",
          variant: "destructive"
        });
        return;
      }
      
      setIsZoomConnected(data?.connected || false);
      setAccountEmail(data?.account_email);
      setConnectionDate(data?.connected_at);
      
      if (onConnectionChange) {
        onConnectionChange(data?.connected || false);
      }
    } catch (error) {
      console.error("Error checking Zoom connection:", error);
    } finally {
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
      
      // Redirect to Zoom OAuth
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
      
      if (onConnectionChange) {
        onConnectionChange(false);
      }
      
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
    <Card className={isZoomConnected ? "border-green-200" : "border-blue-200"}>
      <CardHeader className={`pb-2 ${isZoomConnected ? "bg-green-50" : "bg-blue-50"}`}>
        <div className="flex items-center">
          <img 
            src="https://kidato-images.s3.eu-west-1.amazonaws.com/Zoom-Logo.png" 
            alt="Zoom Logo"
            className="h-7 mr-2" 
          />
          <CardTitle>Zoom Integration</CardTitle>
        </div>
        <CardDescription>
          {isZoomConnected 
            ? "Your Zoom account is connected and ready to use for your classes"
            : "Connect your Zoom account to create and manage live class sessions"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {isZoomConnected ? (
          <div className="space-y-3">
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Connected to Zoom</span>
            </div>
            {accountEmail && (
              <div className="text-sm text-gray-600">
                Account: <span className="font-medium">{accountEmail}</span>
              </div>
            )}
            {connectionDate && (
              <div className="text-sm text-gray-600">
                Connected on: {formatConnectionDate(connectionDate)}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center text-blue-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Zoom not connected</span>
            </div>
            <div className="text-sm text-gray-600">
              Connect your Zoom account to automatically create and manage meetings for your classes.
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          disabled={isChecking}
          onClick={checkZoomConnection}
        >
          {isChecking ? (
            <>
              <div className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-1.5"></div>
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Refresh Status
            </>
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
                <div className="h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin mr-1.5"></div>
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
            onClick={getAuthUrl}
          >
            <ExternalLink className="h-4 w-4 mr-1.5" />
            Connect Account
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ZoomConnectionStatus;