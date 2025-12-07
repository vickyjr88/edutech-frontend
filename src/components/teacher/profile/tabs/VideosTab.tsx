import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Video } from "lucide-react";
import { teacherVideosService } from '@/integrations/api/services/teacher-videos.service';

interface VideosTabProps {
  teacher: any;
}

export default function VideosTab({ teacher }: VideosTabProps) {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    if (teacher?.id) {
      loadVideos();
    }
  }, [teacher]);

  const loadVideos = async () => {
    try {
      const response = await teacherVideosService.getVideos(teacher.id);
      if (response.data) setVideos(response.data);
    } catch (error) {
      console.error('Failed to load videos:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Videos</h2>
      
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video: any, index: number) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-video">
                <iframe
                  src={video.url}
                  title={video.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium">{video.title}</h3>
                <p className="text-sm text-gray-500">{video.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="rounded-full bg-gray-100 p-6 mb-4">
            <Video className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium">No videos yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mt-2">
            This teacher hasn't uploaded any videos yet. Check back later for updates.
          </p>
        </div>
      )}
    </div>
  );
}
