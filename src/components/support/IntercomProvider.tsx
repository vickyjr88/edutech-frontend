import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Intercom } from '@intercom/messenger-js-sdk';
import { IntercomSettings, IntercomUser, IntercomCompany, IntercomConfig } from './types';

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
  user?: IntercomUser;
  company?: IntercomCompany;
  autoboot?: boolean;
}

export const IntercomProvider: React.FC<IntercomProviderProps> = ({
  children,
  config,
  user,
  company,
  autoboot = true
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initializeIntercom = async () => {
      try {
        // Initialize Intercom
        await Intercom({
          app_id: config.appId,
          ...user,
          company,
          custom_attributes: {
            ...user?.custom_attributes,
            user_role: getUserRole(),
            platform: 'learniverse'
          }
        });

        setIsLoaded(true);

        // Auto-boot if enabled
        if (autoboot) {
          boot();
        }
      } catch (error) {
        console.error('Failed to initialize Intercom:', error);
      }
    };

    if (config.appId) {
      initializeIntercom();
    }

    // Cleanup on unmount
    return () => {
      if (window.Intercom) {
        window.Intercom('shutdown');
      }
    };
  }, [config.appId, user, company, autoboot]);

  const getUserRole = (): string => {
    // This would typically come from your auth context
    // For now, we'll determine based on URL or user data
    const path = window.location.pathname;
    if (path.includes('/teacher')) return 'teacher';
    if (path.includes('/parent')) return 'parent';
    if (path.includes('/student')) return 'student';
    return 'visitor';
  };

  const boot = (settings?: Partial<IntercomSettings>) => {
    if (window.Intercom) {
      window.Intercom('boot', {
        app_id: config.appId,
        ...user,
        company,
        custom_attributes: {
          ...user?.custom_attributes,
          user_role: getUserRole(),
          platform: 'learniverse'
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
    if (window.Intercom) {
      window.Intercom('update', {
        ...user,
        company,
        custom_attributes: {
          ...user?.custom_attributes,
          user_role: getUserRole(),
          platform: 'learniverse'
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