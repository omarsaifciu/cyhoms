
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useFavorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // جلب المفضلة عند تحميل الصفحة
  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const favoriteIds = data.map(fav => fav.property_id);
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (propertyId: string) => {
    if (!user) {
      toast({
        title: 'تسجيل الدخول مطلوب',
        description: 'يرجى تسجيل الدخول لإضافة العقارات إلى المفضلة',
        variant: 'destructive'
      });
      return;
    }

    try {
      const isFavorited = favorites.includes(propertyId);
      
      if (isFavorited) {
        // إزالة من المفضلة
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId);

        if (error) throw error;
        
        setFavorites(prev => prev.filter(id => id !== propertyId));
        toast({
          title: 'تم بنجاح',
          description: 'تم إزالة العقار من المفضلة'
        });
      } else {
        // إضافة إلى المفضلة
        const { error } = await supabase
          .from('favorites')
          .insert([{ user_id: user.id, property_id: propertyId }]);

        if (error) throw error;
        
        setFavorites(prev => [...prev, propertyId]);
        toast({
          title: 'تم بنجاح',
          description: 'تم إضافة العقار إلى المفضلة'
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحديث المفضلة',
        variant: 'destructive'
      });
    }
  };

  const isFavorited = (propertyId: string) => favorites.includes(propertyId);

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorited,
    refetch: fetchFavorites
  };
};
