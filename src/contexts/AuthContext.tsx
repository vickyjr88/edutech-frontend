
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { Session } from "@ory/client-fetch";
import { authService } from "../services/auth.service";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  // Add additional fields from Ory identity
  verified?: boolean;
  metadata?: any;
  oryIdentityId?: string;
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
  updateUserAndTokens: (data: { user: { id: string, teacherId: string, studentId: string,  parentId: string }; accessToken: string; refreshToken: string }) => void;}

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
        verified: session.identity.verifiable_addresses?.[0]?.verified || false,
        metadata: session.identity.metadata_public,
        oryIdentityId: session.identity.id,
        // Role-specific IDs from backend response
        teacherId: backendUser?.teacherId,
        studentId: backendUser?.studentId,
        parentId: backendUser?.parentId,
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
        verified: session.identity.verifiable_addresses?.[0]?.verified || false,
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
          // Try to refresh the legacy tokens to get updated user data with teacherId
          const refreshResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: storedRefreshToken }),
          });
          
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            if (refreshData.user && refreshData.accessToken && refreshData.refreshToken) {
              // Update localStorage with fresh tokens and user data
              localStorage.setItem('kidato_access_token', refreshData.accessToken);
              localStorage.setItem('kidato_refresh_token', refreshData.refreshToken);
              localStorage.setItem('kidato_user', JSON.stringify(refreshData.user));
              
              return {
                id: refreshData.user.id,
                teacherId: refreshData.user.teacherId,
                studentId: refreshData.user.studentId,
                parentId: refreshData.user.parentId,
              };
            }
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
      const newUserResponse = await authService.createBackendUserFromOry(session);
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
    localStorage.removeItem('kidato_user');
    localStorage.removeItem('kidato_session_id');
    setUser(null);
    setSession(null);
  };

  const updateUserAndTokens = (data: { user: any; accessToken: string; refreshToken: string }) => {
    const { user: newUserData, accessToken, refreshToken } = data;
    const savedUser = localStorage.getItem('kidato_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      // Update all user fields including role-specific IDs
      user.id = newUserData.id;
      user.teacherId = newUserData.teacherId;
      user.studentId = newUserData.studentId;
      user.parentId = newUserData.parentId;
      setUser(user);
      localStorage.setItem('kidato_user', JSON.stringify(user));
    }
    localStorage.setItem('kidato_access_token', accessToken);
    localStorage.setItem('kidato_refresh_token', refreshToken);
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
          if(!isLegacyUser) await constructAndPersistUser(fixedSession as Session);
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

  const signOut = async () => {
    try {
      clearUserData();
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear data even if logout fails
      clearUserData();
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut, updateUserAndTokens }}>
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

