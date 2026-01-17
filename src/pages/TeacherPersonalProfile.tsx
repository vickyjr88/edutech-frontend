import { useEffect, useState } from "react";
import TeacherPublicProfile from "@/components/teacher/profile/TeacherPublicProfile";
import { MvpTeacherService } from "@/integrations/api/services/mvp-teacher.service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const subjectImages: Record<string, string> = {
    "Mathematics": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "Physics": "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "Chemistry": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "Biology": "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "English": "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "Science": "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "History": "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "Computer Science": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "default": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
};

const formatAvailabilityString = (availability: any) => {
    if (!availability?.weeklySchedule) return null;

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const activeDays = days.reduce((acc: string[], day, index) => {
        if (availability.weeklySchedule[day]?.isActive) {
            acc.push(shortDays[index]);
        }
        return acc;
    }, []);

    if (activeDays.length === 0) return "Currently unavailable";
    if (activeDays.length === 7) return "Daily, 09:00 - 17:00";
    // Check for Mon-Fri pattern
    const isWeekdays = activeDays.length === 5 && activeDays[0] === 'Mon' && activeDays[4] === 'Fri';
    if (isWeekdays) return "Mon - Fri, 09:00 - 17:00";

    return `${activeDays.join(', ')}`;
};

const transformTeacherData = (fullData: any): any => {
    if (!fullData) return null;
    const apiTeacher = fullData.teacher || fullData;
    const offerings = fullData.offerings || [];
    const stats = fullData.stats || {};
    const availability = fullData.availability;

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
    const mappedClasses = offerings.map((o: any) => {
        // Get image based on subject (case-insensitive)
        const subjectKey = Object.keys(subjectImages).find(
            key => key.toLowerCase() === o.subject?.toLowerCase()
        ) || "default";

        return {
            id: o._id,
            _id: o._id,
            title: o.title,
            description: o.description,
            subject: o.subject,
            level: o.gradeLevel || "All Levels",
            duration: `${o.sessionDuration} mins`,
            price: o.price,
            imageSrc: subjectImages[subjectKey],
            type: o.type === 'course' ? 'academic' : 'after-school',
            studentsEnrolled: o.studentsEnrolled || 0,
            rating: 0
        };
    });

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
        experience: apiTeacher.experience || [],
        languages: apiTeacher.languages || [],
        offerings: offerings,
        classes: mappedClasses,
        reviews: apiTeacher.reviews || [],
        methodologies: apiTeacher.methodologies || [],
        strategies: apiTeacher.strategies || [],
        certifications: apiTeacher.certifications || [],
        stats: {
            studentsHelped: stats.totalStudents || 0,
            lessonsDelivered: stats.completedBookings || 0,
            classesCreated: offerings.length,
            successRate: stats.successRate || 0
        },
        subjects: apiTeacher.subjects?.length > 0 ? apiTeacher.subjects : (stats.subjects || []),
        location: formatLocation(),
        hourlyRate: stats.lowestPrice ? `$${stats.lowestPrice}/hr` : "Varies",
        availability: formatAvailabilityString(availability) || "Contact for schedule",
        openToWork: true
    };
};

const TeacherPersonalProfile = () => {
    const { user } = useAuth();
    const [teacher, setTeacher] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTeacher = async () => {
            // Use user.teacherId or fallback
            const teacherId = user?.teacherId;

            if (!teacherId) {
                // If no teacher ID in user, try fetching "me" directly (MvpTeacherService.getCurrentProfile)
                // But getTeacherDetails (used below) needs an ID.
                // We can try to rely on user context being loaded.
                if (user && user.role === 'teacher') {
                    // Maybe wait or show specific error?
                    setError("Teacher profile not linked.");
                    setLoading(false);
                    return;
                }
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const [data, offeringStats] = await Promise.all([
                    MvpTeacherService.getTeacherDetails(teacherId),
                    MvpTeacherService.getOfferingStats(teacherId).catch(() => [])
                ]);

                if (!data) {
                    throw new Error("No teacher data found");
                }

                // Merge offering stats into offerings
                if (data.offerings && offeringStats.length > 0) {
                    data.offerings = data.offerings.map((o: any) => {
                        const stat = offeringStats.find((s: any) => s.offeringId === o._id);
                        return {
                            ...o,
                            studentsEnrolled: stat?.studentsEnrolled || 0
                        };
                    });
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

        if (user) {
            fetchTeacher();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex-grow flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kidato-purple"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:ml-64 min-h-screen bg-gray-50">
            {error && (
                <div className="p-4">
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
                <TeacherPublicProfile teacher={teacher} hideBookingActions={true} />
            )}
        </div>
    );
};

export default TeacherPersonalProfile;
