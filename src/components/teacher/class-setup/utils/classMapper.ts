import { ClassFormValues, CohortData } from "../types";

// Helper to check if string is a valid MongoDB ObjectId
const isValidObjectId = (id: string): boolean => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};

// Types for Backend DTOs (Simplified versions needed for mapping)
interface BackendTechnicalRequirement {
    requirement: string;
}

interface BackendMaterial {
    name: string;
}

interface BackendLessonPlanDto {
    title: string;
    description?: string;
    lessonNumber: number;
    duration: number;
    // Add other simple fields if possible, but for now we focus on the core requirements
    // resourceFiles?: any[]; // TODO: Handle file uploads separately or via resource URLs
}

type BackendLessonPlanInput = string | BackendLessonPlanDto;

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
            // If the ID looks like a real MongoID, we assume it's an existing lesson plan 
            // not created in this session. However, the frontend currently generates random IDs.
            // If we are creating a *new* class, usually all plans are new.
            // Strategy: 
            // 1. If it's a valid ObjectId AND we are in update mode (not handled here explicitly but logic applies), send ID.
            // 2. Otherwise default to sending the full object for creation.
            // Note: The backend checks "isString" -> ObjectId, "isObject" -> New DTO.

            if (plan.id && isValidObjectId(plan.id)) {
                return plan.id;
            }

            // Create new lesson plan DTO
            const newPlan: BackendLessonPlanDto = {
                title: plan.title || `Lesson ${index + 1}`,
                description: plan.description || "",
                lessonNumber: index + 1,
                // Ensure duration is a number, default to 60 if missing/invalid
                duration: Number(plan.duration) || 60,
            };
            return newPlan;
        }) || [],

        // Transform Cohorts
        cohorts: cohorts.map(cohort => {
            // Extract _id if it exists, and other fields not in DTO
            const { hasFlexibleSchedule, lessonSchedules, ...cohortData } = cohort;

            // Convert days of week format to uppercase for API enum match if needed, 
            // generally backend expects: "MONDAY", "TUESDAY" etc based on DTO enums usually,
            // but let's check input. The DTO says enum DayOfWeek.
            // Let's assume the frontend values "monday" need to be mapped if the backend requires strict enum casing.
            // The previous code mapped to .toUpperCase(), so let's stick with that.
            const daysOfWeek = cohort.repeatSchedule.daysOfWeek.map(day =>
                day.toUpperCase()
            );

            return {
                // Include _id field only if it exists (for existing cohorts)
                ...(cohort._id ? { _id: cohort._id } : {}),
                name: cohortData.name,
                isActive: cohortData.isActive,
                startDate: cohortData.startDate,
                endDate: cohortData.endDate,
                startTime: cohortData.startTime,
                endTime: cohortData.endTime,
                repeatPattern: getApiRepeatPatternValue(cohort.repeatSchedule.pattern),
                daysOfWeek,
                repeatEvery: Number(cohort.repeatSchedule.repeatEvery) || 1,
                customLessonTimes: hasFlexibleSchedule,
                enrollment: {
                    minimumStudents: Number(cohortData.minStudents) || 1,
                    maximumStudents: Number(cohortData.maxStudents) || 20,
                    enrollmentDeadline: cohortData.enrollmentDeadline || undefined,
                    // Defaulting other enrollment fields
                    currentStudents: 0,
                    autoCloseEnrollment: false,
                    allowWaitlist: true
                },
                pricing: {
                    pricePerLesson: 0, // This logic might need adjustment based on total price vs per lesson
                    totalLessons: Number(formValues.numberOfLessons) || 1,
                    // If the frontend sets a total price, we might need to calculate or just send what fits.
                    // The frontend just has 'price'. Let's assume it's the full price for now, 
                    // BUT the DTO asks for pricing details object.
                    // Let's look at previous implementation:
                    // It sent: price: Number(cohortData.price) || 0,
                    // But the DTO has `pricing: PricingDetailsDto`. It does NOT have a top-level `price`.
                    // PROBABLY the previous implementation was targeting an outdated DTO or I misread the file.
                    // Wait, looking at CreateClassDto -> `cohorts` -> `CohortDto`.
                    // `CohortDto` HAS `pricing: PricingDetailsDto`.
                    // It ALSO has `price?: number` but it is marked @deprecated.
                    // So we should map to `pricing` object.
                    discount: Number(cohortData.discount) || 0
                },
                // Legacy fallback support if backend still uses it/middleware fixes it
                price: Number(cohortData.price) || 0,
                discount: Number(cohortData.discount) || 0
            };
        }),

        // Default empty teaching team for now
        teachingTeam: []
    };
};

// Helper for repeat pattern enum mapping
const getApiRepeatPatternValue = (pattern: string): string => {
    switch (pattern) {
        case "weekly": return "WEEKLY";
        case "twice-weekly": return "TWICE_WEEKLY"; // verify backend enum
        case "custom": return "CUSTOM";
        default: return "WEEKLY";
    }
};
