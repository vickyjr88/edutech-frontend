import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { teacherService } from "@/integrations/api/services/teacher.service";
import TeacherPublicProfile from "@/components/teacher/profile/TeacherPublicProfile";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Type definitions
interface TeacherProfile {
  id: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    alternativePhoneNumber?: string;
    bio?: string;
    avatar?: string;
  };
  profileImage?: string;
  location?: {
    address?: string;
    city?: string;
    county?: string;
    postalCode?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  availability?: {
    days: string[];
    times: {
      morning: boolean;
      afternoon: boolean;
      evening: boolean;
    };
  };
  education?: EducationItem[];
  experience?: ExperienceItem[];
  subjects?: SubjectItem[];
  strategies?: StrategyItem[];
  methodologies?: MethodologyItem[];
  languages?: LanguageItem[];
  skills?: SkillItem[];
  certifications?: CertificationItem[];
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    website?: string;
  };
  introVideoUrl?: string;
  isProfileComplete: boolean;
  backgroundCheckFile?: string;
  governmentIdFile?: string;
  isZoomConnected?: boolean;
  isBackgroundChecked?: boolean;
  isIdVerified?: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  description?: string;
}

interface ExperienceItem {
  id: string;
  position: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

interface SubjectItem {
  id: string;
  name: string;
  level: string;
  isAcademic: boolean;
  description?: string;
}

interface StrategyItem {
  id: string;
  name: string;
  description?: string;
}

interface MethodologyItem {
  id: string;
  name: string;
  description?: string;
}

interface LanguageItem {
  id: string;
  language: string;
  proficiency: string;
}

interface SkillItem {
  id: string;
  name: string;
  level?: string;
}

interface CertificationItem {
  id: string;
  name: string;
  issuingOrganization?: string;
  issueDate?: string;
  expirationDate?: string;
  description?: string;
}

const TeacherProfileResume: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [transformedData, setTransformedData] = useState<any>(null);

  // Helper function to safely get year from date string
  const formatYear = (dateStr: string): string => {
    if (!dateStr) return '';
    
    try {
      // If it's already just a year (4 digits), return it as is
      if (/^\d{4}$/.test(dateStr)) return dateStr;
      
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? '' : date.getFullYear().toString();
    } catch (e) {
      console.error('Error parsing date:', dateStr, e);
      return '';
    }
  };

  // Transform the teacher profile data to match TeacherPublicProfile component format
  const transformProfileData = (profile: TeacherProfile) => {
    // Skip if no profile
    if (!profile) return null;

    // Map methodologies to expected format for TeacherAboutSection
    const formattedMethodologies = (profile.methodologies || []).map((method, index) => ({
      id: method.id || `methodology-${index}`, // Fallback to index-based ID if none exists
      methodology: method.name,
      description: method.description || '',
      is_certified: false
    }));

    // Map strategies to expected format for TeacherAboutSection
    const formattedStrategies = (profile.strategies || []).map((strategy, index) => ({
      id: strategy.id || `strategy-${index}`, // Fallback to index-based ID if none exists
      strategy: strategy.name,
      description: strategy.description || '',
      is_certified: false
    }));

    // Map languages to expected format
    const formattedLanguages = (profile.languages || []).map((lang, index) => ({
      id: lang.id || `language-${index}`,
      language: lang.language,
      description: lang.proficiency,
      isCertified: false
    }));

    // Map technical skills
    const technicalSkills = (profile.skills || []).map((skill, index) => ({
      id: skill.id || `skill-${index}`,
      skill: skill.name,
      level: skill.level || 'Intermediate',
      description: ''
    }));

    // Transform profile data into the format expected by TeacherPublicProfile
    // Prepare the profile image URL, ensuring it's a valid path or null
    // Check for _signedProfileImage first, then try other options
    const profileImageUrl = profile.user?._signedProfileImage && profile.user._signedProfileImage.trim() !== '' 
      ? profile.user._signedProfileImage
      : profile.profileImage && profile.profileImage.trim() !== '' 
        ? profile.profileImage 
        : profile.user?.avatar && profile.user.avatar.trim() !== ''
          ? profile.user.avatar
          : null;
          
    console.log("Using profile image URL:", profileImageUrl);
    
    return {
      id: profile.id,
      name: profile.user?.fullName || 'Teacher',
      imageSrc: profileImageUrl,
      coverImage: '/placeholder.svg', // Using a placeholder for cover image
      position: profile.subjects?.filter(s => s.isAcademic)?.map(s => s.name)?.join(', ') || 'Teacher',
      shortBio: profile.user?.bio?.substring(0, 120) + (profile.user?.bio && profile.user.bio.length > 120 ? '...' : '') || 'Professional educator',
      rating: profile.rating || 4.5,
      ratingCount: profile.reviewCount || 0,
      location: profile.location?.city ? 
        `${profile.location.city}${profile.location.county ? `, ${profile.location.county}` : ''}` : 
        'Location not specified',
      openToWork: true,
      hourlyRate: 'Contact for rates',
      availability: profile.availability?.days?.length ? 
        `${profile.availability.days.join(', ')}` : 
        'Contact for availability',
      languages: formattedLanguages,
      stats: {
        studentsHelped: 50, // Default stats since we don't have this data
        lessonsDelivered: 150,
        classesCreated: profile.classCount || 0,
        successRate: 98
      },
      experience: (profile.experience || []).map((exp, index) => ({
        id: exp.id || `exp-${index}`,
        position: exp.position || '',
        institution: exp.company || '',
        dates: exp.isCurrent 
          ? `${formatYear(exp.startDate)} - Present`
          : `${formatYear(exp.startDate)} - ${exp.endDate ? formatYear(exp.endDate) : ''}`,
        description: exp.description || ''
      })),
      
      education: (profile.education || []).map((edu, index) => ({
        id: edu.id || `edu-${index}`,
        degree: `${edu.degree} in ${edu.field}` || '',
        institution: edu.institution || '',
        dates: `${edu.startYear} - ${edu.endYear || ''}`,
        description: edu.description || ''
      })),
      introVideoUrl: profile.introVideoUrl || '',
      videoProfileUrl: '', // Using introVideoUrl instead, keeping this for compatibility
      certifications: (profile.certifications || []).map((cert, index) => ({
        id: cert.id || `cert-${index}`,
        name: cert.name || '',
        issuer: cert.issuingOrganization || 'Unknown Organization',
        date: cert.issueDate 
          ? formatYear(cert.issueDate) 
          : cert.expirationDate 
            ? `Until ${formatYear(cert.expirationDate)}` 
            : 'No date provided',
        isVerified: true
      })),
      strategies: formattedStrategies,
      methodologies: formattedMethodologies,
      technicalSkills: technicalSkills,
      subjects: profile.subjects || [],
      achievements: [], // Empty achievements array
      classes: [], // Empty classes array
      reviews: [], // No reviews data in the current profile
      locationDetails: profile.location?.address || '',
      email: profile.user?.email || '',
      phone: profile.user?.phoneNumber || '',
      bio: profile.user?.bio || '',
      isBackgroundChecked: profile.isBackgroundChecked,
      isIdVerified: profile.isIdVerified,
      isZoomConnected: profile.isZoomConnected,
      // Special flags for the profile resume view
      isOwnProfile: true, // Flag to indicate this is the teacher's own profile
      hideBookingActions: true, // Hide booking and contact buttons
      hideReviewsSection: true, // Hide reviews section
      isProfileResume: true // Flag specifically for the profile resume view
    };
  };

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      if (!user?.teacherId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await teacherService.getProfileById(user.teacherId);
        if (error) {
          console.error("Error fetching teacher profile:", error);
        } else {
          setProfile(data);
          calculateProfileCompletion(data);
          setTransformedData(transformProfileData(data));
        }
      } catch (err) {
        console.error("Error in profile fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherProfile();
  }, [user]);

  const calculateProfileCompletion = (profile: TeacherProfile) => {
    if (!profile) return;
    
    // Define sections and their weights
    const sections = [
      { key: 'user', weight: 15, completed: !!profile.user?.fullName && !!profile.user?.email },
      { key: 'profileImage', weight: 5, completed: !!profile.profileImage },
      { key: 'bio', weight: 10, completed: !!profile.user?.bio && profile.user.bio.length > 20 },
      { key: 'location', weight: 10, completed: !!profile.location?.city && !!profile.location?.address },
      { key: 'availability', weight: 5, completed: !!profile.availability?.days && profile.availability.days.length > 0 },
      { key: 'education', weight: 10, completed: !!profile.education && profile.education.length > 0 },
      { key: 'experience', weight: 10, completed: !!profile.experience && profile.experience.length > 0 },
      { key: 'subjects', weight: 10, completed: !!profile.subjects && profile.subjects.length > 0 },
      { key: 'methodologies', weight: 5, completed: !!profile.methodologies && profile.methodologies.length > 0 },
      { key: 'strategies', weight: 5, completed: !!profile.strategies && profile.strategies.length > 0 },
      { key: 'languages', weight: 5, completed: !!profile.languages && profile.languages.length > 0 },
      { key: 'skills', weight: 5, completed: !!profile.skills && profile.skills.length > 0 },
      { key: 'certifications', weight: 5, completed: !!profile.certifications && profile.certifications.length > 0 },
    ];

    // Calculate percentage
    const totalWeight = sections.reduce((acc, section) => acc + section.weight, 0);
    const completedWeight = sections.reduce((acc, section) => {
      return acc + (section.completed ? section.weight : 0);
    }, 0);

    const percentage = Math.round((completedWeight / totalWeight) * 100);
    setCompletionPercentage(percentage);
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    
    return name
      .split(' ')
      .map(word => word[0] || '')
      .join('')
      .toUpperCase() || "U";
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Present';
    // Check if it's just a year
    if (dateStr.length === 4) return dateStr;
    
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr; // If invalid date, return original
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch (error) {
      return dateStr; // If error parsing date, return original
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-20 w-20 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-40 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Profile Found</h2>
          <p className="text-gray-600 mb-6">
            You haven't completed your teacher profile yet. Create your profile to showcase your skills and experience.
          </p>
          <Button onClick={() => navigate("/teacher-profile-setup")}>
            Create Your Profile
          </Button>
        </div>
      </div>
    );
  }

  // Organize subjects by academic vs extracurricular
  const academicSubjects = profile?.subjects?.filter(s => s.isAcademic) || [];
  const extracurricularSubjects = profile?.subjects?.filter(s => !s.isAcademic) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 to-white pb-16">
      {/* Header with profile completion */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div>
            <Link to="/teacher-dashboard" className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
              ← Back to Dashboard
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600">Profile Completion: {completionPercentage}%</span>
            <Progress 
              value={completionPercentage}
              className="w-32 h-2.5 bg-gray-200"
              indicatorClassName={
                completionPercentage >= 80 ? 'bg-green-500' : 
                completionPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }
            />
          </div>
          <div>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1.5"
              onClick={() => navigate("/teacher-profile-setup")}
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Public teacher profile with our data */}
      {transformedData && (
        <TeacherPublicProfile 
          teacher={transformedData}
          isOwnProfile={true}
          hideBookingActions={true}
          hideReviewsSection={true}
        />
      )}

      {/* Footer with actions and completion tracking */}
      <div className="bg-white border-t py-6 mt-10 sticky bottom-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Progress 
              value={completionPercentage}
              className="w-20 h-2.5 bg-gray-200"
              indicatorClassName={
                completionPercentage >= 80 ? 'bg-green-500' : 
                completionPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }
            />
            <span className="text-sm font-medium text-gray-600">Profile: {completionPercentage}% complete</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/teacher-dashboard")}>
              Back to Dashboard
            </Button>
            <Button onClick={() => navigate("/teacher-profile-setup")}>
              <Edit className="mr-2 h-4 w-4" />
              Update Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileResume;