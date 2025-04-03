
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LinkIcon, Trash2, Plus, FileText, FileVideo } from "lucide-react";

export type ResourceLink = {
  id: string;
  url: string;
  title: string;
};

interface ResourceLinksProps {
  lessonId: string;
  resourceLinks: ResourceLink[];
  onAddResourceLink: (lessonId: string, title: string, url: string) => void;
  onRemoveResourceLink: (lessonId: string, linkId: string) => void;
}

export const ResourceLinks = ({
  lessonId,
  resourceLinks,
  onAddResourceLink,
  onRemoveResourceLink
}: ResourceLinksProps) => {
  const [newResourceUrl, setNewResourceUrl] = useState("");
  const [newResourceTitle, setNewResourceTitle] = useState("");

  const handleAddLink = () => {
    if (!newResourceUrl.trim()) return;
    
    onAddResourceLink(
      lessonId,
      newResourceTitle || `Resource ${(resourceLinks || []).length + 1}`,
      newResourceUrl
    );
    
    setNewResourceUrl("");
    setNewResourceTitle("");
  };

  const getLinkTypeIcon = (url: string) => {
    if (url.includes('docs.google.com')) {
      return <FileText className="h-4 w-4 text-blue-600" />;
    } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return <FileVideo className="h-4 w-4 text-red-600" />;
    } else if (url.includes('sheets.google.com')) {
      return <FileText className="h-4 w-4 text-green-600" />;
    } else if (url.includes('slides.google.com')) {
      return <FileText className="h-4 w-4 text-yellow-600" />;
    } else {
      return <LinkIcon className="h-4 w-4 text-blue-500" />;
    }
  };

  const getLinkTypeName = (url: string) => {
    if (url.includes('docs.google.com')) return 'Google Doc';
    if (url.includes('sheets.google.com')) return 'Google Sheet';
    if (url.includes('slides.google.com')) return 'Google Slides';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('vimeo.com')) return 'Vimeo';
    return 'Link';
  };

  return (
    <div className="space-y-3 border-t pt-4 mt-4">
      <Label>Resource Links</Label>
      <div className="grid grid-cols-1 gap-2">
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <Input 
              placeholder="Resource title (optional)"
              value={newResourceTitle}
              onChange={(e) => setNewResourceTitle(e.target.value)}
              className="flex-grow"
            />
          </div>
          <div className="flex space-x-2">
            <Input 
              placeholder="https://... (YouTube, Google Docs, etc.)"
              value={newResourceUrl}
              onChange={(e) => setNewResourceUrl(e.target.value)}
              icon={<LinkIcon className="h-4 w-4" />}
              className="flex-grow"
            />
            <Button 
              type="button" 
              onClick={handleAddLink}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>

      {resourceLinks && resourceLinks.length > 0 && (
        <div className="mt-2 space-y-1">
          <Label className="text-xs text-gray-500">Added Links ({resourceLinks.length})</Label>
          <div className="grid grid-cols-1 gap-2">
            {resourceLinks.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-2 bg-gray-50 border rounded-md">
                <div className="flex items-center space-x-2 overflow-hidden">
                  {getLinkTypeIcon(link.url)}
                  <span className="text-sm text-gray-800 truncate">{link.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {getLinkTypeName(link.url)}
                  </Badge>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onRemoveResourceLink(lessonId, link.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
