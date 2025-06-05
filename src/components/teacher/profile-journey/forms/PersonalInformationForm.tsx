import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProfileJourney } from '../ProfileJourneyContext';
import { Camera, Phone, MapPin, User, Video, FileText, Upload, X, Shield, FileCheck, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CVUploadNudge } from './CVUploadNudge';
import { teacherService } from '@/integrations/api/services/teacher.service';
import { authService } from '@/integrations/api/services/auth.service';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import GooglePlacesAutocomplete from '@/components/teacher/GooglePlacesAutocomplete';

const countryOptions = [
  { code: '+1', name: 'United States/Canada' },
  { code: '+44', name: 'United Kingdom' },
  { code: '+254', name: 'Kenya' },
  { code: '+255', name: 'Tanzania' },
  { code: '+256', name: 'Uganda' },
  { code: '+250', name: 'Rwanda' },
{ code: '+234', name: 'Nigeria' },
  { code: '+27', name: 'South Africa' },
{ code: '+20', name: 'Egypt' },
  { code: '+91', name: 'India' },
];

const countries = [
  'Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'United States', 'Canada', 'United Kingdom', 
  'Nigeria', 'South Africa', 'Egypt', 'India', 'Australia', 'Germany', 'France', 'Other'
];

const countryCodeMap: { [key: string]: string } = {
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
  'France': 'FR',
  'Other': 'XX'
};

const idTypes = [
  'National ID',
  'Passport',
  'Driver\'s License',
  'Social Security Number',
  'Aadhaar Card',
  'Other Government ID'
];

interface PersonalInformationFormProps {
  onComplete: () => void;
}

export const PersonalInformationForm = ({ onComplete }: PersonalInformationFormProps) => {
  const { personalInfo, updatePersonalInfo, verification, completeStep } = useProfileJourney();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(personalInfo.profileImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCVNudge, setShowCVNudge] = useState(true);
  const [isCVProcessing, setIsCVProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showManualAddress, setShowManualAddress] = useState(false);
  const [isUploadingIdDocument, setIsUploadingIdDocument] = useState(false);
  const [isUploadingBackgroundCheck, setIsUploadingBackgroundCheck] = useState(false);
  const [uploadedIdDocument, setUploadedIdDocument] = useState<string | null>(null);
  const [uploadedBackgroundCheck, setUploadedBackgroundCheck] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idDocumentInputRef = useRef<HTMLInputElement>(null);
  const backgroundCheckInputRef = useRef<HTMLInputElement>(null);

  // Local form state to prevent auto-save on every field change
  const [localFormData, setLocalFormData] = useState(personalInfo);

  // Check if teacher already has a CV file and hide nudge accordingly
  useEffect(() => {
    const checkExistingCV = async () => {
      try {
        // Check teacher profile first
        const teacherProfile = await teacherService.getCurrentProfile();
        if (teacherProfile.data) {
          // Check for various possible CV file field names in teacher profile
          const hasCVFile = teacherProfile.data.cvFile || 
                           teacherProfile.data.resumeFile || 
                           teacherProfile.data.cv_file || 
                           teacherProfile.data.resume_file ||
                           teacherProfile.data.documentFile ||
                           teacherProfile.data.cvUrl ||
                           teacherProfile.data.resumeUrl;
          
          if (hasCVFile) {
            setShowCVNudge(false);
            return;
          }
        }

        // Also check user profile for CV information
        if (user) {
          const hasCVInUser = user.cvFile || 
                             user.resumeFile || 
                             user.cv_file || 
                             user.resume_file ||
                             user.documentFile ||
                             user.cvUrl ||
                             user.resumeUrl;
          
          if (hasCVInUser) {
            setShowCVNudge(false);
          }
        }
      } catch (error) {
        // If profile doesn't exist yet, keep showing the nudge
        console.log('No teacher profile yet, showing CV nudge');
      }
    };
    
    checkExistingCV();
  }, [user]);

  // CV upload handler
  const handleCVUpload = async (file: File) => {
    setIsCVProcessing(true);
    try {
      console.log('CV uploaded:', file.name);
      
      // Import the CV service
      const { cvService } = await import('@/integrations/api/services/cv.service');
      
      // Upload and process CV with actual API
      const result = await cvService.uploadCV(file);
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to process CV');
      }
      
      if (result.data?.data?.extractedData) {
        const extractedData = result.data.data.extractedData;
        
        // Extract personal information from CV
        const cvPersonalInfo = extractedData.personalInfo;
        
        if (cvPersonalInfo) {
          // Only update empty fields to avoid overwriting user input
          const updates: Partial<typeof localFormData> = {};
          
          if (!localFormData.fullName && cvPersonalInfo.fullName) {
            updates.fullName = cvPersonalInfo.fullName;
          }
          
          if (!localFormData.email && cvPersonalInfo.email) {
            updates.email = cvPersonalInfo.email;
          }
          
          if (!localFormData.phone && cvPersonalInfo.phoneNumber) {
            updates.phone = cvPersonalInfo.phoneNumber;
          }
          
          if (!localFormData.bio && cvPersonalInfo.bio) {
            updates.bio = cvPersonalInfo.bio;
          }
          
          if (!localFormData.homeAddress && cvPersonalInfo.location?.address) {
            updates.homeAddress = cvPersonalInfo.location.address;
          }
          
          if (!localFormData.country && cvPersonalInfo.location?.city === "Nairobi") {
            updates.country = "Kenya";
          }
          
          // Apply updates if any
          if (Object.keys(updates).length > 0) {
            setLocalFormData(prev => ({ ...prev, ...updates }));
            
            toast({
              title: "CV processed successfully",
              description: `Auto-filled ${Object.keys(updates).length} fields from your CV`,
            });
          }
        }
        
        setShowCVNudge(false);
      }
    } catch (error) {
      console.error('Error processing CV:', error);
      toast({
        title: "CV processing failed",
        description: error instanceof Error ? error.message : "Failed to process CV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCVProcessing(false);
    }
  };

  const handleDismissCVNudge = () => {
    setShowCVNudge(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields using local form data
      if (!localFormData.fullName || !localFormData.email || 
          !localFormData.phone || !localFormData.homeAddress || !localFormData.idCountry ||
          !localFormData.idType || !localFormData.idNumber || !localFormData.country || !localFormData.bio) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields before continuing",
          variant: "destructive",
        });
        return;
      }

      // Prepare user data for API call using local form data
      const userData = {
        fullName: localFormData.fullName,
        email: localFormData.email,
        bio: localFormData.bio,
        phoneNumber: `${localFormData.countryCode}${localFormData.phone}`,
        legal_id: {
          id_type: localFormData.idType.toLowerCase().replace(/\s+/g, '_').replace("'", ""),
          id: localFormData.idNumber,
          country: countryCodeMap[localFormData.idCountry] || 'XX'
        },
        ...(localFormData.taxNumber && {
          tax_info: {
            tax_no: localFormData.taxNumber,
            country: countryCodeMap[localFormData.country] || 'XX'
          }
        })
      };

      // Update the context with final form data
      updatePersonalInfo(localFormData);

      // Update user profile via API
      const response = await authService.updateUserProfile(userData);
      
      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({
        title: "Success",
        description: "Personal information updated successfully",
      });

      // Mark step as complete
      completeStep('personal');
      onComplete();
    } catch (error) {
      console.error('Error updating personal information:', error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update personal information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Update local form state only - no API calls until submit
    setLocalFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle Google Places selection
  const handlePlaceSelect = (place: {
    address: string;
    apartment: string;
    houseNumber: string;
    city: string;
    county: string;
    postalCode: string;
    country: string;
    latitude: number;
    longitude: number;
    placeId: string;
  }) => {
    setLocalFormData(prev => ({ 
      ...prev, 
      homeAddress: place.address,
      country: place.country || prev.country,
      // Store additional location details for API
      locationCity: place.city,
      locationCounty: place.county,
      locationPostalCode: place.postalCode,
      locationCoordinates: {
        latitude: place.latitude,
        longitude: place.longitude
      }
    }));
    
    // Show success feedback
    toast({
      title: "Address selected",
      description: `Selected: ${place.address}`,
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, or GIF)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Convert to base64 for API upload
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const result = e.target?.result as string;
          const base64Data = result.split(',')[1]; // Remove data URI prefix
          
          // Get teacher profile ID
          let teacherProfile: any;
          let teacherId: string;

          // First, try to get teacher ID from user object
          if (user?.teacherId) {
            teacherId = user.teacherId;
            console.log('Using teacher ID from user object:', teacherId);
          } else {
            // If no teacherId in user, try to get/create teacher profile
            try {
              teacherProfile = await teacherService.getCurrentProfile();
              if (teacherProfile?.data) {
                teacherId = teacherProfile.data.id || teacherProfile.data._id;
              }
            } catch (error) {
              console.log('Teacher profile not found, attempting to create one...');
              // If profile doesn't exist, create one first
              if (user) {
                try {
                  teacherProfile = await teacherService.createProfile({
                    userId: user.id,
                    user: {
                      _id: user.id,
                      fullName: personalInfo.fullName || user.fullName || '',
                      email: personalInfo.email || user.email || '',
                      legal_id: {
                        id_type: '',
                        id: '',
                        country: ''
                      }
                    }
                  });
                  
                  if (teacherProfile?.data) {
                    teacherId = teacherProfile.data.id || teacherProfile.data._id;
                  }
                } catch (createError) {
                  console.error('Failed to create teacher profile:', createError);
                }
              }
            }
          }
          
          // Final fallback: use user ID if we still don't have teacherId
          if (!teacherId && user?.id) {
            console.log('Using user ID as fallback for teacher ID:', user.id);
            teacherId = user.id;
          }
          
          if (!teacherId) {
            console.error('Teacher profile data:', teacherProfile?.data);
            console.error('User data:', user);
            throw new Error('No valid teacher ID found. Please ensure you are logged in with a teacher account.');
          }

          console.log('Using teacher ID for photo upload:', teacherId);

          // Upload to API
          const uploadResponse = await teacherService.uploadProfilePhoto(
            teacherId,
            base64Data,
            file.type
          );

          if (uploadResponse.data) {
            // Use the signed URL for immediate display, fallback to fileUrl
            const imageUrl = uploadResponse.data.signedUrl || uploadResponse.data.fileUrl;
            setUploadedImage(imageUrl);
            setLocalFormData(prev => ({ ...prev, profileImage: imageUrl }));
            
            toast({
              title: "Success",
              description: "Profile photo uploaded successfully",
            });
            
            console.log('Profile photo uploaded:', {
              fileUrl: uploadResponse.data.fileUrl,
              signedUrl: uploadResponse.data.signedUrl
            });
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          toast({
            title: "Upload failed",
            description: "Failed to upload image. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setLocalFormData(prev => ({ ...prev, profileImage: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Drag and drop handlers for profile photo
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      // Create a synthetic event to reuse existing upload logic
      const syntheticEvent = {
        target: { files: [file] },
        currentTarget: { files: [file] },
        preventDefault: () => {},
        stopPropagation: () => {},
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      void handleImageUpload(syntheticEvent);
    }
  };

  // Handle ID document upload
  const handleIdDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type (PDF, JPG, PNG)
    if (!file.type.match(/^(application\/pdf|image\/(jpeg|jpg|png))$/)) {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF, JPG, or PNG file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size should be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingIdDocument(true);

    try {
      // Get teacher ID
      let teacherId: string;
      if (user?.teacherId) {
        teacherId = user.teacherId;
      } else if (user?.id) {
        teacherId = user.id; // Fallback to user ID
      } else {
        throw new Error('No teacher ID found. Please ensure you are logged in.');
      }

      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const result = e.target?.result as string;
          const base64Data = result; // Keep the full data URI format

          // Upload to API
          const uploadResponse = await teacherService.uploadDocument(
            teacherId,
            base64Data,
            'government_id'
          );

          if (uploadResponse.data) {
            const fileName = file.name;
            setUploadedIdDocument(fileName);
            
            toast({
              title: "Success",
              description: "ID document uploaded successfully. Admin will review and verify.",
            });
            
            console.log('ID document uploaded:', {
              fileUrl: uploadResponse.data.fileUrl,
              signedUrl: uploadResponse.data.signedUrl
            });
          }
        } catch (error) {
          console.error('Error uploading ID document:', error);
          toast({
            title: "Upload failed",
            description: "Failed to upload ID document. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsUploadingIdDocument(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing ID document:', error);
      toast({
        title: "Error",
        description: "Failed to process ID document. Please try again.",
        variant: "destructive",
      });
      setIsUploadingIdDocument(false);
    }
  };

  // Handle background check upload
  const handleBackgroundCheckUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type (PDF, JPG, PNG)
    if (!file.type.match(/^(application\/pdf|image\/(jpeg|jpg|png))$/)) {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF, JPG, or PNG file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size should be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingBackgroundCheck(true);

    try {
      // Get teacher ID
      let teacherId: string;
      if (user?.teacherId) {
        teacherId = user.teacherId;
      } else if (user?.id) {
        teacherId = user.id; // Fallback to user ID
      } else {
        throw new Error('No teacher ID found. Please ensure you are logged in.');
      }

      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const result = e.target?.result as string;
          const base64Data = result; // Keep the full data URI format

          // Upload to API
          const uploadResponse = await teacherService.uploadDocument(
            teacherId,
            base64Data,
            'background_check'
          );

          if (uploadResponse.data) {
            const fileName = file.name;
            setUploadedBackgroundCheck(fileName);
            
            toast({
              title: "Success",
              description: "Background check uploaded successfully. Admin will review and verify.",
            });
            
            console.log('Background check uploaded:', {
              fileUrl: uploadResponse.data.fileUrl,
              signedUrl: uploadResponse.data.signedUrl
            });
          }
        } catch (error) {
          console.error('Error uploading background check:', error);
          toast({
            title: "Upload failed",
            description: "Failed to upload background check. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsUploadingBackgroundCheck(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing background check:', error);
      toast({
        title: "Error",
        description: "Failed to process background check. Please try again.",
        variant: "destructive",
      });
      setIsUploadingBackgroundCheck(false);
    }
  };

  const isFormValid = localFormData.fullName && 
                     localFormData.email && localFormData.phone && 
                     localFormData.homeAddress && localFormData.idCountry &&
                     localFormData.idType && localFormData.idNumber &&
                     localFormData.country && localFormData.bio;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h3>
          <p className="text-gray-600">Tell us about yourself and your contact details</p>
        </div>

        {/* CV Upload Nudge or Processing Banner */}
        {isCVProcessing ? (
          <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 rounded-3xl border-2 border-blue-200 shadow-lg">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin bg-white"></div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">🔄 Processing Your CV</h4>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                Our AI is analyzing your CV and extracting information to auto-fill your profile. This may take a few moments...
              </p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-2 w-48 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  Extracting personal info
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  Reading experience
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  Parsing education
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-4 font-medium">Please wait while we process your document...</p>
            </div>
          </div>
        ) : showCVNudge && (
          <CVUploadNudge 
            onCVUpload={handleCVUpload}
            onDismiss={handleDismissCVNudge}
            onUploadStart={() => setIsCVProcessing(true)}
            onUploadEnd={() => setIsCVProcessing(false)}
          />
        )}

        {/* Basic Information */}
        <div className="bg-gradient-to-br from-[#acb4e4] to-[#efebf0] p-6 rounded-3xl border-2 border-[#5c64d4]/20">
          <div className="flex items-center gap-3 mb-4">
            <User className="h-6 w-6 text-[#5c64d4]" />
            <h4 className="text-lg font-semibold text-gray-900">Basic Information</h4>
          </div>
          
          <div className="space-y-2 mb-4">
            <Label htmlFor="fullName" className="text-sm font-medium">Full Name *</Label>
            <Input
              id="fullName"
              value={localFormData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="John Doe"
              className="rounded-xl border-[#5c64d4]/30 focus:border-[#5c64d4]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={localFormData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="john.doe@example.com"
              className="rounded-xl border-[#5c64d4]/30 focus:border-[#5c64d4]"
              required
            />
          </div>

          {/* Legal ID Information */}
          <div className="mt-6 pt-4 border-t border-[#acb4e4]/30">
            <h5 className="text-sm font-semibold text-gray-900 mb-4">Legal Identification</h5>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="idCountry" className="text-sm font-medium">ID Country *</Label>
                <Select
                  value={localFormData.idCountry}
                  onValueChange={(value) => handleInputChange('idCountry', value)}
                >
                  <SelectTrigger className="rounded-xl border-[#5c64d4]/30">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idType" className="text-sm font-medium">ID Type *</Label>
                <Select
                  value={localFormData.idType}
                  onValueChange={(value) => handleInputChange('idType', value)}
                >
                  <SelectTrigger className="rounded-xl border-[#5c64d4]/30">
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    {idTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idNumber" className="text-sm font-medium">ID Number *</Label>
                <div className="flex gap-2">
                  <Input
                    id="idNumber"
                    value={localFormData.idNumber}
                    onChange={(e) => handleInputChange('idNumber', e.target.value)}
                    placeholder="Enter ID number"
                    className="rounded-xl border-[#5c64d4]/30 focus:border-[#5c64d4]"
                    required
                  />
                  <input
                    ref={idDocumentInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleIdDocumentUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => idDocumentInputRef.current?.click()}
                    disabled={isUploadingIdDocument}
                    className={cn(
                      "whitespace-nowrap",
                      verification.idVerification 
                        ? "border-green-300 text-green-700 hover:bg-green-50" 
                        : "border-[#5c64d4]/30 text-[#5c64d4] hover:bg-[#5c64d4]/10"
                    )}
                  >
                    {isUploadingIdDocument ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#5c64d4] border-t-transparent rounded-full animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : verification.idVerification ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        ID Uploaded
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadedIdDocument ? 'Change ID' : 'Upload ID'}
                      </>
                    )}
                  </Button>
                </div>
                {(uploadedIdDocument || verification.idVerification) && (
                  <div className={cn(
                    "flex flex-col gap-2 text-sm mt-2",
                    verification.idVerification ? "text-green-600" : "text-blue-600"
                  )}>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{uploadedIdDocument || "Government ID Document"}</span>
                    </div>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full self-start",
                      verification.idVerification 
                        ? "bg-green-100 text-green-700" 
                        : "bg-blue-100 text-blue-700"
                    )}>
                      {verification.idVerification ? "Uploaded" : "Pending Review"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Identity Verification */}
          <div className="mt-6 pt-4 border-t border-[#acb4e4]/30">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-5 w-5 text-[#5c64d4]" />
              <h5 className="text-sm font-semibold text-gray-900">Identity Verification (Optional)</h5>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-[#5c64d4]/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCheck className="h-5 w-5 text-blue-600" />
                    <div>
                      <Label className="font-medium text-gray-900">Background Check Document</Label>
                      <p className="text-sm text-gray-600">Upload your background check certificate</p>
                    </div>
                  </div>
                  <div>
                    <input
                      ref={backgroundCheckInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleBackgroundCheckUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => backgroundCheckInputRef.current?.click()}
                      disabled={isUploadingBackgroundCheck}
                      className={cn(
                        verification.backgroundCheck 
                          ? "border-green-300 text-green-700 hover:bg-green-50" 
                          : "border-blue-200 text-blue-600 hover:bg-blue-50"
                      )}
                    >
                      {isUploadingBackgroundCheck ? (
                        <>
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                          Uploading...
                        </>
                      ) : verification.backgroundCheck ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Document Uploaded
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          {uploadedBackgroundCheck ? 'Change' : 'Upload'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                {(uploadedBackgroundCheck || verification.backgroundCheck) && (
                  <div className={cn(
                    "flex items-center gap-2 text-sm mt-2",
                    verification.backgroundCheck ? "text-green-600" : "text-blue-600"
                  )}>
                    <CheckCircle className="w-4 h-4" />
                    <span>{uploadedBackgroundCheck || "Background Check Document"}</span>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      verification.backgroundCheck 
                        ? "bg-green-100 text-green-700" 
                        : "bg-blue-100 text-blue-700"
                    )}>
                      {verification.backgroundCheck ? "Uploaded" : "Pending Review"}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-xs text-blue-700">
                  <strong>Note:</strong> Verification documents help build trust with students and parents. After upload, our admin team will review and verify your documents. This process typically takes 1-2 business days.
                </p>
              </div>
            </div>
          </div>

          {/* Tax Information */}
          <div className="mt-6 pt-4 border-t border-[#acb4e4]/30">
            <h5 className="text-sm font-semibold text-gray-900 mb-4">Tax Information (Optional)</h5>
            
            <div className="space-y-2">
              <Label htmlFor="taxNumber" className="text-sm font-medium">Tax Number</Label>
              <Input
                id="taxNumber"
                value={localFormData.taxNumber}
                onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                placeholder="A123456789B"
                className="rounded-xl border-[#5c64d4]/30 focus:border-[#5c64d4]"
              />
              <p className="text-xs text-gray-500">
                Optional: Your tax identification number for compliance purposes
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-br from-[#efebf0] to-[#acb4e4]/30 p-6 rounded-3xl border-2 border-[#acb4e4]">
          <div className="flex items-center gap-3 mb-4">
            <Phone className="h-6 w-6 text-[#5c64d4]" />
            <h4 className="text-lg font-semibold text-gray-900">Contact Information</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="countryCode" className="text-sm font-medium">Country Code *</Label>
              <Select
                value={localFormData.countryCode}
                onValueChange={(value) => handleInputChange('countryCode', value)}
              >
                <SelectTrigger className="rounded-xl border-[#acb4e4]">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countryOptions.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.code} - {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
              <Input
                id="phone"
                value={localFormData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="701234567"
                className="rounded-xl border-[#acb4e4] focus:border-[#5c64d4]"
                required
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-gradient-to-br from-purple-50 to-[#acb4e4] p-6 rounded-3xl border-2 border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-6 w-6 text-purple-600" />
            <h4 className="text-lg font-semibold text-gray-900">Address Information</h4>
          </div>

          <div className="space-y-4">
            {!showManualAddress ? (
              /* Google Places Autocomplete */
              <div className="space-y-2">
                <Label className="text-sm font-medium">Home Address *</Label>
                <GooglePlacesAutocomplete
                  onPlaceSelect={handlePlaceSelect}
                  placeholder="Search for your address, building, or nearby landmark..."
                  initialValue={localFormData.homeAddress}
                  className="[&>div>input]:rounded-xl [&>div>input]:border-purple-200 [&>div>input]:focus:border-purple-400"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-purple-600">
                    Search for addresses, specific buildings, or landmarks using Google Places
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowManualAddress(true)}
                    className="text-xs text-purple-600 hover:text-purple-700 h-auto p-1"
                  >
                    Enter manually instead
                  </Button>
                </div>
              </div>
            ) : (
              /* Manual Address Input */
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="homeAddress" className="text-sm font-medium">Home Address *</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowManualAddress(false)}
                    className="text-xs text-purple-600 hover:text-purple-700 h-auto p-1"
                  >
                    Use Google Places instead
                  </Button>
                </div>
                <Input
                  id="homeAddress"
                  value={localFormData.homeAddress}
                  onChange={(e) => handleInputChange('homeAddress', e.target.value)}
                  placeholder="123 Main Street, City, State"
                  className="rounded-xl border-purple-200 focus:border-purple-400"
                  required
                />
                <p className="text-xs text-purple-600">
                  Enter your complete address manually
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm font-medium">Country of Residence *</Label>
              <Select
                value={localFormData.country}
                onValueChange={(value) => handleInputChange('country', value)}
              >
                <SelectTrigger className="rounded-xl border-purple-200">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!showManualAddress && (
                <p className="text-xs text-purple-600">
                  This will be auto-filled when you select an address above
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Media */}
        <div className="bg-gradient-to-br from-orange-50 to-[#fc9323]/10 p-6 rounded-3xl border-2 border-orange-200">
          <div className="flex items-center gap-3 mb-4">
            <Camera className="h-6 w-6 text-[#fc9323]" />
            <h4 className="text-lg font-semibold text-gray-900">Profile Media</h4>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Profile Photo</Label>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {/* Upload area */}
              <div 
                className="flex flex-col items-center gap-4"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {uploadedImage ? (
                  /* Image preview */
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#fc9323] shadow-lg">
                      <img
                        src={uploadedImage}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  /* Upload prompt */
                  <div
                    onClick={triggerFileInput}
                    className={cn(
                      "w-32 h-32 border-2 border-dashed rounded-full flex flex-col items-center justify-center cursor-pointer transition-colors",
                      isDragOver 
                        ? "border-[#fc9323] bg-orange-100 scale-105" 
                        : "border-orange-300 hover:border-orange-400 hover:bg-orange-50"
                    )}
                  >
                    <Camera className={cn(
                      "w-8 h-8 mb-2 transition-colors",
                      isDragOver ? "text-[#fc9323]" : "text-orange-400"
                    )} />
                    <span className={cn(
                      "text-xs text-center px-2 transition-colors",
                      isDragOver ? "text-[#fc9323]" : "text-orange-600"
                    )}>
                      {isDragOver ? "Drop image here" : "Click to upload"}
                    </span>
                  </div>
                )}
                
                {/* Upload button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={triggerFileInput}
                  disabled={isUploading}
                  className="rounded-xl border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mr-2" />
                      Uploading to server...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      {uploadedImage ? 'Change Photo' : 'Upload Photo'}
                    </>
                  )}
                </Button>
              </div>
              
              <p className="text-xs text-orange-600 text-center">
                Supported formats: JPG, PNG, GIF. Max size: 5MB<br />
                Drag and drop or click to upload
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="introVideoUrl" className="text-sm font-medium">Introduction Video URL</Label>
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-blue-500" />
                <Input
                  id="introVideoUrl"
                  value={localFormData.introVideoUrl}
                  onChange={(e) => handleInputChange('introVideoUrl', e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="rounded-xl border-orange-200 focus:border-orange-400"
                />
              </div>
              <p className="text-xs text-orange-600">Optional: Add a short video introduction to help students get to know you</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-gradient-to-br from-[#efebf0] to-gray-50 p-6 rounded-3xl border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-6 w-6 text-[#5c64d4]" />
            <h4 className="text-lg font-semibold text-gray-900">About You</h4>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium">Bio *</Label>
            <Textarea
              id="bio"
              value={localFormData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell students about yourself, your teaching experience, and what makes you a great teacher..."
              rows={4}
              className="rounded-xl border-gray-200 focus:border-[#5c64d4]"
              required
            />
            <p className="text-xs text-gray-600">
              Minimum 20 characters. This will be shown to students when they view your profile.
            </p>
          </div>
        </div>

        <div className="flex justify-center pt-6">
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={cn(
              "px-12 py-4 font-semibold rounded-2xl text-lg shadow-xl transition-all duration-300",
              isFormValid 
                ? "bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white hover:shadow-2xl hover:scale-105" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}
          >
            {isSubmitting ? "Saving..." : "Complete & Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
};