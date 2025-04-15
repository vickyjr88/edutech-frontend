
import ParentSidebar from "@/components/parents/ParentSidebar";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";
import { FileText, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockReports = [
  {
    id: 1,
    title: "Term 1 Progress Report",
    child: "Emma Johnson",
    subject: "All Subjects",
    date: "March 15, 2025",
    type: "Progress Report",
    status: "Final"
  },
  {
    id: 2,
    title: "Mathematics Assessment",
    child: "Noah Johnson",
    subject: "Mathematics",
    date: "March 10, 2025",
    type: "Assessment",
    status: "Draft"
  },
  {
    id: 3,
    title: "Science Project Evaluation",
    child: "Emma Johnson",
    subject: "Science",
    date: "March 5, 2025",
    type: "Project",
    status: "Final"
  }
];

const ParentsReports = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ParentSidebar />
      
      <div className="flex-1 flex flex-col">
        <ParentDashboardHeader parentName="Kate Johnson" />
        
        <main className="p-6 flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="h-6 w-6 text-kidato-blue" />
              <h1 className="text-2xl font-bold">Reports</h1>
            </div>
            
            <div className="grid gap-4">
              {mockReports.map((report) => (
                <Card key={report.id} className="hover:border-blue-200 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{report.title}</h3>
                          <Badge variant={report.status === "Final" ? "default" : "secondary"}>
                            {report.status}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <p>Student: {report.child}</p>
                          <p>Subject: {report.subject}</p>
                          <p>Type: {report.type}</p>
                          <p>Date: {report.date}</p>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download PDF
                      </Button>
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

export default ParentsReports;
