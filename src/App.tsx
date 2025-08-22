
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { IntercomProvider } from "@/components/support";
import { intercomConfig } from "@/components/support/IntercomConfig";
import AppRoutes from "./components/AppRoutes";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            {intercomConfig ? (
              <IntercomProvider 
                config={intercomConfig}
                autoboot={true}
              >
                <TooltipProvider>
                  <AppRoutes />
                  <Toaster />
                  <Sonner />
                </TooltipProvider>
              </IntercomProvider>
            ) : (
              <TooltipProvider>
                <AppRoutes />
                <Toaster />
                <Sonner />
              </TooltipProvider>
            )}
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
