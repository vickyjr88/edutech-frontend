import { api } from '@/integrations/api/client';

export interface DescriptionContext {
  title?: string;
  curriculum?: string;
  curriculumLevel?: string;
  subject?: string;
  classType?: 'academic' | 'afterschool';
  ageRange?: string;
  gradeLevel?: string;
}

export interface GeneratedDescription {
  description: string;
  confidence: number;
}

/**
 * AI-powered class description generation service
 */
export class AIDescriptionService {
  /**
   * Generate a compelling class description based on context
   */
  static async generateDescription(context: DescriptionContext): Promise<GeneratedDescription> {
    // Build a targeted prompt based on the context
    const prompt = this.buildPrompt(context);
    
    try {
      // Use the direct API client to avoid AuthProvider dependency
      const response = await api.post<{
        success: boolean;
        message: string;
        data: { description: string };
      }>('/teacher/custom-class/generate-description', {
        prompt
      });
      
      if (response.data && !response.error && response.data.success) {
        // Extract description from the response
        return {
          description: response.data.data.description,
          confidence: 0.8
        };
      } else {
        throw new Error(response.error?.message || 'Failed to generate description');
      }
    } catch (error) {
      console.error('Error generating AI description:', error);
      throw error;
    }
  }

  /**
   * Build a targeted prompt for description generation
   */
  private static buildPrompt(context: DescriptionContext): string {
    const { title, curriculum, curriculumLevel, subject, classType, ageRange, gradeLevel } = context;
    
    let prompt = "Generate only a compelling class description for the following class:\n\n";
    
    // Add class basics
    if (title) {
      prompt += `Class Title: ${title}\n`;
    }
    
    if (classType) {
      prompt += `Class Type: ${classType === 'academic' ? 'Academic' : 'After School'}\n`;
    }
    
    // Add curriculum context
    if (curriculum) {
      prompt += `Curriculum: ${curriculum}\n`;
    }
    
    if (curriculumLevel) {
      prompt += `Level: ${curriculumLevel}\n`;
    }
    
    if (subject) {
      prompt += `Subject: ${subject}\n`;
    }
    
    // Add age/grade context
    if (gradeLevel) {
      prompt += `Grade Level: ${gradeLevel}\n`;
    } else if (ageRange) {
      prompt += `Age Range: ${ageRange}\n`;
    }
    
    // Add specific requirements for the description
    prompt += `\nRequirements for the description:
- Write a compelling, parent-friendly description that explains what students will learn
- Highlight the unique value and teaching approach
- Include specific learning outcomes and skills students will gain
- Make it engaging and professional to attract enrollments
- Ensure it aligns with ${curriculum || 'the chosen'} curriculum standards
- Keep it between 150-300 words
- Focus on benefits and outcomes rather than just curriculum content

Please generate ONLY the class description, no other content.`;

    return prompt;
  }

  /**
   * Generate curriculum-specific description suggestions
   */
  static getDescriptionTips(curriculum: string): string[] {
    const tips: Record<string, string[]> = {
      'british': [
        'Emphasize preparation for IGCSE/A-Level examinations',
        'Highlight critical thinking and analytical skills development',
        'Mention alignment with UK national curriculum standards',
        'Include international perspective and global citizenship'
      ],
      'ib': [
        'Focus on inquiry-based learning and international mindedness',
        'Highlight development of learner profile attributes',
        'Mention connection to Theory of Knowledge and extended essay skills',
        'Emphasize multilingual and intercultural understanding'
      ],
      'cbc': [
        'Emphasize competency-based learning and practical skills',
        'Highlight 21st-century skills development',
        'Mention alignment with Kenyan national development goals',
        'Include community service and social responsibility aspects'
      ],
      'american': [
        'Focus on college and career readiness',
        'Highlight critical thinking and problem-solving skills',
        'Mention preparation for standardized assessments',
        'Include collaborative learning and project-based activities'
      ]
    };
    
    return tips[curriculum.toLowerCase()] || [
      'Focus on student learning outcomes and skill development',
      'Highlight engaging teaching methods and activities',
      'Emphasize real-world application of knowledge',
      'Include assessment and feedback strategies'
    ];
  }
}