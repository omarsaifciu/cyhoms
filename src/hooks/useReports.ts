
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { PropertyReport, UserReport, ReportFormData } from '@/types/reports';

export const useReports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const reportProperty = async (propertyId: string, reportData: ReportFormData) => {
    if (!user) return { success: false, error: 'يجب تسجيل الدخول أولاً' };

    setLoading(true);
    try {
      const { error } = await supabase
        .from('property_reports')
        .insert({
          property_id: propertyId,
          reporter_user_id: user.id,
          report_type: reportData.report_type,
          reason: reportData.reason
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error reporting property:', error);
      return { success: false, error: 'حدث خطأ أثناء إرسال البلاغ' };
    } finally {
      setLoading(false);
    }
  };

  const reportUser = async (userId: string, reportData: ReportFormData) => {
    if (!user) return { success: false, error: 'يجب تسجيل الدخول أولاً' };

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_reports')
        .insert({
          reported_user_id: userId,
          reporter_user_id: user.id,
          report_type: reportData.report_type,
          reason: reportData.reason
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error reporting user:', error);
      return { success: false, error: 'حدث خطأ أثناء إرسال البلاغ' };
    } finally {
      setLoading(false);
    }
  };

  const fetchPropertyReports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_reports')
        .select(`
          *,
          properties(id, title),
          profiles!property_reports_reporter_user_id_fkey(id, full_name, username)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching property reports:', error);
        return { data: [], error };
      }
      
      console.log('Fetched property reports:', data);
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching property reports:', error);
      return { data: [], error };
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_reports')
        .select(`
          *,
          reported_profile:profiles!user_reports_reported_user_id_fkey(id, full_name, username),
          reporter_profile:profiles!user_reports_reporter_user_id_fkey(id, full_name, username)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user reports:', error);
        return { data: [], error };
      }
      
      console.log('Fetched user reports:', data);
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching user reports:', error);
      return { data: [], error };
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId: string, status: string, adminNotes?: string, isUserReport = false) => {
    setLoading(true);
    try {
      const table = isUserReport ? 'user_reports' : 'property_reports';
      const { error } = await supabase
        .from(table)
        .update({
          status,
          admin_notes: adminNotes,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error updating report status:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    reportProperty,
    reportUser,
    fetchPropertyReports,
    fetchUserReports,
    updateReportStatus
  };
};
