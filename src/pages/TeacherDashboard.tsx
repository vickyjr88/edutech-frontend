import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, BookOpen, Users, Calendar, User, Settings, LogOut, Edit, Phone, MapPin, Award, CheckCircle2, CircleDashed, Video, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TeacherProfileForm from "@/components/teacher/TeacherProfileForm";
import TeacherProfessionalProfileForm from "@/components/teacher/TeacherProfessionalProfileForm";
import ClassSetupForm from "@/components/teacher/ClassSetupForm";
import CreateClassForm from "@/components/teacher/CreateClassForm";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

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
  const [hasClassesSetup, setHasClassesSetup] = useState(false);
  const [showCreateClassForm, setShowCreateClassForm] = useState(false);
  const [classes, setClasses] = useState([]);

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
    // Simulate adding the new class to the classes array
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
              activeTab === "classes" 
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
              activeTab === "students" 
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
               activeTab === "students" ? "Students" :
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
                              {hasProfile && !hasClassesSetup && (
                                <Button 
                                  className="mt-2 bg-amber-600 hover:bg-amber-700 text-white"
                                  size="sm"
                                  onClick={handleSetupClassSettings}
                                >
                                  Set Up Now
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center">
                              {hasClassesSetup ? 
                                (classes.length > 0 ? 
                                  <CheckCircle2 className="h-4 w-4 text-green-600" /> : 
                                  <CircleDashed className="h-4 w-4 text-blue-600" />) : 
                                <CircleDashed className="h-4 w-4 text-gray-400" />
                              }
                            </div>
                            <div>
                              <p className="font-medium text-gray-600">Step 4: Create Your First Class</p>
                              <p className="text-sm text-gray-500">
                                {hasClassesSetup ? 
                                  (classes.length > 0 ? 
                                    "Complete! You've created your first class." : 
                                    "Create your first class to start teaching.") : 
                                  "Start teaching and earning income."
                                }
                              </p>
                              {hasClassesSetup && classes.length === 0 && (
                                <Button 
                                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                                  size="sm"
                                  onClick={handleCreateClass}
                                >
                                  <PlusCircle className="mr-2 h-4 w-4" />
                                  Create First Class
                                </Button>
                              )}
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
                    <Card key={classItem.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{classItem.title}</CardTitle>
                            <CardDescription>
                              {classItem.type === "academic" ? "Academic" : "After School"} - {classItem.subject}
                            </CardDescription>
                          </div>
                          <div className="px-2 py-1 rounded-full text-xs uppercase font-semibold bg-blue-100 text-blue-800">
                            New
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 line-clamp-3 mb-4">
                          {classItem.description}
                        </p>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span className="flex items-center">
                            <Users className="mr-1 h-4 w-4" /> 
                            0/{classItem.maxStudents}
                          </span>
                          <span>
                            Grade: {classItem.gradeLevel}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {!isLoading && (activeTab === "students" || activeTab === "schedule") && !hasProfile && (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Complete your profile first</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You need to complete your teacher profile before accessing this section
                </p>
                <Button 
                  className="mt-4 bg-kidato-blue hover:bg-kidato-dark-blue"
                  onClick={() => {
                    setActiveTab("settings");
                    setIsEditing(true);
                  }}
                >
                  Go to Profile
                </Button>
              </div>
            </div>
          )}

          {!isLoading && (activeTab === "students" || activeTab === "schedule") && hasProfile && (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Coming Soon</h3>
                <p className="mt-1 text-sm text-gray-500">
                  This feature is currently under development
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
