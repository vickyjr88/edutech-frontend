import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, BookOpen, Users, Calendar, User, Settings, LogOut, Edit, Phone, MapPin, Award, CheckCircle2, CircleDashed, Video, PlusCircle, Star, UserPlus, BookText, School, UsersRound, UserRound, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeacherProfileForm from "@/components/teacher/TeacherProfileForm";
import TeacherProfessionalProfileForm from "@/components/teacher/TeacherProfessionalProfileForm";
import ClassSetupForm from "@/components/teacher/ClassSetupForm";
import CreateClassForm from "@/components/teacher/CreateClassForm";
import EnrollStudentsPage from "@/components/teacher/enrollment/EnrollStudentsPage";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/api/client.ts";
import { Json } from "@/integrations/supabase/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileData, setProfileData] = useState<TeacherProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfessionalForm, setShowProfessionalForm] = useState(false);
  const [hasProfessionalProfile, setHasProfessionalProfile] = useState(false);
  const [showClassSetupForm, setShowClassSetupForm] = useState(false);
  const [hasClassesSetup, setHasClassesSetup] = useState(true);
  const [showCreateClassForm, setShowCreateClassForm] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [activeClassTab, setActiveClassTab] = useState("basic");
  const [showEnrollStudents, setShowEnrollStudents] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTeacherProfile();
    }
  }, [user]);

  const fetchTeacherProfile = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') {
          console.error("Error checking profile:", error);
        }
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

      const { error } = await supabase
        .from('teacher_profiles')
        .upsert({
          user_id: user.id,
          contact: profileData.contact,
          location: profileData.location,
          next_of_kin: profileData.nextOfKin,
          certification: profileData.certification,
          updated_at: new Date().toISOString()
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
      setActiveTab("dashboard");
      
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
      
      const { error } = await supabase
        .from('teacher_profiles')
        .delete()
        .eq('user_id', user.id);
      
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
    setIsEditing(true);
    setActiveTab("settings");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleCompleteProfessionalProfile = () => {
    setShowProfessionalForm(true);
    setActiveTab("settings");
  };

  const handleProfessionalProfileComplete = () => {
    setShowProfessionalForm(false);
    setHasProfessionalProfile(true);
    toast({
      title: "Professional profile completed",
      description: "Your professional teacher profile has been successfully created.",
    });
    setActiveTab("dashboard");
  };

  const handleCancelProfessionalProfile = () => {
    setShowProfessionalForm(false);
    setActiveTab("dashboard");
  };

  const handleCompleteClassSetup = () => {
    setShowClassSetupForm(false);
    setHasClassesSetup(true);
    toast({
      title: "Class setup completed",
      description: "Your class settings have been successfully saved.",
    });
    setActiveTab("dashboard");
  };

  const handleCancelClassSetup = () => {
    setShowClassSetupForm(false);
    setActiveTab("dashboard");
  };

  const handleSetupClassSettings = () => {
    setShowClassSetupForm(true);
    setActiveTab("settings");
  };

  const handleCreateClass = () => {
    setShowCreateClassForm(true);
    setActiveTab("classes");
  };

  const handleClassCreated = (classData: any) => {
    setShowCreateClassForm(false);
    setClasses([...classes, { id: Date.now(), ...classData }]);
    toast({
      title: "Class created successfully",
      description: "Your new class is now ready for students to enroll.",
    });
    setActiveTab("dashboard");
  };

  const handleCancelClassCreation = () => {
    setShowCreateClassForm(false);
    setActiveTab("dashboard");
  };

  const handleViewClass = (classItem: any) => {
    setSelectedClass(classItem);
    setActiveTab("viewClass");
    setActiveClassTab("basic");
  };

  const handleBackToClasses = () => {
    setSelectedClass(null);
    setActiveTab("classes");
  };

  const handleEnrollStudents = (classData?: any) => {
    setSelectedClass(classData || null);
    setShowEnrollStudents(true);
    setActiveTab("enrollment");
  };

  const handleRequestReviews = () => {
    setActiveTab("enrollment");
    setShowEnrollStudents(true);
    setTimeout(() => {
      const reviewsTab = document.querySelector('[value="reviews"]') as HTMLElement;
      if (reviewsTab) {
        reviewsTab.click();
      }
    }, 100);
  };

  const renderProfileView = () => {
    if (!profileData) return null;
    
    return (
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Your Teacher Profile</CardTitle>
            <CardDescription>
              This information is visible to potential students
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center" 
            onClick={handleEditProfile}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium flex items-center">
              <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
              Contact Information
            </h3>
            <div className="mt-2 space-y-1 text-sm">
              <p><span className="text-muted-foreground">Phone:</span> {profileData.contact.phone}</p>
              <p><span className="text-muted-foreground">Email:</span> {profileData.contact.email}</p>
              {profileData.contact.alternativePhone && (
                <p><span className="text-muted-foreground">Alternative Phone:</span> {profileData.contact.alternativePhone}</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              Location
            </h3>
            <div className="mt-2 space-y-1 text-sm">
              <p>
                {profileData.location.address}
                {profileData.location.apartment && `, ${profileData.location.apartment}`}
                {profileData.location.houseNumber && `, House ${profileData.location.houseNumber}`}
              </p>
              <p>
                {profileData.location.city}{profileData.location.county && `, ${profileData.location.county}`}
                {profileData.location.postalCode && ` - ${profileData.location.postalCode}`}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium flex items-center">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              Next of Kin
            </h3>
            <div className="mt-2 space-y-1 text-sm">
              <p><span className="text-muted-foreground">Name:</span> {profileData.nextOfKin.name}</p>
              <p><span className="text-muted-foreground">Relationship:</span> {profileData.nextOfKin.relationship}</p>
              <p><span className="text-muted-foreground">Phone:</span> {profileData.nextOfKin.phone}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium flex items-center">
              <Award className="mr-2 h-4 w-4 text-muted-foreground" />
              Teaching Certification
            </h3>
            <div className="mt-2 space-y-1 text-sm">
              {profileData.certification.isCertified ? (
                <>
                  <p><span className="text-muted-foreground">Status:</span> Certified Teacher</p>
                  <p><span className="text-muted-foreground">Details:</span> {profileData.certification.details}</p>
                  <p><span className="text-muted-foreground">Institution:</span> {profileData.certification.institution}</p>
                  <p><span className="text-muted-foreground">Year:</span> {profileData.certification.year}</p>
                </>
              ) : (
                <p>Not certified as a teacher</p>
              )}
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <Button 
              variant="destructive" 
              onClick={handleProfileDelete}
              className="mt-2"
            >
              Delete Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <img 
            src="/lovable-uploads/15671e94-4ac9-490c-95b6-aa4fe6bbc23c.png" 
            alt="Kidato Logo" 
            className="h-8"
          />
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
              activeTab === "dashboard" 
                ? "bg-kidato-light-blue text-kidato-blue" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("classes")}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
              activeTab === "classes" || activeTab === "viewClass"
                ? "bg-kidato-light-blue text-kidato-blue" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <BookOpen className="mr-3 h-5 w-5" />
            My Classes
          </button>
          <button 
            onClick={() => setActiveTab("students")}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
              activeTab === "students" || activeTab === "enrollment"
                ? "bg-kidato-light-blue text-kidato-blue" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Users className="mr-3 h-5 w-5" />
            Students
          </button>
          <button 
            onClick={() => setActiveTab("schedule")}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
              activeTab === "schedule" 
                ? "bg-kidato-light-blue text-kidato-blue" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Calendar className="mr-3 h-5 w-5" />
            Schedule
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
              activeTab === "settings" 
                ? "bg-kidato-light-blue text-kidato-blue" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </button>
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
            <div className="max-w-4xl mx-auto">
              <CreateClassForm
                onSubmit={handleClassCreated}
                onCancel={handleCancelClassCreation}
              />
            </div>
          )}

          {!isLoading && activeTab === "settings" && !isEditing && !showProfessionalForm && !showClassSetupForm && (
            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account settings and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-2">Teacher Profile</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {hasProfile 
                        ? "Your teacher profile information is used to match you with potential students." 
                        : "Complete your teacher profile to be visible to students looking for tutors."}
                    </p>
                    {hasProfile ? (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button 
                          onClick={() => setIsEditing(false)}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <User className="h-4 w-4" />
                          View Profile
                        </Button>
                        <Button 
                          onClick={handleEditProfile}
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit Profile
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={handleEditProfile}
                        className="flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        Complete Profile
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {hasProfile && (
                <div className="max-w-3xl mx-auto">
                  {renderProfileView()}
                </div>
              )}
            </div>
          )}

          {!isLoading && activeTab === "dashboard" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome, {user?.user_metadata?.full_name || "Teacher"}!</CardTitle>
                  <CardDescription>
                    {hasProfile 
                      ? "Your profile is partially complete. Continue with the next steps to start accepting students."
                      : "Complete your profile to start accepting students."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!hasProfile && (
                    <div className="p-4 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
                      <p className="font-medium">Your profile is incomplete</p>
                      <p className="text-sm mt-1">Complete your teacher profile to be visible to students.</p>
                      <Button 
                        className="mt-3 bg-amber-600 hover:bg-amber-700"
                        onClick={() => {
                          setActiveTab("settings");
                          setIsEditing(true);
                        }}
                      >
                        Complete Now
                      </Button>
                    </div>
                  )}
                  {hasProfile && (
                    <div className="space-y-6">
                      <div className="p-4 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
                        <h3 className="font-medium text-lg mb-3">Your Teacher Journey</h3>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-7 w-7 rounded-full bg-green-100 flex items-center justify-center">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">Step 1: Basic Profile</p>
                              <p className="text-sm text-blue-700">Complete! You've set up your basic teacher profile.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center">
                              {hasProfessionalProfile ? 
                                <CheckCircle2 className="h-4 w-4 text-green-600" /> :
                                <CircleDashed className="h-4 w-4 text-amber-600" />
                              }
                            </div>
                            <div>
                              <p className="font-medium">Step 2: Professional Profile</p>
                              <p className="text-sm text-blue-700">
                                {hasProfessionalProfile ? 
                                  "Complete! You've added your professional qualifications." :
                                  "Add your teaching experience, education, and specialties."
                                }
                              </p>
                              {!hasProfessionalProfile && (
                                <Button 
                                  className="mt-2 bg-amber-600 hover:bg-amber-700 text-white"
                                  size="sm"
                                  onClick={handleCompleteProfessionalProfile}
                                >
                                  Complete Now
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center">
                              {hasClassesSetup ? 
                                <CheckCircle2 className="h-4 w-4 text-green-600" /> :
                                <CircleDashed className="h-4 w-4 text-amber-600" />
                              }
                            </div>
                            <div>
                              <p className="font-medium">Step 3: Classroom Setup</p>
                              <p className="text-sm text-blue-700">
                                {hasClassesSetup ? 
                                  "Complete! You've set up your classroom settings." :
                                  "Set up your classroom settings for online teaching."
                                }
                              </p>
                              <Button 
                                className="mt-2 bg-amber-600 hover:bg-amber-700 text-white"
                                size="sm"
                                onClick={handleSetupClassSettings}
                              >
                                {hasClassesSetup ? "Edit Setup" : "Set Up Now"}
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center">
                              {classes.length > 0 ? 
                                <CheckCircle2 className="h-4 w-4 text-green-600" /> : 
                                <CircleDashed className="h-4 w-4 text-amber-600" />
                              }
                            </div>
                            <div>
                              <p className="font-medium">Step 4: Create Your First Class</p>
                              <p className="text-sm text-blue-700">
                                {classes.length > 0 ? 
                                  "Complete! You've created your first class." : 
                                  "Create your first class to start teaching."
                                }
                              </p>
                              <Button 
                                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                                size="sm"
                                onClick={handleCreateClass}
                              >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                {classes.length > 0 ? "Create Another Class" : "Create First Class"}
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center">
                              <CircleDashed className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium">Step 5: Enroll Your Students</p>
                              <p className="text-sm text-gray-600">
                                Invite and enroll students to join your classes.
                              </p>
                              <Button 
                                className="mt-2 bg-purple-600 hover:bg-purple-700 text-white"
                                size="sm"
                                onClick={() => handleEnrollStudents()}
                              >
                                <UserPlus className="mr-2 h-4 w-4" />
                                Enroll Students
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center">
                              <CircleDashed className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium">Step 6: Get Reviews</p>
                              <p className="text-sm text-gray-600">
                                Collect feedback and reviews from your students, parents and supervisors to improve your profile.
                              </p>
                              <Button 
                                className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white"
                                size="sm"
                                onClick={handleRequestReviews}
                              >
                                <Star className="mr-2 h-4 w-4" />
                                Request Reviews
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Classes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{classes.length}</p>
                    <p className="text-sm text-gray-500">Active classes</p>
                    {hasClassesSetup && (
                      <Button 
                        className="mt-4 w-full" 
                        variant="outline"
                        onClick={handleCreateClass}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Class
                      </Button>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-sm text-gray-500">Enrolled students</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Hours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-sm text-gray-500">Teaching hours</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {!isLoading && activeTab === "classes" && !showCreateClassForm && (
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
              
              {classes.length === 0 ? (
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
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {classes.map((classItem: any) => (
                    <Card key={classItem.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleViewClass(classItem)}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{classItem.title}</CardTitle>
                            <CardDescription>
                              {classItem.type === "academic" ? "Academic" : "After School"} - {classItem.subject}
                            </CardDescription>
                          </div>
                          <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            New
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {classItem.description || "No description provided"}
                        </p>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="text-sm">
                            <span className="text-gray-500">Students: </span>
                            <span className="font-medium">0</span>
                          </div>
                          <div className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                            {classItem.type === "academic" ? classItem.gradeLevel : classItem.ageRange}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
                      setShowEnrollStudents(false);
                      setActiveTab("students");
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
            <div className="flex flex-col items-center justify-center bg-white rounded-lg border border-dashed p-12">
              <Calendar className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Schedule Yet</h3>
              <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
                You haven't set up your teaching schedule yet. Create a class first, then schedule lessons.
              </p>
              <Button onClick={handleCreateClass}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Class
              </Button>
            </div>
          )}

          {!isLoading && activeTab === "viewClass" && selectedClass && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Button variant="outline" size="sm" onClick={handleBackToClasses}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Classes
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>{selectedClass.title}</CardTitle>
                  <CardDescription>
                    {selectedClass.type === "academic" ? "Academic" : "After School"} - {selectedClass.subject}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeClassTab} onValueChange={setActiveClassTab}>
                    <TabsList className="w-full">
                      <TabsTrigger value="basic" className="flex items-center">
                        <BookText className="h-4 w-4 mr-2" />
                        Basic Info
                      </TabsTrigger>
                      <TabsTrigger value="lessons" className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Lesson Plans
                      </TabsTrigger>
                      <TabsTrigger value="cohorts" className="flex items-center">
                        <School className="h-4 w-4 mr-2" />
                        Cohorts
                      </TabsTrigger>
                      <TabsTrigger value="team" className="flex items-center">
                        <UsersRound className="h-4 w-4 mr-2" />
                        Teaching Team
                      </TabsTrigger>
                      <TabsTrigger value="students" className="flex items-center">
                        <UserRound className="h-4 w-4 mr-2" />
                        Parents & Students
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="mt-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium">Class Details</h3>
                          <div className="mt-2 space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Class Type</p>
                                <p className="font-medium">{selectedClass.type === "academic" ? "Academic" : "After School"}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Subject</p>
                                <p className="font-medium">{selectedClass.subject}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">{selectedClass.type === "academic" ? "Grade Level" : "Age Range"}</p>
                                <p className="font-medium">{selectedClass.gradeLevel || selectedClass.ageRange || "Not specified"}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium">Class Summary</h3>
                          <p className="mt-2 text-gray-700">{selectedClass.description || "No summary provided"}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium">Learning Objectives</h3>
                          <ul className="mt-2 list-disc pl-5 space-y-1">
                            {selectedClass.objectives ? (
                              selectedClass.objectives.map((objective: string, index: number) => (
                                <li key={index} className="text-gray-700">{objective}</li>
                              ))
                            ) : (
                              <li className="text-gray-500">No learning objectives specified</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="lessons" className="mt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Lesson Plans</h3>
                          <Button size="sm">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Lesson
                          </Button>
                        </div>
                        
                        <div className="bg-gray-50 border rounded-md p-8 text-center">
                          <BookOpen className="h-12 w-12 mx-auto text-gray-400" />
                          <h3 className="mt-4 text-lg font-medium">No Lesson Plans Yet</h3>
                          <p className="mt-2 text-gray-500 max-w-md mx-auto">
                            Create lesson plans to organize your teaching curriculum and share with students.
                          </p>
                          <Button className="mt-4">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Create First Lesson
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="cohorts" className="mt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Class Cohorts</h3>
                          <Button size="sm">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Create Cohort
                          </Button>
                        </div>
                        
                        <div className="bg-gray-50 border rounded-md p-8 text-center">
                          <School className="h-12 w-12 mx-auto text-gray-400" />
                          <h3 className="mt-4 text-lg font-medium">No Cohorts Created</h3>
                          <p className="mt-2 text-gray-500 max-w-md mx-auto">
                            Organize your students into cohorts for better class management and scheduling.
                          </p>
                          <Button className="mt-4">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Create First Cohort
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="team" className="mt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Teaching Team</h3>
                          <Button size="sm">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Team Member
                          </Button>
                        </div>
                        
                        <div className="bg-gray-50 border rounded-md p-8 text-center">
                          <UsersRound className="h-12 w-12 mx-auto text-gray-400" />
                          <h3 className="mt-4 text-lg font-medium">No Team Members Yet</h3>
                          <p className="mt-2 text-gray-500 max-w-md mx-auto">
                            Add teaching assistants or co-teachers to help you manage this class.
                          </p>
                          <Button className="mt-4">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add First Team Member
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="students" className="mt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Parents & Students</h3>
                          <Button size="sm">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Invite Students
                          </Button>
                        </div>
                        
                        <div className="bg-gray-50 border rounded-md p-8 text-center">
                          <UserRound className="h-12 w-12 mx-auto text-gray-400" />
                          <h3 className="mt-4 text-lg font-medium">No Students Enrolled</h3>
                          <p className="mt-2 text-gray-500 max-w-md mx-auto">
                            Invite parents and students to enroll in this class.
                          </p>
                          <Button className="mt-4">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Invite First Student
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
