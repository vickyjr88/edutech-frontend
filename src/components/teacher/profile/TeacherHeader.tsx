
import { Star, Check, Globe } from "lucide-react";
import { Award, BookOpen, Monitor, Users, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MethodologyItem, StrategyItem } from "../professional-profile";
import MessageTeacherDialog from "./MessageTeacherDialog";
import VideoProfileDialog from "./VideoProfileDialog";

const CertificateIcon = Award;

interface TeacherHeaderProps {
  teacher: {
    name: string;
    imageSrc: string;
    position: string;
    school?: string;
    schoolStatus?: "active" | "past";
    rating: number;
    ratingCount: number;
    bio: string;
    videoProfileUrl?: string;
    methodologies: MethodologyItem[];
    strategies: StrategyItem[];
    languages: Array<{
      id: string;
      language: string;
      description?: string;
      isCertified?: boolean;
    }>;
    certifications: Array<{
      id: string;
      name: string;
      issuer: string;
      date: string;
      isVerified: boolean;
    }>;
    // Adding optional teaching info fields
    teachingMode?: "online" | "offline" | "hybrid";
    grades?: string[];
    subjects?: string[];
    curriculum?: string[];
  }
}

export default function TeacherHeader({ teacher }: TeacherHeaderProps) {
  // Default teaching info if not provided
  const teachingInfo = {
    mode: teacher.teachingMode || "hybrid",
    grades: teacher.grades || ["Grade 6-8", "Grade 9-12"],
    subjects: teacher.subjects || ["Science", "Mathematics"],
    curriculum: teacher.curriculum || ["National Curriculum", "IB", "Cambridge"]
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
      <div className="bg-kidato-blue/10 p-8">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white relative">
            <img 
              src={teacher.imageSrc} 
              alt={teacher.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 right-0 bg-kidato-blue text-white p-1 rounded-full">
              <Check className="h-4 w-4" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{teacher.name}</h1>
            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start mb-3">
              <p className="text-lg text-kidato-blue font-medium">{teacher.position}</p>
              {teacher.school && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  <span>{teacher.school}</span>
                  {teacher.schoolStatus && (
                    <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                      teacher.schoolStatus === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {teacher.schoolStatus === 'active' ? 'Current' : 'Past'}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {/* New row with teaching information */}
            <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mb-4">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-indigo-50 text-indigo-700">
                <Monitor className="h-4 w-4" />
                <span>
                  {teachingInfo.mode === "online" ? "Online" : 
                   teachingInfo.mode === "offline" ? "In-person" : 
                   "Online & In-person"}
                </span>
              </div>
              
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-teal-50 text-teal-700">
                <GraduationCap className="h-4 w-4" />
                <span>{teachingInfo.grades.join(", ")}</span>
              </div>
              
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-amber-50 text-amber-700">
                <BookOpen className="h-4 w-4" />
                <span>{teachingInfo.subjects.join(", ")}</span>
              </div>
              
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-purple-50 text-purple-700">
                <Users className="h-4 w-4" />
                <span>{teachingInfo.curriculum.join(", ")}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-6">
              <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{teacher.rating}</span>
                <span className="text-gray-500 text-sm">({teacher.ratingCount} reviews)</span>
              </div>
              
              {teacher.languages.length > 0 && (
                <div className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full">
                  <Globe className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{teacher.languages.length} languages</span>
                </div>
              )}
              
              {teacher.certifications.length > 0 && (
                <div className="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full">
                  <CertificateIcon className="h-4 w-4 text-green-500" />
                  <span className="font-medium">{teacher.certifications.filter(c => c.isVerified).length} verified certificates</span>
                </div>
              )}
            </div>
            
            <p className="text-gray-700 mb-6">{teacher.bio}</p>
            
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {teacher.methodologies.map(methodology => (
                  <Badge 
                    key={methodology.id} 
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                  >
                    {methodology.methodology}
                  </Badge>
                ))}
                {teacher.strategies.map(strategy => (
                  <Badge 
                    key={strategy.id} 
                    className="bg-green-100 text-green-800 hover:bg-green-200"
                  >
                    {strategy.strategy}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <MessageTeacherDialog teacherName={teacher.name} />
              
              {teacher.videoProfileUrl && (
                <VideoProfileDialog 
                  teacherName={teacher.name}
                  videoUrl={teacher.videoProfileUrl}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
