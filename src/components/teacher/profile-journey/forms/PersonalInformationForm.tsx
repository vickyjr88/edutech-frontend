import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProfileJourney } from '../ProfileJourneyContext';
import { Camera, Phone, MapPin, User, Video, FileText, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const { personalInfo, updatePersonalInfo, completeStep } = useProfileJourney();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(personalInfo.profileImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!personalInfo.fullName || !personalInfo.email || 
          !personalInfo.phone || !personalInfo.homeAddress || !personalInfo.idCountry ||
          !personalInfo.idType || !personalInfo.idNumber || !personalInfo.country || !personalInfo.bio) {
        alert('Please fill in all required fields');
        return;
      }

      // Mark step as complete
      completeStep('personal');
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    updatePersonalInfo({ [field]: value });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        updatePersonalInfo({ profileImage: result });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    updatePersonalInfo({ profileImage: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const isFormValid = personalInfo.fullName && 
                     personalInfo.email && personalInfo.phone && 
                     personalInfo.homeAddress && personalInfo.idCountry &&
                     personalInfo.idType && personalInfo.idNumber &&
                     personalInfo.country && personalInfo.bio;

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
              value={personalInfo.fullName}
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
              value={personalInfo.email}
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
                  value={personalInfo.idCountry}
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
                  value={personalInfo.idType}
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
                <Input
                  id="idNumber"
                  value={personalInfo.idNumber}
                  onChange={(e) => handleInputChange('idNumber', e.target.value)}
                  placeholder="Enter ID number"
                  className="rounded-xl border-[#5c64d4]/30 focus:border-[#5c64d4]"
                  required
                />
              </div>
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
                value={personalInfo.countryCode}
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
                value={personalInfo.phone}
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
            <div className="space-y-2">
              <Label htmlFor="homeAddress" className="text-sm font-medium">Home Address *</Label>
              <Input
                id="homeAddress"
                value={personalInfo.homeAddress}
                onChange={(e) => handleInputChange('homeAddress', e.target.value)}
                placeholder="123 Main Street, City, State"
                className="rounded-xl border-purple-200 focus:border-purple-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm font-medium">Country of Residence *</Label>
              <Select
                value={personalInfo.country}
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
              <div className="flex flex-col items-center gap-4">
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
                    className="w-32 h-32 border-2 border-dashed border-orange-300 rounded-full flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors"
                  >
                    <Camera className="w-8 h-8 text-orange-400 mb-2" />
                    <span className="text-xs text-orange-600 text-center px-2">Click to upload</span>
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
                      Uploading...
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
                Supported formats: JPG, PNG, GIF. Max size: 5MB
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="introVideoUrl" className="text-sm font-medium">Introduction Video URL</Label>
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-blue-500" />
                <Input
                  id="introVideoUrl"
                  value={personalInfo.introVideoUrl}
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
              value={personalInfo.bio}
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