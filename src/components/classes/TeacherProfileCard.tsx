
import { User, MessageSquare, Star, Video, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WhatsAppMessageDialog } from "@/components/teacher/profile";

interface TeacherProfileCardProps {
  teacher: {
    name: string;
    imageSrc?: string;
    subject: string;
    experience?: string;
    rating?: number;
    bio?: string;
    videoProfileUrl?: string;
    education?: Array<{
      id: string;
      institution: string;
      degree: string;
      dates: string;
    }>;
  };
}

const TeacherProfileCard = ({ teacher }: TeacherProfileCardProps) => {
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);

  // Generate a URL-friendly name for the teacher
  const teacherUrlName = teacher.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-kidato-blue" />
          Meet Your Teacher
        </h2>
        {teacher.rating && (
          <div className="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{teacher.rating}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
          {teacher.imageSrc ? (
            <img 
              src={teacher.imageSrc} 
              alt={teacher.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-kidato-light-blue">
              <User className="h-10 w-10 text-kidato-blue" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="mb-2">
            <Link to={`/teacher/${teacherUrlName}`} className="hover:underline">
              <h3 className="text-lg font-medium text-gray-900">{teacher.name}</h3>
            </Link>
            <p className="text-gray-600">Expert in {teacher.subject}</p>
          </div>
          
          {teacher.experience && (
            <p className="text-sm text-gray-500 mb-2">{teacher.experience}</p>
          )}
          
          {teacher.bio && (
            <p className="text-gray-700 mb-4">{teacher.bio}</p>
          )}
          
          {teacher.education && teacher.education.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Education</h4>
              <ul className="text-sm text-gray-600">
                {teacher.education.slice(0, 1).map(edu => (
                  <li key={edu.id}>{edu.degree} - {edu.institution}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex flex-wrap gap-3">
            <WhatsAppMessageDialog teacherName={teacher.name} />

            {teacher.videoProfileUrl && (
              <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-kidato-blue text-kidato-blue hover:bg-kidato-blue/10">
                    <Video className="mr-2 h-4 w-4" />
                    Watch Video Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
                  <DialogHeader className="p-6 pb-0">
                    <DialogTitle>{teacher.name}'s Video Profile</DialogTitle>
                  </DialogHeader>
                  <div className="aspect-video w-full">
                    <iframe
                      src={teacher.videoProfileUrl}
                      title={`${teacher.name}'s video profile`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileCard;
