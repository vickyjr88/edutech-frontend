"use client";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeacherPublicProfile from "@/components/teacher/profile/TeacherPublicProfile";
import { useEffect, useState } from "react";
import { MvpTeacherService, type MvpTeacherProfileResponse } from "@/integrations/api/services/mvp-teacher.service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const transformTeacherData = (fullData: any): any => {
  if (!fullData) return null;
  const apiTeacher = fullData.teacher || fullData;
  const offerings = fullData.offerings || [];
  const stats = fullData.stats || {};

  // ... previous logic for education and location ...
  const formatEducation = () => {
    if (!apiTeacher.education || !Array.isArray(apiTeacher.education) || apiTeacher.education.length === 0) {
      return [];
    }

    return apiTeacher.education.map((edu: any, index: number) => ({
      id: `edu-${index}`,
      institution: edu.institution,
      degree: edu.degree,
      dates: edu.year ? edu.year.toString() : "",
      description: ""
    }));
  };

  const formatLocation = (): string => {
    if (apiTeacher.location) {
      const parts = [];
      if (apiTeacher.location.city) parts.push(apiTeacher.location.city);
      if (apiTeacher.location.estate) parts.push(apiTeacher.location.estate);
      return parts.join(", ") || "Remote";
    }
    return "Remote";
  };

  // Map offerings to class grid format
  const mappedClasses = offerings.map((o: any) => ({
    id: o._id,
    _id: o._id,
    title: o.title,
    description: o.description,
    subject: o.subject,
    level: o.gradeLevel || "All Levels",
    duration: `${o.sessionDuration} mins`,
    price: o.price,
    imageSrc: "/placeholder.svg", // Use placeholder for now
    type: o.type === 'course' ? 'academic' : 'after-school',
    studentsEnrolled: 0,
    rating: 0
  }));

  return {
    id: apiTeacher.userId || apiTeacher._id || apiTeacher.id,
    _id: apiTeacher.userId || apiTeacher._id || apiTeacher.id,
    name: apiTeacher.fullName || "Teacher",
    phoneNumber: apiTeacher.phoneNumber || "",
    imageSrc: apiTeacher.profileImage || "",
    role: "Professional Educator",
    bio: apiTeacher.bio || "",
    shortBio: apiTeacher.bio ? apiTeacher.bio.substring(0, 150) + "..." : "Professional Educator at Kidato",
    position: "Educator",
    rating: apiTeacher.rating || 0,
    ratingCount: apiTeacher.totalReviews || 0,
    videoProfileUrl: apiTeacher.introVideoUrl || "",
    education: formatEducation(),
    experience: [{
      id: "exp-1",
      institution: "Kidato Learning Platform",
      position: "Senior Educator",
      dates: `${apiTeacher.yearsOfExperience || 3}+ years`,
      description: apiTeacher.bio || ""
    }],
    languages: apiTeacher.languages || [{ language: "English", level: "Native" }, { language: "Swahili", level: "Fluent" }],
    offerings: offerings,
    classes: mappedClasses,
    reviews: apiTeacher.reviews || [],
    methodologies: apiTeacher.methodologies || [],
    strategies: apiTeacher.strategies || [],
    certifications: apiTeacher.certifications || [],
    stats: {
      studentsHelped: stats.totalStudents || 0,
      lessonsDelivered: stats.completedBookings || (apiTeacher.yearsOfExperience ? apiTeacher.yearsOfExperience * 100 : 0),
      classesCreated: offerings.length,
      successRate: 100
    },
    subjects: apiTeacher.subjects?.length > 0 ? apiTeacher.subjects : (stats.subjects || []),
    location: formatLocation(),
    hourlyRate: stats.lowestPrice ? `$${stats.lowestPrice}/hr` : "Varies",
    availability: "Mon-Fri, 8AM-5PM",
    openToWork: true
  };
};

const TeacherProfilePage = () => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const { user } = useAuth();
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const showSidebar = !!user;

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!teacherId) {
        setError("No teacher ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await MvpTeacherService.getTeacherDetails(teacherId);

        if (!data) {
          throw new Error("No teacher data found");
        }

        const transformedData = transformTeacherData(data);
        setTeacher(transformedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching teacher profile:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setTeacher(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [teacherId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        {!showSidebar && <Navbar />}
        <div className={`flex-grow flex items-center justify-center ${showSidebar ? "md:ml-64" : ""}`}>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kidato-purple"></div>
        </div>
        {!showSidebar && <Footer />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!showSidebar && <Navbar />}
      <main className={`flex-grow bg-gray-50 ${showSidebar ? "md:ml-64 pt-6 px-6" : "pt-16"}`}>
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {teacher && (
          <TeacherPublicProfile teacher={teacher} />
        )}
      </main>
      {!showSidebar && <Footer />}
    </div>
  );
};

export default TeacherProfilePage;
