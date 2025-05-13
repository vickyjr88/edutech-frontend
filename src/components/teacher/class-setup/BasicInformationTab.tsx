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
import { useClassForm } from "./ClassFormContext";
import { getCachedCurricula, getCachedSubjects } from "./utils/apiCache";

// Mock data for fallback if API fails
const mockCurricula: Curriculum[] = [
  {
    "_id": "681eedf557273be1ad816aeb",
    "code": "cbc",
    "name": "Competency-Based Curriculum (CBC)",
    "description": "2-6-3-3-3 system focusing on skills development and practical competencies",
    "levels": [
      {
        "code": "pre-primary",
        "name": "Pre-Primary",
        "gradeRange": "PP1-PP2",
        "ageRange": "4-5",
        "subjects": [
          "Language Activities (English and Kiswahili)",
          "Mathematical Activities",
          "Environmental Activities",
          "Psychomotor and Creative Activities",
          "Religious Education Activities"
        ]
      },
      {
        "code": "lower-primary",
        "name": "Lower Primary",
        "gradeRange": "Grades 1-3",
        "ageRange": "6-8",
        "subjects": [
          "English",
          "Kiswahili / Kenyan Sign Language",
          "Mathematics",
          "Environmental Activities",
          "Hygiene and Nutrition",
          "Movement and Creative Activities",
          "Religious Education",
          "Indigenous Language",
          "Pastoral Programme of Instruction"
        ]
      },
      {
        "code": "upper-primary",
        "name": "Upper Primary",
        "gradeRange": "Grades 4-6",
        "ageRange": "9-11",
        "subjects": [
          "English",
          "Kiswahili / Kenyan Sign Language",
          "Mathematics",
          "Science and Technology",
          "Social Studies",
          "Home Science",
          "Agriculture",
          "Religious Education",
          "Art and Craft",
          "Music",
          "Physical and Health Education",
          "Indigenous Language",
          "ICT",
          "Pastoral Programme of Instruction"
        ]
      },
      {
        "code": "junior-secondary",
        "name": "Junior Secondary School",
        "gradeRange": "Grades 7-9",
        "ageRange": "12-14",
        "subjects": [
          "English",
          "Kiswahili / Kenyan Sign Language",
          "Mathematics",
          "Integrated Science",
          "Social Studies",
          "Pre-Technical and Pre-Career Education",
          "Religious Education",
          "Business Studies",
          "Agriculture",
          "Life Skills Education",
          "Sports and Physical Education",
          "Health Education",
          "Computer Science",
          "Indigenous Language / Foreign Language",
          "Creative Arts"
        ]
      },
      {
        "code": "senior-secondary",
        "name": "Senior Secondary School",
        "gradeRange": "Grades 10-12",
        "ageRange": "15-17",
        "subjects": {
          "core": [
            "English",
            "Kiswahili / KSL",
            "Life Skills",
            "Health Education",
            "Community Service Learning"
          ],
          "pathways": {
            "stem": [
              "Mathematics",
              "Biology",
              "Chemistry",
              "Physics",
              "Technical subjects"
            ],
            "social-sciences": [
              "History",
              "Religious Education",
              "Business Studies",
              "Geography",
              "Foreign / Indigenous Languages",
              "Community Service Learning"
            ],
            "arts-sports": [
              "Performing Arts",
              "Visual Arts",
              "Music",
              "Sports Science",
              "Physical Education"
            ]
          }
        }
      }
    ]
  },
  {
    "_id": "681eec6c57273be1ad816ae9",
    "code": "british",
    "name": "British Curriculum (IGCSE / A-Levels)",
    "description": "Key Stages 1-5 focusing on critical thinking and global academic standards",
    "levels": [
      {
        "code": "key-stage-1",
        "name": "Key Stage 1",
        "gradeRange": "Years 1-2",
        "ageRange": "5-7",
        "subjects": [
          "English",
          "Mathematics",
          "Science",
          "Design and Technology",
          "History",
          "Geography",
          "Art and Design",
          "Music",
          "Physical Education",
          "Computing",
          "PSHE"
        ]
      },
      {
        "code": "key-stage-2",
        "name": "Key Stage 2",
        "gradeRange": "Years 3-6",
        "ageRange": "7-11",
        "subjects": [
          "English",
          "Mathematics",
          "Science",
          "Design and Technology",
          "History",
          "Geography",
          "Art and Design",
          "Music",
          "Physical Education",
          "Computing",
          "PSHE",
          "Modern Foreign Language"
        ]
      },
      {
        "code": "key-stage-3",
        "name": "Key Stage 3",
        "gradeRange": "Years 7-9",
        "ageRange": "11-14",
        "subjects": [
          "English",
          "Mathematics",
          "Science",
          "History",
          "Geography",
          "Modern Foreign Language",
          "Design and Technology",
          "Art and Design",
          "Music",
          "Physical Education",
          "Computing",
          "PSHE"
        ]
      },
      {
        "code": "key-stage-4",
        "name": "Key Stage 4 (IGCSE)",
        "gradeRange": "Years 10-11",
        "ageRange": "14-16",
        "subjects": {
          "core": [
            "English Language",
            "English Literature",
            "Mathematics",
            "Combined Science or Separate Sciences"
          ],
          "foundation": [
            "History",
            "Geography",
            "Modern Foreign Language"
          ],
          "electives": [
            "Art & Design",
            "Music",
            "PE",
            "Business Studies",
            "Computer Science",
            "Religious Studies",
            "Drama",
            "Design Technology"
          ],
          "non-exam": [
            "Physical Education",
            "Religious Education",
            "PSHE/Citizenship"
          ]
        }
      },
      {
        "code": "a-levels",
        "name": "A-Levels",
        "gradeRange": "Years 12-13",
        "ageRange": "16-18",
        "subjects": {
          "stem": [
            "Mathematics",
            "Further Mathematics",
            "Physics",
            "Chemistry",
            "Biology",
            "Computer Science",
            "Design & Technology"
          ],
          "humanities": [
            "History",
            "Geography",
            "Economics",
            "Psychology",
            "Sociology",
            "Global Perspectives & Research"
          ],
          "languages": [
            "English Literature",
            "English Language",
            "French",
            "Spanish",
            "Kiswahili"
          ],
          "arts": [
            "Art & Design",
            "Music",
            "Drama & Theatre Studies",
            "Media Studies"
          ],
          "business": [
            "Business Studies",
            "Accounting",
            "Law",
            "Politics"
          ]
        }
      }
    ]
  },
  {
    "_id": "681eeee257273be1ad816aed",
    "code": "ib",
    "name": "International Baccalaureate (IB)",
    "description": "Inquiry-based learning focusing on global citizenship and independent learning",
    "levels": [
      {
        "code": "pyp",
        "name": "Primary Years Programme (PYP)",
        "gradeRange": "Pre-K to Grade 5",
        "ageRange": "3-12",
        "subjects": [
          "Language",
          "Mathematics",
          "Science",
          "Social Studies",
          "Arts",
          "Personal, Social, and Physical Education"
        ]
      },
      {
        "code": "myp",
        "name": "Middle Years Programme (MYP)",
        "gradeRange": "Grades 6-10",
        "ageRange": "11-16",
        "subjects": [
          "Language and Literature",
          "Language Acquisition",
          "Individuals and Societies",
          "Sciences",
          "Mathematics",
          "Arts",
          "Physical and Health Education",
          "Design"
        ]
      },
      {
        "code": "dp",
        "name": "Diploma Programme (DP)",
        "gradeRange": "Grades 11-12",
        "ageRange": "16-19",
        "subjects": {
          "group1": [
            "Studies in Language and Literature"
          ],
          "group2": [
            "Language Acquisition"
          ],
          "group3": [
            "Individuals and Societies"
          ],
          "group4": [
            "Sciences"
          ],
          "group5": [
            "Mathematics"
          ],
          "group6": [
            "The Arts"
          ],
          "core": [
            "Extended Essay",
            "Theory of Knowledge",
            "Creativity, Activity, Service"
          ]
        }
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
  const { isSubmitting, saveBasicInfoAndContinue } = useClassForm();

  const selectedCurriculum = form.watch("curriculum");
  const selectedLevel = form.watch("curriculumLevel");

  // Fetch curricula on component mount
  useEffect(() => {
    const fetchCurricula = async () => {
      setLoadingCurricula(true);
      setError(null);

      try {
        // Get curricula using the caching utility
        const { data, error } = await getCachedCurricula(() => platformService.getCurricula());

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
            // Check if the data structure matches what we expect in the new format
            const validData = data.every(item =>
              item && typeof item === 'object' &&
              (('_id' in item && 'code' in item && 'name' in item) ||
              ('id' in item && 'name' in item)) // Support both old and new format
            );

            if (validData) {
              curriculaData = data;
              console.log("Using valid API response data:", curriculaData);
            } else {
              console.warn("API returned invalid curriculum structure, using mock data");
              curriculaData = mockCurricula;
              setError("Invalid API response format - using mock data");
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
          // Support both old (id) and new (_id/code) formats
          const curriculumId = curriculum._id || curriculum.code || curriculum.id || "";
          curriculaMap[curriculumId] = curriculum;

          // Make sure levels is an array before iterating
          if (Array.isArray(curriculum.levels)) {
            curriculum.levels.forEach((level: CurriculumLevel) => {
              const levelId = level.code || level.id || "";
              curriculumLevelMap[levelId] = level;
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
      // Find curriculum by id, code, or _id to support both old and new formats
      const curriculum = curricula.find(c =>
        c.code === selectedCurriculum ||
        c._id === selectedCurriculum ||
        c.id === selectedCurriculum
      );

      if (curriculum) {
        setLevels(curriculum.levels);
      } else {
        setLevels([]);
      }

      // Only reset curriculum level and subject if this is a change and not initial page load
      const initialSubject = form.getValues("subject");
      const initialLevel = form.getValues("curriculumLevel");

      // Only clear if the user is changing the curriculum and we don't have initial values
      if (!initialSubject || !initialLevel) {
        form.setValue("curriculumLevel", "");
        form.setValue("subject", "");

        // Clear subjects when curriculum changes
        setSubjects([]);
      }
    } else {
      setLevels([]);
      setSubjects([]);
    }
  }, [selectedCurriculum, curricula, form]);
  
  // Get subjects directly from the curriculum level data or fetch from API
  useEffect(() => {
    const getSubjects = async () => {
      if (!selectedCurriculum || !selectedLevel) {
        setSubjects([]);
        return;
      }

      // Get current subject value
      const currentSubjectValue = form.getValues("subject");
      const isInitialLoad = !!currentSubjectValue && subjects.length === 0;

      setLoadingSubjects(true);

      try {
        // First try to get subjects from the curriculum level data
        const level = curriculumLevelMap[selectedLevel];

        if (level && level.subjects) {
          // Handle different subject formats
          if (Array.isArray(level.subjects)) {
            // Convert string array to Subject objects
            const subjectObjects = level.subjects.map((name, index) => ({
              id: `${selectedCurriculum}_${selectedLevel}_${index}`,
              name,
              curriculumId: selectedCurriculum,
              levelId: selectedLevel
            }));

            // Clear existing subjects in map
            Object.keys(subjectsMap).forEach(key => delete subjectsMap[key]);

            // Populate subjects map
            subjectObjects.forEach(subject => {
              subjectsMap[subject.id] = subject;
            });

            setSubjects(subjectObjects);
          } else {
            // Handle object structure (category groupings)
            const subjectGroupings = level.subjects;
            const flattenedSubjects: Subject[] = [];
            let index = 0;

            // Function to recursively extract subjects from nested structure
            const extractSubjects = (obj: any, groupName: string = "") => {
              Object.entries(obj).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                  // This is a category with an array of subjects
                  value.forEach((name: string) => {
                    const categoryPrefix = groupName ? `${groupName} - ` : "";
                    const displayName = categoryPrefix ? `${categoryPrefix}${name}` : name;
                    const subject = {
                      id: `${selectedCurriculum}_${selectedLevel}_${key}_${index++}`,
                      name: displayName,
                      category: key,
                      curriculumId: selectedCurriculum,
                      levelId: selectedLevel
                    };
                    flattenedSubjects.push(subject);
                    subjectsMap[subject.id] = subject;
                  });
                } else if (typeof value === 'object' && value !== null) {
                  // This is a nested object, recurse
                  extractSubjects(value, key);
                }
              });
            };

            // Clear existing subjects in map
            Object.keys(subjectsMap).forEach(key => delete subjectsMap[key]);

            // Extract subjects from the nested structure
            extractSubjects(subjectGroupings);
            setSubjects(flattenedSubjects);
          }
        } else {
          // If no subjects in level data, try the API using the caching utility
          const { data, error } = await getCachedSubjects(() =>
            platformService.getLevelSubjects(selectedCurriculum, selectedLevel)
          );

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
          }
        }

        // Only reset subject if this is a user change and not an initial load
        if (!isInitialLoad && !currentSubjectValue) {
          form.setValue("subject", "");
        }
      } catch (err) {
        console.error("Error processing subjects:", err);
        setSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    };

    getSubjects();
  }, [selectedCurriculum, selectedLevel, form, subjects.length]);

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
                        <SelectItem key={curriculum._id || curriculum.code || curriculum.id}
                                   value={curriculum.code || curriculum._id || curriculum.id}>
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
                      <SelectItem key={curriculum._id || curriculum.code || curriculum.id}
                                 value={curriculum.code || curriculum._id || curriculum.id}>
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
                    <SelectItem key={level.code || level.id} value={level.code || level.id}>
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
            render={({ field }) => {
              // Parse grade range from selected curriculum level
              const selectedLevel = curriculumLevelMap[selectedCurriculum ? form.watch("curriculumLevel") : ""];
              const gradeRange = selectedLevel?.gradeRange || "";
              
              // Parse grade range into an array of grades
              const getGradesFromRange = (range: string): string[] => {
                // Check for common patterns like "Grades 1-3", "Years 3-6", "Grade 6", etc.
                const rangeMatch = range.match(/(?:Grades?|Years?)\s+(\d+)(?:\s*-\s*(\d+))?/i);
                
                if (rangeMatch) {
                  const start = parseInt(rangeMatch[1]);
                  const end = rangeMatch[2] ? parseInt(rangeMatch[2]) : start;
                  
                  if (!isNaN(start) && !isNaN(end)) {
                    const grades = [];
                    for (let i = start; i <= end; i++) {
                      grades.push(`grade${i}`);
                    }
                    return grades;
                  }
                }
                
                // Fallback for other formats or when parsing fails
                return ["grade1", "grade2", "grade3", "grade4", "grade5", "grade6", 
                        "grade7", "grade8", "grade9", "grade10", "grade11", "grade12"];
              };
              
              const relevantGrades = getGradesFromRange(gradeRange);
              
              // Set a default value if current value is not in the relevant grades
              useEffect(() => {
                if (field.value && !relevantGrades.includes(field.value)) {
                  form.setValue("gradeLevel", relevantGrades[0] || "grade1");
                }
              }, [relevantGrades, field.value]);
              
              return (
                <FormItem>
                  <FormLabel>Grade Level</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || relevantGrades[0] || "grade1"}
                    disabled={!selectedLevel}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={selectedLevel ? "Select grade level" : "Select curriculum level first"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedLevel ? (
                        relevantGrades.length > 0 ? (
                          relevantGrades.map((grade) => {
                            const gradeNum = grade.replace('grade', '');
                            const ordinal = 
                              gradeNum === '1' ? '1st' : 
                              gradeNum === '2' ? '2nd' : 
                              gradeNum === '3' ? '3rd' : 
                              `${gradeNum}th`;
                            
                            return (
                              <SelectItem key={grade} value={grade}>
                                {ordinal} Grade
                              </SelectItem>
                            );
                          })
                        ) : (
                          <div className="p-2 text-sm text-gray-500">
                            No grades available for this level
                          </div>
                        )
                      ) : (
                        <div className="p-2 text-sm text-gray-500">
                          Select a curriculum level first
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the grade level for this class.
                    {selectedLevel && (
                      <span className="text-xs text-gray-500 block mt-1">
                        Range: {selectedLevel.gradeRange || "Not specified"}
                      </span>
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        ) : (
          <FormField
            control={form.control}
            name="ageRange"
            render={({ field }) => {
              // Parse age range from selected curriculum level
              const selectedLevel = curriculumLevelMap[selectedCurriculum ? form.watch("curriculumLevel") : ""];
              const ageRangeStr = selectedLevel?.ageRange || "";
              
              // Parse age range into an array of standard age ranges
              const getAgeRangesFromRange = (range: string): string[] => {
                // Check for common patterns like "4-5", "6-8", "9-11", etc.
                const rangeMatch = range.match(/(\d+)(?:\s*-\s*(\d+))?/);
                
                if (rangeMatch) {
                  const start = parseInt(rangeMatch[1]);
                  const end = rangeMatch[2] ? parseInt(rangeMatch[2]) : start;
                  
                  if (!isNaN(start) && !isNaN(end)) {
                    // Map the custom range to predefined age ranges
                    const standardRanges = [];
                    if (start <= 5 && end >= 3) standardRanges.push("age3-5");
                    if (start <= 8 && end >= 6) standardRanges.push("age6-8");
                    if (start <= 11 && end >= 9) standardRanges.push("age9-11");
                    if (start <= 14 && end >= 12) standardRanges.push("age12-14");
                    if (start <= 18 && end >= 15) standardRanges.push("age15-18");
                    
                    if (standardRanges.length > 0) {
                      return standardRanges;
                    }
                  }
                }
                
                // Fallback for when parsing fails
                return ["age3-5", "age6-8", "age9-11", "age12-14", "age15-18"];
              };
              
              const relevantAgeRanges = getAgeRangesFromRange(ageRangeStr);
              
              // Set a default value if current value is not in the relevant age ranges
              useEffect(() => {
                if (field.value && !relevantAgeRanges.includes(field.value)) {
                  form.setValue("ageRange", relevantAgeRanges[0] || "age3-5");
                }
              }, [relevantAgeRanges, field.value]);
              
              // Map for display values
              const ageRangeDisplay = {
                "age3-5": "3-5 years",
                "age6-8": "6-8 years",
                "age9-11": "9-11 years",
                "age12-14": "12-14 years",
                "age15-18": "15-18 years"
              };
              
              return (
                <FormItem>
                  <FormLabel>Age Range</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || relevantAgeRanges[0] || "age3-5"}
                    disabled={!selectedLevel}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={selectedLevel ? "Select age range" : "Select curriculum level first"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedLevel ? (
                        relevantAgeRanges.length > 0 ? (
                          relevantAgeRanges.map((ageRange) => (
                            <SelectItem key={ageRange} value={ageRange}>
                              {ageRangeDisplay[ageRange as keyof typeof ageRangeDisplay]}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-gray-500">
                            No age ranges available for this level
                          </div>
                        )
                      ) : (
                        <div className="p-2 text-sm text-gray-500">
                          Select a curriculum level first
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the age range for this after-school class.
                    {selectedLevel && (
                      <span className="text-xs text-gray-500 block mt-1">
                        Range: {selectedLevel.ageRange || "Not specified"}
                      </span>
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )}
      </div>

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
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onNextTab} className="hidden md:flex">
            Next: Lesson Plans
          </Button>
          <Button
            type="button"
            onClick={saveBasicInfoAndContinue}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Saving...</span>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              </>
            ) : (
              <>Save & Continue</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BasicInformationTab;
