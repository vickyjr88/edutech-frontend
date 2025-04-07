
import { Card, CardContent } from "@/components/ui/card";
import { FileBox, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResourcesTabProps {
  teacher: any;
}

export default function ResourcesTab({ teacher }: ResourcesTabProps) {
  // Mock data - in a real application, this would come from the teacher's profile
  const resources = teacher.resources || [
    {
      id: "resource1",
      title: "Chemistry Study Guide",
      description: "Comprehensive notes for high school chemistry",
      type: "pdf",
      downloadUrl: "#"
    },
    {
      id: "resource2",
      title: "Physics Formula Sheet",
      description: "Key formulas for physics exams",
      type: "pdf",
      downloadUrl: "#"
    },
    {
      id: "resource3",
      title: "Biology Diagrams",
      description: "Visual aids for understanding biological systems",
      type: "zip",
      downloadUrl: "#"
    },
    {
      id: "resource4",
      title: "Mathematics Practice Problems",
      description: "Additional practice problems for algebra",
      type: "pdf",
      downloadUrl: "#"
    },
    {
      id: "resource5",
      title: "History Timeline",
      description: "Interactive timeline for historical events",
      type: "link",
      downloadUrl: "https://example.com/timeline"
    }
  ];

  // Group resources by type for better organization
  const articles = teacher.articles || [
    {
      id: "article1",
      title: "The Importance of STEM Education",
      description: "Exploring the impact of STEM education on future career opportunities",
      date: "March 15, 2023",
      readUrl: "#"
    },
    {
      id: "article2",
      title: "Engaging Reluctant Learners",
      description: "Strategies for motivating students who struggle with academic engagement",
      date: "January 22, 2023",
      readUrl: "#"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-6">Resources</h2>
        
        {resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource: any) => (
              <Card key={resource.id}>
                <CardContent className="p-6 flex items-start">
                  <div className="bg-blue-50 p-3 rounded-full mr-4">
                    <FileText className="h-6 w-6 text-kidato-blue" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{resource.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{resource.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="uppercase">{resource.type}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="rounded-full bg-gray-100 p-6 mb-4">
              <FileBox className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium">No resources yet</h3>
            <p className="text-sm text-gray-500 max-w-sm mt-2">
              This teacher hasn't uploaded any learning resources yet. Check back later for updates.
            </p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-6">Articles & Posts</h2>
        
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article: any) => (
              <Card key={article.id}>
                <CardContent className="p-6">
                  <h3 className="font-medium">{article.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{article.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-500">{article.date}</span>
                    <Button variant="link" size="sm" className="p-0">
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="rounded-full bg-gray-100 p-6 mb-4">
              <FileText className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium">No articles yet</h3>
            <p className="text-sm text-gray-500 max-w-sm mt-2">
              This teacher hasn't published any articles or posts yet. Check back later for updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
