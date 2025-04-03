
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Video } from "lucide-react";

type PlatformStepProps = {
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
};

const PlatformStep = ({ selectedPlatform, setSelectedPlatform }: PlatformStepProps) => {
  return (
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
};

export default PlatformStep;
