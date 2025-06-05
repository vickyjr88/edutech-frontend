import React, { useEffect } from "react";
import { useProfileJourney } from "../ProfileJourneyContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Briefcase, Plus, Calendar, Building, Trash2, Edit, BookOpen } from "lucide-react";
import { ExperienceStep as ProfessionalExperienceStep } from "../../professional-profile";

const ExperienceStep = () => {
  const { experience, setExperience, saveExperience, completeStep } = useProfileJourney();
  
  // Handle experience changes
  const handleExperienceChange = (newExperience: any[]) => {
    console.log("Experience updated:", newExperience);
    
    // Format dates for display in cards if they're in ISO format
    const formattedExperience = newExperience.map(exp => {
      // If the experience item already has a 'saved' property, consider it ready to display
      if (exp.saved) return exp;
      
      // Mark as saved if it has an ID (not temporary) and has position data
      const shouldBeSaved = exp._id && 
                           !exp._id.startsWith('temp_') && 
                           exp.position && 
                           exp.position.trim() !== '';
      
      return {
        ...exp,
        // Mark newly saved items from the API as saved so they show up in the list
        saved: shouldBeSaved ? true : exp.saved,
      };
    });
    
    // Update experience in context
    setExperience(formattedExperience);
    
    // Force check if we should mark step as complete
    const hasValidExperience = formattedExperience.some(exp => 
      (exp.saved || (exp._id && !exp._id.startsWith('temp_'))) && 
      exp.position && 
      exp.position.trim() !== ''
    );
    
    console.log("Has valid experience:", hasValidExperience);
    
    // Mark step as complete if we have at least one valid experience record
    if (hasValidExperience) {
      console.log("Marking experience step as complete");
      // Save all experience data using bulk update before completing the step
      saveExperience().then(success => {
        if (success) {
          completeStep("expertise");
        }
      });
    }
  };
  
  // Check on component mount if we already have valid experiences
  useEffect(() => {
    // Check if we have any valid experiences already
    const hasValidExperience = experience.some(exp => 
      (exp.saved || (exp._id && !exp._id.startsWith('temp_'))) && 
      exp.position && 
      exp.position.trim() !== ''
    );
    
    // If we already have valid experiences, mark step as complete
    if (hasValidExperience) {
      console.log("Found existing valid experiences, marking step as complete");
      // Save all experience data using bulk update before completing the step
      saveExperience().then(success => {
        if (success) {
          completeStep("expertise");
        }
      });
    }
  }, [experience, completeStep, saveExperience]);
  
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
        <Briefcase className="mr-2 h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-medium">Teaching Experience</h3>
      </div>
      
      <p className="text-sm text-gray-500">
        Add your past teaching experience to showcase your expertise and qualifications.
        This helps students and parents understand your background and teaching style.
      </p>
      
      {/* Show existing experience records */}
      {experience.filter(exp => exp.saved || (exp.position && exp._id && !exp._id.startsWith('temp_'))).length > 0 && (
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-medium text-gray-700">Your Experience</h4>
          
          <div className="grid gap-4">
            {experience.filter(exp => exp.saved || (exp.position && exp._id && !exp._id.startsWith('temp_'))).map((exp, index) => (
              <Card key={exp._id || index} className="overflow-hidden">
                <CardHeader className="bg-green-50 p-4 pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-green-600" />
                        <h5 className="font-medium text-green-800">
                          {exp.institution}
                        </h5>
                      </div>
                      
                      <div className="text-sm text-green-700 mt-1">
                        {exp.position}
                      </div>
                    </div>
                    
                    <div>
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                        {exp.institutionType}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 pt-3">
                  <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="h-4 w-4 mt-0.5 text-gray-500" />
                    <div>
                      {formatDate(exp.startDate)} - {exp.isCurrentlyWorking ? 'Present' : formatDate(exp.endDate)}
                    </div>
                  </div>
                  
                  {exp.subjects && exp.subjects.length > 0 && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <BookOpen className="h-4 w-4 mt-0.5 text-gray-500" />
                      <div>Subjects: {exp.subjects.join(', ')}</div>
                    </div>
                  )}
                  
                  {exp.additionalDetails && (
                    <div className="mt-2 text-sm text-gray-600">
                      {exp.additionalDetails}
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-end gap-2 p-3 pt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8"
                    onClick={() => {
                      // Find this experience in the ProfessionalExperienceStep
                      const professionalForm = document.querySelector(".professional-experience-form");
                      if (professionalForm) {
                        professionalForm.scrollIntoView({ behavior: 'smooth' });
                      }
                      
                      // Find the edit button for this experience in the ProfessionalExperienceStep
                      // Create a custom event to trigger the edit in the ProfessionalExperienceStep
                      const professionalExperienceForm = document.querySelector('.professional-experience-form');
                      
                      if (professionalExperienceForm) {
                        // First, try to find the "Add Experience" button and click it to show the form
                        const addButton = professionalExperienceForm.querySelector('button:not([disabled])');
                        if (addButton && addButton.textContent?.includes('Add')) {
                          addButton.click();
                        }
                        
                        // Wait a bit for the form to appear
                        setTimeout(() => {
                          // Try direct ID match first
                          const event = new CustomEvent('edit-experience', {
                            detail: { 
                              id: exp._id,
                              position: exp.position,
                              institution: exp.institution
                            }
                          });
                          document.dispatchEvent(event);
                          
                          // Note: The table has been removed, so we'll rely entirely on the custom event
                        }, 300);
                      }
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
                      if (!confirm(`Are you sure you want to delete the experience at ${exp.institution}?`)) {
                        return;
                      }
                      
                      // Create a custom event to trigger the delete in the ProfessionalExperienceStep
                      const event = new CustomEvent('delete-experience', {
                        detail: { 
                          id: exp._id,
                          position: exp.position,
                          institution: exp.institution
                        }
                      });
                      document.dispatchEvent(event);
                      
                      // Note: The table has been removed, so we'll rely entirely on the custom event
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
      
      {/* Experience step from professional profile form */}
      <div className="transition-opacity duration-300">
        <ProfessionalExperienceStep 
          experience={experience} 
          setExperience={handleExperienceChange}
        />
      </div>
      
      {/* Removed "Add Another Experience" button */}
    </div>
  );
};

export default ExperienceStep;