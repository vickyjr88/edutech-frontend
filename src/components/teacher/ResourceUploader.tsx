
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormFileUpload } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, FileText, Image, Video, Link, Upload, File } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ResourceFile = {
  id: string;
  file: File;
  type: 'document' | 'image';
};

type ResourceLink = {
  id: string;
  url: string;
  title: string;
};

type ResourceUploaderProps = {
  onResourcesChange: (resources: {
    files: ResourceFile[];
    links: ResourceLink[];
  }) => void;
  initialFiles?: ResourceFile[];
  initialLinks?: ResourceLink[];
};

const ResourceUploader = ({ 
  onResourcesChange, 
  initialFiles = [], 
  initialLinks = [] 
}: ResourceUploaderProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("documents");
  const [files, setFiles] = useState<ResourceFile[]>(initialFiles);
  const [links, setLinks] = useState<ResourceLink[]>(initialLinks);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');

  const handleDocumentsSelected = (selectedFiles: File[]) => {
    const newFiles = selectedFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      type: file.type.startsWith('image/') ? 'image' as const : 'document' as const
    }));
    
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onResourcesChange({ files: updatedFiles, links });
    
    toast({
      title: "Files added",
      description: `${selectedFiles.length} file(s) have been added to your resources.`,
    });
  };

  const handleRemoveFile = (id: string) => {
    const updatedFiles = files.filter(file => file.id !== id);
    setFiles(updatedFiles);
    onResourcesChange({ files: updatedFiles, links });
  };

  const handleAddVideoLink = () => {
    if (!videoUrl) {
      toast({
        title: "Missing URL",
        description: "Please enter a video URL.",
        variant: "destructive"
      });
      return;
    }

    const title = videoTitle || `Video ${links.length + 1}`;
    const newLink = {
      id: Math.random().toString(36).substring(2, 9),
      url: videoUrl,
      title
    };

    const updatedLinks = [...links, newLink];
    setLinks(updatedLinks);
    onResourcesChange({ files, links: updatedLinks });
    
    // Reset fields
    setVideoUrl('');
    setVideoTitle('');
    
    toast({
      title: "Video added",
      description: `"${title}" has been added to your resources.`
    });
  };

  const handleRemoveLink = (id: string) => {
    const updatedLinks = links.filter(link => link.id !== id);
    setLinks(updatedLinks);
    onResourcesChange({ files, links: updatedLinks });
  };

  const getFileIcon = (file: ResourceFile) => {
    if (file.type === 'image') return <Image className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Resources & Materials</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="documents" className="flex items-center">
              <File className="mr-2 h-4 w-4" />
              Documents & Images
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center">
              <Video className="mr-2 h-4 w-4" />
              Video Links
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents" className="space-y-4 pt-4">
            <FormFileUpload
              label="Upload Documents & Images"
              description="Drag and drop files here, or click to select files"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
              multiple={true}
              onFilesSelected={handleDocumentsSelected}
              icon={<Upload className="h-10 w-10 text-gray-400" />}
            />
            
            {files.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Uploaded Files ({files.length})</h4>
                <div className="space-y-2">
                  {files.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-2 border rounded-md bg-gray-50">
                      <div className="flex items-center">
                        {getFileIcon(file)}
                        <span className="ml-2 text-sm truncate max-w-[250px]">
                          {file.file.name}
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveFile(file.id)}
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="videos" className="space-y-4 pt-4">
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
              
              <div>
                <Label htmlFor="video-title">Video Title (Optional)</Label>
                <Input
                  id="video-title"
                  placeholder="Enter a descriptive title for the video"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                />
              </div>
              
              <Button onClick={handleAddVideoLink} className="w-full">
                <Video className="mr-2 h-4 w-4" />
                Add Video Link
              </Button>
            </div>
            
            {links.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Added Videos ({links.length})</h4>
                <div className="space-y-2">
                  {links.map(link => (
                    <div key={link.id} className="flex items-center justify-between p-2 border rounded-md bg-gray-50">
                      <div className="flex items-center">
                        <Video className="h-4 w-4 text-gray-500" />
                        <span className="ml-2 text-sm">{link.title}</span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2 text-xs">
                          {link.url.includes('youtube') ? 'YouTube' : 
                           link.url.includes('vimeo') ? 'Vimeo' : 'Video'}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveLink(link.id)}
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResourceUploader;
