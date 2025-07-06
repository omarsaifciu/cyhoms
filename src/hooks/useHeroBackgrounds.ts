
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface HeroBackground {
  id: string;
  image_url: string;
  is_active: boolean;
}

export const useHeroBackgrounds = () => {
  const [backgrounds, setBackgrounds] = useState<HeroBackground[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBackgrounds();
    
    const subscription = supabase
      .channel('hero_backgrounds_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'hero_backgrounds' 
        }, 
        () => {
          fetchBackgrounds();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchBackgrounds = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('hero_backgrounds')
        .select('id, image_url, is_active')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching hero backgrounds:', error);
        setBackgrounds([]);
      } else {
        setBackgrounds(data || []);
      }
    } catch (error) {
      console.error('Error fetching hero backgrounds:', error);
      setBackgrounds([]);
    } finally {
      setLoading(false);
    }
  };

  return { backgrounds, loading };
};
