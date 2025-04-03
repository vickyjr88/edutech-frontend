
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, PlusCircle, X, Image as ImageIcon, Video, FileText, Link } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type VideoStepProps = {
  videoUrls: string[];
  setVideoUrls: React.Dispatch<React.SetStateAction<string[]>>;
  photoUrls: string[];
  setPhotoUrls: React.Dispatch<React.SetStateAction<string[]>>;
  documentUrls?: string[];
  setDocumentUrls?: React.Dispatch<React.SetStateAction<string[]>>;
};

const VideoStep = ({ 
  videoUrls, 
  setVideoUrls, 
  photoUrls, 
  setPhotoUrls,
  documentUrls = [],
  setDocumentUrls = () => {}
}: VideoStepProps) => {
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [activeTab, setActiveTab] = useState("videos");

  const addVideoUrl = () => {
    if (newVideoUrl.trim() && !videoUrls.includes(newVideoUrl)) {
      setVideoUrls([...videoUrls, newVideoUrl.trim()]);
      setNewVideoUrl("");
    }
  };

  const removeVideoUrl = (urlToRemove: string) => {
    setVideoUrls(videoUrls.filter(url => url !== urlToRemove));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // In a real implementation, you would upload these to storage
    // For now, we'll just create URL objects for preview
    const newPhotoUrls = Array.from(files).map(file => URL.createObjectURL(file));
    setPhotoUrls([...photoUrls, ...newPhotoUrls]);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // In a real implementation, you would upload these to storage
    // For now, we'll just create URL objects for preview
    const newDocUrls = Array.from(files).map(file => URL.createObjectURL(file));
    setDocumentUrls([...documentUrls, ...newDocUrls]);
  };

  const removePhoto = (urlToRemove: string) => {
    setPhotoUrls(photoUrls.filter(url => url !== urlToRemove));
  };

  const removeDocument = (urlToRemove: string) => {
    setDocumentUrls(documentUrls.filter(url => url !== urlToRemove));
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Video Links
          </TabsTrigger>
          <TabsTrigger value="photos" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Photos
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="videos" className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-2">Add YouTube or Vimeo Links</h3>
            <p className="text-sm text-gray-500 mb-4">
              Share 1-2 minute videos introducing yourself and showcasing your teaching style
            </p>
            
            <div className="flex gap-2 mb-4">
              <Input 
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                placeholder="e.g., https://youtube.com/watch?v=..."
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={addVideoUrl}
                disabled={!newVideoUrl.trim()}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Add
              </Button>
            </div>
            
            {videoUrls.length > 0 && (
              <div className="space-y-2">
                <Label>Your Video Links</Label>
                <div className="space-y-2">
                  {videoUrls.map((url, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="text-sm truncate max-w-[90%]">{url}</div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeVideoUrl(url)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="photos" className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-2">Upload Portfolio Photos</h3>
            <p className="text-sm text-gray-500 mb-4">
              Share images of your art, classroom, or student work (with permission)
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className="h-10 w-10 text-gray-400" />
                <h3 className="font-medium">Upload Images</h3>
                <p className="text-sm text-gray-500">
                  PNG, JPG or GIF, up to 5MB each
                </p>
                <div className="mt-2">
                  <Input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('photo-upload')?.click()}
                  >
                    Choose Files
                  </Button>
                </div>
              </div>
            </div>
            
            {photoUrls.length > 0 && (
              <div className="space-y-2">
                <Label>Your Portfolio Photos</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {photoUrls.map((url, index) => (
                    <Card key={index} className="relative overflow-hidden group">
                      <CardContent className="p-0">
                        <img 
                          src={url} 
                          alt={`Portfolio image ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => removePhoto(url)}
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-2">Upload Documents</h3>
            <p className="text-sm text-gray-500 mb-4">
              Share lesson plans, worksheets, or other teaching materials
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
              <div className="flex flex-col items-center justify-center space-y-2">
                <FileText className="h-10 w-10 text-gray-400" />
                <h3 className="font-medium">Upload Documents</h3>
                <p className="text-sm text-gray-500">
                  PDF, DOC, DOCX, or other document formats, up to 10MB each
                </p>
                <div className="mt-2">
                  <Input
                    id="document-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                    multiple
                    onChange={handleDocumentUpload}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('document-upload')?.click()}
                  >
                    Choose Files
                  </Button>
                </div>
              </div>
            </div>
            
            {documentUrls.length > 0 && (
              <div className="space-y-2">
                <Label>Your Documents</Label>
                <div className="space-y-2 mt-2">
                  {documentUrls.map((url, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="flex items-center text-sm">
                        <FileText className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="truncate max-w-[250px]">Document {index + 1}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(url, '_blank')}
                        >
                          View
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeDocument(url)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VideoStep;
