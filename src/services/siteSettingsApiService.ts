import { supabase } from "@/integrations/supabase/client";
import { SiteSettings, RawDbSetting, defaultSiteSettings } from "@/types/siteSettings";

export const fetchSiteSettingsFromDB = async (): Promise<Partial<SiteSettings>> => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*');

  if (error) {
    console.error('Error fetching settings from DB:', error);
    throw error;
  }

  const loadedSettings: Partial<SiteSettings> = {};
  if (data && data.length > 0) {
    const settingsMap: { [key: string]: any } = {};
    (data as RawDbSetting[]).forEach(setting => {
      settingsMap[setting.setting_key] = {
        ar: setting.setting_value_ar,
        en: setting.setting_value_en,
        tr: setting.setting_value_tr
      };
    });

    loadedSettings.siteNameAr = settingsMap.site_name?.ar;
    loadedSettings.siteNameEn = settingsMap.site_name?.en;
    loadedSettings.siteNameTr = settingsMap.site_name?.tr;
    loadedSettings.siteDescriptionAr = settingsMap.site_description?.ar;
    loadedSettings.siteDescriptionEn = settingsMap.site_description?.en;
    loadedSettings.siteDescriptionTr = settingsMap.site_description?.tr;
    loadedSettings.supportEmail = settingsMap.support_email?.en;
    loadedSettings.maxProperties = settingsMap.max_properties?.en;
    if (settingsMap.registration_enabled?.en !== undefined) {
      loadedSettings.registrationEnabled = settingsMap.registration_enabled.en === 'true';
    }
    if (settingsMap.maintenance_mode?.en !== undefined) {
      loadedSettings.maintenanceMode = settingsMap.maintenance_mode.en === 'true';
    }
    loadedSettings.brandAccentColor = settingsMap.brand_accent_color?.en;
    loadedSettings.gradientFromColor = settingsMap.gradient_from_color?.en;
    loadedSettings.gradientToColor = settingsMap.gradient_to_color?.en;
    loadedSettings.facebookUrl = settingsMap.facebook_url?.en;
    loadedSettings.instagramUrl = settingsMap.instagram_url?.en;
    loadedSettings.twitterUrl = settingsMap.twitter_url?.en;
    loadedSettings.youtubeUrl = settingsMap.youtube_url?.en;
    loadedSettings.whatsappLink = settingsMap.whatsapp_link?.en;
    loadedSettings.linkedinUrl = settingsMap.linkedin_url?.en;
    loadedSettings.tiktokUrl = settingsMap.tiktok_url?.en;
    loadedSettings.snapchatUrl = settingsMap.snapchat_url?.en;
    loadedSettings.pinterestUrl = settingsMap.pinterest_url?.en;

    loadedSettings.address = settingsMap.address?.en;
    loadedSettings.phoneNumber = settingsMap.phone_number?.en;
    loadedSettings.siteEmailAddress = settingsMap.site_email_address?.en;

    // المتعدد اللغات
    loadedSettings.addressAr = settingsMap.address_ar?.ar;
    loadedSettings.addressEn = settingsMap.address_en?.en;
    loadedSettings.addressTr = settingsMap.address_tr?.tr;

    loadedSettings.phoneNumberAr = settingsMap.phone_number_ar?.ar;
    loadedSettings.phoneNumberEn = settingsMap.phone_number_en?.en;
    loadedSettings.phoneNumberTr = settingsMap.phone_number_tr?.tr;

    loadedSettings.siteEmailAddressAr = settingsMap.site_email_address_ar?.ar;
    loadedSettings.siteEmailAddressEn = settingsMap.site_email_address_en?.en;
    loadedSettings.siteEmailAddressTr = settingsMap.site_email_address_tr?.tr;

    // حالة تفعيل/الغاء الحقول
    loadedSettings.contactAddressEnabled = settingsMap.contact_address_enabled?.en !== 'false';
    loadedSettings.contactPhoneEnabled = settingsMap.contact_phone_enabled?.en !== 'false';
    loadedSettings.contactEmailEnabled = settingsMap.contact_email_enabled?.en !== 'false';

    // Announcement Bar
    if (settingsMap.announcement_bar_enabled?.en !== undefined) {
      loadedSettings.announcementBarEnabled = settingsMap.announcement_bar_enabled.en === 'true';
    }
    loadedSettings.announcementBarTextAr = settingsMap.announcement_bar_text?.ar;
    loadedSettings.announcementBarTextEn = settingsMap.announcement_bar_text?.en;
    loadedSettings.announcementBarTextTr = settingsMap.announcement_bar_text?.tr;
    loadedSettings.announcementBarLink = settingsMap.announcement_bar_link?.en;

    // HeroSection Title & Description
    loadedSettings.heroTitleAr = settingsMap.hero_title_ar?.ar;
    loadedSettings.heroTitleEn = settingsMap.hero_title_en?.en;
    loadedSettings.heroTitleTr = settingsMap.hero_title_tr?.tr;
    loadedSettings.heroDescriptionAr = settingsMap.hero_description_ar?.ar;
    loadedSettings.heroDescriptionEn = settingsMap.hero_description_en?.en;
    loadedSettings.heroDescriptionTr = settingsMap.hero_description_tr?.tr;
    
    // About Page Settings
    loadedSettings.aboutPageTitleAr = settingsMap.about_page_title?.ar;
    loadedSettings.aboutPageTitleEn = settingsMap.about_page_title?.en;
    loadedSettings.aboutPageTitleTr = settingsMap.about_page_title?.tr;
    loadedSettings.aboutPageSubtitleAr = settingsMap.about_page_subtitle?.ar;
    loadedSettings.aboutPageSubtitleEn = settingsMap.about_page_subtitle?.en;
    loadedSettings.aboutPageSubtitleTr = settingsMap.about_page_subtitle?.tr;
    loadedSettings.aboutMissionTitleAr = settingsMap.about_mission_title?.ar;
    loadedSettings.aboutMissionTitleEn = settingsMap.about_mission_title?.en;
    loadedSettings.aboutMissionTitleTr = settingsMap.about_mission_title?.tr;
    loadedSettings.aboutMissionTextAr = settingsMap.about_mission_text?.ar;
    loadedSettings.aboutMissionTextEn = settingsMap.about_mission_text?.en;
    loadedSettings.aboutMissionTextTr = settingsMap.about_mission_text?.tr;
    loadedSettings.aboutVisionTitleAr = settingsMap.about_vision_title?.ar;
    loadedSettings.aboutVisionTitleEn = settingsMap.about_vision_title?.en;
    loadedSettings.aboutVisionTitleTr = settingsMap.about_vision_title?.tr;
    loadedSettings.aboutVisionTextAr = settingsMap.about_vision_text?.ar;
    loadedSettings.aboutVisionTextEn = settingsMap.about_vision_text?.en;
    loadedSettings.aboutVisionTextTr = settingsMap.about_vision_text?.tr;
    loadedSettings.aboutTeamTitleAr = settingsMap.about_team_title?.ar;
    loadedSettings.aboutTeamTitleEn = settingsMap.about_team_title?.en;
    loadedSettings.aboutTeamTitleTr = settingsMap.about_team_title?.tr;
    loadedSettings.aboutTeamTextAr = settingsMap.about_team_text?.ar;
    loadedSettings.aboutTeamTextEn = settingsMap.about_team_text?.en;
    loadedSettings.aboutTeamTextTr = settingsMap.about_team_text?.tr;
    loadedSettings.aboutTeamMembers = settingsMap.about_team_members?.en;

    // 404 Page Settings
    loadedSettings.notFoundTitleAr = settingsMap.not_found_title?.ar;
    loadedSettings.notFoundTitleEn = settingsMap.not_found_title?.en;
    loadedSettings.notFoundTitleTr = settingsMap.not_found_title?.tr;
    loadedSettings.notFoundDescAr = settingsMap.not_found_desc?.ar;
    loadedSettings.notFoundDescEn = settingsMap.not_found_desc?.en;
    loadedSettings.notFoundDescTr = settingsMap.not_found_desc?.tr;
    loadedSettings.notFoundButtonAr = settingsMap.not_found_button?.ar;
    loadedSettings.notFoundButtonEn = settingsMap.not_found_button?.en;
    loadedSettings.notFoundButtonTr = settingsMap.not_found_button?.tr;
    loadedSettings.notFoundSvgAr = settingsMap.not_found_svg?.ar;
    loadedSettings.notFoundSvgEn = settingsMap.not_found_svg?.en;
    loadedSettings.notFoundSvgTr = settingsMap.not_found_svg?.tr;

    // Suspension Messages
    loadedSettings.suspensionTitleAr = settingsMap.suspension_title_ar?.ar;
    loadedSettings.suspensionTitleEn = settingsMap.suspension_title_en?.en;
    loadedSettings.suspensionTitleTr = settingsMap.suspension_title_tr?.tr;
    loadedSettings.suspensionMessageAr = settingsMap.suspension_message_ar?.ar;
    loadedSettings.suspensionMessageEn = settingsMap.suspension_message_en?.en;
    loadedSettings.suspensionMessageTr = settingsMap.suspension_message_tr?.tr;
    
    // Favicon
    loadedSettings.faviconUrl = settingsMap.favicon_url?.en;
  }
  return loadedSettings;
};

export const saveSiteSettingsToDB = async (settings: SiteSettings) => {
  const settingsToSave = [
    { key: 'site_name', value_ar: settings.siteNameAr, value_en: settings.siteNameEn, value_tr: settings.siteNameTr },
    { key: 'site_description', value_ar: settings.siteDescriptionAr, value_en: settings.siteDescriptionEn, value_tr: settings.siteDescriptionTr },
    { key: 'support_email', value_ar: settings.supportEmail, value_en: settings.supportEmail, value_tr: settings.supportEmail },
    { key: 'max_properties', value_ar: settings.maxProperties, value_en: settings.maxProperties, value_tr: settings.maxProperties },
    { key: 'registration_enabled', value_ar: settings.registrationEnabled.toString(), value_en: settings.registrationEnabled.toString(), value_tr: settings.registrationEnabled.toString() },
    { key: 'maintenance_mode', value_ar: settings.maintenanceMode.toString(), value_en: settings.maintenanceMode.toString(), value_tr: settings.maintenanceMode.toString() },
    { key: 'brand_accent_color', value_ar: settings.brandAccentColor, value_en: settings.brandAccentColor, value_tr: settings.brandAccentColor },
    { key: 'gradient_from_color', value_ar: settings.gradientFromColor, value_en: settings.gradientFromColor, value_tr: settings.gradientFromColor },
    { key: 'gradient_to_color', value_ar: settings.gradientToColor, value_en: settings.gradientToColor, value_tr: settings.gradientToColor },
    { key: 'facebook_url', value_ar: settings.facebookUrl || '', value_en: settings.facebookUrl || '', value_tr: settings.facebookUrl || '' },
    { key: 'instagram_url', value_ar: settings.instagramUrl || '', value_en: settings.instagramUrl || '', value_tr: settings.instagramUrl || '' },
    { key: 'twitter_url', value_ar: settings.twitterUrl || '', value_en: settings.twitterUrl || '', value_tr: settings.twitterUrl || '' },
    { key: 'youtube_url', value_ar: settings.youtubeUrl || '', value_en: settings.youtubeUrl || '', value_tr: settings.youtubeUrl || '' },
    { key: 'whatsapp_link', value_ar: settings.whatsappLink || '', value_en: settings.whatsappLink || '', value_tr: settings.whatsappLink || '' },
    { key: 'linkedin_url', value_ar: settings.linkedinUrl || '', value_en: settings.linkedinUrl || '', value_tr: settings.linkedinUrl || '' },
    { key: 'tiktok_url', value_ar: settings.tiktokUrl || '', value_en: settings.tiktokUrl || '', value_tr: settings.tiktokUrl || '' },
    { key: 'snapchat_url', value_ar: settings.snapchatUrl || '', value_en: settings.snapchatUrl || '', value_tr: settings.snapchatUrl || '' },
    { key: 'pinterest_url', value_ar: settings.pinterestUrl || '', value_en: settings.pinterestUrl || '', value_tr: settings.pinterestUrl || '' },
    
    { key: 'address', value_ar: settings.address || '', value_en: settings.address || '', value_tr: settings.address || '' },
    { key: 'address_ar', value_ar: settings.addressAr || '', value_en: settings.addressAr || '', value_tr: settings.addressAr || '' },
    { key: 'address_en', value_ar: settings.addressEn || '', value_en: settings.addressEn || '', value_tr: settings.addressEn || '' },
    { key: 'address_tr', value_ar: settings.addressTr || '', value_en: settings.addressTr || '', value_tr: settings.addressTr || '' },
    { key: 'phone_number', value_ar: settings.phoneNumber || '', value_en: settings.phoneNumber || '', value_tr: settings.phoneNumber || '' },
    { key: 'phone_number_ar', value_ar: settings.phoneNumberAr || '', value_en: settings.phoneNumberAr || '', value_tr: settings.phoneNumberAr || '' },
    { key: 'phone_number_en', value_ar: settings.phoneNumberEn || '', value_en: settings.phoneNumberEn || '', value_tr: settings.phoneNumberEn || '' },
    { key: 'phone_number_tr', value_ar: settings.phoneNumberTr || '', value_en: settings.phoneNumberTr || '', value_tr: settings.phoneNumberTr || '' },
    { key: 'site_email_address', value_ar: settings.siteEmailAddress || '', value_en: settings.siteEmailAddress || '', value_tr: settings.siteEmailAddress || '' },
    { key: 'site_email_address_ar', value_ar: settings.siteEmailAddressAr || '', value_en: settings.siteEmailAddressAr || '', value_tr: settings.siteEmailAddressAr || '' },
    { key: 'site_email_address_en', value_ar: settings.siteEmailAddressEn || '', value_en: settings.siteEmailAddressEn || '', value_tr: settings.siteEmailAddressEn || '' },
    { key: 'site_email_address_tr', value_ar: settings.siteEmailAddressTr || '', value_en: settings.siteEmailAddressTr || '', value_tr: settings.siteEmailAddressTr || '' },
    { key: 'contact_address_enabled', value_ar: (settings.contactAddressEnabled ? 'true' : 'false'), value_en: (settings.contactAddressEnabled ? 'true' : 'false'), value_tr: (settings.contactAddressEnabled ? 'true' : 'false') },
    { key: 'contact_phone_enabled', value_ar: (settings.contactPhoneEnabled ? 'true' : 'false'), value_en: (settings.contactPhoneEnabled ? 'true' : 'false'), value_tr: (settings.contactPhoneEnabled ? 'true' : 'false') },
    { key: 'contact_email_enabled', value_ar: (settings.contactEmailEnabled ? 'true' : 'false'), value_en: (settings.contactEmailEnabled ? 'true' : 'false'), value_tr: (settings.contactEmailEnabled ? 'true' : 'false') },
    
    // Announcement Bar
    { key: 'announcement_bar_enabled', value_ar: (settings.announcementBarEnabled ?? false).toString(), value_en: (settings.announcementBarEnabled ?? false).toString(), value_tr: (settings.announcementBarEnabled ?? false).toString() },
    { key: 'announcement_bar_text', value_ar: settings.announcementBarTextAr || '', value_en: settings.announcementBarTextEn || '', value_tr: settings.announcementBarTextTr || '' },
    { key: 'announcement_bar_link', value_ar: settings.announcementBarLink || '', value_en: settings.announcementBarLink || '', value_tr: settings.announcementBarLink || '' },
    
    { key: 'about_page_title', value_ar: settings.aboutPageTitleAr || '', value_en: settings.aboutPageTitleEn || '', value_tr: settings.aboutPageTitleTr || '' },
    { key: 'about_page_subtitle', value_ar: settings.aboutPageSubtitleAr || '', value_en: settings.aboutPageSubtitleEn || '', value_tr: settings.aboutPageSubtitleTr || '' },
    { key: 'about_mission_title', value_ar: settings.aboutMissionTitleAr || '', value_en: settings.aboutMissionTitleEn || '', value_tr: settings.aboutMissionTitleTr || '' },
    { key: 'about_mission_text', value_ar: settings.aboutMissionTextAr || '', value_en: settings.aboutMissionTextEn || '', value_tr: settings.aboutMissionTextTr || '' },
    { key: 'about_vision_title', value_ar: settings.aboutVisionTitleAr || '', value_en: settings.aboutVisionTitleEn || '', value_tr: settings.aboutVisionTitleTr || '' },
    { key: 'about_vision_text', value_ar: settings.aboutVisionTextAr || '', value_en: settings.aboutVisionTextEn || '', value_tr: settings.aboutVisionTextTr || '' },
    { key: 'about_team_title', value_ar: settings.aboutTeamTitleAr || '', value_en: settings.aboutTeamTitleEn || '', value_tr: settings.aboutTeamTitleTr || '' },
    { key: 'about_team_text', value_ar: settings.aboutTeamTextAr || '', value_en: settings.aboutTeamTextEn || '', value_tr: settings.aboutTeamTextTr || '' },
    { key: 'about_team_members', value_ar: settings.aboutTeamMembers || '[]', value_en: settings.aboutTeamMembers || '[]', value_tr: settings.aboutTeamMembers || '[]' },

    // HeroSection Title & Description
    { key: 'hero_title_ar', value_ar: settings.heroTitleAr || '', value_en: settings.heroTitleAr || '', value_tr: settings.heroTitleAr || '' },
    { key: 'hero_title_en', value_ar: settings.heroTitleEn || '', value_en: settings.heroTitleEn || '', value_tr: settings.heroTitleEn || '' },
    { key: 'hero_title_tr', value_ar: settings.heroTitleTr || '', value_en: settings.heroTitleTr || '', value_tr: settings.heroTitleTr || '' },
    { key: 'hero_description_ar', value_ar: settings.heroDescriptionAr || '', value_en: settings.heroDescriptionAr || '', value_tr: settings.heroDescriptionAr || '' },
    { key: 'hero_description_en', value_ar: settings.heroDescriptionEn || '', value_en: settings.heroDescriptionEn || '', value_tr: settings.heroDescriptionEn || '' },
    { key: 'hero_description_tr', value_ar: settings.heroDescriptionTr || '', value_en: settings.heroDescriptionTr || '', value_tr: settings.heroDescriptionTr || '' },
    
    // 404 Page Settings
    { key: 'not_found_title', value_ar: settings.notFoundTitleAr || '', value_en: settings.notFoundTitleEn || '', value_tr: settings.notFoundTitleTr || '' },
    { key: 'not_found_desc', value_ar: settings.notFoundDescAr || '', value_en: settings.notFoundDescEn || '', value_tr: settings.notFoundDescTr || '' },
    { key: 'not_found_button', value_ar: settings.notFoundButtonAr || '', value_en: settings.notFoundButtonEn || '', value_tr: settings.notFoundButtonTr || '' },
    { key: 'not_found_svg', value_ar: settings.notFoundSvgAr || '', value_en: settings.notFoundSvgEn || '', value_tr: settings.notFoundSvgTr || '' },

    // Suspension Messages
    { key: 'suspension_title_ar', value_ar: settings.suspensionTitleAr || '', value_en: settings.suspensionTitleAr || '', value_tr: settings.suspensionTitleAr || '' },
    { key: 'suspension_title_en', value_ar: settings.suspensionTitleEn || '', value_en: settings.suspensionTitleEn || '', value_tr: settings.suspensionTitleEn || '' },
    { key: 'suspension_title_tr', value_ar: settings.suspensionTitleTr || '', value_en: settings.suspensionTitleTr || '', value_tr: settings.suspensionTitleTr || '' },
    { key: 'suspension_message_ar', value_ar: settings.suspensionMessageAr || '', value_en: settings.suspensionMessageAr || '', value_tr: settings.suspensionMessageAr || '' },
    { key: 'suspension_message_en', value_ar: settings.suspensionMessageEn || '', value_en: settings.suspensionMessageEn || '', value_tr: settings.suspensionMessageEn || '' },
    { key: 'suspension_message_tr', value_ar: settings.suspensionMessageTr || '', value_en: settings.suspensionMessageTr || '', value_tr: settings.suspensionMessageTr || '' },
  
    // Favicon
    { key: 'favicon_url', value_ar: settings.faviconUrl || '', value_en: settings.faviconUrl || '', value_tr: settings.faviconUrl || '' },
  ];

  for (const setting of settingsToSave) {
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        setting_key: setting.key,
        setting_value_ar: setting.value_ar,
        setting_value_en: setting.value_en,
        setting_value_tr: setting.value_tr
      }, {
        onConflict: 'setting_key'
      });

    if (error) {
      console.error('Error saving setting to DB:', setting.key, error);
      throw error;
    }
  }
};
