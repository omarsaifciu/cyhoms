
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const usePropertyViews = (propertyId: string) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!propertyId) return;

    const recordView = async () => {
      try {
        // نستخدم التخزين المحلي لتجنب تسجيل مشاهدات متكررة من نفس المتصفح خلال فترة قصيرة
        const viewKey = `property_view_${propertyId}`;
        const lastView = localStorage.getItem(viewKey);
        const now = Date.now();
        
        // تسجيل مشاهدة جديدة فقط إذا لم تتم مشاهدة العقار خلال الساعة الماضية
        if (!lastView || (now - parseInt(lastView)) > 3600000) { // ساعة واحدة
          localStorage.setItem(viewKey, now.toString());
          
          const { error } = await supabase.from('property_views').insert({
            property_id: propertyId,
            viewer_user_id: user?.id, // قد يكون المستخدم غير مسجل دخوله
          });

          if (error) {
            console.error('Error inserting property view:', error);
          } else {
            console.log(`Property ${propertyId} viewed and recorded.`);
          }
        }
      } catch (error) {
        console.error('Error recording view:', error);
      }
    };

    // تسجيل المشاهدة بعد ثانيتين للتأكد من أن المستخدم يتصفح الصفحة فعلياً
    const timer = setTimeout(recordView, 2000);

    return () => clearTimeout(timer);
  }, [propertyId, user]);
};
