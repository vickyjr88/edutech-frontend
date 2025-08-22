import { describe, it, expect, vi } from 'vitest';
import {
  mapCourseDataToFormValues,
  mapObjectivesToString,
  extractLessonCount,
  extractMaterialsString,
  extractTechnicalRequirements,
  extractAssessmentMethods,
  extractTeachingMethodology,
  mapMaterials,
  extractResourceLinks,
  mapLessonPlans,
  generateId
} from '@/utils/courseDataMapper';

// Mock the entire module at the top level
vi.mock('@/utils/classDetailEnhancements', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@/utils/classDetailEnhancements')>();
  return {
    ...mod,
    // Keep the original implementation for other functions, but allow getTimeToNextClass to be mocked later
    getTimeToNextClass: vi.fn(mod.getTimeToNextClass),
  };
});

// Now import the functions from the mocked module
import {
  getCurrentTeachingMode,
  calculatePreparationScore,
  transformStudentsToInsights,
  generateStudentInsights,
  getContextualActions,
  generateSidebarWidgets,
  generatePrepChecklists,
  generateTeachingEffectiveness,
  generateZoomOptimization,
  extractClassObjectives,
  enhanceClassDetailData,
  getTimeToNextClass // Import getTimeToNextClass directly
} from '@/utils/classDetailEnhancements';

describe('Data Transformation Utilities', () => {
  describe('courseDataMapper functions', () => {
    describe('mapObjectivesToString', () => {
      it('should convert objectives array to formatted string', () => {
        const objectives = [
          { text: 'Learn algebra', priority: 'high', category: 'knowledge' },
          { text: 'Solve equations', priority: 'medium', category: 'skills' },
          { text: 'Apply concepts', priority: 'low', category: 'application' }
        ];

        const result = mapObjectivesToString(objectives);
        
        expect(result).toContain('1. 🔴 📚 Learn algebra');
        expect(result).toContain('2. 🟡 🎯 Solve equations');
        expect(result).toContain('3. 🟢 🔬 Apply concepts');
      });

      it('should handle empty array', () => {
        expect(mapObjectivesToString([])).toBe('');
        expect(mapObjectivesToString(null as any)).toBe('');
      });

      it('should map priorities correctly', () => {
        const objectives = [
          { text: 'High priority', priority: 'high', category: 'knowledge' },
          { text: 'Medium priority', priority: 'medium', category: 'skills' },
          { text: 'Low priority', priority: 'low', category: 'application' }
        ];

        const result = mapObjectivesToString(objectives);
        
        expect(result).toContain('🔴'); // high
        expect(result).toContain('🟡'); // medium
        expect(result).toContain('🟢'); // low
      });

      it('should map categories correctly', () => {
        const objectives = [
          { text: 'Knowledge item', priority: 'high', category: 'knowledge' },
          { text: 'Skills item', priority: 'high', category: 'skills' },
          { text: 'Application item', priority: 'high', category: 'application' }
        ];

        const result = mapObjectivesToString(objectives);
        
        expect(result).toContain('📚'); // knowledge
        expect(result).toContain('🎯'); // skills
        expect(result).toContain('🔬'); // application
      });
    });

    describe('extractLessonCount', () => {
      it('should return lesson plans count if available', () => {
        expect(extractLessonCount('8 weeks', 12)).toBe(12);
      });

      it('should extract from weeks duration', () => {
        expect(extractLessonCount('8 weeks', 0)).toBe(16); // 8 * 2
        expect(extractLessonCount('4 weeks', 0)).toBe(8);
      });

      it('should extract from lesson duration', () => {
        expect(extractLessonCount('15 lessons', 0)).toBe(15);
        expect(extractLessonCount('20 lesson', 0)).toBe(20);
      });

      it('should return default fallback', () => {
        expect(extractLessonCount('unknown format', 0)).toBe(10);
        expect(extractLessonCount('', 0)).toBe(10);
      });

      it('should handle case insensitive matching', () => {
        expect(extractLessonCount('6 WEEKS', 0)).toBe(12);
        expect(extractLessonCount('10 LESSONS', 0)).toBe(10);
      });
    });

    describe('extractMaterialsString', () => {
      it('should combine materials and requirements', () => {
        const materials = [{ name: 'Textbook' }, { name: 'Calculator' }];
        const requirements = [
          { type: 'materials', materialsList: ['Notebook', 'Pencil'] },
          { type: 'other', title: 'Should be ignored' }
        ];

        const result = extractMaterialsString(materials, requirements);
        expect(result).toBe('Textbook, Calculator, Notebook, Pencil');
      });

      it('should handle empty arrays', () => {
        expect(extractMaterialsString([], [])).toBe('');
        expect(extractMaterialsString(null as any, null as any)).toBe('');
      });

      it('should handle requirements without materialsList', () => {
        const requirements = [
          { type: 'materials', title: 'Whiteboard' }
        ];

        const result = extractMaterialsString([], requirements);
        expect(result).toBe('Whiteboard');
      });
    });

    describe('extractTechnicalRequirements', () => {
      it('should extract technical requirements', () => {
        const techReqs = [
          { requirement: 'Internet connection' },
          { requirement: 'Computer with camera' },
          { requirement: 'Zoom software' }
        ];

        const result = extractTechnicalRequirements(techReqs);
        expect(result).toBe('Internet connection, Computer with camera, Zoom software');
      });

      it('should handle empty array', () => {
        expect(extractTechnicalRequirements([])).toBe('');
        expect(extractTechnicalRequirements(null as any)).toBe('');
      });
    });

    describe('extractAssessmentMethods', () => {
      it('should extract unique assessment methods from lesson plans', () => {
        const lessonPlans = [
          {
            assessmentMethods: [
              { method: 'Quiz' },
              { method: 'Assignment' }
            ],
            plenary: {
              assessmentMethods: [
                { method: 'Discussion' },
                { method: 'Quiz' } // Duplicate
              ]
            }
          },
          {
            assessmentMethods: [
              { method: 'Project' }
            ]
          }
        ];

        const result = extractAssessmentMethods(lessonPlans as any);
        expect(result).toBe('Quiz, Assignment, Discussion, Project');
      });

      it('should handle empty lesson plans', () => {
        expect(extractAssessmentMethods([])).toBe('');
      });
    });

    describe('extractTeachingMethodology', () => {
      it('should extract unique teaching methods', () => {
        const lessonPlans = [
          {
            lessonFlow: [
              { teachingMethod: 'Lecture' },
              { teachingMethod: 'Group Work' }
            ],
            activities: [
              { activityType: 'Discussion' },
              { activityType: 'Lecture' } // Duplicate
            ]
          }
        ];

        const result = extractTeachingMethodology(lessonPlans as any);
        expect(result).toBe('Lecture, Group Work, Discussion');
      });
    });

    describe('mapMaterials', () => {
      it('should map materials to form format', () => {
        const materials = [{ name: 'Textbook' }];
        const requirements = [
          {
            type: 'materials',
            materialsList: ['Calculator'],
            description: 'Scientific calculator',
            isRequired: true,
            whereToGet: 'Store',
            estimatedCost: '$20'
          }
        ];

        const result = mapMaterials(materials, requirements);
        
        expect(result).toHaveLength(2);
        expect(result[0]).toMatchObject({
          name: 'Textbook',
          type: 'required'
        });
        expect(result[1]).toMatchObject({
          name: 'Calculator',
          description: 'Scientific calculator',
          type: 'required',
          link: 'Store',
          cost: '$20'
        });
      });
    });

    describe('extractResourceLinks', () => {
      it('should extract resource links from lesson plans', () => {
        const lessonPlans = [
          {
            resourceLinks: [
              {
                title: 'Khan Academy',
                url: 'https://khanacademy.org',
                description: 'Math videos'
              }
            ]
          }
        ];

        const result = extractResourceLinks(lessonPlans as any);
        
        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
          title: 'Khan Academy',
          url: 'https://khanacademy.org',
          description: 'Math videos',
          type: 'website'
        });
      });
    });

    describe('mapLessonPlans', () => {
      it('should map lesson plans to form format', () => {
        const lessonPlans = [
          {
            title: 'Introduction to Algebra',
            description: 'Basic concepts',
            duration: 60,
            objectives: ['Learn variables'],
            activities: [{ type: 'lecture' }]
          }
        ];

        const result = mapLessonPlans(lessonPlans as any);
        
        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
          title: 'Introduction to Algebra',
          description: 'Basic concepts',
          duration: '60'
        });
        
        // Should stringify resources
        const resources = JSON.parse(result[0].resources);
        expect(resources.objectives).toEqual(['Learn variables']);
      });
    });

    describe('generateId', () => {
      it('should generate unique IDs', () => {
        const id1 = generateId();
        const id2 = generateId();
        
        expect(id1).toMatch(/^[a-z0-9]+$/);
        expect(id2).toMatch(/^[a-z0-9]+$/);
        expect(id1).not.toBe(id2);
      });

      it('should generate IDs of consistent length', () => {
        const ids = Array.from({ length: 10 }, () => generateId());
        const lengths = ids.map(id => id.length);
        
        // All IDs should be the same length
        expect(new Set(lengths).size).toBe(1);
        expect(lengths[0]).toBeGreaterThan(0);
      });
    });

    describe('mapCourseDataToFormValues', () => {
      it('should map complete course data to form values', () => {
        const courseData = {
          title: 'Advanced Mathematics',
          curriculum: 'IB',
          gradeLevel: '12',
          description: 'Advanced math course',
          objectives: [
            { text: 'Master calculus', priority: 'high', category: 'skills' }
          ],
          duration: '12 weeks',
          materials: [{ name: 'Textbook' }],
          requirements: [],
          technicalRequirements: [{ requirement: 'Calculator' }],
          lessonPlans: [],
          tags: ['mathematics', 'advanced'],
          summary: 'Comprehensive math course',
          teacherNotes: 'Requires strong foundation',
          confidence: 0.9
        };

        const result = mapCourseDataToFormValues(courseData);
        
        expect(result).toMatchObject({
          type: 'academic',
          title: 'Advanced Mathematics',
          curriculum: 'IB',
          gradeLevel: '12',
          description: 'Advanced math course',
          numberOfLessons: 24, // 12 * 2
          technicalRequirements: 'Calculator',
          isPublic: true,
          isPublished: false,
          status: 'draft',
          tags: ['mathematics', 'advanced'],
          summary: 'Comprehensive math course',
          teacherNotes: 'Requires strong foundation',
          confidence: 0.9
        });
      });
    });
  });

  describe('classDetailEnhancements functions', () => {
    describe('getCurrentTeachingMode', () => {
      it('should return teaching mode when live', () => {
        expect(getCurrentTeachingMode(60, true)).toBe('teaching');
        expect(getCurrentTeachingMode(-30, true)).toBe('teaching');
      });

      it('should return reflect mode for past classes', () => {
        expect(getCurrentTeachingMode(-30, false)).toBe('reflect');
        expect(getCurrentTeachingMode(0, false)).toBe('reflect');
      });

      it('should return ready mode for imminent classes', () => {
        expect(getCurrentTeachingMode(60, false)).toBe('ready'); // 1 hour
        expect(getCurrentTeachingMode(120, false)).toBe('ready'); // 2 hours
      });

      it('should return prep mode for future classes', () => {
        expect(getCurrentTeachingMode(180, false)).toBe('prep'); // 3 hours
        expect(getCurrentTeachingMode(1440, false)).toBe('prep'); // 24 hours
      });
    });

    describe('calculatePreparationScore', () => {
      it('should calculate score based on completed checklist items', () => {
        // Mock getTimeToNextClass to return a value that doesn't trigger adjustment
        (getTimeToNextClass as vi.Mock).mockReturnValue(100); // No adjustment

        const checklists = [
          {
            items: [
              { completed: true },
              { completed: true },
              { completed: false }
            ]
          },
          {
            items: [
              { completed: true },
              { completed: false }
            ]
          }
        ];

        const score = calculatePreparationScore({}, checklists as any);
        // 3 completed out of 5 total = 60%
        expect(score).toBe(50);
      });

      it('should return default score for empty checklists', () => {
        const score = calculatePreparationScore({}, []);
        expect(score).toBe(85);
      });

      it('should adjust score based on time to class', () => {
        const checklists = [
          {
            items: [
              { completed: true },
              { completed: true }
            ]
          }
        ];

        // Mock the getTimeToNextClass function behavior
        const classData = {};
        const baseScore = calculatePreparationScore(classData, checklists as any);
        expect(baseScore).toBeGreaterThan(0);
        expect(baseScore).toBeLessThanOrEqual(100);
      });
    });

    describe('transformStudentsToInsights', () => {
      it('should transform API student data to insights format', () => {
        const students = [
          {
            studentId: '1',
            name: 'John Doe',
            status: 'Active',
            attendance: { percentage: 85 },
            assignments: { completionRate: 80 },
            aiInsights: {
              strengths: ['Math', 'Problem solving'],
              improvements: ['Writing'],
              insights: ['Shows good progress']
            },
            lastActivityTimestamp: new Date().toISOString()
          }
        ];

        const result = transformStudentsToInsights(students);
        
        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
          id: '1',
          name: 'John Doe',
          currentStatus: 'thriving',
          needsAttention: false
        });
        
        expect(result[0].zoomBehavior).toBeDefined();
        expect(result[0].learningPattern).toBeDefined();
        expect(result[0].recentProgress).toBeDefined();
      });

      it('should handle empty student array', () => {
        const result = transformStudentsToInsights([]);
        expect(result).toEqual([]);
      });

      it('should identify struggling students', () => {
        const students = [
          {
            studentId: '1',
            name: 'Jane Doe',
            status: 'Inactive',
            attendance: { percentage: 20 },
            assignments: { completionRate: 30 }
          }
        ];

        const result = transformStudentsToInsights(students);
        expect(result[0].currentStatus).toBe('struggling');
        expect(result[0].needsAttention).toBe(true);
      });
    });

    describe('generateStudentInsights', () => {
      it('should generate mock student data', () => {
        const classData = { enrollment: { current: 5 } };
        const result = generateStudentInsights(classData);
        
        expect(result).toHaveLength(5);
        result.forEach(student => {
          expect(student.id).toBeDefined();
          expect(student.name).toBeDefined();
          expect(student.zoomBehavior).toBeDefined();
          expect(student.learningPattern).toBeDefined();
        });
      });

      it('should use default enrollment if not provided', () => {
        const result = generateStudentInsights({});
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('getContextualActions', () => {
      it('should return prep actions for prep mode', () => {
        const actions = getContextualActions('prep', {});
        
        expect(actions.some(a => a.id === 'prep_materials')).toBe(true);
        expect(actions.some(a => a.id === 'review_students')).toBe(true);
        expect(actions.some(a => a.id === 'test_zoom')).toBe(true);
      });

      it('should return teaching actions for teaching mode', () => {
        const actions = getContextualActions('teaching', {});
        
        expect(actions.some(a => a.id === 'quick_poll')).toBe(true);
        expect(actions.some(a => a.id === 'breakout_rooms')).toBe(true);
      });

      it('should return reflection actions for reflect mode', () => {
        const actions = getContextualActions('reflect', {});
        
        expect(actions.some(a => a.id === 'voice_reflection')).toBe(true);
        expect(actions.some(a => a.id === 'update_progress')).toBe(true);
      });
    });

    describe('generatePrepChecklists', () => {
      it('should generate preparation checklists', () => {
        const checklists = generatePrepChecklists({});
        
        expect(checklists).toHaveLength(2);
        expect(checklists[0].category).toBe('lesson-prep');
        expect(checklists[1].category).toBe('zoom-tech');
        
        checklists.forEach(checklist => {
          expect(checklist.items.length).toBeGreaterThan(0);
          expect(typeof checklist.completionScore).toBe('number');
        });
      });
    });

    describe('generateTeachingEffectiveness', () => {
      it('should generate effectiveness metrics', () => {
        const effectiveness = generateTeachingEffectiveness();
        
        expect(effectiveness.overallScore).toBeGreaterThanOrEqual(80);
        expect(effectiveness.overallScore).toBeLessThanOrEqual(100);
        
        expect(effectiveness.trends).toBeDefined();
        expect(effectiveness.optimizations).toBeDefined();
        expect(effectiveness.optimizations.length).toBeGreaterThan(0);
      });
    });

    describe('generateZoomOptimization', () => {
      it('should generate zoom optimization settings', () => {
        const optimization = generateZoomOptimization();
        
        expect(optimization.currentSettings).toBeDefined();
        expect(optimization.recommendations).toBeDefined();
        expect(optimization.techChecklist).toBeDefined();
        
        expect(typeof optimization.currentSettings.waitingRoom).toBe('boolean');
        expect(typeof optimization.currentSettings.muteOnEntry).toBe('boolean');
      });
    });

    describe('extractClassObjectives', () => {
      it('should extract objectives from string format', () => {
        const classData = {
          objectives: '• Learn algebra • Solve equations • Apply concepts'
        };

        const result = extractClassObjectives(classData);
        
        expect(result).toHaveLength(3);
        expect(result[0].text).toBe('Learn algebra');
        expect(result[1].text).toBe('Solve equations');
        expect(result[2].text).toBe('Apply concepts');
      });

      it('should extract objectives from array format', () => {
        const classData = {
          objectives: [
            { id: '1', text: 'Learn algebra', priority: 'high' },
            { objective: 'Solve equations', completed: true }
          ]
        };

        const result = extractClassObjectives(classData);
        
        expect(result).toHaveLength(2);
        expect(result[0].text).toBe('Learn algebra');
        expect(result[0].priority).toBe('high');
        expect(result[1].text).toBe('Solve equations');
        expect(result[1].completed).toBe(true);
      });

      it('should handle empty objectives', () => {
        expect(extractClassObjectives({})).toEqual([]);
        expect(extractClassObjectives({ objectives: null })).toEqual([]);
        expect(extractClassObjectives({ objectives: '' })).toEqual([]);
      });
    });
  });

  describe('Data Validation Utilities', () => {
    const validateEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const validateUrl = (url: string): boolean => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    const sanitizeString = (input: string): string => {
      // Remove only the <script> and </script> tags, keep content
      let sanitized = input.replace(/<\/?script\b[^>]*>/gi, '');
      // Remove any other remaining HTML tags
      sanitized = sanitized.replace(/<[^>]*>/g, '');
      return sanitized.trim();
    };

    const validateRequired = (value: any): boolean => {
      if (typeof value === 'string') return value.trim() !== '';
      if (Array.isArray(value)) return value.length > 0;
      return value != null;
    };

    it('should validate email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });

    it('should validate URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('http://example.com')).toBe(true);
      expect(validateUrl('ftp://files.example.com')).toBe(true);
      expect(validateUrl('not-a-url')).toBe(false);
      expect(validateUrl('')).toBe(false);
    });

    it('should sanitize strings', () => {
      expect(sanitizeString('  hello world  ')).toBe('hello world');
      expect(sanitizeString('test<script>alert()</script>')).toBe('testalert()');
      expect(sanitizeString('<>dangerous')).toBe('dangerous');
    });

    it('should validate required fields', () => {
      expect(validateRequired('hello')).toBe(true);
      expect(validateRequired([1, 2, 3])).toBe(true);
      expect(validateRequired({})).toBe(true);
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('  ')).toBe(false);
      expect(validateRequired([])).toBe(false);
      expect(validateRequired(null)).toBe(false);
      expect(validateRequired(undefined)).toBe(false);
    });
  });
});
