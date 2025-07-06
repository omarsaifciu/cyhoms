
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/user';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        console.log('=== FETCHING USER PROFILE ===');
        console.log('User ID:', user.id);

        const { data, error } = await supabase
          .from('profiles')
          .select(`
            id,
            full_name,
            phone,
            user_type,
            is_approved,
            is_verified,
            is_suspended,
            suspension_end_date,
            suspension_reason,
            suspension_reason_ar,
            suspension_reason_en,
            suspension_reason_tr,
            language_preference,
            username,
            avatar_url,
            whatsapp_number,
            is_trial_active,
            trial_started_at,
            theme_preference,
            created_at,
            updated_at
          `)
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('=== PROFILE FETCH ERROR ===');
          console.error('Error:', error);
          setError(error.message);
          throw error;
        }

        console.log('=== PROFILE FETCH SUCCESS ===');
        console.log('Profile data:', JSON.stringify(data, null, 2));
        
        if (data?.is_suspended) {
          console.log('=== USER IS SUSPENDED ===');
          console.log('suspension_end_date:', data.suspension_end_date);
          console.log('suspension_end_date type:', typeof data.suspension_end_date);
          
          const isTemporary = data.suspension_end_date !== null && 
                             data.suspension_end_date !== undefined && 
                             data.suspension_end_date !== '';
          console.log('Is temporary suspension:', isTemporary);
        }

        // Check if user is admin
        const { data: adminData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();

        const profileWithAdmin: UserProfile = {
          id: data.id,
          full_name: data.full_name,
          phone: data.phone || '',
          user_type: (data.user_type as 'client' | 'seller' | 'property_owner' | 'real_estate_office' | 'partner_and_site_owner') || 'client',
          is_approved: data.is_approved ?? false,
          is_verified: data.is_verified,
          is_suspended: data.is_suspended,
          suspension_end_date: data.suspension_end_date,
          suspension_reason: data.suspension_reason,
          suspension_reason_ar: data.suspension_reason_ar,
          suspension_reason_en: data.suspension_reason_en,
          suspension_reason_tr: data.suspension_reason_tr,
          language_preference: (data.language_preference as 'ar' | 'en' | 'tr') || 'en',
          theme_preference: (data.theme_preference as 'dark' | 'light' | 'system') || 'system',
          username: data.username || '',
          avatar_url: data.avatar_url,
          whatsapp_number: data.whatsapp_number,
          trial_started_at: data.trial_started_at,
          is_trial_active: data.is_trial_active,
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString(),
          is_admin: !!adminData
        };

        setProfile(profileWithAdmin);
        setError(null);
      } catch (error) {
        console.error('=== PROFILE FETCH ERROR ===');
        console.error('Error:', error);
        setProfile(null);
        setError('فشل في جلب بيانات الملف الشخصي');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return false;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error);
        setError(error.message);
        return false;
      }

      // Update local state
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      setError(null);
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      setError('فشل في تحديث الملف الشخصي');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, setProfile, updateProfile };
};
