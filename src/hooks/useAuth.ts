import { useEffect, useState } from 'react';
import { Session } from '@ory/client-fetch';
import { ory } from '../config/ory';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    ory
      .toSession()
      .then((session) => {
        setSession(session);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const logout = async () => {
    try {
      const logoutFlow= await ory.createBrowserLogoutFlow();
      window.location.href = logoutFlow.logout_url;
    } catch (err) {
      setError(err as Error);
    }
  };

  return {
    session,
    loading,
    error,
    logout,
    isAuthenticated: !!session,
  };
}
