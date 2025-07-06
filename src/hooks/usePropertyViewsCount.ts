
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const usePropertyViewsCount = (propertyId: string) => {
  const [viewsCount, setViewsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViews = async () => {
      setLoading(true);
      // جلب عدد المشاهدات مباشرة من جدول property_views
      const { count, error } = await supabase
        .from("property_views")
        .select("*", { count: "exact", head: true })
        .eq("property_id", propertyId);
      if (!error) {
        setViewsCount(count ?? 0);
      } else {
        setViewsCount(null);
      }
      setLoading(false);
    };
    if (propertyId) fetchViews();
  }, [propertyId]);

  return { viewsCount, loading };
};
