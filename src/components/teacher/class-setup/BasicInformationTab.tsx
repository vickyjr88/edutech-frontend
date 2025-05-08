import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { BookOpen, List, Loader2, AlertTriangle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ClassFormValues, Curriculum, CurriculumLevel, Subject, curriculaMap, curriculumLevelMap, subjectsMap } from "./types";
import { Label } from "@/components/ui/label";
import { platformService } from "@/integrations/api";

// Mock data for fallback if API fails
const mockCurricula: Curriculum[] = [
  {
    "id": "cbc",
    "name": "Competency-Based Curriculum (CBC)",
    "description": "2-6-3-3-3 system focusing on skills development and practical competencies",
    "levels": [
      {
        "id": "pre-primary",
        "name": "Pre-Primary",
        "gradeRange": "PP1-PP2",
        "ageRange": "4-5"
      },
      {
        "id": "lower-primary",
        "name": "Lower Primary",
        "gradeRange": "Grades 1-3",
        "ageRange": "6-8"
      },
      {
        "id": "upper-primary",
        "name": "Upper Primary",
        "gradeRange": "Grades 4-6",
        "ageRange": "9-11"
      },
      {
        "id": "junior-secondary",
        "name": "Junior Secondary School",
        "gradeRange": "Grades 7-9",
        "ageRange": "12-14"
      },
      {
        "id": "senior-secondary",
        "name": "Senior Secondary School",
        "gradeRange": "Grades 10-12",
        "ageRange": "15-17"
      }
    ]
  },
  {
    "id": "british",
    "name": "British Curriculum (IGCSE / A-Levels)",
    "description": "Key Stages 1-5 focusing on critical thinking and global academic standards",
    "levels": [
      {
        "id": "key-stage-1",
        "name": "Key Stage 1",
        "gradeRange": "Years 1-2",
        "ageRange": "5-7"
      },
      {
        "id": "key-stage-2",
        "name": "Key Stage 2",
        "gradeRange": "Years 3-6",
        "ageRange": "7-11"
      },
      {
        "id": "key-stage-3",
        "name": "Key Stage 3",
        "gradeRange": "Years 7-9",
        "ageRange": "11-14"
      },
      {
        "id": "key-stage-4",
        "name": "Key Stage 4 (IGCSE)",
        "gradeRange": "Years 10-11",
        "ageRange": "14-16"
      },
      {
        "id": "a-levels",
        "name": "A-Levels",
        "gradeRange": "Years 12-13",
        "ageRange": "16-18"
      }
    ]
  },
  {
    "id": "ib",
    "name": "International Baccalaureate (IB)",
    "description": "Inquiry-based learning focusing on global citizenship and independent learning",
    "levels": [
      {
        "id": "pyp",
        "name": "Primary Years Programme (PYP)",
        "gradeRange": "Pre-K to Grade 5",
        "ageRange": "3-12"
      },
      {
        "id": "myp",
        "name": "Middle Years Programme (MYP)",
        "gradeRange": "Grades 6-10",
        "ageRange": "11-16"
      },
      {
        "id": "dp",
        "name": "Diploma Programme (DP)",
        "gradeRange": "Grades 11-12",
        "ageRange": "16-19"
      }
    ]
  }
];

interface BasicInformationTabProps {
  form: UseFormReturn<ClassFormValues>;
  onNextTab: () => void;
}

const BasicInformationTab = ({ form, onNextTab }: BasicInformationTabProps) => {
  const classType = form.watch("type");
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [levels, setLevels] = useState<CurriculumLevel[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingCurricula, setLoadingCurricula] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCurriculum = form.watch("curriculum");
  const selectedLevel = form.watch("curriculumLevel");

  // Fetch curricula on component mount
  useEffect(() => {
    const fetchCurricula = async () => {
      setLoadingCurricula(true);
      setError(null);
      
      try {
        // Get curricula from platform service
        const { data, error } = await platformService.getCurricula();
        
        let curriculaData: Curriculum[] = [];
        
        if (error || !data) {
          console.error("API fetch failed, using mock data instead:", error);
          curriculaData = mockCurricula;
          setError("Using mock data - API error: " + (error?.message || "Unknown error"));
        } else if (Array.isArray(data)) {
          if (data.length === 0) {
            console.warn("API returned empty curricula array, using mock data");
            curriculaData = mockCurricula;
            setError("No curriculum data available - using mock data");
          } else {
            curriculaData = data;
            
            // Check if the data structure matches what we expect
            const validData = data.every(item => 
              item && typeof item === 'object' && 'id' in item && 'name' in item
            );
            
            if (!validData) {
              console.warn("API returned invalid curriculum structure, converting to expected format");
              
              // Try to convert the data to our expected format if possible
              if (typeof data[0] === 'string') {
                // Handle string array case
                curriculaData = mockCurricula.map((mockCurriculum, index) => ({
                  ...mockCurriculum,
                  name: data[index] || mockCurriculum.name,
                }));
              } else {
                curriculaData = mockCurricula;
              }
              
              setError("Invalid API response format - using converted data");
            }
          }
        } else {
          console.log("API response is not an array, using mock data instead:", data);
          curriculaData = mockCurricula;
          setError("Invalid API response - using mock data");
        }
        
        console.log("Final curriculum data:", curriculaData);
        setCurricula(curriculaData);
        
        // Clear existing maps before populating
        Object.keys(curriculaMap).forEach(key => delete curriculaMap[key]);
        Object.keys(curriculumLevelMap).forEach(key => delete curriculumLevelMap[key]);
        
        // Populate the curriculum maps for lookup
        curriculaData.forEach((curriculum: Curriculum) => {
          curriculaMap[curriculum.id] = curriculum;
          
          // Make sure levels is an array before iterating
          if (Array.isArray(curriculum.levels)) {
            curriculum.levels.forEach((level: CurriculumLevel) => {
              curriculumLevelMap[level.id] = level;
            });
          }
        });
      } catch (err) {
        console.error("Error processing curricula:", err);
        setError("Failed to load curriculum data - using mock data");
        setCurricula(mockCurricula);
      } finally {
        setLoadingCurricula(false);
      }
    };

    fetchCurricula();
  }, []);

  // Update levels when selected curriculum changes
  useEffect(() => {
    if (selectedCurriculum) {
      const curriculum = curricula.find(c => c.id === selectedCurriculum);
      if (curriculum) {
        setLevels(curriculum.levels);
      } else {
        setLevels([]);
      }
      
      // Reset curriculum level and subject when curriculum changes
      form.setValue("curriculumLevel", "");
      form.setValue("subject", "");
      
      // Clear subjects when curriculum changes
      setSubjects([]);
    } else {
      setLevels([]);
      setSubjects([]);
    }
  }, [selectedCurriculum, curricula, form]);
  
  // Fetch subjects when curriculum level changes
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedCurriculum || !selectedLevel) {
        setSubjects([]);
        return;
      }
      
      setLoadingSubjects(true);
      
      try {
        const { data, error } = await platformService.getLevelSubjects(selectedCurriculum, selectedLevel);
        
        if (error || !data) {
          console.error("Error fetching subjects:", error);
          setSubjects([]);
        } else {
          // Handle both array of strings and array of objects
          if (Array.isArray(data)) {
            if (data.length > 0 && typeof data[0] === 'string') {
              // Convert strings to Subject objects
              const subjectObjects = data.map((name, index) => ({
                id: `${selectedCurriculum}_${selectedLevel}_${index}`,
                name,
                curriculumId: selectedCurriculum,
                levelId: selectedLevel
              }));
              setSubjects(subjectObjects);
              
              // Clear existing subjects in map
              Object.keys(subjectsMap).forEach(key => delete subjectsMap[key]);
              
              // Populate subjects map
              subjectObjects.forEach(subject => {
                subjectsMap[subject.id] = subject;
              });
            } else {
              // Assume we got proper Subject objects
              setSubjects(data);
              
              // Clear existing subjects in map
              Object.keys(subjectsMap).forEach(key => delete subjectsMap[key]);
              
              // Populate subjects map
              data.forEach(subject => {
                if (subject.id) {
                  subjectsMap[subject.id] = subject;
                }
              });
            }
          } else {
            setSubjects([]);
          }
          
          // Reset subject when level changes
          form.setValue("subject", "");
        }
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    };
    
    fetchSubjects();
  }, [selectedCurriculum, selectedLevel, form]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || "academic"}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem key="academic" value="academic">Academic</SelectItem>
                  <SelectItem key="afterschool" value="afterschool">After School</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the type of class you are creating.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="curriculum"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Curriculum</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value || ""}
                disabled={loadingCurricula}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select curriculum" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {loadingCurricula ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Loading curricula...</span>
                    </div>
                  ) : error ? (
                    <>
                      <div className="text-amber-500 p-2 text-sm flex items-start">
                        <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                      {/* Still show the curricula even with errors */}
                      {curricula.map((curriculum) => (
                        <SelectItem key={curriculum.id} value={curriculum.id}>
                          {curriculum.name}
                        </SelectItem>
                      ))}
                    </>
                  ) : curricula.length === 0 ? (
                    <div className="p-2 text-sm text-gray-500">
                      No curricula available
                    </div>
                  ) : (
                    curricula.map((curriculum) => (
                      <SelectItem key={curriculum.id} value={curriculum.id}>
                        {curriculum.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the curriculum used in this class.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="curriculumLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value || ""}
                disabled={!selectedCurriculum || levels.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !selectedCurriculum 
                        ? "Select curriculum first" 
                        : levels.length === 0 
                          ? "No levels available" 
                          : "Select level"
                    } />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name} ({level.gradeRange})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the level within the chosen curriculum.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value || ""}
                disabled={!selectedCurriculum || !selectedLevel || loadingSubjects}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !selectedCurriculum 
                        ? "Select curriculum first" 
                        : !selectedLevel 
                          ? "Select level first" 
                          : loadingSubjects 
                            ? "Loading subjects..." 
                            : subjects.length === 0 
                              ? "No subjects available" 
                              : "Select subject"
                    } />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {loadingSubjects ? (
                    <div key="loading-subjects" className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Loading subjects...</span>
                    </div>
                  ) : subjects.length === 0 ? (
                    <div key="no-subjects" className="p-2 text-sm text-gray-500">
                      {!selectedCurriculum 
                        ? "Select a curriculum first" 
                        : !selectedLevel 
                          ? "Select a level first" 
                          : "No subjects available for this level"}
                    </div>
                  ) : (
                    <>
                      {selectedCurriculum && selectedLevel && (
                        <div key="subjects-header" className="px-2 py-1.5 text-xs text-gray-500 border-b">
                          {curriculaMap[selectedCurriculum]?.name || selectedCurriculum}: {curriculumLevelMap[selectedLevel]?.name || selectedLevel}
                        </div>
                      )}
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                      {subjects.length > 0 && subjects.length < 5 && (
                        <div key="subjects-note" className="p-2 text-xs text-amber-500 flex items-start border-t">
                          <AlertTriangle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                          <span>Limited subjects available - select the closest match</span>
                        </div>
                      )}
                    </>
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the subject for this class.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="lg:col-span-3">
              <FormLabel>Class Title</FormLabel>
              <Input placeholder="Enter a catchy class title" {...field} />
              <FormDescription>
                Enter a descriptive title for the class.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {classType === "academic" ? (
          <FormField
            control={form.control}
            name="gradeLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "grade1"}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem key="grade1" value="grade1">1st Grade</SelectItem>
                    <SelectItem key="grade2" value="grade2">2nd Grade</SelectItem>
                    <SelectItem key="grade3" value="grade3">3rd Grade</SelectItem>
                    <SelectItem key="grade4" value="grade4">4th Grade</SelectItem>
                    <SelectItem key="grade5" value="grade5">5th Grade</SelectItem>
                    <SelectItem key="grade6" value="grade6">6th Grade</SelectItem>
                    <SelectItem key="grade7" value="grade7">7th Grade</SelectItem>
                    <SelectItem key="grade8" value="grade8">8th Grade</SelectItem>
                    <SelectItem key="grade9" value="grade9">9th Grade</SelectItem>
                    <SelectItem key="grade10" value="grade10">10th Grade</SelectItem>
                    <SelectItem key="grade11" value="grade11">11th Grade</SelectItem>
                    <SelectItem key="grade12" value="grade12">12th Grade</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the grade level for this class.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="ageRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age Range</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "age3-5"}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem key="age3-5" value="age3-5">3-5 years</SelectItem>
                    <SelectItem key="age6-8" value="age6-8">6-8 years</SelectItem>
                    <SelectItem key="age9-11" value="age9-11">9-11 years</SelectItem>
                    <SelectItem key="age12-14" value="age12-14">12-14 years</SelectItem>
                    <SelectItem key="age15-18" value="age15-18">15-18 years</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the age range for this after-school class.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <FormField
        control={form.control}
        name="summary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Class Summary</FormLabel>
            <Textarea
              placeholder="Write a brief summary of the class"
              className="resize-none"
              {...field}
            />
            <FormDescription>
              Write a brief summary of the class (max 200 characters).
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Detailed Description</FormLabel>
            <Textarea
              placeholder="Write a detailed description of the class"
              className="resize-none"
              {...field}
            />
            <FormDescription>
              Write a detailed description of the class.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <List className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-medium">Technical Requirements</h3>
        </div>
        <FormField
          control={form.control}
          name="technicalRequirements"
          render={({ field }) => (
            <FormItem>
              <Textarea
                placeholder="Enter each technical requirement on a new line (internet, devices, etc.)"
                className="resize-none"
                {...field}
              />
              <FormDescription>
                List any technical requirements students will need, one per line.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <List className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-medium">Materials Required</h3>
        </div>
        <FormField
          control={form.control}
          name="materialsRequired"
          render={({ field }) => (
            <FormItem>
              <Textarea
                placeholder="Enter each required material on a new line"
                className="resize-none"
                {...field}
              />
              <FormDescription>
                List any materials students will need for the class, one per line.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="commitmentRequired"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Commitment Required</FormLabel>
            <Textarea
              placeholder="Specify the commitment required (days/weeks/months)"
              className="resize-none"
              {...field}
            />
            <FormDescription>
              Specify the time commitment required for this class.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="numberOfLessons"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Lessons</FormLabel>
            <Input 
              type="number" 
              min="1" 
              placeholder="Enter the number of lessons" 
              {...field}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  field.onChange(value);
                } else {
                  field.onChange(1); // Default to 1 if input is invalid
                }
              }}
            />
            <FormDescription>
              Set the total number of lessons for this class.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4 border rounded-lg p-4">
        <h3 className="text-lg font-medium">Class Settings</h3>
        
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Public Class</FormLabel>
                <FormDescription>
                  Make this class visible to all students in the catalog. If disabled, the class will only be visible to invited students.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="hasCohorts">Multiple Cohorts</Label>
              <FormDescription>
                Enable multiple cohorts to run different sessions of this class with different schedules and groups of students.
              </FormDescription>
            </div>
            <FormField
              control={form.control}
              name="hasCohorts"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                      id="hasCohorts"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="hasTeamTeaching"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Team Teaching</FormLabel>
                <FormDescription>
                  Enable team teaching to collaborate with other teachers on this class. You'll be able to invite co-teachers in the Teaching Team tab.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      <div className="flex justify-between pt-4">
        <div></div>
        <Button type="button" variant="outline" onClick={onNextTab}>
          Next: Lesson Plans
        </Button>
      </div>
    </div>
  );
};

export default BasicInformationTab;
