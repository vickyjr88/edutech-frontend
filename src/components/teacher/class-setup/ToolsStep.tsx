
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Monitor, Video, Users } from "lucide-react";

type ToolsStepProps = {
  selectedTools: string[];
  toggleTool: (toolId: string) => void;
};

const ToolsStep = ({ selectedTools, toggleTool }: ToolsStepProps) => {
  return (
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
};

export default ToolsStep;
