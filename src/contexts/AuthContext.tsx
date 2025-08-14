
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session } from "@ory/kratos-client";
import { ory } from "../config/ory";

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

  useEffect(() => {
    // Check for existing session with Ory
    const checkSession = async () => {
      try {
        const { data: session } = await ory.toSession();
        setSession(session);
        setUser({
          id: session.identity.id,
          email: session.identity.traits.email,
          fullName: `${session.identity.traits.name.first} ${session.identity.traits.name.last}`,
          role: session.identity.traits.role,
        });
      } catch (error) {
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
      const { data: logoutFlow } = await ory.createSelfServiceLogoutFlowUrlForBrowsers();
      window.location.href = logoutFlow.logout_url;
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
