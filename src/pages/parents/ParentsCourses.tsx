import { useState, useEffect } from "react";
import ParentSidebar from "@/components/parents/ParentSidebar";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";
import { BookOpen, Star, Loader2, AlertCircle, Users, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { classService, Class } from "@/integrations/api/services/class.service";
import { useNavigate } from "react-router-dom";

const ParentsCourses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        // Using "browse" to get available classes. 
        // If "browse" accepts filters, we pass empty to get all suitable public classes.
        const response = await classService.browse({});
        if (response.data) {
          setCourses(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch courses", err);
        setError("Failed to load available courses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ParentSidebar />

      <div className="flex-1 flex flex-col">
        <ParentDashboardHeader parentName={user?.fullName || "Parent"} />

        <main className="p-6 flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="h-6 w-6 text-kidato-purple" />
              <h1 className="text-2xl font-bold">Available Courses</h1>
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
            ) : courses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No available courses found at this time.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {courses.map((course) => (
                  <Card key={course._id} className="hover:border-blue-200 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                            {course.isFeatured && (
                              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200 ml-2">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 line-clamp-2">
                            {/* Description is mostly in ClassDetail, using subject as fallback or summary if available */}
                            {course.subject} - {course.type}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <span className="font-medium mr-1">Teacher:</span>
                              {course.teacher?.name || course.teacher?.user?.fullName || "TBA"}
                            </div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                              <span>{course.rating || 5.0} ({course.totalReviews || 0} reviews)</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="secondary">{course.gradeLevel}</Badge>
                            <Badge variant="outline">{course.subject}</Badge>
                          </div>
                        </div>

                        <div className="text-right space-y-2 flex-shrink-0 w-full md:w-auto flex flex-col items-end">
                          {/* Price information isn't always in summary, showing generic or range if possible. 
                            For now, we'll hide specific price if not available and rely on "View Details" */}
                          {course.discount > 0 && (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 mb-1">
                              {course.discount}% OFF
                            </Badge>
                          )}

                          {/* 
                            NOTE: Price isn't in Class interface, assuming check details.
                            Mock showed "$50/class". 
                        */}
                          <div className="text-sm text-gray-500 mb-2">
                            <span className="flex items-center justify-end gap-1">
                              <Users className="h-4 w-4" /> Open Enrollment
                            </span>
                          </div>

                          <Button
                            className="mt-2 text-white bg-kidato-purple hover:bg-kidato-purple/90"
                            onClick={() => navigate(`/class/${course._id}`)}
                          >
                            View Details
                          </Button>
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

export default ParentsCourses;
