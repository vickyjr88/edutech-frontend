/**
 * Feature Flags Configuration for Kidato MVP
 *
 * This file centralizes all feature flags to easily control which features
 * are visible/enabled in the MVP vs full platform.
 *
 * Usage:
 * import { features } from '@/config/features';
 * if (features.messaging.enabled) { ... }
 */

// Helper to get boolean env vars
const getEnvBoolean = (key: string, defaultValue: boolean = false): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === true;
};

// MVP Mode - Master switch
export const isMVPMode = getEnvBoolean('VITE_MVP_MODE', true);

// Feature Flags Object
export const features = {
  // ===== CORE MVP FEATURES (Always enabled in MVP) =====
  auth: {
    enabled: true,
    emailPassword: true,
    oauth: true,
    linkedin: getEnvBoolean('VITE_LINKEDIN_CLIENT_ID', false), // Enable when configured
  },

  teacher: {
    enabled: getEnvBoolean('VITE_ENABLE_TEACHER_PROFILES', true),
    profileCreation: true,
    offerings: getEnvBoolean('VITE_ENABLE_OFFERINGS', true),
    availability: true,
    dashboard: true,
    earnings: true,
    successRate: false, // Hidden in MVP
  },

  parent: {
    enabled: true,
    browse: true,
    booking: getEnvBoolean('VITE_ENABLE_BOOKING', true),
    dashboard: true,
    paymentHistory: true,
  },

  payment: {
    enabled: true,
    mpesa: getEnvBoolean('VITE_ENABLE_MPESA_PAYMENT', true),
    stripe: false, // Hidden in MVP, but code remains
    cards: false,  // Hidden in MVP
  },

  admin: {
    enabled: getEnvBoolean('VITE_ENABLE_ADMIN_PANEL', true),
    teacherApproval: true,
    userManagement: true,
    bookingManagement: true,
    analytics: true,
    dataExport: true,
  },

  marketing: {
    cms: getEnvBoolean('VITE_ENABLE_CMS', true),
    blog: getEnvBoolean('VITE_ENABLE_BLOG', true),
    newsletter: getEnvBoolean('VITE_ENABLE_NEWSLETTER', true),
    landingPages: true,
  },

  // ===== ADVANCED FEATURES (Hidden in MVP, code remains) =====
  messaging: {
    enabled: getEnvBoolean('VITE_ENABLE_MESSAGING', false),
    directMessages: false,
    groupChannels: false,
    classChat: false,
  },

  integrations: {
    zoom: getEnvBoolean('VITE_ENABLE_ZOOM_INTEGRATION', false),
    googleCalendar: getEnvBoolean('VITE_ENABLE_GOOGLE_CALENDAR', false),
  },

  reviews: {
    enabled: getEnvBoolean('VITE_ENABLE_REVIEWS', false),
    teacherRatings: false,
    reviewRequests: false,
  },

  analytics: {
    basic: true, // Simple numbers/stats
    advanced: getEnvBoolean('VITE_ENABLE_ADVANCED_ANALYTICS', false), // Charts, trends
    charts: false,
    trends: false,
  },

  student: {
    enabled: true, // Students can enroll
    achievements: getEnvBoolean('VITE_ENABLE_STUDENT_ACHIEVEMENTS', false),
    quests: false,
    groups: false,
    dashboard: false, // Student dashboard hidden in MVP
  },

  assignments: {
    enabled: getEnvBoolean('VITE_ENABLE_ASSIGNMENTS', false),
    creation: false,
    submission: false,
    grading: false,
  },

  classes: {
    enabled: true,
    basicSetup: true, // Simple class creation form
    advancedSetup: false, // Complex wizard with AI, lesson plans, etc.
    lessonPlans: false,
    aiHelper: false,
    courseImport: false,
  },

  // ===== SYSTEM FEATURES =====
  notifications: {
    email: true,
    sms: false, // Can enable later
    push: false,
    inApp: false,
  },

  fileUploads: {
    enabled: true,
    images: true,
    documents: true,
    videos: true, // For profile videos
  },
} as const;

// Helper functions
export const isFeatureEnabled = (featurePath: string): boolean => {
  const keys = featurePath.split('.');
  let current: any = features;

  for (const key of keys) {
    if (current[key] === undefined) return false;
    current = current[key];
  }

  return current === true;
};

// Check if in development mode
export const isDevelopment = import.meta.env.DEV;

// Check if in production mode
export const isProduction = import.meta.env.PROD;

// API URLs
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  mvpURL: import.meta.env.VITE_MVP_API_URL || 'http://localhost:3000/api/v1/mvp',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10),
};

// Regional Settings
export const REGIONAL_CONFIG = {
  locale: import.meta.env.VITE_DEFAULT_LOCALE || 'en-KE',
  timezone: import.meta.env.VITE_DEFAULT_TIMEZONE || 'Africa/Nairobi',
  currency: import.meta.env.VITE_CURRENCY || 'KES',
  countryCode: import.meta.env.VITE_COUNTRY_CODE || 'KE',
  phonePrefix: import.meta.env.VITE_PHONE_PREFIX || '254',
};

// Export individual feature groups for convenience
export const {
  auth: authFeatures,
  teacher: teacherFeatures,
  parent: parentFeatures,
  payment: paymentFeatures,
  admin: adminFeatures,
  marketing: marketingFeatures,
  messaging: messagingFeatures,
  integrations: integrationFeatures,
  reviews: reviewFeatures,
  analytics: analyticsFeatures,
  student: studentFeatures,
  assignments: assignmentFeatures,
  classes: classFeatures,
  notifications: notificationFeatures,
  fileUploads: fileUploadFeatures,
} = features;

// Log feature flags in development
if (isDevelopment) {
  console.log('🚀 Kidato MVP Mode:', isMVPMode);
  console.log('⚙️ Feature Flags:', features);
}
