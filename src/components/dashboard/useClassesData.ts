
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { showClassReminder } from "./LiveClassAlert";
import { useAuth } from "@/contexts/AuthContext";
import { useTodaysLessons, useUpcomingSessions } from "@/hooks/use-student-service";

export function useClassesData() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [bookmarkedClasses, setBookmarkedClasses] = useState<string[]>([]);
  const [lastReminderTime, setLastReminderTime] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fetch today's lessons and upcoming sessions
  const { data: todaysLessonsResponse, isLoading: todaysLessonsLoading } = useTodaysLessons(user?.studentId || '');
  const { data: upcomingSessionsResponse, isLoading: upcomingSessionsLoading } = useUpcomingSessions(user?.studentId || '');

  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []); 
  
  // Transform API data to match expected format
  const todaysLessons = todaysLessonsResponse?.data?.lessons || [];
  const upcomingSessions = upcomingSessionsResponse?.data || [];
  
  // Transform today's lessons to match existing interface
  const transformedTodaysLessons = todaysLessons.map(lesson => ({
    id: lesson?.id || '',
    title: lesson?.title || 'Untitled Lesson',
    subject: lesson?.subject || 'General',
    teacher: lesson?.teacher?.fullName || 'TBA',
    cohort: lesson?.curriculum || 'Standard',
    sessionTime: new Date(lesson?.sessionInfo?.when || Date.now()),
    isLiveNow: lesson?.isLiveNow || false
  }));
  
  // Transform upcoming sessions to match existing interface
  const transformedUpcomingSessions = upcomingSessions.map(session => ({
    id: session?.classId || '',
    title: session?.title || 'Upcoming Session',
    subject: session?.subject || 'General',
    teacher: session?.teacherName || 'TBA',
    teacherImage: session?.profileImage || '/api/placeholder/80/80',
    teacherId: (session as any)?.teacherId || '', // Add this line - assuming backend will provide it
    cohort: session?.cohortName || 'Standard',
    sessionTime: new Date(session?.startTime || Date.now()),
    isLiveNow: false,
    classType: session?.sessionType === 'academic' ? 'Academic' : 'General',
    grade: 'Junior High', // Default grade - this should come from student profile
    curriculum: session?.cohortName || 'Standard',
    nextTopic: session?.nextLesson || 'To be announced',
    students: session?.studentsEnrolled || 0,
    nextSession: new Date(session?.startTime || Date.now()).toLocaleString(),
    progress: session?.progress || 0,
    totalLessonsCompleted: Math.floor(((session?.progress || 0) / 100) * (session?.lessonsRemaining || 1)),
    totalLessons: session?.lessonsRemaining || 1,
    homeworkDue: null,
    color: 'bg-gradient-to-br from-blue-50 to-purple-50',
    iconBg: 'bg-blue-100 text-blue-600'
  }));
  
  // Combine and sort all classes, removing duplicates
  const allClasses = [...transformedTodaysLessons, ...transformedUpcomingSessions];
  
  // Remove duplicates based on class ID
  const uniqueClasses = allClasses.reduce((acc, current) => {
    const exists = acc.find(item => item.id === current.id);
    if (!exists && current.id) {
      return [...acc, current];
    }
    return acc;
  }, [] as typeof allClasses);
  
  const sortedClasses = uniqueClasses.sort((a, b) => 
    a.sessionTime.getTime() - b.sessionTime.getTime()
  );

  // Define currentClass - a class that's currently live
  const currentClass = sortedClasses.find(cls => {
    const now = currentTime.getTime();
    const classTime = cls.sessionTime.getTime();
    const timeDiffMinutes = (now - classTime) / (1000 * 60);
    return timeDiffMinutes >= 0 && timeDiffMinutes < 60;
  });

  // Get upcoming classes (not current)
  const upcomingClasses = sortedClasses
    .filter(cls => cls.sessionTime > currentTime)
    .filter(cls => !currentClass || cls.id !== currentClass.id)
    .slice(0, currentClass ? 2 : 3);

  // Classes to display: current class first, then upcoming
  const classesToDisplay = currentClass 
    ? [currentClass, ...upcomingClasses] 
    : upcomingClasses;
    
  const getMinutesSinceStart = (classTime: Date) => {
    if (classTime > currentTime) return null;
    
    const diffMs = currentTime.getTime() - classTime.getTime();
    return Math.floor(diffMs / (1000 * 60));
  };

  const toggleBookmark = (classId: string) => {
    setBookmarkedClasses(prev => 
      prev.includes(classId) 
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };
  
  const handleJoinClass = useCallback((classItem: any) => {
    // This function will be provided by CurrentClasses.tsx
    // We're defining it here so we can use it in the reminder
    console.log("Joining class:", classItem.title);
    // The actual implementation will be passed from CurrentClasses
  }, []);
  
  // Check for live class and show reminder every 5 minutes
  useEffect(() => {
    if (!currentClass) return;
    
    const reminderInterval = setInterval(() => {
      const now = Date.now();
      // Show reminder every 5 minutes (300000 ms)
      if (now - lastReminderTime > 300000) {
        showClassReminder(toast, currentClass, handleJoinClass);
        setLastReminderTime(now);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(reminderInterval);
  }, [currentClass, lastReminderTime, toast, handleJoinClass]);
  
  // Show initial reminder when component loads and there's a live class
  useEffect(() => {
    if (currentClass && Date.now() - lastReminderTime > 300000) {
      // Only show on initial load
      setTimeout(() => {
        showClassReminder(toast, currentClass, handleJoinClass);
        setLastReminderTime(Date.now());
      }, 3000); // Show after 3 seconds to let the page load
    }
  }, [currentClass, lastReminderTime, toast, handleJoinClass]);
  
  return {
    currentTime,
    currentClass,
    classesToDisplay,
    bookmarkedClasses,
    getMinutesSinceStart,
    toggleBookmark,
    handleJoinClass,
    isLoading: todaysLessonsLoading || upcomingSessionsLoading,
    todaysLessons
  };
}
