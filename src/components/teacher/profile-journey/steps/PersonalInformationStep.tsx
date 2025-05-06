import React, { useState, useRef } from "react";
import { useProfileJourney } from "../ProfileJourneyContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ImagePlus, User, Mail, Phone, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { teacherService } from "@/integrations/api/services/teacher.service";

const PersonalInformationStep = () => {
  const { personalInfo, updatePersonalInfo, completeStep } = useProfileJourney();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Create local state to track form changes
  const [formData, setFormData] = useState({
    firstName: personalInfo.firstName,
    lastName: personalInfo.lastName,
    email: personalInfo.email,
    countryCode: personalInfo.countryCode || "+254", // Default to Kenya, but allow changing
    phone: personalInfo.phone,
    alternativeCountryCode: personalInfo.alternativeCountryCode || "+254",
    alternativePhone: personalInfo.alternativePhone,
    bio: personalInfo.bio,
    profileImage: personalInfo.profileImage
  });
  
  // Debug the received personalInfo
  console.log("PersonalInformationStep received personalInfo:", personalInfo);
  
  // Track if form has been changed
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(personalInfo);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // The result will be like "data:image/jpeg;base64,/9j/4AAQSkZJRgABA..."
        // We need only the base64 part after the comma
        const base64String = reader.result as string;
        const base64 = base64String.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };
  
  // Handle profile image upload
  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file (JPEG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUploading(true);
      const base64File = await fileToBase64(file);
      const mimeType = file.type; // e.g. "image/jpeg", "image/png", etc.
      
      if (!user?.teacherId) {
        throw new Error("Teacher ID not found");
      }
      
      const { data, error } = await teacherService.uploadProfilePhoto(user.teacherId, base64File, mimeType);
      
      if (error) {
        throw new Error(error.message || "Failed to upload profile image");
      }
      
      // Check for _signedProfileImage in the response first, then fall back to profileImage
      const imageUrl = data?._signedProfileImage || data?.profileImage;
      
      if (imageUrl) {
        setFormData({
          ...formData,
          profileImage: imageUrl
        });
        
        toast({
          title: "Image Uploaded",
          description: "Your profile image has been updated",
        });
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your profile image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // Save changes
  const handleSave = async () => {
    setIsSaving(true);
    
    // Debug logging
    console.log("Submitting form data:", {
      ...formData,
      phoneWithCountryCode: `${formData.countryCode}${formData.phone}`,
      alternativePhoneWithCountryCode: formData.alternativePhone ? `${formData.alternativeCountryCode}${formData.alternativePhone}` : null
    });
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      setIsSaving(false);
      return;
    }
    
    try {
      // Save to context (now this will also save to API)
      console.log("Calling updatePersonalInfo with formData");
      await updatePersonalInfo(formData);
      
      // Debug the profile image URL
      console.log("Profile image value:", {
        profileImage: formData.profileImage,
        imageLength: formData.profileImage ? formData.profileImage.length : 0
      });
      
      // Add additional debugging
      const hasAllRequiredFields = formData.firstName && 
                                   formData.lastName && 
                                   formData.email && 
                                   formData.phone && 
                                   formData.bio && 
                                   formData.profileImage;
      
      console.log("Has all required fields?", hasAllRequiredFields);
      
      // Check if we should mark this step as complete with truthy checks
      // Force completion if all major fields seem to be present
      if (hasAllRequiredFields) {
        console.log("All required fields present, marking step as complete");
        completeStep("personal");
      } else {
        console.log("Attempting to force complete step despite missing some fields");
        // If we have a profile image URL (even partial) and other required fields, force complete
        if (formData.firstName && formData.lastName && formData.email && formData.phone && 
            formData.bio && typeof formData.profileImage === 'string' && formData.profileImage.includes('https')) {
          console.log("Force completing step as we have a partial profile image URL");
          completeStep("personal");
        } else {
          console.log("Missing required fields for completion:", {
            firstName: !!formData.firstName,
            lastName: !!formData.lastName,
            email: !!formData.email,
            phone: !!formData.phone,
            bio: !!formData.bio,
            profileImage: !!formData.profileImage,
            profileImageType: typeof formData.profileImage,
            profileImageStartsWithHttps: typeof formData.profileImage === 'string' && formData.profileImage.startsWith('https')
          });
        }
      }
      
      toast({
        title: "Profile Updated",
        description: "Your personal information has been saved"
      });
    } catch (error) {
      console.error("Error saving personal information:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your information",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Profile Image */}
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
        <div className="flex flex-col items-center">
          <Avatar className="w-24 h-24 border-2 border-gray-200">
            {formData.profileImage ? (
              <AvatarImage src={formData.profileImage} alt="Profile" />
            ) : (
              <AvatarFallback className="bg-blue-100 text-blue-600">
                <User className="h-10 w-10" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col items-center">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={handleImageUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Upload Photo
                </>
              )}
            </Button>
            {!formData.profileImage && 
              <Badge variant="outline" className="mt-2 bg-red-50 text-red-700 text-xs">Required</Badge>
            }
          </div>
        </div>
        
        <div className="flex-1">
          <div className="mb-3">
            <h3 className="text-lg font-medium">Teacher Profile</h3>
            <p className="text-sm text-gray-500">
              This information will be shown to students and parents 
              when they view your profile.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="flex items-center">
                First Name {!formData.firstName && <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 text-xs">Required</Badge>}
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Your first name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="lastName" className="flex items-center">
                Last Name {!formData.lastName && <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 text-xs">Required</Badge>}
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Your last name"
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Contact Information */}
      <div className="space-y-4">
        <div className="flex items-center">
          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
          <h3 className="text-base font-medium">Contact Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email" className="flex items-center">
              Email {!formData.email && <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 text-xs">Required</Badge>}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email address"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="phone" className="flex items-center">
              Phone {!formData.phone && <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 text-xs">Required</Badge>}
            </Label>
            <div className="flex mt-1">
              <div className="w-24 mr-2">
                <select
                  id="countryCode"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="+1">+1 (US/CA)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+254">+254 (KE)</option>
                  <option value="+255">+255 (TZ)</option>
                  <option value="+256">+256 (UG)</option>
                  <option value="+250">+250 (RW)</option>
                  <option value="+234">+234 (NG)</option>
                  <option value="+27">+27 (ZA)</option>
                  <option value="+20">+20 (EG)</option>
                  <option value="+91">+91 (IN)</option>
                  <option value="+86">+86 (CN)</option>
                  <option value="+81">+81 (JP)</option>
                  <option value="+61">+61 (AU)</option>
                  <option value="+33">+33 (FR)</option>
                  <option value="+49">+49 (DE)</option>
                  {/* Add more country codes as needed */}
                </select>
              </div>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="701234567"
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Enter phone number without leading zeros</p>
          </div>
        </div>
        
        <div>
          <Label htmlFor="alternativePhone">Alternative Phone (Optional)</Label>
          <div className="flex mt-1">
            <div className="w-24 mr-2">
              <select
                id="alternativeCountryCode"
                name="alternativeCountryCode"
                value={formData.alternativeCountryCode || formData.countryCode}
                onChange={handleChange}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="+1">+1 (US/CA)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+254">+254 (KE)</option>
                <option value="+255">+255 (TZ)</option>
                <option value="+256">+256 (UG)</option>
                <option value="+250">+250 (RW)</option>
                <option value="+234">+234 (NG)</option>
                <option value="+27">+27 (ZA)</option>
                <option value="+20">+20 (EG)</option>
                <option value="+91">+91 (IN)</option>
                <option value="+86">+86 (CN)</option>
                <option value="+81">+81 (JP)</option>
                <option value="+61">+61 (AU)</option>
                <option value="+33">+33 (FR)</option>
                <option value="+49">+49 (DE)</option>
                {/* Add more country codes as needed */}
              </select>
            </div>
            <Input
              id="alternativePhone"
              name="alternativePhone"
              value={formData.alternativePhone}
              onChange={handleChange}
              placeholder="Alternative phone number"
              className="flex-1"
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Bio */}
      <div className="space-y-4">
        <div className="flex items-center">
          <User className="mr-2 h-4 w-4 text-muted-foreground" />
          <h3 className="text-base font-medium">Professional Bio</h3>
        </div>
        
        <div>
          <Label htmlFor="bio" className="flex items-center">
            Bio {!formData.bio && <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 text-xs">Required</Badge>}
          </Label>
          <p className="text-xs text-gray-500 mb-2">
            Write a brief professional bio to introduce yourself to students and parents.
          </p>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself, your teaching style, and experience..."
            className="mt-1 min-h-32"
          />
          <div className="mt-1 text-xs text-right text-gray-500">
            {formData.bio.length} / 500 characters
          </div>
        </div>
      </div>
      
      {/* Save button */}
      {hasChanges && (
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              "transition-all",
              isSaving ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {isSaving ? (
              <>
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PersonalInformationStep;