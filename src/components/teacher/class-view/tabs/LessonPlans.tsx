import { Clock, FilePlus, ChevronDown, ChevronUp, Link, FileText, Layers, ExternalLink, File, Calendar, Check, Download } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LessonPlan } from "../TeacherClassView";
import { classService } from "@/integrations/api/services/class.service";

interface LessonPlansProps {
  lessonPlans: LessonPlan[];
  classId?: string;
}

const LessonPlans = ({ lessonPlans, classId }: LessonPlansProps) => {
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({});
  
  const toggleLessonExpand = (lessonId: string) => {
    setExpandedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  // Function to parse and extract activities from lesson description
  const parseActivities = (description: string): string[] => {
    if (!description) return [];

    const activities: string[] = [];
    
    // Try to find an "Activities" section
    const activitiesMatch = description.match(/##\s*Activities\s*([\s\S]*?)(?=##|$)/i);
    
    if (activitiesMatch && activitiesMatch[1]) {
      // Extract numbered or bulleted list items
      const activityLines = activitiesMatch[1].split('\n');
      for (const line of activityLines) {
        // Match lines that look like activities (numbered, bulleted, etc.)
        const trimmedLine = line.trim();
        if (trimmedLine.match(/^\d+\.\s+|^\-\s+|^\*\s+/)) {
          const activity = trimmedLine.replace(/^\d+\.\s+|^\-\s+|^\*\s+/, '').trim();
          if (activity) activities.push(activity);
        }
      }
    }
    
    return activities;
  };

  // Function to parse and extract objectives from lesson description
  const parseObjectives = (description: string): string[] => {
    if (!description) return [];

    const objectives: string[] = [];
    
    // Try to find an "Objectives" section
    const objectivesMatch = description.match(/##\s*Objectives\s*([\s\S]*?)(?=##|$)/i);
    
    if (objectivesMatch && objectivesMatch[1]) {
      // Extract numbered or bulleted list items
      const objectiveLines = objectivesMatch[1].split('\n');
      for (const line of objectiveLines) {
        // Match lines that look like objectives (numbered, bulleted, etc.)
        const trimmedLine = line.trim();
        if (trimmedLine.match(/^\d+\.\s+|^\-\s+|^\*\s+|^•\s+/)) {
          const objective = trimmedLine.replace(/^\d+\.\s+|^\-\s+|^\*\s+|^•\s+/, '').trim();
          if (objective) objectives.push(objective);
        }
      }
    }
    
    return objectives;
  };

  // Function to mark a lesson as completed
  const markLessonComplete = async (lessonId: string, index: number) => {
    if (!classId) return;
    
    try {
      const { data, error } = await classService.markLessonComplete(classId, index);
      if (error) {
        console.error("Error marking lesson as complete:", error);
      } else {
        // Handle success (in a real app, you would update the UI or refetch data)
        console.log("Lesson marked as complete");
        // Here you could refresh the data or update the local state
      }
    } catch (err) {
      console.error("Error in markLessonComplete:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Lesson Plans</h2>
        <Button className="flex items-center gap-2">
          <FilePlus className="h-4 w-4" />
          Add Lesson
        </Button>
      </div>
      
      <div className="text-sm text-gray-500 mb-6">
        Plan and organize your lessons for this class. Each lesson should include clear objectives, activities, resources, and a duration.
      </div>
      
      <div className="space-y-4">
        {lessonPlans.map((lesson, index) => {
          // Parse activities and objectives from description if not provided
          const activities = lesson.activities && lesson.activities.length > 0 
            ? lesson.activities 
            : parseActivities(lesson.description || "");
            
          const objectives = parseObjectives(lesson.description || "");
            
          // Combine resource files and links
          const resourceFiles = lesson.resourceFiles || [];
          const resourceLinks = lesson.resourceLinks || [];
            
          return (
            <Card key={lesson.id} className="border border-gray-200 hover:shadow-sm transition-shadow">
              <CardContent className="p-0">
                <div className="p-4 cursor-pointer" onClick={() => toggleLessonExpand(lesson.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 font-medium">
                        {lesson.sequenceNumber || index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">{lesson.title}</h3>
                        {lesson.isCompleted && (
                          <span className="text-xs text-green-600 flex items-center mt-0.5">
                            <Check className="h-3 w-3 mr-1" /> Completed
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        {typeof lesson.duration === 'number' 
                          ? `${lesson.duration} min` 
                          : lesson.duration}
                      </div>
                      {expandedLessons[lesson.id] ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>
                
                {expandedLessons[lesson.id] && (
                  <div className="p-4 pt-0 border-t border-gray-100 mt-4">
                    {/* Objectives Section */}
                    {objectives.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          Objectives
                        </h4>
                        <ul className="space-y-2">
                          {objectives.map((objective, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs flex-shrink-0 mt-0.5">
                                {idx + 1}
                              </div>
                              <span className="text-gray-700">{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Activities Section */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                          <Layers className="h-4 w-4 mr-2 text-blue-500" />
                          Activities
                        </h4>
                        {activities.length > 0 ? (
                          <ul className="space-y-2">
                            {activities.map((activity, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs flex-shrink-0 mt-0.5">
                                  {idx + 1}
                                </div>
                                <span className="text-gray-700">{activity}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500 italic">No activities specified</p>
                        )}
                      </div>
                      
                      {/* Resources Section */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-green-500" />
                          Resources
                        </h4>
                        
                        {resourceFiles.length > 0 || resourceLinks.length > 0 ? (
                          <div className="space-y-3">
                            {/* Resource Files */}
                            {resourceFiles.length > 0 && (
                              <div className="mb-2">
                                <h5 className="text-xs uppercase text-gray-500 mb-1">Files</h5>
                                <ul className="space-y-2">
                                  {resourceFiles.map((file: any, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                      <File className="h-4 w-4 text-blue-500" />
                                      <span className="text-gray-700 text-sm">{file.name || "Resource file"}</span>
                                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-auto">
                                        <Download className="h-3.5 w-3.5 text-gray-400" />
                                      </Button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {/* Resource Links */}
                            {resourceLinks.length > 0 && (
                              <div>
                                <h5 className="text-xs uppercase text-gray-500 mb-1">Links</h5>
                                <ul className="space-y-2">
                                  {resourceLinks.map((link: any, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                      <Link className="h-4 w-4 text-blue-500" />
                                      <a 
                                        href={link.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline text-sm flex items-center"
                                      >
                                        {link.title || "Resource link"}
                                        <ExternalLink className="h-3 w-3 ml-1" />
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">No resources available</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Description Preview */}
                    {lesson.description && (
                      <div className="mt-6 pt-5 border-t border-gray-100">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                          Lesson Description
                        </h4>
                        <div className="text-sm text-gray-700 prose prose-sm max-w-full overflow-hidden relative">
                          <div className="max-h-40">
                            <div dangerouslySetInnerHTML={{ 
                              __html: lesson.description
                                .replace(/# (.*)/g, '<h3 class="text-base font-medium mt-1 mb-2">$1</h3>')
                                .replace(/## (.*)/g, '<h4 class="text-sm font-medium mt-1 mb-1">$1</h4>')
                                .replace(/\n/g, '<br />')
                                .replace(/<!-- STANDARDS:.*?-->/g, '')
                            }}></div>
                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
                      <div className="flex gap-2">
                        {!lesson.isCompleted && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => markLessonComplete(lesson.id, index)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">Delete</Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <Button variant="outline" className="w-full border-dashed flex items-center justify-center gap-2 py-6">
        <FilePlus className="h-4 w-4" />
        Add Another Lesson
      </Button>
    </div>
  );
};

export default LessonPlans;