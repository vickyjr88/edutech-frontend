import { useState, useEffect } from "react";
import ParentSidebar from "@/components/parents/ParentSidebar";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";
import { GraduationCap, TrendingUp, Loader2, AlertCircle, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { classService } from "@/integrations/api/services/class.service";
import { format } from "date-fns";

interface SubjectProgress {
  id: string;
  name: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

interface StudentProgressData {
  id: string; // studentId or userId
  childName: string;
  subjects: SubjectProgress[];
  overallProgress: number;
  lastUpdate: string;
}

const ParentsProgress = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<StudentProgressData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        // Fetch Enrolled Classes
        const response = await classService.getCurrentClassesForStudent(user.id);

        if (response.data && Array.isArray(response.data)) {
          // Flatten classes into subjects
          // We treat each class as a "Subject" here for progress tracking

          const subjectPromises = response.data.map(async (cls: any) => {
            // Fetch detailed progress for each class
            try {
              const progRes = await classService.getProgress(cls._id);
              const pData = progRes.data;
              const percent = pData ? pData.progress : 0;

              return {
                id: cls._id,
                name: cls.title || cls.subject || "Class",
                progress: percent,
                totalLessons: pData?.totalLessons || 0,
                completedLessons: pData?.completedLessons || 0
              } as SubjectProgress;
            } catch (e) {
              return {
                id: cls._id,
                name: cls.title || cls.subject || "Class",
                progress: 0,
                totalLessons: 0,
                completedLessons: 0
              } as SubjectProgress;
            }
          });

          const subjects = await Promise.all(subjectPromises);

          // Calculate overall
          const totalProgressSum = subjects.reduce((acc, curr) => acc + curr.progress, 0);
          const overall = subjects.length > 0 ? Math.round(totalProgressSum / subjects.length) : 0;

          // We currently only handle the logged-in user (single child view in this context)
          const studentData: StudentProgressData = {
            id: user.id,
            childName: user.fullName || "Student",
            subjects: subjects,
            overallProgress: overall,
            lastUpdate: format(new Date(), "MMMM d, yyyy")
          };

          setProgressData([studentData]);
        } else {
          setProgressData([]);
        }
      } catch (err) {
        console.error("Failed to fetch progress", err);
        setError("Failed to load academic progress");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [user?.id, user?.fullName]);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ParentSidebar />

      <div className="flex-1 flex flex-col">
        <ParentDashboardHeader parentName={user?.fullName || "Parent"} />

        <main className="p-6 flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="h-6 w-6 text-kidato-purple" />
              <h1 className="text-2xl font-bold">Academic Progress</h1>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{error}</p>
              </div>
            ) : progressData.length === 0 || progressData[0].subjects.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No active classes found to track progress.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {progressData.map((child) => (
                  <Card key={child.id} className="hover:border-blue-200 transition-colors">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h2 className="text-xl font-bold mb-1">{child.childName}</h2>
                        <p className="text-sm text-gray-600">Last updated: {child.lastUpdate}</p>
                      </div>

                      <div className="space-y-6">
                        {child.subjects.map((subject) => (
                          <div key={subject.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{subject.name}</span>
                              <div className="flex items-center gap-2">
                                {/* 
                                Removed Trend Badge since we don't have historical data 
                                Replaced with simple stats text
                              */}
                                <span className="text-xs text-gray-500 mr-2">
                                  {subject.completedLessons} / {subject.totalLessons} lessons
                                </span>
                                <span className="font-medium">{subject.progress}%</span>
                              </div>
                            </div>
                            <Progress value={subject.progress} className="h-2" />
                          </div>
                        ))}

                        <div className="pt-4 border-t">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold">Overall Progress</span>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-blue-500" />
                              <span className="font-bold text-lg">{child.overallProgress}%</span>
                            </div>
                          </div>
                          <Progress value={child.overallProgress} className="h-3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ParentsProgress;
