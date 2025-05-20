import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Home, BookOpen, Users, Calendar, User, Settings, LogOut, Edit, Phone, MapPin, Award, CheckCircle2, CircleDashed, Video, PlusCircle, Star, UserPlus, BookText, School, UsersRound, UserRound, ChevronLeft, Loader2, DollarSign, FileText, Badge } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeacherProfileForm from "@/components/teacher/TeacherProfileForm";
import TeacherProfessionalProfileForm from "@/components/teacher/TeacherProfessionalProfileForm";
import ClassSetupForm from "@/components/teacher/ClassSetupForm";
import EnhancedClassSetup from "@/components/teacher/class-setup/EnhancedClassSetup";
import TeacherClassView from "@/components/teacher/class-view/TeacherClassView";
import CreateClassForm from "@/components/teacher/CreateClassForm"; // Kept for backwards compatibility
import EnrollStudentsPage from "@/components/teacher/enrollment/EnrollStudentsPage";
import { useAuth } from "@/contexts/AuthContext";
import {teacherService} from "@/integrations/api/services/teacher.service.ts";
import {classService} from "@/integrations/api/services/class.service.ts";

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

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  
  // Parse the active tab from the URL
  const getTabFromPath = () => {
    const path = location.pathname;
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
    }
  }, [user]);

  const fetchTeacherProfile = async () => {
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
    navigate("/teacher-dashboard/settings?edit=true");
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
    navigate(`/teacher-dashboard/students?enroll=true&tab=reviews`);
    setTimeout(() => {
      const reviewsTab = document.querySelector('[value="reviews"]') as HTMLElement;
      if (reviewsTab) {
        reviewsTab.click();
      }
    }, 100);
  };

  const renderProfileView = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Teacher Profile</CardTitle>
          <CardDescription>
            Your professional teaching profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {profileData && (
              <>
                {/* Contact Information */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <Phone className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="text-lg font-medium">Contact Information</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Phone</Label>
                      <p className="mt-1">{profileData.contact.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="mt-1">{profileData.contact.email || "Not provided"}</p>
                    </div>
                    <div>
                      <Label>Alternative Phone</Label>
                      <p className="mt-1">{profileData.contact.alternativePhone || "Not provided"}</p>
                    </div>
                  </div>
                </div>

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
                ? "bg-kidato-light-blue text-kidato-blue" 
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
                ? "bg-kidato-light-blue text-kidato-blue" 
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
                ? "bg-kidato-light-blue text-kidato-blue" 
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
                ? "bg-kidato-light-blue text-kidato-blue" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Calendar className="mr-3 h-5 w-5" />
            Schedule
          </Link>
          <Link 
            to="/teacher-earnings"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
              activeTab === "earnings" 
                ? "bg-kidato-light-blue text-kidato-blue" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <DollarSign className="mr-3 h-5 w-5" />
            Earnings
          </Link>
          <Link 
            to="/teacher-dashboard/settings"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
              activeTab === "settings" 
                ? "bg-kidato-light-blue text-kidato-blue" 
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
              {activeTab === "dashboard" ? "Dashboard" :
               activeTab === "classes" ? (showCreateClassForm ? "Create New Class" : "My Classes") :
               activeTab === "viewClass" ? "Class Details" :
               activeTab === "students" ? "Students" :
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
                      {!hasProfile ? (
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
              {!hasProfile ? (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
                    <h2 className="text-3xl font-bold mb-4">Welcome to Kidato!</h2>
                    <p className="text-xl opacity-90">Complete your profile to start your teaching journey</p>
                  </div>
                  <div className="p-8">
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-3 text-gray-800">First Step: Complete Your Teacher Profile</h3>
                      <p className="text-gray-600 mb-4">Set up your professional profile to connect with students who match your teaching style and expertise.</p>
                    </div>
                    <Button 
                      className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700"
                      onClick={() => navigate("/teacher-dashboard/settings?edit=true")}
                    >
                      <User className="mr-2 h-5 w-5" />
                      Complete Your Profile
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main metrics */}
                    <Card className="col-span-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-none shadow-md">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-2xl text-blue-900">Welcome back, {user?.full_name || "Teacher"}!</CardTitle>
                            <CardDescription className="text-blue-700 mt-1 text-base">
                              Here's an overview of your teaching business
                            </CardDescription>
                          </div>
                          <Button 
                            onClick={handleCreateClass}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create New Class
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-2">
                          <div className="bg-white p-5 rounded-xl shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-500">Classes</span>
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <BookOpen className="h-4 w-4 text-blue-600" />
                              </div>
                            </div>
                            <span className="text-3xl font-bold text-gray-800">{classes.length}</span>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <span>{classes.filter((c: any) => c.isPublished).length} published</span>
                              <span className="mx-1">•</span>
                              <span>{classes.filter((c: any) => !c.isPublished).length} drafts</span>
                            </div>
                          </div>
                          
                          <div className="bg-white p-5 rounded-xl shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-500">Students</span>
                              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <Users className="h-4 w-4 text-purple-600" />
                              </div>
                            </div>
                            <span className="text-3xl font-bold text-gray-800">0</span>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <span>0 active</span>
                              <span className="mx-1">•</span>
                              <span>0 waiting</span>
                            </div>
                          </div>
                          
                          <div className="bg-white p-5 rounded-xl shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-500">Earnings</span>
                              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <line x1="12" y1="8" x2="12" y2="16"></line>
                                  <line x1="8" y1="12" x2="16" y2="12"></line>
                                </svg>
                              </div>
                            </div>
                            <span className="text-3xl font-bold text-gray-800">$0</span>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <span>This month</span>
                            </div>
                          </div>
                          
                          <div className="bg-white p-5 rounded-xl shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-500">Rating</span>
                              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                <Star className="h-4 w-4 text-yellow-600" />
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="text-3xl font-bold text-gray-800">0</span>
                              <div className="flex ml-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 text-gray-300" />
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <span>0 reviews</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Action cards section */}
                    <div className="lg:col-span-3 grid grid-cols-1 gap-6">
                      {/* Class management card */}
                      <Card className="border-t-4 border-t-blue-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-xl flex items-center text-gray-800">
                            <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                            Class Management
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {classes.length === 0 ? (
                            <div className="bg-blue-50 rounded-lg p-6 text-center">
                              <BookOpen className="h-12 w-12 mx-auto text-blue-300 mb-3" />
                              <h3 className="text-lg font-medium text-gray-800 mb-2">No Classes Created Yet</h3>
                              <p className="text-gray-600 mb-4">Start your teaching journey by creating your first class.</p>
                              <Button 
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={handleCreateClass}
                              >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Your First Class
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="font-medium text-gray-700">Recent Classes</h3>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => navigate("/teacher-dashboard/classes")}
                                >
                                  View All
                                </Button>
                              </div>
                              <div className="space-y-3">
                                {classes.slice(0, 3).map((classItem: any) => {
                                  const classId = classItem._id || classItem.id;
                                  const isPublished = classItem.isPublished;
                                  
                                  return (
                                    <div 
                                      key={classId}
                                      className="border rounded-lg overflow-hidden"
                                    >
                                      <div 
                                        className="p-3 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                                        onClick={() => handleViewClass(classItem)}
                                      >
                                        <div>
                                          <h4 className="font-medium">{classItem.title}</h4>
                                          <p className="text-sm text-gray-500">
                                            {classItem.type === "academic" ? classItem.gradeLevel : classItem.ageRange} - {classItem.subject}
                                          </p>
                                        </div>
                                        <div className={`px-2 py-1 text-xs rounded-full ${
                                          isPublished ? 
                                            "bg-green-100 text-green-800" : 
                                            "bg-amber-100 text-amber-800"
                                        }`}>
                                          {isPublished ? "Published" : "Draft"}
                                        </div>
                                      </div>
                                      
                                      {isPublished && (
                                        <div className="bg-purple-50 px-3 py-2 border-t flex justify-between items-center">
                                          <span className="text-xs text-purple-700">Student enrollments: {classItem.enrollment?.current || 0}</span>
                                          <Button 
                                            size="sm" 
                                            variant="ghost" 
                                            className="text-purple-700 hover:bg-purple-100 hover:text-purple-800 p-1 h-7"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleEnrollStudents(classItem);
                                            }}
                                          >
                                            <UserPlus className="h-4 w-4 mr-1" />
                                            <span className="text-xs">Invite Students</span>
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="mt-5 flex justify-end">
                                <Button 
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={handleCreateClass}
                                >
                                  <PlusCircle className="mr-2 h-4 w-4" />
                                  Create New Class
                                </Button>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>

                      {/* Published Classes Status Card */}
                      <Card className="border-t-4 border-t-purple-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-xl flex items-center text-gray-800">
                            <Users className="mr-2 h-5 w-5 text-purple-600" />
                            Published Classes & Enrollment
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {classes.filter((c: any) => c.isPublished).length === 0 ? (
                            <div className="bg-purple-50 rounded-lg p-6 text-center">
                              <Users className="h-12 w-12 mx-auto text-purple-300 mb-3" />
                              <h3 className="text-lg font-medium text-gray-800 mb-2">No Published Classes Yet</h3>
                              <p className="text-gray-600 mb-4">You need to publish your classes before students can enroll.</p>
                              <Button 
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                onClick={() => navigate("/teacher-dashboard/classes")}
                                disabled={classes.length === 0}
                              >
                                <BookOpen className="mr-2 h-4 w-4" />
                                Go to My Classes
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex justify-between items-center mb-3">
                                <h3 className="font-medium text-gray-700">Published Classes ({classes.filter((c: any) => c.isPublished).length})</h3>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-purple-700 border-purple-200"
                                  onClick={() => handleEnrollStudents()}
                                >
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  Manage Enrollment
                                </Button>
                              </div>
                              
                              <div className="p-4 bg-purple-50 rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <h4 className="font-medium text-gray-800">Student Invitations</h4>
                                    <p className="text-sm text-gray-600">Invite students to join your published classes</p>
                                  </div>
                                  <div className="text-2xl font-bold text-purple-800">0</div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Button 
                                    size="sm" 
                                    className="bg-purple-600 hover:bg-purple-700 text-xs"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                    Share Link
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    className="bg-purple-600 hover:bg-purple-700 text-xs"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                      <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                    Email Invite
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    className="bg-purple-600 hover:bg-purple-700 text-xs"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                    Request Reviews
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Side column */}
                    <div className="lg:col-span-1 space-y-6">
                      {/* Earnings card */}
                      <Card className="border-t-4 border-t-green-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-xl flex items-center text-gray-800">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-600">
                              <line x1="12" y1="1" x2="12" y2="23"></line>
                              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                            </svg>
                            Earnings
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-4">
                            <p className="text-4xl font-bold text-gray-800 mb-1">$0.00</p>
                            <p className="text-sm text-gray-500">Total earnings</p>
                            <div className="mt-6">
                              <Button 
                                variant="outline" 
                                className="w-full border-green-200 hover:bg-green-50 text-green-700"
                                onClick={() => navigate("/teacher-earnings")}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                  <line x1="1" y1="10" x2="23" y2="10"></line>
                                </svg>
                                View Earnings
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Reviews card */}
                      <Card className="border-t-4 border-t-yellow-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-xl flex items-center text-gray-800">
                            <Star className="mr-2 h-5 w-5 text-yellow-600" />
                            Feedback & Rating
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-2">
                            <div className="flex justify-center mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-8 w-8 text-gray-200" />
                              ))}
                            </div>
                            <p className="text-sm text-gray-500 mb-4">No reviews yet</p>
                            
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Review Goal</h4>
                              <div className="flex items-center justify-center">
                                <div className="h-3 w-full max-w-[200px] bg-gray-200 rounded-full">
                                  <div className="h-3 bg-yellow-500 rounded-full" style={{ width: "0%" }}></div>
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-700">0/10</span>
                              </div>
                            </div>
                            
                            <Button 
                              className="w-full bg-yellow-600 hover:bg-yellow-700"
                              onClick={handleRequestReviews}
                            >
                              <Star className="mr-2 h-4 w-4" />
                              Request Reviews
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  {/* Quick actions & information section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">Teaching Resources</h3>
                            <p className="text-sm text-gray-600 mt-1">Access teaching materials and tools</p>
                            <Button variant="link" className="text-blue-600 p-0 mt-2">
                              Browse Resources
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-none hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">Grow Your Business</h3>
                            <p className="text-sm text-gray-600 mt-1">Tips to attract more students</p>
                            <Button variant="link" className="text-purple-600 p-0 mt-2">
                              View Guide
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-none hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                              <circle cx="12" cy="8" r="7"></circle>
                              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">Certification</h3>
                            <p className="text-sm text-gray-600 mt-1">Enhance your teacher profile</p>
                            <Button variant="link" className="text-green-600 p-0 mt-2">
                              Get Certified
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-none hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-full bg-yellow-600 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M12 16v-4"></path>
                              <path d="M12 8h.01"></path>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">Help & Support</h3>
                            <p className="text-sm text-gray-600 mt-1">Get assistance with your account</p>
                            <Button variant="link" className="text-yellow-600 p-0 mt-2">
                              Contact Support
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "classes" && !showCreateClassForm && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">My Classes</h2>
                {hasClassesSetup && (
                  <Button onClick={handleCreateClass}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Class
                  </Button>
                )}
              </div>
              
              {isLoading && (
                <div className="flex justify-center py-8">
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-3" />
                    <p className="text-gray-600">Loading your classes...</p>
                  </div>
                </div>
              )}
              
              {!isLoading && classes.length === 0 ? (
                <div className="flex flex-col items-center justify-center bg-white rounded-lg border border-dashed p-12">
                  <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Classes Yet</h3>
                  <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
                    You haven't created any classes yet. Create your first class to start teaching and accepting students.
                  </p>
                  {hasClassesSetup ? (
                    <Button onClick={handleCreateClass}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Your First Class
                    </Button>
                  ) : (
                    <Button onClick={handleSetupClassSettings}>
                      Set Up Your Classroom First
                    </Button>
                  )}
                </div>
              ) : !isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {classes.map((classItem: any) => {
                    // Handle both formats - API returns _id while local format might use id
                    const classId = classItem._id || classItem.id;
                    // Get enrollment data safely
                    const currentEnrollment = classItem.enrollment?.current || 0;
                    const statusBadge = 
                      classItem.isPublished ? 
                        <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Published
                        </div> : 
                        <div className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                          Draft
                        </div>;
                    
                    return (
                      <Card key={classId} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleViewClass(classItem)}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{classItem.title}</CardTitle>
                              <CardDescription>
                                {classItem.type === "academic" ? "Academic" : "After School"} - {classItem.subject}
                              </CardDescription>
                            </div>
                            {statusBadge}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {classItem.description || "No description provided"}
                          </p>
                          <div className="mt-4 flex justify-between items-center">
                            <div className="text-sm">
                              <span className="text-gray-500">Students: </span>
                              <span className="font-medium">{currentEnrollment}</span>
                            </div>
                            <div className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                              {classItem.type === "academic" ? classItem.gradeLevel : classItem.ageRange}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {!isLoading && activeTab === "students" && !showEnrollStudents && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">My Students</h2>
                <Button onClick={() => handleEnrollStudents()} className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Enroll Students
                </Button>
              </div>
              
              <div className="flex flex-col items-center justify-center bg-white rounded-lg border border-dashed p-12">
                <Users className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Students Yet</h3>
                <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
                  You haven't enrolled any students yet. Start enrolling students to your classes.
                </p>
                <Button onClick={() => handleEnrollStudents()} className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Enroll Your First Student
                </Button>
              </div>
            </div>
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
            <div className="space-y-6">
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
                      {classes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center bg-sky-50 rounded-lg p-12 text-center">
                          <Calendar className="h-16 w-16 text-sky-300 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-1">No Classes to Schedule</h3>
                          <p className="text-sm text-gray-500 mb-6 max-w-md">
                            You need to create and publish classes before you can schedule teaching sessions.
                          </p>
                          <Button 
                            className="bg-sky-600 hover:bg-sky-700"
                            onClick={handleCreateClass}
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Your First Class
                          </Button>
                        </div>
                      ) : (
                        <div className="mt-2">
                          {/* Calendar week view */}
                          <div className="border rounded-md overflow-hidden">
                            {/* Week navigation */}
                            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                                    <path d="m15 18-6-6 6-6"/>
                                  </svg>
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 text-xs">
                                  Today
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                                    <path d="m9 18 6-6-6-6"/>
                                  </svg>
                                </Button>
                              </div>
                              <h3 className="text-sm font-medium">May 19 - May 25, 2024</h3>
                              <div></div>
                            </div>
                            
                            {/* Days of the week */}
                            <div className="grid grid-cols-7 text-center border-b bg-gray-50">
                              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                                <div key={i} className="py-2 text-xs font-medium">
                                  <div>{day}</div>
                                  <div className={`text-sm mt-1 ${i === 2 ? "h-6 w-6 rounded-full bg-sky-600 text-white flex items-center justify-center mx-auto" : ""}`}>
                                    {i + 19}
                                  </div>
                                </div>
                              ))}
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
                                {/* Sample day columns */}
                                {Array(7).fill(0).map((_, dayIndex) => (
                                  <div key={dayIndex} className="relative border-l first:border-l-0 h-full">
                                    {/* Sample events */}
                                    {dayIndex === 2 && (
                                      <div className="absolute top-0 left-1 right-1 h-[120px] mt-2 rounded-md bg-blue-100 border border-blue-200 p-2 overflow-hidden">
                                        <div className="text-xs font-medium text-blue-800">Math Class</div>
                                        <div className="text-xs text-blue-700">9:00am - 10:00am</div>
                                        <div className="text-xs text-blue-600 mt-1">Grade 7</div>
                                      </div>
                                    )}
                                    {dayIndex === 2 && (
                                      <div className="absolute top-[240px] left-1 right-1 h-[120px] rounded-md bg-purple-100 border border-purple-200 p-2 overflow-hidden">
                                        <div className="text-xs font-medium text-purple-800">Science Lab</div>
                                        <div className="text-xs text-purple-700">1:00pm - 2:00pm</div>
                                        <div className="text-xs text-purple-600 mt-1">Grade 5</div>
                                      </div>
                                    )}
                                    {dayIndex === 4 && (
                                      <div className="absolute top-[120px] left-1 right-1 h-[120px] rounded-md bg-green-100 border border-green-200 p-2 overflow-hidden">
                                        <div className="text-xs font-medium text-green-800">English Literature</div>
                                        <div className="text-xs text-green-700">11:00am - 12:00pm</div>
                                        <div className="text-xs text-green-600 mt-1">Grade 8</div>
                                      </div>
                                    )}
                                    {dayIndex === 5 && (
                                      <div className="absolute top-[360px] left-1 right-1 h-[120px] rounded-md bg-amber-100 border border-amber-200 p-2 overflow-hidden">
                                        <div className="text-xs font-medium text-amber-800">Art Class</div>
                                        <div className="text-xs text-amber-700">3:00pm - 4:00pm</div>
                                        <div className="text-xs text-amber-600 mt-1">Grade 6</div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
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
                              <option>Math Grade 7</option>
                              <option>Science Grade 5</option>
                              <option>English Grade 8</option>
                              <option>Art Grade 6</option>
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
                        <div className="bg-blue-50 rounded-lg overflow-hidden border border-blue-100">
                          <div className="p-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-blue-800">Math Class</h4>
                              <div className="text-xs px-2 py-1 bg-blue-100 rounded-full text-blue-700">Today</div>
                            </div>
                            <div className="flex items-start mt-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-blue-700 mt-0.5">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 6v6l4 2"></path>
                              </svg>
                              <div className="text-sm text-blue-700">9:00am - 10:00am</div>
                            </div>
                            <div className="flex items-start mt-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-blue-700 mt-0.5">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                              </svg>
                              <div className="text-sm text-blue-700">Room 203, Main Building</div>
                            </div>
                            <div className="flex items-start mt-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-blue-700 mt-0.5">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                              </svg>
                              <div className="text-sm text-blue-700">12 students</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-end bg-blue-100 px-3 py-2 text-xs">
                            <Button size="sm" variant="ghost" className="h-7 text-xs">Edit</Button>
                            <Button size="sm" variant="ghost" className="h-7 text-xs">Cancel</Button>
                            <Button size="sm" className="h-7 bg-blue-600 hover:bg-blue-700 text-xs">Start Class</Button>
                          </div>
                        </div>
                        
                        <div className="bg-purple-50 rounded-lg overflow-hidden border border-purple-100">
                          <div className="p-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-purple-800">Science Lab</h4>
                              <div className="text-xs px-2 py-1 bg-purple-100 rounded-full text-purple-700">Today</div>
                            </div>
                            <div className="flex items-start mt-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-purple-700 mt-0.5">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 6v6l4 2"></path>
                              </svg>
                              <div className="text-sm text-purple-700">1:00pm - 2:00pm</div>
                            </div>
                            <div className="flex items-start mt-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-purple-700 mt-0.5">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                              </svg>
                              <div className="text-sm text-purple-700">Science Lab 4</div>
                            </div>
                            <div className="flex items-start mt-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-purple-700 mt-0.5">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                              </svg>
                              <div className="text-sm text-purple-700">8 students</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-end bg-purple-100 px-3 py-2 text-xs">
                            <Button size="sm" variant="ghost" className="h-7 text-xs">Edit</Button>
                            <Button size="sm" variant="ghost" className="h-7 text-xs">Cancel</Button>
                            <Button size="sm" className="h-7 bg-purple-600 hover:bg-purple-700 text-xs">Prepare Lab</Button>
                          </div>
                        </div>
                        
                        <div className="pt-2 flex justify-center">
                          <Button variant="link" className="text-emerald-600">
                            View all upcoming classes
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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

          {!isLoading && activeTab === "viewClass" && selectedClass && (
            <div className="space-y-4">
              <div className="flex items-center">
                <Button variant="outline" size="sm" onClick={handleBackToClasses}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Classes
                </Button>
              </div>
              <TeacherClassView classId={selectedClass._id || selectedClass.id} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
