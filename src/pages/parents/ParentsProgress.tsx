
import ParentSidebar from "@/components/parents/ParentSidebar";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";
import { GraduationCap, TrendingUp, ChevronUp, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const mockProgress = [
  {
    id: 1,
    child: "Emma Johnson",
    subjects: [
      { name: "Mathematics", progress: 85, trend: "up", change: "+5%" },
      { name: "Science", progress: 78, trend: "up", change: "+3%" },
      { name: "English", progress: 92, trend: "up", change: "+2%" }
    ],
    overallProgress: 85,
    lastUpdate: "March 15, 2025"
  },
  {
    id: 2,
    child: "Noah Johnson",
    subjects: [
      { name: "Mathematics", progress: 72, trend: "down", change: "-2%" },
      { name: "Science", progress: 88, trend: "up", change: "+4%" },
      { name: "English", progress: 76, trend: "up", change: "+1%" }
    ],
    overallProgress: 79,
    lastUpdate: "March 15, 2025"
  }
];

const ParentsProgress = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ParentSidebar />
      
      <div className="flex-1 flex flex-col">
        <ParentDashboardHeader parentName="Kate Johnson" />
        
        <main className="p-6 flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="h-6 w-6 text-kidato-purple" />
              <h1 className="text-2xl font-bold">Academic Progress</h1>
            </div>
            
            <div className="space-y-6">
              {mockProgress.map((child) => (
                <Card key={child.id} className="hover:border-blue-200 transition-colors">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h2 className="text-xl font-bold mb-1">{child.child}</h2>
                      <p className="text-sm text-gray-600">Last updated: {child.lastUpdate}</p>
                    </div>
                    
                    <div className="space-y-6">
                      {child.subjects.map((subject) => (
                        <div key={subject.name} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{subject.name}</span>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={subject.trend === "up" ? "default" : "destructive"}
                                className="flex items-center gap-1"
                              >
                                {subject.trend === "up" ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                                {subject.change}
                              </Badge>
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default ParentsProgress;
