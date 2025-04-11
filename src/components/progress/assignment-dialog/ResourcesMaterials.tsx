
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, File, Video, ExternalLink } from "lucide-react";
import { Resource, VideoLink } from "./types";

interface ResourcesMaterialsProps {
  resources: Resource[];
  videoLinks: VideoLink[];
}

export const ResourcesMaterials = ({ resources, videoLinks }: ResourcesMaterialsProps) => {
  return (
    <div className="border rounded-md p-4">
      <h3 className="text-sm font-medium mb-3">Resources & Materials</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Column 1: Downloadable resources */}
        {resources.length > 0 && (
          <div>
            <h4 className="text-xs uppercase text-gray-500 font-medium mb-2">Documents</h4>
            <div className="space-y-2">
              {resources.map((resource) => (
                <div key={resource.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md border">
                  <div className="flex items-center">
                    <File className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm">{resource.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{resource.size}</span>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Column 2: Video links */}
        {videoLinks.length > 0 && (
          <div>
            <h4 className="text-xs uppercase text-gray-500 font-medium mb-2">Video Resources</h4>
            <div className="space-y-2">
              {videoLinks.map((video) => (
                <div key={video.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md border">
                  <div className="flex items-center">
                    <Video className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm">{video.title}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex items-center"
                    onClick={() => window.open(video.url, '_blank')}
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    Watch
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
