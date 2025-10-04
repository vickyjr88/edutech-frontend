import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { teacherService } from "@/integrations/api/services/teacher.service";
import { zoomService } from "@/integrations/api/services/zoom.service";
import { authService } from "@/integrations/api/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { 
  EducationItem, 
  ExperienceItem, 
  StrategyItem, 
  MethodologyItem, 
  TechnicalSkillItem, 
  LanguageItem,
  AcademicSubjectItem,
  AfterSchoolSubjectItem
} from "@/components/teacher/professional-profile";

import { fetchExperienceRecords } from "@/components/teacher/professional-profile/utils/experienceUtils";

// Helper function to format phone number with country code
const formatPhoneNumber = (phone: string, countryCode: string = "+254"): string => {
  if (!phone) return '';
  
  // Remove any non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Remove country code if present in the phone number
  let normalizedPhone = digits;
  
  // If starts with leading zero, remove it
  if (normalizedPhone.startsWith('0')) {
    normalizedPhone = normalizedPhone.substring(1);
  }
  
  // Strip country code without plus if present
  // For example, if phone has 254701234567 and country code is +254
  const countryCodeDigits = countryCode.replace(/\D/g, '');
  if (normalizedPhone.startsWith(countryCodeDigits)) {
    normalizedPhone = normalizedPhone.substring(countryCodeDigits.length);
  }
  
  // Return with the selected country code
  return `${countryCode}${normalizedPhone}`;
};

type StepType = 
  | "personal"
  | "education"
  | "expertise"
  | "certifications";

// An array of all steps in order - 4 comprehensive steps
const STEPS: StepType[] = [
  "personal",
  "education", 
  "expertise",
  "certifications"
];

// Define the step information
interface StepInfo {
  id: StepType;
  title: string;
  description: string;
}

// Define the 4-step journey information  
const stepsInfo: Record<StepType, StepInfo> = {
  "personal": {
    id: "personal",
    title: "Personal Info", 
    description: "Name, contact, photo & intro video"
  },
  "education": {
    id: "education",
    title: "Education",
    description: "Academic background & qualifications"
  },
  "expertise": {
    id: "expertise",
    title: "Experience & Expertise",
    description: "Teaching experience, subjects & skills"
  },
  "certifications": {
    id: "certifications", 
    title: "Certifications",
    description: "Credentials & achievements"
  }
};

interface ProfileJourneyContextType {
  // Navigation
  currentStep: StepType;
  setCurrentStep: (step: StepType) => void;
  nextStep: () => void;
  prevStep: () => void;
  steps: StepType[];
  stepsInfo: Record<StepType, StepInfo>;
  getStepIndex: (step: StepType) => number;
  isFirstStep: boolean;
  isLastStep: boolean;
  
  // Completion status
  completedSteps: Record<StepType, boolean>;
  stepProgress: Record<StepType, number>;
  overallProgress: number;
  
  // Form data - Updated to match new UX structure
  personalInfo: {
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    countryCode: string;
    phone: string;
    alternativeCountryCode: string;
    alternativePhone: string;
    homeAddress: string;
    nationalId: string;
    country: string;
    idCountry: string;
    idType: string;
    idNumber: string;
    taxNumber: string;
    profileImage: string;
    introVideoUrl: string;
    bio: string;
    locationCity?: string;
    locationCounty?: string;
    locationPostalCode?: string;
    locationCoordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  locationInfo: {
    address: string;
    city: string;
    county: string;
    postalCode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    availability: {
      days: string[];
      times: {
        morning: boolean;
        afternoon: boolean;
        evening: boolean;
      };
    };
  };
  education: EducationItem[];
  experience: ExperienceItem[];
  subjects: {
    academic: AcademicSubjectItem[];
    afterSchool: AfterSchoolSubjectItem[];
  };
  teachingStyle: {
    strategies: StrategyItem[];
    methodologies: MethodologyItem[];
    languages: LanguageItem[];
    technicalSkills: TechnicalSkillItem[];
  };
  certifications: any[]; // Directly expose certifications
  verification: {
    backgroundCheck: boolean;
    idVerification: boolean;
  };
  platformSettings: {
    isZoomConnected: boolean;
    zoomEmail?: string;
    isGoogleConnected: boolean;
    googleEmail?: string;
  };
  
  // Update functions
  updatePersonalInfo: (data: Partial<ProfileJourneyContextType['personalInfo']>) => void;
  updateLocationInfo: (data: Partial<ProfileJourneyContextType['locationInfo']>) => void;
  setEducation: (items: EducationItem[]) => void;
  saveEducation: (educationData?: EducationItem[]) => Promise<boolean>;
  setExperience: (items: ExperienceItem[]) => void;
  saveExperience: (experienceData?: ExperienceItem[]) => Promise<boolean>;
  saveSubjects: (academicSubjectsData?: AcademicSubjectItem[], afterSchoolSubjectsData?: AfterSchoolSubjectItem[]) => Promise<boolean>;
  saveLanguages: (languagesData?: LanguageItem[]) => Promise<boolean>;
  saveTechnicalSkills: (skillsData?: TechnicalSkillItem[]) => Promise<boolean>;
  saveCertifications: (certificationsData?: any[]) => Promise<boolean>;
  setAcademicSubjects: (items: AcademicSubjectItem[]) => void;
  setAfterSchoolSubjects: (items: AfterSchoolSubjectItem[]) => void;
  setStrategies: (items: StrategyItem[]) => void;
  setMethodologies: (items: MethodologyItem[]) => void;
  setLanguages: (items: LanguageItem[]) => void;
  setTechnicalSkills: (items: TechnicalSkillItem[]) => void;
  setCertifications: (items: any[]) => void;
  updateVerification: (data: Partial<ProfileJourneyContextType['verification']>) => void;
  updatePlatformSettings: (data: Partial<ProfileJourneyContextType['platformSettings']>) => void;
  
  // Submit functions
  completeStep: (step: StepType) => void;
  isLoading: boolean;
  isSubmitting: boolean;
  completeProfile: () => Promise<boolean>;
}

const defaultContext: ProfileJourneyContextType = {
  // Navigation
  currentStep: "personal",
  setCurrentStep: () => {},
  nextStep: () => {},
  prevStep: () => {},
  steps: STEPS,
  stepsInfo,
  getStepIndex: () => 0,
  isFirstStep: true,
  isLastStep: false,
  
  // Completion status
  completedSteps: {
    personal: false,
    education: false,
    expertise: false,
    certifications: false
  },
  stepProgress: {
    personal: 0,
    education: 0,
    expertise: 0,
    certifications: 0
  },
  overallProgress: 0,
  
  // Form data
  personalInfo: {
    fullName: "",
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+254", // Default to Kenya
    phone: "",
    alternativeCountryCode: "+254",
    alternativePhone: "",
    homeAddress: "",
    nationalId: "",
    country: "Kenya",
    idCountry: "Kenya",
    idType: "",
    idNumber: "",
    taxNumber: "",
    profileImage: "",
    introVideoUrl: "",
    bio: "",
    locationCity: "",
    locationCounty: "",
    locationPostalCode: "",
    locationCoordinates: { latitude: 0, longitude: 0 },
  },
  locationInfo: {
    address: "",
    city: "",
    county: "",
    postalCode: "",
    coordinates: {
      latitude: 0,
      longitude: 0,
    },
    availability: {
      days: [],
      times: {
        morning: false,
        afternoon: false,
        evening: false,
      },
    },
  },
  education: [],
  experience: [],
  subjects: {
    academic: [],
    afterSchool: [],
  },
  teachingStyle: {
    strategies: [],
    methodologies: [],
    languages: [],
    technicalSkills: [],
  },
  certifications: [],
  verification: {
    backgroundCheck: false,
    idVerification: false,
  },
  platformSettings: {
    isZoomConnected: false,
    isGoogleConnected: false,
  },
  
  // Update functions
  updatePersonalInfo: () => {},
  updateLocationInfo: () => {},
  setEducation: () => {},
  saveEducation: async () => false,
  setExperience: () => {},
  saveExperience: async () => false,
  saveSubjects: async () => false,
  saveLanguages: async () => false,
  saveTechnicalSkills: async () => false,
  saveCertifications: async () => false,
  setAcademicSubjects: () => {},
  setAfterSchoolSubjects: () => {},
  setStrategies: () => {},
  setMethodologies: () => {},
  setLanguages: () => {},
  setTechnicalSkills: () => {},
  setCertifications: () => {},
  updateVerification: () => {},
  updatePlatformSettings: () => {},
  
  // Submit functions
  completeStep: () => {},
  isLoading: true,
  isSubmitting: false,
  completeProfile: async () => false,
};

const ProfileJourneyContext = createContext<ProfileJourneyContextType>(defaultContext);

export const ProfileJourneyProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Navigation state
  const [currentStep, setCurrentStep] = useState<StepType>("personal");
  
  // Completion state
  const [completedSteps, setCompletedSteps] = useState<Record<StepType, boolean>>({
    personal: false,
    education: false,
    expertise: false,
    certifications: false
  });
  
  const [stepProgress, setStepProgress] = useState<Record<StepType, number>>({
    personal: 0,
    education: 0,
    expertise: 0,
    certifications: 0
  });
  
  // Form data state
  const [personalInfo, setPersonalInfo] = useState(defaultContext.personalInfo);
  const [locationInfo, setLocationInfo] = useState(defaultContext.locationInfo);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [academicSubjects, setAcademicSubjects] = useState<AcademicSubjectItem[]>([]);
  const [afterSchoolSubjects, setAfterSchoolSubjects] = useState<AfterSchoolSubjectItem[]>([]);
  const [strategies, setStrategies] = useState<StrategyItem[]>([]);
  const [methodologies, setMethodologies] = useState<MethodologyItem[]>([]);
  const [languages, setLanguages] = useState<LanguageItem[]>([]);
  const [technicalSkills, setTechnicalSkills] = useState<TechnicalSkillItem[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [verification, setVerification] = useState(defaultContext.verification);
  const [platformSettings, setPlatformSettings] = useState(defaultContext.platformSettings);
  
  // Calculate step index and navigation helpers
  const getStepIndex = (step: StepType) => STEPS.indexOf(step);
  const currentStepIndex = getStepIndex(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;
  
  // Navigation functions
  const nextStep = () => {
    if (!isLastStep) {
      const nextStepValue = STEPS[currentStepIndex + 1];
      setCurrentStep(nextStepValue);
    }
  };
  
  const prevStep = () => {
    if (!isFirstStep) {
      const prevStepValue = STEPS[currentStepIndex - 1];
      setCurrentStep(prevStepValue);
    }
  };
  
  // Update functions
  const updatePersonalInfo = async (data: Partial<ProfileJourneyContextType['personalInfo']>) => {
    try {
      // Update local state first for immediate UI feedback
      setPersonalInfo(prev => ({ ...prev, ...data }));
      
      // Only make API call if user is logged in
      if (user?.id) {
        console.log("Updating user profile with personal info:", data);
        
        // Split the data between user profile (goes to /user/:id) and teacher profile (goes to /teachers/:id)
        
        // Country name to code mapping
        const countryNameToCode: { [key: string]: string } = {
          'Kenya': 'KE',
          'Tanzania': 'TZ', 
          'Uganda': 'UG',
          'Rwanda': 'RW',
          'United States': 'US',
          'Canada': 'CA',
          'United Kingdom': 'GB',
          'Nigeria': 'NG',
          'South Africa': 'ZA',
          'Egypt': 'EG',
          'India': 'IN',
          'Australia': 'AU',
          'Germany': 'DE',
          'France': 'FR'
        };

        // ID type display name to code mapping
        const idTypeDisplayToCode: { [key: string]: string } = {
          'National ID': 'national_id',
          'Passport': 'passport', 
          "Driver's License": 'drivers_license',
          'Social Security Number': 'social_security_number',
          'Aadhaar Card': 'aadhaar_card',
          'Other Government ID': 'other_government_id'
        };

        // 1. User profile data
        const userData: any = {
          // Use fullName directly
          ...(data.fullName && { fullName: data.fullName.trim() }),
          // Format phone number with the selected country code
          ...(data.phone && { 
            phoneNumber: formatPhoneNumber(data.phone, data.countryCode) 
          }),
          // Include alternativePhone in user data
          ...(data.alternativePhone && { 
            alternativePhoneNumber: formatPhoneNumber(
              data.alternativePhone, 
              data.alternativeCountryCode || data.countryCode || "+254"
            ) 
          }),
          // Include bio in user data
          ...(data.bio && { bio: data.bio }),
          // Email can only be updated if it's not already set
          ...(data.email && { email: data.email }),
          // Include legal_id if provided
          ...(data.idType && data.idNumber && data.idCountry && {
            legal_id: {
              id_type: idTypeDisplayToCode[data.idType] || data.idType.toLowerCase().replace(/\s+/g, '_').replace("'", ""),
              id: data.idNumber,
              country: countryNameToCode[data.idCountry] || 'XX'
            }
          }),
          // Include tax_info if provided
          ...(data.taxNumber && data.country && {
            tax_info: {
              tax_no: data.taxNumber,
              country: countryNameToCode[data.country] || 'XX'
            }
          })
        };
        
        // 2. Teacher profile data
        const teacherData: any = {
          // Note: We don't include firstName/lastName in teacherProfile
          // Note: profileImage is handled separately via uploadProfilePhoto, not in general profile updates
          // Include intro video URL in teacher profile
          ...(data.introVideoUrl && { introVideoUrl: data.introVideoUrl }),
          // Include location data in teacher profile if available
          ...(data.homeAddress && {
            location: {
              address: data.homeAddress,
              city: data.locationCity || '',
              county: data.locationCounty || '',
              postalCode: data.locationPostalCode || '',
              coordinates: data.locationCoordinates || { latitude: 0, longitude: 0 }
            }
          })
        };
        
        // Call API to update user profile data
        const userResponse = await authService.updateUserProfile(userData);
        
        if (userResponse.error) {
          console.error("Error updating user profile:", userResponse.error);
          toast({
            title: "Error",
            description: "Failed to update basic user information",
            variant: "destructive"
          });
        } else {
          console.log("User profile updated successfully");
        }
        
        // Call API to update teacher profile if we have teacher-specific data and a teacherId
        if (Object.keys(teacherData).length > 0 && user.teacherId) {
          const teacherResponse = await teacherService.updateProfile(user.teacherId, teacherData);
          
          if (teacherResponse.error) {
            console.error("Error updating teacher profile:", teacherResponse.error);
            toast({
              title: "Error",
              description: "Failed to update teacher-specific information",
              variant: "destructive"
            });
          } else {
            console.log("Teacher profile updated successfully");
          }
        }
      }
      
      // Update progress
      updateStepProgress("personal");
    } catch (error) {
      console.error("Error in updatePersonalInfo:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving your personal information",
        variant: "destructive"
      });
    }
  };

  // Save education function - called when education step is completed
  const saveEducation = async (educationData?: EducationItem[]): Promise<boolean> => {
    try {
      if (!user?.teacherId) {
        toast({
          title: "Error",
          description: "Teacher ID not found. Please ensure you are logged in.",
          variant: "destructive"
        });
        return false;
      }

      const teacherId = user.teacherId;
      const educationToSave = educationData || education;
      console.log("Saving education for teacher:", teacherId);
      console.log("Education items to save:", educationToSave);

      // Convert EducationItem format to Education format for the API
      const educationItemsForAPI = educationToSave.map(edu => {
        const baseItem = {
          institution: edu.institution || edu.institutionName || '',
          degree: edu.degree || '',
          fieldOfStudy: edu.additionalDetails || '', // Map additionalDetails to fieldOfStudy
          startDate: edu.startDate,
          endDate: edu.endDate,
          isCurrentlyEnrolled: edu.isCurrentlyStudying || false
          // Note: teacherProfile is added by the service method, don't add it here
        };

        // Only include id for existing items (not new items with temporary IDs)
        if (edu._id && !edu._id.startsWith('edu-') && !edu._id.startsWith('cv-edu-') && !edu._id.startsWith('temp_')) {
          return {
            id: edu._id,
            ...baseItem
          };
        }

        // For new items, don't include the id field at all
        return baseItem;
      });

      console.log("Sending education items to API:", educationItemsForAPI);

      // Call the new bulk update endpoint
      const result = await teacherService.updateTeacherEducation(teacherId, educationItemsForAPI);
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to save education information');
      }

      // Update local state with the response data if available
      if (result.data && Array.isArray(result.data)) {
        // Convert the API response back to EducationItem format
        const updatedEducation: EducationItem[] = result.data.map((apiEdu) => ({
          _id: apiEdu._id || apiEdu.id,
          institution: apiEdu.institutionName,
          institutionName: apiEdu.institutionName,
          degree: apiEdu.degree,
          additionalDetails: apiEdu.additionalDetails || '',
          startDate: apiEdu.startDate,
          endDate: apiEdu.endDate,
          isCurrentlyStudying: apiEdu.isCurrentlyStudying || false,
          institutionType: apiEdu.institutionType || 'university'
        }));
        // Update both the context state and the passed data
        setEducation(updatedEducation);
        // If educationData was passed, we should also update that reference for consistency
        if (educationData) {
          educationData.length = 0;
          educationData.push(...updatedEducation);
        }
      }

      toast({
        title: "Success",
        description: "Education information saved successfully",
      });

      console.log("Education saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving education:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save education information. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Save experience function - called when experience step is completed
  const saveExperience = async (experienceData?: ExperienceItem[]): Promise<boolean> => {
    try {
      if (!user?.teacherId) {
        toast({
          title: "Error",
          description: "Teacher ID not found. Please ensure you are logged in.",
          variant: "destructive"
        });
        return false;
      }

      const teacherId = user.teacherId;
      console.log("Saving experience for teacher:", teacherId);
      
      // Use provided data or fall back to context state
      const experienceToSave = experienceData || experience;
      console.log("Experience items to save:", experienceToSave);

      // Convert ExperienceItem format to Experience format for the API
      const experienceItemsForAPI = experienceToSave.map(exp => {
        const baseItem = {
          position: exp.position || '',
          institution: exp.institution || '',
          institutionType: exp.institutionType || '',
          startDate: exp.startDate,
          endDate: exp.endDate,
          isCurrentlyWorking: exp.isCurrentlyWorking || false,
          curriculums: exp.curriculums || [],
          grades: exp.grades || [],
          subjects: exp.subjects || [],
          reportingManager: exp.reportingManager,
          additionalDetails: exp.additionalDetails || ''
        };

        // Only include id for existing items (not new items with temporary IDs)
      if (exp._id && !exp._id.startsWith('cv-') && !exp._id.startsWith('temp_') && !exp._id.startsWith('exp-')) {
          return {
            id: exp._id,
            ...baseItem
          };
        }

        // For new items, don't include the id field at all
        return baseItem;
      });

      console.log("Sending experience items to API:", experienceItemsForAPI);

      // Call the new bulk update endpoint
      const result = await teacherService.updateTeacherExperience(teacherId, experienceItemsForAPI);
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to save experience information');
      }

      // Update local state with the response data if available
      if (result.data && Array.isArray(result.data)) {
        const updatedExperience = result.data.map((apiExp, index) => ({
          ...experienceToSave[index],
          _id: apiExp.id || experienceToSave[index]._id
        }));
        setExperience(updatedExperience);
      }

      toast({
        title: "Success",
        description: "Experience information saved successfully",
      });

      console.log("Experience saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving experience:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save experience information. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Save subjects function - called when subjects are updated
  const saveSubjects = async (academicSubjectsData?: AcademicSubjectItem[], afterSchoolSubjectsData?: AfterSchoolSubjectItem[]): Promise<boolean> => {
    try {
      if (!user?.teacherId) {
        toast({
          title: "Error",
          description: "Teacher ID not found. Please ensure you are logged in.",
          variant: "destructive"
        });
        return false;
      }

      const teacherId = user.teacherId;
      console.log("Saving subjects for teacher:", teacherId);
      
      const academicToSave = academicSubjectsData || academicSubjects;
      const afterSchoolToSave = afterSchoolSubjectsData || afterSchoolSubjects;
      console.log("Academic subjects to save:", academicToSave);
      console.log("After-school subjects to save:", afterSchoolToSave);

      // Convert subject items to API format and filter out empty subjects
      const academicSubjectsForAPI = academicToSave
        .filter(subject => subject.subject && subject.subject.trim()) // Only include non-empty subjects
        .map(subject => {
          const baseItem = {
            subject: subject.subject.trim(), // AcademicSubjectItem uses 'subject' field
            isAcademic: true,
            teacherProfile: teacherId,
            // Include curriculum and gradeLevel if available for academic subjects
            ...(subject.curriculum && { curriculum: subject.curriculum }),
            ...(subject.gradeLevel && { gradeLevel: subject.gradeLevel })
          };

          // Only include id for existing items (not new items with temporary IDs)
          if (subject._id && !subject._id.startsWith('cv-academic') && !subject._id.startsWith('academic-') && !subject._id.startsWith('temp_')) {
            return {
              id: subject._id,
              ...baseItem
            };
          }

          // For new items, don't include the id field at all
          return baseItem;
        });

      const afterSchoolSubjectsForAPI = afterSchoolToSave
        .filter(subject => subject.subject && subject.subject.trim()) // Only include non-empty subjects
        .map(subject => {
          const baseItem = {
            subject: subject.subject.trim(), // AfterSchoolSubjectItem uses 'subject' field
            isAcademic: false,
            teacherProfile: teacherId
          };

          // Only include id for existing items (not new items with temporary IDs)
          if (subject._id && !subject._id.startsWith('afterschool-') && !subject._id.startsWith('after-school-') && !subject._id.startsWith('temp_')) {
            return {
              id: subject._id,
              ...baseItem
            };
          }

          // For new items, don't include the id field at all
          return baseItem;
        });

      const allSubjectsForAPI = [...academicSubjectsForAPI, ...afterSchoolSubjectsForAPI];

      console.log("Sending subjects to API:", allSubjectsForAPI);

      // Call the bulk update endpoint
      const result = await teacherService.updateTeacherSubjects(teacherId, allSubjectsForAPI);
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to save subjects information');
      }

      // Update local state with the response data if available
      if (result.data && Array.isArray(result.data)) {
        const updatedAcademicSubjects:any = result.data
          .filter(subject => subject.isAcademic)
          .map((apiSubject, index) => ({
            ...academicToSave[index] || {},
            _id: apiSubject.id || apiSubject._id,
            subject: apiSubject.subject || apiSubject.name // API returns 'subject' field
          }));
        
        const updatedAfterSchoolSubjects: AfterSchoolSubjectItem[] = result.data
          .filter((subject) => !subject.isAcademic)
          .map((apiSubject, index) => ({
            ...(afterSchoolToSave[index] || {}),
            _id: apiSubject.id || apiSubject._id,
            subject: apiSubject.subject || apiSubject.name, // API returns 'subject' field
          }));
        
        setAcademicSubjects(updatedAcademicSubjects);
        setAfterSchoolSubjects(updatedAfterSchoolSubjects);
      }

      toast({
        title: "Success",
        description: "Subjects information saved successfully",
      });

      console.log("Subjects saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving subjects:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save subjects information. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Save languages function - called when languages are updated
  const saveLanguages = async (languagesData?: LanguageItem[]): Promise<boolean> => {
    try {
      if (!user?.teacherId) {
        toast({
          title: "Error",
          description: "Teacher ID not found. Please ensure you are logged in.",
          variant: "destructive"
        });
        return false;
      }

      const teacherId = user.teacherId;
      console.log("Saving languages for teacher:", teacherId);

      
      
      // Use provided data or fall back to context state
      const languagesToSave = languagesData || languages;
      console.log("Languages to save:", languagesToSave);

      // Convert language items to API format
      const languagesForAPI = languagesToSave.map(lang => {
        const baseItem = {
          name: lang.name || lang.language || '', // Use name field as per API requirement
          proficiency: lang.language || '',
          teacherProfile: teacherId
        };

        // Only include id for existing items (not new items with temporary IDs)
        if (lang._id && !lang._id.startsWith('lang-') && !lang._id.startsWith('cv-lang-')) {
          return {
            id: lang._id,
            ...baseItem
          };
        }

        // For new items, don't include the id field at all
        return baseItem;
      });

      console.log("Sending languages to API:", languagesForAPI);

      // Call the bulk update endpoint
      const result = await teacherService.updateTeacherLanguages(teacherId, languagesForAPI);
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to save languages information');
      }

      // Update local state with the response data if available
      if (result.data && Array.isArray(result.data)) {
        const updatedLanguages = result.data.map((apiLang, index) => ({
          ...languagesToSave[index],
          _id: apiLang._id || languagesToSave[index]._id
        }));
        setLanguages(updatedLanguages);
      }

      toast({
        title: "Success",
        description: "Languages information saved successfully",
      });

      console.log("Languages saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving languages:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save languages information. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Save technical skills function - called when technical skills are updated
  const saveTechnicalSkills = async (skillsData?: TechnicalSkillItem[]): Promise<boolean> => {
    try {
      if (!user?.teacherId) {
        toast({
          title: "Error",
          description: "Teacher ID not found. Please ensure you are logged in.",
          variant: "destructive"
        });
        return false;
      }

      const teacherId = user.teacherId;
      console.log("Saving technical skills for teacher:", teacherId);
      
      // Use provided data or fall back to context state
      const skillsToSave = skillsData || technicalSkills;
      console.log("Technical skills to save:", skillsToSave);

      // Convert technical skill items to API format
      const skillsForAPI = skillsToSave.map(skill => {
        const baseItem = {
          skill: skill.name || '', // TechnicalSkillItem uses 'name' field, but API expects 'skill'
          description: skill.description || '',
          level: skill.level || '',
          isCertified: skill.isCertified || false,
          teacherProfile: teacherId
        };

        // Only include id for existing items (not new items with temporary IDs)
        if (skill._id && !skill._id.startsWith('skill-') && !skill._id.startsWith('cv-skill-') && !skill._id.startsWith('general-') && !skill._id.startsWith('temp_')) {
          return {
            id: skill._id,
            ...baseItem
          };
        }

        // For new items, don't include the id field at all
        return baseItem;
      });

      console.log("Sending technical skills to API:", skillsForAPI);

      // Call the bulk update endpoint
      const result = await teacherService.updateTeacherTechnicalSkills(teacherId, skillsForAPI);
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to save technical skills information');
      }

      // Update local state with the response data if available
      if (result.data && Array.isArray(result.data)) {
        const updatedSkills = result.data.map((apiSkill, index) => ({
          ...skillsToSave[index],
          _id: apiSkill._id || skillsToSave[index]._id,
          name: apiSkill.name || '', // API returns 'skill' field, map to 'name'
          description: apiSkill.description || '',
          level: apiSkill.level || '',
          isCertified: apiSkill.isCertified || false
        }));
        setTechnicalSkills(updatedSkills);
      }

      toast({
        title: "Success",
        description: "Technical skills information saved successfully",
      });

      console.log("Technical skills saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving technical skills:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save technical skills information. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Save certifications function - called when certifications are updated
  const saveCertifications = async (certificationsData?: any[]): Promise<boolean> => {
    try {
      if (!user?.teacherId) {
        toast({
          title: "Error",
          description: "Teacher ID not found. Please ensure you are logged in.",
          variant: "destructive"
        });
        return false;
      }

      const teacherId = user.teacherId;
      console.log("Saving certifications for teacher:", teacherId);
      
      // Use provided data or fall back to context state
      const certificationsToSave = certificationsData || certifications;
      console.log("Certifications to save:", certificationsToSave);

      // Get existing certifications from API to handle updates vs creates
      let existingCerts = [];
      try {
        const existingCertifications = await teacherService.getTeacherCertifications(teacherId);
        existingCerts = existingCertifications.data || [];
      } catch (error) {
        console.log("No existing certifications found or error fetching them:", error);
      }

      const results = [];

      // Process each certification
      for (const cert of certificationsToSave) {
        const certificationData = {
          certificateType: 'Professional',
          name: cert.name || cert.value || '',
          issuer: cert.issuer || '',
          year: cert.year,
          issueDate: cert.year ? `${cert.year}-01-01` : undefined,
          description: cert.description || cert.details || '',
          isVerifiable: cert.isVerifiable || false,
          credentialUrl: cert.credentialUrl || '',
          cert_docs: cert.cert_docs || []
        };

        // Check if this is an existing certification (has _id and it's not temporary)
        const existingCert = existingCerts.find(existing => existing._id === cert._id);
        
        if (existingCert && cert._id && !cert._id.startsWith('cert-') && !cert._id.startsWith('cv-cert-')) {
          // Update existing certification
          const result = await teacherService.updateCertification(teacherId, cert._id, certificationData);
          if (result.error) {
            throw new Error(result.error.message || 'Failed to update certification');
          }
          results.push(result.data);
        } else {
          // Create new certification
          const result = await teacherService.addCertification(teacherId, certificationData);
          if (result.error) {
            throw new Error(result.error.message || 'Failed to save certification');
          }
          results.push(result.data);
        }
      }

      // Update local state with the response data
      if (results.length > 0) {
        const updatedCertifications = results.map((apiCert, index) => ({
          ...certificationsToSave[index],
          _id: apiCert._id || certificationsToSave[index]._id,
          id: apiCert._id || certificationsToSave[index].id,
          name: apiCert.name || certificationsToSave[index].name,
          value: apiCert.name || certificationsToSave[index].value,
          issuer: apiCert.issuer || certificationsToSave[index].issuer,
          year: apiCert.issueDate ? new Date(apiCert.issueDate).getFullYear() : certificationsToSave[index].year,
          description: apiCert.description || certificationsToSave[index].description,
          details: apiCert.description || certificationsToSave[index].details
        }));
        setCertifications(updatedCertifications);
      }

      toast({
        title: "Success",
        description: "Certifications saved successfully",
      });

      console.log("Certifications saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving certifications:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save certifications. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const updateLocationInfo = async (data: Partial<ProfileJourneyContextType['locationInfo']>) => {
    try {
      // Update local state
      setLocationInfo(prev => ({ ...prev, ...data }));
      
      // Only make API call if user is logged in and has a teacherId
      if (user?.teacherId) {
        console.log("Updating teacher location info:", data);
        
        // Prepare API data
        const apiData: any = {
          location: {
            address: data.address,
            city: data.city,
            county: data.county,
            postalCode: data.postalCode,
            coordinates: data.coordinates
          },
          availability: data.availability
        };
        
        // Call API to update profile
        const { error } = await teacherService.updateProfile(user.teacherId, apiData);
        
        if (error) {
          console.error("Error updating location info:", error);
          toast({
            title: "Error",
            description: "Failed to save your location information",
            variant: "destructive"
          });
        } else {
          console.log("Teacher location updated successfully");
        }
      }
      
      // Update progress
      updateStepProgress("personal");
    } catch (error) {
      console.error("Error in updateLocationInfo:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving your location information",
        variant: "destructive"
      });
    }
  };
  
  const updateVerification = async (data: Partial<ProfileJourneyContextType['verification']>) => {
    try {
      // Update local state
      setVerification(prev => ({ ...prev, ...data }));
      
      // Only make API call if user is logged in and has a teacherId
      if (user?.teacherId) {
        console.log("Updating teacher verification info:", data);
        
        // Prepare API data - for verification, most data is handled by separate API calls
        // This is mainly updating verification status flags
        const apiData: any = {
          isBackgroundChecked: data.backgroundCheck,
          isIdVerified: data.idVerification
        };
        
        // Call API to update profile
        const { error } = await teacherService.updateProfile(user.teacherId, apiData);
        
        if (error) {
          console.error("Error updating verification info:", error);
          toast({
            title: "Error",
            description: "Failed to save your verification information",
            variant: "destructive"
          });
        } else {
          console.log("Teacher verification updated successfully");
        }
      }
      
      // Update progress
      updateStepProgress("certifications");
    } catch (error) {
      console.error("Error in updateVerification:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving your verification information",
        variant: "destructive"
      });
    }
  };
  
  const updatePlatformSettings = async (data: Partial<ProfileJourneyContextType['platformSettings']>) => {
    try {
      // Update local state
      setPlatformSettings(prev => ({ ...prev, ...data }));
      
      // Only make API call if user is logged in and has a teacherId
      if (user?.teacherId) {
        console.log("Updating teacher platform settings:", data);
        
        // For platform settings like Zoom integration, the actual connection
        // is handled through OAuth flow, but we can update the introVideoUrl
        const apiData: any = {
          // Mark profile as complete if Zoom is connected - this is a key step
          isProfileComplete: data.isZoomConnected === true ? true : undefined
        };
        
        // Add the intro video URL if it's provided
        if (data.introVideoUrl!) {
          apiData.introVideoUrl = data.introVideoUrl;
        }
        // Only make the API call if we have data to update
        if (Object.keys(apiData).length > 0) {
          // Call API to update profile
          const { error } = await teacherService.updateProfile(user.teacherId, apiData);
          
          if (error) {
            console.error("Error updating platform settings:", error);
            toast({
              title: "Error",
              description: "Failed to save your platform settings",
              variant: "destructive"
            });
          } else {
            console.log("Teacher platform settings updated successfully");
          }
        }
      }
      
      // Update progress
      updateStepProgress("certifications");
    } catch (error) {
      console.error("Error in updatePlatformSettings:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving your platform settings",
        variant: "destructive"
      });
    }
  };
  
  // Step completion function
  const completeStep = (step: StepType) => {
    console.log(`Marking step ${step} as complete`);
    
    // Add detailed logging for personal step
    if (step === 'personal') {
      console.log("Personal info when marking as complete:", {
        personalInfo,
        hasFullName: !!personalInfo.fullName,
        hasEmail: !!personalInfo.email,
        hasPhone: !!personalInfo.phone, 
        hasBio: !!personalInfo.bio,
        hasProfileImage: !!personalInfo.profileImage,
        profileImageUrl: personalInfo.profileImage
      });
    }
    
    setCompletedSteps(prevState => {
      const updated = { ...prevState, [step]: true };
      console.log("Updated completedSteps:", updated);
      return updated;
    });
    
    // Update step progress to 100%
    setStepProgress(prevState => {
      const updated = { ...prevState, [step]: 100 };
      console.log("Updated stepProgress:", updated);
      return updated;
    });
  };
  
  // Update step progress based on completion status
  const updateStepProgress = (step: StepType) => {
    // Create a modified version of step completion rules for progress calculation
    const calculateProgress = () => {
      switch (step) {
        case "personal":
          // Personal info requirements: Full Name, Email, Phone, Home Address, ID Fields, Country, Photo, Bio
          const nameComplete = personalInfo.fullName && personalInfo.fullName.trim() ? 1 : 0;
          const emailComplete = personalInfo.email ? 1 : 0;
          const phoneComplete = personalInfo.phone ? 1 : 0;
          const homeAddressComplete = personalInfo.homeAddress ? 1 : 0;
          const idComplete = personalInfo.idCountry && personalInfo.idType && personalInfo.idNumber ? 1 : 0;
          const countryComplete = personalInfo.country ? 1 : 0;
          const profileImageComplete = personalInfo.profileImage ? 1 : 0;
          const bioComplete = personalInfo.bio && personalInfo.bio.length >= 20 ? 1 : 0;
          
          return ((nameComplete + emailComplete + phoneComplete + homeAddressComplete + 
                   idComplete + countryComplete + profileImageComplete + bioComplete) / 8) * 100;
          
        case "education":
          // Education requirements: College + High School
          const hasEducation = education.length > 0 ? 1 : 0;
          
          // More inclusive college education detection
          const hasCollegeEducation = education.some(edu => {
            const degree = edu.degree?.toLowerCase() || '';
            const institution = edu.institutionName?.toLowerCase() || edu.institution?.toLowerCase() || '';
            return degree.includes('bachelor') || 
                   degree.includes('master') || 
                   degree.includes('degree') ||
                   degree.includes('diploma') ||
                   degree.includes('certificate') ||
                   degree.includes('phd') ||
                   degree.includes('doctorate') ||
                   institution.includes('university') ||
                   institution.includes('college') ||
                   institution.includes('institute');
          }) ? 1 : 0;
          
          // More inclusive high school education detection  
          const hasHighSchoolEducation = education.some(edu => {
            const degree = edu.degree?.toLowerCase() || '';
            const institution = edu.institutionName?.toLowerCase() || edu.institution?.toLowerCase() || '';
            return degree.includes('high school') || 
                   degree.includes('secondary') ||
                   degree.includes('kcse') ||
                   degree.includes('o-level') ||
                   degree.includes('a-level') ||
                   institution.includes('high school') ||
                   institution.includes('secondary');
          }) ? 1 : 0;
          
          // If we have education but can't categorize it, assume it's valid and give full credit
          if (hasEducation && !hasCollegeEducation && !hasHighSchoolEducation) {
            return 100; // Give full credit for any education entry
          }
          
          return hasEducation ? Math.max(50, (hasCollegeEducation + hasHighSchoolEducation) * 50) : 0;
          
        case "expertise":
          // Experience and Expertise: Institution experience, subjects, languages, skills
          const hasSubjects = (academicSubjects.length > 0 || afterSchoolSubjects.length > 0) ? 1 : 0;
          const hasExperience = experience.length > 0 ? 1 : 0;
          const hasLanguages = languages.length > 0 ? 1 : 0;
          const hasSkills = technicalSkills.length > 0 ? 1 : 0;
          
          return ((hasSubjects + hasExperience + hasLanguages + hasSkills) / 4) * 100;
          
        case "certifications":
          // Certifications and Achievements
          const hasCertifications = certifications.length > 0 ? 1 : 0;
          const hasBackgroundCheck = verification.backgroundCheck ? 1 : 0;
          const hasIdVerification = verification.idVerification ? 1 : 0;
          
          return ((hasCertifications + hasBackgroundCheck + hasIdVerification) / 3) * 100;
          
        default:
          return 0;
      }
    };
    
    const progress = calculateProgress();
    console.log(`Calculated progress for ${step}: ${progress}%`);
    
    // Just update the progress without marking as complete to avoid potential loops
    setStepProgress(prev => ({ ...prev, [step]: progress }));
    
    // Only mark as complete in the completeStep function, not here
    // This avoids the circular dependency where updating one state triggers an update to another
  };
  
  // Calculate progress for steps when their data changes
  useEffect(() => {
    updateStepProgress("personal");
  }, [personalInfo]);
  
  useEffect(() => {
    updateStepProgress("education");
  }, [education]);
  
  useEffect(() => {
    updateStepProgress("expertise");
  }, [academicSubjects, afterSchoolSubjects, experience, languages, technicalSkills]);
  
  useEffect(() => {
    updateStepProgress("certifications");
  }, [certifications, verification]);
  
  // This effect checks if any steps have reached 100% and marks them as complete
  // It's separated from the progress calculation to avoid circular dependencies
  useEffect(() => {
    // For each step, if progress is 100%, mark it as complete
    STEPS.forEach(step => {
      if (stepProgress[step] === 100) {
        // Only update if not already marked complete to avoid loops
        if (!completedSteps[step]) {
          setCompletedSteps(prev => ({ ...prev, [step]: true }));
        }
      }
    });
  }, [stepProgress]);

  // This effect marks the teacher profile as complete when all steps are finished
  useEffect(() => {
    const allStepsComplete = STEPS.every(step => completedSteps[step]);
    
    if (allStepsComplete && user?.teacherId) {
      console.log("All steps completed, marking teacher profile as complete");
      
      // Automatically mark the teacher profile as complete
      teacherService.updateProfile(user.teacherId, {
        isProfileComplete: true
      }).then(({ error }) => {
        if (error) {
          console.error("Error marking profile as complete:", error);
        } else {
          console.log("Teacher profile marked as complete successfully");
        }
      }).catch(error => {
        console.error("Error marking profile as complete:", error);
      });
    }
  }, [completedSteps, user?.teacherId]);

  // Calculate overall progress
  const completedStepsCount = Object.values(completedSteps).filter(Boolean).length;
  
  // If all steps are completed, show 100%
  const overallProgress = completedStepsCount === STEPS.length 
    ? 100
    : Object.values(stepProgress).reduce((sum, progress) => sum + progress, 0) / STEPS.length;
  
  // Load teacher profile data when component mounts
  useEffect(() => {
    const loadTeacherData = async () => {
      if (!user?.teacherId) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Load teacher profile
        const { data: profileData } = await teacherService.getProfileById(user.teacherId);
        console.log("Loaded teacher profile:", profileData);
        if (profileData) {
          // User info is nested in the user property
          const userInfo = profileData.user || {} as any;
          
          // Use fullName directly
          const fullName = userInfo.fullName || "";
          
          // Extract phone numbers from the user object and add debug logging
          console.log("User info from API:", userInfo);
          
          const phoneNumber = userInfo.phoneNumber || "";
          const alternativePhoneNumber = userInfo.alternativePhoneNumber || "";
          
          console.log("Raw phone numbers from API:", { 
            phoneNumber, 
            alternativePhoneNumber 
          });
          
          // Extract country code (assuming format like "+254...")
          let countryCode = "+254"; // Default
          let phoneDigits = "";
          
          if (phoneNumber) {
            console.log("Processing phoneNumber:", phoneNumber);
            
            // Match the country code pattern (+XXX)
            const countryCodeMatch = phoneNumber.match(/^\+(\d+)/);
            if (countryCodeMatch) {
              // Found a country code like +254
              const extractedCode = countryCodeMatch[1];
              console.log("Extracted country code digits:", extractedCode);
              
              // Common country codes
              const commonCodes = ["1", "44", "254", "255", "256", "250", "234", "27", "20", "91", "86", "81", "61", "33", "49"];
              
              // Try to match with common country codes (1-3 digits)
              let matchedCode = null;
              for (const code of commonCodes) {
                if (extractedCode.startsWith(code)) {
                  matchedCode = code;
                  break;
                }
              }
              
              // If we found a match, use it
              if (matchedCode) {
                countryCode = `+${matchedCode}`;
                // Remove the matched country code (+XX) from the beginning of the number
                const regex = new RegExp(`^\\+${matchedCode}`);
                phoneDigits = phoneNumber.replace(regex, '');
              } else {
                // Fallback to assuming it's a 1, 2 or 3 digit code
                countryCode = `+${extractedCode.substring(0, Math.min(3, extractedCode.length))}`;
                const regex = new RegExp(`^\\+${extractedCode.substring(0, Math.min(3, extractedCode.length))}`);
                phoneDigits = phoneNumber.replace(regex, '');
              }
              
              // Use a more accurate country code for validation
              switch (countryCode) {
                case "+1": // US/Canada
                case "+44": // UK
                case "+254": // Kenya
                case "+255": // Tanzania
                case "+256": // Uganda
                case "+250": // Rwanda
                case "+234": // Nigeria
                case "+27": // South Africa
                case "+20": // Egypt
                case "+91": // India
                case "+86": // China
                case "+81": // Japan
                case "+61": // Australia
                case "+33": // France
                case "+49": // Germany
                  // These are valid codes we support
                  break;
                default:
                  // For any other code, we'll log but keep it
                  console.log("Found unusual country code:", countryCode);
              }
              
              console.log("Parsed values:", { countryCode, phoneDigits });
            } else {
              // No + prefix, treat the entire string as phone digits
              phoneDigits = phoneNumber.replace(/[^\d]/g, '');
              console.log("No country code found, using default", { countryCode, phoneDigits });
            }
          }
          
          // Extract alternative country code
          let alternativeCountryCode = countryCode; // Default to the same as primary
          let alternativePhoneDigits = "";
          
          if (alternativePhoneNumber) {
            console.log("Processing alternativePhoneNumber:", alternativePhoneNumber);
            
            // Match the country code pattern (+XXX)
            const altCountryCodeMatch = alternativePhoneNumber.match(/^\+(\d+)/);
            if (altCountryCodeMatch) {
              // Found a country code like +254
              const extractedCode = altCountryCodeMatch[1];
              console.log("Extracted alt country code digits:", extractedCode);
              
              // Common country codes
              const commonCodes = ["1", "44", "254", "255", "256", "250", "234", "27", "20", "91", "86", "81", "61", "33", "49"];
              
              // Try to match with common country codes (1-3 digits)
              let matchedCode = null;
              for (const code of commonCodes) {
                if (extractedCode.startsWith(code)) {
                  matchedCode = code;
                  break;
                }
              }
              
              // If we found a match, use it
              if (matchedCode) {
                alternativeCountryCode = `+${matchedCode}`;
                // Remove the matched country code (+XX) from the beginning of the number
                const regex = new RegExp(`^\\+${matchedCode}`);
                alternativePhoneDigits = alternativePhoneNumber.replace(regex, '');
              } else {
                // Fallback to assuming it's a 1, 2 or 3 digit code
                alternativeCountryCode = `+${extractedCode.substring(0, Math.min(3, extractedCode.length))}`;
                const regex = new RegExp(`^\\+${extractedCode.substring(0, Math.min(3, extractedCode.length))}`);
                alternativePhoneDigits = alternativePhoneNumber.replace(regex, '');
              }
              
              // Use a more accurate country code for validation
              switch (alternativeCountryCode) {
                case "+1": // US/Canada
                case "+44": // UK
                case "+254": // Kenya
                case "+255": // Tanzania
                case "+256": // Uganda
                case "+250": // Rwanda
                case "+234": // Nigeria
                case "+27": // South Africa
                case "+20": // Egypt
                case "+91": // India
                case "+86": // China
                case "+81": // Japan
                case "+61": // Australia
                case "+33": // France
                case "+49": // Germany
                  // These are valid codes we support
                  break;
                default:
                  // For any other code, we'll log but keep it
                  console.log("Found unusual alternative country code:", alternativeCountryCode);
              }
              
              console.log("Parsed alt values:", { alternativeCountryCode, alternativePhoneDigits });
            } else {
              // No + prefix, treat the entire string as phone digits
              alternativePhoneDigits = alternativePhoneNumber.replace(/[^\d]/g, '');
              console.log("No alt country code found, using default", { alternativeCountryCode, alternativePhoneDigits });
            }
          }
          
          console.log("Parsed phone values:", {
            countryCode,
            phoneDigits,
            alternativeCountryCode,
            alternativePhoneDigits
          });
          
          // Extract legal_id and tax_info from user data
          const legalId = (userInfo as any)?.legal_id;
          const taxInfo = (userInfo as any)?.tax_info;
          
          // Map country codes to country names
          const countryCodeToName: { [key: string]: string } = {
            'KE': 'Kenya',
            'TZ': 'Tanzania', 
            'UG': 'Uganda',
            'RW': 'Rwanda',
            'US': 'United States',
            'CA': 'Canada',
            'GB': 'United Kingdom',
            'NG': 'Nigeria',
            'ZA': 'South Africa',
            'EG': 'Egypt',
            'IN': 'India',
            'AU': 'Australia',
            'DE': 'Germany',
            'FR': 'France'
          };
          
          // Map ID type codes to display names
          const idTypeToDisplayName: { [key: string]: string } = {
            'national_id': 'National ID',
            'passport': 'Passport', 
            'drivers_license': "Driver's License",
            'social_security_number': 'Social Security Number',
            'aadhaar_card': 'Aadhaar Card',
            'other_government_id': 'Other Government ID'
          };
          
          // Extract location data from profile
          const locationData = profileData.location;
          
          // Determine country from multiple sources (location > legal_id > default)
          let countryName = "Kenya"; // default
          if (locationData?.city === "Nairobi" || locationData?.county?.includes("Nairobi")) {
            countryName = "Kenya";
          } else if (legalId?.country && countryCodeToName[legalId.country]) {
            countryName = countryCodeToName[legalId.country];
          }
          
          // Split fullName into firstName and lastName
          const nameParts = fullName.trim().split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';

          // Update personal info
          setPersonalInfo({
            fullName,
            firstName,
            lastName,
            email: (userInfo as any).email || "",
            countryCode,
            phone: phoneDigits,
            alternativeCountryCode,
            alternativePhone: alternativePhoneDigits,
            homeAddress: locationData?.address || "",
            nationalId: "",
            country: countryName,
            idCountry: legalId?.country ? countryCodeToName[legalId.country] || "Kenya" : "Kenya", 
            idType: legalId?.id_type ? idTypeToDisplayName[legalId.id_type] || legalId.id_type : "",
            idNumber: legalId?.id || "",
            taxNumber: taxInfo?.tax_no || "",
            bio: (userInfo as any).bio || "",
            // Use _signedProfileImage if available, otherwise fall back to profileImage
            profileImage: (userInfo as any)._signedProfileImage || (userInfo as any).profileImage || (profileData as any).profileImage || "",
            // Load intro video URL from teacher profile
            introVideoUrl: (profileData as any).introVideoUrl || "",
          });
          
          // Update location info
          if (profileData.location) {
            setLocationInfo({
              address: profileData.location.address || "",
              city: profileData.location.city || "",
              county: profileData.location.county || "",
              postalCode: profileData.location.postalCode || "",
              coordinates: profileData.location.coordinates || { latitude: 0, longitude: 0 },
              availability: profileData.availability || {
                days: [],
                times: { morning: false, afternoon: false, evening: false }
              }
            });
          }
          
          // Check if education, experience, etc. are directly in the profile data
          let hasLoadedEducation = false;
          let hasLoadedExperience = false;
          let hasLoadedAcademicSubjects = false;
          let hasLoadedAfterSchoolSubjects = false;
          let hasLoadedStrategies = false;
          let hasLoadedMethodologies = false;
          let hasLoadedLanguages = false;
          let hasLoadedSkills = false;
          let hasLoadedCertifications = false;
          
          if (profileData.education && profileData.education.length > 0) {
            // Convert backend Education format to frontend EducationItem format
            const convertedEducation: EducationItem[] = (profileData.education as any[]).map((edu: any) => ({
              _id: edu._id || edu.id,
              institution: edu.institutionName || edu.institution,
              institutionName: edu.institutionName || edu.institution,
              degree: edu.degree,
              additionalDetails: edu.additionalDetails || '',
              startDate: edu.startDate,
              endDate: edu.endDate,
              isCurrentlyStudying: edu.isCurrentlyStudying || false,
              institutionType: edu.institutionType || 'university'
            }));
            setEducation(convertedEducation);
            hasLoadedEducation = true;
          }
          
          if (profileData.experience && profileData.experience.length > 0) {
            setExperience(profileData.experience as any[]);
            hasLoadedExperience = true;
          }
          
          if (profileData.strategies && profileData.strategies.length > 0) {
            setStrategies(profileData.strategies as any[]);
            hasLoadedStrategies = true;
          }

          if (profileData.methodologies && profileData.methodologies.length > 0) {
            setMethodologies(profileData.methodologies as any[]);
            hasLoadedMethodologies = true;
          }
          
          if (profileData.languages && profileData.languages.length > 0) {
            setLanguages(profileData.languages as any[]);
            hasLoadedLanguages = true;
          }
          
          if (profileData.skills && profileData.skills.length > 0) {
            setTechnicalSkills(profileData.skills as any[]);
            hasLoadedSkills = true;
          }
          
          if (profileData.subjects) {
            const academic = (profileData.subjects as any[]).filter((s: any) => s.isAcademic === true);
            const afterSchool = (profileData.subjects as any[]).filter((s: any) => s.isAcademic === false);
            
            if (academic.length > 0) {
              setAcademicSubjects(academic as any[]);
              hasLoadedAcademicSubjects = true;
            }
            
            if (afterSchool.length > 0) {
              setAfterSchoolSubjects(afterSchool as any[]);
              hasLoadedAfterSchoolSubjects = true;
            }
          }
          
          if (profileData.certifications && profileData.certifications.length > 0) {
            setCertifications((profileData.certifications as any[]).map((cert: any) => ({ 
              id: cert._id, 
              value: cert.name,
              details: cert.description || '' 
            })));
            hasLoadedCertifications = true;
          }
          
          // Only fetch data separately if not included in profile response
          const teacherId = user.teacherId;
          
          // Load education if not already loaded
          if (!hasLoadedEducation) {
            try {
              const { data: educationData } = await teacherService.getTeacherEducation(teacherId);
              if (educationData && educationData.length > 0) {
                // Convert backend Education format to frontend EducationItem format
                const convertedEducation: EducationItem[] = educationData.map((edu: any) => ({
                  _id: edu._id || edu.id,
                  institution: edu.institutionName || edu.institution,
                  institutionName: edu.institutionName || edu.institution,
                  degree: edu.degree,
                  additionalDetails: edu.additionalDetails || '',
                  startDate: edu.startDate,
                  endDate: edu.endDate,
                  isCurrentlyStudying: edu.isCurrentlyStudying || false,
                  institutionType: edu.institutionType || 'university'
                }));
                setEducation(convertedEducation);
              }
            } catch (error) {
              console.error("Error loading education data:", error);
            }
          }
          
          // Load experience if not already loaded
          if (!hasLoadedExperience) {
            try {
              const experienceRecords = await fetchExperienceRecords(teacherId);
              if (experienceRecords.length > 0) {
                setExperience(experienceRecords);
              }
            } catch (error) {
              console.error("Error loading experience data:", error);
            }
          }
          
          // Load academic subjects if not already loaded
          if (!hasLoadedAcademicSubjects) {
            try {
              const { data: academicSubjectsData } = await teacherService.getTeacherAcademicSubjects(teacherId);
              if (academicSubjectsData && academicSubjectsData.length > 0) {
                setAcademicSubjects(academicSubjectsData);
              }
            } catch (error) {
              console.error("Error loading academic subjects:", error);
            }
          }
          
          // Load after-school subjects if not already loaded
          if (!hasLoadedAfterSchoolSubjects) {
            try {
              const { data: afterSchoolSubjectsData } = await teacherService.getTeacherAfterSchoolSubjects(teacherId);
              if (afterSchoolSubjectsData && afterSchoolSubjectsData.length > 0) {
                setAfterSchoolSubjects(afterSchoolSubjectsData);
              }
            } catch (error) {
              console.error("Error loading after-school subjects:", error);
            }
          }
          
          // Load strategies if not already loaded
          if (!hasLoadedStrategies) {
            try {
              const { data: strategiesData } = await teacherService.getTeachingStrategies(teacherId);
              if (strategiesData && strategiesData.length > 0) {
                setStrategies(strategiesData);
              }
            } catch (error) {
              console.error("Error loading strategies:", error);
            }
          }
          
          // Load methodologies if not already loaded
          if (!hasLoadedMethodologies) {
            try {
              const { data: methodologiesData } = await teacherService.getTeachingMethology(teacherId);
              if (methodologiesData && methodologiesData.length > 0) {
                setMethodologies(methodologiesData);
              }
            } catch (error) {
              console.error("Error loading methodologies:", error);
            }
          }
          
          // Load languages if not already loaded
          if (!hasLoadedLanguages) {
            try {
              const { data: languagesData } = await teacherService.getLanguageExpertise(teacherId);
              if (languagesData && languagesData.length > 0) {
                setLanguages(languagesData);
              }
            } catch (error) {
              console.error("Error loading languages:", error);
            }
          }
          
          // Load technical skills if not already loaded
          if (!hasLoadedSkills) {
            try {
              const { data: skillsData } = await teacherService.getTechnicalSkills(teacherId);
              if (skillsData && skillsData.length > 0) {
                setTechnicalSkills(skillsData);
              }
            } catch (error) {
              console.error("Error loading technical skills:", error);
            }
          }
          
          // Load certifications if not already loaded
          if (!hasLoadedCertifications) {
            try {
              const { data: certificationsData } = await teacherService.getTeacherCertifications(teacherId);
              if (certificationsData && certificationsData.length > 0) {
                console.log("Setting certifications:", certificationsData);
                setCertifications(certificationsData);
              }
            } catch (error) {
              console.error("Error loading certifications:", error);
            }
          }
          
          // Check Zoom connection status
          try {
            // Use the generic connection status endpoint since we're checking current user
            const { data: zoomData } = await zoomService.getConnectionStatus();
            if (zoomData) {
              setPlatformSettings(prev => ({
                ...prev,
                isZoomConnected: zoomData.connected || false,
                zoomEmail: zoomData.account_email
              }));
            }
          } catch (error) {
            console.error("Error loading Zoom status:", error);
            // If there's an error, assume Zoom is not connected
            setPlatformSettings(prev => ({
              ...prev,
              isZoomConnected: false,
              zoomEmail: undefined
            }));
          }
          
          // Update verification state if we have certifications or documents
          const hasBackgroundCheck = !!profileData.backgroundCheckFile;
          const hasGovernmentId = !!profileData.governmentIdFile;
          
          if (hasBackgroundCheck || hasGovernmentId) {
            setVerification(prev => ({
              ...prev,
              backgroundCheck: hasBackgroundCheck,
              idVerification: hasGovernmentId
            }));
          }
          
          // Set loading to false after a short delay
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading teacher profile data:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile data",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    loadTeacherData();
  }, [user?.teacherId, toast]);
  
  // Complete profile function
  const completeProfile = async (): Promise<boolean> => {
    const teacherId = user?.teacherId;
    
    if (!teacherId) {
      toast({
        title: "Error",
        description: "You must be logged in to complete your profile",
        variant: "destructive"
      });
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update the profile completion status
      const { data, error } = await teacherService.updateProfile(teacherId, {
        isProfileComplete: true
      });
      
      if (error) {
        throw new Error(error.message || "Failed to mark profile as complete");
      }
      
      toast({
        title: "Success",
        description: "Your professional profile has been completed successfully!",
      });
      
      setIsSubmitting(false);
      return true;
    } catch (error) {
      console.error("Error marking profile as complete:", error);
      toast({
        title: "Error",
        description: "There was an error updating your profile status. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return false;
    }
  };
  
  // Context value
  const value: ProfileJourneyContextType = {
    // Navigation
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    steps: STEPS,
    stepsInfo,
    getStepIndex,
    isFirstStep,
    isLastStep,
    
    // Completion status
    completedSteps,
    stepProgress,
    overallProgress,
    
    // Form data
    personalInfo,
    locationInfo,
    education,
    experience,
    subjects: {
      academic: academicSubjects,
      afterSchool: afterSchoolSubjects
    },
    teachingStyle: {
      strategies,
      methodologies,
      languages,
      technicalSkills
    },
    certifications,
    verification,
    platformSettings,
    
    // Update functions
    updatePersonalInfo,
    updateLocationInfo,
    setEducation,
    saveEducation,
    setExperience,
    saveExperience,
    setAcademicSubjects,
    setAfterSchoolSubjects,
    saveSubjects,
    setStrategies,
    setMethodologies,
    setLanguages,
    saveLanguages,
    setTechnicalSkills,
    saveTechnicalSkills,
    setCertifications,
    saveCertifications,
    updateVerification,
    updatePlatformSettings,
    
    // Submit functions
    completeStep,
    isLoading,
    isSubmitting,
    completeProfile
  };
  
  return (
    <ProfileJourneyContext.Provider value={value}>
      {children}
    </ProfileJourneyContext.Provider>
  );
};

export const useProfileJourney = () => useContext(ProfileJourneyContext);