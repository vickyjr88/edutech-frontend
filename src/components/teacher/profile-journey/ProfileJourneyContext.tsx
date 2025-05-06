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
  | "location"
  | "education"
  | "experience"
  | "expertise"
  | "teaching-style"
  | "verification"
  | "platform";

// An array of all steps in order
const STEPS: StepType[] = [
  "personal",
  "location",
  "education",
  "experience",
  "expertise",
  "teaching-style",
  "verification",
  "platform"
];

// Define the step information
interface StepInfo {
  id: StepType;
  title: string;
  description: string;
}

// Define the steps information
const stepsInfo: Record<StepType, StepInfo> = {
  "personal": {
    id: "personal",
    title: "Personal Information",
    description: "Tell us about yourself"
  },
  "location": {
    id: "location",
    title: "Location & Availability",
    description: "Where you teach and when you're available"
  },
  "education": {
    id: "education",
    title: "Education Background",
    description: "Your academic qualifications"
  },
  "experience": {
    id: "experience",
    title: "Teaching Experience",
    description: "Your previous teaching roles"
  },
  "expertise": {
    id: "expertise",
    title: "Subject Expertise",
    description: "Subjects and skills you can teach"
  },
  "teaching-style": {
    id: "teaching-style",
    title: "Teaching Style",
    description: "Your methodologies and approaches"
  },
  "verification": {
    id: "verification",
    title: "Verification & Credentials",
    description: "Certifications and background checks"
  },
  "platform": {
    id: "platform",
    title: "Teaching Platform",
    description: "Set up your virtual classroom"
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
  
  // Form data
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    countryCode: string;
    phone: string;
    alternativeCountryCode: string;
    alternativePhone: string;
    bio: string;
    profileImage: string;
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
  setExperience: (items: ExperienceItem[]) => void;
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
    location: false,
    education: false,
    experience: false,
    expertise: false,
    "teaching-style": false,
    verification: false,
    platform: false
  },
  stepProgress: {
    personal: 0,
    location: 0,
    education: 0,
    experience: 0,
    expertise: 0,
    "teaching-style": 0,
    verification: 0,
    platform: 0
  },
  overallProgress: 0,
  
  // Form data
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+254", // Default to Kenya
    phone: "",
    alternativeCountryCode: "+254", // Default to Kenya
    alternativePhone: "",
    bio: "",
    profileImage: "",
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
  setExperience: () => {},
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
    location: false,
    education: false,
    experience: false,
    expertise: false,
    "teaching-style": false,
    verification: false,
    platform: false
  });
  
  const [stepProgress, setStepProgress] = useState<Record<StepType, number>>({
    personal: 0,
    location: 0,
    education: 0,
    experience: 0,
    expertise: 0,
    "teaching-style": 0,
    verification: 0,
    platform: 0
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
        
        // 1. User profile data
        const userData: any = {
          // Use fullName instead of firstName/lastName
          fullName: `${data.firstName} ${data.lastName}`.trim(),
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
          ...(data.email && { email: data.email })
        };
        
        // 2. Teacher profile data
        const teacherData: any = {
          // Note: We don't include firstName/lastName in teacherProfile
          // Include profile image in teacher profile (could be teacher-specific)
          ...(data.profileImage && { profileImage: data.profileImage })
        };
        
        // Call API to update user profile data
        const userResponse = await authService.updateUserProfile(user.id, userData);
        
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
      updateStepProgress("location");
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
      updateStepProgress("verification");
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
        if (data.introVideoUrl) {
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
      updateStepProgress("platform");
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
        hasFirstName: !!personalInfo.firstName,
        hasLastName: !!personalInfo.lastName,
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
          // Required fields
          const nameComplete = personalInfo.firstName && personalInfo.lastName ? 1 : 0;
          const emailComplete = personalInfo.email ? 1 : 0;
          const phoneComplete = personalInfo.phone ? 1 : 0;
          const profileImageComplete = personalInfo.profileImage ? 1 : 0; // Make profile image required
          
          // Optional fields (contribute to progress but not required for completion)
          const bioComplete = personalInfo.bio && personalInfo.bio.length >= 20 ? 1 : 0;
          
          // Required fields have higher weight (75% of total)
          const requiredWeight = 0.8;
          const optionalWeight = 0.2;
          
          const requiredProgress = ((nameComplete + emailComplete + phoneComplete + profileImageComplete) / 4) * requiredWeight * 100;
          const optionalProgress = (bioComplete) * optionalWeight * 100;
          
          return Math.min(100, requiredProgress + optionalProgress);
          
        case "location":
          // Required fields
          const addressComplete = locationInfo.address ? 1 : 0;
          const cityComplete = locationInfo.city ? 1 : 0;
          const countyComplete = locationInfo.county ? 1 : 0;
          const daysComplete = locationInfo.availability.days.length > 0 ? 1 : 0;
          
          // Calculate progress based on required fields
          const locationProgress = ((addressComplete + cityComplete + countyComplete + daysComplete) / 4) * 100;
          
          return locationProgress;
          
        case "education":
          return education.length > 0 ? 100 : 0;
          
        case "experience":
          return experience.length > 0 ? 100 : 0;
          
        case "expertise":
          // Progress is based on having entries in either academic or after-school subjects
          const academicProgress = academicSubjects.length > 0 ? 50 : 0;
          const afterSchoolProgress = afterSchoolSubjects.length > 0 ? 50 : 0;
          
          return academicProgress + afterSchoolProgress;
          
        case "teaching-style":
          // Calculate progress based on the number of populated teaching style components
          const totalTeachingComponents = 4; // strategies, methodologies, languages, skills
          const filledComponents = [
            strategies.length > 0,
            methodologies.length > 0,
            languages.length > 0,
            technicalSkills.length > 0
          ].filter(Boolean).length;
          
          return (filledComponents / totalTeachingComponents) * 100;
          
        case "verification":
          // Progress from different verification methods
          const certProgress = certifications.length > 0 ? 33.33 : 0;
          const backgroundCheckProgress = verification.backgroundCheck ? 33.33 : 0;
          const idVerificationProgress = verification.idVerification ? 33.33 : 0;
          
          // Any one complete method is enough for the step to be considered complete
          return Math.min(100, certProgress + backgroundCheckProgress + idVerificationProgress);
          
        case "platform":
          // Calculate progress based on platform connections
          const zoomProgress = platformSettings.isZoomConnected ? 50 : 0;
          const googleProgress = platformSettings.isGoogleConnected ? 50 : 0;
          
          return zoomProgress + googleProgress;
          
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
  
  // Recalculate all step progress whenever certifications or verification data changes
  useEffect(() => {
    // This was causing an infinite loop because updateStepProgress was updating
    // the step progress, which then triggered this effect again
    // We'll now only check the verification step specifically
    updateStepProgress("verification");
  }, [certifications, verification]);
  
  // Calculate progress for other steps when their data changes
  useEffect(() => {
    updateStepProgress("personal");
  }, [personalInfo]);
  
  useEffect(() => {
    updateStepProgress("location");
  }, [locationInfo]);
  
  useEffect(() => {
    updateStepProgress("education");
  }, [education]);
  
  useEffect(() => {
    updateStepProgress("experience");
  }, [experience]);
  
  useEffect(() => {
    updateStepProgress("expertise");
  }, [academicSubjects, afterSchoolSubjects]);
  
  useEffect(() => {
    updateStepProgress("teaching-style");
  }, [strategies, methodologies, languages, technicalSkills]);
  
  useEffect(() => {
    updateStepProgress("platform");
  }, [platformSettings]);
  
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

  // Calculate overall progress
  const overallProgress = Object.values(stepProgress).reduce((sum, progress) => sum + progress, 0) / STEPS.length;
  
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
          const userInfo = profileData.user || {};
          
          // Extract first and last name from fullName
          let firstName = "";
          let lastName = "";
          if (userInfo.fullName) {
            const nameParts = userInfo.fullName.split(' ');
            firstName = nameParts[0] || "";
            lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : "";
          }
          
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
          
          // Update personal info
          setPersonalInfo({
            firstName,
            lastName,
            email: userInfo.email || "",
            countryCode,
            phone: phoneDigits,
            alternativeCountryCode,
            alternativePhone: alternativePhoneDigits,
            bio: userInfo.bio || "",
            // Use _signedProfileImage if available, otherwise fall back to profileImage
            profileImage: userInfo._signedProfileImage || userInfo.profileImage || profileData.profileImage || "",
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
            setEducation(profileData.education);
            hasLoadedEducation = true;
          }
          
          if (profileData.experience && profileData.experience.length > 0) {
            setExperience(profileData.experience);
            hasLoadedExperience = true;
          }
          
          if (profileData.strategies && profileData.strategies.length > 0) {
            setStrategies(profileData.strategies);
            hasLoadedStrategies = true;
          }
          
          if (profileData.methodologies && profileData.methodologies.length > 0) {
            setMethodologies(profileData.methodologies);
            hasLoadedMethodologies = true;
          }
          
          if (profileData.languages && profileData.languages.length > 0) {
            setLanguages(profileData.languages);
            hasLoadedLanguages = true;
          }
          
          if (profileData.skills && profileData.skills.length > 0) {
            setTechnicalSkills(profileData.skills);
            hasLoadedSkills = true;
          }
          
          if (profileData.subjects) {
            const academic = profileData.subjects.filter(s => s.isAcademic === true);
            const afterSchool = profileData.subjects.filter(s => s.isAcademic === false);
            
            if (academic.length > 0) {
              setAcademicSubjects(academic);
              hasLoadedAcademicSubjects = true;
            }
            
            if (afterSchool.length > 0) {
              setAfterSchoolSubjects(afterSchool);
              hasLoadedAfterSchoolSubjects = true;
            }
          }
          
          if (profileData.certifications && profileData.certifications.length > 0) {
            setCertifications(profileData.certifications.map(cert => ({ 
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
                setEducation(educationData);
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
              const { data: certificationsData } = await teacherService.getCertifications(teacherId);
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
          
          // Rules for each step to determine if it's complete
          const stepCompletionRules = {
            personal: (profile: any) => {
              const user = profile.user || {};
              const hasFullName = !!user.fullName && user.fullName.trim().split(' ').length >= 2;
              const hasEmail = !!user.email;
              const hasPhone = !!user.phoneNumber;
              const hasBio = !!user.bio && user.bio.length >= 20; // Ensure bio has some meaningful content
              // Check for profile image with more debugging
              const profileImageSources = [
                profile.profileImage,
                user.profileImage,
                user._signedProfileImage,
                user.signedProfileImage
              ];
              const profileImageUrl = profileImageSources.find(src => !!src);
              const hasProfileImage = !!profileImageUrl;
              
              console.log("Personal step validation - Raw profile data:", { 
                profileUserObject: user,
                profileObject: profile,
                allProfileImageOptions: profileImageSources,
                chosenProfileImage: profileImageUrl
              });
              
              console.log("Personal step validation - Requirements check:", { 
                hasFullName, 
                hasEmail, 
                hasPhone, 
                hasBio,
                hasProfileImage
              });
              
              console.log("Will the personal step be marked complete?", 
                hasFullName && hasEmail && hasPhone && hasProfileImage
              );
              
              // If we have full name, email, phone and ANY profile image option
              return hasFullName && hasEmail && hasPhone && hasProfileImage;
            },
            
            location: (profile: any) => {
              const location = profile.location || {};
              const availability = profile.availability || {};
              
              const hasAddress = !!location.address;
              const hasCity = !!location.city;
              const hasAvailabilityDays = Array.isArray(availability.days) && availability.days.length > 0;
              
              console.log("Location step validation:", { 
                hasAddress, 
                hasCity, 
                hasAvailabilityDays 
              });
              
              return hasAddress && hasCity && hasAvailabilityDays;
            },
            
            education: (profile: any, educationItems: EducationItem[]) => {
              const hasEducation = educationItems.length > 0 || profile.education.length > 0;
              
              console.log("Education step validation:", { 
                hasEducation, 
                count: educationItems.length 
              });
              
              return hasEducation;
            },
            
            experience: (profile: any, experienceItems: ExperienceItem[]) => {
              const hasExperience = experienceItems.length > 0 || profile.experience.length > 0;
              
              // console.log("Experience step validation:", {
              //   hasExperience,
              //   count: experienceItems.length
              // },profile.experience);
              
              return hasExperience;
            },
            
            expertise: (profile: any, academicSubjects: AcademicSubjectItem[], afterSchoolSubjects: AfterSchoolSubjectItem[]) => {
              const hasAcademicSubjects = academicSubjects.length > 0 || profile.subjects.filter(s => s.isAcademic === true).length > 0;
              const hasAfterSchoolSubjects = afterSchoolSubjects.length > 0 || profile.subjects.filter(s => s.isAcademic === false).length > 0;
              
              // console.log("Expertise step validation:", {
              //   hasAcademicSubjects,
              //   academicCount: academicSubjects.length,
              //   hasAfterSchoolSubjects,
              //   afterSchoolCount: afterSchoolSubjects.length
              // });
              
              // Must have at least one category of subjects
              return hasAcademicSubjects || hasAfterSchoolSubjects;
            },
            
            "teaching-style": (
              profile: any, 
              strategies: StrategyItem[], 
              methodologies: MethodologyItem[], 
              languages: LanguageItem[], 
              technicalSkills: TechnicalSkillItem[]
            ) => {
              const hasStrategies = strategies.length > 0 || profile.strategies.length > 0;
              const hasMethodologies = methodologies.length > 0 || profile.methodologies.length > 0;
              const hasLanguages = languages.length > 0 || profile.languages.length > 0;
              const hasSkills = technicalSkills.length > 0 || profile.skills.length > 0;
              
              console.log("Teaching style step validation:", { 
                hasStrategies, 
                hasMethodologies, 
                hasLanguages, 
                hasSkills 
              });
              
              // Need at least one teaching style component
              return hasStrategies || hasMethodologies || hasLanguages || hasSkills;
            },
            
            verification: (profile: any, certifications: any[]) => {
              const hasBackgroundCheck = !!profile.backgroundCheckFile;
              const hasGovernmentId = !!profile.governmentIdFile;
              const hasCertifications = certifications.length > 0;
              
              console.log("Verification step validation:", { 
                hasBackgroundCheck, 
                hasGovernmentId, 
                hasCertifications,
                certCount: certifications.length 
              });
              
              // Need at least one form of verification
              return hasBackgroundCheck || hasGovernmentId || hasCertifications;
            },
            
            platform: (profile: any) => {
              const hasIntroVideo = !!profile.introVideoUrl;
              const isZoomConnected = !!profile.isZoomConnected;
              
              console.log("Platform step validation:", { 
                hasIntroVideo, 
                isZoomConnected 
              });
              
              // Either intro video or Zoom connection is required
              return hasIntroVideo || isZoomConnected;
            }
          };
          
          // Create a new completedSteps object based on data
          const newCompletedSteps = { ...completedSteps };
          const newStepProgress = { ...stepProgress };
          
          // Apply step completion rules
          console.log("Applying step completion rules to profile data");
          
          // Personal step
          if (stepCompletionRules.personal(profileData)) {
            newCompletedSteps.personal = true;
            newStepProgress.personal = 100;
            console.log("Personal step marked as complete");
          }
          
          // Location step
          if (stepCompletionRules.location(profileData)) {
            newCompletedSteps.location = true;
            newStepProgress.location = 100;
            console.log("Location step marked as complete");
          }
          
          // Education step
          if (stepCompletionRules.education(profileData, education)) {
            newCompletedSteps.education = true;
            newStepProgress.education = 100;
            console.log("Education step marked as complete");
          }
          
          // Experience step
          if (stepCompletionRules.experience(profileData, experience)) {
            newCompletedSteps.experience = true;
            newStepProgress.experience = 100;
            console.log("Experience step marked as complete");
          }
          
          // Expertise step
          if (stepCompletionRules.expertise(profileData, academicSubjects, afterSchoolSubjects)) {
            newCompletedSteps.expertise = true;
            newStepProgress.expertise = 100;
            console.log("Expertise step marked as complete");
          }
          
          // Teaching style step
          if (stepCompletionRules["teaching-style"](profileData, strategies, methodologies, languages, technicalSkills)) {
            newCompletedSteps["teaching-style"] = true;
            newStepProgress["teaching-style"] = 100;
            console.log("Teaching style step marked as complete");
          }
          
          // Verification step
          if (stepCompletionRules.verification(profileData, certifications)) {
            // Update verification state
            const hasBackgroundCheck = !!profileData.backgroundCheckFile;
            const hasGovernmentId = !!profileData.governmentIdFile;
            
            // Update verification state with document URLs if they exist
            if (hasBackgroundCheck || hasGovernmentId) {
              setVerification(prev => ({
                ...prev,
                backgroundCheck: hasBackgroundCheck,
                idVerification: hasGovernmentId
              }));
            }
            
            // Mark step as complete
            newCompletedSteps.verification = true;
            newStepProgress.verification = 100;
            console.log("Verification step marked as complete");
          }
          
          // Store document URLs for CertificationsStep component to access
          const backgroundCheckUrl = profileData.backgroundCheckFile || null;
          const governmentIdUrl = profileData.governmentIdFile || null;
          console.log("Document URLs from profile:", { backgroundCheckUrl, governmentIdUrl });
          
          // Platform step
          if (stepCompletionRules.platform(profileData)) {
            newCompletedSteps.platform = true;
            newStepProgress.platform = 100;
            console.log("Platform step marked as complete");
          }
          
          console.log("Setting completedSteps:", newCompletedSteps);
          
          // Set the state once with the new values
          setCompletedSteps(newCompletedSteps);
          setStepProgress(newStepProgress);
          
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
    setExperience,
    setAcademicSubjects,
    setAfterSchoolSubjects,
    setStrategies,
    setMethodologies,
    setLanguages,
    setTechnicalSkills,
    setCertifications,
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