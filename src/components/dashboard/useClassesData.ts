
import { useState, useEffect, useCallback } from "react";
import { initializeSessionTimes } from "./mockClassData";
import { useToast } from "@/hooks/use-toast";
import { showClassReminder } from "./LiveClassAlert";

export function useClassesData() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [bookmarkedClasses, setBookmarkedClasses] = useState<string[]>([]);
  const [isAlertVisible, setIsAlertVisible] = useState(true);
  const [lastReminderTime, setLastReminderTime] = useState(0);
  const { toast } = useToast();
  
  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const allClasses = initializeSessionTimes(currentTime);
  
  const sortedClasses = [...allClasses].sort((a, b) => 
    a.sessionTime.getTime() - b.sessionTime.getTime()
  );

  // Define currentClass before it's used in any other function
  const currentClass = sortedClasses.find(cls => {
    const now = currentTime.getTime();
    const classTime = cls.sessionTime.getTime();
    const timeDiffMinutes = (now - classTime) / (1000 * 60);
    return timeDiffMinutes >= 0 && timeDiffMinutes < 60;
  });

  const upcomingClasses = sortedClasses
    .filter(cls => cls.sessionTime > currentTime)
    .filter(cls => !currentClass || cls.id !== currentClass.id)
    .slice(0, currentClass ? 2 : 3);

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
    isAlertVisible,
    setIsAlertVisible,
    getMinutesSinceStart,
    toggleBookmark,
    handleJoinClass
  };
}
