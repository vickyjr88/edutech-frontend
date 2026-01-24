
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { Session } from "@ory/client-fetch";
import { authService } from "../services/auth.service";
import api from "../lib/axios";
import { tokenRefreshManager } from "../integrations/api/auth-refresh";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  // Add additional fields from Ory identity
  verified?: boolean;
  metadata?: any;
  oryIdentityId?: string;
  phoneNumber?: string;
  alternativePhoneNumber?: string;
  bio?: string;
  // Role-specific IDs
  teacherId?: string;
  studentId?: string;
  parentId?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  updateUserAndTokens: (data: { user: { id: string, teacherId: string, studentId: string, parentId: string }; accessToken: string; refreshToken: string }) => void;
  retryBackendUserFetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize user from localStorage if available
    const savedUser = localStorage.getItem('kidato_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasCheckedSession = useRef(false);

  // Helper function to construct user from session and persist it
  const constructAndPersistUser = async (session: Session) => {
    try {
      // First, try to get or create the backend user
      const backendUser = await getOrCreateBackendUser(session);

      const user: User = {
        id: backendUser?.id || session.identity.id, // Use backend user ID if available, fallback to Ory ID
        email: session.identity.traits.email,
        fullName: `${session.identity.traits.name.first} ${session.identity.traits.name.last}`,
        role: session.identity.traits.role,
        // Additional Ory-specific fields
        verified: true,
        metadata: session.identity.metadata_public,
        oryIdentityId: session.identity.id,
        // Role-specific IDs from backend response
        teacherId: backendUser?.teacherId,
        studentId: backendUser?.studentId,
        parentId: backendUser?.parentId,
        // Basic info
        phoneNumber: backendUser?.phoneNumber,
        alternativePhoneNumber: backendUser?.alternativePhoneNumber,
        bio: backendUser?.bio,
      };

      // Persist user to localStorage for faster subsequent loads
      localStorage.setItem('kidato_user', JSON.stringify(user));
      localStorage.setItem('kidato_session_id', session.id);

      setUser(user);
      setSession(session);

      return user;
    } catch (error) {
      console.error('Failed to construct user with backend mapping:', error);
      // Fallback to Ory-only user construction
      const user: User = {
        id: session.identity.id,
        email: session.identity.traits.email,
        fullName: `${session.identity.traits.name.first} ${session.identity.traits.name.last}`,
        role: session.identity.traits.role,
        verified: true,
        metadata: session.identity.metadata_public,
        oryIdentityId: session.identity.id,
        // Role-specific IDs will be undefined in fallback
        teacherId: undefined,
        studentId: undefined,
        parentId: undefined,
      };

      localStorage.setItem('kidato_user', JSON.stringify(user));
      localStorage.setItem('kidato_session_id', session.id);

      setUser(user);
      setSession(session);

      return user;
    }
  };

  // Helper function to get or create backend user from Ory session
  const getOrCreateBackendUser = async (session: Session) => {
    try {
      // Check if this is a legacy user session (indicated by stored tokens)
      const storedAccessToken = localStorage.getItem('kidato_access_token');
      const storedRefreshToken = localStorage.getItem('kidato_refresh_token');
      const storedUser = localStorage.getItem('kidato_user');

      if (storedAccessToken && storedRefreshToken && storedUser) {
        try {
          const user = JSON.parse(storedUser);
          // Use the unified refresh manager to get updated tokens and user data
          const accessToken = await tokenRefreshManager.refreshToken();
          const refreshedUserJson = localStorage.getItem('kidato_user');
          const refreshedUser = refreshedUserJson ? JSON.parse(refreshedUserJson) : null;

          if (refreshedUser) {
            return {
              id: refreshedUser.id,
              teacherId: refreshedUser.teacherId,
              studentId: refreshedUser.studentId,
              parentId: refreshedUser.parentId,
            };
          }

          // If refresh fails but we have stored user data, use it
          return {
            id: user.id,
            teacherId: user.teacherId,
            studentId: user.studentId,
            parentId: user.parentId,
          };
        } catch (error) {
          console.error('Error refreshing legacy tokens:', error);
        }
      }

      // For Ory users, use the existing logic
      // First, try to find existing user by Ory identity ID
      const existingUserResponse = await authService.getBackendUserByOryId(session.identity.id);
      if (existingUserResponse?.user) {
        if (existingUserResponse.accessToken && existingUserResponse.refreshToken) {
          updateUserAndTokens(existingUserResponse);
        }
        return existingUserResponse.user; // Extract user from auth response
      }

      // If user doesn't exist, create a new one
      if (!session.identity) {
        console.error("Session has no identity, cannot create backend user");
        return null;
      }
      const newUserResponse = await authService.createBackendUserFromOry(session as any);
      if (newUserResponse?.user) {
        if (newUserResponse.accessToken && newUserResponse.refreshToken) {
          updateUserAndTokens(newUserResponse);
        }
        return newUserResponse.user; // Extract user from auth response
      }

      return null;
    } catch (error) {
      console.error('Error getting/creating backend user:', error);
      return null;
    }
  };

  // Helper function to clear user data
  const clearUserData = () => {
    // Clear localStorage
    localStorage.removeItem('kidato_user');
    localStorage.removeItem('kidato_session_id');
    localStorage.removeItem('kidato_access_token');
    localStorage.removeItem('kidato_refresh_token');

    // Clear any other authentication-related items
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('kidato_') || key.startsWith('ory_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Clear sessionStorage as well
    const sessionKeysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.startsWith('kidato_') || key.startsWith('ory_'))) {
        sessionKeysToRemove.push(key);
      }
    }
    sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));

    // Clear React state
    setUser(null);
    setSession(null);
  };


  useEffect(() => {
    if (hasCheckedSession.current) {
      return;
    }
    hasCheckedSession.current = true;

    const checkSession = async () => {
      try {
        const session = await authService.getCurrentSession();
        if (session) {
          // Fix expires_at type mismatch
          const fixedSession = {
            ...session,
            expires_at: typeof session.expires_at === 'string' ? new Date(session.expires_at) : session.expires_at,
          };
          const storedUser = localStorage.getItem('kidato_user');
          const isLegacyUser = storedUser ? JSON.parse(storedUser).legacy : false;
          if (!isLegacyUser) await constructAndPersistUser(fixedSession as any as Session);
        } else {
          console.log('No session found, clearing user data');
          clearUserData();
        }
      } catch (error) {
        console.error('Session check failed:', error);
        clearUserData();
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const signOut = React.useCallback(async () => {
    try {
      // Clear user data first to prevent any authentication loops
      clearUserData();
      setIsLoading(false); // Ensure loading state is cleared

      // Call auth service logout which handles both local and server-side logout
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
      // Ensure data is cleared and redirect even if logout fails
      clearUserData();
      setIsLoading(false);
      // Force navigation to login if it hasn't happened
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
  }, []);

  const updateUserAndTokens = React.useCallback((data: { user: any; accessToken: string; refreshToken: string }) => {
    const { user: newUserData, accessToken, refreshToken } = data;
    const savedUser = localStorage.getItem('kidato_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      // Update all user fields including role-specific IDs
      const updatedUser = {
        ...user,
        id: newUserData.id,
        teacherId: newUserData.teacherId,
        studentId: newUserData.studentId,
        parentId: newUserData.parentId,
        phoneNumber: newUserData.phoneNumber,
        alternativePhoneNumber: newUserData.alternativePhoneNumber,
        bio: newUserData.bio,
        fullName: newUserData.fullName || user.fullName,
      };
      setUser(updatedUser);
      localStorage.setItem('kidato_user', JSON.stringify(updatedUser));
    }
    localStorage.setItem('kidato_access_token', accessToken);
    localStorage.setItem('kidato_refresh_token', refreshToken);
  }, []);

  const retryBackendUserFetch = React.useCallback(async () => {
    if (!session && !user) {
      console.error('No active session or user to retry backend user fetch');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Retrying backend user fetch...');

      // First, check if this is a role/profile mismatch issue for Ory users
      if (user && user.oryIdentityId) {
        const roleProfileMismatch =
          (user.role === 'teacher' && user.studentId && !user.teacherId) ||
          (user.role === 'student' && user.teacherId && !user.studentId) ||
          (user.role === 'parent' && (user.teacherId || user.studentId) && !user.parentId);

        if (roleProfileMismatch) {
          console.log('Detected role/profile mismatch, calling fix endpoint...');
          try {
            const fixResponse = await api.post(`/api/v1/users/fix-profile-mismatch/${user.oryIdentityId}`);

            if (fixResponse.status === 200 || fixResponse.status === 201) {
              const fixData = fixResponse.data;
              console.log('Profile mismatch fixed:', fixData);

              if (fixData.user) {
                const updatedUser: User = {
                  ...user,
                  teacherId: fixData.user.teacherId,
                  studentId: fixData.user.studentId,
                  parentId: fixData.user.parentId,
                  phoneNumber: fixData.user.phoneNumber,
                  alternativePhoneNumber: fixData.user.alternativePhoneNumber,
                  bio: fixData.user.bio,
                };

                localStorage.setItem('kidato_user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                console.log('Successfully fixed profile mismatch:', updatedUser);
                return;
              }
            }
          } catch (fixError) {
            console.error('Error fixing profile mismatch:', fixError);
          }
        }
      }

      // Fallback to regular retry logic for other cases
      if (session) {
        const backendUser = await getOrCreateBackendUser(session);

        if (backendUser) {
          const updatedUser: User = {
            ...user!,
            id: backendUser.id || user!.id,
            teacherId: backendUser.teacherId,
            studentId: backendUser.studentId,
            parentId: backendUser.parentId,
          };

          localStorage.setItem('kidato_user', JSON.stringify(updatedUser));
          setUser(updatedUser);
          console.log('Successfully updated user with backend data:', updatedUser);
        } else {
          console.error('Failed to retry backend user fetch');
        }
      }
    } catch (error) {
      console.error('Error retrying backend user fetch:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, session]);

  const contextValue = React.useMemo(() => ({
    user,
    session,
    isLoading,
    signOut,
    updateUserAndTokens,
    retryBackendUserFetch
  }), [user, session, isLoading, signOut, updateUserAndTokens, retryBackendUserFetch]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

