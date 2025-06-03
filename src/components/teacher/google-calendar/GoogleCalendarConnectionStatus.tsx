import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Link as LinkIcon, RefreshCw, ExternalLink, Calendar } from "lucide-react";
import { googleCalendarService, GoogleCalendarConnectionStatus as GoogleCalendarConnectionStatusType } from "@/integrations/api/services/google-calendar.service";
import { toast } from "@/components/ui/use-toast";
import GoogleCalendarDisconnectDialog from "./GoogleCalendarDisconnectDialog";

interface GoogleCalendarConnectionProps {
  onConnectionChange?: (connected: boolean) => void;
}

const GoogleCalendarConnectionStatus: React.FC<GoogleCalendarConnectionProps> = ({ onConnectionChange }) => {
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);
  const [accountEmail, setAccountEmail] = useState<string | undefined>(undefined);
  const [connectionDate, setConnectionDate] = useState<string | undefined>(undefined);
  const [isChecking, setIsChecking] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);

  useEffect(() => {
    checkGoogleCalendarConnection();
  }, []);

  const checkGoogleCalendarConnection = async () => {
    setIsChecking(true);
    
    try {
      const { data, error } = await googleCalendarService.getConnectionStatus();
      
      if (error) {
        console.error("Failed to get Google Calendar connection status:", error);
        toast({
          title: "Error",
          description: "Failed to check Google Calendar connection status",
          variant: "destructive"
        });
        return;
      }
      
      setIsGoogleCalendarConnected(data?.connected || false);
      setAccountEmail(data?.email);
      setConnectionDate(data?.connected_at);
      
      if (onConnectionChange) {
        onConnectionChange(data?.connected || false);
      }
    } catch (error) {
      console.error("Error checking Google Calendar connection:", error);
    } finally {
      setIsChecking(false);
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
      
      // Redirect to Google OAuth
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
      
      if (onConnectionChange) {
        onConnectionChange(false);
      }
      
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

  return (
    <Card className={isGoogleCalendarConnected ? "border-green-200" : "border-blue-200"}>
      <CardHeader className={`pb-2 ${isGoogleCalendarConnected ? "bg-green-50" : "bg-blue-50"}`}>
        <div className="flex items-center">
          <Calendar className="h-7 w-7 mr-2 text-blue-600" />
          <CardTitle>Google Calendar Integration</CardTitle>
        </div>
        <CardDescription>
          {isGoogleCalendarConnected 
            ? "Your Google Calendar is connected and ready to sync your class events"
            : "Connect your Google Calendar to automatically sync your class schedules and events"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {isGoogleCalendarConnected ? (
          <div className="space-y-3">
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Connected to Google Calendar</span>
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
              <span className="font-medium">Google Calendar not connected</span>
            </div>
            <div className="text-sm text-gray-600">
              Connect your Google Calendar to automatically create calendar events for your classes and sync your schedule.
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          disabled={isChecking}
          onClick={checkGoogleCalendarConnection}
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

      <GoogleCalendarDisconnectDialog
        open={showDisconnectDialog}
        onOpenChange={setShowDisconnectDialog}
        onConfirm={disconnectGoogleCalendar}
        isDisconnecting={isDisconnecting}
        accountEmail={accountEmail}
      />
    </Card>
  );
};

export default GoogleCalendarConnectionStatus;