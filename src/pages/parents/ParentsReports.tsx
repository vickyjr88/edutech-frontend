import { useState, useEffect } from "react";
import ParentSidebar from "@/components/parents/ParentSidebar";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";
import { FileText, Download, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { classService } from "@/integrations/api/services/class.service";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface Report {
  id: string; // classId or unique ID
  title: string;
  child: string;
  subject: string;
  date: string;
  type: string;
  status: string;
  downloadUrl?: string; // in a real app this would be a link to the PDF
}

const ParentsReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        // We'll generate "reports" based on completed and active classes.
        // Completed classes -> Final Report
        // Active classes -> Progress Report

        // 1. Fetch Completed Classes
        const completedRes = await classService.getCompletedClassesForStudent(user.id);
        const completedClasses = (completedRes.data || []) as any[]; // cast to any since return type is generic/never

        // 2. Fetch Active Classes
        const activeRes = await classService.getCurrentClassesForStudent(user.id);
        const activeClasses = (activeRes.data || []) as any[];

        const generatedReports: Report[] = [];

        // Map Completed Classes
        completedClasses.forEach(cls => {
          generatedReports.push({
            id: `final-${cls._id}`,
            title: `${cls.title} - Final Report`,
            child: user.fullName || "Student",
            subject: cls.subject || "General",
            date: format(new Date(cls.updatedAt || new Date()), "MMMM d, yyyy"),
            type: "Final Assessment",
            status: "Final"
          });
        });

        // Map Active Classes
        // We could pretend we generate a progress report every month. For now, just one "Current Progress" report.
        activeClasses.forEach(cls => {
          generatedReports.push({
            id: `prog-${cls._id}`,
            title: `${cls.title} - Progress Update`,
            child: user.fullName || "Student",
            subject: cls.subject || "General",
            date: format(new Date(), "MMMM d, yyyy"),
            type: "Progress Report",
            status: "Interim"
          });
        });

        setReports(generatedReports);
      } catch (err) {
        console.error("Failed to fetch reports", err);
        setError("Failed to generate reports");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [user?.id, user?.fullName]);

  const handleDownload = (report: Report) => {
    // In a real app, this would trigger a file download from the URL.
    // For now, we simulate it.
    toast({
      title: "Downloading Report",
      description: `Downloading ${report.title}...`,
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ParentSidebar />

      <div className="flex-1 flex flex-col">
        <ParentDashboardHeader parentName={user?.fullName || "Parent"} />

        <main className="p-6 flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="h-6 w-6 text-kidato-purple" />
              <h1 className="text-2xl font-bold">Reports</h1>
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
            ) : reports.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No reports available yet.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {reports.map((report) => (
                  <Card key={report.id} className="hover:border-blue-200 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{report.title}</h3>
                            <Badge variant={report.status === "Final" ? "default" : "secondary"}>
                              {report.status}
                            </Badge>
                          </div>

                          <div className="text-sm text-gray-600 space-y-1">
                            <p><span className="font-medium">Student:</span> {report.child}</p>
                            <p><span className="font-medium">Subject:</span> {report.subject}</p>
                            <p><span className="font-medium">Type:</span> {report.type}</p>
                            <p><span className="font-medium">Date:</span> {report.date}</p>
                          </div>
                        </div>

                        <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto" onClick={() => handleDownload(report)}>
                          <Download className="h-4 w-4" />
                          Download PDF
                        </Button>
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

export default ParentsReports;
