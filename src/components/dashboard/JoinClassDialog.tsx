
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
import { CheckCircle2, XCircle, Loader2, Wifi, Globe, Smartphone, Signal, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

// Add NetworkInformation type definition for TypeScript
interface NetworkInformation {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  type?: string;
}

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
  const [connectionDetails, setConnectionDetails] = useState({
    browserName: "",
    browserVersion: "",
    isp: "Detecting...",
    connectionType: "Detecting...",
    bandwidth: "Calculating...",
    location: "Detecting...",
  });
  const [showConnectionDetails, setShowConnectionDetails] = useState(false);

  // Run the checks when the dialog opens
  useEffect(() => {
    if (isOpen) {
      runSystemChecks();
      setTimeout(() => {
        setShowConnectionDetails(true);
      }, 800); // Show details after a delay for animation effect
    } else {
      // Reset state when dialog closes
      setCheckingConnection(false);
      setCheckResults({ browser: null, connection: null });
      setShowConnectionDetails(false);
    }
  }, [isOpen]);

  const runSystemChecks = async () => {
    setCheckingConnection(true);
    
    // Check browser compatibility and get browser details
    const browserDetails = getBrowserDetails();
    const isBrowserCompatible = browserDetails.isCompatible;
    
    setConnectionDetails(prev => ({
      ...prev,
      browserName: browserDetails.name,
      browserVersion: browserDetails.version
    }));
    
    setCheckResults(prev => ({
      ...prev,
      browser: isBrowserCompatible,
    }));
    
    // Check internet connection and get network details
    try {
      const connectionInfo = await checkInternetConnection();
      
      setCheckResults(prev => ({
        ...prev,
        connection: connectionInfo.isGood,
      }));
      
      // Get connection details after a delay (simulating API call to get ISP info)
      setTimeout(() => {
        // In a real app, we would make an API call to a service like ipinfo.io
        // For this demo, we'll use mock data and attempt to get geolocation
        getLocationInfo().then(locationInfo => {
          setConnectionDetails(prev => ({
            ...prev,
            isp: "FastNet Internet Services",
            connectionType: getConnectionType(),
            bandwidth: connectionInfo.speed + " Mbps",
            location: locationInfo
          }));
        });
      }, 1500);
      
    } catch (error) {
      setCheckResults(prev => ({
        ...prev,
        connection: false,
      }));
      setConnectionDetails(prev => ({
        ...prev,
        isp: "Unable to detect",
        connectionType: "Connection issues",
        bandwidth: "Unavailable",
        location: "Location unavailable"
      }));
    }
    
    setCheckingConnection(false);
  };

  // Safe way to access navigator.connection with TypeScript
  const getConnectionType = () => {
    // Cast navigator to have a connection property of NetworkInformation type
    const navigatorWithConnection = navigator as Navigator & { connection?: NetworkInformation };
    
    if (navigatorWithConnection.connection) {
      return navigatorWithConnection.connection.effectiveType || "Unknown";
    }
    return "Broadband";
  };

  const getLocationInfo = (): Promise<string> => {
    return new Promise((resolve) => {
      // Try to get geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // In a real app, we would use the coordinates to get the actual location name
            // For this demo, we'll use mock data based on coordinates
            const latitude = position.coords.latitude.toFixed(2);
            const longitude = position.coords.longitude.toFixed(2);
            resolve(`Approximate location: ${latitude}, ${longitude}`);
          },
          () => {
            // If geolocation is blocked or fails
            resolve("Location access denied");
          }
        );
      } else {
        // Browser doesn't support geolocation
        resolve("Geolocation not supported");
      }
      
      // Set a timeout in case geolocation takes too long
      setTimeout(() => {
        resolve("Nairobi, Kenya (Estimated)");
      }, 3000);
    });
  };

  const getBrowserDetails = () => {
    const userAgent = navigator.userAgent;
    let name = "Unknown Browser";
    let version = "";
    let isCompatible = false;
    
    // Check for Chrome
    if (/Chrome/.test(userAgent) && !/Chromium|Edge|Edg/.test(userAgent)) {
      name = "Chrome";
      version = userAgent.match(/Chrome\/(\d+\.\d+)/)?.[1] || "";
      isCompatible = true;
    } 
    // Check for Firefox
    else if (/Firefox/.test(userAgent)) {
      name = "Firefox";
      version = userAgent.match(/Firefox\/(\d+\.\d+)/)?.[1] || "";
      isCompatible = true;
    } 
    // Check for Safari
    else if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
      name = "Safari";
      version = userAgent.match(/Version\/(\d+\.\d+)/)?.[1] || "";
      isCompatible = true;
    } 
    // Check for Edge
    else if (/Edg|Edge/.test(userAgent)) {
      name = "Microsoft Edge";
      version = userAgent.match(/Edg\/(\d+\.\d+)/)?.[1] || 
               userAgent.match(/Edge\/(\d+\.\d+)/)?.[1] || "";
      isCompatible = true;
    } 
    // Check for Internet Explorer (not compatible)
    else if (/MSIE|Trident/.test(userAgent)) {
      name = "Internet Explorer";
      version = userAgent.match(/MSIE (\d+\.\d+)/)?.[1] || 
                userAgent.match(/rv:(\d+\.\d+)/)?.[1] || "";
      isCompatible = false;
    }
    
    return { name, version, isCompatible };
  };

  const checkInternetConnection = (): Promise<{ isGood: boolean, speed: string }> => {
    return new Promise((resolve) => {
      const start = Date.now();
      const img = new Image();
      
      // Simple connection check by loading a small image
      img.onload = () => {
        const loadTime = Date.now() - start;
        const connectionSpeed = Math.floor(10000 / loadTime); // Simple estimation
        resolve({
          isGood: loadTime < 3000, 
          speed: connectionSpeed.toString()
        });
      };
      
      img.onerror = () => {
        resolve({ isGood: false, speed: "0" });
      };
      
      // Try to load Google's favicon as a test
      img.src = "https://www.google.com/favicon.ico?_=" + start;
      
      // Set a timeout for the check
      setTimeout(() => {
        resolve({ isGood: false, speed: "0" });
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-kidato-blue">
            Join "{classTitle}"
          </DialogTitle>
          <DialogDescription className="text-base">
            Let's make sure your system is ready for the virtual classroom!
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-6">
          {checkingConnection ? (
            <div className="flex flex-col items-center justify-center py-8 animate-pulse">
              <div className="relative">
                <Loader2 className="h-16 w-16 text-kidato-blue animate-spin mb-4" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-kidato-blue" />
                </div>
              </div>
              <p className="text-center text-xl font-medium text-gray-700 mt-4">Checking your system...</p>
              <p className="text-center text-gray-500 mt-1">This will only take a moment</p>
            </div>
          ) : (
            <div className={cn("space-y-8 transition-all duration-500", 
              showConnectionDetails ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
              {/* System Check Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-kidato-light-blue p-2 rounded-lg">
                      <Smartphone className="h-6 w-6 text-kidato-blue" />
                    </div>
                    <h3 className="font-semibold text-lg">Browser Check</h3>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-3 mb-3">
                    <span className="font-medium">Browser</span>
                    <span className="font-semibold">{connectionDetails.browserName} {connectionDetails.browserVersion}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Compatibility</span>
                    {checkResults.browser === null ? (
                      <span className="text-gray-500">Checking...</span>
                    ) : checkResults.browser ? (
                      <div className="flex items-center text-green-500">
                        <CheckCircle2 className="h-5 w-5 mr-1" />
                        <span className="font-medium">Compatible</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-500">
                        <XCircle className="h-5 w-5 mr-1" />
                        <span className="font-medium">Not compatible</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-kidato-light-blue p-2 rounded-lg">
                      <Wifi className="h-6 w-6 text-kidato-blue" />
                    </div>
                    <h3 className="font-semibold text-lg">Connection Check</h3>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-3 mb-3">
                    <span className="font-medium">Connection</span>
                    {checkResults.connection === null ? (
                      <span className="text-gray-500">Checking...</span>
                    ) : checkResults.connection ? (
                      <div className="flex items-center text-green-500">
                        <CheckCircle2 className="h-5 w-5 mr-1" />
                        <span className="font-medium">Good</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-500">
                        <XCircle className="h-5 w-5 mr-1" />
                        <span className="font-medium">Poor</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Bandwidth</span>
                    <span className="font-semibold">{connectionDetails.bandwidth}</span>
                  </div>
                </div>
              </div>
              
              {/* Network Details */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-kidato-light-blue p-2 rounded-lg">
                    <Signal className="h-6 w-6 text-kidato-blue" />
                  </div>
                  <h3 className="font-semibold text-lg">Network Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="font-medium">Service Provider</span>
                    <span className="font-semibold">{connectionDetails.isp}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="font-medium">Connection Type</span>
                    <span className="font-semibold">{connectionDetails.connectionType}</span>
                  </div>
                </div>
              </div>
              
              {/* Location Details - New Section */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-kidato-light-blue p-2 rounded-lg">
                    <MapPin className="h-6 w-6 text-kidato-blue" />
                  </div>
                  <h3 className="font-semibold text-lg">Your Location</h3>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="font-medium">Detected Location</span>
                  <span className="font-semibold">{connectionDetails.location}</span>
                </div>
                
                <div className="mt-3 text-xs text-gray-500">
                  <p>Location is approximated based on your internet connection. Accurate location requires permission.</p>
                </div>
              </div>
              
              {/* Recommendation */}
              <div className={cn(
                "p-4 rounded-xl border text-center transition-all duration-300",
                allChecksPassed 
                  ? "bg-green-50 border-green-200 text-green-700" 
                  : "bg-orange-50 border-orange-200 text-orange-700"
              )}>
                <p className="font-medium">
                  {allChecksPassed 
                    ? "Your system is ready! You can join the class now." 
                    : "Your system may have some issues. You might experience problems during the class."}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-3 pt-2">
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
            className={cn(
              "sm:order-2 order-1 text-white font-medium text-base px-6 py-2 transition-all duration-300",
              allChecksPassed && !checkingConnection
                ? "bg-green-500 hover:bg-green-600 scale-100 hover:scale-105"
                : "bg-gray-400 cursor-not-allowed"
            )}
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
