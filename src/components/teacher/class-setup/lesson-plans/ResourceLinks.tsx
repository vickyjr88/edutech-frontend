
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Link, Trash2, ExternalLink } from "lucide-react";

export interface ResourceLink {
  id: string;
  title: string;
  url: string;
}

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
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  
  const handleAddLink = () => {
    if (newLinkTitle.trim() && newLinkUrl.trim()) {
      onAddResourceLink(lessonId, newLinkTitle.trim(), newLinkUrl.trim());
      setNewLinkTitle("");
      setNewLinkUrl("");
    }
  };
  
  return (
    <div className="space-y-3 border-t pt-4 mt-4">
      <Label>External Resource Links</Label>
      <p className="text-xs text-gray-500 mb-1">
        Add links to videos, articles, online tools, or other web resources that will enhance the learning experience
      </p>
      
      {/* Form to add new resource link */}
      <div className="grid grid-cols-1 gap-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Input
              value={newLinkTitle}
              onChange={(e) => setNewLinkTitle(e.target.value)}
              placeholder="Resource title or description"
              icon={<Link className="h-4 w-4" />}
            />
          </div>
          <div className="flex-1">
            <Input
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              placeholder="https://example.com/resource"
              icon={<ExternalLink className="h-4 w-4" />}
            />
          </div>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleAddLink}
            disabled={!newLinkTitle.trim() || !newLinkUrl.trim()}
            className="w-full sm:w-auto"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Link
          </Button>
        </div>
      </div>
      
      {/* Display existing resource links */}
      {resourceLinks && resourceLinks.length > 0 && (
        <div className="mt-3 space-y-2">
          <Label className="text-xs text-gray-500">Added Resources ({resourceLinks.length})</Label>
          <div className="grid grid-cols-1 gap-2">
            {resourceLinks.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-2 bg-gray-50 border rounded-md">
                <div className="flex items-center space-x-2 overflow-hidden">
                  <Link className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{link.title}</p>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-blue-600 hover:underline truncate block"
                    >
                      {link.url}
                    </a>
                  </div>
                </div>
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
