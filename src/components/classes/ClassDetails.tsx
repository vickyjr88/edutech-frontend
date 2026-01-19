import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, BookOpen, Clock, Users, Calendar, CheckCircle, User as UserIcon, Globe, Monitor, Video, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useClassById } from "@/hooks/use-class-service";
import { classService } from "@/integrations/api/services/class.service";
import { userService } from "@/integrations/api/services/user.service";
import MvpOfferingService from "@/integrations/api/services/mvp-offering.service";
import { ClassItemProps } from "@/components/common/ClassCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import TeacherClassView from "@/components/teacher/class-view/TeacherClassView";

const ClassDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);


  // Determine if we have a probable ID or a slug
  const isSlug = id && !/^[0-9a-fA-F]{24}$/.test(id);

  // If it's a slug, we need to resolve it to an ID first
  const { data: allClasses } = useQuery({
    queryKey: ['allClassesForSlug'],
    queryFn: () => classService.getAll(),
    enabled: !!isSlug
  });

  const resolvedId = isSlug
    ? allClasses?.data?.find((c: any) => c.title.toLowerCase().replace(/\s+/g, '-') === id)?._id
    : id;

  // Check if in wishlist on load
  useEffect(() => {
    if (user && (user as any).wishlist && resolvedId) {
      if (Array.isArray((user as any).wishlist)) {
        setIsBookmarked((user as any).wishlist.includes(resolvedId));
      }
    }
  }, [user, resolvedId]);

  // Fetch class details
  const { data: response, isLoading: isClassLoading, error: classError } = useClassById(resolvedId || "");

  // Also try to fetch as an offering (MVP compatibility)
  const { data: offering, isLoading: isOfferingLoading, error: offeringError } = useQuery({
    queryKey: ['offering', resolvedId],
    queryFn: () => MvpOfferingService.getOffering(resolvedId || ""),
    enabled: !!resolvedId && !response,
    retry: false
  });

  const classDetail = response?.data;
  const isLoading = (isClassLoading && isOfferingLoading) || (isSlug && !resolvedId && !allClasses);
  const error = classError && offeringError;

  const handleBookmark = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save classes to your wishlist.",
        variant: "destructive",
      });
      return;
    }

    const targetId = resolvedId || id;
    if (!targetId) return;

    try {
      if (isBookmarked) {
        await userService.removeFromWishlist(targetId);
        setIsBookmarked(false);
        toast({ title: "Removed from wishlist" });
      } else {
        await userService.addToWishlist(targetId);
        setIsBookmarked(true);
        toast({ title: "Added to wishlist" });
      }
    } catch (error) {
      console.error("Wishlist error", error);
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kidato-purple"></div>
      </div>
    );
  }

  // Use either classDetail OR offering
  const displayItem = (classDetail || offering) as any;

  if ((!classDetail && !offering) || (classError && offeringError)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Class not found</h2>
        <p className="text-gray-600 mt-2">The class you are looking for does not exist or has been removed.</p>
        <Button
          className="mt-6"
          onClick={() => navigate("/all-classes")}
        >
          Browse Classes
        </Button>
      </div>
    );
  }

  // Detect if user is a teacher viewing their own class
  const isTeacherViewingOwnClass = user?.role === 'teacher' &&
    (displayItem.teacher?._id === user?.teacherId || displayItem.teacher?.user?._id === user?.id);

  if (isTeacherViewingOwnClass) {
    return <TeacherClassView classId={id} />;
  }

  // Helper to format simplified class item for display
  // Adapt for both ClassDetail and Offering shapes
  const activeCohort = classDetail?.cohorts?.[0];

  const classItem = {
    title: displayItem.title,
    subject: displayItem.subject || displayItem.curriculum,
    level: displayItem.gradeLevel || displayItem.level,
    teacher: displayItem.teacher?.user?.fullName || displayItem.teacher?.name || "Expert Teacher",
    rating: displayItem.rating || 5.0,
    time: activeCohort
      ? `${activeCohort.daysOfWeek.join(' & ')}, ${activeCohort.startTime}`
      : (displayItem.sessionDuration ? `${displayItem.sessionDuration} mins / session` : "Flexible Schedule"),
    imageSrc: displayItem.media?.thumbnailUrl || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    spots: activeCohort
      ? `${activeCohort.maximumStudents - activeCohort.currentStudents} spots left`
      : "Open",
    price: activeCohort ? `$${activeCohort.price}/class` : (displayItem.price ? `$${displayItem.price}` : "Price Varies")
  };

  // Student/parent view
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/all-classes" className="flex items-center text-kidato-purple mb-6 hover:underline w-fit">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Classes
      </Link>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">{classItem.subject}</Badge>
            <Badge variant="outline">{classItem.level}</Badge>
            {displayItem.type && <Badge variant="outline" className="capitalize">{displayItem.type.replace('_', ' ')}</Badge>}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{classItem.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <UserIcon className="h-4 w-4" />
              <span>{classItem.teacher}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{classItem.spots}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <Button
            size="lg"
            className="bg-kidato-purple hover:bg-kidato-dark-blue flex-1 md:flex-none"
            onClick={() => navigate(`/book/${resolvedId || id}`)}
          >
            Enroll Now
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
            onClick={handleBookmark}
          >
            <Heart className={`h-5 w-5 ${isBookmarked ? "fill-red-500 text-red-500" : ""}`} />
            {isBookmarked ? "Saved" : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">

          {/* About Class */}
          <section className="bg-white rounded-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-kidato-purple" />
              About This Class
            </h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
              {displayItem.description || displayItem.summary || "No description available for this class."}
            </div>
          </section>

          <Separator />

          {/* Learning Objectives */}
          {displayItem.objectives && displayItem.objectives.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-kidato-purple" />
                What You Will Learn
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {displayItem.objectives.map((objective: any, idx: number) => {
                  const text = typeof objective === 'string' ? objective : objective.text;
                  return (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-gray-700 font-medium">{text}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* Technical Requirements */}
          {displayItem.technicalRequirements && displayItem.technicalRequirements.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Monitor className="h-5 w-5 text-kidato-purple" />
                Requirements
              </h2>
              <ul className="space-y-2">
                {displayItem.technicalRequirements.map((req: any, idx: number) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-700">
                    <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                    <span>{typeof req === 'string' ? req : req.requirement}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Teacher Profile */}
          <section className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Meet Your Teacher</h2>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <Avatar className="h-24 w-24 border-2 border-gray-100">
                <AvatarImage src={displayItem.teacher?.user?.profileImage || displayItem.teacher?.profileImage} />
                <AvatarFallback className="text-xl bg-indigo-100 text-indigo-700">
                  {classItem.teacher.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="text-lg font-bold">{classItem.teacher}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Verified Teacher</Badge>
                  <span>•</span>
                  <span>Joined {new Date().getFullYear()}</span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {displayItem.teacher?.user?.bio || displayItem.teacher?.bio || "Passionate educator dedicated to inspiring students and creating engaging learning experiences."}
                </p>
                <Button variant="link" className="p-0 h-auto text-kidato-purple">
                  View Full Profile
                </Button>
              </div>
            </div>
          </section>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Class format card */}
          <Card>
            <CardHeader className="pb-3 border-b bg-gray-50/50">
              <CardTitle className="text-lg">Class Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Schedule</p>
                  <p className="text-sm text-gray-600">{activeCohort ? classItem.time : "Flexible / Self-Paced"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Duration</p>
                  <p className="text-sm text-gray-600">
                    {displayItem.numberOfLessons || 1} Lessons • {displayItem.sessionDuration || 60} mins/class
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">Online (Zoom)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Class Size</p>
                  <p className="text-sm text-gray-600">
                    Max {activeCohort?.maximumStudents || displayItem.maxStudents || 10} students
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">Total Price</span>
                <span className="text-xl font-bold text-kidato-purple">{classItem.price}</span>
              </div>

              <Button
                className="w-full bg-kidato-purple hover:bg-kidato-dark-blue"
                onClick={() => navigate(`/book/${resolvedId || id}`)}
              >
                Enroll Now
              </Button>
              <p className="text-xs text-center text-gray-500 mt-2">
                100% Satisfaction Guarantee
              </p>
            </CardContent>
          </Card>

          {/* Resources Card - Optional */}
          {(displayItem.courseOutlineUrl || displayItem.syllabusUrl) && (
            <Card>
              <CardHeader className="pb-3 border-b bg-gray-50/50">
                <CardTitle className="text-md">Resources</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
                {displayItem.courseOutlineUrl && (
                  <a href={displayItem.courseOutlineUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg text-sm text-blue-600 transition-colors">
                    <FileText className="h-4 w-4" />
                    Download Course Outline
                  </a>
                )}
                {displayItem.syllabusUrl && (
                  <a href={displayItem.syllabusUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg text-sm text-blue-600 transition-colors">
                    <FileText className="h-4 w-4" />
                    View Syllabus
                  </a>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;
