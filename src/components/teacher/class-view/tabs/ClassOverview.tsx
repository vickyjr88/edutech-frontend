import { Backpack, CalendarDays, Layers, BookOpen, Users, Clock, GraduationCap, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ClassData } from "../TeacherClassView";
import { Badge } from "@/components/ui/badge";
import { TeacherClassSummary } from "@/types/enhanced-classes";

interface ClassOverviewProps {
  classData: ClassData;
  currentClassSummary?: TeacherClassSummary;
}

const ClassOverview = ({ classData, currentClassSummary }: ClassOverviewProps) => {
  // Extract subject name from the API subject code (if possible)
  const getSubjectName = (subjectCode: string) => {
    // Subject codes like "cbc_junior-secondary_8" have a structure we can parse
    const parts = subjectCode.split('_');
    if (parts.length > 1) {
      // Try to extract a human-readable subject name
      const lastPart = parts[parts.length - 1];
      
      // Check if it's a numeric grade (e.g. "8")
      if (!isNaN(Number(lastPart))) {
        // Use the second-to-last part as the subject
        if (parts.length > 2) {
          return parts[parts.length - 2].replace(/-/g, ' ');
        }
      }
      
      // Otherwise, use the last part
      return lastPart.replace(/-/g, ' ');
    }
    
    // If we can't parse it, return the original
    return subjectCode;
  };

  // Format the commitment string for display
  const getCommitmentText = () => {
    let text = "Not specified";
    
    if (classData.commitment) {
      text = classData.commitment;
    } else if (classData.numberOfLessons) {
      text = `${classData.numberOfLessons} lessons`;
    }
    
    return text;
  };

  // Get technical requirements as a formatted list
  const getTechnicalRequirements = () => {
    if (!classData.technicalRequirements || classData.technicalRequirements.length === 0) {
      return ["None specified"];
    }
    
    return classData.technicalRequirements.map((req: any) => req.requirement || "Requirement");
  };

  // Get materials as a formatted list
  const getMaterials = () => {
    if (!classData.materials || classData.materials.length === 0) {
      return ["None specified"];
    }
    
    return classData.materials.map((material: any) => material.name || "Material");
  };
  
  // Get a formatted curriculum level
  const getCurriculumLevel = () => {
    if (classData.gradeLevel) {
      return classData.gradeLevel;
    }
    
    if (classData.curriculum && classData.curriculumLevel) {
      const curriculum = classData.curriculum.toUpperCase();
      const level = classData.curriculumLevel.replace(/-/g, ' ');
      return `${curriculum} ${level}`;
    }
    
    return classData.level;
  };
  
  // Handle empty learning objectives
  const getLearningObjectives = () => {
    if (!classData.learningObjectives || classData.learningObjectives.length === 0) {
      return [
        "Understand key concepts in this subject",
        "Develop critical thinking skills",
        "Apply knowledge to solve problems",
        "Demonstrate mastery through assessments"
      ];
    }
    
    return classData.learningObjectives;
  };
  
  // Get a formatted subject display name
  const getFormattedSubject = () => {
    return getSubjectName(classData.subject);
  };

  return (
    <div className="space-y-8">
      {/* Next Session Info */}
      {currentClassSummary?.nextSession && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Next Session</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-lg">
                    Lesson {currentClassSummary.nextSession.lessonNumber}: {currentClassSummary.nextSession.title}
                  </h4>
                  <p className="text-gray-600 mt-1">{currentClassSummary.nextSession.description}</p>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{new Date(currentClassSummary.nextSession.startTime).toLocaleDateString()}</span>
                  <span>{new Date(currentClassSummary.nextSession.startTime).toLocaleTimeString()}</span>
                  <span>{currentClassSummary.nextSession.duration} minutes</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-4 w-4 text-blue-600 mr-1" />
                  </div>
                  <div className="text-sm text-gray-500">Students</div>
                  <div className="font-semibold text-blue-600">{currentClassSummary.nextSession.enrolledStudents}</div>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Target className="h-4 w-4 text-green-600 mr-1" />
                  </div>
                  <div className="text-sm text-gray-500">Readiness</div>
                  <div className="font-semibold text-green-600">
                    {Math.round(currentClassSummary.nextSession.readiness?.overallReadiness || 0)}%
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                {currentClassSummary.nextSession.cohortName}
              </Badge>
              {currentClassSummary.nextSession.timeLeft < 60 && (
                <Badge variant="destructive">
                  Starting soon
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Stats cards row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <Backpack className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Class Type</p>
                <p className="text-lg font-semibold">{classData.classType}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 rounded-lg p-3">
                <Layers className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Enrollment</p>
                <p className="text-lg font-semibold">
                  {currentClassSummary?.enrolledStudents || classData.enrollmentCount} Students
                  {currentClassSummary?.maxCapacity && (
                    <span className="text-sm text-gray-500 ml-1">/ {currentClassSummary.maxCapacity}</span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 rounded-lg p-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Progress</p>
                <p className="text-lg font-semibold">
                  {currentClassSummary?.progressPercentage || 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 rounded-lg p-3">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Engagement</p>
                <p className="text-lg font-semibold">
                  {Math.round(currentClassSummary?.averageEngagement || 0)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class image and basic info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="rounded-lg overflow-hidden border border-gray-100 mb-4">
            <AspectRatio ratio={16 / 9}>
              <img 
                src={classData.imageSrc} 
                alt={classData.title} 
                className="w-full h-full object-cover" 
              />
            </AspectRatio>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {getFormattedSubject()}
              </Badge>
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                {getCurriculumLevel()}
              </Badge>
            </div>
            <h2 className="text-xl font-bold">{classData.title}</h2>
            
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={classData.isPublished ? "success" : "default"}>
                {classData.isPublished ? "Published" : "Draft"}
              </Badge>
              
              {classData.enableMultipleCohorts && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  Multiple Cohorts
                </Badge>
              )}
              
              {classData.enableTeamTeaching && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Team Teaching
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Class description */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Class Description</h3>
            <div className="text-gray-700 whitespace-pre-line max-h-[200px] overflow-y-auto pr-2">
              {classData.description}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Learning Objectives</h3>
            <div className="space-y-3">
              {getLearningObjectives().map((objective, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-medium text-sm">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{objective}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional class information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Class Details */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
              Class Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Subject</p>
                <p className="text-gray-700">{getFormattedSubject()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Grade Level</p>
                <p className="text-gray-700">{getCurriculumLevel()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Curriculum</p>
                <p className="text-gray-700">{classData.curriculum?.toUpperCase() || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Format</p>
                <p className="text-gray-700">{classData.classType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Commitment</p>
                <p className="text-gray-700">{getCommitmentText()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Number of Lessons</p>
                <p className="text-gray-700">{classData.numberOfLessons || "Not specified"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Right column - Requirements & Materials */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <GraduationCap className="h-5 w-5 text-green-600 mr-2" />
              Requirements & Materials
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Technical Requirements</p>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {getTechnicalRequirements().map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Materials</p>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {getMaterials().map((material, idx) => (
                    <li key={idx}>{material}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Scheduling & Enrollment Info */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Clock className="h-5 w-5 text-purple-600 mr-2" />
            Scheduling & Enrollment
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Session Schedule</p>
              <p className="text-gray-700">{classData.scheduleInfo}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Enrollment Status</p>
              <p className="text-gray-700">{classData.isPublished ? "Open for enrollment" : "Not yet published"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Current Students</p>
              <p className="text-gray-700">{classData.enrollmentCount} students</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Multiple Cohorts</p>
              <p className="text-gray-700">{classData.enableMultipleCohorts ? "Enabled" : "Disabled"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Team Teaching</p>
              <p className="text-gray-700">{classData.enableTeamTeaching ? "Enabled" : "Disabled"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Cohorts</p>
              <p className="text-gray-700">{classData.cohorts.length} cohort{classData.cohorts.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassOverview;