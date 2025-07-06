
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type TermsAndConditions = Tables<'terms_and_conditions'>;
type TermsInsert = TablesInsert<'terms_and_conditions'>;

export interface NewTermsForm {
  title_ar: string;
  title_en: string;
  title_tr: string;
  content_ar: string;
  content_en: string;
  content_tr: string;
  is_active: boolean;
}

export const useTermsManagement = () => {
  const [terms, setTerms] = useState<TermsAndConditions[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      
      try {
        const { data, error } = await supabase.rpc('is_admin');
        
        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data === true);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [user]);

  const fetchTerms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('terms_and_conditions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching terms:', error);
        toast({
          title: "خطأ",
          description: "فشل في تحميل الشروط والأحكام",
          variant: "destructive",
        });
        return;
      }

      setTerms(data || []);
    } catch (error) {
      console.error('Error fetching terms:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل الشروط والأحكام",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveTerms = async () => {
    try {
      const { data, error } = await supabase
        .from('terms_and_conditions')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching active terms:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching active terms:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const addTerms = async (termsData: NewTermsForm): Promise<boolean> => {
    if (!isAdmin) {
      toast({
        title: "خطأ",
        description: "ليس لديك صلاحية لحفظ الشروط والأحكام",
        variant: "destructive",
      });
      return false;
    }

    if (!user) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول أولاً",
        variant: "destructive",
      });
      return false;
    }

    try {
      setSubmitting(true);
      
      const termsToInsert: TermsInsert = {
        title_ar: termsData.title_ar,
        title_en: termsData.title_en,
        title_tr: termsData.title_tr,
        content_ar: termsData.content_ar,
        content_en: termsData.content_en,
        content_tr: termsData.content_tr,
        is_active: termsData.is_active,
        created_by: user.id
      };

      const { error } = await supabase
        .from('terms_and_conditions')
        .insert([termsToInsert]);

      if (error) {
        console.error('Error saving terms:', error);
        toast({
          title: "خطأ",
          description: "فشل في حفظ الشروط والأحكام",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "نجح",
        description: "تم حفظ الشروط والأحكام بنجاح",
      });

      fetchTerms();
      return true;
    } catch (error) {
      console.error('Error saving terms:', error);
      toast({
        title: "خطأ",
        description: "فشل في حفظ الشروط والأحكام",
        variant: "destructive",
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const updateTerms = async (id: string, termsData: NewTermsForm): Promise<boolean> => {
    if (!isAdmin) {
      toast({
        title: "خطأ",
        description: "ليس لديك صلاحية لتحديث الشروط والأحكام",
        variant: "destructive",
      });
      return false;
    }

    try {
      setSubmitting(true);
      
      const termsToUpdate = {
        title_ar: termsData.title_ar,
        title_en: termsData.title_en,
        title_tr: termsData.title_tr,
        content_ar: termsData.content_ar,
        content_en: termsData.content_en,
        content_tr: termsData.content_tr,
        is_active: termsData.is_active,
      };

      const { error } = await supabase
        .from('terms_and_conditions')
        .update(termsToUpdate)
        .eq('id', id);

      if (error) {
        console.error('Error updating terms:', error);
        toast({
          title: "خطأ",
          description: "فشل في تحديث الشروط والأحكام",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "نجح",
        description: "تم تحديث الشروط والأحكام بنجاح",
      });

      fetchTerms();
      return true;
    } catch (error) {
      console.error('Error updating terms:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث الشروط والأحكام",
        variant: "destructive",
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActiveStatus = async (id: string, currentStatus: boolean) => {
    if (!isAdmin) {
      toast({
        title: "خطأ",
        description: "ليس لديك صلاحية لتفعيل الشروط والأحكام",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!currentStatus) {
        // First, deactivate all terms
        await supabase
          .from('terms_and_conditions')
          .update({ is_active: false })
          .neq('id', 'dummy');
      }

      // Then toggle the selected one
      const { error } = await supabase
        .from('terms_and_conditions')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) {
        console.error('Error toggling terms status:', error);
        toast({
          title: "خطأ",
          description: "فشل في تفعيل الشروط والأحكام",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "نجح",
        description: !currentStatus ? "تم تفعيل الشروط والأحكام بنجاح" : "تم إلغاء تفعيل الشروط والأحكام",
      });

      fetchTerms();
    } catch (error) {
      console.error('Error toggling terms status:', error);
      toast({
        title: "خطأ",
        description: "فشل في تفعيل الشروط والأحكام",
        variant: "destructive",
      });
    }
  };

  const deleteTerms = async (id: string) => {
    if (!isAdmin) {
      toast({
        title: "خطأ",
        description: "ليس لديك صلاحية لحذف الشروط والأحكام",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('terms_and_conditions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting terms:', error);
        toast({
          title: "خطأ",
          description: "فشل في حذف الشروط والأحكام",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "نجح",
        description: "تم حذف الشروط والأحكام بنجاح",
      });

      fetchTerms();
    } catch (error) {
      console.error('Error deleting terms:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف الشروط والأحكام",
        variant: "destructive",
      });
    }
  };

  return {
    terms,
    loading,
    submitting,
    isAdmin,
    user,
    addTerms,
    updateTerms,
    deleteTerms,
    toggleActiveStatus,
    fetchTerms,
    fetchActiveTerms
  };
};
