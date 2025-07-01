// src/integrations/api/services/file-upload.service.ts
import { api, ApiResponse } from '../client';

export interface FileUploadResponse {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class FileUploadService {
  /**
   * Upload a file for class materials (course outline, syllabus, scheme of work)
   */
  async uploadClassFile(
    classId: string,
    file: File,
    fileType: 'course_outline' | 'syllabus' | 'scheme_of_work',
    onProgress?: (progress: FileUploadProgress) => void
  ): Promise<{ data?: FileUploadResponse; error?: any }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', fileType);

      const response = await api.post<FileUploadResponse>(`/classes/${classId}/upload-file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const progress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total)
            };
            onProgress(progress);
          }
        }
      });

      return { data: response.data };
    } catch (error: any) {
      console.error('File upload error:', error);
      return { 
        error: {
          message: error.response?.data?.message || 'Failed to upload file',
          status: error.response?.status,
          data: error.response?.data
        }
      };
    }
  }

  /**
   * Upload material resource file
   */
  async uploadMaterialFile(
    classId: string,
    file: File,
    materialId: string,
    onProgress?: (progress: FileUploadProgress) => void
  ): Promise<{ data?: FileUploadResponse; error?: any }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('materialId', materialId);

      const response = await api.post<FileUploadResponse>(`/classes/${classId}/materials/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const progress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total)
            };
            onProgress(progress);
          }
        }
      });

      return { data: response.data };
    } catch (error: any) {
      console.error('Material file upload error:', error);
      return { 
        error: {
          message: error.response?.data?.message || 'Failed to upload material file',
          status: error.response?.status,
          data: error.response?.data
        }
      };
    }
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File, fileType: 'document' | 'image' | 'video'): { valid: boolean; error?: string } {
    const maxSize = 50 * 1024 * 1024; // 50MB limit
    
    // Check file size
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 50MB' };
    }

    // Check if file has content
    if (file.size === 0) {
      return { valid: false, error: 'File appears to be empty' };
    }

    // Check file type based on category
    const allowedTypes: { [key: string]: string[] } = {
      document: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain'
      ],
      image: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
      ],
      video: [
        'video/mp4',
        'video/avi',
        'video/mov',
        'video/wmv'
      ]
    };

    if (!allowedTypes[fileType].includes(file.type)) {
      return { 
        valid: false, 
        error: `Invalid file type. Allowed types for ${fileType}: ${allowedTypes[fileType].join(', ')}` 
      };
    }

    return { valid: true };
  }

  /**
   * Get supported file types for a category
   */
  getSupportedFileTypes(category: 'document' | 'image' | 'video'): string[] {
    const types: { [key: string]: string[] } = {
      document: ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt'],
      image: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      video: ['.mp4', '.avi', '.mov', '.wmv']
    };
    return types[category] || [];
  }

  /**
   * Upload and process course outline without creating lesson plans or updating classes
   */
  async uploadAndProcessCourseOutline(
    file: File,
    onProgress?: (progress: FileUploadProgress) => void
  ): Promise<{ data?: any; error?: any }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<any>('/classes/course-outline/upload-and-process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const progress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total)
            };
            onProgress(progress);
          }
        }
      });

      return { data: response.data };
    } catch (error: any) {
      console.error('Course outline upload error:', error);
      return { 
        error: {
          message: error.response?.data?.message || 'Failed to upload and process course outline',
          status: error.response?.status,
          data: error.response?.data
        }
      };
    }
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

export const fileUploadService = new FileUploadService();