import React, { useEffect, useRef } from "react";
import { useProfileJourney } from "../ProfileJourneyContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, Plus, Calendar, Info, School, Trash2, Edit } from "lucide-react";
import { EducationStep as ProfessionalEducationStep } from "../../professional-profile";
import { cn } from "@/lib/utils";

const EducationStep = () => {
  const { education, setEducation, completeStep } = useProfileJourney();
  
  // Handle education changes
  const handleEducationChange = (newEducation: any[]) => {
    console.log("Education updated:", newEducation);
    
    // Mark items as saved if they have valid data and aren't temporary
    const formattedEducation = newEducation.map(edu => {
      // If the education item already has a 'saved' property, consider it ready to display
      if (edu.saved) return edu;
      
      return {
        ...edu,
        // Mark newly saved items from the API as saved so they show up in the list
        saved: edu._id && !edu._id.startsWith('temp_') && (edu.institutionName || edu.institution) ? true : edu.saved,
      };
    });
    
    // Update education in context
    setEducation(formattedEducation);
    
    // Mark step as complete if we have at least one education record
    if (formattedEducation.length > 0 && (formattedEducation[0].institutionName || formattedEducation[0].institution)) {
      completeStep("education");
    }
  };
  
  // Use a ref to track if we've already completed the initial check
  const initialCheckDone = useRef(false);
  
  // Check on component mount if we already have valid education entries
  useEffect(() => {
    // Skip if we've already done the initial check to prevent cycles
    if (initialCheckDone.current) return;
    
    // Check if we have any valid education entries already
    const hasValidEducation = education.some(edu => 
      (edu.saved || (edu._id && !edu._id.startsWith('temp_'))) && 
      (edu.institutionName || edu.institution) && 
      (edu.institutionName?.trim() !== '' || edu.institution?.trim() !== '')
    );
    
    // If we already have valid education entries, mark step as complete
    if (hasValidEducation) {
      console.log("Found existing valid education entries, marking step as complete");
      completeStep("education");
      // Mark that we've done the initial check
      initialCheckDone.current = true;
    } else {
      // Still mark as done even if no valid entries were found
      initialCheckDone.current = true;
    }
  }, []);
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <GraduationCap className="mr-2 h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-medium">Education Background</h3>
      </div>
      
      <p className="text-sm text-gray-500">
        Add your educational qualifications to showcase your academic background to potential students.
        This helps establish credibility and expertise in your teaching subjects.
      </p>
      
      {/* Show existing education records */}
      {education.filter(edu => edu.saved || (edu._id && !edu._id.startsWith('temp_') && (edu.institutionName || edu.institution))).length > 0 && (
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-medium text-gray-700">Your Qualifications</h4>
          
          <div className="grid gap-4">
            {education.filter(edu => edu.saved || (edu._id && !edu._id.startsWith('temp_') && (edu.institutionName || edu.institution))).map((edu, index) => (
              <Card key={edu._id || index} className="overflow-hidden">
                <CardHeader className="bg-blue-50 p-4 pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <School className="h-4 w-4 mr-2 text-blue-600" />
                        <h5 className="font-medium text-blue-800">
                          {edu.institutionName || edu.institution}
                        </h5>
                      </div>
                      
                      <div className="text-sm text-blue-700 mt-1">
                        {edu.degree}
                      </div>
                    </div>
                    
                    <div>
                      <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                        {edu.institutionType}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 pt-3">
                  <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="h-4 w-4 mt-0.5 text-gray-500" />
                    <div>
                      {formatDate(edu.startDate)} - {edu.isCurrentlyStudying ? 'Present' : formatDate(edu.endDate)}
                    </div>
                  </div>
                  
                  {edu.additionalDetails && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <Info className="h-4 w-4 mt-0.5 text-gray-500" />
                      <div>{edu.additionalDetails}</div>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-end gap-2 p-3 pt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8"
                    onClick={() => {
                      // Find the professional form and scroll to it
                      const professionalForm = document.querySelector(".professional-education-form");
                      if (professionalForm) {
                        professionalForm.scrollIntoView({ behavior: 'smooth' });
                      }
                      
                      // Dispatch custom event to trigger edit in the professional component
                      const event = new CustomEvent('edit-education', {
                        detail: { 
                          id: edu._id,
                          institutionName: edu.institutionName,
                          institution: edu.institution
                        }
                      });
                      document.dispatchEvent(event);
                    }}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      if (!confirm(`Are you sure you want to delete this education entry from ${edu.institutionName || edu.institution}?`)) {
                        return;
                      }
                      
                      // Dispatch custom event to trigger delete in the professional component
                      const event = new CustomEvent('delete-education', {
                        detail: { 
                          id: edu._id,
                          institutionName: edu.institutionName,
                          institution: edu.institution
                        }
                      });
                      document.dispatchEvent(event);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Remove
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <Separator className="my-6" />
      
      {/* Education step from professional profile form */}
      <div className="transition-opacity duration-300">
        <ProfessionalEducationStep 
          education={education} 
          setEducation={handleEducationChange}
        />
      </div>
      
      {/* Removed "Add Another Education" button to avoid duplication */}
    </div>
  );
};

export default EducationStep;