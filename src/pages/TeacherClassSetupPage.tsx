import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EnhancedClassSetup from "@/components/teacher/class-setup/EnhancedClassSetup";
import { ClassFormValues } from "@/components/teacher/class-setup/types";
import { classService } from "@/integrations/api/services/class.service";
import DraftRecoveryBanner from "@/components/teacher/class-setup/DraftRecoveryBanner";
import WelcomeScreen from "@/components/teacher/class-setup/WelcomeScreen";
import DraftClassesList from "@/components/teacher/class-setup/DraftClassesList";
import { hasDraft, getFormMetadata, clearStoredForm } from "@/components/teacher/class-setup/utils/storageUtils";
import { useAuth } from "@/contexts/AuthContext";

const TeacherClassSetupPage = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId?: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedClass, setSubmittedClass] = useState<ClassFormValues | null>(null);
  const [initialValues, setInitialValues] = useState<Partial<ClassFormValues> | undefined>(undefined);
  const [initialCohorts, setInitialCohorts] = useState<any[]>([]);
  const [initialTeamMembers, setInitialTeamMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(!!classId);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(!classId);
  const [draftExists, setDraftExists] = useState(false);
  const [lastSaved, setLastSaved] = useState(0);
  const [isDraftClass, setIsDraftClass] = useState(false);
  const [teacherClasses, setTeacherClasses] = useState<any[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [classFormState, setClassFormState] = useState<{
    lastSaved: number;
    hasUnsavedChanges: boolean;
    draftExists: boolean;
  }>({
    lastSaved: 0,
    hasUnsavedChanges: false,
    draftExists: false,
  });

  // Log the classId from useParams for debugging
  console.log("TeacherClassSetupPage received classId from URL params:", classId);

  // Check for draft on mount and sync with backend
  useEffect(() => {
    const fetchTeacherClasses = async () => {
      try {
        setIsLoadingClasses(true);
        // Get all classes for the current teacher
        const teacherId = user?.teacherId;

        if (!teacherId) {
          console.error("No teacher ID available");
          setIsLoadingClasses(false);
          return;
        }

        const { data: classes, error } = await classService.getTeacherClasses(teacherId);

        if (error) {
          console.error("Error fetching teacher classes:", error);
          setIsLoadingClasses(false);
          return;
        }

        console.log("Teacher classes loaded:", classes?.length || 0);

        // Store all teacher classes for display in the UI
        if (classes) {
          setTeacherClasses(classes);
        }

        // If we're not loading a specific class by ID
        if (!classId) {
          // Get metadata from storage
          const metadata = getFormMetadata();
          const draftExists = hasDraft();

          // If we have a draft with a class ID
          if (draftExists && metadata.classId) {
            // Check if that class still exists in the backend
            const classExists = classes &&
              classes.some(cls => cls._id === metadata.classId);

            if (!classExists) {
              // If class doesn't exist in backend, clear the local draft
              console.log("Class no longer exists in backend, clearing draft");
              clearStoredForm();
              setDraftExists(false);
              setLastSaved(0);
            } else {
              // Class exists, keep the draft
              setDraftExists(true);
              setLastSaved(metadata.lastSaved);
            }
          } else {
            // No class ID in draft, or no draft
            setDraftExists(draftExists);
            setLastSaved(metadata.lastSaved);
          }
        }

        setIsLoadingClasses(false);
      } catch (err) {
        console.error("Failed to fetch teacher classes:", err);
        setIsLoadingClasses(false);
      }
    };

    fetchTeacherClasses();
  }, [classId, user?.teacherId]);

  // Callbacks for draft management
  const handleStartNew = () => {
    setShowWelcomeScreen(false);
  };

  const handleContinueDraft = () => {
    const metadata = getFormMetadata();
    if (metadata.classId) {
      // Navigate to the class setup page with the class ID
      navigate(`/teacher-class-setup/${metadata.classId}`);
    } else {
      // If no class ID, just continue with the current form
      setShowWelcomeScreen(false);
    }
  };

  const handleDiscardDraft = async () => {
    const metadata = getFormMetadata();
    if (metadata.classId) {
      try {
        // Delete the class from the backend
        await classService.delete(metadata.classId);
        console.log(`Class ${metadata.classId} deleted from backend`);

        // Clear the stored form data
        clearStoredForm();

        // Remove the deleted class from the teacherClasses list
        setTeacherClasses(prev => prev.filter(cls => cls._id !== metadata.classId));

        toast({
          title: "Draft discarded",
          description: "Your draft has been discarded and the class was deleted.",
        });
      } catch (error) {
        console.error("Error deleting class:", error);
        toast({
          variant: "destructive",
          title: "Error discarding draft",
          description: "There was an error deleting the class. Please try again.",
        });
      }
    }

    // The actual local storage cleaning happens in the ClassFormProvider
    setShowWelcomeScreen(false);
  };

  // Handler for deleting a class from the draft list
  const handleDeleteClass = async (classId: string) => {
    try {
      // Delete the class from the backend
      await classService.delete(classId);
      console.log(`Class ${classId} deleted from backend`);

      // Remove the deleted class from the teacherClasses list
      setTeacherClasses(prev => prev.filter(cls => cls._id !== classId));

      // If this is the current draft in local storage, clear it
      const metadata = getFormMetadata();
      if (metadata.classId === classId) {
        clearStoredForm();
        setDraftExists(false);
        setLastSaved(0);
      }

      toast({
        title: "Class deleted",
        description: "The draft class has been deleted.",
      });
    } catch (error) {
      console.error("Error deleting class:", error);
      toast({
        variant: "destructive",
        title: "Error deleting class",
        description: "There was an error deleting the class. Please try again.",
      });
    }
  };

  // Form state updater from the form context
  const handleFormStateUpdate = (state: {
    lastSaved: number;
    hasUnsavedChanges: boolean;
    draftExists: boolean;
  }) => {
    setClassFormState(state);
  };

  // Load class data if we have an ID
  useEffect(() => {
    const loadClassData = async () => {
      if (!classId) {
        console.log("No classId available, skipping data load");
        return;
      }

      try {
        setIsLoading(true);
        console.log("Loading class data for ID:", classId);
        const { data, error } = await classService.getById(classId);
        console.log("API response:", data);

        if (error) {
          console.error("Error loading class:", error);
          toast({
            variant: "destructive",
            title: "Failed to load class",
            description: "There was an error loading the class data. Please try again.",
          });
        } else if (data) {
          // Check if class is a draft
          const isClassDraft = data.isPublished === false || data.status === 'draft';
          setIsDraftClass(isClassDraft);
          console.log("Class is a draft:", isClassDraft);

          // Transform API data to match form values structure
          const formData: Partial<ClassFormValues> = {
            title: data.title,
            type: data.type,
            subject: data.subject,
            curriculum: data.curriculum,
            description: data.description,
            isPublic: data.isPublic,

            // Map DTO fields to form fields
            hasCohorts: data.enableMultipleCohorts,
            hasTeamTeaching: data.enableTeamTeaching,

            // Ensure grade level and age range are populated
            gradeLevel: data.gradeLevel || "",
            ageRange: data.ageRange || "",
            curriculumLevel: data.curriculumLevel || "",
            numberOfLessons: data.numberOfLessons || 1,

            // Format technical requirements and materials back to text fields
            technicalRequirements: data.technicalRequirements?.length > 0 ?
              data.technicalRequirements.map(item => item.requirement || "").join("\n") :
              "",

            materialsRequired: data.materials?.length > 0 ?
              data.materials.map(item => item.name || "").join("\n") :
              "",

            // Convert lesson plans to match form structure
            lessonPlans: data.lessonPlans ?
              data.lessonPlans.map(lesson => ({
                id: lesson._id || String(Math.random()),
                title: lesson.title || "",
                description: lesson.description || "",
                duration: String(lesson.duration) || "60",
                resources: Array.isArray(lesson.resourceFiles) ? lesson.resourceFiles.join(",") : ""
              })) :
              [],

            // Include other optional fields
            ...(data.commitment && { commitmentRequired: data.commitment }),
            ...(data.methodology && { methodology: data.methodology }),
            ...(data.strategy && { strategy: data.strategy }),
            ...(data.objectives && { objectives: data.objectives }),
            ...(data.assessmentMethods && { assessmentMethods: data.assessmentMethods }),
          };

          // Process cohorts if available
          if (data.cohorts && data.cohorts.length > 0) {
            const formattedCohorts = data.cohorts.map(cohort => {
              // Determine repeat pattern based on days of week
              let repeatPattern = "weekly";
              if (Array.isArray(cohort.daysOfWeek) && cohort.daysOfWeek.length > 1) {
                repeatPattern = "custom";
              } else if (Array.isArray(cohort.daysOfWeek) && cohort.daysOfWeek.length === 2) {
                repeatPattern = "twice-weekly";
              }

              // Format days of week to lowercase
              const daysOfWeek = Array.isArray(cohort.daysOfWeek)
                ? cohort.daysOfWeek.map(day => day.toLowerCase())
                : ["monday"];
              return {
                id: cohort._id || String(Math.random()),
                name: cohort.name || "",
                startDate: cohort.startDate ? new Date(cohort.startDate) : null,
                endDate: cohort.endDate ? new Date(cohort.endDate) : null,
                startTime: cohort.startTime || "",
                endTime: cohort.endTime || "",
                numberOfLessons: data.numberOfLessons || 1,
                price: cohort.price?.toString() || "0",
                discount: cohort.discount?.toString() || "0",
                isActive: cohort.isActive !== false,
                lessonSchedules: [],
                hasFlexibleSchedule: cohort.customLessonTimes || false,
                repeatSchedule: {
                  pattern: repeatPattern,
                  daysOfWeek,
                  repeatEvery: 1
                },
                minStudents: cohort.minimumStudents || 1,
                maxStudents: cohort.maximumStudents || 20,
                enrollmentDeadline: cohort.enrollmentDeadline ? new Date(cohort.enrollmentDeadline) : null
              };
            });

            setInitialCohorts(formattedCohorts);
          }

          // Process teaching team if available
          if (data.teachingTeam && data.teachingTeam.length > 0) {
            const formattedTeamMembers = data.teachingTeam.map((member, index) => {
              return {
                id: member._id || String(Math.random()),
                email: member.email || `teacher${index + 1}@example.com`,
                role: member.role || "co-teacher"
              };
            });

            setInitialTeamMembers(formattedTeamMembers);
          }

          console.log("Setting initialValues:", formData);
          // Set initial values immediately
          setInitialValues(formData);
        }
      } catch (err) {
        console.error("Failed to load class data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadClassData();
  }, [classId, toast]);

  const handleSubmit = (data: ClassFormValues) => {
    // Here you would normally make an API call to save the class data
    // This is simulated with a timeout
    //log saveclass
    console.log("Saving class data:", data);
    // const { title, type, subject, curriculum, description, isPublic, hasCohorts, hasTeamTeaching, gradeLevel, ageRange, curriculumLevel, numberOfLessons, technicalRequirements, materialsRequired, lessonPlans, commitmentRequired, methodology, strategy, objectives, assessmentMethods, cohorts, teachingTeam } = data;
    // const classData = {
    //   title,
    //   type,
    //   subject,
    //   curriculum,
    //   description,
    //   isPublic,
    // setTimeout(() => {
    //   setSubmittedClass(data);
    //   setIsSubmitted(true);
    //
    //   toast({
    //     title: "Class created successfully",
    //     description: "Your new class has been created and is ready for students.",
    //   });
    // }, 1000);
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
          classId: classId || `temp_${Date.now()}`, // Use real class ID or generate a temporary one
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
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">
            {isSubmitted ? "Class Created Successfully" : classId ? "Edit Class" : "Create a New Class"}
          </h1>
          {isDraftClass && classId && (
            <span className="text-sm px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md inline-flex items-center mt-1 w-fit">
              Draft
            </span>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-gray-600">Loading class data...</p>
          </div>
        </div>
      )}

      {/* Debug block removed to make form initialization seamless */}

      {!isLoading && isSubmitted && (
        <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-100">
          <CardHeader>
            <div className="flex items-center mb-2">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>"{submittedClass?.title}" has been {classId ? "updated" : "created"}!</CardTitle>
            </div>
            <CardDescription>
              Your class has been successfully {classId ? "updated" : "created"} and is now available for enrollment.
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
                {classId ? "Create New Class" : "Create Another Class"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isSubmitted && showWelcomeScreen && !classId ? (
        <>
          {/* Display draft classes if there are any */}
          {teacherClasses.length > 0 && (
            <DraftClassesList
              classes={teacherClasses}
              onDeleteClass={handleDeleteClass}
            />
          )}

          <WelcomeScreen
            draftExists={draftExists}
            lastSaved={lastSaved}
            onStartNew={handleStartNew}
            onContinueDraft={handleContinueDraft}
            onDiscardDraft={handleDiscardDraft}
          />
        </>
      ) : !isLoading && !isSubmitted && (
        <>
          {/* Recovery banner only shows for forms in progress, not for new forms */}
          {classFormState.draftExists || classFormState.hasUnsavedChanges ? (
            <DraftRecoveryBanner
              lastSaved={classFormState.lastSaved}
              hasUnsavedChanges={classFormState.hasUnsavedChanges}
              draftExists={classFormState.draftExists}
              onLoadDraft={() => {
                const formRef = document.getElementById('class-form-ref');
                if (formRef) {
                  formRef.dispatchEvent(new CustomEvent('load-draft'));
                }
              }}
              onDiscardDraft={() => {
                const formRef = document.getElementById('class-form-ref');
                if (formRef) {
                  formRef.dispatchEvent(new CustomEvent('discard-draft'));
                }
              }}
              onSaveNow={() => {
                const formRef = document.getElementById('class-form-ref');
                if (formRef) {
                  formRef.dispatchEvent(new CustomEvent('save-now'));
                }
              }}
            />
          ) : null}

          <div id="class-form-ref">
            <EnhancedClassSetup
              onSubmit={handleSubmit}
              initialValues={initialValues}
              initialCohorts={initialCohorts}
              initialTeamMembers={initialTeamMembers}
              classId={classId}
              loadFromStorage={!initialValues && draftExists && !classId}
              onFormStateUpdate={handleFormStateUpdate}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherClassSetupPage;