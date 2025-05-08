import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EnhancedClassSetup from "@/components/teacher/class-setup/EnhancedClassSetup";
import { ClassFormValues } from "@/components/teacher/class-setup/types";

const TeacherClassSetupPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedClass, setSubmittedClass] = useState<ClassFormValues | null>(null);

  const handleSubmit = (data: ClassFormValues) => {
    // Here you would normally make an API call to save the class data
    // This is simulated with a timeout
    
    setTimeout(() => {
      setSubmittedClass(data);
      setIsSubmitted(true);
      
      toast({
        title: "Class created successfully",
        description: "Your new class has been created and is ready for students.",
      });
    }, 1000);
  };

  const handleBackToDashboard = () => {
    navigate("/teacher-dashboard");
  };

  const handleCreateAnother = () => {
    setIsSubmitted(false);
    setSubmittedClass(null);
  };

  const handleEnrollStudents = () => {
    // Navigate to enrollment page with the newly created class
    if (submittedClass) {
      navigate("/teacher-dashboard", { 
        state: { 
          activeTab: "enrollment",
          classId: Date.now(), // This would be the actual class ID from the server
          className: submittedClass.title
        } 
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mr-4"
          onClick={handleBackToDashboard}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">
          {isSubmitted ? "Class Created Successfully" : "Create a New Class"}
        </h1>
      </div>
      
      {isSubmitted ? (
        <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-100">
          <CardHeader>
            <div className="flex items-center mb-2">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>"{submittedClass?.title}" has been created!</CardTitle>
            </div>
            <CardDescription>
              Your class has been successfully created and is now available for enrollment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-2 space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Subject:</strong> {submittedClass?.subject}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Type:</strong> {submittedClass?.type === "academic" ? "Academic" : "After School"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Grade/Age:</strong> {submittedClass?.type === "academic" ? submittedClass?.gradeLevel : submittedClass?.ageRange}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Lessons:</strong> {submittedClass?.lessonPlans?.length || 0} lesson plans created
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button className="flex-1" onClick={handleEnrollStudents}>
                Enroll Students Now
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleCreateAnother}>
                Create Another Class
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <EnhancedClassSetup onSubmit={handleSubmit} />
      )}
    </div>
  );
};

export default TeacherClassSetupPage;