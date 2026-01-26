import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, BookOpen, Clock, Users, Calendar, CheckCircle, User as UserIcon, Globe, Monitor, Video, FileText, Star, Award, GraduationCap, LogIn, Lock, Share2 } from "lucide-react";
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
import { teacherService } from "@/integrations/api/services/teacher.service";
import { ClassItemProps } from "@/components/common/ClassCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import TeacherClassView from "@/components/teacher/class-view/TeacherClassView";
import { RatingForm } from "@/components/ratings/RatingForm";
import { RatingDisplay } from "@/components/ratings/RatingDisplay";

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

  const classDetail = response?.data as any;
  const offeringData = offering as any;

  // Extract teacherId from offering or class detail
  const extractedTeacherId = offeringData?.teacherId || classDetail?.teacher?._id || classDetail?.teacher?.id || classDetail?.teacherId;

  // Fetch teacher profile if we have a teacherId
  // Offerings store User ID in teacherId, while Classes store TeacherProfile ID
  const { data: teacherProfileData, isLoading: isTeacherLoading } = useQuery({
    queryKey: ['teacherProfile', extractedTeacherId, !!offeringData],
    queryFn: async () => {
      if (!extractedTeacherId) return null;

      try {
        // If we have offeringData, the extractedTeacherId is a User ID
        if (offeringData) {
          const result = await teacherService.getProfileByUserId(extractedTeacherId);
          return result.data;
        }

        // Otherwise try as a profile ID
        const result = await teacherService.getProfileById(extractedTeacherId);
        return result.data;
      } catch (err) {
        console.error("Error fetching teacher profile:", err);

        // Fallback: try the other way if the first one failed
        try {
          if (offeringData) {
            const result = await teacherService.getProfileById(extractedTeacherId);
            return result.data;
          } else {
            const result = await teacherService.getProfileByUserId(extractedTeacherId);
            return result.data;
          }
        } catch (fallbackErr) {
          return null;
        }
      }
    },
    enabled: !!extractedTeacherId,
    retry: false
  });

  const isLoading = (isClassLoading && isOfferingLoading) || (isSlug && !resolvedId && !allClasses) || isTeacherLoading;
  const error = classError && offeringError;

  const handleBookmark = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: (
          <div className="flex items-start gap-2 pt-1">
            <Lock className="h-4 w-4 text-kidato-purple shrink-0 mt-0.5" />
            <span>Log in to save classes to your personal wishlist and track your interests.</span>
          </div>
        ),
        className: "border-l-4 border-l-kidato-purple bg-white shadow-xl",
        action: (
          <div className="flex flex-col gap-2 min-w-[100px]">
            <Button size="sm" onClick={() => navigate('/login')} className="bg-kidato-purple hover:bg-kidato-dark-blue shadow-sm">
              Log In
            </Button>
            <Button size="sm" variant="ghost" onClick={() => navigate('/signup')} className="text-xs text-muted-foreground hover:text-kidato-purple h-auto py-1">
              Create account
            </Button>
          </div>
        )
      });
      return;
    }

    // Check if user is parent or student
    if (user.role !== 'parent' && user.role !== 'student') {
      toast({
        title: "Access Restricted",
        description: "Only parents and students can save classes to wishlist.",
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

  const handleShare = async () => {
    const shareText = `Check out this class: ${classItem?.title || "Class"} on Kidato!`;
    const shareUrl = window.location.href;
    const shareData = {
      title: classItem?.title || "Class on Kidato",
      text: shareText,
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast({
          title: "Link copied!",
          description: "Class details and link have been copied to your clipboard.",
        });
      } catch (err) {
        console.error('Failed to copy:', err);
        toast({
          title: "Copy failed",
          description: "Please copy the URL from your browser address bar.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEnroll = () => {
    if (!user) {
      toast({
        title: "Almost there!",
        description: (
          <div className="flex items-start gap-2 pt-1">
            <Lock className="h-4 w-4 text-kidato-purple shrink-0 mt-0.5" />
            <span>Please sign in or create an account to enroll in this class and start learning.</span>
          </div>
        ),
        className: "border-l-4 border-l-kidato-purple bg-white shadow-xl",
        action: (
          <div className="flex flex-col gap-2 min-w-[100px]">
            <Button size="sm" onClick={() => navigate('/login')} className="bg-kidato-purple hover:bg-kidato-dark-blue shadow-sm">
              Log In
            </Button>
            <Button size="sm" variant="ghost" onClick={() => navigate('/signup')} className="text-xs text-muted-foreground hover:text-kidato-purple h-auto py-1">
              Create account
            </Button>
          </div>
        )
      });
      return;
    }

    // Check if user is parent or student
    if (user.role !== 'parent' && user.role !== 'student') {
      toast({
        title: "Access Restricted",
        description: "Only parents and students can enroll in classes.",
        variant: "destructive",
      });
      return;
    }

    navigate(`/book/${resolvedId || id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kidato-purple"></div>
      </div>
    );
  }

  // Use either classDetail OR offering and merge with teacher profile
  const baseItem = (classDetail || offering) as any;

  // Merge teacher profile data into displayItem
  const displayItem = {
    ...baseItem,
    teacher: teacherProfileData || baseItem?.teacher
  };

  // Debug logging
  console.log('Class Detail Data:', classDetail);
  console.log('Offering Data:', offering);
  console.log('Teacher Profile Data:', teacherProfileData);
  console.log('Display Item:', displayItem);
  console.log('Teacher Data:', displayItem?.teacher);

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

  // Extract teacher ID with multiple fallbacks
  const getTeacherId = (): string => {
    // If teacher is a populated object
    if (displayItem.teacher && typeof displayItem.teacher === 'object') {
      // Prioritize User ID as the TeacherProfilePage expects User ID for lookup
      return displayItem.teacher.userId ||
        displayItem.teacher.user?._id ||
        displayItem.teacher.user?.id ||
        displayItem.teacher._id ||
        displayItem.teacher.id || '';
    }
    // If teacher is just an ID string
    if (displayItem.teacher && typeof displayItem.teacher === 'string') {
      return displayItem.teacher;
    }
    // Alternative fields
    return displayItem.teacherId || displayItem.teacherProfileId || displayItem.createdBy || '';
  };

  // Extract teacher name with multiple fallbacks
  const getTeacherName = (): string => {
    // First try the fetched teacher profile data
    if (teacherProfileData) {
      return teacherProfileData.user?.fullName ||
        teacherProfileData.fullName ||
        teacherProfileData.name ||
        teacherProfileData.user?.name ||
        "Expert Teacher";
    }

    // Then try the displayItem.teacher object
    if (displayItem.teacher && typeof displayItem.teacher === 'object') {
      return displayItem.teacher.user?.fullName ||
        displayItem.teacher.fullName ||
        displayItem.teacher.name ||
        displayItem.teacher.user?.name ||
        "Expert Teacher";
    }

    return displayItem.teacherName || "Expert Teacher";
  };

  const teacherId = getTeacherId();
  const teacherName = getTeacherName();

  console.log('Extracted Teacher ID:', teacherId);
  console.log('Extracted Teacher Name:', teacherName);
  console.log('Teacher Profile Data for name:', teacherProfileData);

  const classItem = {
    title: displayItem.title,
    subject: displayItem.subject || displayItem.curriculum,
    level: displayItem.gradeLevel || displayItem.level,
    teacher: teacherName,
    rating: displayItem.rating || 5.0,
    time: activeCohort
      ? `${activeCohort.daysOfWeek.join(' & ')}, ${activeCohort.startTime}`
      : (displayItem.sessionDuration ? `${displayItem.sessionDuration} mins / session` : "Flexible Schedule"),
    imageSrc: displayItem.media?.thumbnailUrl || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    spots: activeCohort
      ? `${activeCohort.maximumStudents - activeCohort.currentStudents} spots left`
      : "Open",
    price: activeCohort
      ? `${displayItem.currency || 'KES'} ${activeCohort.price}/class`
      : (displayItem.price ? `${displayItem.currency || 'KES'} ${displayItem.price}` : "Price Varies")
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
            onClick={handleEnroll}
          >
            {!user ? (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Log In to Enroll
              </>
            ) : (
              'Enroll Now'
            )}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
            onClick={handleBookmark}
          >
            <Heart className={`h-5 w-5 ${isBookmarked ? "fill-red-500 text-red-500" : ""}`} />
            <span className="hidden sm:inline">{isBookmarked ? "Saved" : "Save"}</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
            <span className="hidden sm:inline">Share</span>
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

          {/* Class Overview Stats */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Users className="h-8 w-8 text-kidato-purple mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {activeCohort?.currentStudents || 0}
                  </p>
                  <p className="text-sm text-gray-600">Students Enrolled</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <BookOpen className="h-8 w-8 text-kidato-purple mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {displayItem.numberOfLessons || displayItem.numberOfSessions || 1}
                  </p>
                  <p className="text-sm text-gray-600">Total Lessons</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Clock className="h-8 w-8 text-kidato-purple mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {displayItem.sessionDuration || 60}
                  </p>
                  <p className="text-sm text-gray-600">Minutes/Lesson</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Star className="h-8 w-8 text-yellow-400 mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {displayItem.rating || classItem.rating || 5.0}
                  </p>
                  <p className="text-sm text-gray-600">Rating</p>
                </div>
              </CardContent>
            </Card>
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

          {/* Teacher Profile - Enhanced */}
          <section className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-kidato-purple" />
              Meet Your Teacher
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {teacherId ? (
                <Link
                  to={`/teacher/${teacherId}`}
                  className="flex-shrink-0"
                >
                  <Avatar className="h-24 w-24 border-2 border-kidato-purple hover:border-kidato-dark-blue transition-colors cursor-pointer">
                    <AvatarImage src={displayItem.teacher?.user?._signedProfileImage || displayItem.teacher?.user?.profileImage || displayItem.teacher?.profileImage} />
                    <AvatarFallback className="text-xl bg-indigo-100 text-indigo-700">
                      {classItem.teacher.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              ) : (
                <Avatar className="h-24 w-24 border-2 border-gray-200">
                  <AvatarImage src={displayItem.teacher?.user?._signedProfileImage || displayItem.teacher?.user?.profileImage || displayItem.teacher?.profileImage} />
                  <AvatarFallback className="text-xl bg-indigo-100 text-indigo-700">
                    {classItem.teacher.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="space-y-3 flex-1">
                <div>
                  {teacherId ? (
                    <Link
                      to={`/teacher/${teacherId}`}
                      className="text-lg font-bold hover:text-kidato-purple transition-colors"
                    >
                      {classItem.teacher}
                    </Link>
                  ) : (
                    <h3 className="text-lg font-bold">{classItem.teacher}</h3>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Award className="h-3 w-3 mr-1" />
                      Verified Teacher
                    </Badge>
                    {displayItem.teacher?.rating && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{displayItem.teacher.rating.toFixed(1)}</span>
                        {displayItem.teacher?.totalReviews && (
                          <span className="text-gray-500">({displayItem.teacher.totalReviews} reviews)</span>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Teacher stats */}
                  {(displayItem.teacher?.totalStudents || displayItem.teacher?.totalClasses || displayItem.teacher?.totalHours) && (
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                      {displayItem.teacher?.totalStudents && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{displayItem.teacher.totalStudents}+ students</span>
                        </div>
                      )}
                      {displayItem.teacher?.totalClasses && (
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{displayItem.teacher.totalClasses} classes</span>
                        </div>
                      )}
                      {displayItem.teacher?.totalHours && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{displayItem.teacher.totalHours}+ hours taught</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {displayItem.teacher?.user?.bio || displayItem.teacher?.bio || "Passionate educator dedicated to inspiring students and creating engaging learning experiences."}
                </p>
                {/* Teacher subjects/expertise */}
                {displayItem.teacher?.subjects && displayItem.teacher.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {displayItem.teacher.subjects.slice(0, 3).map((subject: any, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {typeof subject === 'string' ? subject : subject.subject || subject.name}
                      </Badge>
                    ))}
                    {displayItem.teacher.subjects.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{displayItem.teacher.subjects.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                {teacherId && (
                  <Link
                    to={`/teacher/${teacherId}`}
                    className="inline-block"
                  >
                    <Button variant="outline" className="text-kidato-purple border-kidato-purple hover:bg-kidato-purple hover:text-white">
                      View Full Profile →
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </section>

          <Separator />

          {/* Ratings Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              Ratings & Reviews
            </h2>

            {/* Display existing ratings */}
            <RatingDisplay
              type="offering"
              id={resolvedId || id || ''}
              showStats={true}
              showReviews={true}
              initialLimit={5}
            />

            {/* Rating form for eligible users */}
            {user && (user.role === 'parent' || user.role === 'student') && (
              <div className="mt-6">
                <RatingForm
                  offeringId={resolvedId || id || ''}
                  teacherId={extractedTeacherId || ''}
                  offeringTitle={classItem?.title || 'this class'}
                  onSuccess={() => {
                    // Refresh ratings display after successful submission
                    window.location.reload();
                  }}
                />
              </div>
            )}
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
                onClick={handleEnroll}
              >
                {!user ? (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Log In to Enroll
                  </>
                ) : (
                  'Enroll Now'
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full mt-3 border-kidato-purple text-kidato-purple hover:bg-blue-50"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share this class
              </Button>
              <p className="text-xs text-center text-gray-500 mt-2">
                {user ? '100% Satisfaction Guarantee' : 'Create an account to get started'}
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
