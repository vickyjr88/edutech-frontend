
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, ChevronRight, ChevronLeft, CheckCircle, Upload } from "lucide-react";

type FormItem = {
  id: string;
  value: string;
  details?: string;
};

const TeacherProfessionalProfileForm = ({ 
  onComplete,
  onCancel 
}: { 
  onComplete: () => void;
  onCancel: () => void;
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state for each section
  const [education, setEducation] = useState<FormItem[]>([{ id: "1", value: "", details: "" }]);
  const [experience, setExperience] = useState<FormItem[]>([{ id: "1", value: "", details: "" }]);
  const [strategies, setStrategies] = useState<FormItem[]>([{ id: "1", value: "" }]);
  const [methodologies, setMethodologies] = useState<FormItem[]>([{ id: "1", value: "" }]);
  const [academicSubjects, setAcademicSubjects] = useState<FormItem[]>([{ id: "1", value: "" }]);
  const [afterSchoolSubjects, setAfterSchoolSubjects] = useState<FormItem[]>([{ id: "1", value: "" }]);
  const [technicalSkills, setTechnicalSkills] = useState<FormItem[]>([{ id: "1", value: "" }]);
  const [languages, setLanguages] = useState<FormItem[]>([{ id: "1", value: "" }]);
  const [certifications, setCertifications] = useState<FormItem[]>([{ id: "1", value: "", details: "" }]);
  const [videoUrl, setVideoUrl] = useState("");

  const totalSteps = 9;

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Education Background";
      case 2: return "Teaching Experience";
      case 3: return "Teaching Strategies";
      case 4: return "Teaching Methodologies";
      case 5: return "Subject Expertise";
      case 6: return "Technical Skills";
      case 7: return "Teaching Languages";
      case 8: return "Certifications & Credentials";
      case 9: return "Introductory Video";
      default: return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Add your educational qualifications and background";
      case 2: return "Share your previous teaching experiences";
      case 3: return "What teaching strategies do you employ?";
      case 4: return "What teaching methodologies do you follow?";
      case 5: return "What subjects are you an expert in?";
      case 6: return "What technical skills do you possess?";
      case 7: return "What languages can you teach in?";
      case 8: return "Add your teaching certifications and credentials";
      case 9: return "Upload a short video introducing yourself to potential students";
      default: return "";
    }
  };

  const addItem = (items: FormItem[], setItems: React.Dispatch<React.SetStateAction<FormItem[]>>) => {
    const newItem = {
      id: Date.now().toString(),
      value: "",
      details: items[0].details !== undefined ? "" : undefined
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string, items: FormItem[], setItems: React.Dispatch<React.SetStateAction<FormItem[]>>) => {
    if (items.length === 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: 'value' | 'details', value: string, items: FormItem[], setItems: React.Dispatch<React.SetStateAction<FormItem[]>>) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // In a real implementation, we would save the data to the database here
    // For this mockup, we'll just simulate a delay and then call onComplete
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete();
    }, 1000);
  };

  const renderEducationForm = () => (
    <div className="space-y-4">
      {education.map((edu, index) => (
        <div key={edu.id} className="p-4 border rounded-md bg-white">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-sm">Education {index + 1}</h4>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => removeItem(edu.id, education, setEducation)}
              disabled={education.length === 1}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor={`edu-institution-${edu.id}`}>Institution/Degree</Label>
              <Input 
                id={`edu-institution-${edu.id}`}
                value={edu.value}
                onChange={(e) => updateItem(edu.id, 'value', e.target.value, education, setEducation)}
                placeholder="e.g., University of Nairobi, Bachelor of Education"
              />
            </div>
            
            <div>
              <Label htmlFor={`edu-details-${edu.id}`}>Years & Details</Label>
              <Textarea
                id={`edu-details-${edu.id}`}
                value={edu.details || ""}
                onChange={(e) => updateItem(edu.id, 'details', e.target.value, education, setEducation)}
                placeholder="e.g., 2015-2019, Graduated with honors, specialized in Mathematics"
              />
            </div>
          </div>
        </div>
      ))}
      
      <Button
        variant="outline"
        className="w-full"
        onClick={() => addItem(education, setEducation)}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Another Education
      </Button>
    </div>
  );

  const renderExperienceForm = () => (
    <div className="space-y-4">
      {experience.map((exp, index) => (
        <div key={exp.id} className="p-4 border rounded-md bg-white">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-sm">Experience {index + 1}</h4>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => removeItem(exp.id, experience, setExperience)}
              disabled={experience.length === 1}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor={`exp-position-${exp.id}`}>Position/Institution</Label>
              <Input 
                id={`exp-position-${exp.id}`}
                value={exp.value}
                onChange={(e) => updateItem(exp.id, 'value', e.target.value, experience, setExperience)}
                placeholder="e.g., Mathematics Teacher at ABC School"
              />
            </div>
            
            <div>
              <Label htmlFor={`exp-details-${exp.id}`}>Years & Details</Label>
              <Textarea
                id={`exp-details-${exp.id}`}
                value={exp.details || ""}
                onChange={(e) => updateItem(exp.id, 'details', e.target.value, experience, setExperience)}
                placeholder="e.g., 2019-2022, Taught Grade 9-12 Mathematics, improved class average by 15%"
              />
            </div>
          </div>
        </div>
      ))}
      
      <Button
        variant="outline"
        className="w-full"
        onClick={() => addItem(experience, setExperience)}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Another Experience
      </Button>
    </div>
  );

  const renderSimpleListForm = (
    items: FormItem[], 
    setItems: React.Dispatch<React.SetStateAction<FormItem[]>>,
    label: string,
    placeholder: string
  ) => (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="flex items-center space-x-2">
          <Input 
            value={item.value}
            onChange={(e) => updateItem(item.id, 'value', e.target.value, items, setItems)}
            placeholder={`${placeholder} ${index + 1}`}
            className="flex-1"
          />
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => removeItem(item.id, items, setItems)}
            disabled={items.length === 1}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ))}
      
      <Button
        variant="outline"
        className="w-full"
        onClick={() => addItem(items, setItems)}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Another {label}
      </Button>
    </div>
  );

  const renderSubjectExpertiseForm = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-sm mb-3">Academic Subjects</h4>
        {renderSimpleListForm(
          academicSubjects, 
          setAcademicSubjects, 
          "Academic Subject", 
          "e.g., Mathematics, Science, English"
        )}
      </div>
      
      <div>
        <h4 className="font-medium text-sm mb-3">After-School Subjects</h4>
        {renderSimpleListForm(
          afterSchoolSubjects, 
          setAfterSchoolSubjects, 
          "After-School Subject", 
          "e.g., Art, Music, Coding"
        )}
      </div>
    </div>
  );

  const renderCertificationsForm = () => (
    <div className="space-y-4">
      {certifications.map((cert, index) => (
        <div key={cert.id} className="p-4 border rounded-md bg-white">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-sm">Certification {index + 1}</h4>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => removeItem(cert.id, certifications, setCertifications)}
              disabled={certifications.length === 1}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor={`cert-name-${cert.id}`}>Certification Name</Label>
              <Input 
                id={`cert-name-${cert.id}`}
                value={cert.value}
                onChange={(e) => updateItem(cert.id, 'value', e.target.value, certifications, setCertifications)}
                placeholder="e.g., Certified Teacher, First Aid Training"
              />
            </div>
            
            <div>
              <Label htmlFor={`cert-details-${cert.id}`}>Issuing Organization & Date</Label>
              <Input
                id={`cert-details-${cert.id}`}
                value={cert.details || ""}
                onChange={(e) => updateItem(cert.id, 'details', e.target.value, certifications, setCertifications)}
                placeholder="e.g., Kenya Education Board, 2020"
              />
            </div>
          </div>
        </div>
      ))}
      
      <Button
        variant="outline"
        className="w-full"
        onClick={() => addItem(certifications, setCertifications)}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Another Certification
      </Button>
    </div>
  );

  const renderVideoForm = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-10 w-10 text-gray-400" />
          <h3 className="font-medium">Upload or Record Video</h3>
          <p className="text-sm text-gray-500">
            Upload a 1-2 minute video introducing yourself to potential students
          </p>
          <Button variant="outline" className="mt-2">
            Choose File
          </Button>
        </div>
      </div>
      
      <div>
        <Label htmlFor="video-url">Or Provide a YouTube/Vimeo URL</Label>
        <Input 
          id="video-url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="e.g., https://youtube.com/watch?v=..."
        />
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderEducationForm();
      case 2: return renderExperienceForm();
      case 3: return renderSimpleListForm(strategies, setStrategies, "Strategy", "e.g., Collaborative Learning");
      case 4: return renderSimpleListForm(methodologies, setMethodologies, "Methodology", "e.g., Project-based Learning");
      case 5: return renderSubjectExpertiseForm();
      case 6: return renderSimpleListForm(technicalSkills, setTechnicalSkills, "Technical Skill", "e.g., Microsoft Office, Programming");
      case 7: return renderSimpleListForm(languages, setLanguages, "Language", "e.g., English, Swahili");
      case 8: return renderCertificationsForm();
      case 9: return renderVideoForm();
      default: return null;
    }
  };

  const renderProgressIndicator = () => (
    <div className="flex items-center justify-between mb-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div 
          key={index}
          className={`flex items-center ${index !== 0 ? 'w-full' : ''}`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              currentStep > index + 1 
                ? 'bg-green-500 text-white' 
                : currentStep === index + 1 
                ? 'bg-blue-500 text-white border-2 border-blue-300' 
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {currentStep > index + 1 ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <span className="text-xs">{index + 1}</span>
            )}
          </div>
          {index < totalSteps - 1 && (
            <div 
              className={`h-1 w-full ${
                currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{getStepTitle()}</CardTitle>
        <CardDescription>{getStepDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        {renderProgressIndicator()}
        {renderCurrentStep()}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={currentStep === 1 ? onCancel : handleBack}
        >
          {currentStep === 1 ? 'Cancel' : (
            <>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </>
          )}
        </Button>
        <Button 
          onClick={handleNext}
          disabled={isSubmitting}
        >
          {currentStep === totalSteps ? (
            isSubmitting ? 'Submitting...' : 'Complete Profile'
          ) : (
            <>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeacherProfessionalProfileForm;
