
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@/integrations/api/types/auth.types";
import {authService} from "@/integrations/api";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [teacherId, setTeacher] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const unsubscribe = authService.onAuthStateChange((newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsLoading(false);
    });

    // THEN check for existing session
    const currentSession = authService.getSession();
    setSession(currentSession);
    setUser(currentSession?.user ?? null);

    // If we have a session, verify it's still valid by getting current user
    if (currentSession) {
      authService.getCurrentUser().then(({ data }) => {
        if (!data) {
          // Session invalid, clear it
          setSession(null);
          setUser(null);
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await authService.logout();
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
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
