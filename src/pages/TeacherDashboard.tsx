
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, BookOpen, Users, Calendar, User, Settings, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile form state
  const [fullName, setFullName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [bio, setBio] = useState("");
  const [availability, setAvailability] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile updated",
        description: "Your teacher profile has been successfully updated.",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
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
            onClick={() => setActiveTab("profile")}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
              activeTab === "profile" 
                ? "bg-kidato-light-blue text-kidato-blue" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <User className="mr-3 h-5 w-5" />
            Complete Profile
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
            onClick={() => navigate("/")}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Nav */}
        <header className="bg-white shadow">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              {activeTab === "profile" ? "Complete Your Profile" : 
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

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === "profile" && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Teacher Profile Information</CardTitle>
                <CardDescription>
                  Complete your profile to start teaching on Kidato. This information will be visible to students.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="specialization">Subject Specialization</Label>
                      <Select value={specialization} onValueChange={setSpecialization}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mathematics">Mathematics</SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="history">History</SelectItem>
                          <SelectItem value="geography">Geography</SelectItem>
                          <SelectItem value="computer-science">Computer Science</SelectItem>
                          <SelectItem value="foreign-languages">Foreign Languages</SelectItem>
                          <SelectItem value="art">Art</SelectItem>
                          <SelectItem value="music">Music</SelectItem>
                          <SelectItem value="physical-education">Physical Education</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="educationLevel">Education Level</Label>
                      <Select value={educationLevel} onValueChange={setEducationLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                          <SelectItem value="master">Master's Degree</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                          <SelectItem value="teaching-certificate">Teaching Certificate</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="yearsExperience">Years of Experience</Label>
                        <Input
                          id="yearsExperience"
                          type="number"
                          min="0"
                          value={yearsExperience}
                          onChange={(e) => setYearsExperience(e.target.value)}
                          placeholder="Years of teaching experience"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
                        <Input
                          id="hourlyRate"
                          type="number"
                          min="0"
                          step="0.01"
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(e.target.value)}
                          placeholder="Your hourly rate"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">Biography</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell students about yourself, your teaching experience, and your approach"
                        className="min-h-[120px]"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="availability">Availability</Label>
                      <Textarea
                        id="availability"
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        placeholder="Describe your teaching availability (e.g., weekdays evenings, weekends)"
                        required
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  Skip for Now
                </Button>
                <Button 
                  onClick={handleProfileSubmit} 
                  disabled={isSubmitting}
                  className="bg-kidato-blue hover:bg-kidato-dark-blue"
                >
                  {isSubmitting ? "Saving..." : "Save Profile"}
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome, Teacher!</CardTitle>
                  <CardDescription>
                    Complete your profile to start accepting students.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
                    <p className="font-medium">Your profile is incomplete</p>
                    <p className="text-sm mt-1">Complete your teacher profile to be visible to students.</p>
                    <Button 
                      className="mt-3 bg-amber-600 hover:bg-amber-700"
                      onClick={() => setActiveTab("profile")}
                    >
                      Complete Now
                    </Button>
                  </div>
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

          {(activeTab === "classes" || activeTab === "students" || activeTab === "schedule" || activeTab === "settings") && (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Complete your profile first</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You need to complete your teacher profile before accessing this section
                </p>
                <Button 
                  className="mt-4 bg-kidato-blue hover:bg-kidato-dark-blue"
                  onClick={() => setActiveTab("profile")}
                >
                  Go to Profile
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
