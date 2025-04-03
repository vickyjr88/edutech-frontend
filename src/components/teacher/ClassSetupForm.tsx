
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Video, Users, Monitor, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type ClassSetupFormProps = {
  onComplete: () => void;
  onCancel: () => void;
};

const ClassSetupForm = ({ onComplete, onCancel }: ClassSetupFormProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("zoom");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  
  const totalSteps = 3;
  const stepLabels = ["Platform", "Tools", "Schedule"];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // This is a mockup, so we'll just simulate a successful submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Class settings saved",
        description: "Your class settings have been successfully saved.",
      });
      onComplete();
    }, 1000);
  };

  const toggleTool = (toolId: string) => {
    setSelectedTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Choose Your Teaching Platform";
      case 2: return "Select Teaching Tools";
      case 3: return "Set Your Teaching Schedule";
      default: return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Select the online platform you'll use to conduct your classes";
      case 2: return "Choose tools to enhance your virtual classroom experience";
      case 3: return "Set your availability for teaching";
      default: return "";
    }
  };

  const renderPlatformStep = () => (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Choose the video conferencing platform that works best for you. You'll use this to conduct your online classes.
      </p>
      
      <RadioGroup 
        defaultValue={selectedPlatform} 
        onValueChange={setSelectedPlatform}
        className="grid grid-cols-1 gap-4 pt-2"
      >
        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
          <RadioGroupItem value="zoom" id="zoom" />
          <Label htmlFor="zoom" className="flex-1 cursor-pointer">
            <div className="flex items-center">
              <img src="https://cdn.freebiesupply.com/logos/large/2x/zoom-icon-logo-png-transparent.png" alt="Zoom" className="w-8 h-8 mr-3" />
              <div>
                <p className="font-medium">Zoom</p>
                <p className="text-sm text-gray-500">Reliable video conferencing with robust features</p>
              </div>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
          <RadioGroupItem value="google-meet" id="google-meet" />
          <Label htmlFor="google-meet" className="flex-1 cursor-pointer">
            <div className="flex items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/9b/Google_Meet_icon.svg" alt="Google Meet" className="w-8 h-8 mr-3" />
              <div>
                <p className="font-medium">Google Meet</p>
                <p className="text-sm text-gray-500">Simple integration with Google Workspace</p>
              </div>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
          <RadioGroupItem value="microsoft-teams" id="microsoft-teams" />
          <Label htmlFor="microsoft-teams" className="flex-1 cursor-pointer">
            <div className="flex items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg" alt="Microsoft Teams" className="w-8 h-8 mr-3" />
              <div>
                <p className="font-medium">Microsoft Teams</p>
                <p className="text-sm text-gray-500">Integrated solution for Microsoft users</p>
              </div>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
          <RadioGroupItem value="custom" id="custom" />
          <Label htmlFor="custom" className="flex-1 cursor-pointer">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 flex items-center justify-center rounded-full mr-3">
                <Video className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="font-medium">Other Platform</p>
                <p className="text-sm text-gray-500">Use your preferred video conferencing tool</p>
              </div>
            </div>
          </Label>
        </div>
      </RadioGroup>
      
      {selectedPlatform === "custom" && (
        <div className="mt-4">
          <Label htmlFor="custom-platform">Platform Name</Label>
          <Input id="custom-platform" placeholder="Enter platform name" className="mt-1" />
        </div>
      )}
      
      <div className="border-t pt-4 mt-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="platform-integration">Automatic platform integration</Label>
          <Switch id="platform-integration" />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          When enabled, we'll automatically create and send meeting links to your students.
        </p>
      </div>
    </div>
  );

  const renderToolsStep = () => (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Select the teaching tools you plan to use in your virtual classroom. You can always change these later.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div 
          className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 ${
            selectedTools.includes('whiteboard') ? 'border-blue-500 bg-blue-50' : ''
          }`}
          onClick={() => toggleTool('whiteboard')}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-full mr-3">
              <Monitor className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="font-medium">Interactive Whiteboard</p>
              <p className="text-sm text-gray-500">Draw, write, and present visually</p>
            </div>
          </div>
        </div>
        
        <div 
          className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 ${
            selectedTools.includes('documents') ? 'border-green-500 bg-green-50' : ''
          }`}
          onClick={() => toggleTool('documents')}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 flex items-center justify-center rounded-full mr-3">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div>
              <p className="font-medium">Document Sharing</p>
              <p className="text-sm text-gray-500">Share and collaborate on documents</p>
            </div>
          </div>
        </div>
        
        <div 
          className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 ${
            selectedTools.includes('recordings') ? 'border-purple-500 bg-purple-50' : ''
          }`}
          onClick={() => toggleTool('recordings')}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 flex items-center justify-center rounded-full mr-3">
              <Video className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="font-medium">Class Recordings</p>
              <p className="text-sm text-gray-500">Record sessions for later review</p>
            </div>
          </div>
        </div>
        
        <div 
          className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 ${
            selectedTools.includes('polls') ? 'border-orange-500 bg-orange-50' : ''
          }`}
          onClick={() => toggleTool('polls')}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-100 flex items-center justify-center rounded-full mr-3">
              <Users className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="font-medium">Polls & Quizzes</p>
              <p className="text-sm text-gray-500">Engage students with interactive questions</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t mt-6">
        <Label htmlFor="custom-tool">Add a custom tool</Label>
        <div className="flex gap-2 mt-1">
          <Input id="custom-tool" placeholder="Enter tool name" className="flex-1" />
          <Button variant="outline" type="button">Add</Button>
        </div>
      </div>
    </div>
  );

  const renderScheduleStep = () => (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Set your teaching schedule and availability. This helps students know when they can book classes with you.
      </p>
      
      <div className="space-y-4">
        <div>
          <Label>Days Available</Label>
          <div className="grid grid-cols-7 gap-2 mt-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 hover:bg-blue-200 cursor-pointer flex items-center justify-center text-blue-800 text-sm font-medium">
                  {day[0]}
                </div>
                <span className="text-xs mt-1">{day}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t pt-4">
          <Label>Time Slots</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <Label className="text-xs text-gray-500">Start Time</Label>
              <Select defaultValue="9">
                <SelectTrigger>
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({length: 12}, (_, i) => i + 7).map(hour => (
                    <SelectItem key={hour} value={hour.toString()}>
                      {hour}:00 {hour < 12 ? 'AM' : 'PM'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-xs text-gray-500">End Time</Label>
              <Select defaultValue="17">
                <SelectTrigger>
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({length: 12}, (_, i) => i + 12).map(hour => (
                    <SelectItem key={hour} value={hour.toString()}>
                      {hour > 12 ? hour - 12 : hour}:00 PM
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="mt-3">
            Add Another Time Slot
          </Button>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="calendar-sync">Sync with your calendar</Label>
            <Switch id="calendar-sync" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Automatically sync your teaching schedule with Google Calendar or Outlook
          </p>
        </div>
        
        <div className="border-t pt-4">
          <Label>Class Duration</Label>
          <RadioGroup defaultValue="60" className="grid grid-cols-3 gap-2 mt-2">
            <div className="flex items-center space-x-2 border rounded-md p-2">
              <RadioGroupItem value="30" id="duration-30" />
              <Label htmlFor="duration-30">30 min</Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-md p-2">
              <RadioGroupItem value="60" id="duration-60" />
              <Label htmlFor="duration-60">60 min</Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-md p-2">
              <RadioGroupItem value="90" id="duration-90" />
              <Label htmlFor="duration-90">90 min</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderPlatformStep();
      case 2: return renderToolsStep();
      case 3: return renderScheduleStep();
      default: return null;
    }
  };

  const ProgressIndicator = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        {stepLabels.map((label, index) => (
          <div 
            key={index}
            className="flex flex-col items-center"
          >
            <div className={`flex items-center ${index !== 0 ? 'w-full' : 'ml-0'}`}>
              {index !== 0 && (
                <div 
                  className={`h-1 w-full ${
                    currentStep > index ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep > index + 1 
                    ? 'bg-green-500 text-white' 
                    : currentStep === index + 1 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
              {index !== stepLabels.length - 1 && (
                <div 
                  className={`h-1 w-full ${
                    currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
            <span className="text-xs mt-1 text-gray-500">{label}</span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{getStepTitle()}</CardTitle>
        <CardDescription>{getStepDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <ProgressIndicator />
        <Form>
          {renderCurrentStep()}
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={currentStep === 1 ? onCancel : handleBack}
        >
          {currentStep === 1 ? 'Cancel' : (
            <>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </>
          )}
        </Button>
        <Button 
          onClick={handleNext}
          disabled={isSubmitting}
        >
          {currentStep === totalSteps ? (
            isSubmitting ? 'Saving...' : 'Complete Setup'
          ) : (
            <>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClassSetupForm;
