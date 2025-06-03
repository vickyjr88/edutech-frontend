import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProfileJourney } from '../ProfileJourneyContext';
import { BookOpen, Plus, X, Briefcase, Globe, Code, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

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
}

interface SkillEntry {
  id: string;
  name: string;
  level: string;
}

interface ExpertiseFormProps {
  onComplete: () => void;
}

export const ExpertiseForm = ({ onComplete }: ExpertiseFormProps) => {
  const { 
    experience, 
    setExperience, 
    subjects,
    setAcademicSubjects,
    setAfterSchoolSubjects,
    teachingStyle,
    setLanguages,
    setTechnicalSkills,
    completeStep 
  } = useProfileJourney();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local state for form management
  const [experienceEntries, setExperienceEntries] = useState<ExperienceEntry[]>(() => {
    if (experience.length > 0) {
      return experience.map((exp, index) => ({
        id: exp.id || `exp-${index}`,
        institution: exp.institution || '',
        position: exp.position || '',
        subjects: exp.subjects?.join(', ') || '',
        startYear: exp.startYear?.toString() || '',
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
        id: lang.id || `lang-${index}`,
        name: lang.language || '',
        proficiency: lang.proficiency || 'Beginner'
      }));
    }
    return [{ id: 'lang-1', name: '', proficiency: 'Beginner' }];
  });

  const [skillEntries, setSkillEntries] = useState<SkillEntry[]>(() => {
    if (teachingStyle.technicalSkills.length > 0) {
      return teachingStyle.technicalSkills.map((skill, index) => ({
        id: skill.id || `skill-${index}`,
        name: skill.skill || '',
        level: skill.level || 'Beginner'
      }));
    }
    return [{ id: 'skill-1', name: '', level: 'Beginner' }];
  });

  const [subjectAreas, setSubjectAreas] = useState(() => {
    const academicSubjects = subjects.academic.map(s => s.name).join(', ');
    const afterSchoolSubjects = subjects.afterSchool.map(s => s.name).join(', ');
    return { academic: academicSubjects, afterSchool: afterSchoolSubjects };
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
  const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Native'];
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

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
      proficiency: 'Beginner'
    }]);
  };

  const handleAddSkill = () => {
    setSkillEntries([...skillEntries, {
      id: `skill-${Date.now()}`,
      name: '',
      level: 'Beginner'
    }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Process experience entries
      const validExperience = experienceEntries.filter(entry => 
        entry.institution.trim() && entry.position.trim()
      );

      if (validExperience.length > 0) {
        const experienceData = validExperience.map(entry => ({
          id: entry.id,
          institution: entry.institution,
          position: entry.position,
          subjects: entry.subjects ? entry.subjects.split(',').map(s => s.trim()).filter(s => s) : [],
          startYear: entry.startYear ? parseInt(entry.startYear) : undefined,
          endYear: entry.endYear ? parseInt(entry.endYear) : undefined,
          description: entry.description
        }));
        setExperience(experienceData);
      }

      // Process subject areas
      if (subjectAreas.academic.trim()) {
        const academicSubjects = subjectAreas.academic.split(',').map(name => ({
          id: `academic-${Date.now()}-${Math.random()}`,
          name: name.trim(),
          isAcademic: true
        }));
        setAcademicSubjects(academicSubjects);
      }

      if (subjectAreas.afterSchool.trim()) {
        const afterSchoolSubjects = subjectAreas.afterSchool.split(',').map(name => ({
          id: `afterschool-${Date.now()}-${Math.random()}`,
          name: name.trim(),
          isAcademic: false
        }));
        setAfterSchoolSubjects(afterSchoolSubjects);
      }

      // Process languages
      const validLanguages = languageEntries.filter(entry => entry.name.trim());
      if (validLanguages.length > 0) {
        const languageData = validLanguages.map(entry => ({
          id: entry.id,
          language: entry.name,
          proficiency: entry.proficiency
        }));
        setLanguages(languageData);
      }

      // Process technical skills
      const validSkills = skillEntries.filter(entry => entry.name.trim());
      if (validSkills.length > 0) {
        const skillData = validSkills.map(entry => ({
          id: entry.id,
          skill: entry.name,
          level: entry.level
        }));
        setTechnicalSkills(skillData);
      }

      // Check if form has minimum required data
      const hasRequiredData = subjectAreas.academic.trim() || subjectAreas.afterSchool.trim() || 
                             validExperience.length > 0 || validLanguages.length > 0 || validSkills.length > 0;

      if (!hasRequiredData) {
        alert('Please fill in at least one area: subjects, experience, languages, or skills');
        return;
      }

      // Mark step as complete
      completeStep('expertise');
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = subjectAreas.academic.trim() || subjectAreas.afterSchool.trim() || 
                     experienceEntries.some(e => e.institution.trim() && e.position.trim()) ||
                     languageEntries.some(l => l.name.trim()) ||
                     skillEntries.some(s => s.name.trim());

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

        {/* Subject Areas */}
        <div className="bg-gradient-to-br from-[#acb4e4] to-[#efebf0] p-6 rounded-3xl border-2 border-[#5c64d4]/20">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-6 w-6 text-[#5c64d4]" />
            <h4 className="text-lg font-semibold text-gray-900">Teaching Subjects</h4>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Academic Subjects</Label>
              <Input
                value={subjectAreas.academic}
                onChange={(e) => setSubjectAreas(prev => ({ ...prev, academic: e.target.value }))}
                placeholder="Mathematics, Science, English, History, etc."
                className="rounded-xl border-[#5c64d4]/30 focus:border-[#5c64d4]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">After-School/Extracurricular Subjects</Label>
              <Input
                value={subjectAreas.afterSchool}
                onChange={(e) => setSubjectAreas(prev => ({ ...prev, afterSchool: e.target.value }))}
                placeholder="Art, Music, Sports, Coding, Drama, etc."
                className="rounded-xl border-[#5c64d4]/30 focus:border-[#5c64d4]"
              />
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {languageEntries.map((entry, index) => (
              <div key={entry.id} className="flex gap-2 items-center p-4 bg-blue-50 rounded-2xl border border-blue-200">
                <Input
                  placeholder="Language"
                  value={entry.name}
                  onChange={(e) => setLanguageEntries(prev => prev.map(lang => 
                    lang.id === entry.id ? { ...lang, name: e.target.value } : lang
                  ))}
                  className="rounded-xl border-blue-200"
                />
                <Select
                  value={entry.proficiency}
                  onValueChange={(value) => setLanguageEntries(prev => prev.map(lang => 
                    lang.id === entry.id ? { ...lang, proficiency: value } : lang
                  ))}
                >
                  <SelectTrigger className="rounded-xl border-blue-200 w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {proficiencyLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            <Code className="h-6 w-6 text-green-600" />
            <h4 className="text-lg font-semibold text-gray-900">Technical Skills</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillEntries.map((entry, index) => (
              <div key={entry.id} className="flex gap-2 items-center p-4 bg-green-50 rounded-2xl border border-green-200">
                <Input
                  placeholder="Skill (e.g., Zoom, Google Classroom)"
                  value={entry.name}
                  onChange={(e) => setSkillEntries(prev => prev.map(skill => 
                    skill.id === entry.id ? { ...skill, name: e.target.value } : skill
                  ))}
                  className="rounded-xl border-green-200"
                />
                <Select
                  value={entry.level}
                  onValueChange={(value) => setSkillEntries(prev => prev.map(skill => 
                    skill.id === entry.id ? { ...skill, level: value } : skill
                  ))}
                >
                  <SelectTrigger className="rounded-xl border-green-200 w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {skillLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleAddSkill}
            className="border-2 border-dashed border-green-300 text-green-700 hover:bg-green-50 rounded-2xl"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
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