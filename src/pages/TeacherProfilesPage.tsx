
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Search, MapPin, BookOpen, Star, Award, GraduationCap, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { teacherService, TeacherProfile } from "@/integrations/api/services/teacher.service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Teacher {
  id: string;
  urlName: string;
  name: string;
  position: string;
  imageSrc: string;
  bio: string;
  subjects: string[];
  rating: number;
  ratingCount: number;
  location: string;
  education: {
    id: string;
    institution: string;
    degree: string;
    dates: string;
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    date: string;
    isVerified: boolean;
  }[];
}

const TeacherProfilesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch teachers with complete profiles
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const { data, error } = await teacherService.getAllProfiles();
        
        if (error) {
          throw new Error(error.message || "Failed to fetch teachers");
        }
        
        if (!data) {
          throw new Error("No data returned from API");
        }

        // Filter to only include teachers with complete profiles
        const completeProfiles = data.filter(teacher => teacher.isProfileComplete);
        
        // Transform data to match our component's expected format
        const formattedTeachers = completeProfiles.map(transformTeacherData);
        
        setTeachers(formattedTeachers);
        setFilteredTeachers(formattedTeachers);
        setError(null);
      } catch (err) {
        console.error("Error fetching teachers:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setTeachers([]);
        setFilteredTeachers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Transform API teacher data to our component format
  const transformTeacherData = (apiTeacher: any): Teacher => {
    console.log("Processing teacher data:", apiTeacher);
    
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

    // Generate URL-friendly name
    const generateUrlName = (name: string): string => {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
    };

    // Get the user's full name
    const name = apiTeacher.user?.fullName || "Teacher";
    
    return {
      id: apiTeacher._id || "",
      urlName: generateUrlName(name),
      name,
      position: extractPosition(),
      imageSrc: apiTeacher.user?._signedProfileImage || "https://via.placeholder.com/150",
      bio: apiTeacher.user?.bio || "Experienced educator passionate about student success.",
      subjects: extractSubjects(),
      rating: apiTeacher.rating || 5.0,
      ratingCount: apiTeacher.totalReviews || 0,
      location: formatLocation(),
      education: formatEducation(),
      certifications: formatCertifications()
    };
  };

  // Filter teachers based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredTeachers(teachers);
      return;
    }
    
    const results = teachers.filter(teacher => 
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      teacher.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.location.toLowerCase().includes(searchTerm.toLowerCase()))
    ;
    setFilteredTeachers(results);
  }, [searchTerm, teachers]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Expert Teachers</h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Discover our community of passionate educators ready to guide your learning journey
            </p>
          </div>
          
          {/* Search bar */}
          <div className="mb-8 max-w-lg mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, subject, or location..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-kidato-blue focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Error message */}
          {error && (
            <Alert variant="destructive" className="mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kidato-blue"></div>
            </div>
          ) : (
            <>
              {/* Teacher grid */}
              {filteredTeachers.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredTeachers.map((teacher) => (
                    <div 
                      key={teacher.id} 
                      className="bg-white overflow-hidden shadow rounded-lg transition-transform hover:shadow-lg hover:-translate-y-1"
                    >
                      <Link to={`/teacher/${teacher.id}`}>
                        <div className="relative h-64">
                          <img 
                            className="w-full h-full object-cover"
                            src={teacher.imageSrc} 
                            alt={teacher.name} 
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://via.placeholder.com/300x200?text=Teacher+Image";
                            }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                            <div className="flex items-center text-white">
                              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                              <span>{teacher.rating}</span>
                              <span className="text-sm ml-1">({teacher.ratingCount} reviews)</span>
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-5 sm:p-6">
                          <h3 className="text-lg font-medium text-gray-900 truncate">{teacher.name}</h3>
                          <p className="text-sm text-gray-500 mb-2 flex items-center">
                            <BookOpen className="h-4 w-4 mr-1 text-kidato-blue" />
                            {teacher.position}
                          </p>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{teacher.bio}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {teacher.subjects.slice(0, 3).map((subject, i) => (
                              <Badge 
                                key={i} 
                                variant="secondary"
                                className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                              >
                                {subject}
                              </Badge>
                            ))}
                          </div>

                          {teacher.education && teacher.education.length > 0 && (
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <GraduationCap className="w-4 h-4 mr-1 text-kidato-blue" />
                              <span className="truncate">{teacher.education[0].degree}</span>
                            </div>
                          )}

                          {teacher.certifications && teacher.certifications.length > 0 && (
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <Award className="w-4 h-4 mr-1 text-kidato-blue" />
                              <span className="truncate">{teacher.certifications[0].name}</span>
                            </div>
                          )}

                          <div className="text-sm text-gray-500 flex items-center mt-3">
                            <MapPin className="w-4 h-4 mr-1 text-kidato-blue" />
                            {teacher.location}
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-4 sm:px-6">
                          <Button className="w-full bg-kidato-blue hover:bg-kidato-dark-blue">
                            View Profile
                          </Button>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium text-gray-900">No teachers found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm 
                      ? "Try adjusting your search criteria."
                      : "There are no teachers with completed profiles available right now."}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TeacherProfilesPage;
