
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Link, FileText } from "lucide-react";
import ResourceUploader from "../ResourceUploader";

export type VideoStepProps = {
  videoUrls: string[];
  setVideoUrls: (urls: string[]) => void;
  photoUrls: string[];
  setPhotoUrls: (urls: string[]) => void;
};

const VideoStep = ({ videoUrls, setVideoUrls, photoUrls, setPhotoUrls }: VideoStepProps) => {
  const [activeTab, setActiveTab] = useState("video");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [resources, setResources] = useState({
    files: [],
    links: []
  });

  const handleResourcesChange = (newResources) => {
    setResources(newResources);
    // You can also add logic here to save these to your form state if needed
  };

  const handleAddVideo = () => {
    if (newVideoUrl.trim()) {
      setVideoUrls([...videoUrls, newVideoUrl.trim()]);
      setNewVideoUrl("");
    }
  };

  const handleRemoveVideo = (index: number) => {
    const updatedUrls = [...videoUrls];
    updatedUrls.splice(index, 1);
    setVideoUrls(updatedUrls);
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="video" className="flex items-center">
            <Video className="mr-2 h-4 w-4" />
            Introduction Videos
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="video" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Introduction Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Add YouTube or Vimeo video URLs where you introduce yourself to potential students.
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
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      className="rounded-l-none"
                    />
                    <Button 
                      onClick={handleAddVideo} 
                      className="ml-2"
                      disabled={!newVideoUrl.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>
                
                {videoUrls.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label>Added Videos ({videoUrls.length})</Label>
                    <div className="space-y-2">
                      {videoUrls.map((url, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 border rounded-md">
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm text-blue-600 hover:underline truncate"
                          >
                            {url}
                          </a>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveVideo(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
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
