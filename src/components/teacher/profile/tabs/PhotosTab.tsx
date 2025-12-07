import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Image } from "lucide-react";
import { teacherGalleryService } from '@/integrations/api/services/teacher-gallery.service';

interface PhotosTabProps {
  teacher: any;
}

export default function PhotosTab({ teacher }: PhotosTabProps) {
  const [photos, setPhotos] = useState<any[]>([]);

  useEffect(() => {
    if (teacher?.id) {
      loadPhotos();
    }
  }, [teacher]);

  const loadPhotos = async () => {
    try {
      const response = await teacherGalleryService.getPhotos(teacher.id);
      if (response.data) setPhotos(response.data);
    } catch (error) {
      console.error('Failed to load photos:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Photos</h2>
      
      {photos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo: any, index: number) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium">{photo.title}</h3>
                <p className="text-sm text-gray-500">{photo.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="rounded-full bg-gray-100 p-6 mb-4">
            <Image className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium">No photos yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mt-2">
            This teacher hasn't uploaded any photos yet. Check back later for updates.
          </p>
        </div>
      )}
    </div>
  );
}
