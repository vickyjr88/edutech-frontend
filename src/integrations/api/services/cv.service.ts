import { api } from '../client';

export interface CVUploadResponse {
  success: boolean;
  message: string;
  data: {
    cvUpload: {
      fileUrl: string;
      fileName: string;
      uploadedAt: string;
    };
    extractedData: {
      personalInfo: { 
        fullName: string; 
        email: string; 
        bio: string; 
      };
      education: Array<{
        degree: string;
        institution: string;
        year: string;
        description?: string;
      }>;
      experience: Array<{
        title: string;
        organization: string;
        startDate: string;
        endDate?: string;
        description?: string;
      }>;
      certifications: Array<{
        name: string;
        issuer: string;
        date?: string;
        description?: string;
      }>;
      subjects: Array<{
        name: string;
        level: string;
        isAcademic: boolean;
      }>;
      languages: Array<{
        name: string;
        level: string;
      }>;
      skills: string[];
      summary: string;
      confidence: number;
    };
    profileUpdate?: {
      itemsCreated: number;
      itemsUpdated: number;
      suggestions: string[];
    };
    costs: {
      parsingCostCents: number;
    };
    preview?: boolean;
  };
}

export interface ProfileStatusResponse {
  success: boolean;
  data: {
    completionScore: number;
    isComplete: boolean;
    canGenerateRecommendations: boolean;
    counts: {
      education: number;
      experience: number;
      subjects: number;
      certifications: number;
      languages: number;
    };
  };
}

class CVService {
  /**
   * Upload and process CV with full profile update
   */
  async uploadCV(file: File): Promise<{ data?: CVUploadResponse; error?: any }> {
    try {
      const formData = new FormData();
      formData.append('cv', file);

      const response = await api.post<CVUploadResponse>('/teacher/cv/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return { data: response.data };
    } catch (error: any) {
      console.error('CV upload error:', error);
      return { 
        error: {
          message: error.response?.data?.message || 'Failed to upload and process CV',
          status: error.response?.status,
          data: error.response?.data
        }
      };
    }
  }

  /**
   * Preview CV extraction without saving to database
   */
  async previewCV(file: File): Promise<{ data?: CVUploadResponse; error?: any }> {
    try {
      const formData = new FormData();
      formData.append('cv', file);

      const response = await api.post<CVUploadResponse>('/teacher/cv/preview', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return { data: response.data };
    } catch (error: any) {
      console.error('CV preview error:', error);
      return { 
        error: {
          message: error.response?.data?.message || 'Failed to preview CV',
          status: error.response?.status,
          data: error.response?.data
        }
      };
    }
  }

  /**
   * Check teacher profile completion status
   */
  async getProfileStatus(): Promise<{ data?: ProfileStatusResponse['data']; error?: any }> {
    try {
      const response = await api.get<ProfileStatusResponse>('/teacher/cv/profile-status');
      return { data: response.data.data };
    } catch (error: any) {
      console.error('Profile status error:', error);
      return { 
        error: {
          message: error.response?.data?.message || 'Failed to get profile status',
          status: error.response?.status,
          data: error.response?.data
        }
      };
    }
  }

  /**
   * Upload CV with progress tracking
   */
  async uploadCVWithProgress(
    file: File, 
    onProgress?: (progress: number) => void
  ): Promise<{ data?: CVUploadResponse; error?: any }> {
    try {
      const formData = new FormData();
      formData.append('cv', file);

      const response = await api.post<CVUploadResponse>('/teacher/cv/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        }
      });

      return { data: response.data };
    } catch (error: any) {
      console.error('CV upload with progress error:', error);
      return { 
        error: {
          message: error.response?.data?.message || 'Failed to upload CV',
          status: error.response?.status,
          data: error.response?.data
        }
      };
    }
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (file.type !== 'application/pdf') {
      return { valid: false, error: 'Only PDF files are supported' };
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 10MB' };
    }

    // Check if file has content
    if (file.size === 0) {
      return { valid: false, error: 'File appears to be empty' };
    }

    return { valid: true };
  }

  /**
   * Get supported file types
   */
  getSupportedFileTypes(): string[] {
    return ['application/pdf'];
  }

  /**
   * Get max file size in bytes
   */
  getMaxFileSize(): number {
    return 10 * 1024 * 1024; // 10MB
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const cvService = new CVService();