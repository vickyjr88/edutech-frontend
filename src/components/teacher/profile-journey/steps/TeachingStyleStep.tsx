import React from "react";
import { useProfileJourney } from "../ProfileJourneyContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { PaintBucket, Lightbulb, Globe, Code } from "lucide-react";
import { 
  StrategiesStep, 
  MethodologiesStep,
  LanguagesStep,
  TechnicalSkillsStep
} from "../../professional-profile";

const TeachingStyleStep = () => {
  const { 
    teachingStyle: { strategies, methodologies, languages, technicalSkills },
    setStrategies,
    setMethodologies,
    setLanguages,
    setTechnicalSkills,
    completeStep
  } = useProfileJourney();
  
  // Handle updates and check step completion
  const updateAndCheckCompletion = () => {
    if (strategies.length > 0 && methodologies.length > 0 && languages.length > 0) {
      completeStep("teaching-style");
    }
  };
  
  // Handle strategies update
  const handleStrategiesChange = (newStrategies: any[]) => {
    setStrategies(newStrategies);
    updateAndCheckCompletion();
  };
  
  // Handle methodologies update
  const handleMethodologiesChange = (newMethodologies: any[]) => {
    setMethodologies(newMethodologies);
    updateAndCheckCompletion();
  };
  
  // Handle languages update
  const handleLanguagesChange = (newLanguages: any[]) => {
    setLanguages(newLanguages);
    updateAndCheckCompletion();
  };
  
  // Handle technical skills update
  const handleTechnicalSkillsChange = (newSkills: any[]) => {
    setTechnicalSkills(newSkills);
    updateAndCheckCompletion();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <PaintBucket className="mr-2 h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-medium">Teaching Style</h3>
      </div>
      
      <p className="text-sm text-gray-500">
        Tell us about your teaching methodology, strategies, and the languages you can teach in.
        This helps create a comprehensive profile that showcases your unique teaching approach.
      </p>
      
      <Tabs defaultValue="strategies" className="mt-6">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="strategies" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Strategies
          </TabsTrigger>
          <TabsTrigger value="methodologies" className="flex items-center gap-2">
            <PaintBucket className="h-4 w-4" />
            Methodologies
          </TabsTrigger>
          <TabsTrigger value="languages" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Languages
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Tech Skills
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="strategies">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700">Teaching Strategies</h4>
            <p className="text-xs text-gray-500">
              Specify the teaching strategies you use to engage students and facilitate learning.
            </p>
          </div>
          <StrategiesStep 
            strategies={strategies} 
            setStrategies={handleStrategiesChange} 
          />
        </TabsContent>
        
        <TabsContent value="methodologies">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700">Teaching Methodologies</h4>
            <p className="text-xs text-gray-500">
              Select the teaching methodologies you employ in your classroom.
            </p>
          </div>
          <MethodologiesStep 
            methodologies={methodologies} 
            setMethodologies={handleMethodologiesChange} 
          />
        </TabsContent>
        
        <TabsContent value="languages">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700">Teaching Languages</h4>
            <p className="text-xs text-gray-500">
              Indicate which languages you can teach in and your proficiency level.
            </p>
          </div>
          <LanguagesStep 
            languages={languages} 
            setLanguages={handleLanguagesChange} 
          />
        </TabsContent>
        
        <TabsContent value="skills">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700">Technical Skills</h4>
            <p className="text-xs text-gray-500">
              Specify any technical skills that enhance your teaching capabilities.
            </p>
          </div>
          <TechnicalSkillsStep 
            skills={technicalSkills} 
            setSkills={handleTechnicalSkillsChange} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeachingStyleStep;