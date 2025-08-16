import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Home, BookOpen, Users, Calendar, User, Settings, LogOut, Edit, Phone, MapPin, Award, CheckCircle2, CircleDashed, Video, PlusCircle, Star, UserPlus, BookText, School, UsersRound, UserRound, ChevronLeft, Loader2, DollarSign, FileText, Badge, MessageCircle } from "lucide-react";
import { useIntercom } from "@/components/support";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeacherProfileForm from "@/components/teacher/TeacherProfileForm";
import TeacherProfessionalProfileForm from "@/components/teacher/TeacherProfessionalProfileForm";
import ClassSetupForm from "@/components/teacher/ClassSetupForm";
import EnhancedClassSetup from "@/components/teacher/class-setup/EnhancedClassSetup";
import TeacherClassView from "@/components/teacher/class-view/TeacherClassView";
import EnhancedClassDetailPage from "@/components/class-detail/EnhancedClassDetailPage";
import CreateClassForm from "@/components/teacher/CreateClassForm"; // Kept for backwards compatibility
import EnrollStudentsPage from "@/components/teacher/enrollment/EnrollStudentsPage";
import AIStudentsPage from "@/components/teacher/students/AIStudentsPage";
import RecommendedClasses from "@/components/teacher/RecommendedClasses";
import TabbedClassesView from "@/components/teacher/TabbedClassesView";
import TeacherOnboardingDashboard from "@/components/teacher/TeacherOnboardingDashboard";
import TeacherCommandCenter from "@/components/teacher/TeacherCommandCenter";
import { ZoomDashboard } from "@/components/teacher/zoom";
import { GoogleCalendarDashboard } from "@/components/teacher/google-calendar";
import { useAuth } from "@/contexts/AuthContext";
import {teacherService} from "@/integrations/api/services/teacher.service.ts";
import {classService} from "@/integrations/api/services/class.service.ts";
import { useTeacherUpcomingSessions } from "@/hooks/useTeacherUpcomingSessions";
import { useTeacherSummary } from "@/hooks/useTeacherSummary";
import { UpcomingSession } from "@/types/activity";
import { TeacherSummaryResponse } from "@/types/enhanced-classes";

interface TeacherProfileData {
  contact: {
    phone: string;
    email: string;
    alternativePhone: string;
  };
  location: {
    address: string;
    apartment: string;
    houseNumber: string;
    city: string;
    county: string;
    postalCode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  nextOfKin: {
    name: string;
    relationship: string;
    phone: string;
  };
  certification: {
    isCertified: boolean;
    details: string;
    year: string;
    institution: string;
  };
}

// Helper functions for schedule
const getWeekDays = (date: Date = new Date()) => {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day;
  startOfWeek.setDate(diff);
  
  const days = [];
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(startOfWeek.getDate() + i);
    days.push(currentDay);
  }
  return days;
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
};

const getSessionPosition = (startTime: string, duration: number) => {
  const startHour = new Date(startTime).getHours();
  const startMinute = new Date(startTime).getMinutes();
  
  // Calculate position based on 9am start (index 0)
  const baseHour = 9;
  const hourOffset = startHour - baseHour;
  const minuteOffset = startMinute / 60;
  
  const top = (hourOffset + minuteOffset) * 55; // 55px per hour
  const height = (duration / 60) * 55; // duration in minutes
  
  return { top, height };
};

const getSessionColor = (index: number) => {
  const colors = [
    { bg: 'bg-blue-100', border: 'border-blue-200', text: 'text-blue-800', subtext: 'text-blue-700' },
    { bg: 'bg-purple-100', border: 'border-purple-200', text: 'text-purple-800', subtext: 'text-purple-700' },
    { bg: 'bg-green-100', border: 'border-green-200', text: 'text-green-800', subtext: 'text-green-700' },
    { bg: 'bg-amber-100', border: 'border-amber-200', text: 'text-amber-800', subtext: 'text-amber-700' },
    { bg: 'bg-pink-100', border: 'border-pink-200', text: 'text-pink-800', subtext: 'text-pink-700' },
  ];
  return colors[index % colors.length];
};

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { show } = useIntercom();
  
  // Parse the active tab from the URL
  const getTabFromPath = () => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    
    // Check for integration parameters first
    if (searchParams.get('zoom') === 'connected') {
      return "zoom";
    }
    if (searchParams.get('calendar') === 'connected') {
      return "calendar";
    }
    
    if (path.includes('/teacher-dashboard/classes')) {
      if (location.search.includes('create=true')) {
        return "classes";
      }
      return location.search.includes('id=') ? "viewClass" : "classes";
    } else if (path.includes('/teacher-dashboard/students')) {
      return location.search.includes('enroll=true') ? "enrollment" : "students";
    } else if (path.includes('/teacher-dashboard/schedule')) {
      return "schedule";
    } else if (path.includes('/teacher-dashboard/settings')) {
      return "settings";
    } else if (path.includes('/teacher-dashboard/zoom')) {
      return "zoom";
    } else if (path.includes('/teacher-dashboard/calendar')) {
      return "calendar";
    }
    return "dashboard"; // Default tab
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileData, setProfileData] = useState<TeacherProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(location.pathname.includes('/teacher-dashboard/settings') && location.search.includes('edit=true'));
  const [isLoading, setIsLoading] = useState(true);
  const [showProfessionalForm, setShowProfessionalForm] = useState(location.pathname.includes('/teacher-dashboard/settings') && location.search.includes('professional=true'));
  const [hasProfessionalProfile, setHasProfessionalProfile] = useState(false);
  const [showClassSetupForm, setShowClassSetupForm] = useState(location.pathname.includes('/teacher-dashboard/settings') && location.search.includes('class-setup=true'));
  const [hasClassesSetup, setHasClassesSetup] = useState(true);
  const [showCreateClassForm, setShowCreateClassForm] = useState(location.pathname.includes('/teacher-dashboard/classes') && location.search.includes('create=true'));
  const [classes, setClasses] = useState([]);
  
  // Parse class ID from URL query parameters
  const getClassIdFromUrl = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('id');
  };
  
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [activeClassTab, setActiveClassTab] = useState("basic");
  const [showEnrollStudents, setShowEnrollStudents] = useState(location.pathname.includes('/teacher-dashboard/students') && location.search.includes('enroll=true'));
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Teacher data hooks for schedule
  const { upcomingSessions, loading: sessionsLoading, error: sessionsError, refetch: refetchSessions } = useTeacherUpcomingSessions({
    teacherId: user?.teacherId || '',
  });
  
  const { summaryData, loading: summaryLoading, error: summaryError, refetch: refetchSummary } = useTeacherSummary({
    teacherId: user?.teacherId || '',
  });

  // Prepare schedule data
  const weekDays = getWeekDays(currentWeek);
  const weekSessions = upcomingSessions.filter(session => {
    const sessionDate = new Date(session.startTime);
    return weekDays.some(day => 
      day.toDateString() === sessionDate.toDateString()
    );
  });

  // Update the active tab when URL changes
  useEffect(() => {
    setActiveTab(getTabFromPath());
    
    // Load class details from URL if viewing a class
    if (getTabFromPath() === "viewClass") {
      const classId = getClassIdFromUrl();
      if (classId && classes.length > 0) {
        const classItem = classes.find((c: any) => (c._id || c.id) === classId);
        if (classItem) {
          setSelectedClass(classItem);
        }
      }
    }
  }, [location.pathname, location.search, classes]);

  // Load class details on initial render or when URL changes
  useEffect(() => {
    if (getTabFromPath() === "viewClass" && classes.length > 0) {
      const classId = getClassIdFromUrl();
      if (classId) {
        const classItem = classes.find((c: any) => (c._id || c.id) === classId);
        if (classItem) {
          setSelectedClass(classItem);
        }
      }
    }
  }, [classes]);

  useEffect(() => {
    if (user) {
      fetchTeacherProfile();
      fetchTeacherClasses();
      fetchComprehensiveProfile();
    }
  }, [user]);

  // Handle integration connection success
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('zoom') === 'connected') {
      toast({
        title: "Zoom Connected Successfully!",
        description: "Your Zoom account is now connected and ready to use for virtual classes.",
      });
      // Clean up the URL parameter
      searchParams.delete('zoom');
      const newSearch = searchParams.toString();
      const newUrl = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;
      navigate(newUrl, { replace: true });
    }
    if (searchParams.get('calendar') === 'connected') {
      toast({
        title: "Google Calendar Connected Successfully!",
        description: "Your Google Calendar is now connected and ready to sync your class events.",
      });
      // Clean up the URL parameter
      searchParams.delete('calendar');
      const newSearch = searchParams.toString();
      const newUrl = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;
      navigate(newUrl, { replace: true });
    }
  }, [location.search, toast, navigate]);

  const fetchTeacherProfile = async () => {
    setIsLoading(true);
    try {

      const { data, error } = await teacherService.getProfileById(user.id)
      if (error) {
        setHasProfile(false);
        setProfileData(null);
      } else {
        type ContactType = {
          phone: string;
          email: string;
          alternativePhone: string;
        };
        
        type LocationType = {
          address: string;
          apartment: string;
          houseNumber: string;
          city: string;
          county: string;
          postalCode: string;
          coordinates: {
            latitude: number;
            longitude: number;
          };
        };
        
        type NextOfKinType = {
          name: string;
          relationship: string;
          phone: string;
        };
        
        type CertificationType = {
          isCertified: boolean;
          details: string;
          year: string;
          institution: string;
        };
        
        const contactData = data.contact as unknown as ContactType;
        const locationData = data.location as unknown as LocationType;
        const nextOfKinData = data.next_of_kin as unknown as NextOfKinType;
        const certificationData = data.certification as unknown as CertificationType;
        
        const formattedData: TeacherProfileData = {
          contact: {
            phone: contactData?.phone || "",
            email: contactData?.email || "",
            alternativePhone: contactData?.alternativePhone || "",
          },
          location: {
            address: locationData?.address || "",
            apartment: locationData?.apartment || "",
            houseNumber: locationData?.houseNumber || "",
            city: locationData?.city || "",
            county: locationData?.county || "",
            postalCode: locationData?.postalCode || "",
            coordinates: {
              latitude: locationData?.coordinates?.latitude || 0,
              longitude: locationData?.coordinates?.longitude || 0,
            },
          },
          nextOfKin: {
            name: nextOfKinData?.name || "",
            relationship: nextOfKinData?.relationship || "",
            phone: nextOfKinData?.phone || "",
          },
          certification: {
            isCertified: certificationData?.isCertified || false,
            details: certificationData?.details || "",
            year: certificationData?.year || "",
            institution: certificationData?.institution || "",
          },
        };
        
        setProfileData(formattedData);
        setHasProfile(true);
      }
    } catch (err) {
      console.error("Error checking profile:", err);
      setHasProfile(false);
      setProfileData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (profileData: TeacherProfileData) => {
    setIsSubmitting(true);
    
    try {
      if (!user) throw new Error("User not authenticated");

      const { error } = await teacherService.updateProfile(user.id,
     {
          contact: profileData.contact,
          location: profileData.location,
          nextOfKin: profileData.nextOfKin,
          certification: profileData.certification,
        });

      if (error) throw error;

      toast({
        title: hasProfile ? "Profile updated" : "Profile created",
        description: hasProfile 
          ? "Your teacher profile has been successfully updated." 
          : "Your teacher profile has been successfully created.",
      });
      
      setHasProfile(true);
      setProfileData(profileData);
      setIsEditing(false);
      
      // Navigate to dashboard instead of setting state
      navigate("/teacher-dashboard");
      
      fetchTeacherProfile();
    } catch (err: any) {
      console.error("Error saving profile:", err);
      toast({
        title: "Error",
        description: err.message || "An error occurred while saving your profile",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      return;
    }
    
    try {
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await teacherService.deleteProfile(user.id);
      if (error) throw error;
      
      toast({
        title: "Profile deleted",
        description: "Your teacher profile has been successfully deleted.",
      });
      
      setHasProfile(false);
      setProfileData(null);
      setActiveTab("dashboard");
    } catch (err: any) {
      console.error("Error deleting profile:", err);
      toast({
        title: "Error",
        description: err.message || "An error occurred while deleting your profile",
        variant: "destructive"
      });
    }
  };

  const handleEditProfile = () => {
    // Navigate directly to profile setup, ignoring whether profile is complete
    navigate("/teacher-profile-setup");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const [isProfessionalProfileLoading, setIsProfessionalProfileLoading] = useState(false);
  
  const handleCompleteProfessionalProfile = () => {
    // Start loading animation
    setIsProfessionalProfileLoading(true);
    
    // Simulate loading for a short period to show the animation
    setTimeout(() => {
      navigate("/teacher-dashboard/settings?professional=true");
      setIsProfessionalProfileLoading(false);
    }, 800); // Animation duration
  };

  const handleProfessionalProfileComplete = () => {
    setShowProfessionalForm(false);
    setHasProfessionalProfile(true);
    toast({
      title: "Professional profile completed",
      description: "Your professional teacher profile has been successfully created.",
    });
    navigate("/teacher-dashboard");
  };

  const handleCancelProfessionalProfile = () => {
    navigate("/teacher-dashboard");
  };

  const handleCompleteClassSetup = () => {
    setShowClassSetupForm(false);
    setHasClassesSetup(true);
    toast({
      title: "Class setup completed",
      description: "Your class settings have been successfully saved.",
    });
    navigate("/teacher-dashboard");
  };

  const handleCancelClassSetup = () => {
    navigate("/teacher-dashboard");
  };

  const handleSetupClassSettings = () => {
    navigate("/teacher-dashboard/settings?class-setup=true");
  };

  const handleCreateClass = () => {
    // Navigate to the dedicated class setup page instead of showing the form inline
    navigate("/teacher-class-setup");
    
    // Keeping the old behavior as a fallback option
    // navigate("/teacher-dashboard/classes?create=true");
  };

  const handleClassCreated = (classData: any) => {
    // Refresh classes from API instead of manually adding to the array
    fetchTeacherClasses();
    
    toast({
      title: "Class created successfully",
      description: "Your new class is now ready for students to enroll.",
    });
    navigate("/teacher-dashboard");
  };

  const fetchTeacherClasses = async () => {
    setIsLoading(true);
    try {
      if (!user?.teacherId) {
        console.error("No teacher ID available");
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await classService.getTeacherClasses(user.id);
      
      if (error) {
        console.error("Error fetching teacher classes:", error);
        toast({
          title: "Error",
          description: "Failed to load classes. Please try again.",
          variant: "destructive"
        });
      } else if (data) {
        console.log("Loaded teacher classes:", data);
        setClasses(data);
        
        // Check if we have classes to determine setup status
        setHasClassesSetup(true);
      }
    } catch (err) {
      console.error("Failed to fetch teacher classes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClassCreation = () => {
    navigate("/teacher-dashboard");
  };

  const handleViewClass = (classItem: any) => {
    const classId = classItem._id || classItem.id;
    
    // Option 1: Continue using the query parameter approach
    navigate(`/teacher-dashboard/classes?id=${classId}`);
    setActiveClassTab("basic");
    
    // Option 2 (alternative): Use the dedicated route for the enhanced view
    // This would completely bypass the TeacherDashboard component's viewClass tab
    // navigate(`/teacher-class/${classId}`);
  };

  const handleBackToClasses = () => {
    navigate("/teacher-dashboard/classes");
  };

  const handleEnrollStudents = (classData?: any) => {
    if (classData) {
      const classId = classData._id || classData.id;
      navigate(`/teacher-dashboard/students?enroll=true&classId=${classId}`);
    } else {
      navigate(`/teacher-dashboard/students?enroll=true`);
    }
  };

  const handleRequestReviews = () => {
    // Navigate to the students page
    navigate(`/teacher-dashboard/students`);
    
    // Set a short timeout to allow the page to render
    setTimeout(() => {
      // Find and click the "Invite & Enroll" tab (which has value="invite")
      const inviteTab = document.querySelector('button[value="invite"]') as HTMLElement;
      if (inviteTab) {
        inviteTab.click();
      }
    }, 100);
  };

  const handleDeleteClass = async (classItem: any) => {
    const classId = classItem._id || classItem.id;
    const className = classItem.title;
    
    // Confirm deletion
    if (!confirm(`Are you sure you want to delete "${className}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      const { error } = await classService.delete(classId);
      
      if (error) {
        toast({
          title: "Error deleting class",
          description: error.message || "Failed to delete class. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Refresh the classes list
      await fetchTeacherClasses();
      
      toast({
        title: "Class deleted",
        description: `"${className}" has been deleted successfully.`,
      });
    } catch (error) {
      console.error('Error deleting class:', error);
      toast({
        title: "Error deleting class",
        description: "Failed to delete class. Please try again.",
        variant: "destructive",
      });
    }
  };

  const [comprehensiveProfile, setComprehensiveProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Fetch comprehensive teacher profile data
  const fetchComprehensiveProfile = async () => {
    if (!user?.teacherId) return;
    
    setIsLoadingProfile(true);
    try {
      const { data, error } = await teacherService.getProfileById(user.id);
      if (!error && data) {
        setComprehensiveProfile(data);
      }
    } catch (error) {
      console.error("Error fetching comprehensive profile:", error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const renderProfileView = () => {
    return (
      <div className="space-y-6">
        {/* Personal Information Card */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-4">
            <div className="flex items-center space-x-4 flex-1">
              {comprehensiveProfile?.user?._signedProfileImage || comprehensiveProfile?._signedProfileImage ? (
                <img 
                  src={comprehensiveProfile?.user?._signedProfileImage || comprehensiveProfile?._signedProfileImage} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div>
                <CardTitle>{comprehensiveProfile?.user?.fullName || "Teacher Profile"}</CardTitle>
                <CardDescription>
                  {comprehensiveProfile?.user?.bio || "Professional teaching profile information"}
                </CardDescription>
              </div>
            </div>
            {comprehensiveProfile?.isProfileComplete && (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <Phone className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-lg font-medium">Contact Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <p className="mt-1">{comprehensiveProfile?.user?.email || profileData?.contact?.email || "Not provided"}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p className="mt-1">{comprehensiveProfile?.user?.phoneNumber || profileData?.contact?.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <Label>Alternative Phone</Label>
                    <p className="mt-1">{comprehensiveProfile?.user?.alternativePhoneNumber || profileData?.contact?.alternativePhone || "Not provided"}</p>
                  </div>
                  <div>
                    <Label>WhatsApp</Label>
                    <p className="mt-1">{comprehensiveProfile?.user?.whatsappNumber || comprehensiveProfile?.user?.phoneNumber || profileData?.contact?.phone || "Not provided"}</p>
                  </div>
                </div>
              </div>

              {/* Professional Bio */}
              {comprehensiveProfile?.user?.bio && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <User className="h-5 w-5 text-purple-500 mr-2" />
                    <h3 className="text-lg font-medium">Professional Bio</h3>
                  </div>
                  <p className="text-gray-700">{comprehensiveProfile.user.bio}</p>
                </div>
              )}

              {/* Introduction Video */}
              {comprehensiveProfile?.introVideoUrl && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <Video className="h-5 w-5 text-red-500 mr-2" />
                    <h3 className="text-lg font-medium">Introduction Video</h3>
                  </div>
                  <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                    {comprehensiveProfile.introVideoUrl.includes('youtube.com') || comprehensiveProfile.introVideoUrl.includes('youtu.be') ? (
                      <iframe
                        src={comprehensiveProfile.introVideoUrl.includes('embed') ? 
                          comprehensiveProfile.introVideoUrl : 
                          `https://www.youtube.com/embed/${comprehensiveProfile.introVideoUrl.split('v=')[1]?.split('&')[0] || comprehensiveProfile.introVideoUrl.split('youtu.be/')[1]?.split('?')[0]}`
                        }
                        title="Introduction Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Video className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <a 
                            href={comprehensiveProfile.introVideoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Introduction Video
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Teaching Statistics */}
              {(comprehensiveProfile?.totalStudents > 0 || comprehensiveProfile?.totalClasses > 0 || comprehensiveProfile?.rating > 0) && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <Star className="h-5 w-5 text-yellow-500 mr-2" />
                    <h3 className="text-lg font-medium">Teaching Statistics</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {comprehensiveProfile.rating > 0 && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">{Number(comprehensiveProfile.rating).toFixed(1)}</p>
                        <p className="text-sm text-gray-500">Rating</p>
                      </div>
                    )}
                    {comprehensiveProfile.totalReviews > 0 && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{Number(comprehensiveProfile.totalReviews) || 0}</p>
                        <p className="text-sm text-gray-500">Reviews</p>
                      </div>
                    )}
                    {comprehensiveProfile.totalStudents > 0 && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{Number(comprehensiveProfile.totalStudents) || 0}</p>
                        <p className="text-sm text-gray-500">Students</p>
                      </div>
                    )}
                    {comprehensiveProfile.totalClasses > 0 && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{Number(comprehensiveProfile.totalClasses) || 0}</p>
                        <p className="text-sm text-gray-500">Classes</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Legacy Profile Data */}
              {profileData && (
                <>
                  {/* Location Information */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-4">
                      <MapPin className="h-5 w-5 text-red-500 mr-2" />
                      <h3 className="text-lg font-medium">Location</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Address</Label>
                        <p className="mt-1">{profileData.location.address || "Not provided"}</p>
                      </div>
                      <div>
                        <Label>City</Label>
                        <p className="mt-1">{profileData.location.city || "Not provided"}</p>
                      </div>
                      <div>
                        <Label>County</Label>
                        <p className="mt-1">{profileData.location.county || "Not provided"}</p>
                      </div>
                      <div>
                        <Label>Postal Code</Label>
                        <p className="mt-1">{profileData.location.postalCode || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Next of Kin */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-4">
                      <UserRound className="h-5 w-5 text-purple-500 mr-2" />
                      <h3 className="text-lg font-medium">Emergency Contact</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Name</Label>
                        <p className="mt-1">{profileData.nextOfKin.name || "Not provided"}</p>
                      </div>
                      <div>
                        <Label>Relationship</Label>
                        <p className="mt-1">{profileData.nextOfKin.relationship || "Not provided"}</p>
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <p className="mt-1">{profileData.nextOfKin.phone || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Professional Qualifications */}
        {(comprehensiveProfile?.education?.length > 0 || comprehensiveProfile?.experience?.length > 0 || comprehensiveProfile?.certifications?.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 text-gold-500 mr-2" />
                Professional Qualifications
              </CardTitle>
              <CardDescription>Education, experience, and certifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {comprehensiveProfile?.education?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Education</h4>
                  <div className="space-y-2">
                    {comprehensiveProfile.education.slice(0, 3).map((edu: any, index: number) => (
                      <div key={index} className="border-l-2 border-blue-200 pl-3">
                        <p className="font-medium">
                          {edu.degree || 'Degree'} 
                          {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {edu.institution || 'Institution'} 
                          {edu.year && ` • ${edu.year}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {comprehensiveProfile?.experience?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Teaching Experience</h4>
                  <div className="space-y-2">
                    {comprehensiveProfile.experience.slice(0, 3).map((exp: any, index: number) => (
                      <div key={index} className="border-l-2 border-green-200 pl-3">
                        <p className="font-medium">{exp.position || exp.title || 'Position'}</p>
                        <p className="text-sm text-gray-600">
                          {exp.institution || exp.company || 'Institution'} 
                          {(exp.duration || exp.years) && ` • ${exp.duration || exp.years}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Teaching Expertise */}
        {(comprehensiveProfile?.subjects?.length > 0 || comprehensiveProfile?.skills?.length > 0 || comprehensiveProfile?.languages?.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 text-indigo-500 mr-2" />
                Teaching Expertise
              </CardTitle>
              <CardDescription>Subjects, skills, and languages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {comprehensiveProfile?.subjects?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Subjects</h4>
                  <div className="flex flex-wrap gap-2">
                    {comprehensiveProfile.subjects.slice(0, 6).map((subject: any, index: number) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                        {subject.subject || subject.name || (typeof subject === 'string' ? subject : 'Subject')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {comprehensiveProfile?.languages?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {comprehensiveProfile.languages.slice(0, 4).map((lang: any, index: number) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                        {typeof lang === 'string' ? lang : (lang.language || lang.name || 'Language')} 
                        {lang.proficiency && ` (${lang.proficiency})`}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderIntegrationsView = () => {
    return (
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>
              Connect your teaching tools and services
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={() => navigate("/teacher-dashboard/zoom")}
          >
            <Video className="mr-2 h-4 w-4" />
            Manage Zoom
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Zoom Integration */}
          <div className="border rounded-lg p-4 bg-white">
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <Video className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Zoom</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Host virtual classes and meetings
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-0">Connected</Badge>
                </div>
                <div className="mt-3 text-sm">
                  <p className="text-gray-600">
                    Your Zoom account is connected and ready to use for scheduling online classes.
                  </p>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => navigate("/teacher-dashboard/zoom")}>
                    Configure
                  </Button>
                  <Button size="sm" variant="outline" className="text-blue-600">
                    Create Meeting
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Google Calendar Integration */}
          <div className="border rounded-lg p-4 bg-white">
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Google Calendar</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Sync your class schedule
                    </p>
                  </div>
                  <Badge className="bg-gray-100 text-gray-800 border-0">Not Connected</Badge>
                </div>
                <div className="mt-3 text-sm">
                  <p className="text-gray-600">
                    Connect your Google Calendar to automatically sync class schedules and receive reminders.
                  </p>
                </div>
                <div className="mt-3">
                  <Button size="sm">
                    Connect Calendar
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          
          {/* Google Drive Integration */}
          <div className="border rounded-lg p-4 bg-white">
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                <FileText className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Google Drive</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Manage and share class materials
                    </p>
                  </div>
                  <Badge className="bg-gray-100 text-gray-800 border-0">Not Connected</Badge>
                </div>
                <div className="mt-3 text-sm">
                  <p className="text-gray-600">
                    Connect your Google Drive to easily upload, store, and share teaching materials with your students.
                  </p>
                </div>
                <div className="mt-3">
                  <Button size="sm">
                    Connect Drive
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <Link to="/">
            <img 
              src="/lovable-uploads/15671e94-4ac9-490c-95b6-aa4fe6bbc23c.png" 
              alt="Kidato Logo" 
              className="h-8"
            />
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link 
            to="/teacher-dashboard"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
              activeTab === "dashboard" 
                ? "bg-kidato-light-blue text-kidato-purple" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link 
            to="/teacher-dashboard/classes"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
              activeTab === "classes" || activeTab === "viewClass"
                ? "bg-kidato-light-blue text-kidato-purple" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <BookOpen className="mr-3 h-5 w-5" />
            My Classes
          </Link>
          <Link 
            to="/teacher-dashboard/students"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
              activeTab === "students" || activeTab === "enrollment"
                ? "bg-kidato-light-blue text-kidato-purple" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Users className="mr-3 h-5 w-5" />
            Students
          </Link>
          <Link 
            to="/teacher-dashboard/schedule"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
              activeTab === "schedule" 
                ? "bg-kidato-light-blue text-kidato-purple" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Calendar className="mr-3 h-5 w-5" />
            Schedule
          </Link>
          {/* Only show Earnings if teacher has classes with enrolled students */}
          {(() => {
            const hasEnrolledStudents = summaryData?.classes?.some(classItem => {
              return (classItem.enrolledStudents || 0) > 0;
            }) || false;
            
            return hasEnrolledStudents && (
              <Link 
                to="/teacher-earnings"
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
                  activeTab === "earnings" 
                    ? "bg-kidato-light-blue text-kidato-purple" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <DollarSign className="mr-3 h-5 w-5" />
                Earnings
              </Link>
            );
          })()}
          <Link 
            to="/teacher-dashboard/settings"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
              activeTab === "settings" 
                ? "bg-kidato-light-blue text-kidato-purple" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-center"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              {activeTab === "dashboard" ? "" :
               activeTab === "classes" ? (showCreateClassForm ? "Create New Class" : "") :
               activeTab === "viewClass" ? "Class Details" :
               activeTab === "students" ? "" :
               activeTab === "enrollment" ? "Enroll Students" :
               activeTab === "schedule" ? "Schedule" : 
               isEditing ? "Update Your Profile" : 
               showProfessionalForm ? "Complete Professional Profile" :
               showClassSetupForm ? "Set Up Class Settings" : "Settings"}
            </h1>
            <div className="flex md:hidden">
              <Button variant="outline" size="sm">
                Menu
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading...</p>
            </div>
          )}

          {!isLoading && activeTab === "settings" && isEditing && (
            <div className="max-w-3xl mx-auto">
              <TeacherProfileForm
                onSubmit={handleProfileSubmit}
                onCancel={() => {
                  if (hasProfile) {
                    setIsEditing(false);
                  } else {
                    navigate("/");
                  }
                }}
                isSubmitting={isSubmitting}
                initialData={profileData || undefined}
              />
            </div>
          )}

          {!isLoading && activeTab === "settings" && showProfessionalForm && (
            <div className="max-w-4xl mx-auto">
              <TeacherProfessionalProfileForm
                onComplete={handleProfessionalProfileComplete}
                onCancel={handleCancelProfessionalProfile}
              />
            </div>
          )}

          {!isLoading && activeTab === "settings" && showClassSetupForm && (
            <div className="max-w-4xl mx-auto">
              <ClassSetupForm
                onComplete={handleCompleteClassSetup}
                onCancel={handleCancelClassSetup}
              />
            </div>
          )}

          {!isLoading && activeTab === "classes" && showCreateClassForm && (
            <div className="max-w-7xl mx-auto">
              <EnhancedClassSetup
                onSubmit={handleClassCreated}
              />
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={handleCancelClassCreation}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {!isLoading && activeTab === "settings" && !isEditing && !showProfessionalForm && !showClassSetupForm && (
            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account settings and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="profile">Profile</TabsTrigger>
                      <TabsTrigger value="integrations">Integrations</TabsTrigger>
                      <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="profile" className="space-y-4">
                      {isLoadingProfile ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                          <span className="ml-2 text-gray-600">Loading profile...</span>
                        </div>
                      ) : !hasProfile ? (
                        <div className="border rounded-md p-4 bg-gray-50">
                          <div className="text-center py-8">
                            <User className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                            <h3 className="text-lg font-medium mb-2">No Profile Yet</h3>
                            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                              Complete your teacher profile to be visible to students looking for tutors.
                            </p>
                            <Button 
                              onClick={handleEditProfile}
                              className="flex items-center gap-2 mx-auto"
                            >
                              <User className="h-4 w-4" />
                              Complete Profile
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {renderProfileView()}
                          <div className="flex justify-end gap-3 mt-4">
                            <Button 
                              onClick={() => navigate("/teacher-profile")}
                              variant="outline"
                              className="flex items-center gap-2"
                            >
                              <User className="h-4 w-4" />
                              View Full Profile
                            </Button>
                            <Button 
                              onClick={handleEditProfile}
                              className="flex items-center gap-2"
                            >
                              <Edit className="h-4 w-4" />
                              Edit Profile
                            </Button>
                          </div>
                        </>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="integrations">
                      {renderIntegrationsView()}
                    </TabsContent>
                    
                    <TabsContent value="notifications">
                      <Card>
                        <CardHeader>
                          <CardTitle>Notification Preferences</CardTitle>
                          <CardDescription>
                            Configure how and when you receive notifications
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="border rounded-md p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h3 className="font-medium">Email Notifications</h3>
                                <p className="text-sm text-gray-500">Get notified about important updates via email</p>
                              </div>
                              <Switch id="email-notifications" />
                            </div>
                          </div>
                          
                          <div className="border rounded-md p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h3 className="font-medium">SMS Notifications</h3>
                                <p className="text-sm text-gray-500">Receive text messages for urgent updates</p>
                              </div>
                              <Switch id="sms-notifications" />
                            </div>
                          </div>
                          
                          <div className="border rounded-md p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h3 className="font-medium">In-App Notifications</h3>
                                <p className="text-sm text-gray-500">Show notifications within the platform</p>
                              </div>
                              <Switch id="in-app-notifications" defaultChecked />
                            </div>
                          </div>
                          
                          <div className="mt-6">
                            <h3 className="font-medium mb-3">Notification Categories</h3>
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="notify-students" defaultChecked />
                                <Label htmlFor="notify-students">Student enrollment updates</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="notify-classes" defaultChecked />
                                <Label htmlFor="notify-classes">Class schedule changes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="notify-payments" defaultChecked />
                                <Label htmlFor="notify-payments">Payment notifications</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="notify-messages" defaultChecked />
                                <Label htmlFor="notify-messages">New messages</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="notify-reviews" defaultChecked />
                                <Label htmlFor="notify-reviews">Reviews and feedback</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="notify-system" defaultChecked />
                                <Label htmlFor="notify-system">System updates and maintenance</Label>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}

          {!isLoading && activeTab === "dashboard" && (
            <div className="space-y-6">
              {!hasProfile || classes.length === 0 ? (
                <TeacherOnboardingDashboard
                  hasProfile={hasProfile}
                  hasClasses={classes.length > 0}
                  zoomConnected={false}
                  calendarConnected={false}
                  driveConnected={false}
                  onCreateClass={handleCreateClass}
                  onViewProfile={() => navigate("/teacher-profile")}
                  onConnectZoom={() => console.log("Connect Zoom")}
                  onConnectCalendar={() => console.log("Connect Calendar")}
                  onConnectDrive={() => console.log("Connect Drive")}
                />
              ) : (
                <div className="relative -m-6">
                  <TeacherCommandCenter />
                </div>
              )}
            </div>
          )}

          {activeTab === "classes" && !showCreateClassForm && (
            <TabbedClassesView
              classes={classes}
              isLoading={isLoading}
              hasClassesSetup={hasClassesSetup}
              onCreateClass={handleCreateClass}
              onViewClass={handleViewClass}
              onSetupClassSettings={handleSetupClassSettings}
              onDeleteClass={handleDeleteClass}
              onCreateClassFromRecommendation={(recommendation) => {
                // Navigate to class creation with pre-filled data
                navigate("/teacher-dashboard/classes?create=true", {
                  state: { recommendation }
                });
              }}
            />
          )}

          {!isLoading && activeTab === "students" && !showEnrollStudents && (
            <>
              {classes.length === 0 ? (
                <TeacherOnboardingDashboard
                  hasProfile={hasProfile}
                  hasClasses={classes.length > 0}
                  zoomConnected={false} // You may want to track this state
                  calendarConnected={false} // You may want to track this state
                  driveConnected={false} // You may want to track this state
                  onCreateClass={handleCreateClass}
                  onViewProfile={() => navigate("/teacher-dashboard/settings")}
                  onConnectZoom={() => navigate("/teacher-dashboard/zoom")}
                  onConnectCalendar={() => navigate("/teacher-dashboard/calendar")}
                  onConnectDrive={() => console.log("Connect drive")}
                />
              ) : (
                <AIStudentsPage
                  onViewProfile={(studentId) => console.log("View student profile:", studentId)}
                  onEnrollStudents={handleEnrollStudents}
                  classes={classes}
                />
              )}
            </>
          )}

          {!isLoading && activeTab === "enrollment" && (
            <div className="space-y-6">
              {selectedClass ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Button variant="outline" size="sm" onClick={() => {
                      navigate("/teacher-dashboard/students");
                    }}>
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Back to Students
                    </Button>
                  </div>
                  <EnrollStudentsPage classId={selectedClass.id} className={selectedClass.title} />
                </>
              ) : (
                <EnrollStudentsPage />
              )}
            </div>
          )}

          {!isLoading && activeTab === "schedule" && (
            <>
              {classes.length === 0 ? (
                <TeacherOnboardingDashboard
                  hasProfile={hasProfile}
                  hasClasses={classes.length > 0}
                  zoomConnected={false}
                  calendarConnected={false}
                  driveConnected={false}
                  onCreateClass={handleCreateClass}
                  onViewProfile={() => navigate("/teacher-profile")}
                  onConnectZoom={() => navigate("/teacher-dashboard/zoom")}
                  onConnectCalendar={() => navigate("/teacher-dashboard/calendar")}
                  onConnectDrive={() => console.log("Connect drive")}
                />
              ) : (
                <div className="space-y-6">
                  {/* Loading State */}
                  {(sessionsLoading || summaryLoading) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">Loading your schedule data...</p>
                          <p className="text-xs text-blue-600">Fetching upcoming sessions and insights</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Error State */}
                  {(sessionsError || summaryError) && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="15" y1="9" x2="9" y2="15"></line>
                          <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-red-800">Unable to load schedule data</p>
                          <p className="text-xs text-red-600">{sessionsError || summaryError}</p>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="mt-2 h-7 text-xs border-red-300 text-red-700 hover:bg-red-50"
                            onClick={() => {
                              refetchSessions();
                              refetchSummary();
                            }}
                          >
                            Retry
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main calendar section */}
                    <div className="lg:w-2/3">
                      <Card className="border-t-4 border-t-sky-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <div>
                            <CardTitle className="text-xl flex items-center text-gray-800">
                              <Calendar className="mr-2 h-5 w-5 text-sky-600" />
                              Teaching Schedule
                            </CardTitle>
                            <CardDescription>
                              Manage your classes and availability
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-xs">
                              Day
                            </Button>
                            <Button size="sm" variant="default" className="bg-sky-600 text-xs">
                              Week
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs">
                              Month
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="mt-2">
                            {/* Calendar week view */}
                            <div className="border rounded-md overflow-hidden">
                              {/* Week navigation */}
                              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
                                <div className="flex items-center space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => {
                                      const newWeek = new Date(currentWeek);
                                      newWeek.setDate(currentWeek.getDate() - 7);
                                      setCurrentWeek(newWeek);
                                    }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                                      <path d="m15 18-6-6 6-6"/>
                                    </svg>
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 text-xs"
                                    onClick={() => setCurrentWeek(new Date())}
                                  >
                                    Today
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => {
                                      const newWeek = new Date(currentWeek);
                                      newWeek.setDate(currentWeek.getDate() + 7);
                                      setCurrentWeek(newWeek);
                                    }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                                      <path d="m9 18 6-6-6-6"/>
                                    </svg>
                                  </Button>
                                </div>
                                <h3 className="text-sm font-medium">
                                  {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </h3>
                                <div></div>
                              </div>
                              
                              {/* Days of the week */}
                              <div className="grid grid-cols-7 text-center border-b bg-gray-50">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => {
                                  const currentDay = weekDays[i];
                                  const isToday = currentDay.toDateString() === new Date().toDateString();
                                  return (
                                    <div key={i} className="py-2 text-xs font-medium">
                                      <div>{day}</div>
                                      <div className={`text-sm mt-1 ${isToday ? "h-6 w-6 rounded-full bg-sky-600 text-white flex items-center justify-center mx-auto" : ""}`}>
                                        {currentDay.getDate()}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              
                              {/* Time slots */}
                              <div className="relative" style={{ height: "500px" }}>
                                {/* Time markers */}
                                <div className="absolute top-0 left-0 w-full h-full grid grid-cols-1 gap-0">
                                  {[9, 10, 11, 12, 13, 14, 15, 16, 17].map((hour, i) => (
                                    <div key={i} className="relative border-b border-gray-100">
                                      <div className="absolute -top-2.5 left-1 text-xs text-gray-400 bg-white px-1">
                                        {hour % 12 === 0 ? '12' : hour % 12}{hour >= 12 ? 'pm' : 'am'}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                
                                {/* Week grid */}
                                <div className="absolute top-0 left-8 right-0 h-full grid grid-cols-7 gap-0">
                                  {/* Day columns with real sessions */}
                                  {weekDays.map((day, dayIndex) => {
                                    const daySessions = weekSessions.filter(session => 
                                      new Date(session.startTime).toDateString() === day.toDateString()
                                    );
                                    
                                    return (
                                      <div key={dayIndex} className="relative border-l first:border-l-0 h-full">
                                        {/* Real session events */}
                                        {daySessions.map((session, sessionIndex) => {
                                          const { top, height } = getSessionPosition(session.startTime, session.duration);
                                          const colors = getSessionColor(sessionIndex);
                                          const startTime = formatTime(session.startTime);
                                          const endTime = formatTime(new Date(new Date(session.startTime).getTime() + session.duration * 60000).toISOString());
                                          
                                          return (
                                            <div 
                                              key={session.classId} 
                                              className={`absolute left-1 right-1 rounded-md ${colors.bg} border ${colors.border} p-2 overflow-hidden cursor-pointer hover:shadow-sm transition-shadow`}
                                              style={{ top: `${Math.max(0, top)}px`, height: `${Math.max(60, height)}px` }}
                                              onClick={() => {
                                                // Navigate to class view
                                                navigate(`/teacher-dashboard/classes?id=${session.classId}`);
                                              }}
                                            >
                                              <div className={`text-xs font-medium ${colors.text} truncate`}>{session.title}</div>
                                              <div className={`text-xs ${colors.subtext}`}>{startTime} - {endTime}</div>
                                              <div className={`text-xs ${colors.subtext} mt-1 truncate`}>{session.cohortName}</div>
                                              <div className={`text-xs ${colors.subtext} truncate`}>{session.enrolledStudents} students</div>
                                              {session.readiness && (
                                                <div className={`text-xs ${colors.subtext} mt-1`}>
                                                  Ready: {Math.round(session.readiness.overallReadiness || 0)}%
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                        
                                        {/* Show loading state */}
                                        {sessionsLoading && dayIndex === 0 && (
                                          <div className="absolute top-2 left-1 right-1 h-16 rounded-md bg-gray-100 border border-gray-200 p-2 flex items-center justify-center">
                                            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Side panel */}
                <div className="lg:w-1/3 space-y-6">
                  {/* Quick add event */}
                  <Card className="border-t-4 border-t-indigo-500">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-indigo-600">
                          <path d="M8 2v4"></path>
                          <path d="M16 2v4"></path>
                          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                          <path d="M3 10h18"></path>
                          <path d="M12 16h6"></path>
                          <path d="M12 14v4"></path>
                        </svg>
                        Quick Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="class">Class</Label>
                            <select className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm">
                              <option value="">Select a class</option>
                              {classes.map((cls: any) => (
                                <option key={cls._id || cls.id} value={cls._id || cls.id}>
                                  {cls.title}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="type">Type</Label>
                            <select className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm">
                              <option>Regular class</option>
                              <option>Lab session</option>
                              <option>Review session</option>
                              <option>Test/Quiz</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="date">Date</Label>
                            <Input type="date" id="date" className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="time">Time</Label>
                            <Input type="time" id="time" className="mt-1" />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="duration">Duration</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input type="number" id="duration" defaultValue="1" className="w-20" />
                            <span className="text-sm text-gray-500">hours</span>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input type="text" id="location" placeholder="Room, building, or online link" className="mt-1" />
                        </div>
                        
                        <div>
                          <Label className="flex items-center gap-2">
                            <input type="checkbox" className="rounded text-indigo-600" />
                            <span className="text-sm text-gray-700">Repeat weekly</span>
                          </Label>
                        </div>
                        
                        <div className="pt-2">
                          <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M12 8v8"></path>
                              <path d="M8 12h8"></path>
                            </svg>
                            Add to Schedule
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Upcoming classes */}
                  <Card className="border-t-4 border-t-emerald-500">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-emerald-600">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 6v6l4 2"></path>
                        </svg>
                        Upcoming Classes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {sessionsLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                            <span className="ml-2 text-sm text-gray-500">Loading sessions...</span>
                          </div>
                        ) : upcomingSessions.length === 0 ? (
                          <div className="text-center py-8">
                            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">No upcoming sessions</p>
                            <p className="text-gray-400 text-xs mt-1">Schedule a class to get started</p>
                          </div>
                        ) : (
                          upcomingSessions.slice(0, 3).map((session, index) => {
                            const colors = getSessionColor(index);
                            const startTime = formatTime(session.startTime);
                            const endTime = formatTime(new Date(new Date(session.startTime).getTime() + session.duration * 60000).toISOString());
                            const sessionDate = new Date(session.startTime);
                            const isToday = sessionDate.toDateString() === new Date().toDateString();
                            const isTomorrow = sessionDate.toDateString() === new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString();
                            const timeLeft = Math.max(0, sessionDate.getTime() - Date.now());
                            const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
                            const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                            
                            let timeLabel = 'Upcoming';
                            if (isToday) {
                              if (hoursLeft < 1) {
                                timeLabel = minutesLeft > 0 ? `${minutesLeft}m` : 'Starting soon';
                              } else {
                                timeLabel = `${hoursLeft}h ${minutesLeft}m`;
                              }
                            } else if (isTomorrow) {
                              timeLabel = 'Tomorrow';
                            } else {
                              timeLabel = sessionDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                            }
                            
                            return (
                              <div key={session.classId} className={`${colors.bg} rounded-lg overflow-hidden border ${colors.border}`}>
                                <div className="p-3">
                                  <div className="flex items-center justify-between">
                                    <h4 className={`font-medium ${colors.text} truncate`}>{session.title}</h4>
                                    <div className={`text-xs px-2 py-1 ${colors.bg.replace('100', '200')} rounded-full ${colors.subtext}`}>{timeLabel}</div>
                                  </div>
                                  <div className="flex items-start mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`mr-1 ${colors.subtext} mt-0.5`}>
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <path d="M12 6v6l4 2"></path>
                                    </svg>
                                    <div className={`text-sm ${colors.subtext}`}>{startTime} - {endTime}</div>
                                  </div>
                                  <div className="flex items-start mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`mr-1 ${colors.subtext} mt-0.5`}>
                                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                      <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    <div className={`text-sm ${colors.subtext} truncate`}>{session.cohortName}</div>
                                  </div>
                                  <div className="flex items-start mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`mr-1 ${colors.subtext} mt-0.5`}>
                                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                      <circle cx="9" cy="7" r="4"></circle>
                                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                    <div className={`text-sm ${colors.subtext}`}>{session.enrolledStudents} students</div>
                                  </div>
                                  {session.readiness && (
                                    <div className="flex items-start mt-1">
                                      <CheckCircle2 className={`w-3.5 h-3.5 mr-1 ${colors.subtext} mt-0.5`} />
                                      <div className={`text-sm ${colors.subtext}`}>Ready: {Math.round(session.readiness.overallReadiness || 0)}%</div>
                                    </div>
                                  )}
                                </div>
                                <div className={`flex items-center justify-end ${colors.bg.replace('100', '200')} px-3 py-2 text-xs`}>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 text-xs"
                                    onClick={() => navigate(`/teacher-dashboard/classes?id=${session.classId}`)}
                                  >
                                    View
                                  </Button>
                                  {session.readiness && session.readiness.overallReadiness > 80 && (
                                    <Button 
                                      size="sm" 
                                      className={`h-7 text-xs ml-2 ${colors.text.includes('blue') ? 'bg-blue-600 hover:bg-blue-700' : colors.text.includes('purple') ? 'bg-purple-600 hover:bg-purple-700' : colors.text.includes('green') ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'}`}
                                      onClick={() => {
                                        // Start class logic would go here
                                        toast({ title: "Starting class", description: `Starting ${session.title}` });
                                      }}
                                    >
                                      {hoursLeft < 1 ? 'Start Class' : 'Prepare'}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                        
                        {upcomingSessions.length > 3 && (
                          <div className="pt-2 flex justify-center">
                            <Button 
                              variant="link" 
                              className="text-emerald-600"
                              onClick={() => setActiveTab('schedule')}
                            >
                              View all {upcomingSessions.length} upcoming sessions
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Schedule Insights & Critical Path */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Teaching Insights */}
                <Card className="border-t-4 border-t-emerald-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center text-gray-800">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-emerald-600">
                        <path d="M9 11H5a2 2 0 0 0-2 2v7c0 2 1 3 3 3h10c2 0 3-1 3-3v-7a2 2 0 0 0-2-2h-4"></path>
                        <path d="M8 7V6a2 2 0 1 1 4 0v1"></path>
                        <path d="M9 17v-7h6v7"></path>
                        <path d="M8 17h8"></path>
                      </svg>
                      Smart Insights
                    </CardTitle>
                    <CardDescription>
                      AI-powered recommendations for your schedule
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {summaryData?.analytics?.insights?.slice(0, 3).map((insight, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-sm text-emerald-800">{insight}</p>
                          </div>
                        </div>
                      )) || (
                        <div className="text-center py-4">
                          <p className="text-gray-500 text-sm">Insights will appear as you teach more classes</p>
                        </div>
                      )}
                      
                      {/* Preparation Recommendations */}
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-gray-800 mb-2">Preparation Recommendations</h4>
                        <div className="space-y-2">
                          {upcomingSessions.slice(0, 2).map((session, index) => {
                            const readiness = session.readiness?.overallReadiness || 0;
                            let recommendation = '';
                            let color = 'text-green-600';
                            
                            if (readiness < 50) {
                              recommendation = 'Review lesson materials and prepare activities';
                              color = 'text-red-600';
                            } else if (readiness < 80) {
                              recommendation = 'Check tech setup and review student progress';
                              color = 'text-amber-600';
                            } else {
                              recommendation = 'All set! Consider bonus activities';
                              color = 'text-green-600';
                            }
                            
                            return (
                              <div key={session.classId} className="text-xs">
                                <span className="font-medium text-gray-700">{session.title}:</span>
                                <span className={`ml-1 ${color}`}>{recommendation}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Critical Path */}
                <Card className="border-t-4 border-t-purple-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center text-gray-800">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-purple-600">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                        <path d="M12 20h9"></path>
                      </svg>
                      Critical Path
                    </CardTitle>
                    <CardDescription>
                      Key actions to stay ahead and deliver excellence
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Critical Actions */}
                      <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-purple-800">Next 24 Hours</h4>
                          <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                            {upcomingSessions.filter(s => new Date(s.startTime).getTime() - Date.now() < 24 * 60 * 60 * 1000).length} sessions
                          </div>
                        </div>
                        <div className="space-y-1 text-xs text-purple-700">
                          {upcomingSessions
                            .filter(s => new Date(s.startTime).getTime() - Date.now() < 24 * 60 * 60 * 1000)
                            .slice(0, 3)
                            .map((session, index) => (
                              <div key={session.classId} className="flex items-center justify-between">
                                <span>{session.title}</span>
                                <span className={`px-1 rounded text-xs ${
                                  (session.readiness?.overallReadiness || 0) > 80 
                                    ? 'bg-green-100 text-green-600' 
                                    : (session.readiness?.overallReadiness || 0) > 50 
                                    ? 'bg-amber-100 text-amber-600' 
                                    : 'bg-red-100 text-red-600'
                                }`}>
                                  {Math.round(session.readiness?.overallReadiness || 0)}%
                                </span>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                      
                      {/* Weekly Goals */}
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">Weekly Goals</h4>
                        <div className="space-y-1 text-xs text-blue-700">
                          <div className="flex items-center justify-between">
                            <span>• Content delivery excellence</span>
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>• Student engagement optimization</span>
                            <div className="w-3 h-3 border border-blue-300 rounded-full"></div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>• Research & preparation buffer</span>
                            <div className="w-3 h-3 border border-blue-300 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Performance Metrics */}
                      {summaryData?.analytics && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <h4 className="text-sm font-medium text-gray-800 mb-2">Performance Metrics</h4>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-800">{summaryData.analytics.overallPerformance?.averageEngagement || 0}%</div>
                              <div className="text-gray-600">Engagement</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-800">{summaryData.analytics.classHealthScore || 0}%</div>
                              <div className="text-gray-600">Health Score</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recurring schedules */}
              <Card className="border-t-4 border-t-amber-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-amber-600">
                      <path d="M21 7v6h-6"></path>
                      <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"></path>
                    </svg>
                    Recurring Schedules
                  </CardTitle>
                  <CardDescription>
                    Manage your weekly teaching patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-blue-50 border-blue-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">Math Class - Grade 7</h3>
                          <p className="text-sm text-gray-500 mt-1">Every Monday, Wednesday</p>
                          <p className="text-sm text-gray-500">9:00 AM - 10:00 AM</p>
                          <p className="text-sm text-gray-500">Room 203</p>
                        </div>
                        <div className="px-2 py-1 bg-blue-100 rounded-full text-xs text-blue-700">
                          Weekly
                        </div>
                      </div>
                      <div className="flex mt-4 justify-end gap-2">
                        <Button size="sm" variant="outline" className="text-xs h-8">Edit</Button>
                        <Button size="sm" variant="outline" className="text-xs h-8">Pause</Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-purple-50 border-purple-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">Science Lab - Grade 5</h3>
                          <p className="text-sm text-gray-500 mt-1">Every Tuesday, Thursday</p>
                          <p className="text-sm text-gray-500">1:00 PM - 2:00 PM</p>
                          <p className="text-sm text-gray-500">Science Lab 4</p>
                        </div>
                        <div className="px-2 py-1 bg-purple-100 rounded-full text-xs text-purple-700">
                          Weekly
                        </div>
                      </div>
                      <div className="flex mt-4 justify-end gap-2">
                        <Button size="sm" variant="outline" className="text-xs h-8">Edit</Button>
                        <Button size="sm" variant="outline" className="text-xs h-8">Pause</Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 border-dashed flex flex-col items-center justify-center text-center h-[152px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mb-2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 8v8"></path>
                        <path d="M8 12h8"></path>
                      </svg>
                      <p className="text-sm text-gray-500 mb-2">Create a new recurring schedule</p>
                      <Button size="sm" variant="outline" className="text-xs">
                        Add Recurring Schedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Schedule analysis */}
              <Card className="border-t-4 border-t-emerald-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-emerald-600">
                      <path d="M3 3v18h18"></path>
                      <path d="m19 9-5 5-4-4-3 3"></path>
                    </svg>
                    Schedule Analytics
                  </CardTitle>
                  <CardDescription>
                    Insights to optimize your teaching schedule
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Weekly Teaching Hours</h3>
                      <p className="text-3xl font-bold text-gray-900">8.5</p>
                      <div className="flex justify-center items-center mt-2 text-green-600 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="m6 9 6 6 6-6"></path>
                        </svg>
                        <span>+2.5 from last week</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full mt-3">
                        <div className="h-2 bg-emerald-500 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">85% of availability filled</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Busiest Day</h3>
                      <p className="text-3xl font-bold text-gray-900">Wednesday</p>
                      <p className="text-sm text-gray-500 mt-2">3 classes scheduled</p>
                      <div className="grid grid-cols-7 gap-1 mt-3">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                          <div 
                            key={i} 
                            className={`text-xs font-medium rounded-full h-6 flex items-center justify-center ${
                              i === 3 ? 'bg-emerald-200 text-emerald-800' : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Class Distribution</h3>
                      <div className="flex justify-center mt-3">
                        {/* Simple pie chart visualization */}
                        <div className="relative w-24 h-24">
                          <svg viewBox="0 0 36 36" className="w-full h-full">
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#E5E7EB"
                              strokeWidth="4"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#3B82F6"
                              strokeWidth="4"
                              strokeDasharray="25, 100"
                              strokeDashoffset="25"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#8B5CF6"
                              strokeWidth="4"
                              strokeDasharray="20, 100"
                              strokeDashoffset="0"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#10B981"
                              strokeWidth="4"
                              strokeDasharray="30, 100"
                              strokeDashoffset="50"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-1 mt-3 text-xs">
                        <div className="flex items-center">
                          <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                          <span className="text-gray-600">Math</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-3 h-3 rounded-full bg-purple-500 mr-1"></span>
                          <span className="text-gray-600">Science</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-3 h-3 rounded-full bg-emerald-500 mr-1"></span>
                          <span className="text-gray-600">English</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
              )}
            </>
          )}

          {!isLoading && activeTab === "viewClass" && selectedClass && (
            <EnhancedClassDetailPage 
              classData={selectedClass}
              onBack={handleBackToClasses}
            />
          )}

          {!isLoading && activeTab === "zoom" && (
            <div className="max-w-7xl mx-auto">
              <ZoomDashboard />
            </div>
          )}

          {!isLoading && activeTab === "calendar" && (
            <div className="max-w-7xl mx-auto">
              <GoogleCalendarDashboard />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
