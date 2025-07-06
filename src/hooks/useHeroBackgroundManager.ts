import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface HeroBackground {
  id: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
}

export const useHeroBackgroundManager = (heroSlideshowEnabled?: boolean) => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [backgrounds, setBackgrounds] = useState<HeroBackground[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBackgrounds = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('hero_backgrounds')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBackgrounds(data || []);
    } catch (error) {
      console.error('Error fetching backgrounds:', error);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchBackgrounds().finally(() => setLoading(false));
  }, [fetchBackgrounds]);

  useEffect(() => {
    // Ensure only one background is active when slideshow is off
    if (heroSlideshowEnabled === false && !loading && backgrounds.length > 0) {
      const activeBackgrounds = backgrounds.filter(bg => bg.is_active);

      if (activeBackgrounds.length > 1) {
        // Keep the most recent one active and deactivate the others.
        // Backgrounds are sorted by created_at descending, so the first one is the newest.
        const idsToDeactivate = activeBackgrounds.slice(1).map(bg => bg.id);

        if (idsToDeactivate.length > 0) {
          const deactivateOthers = async () => {
            const { error } = await supabase
              .from('hero_backgrounds')
              .update({ is_active: false })
              .in('id', idsToDeactivate);
            
            if (error) {
              console.error('Failed to deactivate extra backgrounds:', error);
              toast({
                title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
                description: currentLanguage === 'ar' ? 'فشل في تحديث الخلفيات.' : 'Failed to update backgrounds.',
                variant: 'destructive',
              });
            } else {
              toast({
                title: currentLanguage === 'ar' ? 'تم التحديث' : 'Updated',
                description: currentLanguage === 'ar' ? 'تم تعطيل عرض الشرائح، والإبقاء على خلفية واحدة نشطة فقط.' : 'Slideshow disabled, only one background remains active.',
              });
              await fetchBackgrounds(); // Refresh the list
            }
          };
          deactivateOthers();
        }
      } else if (activeBackgrounds.length === 0) {
        // No active backgrounds, so activate the newest one.
        const newestBackground = backgrounds[0];
        if (newestBackground) {
          const activateNewest = async () => {
            const { error } = await supabase
              .from('hero_backgrounds')
              .update({ is_active: true })
              .eq('id', newestBackground.id);

            if (error) {
              console.error('Failed to activate newest background:', error);
              toast({
                title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
                description: currentLanguage === 'ar' ? 'فشل في تفعيل الخلفية الأحدث.' : 'Failed to activate newest background.',
                variant: 'destructive',
              });
            } else {
              toast({
                title: currentLanguage === 'ar' ? 'تم التحديث' : 'Updated',
                description: currentLanguage === 'ar' ? 'لا توجد خلفية نشطة، تم تفعيل الأحدث تلقائياً.' : 'No active background; the newest one has been activated.',
              });
              await fetchBackgrounds(); // Refresh the list
            }
          };
          activateNewest();
        }
      }
    }
  }, [heroSlideshowEnabled, loading, backgrounds, fetchBackgrounds, currentLanguage, toast]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'يرجى اختيار صورة فقط' : 'Please select an image only',
        variant: 'destructive'
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'حجم الصورة يجب أن يكون أقل من 10 ميجابايت' : 'Image size must be less than 10MB',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-bg-${Date.now()}.${fileExt}`;
      const filePath = `hero-backgrounds/${fileName}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('hero-backgrounds')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('hero-backgrounds')
        .getPublicUrl(filePath);

      // Save to database
      const { error: dbError } = await supabase
        .from('hero_backgrounds')
        .insert({
          image_url: publicUrl,
          is_active: backgrounds.length === 0 || heroSlideshowEnabled // Make first upload active, or any upload if slideshow is on
        });

      if (dbError) throw dbError;

      // if slideshow is OFF, deactivate others
      if (!heroSlideshowEnabled) {
        // get all backgrounds again (including the newly added one)
        await fetchBackgrounds();
        // Deactivate all except the last one
        const refreshedList = await supabase
          .from('hero_backgrounds')
          .select('*')
          .order('created_at', { ascending: false });
        if (refreshedList.data && refreshedList.data.length > 1) {
          const latestId = refreshedList.data[0].id;
          const idsToDeactivate = refreshedList.data.slice(1).map(bg => bg.id);
          if (idsToDeactivate.length > 0) {
            const { error: updateErr } = await supabase
              .from('hero_backgrounds')
              .update({ is_active: false })
              .in('id', idsToDeactivate);
            if (updateErr) console.error('Failed to deactivate previous ones after upload', updateErr);
          }
          // Ensure latest is_active=true
          await supabase
            .from('hero_backgrounds')
            .update({ is_active: true })
            .eq('id', latestId);
        }
      }

      await fetchBackgrounds();
      
      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم رفع الصورة بنجاح' : 'Image uploaded successfully'
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في رفع الصورة' : 'Failed to upload image',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const setActiveBackground = async (id: string) => {
    const targetBg = backgrounds.find(bg => bg.id === id);
    if (!targetBg) return;

    try {
      if (targetBg.is_active) {
        // Deactivating an active background. This action is the same for both modes.
        const { error } = await supabase
          .from('hero_backgrounds')
          .update({ is_active: false })
          .eq('id', id);
        if (error) throw error;
        toast({ title: currentLanguage === 'ar' ? 'تم' : 'Done', description: currentLanguage === 'ar' ? 'تم إلغاء تفعيل الخلفية.' : 'Background deactivated.' });
      } else {
        // Activate this background.
        // If slideshow is disabled, first deactivate all others.
        if (!heroSlideshowEnabled) {
          // deactivate all
          const { error: deactivateError } = await supabase
            .from('hero_backgrounds')
            .update({ is_active: false })
            .eq('is_active', true);
          if (deactivateError) throw deactivateError;
        }
        // activate the chosen one
        const { error: activateError } = await supabase
          .from('hero_backgrounds')
          .update({ is_active: true })
          .eq('id', id);
        if (activateError) throw activateError;

        toast({ title: currentLanguage === 'ar' ? 'نجح' : 'Success', description: currentLanguage === 'ar' ? 'تم تغيير الخلفية بنجاح' : 'Background changed successfully' });

        // After the activation, when disabling the slideshow, make sure only one is active
        if (!heroSlideshowEnabled) {
          // Extra precaution: Make sure all others deactivated
          const others = backgrounds.filter(bg => bg.id !== id && bg.is_active);
          if (others.length > 0) {
            const idsToDeactivate = others.map(bg => bg.id);
            await supabase
              .from('hero_backgrounds')
              .update({ is_active: false })
              .in('id', idsToDeactivate);
          }
        }
      }
      await fetchBackgrounds();
    } catch (error) {
      console.error('Error setting active background:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في تغيير الخلفية' : 'Failed to change background',
        variant: 'destructive'
      });
    }
  };

  const deleteBackground = async (id: string, imageUrl: string) => {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `hero-backgrounds/${fileName}`;

      // Delete from storage
      await supabase.storage
        .from('hero-backgrounds')
        .remove([filePath]);

      // Delete from database
      const { error } = await supabase
        .from('hero_backgrounds')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchBackgrounds();
      
      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم حذف الصورة بنجاح' : 'Image deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting background:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في حذف الصورة' : 'Failed to delete image',
        variant: 'destructive'
      });
    }
  };

  return {
    backgrounds,
    uploading,
    loading,
    handleFileUpload,
    setActiveBackground,
    deleteBackground
  };
};
