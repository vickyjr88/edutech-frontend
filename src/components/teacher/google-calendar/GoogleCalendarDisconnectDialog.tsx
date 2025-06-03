import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface GoogleCalendarDisconnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDisconnecting?: boolean;
  accountEmail?: string;
}

const GoogleCalendarDisconnectDialog: React.FC<GoogleCalendarDisconnectDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isDisconnecting = false,
  accountEmail
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <AlertDialogTitle>Disconnect Google Calendar?</AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-left">
            <div className="space-y-3">
              <p>
                Are you sure you want to disconnect your Google Calendar{accountEmail ? ` (${accountEmail})` : ''}?
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">
                  <strong>This will:</strong>
                </p>
                <ul className="text-sm text-amber-700 mt-1 space-y-1">
                  <li>• Stop automatic calendar event creation</li>
                  <li>• Disable calendar synchronization</li>
                  <li>• Remove access to calendar integration features</li>
                </ul>
              </div>
              <p className="text-sm text-gray-600">
                You can reconnect your account at any time.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDisconnecting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDisconnecting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDisconnecting ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Disconnecting...
              </>
            ) : (
              "Disconnect Account"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GoogleCalendarDisconnectDialog;