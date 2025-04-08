
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface JoinClassDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  classTitle: string;
}

export default function JoinClassDialog({
  isOpen,
  setIsOpen,
  classTitle,
}: JoinClassDialogProps) {
  const [checkingConnection, setCheckingConnection] = useState(false);
  const [checkResults, setCheckResults] = useState({
    browser: null as boolean | null,
    connection: null as boolean | null,
  });

  // Run the checks when the dialog opens
  useEffect(() => {
    if (isOpen) {
      runSystemChecks();
    } else {
      // Reset state when dialog closes
      setCheckingConnection(false);
      setCheckResults({ browser: null, connection: null });
    }
  }, [isOpen]);

  const runSystemChecks = async () => {
    setCheckingConnection(true);
    
    // Check browser compatibility
    const isBrowserCompatible = checkBrowserCompatibility();
    
    setCheckResults(prev => ({
      ...prev,
      browser: isBrowserCompatible,
    }));
    
    // Check internet connection
    try {
      const isConnectionGood = await checkInternetConnection();
      setCheckResults(prev => ({
        ...prev,
        connection: isConnectionGood,
      }));
    } catch (error) {
      setCheckResults(prev => ({
        ...prev,
        connection: false,
      }));
    }
    
    setCheckingConnection(false);
  };

  const checkBrowserCompatibility = (): boolean => {
    // Simple browser compatibility check
    const isChrome = navigator.userAgent.indexOf("Chrome") > -1;
    const isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
    const isSafari = navigator.userAgent.indexOf("Safari") > -1;
    const isEdge = navigator.userAgent.indexOf("Edg") > -1;
    
    return isChrome || isFirefox || isSafari || isEdge;
  };

  const checkInternetConnection = (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Simple connection check by loading a small image
      const start = Date.now();
      const img = new Image();
      
      img.onload = () => {
        const loadTime = Date.now() - start;
        resolve(loadTime < 3000); // Consider connection good if load time is less than 3 seconds
      };
      
      img.onerror = () => {
        resolve(false);
      };
      
      // Try to load Google's favicon as a test
      img.src = "https://www.google.com/favicon.ico?_=" + start;
      
      // Set a timeout for the check
      setTimeout(() => {
        resolve(false);
      }, 5000);
    });
  };

  const allChecksPassed = checkResults.browser && checkResults.connection;
  
  const joinClass = () => {
    // This would typically connect to a virtual classroom platform
    console.log("Joining class:", classTitle);
    window.open("https://meet.google.com", "_blank");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join "{classTitle}"</DialogTitle>
          <DialogDescription>
            Let's make sure your system is ready for the virtual classroom.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
          {checkingConnection ? (
            <div className="flex flex-col items-center justify-center py-4">
              <Loader2 className="h-8 w-8 text-kidato-blue animate-spin mb-2" />
              <p className="text-center text-gray-600">Checking your system...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-medium">Browser Compatibility</span>
                {checkResults.browser === null ? (
                  <span className="text-gray-500">Checking...</span>
                ) : checkResults.browser ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <div className="flex items-center text-red-500">
                    <XCircle className="h-5 w-5 mr-1" />
                    <span className="text-sm">Not compatible</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-medium">Internet Connection</span>
                {checkResults.connection === null ? (
                  <span className="text-gray-500">Checking...</span>
                ) : checkResults.connection ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <div className="flex items-center text-red-500">
                    <XCircle className="h-5 w-5 mr-1" />
                    <span className="text-sm">Poor connection</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            className="sm:order-1 order-2"
          >
            Cancel
          </Button>
          
          <Button
            disabled={!allChecksPassed || checkingConnection}
            onClick={joinClass}
            className={`${allChecksPassed ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'} sm:order-2 order-1`}
          >
            {checkingConnection ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Checking...
              </>
            ) : allChecksPassed ? (
              "Join Class Now"
            ) : (
              "System Check Failed"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
