import { useState, useEffect } from "react";
import { Eye, Edit, Globe, Archive, BookOpen, FileText, Users, UserCircle, BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClassOverview from "./tabs/ClassOverview";
import LessonPlans from "./tabs/LessonPlans";
import Cohorts from "./tabs/Cohorts";
import TeachingTeam from "./tabs/TeachingTeam";
import Students from "./tabs/Students";
import ClassStats from "./sidebar/ClassStats";
import QuickActions from "./sidebar/QuickActions";
import UpcomingSessions from "./sidebar/UpcomingSessions";
import { classService } from "@/integrations/api/services/class.service";
import { useTeacherId } from "@/hooks/useTeacherId";
import { useTeacherSummary } from "@/hooks/useTeacherSummary";
import { TeacherClassSummary } from "@/types/enhanced-classes";

// Types for class data
export interface ClassData {
  id: string;
  _id?: string; // API ID field
  title: string;
  subject: string;
  level: string;
  description: string;
  imageSrc?: string;
  isPublished: boolean;
  classType: string;
  enrollmentCount: number;
  scheduleInfo: string;
  learningObjectives: string[];
  lessonPlans: LessonPlan[];
  cohorts: Cohort[];
  teachingTeam: TeachingTeamMember[];
  students: Student[];
  stats: {
    enrollmentCount: number;
    lessonCount: number;
    attendanceRate: number;
    rating: number;
  };
  type?: string; // API field
  gradeLevel?: string; // API field
  curriculum?: string; // API field
  curriculumLevel?: string; // API field
  numberOfLessons?: number; // API field
  technicalRequirements?: any[]; // API field
  materials?: any[]; // API field
  commitment?: string; // API field
  enableMultipleCohorts?: boolean; // API field
  enableTeamTeaching?: boolean; // API field
}

export interface LessonPlan {
  id: string;
  _id?: string; // API ID field
  title: string;
  sequenceNumber?: number;
  description?: string;
  activities: string[];
  resources: string[];
  resourceFiles?: any[]; // API field
  resourceLinks?: any[]; // API field
  duration: string | number;
  isCompleted?: boolean; // API field
}

export interface Cohort {
  id: string;
  _id?: string; // API ID field
  name: string;
  color?: string;
  schedule?: string;
  studentCount?: number;
  meetingPattern?: string;
  teacherName?: string;
  isActive?: boolean; // API field
  startDate?: string; // API field
  endDate?: string; // API field
  startTime?: string; // API field
  endTime?: string; // API field
  repeatPattern?: string; // API field
  daysOfWeek?: string[]; // API field
  customLessonTimes?: boolean; // API field
  minimumStudents?: number; // API field
  maximumStudents?: number; // API field
  currentStudents?: number; // API field
  enrollmentDeadline?: string; // API field
  price?: number; // API field
  discount?: number; // API field
  classDates?: any[]; // API field
}

export interface TeachingTeamMember {
  id: string;
  _id?: string; // API ID field
  name: string;
  role: string;
  imageSrc?: string;
  responsibilities: string[];
  user?: string; // API field
  education?: any[]; // API field
  experience?: any[]; // API field
  isActive?: boolean; // API field
  rating?: number; // API field
}

export interface Student {
  id: string;
  _id?: string; // API ID field
  name: string;
  email: string;
  cohortId: string;
  cohortName: string;
  enrollmentDate: string;
  status: 'active' | 'pending' | 'inactive';
}

// Color map for cohorts
const COHORT_COLORS = [
  "#4F46E5", // Indigo
  "#2563EB", // Blue
  "#7C3AED", // Purple
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#EC4899", // Pink
];

interface TeacherClassViewProps {
  classId?: string;
}

const TeacherClassView = ({ classId }: TeacherClassViewProps) => {
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublished, setIsPublished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get teacher data for enhanced analytics
  const { teacherId, loading: teacherIdLoading, error: teacherIdError } = useTeacherId();
  const { summaryData, loading: summaryLoading } = useTeacherSummary({ 
    teacherId: teacherId || '', 
    refreshInterval: 60000 
  });
  
  // Find the current class in the teacher summary data
  const currentClassSummary = summaryData?.classes?.find(
    (cls: TeacherClassSummary) => cls.classId === classId
  );
  
  useEffect(() => {
    if (classId) {
      fetchClassData(classId);
    }
  }, [classId]);
  
  const fetchClassData = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await classService.getById(id);
      
      if (error) {
        console.error("Error fetching class:", error);
        setError("Failed to load class data. Please try again.");
      } else if (data) {
        const formattedData = formatApiData(data);
        setClassData(formattedData);
        setIsPublished(data.isPublished || false);
      }
    } catch (err) {
      console.error("Error in fetchClassData:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Transform API data to match our component structure
  const formatApiData = (apiData: any): ClassData => {
    // Extract learning objectives from description
    const learningObjectives: string[] = [];
    if (apiData.description) {
      const descriptionLines = apiData.description.split('\n');
      for (const line of descriptionLines) {
        // Match lines that start with ✅ or similar patterns that look like objectives
        if (line.trim().match(/^✅|^\*|^\-\s+|^\d+\.\s+/)) {
          const objective = line.replace(/^✅|^\*|^\-\s+|^\d+\.\s+/, '').trim();
          if (objective) learningObjectives.push(objective);
        }
      }
    }
    
    // Format lesson plans
    const formattedLessonPlans: LessonPlan[] = (apiData.lessonPlans || []).map((plan: any, index: number) => ({
      id: plan._id || `lp${index}`,
      _id: plan._id,
      title: plan.title || "Untitled Lesson",
      sequenceNumber: index + 1,
      description: plan.description || "",
      activities: extractActivitiesFromDescription(plan.description || ""),
      resources: [...(plan.resourceFiles || []).map((f: any) => f.name || "File"), 
                 ...(plan.resourceLinks || []).map((l: any) => l.name || "Link")],
      resourceFiles: plan.resourceFiles || [],
      resourceLinks: plan.resourceLinks || [],
      duration: typeof plan.duration === 'number' ? `${plan.duration} minutes` : plan.duration || "60 minutes",
      isCompleted: plan.isCompleted || false
    }));
    
    // Format cohorts with colors
    const formattedCohorts: Cohort[] = (apiData.cohorts || []).map((cohort: any, index: number) => {
      // Create a formatted schedule string
      const daysOfWeek = (cohort.daysOfWeek || [])
        .map((day: string) => day.charAt(0) + day.slice(1).toLowerCase())
        .join(', ');
      
      const timeRange = cohort.startTime && cohort.endTime ? 
        `${formatTime(cohort.startTime)} - ${formatTime(cohort.endTime)}` : 
        "Schedule not set";
      
      const scheduleStr = `${daysOfWeek}, ${timeRange}`;
      
      // Ensure price and discount are properly formatted for display
      const price = typeof cohort.price === 'number' ? cohort.price : 0;
      const discount = typeof cohort.discount === 'number' ? cohort.discount : 0;
      
      return {
        id: cohort._id || `c${index}`,
        _id: cohort._id,
        name: cohort.name || `Cohort ${index + 1}`,
        color: COHORT_COLORS[index % COHORT_COLORS.length],
        schedule: scheduleStr,
        studentCount: cohort.currentStudents || 0,
        meetingPattern: cohort.repeatPattern || "Weekly",
        teacherName: "You", // Default to current teacher
        // Keep original API fields
        isActive: cohort.isActive,
        startDate: cohort.startDate,
        endDate: cohort.endDate,
        startTime: cohort.startTime,
        endTime: cohort.endTime,
        repeatPattern: cohort.repeatPattern,
        daysOfWeek: cohort.daysOfWeek,
        customLessonTimes: cohort.customLessonTimes,
        minimumStudents: cohort.minimumStudents,
        maximumStudents: cohort.maximumStudents,
        currentStudents: cohort.currentStudents,
        enrollmentDeadline: cohort.enrollmentDeadline,
        price: price,
        discount: discount,
        classDates: cohort.classDates,
      };
    });
    
    // Format teaching team (usually would come from another API call)
    // For now, just create a default teaching team with the current teacher
    const formattedTeachingTeam: TeachingTeamMember[] = (apiData.teachingTeam || []).length > 0 ? 
      apiData.teachingTeam.map((member: any, index: number) => ({
        id: member._id || `tt${index}`,
        _id: member._id,
        name: member.name || "Teacher Name",
        role: member.role || "Instructor",
        imageSrc: member.profileImage || undefined,
        responsibilities: member.responsibilities || ["Teaching classes", "Preparing lessons"],
        user: member.user,
        education: member.education,
        experience: member.experience,
        isActive: member.isActive
      })) : 
      [{
        id: "tt1",
        name: "You",
        role: "Lead Instructor",
        responsibilities: ["Lesson planning", "Primary instruction", "Assessment design"]
      }];
    
    // Format students (would typically come from enrollment data)
    // For demo, create an empty array that would be populated from API
    const formattedStudents: Student[] = (apiData.studentsList || []).map((student: any, index: number) => ({
      id: student._id || `s${index}`,
      _id: student._id,
      name: student.name || `Student ${index + 1}`,
      email: student.email || `student${index + 1}@example.com`,
      cohortId: student.cohortId || (formattedCohorts.length > 0 ? formattedCohorts[0].id : ""),
      cohortName: student.cohortName || (formattedCohorts.length > 0 ? formattedCohorts[0].name : "Default Cohort"),
      enrollmentDate: student.enrollmentDate || new Date().toISOString().split('T')[0],
      status: student.status || 'active'
    }));
    
    // Create a default image if none is provided
    const defaultImage = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
    
    // Map class type to a more readable format
    let classType = "Online Class";
    if (apiData.type) {
      if (apiData.type === "academic") classType = "Academic Class";
      else if (apiData.type === "after-school") classType = "After-School Class";
    }
    
    // Format level info
    const level = apiData.gradeLevel || apiData.curriculumLevel || "Not specified";
    
    // Determine schedule info
    const scheduleInfo = formattedCohorts.length > 0 ? 
      formattedCohorts[0].schedule : 
      "Schedule not set";
    
    return {
      id: apiData._id,
      _id: apiData._id,
      title: apiData.title || "Untitled Class",
      subject: apiData.subject || "Subject not specified",
      level,
      description: apiData.description || "No description provided",
      imageSrc: apiData.coverImage || defaultImage,
      isPublished: apiData.isPublished || false,
      classType,
      enrollmentCount: apiData.enrolledStudents || 0,
      scheduleInfo,
      learningObjectives,
      lessonPlans: formattedLessonPlans,
      cohorts: formattedCohorts,
      teachingTeam: formattedTeachingTeam,
      students: formattedStudents,
      stats: {
        enrollmentCount: apiData.enrolledStudents || 0,
        lessonCount: apiData.numberOfLessons || 0,
        attendanceRate: apiData.completionRate || 0,
        rating: apiData.rating || 0
      },
      // Keep original API fields
      type: apiData.type,
      gradeLevel: apiData.gradeLevel,
      curriculum: apiData.curriculum,
      curriculumLevel: apiData.curriculumLevel,
      numberOfLessons: apiData.numberOfLessons,
      technicalRequirements: apiData.technicalRequirements,
      materials: apiData.materials,
      commitment: apiData.commitment,
      enableMultipleCohorts: apiData.enableMultipleCohorts,
      enableTeamTeaching: apiData.enableTeamTeaching
    };
  };
  
  // Helper function to extract activities from lesson description
  const extractActivitiesFromDescription = (description: string): string[] => {
    const activities: string[] = [];
    if (!description) return activities;
    
    // Try to find an "Activities" section in the description
    const activitiesMatch = description.match(/##\s*Activities\s*([\s\S]*?)(?=##|$)/i);
    
    if (activitiesMatch && activitiesMatch[1]) {
      // Extract numbered or bulleted list items
      const activityLines = activitiesMatch[1].split('\n');
      for (const line of activityLines) {
        // Match lines that look like activities (numbered, bulleted, etc.)
        const trimmedLine = line.trim();
        if (trimmedLine.match(/^\d+\.\s+|^\-\s+|^\*\s+/)) {
          const activity = trimmedLine.replace(/^\d+\.\s+|^\-\s+|^\*\s+/, '').trim();
          if (activity) activities.push(activity);
        }
      }
    }
    
    // If no activities found, return default
    return activities.length > 0 ? activities : ["Standard activity"];
  };
  
  // Helper function to format time (e.g., "14:00" to "2:00 PM")
  const formatTime = (timeStr: string): string => {
    try {
      const [hours, minutes] = timeStr.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return timeStr;
      
      const period = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
      
      return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch (err) {
      return timeStr;
    }
  };
  
  const handlePublishToggle = async () => {
    if (!classData || !classData.id) return;
    
    try {
      const newStatus = !isPublished;
      
      // In a real application, update the class status via API
      const { data, error } = await classService.update(classData.id, {
        isPublished: newStatus
      });
      
      if (error) {
        console.error("Error updating class status:", error);
        // You'd typically show an error toast here
      } else {
        setIsPublished(newStatus);
        // You'd typically show a success toast here
      }
    } catch (err) {
      console.error("Error in handlePublishToggle:", err);
      // You'd typically show an error toast here
    }
  };

  // Show loading state
  if (isLoading || teacherIdLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <p>Loading class data...</p>
      </div>
    );
  }
  
  // Show error state
  if (error || !classData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-700">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p>{error || "Failed to load class data"}</p>
          <Button 
            className="mt-4" 
            onClick={() => classId && fetchClassData(classId)}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Top action bar */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{classData.title}</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => window.location.href = `/teacher-class-setup/${classData.id}`}
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button 
              variant={isPublished ? "destructive" : "default"}
              size="sm" 
              className="flex items-center gap-2"
              onClick={handlePublishToggle}
            >
              {isPublished ? (
                <>
                  <Archive className="h-4 w-4" />
                  Unpublish
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4" />
                  Publish
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start mb-6">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="lesson-plans" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Lesson Plans
                </TabsTrigger>
                <TabsTrigger value="cohorts" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Cohorts
                </TabsTrigger>
                <TabsTrigger value="teaching-team" className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4" />
                  Teaching Team
                </TabsTrigger>
                <TabsTrigger value="students" className="flex items-center gap-2">
                  <BookMarked className="h-4 w-4" />
                  Students
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <ClassOverview classData={classData} currentClassSummary={currentClassSummary} />
              </TabsContent>
              
              <TabsContent value="lesson-plans">
                <LessonPlans lessonPlans={classData.lessonPlans} classId={classData.id} />
              </TabsContent>
              
              <TabsContent value="cohorts">
                <Cohorts cohorts={classData.cohorts} />
              </TabsContent>
              
              <TabsContent value="teaching-team">
                <TeachingTeam teachingTeam={classData.teachingTeam} />
              </TabsContent>
              
              <TabsContent value="students">
                <Students students={classData.students} cohorts={classData.cohorts} />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <ClassStats 
              stats={classData.stats} 
              currentClassSummary={currentClassSummary}
              analytics={summaryData?.analytics}
            />
            <QuickActions />
            <UpcomingSessions 
              cohorts={classData.cohorts}
              teacherSummaryData={summaryData}
              currentClassId={classId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherClassView;