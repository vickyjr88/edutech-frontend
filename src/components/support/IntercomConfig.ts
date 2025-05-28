import { IntercomConfig, UserRole } from './types';

// Environment-based configuration
const getIntercomAppId = (): string => {
  // In production, this should come from environment variables
  const appId = import.meta.env.VITE_INTERCOM_APP_ID || 'your_intercom_app_id';
  
  // Development/demo app ID (replace with your actual Intercom app ID)
  if (import.meta.env.DEV) {
    return appId || 'demo_app_id';
  }
  
  return appId;
};

export const intercomConfig: IntercomConfig = {
  appId: getIntercomAppId(),
  enabledForRoles: ['student', 'parent', 'teacher', 'admin', 'institution'],
  autoboot: true
};

// Role-specific configurations for Learniverse
export const getRoleSpecificSettings = (role: UserRole) => {
  const baseSettings = {
    hide_default_launcher: false,
    alignment: 'right' as const,
    horizontal_padding: 20,
    vertical_padding: 20
  };

  switch (role) {
    case 'teacher':
      return {
        ...baseSettings,
        custom_attributes: {
          user_type: 'teacher',
          segment: 'educator',
          role: 'teacher',
          platform_section: 'teacher_dashboard',
          support_priority: 'high',
          can_create_classes: true,
          monetization_enabled: true
        }
      };
    
    case 'parent':
      return {
        ...baseSettings,
        custom_attributes: {
          user_type: 'parent',
          segment: 'family',
          role: 'parent',
          platform_section: 'parent_dashboard',
          support_priority: 'high',
          billing_responsible: true,
          child_monitoring: true
        }
      };
    
    case 'student':
      return {
        ...baseSettings,
        custom_attributes: {
          user_type: 'student',
          segment: 'learner',
          role: 'student',
          platform_section: 'student_dashboard',
          support_priority: 'medium',
          learning_focused: true,
          parental_controls: true
        }
      };
    
    case 'admin':
      return {
        ...baseSettings,
        custom_attributes: {
          user_type: 'admin',
          segment: 'internal',
          role: 'admin',
          platform_section: 'admin_dashboard',
          support_priority: 'critical',
          full_platform_access: true
        }
      };
    
    case 'institution':
      return {
        ...baseSettings,
        custom_attributes: {
          user_type: 'institution',
          segment: 'enterprise',
          role: 'institution',
          platform_section: 'institution_dashboard',
          support_priority: 'high',
          bulk_management: true,
          multi_user_account: true
        }
      };
    
    default:
      return {
        ...baseSettings,
        custom_attributes: {
          user_type: 'visitor',
          segment: 'prospect',
          role: 'visitor',
          platform_section: 'marketing_site'
        }
      };
  }
};

// Learniverse-specific event tracking
export const LEARNIVERSE_EVENTS = {
  // Student events
  STUDENT_ENROLLED_CLASS: 'student-enrolled-class',
  STUDENT_COMPLETED_LESSON: 'student-completed-lesson',
  STUDENT_SUBMITTED_ASSIGNMENT: 'student-submitted-assignment',
  STUDENT_JOINED_LIVE_SESSION: 'student-joined-live-session',
  STUDENT_ACHIEVEMENT_UNLOCKED: 'student-achievement-unlocked',
  
  // Parent events
  PARENT_VIEWED_CHILD_PROGRESS: 'parent-viewed-child-progress',
  PARENT_SCHEDULED_MEETING: 'parent-scheduled-meeting',
  PARENT_UPDATED_PAYMENT: 'parent-updated-payment',
  PARENT_ENROLLED_CHILD: 'parent-enrolled-child',
  PARENT_DOWNLOADED_REPORT: 'parent-downloaded-report',
  
  // Teacher events
  TEACHER_CREATED_CLASS: 'teacher-created-class',
  TEACHER_PUBLISHED_LESSON: 'teacher-published-lesson',
  TEACHER_GRADED_ASSIGNMENT: 'teacher-graded-assignment',
  TEACHER_SCHEDULED_LIVE_CLASS: 'teacher-scheduled-live-class',
  TEACHER_RECEIVED_PAYMENT: 'teacher-received-payment',
  TEACHER_INVITED_STUDENTS: 'teacher-invited-students',
  
  // Platform events
  ZOOM_INTEGRATION_CONNECTED: 'zoom-integration-connected',
  PAYMENT_METHOD_ADDED: 'payment-method-added',
  SUBSCRIPTION_UPGRADED: 'subscription-upgraded',
  PROFILE_COMPLETED: 'profile-completed',
  
  // Support events
  HELP_ARTICLE_VIEWED: 'help-article-viewed',
  SUPPORT_CONTACT_INITIATED: 'support-contact-initiated',
  FEATURE_REQUEST_SUBMITTED: 'feature-request-submitted',
  BUG_REPORT_SUBMITTED: 'bug-report-submitted'
} as const;

// Helper to get user data with Learniverse-specific attributes
export const getLearniverseUserData = (user: any, role: UserRole) => {
  const baseData = {
    user_id: user?.id || user?.uid,
    email: user?.email,
    name: user?.displayName || user?.name || `${user?.firstName} ${user?.lastName}`.trim(),
    phone: user?.phone,
    avatar: user?.photoURL ? {
      type: 'avatar' as const,
      image_url: user.photoURL
    } : undefined,
    created_at: user?.createdAt ? Math.floor(new Date(user.createdAt).getTime() / 1000) : undefined,
    user_hash: user?.intercomUserHash // For identity verification
  };

  // Role-specific custom attributes
  const roleAttributes = (() => {
    switch (role) {
      case 'student':
        return {
          grade_level: user?.gradeLevel,
          subjects_enrolled: user?.enrolledSubjects?.join(', '),
          classes_count: user?.classesCount || 0,
          learning_streak: user?.learningStreak || 0,
          parent_email: user?.parentEmail,
          achievements_count: user?.achievementsCount || 0
        };
      
      case 'parent':
        return {
          children_count: user?.childrenCount || 0,
          subscription_plan: user?.subscriptionPlan || 'basic',
          billing_status: user?.billingStatus || 'active',
          children_ages: user?.childrenAges?.join(', '),
          primary_concerns: user?.primaryConcerns?.join(', ')
        };
      
      case 'teacher':
        return {
          subjects_taught: user?.subjectsTaught?.join(', '),
          experience_years: user?.experienceYears,
          classes_created: user?.classesCreated || 0,
          students_taught: user?.studentsTaught || 0,
          average_rating: user?.averageRating,
          certification_level: user?.certificationLevel,
          earnings_total: user?.totalEarnings || 0
        };
      
      case 'admin':
        return {
          admin_level: user?.adminLevel || 'standard',
          departments: user?.departments?.join(', '),
          permissions: user?.permissions?.join(', '),
          last_admin_action: user?.lastAdminAction
        };
      
      case 'institution':
        return {
          institution_name: user?.institutionName,
          institution_type: user?.institutionType, // school, district, university, etc.
          student_capacity: user?.studentCapacity,
          teacher_count: user?.teacherCount || 0,
          admin_count: user?.adminCount || 0,
          subscription_tier: user?.subscriptionTier || 'basic',
          institution_size: user?.institutionSize, // small, medium, large, enterprise
          country: user?.country,
          state_province: user?.stateProvince
        };
      
      default:
        return {};
    }
  })();

  return {
    ...baseData,
    custom_attributes: {
      user_role: role,
      platform: 'learniverse',
      signup_date: user?.createdAt,
      last_login: user?.lastLogin,
      verified: user?.emailVerified || false,
      timezone: user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      account_status: user?.accountStatus || 'active',
      subscription_status: user?.subscriptionStatus,
      onboarding_completed: user?.onboardingCompleted || false,
      feature_flags: user?.featureFlags?.join(', '),
      support_priority: getRoleSpecificSettings(role).custom_attributes.support_priority,
      ...roleAttributes,
      ...user?.customAttributes
    }
  };
};

// Helper for school/organization data (for institutional accounts)
export const getLearniverseCompanyData = (organization: any) => {
  if (!organization) return undefined;
  
  return {
    id: organization.id,
    name: organization.name,
    created_at: organization.createdAt ? Math.floor(new Date(organization.createdAt).getTime() / 1000) : undefined,
    plan: organization.plan || 'school_basic',
    size: organization.studentCount || organization.teacherCount,
    website: organization.website,
    industry: 'Education',
    custom_attributes: {
      organization_type: organization.type || 'school', // school, district, homeschool, tutoring_center
      student_count: organization.studentCount || 0,
      teacher_count: organization.teacherCount || 0,
      grade_levels: organization.gradeLevels?.join(', '),
      subjects_offered: organization.subjectsOffered?.join(', '),
      subscription_status: organization.subscriptionStatus || 'active',
      country: organization.country,
      state_province: organization.stateProvince,
      ...organization.customAttributes
    }
  };
};