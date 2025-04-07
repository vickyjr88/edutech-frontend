
import { Card, CardContent } from "@/components/ui/card";
import { Image } from "lucide-react";

interface PhotosTabProps {
  teacher: any;
}

export default function PhotosTab({ teacher }: PhotosTabProps) {
  // Mock data - in a real application, this would come from the teacher's profile
  const photos = teacher.photos || [
    {
      id: "photo1",
      url: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Classroom Session",
      description: "Engaging with students during a science demonstration"
    },
    {
      id: "photo2",
      url: "https://images.unsplash.com/photo-1513258496099-48168024aec0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Lab Work",
      description: "Students working on chemistry experiments"
    },
    {
      id: "photo3",
      url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Field Trip",
      description: "Educational visit to the local science museum"
    },
    {
      id: "photo4",
      url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Group Project",
      description: "Students collaborating on their term projects"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Photos</h2>
      
      {photos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo: any) => (
            <Card key={photo.id} className="overflow-hidden">
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
