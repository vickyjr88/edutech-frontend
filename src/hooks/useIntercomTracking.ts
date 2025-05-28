import { useIntercom } from '@/components/support/IntercomProvider';
import { LEARNIVERSE_EVENTS } from '@/components/support/IntercomConfig';
import { useCallback } from 'react';

export const useIntercomTracking = () => {
  const { trackEvent, update, isLoaded } = useIntercom();

  // Student tracking events
  const trackStudentEvent = useCallback({
    enrollInClass: (classId: string, className: string, teacherName: string) => {
      if (isLoaded) {
        trackEvent(LEARNIVERSE_EVENTS.STUDENT_ENROLLED_CLASS, {
          class_id: classId,
          class_name: className,
          teacher_name: teacherName,
          timestamp: new Date().toISOString()
        });
      }
    },

    completeLesson: (lessonId: string, lessonTitle: string, duration: number) => {
      if (isLoaded) {
        trackEvent(LEARNIVERSE_EVENTS.STUDENT_COMPLETED_LESSON, {
          lesson_id: lessonId,
          lesson_title: lessonTitle,
          duration_minutes: duration,
          timestamp: new Date().toISOString()
        });
      }
    },

    submitAssignment: (assignmentId: string, assignmentTitle: string, submissionType: string) => {
      if (isLoaded) {
        trackEvent(LEARNIVERSE_EVENTS.STUDENT_SUBMITTED_ASSIGNMENT, {
          assignment_id: assignmentId,
          assignment_title: assignmentTitle,
          submission_type: submissionType,
          timestamp: new Date().toISOString()
        });
      }
    },

    joinLiveSession: (sessionId: string, sessionType: 'class' | 'tutoring') => {
      if (isLoaded) {
        trackEvent(LEARNIVERSE_EVENTS.STUDENT_JOINED_LIVE_SESSION, {
          session_id: sessionId,
          session_type: sessionType,
          timestamp: new Date().toISOString()
        });
      }
    },

    unlockAchievement: (achievementId: string, achievementName: string, category: string) => {
      if (isLoaded) {
        trackEvent(LEARNIVERSE_EVENTS.STUDENT_ACHIEVEMENT_UNLOCKED, {
          achievement_id: achievementId,
          achievement_name: achievementName,
          category,
          timestamp: new Date().toISOString()
        });
      }
    }
  }, [trackEvent, isLoaded]);

  // Parent tracking events
  const trackParentEvent = useCallback({
    viewChildProgress: (childId: string, childName: string, reportType: string) => {
      if (isLoaded) {
        trackEvent(LEARNIVERSE_EVENTS.PARENT_VIEWED_CHILD_PROGRESS, {
          child_id: childId,
          child_name: childName,
          report_type: reportType,
          timestamp: new Date().toISOString()
        });
      }
    },

    scheduleMeeting: (teacherId: string, teacherName: string, meetingType: string) => {
      if (isLoaded) {
        trackEvent(LEARNIVERSE_EVENTS.PARENT_SCHEDULED_MEETING, {
          teacher_id: teacherId,
          teacher_name: teacherName,
          meeting_type: meetingType,
          timestamp: new Date().toISOString()
        });
      }
    },

    updatePayment: (paymentMethod: string, amount: number) => {
      if (isLoaded) {
        trackEvent(LEARNIVERSE_EVENTS.PARENT_UPDATED_PAYMENT, {
          payment_method: paymentMethod,
          amount,
          timestamp: new Date().toISOString()
        });
      }
    },

    enrollChild: (childId: string, classId: string, className: string) => {
      if (isLoaded) {
        trackEvent(LEARNIVERSE_EVENTS.PARENT_ENROLLED_CHILD, {
          child_id: childId,
          class_id: classId,
          class_name: className,
          timestamp: new Date().toISOString()
        });
      }
    },

    downloadReport: (reportType: string, childId?: string) => {
      if (isLoaded) {
        trackEvent(LEARNIVERSE_EVENTS.PARENT_DOWNLOADED_REPORT, {
          report_type: reportType,
          child_id: childId,
          timestamp: new Date().toISOString()
        });
      }
    }
  }, [trackEvent, isLoaded]);

  // Teacher tracking events
  const trackTeacherEvent = useCallback({
    createClass: (classId: string, className: string, subject: string) => {
      if (isLoaded) {
        trackEvent(LEARNIVERSE_EVENTS.TEACHER_CREATED_CLASS, {
          class_id: classId,
          class_name: className,
          subject,
          timestamp: new Date().toISOString()
        });
      }
    },

    publishLesson: (lessonId: string, lessonTitle: string, classId: string) => {
      if (isLoaded) {
        trackEvent(LEARNIVERSE_EVENTS.TEACHER_PUBLISHED_LESSON, {
          lesson_id: lessonId,
          lesson_title: lessonTitle,
          class_id: classId,
          timestamp: new Date().toISOString()
        });
      }
    },

    gradeAssignment: (assignmentId: string, studentId: string, grade: number) => {
      if (isLoaded) {
        trackEvent(LEARNIVERSE_EVENTS.TEACHER_GRADED_ASSIGNMENT, {
          assignment_id: assignmentId,
          student_id: studentId,
          grade,
          timestamp: new Date().toISOString()
        });
      }
    },

    scheduleLiveClass: (classId: string, sessionType: string, duration: number) => {
      if (isLoaded) {
        trackEvent(LEARNIVERSE_EVENTS.TEACHER_SCHEDULED_LIVE_CLASS, {
          class_id: classId,
          session_type: sessionType,
          duration_minutes: duration,
          timestamp: new Date().toISOString()
        });
      }
    },

    receivePayment: (amount: number, paymentType: string) => {
      if (isLoaded) {
        trackEvent(LEARNIVERSE_EVENTS.TEACHER_RECEIVED_PAYMENT, {
          amount,
          payment_type: paymentType,
          timestamp: new Date().toISOString()
        });
      }
    },

    inviteStudents: (classId: string, inviteMethod: string, studentCount: number) => {
      if (isLoaded) {
        trackEvent(LEARNIVERSE_EVENTS.TEACHER_INVITED_STUDENTS, {
          class_id: classId,
          invite_method: inviteMethod,
          student_count: studentCount,
          timestamp: new Date().toISOString()
        });
      }
    }
  }, [trackEvent, isLoaded]);

  // Platform events
  const trackPlatformEvent = useCallback({
    connectZoom: () => {
      if (isLoaded) {
        trackEvent(LEARNIVERSE_EVENTS.ZOOM_INTEGRATION_CONNECTED, {
          timestamp: new Date().toISOString()
        });
      }
    },

    addPaymentMethod: (paymentType: string) => {
      if (isLoaded) {
        trackEvent(LEARNIVERSE_EVENTS.PAYMENT_METHOD_ADDED, {
          payment_type: paymentType,
          timestamp: new Date().toISOString()
        });
      }
    },

    upgradeSubscription: (fromPlan: string, toPlan: string) => {
      if (isLoaded) {
        trackEvent(LEARNIVERSE_EVENTS.SUBSCRIPTION_UPGRADED, {
          from_plan: fromPlan,
          to_plan: toPlan,
          timestamp: new Date().toISOString()
        });
      }
    },

    completeProfile: (profileType: string, completionPercentage: number) => {
      if (isLoaded) {
        trackEvent(LEARNIVERSE_EVENTS.PROFILE_COMPLETED, {
          profile_type: profileType,
          completion_percentage: completionPercentage,
          timestamp: new Date().toISOString()
        });
      }
    }
  }, [trackEvent, isLoaded]);

  // Support events
  const trackSupportEvent = useCallback({
    viewHelpArticle: (articleId: string, articleTitle: string, category: string) => {
      if (isLoaded) {
        trackEvent(LEARNIVERSE_EVENTS.HELP_ARTICLE_VIEWED, {
          article_id: articleId,
          article_title: articleTitle,
          category,
          timestamp: new Date().toISOString()
        });
      }
    },

    initiateContact: (contactMethod: string, topic?: string) => {
      if (isLoaded) {
        trackEvent(LEARNIVERSE_EVENTS.SUPPORT_CONTACT_INITIATED, {
          contact_method: contactMethod,
          topic,
          timestamp: new Date().toISOString()
        });
      }
    },

    submitFeatureRequest: (feature: string, priority: string) => {
      if (isLoaded) {
        trackEvent(LEARNIVERSE_EVENTS.FEATURE_REQUEST_SUBMITTED, {
          feature,
          priority,
          timestamp: new Date().toISOString()
        });
      }
    },

    submitBugReport: (bugType: string, severity: string, page: string) => {
      if (isLoaded) {
        trackEvent(LEARNIVERSE_EVENTS.BUG_REPORT_SUBMITTED, {
          bug_type: bugType,
          severity,
          page,
          timestamp: new Date().toISOString()
        });
      }
    }
  }, [trackEvent, isLoaded]);

  // Update user attributes
  const updateUserAttributes = useCallback((attributes: Record<string, any>) => {
    if (isLoaded) {
      update({
        custom_attributes: attributes
      });
    }
  }, [update, isLoaded]);

  return {
    trackStudentEvent,
    trackParentEvent,
    trackTeacherEvent,
    trackPlatformEvent,
    trackSupportEvent,
    updateUserAttributes,
    isLoaded
  };
};