/**
 * Hook for accessing centralized teaching configuration data
 * 
 * Provides easy access to:
 * - Curricula options
 * - Subject options  
 * - Grade level options
 * 
 * With caching and loading states
 */

import { useState, useEffect, useCallback } from 'react';
import { teachingConfigService, TeachingOption, TeachingCurriculum, TeachingSubject, TeachingGradeLevel } from '../integrations/api/services/teaching-config.service';

interface UseTeachingConfigResult {
    // Data
    curricula: TeachingOption[];
    subjects: TeachingOption[];
    gradeLevels: TeachingOption[];

    // Grouped data
    subjectsByCategory: Record<string, TeachingOption[]>;
    gradeLevelsByLevel: Record<string, TeachingOption[]>;

    // Raw data
    rawCurricula: TeachingCurriculum[];
    rawSubjects: TeachingSubject[];
    rawGradeLevels: TeachingGradeLevel[];

    // States
    isLoading: boolean;
    error: string | null;

    // Actions
    refresh: () => Promise<void>;

    // Helpers
    getCurriculumName: (code: string) => string;
    getSubjectName: (code: string) => string;
    getGradeLevelName: (code: string) => string;
}

// Cache for teaching config data
let cachedData: {
    curricula: TeachingOption[];
    subjects: TeachingOption[];
    gradeLevels: TeachingOption[];
    subjectsByCategory: Record<string, TeachingOption[]>;
    gradeLevelsByLevel: Record<string, TeachingOption[]>;
    rawCurricula: TeachingCurriculum[];
    rawSubjects: TeachingSubject[];
    rawGradeLevels: TeachingGradeLevel[];
    timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Promise cache to prevent redundant simultaneous fetches
let pendingLoadPromise: Promise<any> | null = null;

export function useTeachingConfig(): UseTeachingConfigResult {
    const [curricula, setCurricula] = useState<TeachingOption[]>([]);
    const [subjects, setSubjects] = useState<TeachingOption[]>([]);
    const [gradeLevels, setGradeLevels] = useState<TeachingOption[]>([]);
    const [subjectsByCategory, setSubjectsByCategory] = useState<Record<string, TeachingOption[]>>({});
    const [gradeLevelsByLevel, setGradeLevelsByLevel] = useState<Record<string, TeachingOption[]>>({});
    const [rawCurricula, setRawCurricula] = useState<TeachingCurriculum[]>([]);
    const [rawSubjects, setRawSubjects] = useState<TeachingSubject[]>([]);
    const [rawGradeLevels, setRawGradeLevels] = useState<TeachingGradeLevel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async (forceRefresh = false) => {
        // Check cache first
        if (
            !forceRefresh &&
            cachedData &&
            Date.now() - cachedData.timestamp < CACHE_DURATION
        ) {
            setCurricula(cachedData.curricula);
            setSubjects(cachedData.subjects);
            setGradeLevels(cachedData.gradeLevels);
            setSubjectsByCategory(cachedData.subjectsByCategory);
            setGradeLevelsByLevel(cachedData.gradeLevelsByLevel);
            setRawCurricula(cachedData.rawCurricula);
            setRawSubjects(cachedData.rawSubjects);
            setRawGradeLevels(cachedData.rawGradeLevels);
            setIsLoading(false);
            return;
        }

        // If there's already a fetch in progress, wait for it
        if (pendingLoadPromise && !forceRefresh) {
            try {
                await pendingLoadPromise;
                // After it finishes, it will have updated cachedData
                if (cachedData) {
                    setCurricula(cachedData.curricula);
                    setSubjects(cachedData.subjects);
                    setGradeLevels(cachedData.gradeLevels);
                    setSubjectsByCategory(cachedData.subjectsByCategory);
                    setGradeLevelsByLevel(cachedData.gradeLevelsByLevel);
                    setRawCurricula(cachedData.rawCurricula);
                    setRawSubjects(cachedData.rawSubjects);
                    setRawGradeLevels(cachedData.rawGradeLevels);
                    setIsLoading(false);
                }
                return;
            } catch (err) {
                // If the pending promise failed, we'll try again below
            }
        }

        try {
            setIsLoading(true);
            setError(null);

            // Create the new promise and store it globally
            pendingLoadPromise = (async () => {
                // Fetch basic data in parallel
                const [
                    curriculaResponse,
                    subjectsResponse,
                    gradeLevelsResponse,
                ] = await Promise.all([
                    teachingConfigService.getActiveCurricula(),
                    teachingConfigService.getActiveSubjects(),
                    teachingConfigService.getActiveGradeLevels(),
                ]);

                const rawCurriculaData = curriculaResponse.data || [];
                const rawSubjectsData = subjectsResponse.data || [];
                const rawGradeLevelsData = gradeLevelsResponse.data || [];

                // Convert to options
                const curriculaOptions = rawCurriculaData.map(c => ({
                    value: c.code,
                    label: c.name,
                    description: c.description,
                }));

                const subjectsOptions = rawSubjectsData.map(s => ({
                    value: s.code,
                    label: s.name,
                    description: s.description,
                    group: s.category,
                }));

                const gradeLevelsOptions = rawGradeLevelsData.map(g => ({
                    value: g.code,
                    label: `${g.name}${g.ageRange ? ` (${g.ageRange})` : ''}`,
                    description: g.description,
                    group: g.level,
                }));

                // Process grouped data manually to avoid redundant API calls
                const subjectsByCategoryData: Record<string, TeachingOption[]> = {
                    core: [],
                    elective: [],
                    optional: []
                };

                rawSubjectsData.forEach(subject => {
                    const option: TeachingOption = {
                        value: subject.code,
                        label: subject.name,
                        description: subject.description
                    };
                    if (subject.category && subjectsByCategoryData[subject.category]) {
                        subjectsByCategoryData[subject.category].push(option);
                    } else {
                        if (!subjectsByCategoryData['other']) subjectsByCategoryData['other'] = [];
                        subjectsByCategoryData['other'].push(option);
                    }
                });

                const gradeLevelsByLevelData: Record<string, TeachingOption[]> = {
                    primary: [],
                    secondary: [],
                    advanced: []
                };

                rawGradeLevelsData.forEach(grade => {
                    const option: TeachingOption = {
                        value: grade.code,
                        label: grade.name,
                        description: grade.description
                    };
                    if (grade.level && gradeLevelsByLevelData[grade.level]) {
                        gradeLevelsByLevelData[grade.level].push(option);
                    } else {
                        if (!gradeLevelsByLevelData['other']) gradeLevelsByLevelData['other'] = [];
                        gradeLevelsByLevelData['other'].push(option);
                    }
                });

                // Update cache
                cachedData = {
                    curricula: curriculaOptions,
                    subjects: subjectsOptions,
                    gradeLevels: gradeLevelsOptions,
                    subjectsByCategory: subjectsByCategoryData,
                    gradeLevelsByLevel: gradeLevelsByLevelData,
                    rawCurricula: rawCurriculaData,
                    rawSubjects: rawSubjectsData,
                    rawGradeLevels: rawGradeLevelsData,
                    timestamp: Date.now(),
                };

                return cachedData;
            })();

            const data = await pendingLoadPromise;

            // Update state
            setCurricula(data.curricula);
            setSubjects(data.subjects);
            setGradeLevels(data.gradeLevels);
            setSubjectsByCategory(data.subjectsByCategory);
            setGradeLevelsByLevel(data.gradeLevelsByLevel);
            setRawCurricula(data.rawCurricula);
            setRawSubjects(data.rawSubjects);
            setRawGradeLevels(data.rawGradeLevels);

        } catch (err) {
            console.error('Failed to load teaching config:', err);
            setError('Failed to load teaching configuration');
        } finally {
            pendingLoadPromise = null;
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Helper functions
    const getCurriculumName = useCallback(
        (code: string) => {
            const curriculum = rawCurricula.find(c => c.code === code);
            return curriculum?.name || code;
        },
        [rawCurricula]
    );

    const getSubjectName = useCallback(
        (code: string) => {
            const subject = rawSubjects.find(s => s.code === code);
            return subject?.name || code;
        },
        [rawSubjects]
    );

    const getGradeLevelName = useCallback(
        (code: string) => {
            const gradeLevel = rawGradeLevels.find(g => g.code === code);
            return gradeLevel?.name || code;
        },
        [rawGradeLevels]
    );

    const refresh = useCallback(() => loadData(true), [loadData]);

    return {
        curricula,
        subjects,
        gradeLevels,
        subjectsByCategory,
        gradeLevelsByLevel,
        rawCurricula,
        rawSubjects,
        rawGradeLevels,
        isLoading,
        error,
        refresh,
        getCurriculumName,
        getSubjectName,
        getGradeLevelName,
    };
}

export default useTeachingConfig;
