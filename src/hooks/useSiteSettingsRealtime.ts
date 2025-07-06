
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteSettings, defaultSiteSettings } from "@/types/siteSettings";
import { fetchSiteSettingsFromDB } from "@/services/siteSettingsApiService";

/**
 * Hook for live site settings synchronized in real time.
 */
export const useSiteSettingsRealtime = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [loading, setLoading] = useState(true);

  // Function to fetch latest settings
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const dbSettings = await fetchSiteSettingsFromDB();
      setSettings(prevSettings => ({
        ...prevSettings,
        ...Object.fromEntries(Object.entries(dbSettings).filter(([_, v]) => v !== undefined && v !== null)),
      }));
    } catch (error) {
      console.error("Error fetching site settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    // Subscribe to site_settings table changes
    const realtimeSub = supabase
      .channel('site_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings',
        },
        (_payload) => {
          // On any change, refetch settings
          fetchSettings();
        }
      )
      .subscribe();

    return () => {
      realtimeSub.unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

  return { settings, loading, fetchSettings };
};
