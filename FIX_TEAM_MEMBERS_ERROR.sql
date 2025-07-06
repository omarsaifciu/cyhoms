-- Fix Team Members Error in About Page Management
-- This SQL will add default team members data to prevent the parsing error

-- Insert or update the about_team_members setting with proper JSON data
INSERT INTO public.site_settings (setting_key, setting_value_ar, setting_value_en, setting_value_tr)
VALUES (
    'about_team_members',
    '[
        {
            "id": "1",
            "name_ar": "أحمد علي",
            "name_en": "Ahmed Ali", 
            "name_tr": "Ahmet Ali",
            "role_ar": "المدير التنفيذي",
            "role_en": "CEO",
            "role_tr": "CEO",
            "avatar": "/placeholder.svg"
        },
        {
            "id": "2", 
            "name_ar": "فاطمة خان",
            "name_en": "Fatima Khan",
            "name_tr": "Fatma Han",
            "role_ar": "مديرة التسويق", 
            "role_en": "Marketing Director",
            "role_tr": "Pazarlama Direktörü",
            "avatar": "/placeholder.svg"
        },
        {
            "id": "3",
            "name_ar": "جان سميث", 
            "name_en": "John Smith",
            "name_tr": "John Smith",
            "role_ar": "كبير المطورين",
            "role_en": "Lead Developer", 
            "role_tr": "Baş Geliştirici",
            "avatar": "/placeholder.svg"
        }
    ]',
    '[
        {
            "id": "1",
            "name_ar": "أحمد علي",
            "name_en": "Ahmed Ali", 
            "name_tr": "Ahmet Ali",
            "role_ar": "المدير التنفيذي",
            "role_en": "CEO",
            "role_tr": "CEO",
            "avatar": "/placeholder.svg"
        },
        {
            "id": "2", 
            "name_ar": "فاطمة خان",
            "name_en": "Fatima Khan",
            "name_tr": "Fatma Han",
            "role_ar": "مديرة التسويق", 
            "role_en": "Marketing Director",
            "role_tr": "Pazarlama Direktörü",
            "avatar": "/placeholder.svg"
        },
        {
            "id": "3",
            "name_ar": "جان سميث", 
            "name_en": "John Smith",
            "name_tr": "John Smith",
            "role_ar": "كبير المطورين",
            "role_en": "Lead Developer", 
            "role_tr": "Baş Geliştirici",
            "avatar": "/placeholder.svg"
        }
    ]',
    '[
        {
            "id": "1",
            "name_ar": "أحمد علي",
            "name_en": "Ahmed Ali", 
            "name_tr": "Ahmet Ali",
            "role_ar": "المدير التنفيذي",
            "role_en": "CEO",
            "role_tr": "CEO",
            "avatar": "/placeholder.svg"
        },
        {
            "id": "2", 
            "name_ar": "فاطمة خان",
            "name_en": "Fatima Khan",
            "name_tr": "Fatma Han",
            "role_ar": "مديرة التسويق", 
            "role_en": "Marketing Director",
            "role_tr": "Pazarlama Direktörü",
            "avatar": "/placeholder.svg"
        },
        {
            "id": "3",
            "name_ar": "جان سميث", 
            "name_en": "John Smith",
            "name_tr": "John Smith",
            "role_ar": "كبير المطورين",
            "role_en": "Lead Developer", 
            "role_tr": "Baş Geliştirici",
            "avatar": "/placeholder.svg"
        }
    ]'
)
ON CONFLICT (setting_key) 
DO UPDATE SET 
    setting_value_ar = EXCLUDED.setting_value_ar,
    setting_value_en = EXCLUDED.setting_value_en,
    setting_value_tr = EXCLUDED.setting_value_tr,
    updated_at = NOW();

-- Verify the data was inserted correctly
SELECT setting_key, setting_value_en FROM public.site_settings WHERE setting_key = 'about_team_members';
