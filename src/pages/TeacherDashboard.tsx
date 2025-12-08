import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Home, BookOpen, Users, Calendar, User, Settings, LogOut, Edit, Phone, MapPin, Award, CheckCircle2, CircleDashed, Video, PlusCircle, Star, UserPlus, BookText, School, UsersRound, UserRound, ChevronLeft, Loader2, DollarSign, FileText, Badge, MessageCircle, Filter, Plus, RefreshCw, ChevronDown, MessageSquare } from "lucide-react";
import MessagingPlatform from "@/components/messaging/MessagingPlatform";
import { useIntercom } from "@/components/support";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeacherProfileForm from "@/components/teacher/TeacherProfileForm";
import TeacherProfessionalProfileForm from "@/components/teacher/TeacherProfessionalProfileForm";
import ClassSetupForm from "@/components/teacher/ClassSetupForm";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge as UiBadge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { NotificationSettingsTab } from "@/components/teacher/settings/NotificationSettingsTab";
import { IntegrationsTab } from "@/components/teacher/settings/IntegrationsTab";
import { AvailabilityManager } from "@/components/teacher/content/AvailabilityManager";
import { ContentManager } from "@/components/teacher/content/ContentManager";
import { useAuth } from "@/contexts/AuthContext";
import { teacherService } from "@/integrations/api/services/teacher.service.ts";
import { classService } from "@/integrations/api/services/class.service.ts";
import { googleCalendarService } from "@/integrations/api/services/google-calendar.service";
import { useTeacherUpcomingSessions } from "@/hooks/useTeacherUpcomingSessions";
import { useTeacherSummary } from "@/hooks/useTeacherSummary";
import { UpcomingSession } from "@/types/activity";
import { TeacherSummaryResponse } from "@/types/enhanced-classes";
import { ScheduleCalendar } from "@/components/schedule/ScheduleCalendar";
import { ScheduleEvent } from "@/types/calendar";
import { format } from "date-fns";

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
  const { user, signOut, isLoading: authLoading } = useAuth();
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
    } else if (path.includes('/teacher-dashboard/content')) {
      return "content";
    } else if (path.includes('/teacher-dashboard/messaging')) {
      return "messaging";
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

  // Schedule state
  const [scheduleView, setScheduleView] = useState<"day" | "week" | "month">("week");
  const [quickSchedule, setQuickSchedule] = useState({
    classId: "",
    type: "Regular class",
    date: "",
    time: "",
    duration: 1,
    location: "",
    repeat: false
  });
  const [isScheduling, setIsScheduling] = useState(false);

  // Schedule filters
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>(['Classes', 'Hangouts', 'Birthdays', 'Achievements', 'Assignments']);

  const handleEventTypeToggle = (type: string) => {
    setSelectedEventTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const getEventTypeColor = (type: string, isSelected: boolean) => {
    if (!isSelected) return "bg-gray-100 text-gray-500 hover:bg-gray-200 border-transparent";
    switch (type) {
      case 'Classes': return "bg-blue-100 text-blue-700 border-blue-200";
      case 'Hangouts': return "bg-green-100 text-green-700 border-green-200";
      case 'Birthdays': return "bg-amber-100 text-amber-700 border-amber-200";
      case 'Achievements': return "bg-purple-100 text-purple-700 border-purple-200";
      case 'Assignments': return "bg-rose-100 text-rose-700 border-rose-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Teacher data hooks for schedule - only call when user is loaded and has teacherId
  const shouldFetchData = !authLoading && !!user?.teacherId;
  const { upcomingSessions, loading: sessionsLoading, error: sessionsError, refetch: refetchSessions } = useTeacherUpcomingSessions({
    teacherId: shouldFetchData ? user.teacherId : '',
  });

  // Map upcoming sessions to ScheduleEvents
  // Map upcoming sessions to ScheduleEvents and apply filtering
  const scheduleEvents: ScheduleEvent[] = upcomingSessions
    .map(session => ({
      id: session.id || session._id || Math.random().toString(),
      title: session.title || session.className || "Class",
      date: new Date(session.startTime),
      time: format(new Date(session.startTime), "HH:mm"),
      location: session.location || "Online",
      description: session.topic,
      type: (session.type as any) || "class",
      duration: session.duration || 60,
    }))
    .filter(event => {
      const typeMapping: Record<string, string> = {
        'Classes': 'class',
        'Hangouts': 'hangout',
        'Birthdays': 'birthday',
        'Achievements': 'achievement',
        'Assignments': 'assignment'
      };
      return selectedEventTypes.some(t => typeMapping[t] === event.type);
    });

  const { summaryData, loading: summaryLoading, error: summaryError, refetch: refetchSummary } = useTeacherSummary({
    teacherId: shouldFetchData ? user.teacherId : '',
  });

  // Prepare schedule data
  const weekDays = getWeekDays(currentWeek);
  const weekSessions = upcomingSessions.filter(session => {
    // Basic type filtering - assume all sessions are Classes for now
    if (!selectedEventTypes.includes('Classes')) return false;

    const sessionDate = new Date(session.startTime);
    return weekDays.some(day =>
      day.toDateString() === sessionDate.toDateString()
    );
  });

  const handleGoogleSync = async () => {
    toast({ title: "Sync initiated", description: "Checking Google Calendar connection..." });
    try {
      const { data: statusData, error: statusError } = await googleCalendarService.getConnectionStatus();

      if (statusError) {
        throw statusError;
      }

      if (statusData?.connected) {
        toast({ title: "Synced", description: "Schedule updated." });
        refetchSessions();
      } else {
        toast({ title: "Connecting", description: "Redirecting to Google Calendar authorization..." });
        const { data: authData, error: authError } = await googleCalendarService.getAuthUrl();

        if (authError) throw authError;

        if (authData?.authUrl) {
          window.location.href = authData.authUrl;
        }
      }
    } catch (error) {
      console.error("Sync error:", error);
      toast({ title: "Error", description: "Failed to sync with Google Calendar.", variant: "destructive" });
    }
  };

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
    if (user && !authLoading) {
      fetchTeacherProfile();
      fetchTeacherClasses();
      fetchComprehensiveProfile();
    }
  }, [user, authLoading]);

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
    if (!user?.teacherId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {

      const { data, error } = await teacherService.getProfileById(user.teacherId)
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

      const { error } = await teacherService.updateProfile(user.teacherId,
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

      const { error } = await teacherService.deleteProfile(user.teacherId);
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
    if (user && !authLoading) {
      // Refresh classes from API instead of manually adding to the array
      fetchTeacherClasses();
    }

    toast({
      title: "Class created successfully",
      description: "Your new class is now ready for students to enroll.",
    });
    navigate("/teacher-dashboard");
  };

  const fetchTeacherClasses = async () => {
    if (!user?.teacherId) {
      console.error("No teacher ID available");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {

      const { data, error } = await classService.getTeacherClasses(user.teacherId);

      if (error) {
        console.error("Error fetching teacher classes:", error);
        toast({
          title: "Error",
          description: "Failed to load classes. Please try again.",
          variant: "destructive"
        });
      } else if (data) {
        console.log("Loaded teacher classes:", data);
        // Handle response where data might be wrapped in an object (as seen in recent API updates)
        const classesList = Array.isArray(data) ? data : (data as any).classes || [];
        setClasses(classesList);

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

      if (user && !authLoading) {
        // Refresh the classes list
        await fetchTeacherClasses();
      }

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
    if (!user?.teacherId) {
      setIsLoadingProfile(false);
      return;
    }

    setIsLoadingProfile(true);
    try {
      const { data, error } = await teacherService.getProfileById(user.teacherId);
      if (!error && data) {
        setComprehensiveProfile(data);
      }
    } catch (error) {
      console.error("Error fetching comprehensive profile:", error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleQuickSchedule = async () => {
    if (!quickSchedule.classId || !quickSchedule.date || !quickSchedule.time) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields (Class, Date, Time).",
        variant: "destructive"
      });
      return;
    }

    setIsScheduling(true);
    try {
      // 1. Fetch class details to ensure we have the correct ID and context
      const { data: selectedClass, error } = await classService.getById(quickSchedule.classId);
      if (error || !selectedClass) throw new Error(error?.message || "Class not found");

      // 2. Construct Date object
      const startDateTime = new Date(`${quickSchedule.date}T${quickSchedule.time}`);
      const endDateTime = new Date(startDateTime.getTime() + quickSchedule.duration * 60 * 60 * 1000);

      // 3. Prepare DaySchedule
      const dayOfWeek = format(startDateTime, 'EEEE').toLowerCase();

      // 4. Create a new "Session Cohort"
      const newCohortData = {
        name: `Session: ${quickSchedule.type} - ${format(startDateTime, 'MMM d')}`,
        startDate: startDateTime,
        endDate: endDateTime, // same day
        repeatPattern: "custom",
        weeklySchedule: [{
          dayOfWeek: dayOfWeek,
          startTime: quickSchedule.time,
          endTime: format(endDateTime, 'HH:mm'),
          isActive: true
        }],
        enrollment: {
          minimumStudents: 1,
          maximumStudents: 50, // default
          currentStudents: 0
        },
        pricing: {
          pricePerLesson: 0,
          totalLessons: 1
        },
        classDates: [startDateTime],
        createdBy: user?.teacherId
      };

      await classService.addCohort(selectedClass._id || (selectedClass as any).id, { cohort: newCohortData });

      toast({
        title: "Session Scheduled",
        description: "The class session has been successfully added to your schedule.",
      });

      // Refresh data
      refetchSessions();

      // Reset form
      setQuickSchedule({
        ...quickSchedule,
        date: "",
        time: ""
      });

    } catch (error: any) {
      console.error("Scheduling error:", error);
      toast({
        title: "Scheduling Failed",
        description: error.message || "Could not add session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsScheduling(false);
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
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${activeTab === "dashboard"
              ? "bg-kidato-light-blue text-kidato-purple"
              : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link
            to="/teacher-dashboard/classes"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${activeTab === "classes" || activeTab === "viewClass"
              ? "bg-kidato-light-blue text-kidato-purple"
              : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <BookOpen className="mr-3 h-5 w-5" />
            My Classes
          </Link>
          <Link
            to="/teacher-dashboard/students"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${activeTab === "students" || activeTab === "enrollment"
              ? "bg-kidato-light-blue text-kidato-purple"
              : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <Users className="mr-3 h-5 w-5" />
            Students
          </Link>
          <Link
            to="/teacher-dashboard/schedule"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${activeTab === "schedule"
              ? "bg-kidato-light-blue text-kidato-purple"
              : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <Calendar className="mr-3 h-5 w-5" />
            Schedule
          </Link>
          <Link
            to="/teacher-dashboard/messaging"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${activeTab === "messaging"
              ? "bg-kidato-light-blue text-kidato-purple"
              : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <MessageSquare className="mr-3 h-5 w-5" />
            Messages
          </Link>
          {/* Only show Earnings if teacher has classes with enrolled students */}
          {(() => {
            const hasEnrolledStudents = summaryData?.classes?.some(classItem => {
              return (classItem.enrolledStudents || 0) > 0;
            }) || false;

            return hasEnrolledStudents && (
              <Link
                to="/teacher-earnings"
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${activeTab === "earnings"
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
            to="/teacher-dashboard/content"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === "content"
              ? "bg-kidato-purple/10 text-kidato-purple"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
          >
            <BookText className="mr-3 h-5 w-5" />
            Content
          </Link>
          <Link
            to="/teacher-dashboard/settings"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${activeTab === "settings"
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
          {(isLoading || authLoading) && (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading...</p>
            </div>
          )}

          {!isLoading && !authLoading && activeTab === "settings" && isEditing && (
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

          {!isLoading && !authLoading && activeTab === "settings" && showProfessionalForm && (
            <div className="max-w-4xl mx-auto">
              <TeacherProfessionalProfileForm
                onComplete={handleProfessionalProfileComplete}
                onCancel={handleCancelProfessionalProfile}
              />
            </div>
          )}

          {!isLoading && !authLoading && activeTab === "settings" && showClassSetupForm && (
            <div className="max-w-4xl mx-auto">
              <ClassSetupForm
                onComplete={handleCompleteClassSetup}
                onCancel={handleCancelClassSetup}
              />
            </div>
          )}

          {!isLoading && !authLoading && activeTab === "classes" && showCreateClassForm && (
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

          {!isLoading && !authLoading && activeTab === "settings" && !isEditing && !showProfessionalForm && !showClassSetupForm && (
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
                      <IntegrationsTab />
                    </TabsContent>

                    <TabsContent value="notifications">
                      <NotificationSettingsTab />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}

          {!isLoading && !authLoading && activeTab === "dashboard" && (
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

          {!isLoading && !authLoading && activeTab === "students" && !showEnrollStudents && (
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

          {!isLoading && !authLoading && activeTab === "enrollment" && (
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

          {!isLoading && !authLoading && activeTab === "messaging" && (
            <div className="h-[calc(100vh-100px)]">
              <MessagingPlatform />
            </div>
          )}

          {!isLoading && !authLoading && activeTab === "schedule" && (
            <div className="space-y-6">
              <Tabs defaultValue="calendar" className="w-full">
                <div className="flex justify-between items-center mb-6">
                  <TabsList className="bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger value="calendar" className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Calendar</TabsTrigger>
                    <TabsTrigger value="availability" className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">My Availability</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="calendar" className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Main Schedule Area */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50">
                          {/* Calendar View Toggles */}
                          <div className="flex bg-white rounded-lg p-1 border shadow-sm">
                            {(["day", "week", "month"] as const).map((view) => (
                              <button
                                key={view}
                                onClick={() => setScheduleView(view)}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${scheduleView === view
                                  ? "bg-kidato-purple text-white shadow-sm"
                                  : "text-gray-600 hover:bg-gray-50"
                                  }`}
                              >
                                {view.charAt(0).toUpperCase() + view.slice(1)}
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={handleGoogleSync}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Sync
                            </Button>
                            <Button size="sm" onClick={() => navigate("/teacher-dashboard/classes?create=true")}>
                              <Plus className="h-4 w-4 mr-2" />
                              New Class
                            </Button>
                          </div>
                        </div>

                        <div className="p-4">
                          <ScheduleCalendar
                            events={scheduleEvents}
                            view={scheduleView}
                            onEventClick={(event) => {
                              toast({
                                title: event.title,
                                description: `${event.description} at ${event.time}`,
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sidebar - Quick Schedule & Filters */}
                    <div className="w-full md:w-80 flex-shrink-0 space-y-6">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Quick Schedule</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Class Type</Label>
                            <Select
                              value={quickSchedule.type}
                              onValueChange={(val) => setQuickSchedule({ ...quickSchedule, type: val })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Regular class">Regular class</SelectItem>
                                <SelectItem value="Makeup session">Makeup session</SelectItem>
                                <SelectItem value="Trial class">Trial class</SelectItem>
                                <SelectItem value="Assessment">Assessment</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Class</Label>
                            {/* Assuming classes is available in scope */}
                            <Select
                              value={quickSchedule.classId}
                              onValueChange={(val) => setQuickSchedule({ ...quickSchedule, classId: val })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                              <SelectContent>
                                {classes.map((cls: any) => (
                                  <SelectItem key={cls._id || cls.id} value={cls._id || cls.id}>
                                    {cls.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                              <Label>Date</Label>
                              <Input
                                type="date"
                                value={quickSchedule.date}
                                onChange={(e) => setQuickSchedule({ ...quickSchedule, date: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Time</Label>
                              <Input
                                type="time"
                                value={quickSchedule.time}
                                onChange={(e) => setQuickSchedule({ ...quickSchedule, time: e.target.value })}
                              />
                            </div>
                          </div>

                          <Button
                            className="w-full"
                            onClick={handleQuickSchedule}
                            disabled={isScheduling}
                          >
                            {isScheduling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                            Schedule
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Filters</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {['Classes', 'Hangouts', 'Birthdays', 'Achievements', 'Assignments'].map((type) => {
                              const isSelected = selectedEventTypes.includes(type);
                              return (
                                <UiBadge
                                  key={type}
                                  variant="outline"
                                  className={`cursor-pointer transition-colors ${getEventTypeColor(type, isSelected)}`}
                                  onClick={() => handleEventTypeToggle(type)}
                                >
                                  {type}
                                </UiBadge>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="availability">
                  <div className="max-w-4xl mx-auto">
                    <AvailabilityManager />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {!isLoading && !authLoading && activeTab === "content" && (

            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
                <p className="text-gray-500">Manage your educational resources, articles, and videos.</p>
              </div>

              <ContentManager />
            </div>

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
