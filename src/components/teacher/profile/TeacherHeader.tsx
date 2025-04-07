
import { Star, Video, MapPin, BookOpen, School, Laptop } from "lucide-react";
import { WhatsAppMessageDialog } from "./index";
import VideoProfileDialog from "./VideoProfileDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TeacherHeaderProps {
  teacher: {
    name: string;
    imageSrc: string;
    position: string;
    school?: string;
    schoolStatus?: "active" | "past";
    rating: number;
    ratingCount: number;
    videoProfileUrl?: string;
    teachingMode?: "online" | "offline" | "hybrid";
    grades?: string[];
    subjects?: string[];
    curriculum?: string[];
  };
}

export default function TeacherHeader({ teacher }: TeacherHeaderProps) {
  const teachingModeIcon = teacher.teachingMode === "online" 
    ? <Laptop className="w-4 h-4" />
    : <MapPin className="w-4 h-4" />;
  
  const teachingModeText = teacher.teachingMode === "online"
    ? "Online Teacher"
    : teacher.teachingMode === "offline"
      ? "In-person Teacher"
      : "Hybrid Teacher";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Teacher Image */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl bg-gray-200 overflow-hidden">
            <img 
              src={teacher.imageSrc} 
              alt={teacher.name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Teacher Info */}
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{teacher.name}</h1>
              <p className="text-kidato-blue font-medium mt-1 flex items-center gap-1">
                <BookOpen className="inline-block w-4 h-4" />
                {teacher.position}
              </p>
              
              {teacher.school && (
                <p className="text-gray-600 mt-1 flex items-center gap-1">
                  <School className="inline-block w-4 h-4" />
                  {teacher.school}
                  {teacher.schoolStatus && (
                    <span className={`text-xs rounded-full px-2 py-0.5 ml-2 
                      ${teacher.schoolStatus === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                      {teacher.schoolStatus === "active" ? "Current" : "Past"}
                    </span>
                  )}
                </p>
              )}
            </div>

            <div className="flex flex-col xs:flex-row gap-2">
              <WhatsAppMessageDialog teacherName={teacher.name} />
              
              {teacher.videoProfileUrl && (
                <VideoProfileDialog
                  teacherName={teacher.name}
                  videoUrl={teacher.videoProfileUrl}
                />
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="flex items-center gap-1 py-1">
              {teachingModeIcon}
              {teachingModeText}
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1 py-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              {teacher.rating} ({teacher.ratingCount} reviews)
            </Badge>
            
            {teacher.grades && teacher.grades.length > 0 && (
              <Badge variant="outline" className="py-1">
                Grades: {teacher.grades.join(", ")}
              </Badge>
            )}
          </div>

          <div className="space-y-3">
            {teacher.subjects && teacher.subjects.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Subjects</h3>
                <div className="flex flex-wrap gap-1">
                  {teacher.subjects.map((subject, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-kidato-light-blue/40">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {teacher.curriculum && teacher.curriculum.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Curriculum</h3>
                <div className="flex flex-wrap gap-1">
                  {teacher.curriculum.map((item, idx) => (
                    <Badge key={idx} variant="outline" className="border-kidato-blue text-kidato-blue">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
