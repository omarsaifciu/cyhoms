
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useUserPropertyLimit = () => {
  const { user } = useAuth();
  const [propertyLimit, setPropertyLimit] = useState<number>(10);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [canAdd, setCanAdd] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  const fetchUserLimit = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get user's property limit
      const { data: limitData, error: limitError } = await supabase.rpc('get_user_property_limit', {
        user_id_param: user.id
      });

      if (limitError) throw limitError;
      setPropertyLimit(limitData || 10);

      // Get user's current property count
      const { data: countData, error: countError } = await supabase.rpc('get_user_property_count', {
        user_id_param: user.id
      });

      if (countError) throw countError;
      setCurrentCount(countData || 0);

      // Check if user can add more properties
      const { data: canAddData, error: canAddError } = await supabase.rpc('can_user_add_property', {
        user_id_param: user.id
      });

      if (canAddError) throw canAddError;
      setCanAdd(canAddData || false);

    } catch (error) {
      console.error('Error fetching user property limit:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserLimit();
  }, [user]);

  return {
    propertyLimit,
    currentCount,
    canAdd,
    loading,
    refetch: fetchUserLimit
  };
};
