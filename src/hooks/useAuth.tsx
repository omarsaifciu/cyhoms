
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { logUserLogin, logUserLogout } from '@/utils/activityLogger';

type Profile = Tables<'profiles'>;
type UserRole = Tables<'user_roles'>;

interface AuthState {
  user: User | null;
  profile: Profile | null;
  roles: string[];
  isAdmin: boolean;
  isSeller: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper computed values
  const isAdmin = roles.includes('admin');
  const isSeller = roles.includes('seller') || (profile?.user_type === 'agent') || (profile?.user_type === 'property_owner') || (profile?.user_type === 'real_estate_office') || (profile?.user_type === 'partner_and_site_owner');

  const fetchUserData = async (currentUser: User) => {
    try {
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      } else {
        setProfile(profileData);
        console.log('Profile loaded:', profileData);
      }

      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', currentUser.id);

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
        setRoles([]);
      } else {
        const userRoles = rolesData?.map(r => r.role) || [];
        setRoles(userRoles);
        console.log('User roles loaded:', userRoles);
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error);
    }
  };

  const refreshAuth = async () => {
    setLoading(true);
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        return;
      }

      if (session?.user) {
        setUser(session.user);
        await fetchUserData(session.user);
      } else {
        setUser(null);
        setProfile(null);
        setRoles([]);
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (session?.user) {
          setUser(session.user);
          // Defer data fetching to avoid blocking auth state changes
          setTimeout(() => {
            fetchUserData(session.user);
          }, 0);
        } else {
          setUser(null);
          setProfile(null);
          setRoles([]);
        }
        setLoading(false);
      }
    );

    // Initial session check
    refreshAuth();

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (!error) {
      // Auth state change will handle the rest
      // Get the current user to log the login activity
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        await logUserLogin(currentUser.id);
      }
    }
    
    setLoading(false);
    return { error };
  };

  const signUp = async (email: string, password: string, userData: any = {}) => {
    setLoading(true);
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData
      }
    });
    
    setLoading(false);
    return { error };
  };

  const signOut = async () => {
    setLoading(true);

    // Log the logout activity before signing out
    if (user) {
      await logUserLogout(user.id);
    }

    const { error } = await supabase.auth.signOut();

    if (!error) {
      setUser(null);
      setProfile(null);
      setRoles([]);
    }
    
    setLoading(false);
    return { error };
  };

  const value: AuthState = {
    user,
    profile,
    roles,
    isAdmin,
    isSeller,
    loading,
    signIn,
    signUp,
    signOut,
    refreshAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
