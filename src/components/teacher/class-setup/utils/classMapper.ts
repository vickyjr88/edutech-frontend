import { ClassFormValues, CohortData } from "../types";
import { getApiRepeatPatternValue } from "./repeatPatternUtils";

// Helper to check if string is a valid MongoDB ObjectId
const isValidObjectId = (id: string): boolean => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};

export const mapFormValuesToCreateClassDto = (
    formValues: ClassFormValues,
    cohorts: CohortData[],
    teacherId?: string
) => {
    return {
        // Only include teacher field if provided (usually for new classes)
        ...(teacherId ? { teacher: teacherId } : {}),

        title: formValues.title,
        type: formValues.type,
        subject: formValues.subject,
        curriculum: formValues.curriculum || undefined,
        curriculumLevel: formValues.curriculumLevel || undefined,
        gradeLevel: formValues.type === "academic" ? formValues.gradeLevel : undefined,
        ageRange: formValues.type === "afterschool" ? formValues.ageRange : undefined,
        description: formValues.description || undefined,
        numberOfLessons: Number(formValues.numberOfLessons) || 1,
        isPublic: formValues.isPublic,
        enableMultipleCohorts: formValues.hasCohorts,
        enableTeamTeaching: formValues.hasTeamTeaching,
        isPublished: formValues.isPublished,

        // Transform Technical Requirements
        technicalRequirements: formValues.technicalRequirements
            ? formValues.technicalRequirements.split('\n')
                .filter(req => req.trim() !== '')
                .map(req => ({ requirement: req.trim() }))
            : undefined,

        // Transform Materials
        materials: formValues.materialsRequired
            ? formValues.materialsRequired.split('\n')
                .filter(mat => mat.trim() !== '')
                .map(mat => ({ name: mat.trim() }))
            : undefined,

        commitment: formValues.commitmentRequired || undefined,

        // Transform Lesson Plans
        lessonPlans: formValues.lessonPlans?.map((plan, index) => {
            if (plan.id && isValidObjectId(plan.id)) {
                return plan.id;
            }

            return {
                title: plan.title || `Lesson ${index + 1}`,
                description: plan.description || "",
                lessonNumber: index + 1,
                duration: Number(plan.duration) || 60,
                // resourceUtils handled elsewhere or ignored for now
            };
        }) || [],

        // Transform Cohorts - STRICT WHITELIST
        cohorts: cohorts.map(cohort => {
            const daysOfWeek = (cohort.repeatSchedule?.daysOfWeek || []).map(day => day.toLowerCase());

            return {
                // Include _id field only if it exists (for existing cohorts)
                ...(cohort._id && isValidObjectId(cohort._id) ? { _id: cohort._id } : {}),
                name: cohort.name,
                isActive: cohort.isActive ?? true,
                startDate: cohort.startDate ? new Date(cohort.startDate) : undefined,
                endDate: cohort.endDate ? new Date(cohort.endDate) : undefined,
                startTime: cohort.startTime || "09:00",
                endTime: cohort.endTime || "10:00",
                repeatPattern: getApiRepeatPatternValue(cohort.repeatSchedule?.pattern || "weekly"),
                daysOfWeek,
                customLessonTimes: !!cohort.hasFlexibleSchedule,
                minimumStudents: Number(cohort.minStudents) || 1,
                maximumStudents: Number(cohort.maxStudents) || 20,
                price: Number(cohort.price) || 0,
                discount: Number(cohort.discount) || 0,
                enrollmentDeadline: cohort.enrollmentDeadline ? new Date(cohort.enrollmentDeadline) : null,
                createdBy: teacherId,
                weeklySchedule: daysOfWeek.map(day => ({
                    dayOfWeek: day,
                    startTime: cohort.startTime || "09:00",
                    endTime: cohort.endTime || "10:00"
                }))
            };
        }),

        // Default empty teaching team for now
        teachingTeam: []
    };
};

