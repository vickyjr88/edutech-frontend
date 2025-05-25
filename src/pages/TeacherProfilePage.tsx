import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeacherDetails from "@/components/teacher/TeacherDetails";
import TeacherPublicProfile from "@/components/teacher/profile/TeacherPublicProfile";
import { useEffect, useState } from "react";
import { teacherService } from "@/integrations/api/services/teacher.service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Transform API teacher data to a format that works with our components
const transformTeacherData = (apiTeacher: any): any => {
  if (!apiTeacher) return null;

  // Extract subjects from teacher profile
  const extractSubjects = (): string[] => {
    const subjects: string[] = [];
    
    if (Array.isArray(apiTeacher.subjects)) {
      apiTeacher.subjects.forEach((subject: any) => {
        if (subject.subject) {
          subjects.push(subject.subject);
        }
      });
    }
    
    return subjects.length > 0 ? subjects : ["General Education"];
  };

  // Format education data
  const formatEducation = () => {
    if (!apiTeacher.education || !Array.isArray(apiTeacher.education) || apiTeacher.education.length === 0) {
      return [];
    }
    
    return apiTeacher.education.map((edu: any) => ({
      id: edu._id || edu.id || `edu-${Math.random().toString(36).substr(2, 9)}`,
      institution: edu.institutionName || edu.institution || "",
      degree: edu.degree || "",
      dates: edu.startDate 
        ? `${new Date(edu.startDate).getFullYear()} - ${edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}`
        : ""
    }));
  };

  // Format certification data
  const formatCertifications = () => {
    if (!apiTeacher.certifications || !Array.isArray(apiTeacher.certifications) || apiTeacher.certifications.length === 0) {
      return [];
    }
    
    return apiTeacher.certifications.map((cert: any) => ({
      id: cert._id || cert.id || `cert-${Math.random().toString(36).substr(2, 9)}`,
      name: cert.name || "",
      issuer: cert.issuer || "",
      date: cert.issueDate ? new Date(cert.issueDate).getFullYear().toString() : "",
      isVerified: cert.isVerifiable || true
    }));
  };

  // Extract position/role from experience or use a default
  const extractPosition = (): string => {
    if (apiTeacher.experience && Array.isArray(apiTeacher.experience) && apiTeacher.experience.length > 0) {
      return apiTeacher.experience[0].position || "Educator";
    }
    return "Educator";
  };

  // Format location from the location object
  const formatLocation = (): string => {
    if (apiTeacher.location) {
      if (typeof apiTeacher.location === 'string') {
        return apiTeacher.location;
      }
      if (typeof apiTeacher.location === 'object') {
        const loc = apiTeacher.location;
        if (loc.city) {
          return loc.county ? `${loc.city}, ${loc.county}` : loc.city;
        }
      }
    }
    return "Remote";
  };

  // Format methodologies
  const formatMethodologies = () => {
    if (!apiTeacher.methodologies || !Array.isArray(apiTeacher.methodologies)) {
      return [];
    }
    
    return apiTeacher.methodologies.map((methodology: any) => ({
      id: methodology._id || `meth-${Math.random().toString(36).substr(2, 9)}`,
      methodology: methodology.name || "",
      description: methodology.description || "",
      is_certified: methodology.isCertified || false
    }));
  };

  // Format strategies
  const formatStrategies = () => {
    if (!apiTeacher.strategies || !Array.isArray(apiTeacher.strategies)) {
      return [];
    }
    
    return apiTeacher.strategies.map((strategy: any) => ({
      id: strategy._id || `str-${Math.random().toString(36).substr(2, 9)}`,
      strategy: strategy.strategy || "",
      description: strategy.description || "",
      is_certified: strategy.isCertified || false
    }));
  };

  // Format languages
  const formatLanguages = () => {
    if (!apiTeacher.languages || !Array.isArray(apiTeacher.languages)) {
      return [];
    }
    
    return apiTeacher.languages.map((lang: any) => ({
      id: lang._id || `lang-${Math.random().toString(36).substr(2, 9)}`,
      language: lang.name || "",
      description: lang.description || "",
      isCertified: lang.isCertified || false
    }));
  };

  // Format technical skills
  const formatTechnicalSkills = () => {
    if (!apiTeacher.skills || !Array.isArray(apiTeacher.skills)) {
      return [];
    }
    
    return apiTeacher.skills.map((skill: any) => ({
      id: skill._id || `tech-${Math.random().toString(36).substr(2, 9)}`,
      skill: skill.name || "",
      description: skill.description || "",
      level: skill.isCertified ? "Advanced" : "Intermediate"
    }));
  };
  
  // Get the user's full name
  const name = apiTeacher.user?.fullName || "Teacher";
  
  // Format experience for display
  const formatExperience = () => {
    if (!apiTeacher.experience || !Array.isArray(apiTeacher.experience)) {
      return [];
    }
    
    return apiTeacher.experience.map((exp: any) => ({
      id: exp._id || `exp-${Math.random().toString(36).substr(2, 9)}`,
      position: exp.position || "",
      institution: exp.institution || "",
      dates: exp.startDate 
        ? `${new Date(exp.startDate).getFullYear()} - ${exp.isCurrentlyWorking ? 'Present' : (exp.endDate ? new Date(exp.endDate).getFullYear() : '')}`
        : "",
      description: exp.additionalDetails || ""
    }));
  };

  // For now, we'll create mock data for classes and reviews
  const mockClasses = [
    {
      id: "class1",
      title: `${extractSubjects()[0] || "General"} Fundamentals`,
      subject: extractSubjects()[0] || "Education",
      level: "All Grades",
      rating: 4.8,
      imageSrc: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      type: "academic"
    },
    {
      id: "class2",
      title: "Learning Skills Development",
      subject: "Cross-disciplinary",
      level: "All Grades",
      rating: 4.7,
      imageSrc: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      type: "academic"
    }
  ];
  
  const mockReviews = [
    {
      id: "rev1",
      reviewer: "Parent",
      reviewerImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      rating: 5,
      comment: "An exceptional teacher who really cares about the progress of students.",
      date: "Recent"
    }
  ];
  
  return {
    id: apiTeacher._id || "",
    name,
    imageSrc: apiTeacher.user?._signedProfileImage || "https://via.placeholder.com/150",
    bio: apiTeacher.user?.bio || "Experienced educator passionate about student success.",
    position: extractPosition(),
    school: "Kidato Learning Platform",
    schoolStatus: "active",
    rating: apiTeacher.rating || 5.0,
    ratingCount: apiTeacher.totalReviews || 0,
    videoProfileUrl: apiTeacher.introVideoUrl || "",
    education: formatEducation(),
    experience: formatExperience(),
    methodologies: formatMethodologies(),
    strategies: formatStrategies(),
    languages: formatLanguages(),
    certifications: formatCertifications(),
    classes: mockClasses,
    reviews: mockReviews,
    technicalSkills: formatTechnicalSkills(),
    subjects: extractSubjects(),
    location: formatLocation(),
    hourlyRate: "$30-50/hour", // Default rate
    availability: apiTeacher.availability ? 
      `${apiTeacher.availability.days?.join(', ') || 'Flexible'} (${apiTeacher.availability.times?.morning ? 'Morning' : ''}${apiTeacher.availability.times?.afternoon ? ', Afternoon' : ''}${apiTeacher.availability.times?.evening ? ', Evening' : ''})` : 
      "Flexible hours",
    stats: {
      studentsHelped: apiTeacher.totalStudents || 0,
      lessonsDelivered: apiTeacher.totalHours || 0,
      classesCreated: apiTeacher.totalClasses || 0,
      successRate: 98 // Default success rate
    },
    openToWork: true
  };
};

const TeacherProfilePage = () => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!teacherId) {
        setError("No teacher ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error: apiError } = await teacherService.getProfileById(teacherId);
        
        if (apiError) {
          throw new Error(apiError.message || "Failed to load teacher profile");
        }
        
        if (!data) {
          throw new Error("No teacher data found");
        }

        // Transform API data to a format compatible with our components
        const transformedData = transformTeacherData(data);
        setTeacher(transformedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching teacher profile:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setTeacher(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [teacherId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kidato-purple"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16 bg-gray-50">
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {teacher && (
          <TeacherPublicProfile teacher={teacher} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TeacherProfilePage;
