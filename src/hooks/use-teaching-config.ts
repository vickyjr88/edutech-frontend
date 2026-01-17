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

        try {
            setIsLoading(true);
            setError(null);

            // Fetch all data in parallel
            const [
                curriculaResponse,
                subjectsResponse,
                gradeLevelsResponse,
                subjectsByCategoryData,
                gradeLevelsByLevelData,
            ] = await Promise.all([
                teachingConfigService.getActiveCurricula(),
                teachingConfigService.getActiveSubjects(),
                teachingConfigService.getActiveGradeLevels(),
                teachingConfigService.getSubjectsGroupedByCategory(),
                teachingConfigService.getGradeLevelsGroupedByLevel(),
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

            // Update state
            setCurricula(curriculaOptions);
            setSubjects(subjectsOptions);
            setGradeLevels(gradeLevelsOptions);
            setSubjectsByCategory(subjectsByCategoryData);
            setGradeLevelsByLevel(gradeLevelsByLevelData);
            setRawCurricula(rawCurriculaData);
            setRawSubjects(rawSubjectsData);
            setRawGradeLevels(rawGradeLevelsData);

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
        } catch (err) {
            console.error('Failed to load teaching config:', err);
            setError('Failed to load teaching configuration');
        } finally {
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
