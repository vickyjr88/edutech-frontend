import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Calendar,
    Plus,
    ArrowRight,
    ArrowLeft,
    X
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

import { CohortData } from '../types';
import CohortFormDialog from '../cohort-form/CohortFormDialog';

const SchedulePricingStep = ({ form, cohorts, setCohorts, onNext, onPrev, curricula }: any) => {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editCohortId, setEditCohortId] = useState<string | null>(null);

    const addCohort = () => {
        const newCohort: Partial<CohortData> = {
            id: Date.now().toString(),
            name: `Cohort ${cohorts.length + 1}`,
            startDate: null,
            endDate: null,
            startTime: '',
            endTime: '',
            numberOfLessons: form.watch('numberOfLessons') || 8,
            price: '',
            discount: '0',
            isActive: true,
            lessonSchedules: [],
            hasFlexibleSchedule: false,
            repeatSchedule: {
                pattern: 'weekly',
                daysOfWeek: ['monday'],
                repeatEvery: 1
            },
            minStudents: 1,
            maxStudents: 20,
            enrollmentDeadline: null
        };
        setCohorts([...cohorts, newCohort]);
    };

    const removeCohort = (id: string) => {
        setCohorts(cohorts.filter((cohort: CohortData) => cohort.id !== id));
    };

    const updateCohort = (id: string, field: keyof CohortData, value: any) => {
        setCohorts(cohorts.map((cohort: CohortData) =>
            cohort.id === id ? { ...cohort, [field]: value } : cohort
        ));
    };

    const calculateEndDate = (startDate: Date | null, numberOfLessons: number, repeatSchedule: any): Date | null => {
        if (!startDate) return null;

        const weeks = Math.ceil(numberOfLessons / repeatSchedule.daysOfWeek.length);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + (weeks * 7));

        return endDate;
    };

    const handleCreateCohort = (newCohortData: CohortData) => {
        const cohortWithId = {
            ...newCohortData,
            id: Date.now().toString()
        };
        setCohorts([...cohorts, cohortWithId]);
        setIsCreateDialogOpen(false);
    };

    const handleUpdateCohort = (updatedCohort: CohortData) => {
        setCohorts(cohorts.map((cohort: CohortData) =>
            cohort.id === updatedCohort.id ? updatedCohort : cohort
        ));
        setEditCohortId(null);
    };

    const cohortBeingEdited = editCohortId
        ? cohorts.find((cohort: CohortData) => cohort.id === editCohortId)
        : undefined;

    // Get current class data for display
    const classTitle = form.watch('title') || 'Untitled Class';
    const curriculumId = form.watch('curriculum') || '';
    const curriculumLevel = form.watch('curriculumLevel') || '';
    const subject = form.watch('subject') || '';
    const lessonPlans = form.watch('lessonPlans') || [];

    // Look up curriculum name from API data
    const curriculum = curricula?.find((c: any) => c.id === curriculumId || c._id === curriculumId)?.name || curriculumId || 'Not specified';

    return (
        <div className="space-y-8">
            {/* Enhanced Header with Class Info */}
            <div className="text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 bg-gradient-to-br from-kidato-indigo-500 to-kidato-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                    <Calendar className="h-8 w-8 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-kidato-indigo-800 mb-2">Schedule & Pricing</h2>
                <p className="text-kidato-indigo-600 text-lg">When will your class run and how much will it cost?</p>

                {/* Class Context Info */}
                <div className="mt-6 p-6 bg-gradient-to-r from-kidato-indigo-50 to-kidato-orange-50 rounded-2xl border border-kidato-indigo-200 max-w-2xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-kidato-indigo-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-kidato-indigo-800">Class Overview</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                        <div>
                            <h4 className="font-semibold text-kidato-indigo-700 text-sm mb-1">Class Title</h4>
                            <p className="text-kidato-indigo-900 font-medium">{classTitle}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-kidato-indigo-700 text-sm mb-1">Subject</h4>
                            <p className="text-kidato-indigo-900 font-medium">{subject}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-kidato-indigo-700 text-sm mb-1">Curriculum</h4>
                            <p className="text-kidato-indigo-900 font-medium">{curriculum}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-kidato-indigo-700 text-sm mb-1">Total Lessons</h4>
                            <p className="text-kidato-indigo-900 font-medium">{lessonPlans.length} lessons planned</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <Card className="border-kidato-indigo-200 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-kidato-indigo-50 to-kidato-orange-50 border-b border-kidato-indigo-200">
                        <CardTitle className="flex items-center gap-2 text-kidato-indigo-800">
                            <Calendar className="h-5 w-5 text-kidato-indigo-600" />
                            Class Schedule
                        </CardTitle>
                        <CardDescription className="text-kidato-indigo-600">Set up when and how your class will run</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        {/* Cohort Creation/Edit Dialogs */}
                        <CohortFormDialog
                            isOpen={isCreateDialogOpen}
                            onOpenChange={setIsCreateDialogOpen}
                            onSave={handleCreateCohort}
                            title="Create New Cohort"
                            description="Configure your new cohort details"
                            totalNumberOfLessons={lessonPlans.length || 8}
                            calculateEndDate={calculateEndDate}
                        />

                        {cohortBeingEdited && (
                            <CohortFormDialog
                                cohort={cohortBeingEdited}
                                isOpen={!!editCohortId}
                                onOpenChange={(open) => {
                                    if (!open) setEditCohortId(null);
                                }}
                                onSave={handleUpdateCohort}
                                title="Edit Cohort"
                                description="Update your cohort details"
                                totalNumberOfLessons={lessonPlans.length || 8}
                                calculateEndDate={calculateEndDate}
                            />
                        )}

                        {cohorts.length === 0 && (
                            <div className="text-center py-8">
                                <Calendar className="h-12 w-12 text-kidato-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-kidato-indigo-900 mb-2">No cohorts yet</h3>
                                <p className="text-kidato-indigo-600 mb-4">Create your first class schedule</p>
                                <Button
                                    onClick={() => setIsCreateDialogOpen(true)}
                                    className="bg-gradient-to-r from-kidato-indigo-500 to-kidato-orange-500 hover:from-kidato-indigo-600 hover:to-kidato-orange-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Schedule
                                </Button>
                            </div>
                        )}

                        {cohorts.map((cohort: any, index: number) => (
                            <Card key={cohort.id} className="border-l-4 border-l-kidato-indigo-500 bg-gradient-to-r from-kidato-indigo-50 to-white">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-kidato-indigo-800">{cohort.name || `Cohort ${index + 1}`}</CardTitle>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setEditCohortId(cohort.id)}
                                                className="text-kidato-indigo-600 hover:text-kidato-indigo-700"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeCohort(cohort.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <h4 className="font-medium text-kidato-indigo-700 mb-2">Schedule</h4>
                                            <div className="space-y-1 text-sm">
                                                <p>Days: {cohort.repeatSchedule?.daysOfWeek?.join(', ') || 'Not set'}</p>
                                                <p>Time: {cohort.startTime && cohort.endTime ? `${cohort.startTime} - ${cohort.endTime}` : 'Not set'}</p>
                                                <p>Pattern: {cohort.repeatSchedule?.pattern || 'weekly'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-kidato-indigo-700 mb-2">Enrollment</h4>
                                            <div className="space-y-1 text-sm">
                                                <p>Capacity: {cohort.minStudents}-{cohort.maxStudents} students</p>
                                                <p>Status: {cohort.isActive ? 'Active' : 'Inactive'}</p>
                                                {cohort.enrollmentDeadline && (
                                                    <p>Deadline: {new Date(cohort.enrollmentDeadline).toLocaleDateString()}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-kidato-indigo-700 mb-2">Pricing</h4>
                                            <div className="space-y-1 text-sm">
                                                <p>Price: KES {cohort.price || '0'}</p>
                                                {cohort.discount && cohort.discount !== '0' && (
                                                    <p>Discount: {cohort.discount}%</p>
                                                )}
                                                <p>Lessons: {cohort.numberOfLessons}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {cohorts.length > 0 && (
                            <div className="text-center">
                                <Button
                                    onClick={() => setIsCreateDialogOpen(true)}
                                    variant="outline"
                                    className="border-kidato-indigo-200 text-kidato-indigo-700 hover:bg-kidato-indigo-50"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Another Cohort
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-between mt-8">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onPrev}
                        size="lg"
                        className="border-kidato-indigo-200 text-kidato-indigo-700 hover:bg-kidato-indigo-50 hover:border-kidato-indigo-300"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Lessons
                    </Button>
                    <Button
                        type="button"
                        onClick={() => {
                            if (cohorts.length === 0) {
                                toast.error("Please add at least one cohort schedule.");
                                return;
                            }
                            onNext();
                        }}
                        size="lg"
                        className="bg-gradient-to-r from-kidato-indigo-500 to-kidato-orange-500 hover:from-kidato-indigo-600 hover:to-kidato-orange-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                        Review & Publish
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SchedulePricingStep;
