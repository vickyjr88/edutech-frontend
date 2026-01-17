/**
 * Simplified Teacher Profile Form - MVP Version
 *
 * Single-page form for teacher profile creation (no wizard)
 * Covers all MVP requirements from the feature spec
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2, Upload, X, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MvpTeacherService } from '@/integrations/api/services/mvp-teacher.service';
import useTeachingConfig from '@/hooks/use-teaching-config';
import { MultiSelectAutocomplete } from '@/components/ui/multi-select-autocomplete';

// Validation Schema
const profileSchema = z.object({
  // Basic Info
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().min(10, 'Valid phone number required'),

  // Location
  estate: z.string().min(2, 'Estate/Area required'),
  road: z.string().optional(),
  city: z.string().min(2, 'City required'),

  // Bio & Media
  bio: z.string().min(50, 'Bio must be at least 50 characters').max(500, 'Bio must be max 500 words'),
  introVideoUrl: z.string().url('Valid video URL required').optional().or(z.literal('')),

  // Teaching Info
  curriculums: z.array(z.string()).min(1, 'Select at least one curriculum'),
  subjects: z.array(z.string()).min(1, 'Select at least one subject'),
  gradeLevels: z.array(z.string()).min(1, 'Select at least one grade level'),
  yearsOfExperience: z.number().min(0, 'Years of experience required'),

  // Payment Info
  mpesaNumber: z.string().min(10, 'M-PESA number required'),
  bankAccountName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankName: z.string().optional(),
  branchCode: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Mock data for dropdowns (will come from API in production)
// Mock data for dropdowns (will come from API in production)
// const CURRICULUMS = ['IGCSE', 'KCSE', 'IB', 'A-Level', '8-4-4', 'CBC'];
// const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Kiswahili', 'History', 'Geography', 'Computer Science'];
// const GRADE_LEVELS = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Form 1', 'Form 2', 'Form 3', 'Form 4'];

interface Education {
  degree: string;
  institution: string;
  year: number;
}

interface Certification {
  name: string;
  file: File | null;
  fileName?: string;
}

export default function SimplifiedTeacherProfileForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load teaching config
  const { curricula, subjects: subjectOptions, gradeLevels: gradeLevelOptions, isLoading: isConfigLoading } = useTeachingConfig();

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [education, setEducation] = useState<Education[]>([{ degree: '', institution: '', year: new Date().getFullYear() }]);
  const [certifications, setCertifications] = useState<Certification[]>([{ name: '', file: null }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingProfile, setExistingProfile] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      curriculums: [],
      subjects: [],
      gradeLevels: [],
      yearsOfExperience: 0,
    },
  });

  // Load existing profile data if available
  useEffect(() => {
    const loadExistingProfile = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // Try to get existing profile using MVP endpoint
        const profile = await MvpTeacherService.getCurrentProfile();

        if (profile) {
          console.log('Loaded existing profile:', profile);
          setExistingProfile(profile);

          // Populate form with existing data (MVP format)
          reset({
            fullName: profile.fullName || '',
            phoneNumber: profile.phoneNumber || '',
            estate: profile.location?.estate || '',
            road: profile.location?.road || '',
            city: profile.location?.city || '',
            bio: profile.bio || '',
            introVideoUrl: profile.introVideoUrl || '',
            curriculums: profile.curriculums || [],
            subjects: profile.subjects || [],
            gradeLevels: profile.gradeLevels || [],
            yearsOfExperience: profile.yearsOfExperience || 0,
            mpesaNumber: profile.payoutDetails?.mpesaNumber || '',
            bankAccountName: profile.payoutDetails?.bankAccountName || '',
            bankAccountNumber: profile.payoutDetails?.bankAccountNumber || '',
            bankName: profile.payoutDetails?.bankName || '',
            branchCode: profile.payoutDetails?.branchCode || '',
          });

          // Set photo preview if exists
          if (profile.profileImage) {
            setPhotoPreview(profile.profileImage);
          }

          // Set education if exists
          if (profile.education?.length > 0) {
            setEducation(profile.education.map((e) => ({
              degree: e.degree || '',
              institution: e.institution || '',
              year: e.year || new Date().getFullYear(),
            })));
          }
        }
      } catch (error) {
        console.log('No existing profile found, create new one');
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingProfile();
  }, [user?.id, reset]);

  const selectedCurriculums = watch('curriculums') || [];
  const selectedSubjects = watch('subjects') || [];
  const selectedGradeLevels = watch('gradeLevels') || [];

  // Handle profile photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo must be less than 5MB');
        return;
      }
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Handle education
  const addEducation = () => {
    setEducation([...education, { degree: '', institution: '', year: new Date().getFullYear() }]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof Education, value: string | number) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  // Handle certifications
  const addCertification = () => {
    setCertifications([...certifications, { name: '', file: null }]);
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const updateCertification = (index: number, field: 'name' | 'file', value: string | File) => {
    const updated = [...certifications];
    if (field === 'name') {
      updated[index].name = value as string;
    } else {
      updated[index].file = value as File;
      updated[index].fileName = (value as File).name;
    }
    setCertifications(updated);
  };

  // Multi-select handlers
  const toggleSelection = (field: 'curriculums' | 'subjects' | 'gradeLevels', value: string) => {
    const current = watch(field) || [];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    setValue(field, updated);
  };

  // Form submission
  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      // Validate required files only for new profiles
      if (!existingProfile && !profilePhoto && !photoPreview) {
        toast.error('Profile photo is required');
        setIsSubmitting(false);
        return;
      }

      // Validate education
      const validEducation = education.filter(e => e.degree && e.institution);
      if (validEducation.length === 0) {
        toast.error('At least one education entry is required');
        setIsSubmitting(false);
        return;
      }

      // Build the profile data object for the API
      const profileData = {
        // User data updates (flat structure for MVP API)
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        bio: data.bio,
        location: {
          estate: data.estate,
          road: data.road || '',
          city: data.city,
        },
        // Teaching info
        introVideoUrl: data.introVideoUrl || '',
        yearsOfExperience: data.yearsOfExperience,
        curriculums: data.curriculums,
        subjects: data.subjects,
        gradeLevels: data.gradeLevels,
        // Payment info
        payoutDetails: {
          mpesaNumber: data.mpesaNumber,
          bankAccountName: data.bankAccountName || '',
          bankAccountNumber: data.bankAccountNumber || '',
          bankName: data.bankName || '',
          branchCode: data.branchCode || '',
        },
        // Education
        education: validEducation,
      };

      console.log('Submitting profile data:', profileData);

      let result;

      if (existingProfile?.id) {
        // Update existing profile using MVP endpoint
        console.log('Updating existing profile:', existingProfile.id);
        result = await MvpTeacherService.updateProfile(profileData);
      } else {
        // Create new profile using MVP endpoint
        console.log('Creating new profile for user:', user?.id);
        result = await MvpTeacherService.createProfile(profileData);
      }

      console.log('Profile saved successfully:', result);

      // Upload profile photo if selected
      if (profilePhoto) {
        try {
          console.log('Uploading profile photo...');
          // Convert file to base64
          const reader = new FileReader();
          const photoUploadPromise = new Promise<string>((resolve, reject) => {
            reader.onloadend = () => {
              const base64 = reader.result as string;
              resolve(base64);
            };
            reader.onerror = reject;
          });
          reader.readAsDataURL(profilePhoto);

          const base64Image = await photoUploadPromise;
          const uploadResult = await MvpTeacherService.uploadProfilePhoto(base64Image, profilePhoto.type);
          console.log('Profile photo uploaded successfully:', uploadResult);
        } catch (photoError) {
          console.error('Failed to upload profile photo:', photoError);
          // Don't fail the whole submission due to photo upload failure
          toast.warning('Profile saved, but photo upload failed. You can try again later.');
        }
      }

      toast.success('Profile saved successfully! Awaiting admin approval.');

      // Redirect to dashboard
      setTimeout(() => {
        navigate('/teacher-dashboard');
      }, 1000);

    } catch (error: any) {
      console.error('Profile submission error:', error);
      toast.error(error.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking for existing profile
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {existingProfile ? 'Edit Your Teacher Profile' : 'Create Your Teacher Profile'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {existingProfile
            ? 'Update your details below. Changes will be saved automatically.'
            : 'Fill in your details to start teaching on Kidato. All fields marked with * are required.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Profile Photo */}
            <div>
              <Label>Profile Photo *</Label>
              <div className="mt-2 flex items-center gap-4">
                {photoPreview ? (
                  <div className="relative">
                    <img src={photoPreview} alt="Preview" className="w-24 h-24 rounded-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setProfilePhoto(null);
                        setPhotoPreview('');
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <Label htmlFor="photo-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" asChild>
                      <span>Upload Photo</span>
                    </Button>
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">JPG, PNG (max 5MB)</p>
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                {...register('fullName')}
                placeholder="e.g. John Doe"
              />
              {errors.fullName && (
                <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                {...register('phoneNumber')}
                placeholder="e.g. 0712345678"
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500 mt-1">{errors.phoneNumber.message}</p>
              )}
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="estate">Estate/Area *</Label>
                <Input
                  id="estate"
                  {...register('estate')}
                  placeholder="e.g. Westlands"
                />
                {errors.estate && (
                  <p className="text-sm text-red-500 mt-1">{errors.estate.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="road">Road (Optional)</Label>
                <Input
                  id="road"
                  {...register('road')}
                  placeholder="e.g. Waiyaki Way"
                />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  {...register('city')}
                  placeholder="e.g. Nairobi"
                />
                {errors.city && (
                  <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div>
              <Label htmlFor="bio">Bio/Description * (50-500 words)</Label>
              <Textarea
                id="bio"
                {...register('bio')}
                placeholder="Tell parents about your teaching experience, approach, and what makes you a great teacher..."
                rows={5}
                className="resize-none"
              />
              {errors.bio && (
                <p className="text-sm text-red-500 mt-1">{errors.bio.message}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                {watch('bio')?.length || 0} characters
              </p>
            </div>

            {/* Intro Video */}
            <div>
              <Label htmlFor="introVideoUrl">Intro Video URL (Optional)</Label>
              <Input
                id="introVideoUrl"
                {...register('introVideoUrl')}
                placeholder="e.g. https://youtube.com/watch?v=..."
              />
              {errors.introVideoUrl && (
                <p className="text-sm text-red-500 mt-1">{errors.introVideoUrl.message}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                Upload your intro video to YouTube/Vimeo and paste the link here
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Teaching Information */}
        <Card>
          <CardHeader>
            <CardTitle>Teaching Information</CardTitle>
            <CardDescription>Your teaching expertise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Curriculums */}
            <div>
              <Label>Curriculum(s) * (Select all that apply)</Label>
              <div className="mt-2">
                <MultiSelectAutocomplete
                  options={curricula}
                  selectedValues={selectedCurriculums}
                  onChange={(values) => setValue('curriculums', values, { shouldValidate: true })}
                  placeholder="Select curricula..."
                  emptyMessage="No curricula found."
                />
              </div>
              {errors.curriculums && (
                <p className="text-sm text-red-500 mt-1">{errors.curriculums.message}</p>
              )}
            </div>

            {/* Subjects */}
            <div>
              <Label>Subject(s) * (Select all that apply)</Label>
              <div className="mt-2">
                <MultiSelectAutocomplete
                  options={subjectOptions}
                  selectedValues={selectedSubjects}
                  onChange={(values) => setValue('subjects', values, { shouldValidate: true })}
                  placeholder="Select subjects..."
                  emptyMessage="No subjects found."
                />
              </div>
              {errors.subjects && (
                <p className="text-sm text-red-500 mt-1">{errors.subjects.message}</p>
              )}
            </div>

            {/* Grade Levels */}
            <div>
              <Label>Grade Level(s) * (Select all that apply)</Label>
              <div className="mt-2">
                <MultiSelectAutocomplete
                  options={gradeLevelOptions}
                  selectedValues={selectedGradeLevels}
                  onChange={(values) => setValue('gradeLevels', values, { shouldValidate: true })}
                  placeholder="Select grade levels..."
                  emptyMessage="No grade levels found."
                />
              </div>
              {errors.gradeLevels && (
                <p className="text-sm text-red-500 mt-1">{errors.gradeLevels.message}</p>
              )}
            </div>

            {/* Years of Experience */}
            <div>
              <Label htmlFor="yearsOfExperience">Years of Teaching Experience *</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                min="0"
                {...register('yearsOfExperience', { valueAsNumber: true })}
                placeholder="e.g. 5"
              />
              {errors.yearsOfExperience && (
                <p className="text-sm text-red-500 mt-1">{errors.yearsOfExperience.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader>
            <CardTitle>Education Background</CardTitle>
            <CardDescription>Your academic qualifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Education #{index + 1}</h4>
                  {education.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="Degree (e.g. Bachelor of Education)"
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  />
                  <Input
                    placeholder="Institution (e.g. University of Nairobi)"
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Year"
                    value={edu.year}
                    onChange={(e) => updateEducation(index, 'year', parseInt(e.target.value))}
                  />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addEducation} className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Another Degree
            </Button>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle>Certifications (Optional)</CardTitle>
            <CardDescription>Upload your teaching certifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {certifications.map((cert, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Certification #{index + 1}</h4>
                  {certifications.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCertification(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Certification name"
                    value={cert.name}
                    onChange={(e) => updateCertification(index, 'name', e.target.value)}
                  />
                  <div>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) updateCertification(index, 'file', file);
                      }}
                      className="hidden"
                      id={`cert-file-${index}`}
                    />
                    <Label htmlFor={`cert-file-${index}`} className="cursor-pointer">
                      <Button type="button" variant="outline" className="w-full" asChild>
                        <span>{cert.fileName || 'Upload File'}</span>
                      </Button>
                    </Label>
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addCertification} className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Another Certification
            </Button>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>How you'll receive payments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* M-PESA Number */}
            <div>
              <Label htmlFor="mpesaNumber">M-PESA Number * (Primary payment method)</Label>
              <Input
                id="mpesaNumber"
                {...register('mpesaNumber')}
                placeholder="e.g. 0712345678"
              />
              {errors.mpesaNumber && (
                <p className="text-sm text-red-500 mt-1">{errors.mpesaNumber.message}</p>
              )}
            </div>

            {/* Bank Account (Optional) */}
            <div className="space-y-3">
              <Label>Bank Account Details (Optional backup method)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  {...register('bankAccountName')}
                  placeholder="Account Name"
                />
                <Input
                  {...register('bankAccountNumber')}
                  placeholder="Account Number"
                />
                <Input
                  {...register('bankName')}
                  placeholder="Bank Name"
                />
                <Input
                  {...register('branchCode')}
                  placeholder="Branch Code"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="submit"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving Profile...
              </>
            ) : (
              'Save Profile & Submit for Approval'
            )}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Your profile will be reviewed by our team. You'll receive an email once it's approved.
        </p>
      </form>
    </div>
  );
}
