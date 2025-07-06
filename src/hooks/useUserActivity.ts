import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ActivityLog {
  id: string;
  user_id: string;
  property_id?: string;
  action_type: string;
  action_details: any;
  created_at: string;
  property?: {
    id: string;
    title: string;
    price: number;
    currency: string;
    images: string[];
  };
}

export const useUserActivity = (userId?: string) => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('user_activity_logs')
        .select(`
          *,
          property:properties(
            id,
            title,
            title_ar,
            title_en,
            title_tr,
            price,
            currency,
            images
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Process the data to get the correct title
      const processedData = data?.map(activity => ({
        ...activity,
        property: activity.property ? {
          ...activity.property,
          title: activity.property.title_ar || activity.property.title_en || activity.property.title_tr || activity.property.title
        } : null
      })) || [];

      setActivities(processedData);
    } catch (err) {
      console.error('Error fetching user activities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (
    actionType: string,
    propertyId?: string,
    actionDetails?: any
  ) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('user_activity_logs')
        .insert({
          user_id: userId,
          property_id: propertyId,
          action_type: actionType,
          action_details: actionDetails || {}
        });

      if (error) throw error;

      // Refresh activities after logging
      await fetchActivities();
    } catch (err) {
      console.error('Error logging activity:', err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchActivities();
    }
  }, [userId]);

  return {
    activities,
    loading,
    error,
    fetchActivities,
    logActivity
  };
};

// Helper function to manually log activities
export const logUserActivity = async (
  userId: string,
  actionType: string,
  propertyId?: string,
  actionDetails?: any
) => {
  try {
    const { error } = await supabase
      .from('user_activity_logs')
      .insert({
        user_id: userId,
        property_id: propertyId,
        action_type: actionType,
        action_details: actionDetails || {}
      });

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Error logging user activity:', err);
    return { success: false, error: err };
  }
};
