import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProfileJourney } from '../ProfileJourneyContext';
import { GraduationCap, Plus, X, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  isCompleted: boolean;
}

interface EducationFormProps {
  onComplete: () => void;
}

export const EducationForm = ({ onComplete }: EducationFormProps) => {
  const { education, setEducation, completeStep } = useProfileJourney();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Convert existing education to local state format
  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>(() => {
    if (education.length > 0) {
      return education.map((edu, index) => ({
        id: edu.id || `edu-${index}`,
        institution: edu.institution || '',
        degree: edu.degree || '',
        fieldOfStudy: edu.fieldOfStudy || '',
        startYear: edu.startYear?.toString() || '',
        endYear: edu.endYear?.toString() || '',
        isCompleted: edu.isCompleted || false
      }));
    }
    return [{
      id: 'edu-1',
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startYear: '',
      endYear: '',
      isCompleted: false
    }];
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const degreeTypes = [
    'High School Diploma',
    'Certificate',
    'Diploma',
    "Bachelor's Degree",
    "Master's Degree",
    'PhD/Doctorate',
    'Professional Certification',
    'Other'
  ];

  const handleAddEducation = () => {
    const newEntry: EducationEntry = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startYear: '',
      endYear: '',
      isCompleted: false
    };
    setEducationEntries([...educationEntries, newEntry]);
  };

  const handleRemoveEducation = (id: string) => {
    const filtered = educationEntries.filter(entry => entry.id !== id);
    if (filtered.length === 0) {
      setEducationEntries([{
        id: 'edu-1',
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startYear: '',
        endYear: '',
        isCompleted: false
      }]);
    } else {
      setEducationEntries(filtered);
    }
  };

  const handleEducationChange = (id: string, field: keyof EducationEntry, value: string | boolean) => {
    setEducationEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Filter out empty entries and validate
      const validEntries = educationEntries.filter(entry => 
        entry.institution.trim() && entry.degree.trim()
      );

      if (validEntries.length === 0) {
        alert('Please add at least one education entry with institution and degree');
        return;
      }

      // Convert to the format expected by the context
      const educationData = validEntries.map(entry => ({
        id: entry.id,
        institution: entry.institution,
        degree: entry.degree,
        fieldOfStudy: entry.fieldOfStudy,
        startYear: entry.startYear ? parseInt(entry.startYear) : undefined,
        endYear: entry.endYear ? parseInt(entry.endYear) : undefined,
        isCompleted: entry.isCompleted
      }));

      // Update the context
      setEducation(educationData);
      
      // Mark step as complete
      completeStep('education');
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = educationEntries.some(entry => 
    entry.institution.trim() && entry.degree.trim()
  );

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#5c64d4] to-[#acb4e4] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Educational Background</h3>
          <p className="text-gray-600">Add your college and high school education</p>
        </div>

        <div className="space-y-6">
          {educationEntries.map((entry, index) => (
            <div key={entry.id} className="border-2 border-[#acb4e4] rounded-3xl p-6 space-y-4 bg-gradient-to-br from-[#efebf0] to-[#acb4e4]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#5c64d4] rounded-2xl flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <h4 className="font-semibold text-gray-900">Education Entry</h4>
                </div>
                {educationEntries.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveEducation(entry.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`institution-${entry.id}`} className="text-sm font-medium">Institution *</Label>
                  <Input
                    id={`institution-${entry.id}`}
                    value={entry.institution}
                    onChange={(e) => handleEducationChange(entry.id, 'institution', e.target.value)}
                    placeholder="University of Nairobi"
                    className="rounded-xl border-[#acb4e4] focus:border-[#5c64d4]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`degree-${entry.id}`} className="text-sm font-medium">Degree/Qualification *</Label>
                  <Select
                    value={entry.degree}
                    onValueChange={(value) => handleEducationChange(entry.id, 'degree', value)}
                  >
                    <SelectTrigger className="rounded-xl border-[#acb4e4] focus:border-[#5c64d4]">
                      <SelectValue placeholder="Select degree type" />
                    </SelectTrigger>
                    <SelectContent>
                      {degreeTypes.map((degree) => (
                        <SelectItem key={degree} value={degree}>
                          {degree}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`fieldOfStudy-${entry.id}`} className="text-sm font-medium">Field of Study</Label>
                <Input
                  id={`fieldOfStudy-${entry.id}`}
                  value={entry.fieldOfStudy}
                  onChange={(e) => handleEducationChange(entry.id, 'fieldOfStudy', e.target.value)}
                  placeholder="Computer Science, Mathematics, Education, etc."
                  className="rounded-xl border-[#acb4e4] focus:border-[#5c64d4]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`startYear-${entry.id}`} className="text-sm font-medium">Start Year</Label>
                  <Select
                    value={entry.startYear}
                    onValueChange={(value) => handleEducationChange(entry.id, 'startYear', value)}
                  >
                    <SelectTrigger className="rounded-xl border-[#acb4e4]">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`endYear-${entry.id}`} className="text-sm font-medium">End Year</Label>
                  <Select
                    value={entry.endYear}
                    onValueChange={(value) => handleEducationChange(entry.id, 'endYear', value)}
                  >
                    <SelectTrigger className="rounded-xl border-[#acb4e4]">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 flex items-end">
                  <div className="flex items-center space-x-2 h-10">
                    <input
                      type="checkbox"
                      id={`completed-${entry.id}`}
                      checked={entry.isCompleted}
                      onChange={(e) => handleEducationChange(entry.id, 'isCompleted', e.target.checked)}
                      className="w-4 h-4 text-green-600 rounded border-green-300 focus:ring-green-500"
                    />
                    <Label htmlFor={`completed-${entry.id}`} className="text-sm font-medium">
                      Completed
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleAddEducation}
          className="w-full flex items-center gap-2 border-2 border-dashed border-[#acb4e4] text-[#5c64d4] hover:text-[#5c64d4] hover:bg-[#efebf0] rounded-2xl py-4"
        >
          <Plus className="h-5 w-5" />
          Add Another Education Entry
        </Button>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-3xl border border-blue-200">
          <div className="flex items-start gap-3">
            <BookOpen className="h-6 w-6 text-[#5c64d4] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[#5c64d4] mb-2">Education Tips</h4>
              <p className="text-sm text-gray-700">
                Include both your college/university education and high school. Add relevant certifications, 
                training programs, or professional development courses that relate to teaching.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-6">
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={cn(
              "px-12 py-4 font-semibold rounded-2xl text-lg shadow-xl transition-all duration-300",
              isFormValid 
                ? "bg-gradient-to-r from-[#5c64d4] to-[#acb4e4] hover:from-[#5c64d4] hover:to-[#acb4e4] text-white hover:shadow-2xl hover:scale-105" 
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