
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, BookText, Brain, Calculator, Dna, Globe, Languages, Target, Loader2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { classService } from "@/integrations/api/services/class.service";
import { useAuth } from "@/contexts/AuthContext";

interface SubjectData {
  id: string;
  subject: string;
  progress: number;
  icon: JSX.Element;
  grade: string;
  color: string;
  goals: string[];
}

const getSubjectIcon = (subject: string) => {
  const norm = subject.toLowerCase();
  if (norm.includes('math')) return <Calculator className="h-4 w-4" />;
  if (norm.includes('science') || norm.includes('bio') || norm.includes('chem') || norm.includes('phys')) return <Dna className="h-4 w-4" />;
  if (norm.includes('language') || norm.includes('english')) return <BookText className="h-4 w-4" />;
  if (norm.includes('history') || norm.includes('geography')) return <Globe className="h-4 w-4" />;
  if (norm.includes('language')) return <Languages className="h-4 w-4" />;
  return <Brain className="h-4 w-4" />;
};

const getSubjectColor = (index: number) => {
  const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-amber-500", "bg-red-500", "bg-indigo-500"];
  return colors[index % colors.length];
};

const getGrade = (percentage: number) => {
  if (percentage >= 97) return "A+";
  if (percentage >= 93) return "A";
  if (percentage >= 90) return "A-";
  if (percentage >= 87) return "B+";
  if (percentage >= 83) return "B";
  if (percentage >= 80) return "B-";
  if (percentage >= 77) return "C+";
  if (percentage >= 73) return "C";
  if (percentage >= 70) return "C-";
  return "D";
};

const AcademicProgress = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overallAverage, setOverallAverage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // 1. Get Enrolled Classes
        const classesResponse = await classService.getCurrentClassesForStudent(user.id);

        if (classesResponse.data && Array.isArray(classesResponse.data)) {
          // 2. Fetch progress for each class
          const progressPromises = classesResponse.data.map(async (cls: any) => {
            try {
              const progResp = await classService.getProgress(cls._id || cls.id);
              return {
                classId: cls._id || cls.id,
                title: cls.title,
                subject: cls.subject || "General",
                data: progResp.data
              };
            } catch (e) {
              // Return null or partial data on fail
              return {
                classId: cls._id || cls.id,
                title: cls.title,
                subject: cls.subject || "General",
                data: null
              };
            }
          });

          const results = await Promise.all(progressPromises);

          // 3. Group by subject
          const groupedBySubject: Record<string, { totalProgress: number; count: number; goals: string[] }> = {};

          results.forEach(res => {
            const subject = res.subject;
            if (!groupedBySubject[subject]) {
              groupedBySubject[subject] = { totalProgress: 0, count: 0, goals: [] };
            }

            const progressVal = res.data?.progress || 0;
            groupedBySubject[subject].totalProgress += progressVal;
            groupedBySubject[subject].count += 1;

            if (res.data?.nextLesson) {
              groupedBySubject[subject].goals.push(`Next: ${res.data.nextLesson.title}`);
            } else {
              groupedBySubject[subject].goals.push(`Complete lessons in ${res.title}`);
            }
          });

          // 4. Map to SubjectData
          const mappedSubjects: SubjectData[] = Object.keys(groupedBySubject).map((subj, index) => {
            const avg = groupedBySubject[subj].totalProgress / groupedBySubject[subj].count;
            // Limit goals to 2
            const uniqueGoals = Array.from(new Set(groupedBySubject[subj].goals)).slice(0, 2);

            return {
              id: `subj-${index}`,
              subject: subj,
              progress: Math.round(avg),
              icon: getSubjectIcon(subj),
              grade: getGrade(avg),
              color: getSubjectColor(index),
              goals: uniqueGoals
            };
          });

          setSubjects(mappedSubjects);

          // Calculate overall
          if (mappedSubjects.length > 0) {
            const total = mappedSubjects.reduce((acc, curr) => acc + curr.progress, 0);
            setOverallAverage(total / mappedSubjects.length);
          }
        } else {
          setSubjects([]);
        }
      } catch (err) {
        console.error("Failed to load academic progress", err);
        setError("Failed to load academic data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  return (
    <Card className="border border-blue-100">
      <CardHeader className="bg-blue-50/50 pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
          Academic Progress & Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading progress...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>{error}</p>
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No enrolled classes found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {subjects.map((subject) => (
              <div key={subject.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded-md text-white ${subject.color}`}>
                      {subject.icon}
                    </div>
                    <span className="font-medium">{subject.subject}</span>
                  </div>
                  <Badge className={`${subject.color} text-white border-0`}>{subject.grade}</Badge>
                </div>

                <Progress value={subject.progress} className="h-2" />

                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm font-medium mb-2">Current Goals:</div>
                  <div className="space-y-2">
                    {subject.goals.map((goal, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Target className="h-3 w-3 text-blue-500" />
                        <span className="text-sm text-gray-600 truncate">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {subject.id !== subjects[subjects.length - 1].id && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        )}

        {subjects.length > 0 && (
          <div className="mt-6 bg-blue-50 p-3 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Overall Performance</h4>
                <p className="text-sm text-gray-600">Current Academic Term</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-semibold text-blue-600">{overallAverage.toFixed(1)}%</span>
                <div className="text-sm text-gray-500">Grade: {getGrade(overallAverage)}</div>
              </div>
            </div>
            <Progress value={overallAverage} className="h-2.5 mt-3" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AcademicProgress;
