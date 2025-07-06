
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  ownerName: string;
  ownerAvatar: string | null;
  userType: string;
  showContactButtons: boolean;
}

export const useContactDisplay = (propertyId: string, ownerId: string) => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        console.log('Fetching contact info for property:', propertyId, 'owner:', ownerId);

        // الحصول على معلومات العقار والمالك دائماً
        const { data: property, error: propertyError } = await supabase
          .from('properties')
          .select('owner_name, owner_avatar_url, owner_whatsapp, owner_email, created_by')
          .eq('id', propertyId)
          .single();

        if (propertyError) {
          console.error('Error fetching property:', propertyError);
        }

        console.log('Property data:', property);

        // Get user profile for user_type and additional contact info
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_type, full_name, avatar_url, whatsapp_number, phone, is_trial_active, trial_started_at')
          .eq('id', ownerId)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }

        console.log('Profile data:', profile);

        // التحقق من كون التجربة دائمة (تاريخ بداية قديم)
        const isPermanentTrial = profile?.trial_started_at && new Date(profile.trial_started_at) < new Date('2010-01-01');
        
        // إذا كانت التجربة نشطة (سواء دائمة أو مؤقتة)، أو إذا كانت التجربة دائمة
        if (profile?.is_trial_active || isPermanentTrial) {
          console.log('Trial is active or permanent, showing owner contact info');
          
          // Show owner's contact info - get both property and profile data
          if (property || profile) {
            // Priority: property contact info first, then profile info as fallback
            const whatsappNumber = property?.owner_whatsapp || profile?.whatsapp_number || profile?.phone || '';
            const phoneNumber = profile?.phone || property?.owner_whatsapp || '';
            const emailAddress = property?.owner_email || '';
            const ownerName = property?.owner_name || profile?.full_name || '';
            const avatarUrl = property?.owner_avatar_url || profile?.avatar_url || null;

            console.log('Final contact info:', {
              phone: phoneNumber,
              whatsapp: whatsappNumber,
              email: emailAddress,
              ownerName,
              ownerAvatar: avatarUrl,
              userType: profile?.user_type || 'client',
              showContactButtons: true
            });

            setContactInfo({
              phone: phoneNumber,
              whatsapp: whatsappNumber,
              email: emailAddress,
              ownerName,
              ownerAvatar: avatarUrl,
              userType: profile?.user_type || 'client',
              showContactButtons: true // أظهر أزرار الاتصال بمعلومات المالك
            });
          }
        } else {
          // إذا انتهت التجربة، اعرض معلومات الموقع للاتصال ولكن احتفظ بمعلومات المالك
          console.log('Trial expired, showing site contact info but keeping owner info');
          
          const { data: siteContact } = await supabase
            .from('contact_settings')
            .select('*')
            .eq('is_active', true)
            .single();

          console.log('Site contact info:', siteContact);

          // احتفظ بمعلومات المالك الأصلي ولكن استخدم معلومات الاتصال للموقع
          const ownerName = property?.owner_name || profile?.full_name || '';
          const avatarUrl = property?.owner_avatar_url || profile?.avatar_url || null;

          setContactInfo({
            phone: siteContact?.phone_number || '',
            whatsapp: siteContact?.whatsapp_number || '',
            email: siteContact?.email || '',
            ownerName, // احتفظ باسم المالك الأصلي
            ownerAvatar: avatarUrl, // احتفظ بصورة المالك الأصلي
            userType: profile?.user_type || 'client', // احتفظ بنوع المستخدم الأصلي
            showContactButtons: true // أظهر أزرار الاتصال بمعلومات الموقع
          });
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId && ownerId) {
      fetchContactInfo();
    }
  }, [propertyId, ownerId]);

  return { contactInfo, loading };
};
