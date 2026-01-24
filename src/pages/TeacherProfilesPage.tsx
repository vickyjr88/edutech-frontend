
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Search, MapPin, BookOpen, Star, Award, GraduationCap, AlertCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { teacherService, TeacherProfile } from "@/integrations/api/services/teacher.service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Teacher {
  id: string;
  urlName: string;
  name: string;
  position: string;
  imageSrc: string;
  bio: string;
  subjects: string[];
  curriculums: string[];
  gradeLevels: string[];
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
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [curriculumFilter, setCurriculumFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [availDay, setAvailDay] = useState("all");
  const [availStart, setAvailStart] = useState("");
  const [availEnd, setAvailEnd] = useState("");

  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter options
  const [activeCurricula, setActiveCurricula] = useState<any[]>([]);
  const [activeSubjects, setActiveSubjects] = useState<any[]>([]);
  const [activeGradeLevels, setActiveGradeLevels] = useState<any[]>([]);

  // Fetch filter options
  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const [curriculaRes, subjectsRes, gradesRes] = await Promise.all([
          teacherService.getActiveCurricula(),
          teacherService.getActiveSubjects(),
          teacherService.getActiveGradeLevels()
        ]);

        if (curriculaRes.data) setActiveCurricula(curriculaRes.data);
        if (subjectsRes.data) setActiveSubjects(subjectsRes.data);
        if (gradesRes.data) setActiveGradeLevels(gradesRes.data);
      } catch (e) {
        console.error("Failed to fetch teaching configs", e);
      }
    };
    fetchConfigs();
  }, []);

  // Fetch teachers with filters
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const filters = {
          search: searchTerm,
          subject: subjectFilter,
          curriculum: curriculumFilter,
          grade: gradeFilter,
          availabilityDay: availDay,
          availabilityStart: availStart,
          availabilityEnd: availEnd
        };

        const { data, error } = await teacherService.getAllProfiles(user?.studentId, filters);

        if (error) {
          throw new Error(error.message || "Failed to fetch teachers");
        }

        if (!data) {
          throw new Error("No data returned from API");
        }

        // Transform data to match our component's expected format
        const formattedTeachers = data.map(transformTeacherData);

        setTeachers(formattedTeachers);
        setError(null);
      } catch (err) {
        console.error("Error fetching teachers:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search term
    const timeoutId = setTimeout(() => {
      fetchTeachers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [user?.studentId, searchTerm, subjectFilter, curriculumFilter, gradeFilter, availDay, availStart, availEnd]);

  // Transform API teacher data to our component format
  const transformTeacherData = (apiTeacher: any): Teacher => {
    console.log("Processing teacher data:", apiTeacher);
    console.log("Name fields available:", {
      user_fullName: apiTeacher.user?.fullName,
      fullName: apiTeacher.fullName,
      name: apiTeacher.name,
      user_firstName_lastName: `${apiTeacher.user?.firstName} ${apiTeacher.user?.lastName}`,
      firstName_lastName: `${apiTeacher.firstName} ${apiTeacher.lastName}`
    });
    console.log("Bio fields available:", {
      user_bio: apiTeacher.user?.bio,
      bio: apiTeacher.bio,
      description: apiTeacher.description,
      summary: apiTeacher.summary,
      about: apiTeacher.about
    });
    console.log("Position fields available:", {
      experience: apiTeacher.experience,
      position: apiTeacher.position,
      role: apiTeacher.role,
      title: apiTeacher.title,
      yearsOfExperience: apiTeacher.yearsOfExperience
    });
    console.log("Image fields available:", {
      user_signedProfileImage: apiTeacher.user?._signedProfileImage,
      root_signedProfileImage: apiTeacher._signedProfileImage,
      user_profileImage: apiTeacher.user?.profileImage,
      root_profileImage: apiTeacher.profileImage
    });

    // Extract subjects, curriculums, and grades from teacher profile
    const extractTeachingInfo = () => {
      const subjects: Set<string> = new Set();
      const curriculums: Set<string> = new Set();
      const gradeLevels: Set<string> = new Set();

      // Handle mvpData nested structure (primary source for new profiles)
      if (apiTeacher.mvpData) {
        if (Array.isArray(apiTeacher.mvpData.curriculums)) {
          apiTeacher.mvpData.curriculums.forEach((c: any) => { if (c) curriculums.add(String(c)); });
        }
        if (Array.isArray(apiTeacher.mvpData.gradeLevels)) {
          apiTeacher.mvpData.gradeLevels.forEach((g: any) => { if (g) gradeLevels.add(String(g)); });
        }
        if (Array.isArray(apiTeacher.mvpData.subjects)) {
          apiTeacher.mvpData.subjects.forEach((s: any) => { if (s) subjects.add(String(s)); });
        }
      }

      // Handle root level arrays (fallback/legacy)
      if (Array.isArray(apiTeacher.curriculums)) {
        apiTeacher.curriculums.forEach((c: any) => { if (c) curriculums.add(String(c)); });
      }

      if (Array.isArray(apiTeacher.gradeLevels)) {
        apiTeacher.gradeLevels.forEach((g: any) => { if (g) gradeLevels.add(String(g)); });
      }

      // Handle subjects at root (could be string[] or object[])
      if (Array.isArray(apiTeacher.subjects)) {
        apiTeacher.subjects.forEach((subject: any) => {
          if (typeof subject === 'string') {
            subjects.add(subject);
          } else if (typeof subject === 'object' && subject !== null) {
            if (subject.subject) subjects.add(subject.subject);
            if (subject.curriculum) curriculums.add(subject.curriculum);
            if (subject.gradeLevel) gradeLevels.add(subject.gradeLevel);
          }
        });
      }

      return {
        subjects: subjects.size > 0 ? Array.from(subjects) : ["General Education"],
        curriculums: Array.from(curriculums),
        gradeLevels: Array.from(gradeLevels)
      };
    };

    const teachingInfo = extractTeachingInfo();

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
      // Try to get from most recent experience
      if (apiTeacher.experience && Array.isArray(apiTeacher.experience) && apiTeacher.experience.length > 0) {
        const position = apiTeacher.experience[0].position || apiTeacher.experience[0].role;
        if (position) return position;
      }

      // Try direct position field
      if (apiTeacher.position) return apiTeacher.position;
      if (apiTeacher.role) return apiTeacher.role;
      if (apiTeacher.title) return apiTeacher.title;

      // Try from user object
      if (apiTeacher.user?.position) return apiTeacher.user.position;
      if (apiTeacher.user?.role) return apiTeacher.user.role;
      if (apiTeacher.user?.title) return apiTeacher.user.title;

      // Check for years of experience to create a more specific title
      const yearsExp = apiTeacher.yearsOfExperience || apiTeacher.yearsExperience || apiTeacher.user?.yearsOfExperience;
      if (yearsExp) {
        if (yearsExp >= 10) return "Senior Educator";
        if (yearsExp >= 5) return "Experienced Educator";
        return "Educator";
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

    // Get the user's full name with multiple fallbacks
    const name = apiTeacher.user?.fullName
      || apiTeacher.fullName
      || apiTeacher.name
      || `${apiTeacher.user?.firstName || ''} ${apiTeacher.user?.lastName || ''}`.trim()
      || `${apiTeacher.firstName || ''} ${apiTeacher.lastName || ''}`.trim()
      || "Teacher";

    // Get profile image with multiple fallbacks
    const getProfileImage = (): string => {
      // Try signed URLs first (preferred for S3/storage)
      if (apiTeacher.user?._signedProfileImage) {
        return apiTeacher.user._signedProfileImage;
      }
      if (apiTeacher._signedProfileImage) {
        return apiTeacher._signedProfileImage;
      }

      // Try regular profile image URLs
      if (apiTeacher.user?.profileImage) {
        return apiTeacher.user.profileImage;
      }
      if (apiTeacher.profileImage) {
        return apiTeacher.profileImage;
      }

      // Default placeholder
      return "https://via.placeholder.com/150";
    };

    // Get bio with multiple fallbacks
    const getBio = (): string => {
      if (apiTeacher.user?.bio) return apiTeacher.user.bio;
      if (apiTeacher.bio) return apiTeacher.bio;
      if (apiTeacher.description) return apiTeacher.description;
      if (apiTeacher.summary) return apiTeacher.summary;
      if (apiTeacher.about) return apiTeacher.about;

      // Generate bio from available data
      const subjects = teachingInfo.subjects;
      const yearsExp = apiTeacher.yearsOfExperience || apiTeacher.yearsExperience || apiTeacher.user?.yearsOfExperience;

      if (subjects.length > 0 && yearsExp) {
        return `Experienced educator with ${yearsExp} years teaching ${subjects.slice(0, 2).join(', ')}${subjects.length > 2 ? ' and more' : ''}.`;
      } else if (subjects.length > 0) {
        return `Passionate educator specializing in ${subjects.slice(0, 2).join(', ')}${subjects.length > 2 ? ' and more' : ''}.`;
      } else if (yearsExp) {
        return `Experienced educator with ${yearsExp} years of teaching experience.`;
      }

      return "Experienced educator passionate about student success.";
    };

    return {
      id: apiTeacher.user?._id || apiTeacher.userId || apiTeacher._id || "",
      urlName: generateUrlName(name),
      name,
      position: extractPosition(),
      imageSrc: getProfileImage(),
      bio: getBio(),
      subjects: teachingInfo.subjects,
      curriculums: teachingInfo.curriculums,
      gradeLevels: teachingInfo.gradeLevels,
      rating: apiTeacher.rating || 5.0,
      ratingCount: apiTeacher.totalReviews || 0,
      location: formatLocation(),
      education: formatEducation(),
      certifications: formatCertifications()
    };
  };



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

          {/* Search bar and filters */}
          <div className="mb-8 max-w-5xl mx-auto">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search by name, subject, or location..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={curriculumFilter} onValueChange={setCurriculumFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Curricula" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Curricula</SelectItem>
                    {activeCurricula.map((c) => (
                      <SelectItem key={c.code || c.name} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {activeSubjects.length > 0 ? (
                      activeSubjects.map((s) => (
                        <SelectItem key={s.code || s.name} value={s.name}>
                          {s.name}
                        </SelectItem>
                      ))
                    ) : (
                      // Fallback to dynamic subjects if config fetch failed/empty
                      Array.from(new Set(teachers.flatMap(t => t.subjects)))
                        .sort()
                        .map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>

                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Grades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    {activeGradeLevels.map((g) => (
                      <SelectItem key={g.code || g.name} value={g.name}>
                        {g.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Availability Filter */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Availability
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select value={availDay} onValueChange={setAvailDay}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Day</SelectItem>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                      <SelectItem value="saturday">Saturday</SelectItem>
                      <SelectItem value="sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>

                  <div>
                    <Input
                      type="time"
                      value={availStart}
                      onChange={(e) => setAvailStart(e.target.value)}
                      className="bg-gray-50"
                    />
                    <span className="text-[10px] text-gray-400 mt-1 block">Start Time</span>
                  </div>
                  <div>
                    <Input
                      type="time"
                      value={availEnd}
                      onChange={(e) => setAvailEnd(e.target.value)}
                      className="bg-gray-50"
                    />
                    <span className="text-[10px] text-gray-400 mt-1 block">End Time</span>
                  </div>
                </div>
              </div>
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
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kidato-purple"></div>
            </div>
          ) : (
            <>
              {/* Teacher grid */}
              {teachers.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {teachers.map((teacher) => (
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
                            <BookOpen className="h-4 w-4 mr-1 text-kidato-purple" />
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
                              <GraduationCap className="w-4 h-4 mr-1 text-kidato-purple" />
                              <span className="truncate">{teacher.education[0].degree}</span>
                            </div>
                          )}

                          {teacher.certifications && teacher.certifications.length > 0 && (
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <Award className="w-4 h-4 mr-1 text-kidato-purple" />
                              <span className="truncate">{teacher.certifications[0].name}</span>
                            </div>
                          )}

                          <div className="text-sm text-gray-500 flex items-center mt-3">
                            <MapPin className="w-4 h-4 mr-1 text-kidato-purple" />
                            {teacher.location}
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-4 sm:px-6">
                          <Button className="w-full bg-kidato-purple hover:bg-kidato-dark-blue">
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
