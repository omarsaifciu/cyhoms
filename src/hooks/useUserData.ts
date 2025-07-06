
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/user";

interface UserWithEmail extends UserProfile {
  email: string;
}

export const useUserData = () => {
  const [users, setUsers] = useState<UserWithEmail[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      console.log('Fetching users with emails...');

      // Get current user session
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      // Fetch profiles first
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log('Profiles fetched:', profiles?.length || 0);

      // إنشاء قائمة المستخدمين مع إيميلات بسيطة
      // Create users list with simple emails
      const combinedUsers: UserWithEmail[] = (profiles || []).map(profile => {
        // إنشاء إيميل بسيط للعرض
        // Create simple email for display
        const displayEmail = profile.username
          ? `${profile.username}@temp-email.com`
          : profile.full_name
            ? `${profile.full_name.replace(/\s+/g, '.').toLowerCase()}@temp-email.com`
            : `user-${profile.id.substring(0, 8)}@temp-email.com`;

        return {
          id: profile.id,
          full_name: profile.full_name,
          phone: profile.phone || '',
          user_type: profile.user_type as 'client' | 'agent' | 'property_owner' | 'real_estate_office' | 'partner_and_site_owner' | 'support',
          is_approved: profile.is_approved || false,
          is_verified: profile.is_verified || false,
          is_suspended: profile.is_suspended || false,
          language_preference: (profile.language_preference as 'ar' | 'en' | 'tr') || 'en',
          theme_preference: (profile.theme_preference as 'dark' | 'light' | 'system') || 'system',
          username: profile.username || '',
          avatar_url: profile.avatar_url || null,
          whatsapp_number: profile.whatsapp_number,
          is_trial_active: profile.is_trial_active,
          trial_started_at: profile.trial_started_at,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
          email: displayEmail
        };
      });

      console.log('Combined users created:', combinedUsers.length);
      console.log('Combined users data:', combinedUsers);
      setUsers(combinedUsers);
      setLoading(false);

    } catch (error) {
      console.error('Error fetching users:', error);
      // Set empty array on error to prevent infinite loading
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    refreshUsers: fetchUsers
  };
};
