
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TrialUser {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string;
  user_type: 'agent' | 'property_owner' | 'real_estate_office';
  is_trial_active: boolean;
  trial_started_at: string | null;
  created_at: string;
}

export const useTrialUsers = () => {
  const [trialUsers, setTrialUsers] = useState<TrialUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrialUsers = async () => {
    try {
      console.log('Fetching trial users...');
      
      // الحصول على المستخدمين الذين لديهم تجربة نشطة (مؤقتة أو دائمة)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_trial_active', true)
        .in('user_type', ['seller', 'property_owner', 'real_estate_office'])
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching trial users:', profilesError);
        throw profilesError;
      }

      console.log('Trial users fetched:', profiles?.length || 0);

      // الحصول على الإيميلات من auth.users
      let authUsers: any[] = [];
      try {
        const { data: { users: authData }, error: authError } = await supabase.auth.admin.listUsers();
        if (!authError && authData) {
          authUsers = authData;
        }
      } catch (error) {
        console.warn('Could not fetch auth users, continuing without emails:', error);
      }

      const usersWithEmails: TrialUser[] = (profiles || []).map(profile => {
        const authUser = authUsers.find((u: any) => u.id === profile.id);
        return {
          id: profile.id,
          full_name: profile.full_name,
          phone: profile.phone,
          email: authUser?.email || `user_${profile.id.substring(0, 8)}@hidden.com`,
          user_type: profile.user_type as 'seller' | 'property_owner' | 'real_estate_office',
          is_trial_active: profile.is_trial_active,
          trial_started_at: profile.trial_started_at,
          created_at: profile.created_at
        };
      });

      setTrialUsers(usersWithEmails);
    } catch (error) {
      console.error('Error fetching trial users:', error);
      setTrialUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrialUsers();
  }, []);

  return {
    trialUsers,
    loading,
    refetch: fetchTrialUsers
  };
};
