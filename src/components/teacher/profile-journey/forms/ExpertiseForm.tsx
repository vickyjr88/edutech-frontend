import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useProfileJourney } from '../ProfileJourneyContext';
import { BookOpen, Plus, X, Briefcase, Globe, Code, Star, FileText, Sparkles, Award, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cvService } from '@/integrations/api/services/cv.service';
import { useToast } from '@/components/ui/use-toast';
import { TECHNICAL_SKILLS } from '@/components/teacher/professional-profile/utils/technicalSkillUtils';
import { platformService } from '@/integrations/api/services/platform.service';
import { Curriculum } from '@/components/teacher/class-setup/types';
import { AcademicSubjectItem } from '../../professional-profile';

interface ExperienceEntry {
  id: string;
  institution: string;
  position: string;
  subjects: string;
  startYear: string;
  endYear: string;
  description: string;
}

interface LanguageEntry {
  id: string;
  name: string;
  proficiency: string;
  isCertified: boolean;
}

interface SkillEntry {
  id: string;
  name: string;
  description: string;
  level: string;
  isCertified: boolean;
}

interface GeneralSkillEntry {
  id: string;
  name: string;
  description: string;
  level: string;
  isCertified: boolean;
}

interface AcademicSubjectEntry {
  id: string;
  subject: string;
  curriculum: string;
  curriculumName: string;
  isCertified: boolean;
}

interface AfterSchoolSubjectEntry {
  id: string;
  subject: string;
  isCertified: boolean;
}

interface ExpertiseFormProps {
  onComplete: () => void;
}

export const ExpertiseForm = ({ onComplete }: ExpertiseFormProps) => {
  const { 
    experience, 
    setExperience, 
    saveExperience,
    subjects,
    setAcademicSubjects,
    setAfterSchoolSubjects,
    saveSubjects,
    teachingStyle,
    setLanguages,
    saveLanguages,
    setTechnicalSkills,
    saveTechnicalSkills,
    completeStep 
  } = useProfileJourney();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCVPrefill, setShowCVPrefill] = useState(false);
  const [isCVLoading, setIsCVLoading] = useState(false);

  // Local state for form management
  const [experienceEntries, setExperienceEntries] = useState<ExperienceEntry[]>(() => {
    if (experience.length > 0) {
      return experience.map((exp, index) => ({
        id: exp._id || `exp-${index}`,
        institution: exp.institution || '',
        position: exp.position || '',
        subjects: exp.subjects?.join(', ') || '',
        startYear: exp. || '',
        endYear: exp.endYear?.toString() || '',
        description: exp.description || ''
      }));
    }
    return [{
      id: 'exp-1',
      institution: '',
      position: '',
      subjects: '',
      startYear: '',
      endYear: '',
      description: ''
    }];
  });

  const [languageEntries, setLanguageEntries] = useState<LanguageEntry[]>(() => {
    if (teachingStyle.languages.length > 0) {
      return teachingStyle.languages.map((lang, index) => ({
        id: lang._id || `lang-${index}`,
        name: lang.language || '',
        proficiency: lang || 'Beginner',
        isCertified: lang.isCertified || false
      }));
    }
    return [{ id: 'lang-1', name: '', proficiency: 'Beginner', isCertified: false }];
  });

  const [skillEntries, setSkillEntries] = useState<SkillEntry[]>(() => {
    if (teachingStyle.technicalSkills.length > 0) {
      return teachingStyle.technicalSkills.map((skill, index) => ({
        id: skill._id || `skill-${index}`,
        name: skill.name || '',
        description: skill.description || '',
        level: skill.level || 'Beginner',
        isCertified: skill.isCertified || false
      }));
    }
    return [{ id: 'skill-1', name: '', description: '', level: 'Beginner', isCertified: false }];
  });

  const [generalSkillEntries, setGeneralSkillEntries] = useState<GeneralSkillEntry[]>([
    { id: 'general-1', name: '', description: '', level: 'Beginner', isCertified: false }
  ]);

  const [academicSubjectEntries, setAcademicSubjectEntries] = useState<AcademicSubjectEntry[]>([
    { id: 'academic-1', subject: '', curriculum: '', curriculumName: '', isCertified: false }
  ]);

  const [afterSchoolSubjectEntries, setAfterSchoolSubjectEntries] = useState<AfterSchoolSubjectEntry[]>([
    { id: 'afterschool-1', subject: '', isCertified: false }
  ]);

  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [loadingCurriculums, setLoadingCurriculums] = useState(false);

  const [subjectAreas, setSubjectAreas] = useState(() => {
    const academicSubjects = subjects.academic.map(s => s.subject || '').join(', ');
    const afterSchoolSubjects = subjects.afterSchool.map(s => s.subject || '').join(', ');
    return { academic: academicSubjects, afterSchool: afterSchoolSubjects };
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
  const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Native'];
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  // Common general skills for quick add
  const GENERAL_SKILLS = [
    'Leadership', 'Communication', 'Teamwork', 'Problem Solving', 'Critical Thinking',
    'Creativity', 'Time Management', 'Organization', 'Adaptability', 'Public Speaking',
    'Mentoring', 'Conflict Resolution', 'Project Management', 'Research', 'Writing',
    'Event Planning', 'Customer Service', 'Multitasking', 'Decision Making', 'Analytical Thinking'
  ];

  // Load curriculums on component mount
  useEffect(() => {
    const loadCurriculums = async () => {
      setLoadingCurriculums(true);
      try {
        const { data, error } = await platformService.getCurricula();
        if (data && !error) {
          setCurriculums(data);
        }
      } catch (error) {
        console.error('Failed to load curriculums:', error);
      } finally {
        setLoadingCurriculums(false);
      }
    };

    loadCurriculums();
  }, []);

  // Check for CV extracted data on component mount
  useEffect(() => {
    const checkCVData = async () => {
      try {
        const { data: cvData, error } = await cvService.getCVExtractedData();
        if (cvData && (
          (cvData.experience && cvData.experience.length > 0) ||
          (cvData.subjects && cvData.subjects.length > 0) ||
          (cvData.languages && cvData.languages.length > 0) ||
          (cvData.skills && cvData.skills.length > 0)
        )) {
          console.log('CV expertise data found:', {
            experience: cvData.experience?.length || 0,
            subjects: cvData.subjects?.length || 0,
            languages: cvData.languages?.length || 0,
            skills: cvData.skills?.length || 0
          });
          // Show prefill option if CV has relevant data, regardless of existing entries
          // This allows users to overwrite or merge CV data with existing data
          setShowCVPrefill(true);
        }
      } catch (error) {
        console.log('No CV data available for prefill');
      }
    };

    checkCVData();
  }, []);

  // Handle CV prefill
  const handleCVPrefill = async () => {
    setIsCVLoading(true);
    try {
      const { data: cvData, error } = await cvService.getCVExtractedData();
      
      if (error || !cvData) {
        throw new Error('No data found in CV');
      }

      let itemsAdded = 0;

      // Prefill experience
      if (cvData.experience && cvData.experience.length > 0) {
        const cvExperienceEntries: ExperienceEntry[] = cvData.experience.map((exp, index) => ({
          id: `cv-exp-${index}`,
          institution: exp.institution || '',
          position: exp.position || '',
          subjects: exp.subject || '',
          startYear: exp.startYear?.toString() || '',
          endYear: exp.endYear?.toString() || '',
          description: exp.description || ''
        }));
        setExperienceEntries(cvExperienceEntries);
        itemsAdded += cvExperienceEntries.length;
    }

      // Prefill subjects - using isCertified to differentiate academic vs after-school
      if (cvData.subjects && cvData.subjects.length > 0) {
        const academicSubjects = cvData.subjects.filter(s => s.isCertified === true);
        const afterSchoolSubjects = cvData.subjects.filter(s => s.isCertified === false);
        
        // Populate academic subjects with curriculum info from CV
        if (academicSubjects.length > 0) {
          const cvAcademicEntries = academicSubjects.slice(0, 5).map((subject, index) => {
            // Try to match curriculum name with existing curriculums
            let matchedCurriculumId = '';
            let matchedCurriculumName = subject.curriculum || '';
            
            if (subject.curriculum && curriculums.length > 0) {
              const matchedCurriculum = curriculums.find(c => 
                c.name.toLowerCase().includes(subject.curriculum.toLowerCase()) ||
                subject.curriculum.toLowerCase().includes(c.name.toLowerCase()) ||
                (subject.curriculum.toLowerCase().includes('cbc') && c.name.toLowerCase().includes('competency')) ||
                (subject.curriculum.toLowerCase().includes('competency') && c.name.toLowerCase().includes('cbc'))
              );
              
              if (matchedCurriculum) {
                matchedCurriculumId = matchedCurriculum._id;
                matchedCurriculumName = matchedCurriculum.name;
              }
            }
            
            return {
              id: `cv-academic-${index}`,
              subject: subject.subject || '',
              curriculum: matchedCurriculumId,
              curriculumName: matchedCurriculumName,
              isCertified: subject.isCertified || false
            };
          });
          setAcademicSubjectEntries(cvAcademicEntries);
        }
        
        // Populate after-school subjects
        if (afterSchoolSubjects.length > 0) {
          const cvAfterSchoolEntries = afterSchoolSubjects.slice(0, 5).map((subject, index) => ({
            id: `cv-afterschool-${index}`,
            subject: subject.subject || '',
            isCertified: subject.isCertified || false
          }));
          setAfterSchoolSubjectEntries(cvAfterSchoolEntries);
        }
        
        itemsAdded += cvData.subjects.length;
      }

      // Prefill languages
      if (cvData.languages && cvData.languages.length > 0) {
        const cvLanguageEntries = cvData.languages.map((lang, index) => ({
          id: `cv-lang-${index}`,
          name: lang.language || '',
          proficiency: lang.proficiency || 'Intermediate',
          isCertified: false // CV data doesn't specify certification for languages
        }));
        setLanguageEntries(cvLanguageEntries);
        itemsAdded += cvLanguageEntries.length;
      }

      // Prefill skills
      if (cvData.skills && cvData.skills.length > 0) {
        const cvSkillEntries = cvData.skills.map((skill, index) => ({
          id: `cv-skill-${index}`,
          name: skill,
          description: '',
          level: 'Intermediate',
          isCertified: false
        }));
        setSkillEntries(cvSkillEntries);
        itemsAdded += cvSkillEntries.length;
      }

      setShowCVPrefill(false);

      toast({
        title: "Experience & expertise prefilled from CV",
        description: `Added ${itemsAdded} items from your CV`,
      });
    } catch (error) {
      console.error('Error prefilling from CV:', error);
      toast({
        title: "Prefill failed",
        description: "Could not extract experience data from CV",
        variant: "destructive",
      });
    } finally {
      setIsCVLoading(false);
    }
  };

  const handleAddExperience = () => {
    setExperienceEntries([...experienceEntries, {
      id: `exp-${Date.now()}`,
      institution: '',
      position: '',
      subjects: '',
      startYear: '',
      endYear: '',
      description: ''
    }]);
  };

  const handleAddLanguage = () => {
    setLanguageEntries([...languageEntries, {
      id: `lang-${Date.now()}`,
      name: '',
      proficiency: 'Beginner',
      isCertified: false
    }]);
  };

  const handleAddSkill = () => {
    if (skillEntries.length < 4) {
      setSkillEntries([...skillEntries, {
        id: `skill-${Date.now()}`,
        name: '',
        description: '',
        level: 'Beginner',
        isCertified: false
      }]);
    }
  };

  const handleAddGeneralSkill = () => {
    if (generalSkillEntries.length < 3) {
      setGeneralSkillEntries([...generalSkillEntries, {
        id: `general-${Date.now()}`,
        name: '',
        description: '',
        level: 'Beginner',
        isCertified: false
      }]);
    }
  };

  const handleAddAcademicSubject = () => {
    if (academicSubjectEntries.length < 5) {
      setAcademicSubjectEntries([...academicSubjectEntries, {
        id: `academic-${Date.now()}`,
        subject: '',
        curriculum: '',
        curriculumName: '',
        isCertified: false
      }]);
    }
  };

  const handleAddAfterSchoolSubject = () => {
    if (afterSchoolSubjectEntries.length < 5) {
      setAfterSchoolSubjectEntries([...afterSchoolSubjectEntries, {
        id: `afterschool-${Date.now()}`,
        subject: '',
        isCertified: false
      }]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let saveSuccessful = true;
      
      // Process experience entries
      const validExperience = experienceEntries.filter(entry => 
        entry.institution.trim() && entry.position.trim()
      );

      if (validExperience.length > 0) {
        const experienceData = validExperience.map(entry => ({
          _id: entry.id,
          institution: entry.institution,
          position: entry.position,
          institutionType: "" as const, // Fix TypeScript type
          subjects: entry.subjects ? entry.subjects.split(',').map(s => s.trim()).filter(s => s) : [],
          startDate: entry.startYear ? `${entry.startYear}-01-01T00:00:00.000Z` : undefined,
          endDate: entry.endYear ? `${entry.endYear}-12-31T23:59:59.999Z` : undefined,
          isCurrentlyWorking: false, // Default to false
          curriculums: [], // Default empty array
          grades: [], // Default empty array
          reportingManager: undefined, // Default undefined
          additionalDetails: entry.description
        }));
        
        // Update context state for UI consistency
        setExperience(experienceData);
        
        // Save experience via bulk API - pass the data directly
        const experienceSaved = await saveExperience(experienceData);
        if (!experienceSaved) saveSuccessful = false;
      }

      // Process academic subjects with curriculum
      const validAcademicSubjects = academicSubjectEntries.filter(entry => 
        entry.subject.trim() && entry.curriculum.trim()
      );
      const academicSubjectsData:any= validAcademicSubjects.map(entry => ({
        _id: entry.id,
        subject: entry.subject.trim(),
        curriculum: entry.curriculum,
        isAcademic: true
      }));

      // Process after-school subjects
      const validAfterSchoolSubjects = afterSchoolSubjectEntries.filter(entry => 
        entry.subject.trim()
      );
      const afterSchoolSubjectsData = validAfterSchoolSubjects.map(entry => ({
        _id: entry.id,
        subject: entry.subject.trim(),
        isAcademic: false
      }));
      
      if (academicSubjectsData.length > 0 || afterSchoolSubjectsData.length > 0) {
        // Update context state for UI consistency
        setAcademicSubjects(academicSubjectsData);
        setAfterSchoolSubjects(afterSchoolSubjectsData);
        
        // Save subjects via bulk API - pass the data directly
        const subjectsSaved = await saveSubjects(academicSubjectsData, afterSchoolSubjectsData);
        if (!subjectsSaved) saveSuccessful = false;
      }

      // Process languages
      const validLanguages = languageEntries.filter(entry => entry.name.trim());
      if (validLanguages.length > 0) {
        const languageData = validLanguages.map(entry => ({
          _id: entry.id,
          language: entry.name,
          proficiency: entry.proficiency,
          name: entry.name, // For compatibility with LanguageItem type
          isCertified: false // Default value for LanguageItem type
        }));
        
        // Update context state for UI consistency
        setLanguages(languageData);
        
        // Save languages via bulk API - pass the data directly
        const languagesSaved = await saveLanguages(languageData);
        if (!languagesSaved) saveSuccessful = false;
      }

      // Process technical skills
      const validSkills = skillEntries.filter(entry => entry.name.trim());
      if (validSkills.length > 0) {
        const skillData = validSkills.map(entry => ({
          _id: entry.id,
          name: entry.name,
          description: entry.description || '',
          level: entry.level,
          isCertified: entry.isCertified
        }));
        
        // Update context state for UI consistency
        setTechnicalSkills(skillData);
        
        // Save technical skills via bulk API - pass the data directly
        const skillsSaved = await saveTechnicalSkills(skillData);
        if (!skillsSaved) saveSuccessful = false;
      }

      // Process general skills (we'll treat them as technical skills for now, or create a separate API endpoint)
      const validGeneralSkills = generalSkillEntries.filter(entry => entry.name.trim());
      if (validGeneralSkills.length > 0) {
        // For now, we'll combine general skills with technical skills
        // In the future, you might want a separate API endpoint for general skills
        const generalSkillData = validGeneralSkills.map(entry => ({
          _id: entry.id,
          name: entry.name,
          description: entry.description || '',
          level: entry.level,
          isCertified: entry.isCertified
        }));
        
        // Combine with technical skills
        const allSkillData = [...(validSkills.length > 0 ? skillData : []), ...generalSkillData];
        
        // Update context state for UI consistency
        setTechnicalSkills(allSkillData);
        
        // Save combined skills via bulk API
        const allSkillsSaved = await saveTechnicalSkills(allSkillData);
        if (!allSkillsSaved) saveSuccessful = false;
      }

      // Check if form has minimum required data
      const hasRequiredData = validAcademicSubjects.length > 0 || validAfterSchoolSubjects.length > 0 || 
                             validExperience.length > 0 || validLanguages.length > 0 || validSkills.length > 0 || validGeneralSkills.length > 0;

      if (!hasRequiredData) {
        toast({
          title: "Missing data",
          description: "Please fill in at least one area: subjects, experience, languages, or skills",
          variant: "destructive",
        });
        return;
      }

      // Only mark step as complete if all saves were successful
      if (saveSuccessful) {
        completeStep('expertise');
        onComplete();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = academicSubjectEntries.some(e => e.subject.trim() && e.curriculum.trim()) || 
                     afterSchoolSubjectEntries.some(e => e.subject.trim()) ||
                     experienceEntries.some(e => e.institution.trim() && e.position.trim()) ||
                     languageEntries.some(l => l.name.trim()) ||
                     skillEntries.some(s => s.name.trim()) ||
                     generalSkillEntries.some(s => s.name.trim());

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-8 p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Experience & Expertise</h3>
          <p className="text-gray-600">Share your teaching experience, subjects, and skills</p>
        </div>

        {/* CV Prefill Nudge */}
        {showCVPrefill && (
          <div className="mb-6 p-4 bg-gradient-to-br from-[#5c64d4]/10 to-[#fc9323]/10 rounded-2xl border-2 border-dashed border-[#5c64d4]/30">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-[#5c64d4]" />
                <Sparkles className="h-4 w-4 text-[#fc9323] animate-pulse" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">💼 Auto-fill from CV</h4>
              <p className="text-sm text-gray-600 mb-4">
                We found experience, subjects, and skills in your uploaded CV. Would you like to auto-fill this form?
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  type="button"
                  onClick={handleCVPrefill}
                  disabled={isCVLoading}
                  className="bg-gradient-to-r from-[#5c64d4] to-[#fc9323] text-white hover:from-[#5c64d4]/90 hover:to-[#fc9323]/90"
                >
                  {isCVLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Auto-fill Experience
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCVPrefill(false)}
                  className="border-[#5c64d4] text-[#5c64d4] hover:bg-[#5c64d4]/10"
                >
                  Fill manually instead
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Teaching Subjects */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-[#5c64d4]" />
            <h4 className="text-lg font-semibold text-gray-900">Teaching Subjects</h4>
          </div>

          {/* Academic Subjects */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-6 bg-[#5c64d4] rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <Label className="text-lg font-medium text-[#5c64d4]">Academic Subjects (with Curriculum)</Label>
            </div>
            
            {academicSubjectEntries.map((entry, index) => (
              <div key={entry.id} className="p-4 bg-gradient-to-br from-[#5c64d4]/5 to-[#fc9323]/5 rounded-2xl border border-[#5c64d4]/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#5c64d4] to-[#fc9323] rounded-2xl flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-[#5c64d4]">Academic Subject</span>
                  </div>
                  {academicSubjectEntries.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setAcademicSubjectEntries(prev => prev.filter(s => s.id !== entry.id))}
                      className="text-red-500 hover:bg-red-100 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Subject Name *</Label>
                    <Input
                      placeholder="e.g., Mathematics, Science, English"
                      value={entry.subject}
                      onChange={(e) => setAcademicSubjectEntries(prev => prev.map(subject => 
                        subject.id === entry.id ? { ...subject, subject: e.target.value } : subject
                      ))}
                      className="rounded-xl border-[#5c64d4]/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Curriculum *</Label>
                    <Select
                      value={entry.curriculum}
                      onValueChange={(value) => {
                        const selectedCurriculum = curriculums.find(c => c._id === value);
                        setAcademicSubjectEntries(prev => prev.map(subject => 
                          subject.id === entry.id ? { 
                            ...subject, 
                            curriculum: value,
                            curriculumName: selectedCurriculum?.name || ''
                          } : subject
                        ));
                      }}
                      disabled={loadingCurriculums}
                    >
                      <SelectTrigger className="rounded-xl border-[#5c64d4]/20">
                        <SelectValue placeholder={loadingCurriculums ? "Loading..." : "Select curriculum"} />
                      </SelectTrigger>
                      <SelectContent>
                        {curriculums.map(curriculum => (
                          <SelectItem key={curriculum._id} value={curriculum._id}>
                            {curriculum.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`academic-certified-${entry.id}`}
                    checked={entry.isCertified}
                    onCheckedChange={(checked) => setAcademicSubjectEntries(prev => prev.map(subject => 
                      subject.id === entry.id ? { ...subject, isCertified: !!checked } : subject
                    ))}
                    className="border-[#5c64d4]/30"
                  />
                  <Label 
                    htmlFor={`academic-certified-${entry.id}`}
                    className="text-sm font-medium text-[#5c64d4] flex items-center gap-2"
                  >
                    <Award className="h-4 w-4" />
                    I have a certification or professional qualification in this subject
                  </Label>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={handleAddAcademicSubject}
              disabled={academicSubjectEntries.length >= 5}
              className="w-full border-2 border-dashed border-[#5c64d4]/30 text-[#5c64d4] hover:bg-[#5c64d4]/10 rounded-2xl py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Academic Subject ({academicSubjectEntries.length}/5)
            </Button>
          </div>

          {/* After-School Subjects */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-6 bg-[#fc9323] rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">E</span>
              </div>
              <Label className="text-lg font-medium text-[#fc9323]">Extracurricular/After-School Subjects</Label>
            </div>
            
            {afterSchoolSubjectEntries.map((entry, index) => (
              <div key={entry.id} className="p-4 bg-gradient-to-br from-[#fc9323]/5 to-[#5c64d4]/5 rounded-2xl border border-[#fc9323]/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#fc9323] to-[#5c64d4] rounded-2xl flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-[#fc9323]">Extracurricular Subject</span>
                  </div>
                  {afterSchoolSubjectEntries.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setAfterSchoolSubjectEntries(prev => prev.filter(s => s.id !== entry.id))}
                      className="text-red-500 hover:bg-red-100 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Subject Name *</Label>
                    <Input
                      placeholder="e.g., Art, Music, Sports, Coding, Drama"
                      value={entry.subject}
                      onChange={(e) => setAfterSchoolSubjectEntries(prev => prev.map(subject => 
                        subject.id === entry.id ? { ...subject, subject: e.target.value } : subject
                      ))}
                      className="rounded-xl border-[#fc9323]/20"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`afterschool-certified-${entry.id}`}
                      checked={entry.isCertified}
                      onCheckedChange={(checked) => setAfterSchoolSubjectEntries(prev => prev.map(subject => 
                        subject.id === entry.id ? { ...subject, isCertified: !!checked } : subject
                      ))}
                      className="border-[#fc9323]/30"
                    />
                    <Label 
                      htmlFor={`afterschool-certified-${entry.id}`}
                      className="text-sm font-medium text-[#fc9323] flex items-center gap-2"
                    >
                      <Award className="h-4 w-4" />
                      I have a certification or professional qualification in this subject
                    </Label>
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={handleAddAfterSchoolSubject}
              disabled={afterSchoolSubjectEntries.length >= 5}
              className="w-full border-2 border-dashed border-[#fc9323]/30 text-[#fc9323] hover:bg-[#fc9323]/10 rounded-2xl py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Extracurricular Subject ({afterSchoolSubjectEntries.length}/5)
            </Button>
          </div>
        </div>

        {/* Teaching Experience */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Briefcase className="h-6 w-6 text-[#fc9323]" />
            <h4 className="text-lg font-semibold text-gray-900">Teaching Experience</h4>
          </div>
          {experienceEntries.map((entry, index) => (
            <div key={entry.id} className="border-2 border-orange-200 rounded-3xl p-6 bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#fc9323] rounded-2xl flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <span className="font-semibold">Experience Entry</span>
                </div>
                {experienceEntries.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setExperienceEntries(prev => prev.filter(e => e.id !== entry.id))}
                    className="text-red-500 hover:bg-red-100 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  placeholder="Institution/School"
                  value={entry.institution}
                  onChange={(e) => setExperienceEntries(prev => prev.map(exp => 
                    exp.id === entry.id ? { ...exp, institution: e.target.value } : exp
                  ))}
                  className="rounded-xl border-orange-200"
                />
                <Input
                  placeholder="Position/Role"
                  value={entry.position}
                  onChange={(e) => setExperienceEntries(prev => prev.map(exp => 
                    exp.id === entry.id ? { ...exp, position: e.target.value } : exp
                  ))}
                  className="rounded-xl border-orange-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Select
                  value={entry.startYear}
                  onValueChange={(value) => setExperienceEntries(prev => prev.map(exp => 
                    exp.id === entry.id ? { ...exp, startYear: value } : exp
                  ))}
                >
                  <SelectTrigger className="rounded-xl border-orange-200">
                    <SelectValue placeholder="Start Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={entry.endYear}
                  onValueChange={(value) => setExperienceEntries(prev => prev.map(exp => 
                    exp.id === entry.id ? { ...exp, endYear: value } : exp
                  ))}
                >
                  <SelectTrigger className="rounded-xl border-orange-200">
                    <SelectValue placeholder="End Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder="Brief description of your role and achievements..."
                value={entry.description}
                onChange={(e) => setExperienceEntries(prev => prev.map(exp => 
                  exp.id === entry.id ? { ...exp, description: e.target.value } : exp
                ))}
                className="rounded-xl border-orange-200"
                rows={2}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddExperience}
            className="w-full border-2 border-dashed border-orange-300 text-orange-700 hover:bg-orange-50 rounded-2xl py-3"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </div>

        {/* Languages */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Globe className="h-6 w-6 text-blue-600" />
            <h4 className="text-lg font-semibold text-gray-900">Languages</h4>
          </div>
          <div className="space-y-4">
            {languageEntries.map((entry, index) => (
              <div key={entry.id} className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-blue-800">Language</span>
                  </div>
                  {languageEntries.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setLanguageEntries(prev => prev.filter(l => l.id !== entry.id))}
                      className="text-red-500 hover:bg-red-100 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Language *</Label>
                    <Input
                      placeholder="e.g., English, Swahili, French"
                      value={entry.name}
                      onChange={(e) => setLanguageEntries(prev => prev.map(lang => 
                        lang.id === entry.id ? { ...lang, name: e.target.value } : lang
                      ))}
                      className="rounded-xl border-blue-200"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Proficiency Level</Label>
                    <Select
                      value={entry.proficiency}
                      onValueChange={(value) => setLanguageEntries(prev => prev.map(lang => 
                        lang.id === entry.id ? { ...lang, proficiency: value } : lang
                      ))}
                    >
                      <SelectTrigger className="rounded-xl border-blue-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {proficiencyLevels.map(level => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`lang-certified-${entry.id}`}
                    checked={entry.isCertified}
                    onCheckedChange={(checked) => setLanguageEntries(prev => prev.map(lang => 
                      lang.id === entry.id ? { ...lang, isCertified: !!checked } : lang
                    ))}
                    className="border-blue-300"
                  />
                  <Label 
                    htmlFor={`lang-certified-${entry.id}`}
                    className="text-sm font-medium text-blue-800 flex items-center gap-2"
                  >
                    <Award className="h-4 w-4" />
                    I have a certification or professional qualification in this language
                  </Label>
                </div>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleAddLanguage}
            className="border-2 border-dashed border-blue-300 text-blue-700 hover:bg-blue-50 rounded-2xl"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Language
          </Button>
        </div>

        {/* Technical Skills */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Code className="h-6 w-6 text-[#fc9323]" />
            <h4 className="text-lg font-semibold text-gray-900">Technical Skills</h4>
          </div>
          
          {/* Quick Add Common Skills */}
          <div className="p-4 bg-gradient-to-br from-[#fc9323]/10 to-[#5c64d4]/10 rounded-2xl border border-[#fc9323]/30">
            <Label className="text-sm font-medium text-[#fc9323] mb-3 block">Quick Add Popular Technical Skills</Label>
            <div className="flex flex-wrap gap-2">
              {TECHNICAL_SKILLS.slice(0, 12).map((skill) => (
                <Button
                  key={skill}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const exists = skillEntries.some(entry => entry.name.toLowerCase() === skill.toLowerCase());
                    if (!exists && skillEntries.length < 4) {
                      setSkillEntries(prev => [...prev, {
                        id: `skill-${Date.now()}-${Math.random()}`,
                        name: skill,
                        description: '',
                        level: 'Intermediate',
                        isCertified: false
                      }]);
                    }
                  }}
                  className="text-xs border-[#fc9323]/30 text-[#fc9323] hover:bg-[#fc9323]/10"
                  disabled={skillEntries.some(entry => entry.name.toLowerCase() === skill.toLowerCase()) || skillEntries.length >= 4}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {skill}
                </Button>
              ))}
            </div>
          </div>

          {/* Skills List */}
          <div className="space-y-4">
            {skillEntries.map((entry, index) => (
              <div key={entry.id} className="p-4 bg-gradient-to-br from-[#fc9323]/5 to-[#5c64d4]/5 rounded-2xl border border-[#fc9323]/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#fc9323] to-[#5c64d4] rounded-2xl flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-[#fc9323]">Technical Skill</span>
                  </div>
                  {skillEntries.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setSkillEntries(prev => prev.filter(s => s.id !== entry.id))}
                      className="text-red-500 hover:bg-red-100 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Skill Name *</Label>
                    <Input
                      placeholder="e.g., Google Classroom, Zoom, Canva"
                      value={entry.name}
                      onChange={(e) => setSkillEntries(prev => prev.map(skill => 
                        skill.id === entry.id ? { ...skill, name: e.target.value } : skill
                      ))}
                      className="rounded-xl border-[#fc9323]/20"
                      list={`skills-${entry.id}`}
                    />
                    <datalist id={`skills-${entry.id}`}>
                      {TECHNICAL_SKILLS.filter(skill => 
                        skill.toLowerCase().includes(entry.name.toLowerCase()) && 
                        skill.toLowerCase() !== entry.name.toLowerCase()
                      ).slice(0, 10).map(skill => (
                        <option key={skill} value={skill} />
                      ))}
                    </datalist>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Proficiency Level</Label>
                    <Select
                      value={entry.level}
                      onValueChange={(value) => setSkillEntries(prev => prev.map(skill => 
                        skill.id === entry.id ? { ...skill, level: value } : skill
                      ))}
                    >
                      <SelectTrigger className="rounded-xl border-[#fc9323]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {skillLevels.map(level => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Description (Optional)</Label>
                    <Textarea
                      placeholder="Describe your experience with this skill, projects you've used it for, or specific features you're familiar with..."
                      value={entry.description}
                      onChange={(e) => setSkillEntries(prev => prev.map(skill => 
                        skill.id === entry.id ? { ...skill, description: e.target.value } : skill
                      ))}
                      className="rounded-xl border-[#fc9323]/20"
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`certified-${entry.id}`}
                      checked={entry.isCertified}
                      onCheckedChange={(checked) => setSkillEntries(prev => prev.map(skill => 
                        skill.id === entry.id ? { ...skill, isCertified: !!checked } : skill
                      ))}
                      className="border-[#fc9323]/30"
                    />
                    <Label 
                      htmlFor={`certified-${entry.id}`}
                      className="text-sm font-medium text-[#fc9323] flex items-center gap-2"
                    >
                      <Award className="h-4 w-4" />
                      I have a certification or professional qualification in this skill
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleAddSkill}
            disabled={skillEntries.length >= 4}
            className="w-full border-2 border-dashed border-[#fc9323]/30 text-[#fc9323] hover:bg-[#fc9323]/10 rounded-2xl py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Technical Skill ({skillEntries.length}/4)
          </Button>
        </div>

        {/* General Skills */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Lightbulb className="h-6 w-6 text-[#5c64d4]" />
            <h4 className="text-lg font-semibold text-gray-900">General Skills</h4>
          </div>
          
          {/* Quick Add Common General Skills */}
          <div className="p-4 bg-gradient-to-br from-[#5c64d4]/10 to-[#fc9323]/10 rounded-2xl border border-[#5c64d4]/30">
            <Label className="text-sm font-medium text-[#5c64d4] mb-3 block">Quick Add Popular General Skills</Label>
            <div className="flex flex-wrap gap-2">
              {GENERAL_SKILLS.slice(0, 12).map((skill) => (
                <Button
                  key={skill}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const exists = generalSkillEntries.some(entry => entry.name.toLowerCase() === skill.toLowerCase());
                    if (!exists && generalSkillEntries.length < 3) {
                      setGeneralSkillEntries(prev => [...prev, {
                        id: `general-${Date.now()}-${Math.random()}`,
                        name: skill,
                        description: '',
                        level: 'Intermediate',
                        isCertified: false
                      }]);
                    }
                  }}
                  className="text-xs border-[#5c64d4]/30 text-[#5c64d4] hover:bg-[#5c64d4]/10"
                  disabled={generalSkillEntries.some(entry => entry.name.toLowerCase() === skill.toLowerCase()) || generalSkillEntries.length >= 3}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {skill}
                </Button>
              ))}
            </div>
          </div>

          {/* General Skills List */}
          <div className="space-y-4">
            {generalSkillEntries.map((entry, index) => (
              <div key={entry.id} className="p-4 bg-gradient-to-br from-[#5c64d4]/5 to-[#fc9323]/5 rounded-2xl border border-[#5c64d4]/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#5c64d4] to-[#fc9323] rounded-2xl flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-[#5c64d4]">General Skill</span>
                  </div>
                  {generalSkillEntries.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setGeneralSkillEntries(prev => prev.filter(s => s.id !== entry.id))}
                      className="text-red-500 hover:bg-red-100 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Skill Name *</Label>
                    <Input
                      placeholder="e.g., Leadership, Communication, Project Management"
                      value={entry.name}
                      onChange={(e) => setGeneralSkillEntries(prev => prev.map(skill => 
                        skill.id === entry.id ? { ...skill, name: e.target.value } : skill
                      ))}
                      className="rounded-xl border-[#5c64d4]/20"
                      list={`general-skills-${entry.id}`}
                    />
                    <datalist id={`general-skills-${entry.id}`}>
                      {GENERAL_SKILLS.filter(skill => 
                        skill.toLowerCase().includes(entry.name.toLowerCase()) && 
                        skill.toLowerCase() !== entry.name.toLowerCase()
                      ).slice(0, 10).map(skill => (
                        <option key={skill} value={skill} />
                      ))}
                    </datalist>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Proficiency Level</Label>
                    <Select
                      value={entry.level}
                      onValueChange={(value) => setGeneralSkillEntries(prev => prev.map(skill => 
                        skill.id === entry.id ? { ...skill, level: value } : skill
                      ))}
                    >
                      <SelectTrigger className="rounded-xl border-[#5c64d4]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {skillLevels.map(level => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Description (Optional)</Label>
                    <Textarea
                      placeholder="Describe your experience with this skill, examples of how you've applied it, or specific achievements..."
                      value={entry.description}
                      onChange={(e) => setGeneralSkillEntries(prev => prev.map(skill => 
                        skill.id === entry.id ? { ...skill, description: e.target.value } : skill
                      ))}
                      className="rounded-xl border-[#5c64d4]/20"
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`general-certified-${entry.id}`}
                      checked={entry.isCertified}
                      onCheckedChange={(checked) => setGeneralSkillEntries(prev => prev.map(skill => 
                        skill.id === entry.id ? { ...skill, isCertified: !!checked } : skill
                      ))}
                      className="border-[#5c64d4]/30"
                    />
                    <Label 
                      htmlFor={`general-certified-${entry.id}`}
                      className="text-sm font-medium text-[#5c64d4] flex items-center gap-2"
                    >
                      <Award className="h-4 w-4" />
                      I have a certification or professional qualification in this skill
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleAddGeneralSkill}
            disabled={generalSkillEntries.length >= 3}
            className="w-full border-2 border-dashed border-[#5c64d4]/30 text-[#5c64d4] hover:bg-[#5c64d4]/10 rounded-2xl py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another General Skill ({generalSkillEntries.length}/3)
          </Button>
        </div>

        <div className="flex justify-center pt-6">
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={cn(
              "px-12 py-4 font-semibold rounded-2xl text-lg shadow-xl transition-all duration-300",
              isFormValid 
                ? "bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white hover:shadow-2xl hover:scale-105" 
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