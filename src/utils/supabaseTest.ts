
import { supabase } from "@/integrations/supabase/client";

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // اختبار بسيط للاتصال
    const { data, error } = await supabase
      .from('cities')
      .select('count(*)', { count: 'exact', head: true });

    if (error) {
      console.error('Supabase connection test failed:', error);
      return { success: false, error };
    }

    console.log('Supabase connection test successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return { success: false, error };
  }
};

export const checkUserPermissions = async () => {
  try {
    console.log('Checking user permissions...');
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      return { success: false, error: userError };
    }

    console.log('Current user:', user);

    // محاولة جلب المدن مع تفاصيل أكثر
    const { data, error, status, statusText } = await supabase
      .from('cities')
      .select('*')
      .limit(1);

    console.log('Query result:', { data, error, status, statusText });

    return { 
      success: !error, 
      user, 
      data, 
      error, 
      status, 
      statusText 
    };
  } catch (error) {
    console.error('Permission check error:', error);
    return { success: false, error };
  }
};
