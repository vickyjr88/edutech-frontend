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
  Volleyball
} from "lucide-react";

// Mock data for recommended classes - Academic
const academicClasses = [
  {
    id: 1,
    title: "Introduction to Python Programming",
    category: "Coding",
    isAcademic: true,
    icon: <Code className="h-4 w-4" />,
    recommendedFor: ["Noah Johnson"],
    reasonsToJoin: ["Popular in 5th grade", "Builds problem-solving skills", "Pairs well with Math"],
    peerCount: 24,
    rating: 4.9,
    nextSession: "Tomorrow, 4:00 PM",
    popularity: "Trending",
    backgroundColor: "bg-blue-50",
    accentColor: "bg-blue-500",
    textColor: "text-blue-700"
  },
  {
    id: 2,
    title: "Advanced Algebra Prep",
    category: "Mathematics",
    isAcademic: true,
    icon: <Calculator className="h-4 w-4" />,
    recommendedFor: ["Emma Johnson"],
    reasonsToJoin: ["Prepare for 8th grade math", "Most classmates enrolled", "Builds strong foundation"],
    peerCount: 32,
    rating: 4.8,
    nextSession: "Today, 5:00 PM",
    popularity: "Popular in Grade",
    backgroundColor: "bg-green-50",
    accentColor: "bg-green-500",
    textColor: "text-green-700"
  },
  {
    id: 3,
    title: "Creative Writing Workshop",
    category: "Language Arts",
    isAcademic: true,
    icon: <PenTool className="h-4 w-4" />,
    recommendedFor: ["Emma Johnson", "Noah Johnson"],
    reasonsToJoin: ["Improves essay writing", "Great for college prep", "Enhances creativity"],
    peerCount: 21,
    rating: 4.6,
    nextSession: "Friday, 4:30 PM",
    popularity: "Teacher Recommended",
    backgroundColor: "bg-amber-50",
    accentColor: "bg-amber-500",
    textColor: "text-amber-700"
  },
  {
    id: 4,
    title: "Ecosystems & Habitats",
    category: "Science",
    isAcademic: true,
    icon: <Dna className="h-4 w-4" />,
    recommendedFor: ["Noah Johnson", "Olivia Johnson"],
    reasonsToJoin: ["Builds on current curriculum", "Includes field trips", "Great teacher ratings"],
    peerCount: 26,
    rating: 4.8,
    nextSession: "Thursday, 3:00 PM",
    popularity: "New Class",
    backgroundColor: "bg-teal-50",
    accentColor: "bg-teal-500",
    textColor: "text-teal-700"
  },
  {
    id: 5,
    title: "Spanish for Elementary",
    category: "Languages",
    isAcademic: true,
    icon: <Globe className="h-4 w-4" />,
    recommendedFor: ["Olivia Johnson"],
    reasonsToJoin: ["Great age to learn languages", "Fun interactive lessons", "Builds global awareness"],
    peerCount: 19,
    rating: 4.9,
    nextSession: "Tuesday, 2:30 PM",
    popularity: "Highly Recommended",
    backgroundColor: "bg-red-50",
    accentColor: "bg-red-500",
    textColor: "text-red-700"
  }
];

// Mock data for recommended classes - Non-Academic
const nonAcademicClasses = [
  {
    id: 6,
    title: "Violin for Beginners",
    category: "Music",
    isAcademic: false,
    icon: <Music className="h-4 w-4" />,
    recommendedFor: ["Olivia Johnson"],
    reasonsToJoin: ["Great for cognitive development", "Popular with 3rd graders", "Builds discipline"],
    peerCount: 18,
    rating: 4.7,
    nextSession: "Wednesday, 3:30 PM",
    popularity: "Highly Rated",
    backgroundColor: "bg-purple-50",
    accentColor: "bg-purple-500",
    textColor: "text-purple-700"
  },
  {
    id: 7,
    title: "Art & Mixed Media",
    category: "Arts & Crafts",
    isAcademic: false,
    icon: <Palette className="h-4 w-4" />,
    recommendedFor: ["Olivia Johnson", "Noah Johnson"],
    reasonsToJoin: ["Develops creativity", "Stress-relieving activity", "Fun and engaging"],
    peerCount: 22,
    rating: 4.9,
    nextSession: "Monday, 4:15 PM",
    popularity: "Most Popular",
    backgroundColor: "bg-pink-50",
    accentColor: "bg-pink-500",
    textColor: "text-pink-700"
  },
  {
    id: 8,
    title: "Junior Basketball Skills",
    category: "Sports",
    isAcademic: false,
    icon: <Volleyball className="h-4 w-4" />,
    recommendedFor: ["Noah Johnson"],
    reasonsToJoin: ["Physical fitness", "Teamwork development", "Popular with peers"],
    peerCount: 28,
    rating: 4.8,
    nextSession: "Saturday, 10:00 AM",
    popularity: "Fun & Active",
    backgroundColor: "bg-orange-50",
    accentColor: "bg-orange-500",
    textColor: "text-orange-700"
  },
  {
    id: 9,
    title: "Chess Club: Advanced Strategies",
    category: "Strategy Games",
    isAcademic: false,
    icon: <Target className="h-4 w-4" />,
    recommendedFor: ["Emma Johnson"],
    reasonsToJoin: ["Critical thinking skills", "Competitive environment", "Mental exercise"],
    peerCount: 16,
    rating: 4.7,
    nextSession: "Thursday, 5:30 PM",
    popularity: "Brain Booster",
    backgroundColor: "bg-indigo-50",
    accentColor: "bg-indigo-500",
    textColor: "text-indigo-700"
  },
  {
    id: 10,
    title: "Public Speaking for Kids",
    category: "Life Skills",
    isAcademic: false,
    icon: <Trophy className="h-4 w-4" />,
    recommendedFor: ["Emma Johnson", "Noah Johnson"],
    reasonsToJoin: ["Builds confidence", "Important life skill", "Fun group activities"],
    peerCount: 15,
    rating: 4.9,
    nextSession: "Tuesday, 4:00 PM",
    popularity: "Parent Favorite",
    backgroundColor: "bg-cyan-50",
    accentColor: "bg-cyan-500",
    textColor: "text-cyan-700"
  }
];

// Class card component to avoid duplication
const ClassCard = ({ classItem }) => (
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
      
      <div className="space-y-1 mb-3">
        <div className="text-xs font-medium text-gray-500">Why It's a Good Fit:</div>
        <ul className="text-xs text-gray-600 pl-5 list-disc">
          {classItem.reasonsToJoin.map((reason, idx) => (
            <li key={idx}>{reason}</li>
          ))}
        </ul>
      </div>
      
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
            <TabsTrigger value="academic" className="flex-1">Academic Subjects</TabsTrigger>
            <TabsTrigger value="non-academic" className="flex-1">Extracurricular Activities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="academic">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {academicClasses.map((classItem) => (
                <ClassCard key={classItem.id} classItem={classItem} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="non-academic">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {nonAcademicClasses.map((classItem) => (
                <ClassCard key={classItem.id} classItem={classItem} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RecommendedClasses;