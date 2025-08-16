
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Link, FileText, Save, CheckCircle } from "lucide-react";
import ResourceUploader from "../ResourceUploader";
import { teacherService } from "@/integrations/api/services/teacher.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export type VideoStepProps = {
  videoUrls: string[];
  setVideoUrls: (urls: string[]) => void;
  photoUrls: string[];
  setPhotoUrls: (urls: string[]) => void;
};

// Helper function to convert YouTube URL to embed URL
const getYoutubeEmbedUrl = (url: string): string => {
  // Handle youtu.be short URLs
  if (url.includes('youtu.be')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // Handle standard youtube.com URLs
  if (url.includes('youtube.com/watch')) {
    // Extract the v parameter from the URL
    const videoId = new URL(url).searchParams.get('v');
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // If it's already an embed URL or not recognized, return as is
  return url;
};

const VideoStep = ({ videoUrls, setVideoUrls, photoUrls, setPhotoUrls }: VideoStepProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("video");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [introVideoUrl, setIntroVideoUrl] = useState("");
  const [resources, setResources] = useState({
    files: [],
    links: []
  });

  // Fetch current intro video URL when component mounts
  useEffect(() => {
    const fetchTeacherProfile = async () => {
      if (user?.teacherId) {
        try {
          const { data, error } = await teacherService.getProfileById(user.id);
          if (!error && data?.introVideoUrl) {
            setIntroVideoUrl(data.introVideoUrl);
            // If there's already an intro video URL, add it to videoUrls
            if (data.introVideoUrl && !videoUrls.includes(data.introVideoUrl)) {
              setVideoUrls([data.introVideoUrl]);
            }
          }
        } catch (error) {
          console.error("Error fetching teacher profile:", error);
        }
      }
    };

    fetchTeacherProfile();
  }, [user?.teacherId]);

  // Handle saving the intro video URL to the teacher profile
  const saveIntroVideoUrl = async () => {
    if (!user?.teacherId || videoUrls.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one video URL",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Use the first video URL as the intro video
      const selectedVideoUrl = videoUrls[0];
      
      // Update the teacher profile with the intro video URL
      const { error } = await teacherService.updateProfile(user.id, {
        introVideoUrl: selectedVideoUrl
      });

      if (error) {
        throw new Error(error.message || "Failed to save intro video URL");
      }

      // Update local state
      setIntroVideoUrl(selectedVideoUrl);
      
      // Show success message
      toast({
        title: "Success",
        description: "Introduction video has been saved to your profile",
      });
      
      setSaveSuccess(true);
    } catch (error) {
      console.error("Error saving intro video URL:", error);
      toast({
        title: "Error",
        description: "Failed to save the introduction video",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
      
      // Reset success indication after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }
  };

  const handleResourcesChange = (newResources) => {
    setResources(newResources);
    // You can also add logic here to save these to your form state if needed
  };

  const isValidVideoUrl = (url: string): boolean => {
    // Check if the URL is from YouTube or Vimeo
    return (
      url.includes('youtube.com/watch') || 
      url.includes('youtu.be/') || 
      url.includes('vimeo.com/')
    );
  };

  const handleAddVideo = () => {
    const trimmedUrl = newVideoUrl.trim();
    if (trimmedUrl) {
      if (isValidVideoUrl(trimmedUrl)) {
        // Replace existing videos rather than adding multiple
        setVideoUrls([trimmedUrl]);
        setNewVideoUrl("");
      } else {
        toast({
          title: "Invalid URL",
          description: "Please enter a valid YouTube or Vimeo URL",
          variant: "destructive"
        });
      }
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
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Introduction Video</h4>
                <p className="text-sm text-blue-700 mb-2">
                  Add <strong>one</strong> YouTube or Vimeo video URL where you introduce yourself to potential students.
                </p>
                <p className="text-xs text-blue-600 mb-2">
                  This video will be displayed on your public teacher profile and is essential for
                  attracting students. A good introduction video significantly increases your chances of
                  being selected by students and parents.
                </p>
                <div className="flex items-center text-xs text-blue-800 bg-blue-100 p-2 rounded">
                  <span className="font-medium">Note:</span>
                  <span className="ml-1">You can only have one introduction video. Adding a new video will replace the current one.</span>
                </div>
              </div>
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
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddVideo();
                        }
                      }}
                      className="rounded-l-none"
                    />
                    <Button 
                      onClick={handleAddVideo} 
                      className="ml-2"
                      disabled={!newVideoUrl.trim()}
                    >
                      {videoUrls.length > 0 ? "Replace Video" : "Add Video"}
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <Label className="flex items-center gap-2">
                      Introduction Video
                      {videoUrls.length > 0 && introVideoUrl === videoUrls[0] && (
                        <span className="text-xs flex items-center text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Saved to your profile
                        </span>
                      )}
                    </Label>
                    
                    <div className="space-y-2 mt-2">
                      {videoUrls.length > 0 ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-2 bg-gray-50 border rounded-md">
                            <a 
                              href={videoUrls[0]} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-sm text-blue-600 hover:underline truncate"
                            >
                              {videoUrls[0]}
                            </a>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveVideo(0)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Replace
                            </Button>
                          </div>
                          
                          {/* Video preview - Embed YouTube or Vimeo */}
                          <div className="aspect-video w-full bg-gray-100 rounded-md overflow-hidden">
                            {videoUrls[0].includes('youtube.com') || videoUrls[0].includes('youtu.be') ? (
                              <iframe
                                src={getYoutubeEmbedUrl(videoUrls[0])}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                              ></iframe>
                            ) : videoUrls[0].includes('vimeo.com') ? (
                              <iframe
                                src={`https://player.vimeo.com/video/${videoUrls[0].split('/').pop()}`}
                                title="Vimeo video player"
                                frameBorder="0"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                              ></iframe>
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500">Video preview not available</p>
                              </div>
                            )}
                          </div>
                          
                          <Button
                            onClick={saveIntroVideoUrl}
                            disabled={isSaving || (introVideoUrl === videoUrls[0] && !saveSuccess)}
                            className={`w-full ${introVideoUrl === videoUrls[0] ? 'bg-green-600 hover:bg-green-700' : ''}`}
                          >
                            {isSaving ? (
                              <>Saving...</>
                            ) : introVideoUrl === videoUrls[0] ? (
                              <>{saveSuccess ? 'Saved!' : 'Already Saved to Profile'}</>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Save as Introduction Video
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center p-8 border border-dashed rounded-md bg-gray-50">
                          <p className="text-gray-500 mb-2">No introduction video added yet</p>
                          <p className="text-xs text-gray-400">Add a YouTube or Vimeo URL above to get started</p>
                        </div>
                      )}
                    </div>
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
