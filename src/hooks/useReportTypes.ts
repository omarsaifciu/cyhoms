
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ReportType {
  id: string;
  name_ar: string;
  name_en: string;
  name_tr: string;
  description_ar?: string;
  description_en?: string;
  description_tr?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useReportTypes = () => {
  const { user } = useAuth();
  const [propertyReportTypes, setPropertyReportTypes] = useState<ReportType[]>([]);
  const [userReportTypes, setUserReportTypes] = useState<ReportType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPropertyReportTypes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_report_types')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setPropertyReportTypes(data || []);
    } catch (error) {
      console.error('Error fetching property report types:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReportTypes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_report_types')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setUserReportTypes(data || []);
    } catch (error) {
      console.error('Error fetching user report types:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPropertyReportTypes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_report_types')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setPropertyReportTypes(data || []);
    } catch (error) {
      console.error('Error fetching all property report types:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUserReportTypes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_report_types')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setUserReportTypes(data || []);
    } catch (error) {
      console.error('Error fetching all user report types:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPropertyReportType = async (reportType: Omit<ReportType, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_report_types')
        .insert({
          ...reportType,
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating property report type:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const createUserReportType = async (reportType: Omit<ReportType, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_report_types')
        .insert({
          ...reportType,
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating user report type:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const updatePropertyReportType = async (id: string, updates: Partial<ReportType>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_report_types')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating property report type:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const updateUserReportType = async (id: string, updates: Partial<ReportType>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_report_types')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating user report type:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const deletePropertyReportType = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('property_report_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting property report type:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const deleteUserReportType = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_report_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting user report type:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyReportTypes();
    fetchUserReportTypes();
  }, []);

  return {
    propertyReportTypes,
    userReportTypes,
    loading,
    fetchPropertyReportTypes,
    fetchUserReportTypes,
    fetchAllPropertyReportTypes,
    fetchAllUserReportTypes,
    createPropertyReportType,
    createUserReportType,
    updatePropertyReportType,
    updateUserReportType,
    deletePropertyReportType,
    deleteUserReportType
  };
};
