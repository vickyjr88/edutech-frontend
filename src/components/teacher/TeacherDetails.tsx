
import { TeacherHeader, TeacherTabs } from "./profile";
import TeacherStats from "./TeacherStats";

interface TeacherDetailsProps {
  teacher: {
    id: string;
    name: string;
    imageSrc: string;
    bio: string;
    position: string;
    school?: string;
    schoolStatus?: "active" | "past";
    rating: number;
    ratingCount: number;
    videoProfileUrl?: string;
    education: Array<{
      id: string;
      institution: string;
      degree: string;
      dates: string;
    }>;
    experience: Array<{
      id: string;
      position: string;
      institution: string;
      dates: string;
      description?: string;
    }>;
    methodologies: Array<{
      id: string;
      methodology: string;
      description: string;
      is_certified: boolean;
    }>;
    strategies: Array<{
      id: string;
      strategy: string;
      description: string;
      is_certified: boolean;
    }>;
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
    classes: Array<{
      id: string;
      title: string;
      subject: string;
      level: string;
      rating?: number;
      imageSrc?: string;
    }>;
    reviews?: Array<{
      id: string;
      reviewer: string;
      reviewerImage?: string;
      rating: number;
      comment: string;
      date: string;
    }>;
    technicalSkills?: Array<{
      id: string;
      skill: string;
      description?: string;
      level?: string;
    }>;
  }
}

export default function TeacherDetails({ teacher }: TeacherDetailsProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <TeacherHeader teacher={teacher} />
      <TeacherStats teacher={teacher} />
      <div id="teacher-tabs">
        <TeacherTabs teacher={teacher} />
      </div>
    </div>
  );
}
