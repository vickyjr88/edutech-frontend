
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Link, FileText } from "lucide-react";
import ResourceUploader from "../ResourceUploader";

type VideoStepProps = {
  videoUrl: string;
  setVideoUrl: (url: string) => void;
};

const VideoStep = ({ videoUrl, setVideoUrl }: VideoStepProps) => {
  const [activeTab, setActiveTab] = useState("video");
  const [resources, setResources] = useState({
    files: [],
    links: []
  });

  const handleResourcesChange = (newResources) => {
    setResources(newResources);
    // You can also add logic here to save these to your form state if needed
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="video" className="flex items-center">
            <Video className="mr-2 h-4 w-4" />
            Introduction Video
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="video" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Introduction Video</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Add a YouTube or Vimeo video URL where you introduce yourself to potential students.
              </p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="video-url">Video URL</Label>
                  <div className="flex items-center mt-1">
                    <div className="bg-gray-100 p-2 rounded-l-md">
                      <Link className="h-4 w-4 text-gray-500" />
                    </div>
                    <Input
                      id="video-url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <p>Tips for a great introduction video:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Keep it short (1-2 minutes)</li>
                    <li>Introduce yourself and your teaching experience</li>
                    <li>Explain your teaching style and approach</li>
                    <li>Speak clearly and with enthusiasm</li>
                    <li>Ensure good lighting and sound quality</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="pt-4">
          <ResourceUploader 
            onResourcesChange={handleResourcesChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VideoStep;
