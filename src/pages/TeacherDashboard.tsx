import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, BookOpen, Users, Calendar, User, Settings, LogOut, Edit, Phone, MapPin, Award } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import TeacherProfileForm from "@/components/teacher/TeacherProfileForm";
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
  const [activeTab, setActiveTab] = useState("profile");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileData, setProfileData] = useState<TeacherProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
        const contactData = data.contact as Json;
        const locationData = data.location as Json;
        const nextOfKinData = data.next_of_kin as Json;
        const certificationData = data.certification as Json;
        
        const formattedData: TeacherProfileData = {
          contact: {
            phone: contactData?.phone as string || "",
            email: contactData?.email as string || "",
            alternativePhone: contactData?.alternativePhone as string || "",
          },
          location: {
            address: locationData?.address as string || "",
            apartment: locationData?.apartment as string || "",
            houseNumber: locationData?.houseNumber as string || "",
            city: locationData?.city as string || "",
            county: locationData?.county as string || "",
            postalCode: locationData?.postalCode as string || "",
            coordinates: {
              latitude: locationData?.coordinates?.latitude as number || 0,
              longitude: locationData?.coordinates?.longitude as number || 0,
            },
          },
          nextOfKin: {
            name: nextOfKinData?.name as string || "",
            relationship: nextOfKinData?.relationship as string || "",
            phone: nextOfKinData?.phone as string || "",
          },
          certification: {
            isCertified: certificationData?.isCertified as boolean || false,
            details: certificationData?.details as string || "",
            year: certificationData?.year as string || "",
            institution: certificationData?.institution as string || "",
          },
        };
        
        setProfileData(formattedData);
        setHasProfile(true);
        if (activeTab === "profile" && !isEditing) {
          setActiveTab("dashboard");
        }
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
      setActiveTab("profile");
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
    setActiveTab("profile");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
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
            onClick={() => {
              setActiveTab("profile");
              setIsEditing(true);
            }}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
              activeTab === "profile" && isEditing
                ? "bg-kidato-light-blue text-kidato-blue" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <User className="mr-3 h-5 w-5" />
            {hasProfile ? "Update Profile" : "Complete Profile"}
          </button>
          <button 
            onClick={() => {
              setActiveTab("profile");
              setIsEditing(false);
            }}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
              activeTab === "profile" && !isEditing
                ? "bg-kidato-light-blue text-kidato-blue" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
            disabled={!hasProfile}
          >
            <User className="mr-3 h-5 w-5" />
            View Profile
          </button>
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
              {activeTab === "profile" ? 
                (isEditing ? 
                  (hasProfile ? "Update Your Profile" : "Complete Your Profile") : 
                  "Your Profile") : 
               activeTab === "dashboard" ? "Dashboard" :
               activeTab === "classes" ? "My Classes" :
               activeTab === "students" ? "Students" :
               activeTab === "schedule" ? "Schedule" : "Settings"}
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

          {!isLoading && activeTab === "profile" && isEditing && (
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

          {!isLoading && activeTab === "profile" && !isEditing && hasProfile && (
            <div className="max-w-3xl mx-auto">
              {renderProfileView()}
            </div>
          )}

          {!isLoading && activeTab === "dashboard" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome, {user?.user_metadata?.full_name || "Teacher"}!</CardTitle>
                  <CardDescription>
                    {hasProfile 
                      ? "Your profile is complete. You can now start accepting students."
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
                          setActiveTab("profile");
                          setIsEditing(true);
                        }}
                      >
                        Complete Now
                      </Button>
                    </div>
                  )}
                  {hasProfile && (
                    <div className="p-4 bg-green-50 text-green-800 rounded-md border border-green-200">
                      <p className="font-medium">Your profile is complete!</p>
                      <p className="text-sm mt-1">You are now visible to students looking for tutors.</p>
                      <Button 
                        className="mt-3 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          setActiveTab("profile");
                          setIsEditing(false);
                        }}
                      >
                        View Profile
                      </Button>
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
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-sm text-gray-500">Active classes</p>
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

          {!isLoading && (activeTab === "classes" || activeTab === "students" || activeTab === "schedule" || activeTab === "settings") && !hasProfile && (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Complete your profile first</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You need to complete your teacher profile before accessing this section
                </p>
                <Button 
                  className="mt-4 bg-kidato-blue hover:bg-kidato-dark-blue"
                  onClick={() => {
                    setActiveTab("profile");
                    setIsEditing(true);
                  }}
                >
                  Go to Profile
                </Button>
              </div>
            </div>
          )}

          {!isLoading && (activeTab === "classes" || activeTab === "students" || activeTab === "schedule" || activeTab === "settings") && hasProfile && (
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
  );
};

export default TeacherDashboard;
