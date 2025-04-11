
import { useState, useEffect } from "react";
import { initializeSessionTimes } from "./mockClassData";

export function useClassesData() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [bookmarkedClasses, setBookmarkedClasses] = useState<string[]>([]);
  const [isAlertVisible, setIsAlertVisible] = useState(true);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const allClasses = initializeSessionTimes(currentTime);
  
  const sortedClasses = [...allClasses].sort((a, b) => 
    a.sessionTime.getTime() - b.sessionTime.getTime()
  );

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
  
  return {
    currentTime,
    currentClass,
    classesToDisplay,
    bookmarkedClasses,
    isAlertVisible,
    setIsAlertVisible,
    getMinutesSinceStart,
    toggleBookmark
  };
}
