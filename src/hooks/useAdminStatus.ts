
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useAdminStatus = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      setLoading(true);
      
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      try {
        console.log('useAdminStatus: Checking admin status for user:', user.email);
        
        // التحقق من الأدمن الأساسي أولاً
        if (user.email === 'omar122540@gmail.com') {
          console.log('useAdminStatus: Primary admin detected');
          setIsAdmin(true);
          setLoading(false);
          return;
        }

        // التحقق من جدول admin_management باستخدام type assertion
        const { data, error } = await supabase
          .from('admin_management' as any)
          .select('*')
          .eq('admin_email', user.email)
          .eq('is_active', true)
          .single();

        console.log('useAdminStatus: Admin management query result:', { data, error });

        if (error && error.code !== 'PGRST116') {
          console.error('useAdminStatus: Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          const adminStatus = !!data;
          console.log('useAdminStatus: Admin status determined:', adminStatus);
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error('useAdminStatus: Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [user?.email, user?.id]);

  return { isAdmin, loading };
};
