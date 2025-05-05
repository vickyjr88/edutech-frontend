import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { teacherService } from "@/integrations/api/services/teacher.service";
import {
  Award,
  Book,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle,
  Circle,
  Download,
  Edit,
  Globe,
  GraduationCap,
  Heart,
  Languages,
  Mail,
  MapPin,
  Phone,
  Star,
  User,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

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
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
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

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-opacity-10 bg-gray-900/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="relative">
                <Avatar className="w-28 h-28 md:w-40 md:h-40 border-4 border-white shadow-lg">
                  <AvatarImage src={profile.profileImage} alt={profile.user.fullName} />
                  <AvatarFallback className="text-3xl bg-white text-blue-600">
                    {getInitials(profile.user.fullName)}
                  </AvatarFallback>
                </Avatar>
                {profile.isProfileComplete && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-full">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{profile.user.fullName}</h1>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                {profile.isBackgroundChecked && (
                  <Badge variant="secondary" className="bg-blue-500/20 text-white border-blue-400">
                    <CheckCircle className="h-3.5 w-3.5 mr-1" /> Background Checked
                  </Badge>
                )}
                {profile.isIdVerified && (
                  <Badge variant="secondary" className="bg-green-500/20 text-white border-green-400">
                    <CheckCircle className="h-3.5 w-3.5 mr-1" /> ID Verified
                  </Badge>
                )}
                {profile.isZoomConnected && (
                  <Badge variant="secondary" className="bg-indigo-500/20 text-white border-indigo-400">
                    <Video className="h-3.5 w-3.5 mr-1" /> Zoom Connected
                  </Badge>
                )}
                {profile.rating && (
                  <Badge variant="secondary" className="bg-yellow-500/20 text-white border-yellow-400">
                    <Star className="h-3.5 w-3.5 mr-1 fill-yellow-300 text-yellow-300" /> {profile.rating.toFixed(1)} ({profile.reviewCount || 0} reviews)
                  </Badge>
                )}
              </div>
              
              <p className="text-lg text-blue-100 max-w-2xl">
                {profile.user.bio || "Professional teacher dedicated to providing quality education and fostering a positive learning environment."}
              </p>

              <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                {profile.user.email && (
                  <a href={`mailto:${profile.user.email}`} className="flex items-center gap-1.5 text-white hover:text-blue-100 transition">
                    <Mail className="h-4 w-4" /> {profile.user.email}
                  </a>
                )}
                {profile.user.phoneNumber && (
                  <a href={`tel:${profile.user.phoneNumber}`} className="flex items-center gap-1.5 text-white hover:text-blue-100 transition">
                    <Phone className="h-4 w-4" /> {profile.user.phoneNumber}
                  </a>
                )}
                {profile.location?.city && (
                  <span className="flex items-center gap-1.5 text-white">
                    <MapPin className="h-4 w-4" /> {profile.location.city}{profile.location.county ? `, ${profile.location.county}` : ''}
                  </span>
                )}
              </div>
            </div>

            <div className="hidden lg:block">
              {profile.introVideoUrl ? (
                <Button variant="default" className="bg-white text-blue-600 hover:bg-blue-50">
                  <Video className="mr-2 h-4 w-4" />
                  Watch Intro Video
                </Button>
              ) : (
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-2xl mx-auto mb-8 grid grid-cols-5 h-auto p-1">
            <TabsTrigger value="overview" className="py-2.5">Overview</TabsTrigger>
            <TabsTrigger value="education" className="py-2.5">Education</TabsTrigger>
            <TabsTrigger value="experience" className="py-2.5">Experience</TabsTrigger>
            <TabsTrigger value="teaching" className="py-2.5">Teaching</TabsTrigger>
            <TabsTrigger value="skills" className="py-2.5">Skills</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left column */}
              <div className="lg:col-span-2 space-y-8">
                {/* About Me */}
                <Card className="overflow-hidden border-none shadow-md">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-4 px-6">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <User className="mr-2 h-5 w-5" /> About Me
                    </h2>
                  </div>
                  <CardContent className="pt-6">
                    <p className="text-gray-700 leading-relaxed">
                      {profile.user.bio || "No bio provided yet."}
                    </p>
                  </CardContent>
                </Card>

                {/* Education Highlights */}
                <Card className="overflow-hidden border-none shadow-md">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 py-4 px-6">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <GraduationCap className="mr-2 h-5 w-5" /> Education
                    </h2>
                  </div>
                  <CardContent className="pt-6">
                    {profile.education && profile.education.length > 0 ? (
                      <div className="space-y-6">
                        {profile.education.slice(0, 2).map((edu) => (
                          <div key={edu.id} className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                              <GraduationCap className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">{edu.degree} in {edu.field}</h3>
                              <p className="text-gray-600">{edu.institution}</p>
                              <p className="text-sm text-gray-500">{edu.startYear} - {edu.endYear}</p>
                              {edu.description && <p className="text-gray-600 mt-1">{edu.description}</p>}
                            </div>
                          </div>
                        ))}
                        {profile.education.length > 2 && (
                          <Button variant="ghost" onClick={() => setActiveTab("education")} className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 w-full">
                            View {profile.education.length - 2} more education entries
                          </Button>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No education history provided yet.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Experience Highlights */}
                <Card className="overflow-hidden border-none shadow-md">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 py-4 px-6">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <Briefcase className="mr-2 h-5 w-5" /> Experience
                    </h2>
                  </div>
                  <CardContent className="pt-6">
                    {profile.experience && profile.experience.length > 0 ? (
                      <div className="space-y-6">
                        {profile.experience.slice(0, 2).map((exp) => (
                          <div key={exp.id} className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                              <Briefcase className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-gray-800">{exp.position}</h3>
                                  <p className="text-gray-600">{exp.company}</p>
                                </div>
                                <div className="text-right">
                                  <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full">
                                    {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate || '')}
                                  </span>
                                </div>
                              </div>
                              {exp.description && <p className="text-gray-600 mt-1">{exp.description}</p>}
                            </div>
                          </div>
                        ))}
                        {profile.experience.length > 2 && (
                          <Button variant="ghost" onClick={() => setActiveTab("experience")} className="text-green-600 hover:text-green-700 hover:bg-green-50 w-full">
                            View {profile.experience.length - 2} more experience entries
                          </Button>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No experience history provided yet.</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right column */}
              <div className="space-y-8">
                {/* Teaching subjects */}
                <Card className="overflow-hidden border-none shadow-md">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 py-4 px-6">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <BookOpen className="mr-2 h-5 w-5" /> Teaching Subjects
                    </h2>
                  </div>
                  <CardContent className="pt-6">
                    {(profile.subjects && profile.subjects.length > 0) ? (
                      <>
                        {academicSubjects.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Academic</h3>
                            <div className="flex flex-wrap gap-2">
                              {academicSubjects.map(subject => (
                                <Badge key={subject.id} className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">
                                  {subject.name} - {subject.level}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {extracurricularSubjects.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Extracurricular</h3>
                            <div className="flex flex-wrap gap-2">
                              {extracurricularSubjects.map(subject => (
                                <Badge key={subject.id} className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-none">
                                  {subject.name} - {subject.level}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-500 italic">No teaching subjects specified yet.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Teaching Methods */}
                <Card className="overflow-hidden border-none shadow-md">
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 py-4 px-6">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <Zap className="mr-2 h-5 w-5" /> Teaching Methods
                    </h2>
                  </div>
                  <CardContent className="pt-6">
                    {(profile.methodologies && profile.methodologies.length > 0) || 
                     (profile.strategies && profile.strategies.length > 0) ? (
                      <div className="space-y-4">
                        {profile.methodologies && profile.methodologies.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Methodologies</h3>
                            <div className="flex flex-wrap gap-2">
                              {profile.methodologies.map(method => (
                                <Badge key={method.id} className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-none">
                                  {method.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {profile.strategies && profile.strategies.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Strategies</h3>
                            <div className="flex flex-wrap gap-2">
                              {profile.strategies.map(strategy => (
                                <Badge key={strategy.id} className="bg-cyan-100 text-cyan-800 hover:bg-cyan-200 border-none">
                                  {strategy.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No teaching methods specified yet.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Languages */}
                <Card className="overflow-hidden border-none shadow-md">
                  <div className="bg-gradient-to-r from-pink-500 to-pink-600 py-4 px-6">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <Languages className="mr-2 h-5 w-5" /> Languages
                    </h2>
                  </div>
                  <CardContent className="pt-6">
                    {profile.languages && profile.languages.length > 0 ? (
                      <div className="space-y-3">
                        {profile.languages.map(lang => (
                          <div key={lang.id} className="flex justify-between items-center">
                            <span className="font-medium text-gray-700">{lang.language}</span>
                            <Badge variant="outline" className="bg-transparent border-pink-200 text-pink-700">
                              {lang.proficiency}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No languages specified yet.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Certifications */}
                <Card className="overflow-hidden border-none shadow-md">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 py-4 px-6">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <Award className="mr-2 h-5 w-5" /> Certifications
                    </h2>
                  </div>
                  <CardContent className="pt-6">
                    {profile.certifications && profile.certifications.length > 0 ? (
                      <div className="space-y-4">
                        {profile.certifications.map(cert => (
                          <div key={cert.id} className="border-l-4 border-emerald-500 pl-4 py-1">
                            <h3 className="font-medium text-gray-800">{cert.name}</h3>
                            <p className="text-sm text-gray-600">
                              {cert.issuingOrganization ? `${cert.issuingOrganization}` : ''}
                              {cert.issuingOrganization && cert.issueDate && ' • '}
                              {cert.issueDate ? formatDate(cert.issueDate) : ''}
                            </p>
                            {cert.description && <p className="text-sm text-gray-600 mt-1">{cert.description}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No certifications added yet.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Availability */}
                <Card className="overflow-hidden border-none shadow-md">
                  <div className="bg-gradient-to-r from-rose-500 to-rose-600 py-4 px-6">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <Calendar className="mr-2 h-5 w-5" /> Availability
                    </h2>
                  </div>
                  <CardContent className="pt-6">
                    {profile.availability ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-800 mb-2">Days</h3>
                          <div className="flex flex-wrap gap-2">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                              <Badge key={`day-${index}`} className={
                                profile.availability?.days.includes(day) 
                                  ? "bg-rose-100 text-rose-800 hover:bg-rose-200 border-none" 
                                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 border-none opacity-50"
                              }>
                                {day}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium text-gray-800 mb-2">Times</h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={
                              profile.availability?.times?.morning 
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-200 border-none" 
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200 border-none opacity-50"
                            }>
                              Morning
                            </Badge>
                            <Badge className={
                              profile.availability?.times?.afternoon 
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-200 border-none" 
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200 border-none opacity-50"
                            }>
                              Afternoon
                            </Badge>
                            <Badge className={
                              profile.availability?.times?.evening 
                                ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-none" 
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200 border-none opacity-50"
                            }>
                              Evening
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No availability information yet.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education">
            <Card className="border-none shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 py-5 px-6">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5" /> Education History
                </h2>
              </div>
              <CardContent className="p-0">
                {profile.education && profile.education.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {profile.education.map((edu) => (
                      <div key={edu.id} className="p-6 hover:bg-purple-50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                              <GraduationCap className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800 text-lg">{edu.degree} in {edu.field}</h3>
                              <p className="text-gray-600 font-medium">{edu.institution}</p>
                              {edu.description && (
                                <p className="text-gray-600 mt-2 max-w-2xl">{edu.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="md:text-right">
                            <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-0.5 text-sm font-medium text-purple-800">
                              {edu.startYear} - {edu.endYear}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <GraduationCap className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Education History Yet</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      Your educational background helps students understand your qualifications.
                    </p>
                    <Button onClick={() => navigate("/teacher-profile-setup")}>
                      Add Education
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience">
            <Card className="border-none shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 py-5 px-6">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" /> Work Experience
                </h2>
              </div>
              <CardContent className="p-0">
                {profile.experience && profile.experience.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {profile.experience.map((exp) => (
                      <div key={exp.id} className="p-6 hover:bg-green-50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <Briefcase className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                              <div>
                                <h3 className="font-semibold text-gray-800 text-lg">{exp.position}</h3>
                                <p className="text-gray-600 font-medium">
                                  {exp.company}
                                  {exp.location && ` • ${exp.location}`}
                                </p>
                              </div>
                              <div className="md:text-right mt-1 md:mt-0">
                                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                  {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate || '')}
                                </span>
                                {exp.isCurrent && (
                                  <Badge className="ml-2 bg-blue-100 text-blue-800 border-none">Current</Badge>
                                )}
                              </div>
                            </div>
                            {exp.description && (
                              <p className="text-gray-600 mt-2 max-w-3xl">{exp.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <Briefcase className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Work Experience Yet</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      Your teaching experience helps build trust with potential students.
                    </p>
                    <Button onClick={() => navigate("/teacher-profile-setup")}>
                      Add Experience
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teaching Tab */}
          <TabsContent value="teaching">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Subjects */}
              <Card className="border-none shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 py-5 px-6">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" /> Teaching Subjects
                  </h2>
                </div>
                <CardContent className="p-6">
                  {profile.subjects && profile.subjects.length > 0 ? (
                    <div className="space-y-6">
                      {academicSubjects.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                            <Book className="mr-2 h-5 w-5 text-amber-500" /> Academic Subjects
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {academicSubjects.map(subject => (
                              <div key={subject.id} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <h4 className="font-medium text-amber-800">{subject.name}</h4>
                                <p className="text-amber-700 text-sm">Level: {subject.level}</p>
                                {subject.description && (
                                  <p className="text-gray-600 text-sm mt-2">{subject.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {extracurricularSubjects.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                            <Heart className="mr-2 h-5 w-5 text-rose-500" /> Extracurricular Subjects
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {extracurricularSubjects.map(subject => (
                              <div key={subject.id} className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                                <h4 className="font-medium text-rose-800">{subject.name}</h4>
                                <p className="text-rose-700 text-sm">Level: {subject.level}</p>
                                {subject.description && (
                                  <p className="text-gray-600 text-sm mt-2">{subject.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No Subjects Added Yet</h3>
                      <p className="text-gray-500 max-w-md mx-auto mb-6">
                        Add subjects you teach to help students find your profile.
                      </p>
                      <Button onClick={() => navigate("/teacher-profile-setup")}>
                        Add Subjects
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Teaching Methods */}
              <div className="space-y-8">
                <Card className="border-none shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 py-5 px-6">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <Zap className="mr-2 h-5 w-5" /> Teaching Methodologies
                    </h2>
                  </div>
                  <CardContent className="p-6">
                    {profile.methodologies && profile.methodologies.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {profile.methodologies.map(method => (
                          <div key={method.id} className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                            <h4 className="font-medium text-indigo-800">{method.name}</h4>
                            {method.description && (
                              <p className="text-gray-600 text-sm mt-1">{method.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500">No teaching methodologies specified yet.</p>
                        <Button variant="outline" onClick={() => navigate("/teacher-profile-setup")} className="mt-3">
                          Add Methodologies
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 py-5 px-6">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <Zap className="mr-2 h-5 w-5" /> Teaching Strategies
                    </h2>
                  </div>
                  <CardContent className="p-6">
                    {profile.strategies && profile.strategies.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {profile.strategies.map(strategy => (
                          <div key={strategy.id} className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                            <h4 className="font-medium text-cyan-800">{strategy.name}</h4>
                            {strategy.description && (
                              <p className="text-gray-600 text-sm mt-1">{strategy.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500">No teaching strategies specified yet.</p>
                        <Button variant="outline" onClick={() => navigate("/teacher-profile-setup")} className="mt-3">
                          Add Strategies
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Availability */}
                <Card className="border-none shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-rose-500 to-rose-600 py-5 px-6">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <Calendar className="mr-2 h-5 w-5" /> Availability
                    </h2>
                  </div>
                  <CardContent className="p-6">
                    {profile.availability ? (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-800 mb-3">Available Days</h3>
                          <div className="grid grid-cols-7 gap-2">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
                              const isAvailable = profile.availability?.days.includes(day);
                              return (
                                <div key={`calendar-day-${index}`} className={`rounded-lg p-3 text-center ${
                                  isAvailable ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-400'
                                }`}>
                                  <div className="text-sm">{day.slice(0, 3)}</div>
                                  <div className="mt-1">
                                    {isAvailable ? 
                                      <CheckCircle className="h-5 w-5 mx-auto text-rose-500" /> : 
                                      <Circle className="h-5 w-5 mx-auto text-gray-300" />
                                    }
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium text-gray-800 mb-3">Available Times</h3>
                          <div className="grid grid-cols-3 gap-4">
                            <div className={`rounded-lg p-4 text-center ${
                              profile.availability?.times?.morning ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-400'
                            }`}>
                              <div className="font-medium">Morning</div>
                              <div className="text-sm">8:00 AM - 12:00 PM</div>
                              <div className="mt-1">
                                {profile.availability?.times?.morning ? 
                                  <CheckCircle className="h-5 w-5 mx-auto text-amber-500" /> : 
                                  <Circle className="h-5 w-5 mx-auto text-gray-300" />
                                }
                              </div>
                            </div>
                            <div className={`rounded-lg p-4 text-center ${
                              profile.availability?.times?.afternoon ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'
                            }`}>
                              <div className="font-medium">Afternoon</div>
                              <div className="text-sm">12:00 PM - 5:00 PM</div>
                              <div className="mt-1">
                                {profile.availability?.times?.afternoon ? 
                                  <CheckCircle className="h-5 w-5 mx-auto text-blue-500" /> : 
                                  <Circle className="h-5 w-5 mx-auto text-gray-300" />
                                }
                              </div>
                            </div>
                            <div className={`rounded-lg p-4 text-center ${
                              profile.availability?.times?.evening ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-400'
                            }`}>
                              <div className="font-medium">Evening</div>
                              <div className="text-sm">5:00 PM - 9:00 PM</div>
                              <div className="mt-1">
                                {profile.availability?.times?.evening ? 
                                  <CheckCircle className="h-5 w-5 mx-auto text-indigo-500" /> : 
                                  <Circle className="h-5 w-5 mx-auto text-gray-300" />
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No Availability Set</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                          Set your availability to let students know when you can teach.
                        </p>
                        <Button onClick={() => navigate("/teacher-profile-setup")}>
                          Set Availability
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Languages */}
              <Card className="border-none shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-pink-500 to-pink-600 py-5 px-6">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <Languages className="mr-2 h-5 w-5" /> Languages
                  </h2>
                </div>
                <CardContent className="p-6">
                  {profile.languages && profile.languages.length > 0 ? (
                    <div className="space-y-4">
                      {profile.languages.map(lang => (
                        <div key={lang.id} className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-pink-800">{lang.language}</h4>
                            <Badge className="bg-white text-pink-600 border border-pink-300">
                              {lang.proficiency}
                            </Badge>
                          </div>
                          <div className="mt-2">
                            <Progress 
                              value={
                                lang.proficiency === 'Native' ? 100 :
                                lang.proficiency === 'Fluent' ? 90 :
                                lang.proficiency === 'Advanced' ? 75 :
                                lang.proficiency === 'Intermediate' ? 50 :
                                25 // Beginner
                              } 
                              className="h-2 bg-pink-100"
                              indicatorClassName="bg-pink-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Languages className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No Languages Added</h3>
                      <p className="text-gray-500 max-w-md mx-auto mb-6">
                        Adding languages you speak helps students find teachers who can communicate with them effectively.
                      </p>
                      <Button onClick={() => navigate("/teacher-profile-setup")}>
                        Add Languages
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Technical Skills */}
              <Card className="border-none shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-5 px-6">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <Zap className="mr-2 h-5 w-5" /> Technical Skills
                  </h2>
                </div>
                <CardContent className="p-6">
                  {profile.skills && profile.skills.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {profile.skills.map(skill => (
                        <div key={skill.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-medium text-blue-800">{skill.name}</h4>
                          {skill.level && (
                            <p className="text-blue-600 text-sm mt-1">Level: {skill.level}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Zap className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No Technical Skills Added</h3>
                      <p className="text-gray-500 max-w-md mx-auto mb-6">
                        Technical skills show your proficiency with educational technologies.
                      </p>
                      <Button onClick={() => navigate("/teacher-profile-setup")}>
                        Add Technical Skills
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card className="border-none shadow-lg overflow-hidden md:col-span-2">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 py-5 px-6">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <Award className="mr-2 h-5 w-5" /> Certifications & Credentials
                  </h2>
                </div>
                <CardContent className="p-6">
                  {profile.certifications && profile.certifications.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {profile.certifications.map(cert => (
                        <div key={cert.id} className="bg-emerald-50 border border-emerald-200 rounded-lg p-5">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                              <Award className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium text-emerald-800">{cert.name}</h4>
                              {cert.issuingOrganization && (
                                <p className="text-emerald-600 text-sm">{cert.issuingOrganization}</p>
                              )}
                              {cert.issueDate && (
                                <p className="text-gray-500 text-sm mt-1">Issued: {formatDate(cert.issueDate)}</p>
                              )}
                              {cert.expirationDate && (
                                <p className="text-gray-500 text-sm">Expires: {formatDate(cert.expirationDate)}</p>
                              )}
                              {cert.description && (
                                <p className="text-gray-600 text-sm mt-2">{cert.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Award className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No Certifications Added</h3>
                      <p className="text-gray-500 max-w-md mx-auto mb-6">
                        Certifications help establish your credentials and expertise as a teacher.
                      </p>
                      <Button onClick={() => navigate("/teacher-profile-setup")}>
                        Add Certifications
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer with actions */}
      <div className="bg-white border-t py-6 mt-10">
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