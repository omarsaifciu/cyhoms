
import { useState, useEffect } from 'react';
import { getUserSession } from '@/utils/userSessionManager';
import { supabase } from '@/integrations/supabase/client';

/**
 * Custom React hook for managing user session and roles
 * Automatically updates when auth state changes
 */
export const useUserSession = () => {
  const [sessionData, setSessionData] = useState({
    user: null,
    profile: null,
    roles: [],
    loading: true,
    error: null
  });

  // Function to fetch and update session
  const fetchSession = async () => {
    try {
      const session = await getUserSession();
      setSessionData({
        ...session,
        loading: false
      });
    } catch (error) {
      console.error('Error in useUserSession:', error);
      setSessionData({
        user: null,
        profile: null,
        roles: [],
        loading: false,
        error
      });
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        // Re-fetch session data when auth state changes
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          await fetchSession();
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    ...sessionData,
    refetch: fetchSession
  };
};
