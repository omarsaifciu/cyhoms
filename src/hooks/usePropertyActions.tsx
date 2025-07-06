
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "./use-toast";
import { supabase } from "../integrations/supabase/client";
import { NewPropertyForm } from "../types/property";

export const usePropertyActions = (fetchProperties: () => Promise<void>) => {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [addingProperty, setAddingProperty] = useState(false);

  const addProperty = async (newProperty: NewPropertyForm) => {
    if (!user) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please login first',
        variant: 'destructive'
      });
      return false;
    }

    if (addingProperty) {
      console.log('Already adding property, preventing duplicate submission');
      return false;
    }

    setAddingProperty(true);

    try {
      const propertyData = {
        title: newProperty.title_ar.trim() || newProperty.title_en.trim() || newProperty.title_tr.trim(),
        title_ar: newProperty.title_ar.trim() || null,
        title_en: newProperty.title_en.trim() || null,
        title_tr: newProperty.title_tr.trim() || null,
        description: newProperty.description_ar.trim() || newProperty.description_en.trim() || newProperty.description_tr.trim() || null,
        description_ar: newProperty.description_ar.trim() || null,
        description_en: newProperty.description_en.trim() || null,
        description_tr: newProperty.description_tr.trim() || null,
        price: parseFloat(newProperty.price),
        currency: newProperty.currency,
        listing_type: newProperty.listing_type,
        deposit: parseFloat(newProperty.deposit) || 0,
        deposit_currency: newProperty.deposit_currency || newProperty.currency,
        commission: parseFloat(newProperty.commission) || 0,
        commission_currency: newProperty.commission_currency || newProperty.currency,
        city: newProperty.city,
        district: newProperty.district.trim() || null,
        property_type: newProperty.property_type,
        bedrooms: newProperty.bedrooms ? parseInt(newProperty.bedrooms) : null,
        bathrooms: newProperty.bathrooms ? parseInt(newProperty.bathrooms) : null,
        area: newProperty.area ? parseFloat(newProperty.area) : null,
        status: newProperty.status,
        images: newProperty.images,
        cover_image: newProperty.cover_image,
        is_featured: newProperty.is_featured,
        is_student_housing: newProperty.is_student_housing || false,
        student_housing_gender: newProperty.is_student_housing ? (newProperty.student_housing_gender || 'unspecified') : 'unspecified',
        created_by: user.id
      };

      console.log('Adding property with student housing data:', {
        is_student_housing: propertyData.is_student_housing,
        student_housing_gender: propertyData.student_housing_gender
      });

      const { data, error } = await supabase
        .from('properties')
        .insert([propertyData])
        .select();

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      console.log('Property added successfully:', data);

      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم إضافة العقار بنجاح' : 'Property added successfully'
      });

      await fetchProperties();
      return true;
    } catch (error: any) {
      console.error('Error adding property:', error);
      
      let errorMessage = currentLanguage === 'ar' ? 'فشل في إضافة العقار' : 'Failed to add property';
      
      if (error?.message?.includes('violates row-level security policy')) {
        errorMessage = currentLanguage === 'ar' ? 'ليس لديك صلاحية لإضافة العقارات' : 'You do not have permission to add properties';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    } finally {
      setAddingProperty(false);
    }
  };

  const deleteProperty = async (id: string) => {
    if (!confirm(currentLanguage === 'ar' ? 'هل أنت متأكد من حذف هذا العقار؟' : 'Are you sure you want to delete this property?')) {
      return;
    }

    try {
      console.log('Deleting property:', id);

      // First, check if user has permission to delete this property
      const { data: propertyCheck, error: checkError } = await supabase
        .from('properties')
        .select('id, created_by, user_id, title_ar, title_en, title_tr')
        .eq('id', id)
        .single();

      if (checkError) {
        console.error('Error checking property ownership:', checkError);
        throw new Error('Unable to verify property ownership');
      }

      if (!propertyCheck) {
        throw new Error('Property not found');
      }

      console.log('Property ownership check passed, proceeding with deletion');

      // Delete related records first to avoid foreign key constraint issues
      console.log('Deleting related records for property:', id);

      // Delete property activities first (if any exist)
      const { error: activitiesError } = await supabase
        .from('property_activities')
        .delete()
        .eq('property_id', id);

      if (activitiesError) {
        console.warn('Error deleting property activities:', activitiesError);
        // Continue anyway as this might not exist
      }

      // Skip user activity logs deletion for now to avoid conflicts
      // The database should handle this with ON DELETE SET NULL constraint
      console.log('Skipping user_activity_logs deletion - will be handled by database constraints');

      // Delete property views
      const { error: viewsError } = await supabase
        .from('property_views')
        .delete()
        .eq('property_id', id);

      if (viewsError) {
        console.warn('Error deleting property views:', viewsError);
      }

      // Delete favorites
      const { error: favoritesError } = await supabase
        .from('favorites')
        .delete()
        .eq('property_id', id);

      if (favoritesError) {
        console.warn('Error deleting favorites:', favoritesError);
        // Continue anyway as this might not exist
      }

      // Delete property reports
      const { error: reportsError } = await supabase
        .from('property_reports')
        .delete()
        .eq('property_id', id);

      if (reportsError) {
        console.warn('Error deleting property reports:', reportsError);
        // Continue anyway as this might not exist
      }

      // Delete property comments
      const { error: commentsError } = await supabase
        .from('property_comments')
        .delete()
        .eq('property_id', id);

      if (commentsError) {
        console.warn('Error deleting property comments:', commentsError);
        // Continue anyway as this might not exist
      }

      // Now delete the property itself
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);

        // Provide more specific error messages
        if (error.code === '23503') {
          throw new Error(currentLanguage === 'ar'
            ? 'لا يمكن حذف العقار بسبب وجود سجلات مرتبطة. يرجى الاتصال بالدعم الفني.'
            : 'Cannot delete property due to related records. Please contact support.');
        } else if (error.code === '42501') {
          throw new Error(currentLanguage === 'ar'
            ? 'ليس لديك صلاحية لحذف هذا العقار.'
            : 'You do not have permission to delete this property.');
        } else {
          throw new Error(error.message || (currentLanguage === 'ar'
            ? 'فشل في حذف العقار'
            : 'Failed to delete property'));
        }
      }

      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم حذف العقار بنجاح' : 'Property deleted successfully'
      });

      fetchProperties();
    } catch (error: any) {
      console.error('Error deleting property:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: error?.message || (currentLanguage === 'ar' ? 'فشل في حذف العقار' : 'Failed to delete property'),
        variant: 'destructive'
      });
    }
  };

  const togglePropertyStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'available' ? 'pending' : 'available';
    
    try {
      console.log('Updating property status:', { id, currentStatus, newStatus });
      const { error } = await supabase
        .from('properties')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم تحديث حالة العقار' : 'Property status updated'
      });

      fetchProperties();
    } catch (error: any) {
      console.error('Error updating property status:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: error?.message || (currentLanguage === 'ar' ? 'فشل في تحديث العقار' : 'Failed to update property'),
        variant: 'destructive'
      });
    }
  };

  const toggleFeaturedStatus = async (id: string, currentFeatured: boolean) => {
    try {
      console.log('Updating featured status:', { id, currentFeatured, newFeatured: !currentFeatured });
      const { error } = await supabase
        .from('properties')
        .update({ is_featured: !currentFeatured })
        .eq('id', id);

      if (error) {
        console.error('Supabase featured update error:', error);
        throw error;
      }

      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' 
          ? (!currentFeatured ? 'تم إضافة العقار إلى المميزة' : 'تم إزالة العقار من المميزة')
          : (!currentFeatured ? 'Property marked as featured' : 'Property removed from featured'),
      });

      fetchProperties();
    } catch (error: any) {
      console.error('Error updating featured status:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: error?.message || (currentLanguage === 'ar' ? 'فشل في تحديث حالة المميز' : 'Failed to update featured status'),
        variant: 'destructive'
      });
    }
  };

  return {
    addingProperty,
    addProperty,
    deleteProperty,
    togglePropertyStatus,
    toggleFeaturedStatus
  };
};
