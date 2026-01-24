/**
 * MVP Offerings Manager
 *
 * Simplified interface for teachers to create and manage their offerings:
 * - One-time Lesson (single session)
 * - Monthly Package (recurring sessions)
 * - Course (series of lessons)
 */

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, DollarSign, Clock, BookOpen, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { mvpApiClient } from '@/integrations/api/mvp-client';
import MvpOfferingService, { Offering as ServiceOffering } from '@/integrations/api/services/mvp-offering.service';
import { useGetMvpTeacherProfile } from '@/hooks/use-mvp-teacher-profile';
import { MvpTeacherService } from '@/integrations/api/services/mvp-teacher.service';

// Offering types for MVP
export type OfferingType = 'one-time' | 'monthly-package' | 'course';

// Zod schema for offering validation
const offeringSchema = z.object({
  type: z.enum(['one-time', 'monthly-package', 'course'], {
    required_error: 'Please select an offering type',
  }),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(500),
  subject: z.string().min(2, 'Subject is required'),
  curriculum: z.string().optional(),
  gradeLevel: z.string().optional(),

  // Pricing
  price: z.number().min(100, 'Price must be at least KES 100'),

  // Duration fields
  sessionDuration: z.number().min(30, 'Session must be at least 30 minutes').max(240),
  numberOfSessions: z.number().min(1).optional(), // For packages and courses

  // Monthly package specific
  sessionsPerMonth: z.number().min(1).max(20).optional(),

  // Active status
  isActive: z.boolean().default(true),
});

type OfferingFormValues = z.infer<typeof offeringSchema>;

// Extend ServiceOffering but ensure it's compatible with FormValues
interface Offering extends OfferingFormValues {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function OfferingsManager() {
  const { toast } = useToast();
  const { confirm, ConfirmDialog } = useConfirmationDialog();
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Ref to prevent duplicate API calls in StrictMode
  const initialLoadDone = useRef(false);

  // Fetch teacher profile to get subjects, curricula, and grade levels
  const { data: teacherProfile, isLoading: isProfileLoading } = useGetMvpTeacherProfile();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OfferingFormValues>({
    resolver: zodResolver(offeringSchema),
    defaultValues: {
      type: 'one-time',
      isActive: true,
      sessionDuration: 60,
      numberOfSessions: 1,
    },
  });

  const offeringType = watch('type');

  // Fetch stats separately
  const [stats, setStats] = useState<any[]>([]);

  // Extract unique subjects, curricula, and grade levels from teacher profile
  const getUniqueSubjects = () => {
    if (!teacherProfile?.subjects) return [];

    // MVP Structure (string[])
    if (Array.isArray(teacherProfile.subjects) && (teacherProfile.subjects.length === 0 || typeof teacherProfile.subjects[0] === 'string')) {
      return teacherProfile.subjects as string[];
    }

    // Legacy Structure (object array) Fallback
    const subjects = new Set<string>();
    (teacherProfile.subjects as any[]).forEach((subject: any) => {
      if (typeof subject === 'string') subjects.add(subject);
      else if (subject && subject.subject) subjects.add(subject.subject);
    });
    return Array.from(subjects).sort();
  };

  const getUniqueCurricula = () => {
    if (!teacherProfile?.curriculums && !teacherProfile?.subjects) return [];

    const curricula = new Set<string>();

    // MVP Structure (curriculums: string[])
    if (Array.isArray(teacherProfile.curriculums)) {
      teacherProfile.curriculums.forEach(c => curricula.add(c));
    }

    // Legacy Structure (subjects[].curriculum)
    if (Array.isArray(teacherProfile.subjects)) {
      teacherProfile.subjects.forEach((subject: any) => {
        if (subject && subject.curriculum) curricula.add(subject.curriculum);
      });
    }

    // Also check experience for curricula
    if (teacherProfile?.experience) {
      teacherProfile.experience.forEach((exp: any) => {
        if (exp.curriculums && Array.isArray(exp.curriculums)) {
          exp.curriculums.forEach((curr: string) => curricula.add(curr));
        }
      });
    }
    return Array.from(curricula).sort();
  };

  const getUniqueGradeLevels = () => {
    if (!teacherProfile?.gradeLevels && !teacherProfile?.subjects) return [];

    const gradeLevels = new Set<string>();

    // MVP Structure (gradeLevels: string[])
    if (Array.isArray(teacherProfile.gradeLevels)) {
      teacherProfile.gradeLevels.forEach(g => gradeLevels.add(g));
    }

    // Legacy Structure (subjects[].gradeLevel)
    if (Array.isArray(teacherProfile.subjects)) {
      teacherProfile.subjects.forEach((subject: any) => {
        if (subject && subject.gradeLevel) gradeLevels.add(subject.gradeLevel);
      });
    }

    // Also check experience for grades
    if (teacherProfile?.experience) {
      teacherProfile.experience.forEach((exp: any) => {
        if (exp.grades && Array.isArray(exp.grades)) {
          exp.grades.forEach((grade: string) => gradeLevels.add(grade));
        }
      });
    }
    return Array.from(gradeLevels).sort();
  };

  const availableSubjects = getUniqueSubjects();
  const availableCurricula = getUniqueCurricula();
  const availableGradeLevels = getUniqueGradeLevels();

  // Load offerings and stats on mount
  useEffect(() => {
    // Prevent duplicate calls in StrictMode
    if (initialLoadDone.current) return;

    initialLoadDone.current = true;
    loadOfferings();
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const statsData = await MvpOfferingService.getMyOfferingStats();
      setStats(statsData);
    } catch (e) {
      console.error("Failed to load offering stats", e);
    }
  };

  const loadOfferings = async () => {
    try {
      setIsLoading(true);
      const data = await MvpOfferingService.getMyOfferings();
      // Cast the response to Offering[] to satisfy local interface
      setOfferings(data as unknown as Offering[]);
    } catch (error) {
      console.error('Error loading offerings:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load offerings. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatsForOffering = (id: string) => {
    return stats.find(s => s.offeringId === id) || { bookingsCount: 0, wishlistCount: 0, earnings: 0 };
  };

  const onSubmit = async (data: OfferingFormValues) => {
    try {
      if (editingId) {
        // Update existing offering
        const updated = await MvpOfferingService.updateOffering(editingId, data);

        setOfferings(prev =>
          prev.map(o => (o._id === editingId ? { ...o, ...data, updatedAt: updated.updatedAt } : o))
        );

        toast({
          title: 'Offering updated',
          description: 'Your offering has been updated successfully.',
        });
      } else {
        // Create new offering
        // Cast data to any to bypass strict type check on optional fields during creation if needed, 
        // or ensure OfferingFormValues perfectly matches CreateOfferingRequest
        const newOffering = await MvpOfferingService.createOffering(data as any);

        // Cast to make compatible with local state
        setOfferings(prev => [newOffering as unknown as Offering, ...prev]);

        toast({
          title: 'Offering created',
          description: 'Your offering has been created successfully.',
        });
      }

      // Reset form and close
      reset();
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error saving offering:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save offering. Please try again.',
      });
    }
  };

  const handleEdit = (offering: Offering) => {
    setEditingId(offering._id);
    reset(offering);
    setShowForm(true);
  };

  const handleDelete = async (id: string, title: string) => {
    confirm({
      title: 'Delete Offering',
      description: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
      onConfirm: async () => {
        try {
          await MvpOfferingService.deleteOffering(id);

          setOfferings(prev => prev.filter(o => o._id !== id));

          toast({
            title: 'Offering deleted',
            description: 'The offering has been deleted successfully.',
          });
        } catch (error) {
          console.error('Error deleting offering:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to delete offering. Please try again.',
          });
        }
      },
    });
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await MvpOfferingService.toggleActive(id, isActive);

      setOfferings(prev =>
        prev.map(o => (o._id === id ? { ...o, isActive } : o))
      );

      toast({
        title: isActive ? 'Offering activated' : 'Offering deactivated',
        description: `The offering has been ${isActive ? 'activated' : 'deactivated'}.`,
      });
    } catch (error) {
      console.error('Error toggling offering:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update offering status. Please try again.',
      });
    }
  };

  const handleCancel = () => {
    reset();
    setEditingId(null);
    setShowForm(false);
  };

  const getOfferingIcon = (type: OfferingType) => {
    switch (type) {
      case 'one-time':
        return <Clock className="h-5 w-5" />;
      case 'monthly-package':
        return <Package className="h-5 w-5" />;
      case 'course':
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getOfferingTypeLabel = (type: OfferingType) => {
    switch (type) {
      case 'one-time':
        return 'One-time Lesson';
      case 'monthly-package':
        return 'Monthly Package';
      case 'course':
        return 'Course';
    }
  };

  if (isLoading || isProfileLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-600">Loading offerings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ConfirmDialog />
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Offerings</h2>
          <p className="text-gray-600 mt-1">
            Create and manage your teaching offerings
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Offering
          </Button>
        )}
      </div>

      {/* Offering Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Offering' : 'Create New Offering'}</CardTitle>
            <CardDescription>
              Fill in the details of your offering
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Completion Notice */}
              {availableSubjects.length === 0 && (
                <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-md">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">
                        Complete Your Teaching Profile First
                      </h3>
                      <p className="mt-2 text-sm text-amber-700">
                        To create offerings, you need to add your teaching expertise (subjects, curricula, and grade levels) in your profile first.
                        Visit your <a href="/teacher-profile-setup" className="font-medium underline">Teaching Expertise</a> section to add this information.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Offering Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Offering Type *</Label>
                <Select
                  value={offeringType}
                  onValueChange={(value) => setValue('type', value as OfferingType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select offering type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        One-time Lesson
                      </div>
                    </SelectItem>
                    <SelectItem value="monthly-package">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Monthly Package
                      </div>
                    </SelectItem>
                    <SelectItem value="course">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Course
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Mathematics Grade 8 - Algebra"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what students will learn in this offering..."
                  rows={4}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Subject and Curriculum */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  {availableSubjects.length > 0 ? (
                    <Select
                      value={watch('subject')}
                      onValueChange={(value) => setValue('subject', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject from your profile" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <p className="text-sm text-amber-800">
                        No subjects found in your profile. Please add subjects in your Teaching Expertise section first.
                      </p>
                    </div>
                  )}
                  {errors.subject && (
                    <p className="text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="curriculum">Curriculum</Label>
                  {availableCurricula.length > 0 ? (
                    <Select
                      value={watch('curriculum')}
                      onValueChange={(value) => setValue('curriculum', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select curriculum from your profile" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCurricula.map((curriculum) => (
                          <SelectItem key={curriculum} value={curriculum}>
                            {curriculum}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-800">
                        No curricula found. You can leave this blank or add curricula to your profile.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Grade Level */}
              <div className="space-y-2">
                <Label htmlFor="gradeLevel">Grade Level</Label>
                {availableGradeLevels.length > 0 ? (
                  <Select
                    value={watch('gradeLevel')}
                    onValueChange={(value) => setValue('gradeLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade level from your profile" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableGradeLevels.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      No grade levels found. You can leave this blank or add grade levels to your profile.
                    </p>
                  </div>
                )}
              </div>

              {/* Session Duration and Sessions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionDuration">
                    Session Duration (minutes) *
                  </Label>
                  <Input
                    id="sessionDuration"
                    type="number"
                    placeholder="60"
                    {...register('sessionDuration', { valueAsNumber: true })}
                  />
                  {errors.sessionDuration && (
                    <p className="text-sm text-red-600">
                      {errors.sessionDuration.message}
                    </p>
                  )}
                </div>

                {offeringType === 'monthly-package' && (
                  <div className="space-y-2">
                    <Label htmlFor="sessionsPerMonth">
                      Sessions per Month *
                    </Label>
                    <Input
                      id="sessionsPerMonth"
                      type="number"
                      placeholder="4"
                      {...register('sessionsPerMonth', { valueAsNumber: true })}
                    />
                    {errors.sessionsPerMonth && (
                      <p className="text-sm text-red-600">
                        {errors.sessionsPerMonth.message}
                      </p>
                    )}
                  </div>
                )}

                {offeringType === 'course' && (
                  <div className="space-y-2">
                    <Label htmlFor="numberOfSessions">
                      Total Sessions *
                    </Label>
                    <Input
                      id="numberOfSessions"
                      type="number"
                      placeholder="12"
                      {...register('numberOfSessions', { valueAsNumber: true })}
                    />
                    {errors.numberOfSessions && (
                      <p className="text-sm text-red-600">
                        {errors.numberOfSessions.message}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price (KES) *
                  {offeringType === 'monthly-package' && ' per month'}
                  {offeringType === 'course' && ' total'}
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="price"
                    type="number"
                    placeholder="1000"
                    className="pl-10"
                    {...register('price', { valueAsNumber: true })}
                  />
                </div>
                {errors.price && (
                  <p className="text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="isActive">Active Status</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Make this offering available for booking
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={watch('isActive')}
                  onCheckedChange={(checked) => setValue('isActive', checked)}
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || availableSubjects.length === 0}
                >
                  {isSubmitting ? 'Saving...' : editingId ? 'Update Offering' : 'Create Offering'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Offerings List */}
      {!showForm && offerings.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No offerings yet</h3>
            <p className="text-gray-600 text-center mb-4">
              Create your first offering to start accepting bookings
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Offering
            </Button>
          </CardContent>
        </Card>
      )}

      {!showForm && offerings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offerings.map((offering) => (
            <Card key={offering._id} className={!offering.isActive ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {getOfferingIcon(offering.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{offering.title}</CardTitle>
                      <p className="text-sm text-gray-600">
                        {getOfferingTypeLabel(offering.type)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {offering.description}
                </p>

                {/* Stats Section */}
                <div className="grid grid-cols-3 gap-2 mb-4 mt-2 p-3 bg-gray-50 rounded-md">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Bookings</p>
                    <p className="font-bold text-gray-800 text-sm">{getStatsForOffering(offering._id).bookingsCount}</p>
                  </div>
                  <div className="text-center border-l border-gray-200">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Wishlist</p>
                    <p className="font-bold text-gray-800 text-sm">{getStatsForOffering(offering._id).wishlistCount}</p>
                  </div>
                  <div className="text-center border-l border-gray-200">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Earnings</p>
                    <p className="font-bold text-gray-800 text-sm">KES {getStatsForOffering(offering._id).earnings}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subject:</span>
                    <span className="font-medium">{offering.subject}</span>
                  </div>

                  {offering.gradeLevel && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Grade:</span>
                      <span className="font-medium">{offering.gradeLevel}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{offering.sessionDuration} min</span>
                  </div>

                  {offering.type === 'monthly-package' && offering.sessionsPerMonth && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Sessions/month:</span>
                      <span className="font-medium">{offering.sessionsPerMonth}</span>
                    </div>
                  )}

                  {offering.type === 'course' && offering.numberOfSessions && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total sessions:</span>
                      <span className="font-medium">{offering.numberOfSessions}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm pt-2 border-t">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-bold text-lg">KES {offering.price}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <Switch
                    checked={offering.isActive}
                    onCheckedChange={(checked) => toggleActive(offering._id, checked)}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(offering)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(offering._id, offering.title)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
