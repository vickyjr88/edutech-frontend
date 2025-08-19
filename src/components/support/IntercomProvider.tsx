import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Intercom } from '@intercom/messenger-js-sdk';
import { IntercomSettings, IntercomUser, IntercomCompany, IntercomConfig } from './types';
import { useAuth } from '@/contexts/AuthContext';
import { getLearniverseUserData, getRoleSpecificSettings } from './IntercomConfig';

interface IntercomContextType {
  isLoaded: boolean;
  boot: (settings?: Partial<IntercomSettings>) => void;
  shutdown: () => void;
  update: (settings?: Partial<IntercomSettings>) => void;
  show: () => void;
  hide: () => void;
  showMessages: () => void;
  showNewMessage: (content?: string) => void;
  trackEvent: (eventName: string, metadata?: Record<string, any>) => void;
  getVisitorId: () => string | null;
  startTour: (tourId: number) => void;
}

const IntercomContext = createContext<IntercomContextType | null>(null);

interface IntercomProviderProps {
  children: ReactNode;
  config: IntercomConfig;
  autoboot?: boolean;
}

export const IntercomProvider: React.FC<IntercomProviderProps> = ({
  children,
  config,
  autoboot = true
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const initializeIntercom = async () => {
      console.log("From intercom", user)
      // Don't initialize until auth is complete
      if (isLoading) {
        return;
      }

      // Only initialize for authenticated users (not for public pages)
      if (!user) {
        return;
      }

      try {
        // Get role-specific data from our user object
        const userRole = user.role as any;
        const userData = getLearniverseUserData(user, userRole);
        
        // Initialize Intercom with authenticated user data
        await Intercom({
          app_id: config.appId,
          ...userData,
          custom_attributes: {
            ...userData.custom_attributes,
            user_role: userRole,
            platform: 'learniverse',
            user_id: user.id,
            teacher_id: user.teacherId,
            student_id: user.studentId,
            parent_id: user.parentId
          }
        });

        setIsLoaded(true);

        // Auto-boot if enabled
        if (autoboot) {
          boot();
        }
      } catch (error) {
        setIsLoaded(false);
        console.error('Failed to initialize Intercom:', error);
      }
    };

    if (config.appId && import.meta.env.MODE !== 'development') {
      initializeIntercom();
    }

    // Cleanup when user logs out or component unmounts
    return () => {
      if (window.Intercom) {
        window.Intercom('shutdown');
        setIsLoaded(false);
      }
    };
  }, [config.appId, user, isLoading, autoboot]);


  const boot = (settings?: Partial<IntercomSettings>) => {
    if (window.Intercom && user) {
      const userRole = user.role as any;
      const userData = getLearniverseUserData(user, userRole);
      
      window.Intercom('boot', {
        app_id: config.appId,
        ...userData,
        custom_attributes: {
          ...userData.custom_attributes,
          user_role: userRole,
          platform: 'learniverse',
          user_id: user.id,
          teacher_id: user.teacherId,
          student_id: user.studentId,
          parent_id: user.parentId
        },
        ...settings
      });
    }
  };

  const shutdown = () => {
    if (window.Intercom) {
      window.Intercom('shutdown');
      setIsLoaded(false);
    }
  };

  const update = (settings?: Partial<IntercomSettings>) => {
    if (window.Intercom && user) {
      const userRole = user.role as any;
      const userData = getLearniverseUserData(user, userRole);
      
      window.Intercom('update', {
        ...userData,
        custom_attributes: {
          ...userData.custom_attributes,
          user_role: userRole,
          platform: 'learniverse',
          user_id: user.id,
          teacher_id: user.teacherId,
          student_id: user.studentId,
          parent_id: user.parentId
        },
        ...settings
      });
    }
  };

  const show = () => {
    if (window.Intercom) {
      window.Intercom('show');
    }
  };

  const hide = () => {
    if (window.Intercom) {
      window.Intercom('hide');
    }
  };

  const showMessages = () => {
    if (window.Intercom) {
      window.Intercom('showMessages');
    }
  };

  const showNewMessage = (content?: string) => {
    if (window.Intercom) {
      window.Intercom('showNewMessage', content);
    }
  };

  const trackEvent = (eventName: string, metadata?: Record<string, any>) => {
    if (window.Intercom) {
      window.Intercom('trackEvent', eventName, metadata);
    }
  };

  const getVisitorId = (): string | null => {
    if (window.Intercom) {
      return window.Intercom('getVisitorId');
    }
    return null;
  };

  const startTour = (tourId: number) => {
    if (window.Intercom) {
      window.Intercom('startTour', tourId);
    }
  };

  const contextValue: IntercomContextType = {
    isLoaded,
    boot,
    shutdown,
    update,
    show,
    hide,
    showMessages,
    showNewMessage,
    trackEvent,
    getVisitorId,
    startTour
  };

  return (
    <IntercomContext.Provider value={contextValue}>
      {children}
    </IntercomContext.Provider>
  );
};

export const useIntercom = (): IntercomContextType => {
  const context = useContext(IntercomContext);
  if (!context) {
    throw new Error('useIntercom must be used within an IntercomProvider');
  }
  return context;
};

// Extend the Window interface to include Intercom
declare global {
  interface Window {
    Intercom: any;
  }
}