import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  TrendingUp,
  Users,
  Star,
  Calendar,
  ChevronRight,
  Music,
  Code,
  Globe,
  Calculator,
  PenTool,
  Zap,
  Dna,
  Palette,
  Target,
  Trophy,
  Volleyball,
  Loader2,
  BookX
} from "lucide-react";
import { classService, ClassDetail } from "@/integrations/api/services/class.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface RecommendedClass {
  id: string;
  title: string;
  category: string;
  isAcademic: boolean;
  icon: JSX.Element;
  recommendedFor: string[];
  reasonsToJoin: string[];
  peerCount: number;
  rating: number;
  nextSession: string;
  popularity: string;
  backgroundColor: string;
  accentColor: string;
  textColor: string;
}

// Helper function to get icon based on subject/category
const getCategoryIcon = (subject: string, isAcademic: boolean) => {
  const lowerSubject = subject?.toLowerCase() || '';

  if (lowerSubject.includes('math') || lowerSubject.includes('algebra') || lowerSubject.includes('calculus')) {
    return <Calculator className="h-4 w-4" />;
  }
  if (lowerSubject.includes('code') || lowerSubject.includes('programming') || lowerSubject.includes('computer')) {
    return <Code className="h-4 w-4" />;
  }
  if (lowerSubject.includes('science') || lowerSubject.includes('biology') || lowerSubject.includes('chemistry')) {
    return <Dna className="h-4 w-4" />;
  }
  if (lowerSubject.includes('language') || lowerSubject.includes('spanish') || lowerSubject.includes('french')) {
    return <Globe className="h-4 w-4" />;
  }
  if (lowerSubject.includes('writing') || lowerSubject.includes('english') || lowerSubject.includes('literature')) {
    return <PenTool className="h-4 w-4" />;
  }
  if (lowerSubject.includes('music')) {
    return <Music className="h-4 w-4" />;
  }
  if (lowerSubject.includes('art') || lowerSubject.includes('drawing') || lowerSubject.includes('painting')) {
    return <Palette className="h-4 w-4" />;
  }
  if (lowerSubject.includes('sport') || lowerSubject.includes('basketball') || lowerSubject.includes('soccer')) {
    return <Volleyball className="h-4 w-4" />;
  }
  if (lowerSubject.includes('chess') || lowerSubject.includes('strategy')) {
    return <Target className="h-4 w-4" />;
  }
  if (lowerSubject.includes('speaking') || lowerSubject.includes('debate')) {
    return <Trophy className="h-4 w-4" />;
  }

  return isAcademic ? <BookOpen className="h-4 w-4" /> : <Zap className="h-4 w-4" />;
};

// Helper function to get color scheme
const getColorScheme = (index: number) => {
  const schemes = [
    { bg: "bg-blue-50", accent: "bg-blue-500", text: "text-blue-700" },
    { bg: "bg-green-50", accent: "bg-green-500", text: "text-green-700" },
    { bg: "bg-amber-50", accent: "bg-amber-500", text: "text-amber-700" },
    { bg: "bg-teal-50", accent: "bg-teal-500", text: "text-teal-700" },
    { bg: "bg-red-50", accent: "bg-red-500", text: "text-red-700" },
    { bg: "bg-purple-50", accent: "bg-purple-500", text: "text-purple-700" },
    { bg: "bg-pink-50", accent: "bg-pink-500", text: "text-pink-700" },
    { bg: "bg-orange-50", accent: "bg-orange-500", text: "text-orange-700" },
    { bg: "bg-indigo-50", accent: "bg-indigo-500", text: "text-indigo-700" },
    { bg: "bg-cyan-50", accent: "bg-cyan-500", text: "text-cyan-700" },
  ];
  return schemes[index % schemes.length];
};

// Class card component
const ClassCard = ({ classItem }: { classItem: RecommendedClass }) => (
  <div
    className={`rounded-lg overflow-hidden border border-${classItem.backgroundColor.split('-')[1]}-200 hover:shadow-md transition-all duration-200`}
  >
    <div className={`${classItem.backgroundColor} p-3`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className={`p-1.5 rounded-full mr-2 text-white ${classItem.accentColor}`}>
            {classItem.icon}
          </div>
          <span className={`font-medium ${classItem.textColor}`}>{classItem.category}</span>
        </div>
        <Badge className={`${classItem.backgroundColor} ${classItem.textColor} border border-${classItem.backgroundColor.split('-')[1]}-200`}>
          {classItem.popularity}
        </Badge>
      </div>
      <h3 className="font-semibold text-gray-800">{classItem.title}</h3>
      <div className="mt-2 text-xs text-gray-500 flex items-center">
        <Calendar className="h-3 w-3 mr-1" />
        <span>Next: {classItem.nextSession}</span>
      </div>
    </div>

    <div className="p-3">
      {classItem.recommendedFor.length > 0 && (
        <div className="mb-2">
          <div className="text-xs font-medium text-gray-500 mb-1">Recommended For:</div>
          <div className="flex flex-wrap gap-1 mt-1">
            {classItem.recommendedFor.map((child, idx) => (
              <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700">
                {child.split(' ')[0]}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {classItem.reasonsToJoin.length > 0 && (
        <div className="space-y-1 mb-3">
          <div className="text-xs font-medium text-gray-500">Why It's a Good Fit:</div>
          <ul className="text-xs text-gray-600 pl-5 list-disc">
            {classItem.reasonsToJoin.map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
        <div className="flex items-center">
          <Users className="h-3 w-3 mr-1" />
          <span>{classItem.peerCount} peers enrolled</span>
        </div>
        <div className="flex items-center">
          <Star className="h-3 w-3 text-amber-500 mr-1" fill="#f59e0b" />
          <span>{classItem.rating}/5.0</span>
        </div>
      </div>

      <Button className={`w-full mt-3 text-white ${classItem.accentColor} hover:${classItem.accentColor.replace('bg-', 'bg-')}/90`}>
        Enroll Now
      </Button>
    </div>
  </div>
);

const RecommendedClasses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [academicClasses, setAcademicClasses] = useState<RecommendedClass[]>([]);
  const [nonAcademicClasses, setNonAcademicClasses] = useState<RecommendedClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendedClasses = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await classService.getRecommended(user.id);

        if (response.data) {
          const classes: ClassDetail[] = Array.isArray(response.data) ? response.data : [];

          const transformedClasses: RecommendedClass[] = classes.map((classData, index) => {
            const colorScheme = getColorScheme(index);
            const isAcademic = classData.classType === 'academic' ||
              !['extracurricular', 'club', 'activity'].includes(classData.classType?.toLowerCase() || '');

            // Generate reasons to join based on available data
            const reasons: string[] = [];
            if (classData.studentsList && classData.studentsList.length > 0) {
              reasons.push(`${classData.studentsList.length} students already enrolled`);
            }
            if (classData.curriculum) {
              reasons.push(`Aligned with ${classData.curriculum} curriculum`);
            }
            if (classData.gradeLevel) {
              reasons.push(`Perfect for ${classData.gradeLevel} students`);
            }
            if (reasons.length === 0) {
              reasons.push("Highly recommended for you");
            }

            // Determine next session
            let nextSession = "Schedule varies";
            if (classData.schedule?.startTime) {
              const sessionDate = new Date(classData.schedule.startTime);
              const now = new Date();
              const daysDiff = Math.ceil((sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

              if (daysDiff === 0) {
                nextSession = `Today, ${sessionDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
              } else if (daysDiff === 1) {
                nextSession = `Tomorrow, ${sessionDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
              } else if (daysDiff < 7) {
                nextSession = sessionDate.toLocaleDateString('en-US', { weekday: 'long', hour: 'numeric', minute: '2-digit', hour12: true });
              }
            }

            return {
              id: classData._id,
              title: classData.title,
              category: classData.subject || classData.classType || "General",
              isAcademic,
              icon: getCategoryIcon(classData.subject || classData.title, isAcademic),
              recommendedFor: [user.fullName || "You"],
              reasonsToJoin: reasons,
              peerCount: classData.studentsList?.length || 0,
              rating: classData.rating || 5.0,
              nextSession,
              popularity: classData.studentsList && classData.studentsList.length > 20 ? "Popular" : "Recommended",
              backgroundColor: colorScheme.bg,
              accentColor: colorScheme.accent,
              textColor: colorScheme.text
            };
          });

          // Separate academic and non-academic
          setAcademicClasses(transformedClasses.filter(c => c.isAcademic));
          setNonAcademicClasses(transformedClasses.filter(c => !c.isAcademic));
        }
      } catch (err) {
        console.error("Failed to fetch recommended classes:", err);
        setError("Failed to load recommendations");
        toast({
          title: "Error",
          description: "Failed to load recommended classes. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendedClasses();
  }, [user?.id, user?.fullName, toast]);

  if (isLoading) {
    return (
      <Card className="border border-blue-100 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
            Recommended Classes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-3 text-gray-600">Loading recommendations...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border border-blue-100 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
            Recommended Classes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-center py-12 text-gray-500">
            <BookX className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalClasses = academicClasses.length + nonAcademicClasses.length;

  if (totalClasses === 0) {
    return (
      <Card className="border border-blue-100 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
            Recommended Classes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-center py-12 text-gray-500">
            <BookX className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No recommendations available at the moment</p>
            <p className="text-sm mt-1">Check back later for personalized class suggestions!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-blue-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
            Recommended Classes
          </div>
          <Button variant="ghost" size="sm" className="text-blue-600">
            See All Recommendations
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="academic" className="w-full mb-4">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="academic" className="flex-1">
              Academic Subjects ({academicClasses.length})
            </TabsTrigger>
            <TabsTrigger value="non-academic" className="flex-1">
              Extracurricular Activities ({nonAcademicClasses.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="academic">
            {academicClasses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookX className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No academic classes recommended</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {academicClasses.map((classItem) => (
                  <ClassCard key={classItem.id} classItem={classItem} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="non-academic">
            {nonAcademicClasses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookX className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No extracurricular activities recommended</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {nonAcademicClasses.map((classItem) => (
                  <ClassCard key={classItem.id} classItem={classItem} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RecommendedClasses;