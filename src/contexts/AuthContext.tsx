
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { Session } from "@ory/client-fetch";
import { authService } from "../services/auth.service";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasCheckedSession = useRef(false);

  useEffect(() => {
    if (hasCheckedSession.current) {
      return;
    }
    hasCheckedSession.current = true;

    const checkSession = async () => {
      try {
        const session = await authService.getCurrentSession();
        if (session) {
          setSession(session);
          setUser({
            id: session.identity.id,
            email: session.identity.traits.email,
            fullName: `${session.identity.traits.name.first} ${session.identity.traits.name.last}`,
            role: session.identity.traits.role,
          });
        } else {
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setSession(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const signOut = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
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

