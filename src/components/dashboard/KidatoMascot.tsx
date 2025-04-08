
import { useState } from "react";
import { Bot, X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import KidatoMascotDialog from "./KidatoMascotDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function KidatoMascot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      {/* Floating mascot button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-kidato-blue shadow-lg hover:bg-kidato-blue/90"
        >
          <Bot className="h-7 w-7 text-white" />
        </Button>
      )}

      {/* Expanded mascot assistant */}
      {isOpen && (
        <Card className={`fixed ${isMinimized ? 'bottom-6 right-6 w-auto h-auto p-0' : 'bottom-6 right-6 w-80 h-96'} rounded-lg shadow-xl border-2 border-kidato-blue transition-all duration-300 overflow-hidden`}>
          {isMinimized ? (
            <Button 
              variant="ghost" 
              className="p-3" 
              onClick={() => setIsMinimized(false)}
            >
              <Avatar className="h-10 w-10 border-2 border-kidato-blue">
                <AvatarImage src="/lovable-uploads/15671e94-4ac9-490c-95b6-aa4fe6bbc23c.png" alt="Kidato Mascot" />
                <AvatarFallback className="bg-kidato-light-blue text-kidato-blue text-lg font-bold">K</AvatarFallback>
              </Avatar>
            </Button>
          ) : (
            <>
              <div className="flex items-center justify-between bg-kidato-blue text-white p-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 bg-white">
                    <AvatarImage src="/lovable-uploads/15671e94-4ac9-490c-95b6-aa4fe6bbc23c.png" alt="Kidato Mascot" />
                    <AvatarFallback className="bg-white text-kidato-blue text-sm font-bold">K</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">Kidato Assistant</span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-kidato-blue/80" onClick={() => setIsMinimized(true)}>
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-kidato-blue/80" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4 h-[calc(100%-56px)] flex flex-col">
                <div className="bg-gray-50 rounded-lg p-3 flex items-start gap-3 mb-3">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src="/lovable-uploads/15671e94-4ac9-490c-95b6-aa4fe6bbc23c.png" alt="Kidato Mascot" />
                    <AvatarFallback className="bg-kidato-light-blue text-kidato-blue">K</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">Hi there! I'm your Kidato AI assistant. I can help with:</p>
                    <ul className="text-sm mt-2 space-y-1 list-disc list-inside text-gray-700">
                      <li>Homework questions</li>
                      <li>Study schedules</li>
                      <li>Learning resources</li>
                      <li>Class reminders</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-auto">
                  <Button 
                    className="w-full bg-kidato-blue hover:bg-kidato-blue/90" 
                    onClick={() => setShowDialog(true)}
                  >
                    Ask for help
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      )}

      <KidatoMascotDialog 
        isOpen={showDialog} 
        setIsOpen={setShowDialog} 
      />
    </>
  );
}
