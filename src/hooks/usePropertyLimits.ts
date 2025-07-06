
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PropertyLimit {
  id: string;
  user_id: string;
  property_limit: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
  notes?: string;
  profiles?: {
    id: string;
    full_name: string;
    username: string;
  };
}

export const usePropertyLimits = () => {
  const [limits, setLimits] = useState<PropertyLimit[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLimits = async () => {
    try {
      setLoading(true);

      // First get profiles for users who should have property limits (sellers only)
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, username, user_type')
        .in('user_type', ['agent', 'property_owner', 'real_estate_office', 'partner_and_site_owner'])
        .order('full_name', { ascending: true });

      if (profilesError) throw profilesError;

      if (!profilesData || profilesData.length === 0) {
        setLimits([]);
        return;
      }

      // Get user IDs
      const userIds = profilesData.map(profile => profile.id);

      // Fetch property limits for these users
      const { data: limitsData, error: limitsError } = await supabase
        .from('user_property_limits')
        .select('*')
        .in('user_id', userIds)
        .order('updated_at', { ascending: false });

      if (limitsError) throw limitsError;

      // Create a map of existing limits
      const limitsMap = new Map();
      if (limitsData) {
        limitsData.forEach(limit => {
          limitsMap.set(limit.user_id, limit);
        });
      }

      // Combine the data - include all seller profiles, with or without limits
      const combinedData = profilesData.map(profile => {
        const existingLimit = limitsMap.get(profile.id);
        return {
          id: existingLimit?.id || `temp-${profile.id}`,
          user_id: profile.id,
          property_limit: existingLimit?.property_limit || 10,
          notes: existingLimit?.notes || null,
          created_at: existingLimit?.created_at || new Date().toISOString(),
          updated_at: existingLimit?.updated_at || new Date().toISOString(),
          created_by: existingLimit?.created_by || null,
          profiles: profile
        };
      });

      setLimits(combinedData);
    } catch (error) {
      console.error('Error fetching property limits:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل حدود العقارات',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserLimit = async (userId: string, newLimit: number, notes?: string) => {
    try {
      // First try to update existing record
      const { data: updateData, error: updateError } = await supabase
        .from('user_property_limits')
        .update({
          property_limit: newLimit,
          notes: notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select();

      // If no rows were updated, insert a new record
      if (updateError || !updateData || updateData.length === 0) {
        const { error: insertError } = await supabase
          .from('user_property_limits')
          .insert({
            user_id: userId,
            property_limit: newLimit,
            notes: notes || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          // If insert fails due to unique constraint, try update again
          if (insertError.code === '23505') {
            const { error: retryUpdateError } = await supabase
              .from('user_property_limits')
              .update({
                property_limit: newLimit,
                notes: notes || null,
                updated_at: new Date().toISOString()
              })
              .eq('user_id', userId);

            if (retryUpdateError) throw retryUpdateError;
          } else {
            throw insertError;
          }
        }
      }

      toast({
        title: 'نجح',
        description: 'تم تحديث حد العقارات بنجاح'
      });

      await fetchLimits();
      return true;
    } catch (error) {
      console.error('Error updating property limit:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحديث حد العقارات',
        variant: 'destructive'
      });
      return false;
    }
  };

  const getUserCurrentCount = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('get_user_property_count', {
        user_id_param: userId
      });

      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error('Error getting user property count:', error);
      return 0;
    }
  };

  const canUserAddProperty = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('can_user_add_property', {
        user_id_param: userId
      });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Error checking if user can add property:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchLimits();
  }, []);

  return {
    limits,
    loading,
    fetchLimits,
    updateUserLimit,
    getUserCurrentCount,
    canUserAddProperty
  };
};
